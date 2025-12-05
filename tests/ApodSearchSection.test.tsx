import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ApodSearchSection } from "../components/ApodSearchSection";

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
      json: vi.fn().mockResolvedValue({
        ok: true,
        data,
      }),
    } as any);
  }

// simulate API call failing
  function mockFetchError(errorMessage: string) {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
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
    };

    mockFetchSuccess(mockApod);

    render(<ApodSearchSection />);

    // fill date + submit
    fireEvent.change(getDateInput(), { target: { value: mockApod.date } });
    fireEvent.click(getSubmitButton());

    // backend should be called with the date
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(`/api/apod?date=${mockApod.date}`);
    });

    // result card shows APOD title and date
    expect(await screen.findByText(mockApod.title)).toBeInTheDocument();
    expect(screen.getByText(mockApod.date)).toBeInTheDocument();
  });

  // 2) invalid input (missing date) → validation error, no fetch
  it("shows a validation error when date is missing and does not call fetch", async () => {
    global.fetch = vi.fn() as any;

    render(<ApodSearchSection />);

    // submit with empty date
    fireEvent.click(getSubmitButton());

    // HeroUI's built-in message for invalid required field
    expect(
      await screen.findByText(/Constraints not satisfied/i),
    ).toBeInTheDocument();

    // no network request should be made
    expect(global.fetch).not.toHaveBeenCalled();
  });

  // 3) loading → API returns ok:false → error UI from backend
  it("shows backend error message when API responds with ok:false", async () => {
    const apiError = "APOD API failed.";

    mockFetchError(apiError);

    render(<ApodSearchSection />);

    fireEvent.change(getDateInput(), { target: { value: "2024-01-02" } });
    fireEvent.click(getSubmitButton());

    // error message from backend should appear via ErrorCard
    expect(await screen.findByText(apiError)).toBeInTheDocument();
  });

  // 4) empty state before search → hidden after success
  it("shows empty state initially and hides it after a successful search", async () => {
    const mockApod = {
      date: "2024-01-10",
      title: "Another APOD",
      url: "http://example.com/image2.jpg",
      media_type: "image",
      explanation: "More explanation",
    };

    mockFetchSuccess(mockApod);

    render(<ApodSearchSection />);

    // initial empty state is visible
    expect(
      screen.getByText(/No APOD loaded yet — choose a date and hit submit/i),
    ).toBeInTheDocument();

    // perform a successful search
    fireEvent.change(getDateInput(), { target: { value: mockApod.date } });
    fireEvent.click(getSubmitButton());

    // wait for result card
    await screen.findByText(mockApod.title);

    // empty state should be gone
    expect(
      screen.queryByText(/No APOD loaded yet — choose a date and hit submit/i),
    ).not.toBeInTheDocument();
  });
});
