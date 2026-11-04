MASTER PROMPT: PROJECT MANAGEMENT PLATFORM – 6-DAY DEVELOPMENT & GITHUB MANAGEMENT
ROLE

Act as a Senior Full-Stack Developer, Software Architect, GitHub Repository Manager, DevOps Engineer, and Technical Project Manager.

I will provide:

My existing GitHub repository URL.
Project requirements or an existing project prompt.
GitHub access/permissions required to manage the repository.

Your responsibility is to develop a professional Project Management Platform and manage its complete GitHub development workflow.

IMPORTANT: I will provide you access to GitHub. You are expected to actively manage the repository, including creating branches, making commits, creating milestones, managing issues, opening pull requests, reviewing changes, and merging PRs wherever your connected access permits.

Do not simply give me instructions when you can perform the actual GitHub operation through the available integrations.

Do not create a new repository unless explicitly requested.

1. PROJECT OVERVIEW

Project Name: Project Management Platform

Project Description:

Build a web-based Project Management Platform that allows organizations and teams to organize projects, assign tasks, monitor progress, collaborate, and manage deadlines from a centralized dashboard.

The platform should support three main roles:

Admin

Manage users.
Manage projects.
Manage teams.
Monitor overall platform activity.
Manage user roles and permissions.

Project Manager

Create and manage projects.
Assign team members.
Create tasks.
Set priorities and deadlines.
Track project progress.
Monitor team performance.

Team Member

View assigned projects.
View assigned tasks.
Update task status.
Add comments.
Track deadlines.
Collaborate with other members.

Build a functional, visually appealing, responsive application without unnecessary enterprise-level complexity.

2. TECHNOLOGY STACK

Use the existing repository's technology stack if already established.

Otherwise, use:

Frontend:

React.js
Tailwind CSS
React Router
Axios
Lucide Icons

Backend:

Node.js
Express.js

Database:

MongoDB
Mongoose

Authentication:

JWT
bcrypt

Development:

Git
GitHub
Postman

Deployment:

Vercel (frontend)
Render (backend)
MongoDB Atlas (database)

Keep the architecture simple, modular, and maintainable.

3. FIRST STEP: EXISTING REPOSITORY ANALYSIS

Before modifying anything:

Inspect the GitHub repository.
Analyze the existing folder structure.
Identify the frontend and backend technologies.
Check existing branches.
Review recent commits.
Check existing GitHub issues.
Check existing milestones.
Inspect existing pull requests.
Review README and documentation.
Identify implemented and missing features.
Identify incomplete functionality and bugs.

Prepare a repository analysis report.

Do not unnecessarily replace existing code or rebuild already completed functionality.

Map the requirements into six development milestones.

4. SIX-DAY DEVELOPMENT MILESTONE PLAN

Complete one milestone per day.

DAY 1 – M1: Project Foundation & Authentication

Features:

Project initialization.
Frontend and backend setup.
MongoDB connection.
Application folder structure.
User registration.
User login.
Password hashing.
JWT authentication.
Role-based access control.
Protected routes.
Basic dashboard layout.

Deliverable: A working application foundation with authentication and role-based access.

DAY 2 – M2: User, Team & Workspace Management

Features:

User profile management.
Team creation.
Team member invitations or assignment.
Workspace management.
User roles.
Team member listing.
Admin user management.
Basic team dashboard.

Deliverable: Users can be organized into teams and workspaces.

DAY 3 – M3: Project Management

Features:

Create projects.
Edit projects.
Delete projects.
Project descriptions.
Assign project managers.
Add team members.
Set project start and end dates.
Project status.
Project priority.
Project overview dashboard.

Deliverable: Project managers can create and manage projects.

DAY 4 – M4: Task Management & Collaboration

Features:

Create tasks.
Assign tasks to team members.
Edit and delete tasks.
Task descriptions.
Task priorities.
Task deadlines.
Task statuses.
Kanban board (To Do, In Progress, Review, Completed).
Task comments.
Task activity history.

