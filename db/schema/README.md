# LCMS — MySQL Schema & Frontend Mapping

Database for the **Legal Cell Monitoring System (LCMS)**, Yadadri Bhuvanagiri District Collectorate.
Target stack: **Laravel 10+ / MySQL 8.0+** (government-hosted). The React frontend currently runs on a localStorage demo layer; these scripts are the schema the Laravel team will implement and the frontend will eventually call via API.

## Files

| File | Purpose |
|---|---|
| `lcms_schema.sql`        | All `CREATE DATABASE` / `CREATE TABLE` / indexes / FKs |
| `lcms_seed_masters.sql`  | Seed inserts for every master/reference table |
| `README.md`              | This file — conventions + TS→SQL field map |

## Run order

```bash
mysql -u root -p < lcms_schema.sql
mysql -u root -p < lcms_seed_masters.sql
```

## Conventions

- Engine `InnoDB`, charset `utf8mb4`, collation `utf8mb4_unicode_ci`.
- Every business table has both:
  - `id` — `BIGINT UNSIGNED AUTO_INCREMENT` surrogate PK
  - `code` — `VARCHAR(64) UNIQUE` holding the human ID the React frontend already uses (`LCMS/YBG/2026/001`, `HRG/001`, `DIR-…`, `ACT-…`, `DOC-…`, `AUD-…`)
- `created_at`, `updated_at` timestamps where useful.
- Master/reference values come from constants in `src/data/sampleData.ts`.
- ENUMs are used where the frontend already restricts values; everything else is a lookup table for admin manageability.
- FKs: `ON DELETE RESTRICT` by default, `CASCADE` for child collections of a case.

## Entity overview

```
roles ──< user_roles >── users
                            │
divisions ──< division_mandals >── mandals
                                       │
collectorate_sections                  │
case_types  courts  departments        │
nature_of_case  case_statuses          │
                                       ▼
                                     cases ──┬── case_tags
                                             ├── case_co_respondents
                                             ├── case_parties
                                             ├── case_approved_counter_docs (1:1)
                                             ├── case_judgment_docs        (1:1)
                                             ├── case_directions ──< case_actions_taken
                                             ├── case_documents
                                             ├── hearings
                                             ├── appeals
                                             ├── alerts
                                             └── audit_log
```

## Frontend ↔ MySQL field map

### `CaseRecord`  (`src/data/sampleData.ts`)  →  `cases` (+ child tables)

| TS field | SQL location | Notes |
|---|---|---|
| `id` | `cases.code` | human ID, unique |
| `slNo` | `cases.sl_no` | |
| `caseNumber` | `cases.case_number` | |
| `title` | `cases.title` | |
| `court` | `cases.court_id → courts.name` | |
| `courtType` | `cases.court_type` | |
| `caseType` | `cases.case_type_id → case_types.name` | |
| `petitioner` / `respondent` | `cases.petitioner` / `cases.respondent` | denormalised primary names |
| `coRespondents[]` | `case_co_respondents.name` | |
| `petitioners[]` | `case_parties` where `role='petitioner'` | full `Party` shape |
| `respondents[]` | `case_parties` where `role='respondent'` | |
| `coRespondentParties[]` | `case_parties` where `role='co_respondent'` | |
| `department` | `cases.department_id → departments.name` | |
| `mandal` / `division` | `cases.mandal_id` / `cases.division_id` | |
| `filingDate` / `filingYear` / `caseYear` | `cases.filing_date` / `filing_year` / `case_year` | |
| `assignedOfficer` | `cases.assigned_officer_id → users.name` | |
| `priority` | `cases.priority` ENUM | |
| `status` | `cases.status_id → case_statuses.name` | |
| `lastHearing` / `nextHearing` | `cases.last_hearing` / `next_hearing` | cached from `hearings` |
| `advocate` / `advocateContact` | `cases.advocate` / `advocate_contact` | |
| `subject` / `remarks` | `cases.subject` / `remarks` | |
| `tags[]` | `case_tags.tag` | |
| `collectorateInvolvement` | `cases.collectorate_involvement` ENUM | drives "As Respondent" card |
| `natureOfCase` | `cases.nature_of_case_id → nature_of_case.name` | |
| `landDisputeFlag` | `cases.land_dispute_flag` | |
| `orderPassed` / `orderSummary` | `cases.order_passed` / `order_summary` | |
| `complianceRequired` / `complianceStatus` / `complianceDueDate` / `complianceCompletedDate` | `cases.compliance_*` | |
| `lastUpdated` | `cases.last_updated` | |
| `counterDraftStatus` / `gpApprovalStatus` / `collectorApprovalStatus` / `counterFilingDueDate` / `pendingAtLevel` / `interimOrderStatus` / `finalJudgmentStatus` / `finalActionStatus` | matching `cases.*` columns | approval workflow |
| `instructionsFiled` / `counterFiled` | `cases.instructions_filed` / `counter_filed` ENUM | |
| `srNumber` | `cases.sr_number` | |
| `approvedCounterDoc` | `case_approved_counter_docs` | 1:1 |
| `disposed` / `disposalDate` / `disposalSummary` | `cases.disposed` / `disposal_date` / `disposal_summary` | |
| `judgmentDoc` | `case_judgment_docs` | 1:1 |
| `directions[]` | `case_directions` | |
| `actionsTaken[]` | `case_actions_taken` | |
| `closed` / `closedBy` / `closedAt` | `cases.closed` / `closed_by` / `closed_at` | |
| `auditTrail[]` | `audit_log` filtered by `case_id` / `case_code` | |

