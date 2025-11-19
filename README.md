# Taskboard Desktop

Cross-platform desktop application for managing tasks, built with Electron, Next.js, and NestJS.  
The app provides a modern UI for creating, editing, filtering, and searching tasks, packaged as a desktop application for macOS and Windows.

---

## Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Database and Prisma](#database-and-prisma)
- [Running the Project](#running-the-project)
  - [Backend only](#backend-only)
  - [Frontend only](#frontend-only)
  - [Electron shell only](#electron-shell-only)
  - [All services together](#all-services-together)
- [Docker](#docker)
- [Available Scripts](#available-scripts)
  - [Root](#root)
  - [Frontend (`app`)](#frontend-app)
  - [Backend (`backend`)](#backend-backend)
  - [Electron (`src-electron`)](#electron-src-electron)
- [API Reference](#api-reference)
  - [Task model](#task-model)
  - [REST Endpoints](#rest-endpoints)
- [UI and UX Guidelines](#ui-and-ux-guidelines)
- [Build for Production](#build-for-production)
  - [Backend and Frontend](#backend-and-frontend)
  - [Desktop packaging (Electron)](#desktop-packaging-electron)
- [Screenshots](#screenshots)
- [Roadmap](#roadmap)
- [License](#license)

---

## Overview

Taskboard Desktop is a monorepo that contains:

- A **Next.js** application that provides the user interface.
- A **NestJS** backend that exposes a REST API for task management.
- An **Electron** shell that loads the Next.js frontend and packages everything into a desktop app.
- A **PostgreSQL + Prisma** layer for persistent storage of tasks.

The app focuses on a clean and responsive UI, keyboard-friendly task management, and a smooth user experience on both macOS and Windows.

---

## Features

- Create, edit, and delete tasks.
- Fields:
  - Title (required)
  - Description (optional)
  - Status: completed / not completed
- Filter tasks:
  - Completed
  - Not completed
  - All
- Search tasks on the client side by title and description.
- Drag-and-drop reordering and moving between columns using `@dnd-kit`.
- Inline or modal-based task editing.
- Light and dark themes (using `next-themes`).
- Smooth micro-animations using `framer-motion`.
- Local caching and state synchronization using **TanStack Query** (React Query).
- Backend prepared for Dockerized deployment with PostgreSQL.

---

## Tech Stack

### Frontend (App)

- **Next.js 16+** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **Radix UI** (`@radix-ui/react-*`) as low-level primitives
- **shadcn/ui** style approach (utility-first + composable components)
- **TanStack React Query** and **Persist Client**
- **Axios** for HTTP requests
- **next-themes** for dark/light mode
- **framer-motion** for animations
- **@dnd-kit** for drag-and-drop
- Utility libraries: `clsx`, `class-variance-authority`, `tailwind-merge`

### Backend (API)

- **Node.js**
- **NestJS 11**
- **TypeScript**
- **Prisma ORM** with **PostgreSQL**
- **class-validator** and **class-transformer** for DTO validation
- **@nestjs/config** for configuration management
- **RxJS** used internally by NestJS

### Desktop Shell

- **Electron.js**
- Main and preload scripts under `src-electron`
- The Electron window loads the Next.js application and exposes a desktop runtime.

### Tooling and Monorepo

- **pnpm workspaces**
- **TypeScript** across the whole monorepo
- **Prisma CLI**
- **concurrently** for running multiple processes in dev
- Optional **Docker** setup for backend/PostgreSQL via `docker-compose.yml`

---

## Project Structure

```bash
taskboard-desktop/
├─ app/                # Next.js frontend (App Router)
│  ├─ app/
│  ├─ components/
│  ├─ lib/
│  └─ package.json
├─ backend/            # NestJS API server
│  ├─ src/
│  ├─ test/
│  └─ package.json
├─ prisma/             # Prisma schema and migrations
│  ├─ schema.prisma
│  └─ migrations/
├─ src-electron/       # Electron main and preload scripts
│  └─ package.json
├─ node_modules/
├─ .env                # Root environment file
├─ .gitignore
├─ docker-compose.yml
├─ package.json        # Root monorepo config and scripts
├─ pnpm-lock.yaml
└─ pnpm-workspace.yaml
```

## Prerequisites
- Node.js v20+
- pnpm (as the package manager)
- Docker and Docker Compose (optional but recommended for database)
- Alternatively, a local PostgreSQL instance

## Environment Variables
Create a .env file in the project root.

```env
# Backend
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/taskboard"
BACKEND_PORT=3001

# Frontend
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

Depending on your Electron and Docker setup, you may add additional variables (for example, custom ports or Electron dev URLs).

The backend uses `@nestjs/config`, so environment variables are injected into the NestJS application. The frontend reads `NEXT_PUBLIC_...` variables at build time through Next.js.

## Database and Prisma

The project uses Prisma as an ORM on top of PostgreSQL.

Prisma model for `Task` (approximate):

```prisma
model Task {
  id          String   @id @default(cuid())
  title       String
  description String?
  done        Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

After configuring `DATABASE_URL` in `.env`:
```bash
pnpm prisma:migrate
```
This executes:
```bash
pnpm --filter backend prisma migrate dev
```

---

## Running the Project

Start the NestJS backend in "dev" mode (build then run):
```bash
pnpm dev:backend
```

Start the Next.js app:
```bash
pnpm dev:frontend
```

Start Electron in development mode:
```bash
pnpm dev:electron
```