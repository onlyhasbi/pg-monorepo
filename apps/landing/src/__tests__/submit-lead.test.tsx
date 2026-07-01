import { fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithRouter } from "../test/utils";

describe("Submit Lead Flow", () => {
  it("renders the registration form for a valid referral", async () => {
    // Render the register page with a valid referral ID in the search params
    const { container } = renderWithRouter(["/register?ref=valid-pageid"]);

    // Wait for the name input to appear.
    const nameInput = await waitFor(
      () => {
        const input = container.querySelector(
          "#label-name",
        ) as HTMLInputElement;
        if (!input) throw new Error("Name input not found yet");
        return input;
      },
      { timeout: 1000 },
    );

    expect(nameInput).toBeInTheDocument();

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    expect(nameInput).toHaveValue("JOHN DOE"); // The component auto-uppercases

    const emailInput = container.querySelector(
      "#label-email",
    ) as HTMLInputElement;
    expect(emailInput).toBeInTheDocument();
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    expect(emailInput).toHaveValue("john@example.com");

    const icInput = container.querySelector("#label-ic") as HTMLInputElement;
    expect(icInput).toBeInTheDocument();
    fireEvent.change(icInput, { target: { value: "1234567890123456" } });
    expect(icInput).toHaveValue("1234567890123456");
  });
});
