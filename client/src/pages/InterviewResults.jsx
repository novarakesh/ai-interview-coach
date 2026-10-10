import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Award,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  LayoutDashboard,
  Printer,
  Layers,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { interviewService } from '../services/interviewService.js';
import { ScoreCard } from '../components/ScoreCard.jsx';
import { LoadingSpinner } from '../components/LoadingSpinner.jsx';
import { ErrorMessage } from '../components/ErrorMessage.jsx';
import { Button } from '../components/Button.jsx';

export const InterviewResults = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedQuestion, setExpandedQuestion] = useState(0); // Accordion index

  useEffect(() => {
    const fetchInterview = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await interviewService.getInterviewById(id);
        if (res.success && res.interview) {
          setInterview(res.interview);
        } else {
          throw new Error(res.message || 'Session not found');
        }
      } catch (err) {
        setError(err.message || 'Failed to load interview results.');
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [id]);

  if (loading) {
    return <LoadingSpinner text="Generating your final interview performance report..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;
  }

  if (!interview) return null;

  const {
    role,
    interviewType,
    difficulty,
    overallScore = 0,
    averageRelevance = 0,
    averageCorrectness = 0,
    averageClarity = 0,
    averageCompleteness = 0,
    summaryStrengths = [],
    summaryWeaknesses = [],
    practiceRecommendations = [],
    overallFeedback = '',
    questions = [],
    answers = [],
    evaluationResults = [],
    createdAt,
  } = interview;

  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1080px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Top Header Card */}
      <div
        className="glass-panel"
        style={{
          padding: '36px',
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          borderRadius: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '24px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span className="badge badge-primary">{role}</span>
            <span className="badge badge-cyan">{difficulty}</span>
            <span className="badge badge-success">{interviewType}</span>
          </div>

          <h1 style={{ fontSize: '2.4rem', marginBottom: '8px' }}>
            Interview Performance Report
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>
            Completed on {formattedDate} • {questions.length} Questions Evaluated by Gemini AI
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => window.print()}
            className="btn btn-secondary"
            title="Print or Save PDF"
          >
            <Printer size={16} />
            Print Report
          </button>
          <Link to="/setup" className="btn btn-primary">
            <RotateCcw size={16} />
            Practice Again
          </Link>
        </div>
      </div>

      {/* Main Score & Macro Evaluation Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '28px',
        }}
      >
        {/* Left: Overall Circular Score Gauge */}
        <ScoreCard
          score={overallScore}
          relevanceScore={averageRelevance}
          correctnessScore={averageCorrectness}
          clarityScore={averageClarity}
          completenessScore={averageCompleteness}
        />

        {/* Right: Macro Synthesis & Practice Areas */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Executive Summary Feedback */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Sparkles size={20} color="var(--accent-primary)" />
              <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>Executive Evaluation</h3>
            </div>
            <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.6 }}>
              {overallFeedback || 'Strong overall interview performance across standard questions.'}
            </p>
          </div>

          {/* Key Macro Strengths */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <CheckCircle size={20} color="#10b981" />
              <h3 style={{ fontSize: '1.15rem', color: '#fff' }}>Macro Strengths</h3>
            </div>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', color: '#cbd5e1' }}>
              {summaryStrengths.map((st, i) => (
                <li key={i}>{st}</li>
              ))}
            </ul>
          </div>

          {/* Growth & Practice Recommendations */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <BookOpen size={20} color="var(--accent-cyan)" />
              <h3 style={{ fontSize: '1.15rem', color: '#fff' }}>Tailored Practice Roadmap</h3>
            </div>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', color: '#cbd5e1' }}>
              {practiceRecommendations.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Question-by-Question Deep Dive Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Layers size={22} color="var(--accent-primary)" />
          <h2 style={{ fontSize: '1.6rem', color: '#fff' }}>Detailed Question Breakdown</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {questions.map((q, idx) => {
            const ans = answers.find((a) => a.questionNumber === q.questionNumber);
            const ev = evaluationResults.find((e) => e.questionNumber === q.questionNumber) || {};
            const isExpanded = expandedQuestion === idx;

            return (
              <div
                key={idx}
                className="glass-panel"
                style={{
                  overflow: 'hidden',
                  border: isExpanded
                    ? '1px solid rgba(139, 92, 246, 0.4)'
                    : '1px solid var(--border-color)',
                }}
              >
                {/* Accordion Header */}
                <div
                  onClick={() => setExpandedQuestion(isExpanded ? null : idx)}
                  style={{
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    background: isExpanded ? 'rgba(255, 255, 255, 0.03)' : 'transparent',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: 'rgba(139, 92, 246, 0.2)',
                        color: '#c4b5fd',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                      }}
                    >
                      {idx + 1}
                    </div>

                    <div>
                      <div style={{ fontSize: '1rem', fontWeight: 600, color: '#fff' }}>
                        {q.questionText}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
                        Topic: {q.topic}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span
                      style={{
                        fontWeight: 800,
                        fontSize: '1rem',
                        color:
                          ev.score >= 80
                            ? '#10b981'
                            : ev.score >= 60
                            ? '#06b6d4'
                            : '#f59e0b',
                      }}
                    >
                      {ev.score || 0}/100
                    </span>

                    {isExpanded ? <ChevronUp size={20} color="#94a3b8" /> : <ChevronDown size={20} color="#94a3b8" />}
                  </div>
                </div>

                {/* Accordion Content */}
                {isExpanded && (
                  <div style={{ padding: '24px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Candidate Answer */}
                    <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>
                        Your Recorded Answer
                      </div>
                      <p style={{ color: '#e2e8f0', fontSize: '0.95rem', lineHeight: 1.6 }}>
                        "{ans?.candidateAnswer || 'No response provided.'}"
                      </p>
                    </div>

                    {/* AI Feedback */}
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: '6px' }}>
                        AI Feedback & Assessment
                      </div>
                      <p style={{ color: '#cbd5e1', fontSize: '0.92rem', lineHeight: 1.5 }}>
                        {ev.feedback}
                      </p>
                    </div>

                    {/* Strengths & Missing Concepts */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                      <div style={{ background: 'rgba(16, 185, 129, 0.06)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', marginBottom: '6px' }}>
                          What You Did Well
                        </div>
                        <ul style={{ paddingLeft: '18px', fontSize: '0.85rem', color: '#d1fae5', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {(ev.strengths || []).map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </div>

                      <div style={{ background: 'rgba(245, 158, 11, 0.06)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', marginBottom: '6px' }}>
                          Missing Concepts / Suggestions
                        </div>
                        <ul style={{ paddingLeft: '18px', fontSize: '0.85rem', color: '#fef3c7', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {(ev.improvementAreas || []).map((imp, i) => (
                            <li key={i}>{imp}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Suggested Exemplar Answer */}
                    {ev.suggestedAnswer && (
                      <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: '#c4b5fd', textTransform: 'uppercase', marginBottom: '6px' }}>
                          <Sparkles size={14} />
                          Exemplar High-Scoring Response
                        </div>
                        <p style={{ color: '#fff', fontSize: '0.92rem', lineHeight: 1.6 }}>
                          "{ev.suggestedAnswer}"
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 0' }}>
        <Link to="/dashboard" className="btn btn-secondary">
          <LayoutDashboard size={16} />
          Return to Dashboard
        </Link>
        <Link to="/setup" className="btn btn-primary">
          Start Next Practice Session <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};
