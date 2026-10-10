import React from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle } from 'lucide-react';

export const EmptyState = ({
  icon = null,
  title = 'No Data Found',
  description = 'You have not started any interview sessions yet.',
  actionText = 'Start First Interview',
  actionLink = '/setup',
  onAction = null,
}) => {
  return (
    <div
      className="glass-panel"
      style={{
        padding: '48px 24px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        margin: '20px 0',
      }}
    >
      {icon && (
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'rgba(139, 92, 246, 0.15)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            color: '#a78bfa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </div>
      )}

      <h3 style={{ fontSize: '1.25rem', color: '#fff' }}>{title}</h3>
      <p style={{ maxWidth: 420, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
        {description}
      </p>

      {actionText && (
        <div style={{ marginTop: '8px' }}>
          {onAction ? (
            <button type="button" onClick={onAction} className="btn btn-primary">
              <PlayCircle size={18} />
              {actionText}
            </button>
          ) : (
            <Link to={actionLink} className="btn btn-primary">
              <PlayCircle size={18} />
              {actionText}
            </Link>
          )}
        </div>
      )}
    </div>
  );
};
