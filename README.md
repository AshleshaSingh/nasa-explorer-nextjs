[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/qJYfAbEt)
[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-2972f46106e565e64193e422d61a12cf1da4916b45550586e14ef0a7c637dd04.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=21646052)

# NASA APOD Explorer — Next.js + TypeScript + NASA API

A full-stack web application that fetches NASA’s **Astronomy Picture of the Day (APOD)** using server-side Next.js Route Handlers.  
Users can enter a date to instantly view the astronomy image/video, explanation, media type, and HD version if available.

Built as a Web Engineering project — focusing on API integration, UI development, testing, and deployment.

---

## Project Status

| Feature                            |            Sprint 1             |  Sprint 2   |
| ---------------------------------- | :-----------------------------: | :---------: |
| Local environment setup            |              Done               |      —      |
| APOD server-side API handler       |              Done               |      —      |
| APOD Search UI + HeroUI components |              Done               |      —      |
| Global + Component Error UI        | Implemented, pending refinement |      —      |
| Unit + Integration Tests           |         Basic coverage          | Expand >70% |
| NASA Image Search                  |                —                |  Sprint 2   |
| Deployment (Render.io)             |                —                |  Sprint 2   |

---

# Team Overview

| Member             | Sprint 1 Role                                               | Sprint 2 Role                                                 |
| ------------------ | ----------------------------------------------------------- | ------------------------------------------------------------- |
| **Khushi Jani**    | Backend Lead (APOD API) + Unit Testing Support              | UI Enhancements (Skeletons, Empty States)                     |
| **Daniel Ramirez** | Frontend Lead (APOD UI) + UI Documentation                  | Backend Validation (Zod + RHF) + Integration Testing          |
| **Fnu Swati**      | Testing Lead + TypeScript Setup                             | Render deployment + environment config + QA testing           |
| **John Morales**   | No Sprint-1 output → responsibilities redistributed         | Work reassigned to team (see Sprint 2)                        |
| **Ashlesha Singh** | Project Board + API–UI Integration + Sprint-1 Documentation | Feature Dev (NASA Image Search + Pagination + Search UI Shared) + Code cleanup |

> **Note:** Since John did not contribute during Sprint-1 and Sprint-2, his all tasks were redistributed to maintain workflow continuity.

---

# Sprint Task Breakdown

### **Sprint 1 – Setup & Core Development (Completed)**

| Area                | Member(s) Responsible              | Deliverables                                                |
| ------------------- | ---------------------------------- | ----------------------------------------------------------- |
| Backend / API       | Khushi + Ashlesha                  | `lib/nasa.ts`, `/api/apod` route                            |
| Frontend / UI       | Daniel                             | `/apod` form page + loading/error states                    |
| Testing             | Swati + Khushi                     | Unit test for `fetchApod`, integration test for `/api/apod` |
| TypeScript Setup    | Swati                              | `/types` folder + interfaces                                |
| Project Board Setup | Ashlesha                           | GitHub Project board + task breakdown                       |
| Environment Setup   | Ashlesha                           | `.env.example`, setup instructions                          |
| Documentation       | Ashlesha                           | `/docs/team.md`, `/docs/api-notes.md`, `CONTRIBUTING.md`    |
| Error Handling UI   | Reassigned → completed by Ashlesha | Global + component-level error UI                           |

---

### **Sprint 2 – Testing, UI Polish, Deployment (Balanced Roles)**

| Area                         | Member(s) Responsible       | Deliverables                                        |
| ---------------------------- | --------------------------- | --------------------------------------------------- |
| Feature Dev: Image Search UI | Ashlesha                    | NASA Image Search, pagination, shared UI            |
| Validation & Form UX         | Daniel                      | Zod + React Hook Form + integration tests           |
| UI Enhancements              | Khushi                      | Skeletons + empty states + refined APOD UI          |
| Deployment & Production QA   | Swati                       | Render deployment + environment config + QA         |
| Final Documentation & Demo   | Team             | README polish + presentation slides + sprint review |

---

# Contribution Expectations

### Each team member will:

- Commit code regularly — visible in repo history
- Write or contribute to tests for assigned features
- Update docs + project board during progress

### GitHub Project Board Flow:

Backlog → In Progress → In Review → Done

### Code Collaboration Rules

| Rule         | Requirement                       |
| ------------ | --------------------------------- |
| Branching    | `feat/...`, `fix/...`, `test/...` |
| PR Review    | At least one reviewer required    |
| Merge Policy | No unreviewed merges              |
| PR Size      | Small, focused, descriptive       |

---

# Project Structure

