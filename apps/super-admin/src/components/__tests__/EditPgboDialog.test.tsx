import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { EditPgboDialog } from "../EditPgboDialog";

// Setup ResizeObserver mock (used by radix ui dialog)
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = ResizeObserver;

describe("EditPgboDialog", () => {
  const mockOnOpenChange = vi.fn();
  const mockOnSubmit = vi.fn();
  const mockOnCheckPageId = vi.fn().mockResolvedValue(true);
  const mockOnSetPageIdError = vi.fn();
  const mockOnFetchIntroducerName = vi.fn();

  const mockPgbo = {
    id: "doc-1",
    pgcode: "PG123",
    pageid: "mypage",
    nama_lengkap: "John Doe",
    no_telpon: "628123456789",
    role: "pgbo" as const,
    is_active: true,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  };

  const defaultProps = {
    pgbo: mockPgbo,
    onOpenChange: mockOnOpenChange,
    onSubmit: mockOnSubmit,
    isPending: false,
    pageIdError: null,
    onCheckPageId: mockOnCheckPageId,
    onSetPageIdError: mockOnSetPageIdError,
    onFetchIntroducerName: mockOnFetchIntroducerName,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders dialog when pgbo is provided", () => {
    render(<EditPgboDialog {...defaultProps} />);
    expect(screen.getByText("Sunting Informasi Dealer")).toBeInTheDocument();
  });

  it("does not render when pgbo is null", () => {
    render(<EditPgboDialog {...defaultProps} pgbo={null} />);
    expect(
      screen.queryByText("Sunting Informasi Dealer"),
    ).not.toBeInTheDocument();
  });

  it("populates fields with pgbo data", async () => {
    render(<EditPgboDialog {...defaultProps} />);

    await waitFor(() => {
      const pgcodeInput = screen.getByLabelText(/PGCode/i) as HTMLInputElement;
      expect(pgcodeInput.value).toBe("PG123");

      const pageIdInput = screen.getByLabelText(/Page ID/i) as HTMLInputElement;
      expect(pageIdInput.value).toBe("mypage");

      const namaInput = screen.getByLabelText(
        /Nama Lengkap/i,
      ) as HTMLInputElement;
      expect(namaInput.value).toBe("John Doe");

      const phoneInput = screen.getByPlaceholderText(
        "8123456789",
      ) as HTMLInputElement;
      expect(phoneInput.value).toBe("8123456789"); // local part only
    });
  });

  it("calls onCheckPageId on Page ID blur if length >= 3 and different from current", async () => {
    render(<EditPgboDialog {...defaultProps} />);
    const pageIdInput = screen.getByLabelText(/Page ID/i);

    await userEvent.clear(pageIdInput);
    await userEvent.type(pageIdInput, "newpage");
    fireEvent.blur(pageIdInput);

    await waitFor(() => {
      expect(mockOnCheckPageId).toHaveBeenCalledWith("newpage", "doc-1");
    });
  });

  it("does not call onCheckPageId if pageId is unchanged", async () => {
    render(<EditPgboDialog {...defaultProps} />);
    const pageIdInput = screen.getByLabelText(/Page ID/i);

    fireEvent.blur(pageIdInput);
    expect(mockOnCheckPageId).not.toHaveBeenCalled();
  });

  it("submits the form with modified data", async () => {
    render(<EditPgboDialog {...defaultProps} />);

    // Wait for population
    await waitFor(() => {
      expect((screen.getByLabelText(/PGCode/i) as HTMLInputElement).value).toBe(
        "PG123",
      );
    });

    const pageIdInput = screen.getByLabelText(/Page ID/i);
    await userEvent.clear(pageIdInput);
    await userEvent.type(pageIdInput, "mypagenew");

    const submitBtn = screen.getByRole("button", { name: /Simpan Perubahan/i });

    await waitFor(() => {
      expect(submitBtn).not.toBeDisabled();
    });

    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });

    const submittedId = mockOnSubmit.mock.calls[0][0];
    const submittedFormData = mockOnSubmit.mock.calls[0][1] as FormData;

    expect(submittedId).toBe("doc-1");
    expect(submittedFormData.get("pageid")).toBe("mypagenew");
    expect(submittedFormData.get("pgcode")).toBe("PG123"); // populated from default
    expect(submittedFormData.get("no_telpon")).toBe("628123456789"); // Default dialing code + existing local part
  });
});
