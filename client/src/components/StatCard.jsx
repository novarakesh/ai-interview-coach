import React from 'react';

export const StatCard = ({
  title,
  value,
  icon,
  trend,
  trendPositive = true,
  color = 'purple',
}) => {
  const colorMap = {
    purple: {
      bg: 'rgba(139, 92, 246, 0.12)',
      border: 'rgba(139, 92, 246, 0.3)',
      text: '#c4b5fd',
    },
    cyan: {
      bg: 'rgba(6, 182, 212, 0.12)',
      border: 'rgba(6, 182, 212, 0.3)',
      text: '#67e8f9',
    },
    emerald: {
      bg: 'rgba(16, 185, 129, 0.12)',
      border: 'rgba(16, 185, 129, 0.3)',
      text: '#6ee7b7',
    },
    amber: {
      bg: 'rgba(245, 158, 11, 0.12)',
      border: 'rgba(245, 158, 11, 0.3)',
      text: '#fcd34d',
    },
  };

  const activeColor = colorMap[color] || colorMap.purple;

  return (
    <div className="glass-panel glass-panel-glow stat-card">
      <div>
        <div className="stat-label">{title}</div>
        <div className="stat-value">{value}</div>
        {trend && (
          <div
            className="stat-trend"
            style={{ color: trendPositive ? 'var(--color-success)' : 'var(--color-warning)' }}
          >
            {trend}
          </div>
        )}
      </div>
      <div
        className="stat-icon-wrapper"
        style={{
          background: activeColor.bg,
          border: `1px solid ${activeColor.border}`,
          color: activeColor.text,
        }}
      >
        {icon}
      </div>
    </div>
  );
};
