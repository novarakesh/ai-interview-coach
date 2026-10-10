import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Send,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  LogOut,
  HelpCircle,
  Award,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useToast } from '../context/ToastContext.jsx';
import { interviewService } from '../services/interviewService.js';
import { QuestionPanel } from '../components/QuestionPanel.jsx';
import { MicrophoneControls } from '../components/MicrophoneControls.jsx';
import { ProgressIndicator } from '../components/ProgressIndicator.jsx';
import { LoadingSpinner } from '../components/LoadingSpinner.jsx';
import { ErrorMessage } from '../components/ErrorMessage.jsx';
import { ConfirmationModal } from '../components/ConfirmationModal.jsx';
import { Button } from '../components/Button.jsx';

export const InterviewRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [nextLoading, setNextLoading] = useState(false);
  const [error, setError] = useState(null);

  // Candidate Answer State
  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [currentEvaluation, setCurrentEvaluation] = useState(null);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showModelAnswer, setShowModelAnswer] = useState(false);

  // Fetch Interview Session
  const loadInterview = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await interviewService.getInterviewById(id);
      if (res.success && res.interview) {
        setInterview(res.interview);

        // If completed, redirect to results
        if (res.interview.status === 'completed') {
          navigate(`/results/${res.interview._id}`, { replace: true });
          return;
        }

        // Check if current question has already been evaluated
        const curIdx = res.interview.currentQuestionIndex || 0;
        const curQ = res.interview.questions[curIdx];
        if (curQ) {
          const existingEval = (res.interview.evaluationResults || []).find(
            (e) => e.questionNumber === curQ.questionNumber
          );
          const existingAns = (res.interview.answers || []).find(
            (a) => a.questionNumber === curQ.questionNumber
          );

          if (existingEval) {
            setCurrentEvaluation(existingEval);
          } else {
            setCurrentEvaluation(null);
          }

          if (existingAns) {
            setCandidateAnswer(existingAns.candidateAnswer);
          } else {
            setCandidateAnswer('');
          }
        }
      } else {
        throw new Error(res.message || 'Session not found');
      }
    } catch (err) {
      setError(err.message || 'Failed to load interview room.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInterview();
  }, [id]);

  // Submit Candidate Answer for Gemini AI Evaluation
  const handleSubmitAnswer = async () => {
    if (!candidateAnswer.trim()) {
      toast.warning('Please speak or type an answer before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      toast.info('Gemini AI is analyzing and scoring your response...');
      const res = await interviewService.submitAnswer(id, {
        candidateAnswer: candidateAnswer.trim(),
        durationSeconds: 0,
      });

      if (res.success && res.evaluation) {
        setCurrentEvaluation(res.evaluation);
        setInterview(res.interview);
        toast.success(`Answer evaluated! Score: ${res.evaluation.score}/100`);
      }
    } catch (err) {
      console.error('Submit answer error:', err);
      toast.error(err.message || 'Failed to evaluate answer. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Move to Next Question or Finalize
  const handleNextQuestion = async () => {
    const isLastQuestion =
      interview.currentQuestionIndex + 1 >= interview.totalQuestions;

    if (isLastQuestion) {
      // Finalize Interview
      setNextLoading(true);
      try {
        toast.info('Finalizing interview and synthesizing comprehensive performance report...');
        const res = await interviewService.finishInterview(id);
        if (res.success) {
          toast.success('Interview complete! Redirecting to full report...');
          navigate(`/results/${id}`, { replace: true });
        }
      } catch (err) {
        toast.error(err.message || 'Failed to finish interview.');
      } finally {
        setNextLoading(false);
      }
      return;
    }

    // Generate / Retrieve Next Question
    setNextLoading(true);
    try {
      toast.info('Interviewer preparing next dynamic question...');
      const res = await interviewService.getNextQuestion(id);
      if (res.success) {
        setInterview(res.interview);
        setCurrentEvaluation(null);
        setCandidateAnswer('');
        setShowModelAnswer(false);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to load next question.');
    } finally {
      setNextLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Setting up your live AI interview room..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadInterview} />;
  }

  if (!interview) return null;

  const currentIdx = interview.currentQuestionIndex || 0;
  const currentQuestion = interview.questions[currentIdx] || {
    questionNumber: currentIdx + 1,
    questionText: 'Generating next question...',
    topic: 'Technical Core',
    difficulty: interview.difficulty,
  };

  const isAnswerEvaluated = !!currentEvaluation;
  const isLastQuestion = currentIdx + 1 >= interview.totalQuestions;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Header Bar */}
      <div
        className="glass-panel"
        style={{
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="badge badge-primary">{interview.role}</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>•</span>
          <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
            {interview.interviewType} Interview
          </span>
        </div>

        <button
          type="button"
          onClick={() => setShowExitModal(true)}
          className="btn btn-ghost btn-sm"
          style={{ color: '#fca5a5' }}
        >
          <LogOut size={16} />
          Exit Room
        </button>
      </div>

      {/* Question Progress Stepper */}
      <ProgressIndicator
        currentIndex={currentIdx}
        totalQuestions={interview.totalQuestions}
        answeredCount={interview.answers?.length || 0}
      />

      {/* Question Panel */}
      <QuestionPanel
        questionNumber={currentQuestion.questionNumber}
        totalQuestions={interview.totalQuestions}
        questionText={currentQuestion.questionText}
        topic={currentQuestion.topic}
        difficulty={currentQuestion.difficulty}
        voiceId={interview.voiceId || 'Namrita'}
      />

      {/* Answer Workspace */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="var(--accent-cyan)" />
            <h3 style={{ fontSize: '1.15rem', color: '#fff' }}>Your Answer</h3>
          </div>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            {candidateAnswer ? `${candidateAnswer.split(/\s+/).filter(Boolean).length} words` : 'Awaiting input'}
          </span>
        </div>

        {/* Microphone Voice Recorder */}
        {!isAnswerEvaluated && (
          <MicrophoneControls
            answerText={candidateAnswer}
            setAnswerText={setCandidateAnswer}
            disabled={submitting}
          />
        )}

        {/* Editable Transcript Text Area */}
        <div className="form-group" style={{ marginTop: '16px' }}>
          <textarea
            className="form-textarea"
            rows={5}
            placeholder="Your spoken transcript will appear here automatically. You can also type or edit your response directly before submitting..."
            value={candidateAnswer}
            onChange={(e) => setCandidateAnswer(e.target.value)}
            disabled={isAnswerEvaluated || submitting}
            style={{
              fontSize: '1rem',
              lineHeight: 1.6,
              background: isAnswerEvaluated ? 'rgba(15, 23, 42, 0.4)' : 'rgba(15, 23, 42, 0.8)',
            }}
          />
        </div>

        {/* Submit & Next Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '16px', marginTop: '12px' }}>
          {!isAnswerEvaluated ? (
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={handleSubmitAnswer}
              loading={submitting}
              disabled={!candidateAnswer.trim()}
            >
              <Send size={18} />
              Submit Answer for AI Scoring
            </Button>
          ) : (
            <Button
              type="button"
              variant="cyan"
              size="lg"
              onClick={handleNextQuestion}
              loading={nextLoading}
            >
              {isLastQuestion ? (
                <>
                  <Award size={18} />
                  Finish & View Final Report
                </>
              ) : (
                <>
                  Next Question <ArrowRight size={18} />
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Real-Time Evaluation Feedback Card */}
      {currentEvaluation && (
        <div
          className="glass-panel animate-fade-in"
          style={{
            padding: '28px',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            background: 'rgba(16, 185, 129, 0.05)',
          }}
        >
          {/* Header Score Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 size={24} color="#10b981" />
              <h3 style={{ fontSize: '1.25rem', color: '#fff' }}>Question Evaluation</h3>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 16px',
                borderRadius: '16px',
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                color: '#10b981',
                fontWeight: 800,
                fontSize: '1.1rem',
              }}
            >
              <Award size={18} />
              Score: {currentEvaluation.score}/100
            </div>
          </div>

          {/* Feedback text */}
          <p style={{ color: '#e2e8f0', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '20px' }}>
            {currentEvaluation.feedback}
          </p>

          {/* Strengths & Missing Concepts Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
              marginBottom: '20px',
            }}
          >
            {/* Strengths */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', marginBottom: '8px' }}>
                Key Strengths
              </div>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.88rem', color: '#cbd5e1' }}>
                {(currentEvaluation.strengths || []).map((st, i) => (
                  <li key={i}>{st}</li>
                ))}
              </ul>
            </div>

            {/* Improvement Areas */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', marginBottom: '8px' }}>
                Improvement Suggestions
              </div>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.88rem', color: '#cbd5e1' }}>
                {(currentEvaluation.improvementAreas || []).map((imp, i) => (
                  <li key={i}>{imp}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Model Answer Toggle Accordion */}
          {currentEvaluation.suggestedAnswer && (
            <div
              style={{
                background: 'rgba(139, 92, 246, 0.08)',
                border: '1px solid rgba(139, 92, 246, 0.25)',
                borderRadius: '12px',
                overflow: 'hidden',
              }}
            >
              <div
                onClick={() => setShowModelAnswer(!showModelAnswer)}
                style={{
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={16} color="var(--accent-primary)" />
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#c4b5fd' }}>
                    View AI Exemplar Model Answer
                  </span>
                </div>
                {showModelAnswer ? <ChevronUp size={18} color="#94a3b8" /> : <ChevronDown size={18} color="#94a3b8" />}
              </div>

              {showModelAnswer && (
                <div
                  style={{
                    padding: '16px 18px',
                    borderTop: '1px solid rgba(139, 92, 246, 0.2)',
                    color: '#f8fafc',
                    fontSize: '0.92rem',
                    lineHeight: 1.6,
                  }}
                >
                  "{currentEvaluation.suggestedAnswer}"
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal for Exit */}
      <ConfirmationModal
        isOpen={showExitModal}
        title="Exit Interview Session?"
        message="Your progress for answered questions has been saved to your account. You can resume this session anytime from your Dashboard or History."
        confirmText="Exit Session"
        cancelText="Stay in Room"
        confirmVariant="danger"
        onConfirm={() => {
          setShowExitModal(false);
          navigate('/dashboard');
        }}
        onCancel={() => setShowExitModal(false)}
      />
    </div>
  );
};
