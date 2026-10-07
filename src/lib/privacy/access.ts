export type DevotionVisibilityValue = "PUBLIC" | "PRIVATE";

export type DevotionAccessTarget = {
  userId: string;
  visibility: DevotionVisibilityValue;
};

export function canViewDevotion(
  viewerId: string,
  devotion: DevotionAccessTarget,
) {
  return devotion.visibility === "PUBLIC" || devotion.userId === viewerId;
}
