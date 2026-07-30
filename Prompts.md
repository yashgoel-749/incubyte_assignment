# AI Prompts History — Car Dealership Inventory System

> This file contains the complete history of every AI prompt used during development — what I asked, which tool I used, what it produced, and which commit it maps to. Written in the order I actually worked through the project.

---

## How I worked with AI

I used three tools across this project:
- **Antigravity** — main coding IDE, used for scaffolding, refactoring, and generating implementation code
- **Claude** — architecture decisions, debugging tricky issues, reasoning through design choices
- **ChatGPT** — writing tests, fixing config errors, explaining why things were breaking

The workflow was always the same: write the prompt, review what came back, run the tests, fix anything that needed fixing, then commit. I never pasted a huge batch of prompts at once — one at a time, always.

---

## Sprint 1 — Backend Foundation + Authentication

---

### Prompt 0 — Project Planning

**Tool:** ChatGPT
**Commit:** `docs: add initial project planning`

**What I asked:**
> I'm building a Car Dealership Inventory System for an assignment. Need to do it TDD-first. Before I write any code, help me think through the database schema, the API endpoints I'll need, what order to build things in, and how to structure the folders. Stack is Node, Express, TypeScript, Prisma, PostgreSQL, Jest, Supertest. Don't write any code yet, just help me plan.

**What came back:**
- Full database schema for `User` and `Vehicle` tables with field types and constraints
- Complete API endpoint list for auth and vehicle routes with HTTP methods
- Recommended build order: bootstrap → auth → vehicle CRUD → frontend
- Folder structure following Controller → Service → Repository pattern
- Explanation of why `app.ts` and `server.ts` should be separate for testing

**What I did with it:**
Wrote it up into `project_plan.md` and used it as the reference doc for everything that followed.

---

### Prompt 1 — Backend Bootstrap

**Tool:** Antigravity
**Commit:** `chore: initialize backend with TypeScript, Express, and Jest`

**What I asked:**
> Set up the backend project from scratch. I need TypeScript, Express, Jest with Supertest, dotenv, ts-node-dev for dev server. Create the package.json, tsconfig.json, jest.config.ts, .gitignore, .env.example. For the Express app just set up cors and express.json() — no routes yet except a GET /health that returns { status: "UP" }. Keep app.ts and server.ts separate so the app is importable without starting the server.

**What came back:**
- `package.json` with all dependencies and scripts (`dev`, `build`, `test`)
- `tsconfig.json` with strict mode and module resolution configured
- `jest.config.ts` using `ts-jest` with testEnvironment set to `node`
- `src/app.ts` exporting the Express app with cors, json middleware, and health route
- `src/server.ts` that imports app and calls `listen()`
- `.env.example` with PORT and DATABASE_URL placeholders
- `.gitignore` excluding node_modules, dist, .env

**What I did with it:**
Ran `npm install`, verified it compiled, confirmed the health route responded at localhost:3000/health.

---

### Prompt 2 — Health Endpoint Test

**Tool:** ChatGPT
**Commit:** `test: add integration test for health endpoint`

**What I asked:**
> Write a failing Jest + Supertest integration test for GET /health. It should check status 200 and that the body is { status: "UP" }. Put it in backend/tests/app.test.ts. Don't touch any application code, just the test file.

**What came back:**
- `tests/app.test.ts` with a `describe` block for the health endpoint
- Two `it` blocks: one checking HTTP 200, one checking the JSON body
- Import of the Express app via `supertest(app)`

**What I did with it:**
Ran `npm test` — test was red because the health endpoint didn't exist yet. Good. That's the point.

---

### Prompt 3 — Prisma + PostgreSQL Setup

**Tool:** Antigravity + ChatGPT
**Commit:** `chore: configure Prisma with Neon PostgreSQL`

**What I asked:**
> Set up Prisma ORM connected to a Neon PostgreSQL database. I need the prisma schema file with User and Vehicle models, the Prisma client singleton in src/config/db.ts, and the DATABASE_URL in the .env. User model needs id, email, password, role. Vehicle needs id, make, model, year, price, status, stock, category and the optional fields like mileage, color, transmission, fuelType, description, imageUrl. Don't run migrations yet.

I also asked ChatGPT separately:
> What's the right way to configure the Prisma client as a singleton in a TypeScript Express app so it doesn't create too many connections during tests?

**What came back:**
- `prisma/schema.prisma` with both models and Neon connection config
- `src/config/db.ts` exporting a single `prisma` instance with the standard dev/prod singleton pattern
- Explanation of why global singleton matters in test environments

**What I did with it:**
Set up the Neon database, filled in `DATABASE_URL` in `.env`, ran `npx prisma migrate dev` to create the tables.

---

### Prompt 4 — Registration Tests

**Tool:** ChatGPT
**Commit:** `test: add registration endpoint integration tests`

