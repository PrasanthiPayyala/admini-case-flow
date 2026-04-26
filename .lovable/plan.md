## LCMS Workflow Alignment Update

This is an extension on top of the existing build. No module is removed, no route is changed, no redesign is done. The current sidebar, role-based scoping, dashboards, login, localStorage persistence, government UI, and case CRUD all stay intact.

The work aligns the entire system to this 15-step government workflow:

```text
1  Sl. No.
2  Department
3  Case Type
4  Case No. / Year
5  Petitioner(s)
6  Respondent(s)
7  Instructions / Counter Filed?
8  S.R. Number of Counter
9  Approved Counter Upload
10 Next Date of Hearing
11 Disposed? Yes/No
12 Disposal Details
13 Directions to Concerned Officer
14 Action Taken Upload
15 Close the File
```

---

### 1. Data model extension (`src/data/sampleData.ts`, `src/contexts/DataContext.tsx`)

Extend `CaseRecord` (additive only — old records keep working):

- `slNo: number` (auto, derived if missing)
- `caseYear: string` (already partially present as `filingYear`; add `caseYear` and a `caseNoYear` display helper)
- `instructionsFiled: "Yes" | "No" | "Pending"`
- `counterFiled: "Yes" | "No" | "Pending"`
- `srNumber: string` (S.R. Number of Counter)
- `approvedCounterDoc: { name, uploadedBy, uploadedAt } | null`
- `disposed: "Yes" | "No"`
- `disposalDate: string`
- `disposalSummary: string`
- `judgmentDoc: { … } | null`
- `directions: Array<{ id, text, issuedBy, issuedAt, concernedOfficer, concernedDepartment, dueDate, priority, status }>`
- `actionsTaken: Array<{ id, summary, doc, uploadedBy, uploadedAt, linkedDirectionId? }>`
- `respondents[i].isInternalDept: boolean` (already supports `department`; add this flag)
- `closed: boolean`, `closedBy: string`, `closedAt: string`
- `auditTrail: Array<{ id, ts, actor, role, action, details }>`

Add new context helpers:

- `appendAudit(caseId, entry)`
- `addDirection(caseId, direction)` → also writes audit
- `addActionTaken(caseId, action)` → also writes audit
- `setCounterStatus(caseId, partial)` → audit
- `markDisposed(caseId, payload)` → audit
- `closeFile(caseId, actor)` → guarded; audit
- `addCaseDocument(caseId, stage, doc)` (localStorage `lcms_case_docs`)
- `generateSlNo()` (sequential)

All writes go through these helpers so audit and lastUpdated stay consistent. localStorage keys follow the existing pattern (`lcms_*`).

Seed update: backfill the new fields on existing 37 sample cases with realistic values across the workflow (some Instructions Pending, some Counter Filed with S.R., some Disposed-not-Closed, some Closed, some with Directions issued + Action Taken pending).

---

### 2. Case Create / Edit forms (`AddCase.tsx`, `EditCase.tsx`)

Keep current layout. Add new card sections at the bottom and extend the Parties card:

- **Case Identifiers card**: show auto Sl. No. (read-only), split Case No. and Case Year, combined display preview.
- **Parties card** (replace single petitioner/respondent inputs with repeatable rows, but keep the existing single field as the "primary"):
  - Petitioners[]: name, type, remarks (Add/Remove)
  - Respondents[]: name, type, **department/office**, **Is Internal Department? Yes/No**, remarks
  - Co-Respondents[]: keep existing array, extend with same fields
- **Instructions / Counter card**:
  - Instructions Filed? Yes/No/Pending
  - Counter Filed? Yes/No/Pending
  - S.R. Number of Counter (text)
  - Counter Filing Due Date (existing field)
  - Approved Counter — file picker (stored as metadata in localStorage)
- **Disposal card**:
  - Disposed? Yes/No
  - Disposal Date
  - Disposal Summary
  - Judgment upload (metadata)
- **Close File card** (read-only on Add; visible on Edit): shows guard rules and a "Close File" button (only enabled if disposed = Yes, all open directions completed, and role is authorized: Collector / Addl Collector / Legal Officer / Admin).

All new fields are optional on Add; defaults preserve legacy data.

---

### 3. Case List (`src/pages/cases/CaseList.tsx`)

Keep filters, scoping, PartyCell, urgency colours. Replace the column set with the workflow-aligned columns:

