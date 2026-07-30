# Project Plan — Car Dealership Inventory System

> This document captures the full planning, architecture, development strategy, and execution timeline for the Car Dealership Inventory System — a TDD-first, full-stack application built over two days.

---

## Table of Contents

1. [Project Goal](#1-project-goal)
2. [TDD Strategy](#2-tdd-strategy)
3. [Core Entities & Database Schema](#3-core-entities--database-schema)
4. [API Contract Design](#4-api-contract-design)
5. [System Architecture](#5-system-architecture)
6. [Implementation Order](#6-implementation-order)
7. [Frontend Architecture](#7-frontend-architecture)
8. [Development Timeline — Commit Log](#8-development-timeline--commit-log)
9. [Decisions & Trade-offs](#9-decisions--trade-offs)
10. [Known Issues & Future Work](#10-known-issues--future-work)

---

## 1. Project Goal

Build a full-stack Car Dealership Inventory System with:

- **Backend** — REST API using Node.js, Express, TypeScript, Prisma, PostgreSQL
- **Frontend** — React SPA using Vite, TypeScript, Redux Toolkit, React Router, Tailwind CSS
- **Auth** — JWT-based authentication with role-based access (USER / ADMIN)
- **Testing** — TDD-first with Jest + Supertest on backend, Jest + Testing Library on frontend
- **Deployment** — Backend on Render, Frontend on Vercel

**Core user journeys:**
- Any authenticated user can browse, search, and purchase vehicles
- Admin users can add, update, delete, and restock vehicles
- All routes are protected; unauthenticated requests are rejected with 401

---

## 2. TDD Strategy

The development process strictly followed the Red → Green → Refactor cycle:

```
🔴 RED    — Write a failing test that defines the expected behaviour
🟢 GREEN  — Write the minimum code to make that test pass
🔵 REFACTOR — Clean up code without breaking any tests
```

This was applied at every layer:

| Layer | Testing Tool | What was tested |
|---|---|---|
| Backend API | Jest + Supertest | HTTP responses, status codes, auth, validation |
| JWT Middleware | Jest + Supertest | Token validity, expiry, missing headers |
| Frontend Login | Jest + Testing Library | Form state, validation, API integration |
| Frontend Registration | Jest + Testing Library | Field validation, error messages, success flow |
| Frontend Dashboard | Jest + Testing Library | Vehicle card rendering, filter state |
| Vehicle Search | Jest + Testing Library | Filter combinations, result counts |
| Purchase Workflow | Jest + Testing Library | Stock state changes, UI feedback |

**Why TDD first?**
- Forces you to think about the interface before the implementation
- Catches regressions immediately as features are added
- Produces tests that are tied to real behaviour, not implementation details
- Makes refactoring safe — the test suite acts as a contract

---

## 3. Core Entities & Database Schema

### User Model

| Field | Type | Constraints |
|---|---|---|
| `id` | Int | Primary Key, auto-increment |
| `email` | String | Unique, required |
| `password` | String | Required (bcrypt hashed) |
| `role` | String | Default: `"USER"` — values: `USER`, `ADMIN` |

### Vehicle Model

| Field | Type | Constraints |
|---|---|---|
| `id` | Int | Primary Key, auto-increment |
| `make` | String | Required |
| `model` | String | Required |
| `year` | Int | Required |
| `price` | Float | Required, must be > 0 |
| `mileage` | Int? | Optional |
| `fuelType` | String? | Optional |
| `transmission` | String? | Optional |
| `color` | String? | Optional |
| `stock` | Int | Default: 1 |
| `description` | String? | Optional |
| `imageUrl` | String? | Optional |
| `status` | String | Default: `"AVAILABLE"` — values: `AVAILABLE`, `SOLD` |
| `category` | String? | Optional — e.g., `SEDAN`, `SUV`, `TRUCK`, `EV` |
| `createdAt` | DateTime | Auto set on create |
| `updatedAt` | DateTime | Auto updated |

### Schema decisions

- Used `Float` over `Decimal` for `price` — sufficient precision for a dealership demo and simpler to work with in TypeScript
- `status` as a String rather than an Enum so Prisma migrations stay simpler during rapid development
- `stock` field tracks inventory quantity; `status` reflects the high-level availability label
- Integer primary keys (`autoincrement`) preferred over UUIDs for simplicity in this context

---

## 4. API Contract Design

Base URL: `/api`

All routes except `/auth/register` and `/auth/login` require:
```
Authorization: Bearer <jwt_token>
```

### Auth Routes — `/api/auth`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/register` | No | Register new user. Returns `{ user, token }` |
| POST | `/login` | No | Login. Returns `{ token }` on success |
| GET | `/me` | Yes | Returns current user from JWT payload |

**Registration validation (Zod):**
- `email` — valid email format, required
- `password` — minimum 6 characters, required

**Login validation (Zod):**
- `email` — valid email format, required
- `password` — required

### Vehicle Routes — `/api/vehicles`

| Method | Path | Auth | Role | Description |
|---|---|---|---|---|
| GET | `/` | Yes | Any | List all vehicles |
| GET | `/search` | Yes | Any | Filter by query params |
| GET | `/:id` | Yes | Any | Single vehicle detail |
| POST | `/` | Yes | Any | Create new vehicle |
| PUT | `/:id` | Yes | Any | Update vehicle |
| DELETE | `/:id` | Yes | ADMIN | Delete vehicle |
| POST | `/:id/purchase` | Yes | Any | Purchase — sets status to SOLD |
| POST | `/:id/restock` | Yes | ADMIN | Restock — sets status to AVAILABLE |

**Search query parameters:**
- `make` — filter by vehicle make (partial match)
- `model` — filter by model
- `category` — filter by category (SEDAN, SUV, TRUCK, EV, etc.)
- `minPrice` — minimum price filter
- `maxPrice` — maximum price filter

**Error response format (consistent across all endpoints):**
```json
{
  "error": "Human-readable error message"
}
```

**HTTP status code contract:**
| Code | Meaning |
|---|---|
| 200 | Success |
| 201 | Created |
| 400 | Bad request / validation error |
| 401 | Unauthenticated |
| 403 | Forbidden (authenticated but wrong role) |
| 404 | Resource not found |
| 409 | Conflict (e.g. duplicate email) |
| 500 | Internal server error |

---

## 5. System Architecture

### Backend Layer Pattern

```
HTTP Request
     │
     ▼
┌─────────────┐
│  Middleware  │  ← Auth (JWT), Validation (Zod), Error Handler
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Controller  │  ← Parse request, call service, return response
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Service   │  ← Business logic (password hashing, stock checks, etc.)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Repository  │  ← Prisma queries, DB access only
└──────┬──────┘
       │
       ▼
  PostgreSQL (Neon)
```

This strict separation means:
- Controllers never touch the database directly
- Services never build HTTP responses
- Repositories never contain business rules
- Each layer is independently testable

### Backend Folder Structure

```
backend/src/
├── app.ts                  # Express app factory (no listen call — testable)
├── server.ts               # Entry point — calls app.listen()
├── config/
│   └── db.ts               # Prisma client singleton
├── controllers/
│   ├── auth.controller.ts
│   └── vehicle.controller.ts
├── errors/
│   └── AppError.ts         # Custom error class with statusCode
├── middlewares/
│   ├── authenticate.ts     # JWT verification middleware
│   ├── auth.validator.ts   # Zod validation for auth routes
│   ├── vehicle.validator.ts
│   ├── validate.ts         # Generic Zod middleware runner
│   └── errorHandler.ts     # Global Express error handler
├── repositories/
│   ├── user.repository.ts
│   └── vehicle.repository.ts
├── routes/
│   ├── auth.routes.ts
│   └── vehicle.routes.ts
├── services/
│   ├── auth.service.ts
│   └── vehicle.service.ts
├── utils/
│   └── catchAsync.ts       # Wraps async controllers to forward errors
└── validators/
    ├── auth.schema.ts
    └── vehicle.schema.ts
```

### Key design decisions

**`app.ts` vs `server.ts` separation** — The Express app is exported from `app.ts` without calling `listen()`. This means Supertest can import and test the app without starting a real server. `server.ts` is the only place `listen()` is called.

**`catchAsync` wrapper** — All async controller functions are wrapped so unhandled promise rejections are forwarded to the Express error handler automatically. No try/catch blocks in controllers.

**`AppError` class** — All known errors are thrown as `new AppError(message, statusCode)`. The global error handler catches these and returns the correct HTTP response. Unknown errors return 500.

---

## 6. Implementation Order

The backend was built feature by feature, with tests written first at every step.

### Phase 1 — Backend Foundation

| Step | What | Why first |
|---|---|---|
| 1 | Initialize TypeScript + Express + Jest | Sets up the testable base |
| 2 | Health endpoint + integration test | Validates the test setup works end-to-end |
| 3 | Configure Prisma + Neon PostgreSQL | Database needed for all subsequent work |
| 4 | Registration endpoint tests → implementation | Auth is the gate for all other endpoints |
| 5 | Login endpoint tests → implementation | Produces JWTs needed to test protected routes |
| 6 | JWT middleware tests → implementation | Protects all subsequent vehicle routes |
| 7 | Centralized error handling | Needed before vehicle CRUD to ensure consistent error responses |

### Phase 2 — Vehicle CRUD (TDD each endpoint)

For each endpoint, the order was: **test → implementation → refactor**

| Order | Endpoint | Notes |
|---|---|---|
| 1 | POST `/vehicles` (create) | Simplest write operation |
| 2 | GET `/vehicles` (list) | Simplest read |
| 3 | GET `/vehicles/search` | Builds on list, adds filter logic |
| 4 | PUT `/vehicles/:id` (update) | Requires existing vehicle to update |
| 5 | DELETE `/vehicles/:id` | Admin-only, tests RBAC |
| 6 | POST `/vehicles/:id/purchase` | State transition, tests stock logic |
| 7 | POST `/vehicles/:id/restock` | Admin-only, reverses purchase |

### Phase 3 — Frontend

| Step | What |
|---|---|
| 1 | Initialize React + Vite + Redux Toolkit + Tailwind |
| 2 | Bootstrap configuration (Tailwind, path aliases, jest-jsdom) |
| 3 | Reusable UI components (Button, Input, Card) |
| 4 | Authentication UI pages (Login, Register) |
| 5 | Registration tests → connect to backend |
| 6 | Login tests → connect to backend + persist JWT in localStorage |
| 7 | Fix auto-logout on refresh (hydrate Redux from localStorage) |
| 8 | Dashboard page with vehicle cards |
| 9 | Vehicle filters on dashboard |
| 10 | Vehicle search page with filter integration tests |
| 11 | Purchase workflow connected to backend |
| 12 | Role-based UI — admin controls conditionally rendered |
| 13 | Fix TypeScript issues, remove unused files |
| 14 | Add Vercel SPA rewrite (`vercel.json`) |

---

## 7. Frontend Architecture

### State Management — Redux Toolkit

| Slice | Manages |
|---|---|
| `authSlice` | User info, JWT token, login/logout actions |
| `vehicleSlice` | Vehicle list, search results, filters, loading states |

Auth state is persisted to `localStorage` so users remain logged in on page refresh.

### Routing — React Router v7

| Route | Component | Auth Required |
|---|---|---|
| `/login` | LoginPage | No |
| `/register` | RegisterPage | No |
| `/dashboard` | DashboardPage | Yes |
| `/vehicles` | VehicleListPage | Yes |
| `/vehicles/:id` | VehicleDetailPage | Yes |
| `/inventory` | InventoryPage (Admin) | Yes — Admin only |
| `/purchases` | PurchaseHistoryPage | Yes |
| `/profile` | ProfilePage | Yes |

### Component Architecture

```
App (RouterProvider)
 └── Layout (shared nav/header)
      ├── Auth Pages (no layout wrapping)
      │    ├── LoginPage
      │    └── RegisterPage
      └── Protected Pages (require auth)
           ├── DashboardPage
           │    └── VehicleCard (reusable)
           ├── VehicleListPage
           │    └── VehicleCard
           ├── VehicleDetailPage
           ├── InventoryPage (admin)
           │    ├── AddVehicleForm
           │    └── EditVehicleForm
           └── PurchaseHistoryPage
```

### Form Handling

All forms use **React Hook Form** with **Zod** resolvers for:
- Client-side validation before any API call is made
- Type-safe form field definitions
- Clear, field-level error messages
- Prevents malformed requests from ever reaching the backend

### API Communication

All HTTP calls go through **Axios** with a shared instance that:
- Automatically attaches the `Authorization: Bearer <token>` header from Redux state
- Centralises the base URL via `VITE_API_BASE_URL` environment variable
- Handles 401 responses (token expired → auto logout)

---

## 8. Development Timeline — Commit Log

The full development was completed over **2 days** (Jul 29–30, 2026).

### Day 1 — Jul 29, 2026 — Backend

| Time | Commit | Description |
|---|---|---|
| Start | `docs: add initial project planning` | Project plan and architecture documented first |
| | `chore: initialize backend with TypeScript, Express, and Jest` | Backend skeleton |
| | `test: add integration test for health endpoint` | First test — validates test setup |
| | `test: add registration endpoint integration tests` | 🔴 RED — registration tests written |
| | `feat: implement user registration endpoint` | 🟢 GREEN — registration passes |
| | `refactor: separate registration business logic` | 🔵 REFACTOR — extract to service layer |
| | `chore: configure Prisma with Neon PostgreSQL` | Database connected |
| | `test: add login endpoint integration tests` | 🔴 RED — login tests |
| | `feat: implement user login endpoint` | 🟢 GREEN |
| | `refactor: improve authentication structure` | 🔵 REFACTOR |
| | `test: add JWT authentication middleware tests` | 🔴 RED — JWT tests |
| | `feat: implement JWT authentication middleware` | 🟢 GREEN |
| | `feat: implement centralized error handling` | AppError + global handler |
| | `test: add vehicle creation endpoint tests` | 🔴 RED |
| | `feat: implement vehicle creation endpoint` | 🟢 GREEN |
| | `refactor: separate vehicle creation business logic` | 🔵 REFACTOR |
| | `test: add vehicle listing endpoint tests` | 🔴 RED |
| | `feat: implement vehicle listing endpoint` | 🟢 GREEN |
| | `test: add vehicle search endpoint tests` | 🔴 RED |
| | `feat: implement vehicle search endpoint` | 🟢 GREEN |
| | `test: add vehicle update endpoint tests` | 🔴 RED |
| | `feat: implement vehicle update endpoint` | 🟢 GREEN |
| | `test: add vehicle deletion endpoint tests` | 🔴 RED |
| | `feat: implement vehicle deletion endpoint` | 🟢 GREEN — Admin RBAC added |
| | `test: add purchase endpoint tests` | 🔴 RED |
| | `feat: implement purchase endpoint` | 🟢 GREEN |
| | `test: add restock endpoint tests` | 🔴 RED |
| | `feat: implement vehicle restock endpoint` | 🟢 GREEN — Backend complete |

### Day 2 — Jul 30, 2026 — Frontend

| Time | Commit | Description |
|---|---|---|
| Morning | `chore: initialize React frontend with Redux Toolkit` | Frontend skeleton with Vite + TS + Redux |
| | `fix: complete frontend bootstrap and Tailwind configuration` | Tailwind + jsdom + path setup |
| | `feat: create reusable UI components` | Button, Input, Card, etc. |
| | `feat: implement authentication pages UI and fix tailwind` | Login + Register pages styled |
| | `feat: implement dashboard page` | Vehicle card grid layout |
| | `test: add registration integration and validation tests` | 🔴 RED — registration tests |
| | `feat: connect registration page to backend` | 🟢 GREEN |
| | `refactor: improve frontend login architecture` | 🔵 REFACTOR |
| | `test: add login integration tests` | 🔴 RED |
| | `test: verify frontend login implementation satisfies all tests` | 🟢 GREEN |
| | `fix: Login information which saves in local storage` | JWT persistence fix |
| | `test: add dashboard vehicle integration tests` | 🔴 RED |
| | `feat: seed vehicle inventory and dashboard vehicle cards` | 🟢 GREEN + seed data |
| | `refactor: dashboard reorganized around reusable pieces` | 🔵 REFACTOR |
| | `test: vehicle search page according filters` | 🔴 RED — search filter tests |
| | `feat: Vehicle filters on dashboard` | 🟢 GREEN |
| | `test: purchase of vehicle` | 🔴 RED |
| | `fix: Refresh automatic logout issue fixed` | Redux hydration from localStorage |
| | `feat: connect purchase workflow to backend` | 🟢 GREEN |
| | `feat: implement role-based access control as admin and user` | Admin UI gates added |
| | `fix: fix the typescript issues in frontend and delete unnecessary files` | Cleanup |
| End | `fix: add Vercel SPA rewrite` | `vercel.json` for React Router on Vercel |

---

## 9. Decisions & Trade-offs

### Why not separate test database?
A shared live Neon database was used for all integration tests. This is simpler to set up but causes test isolation issues when suites run serially — seeded data from one suite affects expected counts in another. The correct solution (a dedicated test DB or `beforeEach` teardown) was noted but not implemented within the time constraint.

### Why integers for IDs instead of UUIDs?
Autoincrement integers are simpler to work with in Supertest assertions, easier to read in logs, and sufficient for a demo application. UUIDs would be preferable in production for security and distributed system reasons.

### Why localStorage for JWT?
Redux state does not persist across page refresh by default. Storing the JWT in `localStorage` is the simplest solution for a demo app. In production, `httpOnly` cookies would be the correct approach to prevent XSS exposure.

### Why Tailwind CSS?
Rapid UI development without leaving TypeScript files. For a time-constrained project, utility classes are significantly faster than writing custom CSS or choosing a component library.

### Why Zod on both frontend and backend?
Validation schemas defined with Zod are reusable across the stack. The same shape definitions catch invalid data at the form level (frontend) and at the API boundary (backend middleware), preventing two different classes of bug with the same library.

### Why `app.ts` / `server.ts` split?
This is a testing requirement. If `listen()` is called inside `app.ts`, every test file that imports the app would attempt to bind a port, causing port conflicts and flaky tests. The split is standard practice for testable Express applications.

---

## 10. Known Issues & Future Work

### Known Issues

| Issue | Impact | Root Cause |
|---|---|---|
| Backend test isolation failures | 4 test suites fail when run together with `--runInBand` | Shared database not reset between suites; vehicle count assumptions break |
| Frontend test suite fails | All frontend tests fail | `useAuth` import resolution error in Jest/jsdom environment |
| ADMIN role registration | Admin role cannot be set via API (security correct, but limits test setup) | Registration endpoint ignores `role` field; admin users must be promoted in DB directly |

### Future Improvements

**Testing**
- Add a dedicated test database (separate `DATABASE_URL` for test environment)
- Add `beforeEach` / `afterEach` teardown that truncates tables between test runs
- Fix frontend Jest module resolution for `useAuth`
- Add E2E tests with Playwright

**Features**
- Vehicle image upload (S3 or Cloudinary)
- Pagination on vehicle listing
- Purchase history tracking with a `Purchase` table
- Email notifications on purchase/restock
- Admin dashboard with charts and inventory analytics

**Security**
- Move JWT from `localStorage` to `httpOnly` cookies
- Add refresh token rotation
- Add rate limiting on auth endpoints
- Add CSRF protection

**Infrastructure**
- CI/CD pipeline with GitHub Actions (lint → test → deploy)
- Database migrations automated on deploy
- Environment-specific config validation on startup

---

*Planning document for the Incubyte assessment — Car Dealership Inventory System.*