**What I asked:**
> Write failing Supertest integration tests for POST /api/auth/register. Cover: successful registration returns 201 with user and token, missing email gives 400, missing password gives 400, invalid email format gives 400, duplicate email gives 409. Tests only — no implementation code. File goes in backend/tests/auth.test.ts.

**What came back:**
- `tests/auth.test.ts` with five `it` blocks covering all the cases above
- Each test sending a different payload and asserting the status code
- The 409 test registers the same email twice and checks the second response

**What I did with it:**
Ran `npm test` — all five failed with 404 because the route didn't exist yet. Exactly right.

---

### Prompt 5 — Registration Implementation

**Tool:** Antigravity
**Commit:** `feat: implement user registration endpoint`

**What I asked:**
> Implement the registration endpoint just enough to make those tests pass. POST /api/auth/register should validate the body, hash the password with bcryptjs, save the user to PostgreSQL via Prisma, and return 201 with the user and a JWT. Return proper error codes for the cases I tested. Keep it in one file for now, I'll refactor later.

**What came back:**
- Route handler inside `src/routes/auth.routes.ts`
- Password hashing with bcrypt
- Prisma create call for the user
- JWT signing with `jsonwebtoken`
- Basic try/catch returning the right status codes

**What I did with it:**
Ran `npm test` — all five registration tests went green. Committed.

---

### Prompt 6 — Registration Refactor

**Tool:** Antigravity
**Commit:** `refactor: separate registration business logic`

**What I asked:**
> The registration is working but it's all in one file. Refactor it into proper layers — route, controller, service, repository. The controller should just call the service, the service handles business logic like hashing and JWT, the repository does the Prisma query. Don't change any behaviour, all tests should still pass after.

**What came back:**
- `src/controllers/auth.controller.ts` — thin controller calling the service
- `src/services/auth.service.ts` — bcrypt hashing, JWT generation, conflict check
- `src/repositories/user.repository.ts` — Prisma queries only
- `src/routes/auth.routes.ts` — route definitions pointing to controller
- All registration tests still green after refactor

**What I did with it:**
Ran tests again to confirm nothing broke, then committed the refactor.

---

### Prompt 7 — Login Tests

**Tool:** ChatGPT
**Commit:** `test: add login endpoint integration tests`

**What I asked:**
> Write failing Supertest integration tests for POST /api/auth/login. I need to cover: login works and returns a token, wrong password gives 401, email doesn't exist gives 404, missing email gives 400, missing password gives 400. Tests only, nothing else.

**What came back:**
- `tests/login.test.ts` with a `beforeAll` that registers a test user first, then five `it` blocks
- The success test asserts 200 and that the body has a `token` property
- The wrong password test sends a different password for the same email
- The not-found test sends an email that was never registered

**What I did with it:**
Ran `npm test` — all red since the login route didn't exist. Committed the test file.

---

### Prompt 8 — Login Implementation

**Tool:** Antigravity
**Commit:** `feat: implement user login endpoint`

**What I asked:**
> Implement POST /api/auth/login to make those tests pass. Should find the user by email, compare the password with bcrypt, and return a JWT on success. Return 404 if user not found, 401 if password is wrong. Minimal code only.

**What came back:**
- Login logic added to the auth service
- `bcrypt.compare()` for password verification
- `jwt.sign()` returning the token with user id and email in the payload
- Controller updated to call the login service method

**What I did with it:**
Ran `npm test` — login tests went green. Registration tests still green too.

---

### Prompt 9 — Auth Refactor

**Tool:** Antigravity
**Commit:** `refactor: improve authentication structure`

**What I asked:**
> Clean up the auth code a bit. The service is getting a bit long, controller naming could be clearer, and I want to make sure the repository handles all the Prisma calls instead of the service querying the DB directly. Keep everything green.

**What came back:**
- `findByEmail` method moved fully to the user repository
- Service now calls `userRepository.findByEmail()` instead of `prisma.user.findUnique()` directly
- Controller method names updated to `register` and `login` for clarity
- All tests still passing

**What I did with it:**
Re-ran tests, all green. Committed.

---

### Prompt 10 — JWT Middleware Tests

**Tool:** ChatGPT
**Commit:** `test: add JWT authentication middleware tests`

**What I asked:**
> Write failing tests for a JWT authentication middleware. The middleware protects routes — if a valid token is in the Authorization header it should let the request through, otherwise reject it. Cover: valid token gives 200, invalid token gives 401, expired token gives 401, missing Authorization header gives 401. Use GET /api/auth/me as the protected endpoint to test against.

**What came back:**
- `tests/jwt.middleware.test.ts` with a `beforeAll` that registers and logs in to get a real token
- Test for valid token using the real JWT from login
- Test for invalid token using a hardcoded garbage string
- Test for expired token using `jwt.sign()` with `exp` set in the past
- Test for missing header just hitting the endpoint with no Authorization

