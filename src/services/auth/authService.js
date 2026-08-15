/**
 * Auth Service
 * Same public API as before (registerUser, loginUser, fetchCurrentUser,
 * updateProfile, logoutUser, isLoggedIn, getCurrentUser) so
 * authPortalController.js doesn't need to change — but now backed by
 * Supabase Auth + the `profiles` table instead of the old Express/JWT
 * backend and better-sqlite3.
 */
import { supabase } from '../../config/supabaseClient.js';

let currentUser = null;

// Builds the same { id, full_name, email, created_at, profile } shape the
// old backend used to return, from a Supabase auth user + profiles row.
function toAppUser(authUser, profileRow) {
  if (!authUser) return null;
  return {
    id: authUser.id,
    full_name: profileRow?.full_name || authUser.user_metadata?.full_name || '',
    email: authUser.email,
    created_at: authUser.created_at,
    profile: profileRow || null
  };
}

async function fetchProfileRow(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export function getCurrentUser() {
  return currentUser;
}

export async function registerUser(fields) {
  const { fullName, email, password, avatar, age, goal, experience, profession,
    monthlyIncome, personalGoals, ambitions, fiveYearPlan } = fields;

  // Extra profile fields ride along as user_metadata; the on_auth_user_created
  // trigger (sql/001_profiles_and_auth.sql) reads them and creates the
  // matching row in `profiles` automatically.
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        avatar, age, goal, experience, profession,
        monthly_income: monthlyIncome,
        personal_goals: personalGoals,
        ambitions,
        five_year_plan: fiveYearPlan
      }
    }
  });
  if (error) throw new Error(error.message);

  // If email confirmation is required in your Supabase auth settings,
  // data.session will be null here — there's no session yet to fetch a
  // profile with, so return what we know and let fetchCurrentUser() pick
  // it up once they've confirmed and signed in.
  if (!data.session) {
    currentUser = toAppUser(data.user, null);
    return currentUser;
  }

  const profile = await fetchProfileRow(data.user.id);
  currentUser = toAppUser(data.user, profile);
  return currentUser;
}

export async function loginUser(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);

  const profile = await fetchProfileRow(data.user.id);
  currentUser = toAppUser(data.user, profile);
  return currentUser;
}

export async function fetchCurrentUser() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    currentUser = null;
    return null;
  }
  try {
    const profile = await fetchProfileRow(session.user.id);
    currentUser = toAppUser(session.user, profile);
    return currentUser;
  } catch {
    currentUser = null;
    return null;
  }
}

export async function updateProfile(fields) {
  if (!currentUser) throw new Error('Not signed in.');
  const { avatar, age, goal, experience, profession, monthlyIncome,
    personalGoals, ambitions, fiveYearPlan } = fields;

  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...(avatar !== undefined && { avatar }),
      ...(age !== undefined && { age }),
      ...(goal !== undefined && { goal }),
      ...(experience !== undefined && { experience }),
      ...(profession !== undefined && { profession }),
      ...(monthlyIncome !== undefined && { monthly_income: monthlyIncome }),
      ...(personalGoals !== undefined && { personal_goals: personalGoals }),
      ...(ambitions !== undefined && { ambitions }),
      ...(fiveYearPlan !== undefined && { five_year_plan: fiveYearPlan })
    })
    .eq('id', currentUser.id)
    .select()
    .single();
  if (error) throw new Error(error.message);

  currentUser.profile = data;
  return data;
}

export async function logoutUser() {
  await supabase.auth.signOut();
  currentUser = null;
}

export function isLoggedIn() {
  return Boolean(currentUser);
}