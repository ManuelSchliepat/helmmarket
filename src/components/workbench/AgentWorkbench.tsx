'use client';
import { useCallback, useMemo, useState } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Controls,
  Background,
  BackgroundVariant,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  type Connection,
  type Node,
  type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import AgentCoreNode from './AgentCoreNode';
import SkillNode from './SkillNode';
import SkillArsenal from './SkillArsenal';
import NodeConfigPanel from './NodeConfigPanel';
import { DnDProvider, useDnD } from './DnDContext';
import { useCanvasData, type CanvasSkillNode } from './useCanvasData';
import './workbench.css';

// CRITICAL: Define nodeTypes OUTSIDE the component to prevent re-renders
const nodeTypes = {
  agentCore: AgentCoreNode,
  skill: SkillNode,
};

function buildNodesAndEdges(agent: any, canvasNodes: CanvasSkillNode[]) {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  if (!agent) return { nodes, edges };

  // Agent is always the center node
  nodes.push({
    id: `agent-${agent.id}`,
    type: 'agentCore',
    position: { x: 400, y: 300 },
    data: {
      label: agent.name,
      model: agent.model_id || 'gpt-4o',
      status: 'active',
    },
    draggable: true,
    deletable: false, // Agent node can't be removed
  });

  // Each connected skill becomes a node
  canvasNodes.forEach((cn) => {
    const skillNodeId = `skill-${cn.id}`;

    nodes.push({
      id: skillNodeId,
      type: 'skill',
      position: { x: cn.position_x, y: cn.position_y },
      data: {
        label: cn.skills.name,
        icon: cn.skills.icon,
        category: cn.skills.category,
        status: cn.status,
        canvasNodeId: cn.id,      // DB id for API calls
        skillId: cn.skills.id,
      },
    });

    edges.push({
      id: `edge-${cn.id}`,
      source: `agent-${agent.id}`,
      target: skillNodeId,
      animated: true,
      style: { stroke: '#00d4ff', strokeWidth: 2 },
    });
  });

  return { nodes, edges };
}

// Debounce helper for saving positions
let saveTimeout: ReturnType<typeof setTimeout>;
function debouncedSave(fn: () => void, delay = 800) {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(fn, delay);
}

function WorkbenchInner({ agentId }: { agentId: string }) {
  const { agent, canvasNodes, loading, addNode, updateNode, removeNode } = useCanvasData(agentId);
  const { screenToFlowPosition } = useReactFlow();
  const [dragType] = useDnD();
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => buildNodesAndEdges(agent, canvasNodes),
    [agent, canvasNodes]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Sync when data loads
  useMemo(() => {
    if (initialNodes.length > 0) {
      setNodes(initialNodes);
      setEdges(initialEdges);
    }
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#00d4ff', strokeWidth: 2 } }, eds)),
    [setEdges]
  );

  // Save position when node is dragged on canvas
  const onNodeDragStop = useCallback(
    (_: any, node: Node) => {
      if (node.type === 'skill' && node.data.canvasNodeId) {
        debouncedSave(() => {
          updateNode(node.data.canvasNodeId as string, {
            positionX: node.position.x,
            positionY: node.position.y,
          });
        });
      }
    },
    [updateNode]
  );

  // Click node → open config panel
  const onNodeClick = useCallback((_: any, node: Node) => {
    setSelectedNode(node);
  }, []);

  // DROP from arsenal → create node
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    async (event: React.DragEvent) => {
      event.preventDefault();

      const skillDataStr = event.dataTransfer.getData('application/helmskill');
      if (!skillDataStr) return;

      const skill = JSON.parse(skillDataStr);
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      // Save to DB
      const saved = await addNode(skill.id, position.x, position.y);
      if (!saved) return;

      // Add to canvas
      const newNodeId = `skill-${saved.id}`;
      const newNode: Node = {
        id: newNodeId,
        type: 'skill',
        position,
        data: {
          label: skill.name,
          icon: skill.icon,
          category: skill.category,
          status: 'active',
          canvasNodeId: saved.id,
          skillId: skill.id,
        },
      };
      setNodes((nds) => [...nds, newNode]);
      setEdges((eds) => [
        ...eds,
        {
          id: `edge-${saved.id}`,
          source: `agent-${agentId}`,
          target: newNodeId,
          animated: true,
          style: { stroke: '#00d4ff', strokeWidth: 2 },
        },
      ]);
    },
    [screenToFlowPosition, addNode, agentId, setNodes, setEdges]
  );

  // Config panel actions
  const handleConfigUpdate = async (nodeId: string, updates: Record<string, any>) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node?.data.canvasNodeId) {
      await updateNode(node.data.canvasNodeId as string, updates);
      // Update local state to reflect change immediately
      setNodes(nds => nds.map(n => n.id === nodeId ? { ...n, data: { ...n.data, ...updates } } : n));
    }
  };

  const handleConfigDelete = async (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node?.data.canvasNodeId) {
      await removeNode(node.data.canvasNodeId as string);
      setNodes(nds => nds.filter(n => n.id !== nodeId));
      setEdges(eds => eds.filter(e => e.source !== nodeId && e.target !== nodeId));
      setSelectedNode(null);
    }
  };

  if (loading) {
    return <div className="workbench-loading">Loading Workbench...</div>;
  }

  const connectedSkillIds = canvasNodes.map(cn => cn.skill_id);

  return (
    <div className="workbench-layout">
      {/* CANVAS — top 70% */}
      <div className="workbench-canvas">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onNodeDragStop={onNodeDragStop}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
          proOptions={{ hideAttribution: true }}
        >
          <Controls className="flow-controls" />
          <Background variant={BackgroundVariant.Dots} color="#1a1a3e" gap={20} />
          <MiniMap
            nodeColor={(n) => {
              if (n.type === 'agentCore') return '#00d4ff';
              if (n.data.status === 'error') return '#ff4444';
              if (n.data.status === 'processing') return '#ffd700';
              return '#00d4ff';
            }}
            maskColor="rgba(10, 10, 26, 0.8)"
            style={{ background: '#0d0d24' }}
          />
        </ReactFlow>
      </div>

      {/* ARSENAL — bottom 30% */}
      <SkillArsenal connectedSkillIds={connectedSkillIds} />

      {/* CONFIG PANEL — right sidebar, shown on click */}
      {selectedNode && (
        <NodeConfigPanel
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
          onUpdate={handleConfigUpdate}
          onDelete={handleConfigDelete}
        />
      )}
    </div>
  );
}

// EXPORT: Wrapped in providers
export default function AgentWorkbench({ agentId }: { agentId: string }) {
  return (
    <ReactFlowProvider>
      <DnDProvider>
        <WorkbenchInner agentId={agentId} />
      </DnDProvider>
    </ReactFlowProvider>
  );
}
