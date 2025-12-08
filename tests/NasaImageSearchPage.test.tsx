import React from "react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "./test-utils";

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NasaImageSearchPage from "../app/images/page";

const originalFetch = global.fetch;

describe("NASA Image Search UI", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch as any;
  });

  // helper to create a successful mock response
  function mockImageSearchSuccess() {
    const mockResult = {
      collection: {
        items: [
          {
            data: [
              {
                title: "Mock Galaxy",
                date_created: "2020-01-01T00:00:00Z",
                description: "A beautiful galaxy.",
                nasa_id: "GALAXY_1",
              },
            ],
            links: [
              {
                href: "http://example.com/thumb1.jpg",
              },
            ],
          },
        ],
        metadata: {
          total_hits: 1,
        },
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockResult),
    } as any);
  }

  // helper to create an error response from the API
  function mockImageSearchError(
    message = "Something went wrong while fetching NASA images.",
  ) {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: vi.fn().mockResolvedValue({ message }),
    } as any);
  }

  const getInput = () =>
    screen.getByLabelText(/search term/i) as HTMLInputElement;
  const getSearchButton = () => screen.getByRole("button", { name: /search/i });

  // 1) accessibility / initial behavior: button should be disabled with empty query
  it("disables the search button when the query is empty", () => {
    renderWithProviders(<NasaImageSearchPage />);

    const button = getSearchButton();
    expect(button).toBeDisabled();
  });

  // 2) validation: empty submit shows inline error and does not call fetch
  it("shows an inline validation error and does not call fetch when the query is cleared", async () => {
    const user = userEvent.setup();
    const fetchSpy = vi.spyOn(global, "fetch");

    renderWithProviders(<NasaImageSearchPage />);

    const input = screen.getByLabelText(/search term/i);

    // user types something, then clears it -> triggers handleQueryChange with empty string
    await user.type(input, "galaxy");
    await user.clear(input);

    // inline validation message from our client-side logic
    expect(screen.getByText(/please enter a search term/i)).toBeInTheDocument();

    // we never hit the network just from typing/clearing
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  // 3) validation: typing a valid query clears error and enables button
  it("clears validation error and enables the search button when the query becomes valid", () => {
    renderWithProviders(<NasaImageSearchPage />);

    const input = getInput();
    const button = getSearchButton();

    // initially disabled
    expect(button).toBeDisabled();

    // type a valid query
    fireEvent.change(input, { target: { value: "galaxy" } });

    // error should disappear and button should be enabled
    expect(
      screen.queryByText(/please enter a search term/i),
    ).not.toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  // 4) behavior: successful search shows results grid + total hits
  it("runs a search and renders image results when the API succeeds", async () => {
    mockImageSearchSuccess();

    renderWithProviders(<NasaImageSearchPage />);

    const input = getInput();
    const button = getSearchButton();

    fireEvent.change(input, { target: { value: "galaxy" } });
    fireEvent.click(button);

    // ensure fetch was called with our API route
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    // card content from mocked result
    expect(await screen.findByText("Mock Galaxy")).toBeInTheDocument();

    // footer showing total results
    expect(screen.getByText(/total results found: 1/i)).toBeInTheDocument();
  });

  // 5) behavior: API error shows ErrorCard message
  it("shows an error message when the API responds with an error", async () => {
    const errorMessage = "Image search failed.";
    mockImageSearchError(errorMessage);

    renderWithProviders(<NasaImageSearchPage />);

    const input = getInput();
    const button = getSearchButton();

    fireEvent.change(input, { target: { value: "nebula" } });
    fireEvent.click(button);

    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
  });
});
