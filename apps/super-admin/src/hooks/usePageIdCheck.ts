import { api } from "@repo/lib/api";
import { useCallback, useState } from "react";

/**
 * Encapsulates the page ID uniqueness check used in Create and Edit dialogs.
 */
export function usePageIdCheck() {
  const [pageIdErrorCreate, setPageIdErrorCreate] = useState<string | null>(
    null,
  );
  const [pageIdErrorEdit, setPageIdErrorEdit] = useState<string | null>(null);

  const checkPageId = useCallback(
    async (pageid: string, excludeId?: string): Promise<boolean> => {
      if (!pageid || pageid.length < 3) return true;
      try {
        const res = await api.get<{ isAvailable: boolean }>(
          `/admin/pgbo/check-pageid?pageid=${pageid}${excludeId ? `&excludeId=${excludeId}` : ""}`,
        );
        return res.data.isAvailable;
      } catch {
        return true;
      }
    },
    [],
  );

  return {
    pageIdErrorCreate,
    setPageIdErrorCreate,
    pageIdErrorEdit,
    setPageIdErrorEdit,
    checkPageId,
  };
}
