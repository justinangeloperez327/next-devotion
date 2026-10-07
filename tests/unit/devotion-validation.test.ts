import { describe, expect, it } from "vitest";

import { devotionSchema } from "@/lib/devotion/validation";

const validDevotion = {
  scriptureReference: "John 15:5",
  scriptureText: "I am the vine; you are the branches.",
  observation: "Remaining connected to Christ is central to fruitful living.",
  application: "Begin the day in Scripture before opening work messages.",
  prayer: "Help me remain in You today.",
  visibility: "PUBLIC" as const,
};

describe("devotion validation", () => {
  it("accepts and trims a complete devotion", () => {
    const result = devotionSchema.parse({
      ...validDevotion,
      scriptureReference: "  John 15:5  ",
      observation: "  Observe carefully.  ",
    });

    expect(result.scriptureReference).toBe("John 15:5");
    expect(result.observation).toBe("Observe carefully.");
  });

  it("allows an empty Scripture text when a reference is present", () => {
    const result = devotionSchema.safeParse({
      ...validDevotion,
      scriptureText: "",
    });

    expect(result.success).toBe(true);
  });

  it("requires every SOAP response field", () => {
    const result = devotionSchema.safeParse({
      ...validDevotion,
      observation: "",
      application: "",
      prayer: "",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      expect(errors.observation).toBeDefined();
      expect(errors.application).toBeDefined();
      expect(errors.prayer).toBeDefined();
    }
  });

  it("rejects unsupported visibility values", () => {
    const result = devotionSchema.safeParse({
      ...validDevotion,
      visibility: "FRIENDS",
    });

    expect(result.success).toBe(false);
  });
});
