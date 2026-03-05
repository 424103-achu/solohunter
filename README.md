# Solo Hunter RPG

A full-stack gamified coding RPG platform inspired by *Solo Leveling*. Level up your coding skills by completing quests, earning XP, unlocking skill trees, and climbing the hunter rankings.

## Tech Stack

| Layer     | Technology                                     |
| --------- | ---------------------------------------------- |
| Frontend  | React 19, Vite 6, Tailwind CSS v4, Monaco Editor |
| Backend   | Node.js, Express 5                             |
| Database  | PostgreSQL                                     |
| Auth      | JWT (jsonwebtoken) + bcrypt                    |
| Code Exec | Judge0 CE (RapidAPI)                           |
| AI        | Google Gemini (optional)                       |

## Features

- **Rank System** — E → D → C → B → A → S ranks based on level
- **XP & Leveling** — Earn XP from quests with streak/niche/stat bonuses
- **Quests** — Daily, Main, Special, and Boss quest types
- **Code Execution** — Real-time code submission via Judge0 with test case validation
- **Skill Trees** — Unlock skills per niche specialization (Frontend, Backend, DSA, DevOps, Full Stack)
- **Combat Stats** — Allocate Strength, Intelligence, Agility points per level up
- **Streaks** — Consecutive daily quest completion rewards
- **Badges** — Achievement system for milestones
- **Leaderboard** — Sort by XP, level, or streak
- **Fitness Challenges** — Optional physical workout timers

## Project Structure

```
solo-hunter-rpg/
├── client/            # React + Vite frontend
│   └── src/
│       ├── components/   # UI, quest, skill, stats, layout components
│       ├── context/      # Auth, User, Quest context providers
│       ├── hooks/        # Custom React hooks
│       ├── pages/        # Route pages
│       ├── routes/       # AppRoutes definition
│       ├── services/     # API service functions
│       └── utils/        # Rank, XP, difficulty utilities
├── server/            # Express backend
│   └── src/
│       ├── config/       # DB, Judge0, Gemini config
│       ├── controllers/  # Route handlers
│       ├── jobs/         # Cron jobs (daily/weekly)
│       ├── middleware/    # Auth, error handler, rate limiter
│       ├── models/       # Database query functions
│       ├── routes/       # Express route definitions
│       ├── services/     # Business logic services
│       └── utils/        # Logger, rank calc, difficulty selector
└── database/          # SQL schema, migrations, seeds
```

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Judge0 CE API key (RapidAPI)

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

# Seed data
psql -d solo_hunter_rpg -f database/seed.sql
```

### 3. Environment Variables

Copy `server/.env.example` to `server/.env` and fill in:

```env
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/solo_hunter_rpg
JWT_SECRET=your-secret-key
JUDGE0_API_KEY=your-rapidapi-key
JUDGE0_API_HOST=judge0-ce.p.rapidapi.com
GEMINI_API_KEY=your-gemini-key  # optional
```

### 4. Run

```bash
# From root directory — starts both server and client
npm run dev
```

- **Client**: http://localhost:5173
- **Server**: http://localhost:5000

## API Endpoints

| Method | Endpoint                  | Description             |
| ------ | ------------------------- | ----------------------- |
| POST   | /api/auth/register        | Create account          |
| POST   | /api/auth/login           | Login                   |
| GET    | /api/users/me             | Current user profile    |
| PUT    | /api/users/profile        | Update profile          |
| POST   | /api/users/niche          | Select niche            |
| POST   | /api/users/stats/allocate | Allocate stat points    |
| GET    | /api/quests               | All quests              |
| GET    | /api/quests/available     | Level-appropriate quests|
| GET    | /api/quests/daily         | Daily quests            |
| GET    | /api/quests/boss          | Boss quests             |
| POST   | /api/submissions/submit   | Submit code solution    |
| POST   | /api/submissions/run      | Run code (sandbox)      |
| GET    | /api/skills/tree          | Get skill tree          |
| POST   | /api/skills/unlock        | Unlock a skill          |
| GET    | /api/stats                | Get full stats          |
| GET    | /api/leaderboard          | Get rankings            |

## Rank Tiers

| Rank | Level Range | Title                 |
| ---- | ----------- | --------------------- |
| E    | 1–10        | Novice Hunter         |
| D    | 11–20       | Skilled Hunter        |
| C    | 21–35       | Veteran Hunter        |
| B    | 36–50       | Elite Hunter          |
| A    | 51–75       | National Level Hunter |
| S    | 76+         | Shadow Monarch        |

## License

MIT