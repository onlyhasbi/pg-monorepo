import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { CreatePgboDialog } from "../CreatePgboDialog";

// Setup ResizeObserver mock (used by radix ui dialog)
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = ResizeObserver;

describe("CreatePgboDialog", () => {
  const mockOnOpenChange = vi.fn();
  const mockOnSubmit = vi.fn();
  const mockOnCheckPageId = vi.fn().mockResolvedValue(true);
  const mockOnSetPageIdError = vi.fn();
  const mockOnFetchIntroducerName = vi.fn();

  const defaultProps = {
    open: true,
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

  it("renders all form fields", () => {
    render(<CreatePgboDialog {...defaultProps} />);
    expect(screen.getByText("Buat Page PGBO Baru")).toBeInTheDocument();
    expect(screen.getByLabelText(/PGCode/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Page ID/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nama Lengkap/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password Sementara/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Buat Halaman/i }),
    ).toBeInTheDocument();
  });

  it("calls onFetchIntroducerName on PGCode blur", async () => {
    render(<CreatePgboDialog {...defaultProps} />);
    const pgcodeInput = screen.getByLabelText(/PGCode/i);

    await userEvent.type(pgcodeInput, "PG123456");
    fireEvent.blur(pgcodeInput);

    expect(mockOnFetchIntroducerName).toHaveBeenCalledWith("PG123456", false);
  });

  it("calls onCheckPageId on Page ID blur if length >= 3", async () => {
    render(<CreatePgboDialog {...defaultProps} />);
    const pageIdInput = screen.getByLabelText(/Page ID/i);

    await userEvent.type(pageIdInput, "testpage");
    fireEvent.blur(pageIdInput);

    await waitFor(() => {
      expect(mockOnCheckPageId).toHaveBeenCalledWith("testpage");
    });
    expect(mockOnSetPageIdError).toHaveBeenCalledWith(null);
  });

  it("sets pageIdError if onCheckPageId returns false", async () => {
    mockOnCheckPageId.mockResolvedValueOnce(false);
    render(<CreatePgboDialog {...defaultProps} />);
    const pageIdInput = screen.getByLabelText(/Page ID/i);

    await userEvent.type(pageIdInput, "taken");
    fireEvent.blur(pageIdInput);

    await waitFor(() => {
      expect(mockOnSetPageIdError).toHaveBeenCalledWith(
        "Page ID ini sudah terdaftar",
      );
    });
  });

  it("does not call onCheckPageId if length < 3", async () => {
    render(<CreatePgboDialog {...defaultProps} />);
    const pageIdInput = screen.getByLabelText(/Page ID/i);

    await userEvent.type(pageIdInput, "ab");
    fireEvent.blur(pageIdInput);

    expect(mockOnCheckPageId).not.toHaveBeenCalled();
    expect(mockOnSetPageIdError).toHaveBeenCalledWith(null);
  });

  it("toggles password visibility", async () => {
    render(<CreatePgboDialog {...defaultProps} />);
    const passwordInput = screen.getByLabelText(
      /Password Sementara/i,
    ) as HTMLInputElement;

    expect(passwordInput.type).toBe("password");

    const toggleBtn = passwordInput.parentElement?.querySelector("button");
    expect(toggleBtn).not.toBeNull();
    if (toggleBtn) {
      await userEvent.click(toggleBtn);
      expect(passwordInput.type).toBe("text");
      await userEvent.click(toggleBtn);
      expect(passwordInput.type).toBe("password");
    }
  });

  it("submits the form with correct formData", async () => {
    render(<CreatePgboDialog {...defaultProps} />);

    await userEvent.type(screen.getByLabelText(/PGCode/i), "PG123456");
    await userEvent.type(screen.getByLabelText(/Page ID/i), "mypage");
    // Use placeholder since label is visually hidden or custom for phone
    const phoneInput = screen.getByPlaceholderText("8123456789");
    await userEvent.type(phoneInput, "08123456789");
    await userEvent.type(
      screen.getByLabelText(/Password Sementara/i),
      "password123",
    );

    const submitBtn = screen.getByRole("button", { name: /Buat Halaman/i });

    await waitFor(() => {
      expect(submitBtn).not.toBeDisabled();
    });

    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });

    const submittedFormData = mockOnSubmit.mock.calls[0][0] as FormData;
    expect(submittedFormData.get("pgcode")).toBe("PG123456");
    expect(submittedFormData.get("pageid")).toBe("mypage");
    expect(submittedFormData.get("katasandi")).toBe("password123");
    expect(submittedFormData.get("no_telpon")).toBe("628123456789"); // 62 is default, leading 0 is stripped
  });

  it("handles modal close", async () => {
    render(<CreatePgboDialog {...defaultProps} />);

    const closeBtn = screen.getByRole("button", { name: /Batal/i });
    await userEvent.click(closeBtn);

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    expect(mockOnSetPageIdError).toHaveBeenCalledWith(null);
  });
});
