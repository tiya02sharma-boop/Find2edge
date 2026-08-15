import { supabaseAdmin } from '../src/config/supabaseAdmin.js';

// The frontend now signs in via Supabase directly, so any Express route
// that still needs to know who's calling should get the user's Supabase
// access token in Authorization: Bearer <token> and verify it here.
export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Not authenticated.' });

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data?.user) {
    return res.status(401).json({ error: 'Invalid or expired session. Please sign in again.' });
  }

  req.user = data.user; // { id, email, user_metadata, ... }
  next();
}