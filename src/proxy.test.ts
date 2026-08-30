import { unstable_doesMiddlewareMatch } from "next/experimental/testing/server";
import { describe, expect, it } from "vitest";

import { config } from "./proxy";

describe("proxy matcher", () => {
  it("keeps public files outside locale redirects", () => {
    for (const url of [
      "/audio/surah-al-alaq.mp3",
      "/images/brand/logo.png",
      "/favicon.ico",
    ]) {
      expect(
        unstable_doesMiddlewareMatch({ config, nextConfig: {}, url })
      ).toBe(false);
    }
  });

  it("continues matching localized and unlocalized pages", () => {
    expect(
      unstable_doesMiddlewareMatch({ config, nextConfig: {}, url: "/" })
    ).toBe(true);
    expect(
      unstable_doesMiddlewareMatch({ config, nextConfig: {}, url: "/en/courses" })
    ).toBe(true);
  });
});
