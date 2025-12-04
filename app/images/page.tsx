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

  /**
   * Calls our backend route /api/images for page 1.
   * This is the main search function (no pagination yet).
   */
  const runSearch = async () => {
    // Frontend guard: require a non-empty query
    if (!query.trim()) {
      setError("Please enter a search term.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const params = new URLSearchParams({
        query: query.trim(),
        page: "1", // only first page for this task
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
        setItems([]);
        setTotalHits(null);
        return;
      }

      const result = data as NasaImageSearchResult;
      const newItems = result.collection.items ?? [];

      // Save results and optional total hits
      setItems(newItems);
      const hits = result.collection.metadata?.total_hits;
      setTotalHits(typeof hits === "number" ? hits : null);
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
      setItems([]);
      setTotalHits(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles the search form submit event.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void runSearch();
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
        </section>
      )}
    </main>
  );
}
