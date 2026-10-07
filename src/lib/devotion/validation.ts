import { z } from "zod";

export const devotionSchema = z.object({
  scriptureReference: z
    .string()
    .trim()
    .min(1, "Choose or enter a Scripture reference.")
    .max(120, "Scripture reference is too long."),
  scriptureText: z
    .string()
    .trim()
    .max(1200, "Scripture text is too long."),
  observation: z
    .string()
    .trim()
    .min(1, "Write an observation.")
    .max(4000, "Observation is too long."),
  application: z
    .string()
    .trim()
    .min(1, "Write an application.")
    .max(4000, "Application is too long."),
  prayer: z
    .string()
    .trim()
    .min(1, "Write a prayer.")
    .max(4000, "Prayer is too long."),
  visibility: z.enum(["PUBLIC", "PRIVATE"]),
});
