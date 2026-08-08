/**
 * Lesson Engine Feature
 * Controls lesson progression, topic navigation, step dots, and automatic speech triggers.
 */

import { SIP_LESSONS } from '../../data/lessons/sipLessons.js';
import { ttsService } from '../../services/speech/ttsService.js';
import { renderVoiceControlsUI } from '../../components/saashya/voiceControls.js';

export let currentLessonIndex = 0;

export function getCurrentLessonStep() {
  const raw = SIP_LESSONS[currentLessonIndex];
  return typeof raw === 'function' ? raw() : raw;
}

export function getTotalLessonSteps() {
  return SIP_LESSONS.length;
}

export function setLessonStepIndex(index) {
  if (index >= 0 && index < SIP_LESSONS.length) {
    currentLessonIndex = index;
    renderCurrentLessonStep();
  }
}

export function nextLessonStep() {
  if (currentLessonIndex < SIP_LESSONS.length - 1) {
    currentLessonIndex++;
    renderCurrentLessonStep();
  }
}

export function prevLessonStep() {
  if (currentLessonIndex > 0) {
    currentLessonIndex--;
    renderCurrentLessonStep();
  }
}

export function renderCurrentLessonStep() {
  const stepTextEl = document.getElementById('bankStepText');
  const dotsEl = document.getElementById('bankDots');
  const tagEl = document.getElementById('bankStepTag');
  const nextBtn = document.getElementById('bankNext');
  const backBtn = document.getElementById('bankBack');

  renderVoiceControlsUI();

  if (tagEl) {
    tagEl.textContent = `Step ${currentLessonIndex + 1} of ${SIP_LESSONS.length}`;
  }

  const stepContent = getCurrentLessonStep();
  if (stepTextEl) {
    stepTextEl.innerHTML = stepContent;
  }

  // Update dots
  if (dotsEl) {
    dotsEl.innerHTML = SIP_LESSONS.map((_, i) => {
      let cls = 'sim-dot';
      if (i < currentLessonIndex) cls += ' done';
      if (i === currentLessonIndex) cls += ' active';
      return `<span class="${cls}"></span>`;
    }).join('');
  }

  if (backBtn) {
    backBtn.disabled = false;
    backBtn.style.opacity = '1';
  }

  const isLast = currentLessonIndex === SIP_LESSONS.length - 1;
  if (nextBtn) {
    nextBtn.textContent = isLast ? 'Start Branch Simulation ➔' : 'Next';
  }

  // Trigger speech if auto-voice is enabled
  if (ttsService.autoVoice) {
    ttsService.speak(stepContent);
  }
}

// Bind global functions for inline onclick handlers on choice buttons
window.saashyaNextStep = nextLessonStep;
window.saashyaExplainAgain = function(topicName) {
  const explanation = `Let me explain ${topicName || 'this concept'} with another real-life example! Imagine buying 10 chocolates today at ₹10 each. Next month, if price drops to ₹5, your ₹100 buys 20 chocolates! That is Rupee Cost Averaging — buying more when cheap, fewer when expensive.`;
  const stepEl = document.getElementById('bankStepText');
  if (stepEl) {
    const box = document.createElement('div');
    box.className = 'sip-example-box';
    box.style.marginTop = '10px';
    box.innerHTML = `<strong>🔄 Simplified Explanation:</strong> ${explanation}`;
    stepEl.appendChild(box);
  }
  ttsService.speak(explanation);
};
