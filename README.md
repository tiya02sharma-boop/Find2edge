# Fin2edge — Wealth, Refined

An immersive financial literacy web app featuring **Saashya**, an AI mentor who teaches banking, SIPs, and mutual funds through a 3D, story-driven experience.

> ⚠️ All trading/market data is simulated for education only — not real investment advice.

## Features
- **Saashya AI Guide** — voice-enabled mentor (TTS/STT) powered by Gemini
- **Bank Simulator** — budgeting, risk profiling, monthly progression
- **SIP Learning Engine** — step-by-step lessons on SIPs & compounding
- **Strategy Vault** — investment strategy explorer
- **Simulated Trading Exchange** — sandboxed market with allocation charts
- **Cinematic Intro** — video-driven onboarding

## Tech Stack
Three.js · GSAP · Vanilla JS (ES modules) · Node.js server · Gemini API · Web Speech API

## Project Structure
```
├── index.html / strategy-vault.html / vault_section.html
├── styles.css, script.js, vault.js
├── server.mjs         # static + Gemini proxy server
├── assets/            # intro video
└── src/
    ├── main.js
    ├── config/, components/, features/
    ├── services/       # gemini, speech, investment, user
    ├── data/lessons/
    └── utils/
```

## Getting Started

```sh
git clone <your-repo-url>
cd fin2edge
npm start
```

Open **http://localhost:3000**.

### Enable the AI Assistant
Set your key in `.env`:
```
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-1.5-flash
```
Restart the server, then click **AI** beside Saashya.

## Security
- Requires the Node server — **do not deploy as a static site** (Gemini key must stay server-side)
- Never commit `.env`
- In production, set `GEMINI_API_KEY` via your host's secret manager

## Roadmap
- [ ] Real market analysis & stock evaluation
- [ ] 2D investing demo
- [ ] RPG-style explorable world with NPCs/quests

## License
Add your license here (e.g. MIT).
