// vitest.config.ts
//
// Simple Vitest config for server-side tests.

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
  },
});