**What I did with it:**
Ran tests — all red since the middleware and the `/me` route didn't exist yet. Good.

---

### Prompt 11 — JWT Middleware Implementation

**Tool:** Antigravity
**Commit:** `feat: implement JWT authentication middleware`

**What I asked:**
> Implement the JWT authentication middleware. It reads the Authorization header, verifies the token with the JWT_SECRET from env, attaches the decoded user to req.user, and calls next(). If anything is wrong — missing header, invalid token, expired token — it returns 401. Also implement GET /api/auth/me that just returns req.user.

**What came back:**
- `src/middlewares/authenticate.ts` with the full middleware logic
- `/me` route added to auth routes
- `req.user` typed via Express namespace extension in a `.d.ts` file

**What I did with it:**
Ran tests — all four JWT tests went green. Committed.

---

### Prompt 12 — Centralized Error Handling

**Tool:** Antigravity + Claude
**Commit:** `feat: implement centralized error handling`

**What I asked (Antigravity):**
> Add a centralized error handling middleware to the Express app. I want a custom AppError class that takes a message and statusCode. All known errors should be thrown as AppError instances. The global error handler should catch them and return the right status code and message. For unknown errors return 500.

I also asked Claude:
> What's the cleanest way to handle async errors in Express without wrapping every controller in try/catch? I want a catchAsync helper.

**What came back:**
- `src/errors/AppError.ts` — custom error class extending `Error` with a `statusCode` property
- `src/utils/catchAsync.ts` — wrapper function that forwards any rejected promise to `next()`
- `src/middlewares/errorHandler.ts` — global error handler that checks for `AppError` instances
- All controllers updated to use `catchAsync` — no more try/catch blocks

**What I did with it:**
Re-ran all tests. Behaviour unchanged, all passing.

---

## Sprint 2 — Vehicle Inventory

---

### Prompt 13 — Vehicle Creation Tests

**Tool:** ChatGPT
**Commit:** `test: add vehicle creation endpoint tests`

**What I asked:**
> Write failing integration tests for POST /api/vehicles. Cover: unauthenticated request gets 401, missing required fields gets 400, valid authenticated request creates the vehicle and returns 201 with the vehicle object. Tests only.

**What came back:**
- `tests/vehicles.test.ts` with a `beforeAll` that registers a user and gets a token
- 401 test hitting the endpoint with no token
- 400 test sending an empty body
- 201 test sending a full valid vehicle payload and checking the response shape

**What I did with it:**
Ran — all red. Committed the tests.

---

### Prompt 14 — Vehicle Creation Implementation

**Tool:** Antigravity
**Commit:** `feat: implement vehicle creation endpoint`

**What I asked:**
> Implement POST /api/vehicles. Needs JWT auth middleware. Validate the body — make, model, year, price are required, everything else optional. Save to the database via Prisma and return the created vehicle with 201. Keep it minimal for now.

**What came back:**
- Route added to `src/routes/vehicle.routes.ts`
- Controller calling a vehicle service
- Zod schema for vehicle body validation
- Prisma create in the vehicle repository

**What I did with it:**
Ran tests — all vehicle creation tests green. Auth tests still passing too.

---

### Prompt 15 — Vehicle Creation Refactor

**Tool:** Antigravity
**Commit:** `refactor: separate vehicle creation business logic`

**What I asked:**
> Refactor the vehicle creation the same way I did auth — route, controller, service, repository separated properly. Make sure Zod validation runs as middleware before the controller. All tests should still pass.

**What came back:**
- `src/middlewares/vehicle.validator.ts` with the Zod middleware for vehicle creation
- `src/middlewares/validate.ts` — a generic middleware that runs any Zod schema
- `src/services/vehicle.service.ts` — business logic layer
- `src/repositories/vehicle.repository.ts` — all Prisma queries

**What I did with it:**
Tests still green. Committed.

---

### Prompt 16 — Vehicle Listing Tests

**Tool:** ChatGPT + Antigravity
**Commit:** `test: add vehicle listing endpoint tests`

**What I asked:**
> Write failing tests for GET /api/vehicles. Cover: unauthenticated request returns 401, authenticated request returns an array of vehicles. That's it — keep it simple.

**What came back:**
- `tests/vehicles.list.test.ts` with two `it` blocks
- 401 test and a success test checking `response.body.vehicles` is an array

**What I did with it:**
Red. Committed.

---

### Prompt 17 — Vehicle Listing Implementation

**Tool:** Antigravity
**Commit:** `feat: implement vehicle listing endpoint`

**What I asked:**
> Implement GET /api/vehicles. Protected by JWT. Should return all vehicles from the database. Simple — no filtering or pagination yet.

