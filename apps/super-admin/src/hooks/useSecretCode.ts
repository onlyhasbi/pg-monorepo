import {
  getAdminSecretFn,
  updateAdminSecretFn,
} from "@repo/services/api.functions";
import type { SecretCodeData } from "@repo/types";
import { useToast } from "@repo/ui/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

/**
 * Encapsulates the secret code query, mutation, and local UI state.
 */
export function useSecretCode() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const [isSecretModalOpen, setIsSecretModalOpen] = useState(false);
  const [showSecretInModal, setShowSecretInModal] = useState(false);
  const [tempSecretCode, setTempSecretCode] = useState("");
  const [isAutoRotate, setIsAutoRotate] = useState(false);

  const { data: currentSecret } = useQuery<SecretCodeData>({
    queryKey: ["admin_secret_code"],
    queryFn: async () => {
      try {
        const res = await getAdminSecretFn();
        return (res.data as SecretCodeData) || { code: "", auto_rotate: false };
      } catch (err) {
        console.warn("[useSecretCode] Secret fetch error:", err);
        return { code: "", auto_rotate: false };
      }
    },
    enabled: isSecretModalOpen,
  });

  useEffect(() => {
    if (currentSecret) {
      setTempSecretCode(currentSecret.code || "");
      setIsAutoRotate(!!currentSecret.auto_rotate);
    }
  }, [currentSecret]);

  const updateSecretMutation = useMutation({
    mutationFn: async (payload: SecretCodeData) => {
      const res = await updateAdminSecretFn({ data: payload });
      return res as { message: string };
    },
    onSuccess: (data) => {
      showToast(data.message, "success");
      setIsSecretModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["admin_secret_code"] });
    },
    onError: (
      error: Error & { response?: { data?: { message?: string } } },
    ) => {
      showToast(
        error.response?.data?.message || "Gagal memperbarui kode rahasia",
        "error",
      );
    },
  });

  /**
   * Generates a cryptographically random 8-character secret code.
   * Uses crypto.getRandomValues() instead of Math.random() for security.
   */
  const generateRandom = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const array = new Uint32Array(8);
    crypto.getRandomValues(array);
    setTempSecretCode(
      Array.from(array, (v) => chars[v % chars.length]).join(""),
    );
  };

  return {
    isSecretModalOpen,
    setIsSecretModalOpen,
    showSecretInModal,
    setShowSecretInModal,
    tempSecretCode,
    setTempSecretCode,
    isAutoRotate,
    setIsAutoRotate,
    updateSecretMutation,
    generateRandom,
  };
}
