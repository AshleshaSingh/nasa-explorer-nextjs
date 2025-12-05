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

  // derived validity flag (non-empty after trimming)
  const isQueryValid = query.trim().length > 0;

  // handle input changes and clear/set errors live
  const handleQueryChange = (value: string) => {
    setQuery(value);

    if (value.trim().length === 0) {
      setQueryError("Please enter a search term.");
    } else {
      setQueryError(null);
    }
  };

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
    setQueryError(null);
    setError(null);

    // Decide which page we are requesting.
    const targetPage = mode === "reset" ? 1 : page + 1;

    // For a fresh search, clear old results and show main loading spinner.
    if (mode === "reset") {
      setHasSearched(true);
      setLoading(true);
      setItems([]);
      setHasMore(true);
      setPage(1);
      setTotalHits(null);
    } else {
      // For pagination, show a separate "loading more" state.
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
              placeholder="e.g. galaxy, nebula, moon"
              value={query}
              onValueChange={handleQueryChange}
              isRequired
              isInvalid={!!queryError}
              errorMessage={queryError ?? undefined}
              variant="flat"
              className="md:max-w-md"
              classNames={{
                label: "mb-4 text-sm font-medium",
              }}
            />

            <Button
              type="submit"
              color="primary"
              className="md:w-auto w-full"
              isDisabled={!isQueryValid || loading}
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
      {!loading && !error && !hasResults && hasSearched && (
        <Card>
          <CardBody className="text-sm text-default-500">
            No results found for{" "}
            <span className="font-semibold">{query.trim()}</span>. Try a
            different keyword.
          </CardBody>
        </Card>
      )}

      {/* Initial hint (before any search has been run) */}
      {!loading && !error && !hasResults && !hasSearched && (
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