

## LCMS Upgrade Plan -- Collector-Ready District Legal Operations Platform

This is a significant upgrade of the existing LCMS. The plan is organized into implementation phases. No rebuild from scratch -- all work extends the current codebase.

---

### What Will Be Built

#### Phase 1: Expanded District Hierarchy and Master Data

**`src/lib/permissions.ts`**
- Expand `AppRole` type to include 7 new roles: `Additional Collector (Revenue)`, `Additional Collector (Local Bodies)`, `DRO`, `Administrative Officer`, `Section C Officer`, `Section D Officer`, `Section E Officer`, `Section G Officer`, `RDO Bhongir`, `RDO Choutuppal`, and 17 Tahsildar-level roles (mapped to `Mandal-Level User` with mandal-specific filtering)
- Add permissions for each new role with appropriate access levels

**`src/data/sampleData.ts`**
- Expand mandals from 10 to all 17 official mandals (add Mothkur, Rajapet, Bhoodan Pochampally, Choutuppal, Ramannapet, Samsthan Narayanapur, Valigonda, Gundala)
- Add `divisions` master: `Bhongir Division` (mandals under RDO Bhongir) and `Choutuppal Division` (mandals under RDO Choutuppal)
- Add `collectotateSections` master: Section C, D, E, G with descriptions
- Add `division` field to `CaseRecord` interface
- Add approval workflow fields to `CaseRecord`: `counterDraftStatus`, `gpApprovalStatus`, `collectorApprovalStatus`, `counterFilingDueDate`, `pendingAtLevel`, `interimOrderStatus`, `finalJudgmentStatus`, `finalActionStatus`
- Add multi-party support fields: `petitioners: Party[]`, `respondents: Party[]`, `coRespondentParties: Party[]` (each with name, type, department, remarks)
- Update all 30 existing mock cases with division assignments and new fields
- Add Tahsildar name mapping data

**`src/contexts/AuthContext.tsx`**
- Add ~15 new seed users for the expanded roles: Additional Collectors, RDOs, Section Officers, and select Tahsildars with real officer names from the prompt
- Update collector name to "Sri. Anuraag Jayanti, IAS"

#### Phase 2: Sidebar Navigation Upgrade

**`src/components/layout/AppSidebar.tsx`**
- Add collapsible **DEPARTMENTS** section with live case count badges (10 departments, each linking to `/cases?department=...`)
- Add collapsible **COLLECTOR QUICK ACCESS** section with items: Collectorate as Respondent, Co-Respondent, Counter Pending, GP Approval Pending, Collector Approval Pending, Orders Complied, Compliance Pending, Long Pending, Closed Cases Archive
- Add collapsible **DIVISIONS** section: Bhongir Division, Choutuppal Division (linking to `/cases?division=...`)
- Role-based visibility: Collector Quick Access visible to Collector/Admin/Super Admin; Departments visible to most roles; Divisions visible to RDOs and above

#### Phase 3: Role-Specific Dashboards

**`src/pages/Dashboard.tsx`**
- Refactor into role-switched dashboard sections:
  - **District Collector**: full executive dashboard with division-wise pendency, GP/Collector approval pending counts, pending counters, pending final action cards
  - **Additional Collector (Revenue)**: revenue/land-heavy cases, acquisition/compensation, RDO/Tahsildar pending items
  - **Additional Collector (Local Bodies)**: municipal/panchayat cases, local body compliance
  - **DRO**: section-wise counts, pending-at-level breakdown, draft counts
  - **Administrative Officer**: pending instructions, routed cases, approval routing
  - **Section D/E/G Officers**: filtered to their section-specific case types
  - **RDO Bhongir/Choutuppal**: division-filtered dashboards showing only their mandals' cases
  - **Tahsildar (each mandal)**: mandal-only view with pending drafts, hearings, compliance
- All KPI cards remain clickable with drill-down navigation

#### Phase 4: Case Model Upgrade -- Multi-Party and Approval Workflow

**`src/pages/cases/AddCase.tsx`**
- Replace single petitioner/respondent text fields with repeatable party sections (name, type/category, department/office, remarks)
- Add approval workflow fields: counter draft status, GP approval, Collector approval
- Add division dropdown (auto-populated based on selected mandal)
- Add `pendingAtLevel` dropdown

**`src/pages/cases/EditCase.tsx`**
- Same multi-party and approval workflow fields as AddCase

