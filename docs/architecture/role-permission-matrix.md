# Role and permission matrix

Legend: `O` own records, `L` linked children, `A` assigned students, `R` read, `M` manage, `-` no access, `*` all configured permissions.

| Module | Visitor | Student | Parent | Teacher | Admission Officer | Academic Coordinator | Finance Manager | Support Agent | Content Manager | Branch Manager | Super Admin |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Public content | R | R | R | R | R | R | R | R | M | M | * |
| Own profile | - | O | O | O | O | O | O | O | O | O | * |
| Student records | - | O | L | A | R | M | limited R | ticket-scoped | - | branch M | * |
| Parent links | - | R | L/M request | A/R | R | M | - | ticket-scoped | - | branch M | * |
| Teacher profiles | public R | assigned R | assigned R | O | R | M | payout R | ticket-scoped | public R | branch M | * |
| Roles and permissions | - | - | - | - | - | R | - | - | - | branch assignment | * |
| Admissions and trials | create | O | L | assigned R/M | M | M | payment R | ticket-scoped | - | branch M | * |
| Courses and curriculum | public R | enrolled R | linked R | assigned R | R | M | pricing R | - | public M | branch M | * |
| Scheduling and classes | - | O | L | A/M | trial M | M | R | issue R | - | branch M | * |
| Attendance and progress | - | O | L | A/M | - | M | - | ticket-scoped | - | branch R | * |
| Finance | - | O | L/M payment | earnings O | payment-status R | scholarship R | M | ticket-scoped | - | branch R | * |
| Teacher earnings/payouts | - | - | - | O | - | approve academic inputs | M | - | - | branch R | * |
| Messages/notifications | - | safeguarded O | linked | assigned | applicant | M | payment threads | ticket threads | announcements M | branch M | * |
| Support tickets | create | O | L/O | O | assigned R | escalated R | finance cases | assigned M | - | branch M | * |
| Safeguarding | - | report only | report + linked visibility | report only | - | restricted M | - | restricted assigned | - | restricted branch | * |
| Security center/audit | - | - | - | - | - | limited R | finance audit R | support audit R | content audit R | branch R | * |
| Settings/integrations | - | preferences O | preferences O | preferences O | - | academic settings | finance settings | support settings | content settings | branch settings | * |

## Permission-key convention

Permission keys use `<module>.<action>` and are defined once in database seed data and once in a typed generated/shared catalogue. Initial keys include:

- `portal.student.view`, `portal.parent.view`, `portal.teacher.view`, `portal.staff.view`, `portal.admin.view`.
- `profile.read_own`, `profile.update_own`, `child.read_linked`, `student.read_assigned`.
- `users.read`, `users.manage`, `roles.read`, `roles.manage`.
- `courses.read`, `courses.manage`, `admissions.read`, `admissions.manage`.
- `scheduling.read`, `scheduling.manage`, `attendance.read`, `attendance.manage`.
- `finance.read`, `finance.manage`, `content.read`, `content.manage`.
- `support.read`, `support.manage`, `security.read`, `audit.read`, `settings.manage`.
- `system.full_access` for the seeded Super Admin role only.

UI capability checks improve usability, server checks protect application mutations, and RLS policies protect database rows. Assigning a role never bypasses these layers.