```text
Sl.No | Dept | Case Type | Case No./Year | Title |
Petitioner | Respondent | Instr. | Counter | S.R. No. |
Next Hearing | Days→Hearing | Days→Counter | Disposed |
Action Status | Pending At | Last Updated | Actions
```

- New filters added: Instructions Filed, Counter Filed, Disposed (Yes/No), Closed (Yes/No), "Disposed but not Closed" quick chip.
- Actions dropdown unchanged (View / Edit / HC Status).
- Existing URL-param deep-linking preserved; add `?disposed=`, `?closed=`, `?instructions=`, `?counter=`.

---

### 4. Case Details page (`src/pages/cases/CaseDetails.tsx`)

Keep the current 7-step workflow strip and document tabs. Re-group existing content and add new sections, in this order:

A. Case Summary — adds Sl.No, Case No./Year, Disposed?, Closed?
B. Petitioners — repeatable PartyCard
C. Respondents — repeatable PartyCard with department + "Internal Dept" tag for cross-department visibility
D. Co-Respondents — existing
E. **Instructions / Counter Section** — Instructions Filed, Counter Filed, S.R. Number, Counter Due Date, Days Left, Approved Counter file row, GP Approval, Collector Approval, Counter Remarks; inline action buttons ("Mark Instructions Filed", "Mark Counter Filed", "Upload Approved Counter") gated by role.
F. **Workflow Strip** (existing, unchanged) + a thin status-badge row beneath it summarising: Instructions Filed | Counter Filed | S.R. Entered | Disposed | Directions Issued | Action Taken | File Closed.
G. Hearing Section — existing history table + Next Hearing + Days Left.
H. **Disposal Section** — Disposed Yes/No, Date, Summary, Judgment doc; "Mark Disposed" button (Legal Officer / Section Officer / Collector).
I. **Directions to Concerned Officer** — list + "Issue Direction" dialog (text, concerned officer, concerned dept, due date, priority). Each row shows status and a "Mark Completed" button for the concerned officer.
J. **Action Taken Section** — list of action-taken entries (summary + doc metadata + uploader); "Add Action Taken" dialog with optional link to a direction. Updates linked direction status to Completed.
K. **Documents by Stage** — existing tabs, but ensure stages are exactly: Filed, Interim, Counter, Compliance / Action Taken, Judgment, Miscellaneous. Wire upload through `addCaseDocument` (metadata persistence).
L. **Audit / Activity Trail** — new card listing `auditTrail[]` newest-first.
M. **Close File** card — guard banner + button (enabled only if `disposed === "Yes"` AND all directions status is Completed AND user role is authorised). Closure writes audit and sets `closed=true`, `pendingAtLevel="Closed"`, status `Closed`.

---

### 5. Counter / Approval workflow wiring

Complete the half-wired flow without changing the visual strip:

- Department drafts counter → button "Submit for GP Approval" (Section/Department roles) → sets `counterDraftStatus=Draft Ready`, `pendingAtLevel=GP Approval`.
- GP Approve (existing) → `pendingAtLevel=Collector Approval`.
- Collector Approve (existing) → `pendingAtLevel=Counter Filing`.
- "Mark Counter Filed" (Legal Officer / HC Liaison) → requires S.R. Number; sets `counterFiled=Yes`, `pendingAtLevel=Hearing Update`.

Every transition writes an audit entry.

---

### 6. Hearing + Liaison module (`CourtLiaisonUpdates.tsx`, `HearingList.tsx`)

Refine only:

- Add a "Tomorrow" quick filter + show tomorrow's count in the header.
- Add hearing-type chip and the case's Sl.No / Case No.-Year in the row.
- On save: if outcome = Disposed, also set case `disposed="Yes"` and prompt for Disposal Date/Summary inline.
- Save & Next already exists — improve by auto-advancing within Tomorrow list.
- Mobile-friendly form sizing only on this `/court-liaison` route (per the explicit mobile scope limit). No mobile changes elsewhere.

---

### 7. Dashboards (`src/pages/Dashboard.tsx`)

Keep all 16 role variants. Add/adjust KPI cards and make them clickable into pre-filtered case list (`?…`):

Collector dashboard adds:
- Instructions Not Filed
- Counter Not Filed
- S.R. Number Pending (counter filed but no S.R.)
- Approved Counter Uploaded
- Disposed Cases (total)
- **Disposed but Not Closed**
- Directions Issued — Pending Action
- Action Taken Pending Upload
- Hearings Tomorrow
- Last 7 Days Updates
- Department-wise mini-table (already partly there — extend with Instr/Counter/Disposed columns)
- Division-wise split (already there)

