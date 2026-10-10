import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Award,
  CheckCircle,
  Clock,
  Sparkles,
  TrendingUp,
  Target,
  AlertTriangle,
  PlayCircle,
  Briefcase,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { interviewService } from '../services/interviewService.js';
import { StatCard } from '../components/StatCard.jsx';
import { InterviewCard } from '../components/InterviewCard.jsx';
import { LoadingSpinner } from '../components/LoadingSpinner.jsx';
import { EmptyState } from '../components/EmptyState.jsx';
import { ErrorMessage } from '../components/ErrorMessage.jsx';
import { Button } from '../components/Button.jsx';

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await interviewService.getDashboardStats();
      if (res.success && res.stats) {
        setStats(res.stats);
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Fetching your interview statistics..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchStats} />;
  }

  const {
    totalCompleted = 0,
    averageScore = 0,
    totalQuestionsAnswered = 0,
    inProgressCount = 0,
    scoreTrends = [],
    strongestSkills = [],
    weakestSkills = [],
    recommendedSession = null,
    recentSessions = [],
  } = stats || {};

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Welcome Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '36px',
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.08) 100%)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '24px',
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '20px',
              background: 'rgba(139, 92, 246, 0.2)',
              color: '#c4b5fd',
              fontSize: '0.8rem',
              fontWeight: 600,
              marginBottom: '12px',
            }}
          >
            <Sparkles size={14} />
            <span>AI Interview Readiness Hub</span>
          </div>

          <h1 style={{ fontSize: '2.2rem', marginBottom: '8px' }}>
            Welcome back, <span className="gradient-text-accent">{user?.name || 'Candidate'}</span>
          </h1>

          <p style={{ maxWidth: '600px', fontSize: '0.95rem', color: '#cbd5e1' }}>
            {totalCompleted > 0
              ? `You've completed ${totalCompleted} mock interviews with an average score of ${averageScore}/100. Keep sharpening your technical communication.`
              : 'Configure your first role-specific AI mock interview to build speaking confidence and master technical questions.'}
          </p>
        </div>

        <Link to="/setup" className="btn btn-primary btn-lg" style={{ padding: '14px 28px' }}>
          <PlayCircle size={20} />
          Start New Interview
        </Link>
      </div>

      {/* Metrics Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
        }}
      >
        <StatCard
          title="Completed Interviews"
          value={totalCompleted}
          icon={<CheckCircle size={24} />}
          color="purple"
          trend={totalCompleted > 0 ? `${totalCompleted} Sessions Done` : 'Ready to begin'}
        />

        <StatCard
          title="Average AI Score"
          value={totalCompleted > 0 ? `${averageScore}%` : 'N/A'}
          icon={<Award size={24} />}
          color={averageScore >= 80 ? 'emerald' : averageScore >= 60 ? 'cyan' : 'amber'}
          trend={
            averageScore >= 80
              ? 'Excellent Mastery'
              : averageScore >= 60
              ? 'Solid Foundation'
              : 'Target >= 75%'
          }
        />

        <StatCard
          title="Questions Answered"
          value={totalQuestionsAnswered}
          icon={<Layers size={24} />}
          color="cyan"
          trend="Real Spoken / Typed"
        />

        <StatCard
          title="In-Progress Sessions"
          value={inProgressCount}
          icon={<Clock size={24} />}
          color="amber"
          trend={inProgressCount > 0 ? 'Resume available' : 'All clear'}
        />
      </div>

      {/* Performance Trends & Insights Grid */}
      {totalCompleted > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
          }}
        >
          {/* Trend Chart / Cards */}
          <div className="glass-panel" style={{ padding: '28px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={20} color="var(--accent-primary)" />
                <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>Performance History</h3>
              </div>
              <span className="badge badge-primary">Recent Sessions</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {scoreTrends.map((session, idx) => (
                <div
                  key={session.id || idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f8fafc' }}>
                      {session.role}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {new Date(session.date).toLocaleDateString()}
                    </div>
                  </div>

                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: '1rem',
                      color:
                        session.score >= 80
                          ? '#10b981'
                          : session.score >= 60
                          ? '#06b6d4'
                          : '#f59e0b',
                    }}
                  >
                    {session.score}/100
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skill Mastery (Strongest vs Weakest) */}
          <div className="glass-panel" style={{ padding: '28px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '20px',
              }}
            >
              <Target size={20} color="var(--accent-cyan)" />
              <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>Skill Topic Mastery</h3>
            </div>

            {/* Strongest Skills */}
            <div style={{ marginBottom: '20px' }}>
              <div
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: '#10b981',
                  letterSpacing: '0.05em',
                  marginBottom: '10px',
                }}
              >
                Top Strengths
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {strongestSkills.length > 0 ? (
                  strongestSkills.map((s, idx) => (
                    <span key={idx} className="badge badge-success" style={{ fontSize: '0.8rem' }}>
                      {s.topic} ({s.averageScore}%)
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    Complete more questions to analyze.
                  </span>
                )}
              </div>
            </div>

            {/* Weakest Skills */}
            {weakestSkills.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <div
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: '#f59e0b',
                    letterSpacing: '0.05em',
                    marginBottom: '10px',
                  }}
                >
                  Growth Focus Areas
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {weakestSkills.map((w, idx) => (
                    <span key={idx} className="badge badge-warning" style={{ fontSize: '0.8rem' }}>
                      {w.topic} ({w.averageScore}%)
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Session Box */}
            {recommendedSession && (
              <div
                style={{
                  padding: '16px',
                  background: 'rgba(139, 92, 246, 0.1)',
                  border: '1px solid rgba(139, 92, 246, 0.25)',
                  borderRadius: '12px',
                  marginTop: '16px',
                }}
              >
                <div style={{ fontSize: '0.8rem', color: '#c4b5fd', fontWeight: 600, marginBottom: 4 }}>
                  RECOMMENDED NEXT DRILL
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: 8 }}>
                  {recommendedSession.role} ({recommendedSession.difficulty})
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/setup')}
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%', fontSize: '0.8rem' }}
                >
                  Launch Suggested Drill <ArrowRight size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      ) : null}

      {/* Recent Interviews Section */}
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Briefcase size={22} color="var(--accent-primary)" />
            <h2 style={{ fontSize: '1.5rem', color: '#fff' }}>Recent Interviews</h2>
          </div>

          {recentSessions.length > 0 && (
            <Link to="/history" className="btn btn-ghost btn-sm">
              View All History <ArrowRight size={14} />
            </Link>
          )}
        </div>

        {recentSessions.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {recentSessions.map((interview) => (
              <InterviewCard
                key={interview._id}
                interview={interview}
                onDelete={null}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Briefcase size={32} />}
            title="No Interview Sessions Yet"
            description="Start your first realistic voice mock interview now. Experience instant AI evaluation and speaking practice."
            actionText="Launch First Interview"
            actionLink="/setup"
          />
        )}
      </div>
    </div>
  );
};
