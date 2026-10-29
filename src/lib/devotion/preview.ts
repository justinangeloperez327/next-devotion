/** Bound feed excerpts by Unicode code points; detail pages always render full text. */
export function devotionPreview(text: string, limit = 240) {
  const characters = Array.from(text);
  return characters.length > limit ? `${characters.slice(0, limit).join("").trimEnd()}…` : text;
}
