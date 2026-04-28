import { QueryClient } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

/**
 * FACTORY FUNCTION: Creates a fresh QueryClient instance.
 * Mandatory for SSR per-request isolation.
 */
export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes default
      },
    },
  });

/** Shared browser singleton for client-side query usage. */
export const queryClient = createQueryClient();

/**
 * PERSISTENCE & TAB SYNC
 */
if (typeof window !== "undefined") {
  // Sync the singleton instance on the browser
  const persister = createSyncStoragePersister({
    storage: window.localStorage,
    key: "PUBLIC_GOLD_QUERY_CACHE",
  });

  // One-time migration: remove stale portal entries from old persisted cache
  try {
    const raw = localStorage.getItem("PUBLIC_GOLD_QUERY_CACHE");
    if (raw) {
      const cache = JSON.parse(raw);
      if (
        cache?.clientState?.queries?.some(
          (q: { queryKey: unknown[] }) => q.queryKey[0] === "portal",
        )
      ) {
        cache.clientState.queries = cache.clientState.queries.filter(
          (q: { queryKey: unknown[] }) => q.queryKey[0] !== "portal",
        );
        localStorage.setItem("PUBLIC_GOLD_QUERY_CACHE", JSON.stringify(cache));
      }
    }
  } catch {}

  persistQueryClient({
    queryClient,
    persister,
    dehydrateOptions: {
      shouldDehydrateQuery: (query) => {
        const key = query.queryKey[0];
        // We only persist auth data. Agent profile data should be fresh from server.
        return key === "auth";
      },
    },
    maxAge: 1000 * 60 * 60 * 24,
  });
}
