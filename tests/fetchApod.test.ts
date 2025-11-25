/**
 * Unit Tests for fetchApod()
 *
 * These tests check the server-side helper that calls NASA's APOD API.
 * We mock fetch() so the tests do NOT make real HTTP requests.
 *
 * Covered cases:
 *  - successful single APOD
 *  - successful array APOD (?count)
 *  - missing API key
 *  - NASA API returning non-OK status
 *  - NASA API returning invalid JSON structure
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

import { fetchApod } from "../lib/nasa";
import type { ApodResponse } from "../types/nasa";

/**
 * A reusable mock APOD object for tests.
 */

const mockApod: ApodResponse = {
  date: "2024-01-01",
  title: "Mock APOD",
  explanation: "This is a mocked response for testing.",
  url: "https://example.com/test.jpg",
  media_type: "image",
};

beforeEach(() => {
  // Reset mocks so each test starts clean.
  vi.restoreAllMocks();

  // Set fake env vars for the NASA helper.
  process.env.NASA_API_BASE = "https://api.nasa.gov";
  process.env.NASA_API_KEY = "test-key";
});

/**
 * Small helper to mock fetch with custom data.
 */
function mockFetch(data: any, ok = true, status = 200, statusText = "OK") {
  vi.spyOn(global, "fetch").mockResolvedValueOnce({
    ok,
    status,
    statusText,
    json: async () => data,
  } as any);
}

describe("fetchApod()", () => {
  /**
   * Test 1: Successful single APOD response
   */
  it("returns APOD object when API request succeeds", async () => {
    mockFetch(mockApod);

    const result = await fetchApod({ date: "2024-01-01" });
    expect(result).toEqual(mockApod);
  });

  /**
   * Test 2: Successful array response from NASA (?count)
   */
  it("returns an array when NASA API returns multiple APOD results", async () => {
    const mockArray = [mockApod, mockApod];
    mockFetch(mockArray);

    const result = await fetchApod({ count: 2 });

    // First check that it's actually an array
    expect(Array.isArray(result)).toBe(true);

    // Now that we've checked, TypeScript still doesn't know,
    // so we narrow the type in JS:
    if (Array.isArray(result)) {
      expect(result.length).toBe(2);
    } else {
      // This should never happen, but it keeps the test safe.
      throw new Error("Expected an array from fetchApod({ count: 2 })");
    }
  });

  /**
   * Test 3: Missing API key
   */
  it("throws an error when NASA_API_KEY is missing", async () => {
    const originalKey = process.env.NASA_API_KEY;
    delete process.env.NASA_API_KEY;

    await expect(fetchApod({ date: "2024-01-01" })).rejects.toThrow(
      // Match the actual error message from lib/nasa.ts:
      "NASA_API_KEY is not set in environment variables."
    );

    // Restore key for safety
    process.env.NASA_API_KEY = originalKey;
  });

  /**
   * Test 4: NASA API returns non-OK
   */
  it("throws error when API responds with non-OK status", async () => {
    mockFetch({ error: "error" }, false, 500, "Internal Server Error");

    await expect(fetchApod({ date: "2024-01-01" })).rejects.toThrow(
      "APOD API error: 500 Internal Server Error"
    );
  });

  /**
   * Test 5: NASA sends incomplete JSON
   */
  it("throws error when response is missing required fields", async () => {
    const badResponse = { title: "Oops" }; // missing url, media_type, etc.
    mockFetch(badResponse);

    await expect(fetchApod({ date: "2024-01-01" })).rejects.toThrow(
      "APOD response is missing required fields."
    );
  });
});