**`src/pages/cases/CaseDetails.tsx`**
- **Section B/C/D**: Repeatable petitioner, respondent, co-respondent cards (not just text)
- **Section F**: Counter/Interim/Final Action block with: before-filing status, counter draft status, counter due date, GP approval status, Collector approval status, interim order status, final judgment status, final action status, days left, pending-at-level, instructions, action taken
- **Section H**: Stage-wise document tabs with upload capability per stage, document metadata (title, type, stage, date, uploaded by, preview/download buttons)
- **Section I**: Richer audit trail with approval trail entries
- **Section J**: Add approval action buttons (Approve, Return for Modification, Add Instruction) visible to eligible roles
- Add division display in case summary

**`src/pages/cases/CaseList.tsx`**
- Add Division column and filter
- Add Pending At Level column and filter
- Add Approval Status filter
- Support `?division=` URL parameter for drill-down from dashboard/sidebar

#### Phase 5: Alerts at Each Stage

**`src/pages/alerts/AlertCenter.tsx`**
- Generate stage-based alerts from case data: hearing due, tomorrow hearing, counter due, counter draft pending approval, GP approval pending, Collector approval pending, order received but no action, compliance pending, final action due, no update in 7 days
- Show configurable alert days setting (admin only)

#### Phase 6: Counter Workflow UI

**`src/pages/cases/CaseDetails.tsx`** (extends Phase 4 work)
- Add counter document upload section
- Add "Send for GP Approval" / "Send for Collector Approval" buttons
- Add approve/return with remarks dialog
- Add "Mark Counter Filed" action
- Track counter filing due date based on case type
- Show counter workflow status in dashboard and case list

#### Phase 7: Fresh / Ongoing / Closed Dedicated Pages

**`src/pages/cases/FreshCases.tsx`** (new)
- Recent filings, assignment pending, before-filing/draft status, hearing listing status

**`src/pages/cases/OngoingCases.tsx`** (new)
- Active hearings, pending action, compliance pending, counter pending, approvals pending, next hearing emphasis

**`src/pages/cases/ClosedCases.tsx`** (new)
- Closure date, final judgment summary, compliance completion, archived documents, full history accessible

**`src/App.tsx`**
- Add routes: `/cases/fresh`, `/cases/ongoing`, `/cases/closed`

#### Phase 8: UI Polish

**`src/index.css`**
- Refine govt-table density, chip colors, spacing
- Add pending-at-level status chip styles
- Improve approval status chip styling

**`src/components/shared/StatusBadge.tsx`**
- Add approval status mappings (GP Approved, Returned, Collector Approved)
- Add pending-at-level badge type

---

### Files Changed (Summary)

| File | Action |
|------|--------|
| `src/lib/permissions.ts` | Expand roles and permissions |
| `src/data/sampleData.ts` | Add mandals, divisions, sections, case fields, Tahsildar data |
| `src/contexts/AuthContext.tsx` | Add ~15 new seed users with real officer names |
| `src/contexts/DataContext.tsx` | Update CaseRecord interface for new fields |
| `src/components/layout/AppSidebar.tsx` | Add Departments, Divisions, Collector Quick Access sections |
| `src/pages/Dashboard.tsx` | Role-specific dashboard variants with new KPI blocks |
| `src/pages/cases/AddCase.tsx` | Multi-party, approval workflow, division |
| `src/pages/cases/EditCase.tsx` | Same as AddCase |
| `src/pages/cases/CaseDetails.tsx` | Full redesign with all sections A-J |
| `src/pages/cases/CaseList.tsx` | Division column/filter, pending-at-level, approval filters |
| `src/pages/cases/FreshCases.tsx` | New dedicated page |
| `src/pages/cases/OngoingCases.tsx` | New dedicated page |
| `src/pages/cases/ClosedCases.tsx` | New dedicated page |
| `src/pages/alerts/AlertCenter.tsx` | Stage-based alert generation |
| `src/pages/hearings/CourtLiaisonUpdates.tsx` | Add approval/counter update fields |
| `src/components/shared/StatusBadge.tsx` | New status types |
| `src/index.css` | Polish refinements |
| `src/App.tsx` | New routes |

---

### What Is NOT Changing
- Overall layout structure and color palette
- Login flow and localStorage persistence approach
- Existing working CRUD behavior
- Reports, Bulk Upload, Compliance Tracker pages (preserved as-is)
- Current stack (React + local state)

