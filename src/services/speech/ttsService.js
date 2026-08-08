/**
 * Text-to-Speech (TTS) Service
 * Manages Saashya's voice narration, audio playback controls (Play, Pause, Resume, Mute, Speed),
 * and voice selection.
 */

import { CONFIG } from '../../config/config.js';
import { stripHtml } from '../../utils/formatter.js';

class TTSService {
  constructor() {
    this.synth = window.speechSynthesis || null;
    this.autoVoice = true;
    this.rate = CONFIG.VOICE.DEFAULT_RATE;
    this.pitch = CONFIG.VOICE.DEFAULT_PITCH;
    this.isSpeaking = false;
    this.isPaused = false;
    this.currentUtterance = null;
    this.onStateChange = null;
  }

  setRate(rate) {
    this.rate = parseFloat(rate) || 1.0;
    if (this.isSpeaking && this.synth) {
      // Re-speak with new rate if currently active
      const currentText = this.currentText;
      if (currentText) this.speak(currentText);
    }
  }

  toggleAutoVoice() {
    this.autoVoice = !this.autoVoice;
    if (!this.autoVoice) {
      this.cancel();
    }
    return this.autoVoice;
  }

  speak(htmlOrText) {
    if (!this.synth) return;
    this.cancel();

    const plainText = stripHtml(htmlOrText);
    if (!plainText) return;

    this.currentText = plainText;
    const utterance = new SpeechSynthesisUtterance(plainText);
    utterance.rate = this.rate;
    utterance.pitch = this.pitch;

    // Pick female English voice
    const voices = this.synth.getVoices();
    const femaleVoice = voices.find(v => 
      v.lang.startsWith('en') && (
        v.name.includes('Female') || 
        v.name.includes('Samantha') || 
        v.name.includes('Zira') || 
        v.name.includes('Karen') || 
        v.name.includes('Victoria') || 
        v.name.includes('Google UK English Female')
      )
    ) || voices.find(v => v.lang.startsWith('en'));

    if (femaleVoice) utterance.voice = femaleVoice;

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.isPaused = false;
      this.notifyState();
    };

    utterance.onend = utterance.onerror = () => {
      this.isSpeaking = false;
      this.isPaused = false;
      this.notifyState();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  pause() {
    if (this.synth && this.isSpeaking && !this.isPaused) {
      this.synth.pause();
      this.isPaused = true;
      this.notifyState();
    }
  }

  resume() {
    if (this.synth && this.isPaused) {
      this.synth.resume();
      this.isPaused = false;
      this.notifyState();
    }
  }

  cancel() {
    if (this.synth) {
      try { this.synth.cancel(); } catch (e) {}
    }
    this.isSpeaking = false;
    this.isPaused = false;
    this.notifyState();
  }

  notifyState() {
    if (typeof this.onStateChange === 'function') {
      this.onStateChange({
        isSpeaking: this.isSpeaking,
        isPaused: this.isPaused,
        autoVoice: this.autoVoice,
        rate: this.rate
      });
    }
  }
}

export const ttsService = new TTSService();
