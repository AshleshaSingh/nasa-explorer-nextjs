"use client";

import React from "react";
import { useState } from "react";
import type { NasaImageItem, NasaImageSearchResult } from "@/types/nasa";
import { ImageSearchSection } from "@/components/ImageSearchSection";

/**
 * /images page
 *
 * This page component owns:
 *  - search query state
 *  - result items
 *  - pagination state (page, hasMore, isLoadingMore)
 *  - API calls to our backend route (/api/images)
 *
 * It delegates all UI rendering to <ImageSearchSection />,
 * which receives state and handlers as props.
 */
export default function NasaImageSearchPage() {
  // search term entered by the user
  const [query, setQuery] = useState("");
  const [queryError, setQueryError] = useState<string | null>(null);

  // List of items returned from the API.
  const [items, setItems] = useState<NasaImageItem[]>([]);

  // Optional total hits value returned by NASA (may be null).
  const [totalHits, setTotalHits] = useState<number | null>(null);

  // Page number for pagination.
  const [page, setPage] = useState(1);

  // Top-level UI flags.
  const [loading, setLoading] = useState(false); // initial search
  const [isLoadingMore, setIsLoadingMore] = useState(false); // pagination
  const [hasMore, setHasMore] = useState(true); // whether to show "Load more"
  const [error, setError] = useState<string | null>(null);

  // track if the user has actually triggered a search
  const [hasSearched, setHasSearched] = useState(false);

  /**
   * Handle text changes in the search box.
   * - Keep query state in sync
   * - Clear validation error when user types
   * - If they clear the field completely, reset to "pre-search" state
   */
  const handleQueryChange = (value: string) => {
    setQuery(value);

    const trimmed = value.trim();

    if (trimmed.length === 0) {
      // Empty input → back to initial state (no search yet)
      setQueryError("Please enter a search term.");
      setHasSearched(false);
      setItems([]);
      setTotalHits(null);
      setError(null);
    } else {
      setQueryError(null);
    }
  };

  /**
   * Core search function.
   *
   * mode = "reset"  → start a fresh search from page 1 (replaces items)
   * mode = "append" → load the next page and append to the list
   */
  const runSearch = async (mode: "reset" | "append" = "reset") => {
    const trimmedQuery = query.trim();

    // Basic client-side validation: require a non-empty query.
    if (!trimmedQuery) {
      setError("Please enter a search term.");
      return;
    }

    // Clear any previous error before a new request.
    setError(null);

    // Decide which page we are requesting.
    const targetPage = mode === "reset" ? 1 : page + 1;

    if (mode === "reset") {
      // First page of a new search.
      setHasSearched(true);
      setLoading(true);
      setItems([]);
      setHasMore(true);
      setPage(1);
      setTotalHits(null);
    } else {
      // "Load more" pagination.
      setIsLoadingMore(true);
    }

    try {
      const params = new URLSearchParams({
        query: trimmedQuery,
        page: String(targetPage),
      });

      const res = await fetch(`/api/images?${params.toString()}`);

      const data = (await res.json()) as
        | NasaImageSearchResult
        | { message?: string };

      if (!res.ok) {
        const msg =
          (data as any).message ??
          "Something went wrong while fetching NASA images.";
        setError(msg);

        if (mode === "reset") {
          setItems([]);
          setHasMore(false);
          setTotalHits(null);
        }

        return;
      }

      const result = data as NasaImageSearchResult;
      const newItems = result.collection.items ?? [];
      const hits = result.collection.metadata?.total_hits;

      // Append or replace items based on the mode.
      setItems((prev) =>
        mode === "append" ? [...prev, ...newItems] : newItems,
      );

      // Store total hits if NASA returned a valid number.
      const numericHits =
        typeof hits === "number" && !Number.isNaN(hits) ? hits : null;
      setTotalHits(numericHits);

      // Update the current page on successful request.
      setPage(targetPage);

      // Decide whether more results are available.
      setHasMore(() => {
        if (numericHits != null) {
          const previousCount = mode === "append" ? items.length : 0;
          const totalLoaded = previousCount + newItems.length;
          return totalLoaded < numericHits;
        }

        // Fallback: if this page returned no items, assume there are no more.
        return newItems.length > 0;
      });
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");

      if (mode === "reset") {
        setItems([]);
        setHasMore(false);
        setTotalHits(null);
      }
    } finally {
      if (mode === "reset") {
        setLoading(false);
      } else {
        setIsLoadingMore(false);
      }
    }
  };

  /**
   * Handles form submission from ImageSearchSection.
   * Always starts a fresh search from page 1.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = query.trim();

    // block submit if query is invalid
    if (!trimmed) {
      setQueryError("Please enter a search term.");
      setError("Please enter a search term.");
      return;
    }

    setQueryError(null);

    // When the user submits the form, always start a fresh search from page 1.
    void runSearch("reset");
  };

  /**
   * Handles "Load more" button click from ImageSearchSection.
   */
  const handleLoadMore = () => {
    void runSearch("append");
  };

  return (
    <ImageSearchSection
      query={query}
      onQueryChange={handleQueryChange}
      items={items}
      totalHits={totalHits}
      loading={loading}
      isLoadingMore={isLoadingMore}
      hasMore={hasMore}
      error={error ?? queryError}     
      hasSearched={hasSearched}      
      onSubmit={handleSubmit}
      onLoadMore={handleLoadMore}
      onRetrySearch={() => runSearch("reset")}
    />
  );
}