```bash
group-project-group1-nasa-api/
├── app/                          
│   ├── layout.tsx                # Global layout wrapper
│   ├── error.tsx                 # Global app error boundary (fallback UI)
│   ├── page.tsx                  # Home landing page
│   │
│   ├── about/
│   │   └── page.tsx              # Static About page
│   │
│   ├── apod/
│   │   └── page.tsx              # APOD search page route
│   │
│   └── api/
│       └── apod/
│           └── route.ts          # `/api/apod` → server handler calling fetchApod()
│
├── components/                   
│   ├── ApodSearchSection.tsx         # Main APOD form + results UI (Zod + RHF)
│   ├── ApodSkeleton.tsx              # Loading placeholder UI
│   ├── ApodEmptyCard.tsx             # Empty state when no APOD result yet
│   ├── ApodErrorCard.tsx             # APOD-specific error display card
│   │
│   ├── ImageSearchSection.tsx        # Image Search form + results UI
│   ├── ImageSearchSkeleton.tsx       # Loading placeholder for Image Search
│   ├── ImageSearchEmptyCard.tsx      # Empty UI state for Image Search
│   ├── ImageSearchErrorCard.tsx      # Error UI for Image Search failures
│   │
│   ├── error.tsx                     # Reusable ErrorCard component
│   ├── Toast.tsx                     # Global toast / alert system
│   ├── icons.tsx                     # Shared icon components
│   ├── navbar.tsx                    # Top navigation UI
│   ├── theme-switch.tsx              # Light/dark mode switch
│   └── primitives.ts                 # Styled text primitives (title, subtitle)
│
├── lib/
│   └── nasa.ts                       # fetchApod() logic + server validation
│
├── types/
│   ├── nasa.ts                       # ApodResponse and shared NASA types
│   ├── apod.ts                       # APOD Zod schema + ApodFormData
│   └── index.ts                      # Optional barrel exports
│
├── tests/
│   ├── fetchApod.test.ts             # Unit tests for NASA fetch wrapper
│   ├── api.apod.test.ts              # Integration test for route handler
│   ├── ApodSearchSection.test.tsx    # Tests for APOD UI + validation
│   └── ImageSearchSection.test.tsx   # Tests for Image Search UI
│
├── docs/
│   ├── setup.md                      # Local dev setup (Node, pnpm, HeroUI)
│   ├── api-notes.md                  # Notes on NASA API usage
│   └── team.md                       # Responsibilities + sprint planning
│
├── .env.example                      
├── README.md                         
├── CONTRIBUTING.md                   
├── pnpm-lock.yaml                    
├── tsconfig.json                     
├── tailwind.config.ts                
├── postcss.config.js                 
└── next.config.js                    



```

---

# Local Setup

```bash
corepack enable
pnpm install
cp .env.example .env.local   # add NASA_API_KEY
pnpm dev                     # run locally at http://localhost:3000
```

# Deployment (Render.io)

Our production app is deployed on Render.

## Production URL:

https://group-project-group1-nasa-api.onrender.com

## Render Service Configuration

Service type: Web Service
Language: Node
Branch: main

# Build command:

```bash
npm install && npm run build
```

# Start command:

```bash
npm run start
```

Instance type: Free (512 MB RAM, 0.1 CPU) — suitable for this class project.

# Environment Variables on Render

We do not commit real secrets into GitHub.
Instead, we configure them in Render under Environment → Environment Variables:
`NASA_API_KEY → our real NASA API key`

`NASA_API_BASE → https://api.nasa.gov`

These are read on the server only via process.env in `lib/nasa.ts`, so the key is not exposed to the browser.
Example from `lib/nasa.ts`:

```bash
const BASE_URL = process.env.NASA_API_BASE ?? "https://api.nasa.gov";
const API_KEY = process.env.NASA_API_KEY;
```

# How to Redeploy

Any push to the main branch triggers an automatic deploy on Render:

1. Commit + push changes to main
2. Render detects the commit and runs:
   `npm install && npm run build`
   `npm run start`

3. You can watch logs and deploy status on the Render dashboard.

If needed, you can also trigger a Manual Deploy from the Render UI.

## Testing

This project uses **Vitest** and **React Testing Library** for unit and integration tests.

### What’s Covered

- `tests/fetchApod.test.ts`  
  Unit tests for `fetchApod` in `lib/nasa.ts` (success, error paths, and basic server-side validation).

- `tests/api.apod.test.ts`  
  Integration tests for the `/api/apod` route handler (status codes, JSON shape, and error responses).

- `tests/ApodSearchSection.test.tsx`  
  Component tests for the APOD Search UI:
  - Initial render state (empty form / empty card)
  - Zod + React Hook Form validation errors
  - Disabled submit button when the form is invalid
  - Successful submit calling the backend with a valid date

- `tests/ImageSearchSection.test.tsx`  
  Component tests for the NASA Image Search UI:
  - Form rendering and input handling
  - Loading skeleton / empty state behavior
  - Error card display when the request fails

> **Note:** Tests mock network requests to NASA; they do **not** call the real API or require a valid `NASA_API_KEY`.

### How to Run Tests

From the project root:

```bash
pnpm install       # if you haven’t already
pnpm test          # run the full test suite once
pnpm test -- --watch     # watch mode (rerun on file changes)
pnpm test -- --coverage  # generate a coverage report
```

![Test Results]<img width="547" height="326" alt="Screenshot 2025-12-08 183054" src="https://github.com/user-attachments/assets/415de511-8ff8-4685-b4a8-b2e809bc6d31" />


# Useful References

- Resource Link
- NASA API Docs https://api.nasa.gov
- HeroUI Docs https://www.heroui.com/docs
- Next.js App Router https://nextjs.org/docs/app
- Vitest Testing https://vitest.dev

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
