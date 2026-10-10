import React, { useState } from 'react';
import { Sparkles, Bot, Volume2 } from 'lucide-react';
import { AudioPlayer } from './AudioPlayer.jsx';

export const QuestionPanel = ({
  questionNumber,
  totalQuestions,
  questionText,
  topic,
  difficulty,
  voiceId = 'Namrita',
  audioBlob = null,
}) => {
  const [isInterviewerSpeaking, setIsInterviewerSpeaking] = useState(false);

  return (
    <div className="glass-panel question-panel animate-fade-in">
      {/* Header Info */}
      <div className="question-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(6, 182, 212, 0.2))',
              border: '1px solid rgba(139, 92, 246, 0.4)',
              borderRadius: '20px',
              color: '#fff',
              fontSize: '0.85rem',
              fontWeight: 700,
            }}
          >
            <Sparkles size={14} color="#a78bfa" />
            <span>
              Question {questionNumber} of {totalQuestions}
            </span>
          </div>

          <span className="badge badge-cyan" style={{ fontSize: '0.75rem' }}>
            {topic || 'Core Subject'}
          </span>
        </div>

        <span
          className={`badge ${
            difficulty === 'Beginner'
              ? 'badge-cyan'
              : difficulty === 'Advanced'
              ? 'badge-danger'
              : 'badge-primary'
          }`}
        >
          {difficulty || 'Intermediate'}
        </span>
      </div>

      {/* AI Interviewer Avatar & Speaking Wave */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '20px',
          padding: '12px 18px',
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: isInterviewerSpeaking
              ? 'linear-gradient(135deg, #8b5cf6, #06b6d4)'
              : 'rgba(139, 92, 246, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: isInterviewerSpeaking ? '0 0 20px rgba(139, 92, 246, 0.5)' : 'none',
            transition: 'all 0.3s ease',
          }}
        >
          <Bot size={22} />
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>
            AI Technical Interviewer
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            Powered by Google Gemini & Murf AI
          </div>
        </div>

        {/* Live Audio Bars */}
        <div className="audio-visualizer-bar-container">
          {[12, 24, 32, 18, 28, 14, 22].map((height, i) => (
            <div
              key={i}
              className={`sound-bar ${isInterviewerSpeaking ? 'active' : ''}`}
              style={{
                height: isInterviewerSpeaking ? `${height}px` : '4px',
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Question Text */}
      <p className="question-text">{questionText}</p>

      {/* Voice Player */}
      <AudioPlayer
        text={questionText}
        audioBlob={audioBlob}
        voiceId={voiceId}
        onPlaybackStateChange={setIsInterviewerSpeaking}
      />
    </div>
  );
};
