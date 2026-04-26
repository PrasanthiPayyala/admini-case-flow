# Add department-specific logins for all 10 departments

## What exists today

Only **one** Department Nodal Officer is seeded: `dept.revenue@lcms.local` (Revenue Department). The role-scoping logic in `useRoleFilter.ts` already filters cases by `currentUser.department`, so adding more nodal officers automatically gives each one a department-scoped view — no logic changes needed.

The system defines **10 departments** in `sampleData.ts`:
Collectorate Legal Cell, Revenue Department, Land Records, Tahsildar Office, Survey & Settlement, Municipal Administration, Panchayat Raj, Roads & Buildings, Irrigation, Education Department.

## Fix

Add 9 new `Department Nodal Officer` accounts (one per missing department) and surface them on the Login screen.

### New seeded accounts (all password `demo123`)

| Email | Department |
|---|---|
| dept.revenue@lcms.local *(existing)* | Revenue Department |
| dept.legalcell@lcms.local | Collectorate Legal Cell |
| dept.landrecords@lcms.local | Land Records |
| dept.tahsildar@lcms.local | Tahsildar Office |
| dept.survey@lcms.local | Survey & Settlement |
| dept.municipal@lcms.local | Municipal Administration |
| dept.panchayat@lcms.local | Panchayat Raj |
| dept.randb@lcms.local | Roads & Buildings |
| dept.irrigation@lcms.local | Irrigation |
| dept.education@lcms.local | Education Department |

Each gets a realistic Telugu name, unique mobile (9000000040–48), `mandal: "All"`, and `Active` status.

### Files touched

1. **`src/contexts/AuthContext.tsx`** — append 9 entries to `SEED_USERS`. The bump in length triggers the existing "force refresh seed users" guard in `loadUsers()`, so existing demo browsers will pick up the new accounts on next load.
2. **`src/pages/Login.tsx`** — replace the single Revenue entry under `DEPARTMENTS & MANDALS` with a new dedicated `DEPARTMENT NODAL OFFICERS` group listing all 10 departments. Mandals stay in their own group.

### What this enables (no extra code)

- Each nodal officer logs in and immediately sees only cases where `case.department === their department`.
- Their dashboard, case list, alerts, reports, and audit logs are all already scoped through `useRoleFilter` / `getRoleDashboardType("department")`.
- Sidebar shows the Departments section but hides Admin and Divisions, matching existing `Department Nodal Officer` permissions.

## Out of scope

- No permission changes, no new roles, no new dashboards, no schema changes.
- No changes to `permissions.ts` or `useRoleFilter.ts` — both already handle this role correctly.
