import Database from 'better-sqlite3';

const db = new Database('data.db');
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS profiles (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    avatar TEXT DEFAULT '👑',
    age INTEGER,
    goal TEXT,
    experience TEXT,
    profession TEXT,
    monthly_income INTEGER,
    personal_goals TEXT,
    ambitions TEXT,
    five_year_plan TEXT,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

export default db;