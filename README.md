# Taskboard Desktop

Cross-platform desktop application for managing tasks, built with Electron, Next.js, and NestJS. The application provides a modern user interface for creating, editing, filtering, searching, and organizing tasks. It is packaged as a desktop application for macOS and Windows.

## Overview

Taskboard Desktop is structured as a pnpm monorepo and includes:

* A **Next.js** application that serves as the frontend UI.
* A **NestJS** backend that exposes a REST API for task operations.
* An **Electron** shell that wraps the frontend into a desktop application.
* **Prisma ORM** connected to **PostgreSQL** for persistent data storage.

The focus of the application is a clean, modern, and responsive user experience with smooth animations, task manipulation features, and desktop-level integration.

## Features

* Create, edit, and delete tasks.
* Manage task fields: title, description, and status.
* Filter tasks by state: completed, not completed, or all.
* Client-side search by task title and description.
* Drag-and-drop task sorting using @dnd-kit.
* Smooth UI animations and transitions.
* Light and dark theme support using next-themes.
* Local caching and syncing using TanStack Query.
* Docker support for backend and database.

## Tech Stack

### Frontend (app)

* Next.js 16 (App Router)
* React 19
* TypeScript
* Tailwind CSS 4
* Radix UI primitives
* shadcn/ui style component architecture
* TanStack React Query + Persist Client
* Axios
* next-themes for theme switching
* framer-motion for animations
* @dnd-kit for drag-and-drop
* Utility libraries: clsx, class-variance-authority, tailwind-merge

### Backend (backend)

* NestJS 11
* Node.js
* TypeScript
* Prisma ORM
* PostgreSQL
* class-validator, class-transformer
* @nestjs/config

### Desktop Shell (src-electron)

* Electron.js
* Preload and main process configuration
* Loads the Next.js UI

### Tooling

* pnpm workspaces
* TypeScript across all layers
* Prisma CLI
* concurrently for development scripts
* Docker and docker-compose (optional)

## Project Structure

```
root
├─ app/                # Next.js frontend
├─ backend/            # NestJS backend API
├─ prisma/             # Prisma schema and migrations
├─ src-electron/       # Electron main and preload scripts
├─ .env                # Environment variables
├─ docker-compose.yml
├─ package.json        # Root workspace configuration
├─ pnpm-workspace.yaml
└─ node_modules/
```

## Environment Variables

Create a `.env` file at the project root.

Example:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/taskboard"
BACKEND_PORT=3001
NEXT_PUBLIC_API_URL="http://localhost:3001"
NODE_ENV=development
```

## Installing Dependencies

```
pnpm install
```

This installs dependencies for all workspaces in the monorepo.

## Database and Prisma

After configuring `.env`, run migrations:

```
pnpm prisma:migrate
```

This command runs:

```
pnpm --filter backend prisma migrate dev
```

## Running the Project

### Run the backend

```
pnpm dev:backend
```

Starts the Nest.js backend in development mode.

### Run the frontend

```
pnpm dev:frontend
```

Runs the Next.js development server.

### Run Electron

```
pnpm dev:electron
```

Starts Electron and loads the frontend.

### Run everything together

```
pnpm dev
```

This runs backend, frontend, and Electron simultaneously.

## Docker Setup

Start the database and any additional services:

```
docker-compose up -d
```

Ensure `.env` points to the correct PostgreSQL container address.

## Available Root Scripts

* `dev:backend` – run NestJS backend
* `dev:frontend` – run Next.js frontend
* `dev:electron` – run Electron shell
* `dev` – run all three concurrently
* `build:backend` – build backend
* `build:frontend` – build frontend
* `build:electron` – build Electron scripts
* `build` – build all workspaces
* `prisma:migrate` – run Prisma migrations

## API Reference

### Task Model

```
Task {
  id: string
  title: string
  description?: string
  done: boolean
  createdAt: Date
  updatedAt: Date
}
```

### Endpoints

* `GET /tasks` – return all tasks
* `POST /tasks` – create a new task
* `PATCH /tasks/:id` – update a task
* `DELETE /tasks/:id` – delete a task

## UI/UX Guidelines

* Tailwind-based design system with 8px spacing grid
* Customizable color palette (primary, secondary, neutral)
* Essential UI components:

  * Buttons (primary, secondary, destructive)
  * Inputs and textareas
  * Select, dropdown, checkbox
  * Task cards
  * Modal dialogs
* Theme support (light and dark)
* Smooth animations using framer-motion
* Drag-and-drop reordering of tasks
* Responsive layout for 1024x600 and larger desktop screens

## Building for Production

### Build all workspaces

```
pnpm build
```

### Build individually

```
pnpm build:backend
pnpm build:frontend
pnpm build:electron
```

### Electron Packaging

Your packaging commands (for macOS and Windows installers) should be defined in `src-electron/package.json`. This typically includes commands from electron-builder or electron-forge.

Example workflow:

```
cd src-electron
pnpm build
pnpm dist
```

## Screenshots

![Dashboard Light](docs/screenshots/dashboard-light.png)

Example of `Active` filter, dark theme and search `clean`

![Dashboard Dark](docs/screenshots/dashboard-dark-active-search.png)

## Roadmap

* Platform-specific Electron packaging
* Sorting and filtering improvements
* Keyboard shortcuts for task operations
* Alternative task views (Kanban columns)
* E2E tests

## License

MIT License © 2025 Vladyslav Pilkevych
