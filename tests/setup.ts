// tests/setup.ts
import { vi } from "vitest";
import "@testing-library/jest-dom/vitest";

// Mock Next.js "server-only" module so Vitest doesn't throw.
vi.mock("server-only", () => ({}));
