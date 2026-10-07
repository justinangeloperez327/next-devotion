import { describe, expect, it } from "vitest";

import { commentSchema } from "@/lib/comment/validation";
import { profileSchema } from "@/lib/profile/validation";

describe("comment validation", () => {
  it("trims valid comments", () => {
    const result = commentSchema.parse({
      body: "  Thank you for sharing this reflection.  ",
    });

    expect(result.body).toBe("Thank you for sharing this reflection.");
  });

  it("rejects empty and oversized comments", () => {
    expect(commentSchema.safeParse({ body: "   " }).success).toBe(false);
    expect(commentSchema.safeParse({ body: "x".repeat(2001) }).success).toBe(
      false,
    );
  });
});

describe("profile validation", () => {
  it("accepts an empty avatar URL", () => {
    const result = profileSchema.safeParse({
      name: "Justin Perez",
      bio: "",
      avatarUrl: "",
    });

    expect(result.success).toBe(true);
  });

  it("accepts HTTPS avatar URLs", () => {
    const result = profileSchema.parse({
      name: "Justin Perez",
      bio: "Daily Scripture and reflection.",
      avatarUrl: "https://example.com/avatar.jpg",
    });

    expect(result.avatarUrl).toBe("https://example.com/avatar.jpg");
  });

  it("rejects non-HTTPS avatar URLs", () => {
    const result = profileSchema.safeParse({
      name: "Justin Perez",
      bio: "",
      avatarUrl: "http://example.com/avatar.jpg",
    });

    expect(result.success).toBe(false);
  });

  it("enforces the bio length limit", () => {
    const result = profileSchema.safeParse({
      name: "Justin Perez",
      bio: "x".repeat(281),
      avatarUrl: "",
    });

    expect(result.success).toBe(false);
  });
});
