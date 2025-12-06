"use client";

import { Card, CardBody } from "@nextui-org/react";

export function ImageSearchSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card
          key={i}
          className="overflow-hidden rounded-xl border border-default-100 shadow-sm animate-pulse"
        >
          {/* thumbnail */}
          <div className="h-56 w-full bg-default-300" />

          <CardBody className="flex flex-col gap-3 p-4">
            {/* title */}
            <div className="h-4 w-4/5 bg-default-200 rounded-md" />

            {/* date */}
            <div className="h-3 w-1/3 bg-default-200 rounded-md" />

            {/* short description line */}
            <div className="h-3 w-full bg-default-200 rounded-md" />
            <div className="h-3 w-2/3 bg-default-200 rounded-md" />
          </CardBody>
        </Card>
      ))}
    </div>
  );
}