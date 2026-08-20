import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const rlsMigration = readFileSync(
  join(
    process.cwd(),
    "supabase",
    "migrations",
    "202608050003_row_level_security.sql"
  ),
  "utf8"
);

const privateTables = [
  "users",
  "profiles",
  "roles",
  "permissions",
  "role_permissions",
  "user_roles",
  "audit_logs",
  "student_profiles",
  "parent_profiles",
  "teacher_profiles",
  "parent_student_links",
] as const;

describe("foundation RLS migration", () => {
  it.each(privateTables)("enables and forces RLS on %s", (table) => {
    expect(rlsMigration).toContain(
      `alter table public.${table} enable row level security;`
    );
    expect(rlsMigration).toContain(
      `alter table public.${table} force row level security;`
    );
  });

  it("removes default client table privileges before granting narrow access", () => {
    expect(rlsMigration).toContain(
      "revoke all on all tables in schema public from anon, authenticated;"
    );
    expect(rlsMigration).not.toMatch(/(?:using|with check)\s*\(\s*true\s*\)/i);
  });

  it("keeps broad unscoped records behind full access", () => {
    expect(rlsMigration).toContain(
      "app_private.current_user_has_permission('system.full_access')"
    );
    expect(rlsMigration).not.toContain(
      "app_private.current_user_has_permission('users.read')"
    );
  });
});
