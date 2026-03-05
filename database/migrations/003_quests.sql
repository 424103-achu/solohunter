-- Migration 003: Quests table
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
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quests_difficulty ON quests(difficulty);
CREATE INDEX IF NOT EXISTS idx_quests_type ON quests(quest_type);
CREATE INDEX IF NOT EXISTS idx_quests_niche ON quests(niche_id);
