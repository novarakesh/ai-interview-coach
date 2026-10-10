/**
 * Browser Speech Recognition Helper
 * Uses Web Speech API (SpeechRecognition / webkitSpeechRecognition)
 */

class SpeechRecognitionManager {
  constructor() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition || null;

    this.SpeechRecognition = SpeechRecognition;
    this.recognition = null;
    this.isListening = false;
  }

  isSupported() {
    return !!this.SpeechRecognition;
  }

  start({ onResult, onError, onStart, onEnd, language = 'en-US' } = {}) {
    if (!this.isSupported()) {
      if (onError) onError(new Error('Speech recognition is not supported in this browser. You can type your answer below.'));
      return false;
    }

    try {
      if (this.recognition) {
        try {
          this.recognition.abort();
        } catch (e) {
          // ignore
        }
      }

      this.recognition = new this.SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = language;

      this.recognition.onstart = () => {
        this.isListening = true;
        if (onStart) onStart();
      };

      this.recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = 0; i < event.results.length; ++i) {
          const res = event.results[i];
          if (res.isFinal) {
            finalTranscript += res[0].transcript + ' ';
          } else {
            interimTranscript += res[0].transcript;
          }
        }

        if (onResult) {
          onResult({
            finalTranscript: finalTranscript.trim(),
            interimTranscript: interimTranscript.trim(),
          });
        }
      };

      this.recognition.onerror = (event) => {
        console.warn('[Speech Recognition] Error event:', event.error);
        if (onError) onError(event);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (onEnd) onEnd();
      };

      this.recognition.start();
      return true;
    } catch (err) {
      console.error('[Speech Recognition] Start exception:', err);
      if (onError) onError(err);
      return false;
    }
  }

  stop() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
      this.isListening = false;
    }
  }
}

export const speechRecognition = new SpeechRecognitionManager();
