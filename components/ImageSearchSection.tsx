"use client";

import type { NasaImageItem } from "@/types/nasa";

import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Button,
  Image,
} from "@nextui-org/react";

import { ImageSearchSkeleton } from "./ImageSearchSkeleton";
import { ImageSearchEmptyCard } from "./ImageSearchEmptyCard";
import { ImageSearchErrorCard } from "./ImageSearchErrorCard";

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

  /** True only after a search has been submitted at least once. */
  hasSearched: boolean;

  // Called when the search form is submitted (e.g., user presses "Search").
  onSubmit: (event: React.FormEvent) => void;

  // Called when the user clicks the "Load more" button.
  onLoadMore: () => void;

  // Retry behavior logic
  onRetrySearch: () => void;

  isQueryValid?: boolean;
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
  hasSearched,
  onSubmit,
  onLoadMore,
  onRetrySearch,
  isQueryValid = true,
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

      {/* Search Form card */}
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
            className="flex flex-col md:flex-row gap-3 items-stretch md:items-end"
            onSubmit={onSubmit}
          >
            <Input
              isRequired
              className="md:max-w-md"
              classNames={{
                label: "mb-6", // keeps label from overlapping the text
              }}
              label="Search term"
              placeholder="e.g. galaxy, nebula, moon"
              type="text"
              value={query}
              variant="flat"
              onValueChange={onQueryChange}
            />

            <Button
              className="md:w-auto w-full"
              color="primary"
              isDisabled={loading || !query.trim()}
              type="submit"
            >
              {loading ? "Searching…" : "Search"}
            </Button>
          </form>

          {/* Error message (validation or API) */}
          {error && (
            <div className="mt-4">
              <ImageSearchErrorCard message={error} onRetry={onRetrySearch} />
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

      {/* Loading skeleton for initial search */}
      {loading && !hasResults && !error && <ImageSearchSkeleton />}

      {/* Empty results AFTER a search has been performed */}
      {!loading &&
        !error &&
        !hasResults &&
        hasSearched &&
        query.trim() !== "" && <ImageSearchEmptyCard query={query} />}

      {/* Hint BEFORE any search is performed */}
      {!loading && !error && !hasResults && !hasSearched && (
        <Card>
          <CardBody className="text-sm text-default-500">
            Start by entering a search term above and clicking{" "}
            <span className="font-semibold">Search</span> to see NASA images.
          </CardBody>
        </Card>
      )}

      {/* Results grid + pagination */}
      {hasResults && (
        <section className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {items.map((item) => {
              const data = item.data?.[0];
              const thumbUrl = getThumbnailUrl(item);
              const title = data?.title ?? "Untitled image";
              const date = data?.date_created
                ? new Date(data.date_created).toLocaleDateString()
                : "Unknown date";

              return (
                <Card
                  key={data?.nasa_id ?? Math.random()}
                  className="rounded-xl overflow-hidden bg-white dark:bg-default-100 shadow-sm hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                >
                  {thumbUrl && (
                    <Image
                      alt={title}
                      className="w-full h-56 object-cover"
                      src={thumbUrl}
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
                color="primary"
                isDisabled={isLoadingMore}
                variant="bordered"
                onPress={onLoadMore}
              >
                {isLoadingMore ? "Loading…" : "Load more"}
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
