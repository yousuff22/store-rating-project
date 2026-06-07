# Store Rating Platform

A full-stack web application where users can submit ratings (1–5) for registered stores. Built as a FullStack Intern Coding Challenge using the **PERN stack** (PostgreSQL, Express, React, Node.js).

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)
- [Role-Based Access](#role-based-access)
- [Form Validations](#form-validations)
- [Default Credentials](#default-credentials)

---

## Features

### System Administrator
- Dashboard showing total users, total stores, and total submitted ratings
- Add new Normal Users, Store Owners, and Admin Users
- Add new stores and assign them to Store Owners
- View and filter all users (by Name, Email, Address, Role) with sortable table
- View and filter all stores (by Name, Email, Address) with sortable table
- Store Owner rows in the user list display the average rating of their store

### Normal User
- Self-registration (signup) and login
- Browse all registered stores with search by Name and Address
- See each store's overall average rating and their own submitted rating
- Submit or modify a rating (1–5) for any store
- Update their own password

### Store Owner
- Login only (accounts created by Admin)
- Dashboard showing their store's average rating
- View list of all users who rated their store, with individual ratings and dates
- Update their own password

### All Roles
- JWT-based authentication — single login endpoint for all roles
- Automatic role-based redirect after login (Admin → `/admin`, Store Owner → `/owner`, Normal User → `/stores`)
- Session persists across page refresh
- Automatic logout on token expiry (401 interceptor)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, React Router v6, Axios |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL 16 |
| ORM | Prisma 5 |
| Auth | JWT (`jsonwebtoken`), bcrypt (`bcryptjs`) |
| Validation | `express-validator` (backend), custom pure functions (frontend) |
| Security | `helmet`, CORS, input sanitization, bcrypt password hashing |

---

## Project Structure

```
assigmentProject/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma         # Database models (User, Store, Rating)
│   │   ├── migrations/           # Auto-generated SQL migrations
│   │   └── seed.ts               # Seeds initial Admin user
│   └── src/
│       ├── app.ts                # Express app setup (middleware + routes)
│       ├── server.ts             # Entry point
│       ├── config/env.ts         # Validated environment variables
│       ├── lib/prisma.ts         # Singleton Prisma client
│       ├── middleware/
│       │   ├── authenticate.ts   # Verifies JWT, attaches req.user
│       │   ├── authorize.ts      # RBAC factory: authorize(Role.ADMIN)
│       │   ├── validate.ts       # Runs express-validator chains → 422
│       │   └── errorHandler.ts   # Global error handler (maps Prisma errors)
│       ├── utils/
│       │   ├── response.ts       # Unified JSON response helpers
│       │   ├── jwt.ts            # signToken / verifyToken
│       │   └── password.ts       # hashPassword / comparePassword
│       └── modules/
│           ├── auth/             # signup, login, change password
│           ├── users/            # admin user management
│           ├── stores/           # store listing and creation
│           ├── ratings/          # submit / modify ratings
│           └── admin/            # dashboard stats endpoint
│
└── frontend/
    └── src/
        ├── api/
        │   ├── axiosInstance.ts  # JWT interceptor + global 401 handler
        │   ├── authApi.ts
        │   ├── usersApi.ts
        │   ├── storesApi.ts
        │   ├── ratingsApi.ts
        │   └── adminApi.ts
        ├── context/
        │   └── AuthContext.tsx   # Global auth state + localStorage persistence
        ├── components/
        │   ├── ProtectedRoute.tsx
        │   ├── Navbar.tsx
        │   ├── FormField.tsx
        │   ├── LoadingSpinner.tsx
        │   ├── Table/            # Generic sortable Table<T> component
        │   └── StarRating/       # Interactive StarRating + read-only StarDisplay
        ├── hooks/
        │   ├── useTableSort.ts   # Sort state + sorted() helper
        │   └── useTableFilter.ts # Filter state + filtered() helper
        ├── pages/
        │   ├── auth/             # LoginPage, SignupPage, UpdatePasswordPage
        │   ├── admin/            # AdminDashboard, AdminUsersPage, AdminStoresPage
        │   ├── user/             # UserStorePage
        │   └── storeOwner/       # OwnerDashboard
        ├── types/index.ts        # Shared TypeScript interfaces
        └── utils/validators.ts   # Client-side validation (mirrors backend rules)
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 16 running locally

### 1. Clone and install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure the backend environment

Copy `.env.example` to `.env` and fill in your PostgreSQL credentials:

```bash
cd backend
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/store_rating_db?schema=public"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
PORT=4000
NODE_ENV="development"
CORS_ORIGIN="http://localhost:5173"
```

> **Note:** If your PostgreSQL password contains special characters (e.g. `@`), URL-encode them in `DATABASE_URL`. For example, `Pass@1234` becomes `Pass%401234`.

### 3. Set up the database

```bash
cd backend

# Create tables via migration
npm run db:migrate

# Seed the initial admin user
npm run db:seed
```

### 4. Run the application

Open two terminals:

```bash
# Terminal 1 — Backend (http://localhost:4000)
cd backend
npm run dev

# Terminal 2 — Frontend (http://localhost:5173)
cd frontend
npm run dev
```

Open your browser at **http://localhost:5173**.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:pass@localhost:5432/store_rating_db` |
| `JWT_SECRET` | Secret key for signing JWTs | any long random string |
| `JWT_EXPIRES_IN` | Token expiry duration | `7d` |
| `PORT` | Backend server port | `4000` |
| `NODE_ENV` | Environment | `development` |
| `CORS_ORIGIN` | Allowed frontend origin | `http://localhost:5173` |

---

## Database Schema

Three tables with normalized relationships:

```
users
  id, name, email, password (hashed), address, role (ADMIN | NORMAL_USER | STORE_OWNER)

stores
  id, name, email, address, owner_id → users.id (UNIQUE — one owner per store)

ratings
  id, value (1–5), user_id → users.id, store_id → stores.id
  UNIQUE(user_id, store_id) — one rating per user per store, enables upsert
```

**Design decisions:**
- The average rating is **never stored** — it is always computed live via SQL aggregation. This prevents stale data.
- `STORE_OWNER` is a role value on the `users` table, not a separate table. All three roles share one login endpoint.
- The `UNIQUE(user_id, store_id)` constraint on ratings allows a single `POST /api/ratings` endpoint to handle both first-time submissions and modifications (Prisma `upsert`).
- Deleting a user or store automatically removes their ratings via `ON DELETE CASCADE`.

---

## API Reference

All responses follow a unified JSON shape:

```json
// Success
{ "success": true, "data": { ... }, "message": "optional" }

// Error
{ "success": false, "message": "...", "errors": [{ "field": "name", "message": "..." }] }
```

### Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/signup` | Public | Register a new Normal User |
| `POST` | `/login` | Public | Login — returns JWT + user object |
| `PATCH` | `/password` | Any role | Update own password |

### Admin Stats — `/api/admin`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/stats` | Admin | Returns `{ totalUsers, totalStores, totalRatings }` |

### Users — `/api/users`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/` | Admin | List all users. Query params: `name`, `email`, `address`, `role`, `sortBy`, `sortDir` |
| `POST` | `/` | Admin | Create a Normal User or Store Owner |
| `POST` | `/admins` | Admin | Create an Admin user |
| `GET` | `/:id` | Admin | Get single user (includes store avg rating if Store Owner) |

### Stores — `/api/stores`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/` | Admin, Normal User | List stores. Query params: `name`, `address`, `sortBy`, `sortDir`. Normal Users also receive `userRating` per store. |
| `POST` | `/` | Admin | Create a store. Body must include `ownerId` of a Store Owner user without an existing store. |
| `GET` | `/mine` | Store Owner | Get own store with avg rating and rater list |
| `GET` | `/:id` | Admin, Normal User | Get a single store with avg rating |

### Ratings — `/api/ratings`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/` | Normal User | Submit or modify a rating. Body: `{ storeId, value }`. Same endpoint handles both actions via upsert. |
| `GET` | `/store/:storeId` | Admin, Store Owner | Get all ratings for a store with rater details |

---

## Role-Based Access

```
ADMIN
  ├── POST /api/auth/login
  ├── PATCH /api/auth/password
  ├── GET  /api/admin/stats
  ├── GET  /api/users
  ├── POST /api/users
  ├── POST /api/users/admins
  ├── GET  /api/users/:id
  ├── GET  /api/stores
  ├── POST /api/stores
  ├── GET  /api/stores/:id
  └── GET  /api/ratings/store/:storeId

NORMAL_USER
  ├── POST /api/auth/signup (public)
  ├── POST /api/auth/login  (public)
  ├── PATCH /api/auth/password
  ├── GET  /api/stores          (response includes userRating per store)
  ├── GET  /api/stores/:id
  └── POST /api/ratings

STORE_OWNER
  ├── POST /api/auth/login (public)
  ├── PATCH /api/auth/password
  ├── GET  /api/stores/mine
  └── GET  /api/ratings/store/:storeId
```

---

## Form Validations

The same rules are enforced on **both** the frontend (before the network request) and the backend (via `express-validator`):

| Field | Rule |
|-------|------|
| Name | Minimum 20 characters, maximum 60 characters |
| Address | Maximum 400 characters |
| Email | Standard email format |
| Password | 8–16 characters, at least one uppercase letter, at least one special character |
| Rating | Integer between 1 and 5 (inclusive) |

**Password regex:** `/^(?=.*[A-Z])(?=.*[!@#$%^&*()\-_=+{};:,<.>/?]).{8,16}$/`

---

## Default Credentials

After running `npm run db:seed` in the backend, a default admin account is created:

| Field | Value |
|-------|-------|
| Email | `admin@storerating.com` |
| Password | `Admin@123` |
| Role | System Administrator |

> Change this password after first login via the Change Password page.

---

## Available Scripts

### Backend

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled production build |
| `npm run db:migrate` | Apply Prisma migrations to the database |
| `npm run db:seed` | Insert the default admin user |
| `npm run db:studio` | Open Prisma Studio (visual DB browser) |
| `npm run db:generate` | Regenerate Prisma client after schema changes |

### Frontend

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite development server on port 5173 |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
