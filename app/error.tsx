"use client";

import { useEffect } from "react";

import { ErrorCard } from "@/components/error";

// global error boundary for the app.
// next.js should automatically show this file whenever a route crashes.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }; // the thrown error object
  reset: () => void; // callback that reloads the route
}) {
  // logging error to the console
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error("App error boundary:", error);
    }
  }, [error]);

  return (
    // global error pages must include html/body tags when using app/error.tsx
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-lg w-full">
          {/* using the reusable error UI component */}
          <ErrorCard
            message={error.message || "An unexpected error occurred."}
            title="Unexpected application error"
            onRetry={reset} // triggers retry logic built into Next.js
          />
        </div>
      </body>
    </html>
  );
}
