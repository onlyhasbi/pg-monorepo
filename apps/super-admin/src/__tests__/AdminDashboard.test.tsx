import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { AdminDashboard } from "../components/AdminDashboard";
import { renderWithProviders } from "../test/utils";
import * as authLib from "@repo/lib/auth";
import type { PgboData } from "@repo/types";

// Setup ResizeObserver mock
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = ResizeObserver;

const mockNavigate = vi.fn();
vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@tanstack/react-router")>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: "/" }),
    Link: ({ to, children, ...props }: any) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
  };
});

vi.mock("@repo/lib/auth", () => ({
  logout: vi.fn(),
}));

const mockCreateMutate = vi.fn((_data, options) => options?.onSuccess?.());
const mockEditMutate = vi.fn((_data, options) => options?.onSuccess?.());
const mockDeleteMutate = vi.fn((_id, options) => options?.onSettled?.());
const mockToggleMutate = vi.fn((_id, options) => options?.onSettled?.());
const mockBulkDeleteMutate = vi.fn((_ids, options) => options?.onSettled?.());
const mockBulkToggleMutate = vi.fn((_data, options) => options?.onSettled?.());
const mockSecretUpdateMutate = vi.fn();

const mockUsePgboQuery = vi.fn();

vi.mock("../hooks/usePgboQuery", () => ({
  usePgboQuery: () => mockUsePgboQuery(),
}));

vi.mock("../hooks/usePgboMutations", () => ({
  usePgboMutations: () => ({
    createMutation: { mutate: mockCreateMutate, isPending: false },
    editMutation: { mutate: mockEditMutate, isPending: false },
    deleteMutation: { mutate: mockDeleteMutate, isPending: false },
    toggleMutation: { mutate: mockToggleMutate, isPending: false },
    bulkDeleteMutation: { mutate: mockBulkDeleteMutate, isPending: false },
    bulkToggleMutation: { mutate: mockBulkToggleMutate, isPending: false },
  }),
}));

const mockSetIsSecretModalOpen = vi.fn();
const mockSetTempSecretCode = vi.fn();
const mockSetShowSecretInModal = vi.fn();
const mockSetIsAutoRotate = vi.fn();
const mockGenerateRandom = vi.fn();

const mockUseSecretCode = vi.fn();

vi.mock("../hooks/useSecretCode", () => ({
  useSecretCode: () => mockUseSecretCode(),
}));

vi.mock("../hooks/usePageIdCheck", () => ({
  usePageIdCheck: () => ({
    pageIdErrorCreate: "",
    pageIdErrorEdit: "",
    checkPageId: vi.fn(),
    setPageIdErrorCreate: vi.fn(),
    setPageIdErrorEdit: vi.fn(),
  }),
}));

// Mock Dialogs to directly trigger their onSubmit / callbacks to cover AdminDashboard handlers
vi.mock("../components/CreatePgboDialog", () => ({
  CreatePgboDialog: ({
    open,
    onSubmit,
    onFetchIntroducerName,
  }: {
    open: boolean;
    onSubmit: (data: FormData) => void;
    onFetchIntroducerName: (pgcode: string, isIntroducerValid: boolean) => void;
  }) =>
    open ? (
      <div data-testid="create-dialog">
        <button onClick={() => onSubmit(new FormData())}>Simpan Create</button>
        <button onClick={() => onFetchIntroducerName("PG123456", false)}>
          Fetch Intro
        </button>
      </div>
    ) : null,
}));

vi.mock("../components/EditPgboDialog", () => ({
  EditPgboDialog: ({
    pgbo,
    onSubmit,
  }: {
    pgbo: PgboData | null;
    onSubmit: (id: string, formData: FormData) => void;
  }) =>
    pgbo ? (
      <div data-testid="edit-dialog">
        <button onClick={() => onSubmit("1", new FormData())}>
          Simpan Edit
        </button>
      </div>
    ) : null,
}));

