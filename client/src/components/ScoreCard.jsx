import React from 'react';
import { Target, CheckCircle, MessageSquare, Layers } from 'lucide-react';

export const ScoreCard = ({
  score = 0,
  relevanceScore = 0,
  correctnessScore = 0,
  clarityScore = 0,
  completenessScore = 0,
  size = 180,
  strokeWidth = 12,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const validScore = Math.max(0, Math.min(100, Math.round(score || 0)));
  const offset = circumference - (validScore / 100) * circumference;

  let strokeColor = '#ef4444';
  let badgeLabel = 'Needs Practice';
  if (validScore >= 80) {
    strokeColor = '#10b981';
    badgeLabel = 'Excellent Performance';
  } else if (validScore >= 65) {
    strokeColor = '#06b6d4';
    badgeLabel = 'Strong Candidate';
  } else if (validScore >= 50) {
    strokeColor = '#f59e0b';
    badgeLabel = 'Developing Skills';
  }

  const dimensions = [
    { label: 'Relevance', value: relevanceScore || validScore, icon: <Target size={15} color="#38bdf8" /> },
    { label: 'Correctness', value: correctnessScore || validScore, icon: <CheckCircle size={15} color="#10b981" /> },
    { label: 'Clarity', value: clarityScore || validScore, icon: <MessageSquare size={15} color="#c084fc" /> },
    { label: 'Completeness', value: completenessScore || validScore, icon: <Layers size={15} color="#f59e0b" /> },
  ];

  return (
    <div
      className="glass-panel"
      style={{
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
      }}
    >
      {/* Circular Gauge */}
      <div className="score-gauge-wrapper" style={{ width: size, height: size }}>
        <svg className="score-gauge-svg" width={size} height={size}>
          <circle
            className="score-gauge-bg"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
          />
          <circle
            className="score-gauge-fill"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            stroke={strokeColor}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>

        <div className="score-gauge-text">
          <div className="score-gauge-number">{validScore}</div>
          <div className="score-gauge-sub">Out of 100</div>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <span
          className="badge"
          style={{
            background: `${strokeColor}20`,
            border: `1px solid ${strokeColor}50`,
            color: strokeColor,
            fontSize: '0.85rem',
            padding: '6px 14px',
          }}
        >
          {badgeLabel}
        </span>
      </div>

      {/* 4 Dimension Breakdown Bars */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {dimensions.map((dim) => (
          <div key={dim.label}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '4px',
                fontSize: '0.85rem',
                color: '#cbd5e1',
                fontWeight: 500,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {dim.icon}
                <span>{dim.label}</span>
              </div>
              <span style={{ fontWeight: 700, color: '#fff' }}>{Math.round(dim.value)}%</span>
            </div>

            <div
              style={{
                width: '100%',
                height: '6px',
                background: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '4px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${Math.max(0, Math.min(100, dim.value))}%`,
                  height: '100%',
                  background:
                    dim.value >= 80
                      ? 'linear-gradient(90deg, #10b981, #34d399)'
                      : dim.value >= 60
                      ? 'linear-gradient(90deg, #8b5cf6, #06b6d4)'
                      : 'linear-gradient(90deg, #f59e0b, #ef4444)',
                  borderRadius: '4px',
                  transition: 'width 0.8s ease-out',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
