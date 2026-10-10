import { request } from './api.js';

class SpeechService {
  constructor() {
    this.currentAudio = null;
    this.currentBlobUrl = null;
  }

  /**
   * Request audio blob from backend Murf service
   */
  async generateSpeechAudio(text, voiceId = 'Namrita', locale = 'en-US') {
    try {
      const blob = await request('/speech/generate', {
        method: 'POST',
        body: JSON.stringify({ text, voiceId, locale }),
      });
      return blob;
    } catch (error) {
      console.warn('[Speech Service] Backend TTS failed, using fallback synthesizer:', error.message);
      return null;
    }
  }

  /**
   * Play audio from a Blob or text fallback
   */
  playAudioBlob(blob, { onPlay, onEnded, onError, onTimeUpdate } = {}) {
    this.stopAudio();

    if (!blob) {
      if (onError) onError(new Error('No audio blob provided'));
      return null;
    }

    try {
      this.currentBlobUrl = URL.createObjectURL(blob);
      const audio = new Audio(this.currentBlobUrl);
      this.currentAudio = audio;

      if (onPlay) audio.addEventListener('play', onPlay);
      if (onEnded) audio.addEventListener('ended', onEnded);
      if (onError) audio.addEventListener('error', onError);
      if (onTimeUpdate) {
        audio.addEventListener('timeupdate', () => {
          onTimeUpdate({
            currentTime: audio.currentTime,
            duration: audio.duration || 0,
            progress: audio.duration ? (audio.currentTime / audio.duration) * 100 : 0,
          });
        });
      }

      audio.play().catch((err) => {
        console.warn('[Speech Service] Audio autoplay prevented:', err.message);
        if (onError) onError(err);
      });

      return audio;
    } catch (err) {
      if (onError) onError(err);
      return null;
    }
  }

  /**
   * Browser SpeechSynthesis fallback when backend audio is unavailable
   */
  speakBrowserFallback(text, { onStart, onEnd } = {}) {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    if (onStart) utterance.onstart = onStart;
    if (onEnd) utterance.onend = onEnd;

    window.speechSynthesis.speak(utterance);
  }

  stopAudio() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    if (this.currentBlobUrl) {
      URL.revokeObjectURL(this.currentBlobUrl);
      this.currentBlobUrl = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const speechService = new SpeechService();
