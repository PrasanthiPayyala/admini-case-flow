# Collector Dashboard — Refinement Plan

Goal: Sharpen the District Collector's dashboard so it monitors exactly what he cares about — Contempt, cases where the Collectorate is a Respondent, and Compliance failures (with the officer last accountable). Remove Disposal Rate. Keep "Requires your attention" as-is.

## What changes

### 1. Hero KPI strip (4 cards → 4 cards, one swapped)
Replace the **3-Month Disposal Rate** card with a **Collectorate as Respondent** card.

New 4-card row:
1. Contempt Cases (unchanged) — red accent, links to `/cases?caseType=Contempt+Case`
2. Cases — Collectorate as Respondent (NEW) — count of active cases where `collectorateInvolvement === "Collectorate as Respondent"`, with a sub-line `+N as Co-Respondent`. Links to `/cases?involvement=Respondent`.
3. Hearings Tomorrow (unchanged)
4. Registered This Month (unchanged, with MoM delta)

Remove the Disposal Rate progress card entirely.

### 2. New section: "Compliance — Failed / Overdue"
Insert a new block directly below the hero cards (above "Requires your attention").

Mini-summary row (3 small tiles):
- Pending — count of `complianceRequired && complianceStatus === "Pending"`
- Partially Complied — count
- Overdue — pending/partial where `complianceDueDate < today`

High-density table (same columns as the screenshot the user shared):
`Case Number | Title | Court | Order Summary | Department | Compliance Status | Due Date | Completed | Last Officer`

Rules:
- Source: cases where `complianceRequired === true` AND `complianceStatus ∈ {Pending, Partially Complied}`.
- Sort: overdue first (oldest due date), then nearest due date.
- Limit: top 10 with a "View all in Compliance Tracker" link → `/compliance`.
- "Last Officer" = the officer last accountable (use existing `assignedOfficer` field, same as the Compliance Tracker screen shown).
- Row click → `/cases/:id`.
- Overdue rows: subtle red left-border + red due-date text. Use existing `StatusBadge` for the status column. No new colors — reuse tokens.

### 3. Respondent quick-glance (optional small panel, same row as Compliance)
Two compact stat tiles beside the compliance block summary:
- "As Respondent · Active" with counts grouped by top 3 departments (one-line breakdown).
- "As Co-Respondent · Active" count.
Both link into the case list filtered by involvement.

### 4. Keep as-is
- Contempt alert banner at top
- "Requires your attention" table
- "Tomorrow at the High Court" list
- Header strip with Collector name / timestamp / Export / Print

### 5. Remove
- 3-Month Rolling Disposal Rate card (and its computation)
- Any "Pending Closures" quick-tile that referenced disposal flow on the Collector dashboard (keep elsewhere — only removed from Collector view)

## Final Collector dashboard order (top → bottom)
1. Contempt alert banner (conditional)
2. Header strip
3. Hero KPI row (Contempt · Respondent · Hearings Tomorrow · Registered This Month)
4. Compliance — Failed / Overdue (summary tiles + 10-row table)
5. Requires your attention (unchanged)
6. Tomorrow at the High Court (unchanged)
7. Quick action tiles (Register · Contempt · HC Hearings — drop "Pending Closures")

## Technical notes
- All work is in `src/pages/Dashboard.tsx`, inside the `isCollector` IIFE block (~line 177 onward). No data model or context changes — fields used (`collectorateInvolvement`, `complianceRequired`, `complianceStatus`, `complianceDueDate`, `complianceCompletedDate`, `assignedOfficer`, `orderSummary`) already exist on `CaseRecord`.
- Filter scope continues to use `useRoleFilter()` output (`cases`) — Collector role returns all district cases, so behavior is unchanged.
- Styling: reuse `govt-card`, `govt-table`, `StatusBadge`, semantic tokens (`status-urgent`, `status-warning`, `status-success`). No new tokens.
- Links: extend existing query-string convention (`?caseType=`, `?involvement=`). CaseList already accepts unknown params gracefully; deep-link filtering for `involvement` can be a follow-up if needed — the navigation target still works.

## Out of scope
- Changes to CaseList filter UI for the new `involvement` query param (can be added later if you want the link to auto-filter).
- Any change to other role dashboards.
- Any change to seed data.