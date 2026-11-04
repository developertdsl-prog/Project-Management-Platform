# Project Management Platform - Testing Guide

## Test Coverage

The platform includes the following testable areas:

### Backend (Node.js + Express)

- **Authentication**: User registration, login, JWT token generation, password hashing
- **Authorization**: Role-based access control (admin, project_manager, team_member)
- **Teams**: Create, list, update, delete teams; add/remove members
- **Users**: List users, update roles, activate/deactivate, delete
- **Projects**: Create, list, update, delete projects; add/remove members
- **Tasks**: Create, list, update, delete tasks; comments; status transitions; activity tracking
- **Dashboard**: Statistics aggregation
- **Notifications**: Create, list, mark read, delete

### Frontend (React)

- **Authentication**: Login, registration, token storage, protected routes
- **Role-based UI**: Different navigation and access based on user role
- **Task Management**: Kanban board, task creation, status updates, comments
- **Project Management**: Project creation, listing, details
- **Team Management**: Team creation, member management

## Running Tests

### Backend Tests

```bash
cd server
npm test
```

### Frontend Tests

```bash
cd client
npm test
```

## Manual Testing Checklist

### Authentication
- [ ] User can register with valid credentials
- [ ] User cannot register with duplicate email
- [ ] User can login with correct credentials
- [ ] User cannot login with incorrect credentials
- [ ] Password is hashed (not stored in plain text)
- [ ] JWT token is issued on login
- [ ] Protected routes require valid token
- [ ] Token expiration works

### Role-Based Access Control
- [ ] Admin can access all routes
- [ ] Project Manager can create/manage projects
- [ ] Team Member can only view assigned projects/tasks
- [ ] Users cannot access resources they're not members of

### Project Management
- [ ] PM can create a project
- [ ] PM can assign team members to project
- [ ] Project status can be updated
- [ ] Project can be deleted by owner/admin

### Task Management
- [ ] Task can be created on a project
- [ ] Task can be assigned to a team member
- [ ] Task status can transition: To Do → In Progress → Review → Completed
- [ ] Comments can be added to tasks
- [ ] Overdue tasks are identified

### Dashboard
- [ ] Stats display correctly for each role
- [ ] Notifications show unread count
- [ ] Activity feed displays recent actions

## Deployment Testing

- [ ] Backend deploys to Render successfully
- [ ] Frontend deploys to Vercel successfully
- [ ] MongoDB Atlas connection works
- [ ] CORS is configured for production frontend URL
- [ ] Environment variables are set correctly