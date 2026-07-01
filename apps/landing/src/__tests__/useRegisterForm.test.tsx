import {
  useRegisterForm,
  type RegisterFormData,
} from "@repo/hooks/useRegisterForm";
import * as utils from "@repo/lib/utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { server } from "../test/server";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "id" },
  }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useRegisterForm (Edge Cases & Validation)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("1. NIK Auto-fill (Date of Birth Extraction)", () => {
    it("should extract DOB and disable the field if NIK is valid", () => {
      // Mock extractDataFromNIK to return valid
      const extractMock = vi
        .spyOn(utils, "extractDataFromNIK")
        .mockReturnValue({
          validFormat: true,
          dateOfBirth: "1990-05-15",
          gender: "Pria",
        });

      const { result } = renderHook(() => useRegisterForm(false, "ID"), {
        wrapper: createWrapper(),
      });

      act(() => {
        // Trigger handleNikBlur with a fake NIK
        const event = {
          currentTarget: { value: "3271231505900001" },
        } as unknown as React.FocusEvent<HTMLInputElement>;
        result.current.handleNikBlur(event);
      });

      expect(extractMock).toHaveBeenCalledWith("3271231505900001");
      expect(result.current.isDobDisabled).toBe(true);

      // Verify that setValue was called to update the DOB field
      const dobValue = result.current.getValues("label-dob");
      expect(dobValue).toBe("1990-05-15");
    });

    it("should NOT disable DOB field if NIK is invalid", () => {
      const extractMock = vi
        .spyOn(utils, "extractDataFromNIK")
        .mockReturnValue({
          validFormat: false,
          dateOfBirth: undefined,
        });

      const { result } = renderHook(() => useRegisterForm(false, "ID"), {
        wrapper: createWrapper(),
      });

      act(() => {
        const event = {
          currentTarget: { value: "123" },
        } as unknown as React.FocusEvent<HTMLInputElement>;
        result.current.handleNikBlur(event);
      });

      expect(extractMock).toHaveBeenCalledWith("123");
      expect(result.current.isDobDisabled).toBe(false);
    });
  });

  describe("2. Age Mismatch (Cross-Tab Validation)", () => {
    it("should block adult registration if age is under 18 and prompt to switch to Anak", () => {
      // Adult mode (isAnak = false)
      const { result } = renderHook(() => useRegisterForm(false, "ID"), {
        wrapper: createWrapper(),
      });

      act(() => {
        // Set an underage DOB (e.g., 10 years old)
        const today = new Date();
        const tenYearsAgo = `${today.getFullYear() - 10}-01-01`;
        result.current.setValue("label-dob", tenYearsAgo);

        // Trigger submit logic
        result.current.onSubmit(result.current.getValues());
      });

      // It should prompt to switch to "anak" and NOT show confirm modal
      expect(result.current.showAgeSwitch).toBe("anak");
      expect(result.current.showConfirm).toBe(false);
    });

    it("should block child registration if age is over 18 and prompt to switch to Dewasa", () => {
      // Child mode (isAnak = true)
      const { result } = renderHook(() => useRegisterForm(true, "ID"), {
        wrapper: createWrapper(),
      });

      act(() => {
        // Set an overage DOB (e.g., 20 years old)
        const today = new Date();
        const twentyYearsAgo = `${today.getFullYear() - 20}-01-01`;
        result.current.setValue("label-dob", twentyYearsAgo);

        result.current.onSubmit(result.current.getValues());
      });

      // It should prompt to switch to "dewasa"
      expect(result.current.showAgeSwitch).toBe("dewasa");
      expect(result.current.showConfirm).toBe(false);
    });
  });

  describe("3. Phone Formatting & Warning", () => {
    it("should strip non-digits and set warning if starts with 0", () => {
      const { result } = renderHook(() => useRegisterForm(false, "ID"), {
        wrapper: createWrapper(),
      });

      let cleaned = "";
      act(() => {
        const event = {
          target: { value: "0812-3456-7890" },
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        cleaned = result.current.handlePhoneInput(event);
      });

      expect(cleaned).toBe("081234567890");
      expect(result.current.phoneWarning).toBe(true);
    });

    it("should remove warning if phone does not start with 0", () => {
      const { result } = renderHook(() => useRegisterForm(false, "ID"), {
        wrapper: createWrapper(),
      });

      act(() => {
        const event = {
          target: { value: "81234567890" },
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        result.current.handlePhoneInput(event);
      });

      expect(result.current.phoneWarning).toBe(false);
    });
  });

  describe("4. API Error Scraping (DOM Parsing)", () => {
    it("should throw error extracted from HTML alert-danger", async () => {
      // Override MSW just for this test to return the HTML error
      server.use(
        http.post("https://publicgold.co.id/index.php", () => {
          const mockHtml = `<div class="alert-danger"><p>Email sudah terdaftar!</p></div>`;
          return new HttpResponse(mockHtml, {
            status: 200,
            headers: {
              "Content-Type": "text/html",
            },
          });
        }),
      );

      const { result } = renderHook(() => useRegisterForm(false, "ID"), {
        wrapper: createWrapper(),
      });

      act(() => {
        const payload: Record<string, unknown> = {
          "label-name": "Test User",
          "label-dob": "1990-01-01",
          idselect: "newic",
          "label-ic": "123",
          "label-email": "test@test.com",
          "label-mobile-dialcode": "62",
          "label-mobile": "8123",
          upreferredbranch: "PG001",
          newsletter: false,
        };
        result.current.onSubmit(payload as unknown as RegisterFormData);
      });

      await act(async () => {
        await result.current.confirmSubmit();
      });

      // Wait for mutation to finish
      await import("@testing-library/react").then(({ waitFor }) =>
        waitFor(() => expect(result.current.status).toBe("error")),
      );

      // Hook catches the error and assigns it to 'message'
      expect(result.current.message).toBe("Email sudah terdaftar!");
    });
  });

  describe("5. Country Mode (Payload filtering)", () => {
    it("should omit NPWP (label-individualgstid) when not in Indonesia", () => {
      const { result } = renderHook(() => useRegisterForm(false, "MY"), {
        wrapper: createWrapper(),
      });

      act(() => {
        // Simulate filling NPWP anyway (e.g. from state residue)
        result.current.setValue("label-individualgstid", "123456789");
        result.current.setValue("label-dob", "1990-01-01"); // Valid adult age
        result.current.onSubmit(result.current.getValues());
      });

      // Confirm modal should appear, indicating successful onSubmit logic
      expect(result.current.showConfirm).toBe(true);

      // The NPWP should NOT be in the confirmItems for Malaysia
      const hasNpwpInSummary = result.current.confirmItems.some((item) =>
        item.label.includes("NPWP"),
      );
      expect(hasNpwpInSummary).toBe(false);
    });
  });
});
