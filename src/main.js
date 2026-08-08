/**
 * Main Application Module Entry Point
 * Imports and orchestrates modular services, AI mentor engine, and voice services.
 */

import { CONFIG } from './config/config.js';
import { fmt, fmtPercent, stripHtml, highlightKeywords } from './utils/formatter.js';
import { userProfile, loadUserProfile, saveUserProfile } from './services/user/userService.js';
import { geminiService } from './services/gemini/geminiService.js';
import { ttsService } from './services/speech/ttsService.js';
import { sttService } from './services/speech/sttService.js';
import { getRecommendedFundCategories, calculateRecommendedSipAmount, projectSipGrowth } from './services/investment/recommender.js';
import { SIP_LESSONS } from './data/lessons/sipLessons.js';
import { currentLessonIndex, setLessonStepIndex, nextLessonStep, prevLessonStep, renderCurrentLessonStep } from './features/sip-learning/lessonEngine.js';
import { renderVoiceControlsUI } from './components/saashya/voiceControls.js';

import { initFin2EdgeIntro } from './features/intro/introController.js';

// Expose services on window for debugging & seamless integration
window.Fin2edgeModules = {
  CONFIG,
  formatter: { fmt, fmtPercent, stripHtml, highlightKeywords },
  userService: { userProfile, loadUserProfile, saveUserProfile },
  geminiService,
  ttsService,
  sttService,
  recommender: { getRecommendedFundCategories, calculateRecommendedSipAmount, projectSipGrowth },
  lessonEngine: { SIP_LESSONS, setLessonStepIndex, nextLessonStep, prevLessonStep, renderCurrentLessonStep },
  initFin2EdgeIntro
};

// Initialize User Profile & Onboarding Video Intro
loadUserProfile();

if (document.readyState !== 'loading') {
  initFin2EdgeIntro();
} else {
  document.addEventListener('DOMContentLoaded', initFin2EdgeIntro);
}

console.log('✨ Fin2edge Modular Architecture & Intro Experience Initialized Successfully.');
