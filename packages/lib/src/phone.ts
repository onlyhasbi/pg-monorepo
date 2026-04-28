/**
 * Consistent phone number formatting for API submission.
 * Strips leading zeros and prepends the dial code.
 */
export function formatPhoneForAPI(dialCode: string, phoneNumber: string) {
  if (!phoneNumber) return undefined;

  // Strip non-digits and leading zeros
  const cleaned = phoneNumber.replace(/\D/g, "").replace(/^0+/, "");

  return `${dialCode}${cleaned}`;
}