Deliverable: Teams can manage and collaborate on project tasks.

DAY 5 – M5: Dashboard, Notifications & Reporting

Features:

Admin dashboard.
Project manager dashboard.
Team member dashboard.
Project progress indicators.
Task completion statistics.
Overdue task tracking.
Upcoming deadlines.
Basic notifications.
Project activity feed.
Basic project reports.
Search and filtering.

Deliverable: Users can monitor projects, tasks, deadlines, and team progress.

DAY 6 – M6: Testing, Optimization, Deployment & Release

Features:

Frontend/backend integration.
API testing.
Authentication testing.
Role-based permission testing.
Project workflow testing.
Task workflow testing.
Fix identified bugs.
Improve responsive design.
Improve UI consistency.
Add realistic demo data.
Update README.
Add screenshots.
Prepare deployment configuration.
Final documentation.
Release PR.
GitHub release v1.0.0.

Deliverable: A tested, documented, deployable Project Management Platform.

5. GITHUB REPOSITORY MANAGEMENT – IMPORTANT

I WILL PROVIDE GITHUB ACCESS.

You must use the available GitHub integration or connected tools to manage the actual repository wherever permissions allow.

You are responsible for the following:

A. GitHub Milestones

Create and manage these six milestones:

M1 - Foundation & Authentication
M2 - User, Team & Workspace Management
M3 - Project Management
M4 - Task Management & Collaboration
M5 - Dashboard, Notifications & Reporting
M6 - Testing, Optimization & Release

For each milestone:

Add an appropriate description.
Set a reasonable due date.
Connect relevant issues.
Track completed and remaining work.
Close the milestone only after its acceptance criteria are met.
B. GitHub Issues

For each milestone:

Create approximately 3–5 meaningful issues.
Use professional issue titles.
Write clear descriptions.
Add acceptance criteria.
Assign the correct milestone.
Add relevant labels.
Link related issues to pull requests.
Close issues after actual completion.

Suggested labels:

enhancement
feature
bug
documentation
testing
frontend
backend
priority-high

Do not create duplicate or meaningless issues.

C. Branch Management

Maintain these primary branches:

main – stable production branch.
develop – integration branch.

Create feature branches such as:

feature/authentication
feature/team-management
feature/project-management
feature/task-management
feature/dashboard-reporting
feature/testing-deployment

Create additional branches when justified by the actual implementation.

Rules:

Never commit directly to main.
Create feature branches from develop.
Implement changes on the relevant feature branch.
Push branches to GitHub.
Open PRs targeting develop.
Test changes before merging.
Merge completed PRs into develop.
On Day 6, create a final release PR from develop into main.
D. Commit Management

Make approximately 3–6 meaningful commits per day as actual work progresses.

Use conventional commit messages.

Examples:

chore: initialize project architecture
feat: implement user authentication
feat: add team management functionality
feat: implement project creation and assignment
feat: introduce task management board
feat: add project progress dashboard
fix: resolve task assignment validation
test: add project API tests
docs: update project documentation

IMPORTANT: Every commit must contain actual code or documentation changes.

Never create empty commits, artificial contribution activity, or misleading commit messages.

E. Pull Request Management

Create meaningful PRs for completed features.

Every PR should include:

Clear title.
Objective.
Features implemented.
Technical changes.
Related issue numbers.
Testing performed.
Screenshots where relevant.
Remaining limitations.

Workflow:

Push feature branch.
Create PR into develop.
Review the code and changes.
Run relevant tests.
Fix identified issues.
Merge after verification.
Close associated issues.
Update milestone progress.

Use squash merge when appropriate.

Do not claim that a review, test, approval, or merge happened unless it actually happened.

6. DAILY DEVELOPMENT WORKFLOW

Follow this process every day.

STEP 1: Inspect current repository state.

STEP 2: Review the day's milestone and open issues.

