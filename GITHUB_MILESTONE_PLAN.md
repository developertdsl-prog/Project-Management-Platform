# GitHub Milestone, Issues & PR Plan

This document defines the complete GitHub project management setup for the Project Management Platform repository. It covers all six milestones (M1–M6), the issues for each milestone, and the pull requests that implement them.

> **Note:** GitHub milestones, issues, and PRs live on GitHub.com — they cannot be created from the local filesystem. Use the commands/steps at the end of this document to create them on GitHub (requires `gh` CLI or GitHub web UI).

---

## Repository State (local)

| Item | Status |
|------|--------|
| Default branch | `main` (production) |
| Integration branch | `develop` |
| Feature branches | All 6 exist locally + on `origin` |
| Current branch | `feature/testing-deployment` (M6) |
| Working tree | Clean, up to date with `origin` |
| Last commit | `feat: implement deployment, documentation and release preparation` |

Branches already pushed to `origin`:
- `main`, `develop`
- `feature/authentication` (M1)
- `feature/team-management` (M2)
- `feature/project-management` (M3)
- `feature/task-management` (M4)
- `feature/dashboard-reporting` (M5)
- `feature/testing-deployment` (M6)

---

## GitHub Milestones (M1–M6)

Create these milestones on GitHub under **Issues → Milestones → New milestone**.

| Milestone | Title | Description | Suggested Due Date |
|-----------|-------|-------------|-------------------|
| M1 | Foundation & Authentication | Project initialization, React + Node.js setup, MongoDB connection, user registration/login, JWT auth, bcrypt password hashing, role-based access control, protected routes, basic dashboard layout | Day 1 |
| M2 | User, Team & Workspace Management | Team creation, team member management, user listing, role management, user activation/deactivation, admin user management | Day 2 |
| M3 | Project Management | Project creation, editing, deletion, project manager assignment, team assignment, start/end dates, status, priority, project members | Day 3 |
| M4 | Task Management & Collaboration | Task creation, editing, deletion, task assignment, priorities, deadlines, statuses (To Do, In Progress, Review, Completed), Kanban board, task comments, activity history | Day 4 |
| M5 | Dashboard, Notifications & Reporting | Role-based dashboards, task statistics, overdue tracking, notifications system, project activity feed, search functionality | Day 5 |
| M6 | Testing, Optimization & Release | Docker configuration, Docker Compose, Render/Vercel deployment configs, API documentation, testing guide, contributing guide, release preparation, v1.0.0 release | Day 6 |

**GitHub CLI example (one per milestone):**
```bash
gh api repos/:owner/:repo/milestones -f title="M1 - Foundation & Authentication" -f description="..." -f due_on="2026-11-XXT00:00:00Z"
```

---

## GitHub Issues by Milestone

Create 3–5 issues per milestone. Each issue should have:
- A professional title
- A clear description
- Acceptance criteria
- Labels (bug / feature / enhancement / documentation / testing / frontend / backend / priority-high)
- Assigned milestone

### M1 — Foundation & Authentication

| # | Title | Labels | Description (summary) |
|---|-------|--------|----------------------|
| M1-1 | Initialize project architecture with React, Node.js, and MongoDB | feature, backend, frontend, priority-high | Scaffold the monorepo with `client/` and `server/`, configure Express, MongoDB/Mongoose connection, and basic folder structure. |
| M1-2 | Implement user registration and login with JWT authentication | feature, backend, priority-high | Build `/api/auth/register` and `/api/auth/login` endpoints, bcrypt password hashing (10 salt rounds), JWT issuance (30d expiry), and protected route middleware. |
| M1-3 | Implement role-based access control (Admin, PM, Team Member) | feature, backend, priority-high | Define user roles, role-based route guards, and middleware to restrict endpoints by role. |
| M1-4 | Build basic dashboard layout with protected frontend routes | feature, frontend, priority-high | Create React Router protected routes, basic sidebar navigation, and role-based dashboard shell. |
| M1-5 | Fix JWT token expiration and localStorage persistence | bug, backend, frontend | Ensure tokens are stored in localStorage, sent on protected requests, and cleared on logout/expiration. |

