import { describe, expect, it } from "vitest";
import { calculateAge, cn, extractDataFromNIK } from "../utils";

describe("extractDataFromNIK", () => {
  it("parses a valid male NIK correctly", () => {
    // NIK digit 7-8 = day (01-31 for male), 9-10 = month, 11-12 = year
    const result = extractDataFromNIK("320507150900001");
    expect(result.validFormat).toBe(true);
    expect(result.gender).toBe("Laki-laki");
    expect(result.dateOfBirth).toBeDefined();
  });

  it("parses a valid female NIK (day > 40)", () => {
    // Female NIK: day digit has +40 added. e.g., day 15 stored as 55
    const result = extractDataFromNIK("320507550900001");
    expect(result.validFormat).toBe(true);
    expect(result.gender).toBe("Perempuan");
    expect(result.dateOfBirth).toContain("-15"); // 55 - 40 = 15
  });

  it("returns invalid for short input", () => {
    const result = extractDataFromNIK("12345");
    expect(result.validFormat).toBe(false);
    expect(result.gender).toBeUndefined();
    expect(result.dateOfBirth).toBeUndefined();
  });

  it("handles century boundary correctly", () => {
    // Year 99 → should be 1999 (not 2099)
    const result = extractDataFromNIK("320507150199001");
    expect(result.validFormat).toBe(true);
    expect(result.dateOfBirth).toContain("1999");
  });

  it("handles year 00 as 2000", () => {
    const result = extractDataFromNIK("320507150100001");
    expect(result.validFormat).toBe(true);
    expect(result.dateOfBirth).toContain("2000");
  });

  it("pads single-digit day and month", () => {
    // Day 5, Month 3 → should pad to "05" and "03"
    const result = extractDataFromNIK("320507050300001");
    expect(result.validFormat).toBe(true);
    expect(result.dateOfBirth).toMatch(/\d{4}-03-05/);
  });
});

describe("calculateAge", () => {
  it("returns correct age for a past date", () => {
    const tenYearsAgo = new Date();
    tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);
    tenYearsAgo.setMonth(0, 1); // Jan 1 to ensure birthday has passed
    const dob = tenYearsAgo.toISOString().split("T")[0];

    const age = calculateAge(dob);
    expect(age).toBe(10);
  });

  it("returns 0 for empty string", () => {
    expect(calculateAge("")).toBe(0);
  });

  it("subtracts 1 year if birthday hasn't occurred yet", () => {
    const futureThisYear = new Date();
    futureThisYear.setMonth(futureThisYear.getMonth() + 2);
    futureThisYear.setFullYear(futureThisYear.getFullYear() - 25);
    const dob = futureThisYear.toISOString().split("T")[0];

    const age = calculateAge(dob);
    expect(age).toBe(24); // birthday hasn't happened yet
  });
});

describe("cn", () => {
  it("merges class names", () => {
    const result = cn("text-red-500", "font-bold");
    expect(result).toContain("text-red-500");
    expect(result).toContain("font-bold");
  });

  it("resolves Tailwind conflicts (last wins)", () => {
    const result = cn("text-red-500", "text-blue-500");
    expect(result).toBe("text-blue-500");
    expect(result).not.toContain("text-red-500");
  });

  it("handles falsy values", () => {
    const result = cn("base", false && "conditional", null, undefined);
    expect(result).toBe("base");
  });
});
