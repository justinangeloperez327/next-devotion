import { describe, expect, it } from "vitest";

import { isUuid } from "@/lib/id";
import { canViewDevotion } from "@/lib/privacy/access";
import {
  BIBLE_BOOKS,
  buildScriptureReference,
  getBibleBook,
} from "@/lib/scripture/books";

describe("devotion privacy policy", () => {
  it("allows authenticated viewers to read public devotions", () => {
    expect(
      canViewDevotion("viewer", {
        userId: "owner",
        visibility: "PUBLIC",
      }),
    ).toBe(true);
  });

  it("allows owners to read their private devotions", () => {
    expect(
      canViewDevotion("owner", {
        userId: "owner",
        visibility: "PRIVATE",
      }),
    ).toBe(true);
  });

  it("blocks other viewers from private devotions", () => {
    expect(
      canViewDevotion("viewer", {
        userId: "owner",
        visibility: "PRIVATE",
      }),
    ).toBe(false);
  });
});

describe("Scripture metadata", () => {
  it("contains all 66 canonical books", () => {
    expect(BIBLE_BOOKS).toHaveLength(66);
  });

  it("returns chapter metadata for a book", () => {
    expect(getBibleBook("Psalms")).toEqual({
      name: "Psalms",
      chapters: 150,
      testament: "Old Testament",
    });
  });

  it("builds chapter, verse, and verse-range references", () => {
    expect(
      buildScriptureReference({
        book: "John",
        chapter: "15",
      }),
    ).toBe("John 15");

    expect(
      buildScriptureReference({
        book: "John",
        chapter: "15",
        verseStart: "5",
      }),
    ).toBe("John 15:5");

    expect(
      buildScriptureReference({
        book: "Psalm",
        chapter: "23",
        verseStart: "1",
        verseEnd: "4",
      }),
    ).toBe("Psalm 23:1-4");
  });
});

describe("UUID validation", () => {
  it("accepts UUID-shaped identifiers", () => {
    expect(isUuid("550e8400-e29b-41d4-a716-446655440000")).toBe(true);
  });

  it("rejects malformed identifiers", () => {
    expect(isUuid("not-a-uuid")).toBe(false);
    expect(isUuid("550e8400-e29b-41d4-a716")).toBe(false);
  });
});
