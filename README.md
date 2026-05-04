# Taskflow

A full-stack Team Task Manager built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- **Authentication** — JWT login/signup with bcrypt password hashing
- **Role-based access** — Admin and Member roles
- **Project management** — Create, update, delete projects
- **Kanban task board** — Todo, In Progress, Done columns
- **Task tracking** — Priority levels, due dates, assignees
- **Dashboard** — Overview stats, progress tracking
- **Dark mode** — Toggle between light and dark themes

## Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, Lucide Icons
- **Backend:** Node.js, Express.js, Mongoose
- **Database:** MongoDB
- **Auth:** JSON Web Tokens, bcryptjs

## Getting Started

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (in another terminal)
cd frontend
npm install
npm run dev
```

Create a `backend/.env` file:
```
MONGO_URI=mongodb://127.0.0.1:27017/team-task-manager
JWT_SECRET=your_secret_key
PORT=5000
```

## Author

Built by [avikmasanta](https://github.com/avikmasanta)
