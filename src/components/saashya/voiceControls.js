/**
 * Saashya Voice Controls Component
 * Controls Play, Pause, Resume, Mute/Unmute, Voice Speed, and Microphone trigger UI.
 */

import { ttsService } from '../../services/speech/ttsService.js';
import { sttService } from '../../services/speech/sttService.js';
import { geminiService } from '../../services/gemini/geminiService.js';

export function renderVoiceControlsUI() {
  const container = document.getElementById('saashyaVoiceControls');
  if (!container) return;

  container.innerHTML = `
    <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;">
      <button id="saashyaSpeakBtn" class="voice-btn" title="Play / Pause Speech">🔊 Speak</button>
      <button id="saashyaMuteBtn" class="voice-btn" title="Toggle Auto Voice">🔔 Voice: ON</button>
      <select id="saashyaSpeedSelect" class="voice-btn" style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.18);color:#f0f4ff;cursor:pointer;padding:3px 6px;border-radius:20px;font-size:11px;">
        <option value="0.75" style="background:#1a1a2e;color:#fff;">0.75x</option>
        <option value="1.0" selected style="background:#1a1a2e;color:#fff;">1.0x</option>
        <option value="1.25" style="background:#1a1a2e;color:#fff;">1.25x</option>
        <option value="1.5" style="background:#1a1a2e;color:#fff;">1.5x</option>
      </select>
      <button id="saashyaMicBtn" class="voice-btn mic-btn" title="Speak to Saashya (Gemini Powered)">🎙️ Ask AI</button>
    </div>
  `;

  bindVoiceEvents();
}

function bindVoiceEvents() {
  const speakBtn = document.getElementById('saashyaSpeakBtn');
  const muteBtn = document.getElementById('saashyaMuteBtn');
  const speedSelect = document.getElementById('saashyaSpeedSelect');
  const micBtn = document.getElementById('saashyaMicBtn');

  if (speakBtn) {
    speakBtn.addEventListener('click', () => {
      if (ttsService.isSpeaking) {
        if (ttsService.isPaused) {
          ttsService.resume();
        } else {
          ttsService.pause();
        }
      } else {
        const stepEl = document.getElementById('bankStepText');
        if (stepEl) ttsService.speak(stepEl.innerHTML);
      }
    });
  }

  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      const isAuto = ttsService.toggleAutoVoice();
      muteBtn.textContent = isAuto ? '🔔 Voice: ON' : '🔕 Voice: OFF';
    });
  }

  if (speedSelect) {
    speedSelect.addEventListener('change', (e) => {
      ttsService.setRate(e.target.value);
    });
  }

  if (micBtn) {
    micBtn.addEventListener('click', () => {
      sttService.startListening(
        (transcript) => handleVoiceQueryResult(transcript),
        (state) => {
          if (state.isListening) {
            micBtn.textContent = '🎙️ Listening...';
            micBtn.classList.add('listening');
          } else {
            micBtn.textContent = '🎙️ Ask AI';
            micBtn.classList.remove('listening');
          }
        }
      );
    });
  }

  // Subscribe to TTS state changes to update Speak button text
  ttsService.onStateChange = (state) => {
    if (!speakBtn) return;
    if (state.isSpeaking && !state.isPaused) {
      speakBtn.textContent = '⏸️ Pause';
      speakBtn.classList.add('speaking');
    } else if (state.isPaused) {
      speakBtn.textContent = '▶️ Resume';
      speakBtn.classList.remove('speaking');
    } else {
      speakBtn.textContent = '🔊 Speak';
      speakBtn.classList.remove('speaking');
    }
  };
}

async function handleVoiceQueryResult(queryText) {
  const stepText = document.getElementById('bankStepText');
  const lessonContext = stepText ? stepText.textContent : '';
  
  if (window.toast) window.toast(`You asked: "${queryText}"`);

  // Query Saashya via Gemini Service
  const reply = await geminiService.askSaashya(queryText, lessonContext);

  if (stepText) {
    const box = document.createElement('div');
    box.className = 'sip-analogy-box';
    box.style.marginTop = '10px';
    box.innerHTML = `<strong>✨ Saashya (AI Mentor):</strong> ${reply}`;
    stepText.appendChild(box);
  }

  ttsService.speak(reply);
}
