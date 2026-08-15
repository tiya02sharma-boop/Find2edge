import express from 'express';
import cors from 'cors';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const appDir = process.cwd();
const envFile = join(appDir, '.env');
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
  }
}

if (!process.env.JWT_SECRET) {
  console.warn('⚠️  JWT_SECRET is not set in .env — using an insecure default for local dev only.');
  process.env.JWT_SECRET = 'dev-only-insecure-secret-change-me';
}

const apiKey = process.env.GEMINI_API_KEY;
const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
const port = Number(process.env.PORT || 3000);
const systemInstruction = 'You are Saashya, the Fin2edge site guide. Answer briefly and clearly about financial literacy, Indian government/bank savings schemes, loans, insurance, market terminology, and the simulated trading Exchange on this site. All trading data on this site is simulated for education only — never give real investment advice or real-time market data.';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/assistant', async (req, res) => {
  try {
    const contents = req.body?.contents;
    const clientApiKey = req.body?.apiKey || apiKey;
    if (!clientApiKey) return res.status(500).json({ error: 'NO_API_KEY', message: 'The server has no GEMINI_API_KEY configured.' });
    if (!Array.isArray(contents) || !contents.length) throw new Error('A conversation is required.');

    const googleResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': clientApiKey },
      body: JSON.stringify({ contents: contents.slice(-20), systemInstruction: { parts: [{ text: systemInstruction }] } })
    });
    const data = await googleResponse.json();
    if (!googleResponse.ok) return res.status(googleResponse.status).json({ error: data?.error?.message || 'Gemini request failed.' });
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message || 'Invalid request.' });
  }
});

// Static site — serves index.html, script.js, styles.css, src/, assets/, etc.
app.use(express.static(appDir));

app.listen(port, () => console.log(`Fin2edge is running at http://localhost:${port}`));
