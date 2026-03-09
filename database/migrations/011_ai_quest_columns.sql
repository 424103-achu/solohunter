-- Add language and generated_for_user_id columns to quests table
-- language: which language a Groq-generated quest is written in
-- generated_for_user_id: links a daily AI quest to the specific user it was generated for

ALTER TABLE quests ADD COLUMN IF NOT EXISTS language VARCHAR(50) DEFAULT NULL;
ALTER TABLE quests ADD COLUMN IF NOT EXISTS generated_for_user_id UUID REFERENCES users(id) ON DELETE CASCADE DEFAULT NULL;

CREATE INDEX IF NOT EXISTS idx_quests_generated_user ON quests(generated_for_user_id);
CREATE INDEX IF NOT EXISTS idx_quests_language ON quests(language);
