import { queryOptions } from "@tanstack/react-query";
import { queryClient } from "./queryClient";
import {
  getAdminProfileFn,
  getAgentData,
  getAgentsFn,
  getGoldPricesFn,
  getOverviewFn,
  getSettingsFn,
} from "@repo/services/api.functions";

/**
 * Query Options for Agent Data (PGBO)
 * Used on the public landing page.
 */
export const agentQueryOptions = (pgcode: string) =>
  queryOptions({
    queryKey: ["agent", pgcode],
    queryFn: async () => {
      const res = await getAgentData({ data: pgcode });
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

export const agentsListQueryOptions = () =>
  queryOptions({
    queryKey: ["agents"],
    queryFn: async () => {
      const res = await getAgentsFn();
      return res.data as Array<{
        pageid: string;
        nama_panggilan: string | null;
        foto_profil_url: string | null;
      }>;
    },
  });

/**
 * Query Options for Gold Prices
 * Used on primary public landing page.
 * Guaranteed fresh data as per user requirement.
 */
export const goldPricesQueryOptions = () =>
  queryOptions({
    queryKey: ["goldPrices"],
    queryFn: async () => {
      const res = await getGoldPricesFn();
      return res.data;
    },
    // Standardized: Market data needs revalidation but can be stale for a short bit during nav.
    staleTime: 2 * 60 * 1000,
    // Disable background updates to avoid excessive scraping
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    // Data remains in cache for 10 minutes (GC)
    gcTime: 10 * 60 * 1000,
  });

/**
 * Query Options for Dashboard Overview (Dealer)
 */
export const overviewQueryOptions = (search?: string, cookieStr?: string) =>
  queryOptions({
    queryKey: ["overview", search],
    queryFn: async () => {
      const res = await getOverviewFn({ data: { search, cookieStr } });
      return res.data;
    },
    staleTime: 2 * 60 * 1000,
  });

/**
 * Query Options for Dealer Profile/Settings
 * Consolidated as the Single Source of Truth for all dealer profile data.
 * Both settings and auth now share the exact same structure: { user, token }.
 */
export const settingsQueryOptions = (cookieStr?: string) =>
  queryOptions({
    queryKey: ["dealer", "profile"],
    queryFn: async () => {
      const res = await getSettingsFn({ data: { cookieStr } });
      return { user: res.data, token: null };
    },
    staleTime: Infinity,
  });

export const authDealerQueryOptions = settingsQueryOptions;

export const authAdminQueryOptions = (cookieStr?: string) =>
  queryOptions({
    queryKey: ["auth", "admin"],
    queryFn: async () => {
      const res = await getAdminProfileFn({ data: { cookieStr } });
      return { user: res.data, token: null };
    },
    staleTime: Infinity,
  });
