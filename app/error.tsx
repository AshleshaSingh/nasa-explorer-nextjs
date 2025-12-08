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
    console.error("App error boundary:", error);
  }, [error]);

  return (
    // global error pages must include html/body tags when using app/error.tsx
    <html>
      <body className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-lg w-full">
          {/* using the reusable error UI component */}
          <ErrorCard
            title="Unexpected application error"
            message={error.message || "An unexpected error occurred."}
            onRetry={reset} // triggers retry logic built into Next.js
          />
        </div>
      </body>
    </html>
  );
}
