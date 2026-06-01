# Job Board — Full-Stack Application

A full-stack job board built with React + Vite on the frontend and Node.js + Express + MongoDB on the backend.

## Tech Stack

| Layer     | Technology                                              |
|-----------|---------------------------------------------------------|
| Frontend  | React 18, Vite, Tailwind CSS, React Router v6, Redux Toolkit, Axios |
| Backend   | Node.js, Express.js, MongoDB + Mongoose, JWT, bcryptjs |
| Storage   | Cloudinary (resumes & avatars)                          |

---

## Project Structure

```
jobBoard/
├── backend/
│   ├── config/          # MongoDB connection
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Auth, error, upload middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routers
│   ├── utils/           # Token generation, email
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   │   ├── auth/
    │   │   ├── common/
    │   │   ├── dashboard/
    │   │   ├── jobs/
    │   │   └── layout/
    │   ├── hooks/
    │   ├── pages/
    │   │   ├── dashboard/
    │   │   │   ├── candidate/
    │   │   │   └── recruiter/
    │   │   └── ...
    │   ├── store/
    │   │   └── slices/
    │   └── utils/
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## Getting Started

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in your values
npm run dev            # starts on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev            # starts on http://localhost:5173
```

---

## Environment Variables (backend/.env)

| Variable                  | Description                        |
|---------------------------|------------------------------------|
| `PORT`                    | Server port (default 5000)         |
| `MONGO_URI`               | MongoDB connection string          |
| `JWT_SECRET`              | Secret key for JWT signing         |
| `JWT_EXPIRE`              | Token expiry (e.g. `30d`)          |
| `CLOUDINARY_CLOUD_NAME`   | Cloudinary cloud name              |
| `CLOUDINARY_API_KEY`      | Cloudinary API key                 |
| `CLOUDINARY_API_SECRET`   | Cloudinary API secret              |
| `EMAIL_HOST`              | SMTP host                          |
| `EMAIL_PORT`              | SMTP port                          |
| `EMAIL_USER`              | SMTP username                      |
| `EMAIL_PASS`              | SMTP password                      |
| `CLIENT_URL`              | Frontend URL for CORS              |

---

## API Endpoints

### Auth
| Method | Route                        | Access  |
|--------|------------------------------|---------|
| POST   | `/api/auth/register`         | Public  |
| POST   | `/api/auth/login`            | Public  |
| GET    | `/api/auth/me`               | Private |
| PUT    | `/api/auth/update-password`  | Private |

### Jobs
| Method | Route                  | Access              |
|--------|------------------------|---------------------|
| GET    | `/api/jobs`            | Public              |
| GET    | `/api/jobs/:id`        | Public              |
| GET    | `/api/jobs/my-jobs`    | Recruiter           |
| POST   | `/api/jobs`            | Recruiter           |
| PUT    | `/api/jobs/:id`        | Recruiter (owner)   |
| DELETE | `/api/jobs/:id`        | Recruiter (owner)   |

### Applications
| Method | Route                              | Access    |
|--------|------------------------------------|-----------|
| POST   | `/api/applications/:jobId`         | Candidate |
| GET    | `/api/applications/my-applications`| Candidate |
| DELETE | `/api/applications/:id`            | Candidate |
| GET    | `/api/applications/job/:jobId`     | Recruiter |
| PUT    | `/api/applications/:id/status`     | Recruiter |

### Users
| Method | Route                  | Access    |
|--------|------------------------|-----------|
| GET    | `/api/users/:id`       | Public    |
| PUT    | `/api/users/profile`   | Private   |
| PUT    | `/api/users/avatar`    | Private   |
| PUT    | `/api/users/resume`    | Candidate |
| GET    | `/api/users`           | Admin     |
| DELETE | `/api/users/:id`       | Admin     |
