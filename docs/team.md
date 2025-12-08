# Team Roles & Contribution Plan – NASA API Web Engineering Project

This document outlines responsibilities and contribution areas for each team member across both sprints.  
Roles are intentionally rotated between Sprint 1 and Sprint 2 to ensure everyone gains experience in:

- Coding / Implementation (both backend and frontend)
- Testing / QA (unit, integration, component, and UI testing)
- Documentation / Project Management (planning, community contribution, presentations)

---

## Team Overview

| Member       | Name               | GitHub Username | Sprint 1 Role                                                     | Sprint 2 Role                                                 |
| ------------ | ------------------ | --------------- | ----------------------------------------------------------------- | ------------------------------------------------------------- |
| **Member 1** | **Khushi Jani**    | @kbjani         | Backend Lead (APOD API) + Unit Testing Support                    | UI Enhancements (Skeletons, Empty States) + Final QA          |
| **Member 2** | **Daniel Ramirez** | @ranieldamirez  | Frontend Lead (APOD UI) + UI Documentation                        | Backend Validation (Zod + RHF) + Integration Testing          |
| **Member 3** | **Fnu Swati**      | @stomarp        | Testing Lead + TypeScript Setup                                   | Feature Dev (NASA Image Search + Pagination) + Documentation  |
| **Member 4** | **John Morales**   | @github-user-4  | Error Boundary UI                                                 | Deployment Lead (Render) + Production QA + Deployment Docs    |
| **Member 5** | **Ashlesha Singh** | @AshleshaSingh  | Project Board Setup + API–UI Integration + Sprint 1 Documentation | Feature Dev (Search UI Shared) + README Polish + Presentation |

---

## Sprint Task Breakdown

### Sprint 1 – Setup & Core Development

| Area                         | Member(s) Responsible | Deliverables                                                 |
| ---------------------------- | --------------------- | ------------------------------------------------------------ |
| **Backend / API**            | Member 1, Member 5    | `lib/nasa.ts`, `/api/apod`                                   |
| **Frontend / UI**            | Member 2              | `/apod` form page + loading/error states                     |
| **Testing**                  | Member 3, Member 1    | Unit test for `fetchApod`, integration test for `/api/apod`  |
| **TypeScript Setup**         | Member 3              | Set up TS interfaces, create `/types` folder, add APOD types |
| **Project Board Setup**      | Member 5              | GitHub Project Board, task setup, assignments                |
| **Environment Setup**        | Member 5              | `.env.example`, env setup instructions                       |
| **Documentation (Sprint 1)** | Member 5              | `/docs/team.md`, `/docs/api-notes.md`, `CONTRIBUTING.md`     |
| **Error Handling UI**        | Member 4              | Error boundary UI + fallback components                      |

---

### Sprint 2 – Testing, UI Polish, Deployment (Final Balanced Version)

| Area                              | Member(s) Responsible | Deliverables                                               |
| --------------------------------- | --------------------- | ---------------------------------------------------------- |
| **Feature Dev (Image Search UI)** | Member 3, Member 5    | NASA Image Search page, shared UI components, pagination   |
| **Validation & Form UX**          | Member 2              | Zod + React Hook Form validation + integration tests       |
| **UI Enhancements**               | Member 1              | Skeleton loaders, empty/loader states, refined UI          |
| **Deployment & Production QA**    | Member 4              | Render deployment, deployment docs, production API testing |
| **Final Documentation & Demo**    | Member 5              | Final README polish, presentation slides, UX polish        |

---

## Contribution Expectations

- Each team member will:
  - Contribute code that is visible in commits, PRs, and reviews
  - Write or contribute to tests (unit, component, or integration)
  - Own or share responsibility for documentation and sprint updates
- All tasks are tracked via the GitHub Project Board (`Backlog → In Progress → In Review → Done`)

---

## Meeting Rhythm

- **Weekly Standup (15 min)** – Review progress, update board, plan next steps
- **Sprint Demo Prep** – Short meeting before mid-sprint and final demos
- **Communication** – Use Teams/Outlook for blockers and help requests

---

## Code Collaboration Guidelines

- Use feature branches (`feat/...`, `fix/...`, `test/...`)
- Open Pull Requests early for feedback
- Request review from at least one teammate
- Do not merge without code review
- Keep PRs small and focused

---

This balanced plan ensures **shared ownership** and a **fair distribution of work** across the project.
