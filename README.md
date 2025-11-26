[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/qJYfAbEt)
[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-2972f46106e565e64193e422d61a12cf1da4916b45550586e14ef0a7c637dd04.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=21646052)

# NASA APOD Explorer — Next.js + TypeScript + NASA API

A full-stack web application that fetches NASA’s **Astronomy Picture of the Day (APOD)** using server-side Next.js Route Handlers.  
Users can enter a date to instantly view the astronomy image/video, explanation, media type, and HD version if available.

Built as a Web Engineering project — focusing on API integration, UI development, testing, and deployment.

---

## Project Status

| Feature | Sprint 1 | Sprint 2 |
|---|:---:|:---:|
| Local environment setup | Done | — |
| APOD server-side API handler | Done | — |
| APOD Search UI + HeroUI components | Done | — |
| Global + Component Error UI | Implemented, pending refinement | — |
| Unit + Integration Tests | Basic coverage | Expand >70% |
| NASA Image Search | — | Sprint 2 |
| Deployment (Render.io) | — | Sprint 2 |

---

# Team Overview

| Member | Sprint 1 Role | Sprint 2 Role |
|---|---|---|
| **Khushi Jani** | Backend Lead (APOD API) + Unit Testing Support | UI Enhancements (Skeletons, Empty States) + Final QA |
| **Daniel Ramirez** | Frontend Lead (APOD UI) + UI Documentation | Backend Validation (Zod + RHF) + Integration Testing |
| **Fnu Swati** | Testing Lead + TypeScript Setup | Feature Dev (NASA Image Search + Pagination) + Documentation |
| **John Morales** | No Sprint-1 output → responsibilities redistributed | Work reassigned to team (see Sprint 2) |
| **Ashlesha Singh** | Project Board + API–UI Integration + Sprint-1 Documentation | Feature Dev (Search UI Shared) + README Polish + Presentation |

> **Note:** Since John did not contribute during Sprint-1, his future tasks were redistributed to maintain workflow continuity.

---

# Sprint Task Breakdown

### **Sprint 1 – Setup & Core Development (Completed)**

| Area | Member(s) Responsible | Deliverables |
|---|---|---|
| Backend / API | Khushi + Ashlesha | `lib/nasa.ts`, `/api/apod` route |
| Frontend / UI | Daniel | `/apod` form page + loading/error states |
| Testing | Swati + Khushi | Unit test for `fetchApod`, integration test for `/api/apod` |
| TypeScript Setup | Swati | `/types` folder + interfaces |
| Project Board Setup | Ashlesha | GitHub Project board + task breakdown |
| Environment Setup | Ashlesha | `.env.example`, setup instructions |
| Documentation | Ashlesha | `/docs/team.md`, `/docs/api-notes.md`, `CONTRIBUTING.md` |
| Error Handling UI | Reassigned → completed by Ashlesha | Global + component-level error UI |

---

### **Sprint 2 – Testing, UI Polish, Deployment (Balanced Roles)**

| Area | Member(s) Responsible | Deliverables |
|---|---|---|
| Feature Dev: Image Search UI | Ashlesha | NASA Image Search, pagination, shared UI |
| Validation & Form UX | Daniel | Zod + React Hook Form + integration tests |
| UI Enhancements | Khushi | Skeletons + empty states + refined APOD UI |
| Deployment & Production QA | **Swati (previously John)** | Render deployment + environment config + QA |
| Final Documentation & Demo | Ashlesha + Team | README polish + presentation slides + sprint review |

---

# Contribution Expectations

### Each team member will:
- Commit code regularly — visible in repo history
- Write or contribute to tests for assigned features
- Update docs + project board during progress

### GitHub Project Board Flow:
Backlog → In Progress → In Review → Done

### Code Collaboration Rules
| Rule | Requirement |
|---|---|
| Branching | `feat/...`, `fix/...`, `test/...` |
| PR Review | At least one reviewer required |
| Merge Policy | No unreviewed merges |
| PR Size | Small, focused, descriptive |

---

# Project Structure
```bash
group-project-group1-nasa-api/
├── app/                          # Next.js App Router (pages, routes, layouts)
│   ├── layout.tsx                # Global layout wrapper
│   ├── error.tsx                 # Global app error boundary (fallback UI)
│   ├── page.tsx                  # Home page (Landing UI)
│   │
│   ├── about/                    # Static About Page
│   │   └── page.tsx
│   │
│   ├── apod/                     # UI Route → NASA APOD Search Form + Results
│   │   └── page.tsx
│   │
│   └── api/                      # Server-side Route Handlers
│       └── apod/
│           └── route.ts          # `/api/apod` → calls fetchApod()
│
├── components/                   # Reusable UI Components
│   ├── ApodSearchSection.tsx     # Main APOD search + results UI
│   └── error.tsx                 # Reusable card for error messages
│
├── lib/                          # Server-only logic + API helpers
│   └── nasa.ts                   # fetchApod() → NASA APOD request logic + validation
│
├── types/                        # TypeScript definitions
│   ├── nasa.ts                   # ApodResponse + ApodResult interfaces
│   └── index.ts                  # (optional barrel export)
│
├── tests/                        # Vitest test suites
│   ├── fetchApod.test.ts         # Unit tests for fetchApod()
│   └── api.apod.test.ts          # Integration tests for /api/apod (WIP)
│
├── docs/                         # Project docs
│   ├── setup.md                  # Local development + environment setup
│   ├── api-notes.md              # NASA API reference notes
│   └── team.md                   # Roles + sprint responsibilities
│
├── .env.example                  # Template for required environment variables
├── README.md                     # Main project documentation
├── CONTRIBUTING.md               # PR workflow + testing rules
├── pnpm-lock.yaml                # pnpm dependency lock
├── tsconfig.json                 # TypeScript config
├── tailwind.config.ts            # Styling config (HeroUI/Tailwind)
├── postcss.config.js             # PostCSS config
└── next.config.js                # Next.js config

```

---

# Local Setup

```bash
corepack enable
pnpm install
cp .env.example .env.local   # add NASA_API_KEY
pnpm dev                     # run locally at http://localhost:3000
```


# Useful References
- Resource	Link
- NASA API Docs	https://api.nasa.gov
- HeroUI Docs	https://www.heroui.com/docs
- Next.js App Router	https://nextjs.org/docs/app
- Vitest Testing	https://vitest.dev

## License

Licensed under the [MIT license](https://github.com/heroui-inc/next-app-template/blob/main/LICENSE).
- [Next.js 14](https://nextjs.org/docs/getting-started)
- [HeroUI v2](https://heroui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Tailwind Variants](https://tailwind-variants.org)
- [TypeScript](https://www.typescriptlang.org/)
- [Framer Motion](https://www.framer.com/motion/)
- [next-themes](https://github.com/pacocoursey/next-themes)

## How to Use

### Use the template with create-next-app

To create a new project based on this template using `create-next-app`, run the following command:

```bash
npx create-next-app -e https://github.com/heroui-inc/next-app-template
```

### Install dependencies

You can use one of them `npm`, `yarn`, `pnpm`, `bun`, Example using `npm`:

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

### Setup pnpm (optional)

If you are using `pnpm`, you need to add the following code to your `.npmrc` file:

```bash
public-hoist-pattern[]=*@heroui/*
```

After modifying the `.npmrc` file, you need to run `pnpm install` again to ensure that the dependencies are installed correctly.

## License

Licensed under the [MIT license](https://github.com/heroui-inc/next-app-template/blob/main/LICENSE).
