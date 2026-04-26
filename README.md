# LCMS — Legal Case Management System
### Yadadri Bhuvanagiri District, Telangana

A role-based web application for managing legal cases, hearings, appeals, compliance, and court liaison activities for the Yadadri Bhuvanagiri Collectorate.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS + shadcn/ui (Radix UI) |
| Routing | React Router DOM v6 |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| State | React Context API + TanStack Query |
| Testing | Vitest + Playwright |

---

## Features

- **Role-Based Access Control** — 19 distinct roles with granular permission sets
- **Case Management** — Create, edit, view, filter, and bulk-upload legal cases
- **Hearing Tracker** — Schedule and track upcoming court hearings
- **Appeals Module** — File and manage case appeals
- **Compliance Tracking** — Monitor order compliance status by department
- **Court Liaison Updates** — Daily desk for High Court representative officers
- **Alert Center** — Priority-based alerts for officers
- **Reports & Analytics** — Charts by status, court, mandal, department, and priority
- **Admin Panel** — User management, roles & permissions, audit logs, settings
- **Document Management** — Upload and manage case-related documents
- **Responsive Layout** — Full support for mobile, tablet, and desktop

---

## Roles

| Role | Access Level |
|---|---|
| Super Admin | Full system access |
| Admin | Full operational access |
| District Collector | District-wide view + approvals |
| Additional Collector (Revenue / Local Bodies) | Revenue/local scope + GP approvals |
| DRO | District Revenue Officer operations |
| Administrative Officer | Case editing + compliance |
| District Legal Officer | Legal operations + bulk upload |
| Section C / D / E / G Officer | Section-scoped case handling |
| RDO Bhongir / Choutuppal | Divisional access |
| High Court Representative Officer | Court liaison + hearings |
| Department Nodal Officer | Department-scoped cases |
| Case Handling Officer | Full case lifecycle |
| Mandal-Level User | Mandal-scoped entry |
| Data Entry Operator | Case creation + bulk upload |
| Read-Only Viewer | View-only access |

---

## Project Structure

```
src/
├── components/
│   ├── layout/        # AppLayout, AppSidebar, TopBar
│   ├── shared/        # PageHeader, StatsCard, StatusBadge
│   └── ui/            # shadcn/ui component library
├── contexts/          # AuthContext, DataContext
├── data/              # sampleData.ts (seeded demo data)
├── hooks/             # useRoleFilter, use-mobile, use-toast
├── lib/               # permissions.ts, utils.ts
└── pages/
    ├── admin/         # Users, Roles, Documents, Audit Logs, Settings
    ├── alerts/        # Alert Center
    ├── appeals/       # Appeal List, Add Appeal
    ├── cases/         # Case List, Details, Add, Edit, Bulk Upload, Fresh, Ongoing, Closed
    ├── compliance/    # Compliance Tracker
    ├── hearings/      # Hearing List, Court Liaison Updates
    ├── profile/       # Profile, Change Password
    └── reports/       # Reports Page
```

---

## Getting Started

### Prerequisites
- Node.js 18+ or Bun

### Install dependencies
```bash
npm install
# or
bun install
```

### Run development server
```bash
npm run dev
# or
bun dev
```

### Build for production
```bash
npm run build
```

### Run tests
```bash
npm run test
```

---

## Branch Strategy

| Branch | Purpose |
|---|---|
| `main` | Production-ready code |
| `nabeela_dev` | Active development branch |

---

## Repository

[https://github.com/PrasanthiPayyala/admini-case-flow](https://github.com/PrasanthiPayyala/admini-case-flow)


from **Innomax IT Solutions**