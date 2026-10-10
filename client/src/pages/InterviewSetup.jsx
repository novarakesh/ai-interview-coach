import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Layers,
  Sparkles,
  Sliders,
  Volume2,
  Check,
  ArrowRight,
  Shield,
  Clock,
  Code2,
  Terminal,
  Cpu,
  Database,
  Users,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { interviewService } from '../services/interviewService.js';
import { Button } from '../components/Button.jsx';
import { Select } from '../components/Select.jsx';

export const InterviewSetup = () => {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [role, setRole] = useState(user?.preferences?.defaultRole || 'MERN Stack Developer');
  const [interviewType, setInterviewType] = useState(user?.preferences?.defaultInterviewType || 'Technical');
  const [difficulty, setDifficulty] = useState(user?.preferences?.defaultDifficulty || 'Intermediate');
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [voiceId, setVoiceId] = useState(user?.preferences?.voiceId || 'Namrita');
  const [language, setLanguage] = useState(user?.preferences?.preferredLanguage || 'en-US');
  const [loading, setLoading] = useState(false);

  const roles = [
    { id: 'MERN Stack Developer', icon: <Layers size={18} />, desc: 'React, Node, Express, MongoDB, State & APIs' },
    { id: 'Frontend Developer', icon: <Code2 size={18} />, desc: 'JavaScript, React, CSS Architecture, DOM & Web APIs' },
    { id: 'Java Developer', icon: <Terminal size={18} />, desc: 'Core Java, Spring Boot, OOP, Multithreading & Microservices' },
    { id: 'Python Developer', icon: <Cpu size={18} />, desc: 'Python, Django/FastAPI, Data Structures, Algorithms' },
    { id: 'Data Analyst', icon: <Database size={18} />, desc: 'SQL, Python/Pandas, Statistical Analysis, Reporting' },
    { id: 'HR Interview', icon: <Users size={18} />, desc: 'Behavioral, Leadership, Conflict Resolution & Culture Fit' },
  ];

  const types = [
    { id: 'Technical', label: 'Technical Depth', desc: 'Coding patterns, architecture, algorithms, and system trade-offs.' },
    { id: 'Behavioral', label: 'Behavioral & STAR', desc: 'Past projects, leadership, conflict resolution, and impact.' },
    { id: 'HR', label: 'HR Screening', desc: 'Career background, motivation, salary expectations, and fit.' },
    { id: 'Mixed', label: 'Mixed Comprehensive', desc: 'Combination of technical deep-dives and behavioral questions.' },
  ];

  const difficulties = [
    { id: 'Beginner', label: 'Junior / Intern', color: '#06b6d4', desc: 'Core fundamentals, syntax, and foundational definitions.' },
    { id: 'Intermediate', label: 'Mid-Level', color: '#8b5cf6', desc: 'Applied architecture, debugging, edge cases, and best practices.' },
    { id: 'Advanced', label: 'Senior / Staff', color: '#ef4444', desc: 'High-scale system design, failure scenarios, and performance optimization.' },
  ];

  const voices = [
    { value: 'Namrita', label: 'Namrita (Indian English - Professional)' },
    { value: 'en-US-marcus', label: 'Marcus (US English - Confident Male)' },
    { value: 'en-US-alicia', label: 'Alicia (US English - Warm Female)' },
  ];

  const handleStartInterview = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      toast.info('Generating your personalized AI interview session with Gemini & Murf...');
      const res = await interviewService.createInterview({
        role,
        interviewType,
        difficulty,
        totalQuestions,
        voiceId,
        language,
      });

      if (res.success && res.interview?._id) {
        toast.success('Interview initialized! Entering interview room...');
        navigate(`/room/${res.interview._id}`);
      } else {
        throw new Error(res.message || 'Failed to create interview');
      }
    } catch (err) {
      console.error('Setup error:', err);
      toast.error(err.message || 'Failed to start interview.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            borderRadius: '20px',
            background: 'rgba(139, 92, 246, 0.15)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            color: '#c4b5fd',
            fontSize: '0.8rem',
            fontWeight: 600,
            marginBottom: '12px',
          }}
        >
          <Sliders size={14} />
          <span>Session Configurator</span>
        </div>

        <h1 style={{ fontSize: '2.4rem', marginBottom: '8px' }}>
          Configure Your Mock Interview
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
          Customize your role, difficulty, question volume, and AI voice before beginning.
        </p>
      </div>

      <form onSubmit={handleStartInterview}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
          {/* Left Column: Role & Type Selection */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {/* Target Job Role */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <label className="form-label" style={{ marginBottom: '16px', fontSize: '0.95rem' }}>
                <span style={{ color: '#fff', fontWeight: 600 }}>1. Target Role</span>
                <span style={{ color: 'var(--accent-primary)', fontSize: '0.8rem' }}>{role}</span>
              </label>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {roles.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => setRole(r.id)}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '12px',
                      background: role === r.id ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                      border: `1px solid ${role === r.id ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.06)'}`,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          color: role === r.id ? 'var(--accent-primary)' : 'var(--text-muted)',
                        }}
                      >
                        {r.icon}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff' }}>
                          {r.id}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{r.desc}</div>
                      </div>
                    </div>

                    {role === r.id && (
                      <div
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: '50%',
                          background: 'var(--accent-primary)',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Check size={14} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Interview Type */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <label className="form-label" style={{ marginBottom: '16px', fontSize: '0.95rem' }}>
                <span style={{ color: '#fff', fontWeight: 600 }}>2. Interview Style</span>
                <span style={{ color: 'var(--accent-cyan)', fontSize: '0.8rem' }}>{interviewType}</span>
              </label>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                  gap: '10px',
                }}
              >
                {types.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => setInterviewType(t.id)}
                    style={{
                      padding: '14px',
                      borderRadius: '12px',
                      background:
                        interviewType === t.id
                          ? 'rgba(6, 182, 212, 0.15)'
                          : 'rgba(255, 255, 255, 0.03)',
                      border: `1px solid ${
                        interviewType === t.id ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.06)'
                      }`,
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff', marginBottom: 4 }}>
                      {t.label}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', lineHeight: 1.3 }}>
                      {t.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Difficulty, Voice, Question Count & Summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {/* Difficulty Level */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <label className="form-label" style={{ marginBottom: '16px', fontSize: '0.95rem' }}>
                <span style={{ color: '#fff', fontWeight: 600 }}>3. Difficulty Level</span>
                <span style={{ color: '#f59e0b', fontSize: '0.8rem' }}>{difficulty}</span>
              </label>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {difficulties.map((d) => (
                  <div
                    key={d.id}
                    onClick={() => setDifficulty(d.id)}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '12px',
                      background:
                        difficulty === d.id ? `${d.color}20` : 'rgba(255, 255, 255, 0.03)',
                      border: `1px solid ${difficulty === d.id ? d.color : 'rgba(255, 255, 255, 0.06)'}`,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff' }}>
                        {d.label}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{d.desc}</div>
                    </div>

                    {difficulty === d.id && (
                      <div
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: '50%',
                          background: d.color,
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Check size={14} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Questions count & Voice Picker */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <label className="form-label" style={{ marginBottom: '16px', fontSize: '0.95rem' }}>
                <span style={{ color: '#fff', fontWeight: 600 }}>4. Voice & Question Count</span>
              </label>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '8px' }}>
                  Number of Questions:
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {[3, 5, 7].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setTotalQuestions(num)}
                      className={`btn ${totalQuestions === num ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ flex: 1, padding: '10px 0' }}
                    >
                      {num} Questions
                    </button>
                  ))}
                </div>
              </div>

              <Select
                label="Interviewer Voice (Murf TTS FALCON)"
                options={voices}
                value={voiceId}
                onChange={(e) => setVoiceId(e.target.value)}
              />
            </div>

            {/* Live Summary & Launch Button */}
            <div
              className="glass-panel"
              style={{
                padding: '24px',
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(6, 182, 212, 0.15) 100%)',
                border: '1px solid rgba(139, 92, 246, 0.4)',
              }}
            >
              <h4 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '12px' }}>
                Ready to Start?
              </h4>
              <div style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '20px' }}>
                You are about to enter a <strong>{totalQuestions}-question {difficulty}</strong> level{' '}
                <strong>{role}</strong> interview ({interviewType} format).
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                style={{ width: '100%', padding: '14px', fontSize: '1.05rem' }}
              >
                <Sparkles size={18} />
                Launch Live Interview Room <ArrowRight size={18} />
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
