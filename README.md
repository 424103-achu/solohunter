# Solo Hunter RPG

A full-stack gamified coding + fitness RPG platform inspired by *Solo Leveling*. Level up your real-world skills by completing AI-generated coding quests, physical fitness/yoga challenges, and boss battles — earning XP, unlocking skill trees, and climbing the hunter rankings.

## Tech Stack

| Layer     | Technology                                           |
| --------- | ---------------------------------------------------- |
| Frontend  | React 19, Vite 6, Tailwind CSS v4, Monaco Editor     |
| Backend   | Node.js, Express 5                                   |
| Database  | PostgreSQL                                           |
| Auth      | JWT (jsonwebtoken) + bcrypt                          |
| Code Exec | Native sandbox (Python/Java via child_process spawn) |
| AI        | Groq AI (quest generation) |

## Features

- **Rank System** — E → D → C → B → A → S ranks based on level
- **XP & Leveling** — Earn XP from quests with streak/niche/stat bonuses
- **Quest Types** — Daily (2 AI coding + 1 fitness), Quest Board, Fitness, Yoga, Boss
- **AI-Generated Quests** — Groq generates 2 personalized coding quests daily based on your stats
- **Code Execution** — Multi-language sandbox (Python, Java) with test case validation
- **Skill Trees** — Unlock skills per niche specialization (Frontend, Backend, DSA, DevOps, Full Stack)
- **Combat Stats** — Allocate Strength, Intelligence, Agility points per level up
- **Fitness & Yoga** — Timer-based challenges with a full-screen workout UI; completes quest on timer finish
- **Streaks** — Consecutive daily completion rewards; +5% XP/day up to +50% at 10 days
- **Badges** — Achievement system for milestones
- **Leaderboard** — Sort by XP, level, or streak (streak sorted NULLS LAST)
- **System Guide** — In-app info page covering all mechanics

## XP Rewards

| Quest Type      | Easy    | Medium   | Hard     |
| --------------- | ------- | -------- | -------- |
| AI Coding       | 45 XP · 1 SP | 90 XP · 3 SP | 150 XP · 5 SP |
| Fitness / Yoga  | 20 XP   | 30 XP    | 50 XP    |

Skill Points (SP): +3 per level up, +1 per 7-day streak milestone.

## Project Structure

```
solo-hunter-rpg/
├── client/            # React + Vite frontend
│   └── src/
│       ├── components/   # UI, quest, fitness, skill, stats, layout components
│       ├── context/      # Auth, User, Quest context providers
│       ├── hooks/        # Custom React hooks
│       ├── pages/        # Route pages
│       ├── routes/       # AppRoutes definition
│       ├── services/     # API service functions
│       └── utils/        # Rank, XP, difficulty utilities
├── server/            # Express backend
│   └── src/
│       ├── config/       # DB, Groq config
│       ├── controllers/  # Route handlers
│       ├── jobs/         # Cron jobs (daily quest reset, weekly boss)
│       ├── middleware/   # Auth, error handler, rate limiter
│       ├── models/       # Database query functions
│       ├── routes/       # Express route definitions
│       ├── services/     # Business logic (XP, quests, skills, badges, code runner)
│       └── utils/        # Logger, rank calculator, difficulty selector
└── database/          # SQL schema, migrations, seeds
```

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Groq API key (free at console.groq.com)

### 1. Clone & Install

```bash
git clone <repo-url>
cd solo-hunter-rpg
npm install          # installs root dependencies (concurrently)
cd server && npm install
cd ../client && npm install
```

### 2. Database Setup

```bash
# Create the database
createdb solo_hunter_rpg

# Run schema
psql -d solo_hunter_rpg -f database/schema.sql

# Run migrations (in order)
psql -d solo_hunter_rpg -f database/migrations/001_users.sql
psql -d solo_hunter_rpg -f database/migrations/002_niches.sql
psql -d solo_hunter_rpg -f database/migrations/003_quests.sql
psql -d solo_hunter_rpg -f database/migrations/004_submissions.sql
psql -d solo_hunter_rpg -f database/migrations/005_badges.sql
psql -d solo_hunter_rpg -f database/migrations/006_stats.sql
psql -d solo_hunter_rpg -f database/migrations/007_combat_stats.sql
psql -d solo_hunter_rpg -f database/migrations/008_quest_test_cases.sql

# Seed data
psql -d solo_hunter_rpg -f database/seed.sql
psql -d solo_hunter_rpg -f database/migrations/009_seed_dsa_quests.sql
psql -d solo_hunter_rpg -f database/migrations/010_seed_special_quests.sql
```