vi.mock("../components/DeleteConfirmDialog", () => ({
  DeleteConfirmDialog: ({
    open,
    onConfirm,
  }: {
    open: boolean;
    onConfirm: () => void;
  }) =>
    open ? (
      <div data-testid="delete-dialog">
        <button onClick={onConfirm}>Ya, Hapus</button>
      </div>
    ) : null,
}));

vi.mock("../components/BulkDeleteDialog", () => ({
  BulkDeleteDialog: ({
    ids,
    onConfirm,
  }: {
    ids: string[] | null;
    onConfirm: (ids: string[]) => void;
  }) =>
    ids ? (
      <div data-testid="bulk-delete-dialog">
        <button onClick={() => onConfirm(["1"])}>Hapus Bulk</button>
      </div>
    ) : null,
}));

vi.mock("../components/SecretCodeDialog", () => ({
  SecretCodeDialog: ({
    isOpen,
    onSave,
  }: {
    isOpen: boolean;
    onSave: () => void;
  }) =>
    isOpen ? (
      <div data-testid="secret-dialog">
        <button onClick={onSave}>Simpan Secret</button>
      </div>
    ) : null,
}));

describe("AdminDashboard (PGBO Management)", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUsePgboQuery.mockReturnValue({
      data: [
        {
          id: "1",
          pgcode: "PG001",
          nama_lengkap: "Test PGBO",
          pageid: "testpgbo",
          is_active: 1,
          created_at: new Date().toISOString(),
        },
      ],
      isError: false,
      error: null,
      serverSearch: "",
      setServerSearch: vi.fn(),
    });

    mockUseSecretCode.mockReturnValue({
      tempSecretCode: "12345",
      isAutoRotate: false,
      isSecretModalOpen: false,
      showSecretInModal: false,
      setIsSecretModalOpen: mockSetIsSecretModalOpen,
      setTempSecretCode: mockSetTempSecretCode,
      setShowSecretInModal: mockSetShowSecretInModal,
      setIsAutoRotate: mockSetIsAutoRotate,
      generateRandom: mockGenerateRandom,
      updateSecretMutation: {
        mutate: mockSecretUpdateMutate,
        isPending: false,
      },
    });

    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({ success: true, name: "Fetched Name" }),
    }) as unknown as typeof global.fetch;
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("renders the dashboard with correct title and active account count", async () => {
    renderWithProviders(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /Daftar Halaman/i })).toBeInTheDocument();
    });

    expect(screen.getAllByText("Test PGBO").length).toBeGreaterThan(0);
    expect(screen.getAllByText("PG001").length).toBeGreaterThan(0);
    expect(screen.getByText("1 Akun Aktif")).toBeInTheDocument();
  });

  it("intercepts 401 error and logs out", async () => {
    mockUsePgboQuery.mockReturnValue({
      data: undefined,
      isError: true,
      error: { status: 401, name: "ApiError" },
      serverSearch: "",
      setServerSearch: vi.fn(),
    });

    renderWithProviders(<AdminDashboard />);

    await waitFor(() => {
      expect(authLib.logout).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith({ to: "/signin" });
    });
  });

  it("handles logout from AdminNav", async () => {
    renderWithProviders(<AdminDashboard />);

    // The logout button inside AdminNav
    const logoutBtn = await screen.findByText("Logout");
    await userEvent.click(logoutBtn);

    expect(authLib.logout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith({ to: "/signin" });
  });

  it("opens Create dialog and handles submit", async () => {
    renderWithProviders(<AdminDashboard />);

    const createBtn = screen.getByText("Buat Page Baru");
    await userEvent.click(createBtn);

    const saveBtn = await screen.findByText("Simpan Create");
    await userEvent.click(saveBtn);

    expect(mockCreateMutate).toHaveBeenCalled();
    expect(screen.queryByTestId("create-dialog")).not.toBeInTheDocument();
  });

  it("handles fetchIntroducerName via Create dialog", async () => {
    renderWithProviders(<AdminDashboard />);

    await userEvent.click(screen.getByText("Buat Page Baru"));
    const fetchBtn = await screen.findByText("Fetch Intro");

    // Setup event listener
    const eventSpy = vi.fn();
    window.addEventListener("pgcode-name-resolved", eventSpy);

    await userEvent.click(fetchBtn);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
      expect(eventSpy).toHaveBeenCalled();
    });

    window.removeEventListener("pgcode-name-resolved", eventSpy);
  });

  it("handles Edit and Delete from Table row actions", async () => {
    renderWithProviders(<AdminDashboard />);

    // Click Edit
    const editBtns = await screen.findAllByTestId("edit-btn-1");
    expect(editBtns[0]).not.toBeNull();
    await userEvent.click(editBtns[0]);

    const saveEditBtn = await screen.findByRole(
      "button",
      { name: /Simpan Edit/i },
      { timeout: 3000 },
    );
    await userEvent.click(saveEditBtn);

    expect(mockEditMutate).toHaveBeenCalled();

    const deleteBtns = await screen.findAllByTestId("delete-btn-1");
    await userEvent.click(deleteBtns[0]);

    const confirmDel = await screen.findByRole("button", {
      name: /Ya, Hapus/i,
    });
    await userEvent.click(confirmDel);

    expect(mockDeleteMutate).toHaveBeenCalledWith("1", expect.any(Object));
  });

  it("handles toggle from Table row actions", async () => {
    renderWithProviders(<AdminDashboard />);

    const toggleBtns = await screen.findAllByTestId("toggle-btn-1");
    await userEvent.click(toggleBtns[0]);

    expect(mockToggleMutate).toHaveBeenCalledWith("1");
  });

  it("handles SecretCode settings save", async () => {
    // Mock AdminNav calling onOpenSecret
    mockSetIsSecretModalOpen.mockImplementationOnce(() => true);

    mockUseSecretCode.mockReturnValue({
      tempSecretCode: "12345",
      isAutoRotate: false,
      isSecretModalOpen: true,
      showSecretInModal: false,
      setIsSecretModalOpen: mockSetIsSecretModalOpen,
      setTempSecretCode: mockSetTempSecretCode,
      setShowSecretInModal: mockSetShowSecretInModal,
      setIsAutoRotate: mockSetIsAutoRotate,
      generateRandom: mockGenerateRandom,
      updateSecretMutation: {
        mutate: mockSecretUpdateMutate,
        isPending: false,
      },
    });

    // Re-render with new mock state
    renderWithProviders(<AdminDashboard />);

    // Modal should be open
    expect(screen.getByTestId("secret-dialog")).toBeInTheDocument();

    // Click save
    const saveBtn = await screen.findByRole("button", { name: /Simpan/i });
    await userEvent.click(saveBtn);

    expect(mockSecretUpdateMutate).toHaveBeenCalledWith({
      code: "12345",
      auto_rotate: false,
    });
  });

  it("handles bulk actions", async () => {
    renderWithProviders(<AdminDashboard />);

    // Select a row
    const checkboxes = await screen.findAllByRole("checkbox");
    await userEvent.click(checkboxes[1]); // the first row checkbox

    // Wait for BulkActions toolbar to appear
    const statusSelect = await screen.findByTestId("bulk-status-select");

    // Try bulk toggle
    await userEvent.click(statusSelect);
    const bulkToggleBtn = await screen.findByRole("option", {
      name: /Nonaktifkan/i,
    });
    await userEvent.click(bulkToggleBtn);

    expect(mockBulkToggleMutate).toHaveBeenCalledWith(
      { ids: ["1"], active: false },
      expect.any(Object),
    );

    // Re-select the row checkbox by querying fresh elements because they were re-rendered
    const freshCheckboxes = await screen.findAllByRole("checkbox");
    await userEvent.click(freshCheckboxes[1]);

    // Try bulk delete using fresh button
    const freshBulkDeleteBtn = await screen.findByTestId("bulk-delete-btn");
    await userEvent.click(freshBulkDeleteBtn);
    const confirmBulkDel = await screen.findByRole("button", {
      name: /Hapus Bulk/i,
    });
    await userEvent.click(confirmBulkDel);

    expect(mockBulkDeleteMutate).toHaveBeenCalledWith(
      ["1"],
      expect.any(Object),
    );
  });
});
