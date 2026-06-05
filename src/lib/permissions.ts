export type AppRole =
  | "Super Admin"
  | "Admin"
  | "District Collector"
  | "Additional Collector (Revenue)"
  | "Additional Collector (Local Bodies)"
  | "DRO"
  | "Administrative Officer"
  | "District Legal Officer"
  | "Section C Officer"
  | "Section D Officer"
  | "Section E Officer"
  | "Section G Officer"
  | "RDO Bhongir"
  | "RDO Choutuppal"
  | "High Court Representative Officer"
  | "Department Nodal Officer"
  | "Case Handling Officer"
  | "Mandal-Level User"
  | "Data Entry Operator"
  | "Read-Only Viewer";

export const ALL_ROLES: AppRole[] = [
  "Super Admin", "Admin", "District Collector",
  "Additional Collector (Revenue)", "Additional Collector (Local Bodies)",
  "DRO", "Administrative Officer",
  "District Legal Officer", "Section C Officer", "Section D Officer", "Section E Officer", "Section G Officer",
  "RDO Bhongir", "RDO Choutuppal",
  "High Court Representative Officer", "Department Nodal Officer", "Case Handling Officer",
  "Mandal-Level User", "Data Entry Operator", "Read-Only Viewer",
];

export interface Permissions {
  canCreateCase: boolean;
  canEditCase: boolean;
  canDeleteCase: boolean;
  canCreateUser: boolean;
  canEditUser: boolean;
  canManageRoles: boolean;
  canViewDashboard: boolean;
  canViewCases: boolean;
  canViewHearings: boolean;
  canUpdateHearing: boolean;
  canViewAppeals: boolean;
  canCreateAppeal: boolean;
  canViewReports: boolean;
  canExportReports: boolean;
  canBulkUpload: boolean;
  canViewAuditLogs: boolean;
  canManageSettings: boolean;
  canViewCompliance: boolean;
  canUpdateCompliance: boolean;
  canViewCourtLiaison: boolean;
  canUpdateCourtLiaison: boolean;
  canViewDocuments: boolean;
  canUploadDocuments: boolean;
  canViewAlerts: boolean;
  canApproveGP: boolean;
  canApproveCollector: boolean;
  visibleSidebarSections: { main: boolean; admin: boolean; account: boolean; departments: boolean; divisions: boolean; collectorQuickAccess: boolean };
  visibleMenuItems: string[];
}

const FULL_MENU = [
  "/", "/cases", "/cases/fresh", "/cases/ongoing", "/cases/closed",
  "/appeals", "/hearings", "/court-liaison", "/daily-hearing-desk", "/compliance",
  "/alerts", "/reports", "/users", "/roles", "/documents", "/case-status-master", "/audit-logs",
  "/settings", "/profile", "/change-password",
];

const MAIN_MENU = [
  "/", "/cases", "/cases/fresh", "/cases/ongoing", "/cases/closed",
  "/appeals", "/hearings", "/court-liaison", "/daily-hearing-desk", "/compliance",
  "/alerts", "/reports", "/documents", "/profile", "/change-password",
];

const COLLECTOR_MENU = [
  "/", "/cases", "/cases/fresh", "/cases/ongoing", "/cases/closed",
  "/appeals", "/hearings", "/court-liaison", "/daily-hearing-desk", "/compliance",
  "/alerts", "/reports", "/documents", "/audit-logs", "/profile", "/change-password",
];

const baseSidebar = { main: true, admin: false, account: true, departments: true, divisions: true, collectorQuickAccess: false };

