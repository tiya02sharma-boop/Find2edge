/**
 * Speech-to-Text (STT) Service
 * Manages Web Speech Recognition, microphone input, listening states, and intent handling.
 */

class STTService {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.onResultCallback = null;
    this.onStateCallback = null;
    
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRec) {
      this.SpeechRecClass = SpeechRec;
    } else {
      this.SpeechRecClass = null;
    }
  }

  isSupported() {
    return !!this.SpeechRecClass;
  }

  startListening(onResult, onStateChange) {
    if (!this.isSupported()) {
      alert("Voice input isn't supported in this browser. Please try Google Chrome or Microsoft Edge.");
      return;
    }

    this.onResultCallback = onResult;
    this.onStateCallback = onStateChange;

    if (this.isListening && this.recognition) {
      this.stopListening();
      return;
    }

    try {
      const rec = new this.SpeechRecClass();
      rec.lang = 'en-IN';
      rec.continuous = false;
      rec.interimResults = false;

      rec.onstart = () => {
        this.isListening = true;
        if (this.onStateCallback) this.onStateCallback({ isListening: true });
      };

      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (this.onResultCallback) this.onResultCallback(transcript);
      };

      rec.onerror = rec.onend = () => {
        this.isListening = false;
        if (this.onStateCallback) this.onStateCallback({ isListening: false });
      };

      this.recognition = rec;
      rec.start();
    } catch (e) {
      console.warn('STT Error:', e);
      this.isListening = false;
      if (this.onStateCallback) this.onStateCallback({ isListening: false });
    }
  }

  stopListening() {
    if (this.recognition) {
      try { this.recognition.stop(); } catch (e) {}
    }
    this.isListening = false;
    if (this.onStateCallback) this.onStateCallback({ isListening: false });
  }
}

export const sttService = new STTService();
