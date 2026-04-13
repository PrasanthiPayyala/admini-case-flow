export type AppRole =
  | "Super Admin"
  | "Admin"
  | "District Collector"
  | "District Legal Officer"
  | "High Court Representative Officer"
  | "Department Nodal Officer"
  | "Mandal-Level User"
  | "Data Entry Operator"
  | "Read-Only Viewer";

export const ALL_ROLES: AppRole[] = [
  "Super Admin", "Admin", "District Collector", "District Legal Officer",
  "High Court Representative Officer", "Department Nodal Officer",
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
  visibleSidebarSections: { main: boolean; admin: boolean; account: boolean };
  visibleMenuItems: string[];
}

const FULL_MENU = [
  "/", "/cases", "/appeals", "/hearings", "/court-liaison", "/compliance",
  "/alerts", "/reports", "/users", "/roles", "/documents", "/audit-logs",
  "/settings", "/profile", "/change-password",
];

export function getPermissions(role: AppRole): Permissions {
  switch (role) {
    case "Super Admin":
      return {
        canCreateCase: true, canEditCase: true, canDeleteCase: true,
        canCreateUser: true, canEditUser: true, canManageRoles: true,
        canViewDashboard: true, canViewCases: true, canViewHearings: true,
        canUpdateHearing: true, canViewAppeals: true, canCreateAppeal: true,
        canViewReports: true, canExportReports: true, canBulkUpload: true,
        canViewAuditLogs: true, canManageSettings: true,
        canViewCompliance: true, canUpdateCompliance: true,
        canViewCourtLiaison: true, canUpdateCourtLiaison: true,
        canViewDocuments: true, canUploadDocuments: true, canViewAlerts: true,
        visibleSidebarSections: { main: true, admin: true, account: true },
        visibleMenuItems: FULL_MENU,
      };
    case "Admin":
      return {
        canCreateCase: true, canEditCase: true, canDeleteCase: true,
        canCreateUser: true, canEditUser: true, canManageRoles: false,
        canViewDashboard: true, canViewCases: true, canViewHearings: true,
        canUpdateHearing: true, canViewAppeals: true, canCreateAppeal: true,
        canViewReports: true, canExportReports: true, canBulkUpload: true,
        canViewAuditLogs: true, canManageSettings: true,
        canViewCompliance: true, canUpdateCompliance: true,
        canViewCourtLiaison: true, canUpdateCourtLiaison: true,
        canViewDocuments: true, canUploadDocuments: true, canViewAlerts: true,
        visibleSidebarSections: { main: true, admin: true, account: true },
        visibleMenuItems: FULL_MENU,
      };
    case "District Collector":
      return {
        canCreateCase: false, canEditCase: false, canDeleteCase: false,
        canCreateUser: false, canEditUser: false, canManageRoles: false,
        canViewDashboard: true, canViewCases: true, canViewHearings: true,
        canUpdateHearing: false, canViewAppeals: true, canCreateAppeal: false,
        canViewReports: true, canExportReports: true, canBulkUpload: false,
        canViewAuditLogs: true, canManageSettings: false,
        canViewCompliance: true, canUpdateCompliance: false,
        canViewCourtLiaison: true, canUpdateCourtLiaison: false,
        canViewDocuments: true, canUploadDocuments: false, canViewAlerts: true,
        visibleSidebarSections: { main: true, admin: false, account: true },
        visibleMenuItems: ["/", "/cases", "/appeals", "/hearings", "/court-liaison", "/compliance", "/alerts", "/reports", "/documents", "/audit-logs", "/profile", "/change-password"],
      };
    case "District Legal Officer":
      return {
        canCreateCase: true, canEditCase: true, canDeleteCase: false,
        canCreateUser: false, canEditUser: false, canManageRoles: false,
        canViewDashboard: true, canViewCases: true, canViewHearings: true,
        canUpdateHearing: true, canViewAppeals: true, canCreateAppeal: true,
        canViewReports: true, canExportReports: true, canBulkUpload: true,
        canViewAuditLogs: false, canManageSettings: false,
        canViewCompliance: true, canUpdateCompliance: true,
        canViewCourtLiaison: true, canUpdateCourtLiaison: true,
        canViewDocuments: true, canUploadDocuments: true, canViewAlerts: true,
        visibleSidebarSections: { main: true, admin: false, account: true },
        visibleMenuItems: ["/", "/cases", "/appeals", "/hearings", "/court-liaison", "/compliance", "/alerts", "/reports", "/documents", "/profile", "/change-password"],
      };
    case "High Court Representative Officer":
      return {
        canCreateCase: false, canEditCase: false, canDeleteCase: false,
        canCreateUser: false, canEditUser: false, canManageRoles: false,
        canViewDashboard: true, canViewCases: true, canViewHearings: true,
        canUpdateHearing: true, canViewAppeals: true, canCreateAppeal: false,
        canViewReports: false, canExportReports: false, canBulkUpload: false,
        canViewAuditLogs: false, canManageSettings: false,
        canViewCompliance: true, canUpdateCompliance: true,
        canViewCourtLiaison: true, canUpdateCourtLiaison: true,
        canViewDocuments: true, canUploadDocuments: true, canViewAlerts: true,
        visibleSidebarSections: { main: true, admin: false, account: true },
        visibleMenuItems: ["/", "/cases", "/hearings", "/court-liaison", "/compliance", "/alerts", "/documents", "/profile", "/change-password"],
      };
    case "Department Nodal Officer":
      return {
        canCreateCase: false, canEditCase: true, canDeleteCase: false,
        canCreateUser: false, canEditUser: false, canManageRoles: false,
        canViewDashboard: true, canViewCases: true, canViewHearings: true,
        canUpdateHearing: false, canViewAppeals: false, canCreateAppeal: false,
        canViewReports: true, canExportReports: false, canBulkUpload: false,
        canViewAuditLogs: false, canManageSettings: false,
        canViewCompliance: true, canUpdateCompliance: true,
        canViewCourtLiaison: false, canUpdateCourtLiaison: false,
        canViewDocuments: true, canUploadDocuments: true, canViewAlerts: true,
        visibleSidebarSections: { main: true, admin: false, account: true },
        visibleMenuItems: ["/", "/cases", "/hearings", "/compliance", "/alerts", "/reports", "/documents", "/profile", "/change-password"],
      };
    case "Mandal-Level User":
      return {
        canCreateCase: true, canEditCase: true, canDeleteCase: false,
        canCreateUser: false, canEditUser: false, canManageRoles: false,
        canViewDashboard: true, canViewCases: true, canViewHearings: true,
        canUpdateHearing: false, canViewAppeals: false, canCreateAppeal: false,
        canViewReports: false, canExportReports: false, canBulkUpload: false,
        canViewAuditLogs: false, canManageSettings: false,
        canViewCompliance: true, canUpdateCompliance: false,
        canViewCourtLiaison: false, canUpdateCourtLiaison: false,
        canViewDocuments: true, canUploadDocuments: true, canViewAlerts: true,
        visibleSidebarSections: { main: true, admin: false, account: true },
        visibleMenuItems: ["/", "/cases", "/hearings", "/compliance", "/alerts", "/documents", "/profile", "/change-password"],
      };
    case "Data Entry Operator":
      return {
        canCreateCase: true, canEditCase: true, canDeleteCase: false,
        canCreateUser: false, canEditUser: false, canManageRoles: false,
        canViewDashboard: true, canViewCases: true, canViewHearings: true,
        canUpdateHearing: false, canViewAppeals: false, canCreateAppeal: false,
        canViewReports: false, canExportReports: false, canBulkUpload: true,
        canViewAuditLogs: false, canManageSettings: false,
        canViewCompliance: false, canUpdateCompliance: false,
        canViewCourtLiaison: false, canUpdateCourtLiaison: false,
        canViewDocuments: true, canUploadDocuments: true, canViewAlerts: false,
        visibleSidebarSections: { main: true, admin: false, account: true },
        visibleMenuItems: ["/", "/cases", "/documents", "/profile", "/change-password"],
      };
    case "Read-Only Viewer":
      return {
        canCreateCase: false, canEditCase: false, canDeleteCase: false,
        canCreateUser: false, canEditUser: false, canManageRoles: false,
        canViewDashboard: true, canViewCases: true, canViewHearings: true,
        canUpdateHearing: false, canViewAppeals: true, canCreateAppeal: false,
        canViewReports: true, canExportReports: false, canBulkUpload: false,
        canViewAuditLogs: false, canManageSettings: false,
        canViewCompliance: true, canUpdateCompliance: false,
        canViewCourtLiaison: false, canUpdateCourtLiaison: false,
        canViewDocuments: true, canUploadDocuments: false, canViewAlerts: true,
        visibleSidebarSections: { main: true, admin: false, account: true },
        visibleMenuItems: ["/", "/cases", "/appeals", "/hearings", "/compliance", "/alerts", "/reports", "/documents", "/profile", "/change-password"],
      };
  }
}
