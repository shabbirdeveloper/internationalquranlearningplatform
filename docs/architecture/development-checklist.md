# Phased implementation checklist

## Phase 1 - Foundation (complete)

- [x] Inspect and document repository state.
- [x] Define target architecture, folder structure, ER plan and RBAC matrix.
- [x] Define environment contract and visual design system.
- [x] Scaffold Next.js with strict TypeScript, Tailwind, shadcn/ui and test tooling.
- [x] Configure locale routing and RTL/LTR direction.
- [x] Configure Supabase browser/server clients and cookie refresh proxy.
- [x] Implement sign-in, sign-out, auth callback and portal redirects.
- [x] Implement typed permission catalogue, server authorization and route guards.
- [x] Add foundation, portal-profile, RLS and seed migrations.
- [x] Build public homepage shell and shared public layout.
- [x] Build Super Admin shell and Student, Parent, Teacher placeholder dashboards.
- [x] Run lint, typecheck, tests and production build.
- [x] Perform desktop/mobile/RTL browser QA and visual comparison.

## Phase 2 - User portals

- [x] Profile editing, onboarding and private document storage.
- [x] Parent-child linking and approval workflow.
- [x] Teacher recruitment, document review, verification and availability.
- [x] Staff directory, branch membership and delegated role assignment.
- [x] Run lint, typecheck, tests, production build, and desktop/mobile browser QA.

The document pipeline intentionally stops at a quarantined storage contract. A trusted external scanner must set `scan_status = 'clean'` before reviewers can download an object.

## Phase 3 - Academic operations

- [ ] Courses, levels, versioned curriculum and learning materials.
- [ ] Admissions, trials, enrollment and teacher matching.
- [ ] Teacher assignment history, UTC scheduling and conflict detection.
- [ ] Class sessions, rescheduling and attendance.

## Phase 4 - Learning management

- [ ] Assignments, secure submissions and teacher feedback.
- [ ] Assessments, Tajweed evaluation and progress calculations.
- [ ] Monthly report workflow and parent acknowledgment.
- [ ] PDF certificates, QR verification, revocation and audit history.

## Phase 5 - Finance

- [ ] Country/course pricing, subscriptions, invoices and receipts.
- [ ] Verified payment webhooks, refunds, discounts and scholarships.
- [ ] Teacher earnings, adjustments, payout batches and statements.

## Phase 6 - Communication and care

- [ ] Safeguarded internal messaging and parent visibility rules.
- [ ] Notification preferences and email/push/provider adapters.
- [ ] Support, complaints, restricted safeguarding and escalation workflows.

## Phase 7 - International operations

- [ ] Complete Urdu and Arabic content; add Persian readiness review.
- [ ] Hijri/Gregorian calendar UX, currencies, country pricing and reports.
- [ ] Time-zone-aware recurring schedule tools and holiday adjustments.

## Phase 8 - Quality and launch

- [ ] RLS/authorization penetration tests and MFA enforcement.
- [ ] Accessibility, performance, observability and load testing.
- [ ] Backup and restore drill, CI/CD, staging and production release.
