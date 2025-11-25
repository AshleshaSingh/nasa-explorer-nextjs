/// lib/nasa.ts
// lib/nasa.ts
import "server-only";
import type { ApodResult } from "@/types/nasa";

const BASE_URL = process.env.NASA_API_BASE ?? "https://api.nasa.gov";
//const API_KEY = process.env.NASA_API_KEY;
const API_KEY = process.env.NASA_API_KEY;

/**
 * Calls NASA's APOD API on the server side.
 *
 * Supports:
 *  - date: specific date in YYYY-MM-DD format
 *  - count: number of random APODs
 *  - thumbs: request thumbnails for videos
 */
export async function fetchApod(params: {
  date?: string;
  count?: number;
  thumbs?: boolean;
}): Promise<ApodResult> {

  const API_KEY = process.env.NASA_API_KEY;
  if (!API_KEY) {
    throw new Error("NASA_API_KEY is not set in environment variables.");
  }

  const url = new URL("/planetary/apod", BASE_URL);
  url.searchParams.set("api_key", API_KEY);

  if (params.date) {
    url.searchParams.set("date", params.date);
  }
  if (params.count) {
    url.searchParams.set("count", String(params.count));
  }
  if (params.thumbs) {
    url.searchParams.set("thumbs", "true");
  }

  const res = await fetch(url.toString(), {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`APOD API error: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as ApodResult;

  // Basic sanity check for object case. For array, check first element.
  const sample = Array.isArray(data) ? data[0] : data;

  if (!sample?.date || !sample?.title || !sample?.url || !sample?.media_type) {
    throw new Error("APOD response is missing required fields.");
  }

  return data;
}
}
