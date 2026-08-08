/**
 * Gemini Service
 * Handles communication with Google Gemini API for Saashya's AI intelligence layer.
 * Maintains conversation history, context memory, and prompt generation.
 */

import { CONFIG } from '../../config/config.js';
import { getUserContextForPrompt } from '../user/userService.js';

class GeminiService {
  constructor() {
    this.conversationHistory = [];
    this.apiKey = (typeof localStorage !== 'undefined' && localStorage.getItem(CONFIG.GEMINI.API_KEY_STORAGE_KEY)) || '';
  }

  setApiKey(key) {
    this.apiKey = key;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(CONFIG.GEMINI.API_KEY_STORAGE_KEY, key);
    }
  }

  getApiKey() {
    return this.apiKey;
  }

  clearHistory() {
    this.conversationHistory = [];
  }

  async askSaashya(userMessage, lessonContext = '') {
    const userContext = getUserContextForPrompt();
    
    // Construct full system + lesson prompt
    const promptText = `${CONFIG.GEMINI.SYSTEM_INSTRUCTION}

${userContext}
${lessonContext ? `Current Lesson Step: "${lessonContext}"` : ''}

User asked/said: "${userMessage}"

Respond as Saashya warmly, briefly (2-4 sentences max), using simple analogies if explaining a concept.`;

    // Add user message to history
    this.conversationHistory.push({
      role: 'user',
      parts: [{ text: promptText }]
    });

    if (this.conversationHistory.length > 20) {
      this.conversationHistory = this.conversationHistory.slice(-20);
    }

    // 1. Try Local Server Proxy Endpoint first
    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: this.conversationHistory,
          apiKey: this.apiKey || undefined
        })
      });

      if (response.ok) {
        const data = await response.json();
        const reply = data?.candidates?.[0]?.content?.parts?.map(p => p.text).join('') || data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (reply) {
          this.conversationHistory.push({
            role: 'model',
            parts: [{ text: reply }]
          });
          return reply;
        }
      }
    } catch (proxyErr) {
      // Local server proxy unavailable or static host
    }

    // 2. Attempt Direct Gemini API call if API key is stored in localStorage
    if (this.apiKey) {
      try {
        const modelName = CONFIG.GEMINI.DEFAULT_MODEL || 'gemini-1.5-flash';
        const url = `${CONFIG.GEMINI.BASE_URL}/${modelName}:generateContent?key=${this.apiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: this.conversationHistory
          })
        });

        if (response.ok) {
          const data = await response.json();
          const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) {
            this.conversationHistory.push({
              role: 'model',
              parts: [{ text: reply }]
            });
            return reply;
          }
        }
      } catch (err) {
        console.warn('Gemini API call failed, falling back to Saashya mentor logic:', err);
      }
    }

    // 3. Intelligent Fallback Mentor Logic when offline or without API key
    return this.getFallbackSaashyaResponse(userMessage, lessonContext);
  }

  async generateBudgetAnalysis(budgetPrompt) {
    // Try proxy first
    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: budgetPrompt }] }],
          apiKey: this.apiKey || undefined
        })
      });
      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.map(p => p.text).join('');
        if (text) return text;
      }
    } catch (e) {}

    if (!this.apiKey) return null;
    const promptText = `${CONFIG.GEMINI.SYSTEM_INSTRUCTION}

This is a post-event budget evaluation. Give a detailed but readable financial coaching response in 6–8 short sentences. Do not ask questions, do not use a table, and do not give regulated investment advice. Clearly cover: what worked, the largest improvement, the exact reallocation suggested, immediate impact, long-term goal effect, and one practical next-month action.

${budgetPrompt}`;

    try {
      const modelName = CONFIG.GEMINI.DEFAULT_MODEL || 'gemini-1.5-flash';
      const url = `${CONFIG.GEMINI.BASE_URL}/${modelName}:generateContent?key=${this.apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: promptText }] }]
        })
      });
      if (!response.ok) return null;
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
    } catch (err) {
      console.warn('Gemini budget analysis failed:', err);
      return null;
    }
  }

  getFallbackSaashyaResponse(userQuery, lessonContext) {
    const q = (userQuery || '').toLowerCase().trim();

    if (q.includes('hello') || q.includes('hi') || q.includes('namaste') || q.includes('hey') || q.includes('who are you')) {
      return "Namaste! I am Saashya, your AI Financial Guide on Fin2edge. Ask me anything about savings, SIPs, compounding, stock exchange trading, bank schemes, or managing your personal budget!";
    }
    if (q.includes('yes') || q.includes('understand') || q.includes('got it') || q.includes('next') || q.includes('continue') || q.includes('ready')) {
      return "Wonderful! I'm so glad that made sense. Consistency is the secret ingredient to building wealth!";
    }
    if (q.includes('again') || q.includes('explain') || q.includes('confused') || q.includes('example') || q.includes('repeat')) {
      return "No worries at all! Imagine planting a banyan tree: you water it regularly with small amounts (SIP), and as years go by, its roots spread and yield abundant shade (compound growth).";
    }
    if (q.includes('nav')) {
      return "NAV (Net Asset Value) is simply the price of 1 unit of a mutual fund. Just like buying fruit by the kilogram, NAV tells you how much one fund unit costs today!";
    }
    if (q.includes('sip') || q.includes('systematic')) {
      return "SIP (Systematic Investment Plan) lets you automatically invest a small fixed sum every month into a mutual fund. It removes emotional stress and takes advantage of rupee cost averaging!";
    }
    if (q.includes('compound') || q.includes('compounding')) {
      return "Compounding is earning interest on interest! Albert Einstein called it the 8th wonder of the world. Over 10 to 20 years, your reinvested growth outpaces your original deposits dramatically.";
    }
    if (q.includes('tax') || q.includes('elss') || q.includes('80c')) {
      return "ELSS (Equity Linked Savings Scheme) is a mutual fund that offers tax deductions up to ₹1.5 Lakh under Section 80C, with the shortest lock-in period of just 3 years!";
    }
    if (q.includes('risk') || q.includes('safe') || q.includes('roscope')) {
      return "Every investment carries some risk. Equity funds have higher market volatility but yield 12–15% long-term growth, whereas Debt funds offer steady 6–7% capital protection.";
    }
    if (q.includes('ppf') || q.includes('public provident fund')) {
      return "PPF is a government-backed long-term scheme offering guaranteed tax-free returns (~7.1% p.a.) with a 15-year tenure. It's ideal for risk-free retirement savings!";
    }
    if (q.includes('fd') || q.includes('fixed deposit') || q.includes('rd') || q.includes('recurring')) {
      return "Fixed Deposits (FD) lock in a lump sum for a fixed rate, while Recurring Deposits (RD) build savings monthly. They offer low risk and steady bank-guaranteed returns.";
    }
    if (q.includes('budget') || q.includes('50/30/20') || q.includes('50 30 20') || q.includes('salary')) {
      return "The 50/30/20 budget rule suggests allocating 50% of income to Needs (rent, food), 30% to Wants (dining, hobbies), and 20% directly into Savings & Investments!";
    }
    if (q.includes('stock') || q.includes('share') || q.includes('exchange') || q.includes('trade')) {
      return "Buying a stock means owning a tiny share of a company. On our simulated Exchange, you can practice buying and selling stock shares risk-free with virtual capital!";
    }
    if (q.includes('bull') || q.includes('bear')) {
      return "A Bull market refers to prices climbing up with optimism (like a bull charging upward), while a Bear market means prices are falling down.";
    }
    if (q.includes('inflation')) {
      return "Inflation is the gradual decrease in purchasing power over time. Staying in plain cash erodes your money's value, which is why investing in growth assets is essential to beat inflation!";
    }
    if (q.includes('emergency') || q.includes('fund')) {
      return "An Emergency Fund is 3 to 6 months of living expenses kept in liquid, easily accessible funds to protect you against unexpected job changes or medical bills.";
    }

    return `Great question about "${userQuery}"! Building financial security is about small, consistent habits. Ask me about SIPs, compounding, tax-saving ELSS, or stock trading basics!`;
  }
}

export const geminiService = new GeminiService();
