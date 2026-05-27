# LCMS — Legal Cell Monitoring System
### Yadadri Bhuvanagiri District Collectorate, Telangana

A role-based, government-grade web application for managing the complete legal lifecycle of the District Collectorate — from case registration, hearings, directions, counters and compliance, to disposal and file closure — with strict departmental and divisional access scoping.

> Built by **Innomax IT Solutions** for the Yadadri Bhuvanagiri Collectorate (currently under the administration of Sri Anuraag Jayanti, IAS).

**Live demo:** https://lcms-ybg-tg.lovable.app

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Module Inventory](#module-inventory)
4. [Roles & Access Model](#roles--access-model)
5. [Seeded Demo Logins](#seeded-demo-logins-31-accounts--all-password-demo123)
6. [District Data Model](#district-data-model)
7. [Case Lifecycle & Workflow](#case-lifecycle--workflow)
8. [Seeded Case Data](#seeded-case-data-168-cases)
9. [Project Structure](#project-structure)
10. [Persistence Layer](#persistence-layer)
11. [Design System](#design-system)
12. [Getting Started](#getting-started)
13. [What's NOT Built](#whats-not-built)

---

## Overview

LCMS is a single-district legal monitoring platform that consolidates writ petitions, land disputes, revenue cases, service matters and contempt proceedings across **17 mandals**, **2 divisions (Bhongir & Choutuppal)** and **10 departments**. It enforces a strict role-and-scope model so that every officer — Collector to Mandal-Level user — sees only what they are authorised to see.

The current build is a **fully-functional UI demo** backed by `localStorage`, designed to be lifted onto a Laravel + MySQL backend without rework of the frontend.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript 5 |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS v3 + shadcn/ui (Radix UI) |
| Routing | React Router DOM v6 |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| State | React Context API + TanStack Query |
| Persistence (demo) | Browser `localStorage` (versioned seed) |
| Testing | Vitest + Playwright |
| Target Backend | Laravel + MySQL (manual-entry-first) |

---

## Module Inventory

### 1. Authentication
- Login / Logout, Forgot Password, Reset Password
- Session persistence via `localStorage`
- Active/Inactive account enforcement
- Per-user `lastLogin` tracking

### 2. Dashboards (Role-Aware)
- **District Collector Dashboard** — executive, summary-first view tailored for monitoring. Includes:
  - **Collector Case Analytics** widget with clickable summary cards (**Total Cases**, **Disposed**, **Pending Counter**) that drill into a filtered `/cases` view
  - Dashboard-level filters: **Court Type**, **Case Type**, and **Date Range** (filing date)
  - **Court-wise classification** table with clickable Complied / Non-Complied and Counter Filed / Pending counts
  - **Compliance Failed** and **Requires Your Attention** panels with "pending at" level visibility
  - Disposal Rate intentionally excluded — Collector focus is monitoring, not throughput
- **Global Date Filter** in the dashboard header (all roles) — scopes case-derived metrics by filing date
- **Other Role Dashboards** — 12+ clickable KPI cards (Fresh, Ongoing, Closed, Land Disputes, Service Matters, Contempt, Pending Counters, Upcoming Hearings, Overdue Compliance, etc.) with live charts (status / court / mandal / department / priority mix)
- Scoping: RDO sees division-wide, Department Nodal Officer sees department-only, Mandal-Level User sees mandal-only


### 3. Case Management
- **Case List** — high-density operational table with Petitioner/Respondent + N badge for multi-party, urgency colour-coding (Red ≤0d, Orange 1–3d, Green 4d+)
- **Case Details** — Summary, multi-Petitioner/Respondent cards, Petition Details (Prayer, Date of Filing, Date of Listing), Primary Respondent (Department / Office / Name), Directions, Actions Taken, Counter (with Counter Filing Date), Interim Order (date, directions, disposal period, compliance), Final Order (date, directions, disposal period, compliance), Audit Trail, document tabs (Filed / Interim / Counter / Compliance / Judgment / Misc)
- **Add / Edit Case** — full form with validation, including Affidavit upload, Instructions filed flag, and structured Interim/Final order blocks
- **Bulk Upload** — CSV ingestion
- **Fresh / Ongoing / Closed** — pre-filtered shortcuts
- **HC Status** action — deep-link to Telangana High Court portal

### 4. Hearings
- Hearing List with date, court, type, officer, outcome
- **Court Liaison Updates** — rapid daily desk for HC Representative Officer to record hearing outcomes, orders passed, compliance flags

### 5. Appeals
- Appeals linked to parent cases (parent–child traceability)
- Filing date, grounds, stage, assigned officer, next hearing, outcome

### 6. Compliance Tracker
- Order-compliance status by department and officer
- Due-date monitoring with overdue surfacing

### 7. Alerts Centre
- Derived priority-based alerts: **Counter Filing Due**, **S.R. Number Pending**, **Direction Pending**, **Disposed Not Closed**, **Date of Listing Reminder**, **Instructions Not Filed**, **Interim Order Compliance Pending**, **Final Order Compliance Pending**, Hearing Reminder
- Per-officer routing, channel indicator (Email / SMS — UI only)

### 8. Reports & Analytics
- Charts: by Status, Court, Mandal, Department, Priority, Filing Year
- CSV export including new workflow fields (Date of Filing, Date of Listing, Prayer, Respondent Dept/Office/Name, Counter Filing Date, Interim/Final order details)
- Workflow filters: `interim_pending`, `final_pending`, `listing_pending`

### 9. Admin Panel
- **Users** — CRUD, role assignment, status toggle, password reset
- **Roles & Permissions** — matrix view of 25+ roles
- **Documents** — central document library
- **Audit Logs** — global, last 500 actions across the system
- **Case Status Master** — Super Admin & District Legal Officer can add/remove custom case statuses; system defaults are protected, statuses in use cannot be deleted, and all changes are written to the audit log. New statuses automatically appear in case-status dropdowns
- **Settings** — system configuration

### 10. Profile
- View profile, change password

### 11. Workflow Engine (built into DataContext)
- Direction issuance to concerned department / officer
- Action-taken upload (auto-completes linked direction)
- Counter status transitions (with `srNumber`, approved counter doc)
- Disposal (`disposed`, `disposalDate`, `disposalSummary`, judgment doc)
- File closure — gated to Collector / Addl Collectors / DLO / Admin / Super Admin, blocked unless **disposed = Yes** and **all directions completed**
- Per-case audit trail + global audit ledger

---

## Roles & Access Model

25+ roles across 5 tiers. Permissions are defined in `src/lib/permissions.ts`; data scoping is enforced in `src/hooks/useRoleFilter.ts`.

| Tier | Roles |
|---|---|
| **System** | Super Admin, Admin, Data Entry Operator, Read-Only Viewer |
| **Leadership** | District Collector, Additional Collector (Revenue), Additional Collector (Local Bodies), Administrative Officer |
| **Legal Cell** | District Legal Officer, High Court Representative Officer, Section C Officer, Section D Officer, Section E Officer, Section G Officer |
| **Divisional** | RDO Bhongir, RDO Choutuppal |
| **Departmental / Field** | 10 × Department Nodal Officer (one per department), Mandal-Level User (one per mandal), Case Handling Officer |

### Closure Authority
File-closure is restricted to: District Collector, Additional Collector (Revenue), Additional Collector (Local Bodies), District Legal Officer, Admin, Super Admin.

### Sub-level Constraint
Mandal-Level Users and Data Entry Operators **can create cases** but have restricted edit/delete and no access to admin/audit modules.

---

## Seeded Demo Logins (31 accounts — all password `demo123`)

### System
| Email | Role |
|---|---|
| superadmin@lcms.local | Super Admin |
| admin@lcms.local | Admin |
| dataentry@lcms.local | Data Entry Operator |
| viewer@lcms.local | Read-Only Viewer |

### Leadership
| Email | Role |
|---|---|
| collector@lcms.local | District Collector — Sri Anuraag Jayanti, IAS |
| addlcollector.rev@lcms.local | Addl Collector (Revenue) — Sri K. Venka Reddy |
| addlcollector.lb@lcms.local | Addl Collector (Local Bodies) — Sri A. Bhaskar Rao |
| ao@lcms.local | Administrative Officer — Sri K. Anji Reddy |

### Legal Cell
| Email | Role |
|---|---|
| legalofficer@lcms.local | District Legal Officer |
| liaisonofficer@lcms.local | High Court Representative Officer |
| sectionc@lcms.local | Section C Officer |
| sectiond@lcms.local | Section D Officer |
| sectione@lcms.local | Section E Officer |
| sectiong@lcms.local | Section G Officer |

### Divisions / RDOs
| Email | Role |
|---|---|
| rdo.bhongir@lcms.local | RDO Bhongir |
| rdo.choutuppal@lcms.local | RDO Choutuppal |

### Department Nodal Officers (10 — auto-scoped to their department)
| Email | Department |
|---|---|
| dept.legalcell@lcms.local | Collectorate Legal Cell |
| dept.revenue@lcms.local | Revenue Department |
| dept.landrecords@lcms.local | Land Records |
| dept.tahsildar@lcms.local | Tahsildar Office |
| dept.survey@lcms.local | Survey & Settlement |
| dept.municipal@lcms.local | Municipal Administration |
| dept.panchayat@lcms.local | Panchayat Raj |
| dept.randb@lcms.local | Roads & Buildings |
| dept.irrigation@lcms.local | Irrigation |
| dept.education@lcms.local | Education Department |

### Mandal-Level Users
| Email | Mandal |
|---|---|
| tahsildar.bhongir@lcms.local | Bhongir |
| tahsildar.choutuppal@lcms.local | Choutuppal |
| tahsildar.alair@lcms.local | Alair |
| tahsildar.yadagirigutta@lcms.local | Yadagirigutta |

---

## District Data Model

### Mandals (17)
Bhongir, Choutuppal, Alair, Turkapally, Yadagirigutta, Bibinagar, Pochampally, Valigonda, Atmakur (M), Bommalaramaram, Mothkur, Addaguduru, Ramannapeta, Rajapet, Narayanpur, Gundala, Bhoodan Pochampally.

### Divisions (2)
- **Bhongir Division** — Bhongir, Bibinagar, Bhoodan Pochampally, Pochampally, Yadagirigutta, Alair, Bommalaramaram, Turkapally
- **Choutuppal Division** — Choutuppal, Valigonda, Atmakur (M), Mothkur, Addaguduru, Ramannapeta, Rajapet, Narayanpur, Gundala

### Departments (10)
Collectorate Legal Cell · Revenue Department · Land Records · Tahsildar Office · Survey & Settlement · Municipal Administration · Panchayat Raj · Roads & Buildings · Irrigation · Education Department.

### Classification Dimensions
Case Type (Writ / Land / Revenue / Service / Contempt / Civil) · Filing Year · Mandal · Department · Priority · Court · Status · Pending Level.

---

## Case Lifecycle & Workflow

```
Registration → Assignment (Officer / Department)
   → Hearing Schedule → Direction Issued
   → Action Taken Uploaded → Counter Filing
   → Compliance Tracking → Disposal
   → File Closure (gated)
```

### Case Statuses
`Fresh` · `Ongoing` · `Hearing Scheduled` · `Counter Pending` · `Under Process` · `Under Hearing` · `Pending` · `Disposed` · `Closed` · `Appealed`.

### Pending-At-Level States
`Department` · `GP Approval` · `Collector Approval` · `Counter Filing` · `Compliance` · `Disposed` · `Closed`.

### Audit
Every workflow action writes a per-case `auditTrail` entry **and** a global ledger entry (last 500). Captures actor, role, timestamp, action, details.

---

## Seeded Case Data (168 cases)

| Bucket | Count |
|---|---|
| Original baseline cases | 38 |
| Departmental seed (10 per department × 10) | 100 |
| Collectorate / Legal / Section-driven (C/D/E/G) | 30 |
| **Total** | **168** |

Cases are spread across all 7 workflow states, both divisions, all 17 mandals, and all 10 departments — with realistic `srNumber`, multi-party petitioners/respondents, hearings, directions, actions, counters and audit trails. Hearing dates and counter deadlines are spread across the upcoming weeks so dashboards, alerts and the urgency colour-coding render meaningfully on first load.

The seed is **versioned** (`CURRENT_SEED_VERSION` in `DataContext.tsx`). Bumping the version automatically clears stale `localStorage` keys so all demo browsers receive new seed data on next load.

---

## Project Structure

```
src/
├── components/
│   ├── layout/        # AppLayout, AppSidebar, TopBar
│   ├── shared/        # PageHeader, StatsCard, StatusBadge
│   └── ui/            # shadcn/ui library
├── contexts/
│   ├── AuthContext.tsx    # 31 seeded users, login/session
│   └── DataContext.tsx    # cases/hearings/appeals/alerts + workflow engine
├── data/
│   └── sampleData.ts      # 168 cases, hearings, appeals, alerts
├── hooks/
│   ├── useRoleFilter.ts   # role-based data scoping
│   ├── use-mobile.ts
│   └── use-toast.ts
├── lib/
│   ├── permissions.ts     # role → permission matrix
│   └── utils.ts
└── pages/
    ├── admin/        # Users, Roles, Documents, Audit Logs, Settings
    ├── alerts/       # Alert Centre
    ├── appeals/      # List, Add
    ├── cases/        # List, Details, Add, Edit, Bulk Upload, Fresh/Ongoing/Closed
    ├── compliance/   # Compliance Tracker
    ├── hearings/     # List, Court Liaison Updates
    ├── profile/      # Profile, Change Password
    ├── reports/      # Reports
    ├── Dashboard.tsx
    ├── Login.tsx
    ├── ForgotPassword.tsx
    ├── ResetPassword.tsx
    └── NotFound.tsx
```

---

## Persistence Layer

The demo uses browser `localStorage` to simulate a backend. Keys:

| Key | Holds |
|---|---|
| `lcms_users` | Seeded + admin-created users |
| `lcms_session` | Logged-in user email |
| `lcms_cases` | All case records |
| `lcms_hearings` | All hearings |
| `lcms_appeals` | All appeals |
| `lcms_alerts` | All alerts |
| `lcms_case_docs` | Uploaded documents |
| `lcms_audit` | Global audit ledger (last 500) |
| `lcms_seed_version` | Seed version guard |

To **reset the demo to factory state**: clear site data (DevTools → Application → Storage → Clear site data) and reload.

---

## Design System

- Government-grade visual language: muted blue/grey palette, gold accent, high-density typography
- All colours are HSL semantic tokens defined in `src/index.css` and `tailwind.config.ts` (no hard-coded colours in components)
- Avoids cloud-provider branding (no AWS / GCP / Azure references) — designed for on-premise government hosting
- Sidebar with collapsible **Departments** (live case-count badges), **Divisions**, **Admin** sections
- Responsive: full support across mobile, tablet, desktop

---

## Getting Started

### Prerequisites
- Node.js 18+ or Bun

### Install & Run
```bash
npm install
npm run dev
```

### Build for Production
```bash
npm run build
```

### Run Tests
```bash
npm run test
```

### Default Login
Email: `collector@lcms.local` · Password: `demo123`
(Or any of the 31 accounts listed above — all use `demo123`.)

---

## What's NOT Built

- Real backend (Laravel + MySQL) — **currently a localStorage demo**
- Live e-courts API integration — by design, manual-entry-first
- Email/SMS delivery for alerts — UI only
- Real file upload to storage — document UI is presentational
- Mobile-optimised layouts for some workflow screens — desktop-first government workflow

---

## Branch Strategy

| Branch | Purpose |
|---|---|
| `main` | Production-ready code |
| `nabeela_dev` | Active development |

## Repository
[https://github.com/PrasanthiPayyala/admini-case-flow](https://github.com/PrasanthiPayyala/admini-case-flow)

---

© Innomax IT Solutions · Built for Yadadri Bhuvanagiri District Collectorate, Telangana.
