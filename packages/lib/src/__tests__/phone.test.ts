import { describe, expect, it } from "vitest";
import { formatPhoneForAPI } from "../phone";

describe("formatPhoneForAPI", () => {
  it("combines dial code and phone number", () => {
    const result = formatPhoneForAPI("62", "81234567890");
    expect(result).toBe("6281234567890");
  });

  it("strips leading zeros from phone number", () => {
    const result = formatPhoneForAPI("62", "081234567890");
    expect(result).toBe("6281234567890");
  });

  it("strips multiple leading zeros", () => {
    const result = formatPhoneForAPI("62", "00081234567890");
    expect(result).toBe("6281234567890");
  });

  it("strips non-digit characters", () => {
    const result = formatPhoneForAPI("60", "12-345 678");
    expect(result).toBe("6012345678");
  });

  it("returns undefined for empty phone number", () => {
    const result = formatPhoneForAPI("62", "");
    expect(result).toBeUndefined();
  });

  it("returns dial code only for whitespace-only input (digits stripped)", () => {
    // whitespace is truthy but stripped by /\D/g → becomes empty local
    const result = formatPhoneForAPI("62", "   ");
    expect(result).toBe("62");
  });

  it("works with Malaysian dial code", () => {
    const result = formatPhoneForAPI("60", "123456789");
    expect(result).toBe("60123456789");
  });
});
