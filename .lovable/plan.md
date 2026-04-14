

## Plan: Case List Operational Columns + Seed Data Fix

### Summary
Add 5 new columns to the Case Management table, fix seed data for urgency calculations, and apply multi-party display logic to both Petitioners and Respondents.

### Changes

**1. `src/data/sampleData.ts`**
- Add realistic `counterFilingDueDate` to ~15 cases (mix of overdue, due soon, future)
- Add multi-petitioner entries to several cases (currently all have exactly 1)
- Add multi-respondent entries across departments to several cases (e.g., one case with respondents from Revenue, Land Records, and Municipal Administration)

**2. `src/pages/cases/CaseList.tsx`**

New/updated columns:

- **Petitioner** — Show `petitioners[0].name`; if `length > 1`, show `+N` badge with hover-card listing all petitioners with their department
- **Respondent** — Same logic: show `respondents[0].name`; if `length > 1`, show `+N` badge with hover-card listing all respondents with their department. This replaces the current single-string respondent column
- **Days to Hearing** — Computed from `nextHearing` vs today. Color-coded urgency: red (Overdue/Today), orange (1-3 days), green (4+ days), gray (no date)
- **Days to Counter** — Computed from `counterFilingDueDate` vs today. Same urgency scheme
- **Pending At** — Show `pendingAtLevel` as status badge
- **Division** — New column + dropdown filter, supports `?division=` URL param

Remove "Next Hearing" raw date and "Updated" columns to keep table width manageable.

Updated column order:
Case No. | Title | Petitioner | Respondent | Type | Court | Division | Mandal | Dept | Priority | Status | Days to Hearing | Days to Counter | Pending At | Compliance | Actions

Add Division filter with `divisionF` state and URL param support.

Add `getDaysLeftLabel(dateStr)` helper for urgency label + color class computation.

**3. `src/components/ui/hover-card.tsx`** — Already exists, used for both petitioner and respondent overflow hovers.

### Files Changed
| File | Change |
|------|--------|
| `src/data/sampleData.ts` | Add counterFilingDueDate, multi-petitioner, multi-respondent (cross-department) entries |
| `src/pages/cases/CaseList.tsx` | Add Petitioner, Respondent (both with +N hover), Days to Hearing, Days to Counter, Pending At, Division columns; add Division filter |

