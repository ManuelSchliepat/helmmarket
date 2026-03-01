'use client';
import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';

function AgentCoreNode({ data }: NodeProps) {
  return (
    <div className="agent-core-node">
      <Handle type="target" position={Position.Left} className="handle-glow" />
      <div className="node-header">
        <span className="node-icon">🤖</span>
        <span className="node-title">{data.label as string}</span>
      </div>
      <div className="node-subtitle">{data.model as string || 'GPT-4o'}</div>
      <div className={`status-badge status-${(data.status as string) || 'active'}`}>
        {(data.status as string) || 'active'}
      </div>
      <Handle type="source" position={Position.Right} className="handle-glow" />
      <Handle type="target" position={Position.Top} className="handle-glow" />
      <Handle type="source" position={Position.Bottom} className="handle-glow" />
    </div>
  );
}

export default memo(AgentCoreNode);
