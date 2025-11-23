// lib/nasa.ts
import "server-only";
import type { ApodResponse } from "@/types/nasa";

const NASA_API_BASE = process.env.NASA_API_BASE ?? "https://api.nasa.gov";

/**
 * Fetch APOD (Astronomy Picture of the Day)
 * Always runs on the server (server-only)
 */
export async function fetchApod(date?: string): Promise<ApodResponse> {
  const apiKey = process.env.NASA_API_KEY;

  if (!apiKey) {
    throw new Error("NASA_API_KEY is not set in environment variables");
  }

  // Build URL
  const url = new URL(`${NASA_API_BASE}/planetary/apod`);
  url.searchParams.set("api_key", apiKey);

  if (date) {
    url.searchParams.set("date", date);
  }

  // Call NASA API
  const res = await fetch(url.toString());

  if (!res.ok) {
    throw new Error(`Failed to fetch APOD: ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as ApodResponse;

  // Basic field validation
  if (!json.date || !json.title || !json.url || !json.media_type) {
    throw new Error("APOD response is missing required fields");
  }

  return json;
}
