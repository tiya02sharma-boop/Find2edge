/**
 * Auth Portal Controller
 * Wires up the sign-in / create-profile modal that already exists in
 * index.html (#authPortal) to the real backend via authService.
 */

import { registerUser, loginUser, fetchCurrentUser, logoutUser, isLoggedIn, getCurrentUser } from '../../services/auth/authService.js';
import { saveUserProfile } from '../../services/user/userService.js';

let selectedAvatar = '👑';

function $(id) { return document.getElementById(id); }

function showPortal(mode = 'login') {
  $('authPortal').classList.add('show');
  setMode(mode);
}

function hidePortal() {
  $('authPortal').classList.remove('show');
}

function setMode(mode) {
  const isLogin = mode === 'login';
  $('authTabLogin').classList.toggle('active', isLogin);
  $('authTabRegister').classList.toggle('active', !isLogin);
  $('loginForm').classList.toggle('active', isLogin);
  $('registerForm').classList.toggle('active', !isLogin);
  $('loginError').textContent = '';
  $('registerError').textContent = '';
}

function syncProfileIntoLocalUserService(user) {
  // Keep the existing in-app userProfile (used by Saashya's prompt context,
  // dashboards, etc.) in sync with whatever the backend has for this user.
  const p = user.profile || {};
  saveUserProfile({
    isLoggedIn: true,
    fullName: user.full_name,
    email: user.email,
    avatar: p.avatar || '👑',
    goal: p.goal || 'Wealth Creation & Growth',
    experience: p.experience || 'Beginner Investor',
    age: p.age || 24,
    profession: p.profession || 'Student',
    monthlyIncome: p.monthly_income || 25000,
    personalGoals: p.personal_goals || '',
    ambitions: p.ambitions || '',
    fiveYearPlan: p.five_year_plan || '',
    createdAt: user.created_at
  });
}

function updateNavForUser(user) {
  const pill = $('navProfilePill');
  const signInBtn = $('navSignInBtn');
  if (user) {
    pill.style.display = '';
    $('navProfileAvatar').textContent = (user.profile && user.profile.avatar) || '👑';
    $('navProfileName').textContent = (user.full_name || '').split(' ')[0] || 'User';
    if (signInBtn) signInBtn.style.display = 'none';
  } else {
    pill.style.display = 'none';
    if (signInBtn) signInBtn.style.display = '';
  }
}

async function handleLogin(e) {
  e.preventDefault();
  const email = $('loginEmail').value.trim();
  const password = $('loginPassword').value;
  $('loginError').textContent = '';
  const btn = $('btnSubmitLogin');
  btn.disabled = true;
  try {
    const user = await loginUser(email, password);
    syncProfileIntoLocalUserService(user);
    updateNavForUser(user);
    hidePortal();
  } catch (err) {
    $('loginError').textContent = err.message;
  } finally {
    btn.disabled = false;
  }
}

async function handleRegister(e) {
  e.preventDefault();
  const errorEl = $('registerError');
  errorEl.textContent = '';

  const fields = {
    fullName: $('regFullName').value.trim(),
    email: $('regEmail').value.trim(),
    password: $('regPassword').value,
    avatar: selectedAvatar,
    age: Number($('regAge').value) || null,
    goal: $('regGoal').value,
    experience: $('regExperience').value,
    profession: $('regProfession').value,
    monthlyIncome: Number($('regMonthlyIncome').value) || null,
    personalGoals: $('regPersonalGoals').value.trim(),
    ambitions: $('regAmbitions').value.trim(),
    fiveYearPlan: $('regFiveYearPlan').value.trim()
  };

  const btn = $('btnSubmitRegister');
  btn.disabled = true;
  try {
    const user = await registerUser(fields);
    syncProfileIntoLocalUserService(user);
    updateNavForUser(user);
    hidePortal();
  } catch (err) {
    errorEl.textContent = err.message;
  } finally {
    btn.disabled = false;
  }
}

function wireAvatarSelector() {
  const selector = $('avatarSelector');
  if (!selector) return;
  selector.addEventListener('click', (e) => {
    const opt = e.target.closest('.avatar-opt');
    if (!opt) return;
    selector.querySelectorAll('.avatar-opt').forEach((el) => el.classList.remove('active'));
    opt.classList.add('active');
    selectedAvatar = opt.dataset.avatar || '👑';
  });
}

function wireTabsAndCloseButtons() {
  $('authTabLogin')?.addEventListener('click', () => setMode('login'));
  $('authTabRegister')?.addEventListener('click', () => setMode('register'));
  $('linkToRegister')?.addEventListener('click', (e) => { e.preventDefault(); setMode('register'); });
  $('linkToLogin')?.addEventListener('click', (e) => { e.preventDefault(); setMode('login'); });

  $('btnContinueExploring')?.addEventListener('click', hidePortal);
  $('btnContinueExploringLink')?.addEventListener('click', hidePortal);
  $('btnContinueExploringLink2')?.addEventListener('click', hidePortal);

  // Click on the dark backdrop (outside the card) also closes it.
  $('authPortal')?.addEventListener('click', (e) => {
    if (e.target.id === 'authPortal') hidePortal();
  });
}

function wireOpenTriggers() {
  $('navSignInBtn')?.addEventListener('click', () => showPortal('login'));
  $('navEnterBank')?.addEventListener('click', () => {
    if (!isLoggedIn()) showPortal('login'); else window.location.hash = '#exchange';
  });
  $('heroEnterBank')?.addEventListener('click', () => {
    if (!isLoggedIn()) showPortal('login'); else window.location.hash = '#exchange';
  });
}

function wireQuickDemo() {
  // Lets someone explore the product without creating a real account —
  // this stays purely local, no backend call.
  $('btnQuickDemo')?.addEventListener('click', () => {
    saveUserProfile({
      isLoggedIn: true,
      fullName: 'Aaradhya S.',
      email: 'demo@fin2edge.com',
      avatar: '👑',
      goal: 'Wealth Creation & Growth',
      experience: 'Beginner Investor',
      age: 24,
      profession: 'Student',
      monthlyIncome: 25000
    });
    updateNavForUser({ full_name: 'Aaradhya S.', profile: { avatar: '👑' } });
    hidePortal();
  });
}

function wireLogout() {
  $('btnOpenProgress')?.insertAdjacentHTML('afterend', '<button class="dropdown-item" id="btnLogout">Sign Out</button>');
  $('btnLogout')?.addEventListener('click', () => {
    logoutUser();
    updateNavForUser(null);
  });
}

export async function initAuthPortal() {
  $('loginForm')?.addEventListener('submit', handleLogin);
  $('registerForm')?.addEventListener('submit', handleRegister);
  wireAvatarSelector();
  wireTabsAndCloseButtons();
  wireOpenTriggers();
  wireQuickDemo();
  wireLogout();

  // If a session token is already saved, hydrate the nav without
  // forcing the user through the portal again.
  const user = await fetchCurrentUser();
  if (user) {
    syncProfileIntoLocalUserService(user);
    updateNavForUser(user);
  } else {
    updateNavForUser(null);
  }
}