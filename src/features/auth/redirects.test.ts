import { describe, expect, it } from "vitest";

import { getSafeAuthNextPath } from "@/features/auth/redirects";

describe("auth callback redirect validation", () => {
  it("allows a path within the active locale", () => {
    expect(getSafeAuthNextPath("/ar/student", "ar")).toBe("/ar/student");
  });

  it.each([
    "//attacker.example",
    "/\\attacker.example",
    "/en/../ar/admin",
    "/arbitrary",
    "https://attacker.example",
  ])("rejects unsafe or cross-locale destination %s", (destination) => {
    expect(getSafeAuthNextPath(destination, "en")).toBe("/en");
  });

  it("uses English for an unsupported locale", () => {
    expect(getSafeAuthNextPath("/fr/student", "fr")).toBe("/en");
  });
});
