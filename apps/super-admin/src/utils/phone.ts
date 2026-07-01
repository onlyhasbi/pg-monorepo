import { dialCodeOptions } from "@repo/constant/countries";

/**
 * Parses a raw phone number string into country code and local number.
 * Uses dialCodeOptions for robust matching instead of hardcoded country codes.
 * Tries longest match first to avoid ambiguity (e.g., "60" vs "6").
 */
export function parsePhoneNumber(rawPhone: string): {
  countryCode: string;
  localNumber: string;
} {
  if (!rawPhone) return { countryCode: "62", localNumber: "" };

  // Sort dial codes by length (longest first) for greedy matching
  const sorted = dialCodeOptions
    .map((o) => o.value)
    .sort((a, b) => b.length - a.length);

  for (const code of sorted) {
    if (rawPhone.startsWith(code)) {
      return {
        countryCode: code,
        localNumber: rawPhone.substring(code.length),
      };
    }
  }

  // Fallback: assume Indonesian
  return { countryCode: "62", localNumber: rawPhone };
}
