import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithRouter } from "../test/utils";

describe("PetunjukPage", () => {
  it("renders the guide page and fetches agent data based on ref param", async () => {
    const { queryClient } = renderWithRouter(["/petunjuk?ref=valid-pageid"]);

    await waitFor(async () => {
      // GuidePageContent renders "Langkah Selanjutnya"
      const heading = await screen.findByText(/Langkah Selanjutnya/i);
      expect(heading).toBeInTheDocument();
    });

    // Wait for fetch to complete successfully
    await waitFor(() => {
      expect(queryClient.isFetching()).toBe(0);
    });
  });
});
