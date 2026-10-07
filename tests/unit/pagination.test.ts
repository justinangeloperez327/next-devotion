import { describe, expect, it } from "vitest";

import {
  decodeFeedCursor,
  encodeFeedCursor,
} from "@/lib/feed-pagination";
import {
  decodeJournalCursor,
  encodeJournalCursor,
} from "@/lib/journal-pagination";
import {
  decodeSavedCursor,
  encodeSavedCursor,
} from "@/lib/saved-pagination";

const date = new Date("2026-10-07T10:30:00.000Z");
const id = "550e8400-e29b-41d4-a716-446655440000";

describe("feed cursor", () => {
  it("round-trips a valid cursor", () => {
    const encoded = encodeFeedCursor({
      createdAt: date,
      id,
    });

    expect(decodeFeedCursor(encoded)).toEqual({
      createdAt: date,
      id,
    });
  });

  it("rejects malformed cursor payloads", () => {
    expect(decodeFeedCursor("not-base64-json")).toBeNull();

    const invalid = Buffer.from(
      JSON.stringify({
        createdAt: date.toISOString(),
        id: "bad-id",
      }),
      "utf8",
    ).toString("base64url");

    expect(decodeFeedCursor(invalid)).toBeNull();
  });
});

describe("journal cursor", () => {
  it("round-trips a valid cursor", () => {
    const encoded = encodeJournalCursor({
      createdAt: date,
      id,
    });

    expect(decodeJournalCursor(encoded)).toEqual({
      createdAt: date,
      id,
    });
  });

  it("rejects invalid dates", () => {
    const invalid = Buffer.from(
      JSON.stringify({
        createdAt: "not-a-date",
        id,
      }),
      "utf8",
    ).toString("base64url");

    expect(decodeJournalCursor(invalid)).toBeNull();
  });
});

describe("saved cursor", () => {
  it("round-trips a valid cursor", () => {
    const encoded = encodeSavedCursor({
      createdAt: date,
      devotionId: id,
    });

    expect(decodeSavedCursor(encoded)).toEqual({
      createdAt: date,
      devotionId: id,
    });
  });

  it("rejects malformed devotion IDs", () => {
    const invalid = Buffer.from(
      JSON.stringify({
        createdAt: date.toISOString(),
        devotionId: "bad-id",
      }),
      "utf8",
    ).toString("base64url");

    expect(decodeSavedCursor(invalid)).toBeNull();
  });
});