**What came back:**
- `getVehicles` method added to vehicle repository doing `prisma.vehicle.findMany()`
- Service and controller wired up
- Route registered

**What I did with it:**
Tests green. Committed.

---

### Prompt 18 — Vehicle Search Tests

**Tool:** ChatGPT
**Commit:** `test: add vehicle search endpoint tests`

**What I asked:**
> Write failing tests for GET /api/vehicles/search. I want to filter by make, model, category, minPrice, maxPrice. Each test should seed a few vehicles and then search with one filter at a time. Also test combining two filters. Tests only.

**What came back:**
- `tests/vehicles.search.test.ts` with a `beforeAll` that seeds 4 vehicles (Toyota Camry, Toyota Corolla, Ford F-150, Tesla Model 3)
- Six `it` blocks: filter by make, filter by model, filter by category, minPrice, maxPrice, and a combined make + maxPrice filter

**What I did with it:**
Red. Committed.

---

### Prompt 19 — Vehicle Search Implementation

**Tool:** Antigravity
**Commit:** `feat: implement vehicle search endpoint`

**What I asked:**
> Implement GET /api/vehicles/search. Read make, model, category, minPrice, maxPrice from query params. Build a Prisma where clause from whatever params are present. Return matching vehicles in the same format as the listing endpoint.

**What came back:**
- `searchVehicles` controller reading query params
- Service building a `Prisma.VehicleWhereInput` object dynamically
- `string_contains` for make and model, exact match for category, `gte`/`lte` for price

**What I did with it:**
Tests green when run in isolation. Committed.

---

### Prompt 20 — Vehicle Update Tests

**Tool:** ChatGPT
**Commit:** `test: add vehicle update endpoint tests`

**What I asked:**
> Write failing tests for PUT /api/vehicles/:id. Cover: no token gives 401, negative price gives 400, non-existent ID gives 404, malformed ID (string instead of number) gives 400, successful update returns 200 with updated vehicle. Tests only.

**What came back:**
- `tests/vehicles.update.test.ts` with a `beforeAll` that seeds a vehicle to update
- Five `it` blocks covering all the cases
- The success test updates the price and status and checks both changed in the response

**What I did with it:**
Red. Committed.

---

### Prompt 21 — Vehicle Update Implementation

**Tool:** Antigravity
**Commit:** `feat: implement vehicle update endpoint`

**What I asked:**
> Implement PUT /api/vehicles/:id. Protected by JWT. Validate the ID is a valid integer. Validate the body with Zod — same fields as creation but all optional. If the vehicle doesn't exist return 404. Return the updated vehicle on success.

**What came back:**
- `updateVehicle` added to controller, service, and repository
- ID parsed with `parseInt` — NaN check returns 400
- `prisma.vehicle.update()` with `where: { id }` — Prisma throws if record not found, caught as 404
- Zod schema for partial update (`validateUpdateVehicle` middleware)

**What I did with it:**
Ran tests — all five green. Committed.

---

### Prompt 22 — Vehicle Deletion Tests

**Tool:** ChatGPT
**Commit:** `test: add vehicle deletion endpoint tests`

**What I asked:**
> Write failing tests for DELETE /api/vehicles/:id. This endpoint is admin-only. Cover: no token gives 401, non-admin user gets 403, malformed ID gives 400, non-existent vehicle gives 404, admin can delete and gets 200. I'll need two users — a regular user and an admin.

**What came back:**
- `tests/vehicles.delete.test.ts` with `beforeAll` setting up both a regular user token and an admin token
- Five tests covering all the cases
- Note in a comment saying the admin token requires the user to have `role: "ADMIN"` in the database

**What I did with it:**
Ran — all red. Committed.

---

### Prompt 23 — Vehicle Deletion Implementation

**Tool:** Antigravity
**Commit:** `feat: implement vehicle deletion endpoint`

**What I asked:**
> Implement DELETE /api/vehicles/:id. Admin-only route. Add an authorizeAdmin middleware that checks req.user.role === 'ADMIN' and returns 403 if not. Validate the ID. Return 404 if vehicle doesn't exist. Return 200 with a success message on delete.

**What came back:**
- `authorizeAdmin` middleware added to `authenticate.ts`
- Route updated: `router.delete('/:id', authenticate, authorizeAdmin, deleteVehicle)`
- `deleteVehicle` in controller/service/repository
- Role-based access now working at middleware level

**What I did with it:**
Had to manually set a user's role to `ADMIN` in the Neon DB to get the admin token working in tests. Then all five tests went green. Committed.

---

### Prompt 24 — Purchase Tests

**Tool:** ChatGPT
**Commit:** `test: add purchase endpoint tests`

**What I asked:**
> Write failing tests for POST /api/vehicles/:id/purchase. Cover: malformed ID gives 400, vehicle doesn't exist gives 404, vehicle already SOLD gives 400, successful purchase returns 200 and the vehicle status changes to SOLD, verify the status is SOLD by calling GET on that vehicle afterwards.