function makePerms(overrides: Partial<Permissions>): Permissions {
  return {
    canCreateCase: false, canEditCase: false, canDeleteCase: false,
    canCreateUser: false, canEditUser: false, canManageRoles: false,
    canViewDashboard: true, canViewCases: true, canViewHearings: true,
    canUpdateHearing: false, canViewAppeals: true, canCreateAppeal: false,
    canViewReports: true, canExportReports: false, canBulkUpload: false,
    canViewAuditLogs: false, canManageSettings: false,
    canViewCompliance: true, canUpdateCompliance: false,
    canViewCourtLiaison: true, canUpdateCourtLiaison: false,
    canViewDocuments: true, canUploadDocuments: false, canViewAlerts: true,
    canApproveGP: false, canApproveCollector: false,
    visibleSidebarSections: { ...baseSidebar },
    visibleMenuItems: MAIN_MENU,
    ...overrides,
  };
}

export function getPermissions(role: AppRole): Permissions {
  switch (role) {
    case "Super Admin":
      return makePerms({
        canCreateCase: true, canEditCase: true, canDeleteCase: true,
        canCreateUser: true, canEditUser: true, canManageRoles: true,
        canUpdateHearing: true, canCreateAppeal: true,
        canExportReports: true, canBulkUpload: true,
        canViewAuditLogs: true, canManageSettings: true,
        canUpdateCompliance: true, canUpdateCourtLiaison: true,
        canUploadDocuments: true, canApproveGP: true, canApproveCollector: true,
        visibleSidebarSections: { main: true, admin: true, account: true, departments: true, divisions: true, collectorQuickAccess: true },
        visibleMenuItems: FULL_MENU,
      });
    case "Admin":
      return makePerms({
        canCreateCase: true, canEditCase: true, canDeleteCase: true,
        canCreateUser: true, canEditUser: true,
        canUpdateHearing: true, canCreateAppeal: true,
        canExportReports: true, canBulkUpload: true,
        canViewAuditLogs: true, canManageSettings: true,
        canUpdateCompliance: true, canUpdateCourtLiaison: true,
        canUploadDocuments: true, canApproveGP: true,
        visibleSidebarSections: { main: true, admin: true, account: true, departments: true, divisions: true, collectorQuickAccess: true },
        visibleMenuItems: FULL_MENU,
      });
    case "District Collector":
      return makePerms({
        canExportReports: true, canViewAuditLogs: true,
        canApproveCollector: true,
        visibleSidebarSections: { main: true, admin: false, account: true, departments: true, divisions: true, collectorQuickAccess: true },
        visibleMenuItems: COLLECTOR_MENU,
      });
    case "Additional Collector (Revenue)":
      return makePerms({
        canEditCase: true, canExportReports: true, canApproveGP: true,
        canUpdateCompliance: true, canUploadDocuments: true,
        visibleSidebarSections: { main: true, admin: false, account: true, departments: true, divisions: true, collectorQuickAccess: true },
        visibleMenuItems: COLLECTOR_MENU,
      });
    case "Additional Collector (Local Bodies)":
      return makePerms({
        canEditCase: true, canExportReports: true, canApproveGP: true,
        canUpdateCompliance: true, canUploadDocuments: true,
        visibleSidebarSections: { main: true, admin: false, account: true, departments: true, divisions: true, collectorQuickAccess: true },
        visibleMenuItems: COLLECTOR_MENU,
      });
    case "DRO":
      return makePerms({
        canEditCase: true, canExportReports: true,
        canUpdateCompliance: true, canUploadDocuments: true,
        visibleSidebarSections: { main: true, admin: false, account: true, departments: true, divisions: true, collectorQuickAccess: true },
        visibleMenuItems: MAIN_MENU,
      });
    case "Administrative Officer":
      return makePerms({
        canEditCase: true, canExportReports: true,
        canUpdateCompliance: true, canUploadDocuments: true,
        visibleSidebarSections: { main: true, admin: false, account: true, departments: true, divisions: false, collectorQuickAccess: true },
        visibleMenuItems: MAIN_MENU,
      });
    case "District Legal Officer":
      return makePerms({
        canCreateCase: true, canEditCase: true,
        canUpdateHearing: true, canCreateAppeal: true,
        canExportReports: true, canBulkUpload: true,
        canUpdateCompliance: true, canUpdateCourtLiaison: true,
        canUploadDocuments: true, canApproveGP: true,
        visibleSidebarSections: { main: true, admin: true, account: true, departments: true, divisions: true, collectorQuickAccess: true },
        visibleMenuItems: [...MAIN_MENU, "/case-status-master", "/audit-logs"],
      });
    case "Section C Officer":
    case "Section D Officer":
    case "Section E Officer":
    case "Section G Officer":
      return makePerms({
        canCreateCase: true, canEditCase: true,
        canUpdateHearing: true, canCreateAppeal: true,
        canUpdateCompliance: true, canUploadDocuments: true,
        visibleSidebarSections: { main: true, admin: false, account: true, departments: true, divisions: false, collectorQuickAccess: false },
        visibleMenuItems: MAIN_MENU,
      });
    case "RDO Bhongir":
    case "RDO Choutuppal":
      return makePerms({
        canEditCase: true, canExportReports: true,
        canUpdateCompliance: true, canUploadDocuments: true,
        visibleSidebarSections: { main: true, admin: false, account: true, departments: true, divisions: true, collectorQuickAccess: false },
        visibleMenuItems: MAIN_MENU,
      });
    case "High Court Representative Officer":
      return makePerms({
        canUpdateHearing: true,
        canUpdateCompliance: true, canUpdateCourtLiaison: true,
        canUploadDocuments: true,
        visibleSidebarSections: { main: true, admin: false, account: true, departments: false, divisions: false, collectorQuickAccess: false },
        visibleMenuItems: ["/", "/cases", "/hearings", "/court-liaison", "/daily-hearing-desk", "/compliance", "/alerts", "/documents", "/profile", "/change-password"],
      });
    case "Department Nodal Officer":
      return makePerms({
        canEditCase: true,
        canUpdateCompliance: true, canUploadDocuments: true,
        visibleSidebarSections: { main: true, admin: false, account: true, departments: true, divisions: false, collectorQuickAccess: false },
        visibleMenuItems: ["/", "/cases", "/hearings", "/compliance", "/alerts", "/reports", "/documents", "/profile", "/change-password"],
      });
    case "Case Handling Officer":
      return makePerms({
        canCreateCase: true, canEditCase: true,
        canUpdateHearing: true, canUpdateCompliance: true, canUploadDocuments: true,
        visibleSidebarSections: { main: true, admin: false, account: true, departments: true, divisions: false, collectorQuickAccess: false },
        visibleMenuItems: MAIN_MENU,
      });
    case "Mandal-Level User":
      return makePerms({
        canCreateCase: true, canEditCase: true,
        canUploadDocuments: true,
        visibleSidebarSections: { main: true, admin: false, account: true, departments: false, divisions: false, collectorQuickAccess: false },
        visibleMenuItems: ["/", "/cases", "/hearings", "/compliance", "/alerts", "/documents", "/profile", "/change-password"],
      });
    case "Data Entry Operator":
      return makePerms({
        canCreateCase: true, canEditCase: true, canBulkUpload: true,
        canUploadDocuments: true,
        canViewAppeals: false, canViewCompliance: false, canViewCourtLiaison: false, canViewAlerts: false,
        visibleSidebarSections: { main: true, admin: false, account: true, departments: false, divisions: false, collectorQuickAccess: false },
        visibleMenuItems: ["/", "/cases", "/documents", "/profile", "/change-password"],
      });
    case "Read-Only Viewer":
      return makePerms({
        canExportReports: false,
        visibleSidebarSections: { main: true, admin: false, account: true, departments: true, divisions: true, collectorQuickAccess: false },
        visibleMenuItems: ["/", "/cases", "/appeals", "/hearings", "/compliance", "/alerts", "/reports", "/documents", "/profile", "/change-password"],
      });
  }
}
