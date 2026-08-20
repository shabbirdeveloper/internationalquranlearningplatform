import { z } from "zod";

import { locales } from "@/i18n/config";

const requiredText = (label: string, max = 2000) => z.string().trim().min(1, `${label} is required.`).max(max);
const base = { fullName: requiredText("Full name", 120), email: z.string().trim().email(), phone: z.string().trim().max(40), locale: z.enum(locales) };

export const trialRequestSchema = z.object({ ...base, country: requiredText("Country", 100), timeZone: requiredText("Time zone", 100), learnerAge: requiredText("Learner age", 40), courseSlug: z.string().trim().max(100).optional(), teacherPreference: z.string().trim().max(60).optional(), goals: requiredText("Learning goals"), schedule: requiredText("Preferred schedule", 1000) });
export const contactRequestSchema = z.object({ ...base, phone: z.string().trim().max(40).optional(), subject: requiredText("Subject", 120), message: requiredText("Message", 5000) });
export const tutorRequestSchema = z.object({ ...base, country: requiredText("Country", 100), subjects: requiredText("Teaching subjects", 1000), languages: requiredText("Teaching languages", 500), experience: requiredText("Teaching experience", 2000), qualifications: requiredText("Qualifications", 2000), availability: requiredText("Availability", 1000), biography: requiredText("Biography", 3000) });

export type PublicRequestState = { status?: "SUCCESS" | "ERROR" | "UNAVAILABLE"; reference?: string; fieldErrors?: Record<string, string[]> };
