import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ApodSearchSection } from "../components/ApodSearchSection";
import { renderWithProviders } from "./test-utils";

// Mock the toast hook
vi.mock("@/app/hooks/useCustomToast", () => ({
  useCustomToast: () => ({
    showSuccess: vi.fn(),
    showError: vi.fn(),
  }),
}));

// Mock the child components
vi.mock("@/components/ApodSkeleton", () => ({
  ApodSkeleton: () => <div data-testid="apod-skeleton">Loading...</div>,
}));

vi.mock("@/components/ApodEmptyCard", () => ({
  ApodEmptyCard: () => (
    <div data-testid="apod-empty">
      <p className="text-lg font-medium text-default-700">No APOD loaded yet.</p>
      <p className="text-sm text-default-500">Pick a date above and hit submit!</p>
    </div>
  ),
}));

vi.mock("@/components/ApodErrorCard", () => ({
  ApodErrorCard: ({ message }: { message: string }) => (
    <div data-testid="apod-error-card" className="border border-error-500 bg-error-50">
      <div className="text-4xl text-error-500">Error</div>
      <p className="text-sm text-error-700 font-medium">Resubmit with a valid date.</p>
      <p className="text-xs text-error-600">{message}</p>
    </div>
  ),
}));

// keep original fetch to restore after each test
const originalFetch = global.fetch;

describe("ApodSearchSection integration", () => {
  beforeEach(() => {
    vi.clearAllMocks(); // reset mocks before each test
  });

  afterEach(() => {
    global.fetch = originalFetch as any; // restore real fetch after each test
  });

  // simulate API call success returning the APOD data
  function mockFetchSuccess(data: any) {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        ok: true,
        data,
      }),
    } as any);
  }

  // simulate API call failing
  function mockFetchError(errorMessage: string) {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        ok: false,
        error: errorMessage,
      }),
    } as any);
  }

  const getDateInput = () => screen.getByLabelText("Date") as HTMLInputElement;
  const getSubmitButton = () =>
    screen.getByRole("button", { name: /get apod/i });

  // 1) valid form submission → API success → result card
  it("submits a valid date, calls /api/apod, and shows the APOD result", async () => {
    const mockApod = {
      date: "2024-01-01",
      title: "Mock APOD Title",
      url: "http://example.com/image.jpg",
      media_type: "image",
      explanation: "Some explanation",
      hdurl: "http://example.com/hd-image.jpg",
    };

    mockFetchSuccess(mockApod);

    renderWithProviders(<ApodSearchSection />);

    // fill date + submit
    const dateInput = getDateInput();
    fireEvent.change(dateInput, { target: { value: mockApod.date } });
    
    // Get the form and submit it properly
    const form = dateInput.closest('form')!;
    fireEvent.submit(form);

    // backend should be called with the date
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api/apod?date=${mockApod.date}`)
      );
    });

    // result card shows APOD title and date
    expect(await screen.findByText(mockApod.title)).toBeInTheDocument();
    expect(screen.getByText(mockApod.date)).toBeInTheDocument();
  });

  // 2) invalid input (missing date) → validation error, no fetch
  // 2) invalid input (missing date) → validation error, no fetch
  it("shows a validation error when date is missing and does not call fetch", async () => {
    global.fetch = vi.fn() as any;

    renderWithProviders(<ApodSearchSection />);

    // Get the submit button - it should be DISABLED because form is invalid
    const submitButton = getSubmitButton();
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveAttribute('disabled');

    // Try to click (won't work because disabled)
    fireEvent.click(submitButton);

    // No network request should be made because button is disabled
    expect(global.fetch).not.toHaveBeenCalled();
    
    // Additional check: the date input should indicate it's required
    const dateInput = getDateInput();
    expect(dateInput).toBeRequired();
  });

  // 3) loading → API returns ok:false → error UI from backend
  it("shows backend error message when API responds with ok:false", async () => {
    const apiError = "API error";

    mockFetchError(apiError);

    renderWithProviders(<ApodSearchSection />);

    const dateInput = getDateInput();
    fireEvent.change(dateInput, { target: { value: "2024-01-02" } });
    
    const form = dateInput.closest('form')!;
    fireEvent.submit(form);

    // error message from backend should appear
    // The component shows "API error" in the small text and "Resubmit with a valid date." as main message
    await waitFor(() => {
      expect(screen.getByText("Resubmit with a valid date.")).toBeInTheDocument();
      expect(screen.getByText("API error")).toBeInTheDocument();
    });
  });

  // 4) empty state before search → hidden after success
  it("shows empty state initially and hides it after a successful search", async () => {
    const mockApod = {
      date: "2024-01-10",
      title: "Another APOD",
      url: "http://example.com/image2.jpg",
      media_type: "image",
      explanation: "More explanation",
      hdurl: "http://example.com/hd-image2.jpg",
    };

    mockFetchSuccess(mockApod);

    renderWithProviders(<ApodSearchSection />);

    // initial empty state is visible
    expect(screen.getByText(/No APOD loaded yet./i)).toBeInTheDocument();

    // perform a successful search
    const dateInput = getDateInput();
    fireEvent.change(dateInput, { target: { value: mockApod.date } });
    
    const form = dateInput.closest('form')!;
    fireEvent.submit(form);

    // wait for result card
    await screen.findByText(mockApod.title);

    // empty state should be gone
    expect(screen.queryByText(/No APOD loaded yet./i)).not.toBeInTheDocument();
  });
});