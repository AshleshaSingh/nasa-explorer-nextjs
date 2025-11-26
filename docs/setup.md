# Local Development Setup Guide

This guide explains how to set up the project locally, install dependencies, configure environment variables, and run the application in development mode.

---

## 1. Prerequisites

Before starting, ensure you have:

- **Node.js 18+**  
  Download: https://nodejs.org/

- **Enable Corepack (recommended)**  
  Corepack manages pnpm versions across different machines. Run this once:
  ```bash
  corepack enable 
  ```

- **pnpm package manager**
  If Corepack is not available, install manually:
  ```bash
  npm install -g pnpm
  ```

- Git
https://git-scm.com/

- NASA API Key
https://api.nasa.gov/

## 2. Clone the Repository
```bash
git clone <your-repo-url>
cd <project-folder-name>
```

Switch to the latest main branch:
```bash
git checkout main
git pull origin main
```

## 3. Install Dependencies
```bash
pnpm install
```

This installs all required packages:
- Next.js
- React
- TypeScript
- HeroUI
- Vitest + Testing Library
- ESLint + Prettier

## 4. Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env.local
```

2. Open .env.local and add your NASA API key:
```ini
NASA_API_KEY=your_real_key_here
NASA_API_BASE=https://api.nasa.gov
```
.env.local is ignored by Git and safe to use for development.

5. Run Development Server
```bash
pnpm dev
```

Then open your browser:
http://localhost:3000

6. Project Folder Structure
```graphql
app/
  api/
    apod/
      route.ts         # Server route handler for APOD
  page.tsx             # Home page
components/
  ApodSearchSection.tsx
  error.tsx
lib/
  nasa.ts              # NASA fetch helper (server-only)
types/
  nasa.ts              # Unified APOD TypeScript types
docs/
  setup.md             # Setup guide
```

7. Running Tests

Run full test suite:
```bash
pnpm test
```

Watch mode:
```bash
pnpm test:watch
```

Coverage report:
```bash
pnpm coverage
```

Goal: ≥ 70% coverage.

8. Linting & Formatting

Run the linter:
```bash
pnpm lint
```

Auto-format:
```bash
pnpm format
```

## Setup Complete!
Your development environment is now ready!
You can begin feature development, testing, and deployment work.