import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithRouter } from "../test/utils";

describe("LandingHomePage", () => {
  it("renders the logo and links to admin panel", async () => {
    renderWithRouter(["/"]);

    // Check if the logo image exists
    const logo = await screen.findByAltText("5G Associates");
    expect(logo).toBeInTheDocument();

    // Check if the link exists
    const link = logo.closest("a");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href");
    expect(link?.getAttribute("href")).toContain("signin"); // Check that it links to signin page
  });
});
