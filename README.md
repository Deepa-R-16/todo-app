# Full Stack To-Do Application

React frontend connected to an Express + MongoDB REST API with JWT authentication, CRUD, and client-side routing.

## Features
- User registration and login (JWT, bcrypt-hashed passwords)
- Protected routes (`/dashboard`) with automatic redirect to `/login`
- Create, read, update, delete tasks; mark complete; filter by status
- Each user sees only their own tasks

## Project Structure
```
todo-app/
├── backend/
│   ├── config/db.js
│   ├── middleware/auth.js
│   ├── models/{User,Todo}.js
│   ├── routes/{auth,todos}.js
│   ├── server.js
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/{Navbar,ProtectedRoute}.jsx
    │   ├── context/AuthContext.jsx
    │   ├── pages/{Login,Register,Dashboard}.jsx
    │   ├── api.js
    │   ├── App.jsx
    │   └── main.jsx
    └── .env.example
```

## Setup

Prerequisites: Node.js 18+ and MongoDB running locally (or a MongoDB Atlas URI).

### Backend
```bash
cd backend
npm install
cp .env.example .env     # set MONGO_URI and JWT_SECRET
npm run dev              # http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev              # http://localhost:5173
```

## API Endpoints

| Method | Endpoint             | Auth | Description        |
|--------|----------------------|------|--------------------|
| POST   | /api/auth/register   | No   | Create account     |
| POST   | /api/auth/login      | No   | Login, returns JWT |
| GET    | /api/auth/me         | Yes  | Current user       |
| GET    | /api/todos           | Yes  | List own todos     |
| POST   | /api/todos           | Yes  | Create todo        |
| PUT    | /api/todos/:id       | Yes  | Update todo        |
| DELETE | /api/todos/:id       | Yes  | Delete todo        |

Protected requests send `Authorization: Bearer <token>`.
