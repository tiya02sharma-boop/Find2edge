/**
 * Formatter Utilities
 * Utility functions for currency formatting, numbers, and text cleaning.
 */

export function fmt(num) {
  if (num === undefined || num === null || isNaN(num)) return '₹0';
  return '₹' + Math.round(num).toLocaleString('en-IN');
}

export function fmtPercent(num) {
  if (num === undefined || num === null || isNaN(num)) return '0%';
  return (num * 100).toFixed(1) + '%';
}

export function stripHtml(html) {
  if (!html) return '';
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  // Remove choice rows or interactive buttons from plain text speech
  const choiceRows = tmp.querySelectorAll('.sip-choice-row, button');
  choiceRows.forEach(el => el.remove());
  return (tmp.textContent || tmp.innerText || '').replace(/[\n\r]+/g, ' ').replace(/\s+/g, ' ').trim();
}

export function highlightKeywords(text) {
  if (!text) return '';
  // Highlight important terms with styled mark tags
  return text
    .replace(/\b(SIP|Systematic Investment Plan)\b/g, '<mark class="hl-gold">$1</mark>')
    .replace(/\b(Mutual Fund|Mutual Funds)\b/g, '<mark class="hl-emerald">$1</mark>')
    .replace(/\b(NAV|Net Asset Value)\b/g, '<mark class="hl-purple">$1</mark>')
    .replace(/\b(Inflation)\b/gi, '<mark class="hl-coral">$1</mark>')
    .replace(/\b(Compounding|Compound)\b/gi, '<mark class="hl-emerald">$1</mark>')
    .replace(/\b(Diversification|Diversify)\b/gi, '<mark class="hl-purple">$1</mark>')
    .replace(/\b(CAGR|XIRR|ELSS|Expense Ratio)\b/g, '<mark class="hl-gold">$1</mark>');
}
