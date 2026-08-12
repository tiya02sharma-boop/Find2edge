/**
 * Auth Service
 * Talks to /api/auth and /api/profile on the backend, and keeps the
 * session token + current user in memory (token also persisted so a
 * refresh doesn't sign the user out).
 */

const TOKEN_KEY = 'fin2edge-token';

let currentUser = null;

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function getCurrentUser() {
  return currentUser;
}

async function apiRequest(path, options = {}) {
  const token = getToken();
  const res = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.');
  return data;
}

export async function registerUser(fields) {
  const data = await apiRequest('/api/auth/register', { method: 'POST', body: JSON.stringify(fields) });
  setToken(data.token);
  currentUser = data.user;
  return data.user;
}

export async function loginUser(email, password) {
  const data = await apiRequest('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  setToken(data.token);
  currentUser = data.user;
  return data.user;
}

export async function fetchCurrentUser() {
  if (!getToken()) return null;
  try {
    const data = await apiRequest('/api/auth/me');
    currentUser = data.user;
    return data.user;
  } catch {
    // Token expired/invalid — clear it so we don't keep retrying.
    setToken(null);
    currentUser = null;
    return null;
  }
}

export async function updateProfile(fields) {
  const data = await apiRequest('/api/profile', { method: 'PUT', body: JSON.stringify(fields) });
  if (currentUser) currentUser.profile = data.profile;
  return data.profile;
}

export function logoutUser() {
  setToken(null);
  currentUser = null;
}

export function isLoggedIn() {
  return Boolean(getToken() && currentUser);
}