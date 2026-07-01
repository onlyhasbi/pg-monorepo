import { api } from "@repo/lib/api";
import { useToast } from "@repo/ui/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ApiMessageResponse {
  message: string;
}

/**
 * Encapsulates all PGBO CRUD mutations (create, edit, delete, toggle, bulk).
 */
export function usePgboMutations() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const invalidatePgbo = () =>
    queryClient.invalidateQueries({ queryKey: ["admin_pgbo"] });

  // --- DELETE ---
  const deleteMutation = useMutation<ApiMessageResponse, Error, string>({
    mutationFn: async (id) => {
      const res = await api.delete<ApiMessageResponse>(`/admin/pgbo/${id}`);
      return res.data;
    },
    onSuccess: (data) => {
      showToast(data.message, "success");
      invalidatePgbo();
    },
    onError: (
      error: Error & { response?: { data?: { message?: string } } },
    ) => {
      showToast(
        error.response?.data?.message || "Gagal menghapus PGBO",
        "error",
      );
    },
  });

  // --- TOGGLE ACTIVE ---
  const toggleMutation = useMutation<ApiMessageResponse, Error, string>({
    mutationFn: async (id) => {
      const res = await api.patch<ApiMessageResponse>(
        `/admin/pgbo/${id}/toggle`,
        null,
      );
      return res.data;
    },
    onSuccess: (data) => {
      showToast(data.message, "success");
      invalidatePgbo();
    },
    onError: (
      error: Error & { response?: { data?: { message?: string } } },
    ) => {
      showToast(
        error.response?.data?.message || "Gagal mengubah status PGBO",
        "error",
      );
    },
  });

  // --- BULK DELETE ---
  const bulkDeleteMutation = useMutation<ApiMessageResponse, Error, string[]>({
    mutationFn: async (ids) => {
      const res = await api.post<ApiMessageResponse>(
        "/admin/pgbo/bulk-delete",
        { ids },
      );
      return res.data;
    },
    onSuccess: (data) => {
      showToast(data.message, "success");
      invalidatePgbo();
    },
    onError: (
      error: Error & { response?: { data?: { message?: string } } },
    ) => {
      showToast(
        error.response?.data?.message || "Gagal menghapus PGBO",
        "error",
      );
    },
  });

  // --- BULK TOGGLE ---
  const bulkToggleMutation = useMutation<
    ApiMessageResponse,
    Error,
    { ids: string[]; active: boolean }
  >({
    mutationFn: async ({ ids, active }) => {
      const res = await api.patch<ApiMessageResponse>(
        "/admin/pgbo/bulk-toggle",
        { ids, active },
      );
      return res.data;
    },
    onSuccess: (data) => {
      showToast(data.message, "success");
      invalidatePgbo();
    },
    onError: (
      error: Error & { response?: { data?: { message?: string } } },
    ) => {
      showToast(
        error.response?.data?.message || "Gagal mengubah status",
        "error",
      );
    },
  });

  // --- CREATE ---
  const createMutation = useMutation<ApiMessageResponse, Error, FormData>({
    mutationFn: async (data) => {
      const res = await api.post<ApiMessageResponse>("/admin/pgbo", data);
      return res.data;
    },
    onSuccess: (data) => {
      showToast(data.message, "success");
      invalidatePgbo();
    },
    onError: (
      error: Error & { response?: { data?: { message?: string } } },
    ) => {
      showToast(
        error.response?.data?.message || "Gagal mendaftar PGBO",
        "error",
      );
    },
  });

  // --- EDIT ---
  const editMutation = useMutation<
    ApiMessageResponse,
    Error,
    { id: string; data: FormData }
  >({
    mutationFn: async ({ id, data }) => {
      const res = await api.put<ApiMessageResponse>(`/admin/pgbo/${id}`, data);
      return res.data;
    },
    onSuccess: (data) => {
      showToast(data.message, "success");
      invalidatePgbo();
    },
    onError: (
      error: Error & { response?: { data?: { message?: string } } },
    ) => {
      showToast(
        error.response?.data?.message || "Gagal memperbarui PGBO",
        "error",
      );
    },
  });

  return {
    deleteMutation,
    toggleMutation,
    bulkDeleteMutation,
    bulkToggleMutation,
    createMutation,
    editMutation,
  };
}
