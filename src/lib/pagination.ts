import { isUuid } from "@/lib/id";

export type DateIdCursor = {
  createdAt: Date;
  id: string;
};

type SerializedDateIdCursor = {
  createdAt: string;
  id: string;
};

export function encodeDateIdCursor(cursor: DateIdCursor) {
  const payload: SerializedDateIdCursor = {
    createdAt: cursor.createdAt.toISOString(),
    id: cursor.id,
  };

  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}

export function decodeDateIdCursor(value: string | undefined) {
  if (!value) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(value, "base64url").toString("utf8"),
    ) as Partial<SerializedDateIdCursor>;

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
    } satisfies DateIdCursor;
  } catch {
    return null;
  }
}
