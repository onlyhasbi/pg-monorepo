import { queryOptions } from "@tanstack/react-query";

/**
 * Local State for Portal Security
 * Persisted to localStorage to survive reloads.
 */

const IS_UNLOCKED_KEY = "pg_portal_unlocked";

export const portalUnlockedOptions = () =>
  queryOptions({
    queryKey: ["portal", "unlocked"],
    initialData: () => {
      if (typeof window === "undefined") return false;
      return localStorage.getItem(IS_UNLOCKED_KEY) === "true";
    },
    staleTime: Infinity,
    gcTime: Infinity,
    queryFn: () => {
      if (typeof window === "undefined") return false;
      return localStorage.getItem(IS_UNLOCKED_KEY) === "true";
    },
  });

export const portalLockoutOptions = () =>
  queryOptions({
    queryKey: ["portal", "lockout"],
    initialData: null as number | null,
    staleTime: Infinity,
    gcTime: Infinity,
    queryFn: () => null,
  });

export const portalAttemptsOptions = () =>
  queryOptions({
    queryKey: ["portal", "attempts"],
    initialData: 0,
    staleTime: Infinity,
    gcTime: Infinity,
    queryFn: () => 0,
  });
