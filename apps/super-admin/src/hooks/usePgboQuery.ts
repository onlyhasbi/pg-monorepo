import { useDebounce } from "@repo/hooks/useDebounce";
import { getAdminPgboFn } from "@repo/services/api.functions";
import type { PgboData } from "@repo/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";

/**
 * Encapsulates the PGBO list query with server-side debounced search.
 */
export function usePgboQuery() {
  const [serverSearch, setServerSearch] = useState("");
  const debouncedSearch = useDebounce(serverSearch, 500);

  const query = useQuery<PgboData[]>({
    queryKey: ["admin_pgbo", debouncedSearch],
    queryFn: async () => {
      const res = await getAdminPgboFn({ data: { search: debouncedSearch } });
      return (res.data as PgboData[]) || [];
    },
    placeholderData: keepPreviousData,
    retry: 1,
  });

  return {
    ...query,
    serverSearch,
    setServerSearch,
  };
}
