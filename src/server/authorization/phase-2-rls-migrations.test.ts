import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const schemaMigration = readFileSync(
  join(process.cwd(), "supabase", "migrations", "202608050005_phase_2_portal_schema.sql"),
  "utf8"
);
const securityMigration = readFileSync(
  join(process.cwd(), "supabase", "migrations", "202608050006_phase_2_portal_security.sql"),
  "utf8"
);

const phaseTwoPrivateTables = [
  "branches",
  "staff_profiles",
  "branch_memberships",
  "teacher_languages",
  "teacher_availability",
  "teacher_applications",
  "teacher_documents",
  "teacher_application_reviews",
] as const;

describe("Phase 2 database security", () => {
  it.each(phaseTwoPrivateTables)("enables and forces RLS on %s", (table) => {
    expect(securityMigration).toContain(`alter table public.${table} enable row level security;`);
    expect(securityMigration).toContain(`alter table public.${table} force row level security;`);
  });

  it("keeps the teacher bucket private and quarantine-first", () => {
    expect(securityMigration).toContain("'teacher-private', 'teacher-private', false");
    expect(schemaMigration).toContain("scan_status text not null default 'quarantined'");
    expect(securityMigration).toContain("td.scan_status = 'clean'");
  });

  it("uses branch membership as the delegated user scope", () => {
    expect(securityMigration).toContain("app_private.current_user_shares_branch(target_user_id)");
    expect(securityMigration).toContain("app_private.current_user_can_manage_branch(target_branch_id)");
  });

  it("removes direct guardian-link writes from browser roles", () => {
    expect(securityMigration).toContain("revoke insert, update on public.parent_student_links from authenticated;");
    expect(securityMigration).toContain("public.request_parent_student_link");
    expect(securityMigration).toContain("public.review_parent_student_link");
  });
});
