'use client';

interface NodeConfigPanelProps {
  node: any;
  onClose: () => void;
  onUpdate: (nodeId: string, updates: Record<string, any>) => void;
  onDelete: (nodeId: string) => void;
}

export default function NodeConfigPanel({ node, onClose, onUpdate, onDelete }: NodeConfigPanelProps) {
  if (!node) return null;

  const isAgent = node.type === 'agentCore';

  return (
    <div className="config-panel">
      <div className="config-header">
        <span>{node.data.label}</span>
        <button onClick={onClose} className="config-close">✕</button>
      </div>

      <div className="config-body">
        <div className="config-section">
          <label>Status</label>
          <select
            value={node.data.status || 'active'}
            onChange={(e) => onUpdate(node.id, { status: e.target.value })}
            className="config-select"
          >
            <option value="active">🔵 Active</option>
            <option value="processing">🟡 Processing</option>
            <option value="error">🔴 Error</option>
            <option value="inactive">⚫ Inactive</option>
          </select>
        </div>

        {isAgent && (
          <div className="config-section">
            <label>Model</label>
            <select className="config-select" defaultValue={node.data.model}>
              <option>gpt-4o</option>
              <option>gpt-4o-mini</option>
              <option>claude-3.5-sonnet</option>
              <option>google/gemini-2.0-flash-001</option>
            </select>
          </div>
        )}

        {!isAgent && (
          <div className="config-section">
            <label>API Key (optional)</label>
            <input
              type="password"
              placeholder="sk-..."
              className="config-input"
            />
          </div>
        )}

        {!isAgent && (
          <button
            onClick={() => onDelete(node.id)}
            className="config-delete-btn"
          >
            Disconnect Skill
          </button>
        )}
      </div>
    </div>
  );
}