**What came back:**
- `tests/vehicles.purchase.test.ts` with `beforeAll` seeding two vehicles — one AVAILABLE and one already SOLD
- Five `it` blocks covering all the cases
- The last test calls GET to verify the status actually changed in the database

**What I did with it:**
Red. Committed.

---

### Prompt 25 — Purchase Implementation

**Tool:** Antigravity
**Commit:** `feat: implement purchase endpoint`

**What I asked:**
> Implement POST /api/vehicles/:id/purchase. Authenticated route. Check the vehicle exists and is AVAILABLE, then set its status to SOLD. Return 400 if it's already SOLD. Return the updated vehicle in the response.

**What came back:**
- `purchaseVehicle` added to controller, service, repository
- Service checks status before updating — throws `AppError(400)` if already SOLD
- `prisma.vehicle.update()` setting `status: "SOLD"`

**What I did with it:**
Ran — all green in isolation. Committed.

---

### Prompt 26 — Restock Tests

**Tool:** ChatGPT
**Commit:** `test: add restock endpoint tests`

**What I asked:**
> Write failing tests for POST /api/vehicles/:id/restock. Admin-only. Cover: no token gives 401, non-admin gives 403, malformed ID gives 400, non-existent vehicle gives 404, admin can restock a SOLD vehicle and gets 200 with status AVAILABLE, verify status changed with a GET call after.

**What came back:**
- `tests/vehicles.restock.test.ts` with both admin and user tokens
- Six `it` blocks covering all cases
- Uses the same pattern as the purchase test to verify state change

**What I did with it:**
Red. Committed.

---

### Prompt 27 — Restock Implementation

**Tool:** Antigravity
**Commit:** `feat: implement vehicle restock endpoint`

**What I asked:**
> Implement POST /api/vehicles/:id/restock. Admin-only, same authorizeAdmin middleware. Find the vehicle, set status back to AVAILABLE. Return 200 with the updated vehicle. Backend is complete after this.

**What came back:**
- `restockVehicle` added to controller, service, repository
- Route registered with `authenticate` and `authorizeAdmin`
- Symmetric to the purchase endpoint

**What I did with it:**
Ran all backend tests in one go with `npm test -- --runInBand`. The auth and vehicle update/delete tests passed. The listing, search, purchase, and restock tests had isolation issues because they share the same database. Noted the issue, decided to move forward to frontend rather than fix test isolation within the time constraint. Committed.

---

## Sprint 3 — Frontend

---

### Prompt 28 — Frontend Bootstrap

**Tool:** Antigravity + ChatGPT
**Commit:** `chore: initialize React frontend with Redux Toolkit`

**What I asked (Antigravity):**
> Bootstrap a React frontend using Vite, TypeScript, Redux Toolkit, React Router v7, Axios, Tailwind CSS, React Hook Form, and Zod. Create the base project structure with folders for components, pages, hooks, store, services, types, utils. Set up the Redux store with a basic auth slice. Don't build any features yet.

I also asked ChatGPT:
> What's the minimal Redux Toolkit setup for tracking a JWT token and user info, with the state persisted to localStorage so it survives a page refresh?

**What came back:**
- Vite project initialized with React + TypeScript template
- `src/store/` with `store.ts` and `authSlice.ts`
- Redux Provider mounted in `main.tsx`
- Basic folder structure in place
- Explanation of how to hydrate Redux state from localStorage on app load

**What I did with it:**
Ran `npm run dev` — blank page, no errors. Good start. Committed.

---

### Prompt 29 — Tailwind + Config Fix

**Tool:** Antigravity + ChatGPT
**Commit:** `fix: complete frontend bootstrap and Tailwind configuration`

**What I asked:**
> Tailwind isn't applying styles. Also need to configure jest with jest-environment-jsdom so I can test React components. Fix the Tailwind setup and get the Jest config working. Also set up path aliases so I can import with @/ instead of relative paths.

ChatGPT separately:
> Why would Tailwind CSS not apply any styles in a Vite + React project even though it's installed? What are the common configuration mistakes?

**What came back:**
- Tailwind config updated with the correct `content` glob pattern pointing to `./src/**/*.{ts,tsx}`
- `jest.config.cjs` set up with `jest-environment-jsdom`, `ts-jest`, and `identity-obj-proxy` for CSS modules
- `setupTests.ts` importing `@testing-library/jest-dom`
- `tsconfig.app.json` updated with path alias for `@/`

**What I did with it:**
Ran dev server — Tailwind classes were working. Ran `npm test` — test runner initialised without errors. Committed.

---

### Prompt 30 — Reusable UI Components

**Tool:** Antigravity
**Commit:** `feat: create reusable UI components`

