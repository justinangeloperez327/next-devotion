import { describe, expect, it } from "vitest";

import {
  decodeDateIdCursor,
  encodeDateIdCursor,
} from "@/lib/pagination";

const date = new Date("2026-10-07T10:30:00.000Z");
const id = "550e8400-e29b-41d4-a716-446655440000";

describe("date/id cursor", () => {
  it("round-trips a valid cursor", () => {
    const encoded = encodeDateIdCursor({
      createdAt: date,
      id,
    });

    expect(decodeDateIdCursor(encoded)).toEqual({
      createdAt: date,
      id,
    });
  });

  it("rejects malformed cursor payloads", () => {
    expect(decodeDateIdCursor("not-base64-json")).toBeNull();

    const invalidId = Buffer.from(
      JSON.stringify({
        createdAt: date.toISOString(),
        id: "bad-id",
      }),
      "utf8",
    ).toString("base64url");

    expect(decodeDateIdCursor(invalidId)).toBeNull();

    const invalidDate = Buffer.from(
      JSON.stringify({
        createdAt: "not-a-date",
        id,
      }),
      "utf8",
    ).toString("base64url");

    expect(decodeDateIdCursor(invalidDate)).toBeNull();
  });
});