### M2 — User, Team & Workspace Management

| # | Title | Labels | Description (summary) |
|---|-------|--------|----------------------|
| M2-1 | Implement team creation and listing endpoints | feature, backend | Build `POST /api/teams`, `GET /api/teams`, `GET /api/teams/:id`. |
| M2-2 | Implement team member add/remove | feature, backend | Build `POST /api/teams/:id/members` and `DELETE /api/teams/:id/members/:userId`. |
| M2-3 | Implement user listing and role management | feature, backend, admin | Build `GET /api/teams/users`, `PUT /api/teams/users/:id/role`, activation/deactivation. |
| M2-4 | Build team management UI pages | feature, frontend | Create team list, team detail, add-member, and role-update pages. |
| M2-5 | Validate team member duplicate assignments | bug, backend | Prevent adding the same user to a team twice; return proper error response. |

### M3 — Project Management

| # | Title | Labels | Description (summary) |
|---|-------|--------|----------------------|
| M3-1 | Implement project CRUD endpoints | feature, backend, priority-high | Build `POST/GET/PUT/DELETE /api/projects` with project manager and team assignment. |
| M3-2 | Implement project member management | feature, backend | Build `POST/DELETE /api/projects/:id/members`. |
| M3-3 | Build project management UI (list, detail, create, edit) | feature, frontend | Create project cards, project detail view, and create/edit forms with dates, status, priority. |
| M3-4 | Validate project date ranges (start < end) | bug, backend | Ensure end date is after start date; return 400 on invalid input. |
| M3-5 | Add project status and priority filtering | enhancement, backend, frontend | Add query parameters for filtering projects by status and priority. |

### M4 — Task Management & Collaboration

| # | Title | Labels | Description (summary) |
|---|-------|--------|----------------------|
| M4-1 | Implement task CRUD endpoints | feature, backend, priority-high | Build `POST/GET/PUT/DELETE /api/tasks` with assignment, priority, deadline, status. |
| M4-2 | Implement task comments and activity history | feature, backend | Build `POST /api/tasks/:id/comments` and track status transitions. |
| M4-3 | Build Kanban board (To Do, In Progress, Review, Completed) | feature, frontend, priority-high | Create drag-and-drop Kanban board with four status columns. |
| M4-4 | Build task detail page with comments | feature, frontend | Create task view showing description, assignee, deadline, comments, and activity log. |
| M4-5 | Fix task status transition validation | bug, backend | Ensure tasks only transition through valid statuses (To Do → In Progress → Review → Completed). |

### M5 — Dashboard, Notifications & Reporting

| # | Title | Labels | Description (summary) |
|---|-------|--------|----------------------|
| M5-1 | Implement dashboard statistics endpoint | feature, backend | Build `GET /api/dashboard/stats` with task completion, overdue counts, and role-based aggregation. |
| M5-2 | Implement notifications system | feature, backend | Build `GET /api/notifications`, `PUT /api/notifications/:id/read`, `PUT /api/notifications/read-all`. |
| M5-3 | Build role-based dashboard UIs | feature, frontend | Create Admin, PM, and Team Member dashboards with stats, overdue tracking, and activity feed. |
| M5-4 | Implement search and filtering across projects and tasks | enhancement, frontend, backend | Add search functionality and filtering for projects, tasks, and users. |
| M5-5 | Fix notification read-all marking unread items | bug, frontend | Ensure `read-all` correctly marks all notifications as read and updates unread count. |

### M6 — Testing, Optimization & Release