**What I asked:**
> Build reusable UI components I'll need across the app: a Button component with variants (primary, secondary, danger), an Input component with label and error message support, a Card component for wrapping content, and a LoadingSpinner. Use Tailwind for all styling. TypeScript types for all props.

**What came back:**
- `src/components/ui/Button.tsx` with variant and size props
- `src/components/ui/Input.tsx` with label, error, and register support for React Hook Form
- `src/components/ui/Card.tsx` as a simple wrapper
- `src/components/ui/LoadingSpinner.tsx`

**What I did with it:**
Visually spot-checked components in the browser. Committed.

---

### Prompt 31 — Auth Pages UI

**Tool:** Antigravity
**Commit:** `feat: implement authentication pages UI and fix tailwind`

**What I asked:**
> Build the Login and Register page UI. Both pages should have a centred card layout with the form inside. Login needs email and password fields plus a submit button and a link to register. Register needs the same plus a confirm password field. No API calls yet — just the UI. Use React Hook Form and Zod for form validation with inline error messages.

**What came back:**
- `src/pages/auth/LoginPage.tsx` with form, Zod schema, React Hook Form wiring
- `src/pages/auth/RegisterPage.tsx` with the same pattern plus confirm password validation
- `src/router/AppRouter.tsx` with the initial routes set up
- Layout looking clean with Tailwind

**What I did with it:**
Navigated to `/login` and `/register` in the browser. Forms rendered correctly, validation errors showed inline. Committed.

---

### Prompt 32 — Dashboard Page

**Tool:** Antigravity
**Commit:** `feat: implement dashboard page`

**What I asked:**
> Build the dashboard page. After login the user should land here. Show a grid of vehicle cards — each card shows make, model, year, price, status, and category. Pull the vehicles from the backend via Axios using the stored JWT. Show a loading state while fetching. If no vehicles exist show an empty state message.

**What came back:**
- `src/pages/dashboard/DashboardPage.tsx` with a `useEffect` calling the vehicles API on mount
- `src/components/dashboard/VehicleCard.tsx` displaying vehicle info
- Loading spinner while fetch is in progress
- Empty state when the array is empty
- Axios call using the token from Redux state

**What I did with it:**
Opened the app, logged in, saw the dashboard load. No vehicles yet since the database was empty. Committed.

---

### Prompt 33 — Registration Frontend Tests

**Tool:** ChatGPT
**Commit:** `test: add registration integration and validation tests`

**What I asked:**
> Write failing frontend tests for the registration page. Test that: the form renders with email, password, confirm password fields, submitting with an invalid email shows a validation error, submitting with mismatched passwords shows an error, a successful submission calls the register API and redirects the user. Use React Testing Library and Jest.

**What came back:**
- Test file for `RegisterPage` using `renderWithProviders` helper that wraps in Redux store and Router
- Tests for field rendering, email validation error, password mismatch error, and successful submit
- Mocked Axios for the API call

**What I did with it:**
Ran — all red since the register page wasn't wired to the API yet. That's fine, that's the TDD flow. Committed the tests.

---

### Prompt 34 — Registration Connected to Backend

**Tool:** Antigravity
**Commit:** `feat: connect registration page to backend`

**What I asked:**
> Wire up the registration page to the actual backend. On form submit, call POST /api/auth/register with the email and password. On success, save the token to Redux and localStorage, then redirect to dashboard. On error, show the error message from the API response under the form.

**What came back:**
- `src/services/authService.ts` with the register API call
- `RegisterPage.tsx` updated to call the service on submit
- Redux `setCredentials` action dispatched on success with user + token
- Token saved to `localStorage` alongside Redux dispatch
- Error message displayed below the form on failure

**What I did with it:**
Ran the registration tests — went green. Manually tested in the browser — registered a new user, got redirected to dashboard. Committed.

---

### Prompt 35 — Frontend Login Architecture Refactor

**Tool:** Antigravity
**Commit:** `refactor: improve frontend login architecture`

**What I asked:**
> The auth flow is working but I want to clean up the architecture. Move the API calls into async thunks in Redux rather than calling the service directly from the page components. The pages should just dispatch thunks and read state. Keep all tests passing.

**What came back:**
- `src/store/authThunks.ts` with `registerThunk` and `loginThunk` as `createAsyncThunk` actions
- `authSlice.ts` updated with `pending`, `fulfilled`, `rejected` cases for each thunk
- `RegisterPage.tsx` and `LoginPage.tsx` updated to dispatch thunks instead of calling services directly
- `src/services/authService.ts` kept but now only called from thunks
- `src/store/api.ts` centralising Axios error normalisation

**What I did with it:**
Re-ran all frontend tests. Still passing. Committed.

---

### Prompt 36 — Login Frontend Tests

