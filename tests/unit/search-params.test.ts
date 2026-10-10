import { describe, expect, it } from "vitest";

import { firstSearchParam } from "@/lib/search-params";

describe("search parameter normalization", () => {
  it("returns a scalar value unchanged", () => {
    expect(firstSearchParam("value")).toBe("value");
  });

  it("uses the first value from repeated parameters", () => {
    expect(firstSearchParam(["first", "second"])).toBe("first");
  });

  it("preserves an absent parameter", () => {
    expect(firstSearchParam(undefined)).toBeUndefined();
  });
});
