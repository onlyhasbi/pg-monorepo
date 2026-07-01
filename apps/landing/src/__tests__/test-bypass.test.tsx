import { act, fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderWithRouter } from "../test/utils";

// Mock validation to always pass
vi.mock("@hookform/resolvers/valibot", () => ({
  valibotResolver: () => async (values: Record<string, unknown>) => {
    return {
      values,
      errors: {},
    };
  },
}));

describe("Form bypass", () => {
  it("submits without filling fields", async () => {
    const { container } = renderWithRouter(["/register?ref=valid-pageid"]);

    const form = await waitFor(() => {
      const f = container.querySelector("form");
      if (!f) throw new Error("Form not found");
      return f;
    });

    await act(async () => {
      fireEvent.submit(form);
    });

    // See if the confirm modal appears
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });
});
