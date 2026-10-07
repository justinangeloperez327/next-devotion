import { z } from "zod";

export const commentSchema = z.object({
  body: z
    .string()
    .trim()
    .min(1, "Write a comment before posting.")
    .max(2000, "Keep comments to 2,000 characters or fewer."),
});
