-- Migration 008: Add test_cases and starter_code columns to quests
-- Enables local code evaluation without Gemini AI

ALTER TABLE quests ADD COLUMN IF NOT EXISTS test_cases JSONB DEFAULT NULL;
ALTER TABLE quests ADD COLUMN IF NOT EXISTS starter_code TEXT DEFAULT NULL;

-- Update schema.sql comment: test_cases is an array of {input, expected_output, description}
