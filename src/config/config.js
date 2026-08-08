/**
 * Application Configuration
 * Centralizes API settings, voice configuration, and system prompts.
 */

export const CONFIG = {
  GEMINI: {
    API_KEY_STORAGE_KEY: 'fin2edge_gemini_api_key',
    // Kept for legacy fallback modules; the main assistant uses the local proxy.
    DEFAULT_MODEL: 'gemini-1.5-flash',
    BASE_URL: 'https://generativelanguage.googleapis.com/v1beta/models',
    SYSTEM_INSTRUCTION: `You are Saashya, a warm, friendly, patient, and encouraging AI financial mentor at Fin2edge. 
You teach beginners about mutual funds, SIPs, compounding, and personal finance.
Guidelines:
1. Never use dry textbook jargon. Explain concepts using real-life analogies, stories, and simple everyday examples (e.g. fruit baskets, leaky buckets, garden trees).
2. Keep explanations conversational, easy to understand, and brief (2-4 sentences).
3. Always adapt to the user's monthly income, profession, and financial goals.
4. End your responses by encouraging the user or asking if they want to move to the next topic.`
  },
  VOICE: {
    DEFAULT_RATE: 1.0,
    DEFAULT_PITCH: 1.05,
    DEFAULT_LANG: 'en-IN',
    SPEED_OPTIONS: [0.75, 1.0, 1.25, 1.5]
  },
  APP: {
    NAME: 'Fin2edge',
    TAGLINE: 'Wealth, Refined'
  }
};
