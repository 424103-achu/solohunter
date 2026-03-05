-- Migration 002: Niches and user_niches tables
CREATE TABLE IF NOT EXISTS niches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_by UUID REFERENCES users(id) ON DELETE CASCADE,
  is_public BOOLEAN DEFAULT TRUE,
  difficulty_preference VARCHAR(20) DEFAULT 'medium',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_niches (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  niche_id UUID REFERENCES niches(id) ON DELETE CASCADE,
  skill_level INTEGER DEFAULT 1,
  PRIMARY KEY (user_id, niche_id)
);

CREATE TABLE IF NOT EXISTS niche_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  niche_id UUID REFERENCES niches(id) ON DELETE CASCADE,
  tag VARCHAR(100)
);
