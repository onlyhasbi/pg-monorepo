import { describe, expect, it } from "vitest";
import { getWhatsAppLink } from "../contact";

describe("getWhatsAppLink", () => {
  it("returns group link when preferGroup is true and group link exists", () => {
    const result = getWhatsAppLink(
      {
        link_group_whatsapp: "https://chat.whatsapp.com/abc123",
        no_telpon: "6281234567890",
      },
      true,
    );
    expect(result).toBe("https://chat.whatsapp.com/abc123");
  });

  it("returns wa.me link when preferGroup is false and phone exists", () => {
    const result = getWhatsAppLink(
      {
        link_group_whatsapp: "https://chat.whatsapp.com/abc123",
        no_telpon: "6281234567890",
      },
      false,
    );
    expect(result).toContain("wa.me/6281234567890");
  });

  it("falls back to phone when no group link exists and preferGroup is true", () => {
    const result = getWhatsAppLink(
      {
        no_telpon: "6281234567890",
      },
      true,
    );
    expect(result).toContain("wa.me/6281234567890");
  });

  it("returns fallback support number when no data provided", () => {
    const result = getWhatsAppLink();
    expect(result).toContain("wa.me/628979901844");
  });

  it("returns fallback when data is empty object", () => {
    const result = getWhatsAppLink({});
    expect(result).toContain("wa.me/628979901844");
  });
});
