'use client';
import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';

function SkillNode({ data }: NodeProps) {
  const statusClass = `node-glow-${(data.status as string) || 'active'}`;

  return (
    <div className={`skill-node ${statusClass}`}>
      <Handle type="target" position={Position.Left} className="handle-glow" />
      <div className="node-header">
        <span className="node-icon">{(data.icon as string) || '⚡'}</span>
        <span className="node-title">{data.label as string}</span>
      </div>
      {data.category && (
        <div className="node-category">{data.category as string}</div>
      )}
      <div className={`status-dot status-${(data.status as string) || 'active'}`} />
      <Handle type="source" position={Position.Right} className="handle-glow" />
    </div>
  );
}

export default memo(SkillNode);
