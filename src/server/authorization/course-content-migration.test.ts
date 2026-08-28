import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const migration = readFileSync(
  join(process.cwd(), "supabase", "migrations", "202608280001_course_content_management.sql"),
  "utf8"
);

describe("course content management migration", () => {
  it("adds long-form content, media, and structured benefit fields", () => {
    for (const column of ["cover_image_url", "detail_image_url", "method_image_url", "overview_heading", "guidance_body", "audience_body", "benefits", "method_body"]) {
      expect(migration).toContain(column);
    }
  });

  it("requires course management permission for writes", () => {
    expect(migration).toContain("app_private.current_user_has_permission('courses.manage')");
    expect(migration).not.toMatch(/(?:using|with check)\s*\(\s*true\s*\)/i);
  });
});
