# Career Progress Tracker - Feature & Architecture Plan

## Phase 1: Foundation & Data Integration

### 1.1 Database Setup ✅

- [x] Add database to project (Drizzle ORM + SQLite for MVP, easily upgradeable to PostgreSQL)
- [x] Schema design:
  - `users` - user profiles and settings
  - `credentials` - encrypted API tokens (GitHub PAT, Jira token)
  - `github_data` - cached PR, review, commit data
  - `jira_data` - cached ticket, story point data
  - `goals` - user-defined career goals
  - `insights` - AI-generated insights cache
  - `metrics_snapshots` - periodic snapshots for trend analysis

### 1.2 Authentication & User Management ✅

- [x] User registration/login (simple JWT-based auth)
- [x] User profile page for managing connected accounts
- [x] Secure credential storage with encryption at rest
- [x] Token validation and refresh logic

### 1.3 Data Source Integrations ✅

**GitHub Integration:**

- [x] Connect GitHub account (PAT storage)
- [x] Fetch user's PRs (created, reviewed, merged)
- [x] Fetch code review comments (analyze for "actionable" quality)
- [x] Fetch commits and contribution stats
- [x] Background sync job (daily/weekly)

**Jira Integration:**

- [x] Connect Jira account (API token storage)
- [x] Fetch assigned/completed tickets
- [x] Fetch story points and time tracking
- [x] Categorize work types (bugs, features, tech debt)
- [x] Background sync job (daily/weekly)

### 1.4 Data Processing Layer ✅

- [x] Normalize data from different sources into common metrics
- [x] Calculate derived metrics (velocity, review quality score, etc.)
- [x] Store time-series data for trend analysis
- [x] Build aggregation queries for dashboards

## Phase 2: Visualization & Dashboard

Use shadcn components for necessary new components from its registry.

### 2.1 Main Dashboard

- [ ] Overview cards: PRs merged, reviews completed, tickets closed, current streak
- [ ] Activity timeline visualization
- [ ] Work distribution pie/bar charts (bugs vs features, review time, etc.)
- [ ] Trend graphs (weekly/monthly activity patterns)
- [ ] Quick stats comparison (this month vs last month)

### 2.2 Detailed Metrics Views - lesser importance, no fancy UI for it just yet

- [ ] **GitHub Metrics Page:**
  - PR creation/merge rate
  - Review participation and quality
  - Code contribution volume
  - Response time to reviews

- [ ] **Jira Metrics Page:**
  - Ticket completion rate
  - Story points velocity
  - Work type distribution
  - Average cycle time

### 2.3 Skills & Learning Tracker

- [ ] Manual skill entry (technologies, frameworks, practices)
- [ ] Link skills to work items (e.g., React PRs → React skill)
- [ ] Skill proficiency levels (beginner, intermediate, advanced)
- [ ] Skill growth visualization over time

## Phase 3: Goals & Promotion Tracking

### 3.1 Goal Management System

- [ ] Create custom goals with:
  - Title and description
  - Target metric (PR reviews, tickets completed, etc.)
  - Target value and deadline
  - Auto-tracking from integrated data sources
- [ ] Goal templates based on common promotion criteria
- [ ] Progress visualization (percentage, time remaining)
- [ ] Goal completion history

### 3.2 Promotion Readiness Indicator

- [ ] Define promotion level criteria (junior → mid, mid → senior, etc.)
- [ ] Multi-dimensional scoring:
  - Technical output (PRs, code quality)
  - Collaboration (reviews, helping others)
  - Ownership (tickets led, initiatives)
  - Growth (learning, skill acquisition)
- [ ] Visual readiness score (0-100% or radar chart)
- [ ] Gap analysis - what's missing for next level

## Phase 4: AI Features

### 4.1 Automated Insights (Priority 1)

- [ ] Weekly summary generation:
  - Key accomplishments
  - Patterns detected (productive days/times)
  - Comparison to personal averages
- [ ] Monthly career progress report:
  - Major milestones
  - Skill development summary
  - Goal progress review
- [ ] Anomaly detection (unusual drops in activity)
- [ ] AI model: varies - we should use the most efficient model for a given task - requires some research

### 4.2 Personalized Recommendations (Priority 2)

- [ ] Based on goals and current metrics:
  - Suggest focus areas (e.g., "Increase review participation")
  - Recommend skills to develop
  - Identify blockers to promotion
- [ ] Career coaching prompts:
  - "Based on your profile, consider mentoring junior devs"
  - "Your PR review rate suggests strong collaboration skills"
- [ ] Learning resource suggestions (articles, courses)

### 4.3 Smart Goal Suggestions

- [ ] Analyze user data to suggest relevant goals
- [ ] Benchmark against promotion criteria
- [ ] Adaptive goal difficulty (stretch but achievable)

## Phase 5: Polish & Enhancement

### 5.1 Additional Features

- [ ] Export reports (PDF/JSON)
- [ ] Data privacy controls (what data to track/ignore)
- [ ] Notification system (goal milestones, weekly summaries)
- [ ] Dark/light theme (already implemented)
- [ ] Mobile-responsive design

### 5.2 Future Data Sources (Post-MVP)

- [ ] Confluence integration (documentation contributions)
- [ ] Oracle performance system (if API available)
- [ ] Slack/Teams (communication metrics - carefully)
- [ ] Calendar integration (meeting load analysis)

## Architecture Overview

### Tech Stack

- **Frontend:** React + TanStack Router + shadcn/ui (existing)
- **Backend:** Hono + Bun runtime
- **Database:** Drizzle ORM + SQLite (dev) / PostgreSQL (production)
- **AI:** most likely amazon bedrock
- **Auth:** JWT-based authentication (or perhaps check on company confluence via tools, if sso or something similar available)
- **Encryption:** crypto module for credential storage
- **Background Jobs:** Bun's built-in scheduling or simple cron

### Key Files to Create/Modify

- `shared/src/types/index.ts` - Add types for User, Goal, Metric, Insight, Credentials
- `server/src/db/` - Database schema, migrations, queries
- `server/src/services/` - GitHub, Jira, AI service integrations
- `server/src/routes/` - API endpoints for auth, data, goals, insights
- `server/src/jobs/` - Background sync jobs
- `client/src/routes/` - Dashboard, goals, metrics, profile pages
- `client/src/lib/api/` - API client extensions for new endpoints

### Security Considerations

- Encrypt user API tokens at rest
- Use HTTPS in production
- Implement rate limiting on API endpoints
- Validate and sanitize all user inputs
- Secure JWT token handling
- Environment variables for secrets

### Development Workflow

1. ✅ Set up database and migrations
2. ✅ Implement authentication system
3. ✅ Build GitHub integration (end-to-end)
4. ✅ Add Jira integration
5. ✅ Create data processing layer
6. 🔄 Create dashboard with basic metrics (NEXT)
7. Implement goal system
8. Add AI insights generation
9. Build promotion readiness tracker
10. Implement recommendations
11. Polish UI/UX and add final features

