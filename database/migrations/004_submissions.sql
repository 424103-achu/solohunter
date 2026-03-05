-- Migration 004: Submissions table
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

CREATE INDEX IF NOT EXISTS idx_submissions_user ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_quest ON submissions(quest_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
