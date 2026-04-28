export interface ContactData {
  no_telpon?: string | null;
  link_group_whatsapp?: string | null;
}

const SUPPORT_WHATSAPP = "628979901844";

/**
 * Derives the best WhatsApp link for a dealer based on their settings in the backend.
 * Priority:
 * 1. WhatsApp Group Link (if provided and valid)
 * 2. Direct WhatsApp chat (wa.me) using no_telpon
 * 3. Fallback to global support number
 */
export function getWhatsAppLink(
  data?: ContactData | null,
  preferGroup: boolean = false,
): string {
  // 1. WhatsApp Group Link (ONLY if preferGroup is true)
  if (
    preferGroup &&
    data?.link_group_whatsapp &&
    data.link_group_whatsapp.trim().startsWith("http")
  ) {
    return data.link_group_whatsapp.trim();
  }

  // 2. Secondary: Direct Chat
  if (data?.no_telpon) {
    const cleaned = data.no_telpon.replace(/\D/g, "");
    if (cleaned) {
      return `https://wa.me/${cleaned}`;
    }
  }

  // 3. Fallback: Support Number
  return `https://wa.me/${SUPPORT_WHATSAPP}`;
}