Department dashboards add: Instructions Pending, Counter Pending, Action Taken Pending, Disposed/Ongoing split, Hearings Due.

Liaison dashboard adds: Tomorrow Hearing list, Hearing Update Queue, Order Summary Pending, Compliance Updates Queue.

All cards remain clickable.

---

### 8. Alerts (`src/pages/alerts/AlertCenter.tsx`)

Keep page. Add a generated-alerts derivation (computed from current cases at render time) for these triggers, scoped to the logged-in user via the existing `useRoleFilter`:

- Hearing tomorrow / hearing due
- Instructions not filed
- Counter not filed / counter due
- Direction issued, no action taken
- Disposed but not closed
- No update in last 7 days

Alerts route to the user whose role owns the workflow stage (concerned dept, concerned officer, or pending-at level).

---

### 9. Routing / ownership visibility

Wherever a case row or detail card is shown, surface:
- routed department, routed officer, division/mandal
- pending at level (already shown — keep)
- concerned officer & concerned department for each direction
- responsible department for each action-taken entry

No new routes — additive labels and badges only.

---

### 10. Close File logic

A case can move to Closed only when ALL of:
- `disposed === "Yes"`
- all `directions[*].status === "Completed"` (or no directions)
- action-taken uploaded for any direction that requires it
- actor's role is one of: District Collector, Additional Collectors, District Legal Officer, Admin, Super Admin

Closure sets `closed=true`, `status="Closed"`, `pendingAtLevel="Closed"`, writes audit. Closed cases remain visible in `/cases/closed` archive with full history (already present); add a "Closed by / Closed on" row.

---

### 11. Audit log (`src/pages/admin/AuditLogs.tsx`)

Render real audit entries pulled from each case's `auditTrail[]` plus a global `lcms_audit` log. Every helper in step 1 writes here. Filter by actor / action / case.

---

### 12. Reports (`src/pages/reports/ReportsPage.tsx`)

Wire the existing Export buttons to a real CSV download (Blob + `URL.createObjectURL`) covering the 15-column workflow view. PDF export simulated via print-stylesheet on the same view.

---

### 13. UI refinement (no redesign)

- Rename labels to match the workflow ("Instructions / Counter", "Directions to Concerned Officer", "Action Taken", "Disposed", "Close File").
- Disposed vs Closed always shown as two distinct badges.
- Tighten table density on case list (text-[11px], compact paddings) so the wider column set fits.
- Keep the existing govt visual language, palette, typography, and `govt-card` / `govt-table` classes.

---

### Mobile scope

Mobile responsive tweaks are added ONLY on `/court-liaison` (and the small Hearing update dialog) for the High Court Representative Officer. All other pages stay desktop-first as today.

---

### Files to be modified

| File | Change |
|------|--------|
| `src/data/sampleData.ts` | Extend `CaseRecord`, seed new fields across 37 cases |
| `src/contexts/DataContext.tsx` | New helpers: audit, directions, actions, disposal, closure, docs |
| `src/pages/cases/AddCase.tsx` | Add Instructions/Counter, Disposal, repeatable Petitioners/Respondents w/ Internal Dept |
| `src/pages/cases/EditCase.tsx` | Same extensions + Close File guard |
| `src/pages/cases/CaseList.tsx` | New column set, new filters, deep-link params |
| `src/pages/cases/CaseDetails.tsx` | New sections E, H, I, J, L, M; status-badge strip; wire actions |
| `src/pages/cases/ClosedCases.tsx` | Show Closed by / Closed on |
| `src/pages/hearings/CourtLiaisonUpdates.tsx` | Tomorrow filter, disposal prompt, mobile sizing |
| `src/pages/hearings/HearingList.tsx` | Sl.No / Case No.-Year columns |
| `src/pages/Dashboard.tsx` | New KPI cards per role; clickable filters |
| `src/pages/alerts/AlertCenter.tsx` | Derived alerts from workflow state |
| `src/pages/admin/AuditLogs.tsx` | Read real audit entries |
| `src/pages/reports/ReportsPage.tsx` | CSV export wiring |

No files are deleted. No routes are changed. No existing demo user / role / scoping behaviour is altered.
