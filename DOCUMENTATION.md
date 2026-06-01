# Job Board — Full Documentation

> AI-generated documentation for the Job Board application — a production-ready, full-stack platform connecting job seekers with employers.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Architecture](#3-architecture)
4. [Getting Started](#4-getting-started)
5. [Environment Variables](#5-environment-variables)
6. [Features](#6-features)
   - [Authentication](#61-authentication)
   - [Job Listings](#62-job-listings)
   - [Search & Filters](#63-search--filters)
   - [Job Details](#64-job-details)
   - [Candidate Dashboard](#65-candidate-dashboard)
   - [Recruiter Dashboard](#66-recruiter-dashboard)
   - [Saved Jobs](#67-saved-jobs)
   - [Application Management](#68-application-management)
7. [API Reference](#7-api-reference)
8. [Frontend Pages](#8-frontend-pages)
9. [State Management](#9-state-management)
10. [CI/CD Pipeline](#10-cicd-pipeline)
11. [Deployment](#11-deployment)
12. [Security](#12-security)

---

## 1. Project Overview

Job Board is a full-stack web application that enables:

- **Candidates** to discover, save, and apply for jobs
- **Recruiters** to post, manage, and review applications for job listings

The platform features role-based access control, real-time search and filtering, a responsive UI, and a RESTful API backend.

---

## 2. Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18 | UI library |
| Vite | 5 | Build tool & dev server |
| Tailwind CSS | 3 | Utility-first styling |
| React Router | 6 | Client-side routing |
| Redux Toolkit | 2 | Global state management |
| Axios | 1.6 | HTTP client |
| React Hook Form | 7 | Form handling & validation |
| React Hot Toast | 2 | Toast notifications |
| Lucide React | 0.303 | Icon library |
| date-fns | 3 | Date formatting |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | 20 | Runtime |
| Express.js | 4 | Web framework |
| MongoDB | — | Database |
| Mongoose | 8 | ODM |
| JSON Web Token | 9 | Authentication |
| bcryptjs | 2 | Password hashing |
| Cloudinary | 1 | File storage (resumes, avatars) |
| Multer | 1 | File upload middleware |
| Helmet | 7 | HTTP security headers |
| express-rate-limit | 7 | API rate limiting |
| Morgan | 1 | HTTP request logging |
| express-validator | 7 | Input validation |

---

## 3. Architecture

```
jobBoard/
├── .github/
│   └── workflows/
│       └── ci-cd.yml          # GitHub Actions CI/CD pipeline
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── job.controller.js
│   │   ├── application.controller.js
│   │   └── user.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js  # JWT protect + authorize
│   │   ├── error.middleware.js # Global error handler
│   │   └── upload.middleware.js# Cloudinary/Multer
│   ├── models/
│   │   ├── User.model.js
│   │   ├── Job.model.js
│   │   └── Application.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── job.routes.js
│   │   ├── application.routes.js
│   │   └── user.routes.js
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── sendEmail.js
│   ├── server.js
│   ├── vercel.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── auth/           # AuthForm wrapper
    │   │   ├── common/         # ProtectedRoute, Spinner, Pagination
    │   │   ├── dashboard/      # DashboardSidebar
    │   │   ├── jobs/           # JobCard, JobFilters
    │   │   └── layout/         # Navbar, Footer, MainLayout
    │   ├── hooks/
    │   │   ├── useAuth.js
    │   │   └── useDebounce.js
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Jobs.jsx
    │   │   ├── JobDetails.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── About.jsx
    │   │   ├── NotFound.jsx
    │   │   └── dashboard/
    │   │       ├── candidate/  # Dashboard, Applications, SavedJobs, Profile
    │   │       └── recruiter/  # Dashboard, PostJob, ManageJobs, ViewApplications, Profile
    │   ├── store/
    │   │   ├── store.js
    │   │   └── slices/
    │   │       ├── authSlice.js
    │   │       ├── jobSlice.js
    │   │       └── applicationSlice.js
    │   └── utils/
    │       ├── api.js          # Axios instance with JWT interceptor
    │       └── formatters.js   # Date, salary, status formatters
    ├── vercel.json
    └── tailwind.config.js
```

---

## 4. Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account (for file uploads)

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your values
npm run dev
# Server starts at http://localhost:5000
```

### Frontend Setup

```bash
cd frontend
npm install
# Create .env.local with:
# VITE_API_URL=http://localhost:5000/api
npm run dev
# App starts at http://localhost:5173
```

---

## 5. Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Server port (default: 5000) |
| `NODE_ENV` | Yes | `development` or `production` |
| `MONGO_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret key for JWT signing (min 32 chars) |
| `JWT_EXPIRE` | No | Token expiry (default: `30d`) |
| `CLOUDINARY_CLOUD_NAME` | Yes | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Yes | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Yes | Cloudinary API secret |
| `EMAIL_HOST` | No | SMTP host for email notifications |
| `EMAIL_PORT` | No | SMTP port |
| `EMAIL_USER` | No | SMTP username |
| `EMAIL_PASS` | No | SMTP password |
| `CLIENT_URL` | Yes | Frontend URL for CORS (e.g., `https://yourapp.vercel.app`) |

### Frontend (`frontend/.env.local`)

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | Yes | Backend API base URL (e.g., `https://api.yourapp.vercel.app/api`) |

---

## 6. Features

### 6.1 Authentication

The platform uses **JWT-based authentication** with role-based access control.

#### User Roles
| Role | Description |
|---|---|
| `candidate` | Job seekers who can apply for jobs |
| `recruiter` | Employers who can post and manage jobs |
| `admin` | Platform administrators with full access |

#### Registration
- Users choose their role (candidate or recruiter) during sign-up
- Passwords are hashed with **bcryptjs** (10 salt rounds)
- A JWT token is returned on successful registration

#### Login
- Email + password authentication
- Returns a JWT token stored in `localStorage`
- Inactive accounts are rejected with a 403 error

#### Session Persistence
- On app load, `loadUser()` is dispatched to restore the session from the stored token
- The Axios interceptor automatically attaches the token to every request
- 401 responses clear the token and redirect to `/login`

---

### 6.2 Job Listings

Each job card displays:
- **Company Logo** — from Cloudinary or a fallback icon
- **Job Title** — links to the full job details page
- **Company Name**
- **Location** — city/country
- **Salary Range** — formatted as `$80,000 – $120,000 / year`
- **Experience Level** — color-coded badge (entry, mid, senior, lead, executive)
- **Job Type** — full-time, part-time, contract, internship, freelance
- **Work Mode** — remote, onsite, hybrid
- **Posted Date** — relative time (e.g., "3 days ago")
- **Skills** — up to 3 skill tags shown, with overflow count
- **Save Button** — bookmark icon to save/unsave the job locally

Featured jobs are visually highlighted with a "Featured" badge.

---

### 6.3 Search & Filters

#### Search
- **Keyword search** — searches job title, description, company name, and skills via MongoDB text index
- **Location search** — regex-based location filter
- **Debounced input** — 400ms debounce prevents excessive API calls

#### Filters (sidebar)
| Filter | Type | Options |
|---|---|---|
| Location | Text input | Any city/country |
| Sort By | Dropdown | Newest, Oldest, Highest Salary, Lowest Salary |
| Salary Range | Radio | Under $50k, $50k–$80k, $80k–$120k, $120k–$180k, $180k+ |
| Job Type | Checkbox | full-time, part-time, contract, internship, freelance |
| Work Mode | Checkbox | remote, onsite, hybrid |
| Experience Level | Checkbox | entry, mid, senior, lead, executive |
| Category | Checkbox | Engineering, Design, Marketing, Sales, Finance, HR, etc. |

Active filter count is shown on the filter button. "Clear all" resets all filters.

On mobile, filters appear in a slide-in drawer triggered by the "Filters" button.

#### Pagination
- 10 jobs per page by default
- Page navigation with previous/next and numbered pages
- Smooth scroll to top on page change

---

### 6.4 Job Details

The job details page (`/jobs/:id`) shows:

**Left column (main content):**
- Company logo + job title + company name
- Location, job type, posted date, salary
- Full job description
- Requirements list
- Responsibilities list
- Apply form (for candidates)

**Right sidebar:**
- Apply Now button (candidates) / Sign in to Apply (guests)
- Work mode, experience level, category, deadline
- Required skills tags
- Company website link

#### Applying for a Job
1. Candidate clicks "Apply Now"
2. An inline form appears with an optional cover letter textarea
3. The candidate's profile resume is automatically attached
4. On submission, the application is created and the job's `applicationsCount` is incremented
5. Duplicate applications are prevented at the database level (unique compound index)

---

### 6.5 Candidate Dashboard

**Overview** (`/dashboard/candidate`)
- Stats cards: Total Applied, In Review, Shortlisted, Offers
- Recent applications list (last 5) with status badges
- Quick link to browse jobs

**My Applications** (`/dashboard/candidate/applications`)
- Full list of all submitted applications
- Each card shows: job title, company, location, job type, applied date, status badge
- Withdraw button for active applications (not available for offered/rejected/withdrawn)
- Expandable cover letter preview

**Saved Jobs** (`/dashboard/candidate/saved`)
- Jobs saved via the bookmark button on job cards
- Stored in `localStorage` for persistence without requiring a backend
- Remove individual saved jobs
- Direct "View Job" and "Apply" links

**Profile** (`/dashboard/candidate/profile`)
- Update name, bio, location, years of experience, skills
- Upload/replace resume (PDF, DOC, DOCX — max 5 MB)
- View current resume link

---

### 6.6 Recruiter Dashboard

**Overview** (`/dashboard/recruiter`)
- Stats: Active Jobs, Total Applications, Total Views
- Recent job postings with applicant count and view count
- Quick "Post a Job" button

**Post a Job** (`/dashboard/recruiter/post-job`)
Full job creation form with:
- Job title, description, requirements (one per line), responsibilities (one per line)
- Skills (comma-separated)
- Location, category, job type, work mode, experience level
- Application deadline
- Salary range (min/max) with visibility toggle
- Company name and website

**Manage Jobs** (`/dashboard/recruiter/jobs`)
- List of all posted jobs with status (Active/Closed)
- Applicant count and view count per job
- "View Applicants" link per job
- Close/delete job button

**View Applicants** (`/dashboard/recruiter/jobs/:jobId/applications`)
- Full list of applicants for a specific job
- Each card shows: avatar, name, email, location, experience, skills, applied date
- Resume download link
- Current status badge
- Status dropdown to update: pending → reviewed → shortlisted → interview → offered → rejected
- Expandable cover letter

**Company Profile** (`/dashboard/recruiter/profile`)
- Update recruiter name
- Update company name, website, description

---

### 6.7 Saved Jobs

Saved jobs are stored in the browser's `localStorage` under two keys:
- `savedJobs` — array of job IDs (used for the bookmark icon state)
- `savedJobsData` — array of full job objects (used for the Saved Jobs page)

This approach works without authentication and persists across sessions.

The bookmark icon on each `JobCard` toggles the saved state and shows a filled bookmark when saved.

---

### 6.8 Application Management

#### Application Statuses
| Status | Description |
|---|---|
| `pending` | Just submitted, awaiting review |
| `reviewed` | Recruiter has viewed the application |
| `shortlisted` | Candidate is shortlisted |
| `interview` | Interview scheduled |
| `offered` | Job offer extended |
| `rejected` | Application rejected |
| `withdrawn` | Candidate withdrew the application |

Status history is tracked in the `statusHistory` array on each application document.

---

## 7. API Reference

Base URL: `https://your-backend.vercel.app/api`

### Authentication

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Register a new user |
| POST | `/auth/login` | Public | Login and get JWT |
| GET | `/auth/me` | Private | Get current user |
| PUT | `/auth/update-password` | Private | Change password |

**Register request body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "secret123",
  "role": "candidate"
}
```

**Login response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "candidate",
    "avatar": { "url": "" }
  }
}
```

---

### Jobs

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/jobs` | Public | Get all jobs (with filters) |
| GET | `/jobs/:id` | Public | Get single job |
| GET | `/jobs/my-jobs` | Recruiter | Get recruiter's own jobs |
| POST | `/jobs` | Recruiter | Create a new job |
| PUT | `/jobs/:id` | Recruiter (owner) | Update a job |
| DELETE | `/jobs/:id` | Recruiter (owner) | Deactivate a job |

**GET /jobs query parameters:**
| Param | Type | Description |
|---|---|---|
| `keyword` | string | Full-text search |
| `location` | string | Location regex filter |
| `jobType` | string | full-time, part-time, etc. |
| `locationType` | string | remote, onsite, hybrid |
| `experienceLevel` | string | entry, mid, senior, etc. |
| `category` | string | Job category |
| `minSalary` | number | Minimum salary filter |
| `maxSalary` | number | Maximum salary filter |
| `sort` | string | Sort field (default: `-createdAt`) |
| `page` | number | Page number (default: 1) |
| `limit` | number | Results per page (default: 10) |

---

### Applications

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/applications/:jobId` | Candidate | Apply for a job |
| GET | `/applications/my-applications` | Candidate | Get own applications |
| DELETE | `/applications/:id` | Candidate | Withdraw application |
| GET | `/applications/job/:jobId` | Recruiter | Get applications for a job |
| PUT | `/applications/:id/status` | Recruiter | Update application status |

---

### Users

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/users/:id` | Public | Get user profile |
| PUT | `/users/profile` | Private | Update profile |
| PUT | `/users/avatar` | Private | Upload avatar |
| PUT | `/users/resume` | Candidate | Upload resume |
| GET | `/users` | Admin | Get all users |
| DELETE | `/users/:id` | Admin | Deactivate user |

---

## 8. Frontend Pages

| Route | Component | Access | Description |
|---|---|---|---|
| `/` | Home | Public | Hero, categories, how it works, CTA |
| `/jobs` | Jobs | Public | Job listing with search & filters |
| `/jobs/:id` | JobDetails | Public | Full job details + apply form |
| `/login` | Login | Public | Email/password login |
| `/register` | Register | Public | Role-based registration |
| `/about` | About | Public | Mission, values, CTA |
| `*` | NotFound | Public | 404 page |
| `/dashboard/candidate` | CandidateDashboard | Candidate | Stats + recent applications |
| `/dashboard/candidate/applications` | MyApplications | Candidate | All applications |
| `/dashboard/candidate/saved` | SavedJobs | Candidate | Bookmarked jobs |
| `/dashboard/candidate/profile` | CandidateProfile | Candidate | Edit profile + resume |
| `/dashboard/recruiter` | RecruiterDashboard | Recruiter | Stats + recent jobs |
| `/dashboard/recruiter/post-job` | PostJob | Recruiter | Create new job |
| `/dashboard/recruiter/jobs` | ManageJobs | Recruiter | Manage all jobs |
| `/dashboard/recruiter/jobs/:jobId/applications` | ViewApplications | Recruiter | Review applicants |
| `/dashboard/recruiter/profile` | RecruiterProfile | Recruiter | Edit company profile |

---

## 9. State Management

Redux Toolkit manages three slices:

### `authSlice`
```
state.auth = {
  user: null | UserObject,
  token: string | null,
  isAuthenticated: boolean,
  loading: boolean,
  error: string | null
}
```
**Actions:** `logout`, `clearError`  
**Thunks:** `registerUser`, `loginUser`, `loadUser`, `updatePassword`

### `jobSlice`
```
state.jobs = {
  jobs: Job[],
  currentJob: Job | null,
  myJobs: Job[],
  total: number,
  totalPages: number,
  currentPage: number,
  loading: boolean,
  error: string | null,
  filters: {
    keyword, location, jobType, locationType,
    experienceLevel, category, minSalary, maxSalary, sort
  }
}
```
**Actions:** `setFilters`, `clearFilters`, `clearCurrentJob`, `clearError`  
**Thunks:** `fetchJobs`, `fetchJobById`, `createJob`, `updateJob`, `deleteJob`, `fetchMyJobs`

### `applicationSlice`
```
state.applications = {
  myApplications: Application[],
  jobApplications: Application[],
  loading: boolean,
  error: string | null
}
```
**Actions:** `clearError`  
**Thunks:** `applyForJob`, `fetchMyApplications`, `fetchApplicationsForJob`, `updateApplicationStatus`, `withdrawApplication`

---

## 10. CI/CD Pipeline

The GitHub Actions pipeline (`.github/workflows/ci-cd.yml`) runs on every push to `main`/`master` and on pull requests.

### Jobs

#### `frontend-ci` — Frontend Lint & Build
1. Checkout code
2. Set up Node.js 20 with npm cache
3. `npm ci` — install dependencies
4. `npm run lint` — ESLint check
5. `npm run build` — Vite production build
6. Upload `dist/` as artifact

#### `backend-ci` — Backend Validation
1. Checkout code
2. Set up Node.js 20 with npm cache
3. `npm ci` — install dependencies
4. Validate `package.json` syntax
5. Check for Node.js syntax errors

#### `deploy-frontend` — Deploy to Vercel (on main only)
1. Requires `frontend-ci` to pass
2. Install Vercel CLI
3. Pull Vercel environment configuration
4. Build via Vercel
5. Deploy to production
6. Comment deployment URL on PRs

#### `deploy-backend` — Deploy Backend to Vercel (on main only)
1. Requires `backend-ci` to pass
2. Install Vercel CLI
3. Pull Vercel environment configuration
4. Deploy to production

### Required GitHub Secrets

| Secret | Description |
|---|---|
| `VERCEL_TOKEN` | Vercel personal access token |
| `VITE_API_URL` | Backend API URL for frontend build |

---

## 11. Deployment

### Frontend on Vercel

1. Import the `frontend/` folder as a Vercel project
2. Set framework preset to **Vite**
3. Set root directory to `frontend`
4. Add environment variable: `VITE_API_URL=https://your-backend.vercel.app/api`
5. The `vercel.json` rewrites all routes to `index.html` for SPA routing

### Backend on Vercel

1. Import the `backend/` folder as a separate Vercel project
2. Set root directory to `backend`
3. Add all environment variables from `.env.example`
4. The `vercel.json` routes all requests to `server.js`

### Manual Deployment

```bash
# Frontend
cd frontend
npm run build
vercel --prod

# Backend
cd backend
vercel --prod
```

---

## 12. Security

| Measure | Implementation |
|---|---|
| Password hashing | bcryptjs with 10 salt rounds |
| JWT authentication | Signed tokens with configurable expiry |
| HTTP security headers | Helmet middleware |
| Rate limiting | 100 requests per 15 minutes per IP |
| CORS | Restricted to `CLIENT_URL` origin |
| Input validation | express-validator on all POST/PUT routes |
| File upload limits | 5 MB for resumes, 2 MB for images |
| Role-based access | `protect` + `authorize` middleware on all private routes |
| Duplicate prevention | Unique compound index on `(job, applicant)` in applications |
| XSS protection | `X-XSS-Protection` header via Helmet |
| Clickjacking protection | `X-Frame-Options: DENY` header |

---

*Documentation generated with AI assistance. Last updated: May 2026.*
