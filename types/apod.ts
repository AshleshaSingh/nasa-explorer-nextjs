// types/apod.ts
// zod schema + TypeScript type for the APOD date form

import { z } from "zod";

/**
 * APOD form reqs:
 * - date is required
 * - must be a valid date string
 * - must be between June 16, 1995 (first APOD) and today
 */
export const apodFormSchema = z.object({
  date: z
    .string()
    .min(1, "Please select a date.") // required + non-empty
    .refine((value) => {
      const parsed = new Date(value);
      if (Number.isNaN(parsed.getTime())) return false;

      const min = new Date("1995-06-16");
      const today = new Date();

      // normalize to midnight to be able to comapare
      min.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      parsed.setHours(0, 0, 0, 0);

      return parsed >= min && parsed <= today;
    }, {
      message: "Date must be between June 16, 1995 and today.",
    }),
});

/**
 * TS type inferred from the zod schema.
 */
export type ApodFormData = z.infer<typeof apodFormSchema>;
