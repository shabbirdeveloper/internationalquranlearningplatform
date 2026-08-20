import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const migration = readFileSync(
  join(process.cwd(), "supabase", "migrations", "202608200002_dynamic_pricing_management.sql"),
  "utf8"
);

describe("dynamic pricing database security", () => {
  it.each(["pricing_packages", "currencies", "pricing_package_features", "pricing_package_prices", "pricing_page_content"])(
    "enables RLS for %s",
    (table) => expect(migration).toContain(`alter table public.${table} enable row level security;`)
  );

  it("limits public package reads to active non-archived records", () => {
    expect(migration).toContain("using (is_active and deleted_at is null)");
  });

  it("checks content management permission for admin writes", () => {
    expect(migration).toContain("app_private.current_user_has_permission('content.manage')");
    expect(migration).toContain("app_private.current_user_has_permission('system.full_access')");
  });

  it("saves a package, features, and prices in one database function", () => {
    expect(migration).toContain("function public.save_pricing_package");
    expect(migration).toContain("delete from public.pricing_package_features");
    expect(migration).toContain("delete from public.pricing_package_prices");
    expect(migration).toContain("grant execute on function public.save_pricing_package");
  });

  it("seeds the four requested monthly plans and currencies", () => {
    for (const slug of ["four-classes", "eight-classes", "twelve-classes", "twenty-classes"]) {
      expect(migration).toContain(`'${slug}'`);
    }
    for (const code of ["USD", "CAD", "GBP", "AUD", "EUR"]) {
      expect(migration).toContain(`'${code}'`);
    }
  });
});
