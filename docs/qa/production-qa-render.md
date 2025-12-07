# Production QA Report — NASA APOD Explorer

**Date:** 2025-11-25  
**Tester:** Fnu Swati  
**Environment:** Render production  
**Base URL:** https://group-project-group1-nasa-api.onrender.com  

---

## Summary

- Core pages (`/`, `/apod`, `/images`) load successfully in production.
- APOD flow works end-to-end for a valid date (UI + API).
- Invalid APOD date (future) correctly returns an error from NASA and surfaces in the UI.
- NASA Image Search works for common queries (e.g. `moon`).
- No-results case for Image Search shows a friendly message.
- API-only routes return the expected JSON shape.
- 404 page is rendered correctly for unknown routes.
- Only minor UX improvement identified for APOD invalid date error message (tracked in a GitHub issue).

Overall result: **No blocking production issues found. App is usable and stable in Render.**

---

## Test Matrix

| ID   | Area                             | URL / Action                                                                                     | Result  | Notes                                                                                       |
|------|----------------------------------|--------------------------------------------------------------------------------------------------|---------|---------------------------------------------------------------------------------------------|
| T1a  | Home page                        | Open `/`                                                                                         | Passed  | Home page loads, no crash. Links to **APOD** and **Images** are visible.                   |
| T1b  | APOD page                        | Open `/apod`                                                                                     | Passed  | APOD search UI renders with date input + submit button.                                    |
| T1c  | Images page                      | Open `/images`                                                                                   | Passed  | Image search UI renders with text input for query (e.g., `moon`, `nebula`, `galaxy`).      |
| T2A  | APOD happy path                  | `/apod` → enter valid date (e.g. `2022-01-01`) and search                                       | Passed  | APOD card shows title, date, description, and image/video. No errors.                      |
| T2B  | APOD invalid date (future)       | `/apod` → enter `2100-01-01` and search                                                         | Passed* | UI shows “Something went wrong” with error from NASA: `APOD API error: 400 Bad Request`.   |
| T3   | Image Search happy path          | `/images` → search for `moon`                                                                   | Passed  | Renders a gallery of NASA images with title, date, and thumbnail.                          |
| T4   | Image Search no-results case     | `/images` → search for `asdfghjklqwertyuiop`                                                    | Passed  | Shows friendly message: `No results found for asdfghjklqwertyuiop. Try a different keyword.` |
| T5   | APOD API missing params          | Call `/api/apod` with no query params                                                           | Passed  | Returns JSON: `{ "ok": false, "error": "Provide either 'date' or 'count' parameter." }`.   |
| T6   | Images API check                 | Call `/api/images?query=moon&page=1`                                                            | Passed  | Returns NASA Images API `collection` JSON with items for `moon`.                           |
| T7   | Global 404 / error boundary      | Open `/something-that-does-not-exist`                                                           | Passed  | Shows Next.js 404: `This page could not be found.` No crash or stack trace.               |

\* **Note on T2B:** Behavior is correct technically (NASA returns 400), but the error text is a bit technical for end users. Suggested improvement: show a friendlier message like _“Please choose a date between June 16, 1995 and today”_ instead of exposing the raw `400 Bad Request`. This is tracked in GitHub.

---

## Conclusion

- **Backend Route Handlers** (`/api/apod`, `/api/images`) are working correctly in production.
- **APOD UI** and **Image Search UI** both integrate with the live NASA APIs successfully.
- **Error boundaries and 404 handling** work as expected in production.
- The application meets the deployment and environment configuration goals for Sprint 2.

No critical bugs were found during this QA pass. Only **one UX enhancement** was identified and logged as a GitHub issue.
