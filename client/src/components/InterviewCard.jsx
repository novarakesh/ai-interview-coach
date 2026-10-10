import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Calendar,
  Clock,
  ChevronRight,
  Sparkles,
  Award,
  Play,
  Trash2,
} from 'lucide-react';

export const InterviewCard = ({
  interview,
  onDelete = null,
  showActions = true,
}) => {
  const navigate = useNavigate();

  const isCompleted = interview.status === 'completed';
  const formattedDate = new Date(interview.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const getDifficultyBadge = (diff) => {
    switch (diff) {
      case 'Beginner':
        return <span className="badge badge-cyan">Beginner</span>;
      case 'Advanced':
        return <span className="badge badge-danger">Advanced</span>;
      default:
        return <span className="badge badge-primary">Intermediate</span>;
    }
  };

  const getScoreBadge = (score) => {
    if (score === null || score === undefined) return null;
    let color = '#ef4444';
    let bg = 'rgba(239, 68, 68, 0.15)';
    if (score >= 80) {
      color = '#10b981';
      bg = 'rgba(16, 185, 129, 0.15)';
    } else if (score >= 60) {
      color = '#f59e0b';
      bg = 'rgba(245, 158, 11, 0.15)';
    }

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          borderRadius: '12px',
          background: bg,
          border: `1px solid ${color}40`,
          color,
          fontWeight: 700,
          fontSize: '0.95rem',
        }}
      >
        <Award size={16} />
        <span>{score}/100</span>
      </div>
    );
  };

  const handleClick = () => {
    if (isCompleted) {
      navigate(`/results/${interview._id}`);
    } else {
      navigate(`/room/${interview._id}`);
    }
  };

  return (
    <div
      className="glass-panel glass-panel-glow interview-card"
      onClick={handleClick}
    >
      <div className="interview-card-info">
        <div className="interview-role-icon">
          <Briefcase size={22} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h4 style={{ fontSize: '1.1rem', color: '#fff' }}>{interview.role}</h4>
            {getDifficultyBadge(interview.difficulty)}
            <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
              {interview.interviewType}
            </span>
          </div>
          <div className="interview-meta">
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
              }}
            >
              <Calendar size={13} />
              {formattedDate}
            </span>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
              }}
            >
              <Clock size={13} />
              {interview.answers?.length || 0} / {interview.totalQuestions} Questions
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {isCompleted ? (
          getScoreBadge(interview.overallScore)
        ) : (
          <span className="badge badge-warning" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Play size={10} fill="#f59e0b" />
            In Progress
          </span>
        )}

        {showActions && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {onDelete && (
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(interview._id);
                }}
                style={{ color: '#ef4444' }}
                title="Delete Interview"
              >
                <Trash2 size={16} />
              </button>
            )}
            <div style={{ color: 'var(--text-muted)' }}>
              <ChevronRight size={18} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