### 3. Environment Variables

Create `server/.env`:

```env
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/solo_hunter_rpg
JWT_SECRET=your-secret-key
GROQ_API_KEY=your-groq-key
CLIENT_URL=http://localhost:5173
```

### 4. Run

```bash
# From root directory — starts both server and client
npm run dev
```

- **Client**: http://localhost:5173
- **Server**: http://localhost:5000

## API Endpoints

| Method | Endpoint                          | Description                        |
| ------ | --------------------------------- | ---------------------------------- |
| POST   | /api/auth/register                | Create account                     |
| POST   | /api/auth/login                   | Login                              |
| GET    | /api/user/me                      | Current user profile               |
| PUT    | /api/user/profile                 | Update username                    |
| POST   | /api/user/niche                   | Select specialization              |
| POST   | /api/user/stats/allocate          | Allocate stat points               |
| GET    | /api/user/badges                  | User's earned badges               |
| GET    | /api/quests                       | All quests                         |
| GET    | /api/quests/available             | Level-appropriate quests           |
| GET    | /api/quests/daily                 | Today's daily quests               |
| GET    | /api/quests/boss                  | Boss quests                        |
| GET    | /api/quests/type/:type            | Quests by type (fitness, yoga, …)  |
| POST   | /api/quests/grok/generate         | Force daily quest regeneration     |
| POST   | /api/submissions/submit           | Submit code solution               |
| POST   | /api/submissions/check            | Check code (no XP)                 |
| POST   | /api/submissions/run              | Run code in sandbox                |
| GET    | /api/submissions/fitness          | Get fitness quests                 |
| POST   | /api/submissions/fitness/complete | Complete a fitness quest           |
| GET    | /api/submissions/yoga             | Get yoga quests                    |
| POST   | /api/submissions/yoga/complete    | Complete a yoga quest              |
| GET    | /api/skills/tree                  | Get skill tree                     |
| POST   | /api/skills/unlock                | Unlock a skill                     |
| GET    | /api/stats                        | Get full stats                     |
| GET    | /api/leaderboard                  | Get rankings (?sort=xp|level|streak) |

## Code Evaluation

Submitted code is evaluated entirely on the server — no third-party judge API required.

### Groq AI quests (Python / Java / C++ / JS)

1. Your code is written to a **temp file** on the server (`os.tmpdir()`)
2. A **real subprocess** is spawned via `child_process.spawn`:
   - Python → `python -u solution.py`
   - Java → `javac Main.java` then `java -cp tmpDir Main`
   - C++ → `g++ solution.cpp -o output` then `./output`
   - JS → `node solution.js`
3. Each test case's `input` is piped into the process's **stdin**
4. `stdout` is captured and **exact-string compared** (trimmed) against `expected_output`
5. **10-second timeout** — process is killed if exceeded
6. Temp folder is deleted after every run
7. All test cases must pass for the quest to be marked complete

### Legacy JS quests (seeded DSA quests)

Run directly in Node's **`vm` module** (sandboxed JS context, no subprocess).  
Test cases use function-call expressions like `twoSum([2,7,11,15], 9)` evaluated against your code. JavaScript only, 3-second timeout.

| | Groq AI quests | Legacy JS quests |
|---|---|---|
| Execution | OS subprocess | Node.js `vm` sandbox |
| Languages | Python, Java, JS, C++ | JavaScript only |
| Input | `stdin` pipe | Function call expression |
| Timeout | 10 s | 3 s |

## Rank Tiers

| Rank | Level Range | Title                 |
| ---- | ----------- | --------------------- |
| E    | 1–4         | Novice Hunter         |
| D    | 5–9         | Skilled Hunter        |
| C    | 10–17       | Veteran Hunter        |
| B    | 18–25       | Elite Hunter          |
| A    | 26–37       | National Level Hunter |
| S    | 38+         | Shadow Monarch        |

## License

MIT