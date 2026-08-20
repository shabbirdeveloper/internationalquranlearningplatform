# Database entity relationship plan

## Domain map

```mermaid
erDiagram
  AUTH_USERS ||--|| USERS : projects
  USERS ||--|| PROFILES : has
  USERS ||--o{ USER_ROLES : receives
  ROLES ||--o{ USER_ROLES : assigned
  ROLES ||--o{ ROLE_PERMISSIONS : grants
  PERMISSIONS ||--o{ ROLE_PERMISSIONS : included
  USERS ||--o| STUDENT_PROFILES : extends
  USERS ||--o| PARENT_PROFILES : extends
  USERS ||--o| TEACHER_PROFILES : extends
  PARENT_PROFILES ||--o{ PARENT_STUDENT_LINKS : links
  STUDENT_PROFILES ||--o{ PARENT_STUDENT_LINKS : linked
  USERS ||--o{ AUDIT_LOGS : acts

  COURSE_CATEGORIES ||--o{ COURSES : contains
  COURSES ||--o{ COURSE_LEVELS : contains
  COURSES ||--o{ SYLLABUS_VERSIONS : versions
  SYLLABUS_VERSIONS ||--o{ SYLLABUS_MODULES : contains
  SYLLABUS_MODULES ||--o{ LESSONS : contains
  LESSONS ||--o{ LEARNING_MATERIALS : provides

  STUDENT_PROFILES ||--o{ ADMISSION_APPLICATIONS : submits
  ADMISSION_APPLICATIONS ||--o{ TRIAL_REQUESTS : requests
  TRIAL_REQUESTS ||--o| TRIAL_CLASSES : schedules
  ADMISSION_APPLICATIONS ||--o| ENROLLMENTS : converts
  COURSES ||--o{ ENROLLMENTS : enrolls
  ENROLLMENTS ||--o{ TEACHER_STUDENT_ASSIGNMENTS : assigned
  TEACHER_PROFILES ||--o{ TEACHER_STUDENT_ASSIGNMENTS : teaches
  TEACHER_STUDENT_ASSIGNMENTS ||--o{ CLASS_SCHEDULES : generates
  CLASS_SCHEDULES ||--o{ CLASS_SESSIONS : instances
  CLASS_SESSIONS ||--o{ ATTENDANCE_RECORDS : records

  ENROLLMENTS ||--o{ ASSIGNMENT_STUDENTS : receives
  ASSIGNMENTS ||--o{ ASSIGNMENT_STUDENTS : targets
  ASSIGNMENT_STUDENTS ||--o{ ASSIGNMENT_SUBMISSIONS : submits
  ASSESSMENTS ||--o{ ASSESSMENT_RESULTS : produces
  ENROLLMENTS ||--o{ STUDENT_LESSON_PROGRESS : tracks
  ENROLLMENTS ||--o{ TAJWEED_EVALUATIONS : evaluates
  ENROLLMENTS ||--o{ PROGRESS_REPORTS : summarizes
  ENROLLMENTS ||--o{ CERTIFICATES : awards

  PRICING_PLANS ||--o{ SUBSCRIPTIONS : selected
  SUBSCRIPTIONS ||--o{ INVOICES : bills
  INVOICES ||--o{ PAYMENTS : settles
  PAYMENTS ||--o{ REFUNDS : reverses
  TEACHER_PROFILES ||--o{ TEACHER_EARNINGS : earns
  TEACHER_PAYOUTS ||--o{ TEACHER_EARNINGS : groups

  CONVERSATIONS ||--o{ CONVERSATION_PARTICIPANTS : includes
  USERS ||--o{ CONVERSATION_PARTICIPANTS : joins
  CONVERSATIONS ||--o{ MESSAGES : contains
  USERS ||--o{ NOTIFICATIONS : receives
  USERS ||--o{ SUPPORT_TICKETS : opens
  SUPPORT_TICKETS ||--o{ TICKET_MESSAGES : contains
```

## Phase 1 physical tables

- `users`: private application projection of `auth.users`, account status and lifecycle timestamps.
- `profiles`: display name, contact/locale/time-zone preferences, direction-independent identity data.
- `roles`, `permissions`, `role_permissions`, `user_roles`: configurable RBAC graph.
- `student_profiles`, `parent_profiles`, `teacher_profiles`, `parent_student_links`: minimal portal identity extensions and ownership links.
- `audit_logs`: immutable actor, action, target, request and before/after metadata.

## Phase 2 physical tables

- `branches`, `staff_profiles`, `branch_memberships`: branch registry, staff identity extension, and effective branch/role scope.
- `teacher_languages`, `teacher_availability`: normalized teaching-language and weekly local-time availability records.
- `teacher_applications`, `teacher_application_reviews`: stateful recruitment applications with immutable reviewer history.
- `teacher_documents`: private object metadata, quarantine/scan state, and reviewer decision state for the `teacher-private` bucket.
- `parent_student_links`: Phase 2 uses an RPC-only pending/active/rejected approval lifecycle with audit records.
- `profiles` and `teacher_profiles`: extended with onboarding completion and professional-verification fields.

## Future table groups

1. Academic catalogue: course categories through versioned lessons and materials.
2. Admissions and delivery: student applications, trials, enrollments, assignment history, schedules, sessions, attendance and rescheduling.
3. Learning: assignments, submissions, assessments, lesson progress, Tajweed, reports and certificates.
4. Finance: plans, subscriptions, invoices, payments, refunds, discounts, scholarships, earnings and payouts.
5. Communication and care: conversations, notifications, tickets, complaints and restricted safeguarding records.
6. Reference/content: countries, languages, currencies, pages, resources, FAQs, testimonials, email templates and system settings.

## Integrity rules

- Every relationship has an explicit foreign key and a supporting index on the referencing side.
- One-to-one extensions use `user_id` as both primary and foreign key.
- Versioned curriculum rows are immutable after use by an enrollment; a new syllabus version supersedes the prior version.
- Teacher assignment rows use effective date ranges to preserve reassignment history.
- Scheduling stores UTC instants and IANA time-zone identifiers separately.
- Financial amounts use exact `numeric` minor-unit-aware values and ISO currency references.
- Child safeguarding records are separated from general tickets so broad support permissions cannot reveal them.