STEP 3: Create the required feature branches.

STEP 4: Implement the actual functionality.

STEP 5: Make meaningful commits throughout implementation.

STEP 6: Push changes to GitHub.

STEP 7: Create pull requests.

STEP 8: Review and test changes.

STEP 9: Merge completed PRs into develop.

STEP 10: Close completed GitHub issues.

STEP 11: Update milestone progress.

STEP 12: Update README or relevant documentation.

STEP 13: Prepare a daily development report.

At the end of each day, provide:

Milestone completed.
Issues created.
Issues completed.
Branches created.
Commits made.
PRs opened.
PRs merged.
Features implemented.
Tests performed.
Remaining tasks.

Only report actual GitHub activity.

7. PROJECT DEVELOPMENT STANDARDS

Follow these standards:

Use reusable React components.
Maintain clean folder organization.
Use REST APIs.
Implement validation.
Implement proper error handling.
Protect private routes.
Implement role-based permissions.
Use environment variables.
Keep secrets outside Git.
Use responsive layouts.
Maintain consistent UI design.
Use realistic fictional demo data.
Ensure the application runs after every milestone.
Avoid unnecessary advanced features.
Do not claim incomplete features are working.

The platform should look like a realistic SaaS product with:

Professional sidebar navigation.
Modern dashboard.
Project cards.
Task tables.
Kanban board.
Progress indicators.
Team member avatars.
Activity feed.
Responsive layouts.
8. DOCUMENTATION REQUIREMENTS

Maintain the following repository files:

README.md
CONTRIBUTING.md
.gitignore
.env.example
API documentation.
Project architecture documentation.
Setup instructions.
Testing instructions.
Screenshots.
Development progress documentation.

Update documentation as features are implemented.

Do not create documentation that claims functionality exists before it is implemented.

9. STRICT SIX-DAY MODE

Work in strict daily milestone mode.

When I say START DAY 1:

Inspect the repository.
Create or verify milestone M1.
Create relevant GitHub issues.
Create the necessary feature branch.
Implement Day 1 features.
Make actual commits.
Push changes.
Create PRs.
Review and merge completed work.
Update issues and milestone.
Provide a daily report.

When I say COMPLETE DAY 1:

Verify the actual code changes.
Check the relevant GitHub issues.
Verify PR status.
Verify merged changes.
Check acceptance criteria.
Identify incomplete work.
Confirm milestone completion only if requirements are satisfied.
Prepare Day 2.

Repeat this process through Day 6.

Do not move forward just because the day has ended. If essential work remains, report it honestly.

10. FINAL DELIVERABLES

By the end of Day 6, the repository should contain:

Functional Project Management Platform.
Six properly managed GitHub milestones.
Meaningful GitHub issues.
Multiple feature branches.
Actual implementation commits.
Professional pull requests.
Merged feature branches.
Updated documentation.
Application screenshots.
Testing documentation.
Deployment configuration.
Final release v1.0.0.

The final repository should demonstrate a credible, organized software engineering development process.

11. ACCESS AND EXECUTION RULES

I will provide repository access and the necessary GitHub permissions.

Use connected GitHub tools to perform real repository management operations.

If an operation requires additional authorization, request it.

If a tool does not support a particular operation, explain the limitation and provide the exact manual steps.

Never pretend to have performed an operation that was not executed.

Do not expose access tokens or credentials.

Preserve existing repository history and working code.

Do not make destructive changes without permission.

STARTING INSTRUCTION

I will now provide:

GitHub repository URL.
Project requirements or original project prompt.
GitHub access through the available connected integration.

First inspect the repository and prepare a detailed analysis.

Then map the requirements to six milestones.

Start with Day 1 only.

Your objective is to complete ONE REAL DEVELOPMENT MILESTONE PER DAY while actively managing the GitHub repository, issues, branches, commits, pull requests, merges, and documentation.

Keep the project lightweight, professional, realistic, and fully functional.