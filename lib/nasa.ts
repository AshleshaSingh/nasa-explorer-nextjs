// lib/nasa.ts
import "server-only";
import type { ApodResult, NasaImageSearchResult } from "@/types/nasa";

/**
 * Base URL for APOD (Astronomy Picture of the Day) API.
 */
const BASE_URL = process.env.NASA_API_BASE ?? "https://api.nasa.gov";

/**
 * Base URL for NASA Image and Video Library.
 * This API does NOT require an API key.
 */
const IMAGES_BASE_URL =
  process.env.NASA_IMAGES_BASE ?? "https://images-api.nasa.gov";


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

/**
 * Server-side helper for NASA Image and Video Library search.
 *
 * - Uses https://images-api.nasa.gov/search
 * - Requires a non-empty query string
 * - Optionally accepts a page number (for future pagination)
 *
 * NOTE: For this task, the UI will always call page=1.
 */
export async function searchNasaImages(params: {
  query: string;
  page?: number;
}): Promise<NasaImageSearchResult> {
  const { query, page = 1 } = params;

  if (!query || query.trim().length === 0) {
    throw new Error("Search query is required.");
  }

  // Build the URL for NASA image search
  const url = new URL("/search", IMAGES_BASE_URL);
  url.searchParams.set("q", query.trim());
  url.searchParams.set("media_type", "image"); // limit to images only
  url.searchParams.set("page", String(page));

  const res = await fetch(url.toString(), {
    cache: "no-store", // always fetch fresh data
  });

  if (!res.ok) {
    throw new Error(
      `NASA Image search API error: ${res.status} ${res.statusText}`,
    );
  }

  const data = (await res.json()) as NasaImageSearchResult;

  if (!data?.collection?.items) {
    throw new Error("NASA Image search response is missing items.");
  }

  return data;
}