### `Party`  →  `case_parties`

| TS | SQL |
|---|---|
| `name` | `name` |
| `type` | `party_type` |
| `department` | `department_id → departments.name` |
| `isInternalDept` | `is_internal_dept` |
| `remarks` | `remarks` |

### `CaseDoc`  →  `case_documents`

| TS | SQL |
|---|---|
| `id` | `code` |
| `name`, `stage`, `uploadedBy`, `uploadedAt`, `size` | same-named columns |
| — | `mime`, `storage_path` added for real file storage |

### `DirectionRecord`  →  `case_directions`

| TS | SQL |
|---|---|
| `id` | `code` |
| `text`, `issuedBy`, `issuedAt`, `concernedOfficer`, `dueDate`, `priority`, `status` | same-named columns |
| `concernedDepartment` | `concerned_department_id → departments.name` |

### `ActionTakenRecord`  →  `case_actions_taken`

| TS | SQL |
|---|---|
| `id` | `code` |
| `summary`, `uploadedBy`, `uploadedAt` | same |
| `doc.name` / `doc.size` | `doc_name` / `doc_size` |
| `linkedDirectionId` | `linked_direction_id` FK |

### `AuditEntry`  →  `audit_log`

| TS | SQL |
|---|---|
| `id` | `code` |
| `ts`, `actor`, `role`, `action`, `details` | same |
| — | `case_id` / `case_code` for per-case filtering (covers both `CaseRecord.auditTrail` and `globalAudit`) |

### `HearingRecord` (`src/contexts/DataContext.tsx`)  →  `hearings`

| TS | SQL |
|---|---|
| `id` | `code` |
| `caseId` | `case_id → cases.code` (resolve to `cases.id`) |
| `caseTitle`, `court`, `date`, `time`, `type`, `officer`, `status`, `outcome`, `remarks` | same-named columns |
| `orderPassed`, `orderSummary` | same |
| `complianceRequired`, `complianceStatus`, `complianceDueDate`, `complianceCompletedDate` | `compliance_*` |
| `responsibleDepartment` | `responsible_department_id → departments.name` |
| `responsibleOfficer`, `complianceRemarks` | same |

### `AppealRecord`  →  `appeals`

| TS | SQL |
|---|---|
| `id` | `code` |
| `parentCaseId` | `parent_case_id → cases.code` |
| `appealNumber`, `filingDate`, `grounds`, `stage`, `nextHearing`, `outcome`, `remarks` | same |
| `court` | `court_id → courts.name` |
| `assignedOfficer` | `assigned_officer_id → users.name` |
| `attachments` (count) | `attachments_count` |

### `AlertRecord`  →  `alerts`

| TS | SQL |
|---|---|
| `id` | `code` |
| `type`, `message`, `date`, `priority`, `status`, `channel` | same |
| `caseId` | `case_id → cases.code` |
| `officer` | `officer_id → users.name` |

### Auth (`src/lib/permissions.ts`)

| TS | SQL |
|---|---|
| `AppRole` union | `roles.name` (seeded) |
| User → role(s) | `user_roles` join table |
| Permissions matrix | currently computed in code (`getPermissions`); not stored — keep there or add `role_permissions` later if it needs to be admin-managed |

## Notes for the Laravel team

1. `cases.code` is the natural API key the frontend already uses. Expose endpoints by `code`, not numeric `id`.
2. Drop-down options on the React side should hydrate from the `*_masters` tables, not from the hard-coded arrays in `sampleData.ts`, once APIs exist.
3. Soft-delete: not modelled (the frontend uses `closed` + `disposed` flags for lifecycle). Add Laravel `SoftDeletes` only if explicitly required.
4. File storage: `case_documents.storage_path` is the only file-blob pointer. Use Laravel `Storage` (local disk on the government server) — no cloud provider per project constraints.
5. Audit: write `audit_log` on every mutating endpoint (one row per business event). The React `appendAudit` helper in `DataContext.tsx` defines the exact event vocabulary (`Direction Issued`, `Direction Updated`, `Action Taken Uploaded`, `Case Disposed`, `File Closed`, `Document Uploaded`, `Case Status Added`, `Case Status Removed`, plus free-form labels).
