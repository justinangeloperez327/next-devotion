import { describe, expect, it } from "vitest";

import { loginSchema, registerSchema } from "@/lib/auth/validation";

describe("authentication validation", () => {
  it("normalizes login email", () => {
    const result = loginSchema.parse({
      email: "  USER@Example.COM  ",
      password: "correct-horse",
    });

    expect(result.email).toBe("user@example.com");
  });

  it("normalizes registration username and email", () => {
    const result = registerSchema.parse({
      name: "Justin Perez",
      username: "  Justin.Perez  ",
      email: "  JUSTIN@example.com ",
      password: "password123",
      confirmPassword: "password123",
    });

    expect(result.username).toBe("justin.perez");
    expect(result.email).toBe("justin@example.com");
  });

  it("rejects mismatched registration passwords", () => {
    const result = registerSchema.safeParse({
      name: "Justin Perez",
      username: "justin",
      email: "justin@example.com",
      password: "password123",
      confirmPassword: "password456",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.flatten().fieldErrors.confirmPassword?.[0]).toBe(
        "Passwords do not match.",
      );
    }
  });

  it("rejects invalid usernames and short passwords", () => {
    const result = registerSchema.safeParse({
      name: "Justin Perez",
      username: "bad username",
      email: "justin@example.com",
      password: "short",
      confirmPassword: "short",
    });

    expect(result.success).toBe(false);
  });
});
