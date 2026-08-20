import { describe, expect, it } from "vitest";

import { PERMISSIONS } from "@/config/permissions";
import {
  getDefaultPortalPath,
  hasPermission,
  type UserAccess,
} from "@/server/authorization/permissions";

const baseAccess: UserAccess = {
  userId: "c32d9b2e-0b7e-4eae-9f1f-cac109cb827e",
  email: "student@example.com",
  displayName: "Student",
  timeZone: "Asia/Kuala_Lumpur",
  roles: ["student"],
  permissions: [PERMISSIONS.PORTAL_STUDENT_VIEW],
};

describe("authorization helpers", () => {
  it("allows an explicitly assigned permission", () => {
    expect(hasPermission(baseAccess, PERMISSIONS.PORTAL_STUDENT_VIEW)).toBe(true);
  });

  it("does not treat a role name as a permission", () => {
    expect(hasPermission(baseAccess, PERMISSIONS.PORTAL_ADMIN_VIEW)).toBe(false);
  });

  it("lets full-access users pass every permission check", () => {
    const superAdmin = {
      ...baseAccess,
      permissions: [PERMISSIONS.SYSTEM_FULL_ACCESS],
    };

    expect(hasPermission(superAdmin, PERMISSIONS.ROLES_MANAGE)).toBe(true);
  });

  it("resolves the highest-priority portal deterministically", () => {
    const multiRoleAccess = {
      ...baseAccess,
      permissions: [
        PERMISSIONS.PORTAL_STUDENT_VIEW,
        PERMISSIONS.PORTAL_TEACHER_VIEW,
      ],
    };

    expect(getDefaultPortalPath(multiRoleAccess, "en")).toBe("/en/teacher/dashboard");
  });
});
