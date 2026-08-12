import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

function fullProfile(userId) {
  const user = db.prepare('SELECT id, full_name, email, created_at FROM users WHERE id = ?').get(userId);
  const profile = db.prepare('SELECT * FROM profiles WHERE user_id = ?').get(userId);
  return { ...user, profile };
}

// The register form collects the full profile in one step, so we create
// the user + profile together in a single transaction.
router.post('/register', async (req, res) => {
  const {
    fullName, email, password, avatar,
    age, goal, experience, profession, monthlyIncome,
    personalGoals, ambitions, fiveYearPlan
  } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ error: 'Full name, email and password are required.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) return res.status(409).json({ error: 'An account with that email already exists.' });

  const password_hash = await bcrypt.hash(password, 10);

  const createBoth = db.transaction(() => {
    const info = db.prepare('INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)')
      .run(fullName, email, password_hash);
    const userId = info.lastInsertRowid;
    db.prepare(`
      INSERT INTO profiles (user_id, avatar, age, goal, experience, profession, monthly_income, personal_goals, ambitions, five_year_plan)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(userId, avatar || '👑', age || null, goal || null, experience || null, profession || null,
      monthlyIncome || null, personalGoals || null, ambitions || null, fiveYearPlan || null);
    return userId;
  });

  try {
    const userId = createBoth();
    const user = fullProfile(userId);
    res.status(201).json({ token: signToken(user), user });
  } catch (err) {
    res.status(500).json({ error: 'Could not create your profile. Please try again.' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });

  const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!row) return res.status(401).json({ error: 'Invalid email or password.' });

  const valid = await bcrypt.compare(password, row.password_hash);
  if (!valid) return res.status(401).json({ error: 'Invalid email or password.' });

  const user = fullProfile(row.id);
  res.json({ token: signToken(user), user });
});

router.get('/me', requireAuth, (req, res) => {
  const user = fullProfile(req.user.id);
  if (!user.id) return res.status(404).json({ error: 'User not found.' });
  res.json({ user });
});

export default router;