import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { speechService } from '../services/speechService.js';

export const AudioPlayer = ({
  audioBlob,
  text,
  voiceId = 'Namrita',
  autoPlay = true,
  onPlaybackStateChange = null,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [currentBlob, setCurrentBlob] = useState(audioBlob);

  useEffect(() => {
    let isMounted = true;

    const loadAndPlayAudio = async () => {
      if (audioBlob) {
        setCurrentBlob(audioBlob);
        if (autoPlay) {
          playBlob(audioBlob);
        }
        return;
      }

      if (text) {
        setIsLoading(true);
        try {
          const blob = await speechService.generateSpeechAudio(text, voiceId);
          if (isMounted) {
            setCurrentBlob(blob);
            setIsLoading(false);
            if (blob && autoPlay) {
              playBlob(blob);
            }
          }
        } catch (err) {
          if (isMounted) setIsLoading(false);
        }
      }
    };

    loadAndPlayAudio();

    return () => {
      isMounted = false;
      speechService.stopAudio();
    };
  }, [text, audioBlob, voiceId]);

  const playBlob = (blob) => {
    if (!blob) {
      // Fallback to browser speech
      speechService.speakBrowserFallback(text, {
        onStart: () => {
          setIsPlaying(true);
          if (onPlaybackStateChange) onPlaybackStateChange(true);
        },
        onEnd: () => {
          setIsPlaying(false);
          setProgress(100);
          if (onPlaybackStateChange) onPlaybackStateChange(false);
        },
      });
      return;
    }

    speechService.playAudioBlob(blob, {
      onPlay: () => {
        setIsPlaying(true);
        if (onPlaybackStateChange) onPlaybackStateChange(true);
      },
      onEnded: () => {
        setIsPlaying(false);
        setProgress(100);
        if (onPlaybackStateChange) onPlaybackStateChange(false);
      },
      onError: (err) => {
        console.warn('Audio playback error, trying fallback:', err);
        setIsPlaying(false);
        if (onPlaybackStateChange) onPlaybackStateChange(false);
        speechService.speakBrowserFallback(text);
      },
      onTimeUpdate: ({ progress: p }) => {
        setProgress(p);
      },
    });
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      speechService.stopAudio();
      setIsPlaying(false);
      if (onPlaybackStateChange) onPlaybackStateChange(false);
    } else {
      playBlob(currentBlob);
    }
  };

  const handleReplay = () => {
    speechService.stopAudio();
    setProgress(0);
    playBlob(currentBlob);
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '12px 20px',
        background: 'rgba(15, 23, 42, 0.9)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        width: '100%',
      }}
    >
      {/* Play/Pause Button */}
      <button
        type="button"
        onClick={handleTogglePlay}
        disabled={isLoading}
        className="btn btn-primary btn-sm"
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          padding: 0,
          flexShrink: 0,
        }}
        title={isPlaying ? 'Pause Question' : 'Play Question Audio'}
      >
        {isLoading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : isPlaying ? (
          <Pause size={16} />
        ) : (
          <Play size={16} style={{ marginLeft: 2 }} />
        )}
      </button>

      {/* Progress & Wave Visualizer */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>
            {isLoading
              ? 'Synthesizing AI Murf Voice...'
              : isPlaying
              ? 'Interviewer Speaking...'
              : 'Question Audio Ready'}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
            {voiceId} (TTS)
          </span>
        </div>

        {/* Progress bar */}
        <div
          style={{
            width: '100%',
            height: '6px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '4px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #8b5cf6, #06b6d4)',
              transition: 'width 0.1s linear',
            }}
          />
        </div>
      </div>

      {/* Replay action */}
      <button
        type="button"
        onClick={handleReplay}
        disabled={isLoading}
        className="btn btn-ghost btn-sm"
        style={{ padding: 8 }}
        title="Replay from start"
      >
        <RotateCcw size={16} />
      </button>
    </div>
  );
};
