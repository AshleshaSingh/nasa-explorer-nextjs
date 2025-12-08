# NASA API Notes

This document summarizes the NASA APIs used in this project and includes endpoints, parameters, and implementation notes for both sprints.

---

## 1. Astronomy Picture of the Day (APOD)

### 1.1 Endpoint

```http
GET https://api.nasa.gov/planetary/apod
```

### 1.2 Required Query Parameters

| Name    | Type   | Required | Description   |
| ------- | ------ | -------- | ------------- |
| api_key | string | ✅       | NASA API key. |

### 1.3 Optional Query Parameters

| Name       | Type    | Description                               |
| ---------- | ------- | ----------------------------------------- |
| date       | string  | Specific date (`YYYY-MM-DD`).             |
| start_date | string  | Start of date range (`YYYY-MM-DD`).       |
| end_date   | string  | End of date range (`YYYY-MM-DD`).         |
| count      | number  | Number of random APOD items to return.    |
| thumbs     | boolean | Include thumbnail URLs for video results. |

### 1.4 Example Request

```text
https://api.nasa.gov/planetary/apod?date=2024-01-01&api_key=YOUR_KEY
```

### 1.5 Sample Response

```json
{
  "date": "2024-01-01",
  "title": "Example Title",
  "explanation": "Description here...",
  "url": "https://apod.nasa.gov/example.jpg",
  "media_type": "image"
}
```

### 1.6 TypeScript Interface (used in `types/nasa.ts`)

```ts
export interface ApodResponse {
  date: string;
  title: string;
  explanation: string;
  url: string;
  media_type: "image" | "video";
  hdurl?: string;
  service_version?: string;
}
```

### 1.7 Implementation Notes (Sprint 1)

- Use a **server-only helper** in `lib/nasa.ts` (e.g., `fetchApod`).
- Read API key from `process.env.NASA_API_KEY`.
- Expose a Next.js **Route Handler** at `app/api/apod/route.ts`.
- Client page at `app/apod/page.tsx`:
  - Date input + submit button.
  - Loading state and error handling.
  - Renders APOD title, date, image/video, and explanation.

---

## 2. NASA Image & Video Library

Used mainly in **Sprint 2** for the search feature.

### 2.1 Endpoint

```http
GET https://images-api.nasa.gov/search
```

### 2.2 Key Query Parameters

| Name       | Type   | Description                                |
| ---------- | ------ | ------------------------------------------ |
| q          | string | Search term (required).                    |
| media_type | string | One or more of: `image`, `video`, `audio`. |
| year_start | string | Filter results starting from this year.    |
| year_end   | string | Filter results up to this year.            |
| page       | number | Pagination (page index, starting from 1).  |

### 2.3 Example Requests

```text
https://images-api.nasa.gov/search?q=moon&media_type=image
```

```text
https://images-api.nasa.gov/search?q=earth&media_type=image&year_start=2010&year_end=2020&page=2
```

### 2.4 Sample Response Structure (simplified)

```json
{
  "collection": {
    "metadata": {
      "total_hits": 124
    },
    "items": [
      {
        "data": [
          {
            "title": "Moonshot",
            "description": "First trip to the moon...",
            "media_type": "image",
            "date_created": "1969-07-20"
          }
        ],
        "links": [
          {
            "rel": "preview",
            "href": "https://images-assets.nasa.gov/image/ID/ID~thumb.jpg"
          }
        ]
      }
    ]
  }
}
```

### 2.5 Suggested TypeScript Interfaces (example)

```ts
export interface NasaMediaData {
  title: string;
  description?: string;
  date_created?: string;
  media_type: string;
}

export interface NasaMediaLink {
  rel?: string;
  href: string;
}

export interface NasaMediaItem {
  data: NasaMediaData[];
  links?: NasaMediaLink[];
}

export interface NasaSearchCollection {
  metadata?: { total_hits?: number };
  items: NasaMediaItem[];
}
```

### 2.6 Implementation Notes (Sprint 2)

- Create a server route like `app/api/nasa/search/route.ts`.
- Accept query parameters from the client:
  - `q`, `media_type`, `year_start`, `year_end`, `page`.
- On the client (e.g., `app/search/page.tsx`):
  - Implement a form with:
    - Text input for `q`.
    - Dropdown/select for `media_type`.
    - Optional year range inputs.
  - Show:
    - Loading state.
    - Empty state (“No results found”).
    - Error state (API error messages).
  - Render cards or grid with preview image, title, and date.

---

## 3. Environment Variables & Security

We use environment variables to avoid exposing secrets in code.

### 3.1 Variables

- `NASA_API_KEY` – required NASA API key.
- `NASA_API_BASE` – optional base URL (default `https://api.nasa.gov`).

### 3.2 Local Setup

Create `.env.local`:

```env
NASA_API_KEY=YOUR_REAL_KEY_HERE
NASA_API_BASE=https://api.nasa.gov
```

Do **not** commit `.env.local` to Git. Instead, commit an `.env.example`:

```env
NASA_API_KEY=your_key_here
NASA_API_BASE=https://api.nasa.gov
```

### 3.3 Best Practices

- Only access `NASA_API_KEY` in:
  - Route Handlers
  - Server Actions
  - Other server-only files (`lib/nasa.ts` with `import "server-only";`)
- Never call the NASA API directly from the browser with your key in the URL.
- Configure the same variables in your deployment platform (Render) as secrets.

---

## 4. Useful Links

- NASA API Portal: https://api.nasa.gov/
- APOD Docs: https://api.nasa.gov/#apod
- NASA Image & Video Library Docs (PDF): https://images.nasa.gov/docs/images.nasa.gov_api_docs.pdf
- Next.js Route Handlers: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
