import { isUuid } from "@/lib/id";

export type FeedCursor = {
  createdAt: Date;
  id: string;
};

type SerializedFeedCursor = {
  createdAt: string;
  id: string;
};

export function encodeFeedCursor(cursor: FeedCursor) {
  const payload: SerializedFeedCursor = {
    createdAt: cursor.createdAt.toISOString(),
    id: cursor.id,
  };

  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}

export function decodeFeedCursor(value: string | undefined) {
  if (!value) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(value, "base64url").toString("utf8"),
    ) as Partial<SerializedFeedCursor>;

    if (
      typeof payload.createdAt !== "string" ||
      typeof payload.id !== "string" ||
      !isUuid(payload.id)
    ) {
      return null;
    }

    const createdAt = new Date(payload.createdAt);

    if (Number.isNaN(createdAt.getTime())) {
      return null;
    }

    return {
      createdAt,
      id: payload.id,
    } satisfies FeedCursor;
  } catch {
    return null;
  }
}
