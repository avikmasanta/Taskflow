# TaskFlow

A full-stack Team Task Manager built with the MERN stack.

## Features

- JWT authentication with bcrypt password hashing
- Role-based access control (Admin / Member)
- Project management — create, update, delete projects
- Kanban task board — To do, In progress, Done
- Task tracking — priorities, due dates, assignees
- Dashboard with progress overview
- Dark / Light mode

## Tech Stack

**Frontend:** React (Vite), Tailwind CSS, Lucide Icons  
**Backend:** Node.js, Express.js, Mongoose  
**Database:** MongoDB  
**Auth:** JWT, bcryptjs

## Local Development

```bash
# 1. Clone the repo
git clone https://github.com/avikmasanta/Taskflow.git
cd Taskflow

# 2. Install all dependencies
cd backend && npm install
cd ../frontend && npm install

# 3. Create backend/.env
#    PORT=5000
#    MONGO_URI=mongodb://127.0.0.1:27017/team-task-manager
#    JWT_SECRET=your_secret_key
#    NODE_ENV=development

# 4. Run backend (terminal 1)
cd backend && npm run dev

# 5. Run frontend (terminal 2)
cd frontend && npm run dev
```

## Deploy to Render (Free)

### 1. Create a MongoDB Atlas database
- Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) → Create free cluster
- Get your connection string: `mongodb+srv://user:pass@cluster.mongodb.net/taskflow`

### 2. Deploy on Render
- Go to [render.com](https://render.com) → New Web Service
- Connect your GitHub repo (`avikmasanta/Taskflow`)
- Configure:

| Setting | Value |
|---------|-------|
| **Root Directory** | _(leave empty)_ |
| **Build Command** | `npm run render-build` |
| **Start Command** | `npm start` |

### 3. Add Environment Variables on Render

| Variable | Value |
|----------|-------|
| `MONGO_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | A strong random string |
| `NODE_ENV` | `production` |
| `PORT` | `10000` |

That's it — Render will build the frontend, start the backend, and serve everything from one URL.

## Project Structure

```
team-task-manager/
├── package.json          ← Root scripts (build, start)
├── backend/
│   ├── server.js         ← Express + serves frontend in production
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   └── routes/
└── frontend/
    ├── src/
    │   ├── pages/        ← Dashboard, Login, Projects, Kanban
    │   ├── components/   ← Layout, Sidebar
    │   └── context/      ← Auth, Theme
    └── dist/             ← Built files (generated)
```

## Author

Built by [avikmasanta](https://github.com/avikmasanta)
