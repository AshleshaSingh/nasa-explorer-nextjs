# Contributing Guidelines – NASA API Web Engineering Project

These guidelines describe **how** we work together on this repository: branches, commits, pull requests,
code review, and general expectations for collaborating as a team.

This file is about the **process of contributing code**, not the individual roles (see `/docs/team.md` for roles).

## 1. Branching Strategy

- Do **not** commit directly to `main` (unless approved by the team for small fixes).
- Create feature branches from `main` using a clear naming convention:

Examples:

- `feat/apod-form`
- `feat/api-apod-route`
- `fix/apod-error-state`
- `chore/update-readme`

Commands:

```bash
git checkout main
git pull origin main
git checkout -b feat/short-description
```

## 2. Commit Message Style

Use short, descriptive commit messages in the imperative form:

Examples:

- `feat: add APOD form with date input`
- `fix: handle missing NASA_API_KEY error`
- `test: add unit test for fetchApod`
- `docs: update README with setup steps`

Avoid very generic messages such as `update`, `fix`, or `changes`.

## 3. Pull Requests (PRs)

- Open a PR for each feature or fix, targeting the `main` branch.
- Keep PRs focused: one main topic per PR if possible.
- Add a short description of:
  - What you changed
  - Why you changed it
  - How to test it (if applicable)

Example PR template contents:

- **Summary:** Short description of the change.
- **Testing:** Steps to reproduce or verify.
- **Notes:** Known issues, follow-up tasks, or screenshots.

At least **one teammate** should review your PR before merging.

## 4. Code Review Expectations

- Be kind and constructive in reviews.
- Check for:
  - Correctness and clarity
  - TypeScript types and error handling
  - Consistent use of HeroUI and project patterns
  - Tests when relevant (especially for API and logic changes)

Reviewers can request changes, ask questions, or approve the PR.

## 5. Testing Before Merging

- Run the test suite before merging when tests are in place:

```bash
pnpm test
# or
pnpm vitest
```

- For UI changes, manually test key pages:
  - `/` (home)
  - `/apod`
  - Image/Video search page (when implemented)

## 6. Working With Environment Variables

- Do **not** commit `.env.local` or real API keys.
- Use `.env.example` to document the required variables.
- Each developer should maintain their own `.env.local` file locally.
- For deployment, use the hosting provider's environment/secret settings.

## 7. Keeping the Project Board Updated

- When you start a task, move the corresponding card to **In Progress**.
- When you open a PR, move the card to **In Review** and link the PR.
- After the PR is merged and tested, move the card to **Done**.

This helps the team and instructor see the current state of the project.

## 8. Communication & Support

- Use the agreed team channel (e.g., Teams, Discord, WhatsApp) for quick questions.
- If you are blocked for more than 30–60 minutes, ask for help.
- Share important decisions (API design, folder structure) in writing so everyone stays aligned.

## 9. Code Style & Linting

- Follow the existing ESLint/Prettier configuration in the repository.
- Run linting if configured:

```bash
pnpm lint
```

- Keep components small and reusable when possible.
- Prefer clear, readable code over clever but confusing solutions.

---

By following these guidelines, we keep the project organized, make it easier to collaborate,
and ensure that everyone in the team can contribute effectively.
