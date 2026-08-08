/**
 * User Profile Service
 * Manages user profile state, onboarding data, income, risk appetite, and goals.
 */

const USER_PROFILE_KEY = 'fin2edge-user-profile';

export let userProfile = {
  isLoggedIn: false,
  fullName: '',
  email: '',
  avatar: '👑',
  goal: 'Wealth Creation & Growth',
  experience: 'Beginner Investor',
  age: 24,
  profession: 'Student',
  monthlyIncome: 25000,
  createdAt: null
};

export function loadUserProfile() {
  try {
    const raw = localStorage.getItem(USER_PROFILE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        userProfile = Object.assign(userProfile, parsed);
      }
    }
  } catch (e) {
    console.warn('Could not load user profile', e);
  }
  return userProfile;
}

export function saveUserProfile(updatedData) {
  userProfile = Object.assign(userProfile, updatedData);
  try {
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(userProfile));
  } catch (e) {
    console.warn('Could not save user profile', e);
  }
  return userProfile;
}

export function getUserContextForPrompt() {
  const inc = Number.isFinite(userProfile.monthlyIncome) ? userProfile.monthlyIncome : 25000;
  return `User Profile Context:
- Name: ${userProfile.fullName || 'Investor'}
- Profession: ${userProfile.profession || 'Student'}
- Monthly Income: ₹${inc.toLocaleString('en-IN')}
- Financial Goal: ${userProfile.goal || 'Wealth Creation'}
- Experience Level: ${userProfile.experience || 'Beginner'}`;
}
