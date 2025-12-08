// types/apod.ts
import { z } from "zod";

// Zod schema for the APOD form
export const apodFormSchema = z.object({
  date: z
    .string()
    .min(1, { message: "Constraints not satisfied" }) // message is mostly for RHF, tests still look for HeroUI text
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: "Invalid date format (YYYY-MM-DD).",
    }),
});

export type ApodFormData = z.infer<typeof apodFormSchema>;
