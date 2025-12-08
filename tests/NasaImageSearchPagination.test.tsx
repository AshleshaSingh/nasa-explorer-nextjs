/**
 * @file NasaImageSearchPagination.test.tsx
 * Tests pagination behavior for NASA Image Search UI
 */

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { renderWithProviders } from "./test-utils";

import NasaImageSearchPage from "@/app/images/page";

/**
 * Tests pagination behavior for NASA Image Search UI (/images)
 * - First search loads initial page
 * - Clicking "Load More" loads the next page
 * - New results are appended, not replacing the old ones
 * - Error UI appears if pagination request fails
 */

const mockPage1 = {
    collection: {
      items: [
        {
          data: [{ nasa_id: "img1", title: "Galaxy 1", date_created: "2021-01-01" }],
          links: [{ href: "http://example.com/thumb1.jpg" }],
        },
      ],
      metadata: { total_hits: 50 },
    },
  };
  
  const mockPage2 = {
    collection: {
      items: [
        {
          data: [{ nasa_id: "img2", title: "Galaxy 2", date_created: "2022-02-02" }],
          links: [{ href: "http://example.com/thumb2.jpg" }],
        },
      ],
      metadata: { total_hits: 50 },
    },
  };
  
  describe("NASA Image Search Pagination", () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });
  
    it("loads first page and appends second page when Load More is clicked", async () => {
      // First call → page 1, second call → page 2
      global.fetch = vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockPage1,
        } as any)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockPage2,
        } as any);
  
      renderWithProviders(<NasaImageSearchPage />);
  
      // Type query and submit
      const input = screen.getByPlaceholderText(/e\.g\. galaxy/i);
      fireEvent.change(input, { target: { value: "galaxy" } });
  
      const searchButton = screen.getByRole("button", { name: /search/i });
      fireEvent.click(searchButton);
  
      // Page 1 item should appear
      expect(await screen.findByText("Galaxy 1")).toBeInTheDocument();
  
      // Click Load More (match the exact text you used in the component)
      const loadMoreButton = await screen.findByRole("button", {
        name: /load more/i, // change this if your button text is different
      });
      fireEvent.click(loadMoreButton);
  
      // Both items should now be in the document (append, not replace)
      await waitFor(() => {
        expect(screen.getByText("Galaxy 1")).toBeInTheDocument();
        expect(screen.getByText("Galaxy 2")).toBeInTheDocument();
      });
    });
  
    it("shows error UI if second page fetch fails", async () => {
      global.fetch = vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockPage1,
        } as any)
        .mockResolvedValueOnce({
          ok: false,
          json: async () => ({ message: "Failed to load more" }),
        } as any);
  
      renderWithProviders(<NasaImageSearchPage />);
  
      const input = screen.getByPlaceholderText(/e\.g\. galaxy/i);
      fireEvent.change(input, { target: { value: "galaxy" } });
  
      fireEvent.click(screen.getByRole("button", { name: /search/i }));
      expect(await screen.findByText("Galaxy 1")).toBeInTheDocument();
  
      const loadMoreButton = await screen.findByRole("button", {
        name: /load more/i, // again, match your real label
      });
      fireEvent.click(loadMoreButton);
  
      // Match whatever error text you show in the component
      // FIX: Handle multiple elements with same text
      const errorElements = await screen.findAllByText(/failed to load more/i);
      expect(errorElements.length).toBeGreaterThan(0);
      });
  });  