import { describe, expect, it } from "vitest";

import {
  coreProfileFormSchema,
  courseAdminSchema,
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

  it("normalizes admin-managed course lists and local image paths", () => {
    const result = courseAdminSchema.parse({
      locale: "en",
      slug: "quran-study",
      title: "Quran Study",
      summary: "A structured and supportive Quran learning course.",
      category: "Quran",
      level: "All levels",
      ageGroup: "All ages",
      classType: "One-to-one",
      durationMinutes: "45",
      languages: "English\nUrdu",
      coverImage: "/images/hero-online-class.png",
      detailImage: "/images/shia-taleem-hero-learning.png",
      methodImage: "/images/shia-taleem-female-teacher.png",
      overviewHeading: "A complete Quran learning journey",
      description: "A complete introduction that clearly explains the course and its learning approach.",
      guidanceHeading: "Personal live guidance",
      guidanceBody: "A qualified teacher listens, explains, corrects, and adapts every live lesson carefully.",
      audienceHeading: "Who should join this course?",
      audienceBody: "Learners of different ages and levels can begin after a friendly starting assessment.",
      benefitsHeading: "Benefits of this course",
      benefits: "Personal plan\nLive correction\nRegular review",
      methodHeading: "A steady teaching method",
      methodBody: "Lessons combine explanation, demonstration, supported practice, and regular revision.",
      outcomes: "Confident reading\nClear next steps",
      syllabus: "Assessment\nGuided lessons\nProgress review",
      isPublished: true,
    });

    expect(result.languages).toEqual(["English", "Urdu"]);
    expect(result.benefits).toHaveLength(3);
    expect(result.durationMinutes).toBe(45);
  });

  it("rejects remote or unsafe course image paths", () => {
    const result = courseAdminSchema.safeParse({
      locale: "en",
      slug: "unsafe-course",
      title: "Unsafe Course",
      summary: "A summary long enough for validation.",
      category: "Quran",
      level: "Beginner",
      ageGroup: "Adults",
      classType: "One-to-one",
      durationMinutes: 30,
      languages: "English",
      coverImage: "https://unknown.example/image.png",
      detailImage: "/images/detail.png",
      methodImage: "/images/method.png",
      overviewHeading: "A complete overview heading",
      description: "A sufficiently complete course introduction for the public details page.",
      guidanceHeading: "A clear guidance heading",
      guidanceBody: "A sufficiently complete explanation of the live guidance available.",
      audienceHeading: "Who should join this course?",
      audienceBody: "A sufficiently complete explanation of the intended course audience.",
      benefitsHeading: "Benefits of the course",
      benefits: "One useful benefit",
      methodHeading: "A reliable course method",
      methodBody: "A sufficiently complete explanation of the course teaching method.",
      outcomes: "One outcome",
      syllabus: "One stage",
      isPublished: false,
    });

    expect(result.success).toBe(false);
  });
});