**Tool:** ChatGPT
**Commit:** `test: add login integration tests`

**What I asked:**
> Write failing tests for the login page. Test that: the form has email and password fields, submitting with wrong credentials shows an error message, a successful login saves the token and redirects to dashboard. Same pattern as the registration tests.

**What came back:**
- Test file for `LoginPage` with mocked Axios
- Tests for field rendering, failed login showing error, successful login dispatching to Redux and redirecting

**What I did with it:**
Red. Committed.

---

### Prompt 37 — Login Tests Green

**Tool:** Antigravity
**Commit:** `test: verify frontend login implementation satisfies all tests`

**What I asked:**
> The login tests are failing. Here are the error messages. Fix the login implementation so all tests pass. Don't change the tests.

I pasted the error output from the test run.

**What came back:**
- A couple of small fixes: the redirect path was wrong in one case, and the error message key didn't match what the test expected
- No structural changes — just the small gaps between what the tests expected and what was implemented

**What I did with it:**
Ran tests — all green. Committed.

---

### Prompt 38 — localStorage JWT Fix

**Tool:** Antigravity
**Commit:** `fix: Login information which saves in local storage`

**What I asked:**
> When I refresh the page after logging in, I get logged out. The token is in localStorage but Redux state is empty after refresh. Fix this — on app load, read the token and user from localStorage and hydrate the Redux auth state so the user stays logged in.

**What came back:**
- `main.tsx` updated to read `localStorage` before creating the Redux store
- `preloadedState` passed to `configureStore()` with the auth values from localStorage
- Auth slice updated so logout action also clears localStorage

**What I did with it:**
Tested manually — logged in, refreshed, still logged in. Tested logout — refreshed after logout, correctly back at login page. Committed.

---

### Prompt 39 — Dashboard Vehicle Tests

**Tool:** ChatGPT
**Commit:** `test: add dashboard vehicle integration tests`

**What I asked:**
> Write failing tests for the dashboard. Test that: the dashboard calls GET /api/vehicles on load, renders a VehicleCard for each vehicle returned, shows a loading state while the request is in progress, and shows an empty state message when the API returns an empty array.

**What came back:**
- Dashboard test file with mocked Axios responses
- Test for loading state, test for rendering cards, test for empty state
- Used `waitFor` to handle async rendering

**What I did with it:**
Red. Committed.

---

### Prompt 40 — Seed Data + Dashboard Cards

**Tool:** Antigravity + ChatGPT
**Commit:** `feat: seed vehicle inventory and dashboard vehicle cards`

**What I asked (Antigravity):**
> Make the dashboard tests pass. Also create a seed script for the backend so I have some real vehicles to look at. The VehicleCard component needs to show make, model, year, price, status badge, and category. Status badge should be green for AVAILABLE and grey for SOLD.

ChatGPT separately:
> Write a Prisma seed script for a car dealership with 8 diverse vehicles — different makes, categories, prices. Include some AVAILABLE and some SOLD.

**What came back:**
- `VehicleCard.tsx` updated with status badge coloring
- Dashboard tests went green
- `prisma/seed.ts` with 8 seeded vehicles

**What I did with it:**
Ran `npx ts-node prisma/seed.ts`, refreshed the dashboard — vehicle cards appeared. Committed.

---

### Prompt 41 — Dashboard Refactor

**Tool:** Antigravity
**Commit:** `refactor: dashboard reorganized around reusable pieces`

**What I asked:**
> The dashboard component is getting long. Break it into smaller pieces — a VehicleGrid component, a VehicleFilters component (just the UI for now, no logic), and keep DashboardPage as the orchestrator. All tests should still pass.

**What came back:**
- `src/components/dashboard/VehicleGrid.tsx` — renders the grid of cards
- `src/components/dashboard/VehicleFilters.tsx` — filter bar UI (make, category, price range inputs)
- `DashboardPage.tsx` slimmed down to just coordinate data fetching and pass props down

**What I did with it:**
Tests still green. Browser looked the same. Committed.

---

### Prompt 42 — Search Filter Tests + Implementation

**Tool:** ChatGPT + Antigravity
**Commits:** `test: vehicle search page according filters` + `feat: Vehicle filters on dashboard`

**What I asked (ChatGPT):**
> Write failing frontend tests for the vehicle search/filter feature. Test that: changing the make filter calls the search API with the right query param, changing minPrice and maxPrice calls the search API with the right params, combining two filters sends both params together.

**What I asked (Antigravity):**
> Wire up the filter inputs in VehicleFilters to actually call GET /api/vehicles/search with the selected params. Debounce the API call by 400ms so it doesn't fire on every keystroke. Update the vehicle list in Redux when results come back.

**What came back:**
- Filter tests written and initially red
- Filters wired up with a `useCallback` + debounce pattern
- `vehicleSlice.ts` updated with a `setSearchResults` action
- Dashboard reading from search results when filters are active, full list otherwise
- Tests went green after wiring

