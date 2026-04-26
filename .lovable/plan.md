# Make all seeded role logins visible on the Login screen

## What's actually happening

RDO logins (and 13 other role accounts) are **already built, seeded, and fully wired** with role-based permissions. They have always worked — you can sign in right now with:

- `rdo.bhongir@lcms.local` / `demo123`
- `rdo.choutuppal@lcms.local` / `demo123`

The reason it *looks* like they're missing: the Login page's "Demo Credentials" panel only lists 6 of the 21 accounts. So testers don't know the others exist.

## Fix

Update **only** the demo credentials panel in `src/pages/Login.tsx` to expose all 21 seeded role logins, grouped by tier so the screen stays readable at the current government-style density.

### Grouping shown on the login screen

```text
LEADERSHIP
  collector@lcms.local                District Collector
  addlcollector.rev@lcms.local        Addl Collector (Revenue)
  addlcollector.lb@lcms.local         Addl Collector (Local Bodies)
  ao@lcms.local                       Administrative Officer

LEGAL CELL
  legalofficer@lcms.local             District Legal Officer
  liaisonofficer@lcms.local           HC Representative Officer
  sectionc@lcms.local                 Section C Officer
  sectiond@lcms.local                 Section D Officer
  sectione@lcms.local                 Section E Officer
  sectiong@lcms.local                 Section G Officer

DIVISIONS / RDO
  rdo.bhongir@lcms.local              RDO Bhongir
  rdo.choutuppal@lcms.local           RDO Choutuppal

DEPARTMENTS & MANDALS
  dept.revenue@lcms.local             Department Nodal Officer
  tahsildar.bhongir@lcms.local        Tahsildar Bhongir
  tahsildar.choutuppal@lcms.local     Tahsildar Choutuppal
  tahsildar.alair@lcms.local          Tahsildar Alair
  tahsildar.yadagirigutta@lcms.local  Tahsildar Yadagirigutta

SYSTEM
  superadmin@lcms.local               Super Admin
  admin@lcms.local                    Admin
  dataentry@lcms.local                Data Entry Operator
  viewer@lcms.local                   Read-Only Viewer

All passwords: demo123
```

### Implementation details

- Replace the existing `<div>` block in the left panel of `Login.tsx` (lines ~62–72) with a compact grouped list driven from a static array of `{ section, accounts: [{ email, role }] }`.
- Render a single shared `Password: demo123` line at the bottom instead of repeating it per row.
- Add a small "click to fill" affordance: clicking an email row populates the email field (password stays blank, user types `demo123`). Optional but useful given the count.
- Make the panel scrollable inside its current container (`max-h` + `overflow-y-auto` with thin scrollbar) so it doesn't push the layout.
- Keep the existing primary-blue background, gold accent, typography, and footer text. No visual redesign.
- No changes to `AuthContext.tsx`, `permissions.ts`, sidebar, dashboards, routes, or data — all RDO/Section/Tahsildar/Addl Collector logic is already in place.

## Files touched

- `src/pages/Login.tsx` — only the demo credentials panel block.

## Out of scope

- No new roles, no new users, no permission changes, no schema changes, no rebuild.
