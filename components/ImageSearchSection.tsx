"use client";

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
import { ErrorCard } from "@/components/error";
import type { NasaImageItem, NasaImageSearchResult } from "@/types/nasa";

/**
 * Props for the ImageSearchSection component.
 * The parent (/images/page.tsx) owns the state and API logic,
 * and passes everything down as props so this component stays
 * focused on UI rendering and user interactions.
 */
export interface ImageSearchSectionProps {
  // Controlled search value (text in the input).
  query: string;
  // Handler called whenever the user types in the search box.
  onQueryChange: (value: string) => void;

  // List of items returned from the NASA Image & Video Library.
  items: NasaImageItem[];

  // Optional total hits value from NASA metadata (can be null if unknown).
  totalHits: number | null;

  // True while the initial search request is in progress.
  loading: boolean;

  // True while a "Load more" pagination request is running.
  isLoadingMore: boolean;

  // Whether there are more pages available for pagination.
  hasMore: boolean;

  // Optional error message to show to the user.
  error: string | null;

  // Called when the search form is submitted (e.g., user presses "Search").
  onSubmit: (event: React.FormEvent) => void;

  // Called when the user clicks the "Load more" button.
  onLoadMore: () => void;
}

/**
 * Small helper to extract a thumbnail URL from a NASA image item.
 * NASA usually returns thumbnails in the "links" array.
 */
function getThumbnailUrl(item: NasaImageItem): string | undefined {
  const firstLink = item.links?.[0];
  return firstLink?.href;
}

/**
 * ImageSearchSection
 *
 * Presentational component for:
 *  - search form
 *  - loading/error/empty states
 *  - image result grid
 *  - pagination "Load more" button
 *
 * All data and state come from props, which keeps this component easy
 * to test and reuse, and puts API logic in the page (server/client boundary).
 */
export function ImageSearchSection({
  query,
  onQueryChange,
  items,
  totalHits,
  loading,
  isLoadingMore,
  hasMore,
  error,
  onSubmit,
  onLoadMore,
}: ImageSearchSectionProps) {
  const hasResults = items.length > 0;

  return (
    <main className="flex flex-col gap-6 max-w-6xl mx-auto px-4 py-8">
      {/* Page heading / description */}
      <section>
        <h1 className="text-2xl font-semibold mb-2">NASA Image Search</h1>
        <p className="text-sm text-default-500">
          Search the NASA Image and Video Library for astronomy-related images.
          Try keywords like &quot;galaxy&quot;, &quot;nebula&quot; or
          &quot;moon&quot;.
        </p>
      </section>

      {/* Search form card */}
      <Card>
        <CardHeader className="flex flex-col items-start gap-2">
          <h2 className="text-lg font-semibold">Search images</h2>
          <p className="text-sm text-default-500">
            Enter a keyword and press search to load a gallery of NASA images.
          </p>
        </CardHeader>

        <CardBody>
          {/* The search form uses parent-provided onSubmit and query handlers. */}
          <form
            onSubmit={onSubmit}
            className="flex flex-col md:flex-row gap-3 items-stretch md:items-end"
          >
            <Input
              type="text"
              label="Search term"
              placeholder="e.g. galaxy, nebula, moon"
              value={query}
              onValueChange={onQueryChange}
              isRequired
              variant="flat"
              className="md:max-w-md"
              classNames={{
                // Extra spacing so the label does not overlap the text.
                label: "mb-6",
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
                onRetry={onLoadMore /* or re-run last search; can adjust */}
              />
            </div>
          )}
        </CardBody>

        {/* Show total hits if available from NASA */}
        {typeof totalHits === "number" && (
          <CardFooter className="text-xs text-default-400">
            Total results found: {totalHits}
          </CardFooter>
        )}
      </Card>

      {/* Loading state for initial search (no results yet). */}
      {loading && !hasResults && !error && (
        <Card>
          <CardBody className="flex items-center justify-center py-10">
            <Spinner size="lg" />
          </CardBody>
        </Card>
      )}

      {/* Empty state after the user has searched but got no results. */}
      {!loading && !error && !hasResults && query.trim() !== "" && (
        <Card>
          <CardBody className="text-sm text-default-500">
            No results found for{" "}
            <span className="font-semibold">{query.trim()}</span>. Try a
            different keyword.
          </CardBody>
        </Card>
      )}

      {/* Hint before any search is performed. */}
      {!loading && !error && !hasResults && query.trim() === "" && (
        <Card>
          <CardBody className="text-sm text-default-500">
            Start by entering a search term above and clicking{" "}
            <span className="font-semibold">Search</span> to see NASA images.
          </CardBody>
        </Card>
      )}

      {/* Results grid with optional pagination controls. */}
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
                  {/* Thumbnail image (if NASA provided one). */}
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

          {/* Pagination controls: "Load more" button and end-of-results label. */}
          {hasMore && (
            <div className="flex justify-center mt-4">
              <Button
                variant="bordered"
                color="primary"
                onPress={onLoadMore}
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