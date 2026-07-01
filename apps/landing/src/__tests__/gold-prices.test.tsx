import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithRouter } from "../test/utils";

describe("Gold Prices Display", () => {
  it("should fetch and display gold prices on the landing page", async () => {
    // Render the landing page for a valid PGBO agent
    renderWithRouter(["/valid-pageid"]);

    // Wait for the mock MSW response (1500000) to be formatted and displayed
    await waitFor(
      () => {
        const priceElements = screen.getAllByText(/1[.,\s]?500[.,\s]?000/);
        expect(priceElements.length).toBeGreaterThan(0);
      },
      { timeout: 4000 },
    );
  });
});
