# LCMS MySQL Schema — Plan

This delivers the **MySQL DDL** for the Laravel/MySQL backend (per project memory: government-hosted, no cloud branding) and a **field-by-field mapping** to the existing React/TypeScript data model in `src/data/sampleData.ts` and `src/contexts/DataContext.tsx`.

No frontend behavior changes. The current localStorage demo layer stays intact (per `mem://tech/demo-persistence-layer`). The SQL files are deliverables only — to be handed to the Laravel team or used later when wiring real APIs.

## Deliverables (files to create)

1. `db/schema/lcms_schema.sql` — full DDL (`CREATE DATABASE` + all `CREATE TABLE`s, indexes, FKs)
2. `db/schema/lcms_seed_masters.sql` — seed inserts for master tables (mandals, divisions, sections, case types, statuses, roles, etc.) sourced from `sampleData.ts`
3. `db/schema/README.md` — mapping table: TS interface → MySQL table/column, plus ER overview and conventions

## Conventions

- Engine `InnoDB`, charset `utf8mb4`, collation `utf8mb4_unicode_ci`
- PKs: `BIGINT UNSIGNED AUTO_INCREMENT` for new rows; **plus** a `code VARCHAR(64) UNIQUE` column to hold the existing human IDs (`LCMS/YBG/2026/001`, `HRG/001`, `DIR-...`, `AUD-...`) so the frontend keeps working without ID rewrites
- Timestamps: `created_at`, `updated_at` (`TIMESTAMP DEFAULT CURRENT_TIMESTAMP ...`)
- Enums for closed value sets (status, priority, compliance) — values mirror `sampleData.ts` constants
- JSON columns only where the frontend stores free-form arrays today (`tags`, multi-party blocks if needed); otherwise normalized
- All FKs `ON DELETE RESTRICT` except child collections (`ON DELETE CASCADE`)

## Tables

### Master / reference
| Table | Source in code |
|---|---|
| `mandals` | `mandals[]` |
| `divisions` | `divisions{}` |
| `division_mandals` | join from `divisions{}` |
| `collectorate_sections` | `collectotateSections[]` |
| `case_types` | `caseTypes[]` |
| `courts` | `courtNames[]` |
| `departments` | `departments[]` |
| `nature_of_case` | `natureOfCaseOptions[]` |
| `case_statuses` | `caseStatuses[]` + `DataContext.DEFAULT_STATUSES` |
| `pending_levels` | `pendingAtLevels[]` |
| `priorities` | `priorities[]` |
| `compliance_statuses` | `complianceStatuses[]` |
| `collectorate_involvement_types` | `collectorateInvolvementTypes[]` |
| `roles` | `AppRole` union in `src/lib/permissions.ts` |

### Auth
| Table | Notes |
|---|---|
| `users` | id, name, email, phone, password_hash, designation, mandal_id, department_id, active |
| `user_roles` | `user_id` ↔ `role_id` (many-to-many; roles separate from users per security rule) |
| `password_resets` | token, expires_at |

### Core case domain (maps to `CaseRecord`)
- `cases` — primary scalar columns: `code` (= `id`), `case_number`, `title`, `court_id`, `court_type`, `case_type_id`, `petitioner`, `respondent`, `department_id`, `mandal_id`, `division_id`, `filing_date`, `filing_year`, `assigned_officer_id`, `priority`, `status_id`, `last_hearing`, `next_hearing`, `advocate`, `advocate_contact`, `subject`, `remarks`, `collectorate_involvement`, `nature_of_case_id`, `land_dispute_flag`, `order_passed`, `order_summary`, `compliance_required`, `compliance_status`, `compliance_due_date`, `compliance_completed_date`, `last_updated`, workflow fields (`counter_draft_status`, `gp_approval_status`, `collector_approval_status`, `counter_filing_due_date`, `pending_at_level`, `interim_order_status`, `final_judgment_status`, `final_action_status`), government fields (`sl_no`, `case_year`, `instructions_filed`, `counter_filed`, `sr_number`, `disposed`, `disposal_date`, `disposal_summary`, `closed`, `closed_by`, `closed_at`)
- `case_tags` — `case_id`, `tag` (replaces `tags[]`)
- `case_co_respondents` — replaces `coRespondents[]`
- `case_parties` — type ENUM('petitioner','respondent','co_respondent'), name, party_type, department_id, is_internal_dept, remarks (covers `petitioners`, `respondents`, `coRespondentParties`)
- `case_approved_counter_docs` (1:1 nullable; mirrors `approvedCounterDoc`)
- `case_judgment_docs` (1:1 nullable; mirrors `judgmentDoc`)

### Workflow children
- `case_directions` (`DirectionRecord`) — text, issued_by, issued_at, concerned_officer, concerned_department_id, due_date, priority, status
- `case_actions_taken` (`ActionTakenRecord`) — summary, doc_name, doc_size, uploaded_by, uploaded_at, linked_direction_id (nullable FK)
- `case_documents` (`CaseDoc`) — name, stage ENUM('Filed','Interim','Counter','Compliance / Action Taken','Judgment','Miscellaneous'), uploaded_by, uploaded_at, size, mime, storage_path

### Hearings / appeals / alerts (from `DataContext` interfaces)
- `hearings` — full `HearingRecord` (case_id FK, date, time, type, officer, status, outcome, remarks, order_passed, order_summary, compliance_required, compliance_status, compliance_due_date, compliance_completed_date, responsible_department_id, responsible_officer, compliance_remarks)
- `appeals` — `AppealRecord` (parent_case_id FK, appeal_number, court_id, filing_date, grounds, stage, assigned_officer_id, next_hearing, outcome, remarks, attachments_count)
- `alerts` — `AlertRecord` (type, message, case_id, officer_id, date, priority, status, channel)

### Audit
- `audit_log` — global stream (`globalAudit`), columns: ts, actor, role, action, details, case_code (nullable, indexed) — covers both per-case `auditTrail` and the truncated global log
- View / index by `case_code` to reproduce `CaseRecord.auditTrail` order

## Indexes
- `cases (status_id)`, `cases (next_hearing)`, `cases (mandal_id)`, `cases (department_id)`, `cases (collectorate_involvement)`, `cases (assigned_officer_id)`, `cases (filing_year)`
- `hearings (case_id, date)`
- `appeals (parent_case_id)`
- `audit_log (case_code, ts)`
- Unique: `cases.code`, `hearings.code`, `appeals.code`, `users.email`, `roles.name`

## Mapping doc (`db/schema/README.md`) — shape

A single table listing every TS field on `CaseRecord`, `HearingRecord`, `AppealRecord`, `AlertRecord`, `DirectionRecord`, `ActionTakenRecord`, `CaseDoc`, `AuditEntry`, `Party` → MySQL table.column + type + notes (enum vs FK vs JSON). This is the artifact the Laravel team will work from.

## Out of scope (intentionally)

- No Laravel migration files (PHP) — only raw SQL, since this repo has no Laravel code
- No changes to React code, `DataContext`, or localStorage seeding
- No Lovable Cloud / Supabase enablement (memory forbids cloud-provider branding)
- No API layer / data-fetching refactor — that is a separate, larger task

## After approval

On build mode I will create the three files above and nothing else. If you'd instead like me to **also** start replacing the `DataContext` localStorage layer with real API calls, say so and I'll add a Phase 2 plan.
