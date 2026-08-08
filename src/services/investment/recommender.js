/**
 * Investment Recommendation Engine
 * Recommends mutual fund categories and appropriate SIP amounts based on onboarding data.
 */

import { userProfile } from '../user/userService.js';

export function getRecommendedFundCategories(profile = userProfile) {
  const goal = (profile.goal || '').toLowerCase();
  const experience = (profile.experience || '').toLowerCase();
  const income = Number.isFinite(profile.monthlyIncome) ? profile.monthlyIncome : 25000;

  const recommendations = {
    primaryCategory: 'Flexi Cap Fund',
    reasoning: 'Provides a balanced mix across Large, Mid, and Small cap companies.',
    taxSaver: 'ELSS Mutual Fund (Section 80C)',
    emergencyOption: 'Liquid / Low Duration Debt Fund',
    horizon: '5+ Years'
  };

  if (goal.includes('tax')) {
    recommendations.primaryCategory = 'ELSS Tax Saver Fund';
    recommendations.reasoning = 'Saves up to ₹46,800 tax under Section 80C with a 3-year lock-in.';
    recommendations.horizon = '3+ Years';
  } else if (experience.includes('beginner') || income < 20000) {
    recommendations.primaryCategory = 'Large Cap Index Fund (Nifty 50)';
    recommendations.reasoning = 'Ultra-low cost (0.1% expense ratio) investing in India top 50 companies with zero manager bias.';
    recommendations.horizon = '3-5 Years';
  }

  return recommendations;
}

export function calculateRecommendedSipAmount(income = userProfile.monthlyIncome) {
  const monthlyInc = Number.isFinite(income) ? income : 25000;
  // Apply 50:30:20 Rule (20% to savings/SIP)
  const baseSip = Math.max(500, Math.round(monthlyInc * 0.2 / 500) * 500);
  return {
    monthlyIncome: monthlyInc,
    recommendedSip: baseSip,
    needs: monthlyInc * 0.5,
    wants: monthlyInc * 0.3,
    savings: monthlyInc * 0.2
  };
}

export function projectSipGrowth(monthlySip, annualReturnRate = 0.12, years = 10) {
  const months = years * 12;
  const r = annualReturnRate / 12;
  let value = 0;
  for (let i = 0; i < months; i++) {
    value = (value + monthlySip) * (1 + r);
  }
  const invested = monthlySip * months;
  return {
    invested: Math.round(invested),
    projectedValue: Math.round(value),
    growth: Math.round(value - invested)
  };
}
