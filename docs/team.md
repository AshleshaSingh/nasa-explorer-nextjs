# Team Roles & Contribution Plan – NASA API Web Engineering Project

This document outlines responsibilities and contribution areas for each team member across both sprints.  
Roles are intentionally rotated between Sprint 1 and Sprint 2 to ensure everyone gains experience in:

- Coding / Implementation (both backend and frontend)
- Testing / QA (unit, integration, component, and UI testing)
- Documentation / Project Management (planning, community contribution, presentations)

---

## Team Overview

|  Member    | Name              | GitHub Username | Sprint 1 Role                              | Sprint 2 Role                          |
|------------|-------------------|----------------|--------------------------------------------|----------------------------------------|
|**Member 1**| **Khushi Jani**    | @kbjani        | Backend Lead (APOD API) + Unit Testing     | Frontend Feature (Search Page) + Docs  |
|**Member 2**| **Daniel Ramirez** | @ranieldamirez | Frontend Lead (APOD UI) + Manual Testing   | Validation + Integration Testing       |
|**Member 3**| **Fnu Swati**      | @stomarp | Testing Lead + TypeScript Setup            | UI Enhancements + Final Testing        |
|**Member 4**| **Member 4**      | @github-user-4 | Environment Setup + Deployment Placeholder | Deployment + Production Testing + Docs |
|**Member 5**| **Ashlesha Singh** | @AshleshaSingh | API-UI Integration + Integration Testing   | Shared UI, UX Polish + Final Docs/Slides |

---

## Sprint Task Breakdown

### Sprint 1 – Setup & Core Development

| Area | Member(s) Responsible | Deliverables |
|------|------------------------|--------------|
| Backend / API | Member 1, Member 5 | `lib/nasa.ts`, `/api/apod` route |
| Frontend / UI | Member 2 | `/apod` form page + loading/error UI |
| Testing | Member 3, Member 5 | Unit test for `fetchApod`, integration test for `/api/apod` |
| Environment & Project Setup | Member 4 | `.env.example`, `.env.local`, nav links |
| Documentation | Member 5, Member 4, Member 2 | `/docs/team.md`, `/docs/api-notes.md`, UI usage guide |

---

### Sprint 2 – Testing, UI Polish, Deployment (Roles Rotated)

| Area | Member(s) Responsible | Deliverables |
|------|------------------------|--------------|
| Feature Dev (Search UI) | Member 1 | NASA Image Search UI + pagination |
| Validation & Form UX | Member 2 | Zod + React Hook Form + integration test |
| UI Enhancements | Member 3 | Loading skeletons, empty/error states |
| Deployment & QA | Member 4 | Deploy to Render, production testing, deployment docs |
| Final Documentation & Demo | Member 5 | README polish, demo slides, team presentation |

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

