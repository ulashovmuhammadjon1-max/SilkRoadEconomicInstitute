import { z } from "zod";
import { COUNTRY_CODES } from "./countries";

/** Shared by the browser (instant feedback) and the server (the real check). */
export const MIN_AGE = 13;
export const ADULT_AGE = 18;
export const currentYear = () => new Date().getUTCFullYear();

/** The youngest a person born in `year` can be right now. */
export const minAgeForBirthYear = (year: number) => currentYear() - year - 1;
export const isTooYoung = (year: number) => minAgeForBirthYear(year) < MIN_AGE;
export const needsGuardian = (year: number) => minAgeForBirthYear(year) < ADULT_AGE;

export const profileSchema = z
  .object({
    fullName: z.string().trim().min(2, "Please enter your full name.").max(120, "That name is too long."),
    country: z.enum(COUNTRY_CODES, { message: "Please choose a country." }),
    institution: z.string().trim().min(2, "Please enter your school or university.").max(160, "That's too long."),
    educationLevel: z.enum(["high_school", "undergraduate", "graduate"], { message: "Please choose your level." }),
    birthYear: z.coerce
      .number({ message: "Please enter the year you were born." })
      .int("Please enter a year like 2008.")
      .min(1900, "Please enter a valid year.")
      .max(currentYear(), "Please enter a valid year."),
    telegram: z
      .string()
      .trim()
      .regex(/^(@?[A-Za-z0-9_]{5,32})?$/, "A Telegram username has 5–32 letters, digits or underscores.")
      .optional()
      .transform((v) => (v ? v : null)),
    bio: z
      .string()
      .trim()
      .max(500, "Please keep it under 500 characters.")
      .optional()
      .transform((v) => (v ? v : null)),
    guardianConfirmed: z.boolean().optional(),
    guardianEmail: z
      .string()
      .trim()
      .optional()
      .transform((v) => (v ? v.toLowerCase() : null))
      .refine((v) => v === null || z.email().safeParse(v).success, "Please enter a valid email, or leave it empty."),
  })
  .superRefine((v, ctx) => {
    if (isTooYoung(v.birthYear)) {
      ctx.addIssue({ code: "custom", path: ["birthYear"], message: `You need to be at least ${MIN_AGE} to create an account.` });
    } else if (needsGuardian(v.birthYear) && !v.guardianConfirmed) {
      ctx.addIssue({ code: "custom", path: ["guardianConfirmed"], message: "Because you are under 18, please confirm that a parent or guardian knows and agrees." });
    }
  });

export type ProfileInput = z.input<typeof profileSchema>;

export const newsletterSchema = z.object({
  email: z.email("Please enter a valid email address.").transform((v) => v.trim().toLowerCase()),
});
