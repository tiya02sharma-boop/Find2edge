/**
 * Structured SIP & Mutual Fund Lesson Content
 * Contains all 19 conversational dialogue steps for Saashya.
 */

import { userProfile } from '../../services/user/userService.js';
import { getRecommendedFundCategories, calculateRecommendedSipAmount } from '../../services/investment/recommender.js';

export const SIP_LESSONS = [
  // Step 1: Introduction - Why Invest & Inflation
  `<div>
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
      <span style="background:rgba(52,211,153,0.15);color:#34d399;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:700;">1. Introduction</span>
      <span style="font-size:13px;color:var(--gold-soft);">Why Investing Matters</span>
    </div>
    <p><strong>Welcome to the <mark class="hl-gold">SIP</mark> Counter!</strong> Before we fill any forms, let's understand why we invest.</p>
    <p style="margin-top:6px;">Most people leave their hard-earned money in a savings bank account earning <strong>~3% per year</strong>. But <mark class="hl-coral">Inflation</mark> in India runs at <strong>5%–7%</strong> every year! Keeping cash in savings actually causes your buying power to shrink every year.</p>
    <div class="sip-analogy-box">
      <strong>💡 The Leaky Bucket Analogy:</strong> Saving money without investing is like pouring water into a bucket with a tiny leak (<mark class="hl-coral">inflation</mark>). <strong>Investing</strong> is planting a fruit seed—it takes time, but grows into a tree that produces fresh fruit season after season!
    </div>
  </div>`,

  // Step 2: Saving vs Investing & Checkpoint
  `<div>
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
      <span style="background:rgba(167,139,250,0.15);color:#a78bfa;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:700;">Saving vs Investing</span>
      <span style="font-size:13px;color:var(--gold-soft);">Beating Inflation</span>
    </div>
    <p>Let's compare <strong>Saving</strong> vs. <strong>Investing</strong> in real life:</p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:8px 0;">
      <div style="background:rgba(255,255,255,0.05);padding:10px;border-radius:8px;border-left:3px solid #fb7185;">
        <strong style="color:#fb7185;">🏦 Saving</strong>
        <p style="font-size:13px;margin-top:4px;">Keeps money safe for immediate emergencies, but loses purchasing power to <mark class="hl-coral">inflation</mark> over time.</p>
      </div>
      <div style="background:rgba(255,255,255,0.05);padding:10px;border-radius:8px;border-left:3px solid #34d399;">
        <strong style="color:#34d399;">🌱 Investing</strong>
        <p style="font-size:13px;margin-top:4px;">Puts money to work in assets (like stocks & bonds) to outpace inflation and build long-term wealth.</p>
      </div>
    </div>
    <p style="font-size:13.5px;color:var(--muted);">Example: A ₹100 thali today will cost ~₹200 in 10 years at 7% inflation. Your money must grow at 10%–12% so you can afford it effortlessly!</p>
    <div class="sip-choice-row">
      <button class="sip-choice-btn primary" onclick="window.saashyaNextStep()">Yes, I understand! ➔</button>
      <button class="sip-choice-btn" onclick="window.saashyaExplainAgain('Inflation')">🔄 Explain with another example</button>
      <button class="sip-choice-btn" onclick="window.toggleSaashyaVoiceInput()">🎙️ Ask Saashya</button>
    </div>
  </div>`,

  // Step 3: What is a Mutual Fund? (Fruit Basket Analogy)
  `<div>
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
      <span style="background:rgba(251,191,36,0.15);color:#fbbf24;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:700;">2. Mutual Funds</span>
      <span style="font-size:13px;color:var(--gold-soft);">The Fruit Basket Concept</span>
    </div>
    <p>Before we talk about SIPs, what is a <mark class="hl-emerald">Mutual Fund</mark>?</p>
    <div class="sip-analogy-box">
      <strong>🧺 Fruit Basket Analogy:</strong> Buying individual stocks is like buying an entire apple orchard—expensive and risky if one crop fails. A <mark class="hl-emerald">Mutual Fund</mark> pools money from thousands of investors to buy a pre-packed basket of 40–50 top companies (Tata, Reliance, Infosys, HDFC). You buy a small slice of the whole basket!
    </div>
    <p style="margin-top:6px;">This gives you instant <mark class="hl-purple">Diversification</mark>—even with just ₹500!</p>
  </div>`,

  // Step 4: Core Mutual Fund Terms (AMC, Manager, NAV, Units, Portfolio) & Checkpoint
  `<div>
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
      <span style="background:rgba(52,211,153,0.15);color:#34d399;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:700;">MF Building Blocks</span>
      <span style="font-size:13px;color:var(--gold-soft);">Core Vocabulary</span>
    </div>
    <p>Here are the 5 core terms every investor must know:</p>
    <ul style="font-size:13.5px;line-height:1.6;margin:6px 0 0 16px;color:var(--cream);">
      <li><strong><mark class="hl-gold">AMC</mark> (Asset Management Company):</strong> The fund house (e.g. SBI Mutual Fund) managing the funds.</li>
      <li><strong><mark class="hl-emerald">Fund Manager</mark>:</strong> The professional expert who researches companies and decides which stocks/bonds to buy.</li>
      <li><strong><mark class="hl-purple">NAV</mark> (Net Asset Value):</strong> The price of 1 single unit of the fund (like price per kg of fruit).</li>
      <li><strong>Units:</strong> Your share of the fund. If NAV is ₹50 and you invest ₹1,000, you get <strong>20 units</strong>!</li>
      <li><strong>Portfolio:</strong> The complete collection of all stocks and bonds held inside the mutual fund.</li>
    </ul>
    <div class="sip-choice-row">
      <button class="sip-choice-btn primary" onclick="window.saashyaNextStep()">Got NAV & Units! ➔</button>
      <button class="sip-choice-btn" onclick="window.saashyaExplainAgain('NAV')">🔄 Explain NAV again</button>
      <button class="sip-choice-btn" onclick="window.toggleSaashyaVoiceInput()">🎙️ Ask Saashya</button>
    </div>
  </div>`,

  // Step 5: Types of Mutual Funds - Equity
  `<div>
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
      <span style="background:rgba(251,113,133,0.15);color:#fb7185;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:700;">3. Fund Types</span>
      <span style="font-size:13px;color:#fb7185;font-weight:700;">Equity Funds</span>
    </div>
    <p><mark class="hl-coral">Equity Mutual Funds</mark> invest primarily in company stocks/shares.</p>
    <div style="background:rgba(251,113,133,0.08);border:1px solid rgba(251,113,133,0.2);padding:12px;border-radius:10px;margin:8px 0;font-size:13.5px;">
      <div><strong>• Risk Level:</strong> <span class="risk-tag risk-high">High</span> (fluctuates with stock market)</div>
      <div><strong>• Benefits:</strong> Highest long-term returns (12%–15%+ returns historically)</div>
      <div><strong>• Who Should Invest:</strong> Investors seeking wealth creation for long-term goals</div>
      <div><strong>• Recommended Horizon:</strong> 5 Years or longer</div>
    </div>
  </div>`,

  // Step 6: Types of Mutual Funds - Debt & Hybrid
  `<div>
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
      <span style="background:rgba(52,211,153,0.15);color:#34d399;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:700;">Debt vs Hybrid</span>
      <span style="font-size:13px;color:var(--gold-soft);">Stability & Balance</span>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:6px 0;">
      <div style="background:rgba(255,255,255,0.04);padding:10px;border-radius:8px;border-left:3px solid #34d399;">
        <strong style="color:#34d399;">🛡️ <mark class="hl-emerald">Debt Funds</mark></strong>
        <p style="font-size:12.5px;margin-top:4px;">Invests in government & corporate bonds.<br><strong>Risk:</strong> Low–Moderate<br><strong>Horizon:</strong> 1–3 Years<br><strong>Best for:</strong> Short-term safety & predictable growth.</p>
      </div>
      <div style="background:rgba(255,255,255,0.04);padding:10px;border-radius:8px;border-left:3px solid #a78bfa;">
        <strong style="color:#a78bfa;">⚖️ <mark class="hl-purple">Hybrid Funds</mark></strong>
        <p style="font-size:12.5px;margin-top:4px;">Mixes Equity (Stocks) + Debt (Bonds).<br><strong>Risk:</strong> Moderate<br><strong>Horizon:</strong> 3–5 Years<br><strong>Best for:</strong> Balanced growth with lower volatility.</p>
      </div>
    </div>
  </div>`,

  // Step 7: Index Funds & ELSS (Tax Saving) & Checkpoint
  `<div>
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
      <span style="background:rgba(251,191,36,0.15);color:#fbbf24;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:700;">Index & ELSS</span>
      <span style="font-size:13px;color:var(--gold-soft);">Low Cost & Tax Saving</span>
    </div>
    <p>Two very popular specialized mutual fund categories:</p>
    <div style="margin:6px 0;font-size:13px;line-height:1.5;">
      <div style="background:rgba(251,191,36,0.08);padding:10px 12px;border-radius:8px;margin-bottom:6px;border-left:3px solid #fbbf24;">
        <strong style="color:#fbbf24;">📊 <mark class="hl-gold">Index Funds</mark>:</strong> Automatically tracks a stock index like Nifty 50 or Sensex. Ultra-low expense ratio (0.1%–0.2%) and zero human bias. Excellent for beginners!
      </div>
      <div style="background:rgba(52,211,153,0.08);padding:10px 12px;border-radius:8px;border-left:3px solid #34d399;">
        <strong style="color:#34d399;">📑 <mark class="hl-emerald">ELSS</mark> (Equity Linked Savings Scheme):</strong> Tax-saving equity fund under Section 80C (save up to ₹46,800 tax/year). Has a <strong>3-year lock-in period</strong> (the shortest among all 80C options!).
      </div>
    </div>
    <div class="sip-choice-row">
      <button class="sip-choice-btn primary" onclick="window.saashyaNextStep()">Understood Fund Types! ➔</button>
      <button class="sip-choice-btn" onclick="window.saashyaExplainAgain('ELSS Tax Saving')">🔄 Explain ELSS again</button>
      <button class="sip-choice-btn" onclick="window.toggleSaashyaVoiceInput()">🎙️ Ask Saashya</button>
    </div>
  </div>`,

  // Step 8: Understanding SIP (Systematic Investment Plan)
  `<div>
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
      <span style="background:rgba(52,211,153,0.15);color:#34d399;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:700;">4. What is SIP?</span>
      <span style="font-size:13px;color:var(--gold-soft);">SIP vs Lump Sum</span>
    </div>
    <p><strong><mark class="hl-gold">SIP</mark> (Systematic Investment Plan)</strong> is a method of investing a fixed small amount (e.g. ₹500, ₹1,000, ₹5,000) into a mutual fund automatically every month on a date you choose.</p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:8px 0;font-size:13px;">
      <div style="background:rgba(255,255,255,0.04);padding:10px;border-radius:8px;border-left:3px solid #fbbf24;">
        <strong>📅 <mark class="hl-gold">SIP</mark> (Regular)</strong>
        <p>Small monthly auto-debit. No need to time the market. Disciplined & stress-free!</p>
      </div>
      <div style="background:rgba(255,255,255,0.04);padding:10px;border-radius:8px;border-left:3px solid #a78bfa;">
        <strong>💰 Lump Sum (One-time)</strong>
        <p>Investing a large sum at once (e.g. ₹1 Lakh). High risk if invested right before a market dip.</p>
      </div>
    </div>
  </div>`,

  // Step 9: Rupee Cost Averaging - The SIP Superpower & Checkpoint
  `<div>
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
      <span style="background:rgba(167,139,250,0.15);color:#a78bfa;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:700;">SIP Superpower</span>
      <span style="font-size:13px;color:var(--gold-soft);">Rupee Cost Averaging</span>
    </div>
    <p>How does SIP protect you from market crashes? Through <mark class="hl-purple">Rupee Cost Averaging</mark>!</p>
    <div class="sip-analogy-box" style="font-size:13.5px;">
      📉 <strong>When the market crashes:</strong> NAV drops, so your ₹1,000 buys <em>MORE units</em>!<br>
      📈 <strong>When the market rises:</strong> NAV goes up, so your ₹1,000 buys <em>FEWER units</em>.<br>
      ✨ Over time, your average purchase cost stays low automatically without you ever needing to guess market highs or lows!
    </div>
    <div class="sip-choice-row">
      <button class="sip-choice-btn primary" onclick="window.saashyaNextStep()">Love Rupee Cost Averaging! ➔</button>
      <button class="sip-choice-btn" onclick="window.saashyaExplainAgain('Rupee Cost Averaging')">🔄 Explain Chocolate Example</button>
      <button class="sip-choice-btn" onclick="window.toggleSaashyaVoiceInput()">🎙️ Ask Saashya</button>
    </div>
  </div>`,

  // Step 10: Power of Compounding & Long-Term Wealth & Checkpoint
  `<div>
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
      <span style="background:rgba(52,211,153,0.15);color:#34d399;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:700;">Compounding Power</span>
      <span style="font-size:13px;color:var(--gold-soft);">The 8th Wonder</span>
    </div>
    <p><mark class="hl-emerald">Compounding</mark> is earning returns on your returns!</p>
    <div class="sip-example-box" style="font-size:13.5px;">
      <strong>📈 Real Example (₹2,000/month SIP at 12% return):</strong><br>
      • <strong>10 Years:</strong> You invest ₹2.4 Lakhs ➔ Grows to <strong>₹4.6 Lakhs</strong><br>
      • <strong>20 Years:</strong> You invest ₹4.8 Lakhs ➔ Grows to <strong>₹20.0 Lakhs</strong><br>
      • <strong>30 Years:</strong> You invest ₹7.2 Lakhs ➔ Explodes to <strong>₹70.6 Lakhs!</strong><br>
      <em>Notice how growth skyrockets in the last 10 years! Time in the market beats timing the market.</em>
    </div>
    <div class="sip-choice-row">
      <button class="sip-choice-btn primary" onclick="window.saashyaNextStep()">Compounding makes sense! ➔</button>
      <button class="sip-choice-btn" onclick="window.saashyaExplainAgain('Compounding')">🔄 Explain compounding again</button>
      <button class="sip-choice-btn" onclick="window.toggleSaashyaVoiceInput()">🎙️ Ask Saashya</button>
    </div>
  </div>`,

  // Step 11: Key Terms 1 - CAGR, XIRR, Expense Ratio
  `<div>
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
      <span style="background:rgba(251,191,36,0.15);color:#fbbf24;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:700;">5. Key Terms</span>
      <span style="font-size:13px;color:var(--gold-soft);">CAGR, XIRR & Expense Ratio</span>
    </div>
    <ul style="font-size:13.5px;line-height:1.6;margin:4px 0 0 16px;">
      <li><strong><mark class="hl-gold">CAGR</mark> (Compound Annual Growth Rate):</strong> Annualized growth rate of a one-time lump sum investment. <em>(E.g., ₹10,000 to ₹14,400 in 2 yrs = 20% CAGR)</em></li>
      <li><strong><mark class="hl-emerald">XIRR</mark> (Extended Internal Rate of Return):</strong> The true return metric for <strong>SIPs</strong> that accounts for multiple monthly cashflows at different dates.</li>
      <li><strong><mark class="hl-purple">Expense Ratio</mark>:</strong> The annual fee (0.1%–1.5%) charged by the AMC to manage the fund. Lower expense ratio = higher net wealth for you!</li>
    </ul>
  </div>`,

  // Step 12: Key Terms 2 - Exit Load, Lock-in, Diversification, Asset Allocation
  `<div>
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
      <span style="background:rgba(52,211,153,0.15);color:#34d399;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:700;">Key Terms</span>
      <span style="font-size:13px;color:var(--gold-soft);">Protection & Allocation</span>
    </div>
    <ul style="font-size:13.5px;line-height:1.6;margin:4px 0 0 16px;">
      <li><strong><mark class="hl-coral">Exit Load</mark>:</strong> A small fee (e.g. 1%) charged if you redeem units early (usually within 1 year). Encourages long-term holding.</li>
      <li><strong>Lock-in Period:</strong> Time during which funds cannot be withdrawn (e.g., 3 years for ELSS tax-saving funds).</li>
      <li><strong><mark class="hl-purple">Diversification</mark>:</strong> "Don't put all eggs in one basket." Spreading investments across sectors (IT, Banking, Pharma) so one company's drop doesn't hurt you.</li>
      <li><strong><mark class="hl-emerald">Asset Allocation</mark>:</strong> Balancing your portfolio between Equity (Growth) and Debt (Safety) according to your age and risk capacity.</li>
    </ul>
  </div>`,

  // Step 13: Key Terms 3 - Risk Appetite, Caps, Direct vs Regular, Growth vs IDCW & Checkpoint
  `<div>
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
      <span style="background:rgba(167,139,250,0.15);color:#a78bfa;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:700;">Key Terms</span>
      <span style="font-size:13px;color:var(--gold-soft);">Market Caps & Plan Options</span>
    </div>
    <ul style="font-size:13.5px;line-height:1.6;margin:4px 0 0 16px;">
      <li><strong>Large, Mid & Small Cap:</strong> Large Cap = Top 100 steady giants (Reliance). Mid Cap = 101–250 fast growers. Small Cap = 251+ high growth, high risk.</li>
      <li><strong><mark class="hl-gold">Direct Plan</mark> vs Regular Plan:</strong> <em>Direct Plans</em> have NO distributor commission (higher returns). <em>Regular Plans</em> pay ~1% annual commission to agents. Always pick <strong>Direct</strong>!</li>
      <li><strong>Growth vs IDCW:</strong> <em>Growth Option</em> reinvests profits to compound. <em>IDCW (Dividend)</em> pays out dividends periodically. Choose <strong>Growth</strong> for wealth building!</li>
    </ul>
    <div class="sip-choice-row">
      <button class="sip-choice-btn primary" onclick="window.saashyaNextStep()">Key Terms Clear! ➔</button>
      <button class="sip-choice-btn" onclick="window.saashyaExplainAgain('Direct vs Regular')">🔄 Direct vs Regular Plan</button>
      <button class="sip-choice-btn" onclick="window.toggleSaashyaVoiceInput()">🎙️ Ask Saashya</button>
    </div>
  </div>`,

  // Step 14: Choosing the Right Mutual Fund (Personalized Recommendation)
  function(){
    const name = userProfile.fullName || 'Investor';
    const prof = userProfile.profession || 'Professional';
    const goal = userProfile.goal || 'Wealth Creation';
    const recs = getRecommendedFundCategories(userProfile);
    return `<div>
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
        <span style="background:rgba(251,191,36,0.15);color:#fbbf24;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:700;">6. Fund Selection</span>
        <span style="font-size:13px;color:var(--gold-soft);">Personalised Profile Match</span>
      </div>
      <p style="font-size:14px;">Based on your onboarding profile (<strong>${name}</strong>, ${prof}, Goal: <em>${goal}</em>):</p>
      <div style="background:rgba(251,191,36,0.08);border:1px solid rgba(251,191,36,0.2);padding:12px;border-radius:10px;margin:8px 0;font-size:13px;line-height:1.55;">
        <div><strong>🏆 Recommended Categories for You:</strong></div>
        <div>• <strong>Primary Focus (${recs.horizon}):</strong> ${recs.primaryCategory}</div>
        <div>• <strong>Tax Saving:</strong> ${recs.taxSaver}</div>
        <div>• <strong>Short Term / Safety:</strong> ${recs.emergencyOption}</div>
      </div>
      <p style="font-size:11.5px;color:var(--muted);margin-top:2px;"><em>*Educational simulation only. Not SEBI financial advice.</em></p>
    </div>`;
  },

  // Step 15: Popular Mutual Fund Categories in India
  `<div>
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
      <span style="background:rgba(52,211,153,0.15);color:#34d399;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:700;">Popular Funds</span>
      <span style="font-size:13px;color:var(--gold-soft);">Indian Market Favorites</span>
    </div>
    <div style="font-size:13px;display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:6px 0;">
      <div style="background:rgba(255,255,255,0.04);padding:8px 10px;border-radius:8px;">
        <strong style="color:#34d399;">Large Cap Funds</strong>
        <div>Risk: Low–Mod | Horizon: 3-5 yrs</div>
        <div>Invests in India's top 100 companies. Steady & reliable.</div>
      </div>
      <div style="background:rgba(255,255,255,0.04);padding:8px 10px;border-radius:8px;">
        <strong style="color:#a78bfa;">Flexi Cap Funds</strong>
        <div>Risk: Moderate | Horizon: 5+ yrs</div>
        <div>Fund manager switches between Large, Mid & Small cap dynamically.</div>
      </div>
    </div>
    <div style="font-size:13px;background:rgba(255,255,255,0.04);padding:8px 10px;border-radius:8px;">
      <strong style="color:#fbbf24;">Balanced Advantage Funds (BAF)</strong>
      <div>Risk: Moderate | Automatically adjusts equity/debt allocation based on market valuation. Smooth ride!</div>
    </div>
  </div>`,

  // Step 16: How Much Should I Invest? (50:30:20 Rule & Step-Up SIP) & Checkpoint
  function(){
    const sipData = calculateRecommendedSipAmount(userProfile.monthlyIncome);
    return `<div>
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
        <span style="background:rgba(52,211,153,0.15);color:#34d399;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:700;">7. SIP Amount</span>
        <span style="font-size:13px;color:var(--gold-soft);">50:30:20 Rule & Step-Up</span>
      </div>
      <p style="font-size:14px;">Using the <strong>50:30:20 Budgeting Rule</strong> (50% Needs, 30% Wants, 20% Savings/SIP):</p>
      <div class="sip-example-box" style="font-size:13.5px;margin:6px 0;">
        💡 On your monthly income of <strong>₹${sipData.monthlyIncome.toLocaleString('en-IN')}</strong>, we recommend starting a monthly <mark class="hl-gold">SIP</mark> of <strong>₹${sipData.recommendedSip.toLocaleString('en-IN')}</strong>!
      </div>
      <p style="font-size:13px;"><strong>🚀 Step-Up SIP Magic:</strong> Increasing your SIP by just 10% every year as your income grows can <strong>DOUBLE</strong> your final wealth compared to keeping it flat!</p>
      <div class="sip-choice-row">
        <button class="sip-choice-btn primary" onclick="window.saashyaNextStep()">Show Launch Steps! ➔</button>
        <button class="sip-choice-btn" onclick="window.saashyaExplainAgain('Step-Up SIP')">🔄 Explain Step-Up SIP</button>
        <button class="sip-choice-btn" onclick="window.toggleSaashyaVoiceInput()">🎙️ Ask Saashya</button>
      </div>
    </div>`;
  },

  // Step 17: How to Start an SIP (7 Step Roadmap)
  `<div>
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
      <span style="background:rgba(167,139,250,0.15);color:#a78bfa;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:700;">8. How to Start</span>
      <span style="font-size:13px;color:var(--gold-soft);">7-Step Launch Checklist</span>
    </div>
    <ol style="font-size:13px;line-height:1.5;margin:4px 0 0 16px;">
      <li><strong>Complete KYC:</strong> PAN, Aadhaar & video verification.</li>
      <li><strong>Choose Platform:</strong> Trusted AMC app or Direct MF platform.</li>
      <li><strong>Select Fund:</strong> Direct Plan, Growth Option.</li>
      <li><strong>Set SIP Amount:</strong> Start comfortable (e.g. ₹500 or ₹1,000).</li>
      <li><strong>Choose SIP Date:</strong> Right after salary (e.g., 5th of month).</li>
      <li><strong>Enable AutoPay:</strong> e-NACH mandate for hassle-free debits.</li>
      <li><strong>Review Yearly:</strong> Check performance once a year!</li>
    </ol>
  </div>`,

  // Step 18: Common Mistakes to Avoid
  `<div>
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
      <span style="background:rgba(251,113,133,0.15);color:#fb7185;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:700;">9. Mistakes to Avoid</span>
      <span style="font-size:13px;color:#fb7185;font-weight:700;">5 Pitfalls</span>
    </div>
    <div style="font-size:13px;line-height:1.5;">
      <div>❌ <strong>Stopping SIPs in crashes:</strong> Market dips are sales! Stopping means missing cheap units.</div>
      <div>❌ <strong>Chasing 1-year returns:</strong> Past 1-year winners often underperform next year.</div>
      <div>❌ <strong>No emergency fund:</strong> Keep 3–6 months expenses in savings before equity investing.</div>
      <div>❌ <strong>Timing the market:</strong> Waiting for dips loses valuable compounding time.</div>
      <div>❌ <strong>Over-diversifying:</strong> 3–4 good funds are more than enough.</div>
    </div>
  </div>`,

  // Step 19: Transition to Simulation
  `<div>
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
      <span style="background:rgba(52,211,153,0.15);color:#34d399;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:700;">10. Ready to Invest!</span>
      <span style="font-size:13px;color:var(--gold-soft);">Branch Simulation</span>
    </div>
    <p style="font-size:14.5px;line-height:1.55;"><strong>🌟 Incredible!</strong> You have now mastered mutual fund concepts, risk levels, compounding, and key terms better than 90% of retail investors.</p>
    <p style="font-size:13.5px;margin-top:6px;">You are now fully prepared to walk into our 2D SBI Branch Simulation, complete your registration step-by-step, and test your live compounding returns!</p>
  </div>`
];
