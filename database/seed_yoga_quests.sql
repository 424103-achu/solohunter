-- Yoga quests seed (traditional Indian yoga techniques)
INSERT INTO quests (title, description, difficulty, xp_reward, skill_reward, quest_type, is_active) VALUES

-- Easy
('Anulom Vilom Pranayama', 'Practice Anulom Vilom (alternate nostril breathing) for 10 minutes. Close right nostril, inhale through left. Close left, exhale through right. Reverse and repeat. Purifies the nadis and calms the mind.', 'easy', 30, 2, 'yoga', TRUE),
('Kapalbhati Pranayama', 'Perform Kapalbhati (skull-shining breath) for 5 minutes. Sit in Sukhasana, take a deep inhale, then forcefully exhale through the nose while pulling the abdomen in sharply. Cleanses the respiratory system and energises the body.', 'easy', 30, 2, 'yoga', TRUE),
('Surya Namaskar — 5 Rounds', 'Perform 5 complete rounds of Surya Namaskar (Sun Salutation) — all 12 poses per round. Synchronise every movement with your breath. The ancient greeting to the sun that works your entire body.', 'easy', 35, 2, 'yoga', TRUE),
('Sukhasana Meditation', 'Sit in Sukhasana (easy cross-legged pose) for 10 minutes. Keep the spine erect, hands on knees in Gyan Mudra (index finger and thumb touching). Focus only on natural breathing. Pure stillness.', 'easy', 25, 2, 'yoga', TRUE),

-- Medium
('Sarvangasana & Halasana', 'Practice Sarvangasana (Shoulder Stand) for 3 minutes followed by Halasana (Plough Pose) for 2 minutes. These inversions stimulate the thyroid, improve circulation, and calm the nervous system. Come out slowly.', 'medium', 50, 3, 'yoga', TRUE),
('Bhujangasana to Dhanurasana Flow', 'Perform Bhujangasana (Cobra Pose) for 1 minute, then Shalabhasana (Locust Pose) for 1 minute, then Dhanurasana (Bow Pose) for 1 minute. Hold each, release, and repeat the cycle twice. Strengthens the entire spine.', 'medium', 55, 3, 'yoga', TRUE),
('Trikonasana & Virabhadrasana', 'Hold Trikonasana (Triangle Pose) for 5 breaths each side, then flow into Virabhadrasana I and II (Warrior I and II) for 5 breaths each. These standing poses build stability, open the hips, and sharpen focus.', 'medium', 50, 3, 'yoga', TRUE),
('Bhramari Pranayama', 'Practice Bhramari (humming bee breath) for 10 minutes. Sit in Padmasana or Sukhasana. After a deep inhale, close your ears with thumbs, eyes with fingers, and exhale with a deep humming sound. Reduces anxiety and calms the mind deeply.', 'medium', 45, 3, 'yoga', TRUE),

-- Hard
('Padmasana to Shirshasana', 'Begin in Padmasana (Lotus Pose) for 5 minutes of pranayama, then attempt Shirshasana (Headstand — use a wall if needed) for 3 minutes. The king of all asanas. Requires full focus, core strength, and breath control.', 'hard', 80, 5, 'yoga', TRUE),
('Surya Namaskar — 12 Rounds', 'Complete 12 continuous rounds of Surya Namaskar without rest. Each of the 12 rounds corresponds to one of the 12 names of the Sun. Maintain rhythmic breathing throughout. A complete full-body practice used by ancient Indian ascetics.', 'hard', 90, 5, 'yoga', TRUE),
('Pancha Kosha Sadhana', 'A 20-minute full traditional sequence: 5 min Kapalbhati, 5 min Anulom Vilom, 5 min Nadi Shodhan Pranayama, and 5 min Shavasana (complete stillness). Systematically purifies all five layers of the body — the Pancha Kosha.', 'hard', 95, 6, 'yoga', TRUE);
