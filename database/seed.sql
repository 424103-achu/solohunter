-- Seed Data for Solo Hunter RPG
-- Uses UUIDs and matches actual DB schema

-- ============================================
-- NICHES
-- ============================================
INSERT INTO niches (name, description) VALUES
  ('Frontend', 'Master the art of building beautiful, responsive user interfaces'),
  ('Backend', 'Conquer server-side logic, APIs, and database mastery'),
  ('DSA', 'Data Structures & Algorithms — the core of competitive programming'),
  ('DevOps', 'Infrastructure, CI/CD, containers, and cloud deployment'),
  ('Full Stack', 'The complete warrior — front and back combined')
ON CONFLICT DO NOTHING;

-- ============================================
-- BADGES
-- ============================================
INSERT INTO badges (name, description, icon_url, requirement_type, requirement_value) VALUES
  ('First Blood', 'Complete your first quest', NULL, 'quests_completed', 1),
  ('Streak Starter', 'Maintain a 3-day streak', NULL, 'streak_days', 3),
  ('Week Warrior', 'Maintain a 7-day streak', NULL, 'streak_days', 7),
  ('Month Master', 'Maintain a 30-day streak', NULL, 'streak_days', 30),
  ('Level 10', 'Reach Level 10', NULL, 'level', 10),
  ('Level 25', 'Reach Level 25', NULL, 'level', 25),
  ('Level 50', 'Reach Level 50', NULL, 'level', 50),
  ('D-Rank Hunter', 'Achieve D Rank', NULL, 'rank', 11),
  ('C-Rank Hunter', 'Achieve C Rank', NULL, 'rank', 21),
  ('B-Rank Hunter', 'Achieve B Rank', NULL, 'rank', 36),
  ('A-Rank Hunter', 'Achieve A Rank', NULL, 'rank', 51),
  ('S-Rank Hunter', 'Achieve S Rank — The Shadow Monarch', NULL, 'rank', 76),
  ('Boss Slayer', 'Defeat your first Boss Quest', NULL, 'boss_defeated', 1),
  ('Century', 'Complete 100 quests', NULL, 'quests_completed', 100),
  ('Score Master', 'Earn 10000 total score', NULL, 'total_score', 10000)
ON CONFLICT DO NOTHING;

-- ============================================
-- SKILLS - Frontend Niche
-- ============================================
INSERT INTO skills (name, description, niche_id, max_level, unlock_cost) VALUES
  ('HTML Foundations', 'Master semantic HTML structure', (SELECT id FROM niches WHERE name='Frontend'), 5, 1),
  ('CSS Mastery', 'Advanced layouts, animations, responsiveness', (SELECT id FROM niches WHERE name='Frontend'), 5, 2),
  ('JavaScript Core', 'Core JS concepts: closures, promises, prototypes', (SELECT id FROM niches WHERE name='Frontend'), 5, 3),
  ('React Fundamentals', 'Components, hooks, state management', (SELECT id FROM niches WHERE name='Frontend'), 5, 4),
  ('React Advanced', 'Performance optimization, patterns, SSR', (SELECT id FROM niches WHERE name='Frontend'), 5, 6),
  ('Animation Skills', 'Framer Motion, CSS animations, transitions', (SELECT id FROM niches WHERE name='Frontend'), 5, 4);

-- ============================================
-- SKILLS - Backend Niche
-- ============================================
INSERT INTO skills (name, description, niche_id, max_level, unlock_cost) VALUES
  ('Node.js Basics', 'Event loop, modules, async patterns', (SELECT id FROM niches WHERE name='Backend'), 5, 1),
  ('Express Mastery', 'Routing, middleware, REST APIs', (SELECT id FROM niches WHERE name='Backend'), 5, 2),
  ('Database Design', 'SQL, normalization, query optimization', (SELECT id FROM niches WHERE name='Backend'), 5, 3),
  ('Authentication', 'JWT, OAuth, session management', (SELECT id FROM niches WHERE name='Backend'), 5, 4),
  ('System Design', 'Scalability, caching, message queues', (SELECT id FROM niches WHERE name='Backend'), 5, 6),
  ('API Security', 'Rate limiting, input validation, CORS', (SELECT id FROM niches WHERE name='Backend'), 5, 4);

-- ============================================
-- SKILLS - DSA Niche
-- ============================================
INSERT INTO skills (name, description, niche_id, max_level, unlock_cost) VALUES
  ('Arrays & Strings', 'Fundamental data manipulation', (SELECT id FROM niches WHERE name='DSA'), 5, 1),
  ('Sorting & Searching', 'Binary search, merge sort, quick sort', (SELECT id FROM niches WHERE name='DSA'), 5, 2),
  ('Trees & Graphs', 'BFS, DFS, tree traversals', (SELECT id FROM niches WHERE name='DSA'), 5, 3),
  ('Dynamic Programming', 'Memoization, tabulation, optimization', (SELECT id FROM niches WHERE name='DSA'), 5, 5),
  ('Advanced Algorithms', 'Graph algorithms, greedy, backtracking', (SELECT id FROM niches WHERE name='DSA'), 5, 6),
  ('Competitive Programming', 'Contest-level problem solving', (SELECT id FROM niches WHERE name='DSA'), 5, 8);

