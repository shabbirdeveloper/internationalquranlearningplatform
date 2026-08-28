import { describe, expect, it } from "vitest";

import { applyDialCode, normalizeCountries } from "@/lib/countries";

describe("country helpers", () => {
  it("normalizes and sorts API country records", () => {
    expect(normalizeCountries([
      { name: "Pakistan", alpha2Code: "pk", flag: "🇵🇰", callingCodes: ["92"] },
      { name: "Malaysia", alpha2Code: "MY", flag: "🇲🇾", callingCodes: ["+60"] },
      { name: "Invalid" },
    ])).toEqual([
      { name: "Malaysia", iso2: "MY", flag: "🇲🇾", dialCode: "60" },
      { name: "Pakistan", iso2: "PK", flag: "🇵🇰", dialCode: "92" },
    ]);
  });

  it("adds and replaces an international dialing prefix", () => {
    expect(applyDialCode("0123456789", "60")).toBe("+60123456789");
    expect(applyDialCode("+60123456789", "92", "60")).toBe("+92123456789");
    expect(applyDialCode("+44123456789", "60")).toBe("+44123456789");
  });
});
