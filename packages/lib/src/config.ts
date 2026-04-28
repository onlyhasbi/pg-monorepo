/**
 * GLOBAL CONFIGURATION
 * Centralized point for environment-specific variables and site metadata.
 */

export const API_URL =
  typeof window !== "undefined"
    ? "/api"
    : process.env.API_URL || "http://localhost:3001/api";

export const SITE_URL =
  typeof window !== "undefined"
    ? window.location.origin
    : process.env.VITE_SITE_URL || "https://mypublicgold.id";
