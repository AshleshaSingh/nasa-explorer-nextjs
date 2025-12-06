"use client";

import { Card, CardBody } from "@nextui-org/react";

export function ImageSearchEmptyCard({ query }: { query?: string }) {
  return (
    <Card className="border border-default-200 shadow-sm rounded-xl">
      <CardBody className="flex flex-col items-center text-center gap-4 py-10">
        <h3 className="text-lg font-semibold text-default-700">
          {query ? (
            <>
              No results found for{" "}
              <span className="font-bold">{query}</span>.
            </>
          ) : (
            "Start by entering a search term!"
          )}
        </h3>

        <p className="text-sm text-default-500 max-w-xs">
          Try searching for terms like “galaxy”, “nebula”, or “moon”.
        </p>
      </CardBody>
    </Card>
  );
}