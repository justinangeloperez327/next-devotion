import { z } from "zod";

const avatarUrlSchema = z
  .string()
  .trim()
  .max(2048, "Avatar URL is too long.")
  .refine(
    (value) => {
      if (!value) {
        return true;
      }

      try {
        const url = new URL(value);
        return url.protocol === "https:";
      } catch {
        return false;
      }
    },
    "Use a valid HTTPS image URL.",
  );

export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Enter your name.")
    .max(80, "Name is too long."),
  bio: z
    .string()
    .trim()
    .max(280, "Bio must be 280 characters or fewer."),
  avatarUrl: avatarUrlSchema,
});
