'use client';
import { useState, useEffect, useCallback } from 'react';

export interface CanvasSkillNode {
  id: string;
  skill_id: string;
  position_x: number;
  position_y: number;
  config: Record<string, any>;
  status: 'active' | 'processing' | 'error' | 'inactive';
  skills: {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: string;
  };
}

export function useCanvasData(agentId: string) {
  const [agent, setAgent] = useState<any>(null);
  const [canvasNodes, setCanvasNodes] = useState<CanvasSkillNode[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCanvas = useCallback(async () => {
    if (!agentId) return;
    const res = await fetch(`/api/agents/${agentId}/canvas`);
    if (res.ok) {
      const data = await res.json();
      setAgent(data.agent);
      setCanvasNodes(data.canvasNodes);
    }
    setLoading(false);
  }, [agentId]);

  useEffect(() => { fetchCanvas(); }, [fetchCanvas]);

  const addNode = async (skillId: string, x: number, y: number) => {
    const res = await fetch(`/api/agents/${agentId}/canvas/nodes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skillId, positionX: x, positionY: y }),
    });
    if (res.ok) {
      const node = await res.json();
      setCanvasNodes(prev => [...prev, node]);
      return node;
    }
    return null;
  };

  const updateNode = async (nodeId: string, updates: Record<string, any>) => {
    await fetch(`/api/agents/${agentId}/canvas/nodes/${nodeId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
  };

  const removeNode = async (nodeId: string) => {
    await fetch(`/api/agents/${agentId}/canvas/nodes/${nodeId}`, {
      method: 'DELETE',
    });
    setCanvasNodes(prev => prev.filter(n => n.id !== nodeId));
  };

  return { agent, canvasNodes, loading, addNode, updateNode, removeNode, refetch: fetchCanvas };
}
