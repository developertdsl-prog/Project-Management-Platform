# Project Management Platform

A web-based Project Management Platform that allows organizations and teams to organize projects, assign tasks, monitor progress, collaborate, and manage deadlines from a centralized dashboard.

## 🚀 Technology Stack

### Frontend
- React.js
- Tailwind CSS (via CDN)
- React Router
- Axios
- Lucide Icons

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs

### Deployment
- Docker (containerization)
- Docker Compose (local orchestration)
- Vercel (frontend)
- Render (backend)
- MongoDB Atlas (database)

## 📁 Project Structure

```
Project-Management-Platform/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React Context (Auth)
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   ├── App.js
│   │   └── index.js
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── vercel.json
│   ├── package.json
│   └── .env
├── server/                 # Node.js + Express backend
│   ├── config/             # Database configuration
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Auth & role middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── Dockerfile
│   ├── .env.example
│   ├── .env
│   ├── package.json
│   └── server.js
├── .gitignore
├── docker-compose.yml
├── render.yaml
├── API_DOCUMENTATION.md
├── CONTRIBUTING.md
├── TESTING.md
├── README.md
└── plan.md
```

## 👥 User Roles

| Role | Permissions |
|------|-------------|
| **Admin** | Manage users, projects, teams, roles & permissions, monitor platform activity |
| **Project Manager** | Create/manage projects, assign team members, create tasks, set priorities & deadlines |
| **Team Member** | View assigned projects & tasks, update task status, add comments, track deadlines |

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB (local or MongoDB Atlas)
- Docker & Docker Compose (optional, for containerized deployment)
- npm or yarn

### Option 1: Local Development

#### Backend Setup
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

The backend will run on `http://localhost:5000`.

#### Frontend Setup
```bash
cd client
npm install
npm start
```

The frontend will run on `http://localhost:3000`.

### Option 2: Docker Deployment

```bash
# Clone the repo
git clone git@github.com:developertdsl-prog/Project-Management-Platform.git
cd Project-Management-Platform

# Start all services
docker-compose up -d
```

Frontend: `http://localhost:3000`
Backend API: `http://localhost:5000`
MongoDB: `mongodb://localhost:27017`

### Option 3: Production Deployment

#### Backend (Render)
1. Connect your GitHub repository to Render
2. Use `render.yaml` for configuration or set environment variables manually
3. Create a MongoDB database on Render or use MongoDB Atlas
4. Deploy the backend service

#### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set the build command to `npm run build`
3. Set the output directory to `build`
4. Configure the API proxy in `vercel.json`

### Environment Variables

**server/.env:**
```
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/project-management?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:3000
```

**client/.env:**
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 📡 API Endpoints

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API reference.

### Authentication
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/profile` | Get user profile | Private |
| PUT | `/api/auth/profile` | Update user profile | Private |

### Teams
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/teams` | Create a team | Private |
| GET | `/api/teams` | List teams | Private |
| GET | `/api/teams/:id` | Get team details | Private |
| POST | `/api/teams/:id/members` | Add team member | Private |
| DELETE | `/api/teams/:id/members/:userId` | Remove team member | Private |

### Users
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/teams/users` | List all users | Private (admin/PM) |
| PUT | `/api/teams/users/:id/role` | Update user role | Private (admin) |

### Projects
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/projects` | Create a project | Private (admin/PM) |
| GET | `/api/projects` | List projects | Private |
| GET | `/api/projects/:id` | Get project details | Private |
| PUT | `/api/projects/:id` | Update project | Private |
| DELETE | `/api/projects/:id` | Delete project | Private |

### Tasks
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/tasks` | List tasks | Private |
| POST | `/api/tasks` | Create a task | Private |
| GET | `/api/tasks/:id` | Get task details | Private |
| PUT | `/api/tasks/:id` | Update a task | Private |
| DELETE | `/api/tasks/:id` | Delete a task | Private |
| POST | `/api/tasks/:id/comments` | Add comment | Private |

### Dashboard
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/dashboard/stats` | Get dashboard statistics | Private |

### Notifications
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/notifications` | List notifications | Private |
| PUT | `/api/notifications/:id/read` | Mark as read | Private |
| PUT | `/api/notifications/read-all` | Mark all as read | Private |

## 🔐 Authentication

- JWT-based stateless authentication
- Passwords hashed with bcryptjs (10 salt rounds)
- Protected routes with role-based access control
- Token stored in localStorage
- Token expires in 30 days

## 📦 Installation (One-liner)

```bash
# Clone the repo
git clone git@github.com:developertdsl-prog/Project-Management-Platform.git
cd Project-Management-Platform

# With Docker
docker-compose up -d

# Or manually
cd server && npm install && cp .env.example .env && npm run dev
cd ../client && npm install && npm start
```

## 🗺️ Development Roadmap (6 Days)

| Day | Milestone | Status |
|-----|-----------|--------|
| Day 1 | M1: Project Foundation & Authentication | ✅ Complete |
| Day 2 | M2: User, Team & Workspace Management | ✅ Complete |
| Day 3 | M3: Project Management | ✅ Complete |
| Day 4 | M4: Task Management & Collaboration | ✅ Complete |
| Day 5 | M5: Dashboard, Notifications & Reporting | ✅ Complete |
| Day 6 | M6: Testing, Optimization & Release | ✅ Complete |

### Features by Milestone

**M1**: Project initialization, React + Node.js setup, MongoDB connection, user registration/login, JWT auth, bcrypt password hashing, role-based access control, protected routes, basic dashboard layout

**M2**: Team creation, team member management, user listing, role management, user activation/deactivation, admin user management

**M3**: Project creation, editing, deletion, project manager assignment, team assignment, start/end dates, status, priority, project members

**M4**: Task creation, editing, deletion, task assignment, priorities, deadlines, statuses (To Do, In Progress, Review, Completed), Kanban board, task comments, activity history

**M5**: Role-based dashboards, task statistics, overdue tracking, notifications system, project activity feed, search functionality

**M6**: Docker configuration, Docker Compose, Render/Vercel deployment configs, API documentation, testing guide, contributing guide, release preparation

## 📄 License

ISC