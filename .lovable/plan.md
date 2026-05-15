# Plan — Simplify District Collector Dashboard

Scope: ONLY the Collector view of `src/pages/Dashboard.tsx` (when `dashType === "collector"`). All other role dashboards remain untouched. No routing, role, or workflow changes. No new files (one inline branch is enough).

## Approach

In `Dashboard.tsx`, gate the existing chart-heavy sections so they DO NOT render for `collector`, and render a new dedicated Collector layout instead. All other dashTypes keep current behavior.

Change the existing flags so Collector is excluded:
- `showCharts`: remove `"collector"`
- `showDeptTiles`: remove `"collector"`
- The "Pending at Level Summary", "Division-wise Cases", "Compliance Summary", "Dept Compliance Table", "Upcoming Hearings + Land Disputes", "Recent Updates + Alerts" blocks — wrap with `dashType !== "collector"` so Collector skips them.
- Remove the old `showApprovalCards` KPI rows for Collector by adding `&& dashType !== "collector"` (they're replaced by the new structured rows below).
- Keep `showCollectorCards` block but it will be replaced by the new Section C.

Then add a single block `{dashType === "collector" && (...)}` rendered right after the page header containing the new layout below.

## New Collector Layout

### KPI Row 1 (8 cards, clickable)
Total Cases · Fresh · Ongoing · Disposed · Closed · Hearings Tomorrow · Counter Pending · Compliance Pending

(Disposed = `cases.filter(c => c.disposed === "Yes" && !c.closed)`; Closed = `c.closed === true` or `status === "Closed"`.)

### KPI Row 2 (8 cards, clickable)
Collectorate as Respondent · Collectorate as Co-Respondent · Directions Pending Action · Action Taken Pending · GP Approval Pending · Collector Approval Pending · Long Pending Cases · Last 7 Days Updates

All cards use `<StatsCard href=...>` reusing existing filter URLs already used elsewhere.

### Section A — Hearings Requiring Attention
Compact table from `hearings` where date <= today+3 OR overdue & still Scheduled. Columns: Case No · Petitioner · Department · Next Hearing · Days Left · Status. Days-left chip color: red ≤0, orange 1–3, green ≥4. Limit 10 rows. Row click → `/cases/:id`.

### Section B — Pending Action Cases
Active cases where ANY of: `counterFiled !== "Yes"`, `counterFiled === "Yes" && !srNumber`, has open `directions`, `complianceStatus === "Pending"`. Columns: Case No · Department · Pending At · Responsible Officer · Due Date · Priority. Limit 10.

### Section C — Collectorate Involvement
Two side-by-side cards (Respondent / Co-Respondent). Each: total count + top 5 most urgent (sorted by nearest `nextHearingDate`, status not Closed) + "View all" link to filtered list.

### Section D — Department-wise Snapshot
Compact table over `departments`. Columns: Department · Total · Pending (status != Closed) · Compliance Pending · Hearings This Week (date within next 7 days). Department name links to `/cases?department=...`.

### Section E — Division-wise Snapshot
Two compact cards (Bhongir / Choutuppal). Each: Total · Pending · Hearings Upcoming. Click → `/cases?division=...`.

### Section F — Recent Updates (last 7 days activity feed)
Use `globalAudit` from `useData()` filtered to last 7 days, action in {Hearing Updated, Counter Filed/Approved, Direction Issued, Action Taken Uploaded, Case Disposed, File Closed}. Show timestamp · case no (parsed from `details` `[CASE-ID]` prefix → link) · action · actor/role. Limit 15 rows, scrollable.

If `globalAudit` is sparse, fall back to a derived feed from `cases` sorted by `lastUpdated` desc with their latest `auditTrail` entry.

### Optional single chart
Keep ONE small "Cases by Status" donut at the top-right of Section D (collapsed height ~180px). No other charts.

## What gets removed for Collector only
- Big multi-chart blocks (Cases by Type, Court, Mandal, Department bar, Priority bar)
- Pending-at-Level grid
- Department tiles grid
- Active Land Disputes table (land dispute KPI also dropped from primary KPIs per spec)
- Recent Alerts panel
- Approval card row & workflow KPI row (their key counts are folded into the new KPI rows)

## Visual language
Reuse existing `govt-card`, `govt-card-header`, `govt-table`, `StatsCard`, `StatusBadge`. No new design tokens. Strong section headings, compact spacing (`mb-4`), tables `text-xs`. Days-left chip via inline `<span>` with `bg-status-urgent/10 text-status-urgent` (red), `bg-status-warning/10 text-status-warning` (orange), `bg-status-success/10 text-status-success` (green).

## Files touched
- `src/pages/Dashboard.tsx` — single file edit. Add Collector branch + gate existing sections with `dashType !== "collector"`.

No data, context, route, or role changes.