-- ============================================
-- SAMPLE QUESTS
-- ============================================
INSERT INTO quests (title, description, difficulty, xp_reward, skill_reward, quest_type, niche_id) VALUES
  (
    'Two Sum',
    'Given an array of integers nums and an integer target, return indices of the two numbers that add up to target. You may assume each input has exactly one solution. Example: Input nums=[2,7,11,15], target=9 → Output [0,1]. Input nums=[3,2,4], target=6 → Output [1,2].',
    'easy', 50, 1, 'daily',
    (SELECT id FROM niches WHERE name='DSA')
  ),
  (
    'Reverse String',
    'Write a function that reverses a string. The input string is given as an array of characters. You must do this by modifying the input array in-place. Example: ["h","e","l","l","o"] → ["o","l","l","e","h"].',
    'easy', 40, 1, 'daily',
    (SELECT id FROM niches WHERE name='DSA')
  ),
  (
    'FizzBuzz',
    'Given an integer n, return a string array where: answer[i]=="FizzBuzz" if i is divisible by 3 and 5, "Fizz" if divisible by 3, "Buzz" if divisible by 5, i as string otherwise. Example: n=5 → ["1","2","Fizz","4","Buzz"].',
    'easy', 45, 1, 'main',
    (SELECT id FROM niches WHERE name='DSA')
  ),
  (
    'Valid Parentheses',
    'Given a string s containing just the characters (, ), {, }, [ and ], determine if the input string is valid. Open brackets must be closed by the same type in the correct order. Example: "()" → true, "(]" → false.',
    'easy', 55, 1, 'main',
    (SELECT id FROM niches WHERE name='DSA')
  ),
  (
    'Palindrome Number',
    'Given an integer x, return true if x is a palindrome, and false otherwise. Example: 121 → true, -121 → false, 10 → false.',
    'easy', 40, 1, 'daily',
    (SELECT id FROM niches WHERE name='DSA')
  ),
  (
    'Merge Two Sorted Lists',
    'Merge two sorted linked lists and return it as a sorted list. Example: [1,2,4] + [1,3,4] → [1,1,2,3,4,4].',
    'medium', 80, 2, 'main',
    (SELECT id FROM niches WHERE name='DSA')
  ),
  (
    'Binary Search',
    'Given a sorted array of distinct integers and a target value, return the index if found, -1 otherwise. Example: [-1,0,3,5,9,12], target=9 → 4.',
    'medium', 75, 2, 'main',
    (SELECT id FROM niches WHERE name='DSA')
  ),
  (
    'Build a REST API',
    'Create a complete REST API endpoint with CRUD operations for a resource. The endpoint should handle GET (list/detail), POST (create), PUT (update), and DELETE operations with proper status codes and error handling.',
    'medium', 100, 2, 'main',
    (SELECT id FROM niches WHERE name='Backend')
  ),
  (
    'React Counter Component',
    'Build a React counter component with increment, decrement, and reset functionality. Use useState hook. Display the current count and provide three buttons.',
    'easy', 60, 1, 'daily',
    (SELECT id FROM niches WHERE name='Frontend')
  ),
  (
    'The Shadow Monarch Challenge',
    'Solve a complex dynamic programming problem: Given an array of integers, find the maximum sum subsequence such that no two elements are adjacent. Example: [3,2,5,10,7] → 15, [3,2,7,10] → 13, [5,5,10,100,10,5] → 110.',
    'hard', 500, 5, 'boss',
    (SELECT id FROM niches WHERE name='DSA')
  ),
  -- ============ FITNESS QUESTS ============
  (
    'Push-ups Circuit',
    'Complete 3 sets of 10 push-ups with 30 seconds rest between sets. Focus on proper form: chest to ground, full arm extension. Keep your core tight and body straight throughout.',
    'easy', 15, 1, 'fitness', NULL
  ),
  (
    'Plank Challenge',
    'Hold a plank position for as long as possible. Start on your forearms and toes, keep your body in a straight line. Minimum target: 60 seconds. Elite target: 3 minutes.',
    'easy', 10, 1, 'fitness', NULL
  ),
  (
    'Squats & Lunges',
    'Complete 4 sets of 15 bodyweight squats followed by 10 walking lunges per leg. Keep your back straight, knees tracking over toes. 45 seconds rest between sets.',
    'medium', 25, 2, 'fitness', NULL
  ),
  (
    'HIIT Cardio Burst',
    'High-Intensity Interval Training: 20 seconds max effort (burpees, mountain climbers, or high knees), 10 seconds rest. Complete 8 rounds. Total workout time ~4 minutes.',
    'hard', 30, 2, 'fitness', NULL
  ),
  (
    'Core Destroyer',
    'Complete: 20 crunches, 20 bicycle kicks, 15 leg raises, 30-second plank, 15 Russian twists each side. Rest 30 seconds. Repeat circuit 3 times.',
    'medium', 25, 2, 'fitness', NULL
  ),
  (
    'Morning Stretch Routine',
    'Full body stretching: neck rolls, shoulder stretches, arm circles, hamstring stretch, quad stretch, hip flexor stretch, calf stretch. Hold each for 30 seconds. Great for recovery days.',
    'easy', 10, 1, 'fitness', NULL
  ),
  (
    'The Shadow Monarch Workout',
    'The ultimate physical trial: 100 push-ups, 100 sit-ups, 100 squats, and a 10km run. Break it into sets if needed. Only a true S-Rank Hunter can complete this in one session.',
    'hard', 100, 5, 'fitness', NULL
  ),
  (
    'Pull-up Progression',
    'Complete 5 sets of pull-ups (or negatives if you cant do full pull-ups yet). Set 1: max reps. Sets 2-5: 80% of max. Rest 90 seconds between sets. Track your total reps.',
    'medium', 30, 2, 'fitness', NULL
  );
