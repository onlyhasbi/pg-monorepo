import { fireEvent, waitFor } from "@testing-library/react";

export async function fillRegistrationForm(container: HTMLElement) {
  const nameInput = await waitFor(
    () => container.querySelector("#label-name") as HTMLInputElement,
  );
  fireEvent.change(nameInput, { target: { value: "Test User" } });

  const icInput = container.querySelector("#label-ic") as HTMLInputElement;
  fireEvent.change(icInput, { target: { value: "3271231505900001" } });

  const emailInput = container.querySelector(
    "#label-email",
  ) as HTMLInputElement;
  fireEvent.change(emailInput, { target: { value: "test@example.com" } });

  const dobInput = container.querySelector("#label-dob") as HTMLInputElement;
  fireEvent.change(dobInput, { target: { value: "1990-05-15" } });

  const mobileInput = container.querySelector(
    "#label-mobile",
  ) as HTMLInputElement;
  fireEvent.change(mobileInput, { target: { value: "81234567890" } });

  // branch is a combobox, so maybe we need to click it. Or we can just bypass if it's not strictly required in the simplified mock?
  // Wait, we can't easily set branch Combobox with fireEvent if it uses Radix. But wait, we mocked Combobox in setup.ts!
  // It renders: <input ... /> for ComboboxInput!
  // Form is filled, return to submit
}
