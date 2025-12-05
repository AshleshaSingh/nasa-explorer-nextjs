// app/images/page.tsx
"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Button,
  Spinner,
  Image,
} from "@nextui-org/react";
import type { NasaImageItem, NasaImageSearchResult } from "@/types/nasa";
import { ErrorCard } from "@/components/error";

/**
 * Extracts a thumbnail URL from a NASA image item.
 * NASA usually returns thumbnails in the "links" array.
 */
function getThumbnailUrl(item: NasaImageItem): string | undefined {
  const firstLink = item.links?.[0];
  return firstLink?.href;
}

/**
 * /images page
 *
 * This component renders:
 *  - a search form
 *  - a grid of results from the NASA Image and Video Library
 *  - loading / error / empty states
 *
 * Pagination ("Load more") will be implemented in a separate task.
 */
export default function NasaImageSearchPage() {
  // Search term entered by the user
  const [query, setQuery] = useState("");

  // List of image items returned from the API
  const [items, setItems] = useState<NasaImageItem[]>([]);

  // Optional total results count from NASA
  const [totalHits, setTotalHits] = useState<number | null>(null);

  // UI state flags
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Tracks which page of results we are currently on.
  const [page, setPage] = useState(1);

  // Indicates when the "Load more" button is fetching more results.
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Controls whether we should show the "Load more" button.
  const [hasMore, setHasMore] = useState(true);

  /**
   * Calls our backend route /api/images.
   *
   * Supports two modes:
   *  - "reset": start a new search from page 1 (replaces items).
   *  - "append": load the next page and append to existing items.
   */
  const runSearch = async (mode: "reset" | "append" = "reset") => {
    const trimmedQuery = query.trim();

    // Frontend guard: require a non-empty query for both modes.
    if (!trimmedQuery) {
      setError("Please enter a search term.");
      return;
    }

    // Clear any previous error before a new request.
    setError(null);

    // Determine which page we are going to request.
    const targetPage = mode === "reset" ? 1 : page + 1;

    // When starting a fresh search, show the main loading state.
    // When appending, show a separate "loading more" state.
    if (mode === "reset") {
      setLoading(true);
      setItems([]);        // clear previous results so we don't flash stale data
      setHasMore(true);    // assume there may be more until we know otherwise
      setPage(1);
    } else {
      setIsLoadingMore(true);
    }

    try {
      // Build query string for API route.
      const params = new URLSearchParams({
        query: trimmedQuery,
        page: String(targetPage),
      });

      const res = await fetch(`/api/images?${params.toString()}`);

      const data = (await res.json()) as
        | NasaImageSearchResult
        | { message?: string };

      // Handle HTTP error responses with a friendly message for the user.
      if (!res.ok) {
        const msg =
          (data as any).message ??
          "Something went wrong while fetching NASA images.";
        setError(msg);

        // In case of failure, do not keep partial results for a new search.
        if (mode === "reset") {
          setItems([]);
          setTotalHits(null);
          setHasMore(false);
        }

        return;
      }

      // Successful response: extract items and metadata.
      const result = data as NasaImageSearchResult;
      const newItems = result.collection.items ?? [];
      const hits = result.collection.metadata?.total_hits;

      // Append or replace items depending on mode.
      setItems((prev) =>
        mode === "append" ? [...prev, ...newItems] : newItems,
      );

      // Keep track of total hits if provided.
      const numericHits =
        typeof hits === "number" && !Number.isNaN(hits) ? hits : null;
      setTotalHits(numericHits);

      // Update current page because the request completed successfully.
      setPage(targetPage);

      // Determine whether there are more items to load:
      //  - if we know total_hits, compare against items length
      //  - otherwise, assume "no more" when NASA returns an empty page
      setHasMore(() => {
        if (numericHits != null) {
          const totalLoaded =
            (mode === "append" ? items.length : 0) + newItems.length;
          return totalLoaded < numericHits;
        }
        // Fallback: if the current page returns zero items, stop paginating.
        return newItems.length > 0;
      });
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");

      if (mode === "reset") {
        setItems([]);
        setTotalHits(null);
        setHasMore(false);
      }
    } finally {
      // Turn off the appropriate loading state.
      if (mode === "reset") {
        setLoading(false);
      } else {
        setIsLoadingMore(false);
      }
    }
  };

  /**
   * Handles the search form submit event.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // When the user submits the form, always start a fresh search from page 1.
    void runSearch("reset");
  };

  /**
   * Triggered when the user clicks "Load more".
   * Requests the next page and appends the results to the grid.
   */
  const handleLoadMore = () => {
    void runSearch("append");
  };

  const hasResults = items.length > 0;

  return (
    <main className="flex flex-col gap-6 max-w-6xl mx-auto px-4 py-8">
      {/* Page heading */}
      <section>
        <h1 className="text-2xl font-semibold mb-2">
          NASA Image Search
        </h1>
        <p className="text-sm text-default-500">
          Search the NASA Image and Video Library for astronomy-related
          images. Try keywords like &quot;galaxy&quot;, &quot;nebula&quot;,
          or &quot;moon&quot;.
        </p>
      </section>

      {/* Search form card */}
      <Card> 
        <CardHeader className="flex flex-col items-start gap-2">
          <h2 className="text-lg font-semibold">Search images</h2>
          <p className="text-sm text-default-500">
            Enter a keyword and press search to load a gallery of NASA
            images.
          </p>
        </CardHeader>

        <CardBody>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col md:flex-row gap-3 items-stretch md:items-end"
          >
            <Input
              type="text"
              label="Search term"
            //   labelPlacement="outside" // Ensure the label is outside/above the input
              placeholder="e.g. galaxy, nebula, moon"
              value={query}
              onValueChange={setQuery}
              isRequired
              variant="flat"
              className="md:max-w-md"
            //   classNames={{
            //     label: "mb-6"  // Adds margin to the bottom of the label wrapper
            //   }}
              classNames={{
                label: "mb-4 text-sm font-medium"
              }}
            />

            <Button
              type="submit"
              color="primary"
              className="md:w-auto w-full"
              isDisabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Spinner size="sm" />
                  <span>Searching...</span>
                </div>
              ) : (
                "Search"
              )}
            </Button>
          </form>

          {/* Error message using shared ErrorCard */}
          {error && (
            <div className="mt-4">
              <ErrorCard
                title="Image search error"
                message={error}
                onRetry={() => runSearch()}
              />
            </div>
          )}
        </CardBody>

        {/* Footer shows total hits if available */}
        {typeof totalHits === "number" && (
          <CardFooter className="text-xs text-default-400">
            Total results found: {totalHits}
          </CardFooter>
        )}
      </Card>

      {/* Loading state when awaiting results */}
      {loading && !hasResults && !error && (
        <Card>
          <CardBody className="flex items-center justify-center py-10">
            <Spinner size="lg" />
          </CardBody>
        </Card>
      )}

      {/* Empty state (only after user has tried searching) */}
      {!loading && !error && !hasResults && query.trim() !== "" && (
        <Card>
          <CardBody className="text-sm text-default-500">
            No results found for <span className="font-semibold">
              {query.trim()}
            </span>
            . Try a different keyword.
          </CardBody>
        </Card>
      )}

      {/* Initial hint (before any search) */}
      {!loading && !error && !hasResults && query.trim() === "" && (
        <Card>
          <CardBody className="text-sm text-default-500">
            Start by entering a search term above and clicking{" "}
            <span className="font-semibold">Search</span> to see NASA
            images.
          </CardBody>
        </Card>
      )}

      {/* Results grid */}
      {hasResults && (
        <section className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {items.map((item) => {
              const data = item.data?.[0];
              const thumbUrl = getThumbnailUrl(item);
              const title = data?.title ?? "Untitled image";
              const date =
                data?.date_created
                  ? new Date(data.date_created).toLocaleDateString()
                  : "Unknown date";

              return (
                <Card
                  key={data?.nasa_id ?? Math.random()}
                  className="h-full flex flex-col"
                >
                  {/* Image thumbnail */}
                  {thumbUrl && (
                    <Image
                      src={thumbUrl}
                      alt={title}
                      className="w-full h-56 object-cover"
                    />
                  )}

                  <CardBody className="flex flex-col gap-2">
                    <h3 className="text-sm font-semibold line-clamp-2">
                      {title}
                    </h3>
                    <p className="text-xs text-default-500">{date}</p>
                    {data?.description && (
                      <p className="text-xs text-default-600 line-clamp-3">
                        {data.description}
                      </p>
                    )}
                  </CardBody>
                </Card>
              );
            })}
          </div>

          {/* Pagination controls */}
          {hasMore && (
            <div className="flex justify-center mt-4">
              <Button
                variant="bordered"
                color="primary"
                onPress={handleLoadMore}
                isDisabled={isLoadingMore}
              >
                {isLoadingMore ? (
                  <div className="flex items-center gap-2">
                    <Spinner size="sm" />
                    <span>Loading more…</span>
                  </div>
                ) : (
                  "Load more"
                )}
              </Button>
            </div>
          )}

          {/* Optional message when there is nothing more to load */}
          {!hasMore && (
            <p className="text-xs text-default-500 text-center mt-2">
              You&apos;ve reached the end of the results.
            </p>
          )}
        </section>
      )}
    </main>
  );
}
