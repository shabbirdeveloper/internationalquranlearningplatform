import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { PERMISSIONS, ROLE_KEYS } from "@/config/permissions";

const seedMigration = [
  "202608050004_seed_roles_permissions.sql",
  "202608050007_phase_2_permissions.sql",
]
  .map((filename) =>
    readFileSync(join(process.cwd(), "supabase", "migrations", filename), "utf8")
  )
  .join("\n");

describe("database authorization seed", () => {
  it("contains every permission from the application catalogue", () => {
    for (const permission of Object.values(PERMISSIONS)) {
      expect(seedMigration, `missing permission: ${permission}`).toContain(
        `'${permission}'`
      );
    }
  });

  it("contains every role from the application catalogue", () => {
    for (const role of Object.values(ROLE_KEYS)) {
      expect(seedMigration, `missing role: ${role}`).toContain(`'${role}'`);
    }
  });
});
