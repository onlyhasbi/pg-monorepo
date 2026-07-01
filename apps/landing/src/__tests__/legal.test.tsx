import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderWithRouter } from "../test/utils";

// Mock useSEO to prevent head manipulation errors in JSDOM
vi.mock("@repo/hooks/useSEO", () => ({ useSEO: vi.fn() }));

describe("LegalPage", () => {
  it("renders the legal page with default terms tab", async () => {
    renderWithRouter(["/legal"]);

    // GuidePageContent for legal renders tabs, check for one of the tab contents
    const heading = await screen.findByText(/Informasi Legal/i);
    expect(heading).toBeInTheDocument();
  });
});
