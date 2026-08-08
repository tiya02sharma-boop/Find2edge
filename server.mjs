import { createReadStream, existsSync, readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';

const appDir = process.cwd();
const envFile = join(appDir, '.env');
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
  }
}

const apiKey = process.env.GEMINI_API_KEY;
const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
const port = Number(process.env.PORT || 3000);
const mimeTypes = { '.css': 'text/css', '.html': 'text/html', '.js': 'text/javascript', '.mp4': 'video/mp4' };
const systemInstruction = 'You are Saashya, the Fin2edge site guide. Answer briefly and clearly about financial literacy, Indian government/bank savings schemes, loans, insurance, market terminology, and the simulated trading Exchange on this site. All trading data on this site is simulated for education only — never give real investment advice or real-time market data.';

function sendJson(response, status, data) {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(data));
}

createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  if (request.method === 'POST' && url.pathname === '/api/assistant') {
    let raw = '';
    for await (const chunk of request) {
      raw += chunk;
      if (raw.length > 50_000) return sendJson(response, 413, { error: 'Request is too large.' });
    }
    try {
      const payload = JSON.parse(raw || '{}');
      const contents = payload.contents;
      const clientApiKey = payload.apiKey || apiKey;
      if (!clientApiKey) return sendJson(response, 500, { error: 'NO_API_KEY', message: 'The server has no GEMINI_API_KEY configured.' });
      if (!Array.isArray(contents) || !contents.length) throw new Error('A conversation is required.');
      const googleResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': clientApiKey },
        body: JSON.stringify({ contents: contents.slice(-20), systemInstruction: { parts: [{ text: systemInstruction }] } })
      });
      const data = await googleResponse.json();
      if (!googleResponse.ok) return sendJson(response, googleResponse.status, { error: data?.error?.message || 'Gemini request failed.' });
      sendJson(response, 200, data);
    } catch (error) {
      sendJson(response, 400, { error: error.message || 'Invalid request.' });
    }
    return;
  }
  if (request.method !== 'GET' && request.method !== 'HEAD') { response.writeHead(405); response.end(); return; }
  const requestedPath = url.pathname === '/' ? '/index.html' : url.pathname;
  const filePath = normalize(join(appDir, requestedPath));
  if (!filePath.startsWith(appDir) || !existsSync(filePath)) { response.writeHead(404); response.end('Not found'); return; }
  response.writeHead(200, { 'Content-Type': mimeTypes[extname(filePath)] || 'application/octet-stream' });
  if (request.method === 'HEAD') response.end(); else createReadStream(filePath).pipe(response);
}).listen(port, () => console.log(`Fin2edge is running at http://localhost:${port}`));
