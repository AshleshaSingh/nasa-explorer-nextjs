import { describe, it, expect, vi } from "vitest";

// mock fetchApod

vi.mock("../../lib/nasa", () => ({
  fetchApod: vi.fn(async ({ date, count }) => {
    if (count) {
      // Return mock array if count is provided
      return [
        { date: "2024-01-01", title: "Mock APOD 1", url: "http://example.com/1.jpg", media_type: "image" },
        { date: "2024-01-02", title: "Mock APOD 2", url: "http://example.com/2.jpg", media_type: "image" },
      ];
    }
    // Return single mock object if date is provided
    return { date: "2024-01-01", title: "Mock APOD", url: "http://example.com/image.jpg", media_type: "image" };
  }),
}));

// import route after mocking
import { GET } from "../app/api/apod/route";

// Tests

// Test 1 - no data or count provided
describe("Integration Test: /api/apod", () => {
  it("returns 400 if no date or count is provided", async () => {
    const req = new Request("http://localhost/api/apod");
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.ok).toBe(false);
  });

// Test 2 - invalid count provided
  it("returns 400 for invalid count", async () => {
    const req = new Request("http://localhost/api/apod?count=abc");
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.ok).toBe(false);
    expect(json.error).toContain("Invalid 'count'");
  });

  // Test 3 - returns APOD given data
//   it("returns APOD data when date is provided", async () => {
//     const req = new Request("http://localhost/api/apod?date=2024-01-01");
//     const res = await GET(req);
//     const json = await res.json();

//     expect(res.status).toBe(200);
//     expect(json.ok).toBe(true);
//     expect(json.data.date).toBe("2024-01-01");
//     expect(json.data.title).toBe("Mock APOD");
//     expect(json.data.url).toBe("http://example.com/image.jpg");
//     expect(json.data.media_type).toBe("image");
//   });

  // Test 4 - returns APOD array given count
//   it("returns APOD array when count is provided", async () => {
//     const req = new Request("http://localhost/api/apod?count=2");
//     const res = await GET(req);
//     const json = await res.json();

//     expect(res.status).toBe(200);
//     expect(json.ok).toBe(true);
//     expect(Array.isArray(json.data)).toBe(true);
//     expect(json.data.length).toBe(2);
//   });
});
