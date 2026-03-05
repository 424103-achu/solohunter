-- Solo Hunter RPG - Complete Database Schema
-- PostgreSQL (matches actual DB)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  rank VARCHAR(10) DEFAULT 'E',
  skill_points INTEGER DEFAULT 0,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- NICHES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS niches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_by UUID REFERENCES users(id) ON DELETE CASCADE,
  is_public BOOLEAN DEFAULT TRUE,
  difficulty_preference VARCHAR(20) DEFAULT 'medium',
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- USER NICHES (join table)
-- ============================================
CREATE TABLE IF NOT EXISTS user_niches (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  niche_id UUID REFERENCES niches(id) ON DELETE CASCADE,
  skill_level INTEGER DEFAULT 1,
  PRIMARY KEY (user_id, niche_id)
);

-- ============================================
-- NICHE TAGS
-- ============================================
CREATE TABLE IF NOT EXISTS niche_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  niche_id UUID REFERENCES niches(id) ON DELETE CASCADE,
  tag VARCHAR(100)
);

-- ============================================
-- USER STATS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_stats (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  total_quests_completed INTEGER DEFAULT 0,
  total_submissions INTEGER DEFAULT 0,
  coding_quests_completed INTEGER DEFAULT 0,
  fitness_quests_completed INTEGER DEFAULT 0,
  boss_quests_completed INTEGER DEFAULT 0,
  boost_quests_completed INTEGER DEFAULT 0,
  fun_quests_completed INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_active_date DATE,
  strength INTEGER DEFAULT 1,
  intelligence INTEGER DEFAULT 1,
  agility INTEGER DEFAULT 1
);

-- ============================================
-- QUESTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  difficulty VARCHAR(20) NOT NULL,
  xp_reward INTEGER NOT NULL DEFAULT 50,
  skill_reward INTEGER DEFAULT 0,
  quest_type VARCHAR(30) NOT NULL,
  niche_id UUID REFERENCES niches(id) ON DELETE SET NULL,
  is_ai_generated BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  test_cases JSONB DEFAULT NULL,
  starter_code TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- SUBMISSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  quest_id UUID REFERENCES quests(id) ON DELETE CASCADE NOT NULL,
  code TEXT NOT NULL,
  language VARCHAR(30) NOT NULL DEFAULT 'javascript',
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  score INTEGER DEFAULT 0,
  execution_time DOUBLE PRECISION,
  memory_used DOUBLE PRECISION,
  submitted_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- SKILLS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  max_level INTEGER DEFAULT 5,
  unlock_cost INTEGER DEFAULT 1,
  niche_id UUID REFERENCES niches(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- USER SKILLS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_skills (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE NOT NULL,
  current_level INTEGER DEFAULT 0,
  PRIMARY KEY (user_id, skill_id)
);

-- ============================================
-- BADGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon_url TEXT,
  requirement_type VARCHAR(100),
  requirement_value INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- USER BADGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_badges (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  badge_id UUID REFERENCES badges(id) ON DELETE CASCADE NOT NULL,
  earned_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, badge_id)
);

-- ============================================
-- DAILY QUEST PROGRESS
-- ============================================
CREATE TABLE IF NOT EXISTS daily_quest_progress (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  quest_id UUID REFERENCES quests(id) ON DELETE CASCADE,
  assigned_date DATE DEFAULT CURRENT_DATE,
  completed BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (user_id, quest_id, assigned_date)
);

-- ============================================
-- AI GENERATION LOGS
-- ============================================
CREATE TABLE IF NOT EXISTS ai_generation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  niche_id UUID,
  prompt TEXT,
  response TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_level ON users(level);
CREATE INDEX IF NOT EXISTS idx_users_xp ON users(xp);
CREATE INDEX IF NOT EXISTS idx_quests_difficulty ON quests(difficulty);
CREATE INDEX IF NOT EXISTS idx_quests_type ON quests(quest_type);
CREATE INDEX IF NOT EXISTS idx_quests_niche ON quests(niche_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_quest ON submissions(quest_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_user_stats_user ON user_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_skills_niche ON skills(niche_id);
