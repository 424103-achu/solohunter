-- Migration 006: Stats, Skills tables
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
  last_active_date DATE
);

CREATE INDEX IF NOT EXISTS idx_user_stats_user ON user_stats(user_id);

CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  max_level INTEGER DEFAULT 5,
  unlock_cost INTEGER DEFAULT 1,
  niche_id UUID REFERENCES niches(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_skills_niche ON skills(niche_id);

CREATE TABLE IF NOT EXISTS user_skills (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE NOT NULL,
  current_level INTEGER DEFAULT 0,
  PRIMARY KEY (user_id, skill_id)
);

CREATE TABLE IF NOT EXISTS daily_quest_progress (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  quest_id UUID REFERENCES quests(id) ON DELETE CASCADE,
  assigned_date DATE DEFAULT CURRENT_DATE,
  completed BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (user_id, quest_id, assigned_date)
);

CREATE TABLE IF NOT EXISTS ai_generation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  niche_id UUID,
  prompt TEXT,
  response TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_users_timestamp ON users;
CREATE TRIGGER trigger_update_users_timestamp
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trigger_update_stats_timestamp ON user_stats;
CREATE TRIGGER trigger_update_stats_timestamp
  BEFORE UPDATE ON user_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();
