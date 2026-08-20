import { z } from "zod";

import { locales } from "@/i18n/config";

const optionalTrimmedText = (maximum: number) =>
  z
    .string()
    .trim()
    .max(maximum)
    .transform((value) => (value.length === 0 ? null : value));

const countryCodeSchema = z
  .string()
  .trim()
  .toUpperCase()
  .refine((value) => value === "" || /^[A-Z]{2}$/.test(value), {
    message: "Use a two-letter country code.",
  })
  .transform((value) => (value.length === 0 ? null : value));

const timeZoneSchema = z.string().trim().min(1).max(100).superRefine((value, context) => {
  try {
    new Intl.DateTimeFormat("en", { timeZone: value }).format();
  } catch {
    context.addIssue({ code: "custom", message: "Use a valid IANA time zone." });
  }
});

export const portalKindSchema = z.enum(["student", "parent", "teacher", "staff", "admin"]);

export const coreProfileFormSchema = z.object({
  locale: z.enum(locales),
  portal: portalKindSchema,
  fullName: z.string().trim().min(2).max(160),
  phoneE164: z
    .string()
    .trim()
    .refine((value) => value === "" || /^\+[1-9][0-9]{7,14}$/.test(value), {
      message: "Use international format, for example +60123456789.",
    })
    .transform((value) => (value.length === 0 ? null : value)),
  preferredLocale: z.enum(["en", "ur", "ar", "fa"]),
  timeZone: timeZoneSchema,
  countryCode: countryCodeSchema,
});

export const studentProfileFormSchema = z.object({
  locale: z.enum(locales),
  dateOfBirth: z
    .string()
    .trim()
    .refine((value) => value === "" || /^\d{4}-\d{2}-\d{2}$/.test(value), {
      message: "Use a valid date.",
    })
    .refine((value) => value === "" || new Date(`${value}T00:00:00Z`) <= new Date(), {
      message: "Date of birth cannot be in the future.",
    })
    .transform((value) => (value.length === 0 ? null : value)),
  gender: z.enum(["male", "female", "not_specified"]),
  guardianRequired: z.boolean(),
});

export const parentProfileFormSchema = z.object({
  locale: z.enum(locales),
  occupation: optionalTrimmedText(160),
  preferredContactChannel: z.enum(["email", "phone", "whatsapp", "in_app"]),
});

const availabilitySlotSchema = z
  .object({
    weekday: z.coerce.number().int().min(0).max(6),
    start_time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
    end_time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
    time_zone: timeZoneSchema,
  })
  .refine((slot) => slot.end_time > slot.start_time, {
    message: "End time must be after the start time.",
    path: ["end_time"],
  });

export const teacherProfileFormSchema = z.object({
  locale: z.enum(locales),
  biography: z.string().trim().min(20).max(5000),
  gender: z.enum(["male", "female", "not_specified"]),
  countryCode: countryCodeSchema.refine((value) => value !== null, {
    message: "Country is required.",
  }),
  educationSummary: z.string().trim().min(2).max(3000),
  hawzaQualifications: optionalTrimmedText(3000),
  teachingExperienceYears: z.coerce.number().int().min(0).max(80),
  preferredStudentAgeGroups: z
    .array(z.enum(["children", "teens", "adults"]))
    .max(3),
  languageCodes: z
    .array(z.enum(["en", "ur", "ar", "fa"]))
    .min(1)
    .max(4),
  availability: z.array(availabilitySlotSchema).min(1).max(21),
});

export const parentLinkRequestSchema = z.object({
  locale: z.enum(locales),
  studentNumber: z.string().trim().min(3).max(64),
  relationship: z.string().trim().min(2).max(80),
});

export const teacherDocumentSchema = z.object({
  documentType: z.enum([
    "identity",
    "qualification",
    "hawza_certificate",
    "reference",
    "other",
  ]),
  objectPath: z
    .string()
    .min(8)
    .max(500)
    .refine((value) => !value.startsWith("/") && !value.includes("..")),
  originalFilename: z.string().min(1).max(240),
  contentType: z.enum(["application/pdf", "image/jpeg", "image/png"]),
  sizeBytes: z.number().int().min(1).max(5_242_880),
});

export const branchFormSchema = z.object({
  locale: z.enum(locales),
  code: z.string().trim().toUpperCase().regex(/^[A-Z][A-Z0-9_-]{1,31}$/),
  name: z.string().trim().min(2).max(120),
  timeZone: timeZoneSchema,
});

export const staffAssignmentSchema = z.object({
  locale: z.enum(locales),
  email: z.string().trim().email().max(320),
  branchId: z.string().uuid(),
  roleKey: z.enum([
    "admission_officer",
    "academic_coordinator",
    "finance_manager",
    "support_agent",
    "content_manager",
    "branch_manager",
  ]),
  jobTitle: optionalTrimmedText(120),
});

export const reviewParentLinkSchema = z.object({
  locale: z.enum(locales),
  linkId: z.string().uuid(),
  decision: z.enum(["active", "rejected"]),
});

export const reviewTeacherApplicationSchema = z.object({
  locale: z.enum(locales),
  applicationId: z.string().uuid(),
  nextStatus: z.enum([
    "documents_under_review",
    "information_requested",
    "interview_scheduled",
    "interview_completed",
    "demo_scheduled",
    "demo_evaluated",
    "reference_verification",
    "approved",
    "rejected",
    "suspended",
  ]),
  notes: optionalTrimmedText(5000),
});

export type CoreProfileFormInput = z.input<typeof coreProfileFormSchema>;
export type StudentProfileFormInput = z.input<typeof studentProfileFormSchema>;
export type ParentProfileFormInput = z.input<typeof parentProfileFormSchema>;
export type TeacherProfileFormInput = z.input<typeof teacherProfileFormSchema>;