**What I did with it:**
Manually tested in the browser — typed "Toyota" in the make filter, list updated with only Toyota vehicles. Committed both together.

---

### Prompt 43 — Purchase Frontend Tests + Implementation

**Tool:** ChatGPT + Antigravity
**Commits:** `test: purchase of vehicle` + `feat: connect purchase workflow to backend`

**What I asked (ChatGPT):**
> Write failing tests for the vehicle purchase flow. Test that: clicking Purchase on an AVAILABLE vehicle calls POST /api/vehicles/:id/purchase, after purchase the vehicle card updates to show SOLD status, clicking Purchase on a SOLD vehicle shows it's unavailable.

**What asked (Antigravity):**
> Implement the purchase button on VehicleCard. When clicked, call POST /api/vehicles/:id/purchase. On success update the vehicle status in Redux state to SOLD so the card re-renders. Show a confirmation message. Disable the button if status is already SOLD.

**What came back:**
- Purchase button added to VehicleCard with disabled state for SOLD vehicles
- `purchaseVehicle` thunk added to vehicle slice
- Optimistic Redux update after successful purchase response
- Tests went green

**What I did with it:**
Tested in the browser — clicked purchase on an AVAILABLE car, status changed to SOLD immediately, button disabled. Committed both.

---

### Prompt 44 — Role-Based Access Control

**Tool:** Antigravity + ChatGPT
**Commit:** `feat: implement role-based access control as admin and user`

**What I asked (Antigravity):**
> Add role-based access control to the frontend. Admin users should see extra controls on VehicleCard — Edit and Delete buttons. Admin users should see an Add Vehicle button on the dashboard. Regular users see none of these. Read the role from Redux auth state.

ChatGPT separately:
> What's the right React pattern for conditionally rendering admin-only UI based on a role stored in Redux? Should I use a hook, a component, or just inline checks?

**What came back:**
- `useAuth` hook created in `src/hooks/useAuth.ts` — returns `{ user, token, isAdmin }` from Redux
- VehicleCard conditionally renders Edit/Delete buttons when `isAdmin` is true
- `InventoryPage.tsx` with Add Vehicle form, only reachable by admins
- Router updated with an `AdminRoute` wrapper that redirects non-admins to dashboard
- `EditVehicleForm.tsx` and `AddVehicleForm.tsx` calling PUT and POST respectively

**What I did with it:**
Logged in as a normal user — no admin controls. Promoted a user to ADMIN in the database, logged in as them — Edit and Delete appeared on every card. Committed.

---

### Prompt 45 — TypeScript Cleanup

**Tool:** Antigravity
**Commit:** `fix: fix the typescript issues in frontend and delete unnecessary files`

**What I asked:**
> Run through the frontend and fix any TypeScript errors. There are some `any` types that should be proper interfaces, some unused imports, and a few files that were created during scaffolding that are no longer needed. Clean it all up without changing any behaviour.

**What came back:**
- Proper TypeScript interfaces for `Vehicle`, `User`, `AuthState`, `VehicleState` in `src/types/`
- Removed unused imports across multiple files
- Deleted a couple of placeholder files from the initial scaffold
- No `any` types remaining in the main source files

**What I did with it:**
Ran `npm run build` — compiled clean with no TypeScript errors. Committed.

---

### Prompt 46 — Vercel SPA Rewrite

**Tool:** ChatGPT
**Commit:** `fix: add Vercel SPA rewrite`

**What I asked:**
> My React app is deployed on Vercel but when I navigate to a route like /dashboard directly or refresh the page, I get a 404. How do I fix this for a React Router SPA on Vercel?

**What came back:**
- Explanation that Vercel serves static files and doesn't know about client-side routes
- `frontend/vercel.json` with the rewrite rule:
  ```json
  {
    "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
  }
  ```
- Instruction to redeploy after adding the file

**What I did with it:**
Added the file, pushed, redeployed. Direct URL navigation and page refresh worked correctly. Final commit.

---

## Summary

| Sprint | Prompts | Tool Split |
|---|---|---|
| Sprint 1 — Backend Foundation | 0–12 | Antigravity (scaffolding), ChatGPT (tests + config) |
| Sprint 2 — Vehicle Inventory | 13–27 | Antigravity (implementation), ChatGPT (tests) |
| Sprint 3 — Frontend | 28–46 | Antigravity (features), ChatGPT (tests + fixes), Claude (architecture) |

**Total prompts:** 47
**Total commits:** 49
**Development time:** 2 days (Jul 29–30, 2026)

The rule I kept throughout: one prompt at a time, tests before implementation, commit after every green. No batching multiple features into one prompt.

---

*Full AI usage summary is also in the README.md under the "My AI Usage" section.*
