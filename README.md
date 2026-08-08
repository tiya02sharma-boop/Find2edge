# Fin2edge local demo

The AI assistant is ready to use through the included local server. From this folder, run:

```sh
npm start
```

Then open `http://localhost:3000` and select the **AI** button beside Saashya.

The Gemini key is held in `.env` and is sent to Google only by `server.mjs`; it is never included in the browser JavaScript. Do not deploy this project as a static site or commit `.env` to source control. For production, set `GEMINI_API_KEY` in the host's secret manager and deploy the server endpoint with the app.

The default assistant model is `gemini-1.5-flash`. Change `GEMINI_MODEL` in `.env` if your Google project requires a different available Gemini model.
