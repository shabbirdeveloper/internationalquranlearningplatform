import { describe, expect, it } from "vitest";

import { loginFormSchema } from "@/features/auth/schemas";

describe("login form schema", () => {
  it("accepts a valid localized login", () => {
    const result = loginFormSchema.safeParse({
      email: "learner@example.com",
      password: "correct-horse-battery-staple",
      locale: "ar",
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid email, empty password, and unsupported locale", () => {
    const result = loginFormSchema.safeParse({
      email: "not-an-email",
      password: "",
      locale: "fr",
    });

    expect(result.success).toBe(false);
  });
});
