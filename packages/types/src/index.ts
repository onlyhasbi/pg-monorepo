/**
 * Shared type definitions for the Public Gold frontend monorepo.
 * All interfaces represent API response shapes and shared data contracts.
 */

// ─── PGBO (Dealer Landing Page) ───────────────────────────────────

export interface PgboData {
  id: string;
  pgcode: string;
  pageid: string;
  nama_lengkap?: string;
  nama_panggilan?: string;
  no_telpon?: string;
  foto_profil_url?: string;
  link_group_whatsapp?: string;
  link_group_edukasi?: string;
  sosmed_instagram?: string;
  sosmed_tiktok?: string;
  sosmed_facebook?: string;
  is_active: boolean;
  created_at: string;
  [key: string]: unknown;
}

// ─── Agent (Public-Facing Dealer Data) ────────────────────────────

export interface AgentData {
  pgcode: string;
  nama_lengkap: string;
  pageid: string;
  no_telpon?: string;
  foto_profil_url?: string;
  link_group_whatsapp?: string;
  link_group_edukasi?: string;
}

// ─── Gold Prices ──────────────────────────────────────────────────

export interface GoldPrice {
  type: string;
  weight: number;
  buy_price: number;
  sell_price: number;
}

// ─── Dashboard Overview ───────────────────────────────────────────

export interface OverviewData {
  total_pengunjung: number;
  total_pendaftar: number;
  total_klik_whatsapp: number;
  tabel_pendaftar_terbaru: Array<Record<string, unknown>>;
}

// ─── User Settings ────────────────────────────────────────────────

export interface UserSettings {
  pgcode: string;
  pageid: string;
  nama_lengkap: string;
  no_telpon: string;
  foto_profil_url?: string;
}

// ─── Auth ─────────────────────────────────────────────────────────

export interface AuthData {
  user: UserSettings;
  token: string | null;
}

// ─── Registration ─────────────────────────────────────────────────

export interface RegisterTrackPayload {
  pageid: string;
  nama: string;
  branch: string;
  no_telpon: string;
}

export interface SignupPayload {
  pgcode: string;
  katasandi: string;
  pageid: string;
  country_code?: string;
  no_telpon: string;
  nama_lengkap?: string;
}

// ─── Referral ─────────────────────────────────────────────────────

export interface ReferralData {
  pgcode: string;
  pageid: string;
  nama_lengkap: string;
}

// ─── Admin Secret Code ───────────────────────────────────────────

export interface SecretCodeData {
  code: string;
  auto_rotate: boolean;
}

// ─── API Response ─────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success?: boolean;
}

// ─── Gold Prices (Pricelist UI) ──────────────────────────────────

export interface PriceListItem {
  label: string;
  price: string | null;
}

export interface PriceListResult {
  poe: PriceListItem[];
  dinar: PriceListItem[];
  goldbar: PriceListItem[];
}

// ─── Re-exports from sub-modules ─────────────────────────────────

export type { ApiErrorResponse, AuthResponse, MutationResponse } from "./api";
export type { FormSummaryItem } from "./forms";
export type { CloudinaryOptions } from "./images";
