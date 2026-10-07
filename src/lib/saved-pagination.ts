import { isUuid } from "@/lib/id";

export type SavedCursor = {
  createdAt: Date;
  devotionId: string;
};

type SerializedSavedCursor = {
  createdAt: string;
  devotionId: string;
};

export function encodeSavedCursor(cursor: SavedCursor) {
  const payload: SerializedSavedCursor = {
    createdAt: cursor.createdAt.toISOString(),
    devotionId: cursor.devotionId,
  };

  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}

export function decodeSavedCursor(value: string | undefined) {
  if (!value) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(value, "base64url").toString("utf8"),
    ) as Partial<SerializedSavedCursor>;

    if (
      typeof payload.createdAt !== "string" ||
      typeof payload.devotionId !== "string" ||
      !isUuid(payload.devotionId)
    ) {
      return null;
    }

    const createdAt = new Date(payload.createdAt);

    if (Number.isNaN(createdAt.getTime())) {
      return null;
    }

    return {
      createdAt,
      devotionId: payload.devotionId,
    } satisfies SavedCursor;
  } catch {
    return null;
  }
}
