import { Router } from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();
router.use(requireAuth);

router.get('/', (req, res) => {
  const profile = db.prepare('SELECT * FROM profiles WHERE user_id = ?').get(req.user.id);
  res.json({ profile });
});

router.put('/', (req, res) => {
  const { avatar, age, goal, experience, profession, monthlyIncome, personalGoals, ambitions, fiveYearPlan } = req.body;
  db.prepare(`
    UPDATE profiles SET
      avatar = COALESCE(?, avatar),
      age = COALESCE(?, age),
      goal = COALESCE(?, goal),
      experience = COALESCE(?, experience),
      profession = COALESCE(?, profession),
      monthly_income = COALESCE(?, monthly_income),
      personal_goals = COALESCE(?, personal_goals),
      ambitions = COALESCE(?, ambitions),
      five_year_plan = COALESCE(?, five_year_plan),
      updated_at = CURRENT_TIMESTAMP
    WHERE user_id = ?
  `).run(avatar, age, goal, experience, profession, monthlyIncome, personalGoals, ambitions, fiveYearPlan, req.user.id);

  const profile = db.prepare('SELECT * FROM profiles WHERE user_id = ?').get(req.user.id);
  res.json({ profile });
});

export default router;