import { PERMISSIONS, type PermissionKey } from "@/config/permissions";
import { getLocalizedPath, type Locale } from "@/i18n/config";

export type UserAccess = {
  userId: string;
  email: string | null;
  displayName: string | null;
  timeZone: string;
  roles: readonly string[];
  permissions: readonly string[];
};

export function hasPermission(
  access: UserAccess,
  permission: PermissionKey
): boolean {
  return (
    access.permissions.includes(PERMISSIONS.SYSTEM_FULL_ACCESS) ||
    access.permissions.includes(permission)
  );
}

export function getDefaultPortalPath(
  access: UserAccess,
  locale: Locale
): string | null {
  const destinations: Array<[PermissionKey, string]> = [
    [PERMISSIONS.PORTAL_ADMIN_VIEW, "/admin/dashboard"],
    [PERMISSIONS.PORTAL_STAFF_VIEW, "/staff/dashboard"],
    [PERMISSIONS.PORTAL_TEACHER_VIEW, "/teacher/dashboard"],
    [PERMISSIONS.PORTAL_PARENT_VIEW, "/parent/dashboard"],
    [PERMISSIONS.PORTAL_STUDENT_VIEW, "/student/dashboard"],
  ];

  const destination = destinations.find(([permission]) =>
    hasPermission(access, permission)
  );

  return destination ? getLocalizedPath(locale, destination[1]) : null;
}