| # | Title | Labels | Description (summary) |
|---|-------|--------|----------------------|
| M6-1 | Add Docker configuration and Docker Compose | feature, devops, priority-high | Add `Dockerfile` for client/server, `docker-compose.yml`, and `render.yaml`. |
| M6-2 | Configure Render (backend) and Vercel (frontend) deployment | feature, devops | Set up production deployment configs, environment variables, CORS, and MongoDB Atlas connection. |
| M6-3 | Complete API documentation and testing guide | documentation, priority-high | Update `API_DOCUMENTATION.md`, `TESTING.md`, `README.md`, and `CONTRIBUTING.md`. |
| M6-4 | Fix responsive design and UI consistency issues | bug, frontend | Address responsive layout issues and ensure UI consistency across breakpoints. |
| M6-5 | Create final release PR (develop → main) and tag v1.0.0 | feature, release, priority-high | Open release PR, merge to main, and create GitHub release `v1.0.0`. |

---

## Pull Requests

Each feature branch should be merged via a PR targeting `develop`. On Day 6, open a final release PR from `develop` into `main`.

| PR | Source Branch | Target | Milestone | Description |
|----|---------------|--------|-----------|-------------|
| PR-M1 | `feature/authentication` | `develop` | M1 | Foundation & authentication |
| PR-M2 | `feature/team-management` | `develop` | M2 | User, team & workspace management |
| PR-M3 | `feature/project-management` | `develop` | M3 | Project management |
| PR-M4 | `feature/task-management` | `develop` | M4 | Task management & collaboration |
| PR-M5 | `feature/dashboard-reporting` | `develop` | M5 | Dashboard, notifications & reporting |
| PR-M6 | `feature/testing-deployment` | `develop` | M6 | Testing, optimization & release prep |
| PR-Release | `develop` | `main` | M6 | Final release v1.0.0 |

**PR requirements (per CONTRIBUTING.md):**
- Clear title
- Objective and features implemented
- Technical changes
- Related issue numbers
- Testing performed
- Screenshots (for UI changes)
- Remaining limitations
- Squash merge when appropriate

---

## How to Create This on GitHub

### Option A: Using `gh` CLI (recommended)

Install `gh` first: https://cli.github.com/

```bash
# 1. Authenticate
gh auth login

# 2. Set the repo (run from repo root)
gh repo set-default developertdsl-prog/Project-Management-Platform

# 3. Create milestones M1–M6
gh api repos/:owner/:repo/milestones -f title="M1 - Foundation & Authentication" -f body="Project initialization, authentication, JWT auth, RBAC, protected routes" -f due_on="2026-11-XXT00:00:00Z"
# ... repeat for M2–M6

# 4. Create issues (example for M1)
gh issue create --title "Initialize project architecture with React, Node.js, and MongoDB" --body "..." --label feature,backend,frontend,priority-high --milestone "M1 - Foundation & Authentication"
# ... repeat for all issues

# 5. Push feature branches (already on origin)
git push origin feature/authentication feature/team-management feature/project-management feature/task-management feature/dashboard-reporting feature/testing-deployment

# 6. Create PRs targeting develop
gh pr create --head feature/authentication --base develop --title "M1: Foundation & Authentication" --body "..." 
# ... repeat for each feature branch

# 7. Create release PR
gh pr create --head develop --base main --title "Release v1.0.0" --body "..."
```

### Option B: Using GitHub Web UI

1. Go to **https://github.com/developertdsl-prog/Project-Management-Platform**
2. **Milestones:** Issues → Milestones → New milestone (create M1–M6)
3. **Issues:** Issues → New issue → use templates (Bug report / Feature request) → assign labels + milestone
4. **PRs:** Pull requests → New pull request → compare `feature/*` → `develop` → create PR
5. **Release PR:** `develop` → `main` → create PR → merge → create release `v1.0.0`

---

## Files Added Locally

| File | Purpose |
|------|---------|
| `.github/ISSUE_TEMPLATE/bug_report.md` | Bug report issue template |
| `.github/ISSUE_TEMPLATE/feature_request.md` | Feature request issue template |
| `.github/pull_request_template.md` | Pull request template |
| `.github/config.yml` | Issue/PR label and template configuration |
| `GITHUB_MILESTONE_PLAN.md` | This plan document |

Commit and push these to `feature/testing-deployment` (or a docs branch) before opening PRs, so the templates are available when creating issues/PRs on GitHub.
