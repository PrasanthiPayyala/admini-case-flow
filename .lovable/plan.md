# Collector Dashboard Enhancements — Implementation Plan

Scope: Incremental additions only. Do NOT redesign existing dashboard. Keep Priority/Attention table and existing structure intact.

---

## 1. Clickable Summary Cards (Collector Dashboard)
Add a 3-card row at the top of the existing `CollectorCaseAnalytics` widget (replacing the current internal summary tiles to avoid duplication):
- **Total Cases** → `/cases?scope=collector`
- **Disposed Cases** → `/cases?disposed=Yes`
- **Pending Counter Cases** → `/cases?counterPending=true`

All cards honor the active dashboard filters (court, case type, date range) by passing query params.

## 2. Dashboard Filters (Collector Dashboard)
Extend existing filter bar in `CollectorCaseAnalytics` to include:
- **Court Type** (existing) — derived from `cases[].courtType` union with seed Excel values (WP/WA/CRP/SA/CC court contexts already in data)
- **Case Type** (existing) — ensure WP, WA, CRP, SA, CC, Contempt Case appear
- **Date Range** (NEW) — `From` and `To` date inputs, filters by `filingDate`. Reuse existing shadcn datepicker pattern.

## 3. Global Date Filter (All Dashboards)
Create a lightweight `DashboardDateFilter` component placed in the dashboard header strip on `Dashboard.tsx` for ALL roles. It filters case-derived metrics by `filingDate` range. Store state in `Dashboard.tsx` and pass into role-specific blocks via props. Default: empty (no filter).

## 4. Court-wise View (already exists)
The existing `CollectorCaseAnalytics` per-court grouping already shows:
- Disposed → department-wise Complied / Non-Complied
- Pending Counter → department-wise Counter Filed / Counter Pending / Next Hearing

Refinements:
- **Compliance logic update**: A disposed case is `Non-Complied` if `complianceStatus !== "Complied"` AND `complianceRequired === true`. Cases with no compliance required count as Complied (or excluded — choose Complied).
- **Counter Filed logic**: Already uses `counterFiled === "Yes"`. Keep as-is (interpreted as "at least one counter uploaded").
- **Department display**: Use primary `department` field — already in place.
- **Make each department-row count clickable** → links to `/cases?...` with appropriate filter (e.g. `?disposed=Yes&compliance=NonComplied&department=X`).

## 5. CaseList Query Param Support
Update `src/pages/cases/CaseList.tsx` to read & apply these URL params:
- `disposed=Yes|No`
- `counterPending=true` (status !== Closed && counterFiled !== Yes)
- `counterFiled=true`
- `compliance=Complied|NonComplied|Pending`
- `department=<name>`
- `courtType=<name>`
- `caseType=<name>`
- `dateFrom`, `dateTo` (filingDate range)
- `scope=collector` (no extra filter — district level)

Apply on mount via `useSearchParams` and pre-populate visible filters where possible.

## 6. Case Status Master (Super Admin + Legal Cell)
Create new admin page `src/pages/admin/CaseStatusMaster.tsx`:
- Lists existing statuses (default + custom) with usage count.
- Add new status (name, color token).
- Delete only allowed if usage count = 0.
- All edits write an `auditLog` entry via DataContext.
- Visible only to roles: `Super Admin`, `Legal Cell` (existing roles in `permissions.ts`).
- Add route in `App.tsx` and sidebar entry in `AppSidebar.tsx` under Admin section.

Data layer:
- Extend `DataContext.tsx` with `caseStatuses: string[]` (seeded from existing statuses) + `addCaseStatus`, `deleteCaseStatus`. Persist to `localStorage` (consistent with existing demo persistence layer).
- Replace hardcoded status dropdown options in `AddCase.tsx` / `EditCase.tsx` / `CaseList.tsx` filter to consume `caseStatuses` from context.

## 7. Out of Scope (explicit)
- No charts / reports module.
- No mobile optimization of Collector Dashboard.
- No redesign of Priority/Attention table.
- No respondent-assignment workflow for counter filing (deferred).
- No role hierarchy changes; Collector already shows district-level via existing `useRoleFilter`.

---

## Technical Touch Points
- `src/components/dashboard/CollectorCaseAnalytics.tsx` — add date filter, clickable cards, clickable dept rows, refine compliance logic
- `src/pages/Dashboard.tsx` — add global `DashboardDateFilter` in header for all roles, lift date state, pass to children
- `src/components/dashboard/DashboardDateFilter.tsx` (NEW) — reusable date-range filter
- `src/pages/cases/CaseList.tsx` — honor new query params
- `src/contexts/DataContext.tsx` — add caseStatuses state + actions
- `src/pages/admin/CaseStatusMaster.tsx` (NEW)
- `src/App.tsx` — route
- `src/components/layout/AppSidebar.tsx` — sidebar link (admin only)
- `src/lib/permissions.ts` — gate Case Status Master to Super Admin + Legal Cell

## Validation
- Manual click-through: each summary card and each department count opens correctly filtered CaseList.
- Date filter applies to summary counts and per-court breakdown.
- Case Status Master: add → appears in AddCase dropdown; delete blocked when in use.
- Other dashboards unaffected except for the new date filter strip.
