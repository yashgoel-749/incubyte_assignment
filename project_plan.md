# Project Plan: Car Dealership Inventory System

## 1. Core Entities & Database Schema (PostgreSQL)

### User Table
- `id`: UUID (Primary Key)
- `name`: VARCHAR(255) (Required)
- `email`: VARCHAR(255) (Unique, Indexed, Required)
- `password_hash`: VARCHAR(255) (Required)
- `role`: VARCHAR(50) (Enum: 'CUSTOMER', 'ADMIN', Default: 'CUSTOMER')
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

### Vehicle Table
- `id`: UUID (Primary Key)
- `make`: VARCHAR(100) (Indexed, Required)
- `model`: VARCHAR(100) (Indexed, Required)
- `category`: VARCHAR(50) (Indexed, Required - e.g., SUV, Sedan, Coupe)
- `price`: NUMERIC(12, 2) (Indexed, Required, Must be >= 0)
- `quantity`: INT (Required, Must be >= 0)
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

---

## 2. API Contract Design

### Authentication (`/api/auth`)
- `POST /register` -> Register a user. Public.
- `POST /login` -> Authenticate user, return JWT. Public.

### Vehicles (`/api/vehicles`)
- `GET /` -> Fetch all available vehicles (quantity > 0). Protected (All authenticated roles).
- `GET /search` -> Filter vehicles by `make`, `model`, `category`, `minPrice`, `maxPrice`. Protected.
- `POST /` -> Create a new vehicle record. Protected (**Admin Only**).
- `PUT /:id` -> Update vehicle specifications. Protected (**Admin Only**).
- `DELETE /:id` -> Remove vehicle from inventory. Protected (**Admin Only**).

### Transactions & Inventory Operations (`/api/vehicles/:id`)
- `POST /purchase` -> Deduct 1 from `quantity`. Protected (Customers/Admins). Handles concurrent race conditions.
- `POST /restock` -> Bulk add to `quantity`. Protected (**Admin Only**).

---

## 3. System Architecture & Folder Structure

We use a strict **Controller -> Service -> Repository** layer pattern to enforce Separation of Concerns and facilitate mock-driven TDD.

```text
├── backend/
│   ├── src/
│   │   ├── config/          # Database & Env configurations
│   │   ├── controllers/     # HTTP Request parsing & response handling
│   │   ├── services/        # Central business logic layer
│   │   ├── repositories/    # Direct database queries (SQL/Data Mapper)
│   │   ├── middleware/      # Auth (JWT), Validation (Zod), Error Handler
│   │   ├── models/          # TypeScript Types / DB Entities
│   │   └── app.ts           # Express Application Factory
│   └── tests/               # Jest & Supertest Integration & Unit Suites
├── frontend/
│   └── src/
│       ├── components/      # UI Elements (Buttons, Cards, Inputs)
│       ├── context/         # AuthState & Global context management
│       ├── hooks/           # Custom React Query / Data fetching hooks
│       └── pages/           # Dashboard, Login, Register, Admin Panel