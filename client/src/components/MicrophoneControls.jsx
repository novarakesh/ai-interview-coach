import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, AlertCircle } from 'lucide-react';
import { speechRecognition } from '../services/speechRecognition.js';

export const MicrophoneControls = ({
  answerText,
  setAnswerText,
  onRecordingStateChange = null,
  disabled = false,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [micError, setMicError] = useState(null);
  const timerRef = useRef(null);
  const initialTextRef = useRef('');

  const isSupported = speechRecognition.isSupported();

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const startRecording = () => {
    setMicError(null);
    initialTextRef.current = (answerText || '').trim();

    const success = speechRecognition.start({
      language: 'en-US',
      onStart: () => {
        setIsRecording(true);
        if (onRecordingStateChange) onRecordingStateChange(true);
      },
      onResult: ({ finalTranscript, interimTranscript }) => {
        const parts = [];
        if (initialTextRef.current) {
          parts.push(initialTextRef.current);
        }
        if (finalTranscript) {
          parts.push(finalTranscript);
        }
        if (interimTranscript) {
          parts.push(interimTranscript);
        }

        const combined = parts.join(' ').trim();
        setAnswerText(combined);
      },
      onError: (err) => {
        console.warn('[MicrophoneControls] Error:', err);
        setIsRecording(false);
        if (onRecordingStateChange) onRecordingStateChange(false);

        // Ignore benign silence / pause events
        if (err.error === 'no-speech') {
          return;
        }

        if (err.error === 'not-allowed') {
          setMicError('Microphone permission was denied. Please allow microphone access in your browser settings or type your answer directly.');
        } else {
          setMicError('Speech recognition paused. You can click to record again or type directly.');
          setTimeout(() => setMicError(null), 4000);
        }
      },
      onEnd: () => {
        setIsRecording(false);
        if (onRecordingStateChange) onRecordingStateChange(false);
      },
    });

    if (!success && !isSupported) {
      setMicError('Speech recognition is not supported in this browser. Please type your answer directly.');
    }
  };

  const stopRecording = () => {
    speechRecognition.stop();
    setIsRecording(false);
    if (onRecordingStateChange) onRecordingStateChange(false);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const formatTimer = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mic-controls-container">
      {/* Microphone Record Button */}
      <div style={{ position: 'relative' }}>
        <button
          type="button"
          onClick={toggleRecording}
          disabled={disabled}
          className={`mic-button ${isRecording ? 'recording' : ''}`}
          title={isRecording ? 'Stop Recording' : 'Click to Speak Answer'}
        >
          {isRecording ? <Square size={28} /> : <Mic size={32} />}
        </button>
      </div>

      {/* Status & Timer */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
        <div className="mic-timer">{formatTimer(seconds)}</div>
        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: isRecording ? '#f87171' : '#94a3b8' }}>
          {isRecording ? 'Listening... Speak clearly into your mic' : 'Click to answer via voice or type below'}
        </div>
      </div>

      {/* Permission / Unsupported Warning Banner */}
      {micError && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            color: '#fca5a5',
            fontSize: '0.8rem',
            maxWidth: 500,
          }}
        >
          <AlertCircle size={16} flexShrink={0} />
          <span>{micError}</span>
        </div>
      )}
    </div>
  );
};
