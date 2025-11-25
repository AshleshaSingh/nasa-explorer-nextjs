// tests/setup.ts
// Mock Next.js "server-only" module so Vitest doesn't throw.

import { vi } from "vitest";

vi.mock("server-only", () => ({}));
