# Ordo – Task Board Application

Ordo is a **Kanban-style Task Board** built with **Next.js 16**, **React 19**, **TypeScript**, **Zustand**, and **Tailwind CSS**.

The goal of this project is to demonstrate strong frontend engineering practices including state management, usability, persistence, route protection, and testing — all without a backend service.

---

## Features

### Authentication

- Static login flow
- Hardcoded credentials validation
- Proper error handling for invalid login
- Optional **Remember Me** session persistence
- Logout functionality
- Protected application routes

### Theme Management

- Dark/Light mode toggle
- System preference detection
- Persistence of user preference

### Task Board

- Fixed columns:
  - Todo
  - Doing
  - Done
- Create, edit, and delete tasks
- Drag & drop tasks across columns
- Search tasks by title
- Filter by priority
- Sort by due date (empty values placed last)

### Task Model

Each task supports:

- Title (required)
- Description
- Priority (High / Medium / Low)
- Due Date
- Tags
- Created timestamp
- Status (Todo / Doing / Done)

### Activity Log

Tracks recent actions:

- Task created
- Task edited
- Task moved
- Task deleted

### Persistence & Reliability

- Board state persists across refresh
- Safe handling of empty or missing storage
- Reset board option with confirmation

---

## Tech Stack

- **Next.js 16 (App Router)**
- **React 19**
- **TypeScript**
- **Zustand** (state management)
- **Zustand Persist Middleware**
- **Tailwind CSS**
- **@dnd-kit** (Drag & Drop)
- **React Hook Form + Zod** (form validation)
- **Jest + React Testing Library** (testing)

---

## Project Setup

Clone the repository:

```bash
git clone <repo-url>
cd ordo
Install dependencies:

npm install
Run the development server:

```

npm run dev

```
Application runs at:

http://localhost:3000
Available Scripts
| Script      | Description             |
|-------------|-------------------------|
| npm run dev | Start development server  |
| npm run build | Build production app    |
| npm run start | Run production build    |
| npm run lint | Run ESLint checks       |
| npm run test | Execute unit tests      |

## Project Structure

```

ordo/
├─ app/
│ ├─ login/
│ │ └─ page.tsx
│ ├─ page.tsx (Dashboard)
│ ├─ layout.tsx
│ └─ globals.css
├─ components/
│ ├─ AuthGuard.tsx
│ ├─ CreateTaskModal.tsx
│ ├─ EditTaskModal.tsx
│ ├─ ThemeProvider.tsx
│ ├─ ThemeToggle.tsx
│ └─ todo.tsx
├─ store/
│ ├─ taskStore.ts
│ ├─ authStore.ts
│ └─ themeStore.ts
├─ **tests**/
│ ├─ auth.test.tsx
│ ├─ auth-persistence.test.tsx
│ ├─ taskStore.test.ts
│ └─ taskFilters.test.ts
├─ jest.config.js
├─ jest.setup.ts
├─ tailwind.config.js
├─ tsconfig.json
└─ README.md

```
State Management
State is handled using Zustand.

Task Store (taskStore.ts)
Responsible for:

Task CRUD operations

Drag & drop state updates

Filtering, sorting, and search

Activity logging

Board reset functionality

Auth Store (authStore.ts)
Responsible for:

Static authentication

Remember-me session persistence

Logout handling

Hydration-safe auth checks

Theme Store (themeStore.ts)
Responsible for:

- Managing current theme state

- Persisting user preference

Persistence Strategy
Zustand’s persist middleware stores state using:

createJSONStorage(() => localStorage)
Key behaviors:

Tasks automatically persist after any update

Authentication persists only when Remember Me is enabled

Safe guards prevent crashes if storage is empty or corrupted

Hydration checks prevent redirect flicker on refresh

Authentication
Static credentials:

Email: intern@demo.com
Password: intern123
Notes:

Authentication is frontend-only.

No backend or API is required.

Intended purely for demonstration of frontend architecture.

Drag & Drop
Implemented using @dnd-kit.

Tasks are draggable between columns

Status updates automatically on drop

Activity log records movement events

Testing
Testing stack:

Jest

React Testing Library

jsdom environment

Tests Cover
Store logic (add, update, delete, move tasks)

Authentication login/logout behavior

Persistence handling

Basic application sanity checks

Run tests:

npm run test
Deployment
The application is ready for deployment on platforms supporting Next.js server rendering (e.g., Vercel).

Build production version:

npm run build
npm run start
Engineering Decisions
Zustand chosen for minimal boilerplate and predictable state updates

Persist middleware used instead of backend storage

App Router used for modern Next.js architecture

Component structure designed for reusability

Form validation handled with Zod schemas

Activity logging implemented at state layer for consistency

Limitations
Authentication is not secure (frontend-only)

Data exists only in browser storage

No multi-user synchronization

Author's Note
Frontend engineering assessment project demonstrating application architecture, state management, and usability-focused design.

```
