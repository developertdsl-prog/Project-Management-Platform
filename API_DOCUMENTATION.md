# Project Management Platform - API Documentation

## Base URL
- Development: `http://localhost:5000/api`
- Production: `https://your-backend-url.onrender.com/api`

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Authentication

| Method | Endpoint | Description | Access | Body |
|--------|----------|-------------|--------|------|
| POST | `/auth/register` | Register a new user | Public | `{ name, email, password, role? }` |
| POST | `/auth/login` | Login user | Public | `{ email, password }` |
| GET | `/auth/profile` | Get user profile | Private | - |
| PUT | `/auth/profile` | Update user profile | Private | `{ name?, email?, phone?, avatar?, password? }` |

### Teams

| Method | Endpoint | Description | Access | Body |
|--------|----------|-------------|--------|------|
| POST | `/teams` | Create a team | Private | `{ name, description? }` |
| GET | `/teams` | List teams | Private | - |
| GET | `/teams/:id` | Get team details | Private | - |
| PUT | `/teams/:id` | Update team | Private (owner/admin) | `{ name?, description? }` |
| DELETE | `/teams/:id` | Delete team | Private (owner/admin) | - |
| POST | `/teams/:id/members` | Add team member | Private (owner/admin) | `{ userId, role? }` |
| DELETE | `/teams/:id/members/:userId` | Remove team member | Private (owner/admin) | - |

### Users

| Method | Endpoint | Description | Access | Body |
|--------|----------|-------------|--------|------|
| GET | `/teams/users` | List all users | Private (admin/PM) | - |
| GET | `/teams/users/:id` | Get user details | Private | - |
| PUT | `/teams/users/:id/role` | Update user role | Private (admin) | `{ role }` |
| PUT | `/teams/users/:id/status` | Activate/deactivate user | Private (admin) | `{ isActive }` |
| DELETE | `/teams/users/:id` | Delete user | Private (admin) | - |

### Projects

| Method | Endpoint | Description | Access | Body |
|--------|----------|-------------|--------|------|
| POST | `/projects` | Create a project | Private (admin/PM) | `{ name, description?, projectManager?, team?, startDate?, endDate?, status?, priority?, members? }` |
| GET | `/projects` | List projects | Private | Query: `status, priority, projectManager, team` |
| GET | `/projects/:id` | Get project details | Private | - |
| PUT | `/projects/:id` | Update project | Private (owner/PM/admin) | `{ name?, description?, status?, priority?, ... }` |
| DELETE | `/projects/:id` | Delete project | Private (owner/admin) | - |
| POST | `/projects/:id/members` | Add project member | Private (owner/PM/admin) | `{ userId, role? }` |
| DELETE | `/projects/:id/members/:userId` | Remove project member | Private (owner/admin) | - |

### Tasks

| Method | Endpoint | Description | Access | Body |
|--------|----------|-------------|--------|------|
| GET | `/tasks` | List tasks | Private | Query: `status, priority, project, assignee` |
| GET | `/tasks/stats` | Get task statistics | Private | - |
| GET | `/tasks/:id` | Get task details | Private | - |
| POST | `/tasks` | Create a task | Private | `{ title, description?, project, assignee?, status?, priority?, deadline?, estimatedHours? }` |
| PUT | `/tasks/:id` | Update a task | Private | `{ title?, description?, status?, priority?, deadline?, ... }` |
| DELETE | `/tasks/:id` | Delete a task | Private | - |
| POST | `/tasks/:id/comments` | Add comment | Private | `{ text }` |

### Dashboard

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/dashboard/stats` | Get dashboard statistics | Private |

### Notifications

| Method | Endpoint | Description | Access | Body |
|--------|----------|-------------|--------|------|
| GET | `/notifications` | List notifications | Private | Query: `unreadOnly` |
| POST | `/notifications` | Create notification | Private | `{ userId, title, message, type?, relatedId?, relatedModel?, url? }` |
| PUT | `/notifications/:id/read` | Mark as read | Private | - |
| PUT | `/notifications/read-all` | Mark all as read | Private | - |
| DELETE | `/notifications/:id` | Delete notification | Private | - |

### Health

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/health` | API health check | Public |

## User Roles

- **admin**: Full access to all resources, user management, platform settings
- **project_manager**: Create/manage projects, assign team members, view all projects
- **team_member**: View assigned projects and tasks, update task status, add comments

## Error Responses

All error responses follow this format:
```json
{
  "success": false,
  "message": "Error description",
  "stack": null
}
```

## Success Responses

All success responses follow this format:
```json
{
  "success": true,
  "data": { ... }
}
```

## Authentication Flow

1. Register or login to receive a JWT token
2. Store the token in localStorage or cookies
3. Include the token in the Authorization header for protected requests: `Bearer <token>`
4. Token expires in 30 days (configurable via JWT_EXPIRE env variable)

## Status Codes

- 200: Success
- 201: Created
- 400: Bad Request (validation error)
- 401: Unauthorized (missing/invalid token)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 500: Internal Server Error