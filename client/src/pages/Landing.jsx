import React from 'react';
import { Link } from 'react-router-dom';
import {
  Mic,
  Sparkles,
  Bot,
  Volume2,
  Award,
  BarChart3,
  CheckCircle2,
  Layers,
  ArrowRight,
  Code2,
  Terminal,
  Cpu,
  Database,
  Users,
  PlayCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export const Landing = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <Volume2 size={24} color="#8b5cf6" />,
      title: 'Murf AI Natural Speech',
      description:
        'Experience human-like, high-fidelity conversational audio questions powered by Murf AI FALCON text-to-speech engine.',
    },
    {
      icon: <Sparkles size={24} color="#06b6d4" />,
      title: 'Gemini Multi-Metric Scoring',
      description:
        'Instant multi-dimensional evaluation across Relevance, Correctness, Clarity, and Completeness with strengths and missing concepts.',
    },
    {
      icon: <Mic size={24} color="#10b981" />,
      title: 'Voice & Text Dual Input',
      description:
        'Answer naturally using browser speech recognition with real-time transcription, or refine your thoughts directly in the editable text editor.',
    },
    {
      icon: <BarChart3 size={24} color="#f59e0b" />,
      title: 'Actionable Performance Insights',
      description:
        'Track your skill progression over time, pinpoint weak technical topics, and receive tailored practice recommendations.',
    },
  ];

  const roles = [
    { name: 'MERN Stack Developer', icon: <Layers size={20} />, count: '250+ Scenarios' },
    { name: 'Frontend Developer', icon: <Code2 size={20} />, count: '300+ Scenarios' },
    { name: 'Java Developer', icon: <Terminal size={20} />, count: '200+ Scenarios' },
    { name: 'Python Developer', icon: <Cpu size={20} />, count: '220+ Scenarios' },
    { name: 'Data Analyst', icon: <Database size={20} />, count: '180+ Scenarios' },
    { name: 'HR & Behavioral', icon: <Users size={20} />, count: '150+ Scenarios' },
  ];

  const steps = [
    {
      step: '01',
      title: 'Configure Your Session',
      description: 'Choose your target role, difficulty level (Beginner to Advanced), question count, and interviewer voice.',
    },
    {
      step: '02',
      title: 'Listen to AI Voice Questions',
      description: 'Your AI interviewer dynamically synthesizes contextual technical questions using Murf natural audio.',
    },
    {
      step: '03',
      title: 'Speak or Type Your Answer',
      description: 'Record your answer with live voice transcription, or use the typed answer fallback to articulate trade-offs.',
    },
    {
      step: '04',
      title: 'Get Deep AI Feedback',
      description: 'Receive instant scoring, missing concepts, model answers, and a synthesized final hiring manager report.',
    },
  ];

  return (
    <div className="main-content">
      {/* Hero Section */}
      <section style={{ padding: '80px 0 60px', position: 'relative' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div
            className="animate-fade-in"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '9999px',
              background: 'rgba(139, 92, 246, 0.12)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              color: '#c4b5fd',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '24px',
            }}
          >
            <Sparkles size={16} />
            <span>Next-Gen MERN + Gemini 2.5 + Murf AI Interview Platform</span>
          </div>

          <h1
            className="animate-fade-in"
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              maxWidth: '900px',
              margin: '0 auto 20px',
              lineHeight: 1.15,
            }}
          >
            Ace Every Tech Interview with{' '}
            <span className="gradient-text-accent">Real-Time AI Voice</span> Coaching
          </h1>

          <p
            className="animate-fade-in"
            style={{
              fontSize: '1.2rem',
              maxWidth: '720px',
              margin: '0 auto 36px',
              color: 'var(--text-secondary)',
            }}
          >
            Practice role-specific mock interviews with ultra-realistic spoken voice questions,
            speech-to-text answers, and rigorous multi-dimensional AI evaluation.
          </p>

          <div
            className="animate-fade-in"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              flexWrap: 'wrap',
              marginBottom: '60px',
            }}
          >
            <Link
              to={isAuthenticated ? '/setup' : '/register'}
              className="btn btn-primary btn-lg"
              style={{ fontSize: '1.05rem', padding: '14px 32px' }}
            >
              <PlayCircle size={20} />
              Start Practicing Free
            </Link>

            <a
              href="#features"
              className="btn btn-secondary btn-lg"
              style={{ fontSize: '1.05rem', padding: '14px 28px' }}
            >
              Explore Features
            </a>
          </div>

          {/* Interactive Hero Preview Mockup */}
          <div
            className="glass-panel animate-fade-in"
            style={{
              maxWidth: '960px',
              margin: '0 auto',
              padding: '32px',
              textAlign: 'left',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(139, 92, 246, 0.15)',
              position: 'relative',
            }}
          >
            {/* Top Bar Mock */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '16px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                marginBottom: '24px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }}
                />
                <span
                  style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }}
                />
                <span
                  style={{ width: 12, height: 12, borderRadius: '50%', background: '#10b981' }}
                />
                <span
                  style={{
                    fontSize: '0.8rem',
                    color: '#64748b',
                    marginLeft: '8px',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  LIVE SESSION: MERN STACK (QUESTION 2 OF 5)
                </span>
              </div>

              <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>
                Murf Audio Active
              </span>
            </div>

            {/* Question Box */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '20px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '10px',
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                  }}
                >
                  <Bot size={18} />
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f8fafc' }}>
                  AI Interviewer (Namrita - FALCON)
                </span>
              </div>
              <p style={{ fontSize: '1.15rem', color: '#fff', fontWeight: 500, lineHeight: 1.4 }}>
                "How do you handle JWT authentication with HttpOnly cookies in a MERN stack app to mitigate XSS and CSRF attacks?"
              </p>
            </div>

            {/* Answer & Live Metrics Mockup Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '16px',
              }}
            >
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  padding: '18px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <div
                  style={{
                    fontSize: '0.8rem',
                    color: '#94a3b8',
                    textTransform: 'uppercase',
                    marginBottom: '8px',
                    fontWeight: 600,
                  }}
                >
                  Candidate Voice Transcript
                </div>
                <p style={{ fontSize: '0.95rem', color: '#e2e8f0', lineHeight: 1.5 }}>
                  "We store the JWT in an HttpOnly, SameSite cookie so JavaScript cannot access it, preventing XSS theft. For CSRF, we employ SameSite=Lax or double-submit CSRF tokens..."
                </p>
              </div>

              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.08)',
                  padding: '18px',
                  borderRadius: '12px',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '8px',
                  }}
                >
                  <span style={{ fontSize: '0.8rem', color: '#6ee7b7', fontWeight: 700 }}>
                    GEMINI AI EVALUATION
                  </span>
                  <span
                    style={{
                      background: '#10b981',
                      color: '#022c22',
                      padding: '2px 8px',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                    }}
                  >
                    92/100
                  </span>
                </div>
                <div style={{ fontSize: '0.88rem', color: '#d1fae5', lineHeight: 1.4 }}>
                  ✓ Correctly detailed HttpOnly cookie security model.
                  <br />
                  ✓ Addressed both XSS and CSRF mitigations accurately.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: '80px 0', background: 'rgba(13, 20, 36, 0.4)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <span className="badge badge-primary" style={{ marginBottom: '12px' }}>
              Core Features
            </span>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>
              Built for Real Technical & Behavioral Interview Success
            </h2>
            <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.05rem' }}>
              Everything you need to practice, iterate, and sharpen your spoken interview answers with AI.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px',
            }}
          >
            {features.map((f, i) => (
              <div key={i} className="glass-panel glass-panel-glow" style={{ padding: '32px 24px' }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                  }}
                >
                  {f.icon}
                </div>
                <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '10px' }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: '0.92rem', lineHeight: 1.6 }}>{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Roles Grid */}
      <section id="roles" style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span className="badge badge-cyan" style={{ marginBottom: '12px' }}>
              Domain Specializations
            </span>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>
              Customized for Industry Roles
            </h2>
            <p style={{ maxWidth: '600px', margin: '0 auto' }}>
              Tailored question banks dynamically generated for your target career path.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '20px',
            }}
          >
            {roles.map((r, i) => (
              <div
                key={i}
                className="glass-panel glass-panel-glow"
                style={{
                  padding: '24px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: 'rgba(139, 92, 246, 0.15)',
                    color: '#c4b5fd',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {r.icon}
                </div>
                <h4 style={{ fontSize: '1rem', color: '#fff' }}>{r.name}</h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.count}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" style={{ padding: '80px 0', background: 'rgba(13, 20, 36, 0.4)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <span className="badge badge-primary" style={{ marginBottom: '12px' }}>
              4-Step Workflow
            </span>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>How It Works</h2>
            <p style={{ maxWidth: '600px', margin: '0 auto' }}>
              From initial session setup to comprehensive post-interview synthesis in minutes.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '24px',
            }}
          >
            {steps.map((s, i) => (
              <div
                key={i}
                className="glass-panel"
                style={{ padding: '32px 24px', position: 'relative' }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '2.5rem',
                    fontWeight: 800,
                    color: 'rgba(139, 92, 246, 0.25)',
                    marginBottom: '8px',
                  }}
                >
                  {s.step}
                </div>
                <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '10px' }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div
            className="glass-panel"
            style={{
              padding: '60px 32px',
              textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(6, 182, 212, 0.15) 100%)',
              border: '1px solid rgba(139, 92, 246, 0.4)',
              borderRadius: '24px',
            }}
          >
            <h2 style={{ fontSize: '2.5rem', color: '#fff', marginBottom: '16px' }}>
              Ready to Level Up Your Interview Skills?
            </h2>
            <p
              style={{
                maxWidth: '600px',
                margin: '0 auto 32px',
                fontSize: '1.1rem',
                color: '#cbd5e1',
              }}
            >
              Start a full mock interview now. Experience natural spoken voice questions and immediate AI feedback.
            </p>
            <Link
              to={isAuthenticated ? '/setup' : '/register'}
              className="btn btn-primary btn-lg"
              style={{ padding: '16px 36px', fontSize: '1.1rem' }}
            >
              <Sparkles size={20} />
              Launch Mock Interview
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-color)',
          padding: '40px 0',
          background: 'rgba(8, 12, 21, 0.95)',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="brand-icon-box" style={{ width: 32, height: 32 }}>
              <Mic size={18} />
            </div>
            <span style={{ fontWeight: 700, color: '#fff' }}>NovaCoach AI</span>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} AI Voice Interview Coach • Final Year Portfolio Project
          </p>

          <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem' }}>
            <span style={{ color: '#64748b' }}>Powered by Google Gemini & Murf AI</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
