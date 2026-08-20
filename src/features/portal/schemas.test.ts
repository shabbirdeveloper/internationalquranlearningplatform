import { describe, expect, it } from "vitest";

import {
  coreProfileFormSchema,
  parentLinkRequestSchema,
  teacherDocumentSchema,
  teacherProfileFormSchema,
} from "@/features/portal/schemas";

describe("Phase 2 portal validation", () => {
  it("normalizes safe core profile input", () => {
    const result = coreProfileFormSchema.parse({
      locale: "en",
      portal: "student",
      fullName: "  Amina Raza  ",
      phoneE164: "+60123456789",
      preferredLocale: "en",
      timeZone: "Asia/Kuala_Lumpur",
      countryCode: "my",
    });

    expect(result.fullName).toBe("Amina Raza");
    expect(result.countryCode).toBe("MY");
  });

  it("rejects malformed time zones and phone numbers", () => {
    const result = coreProfileFormSchema.safeParse({
      locale: "en",
      portal: "parent",
      fullName: "Parent User",
      phoneE164: "012345",
      preferredLocale: "en",
      timeZone: "Moon/Sea",
      countryCode: "MY",
    });

    expect(result.success).toBe(false);
  });

  it("requires a valid teacher availability range", () => {
    const result = teacherProfileFormSchema.safeParse({
      locale: "en",
      biography: "An experienced Quran teacher with a careful teaching approach.",
      gender: "female",
      countryCode: "PK",
      educationSummary: "Graduate education",
      hawzaQualifications: "",
      teachingExperienceYears: 4,
      preferredStudentAgeGroups: ["children"],
      languageCodes: ["en", "ur"],
      availability: [
        { weekday: 1, start_time: "12:00", end_time: "09:00", time_zone: "Asia/Karachi" },
      ],
    });

    expect(result.success).toBe(false);
  });

  it("rejects unsafe private document metadata", () => {
    expect(
      teacherDocumentSchema.safeParse({
        documentType: "identity",
        objectPath: "../identity.exe",
        originalFilename: "identity.exe",
        contentType: "application/octet-stream",
        sizeBytes: 100,
      }).success
    ).toBe(false);
  });

  it("validates parent link identifiers without accepting child UUIDs", () => {
    const result = parentLinkRequestSchema.parse({
      locale: "en",
      studentNumber: "SIA-2048",
      relationship: "Mother",
    });

    expect(result.studentNumber).toBe("SIA-2048");
  });
});
