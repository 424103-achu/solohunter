-- Migration: Add combat stats columns to user_stats
ALTER TABLE user_stats
  ADD COLUMN IF NOT EXISTS strength INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS intelligence INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS agility INTEGER DEFAULT 1;
