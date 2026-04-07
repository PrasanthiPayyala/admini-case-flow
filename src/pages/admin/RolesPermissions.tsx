import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Checkbox } from "@/components/ui/checkbox";

const roles = ["District Collector", "Legal Officer", "Case Handling Officer", "Data Entry Operator", "Admin", "Read-Only Viewer"];
const permissions = [
  "View Dashboard",
  "View Cases",
  "Create/Edit Cases",
  "Delete Cases",
  "View Appeals",
  "Create/Edit Appeals",
  "View Hearings",
  "Update Hearings",
  "View Alerts",
  "Manage Alerts",
  "View Reports",
  "Export Reports",
  "Manage Users",
  "Manage Roles",
  "View Documents",
  "Upload Documents",
  "View Audit Logs",
  "Manage Settings",
];

const matrix: Record<string, string[]> = {
  "District Collector": permissions,
  "Admin": permissions,
  "Legal Officer": permissions.filter(p => !["Delete Cases", "Manage Users", "Manage Roles", "Manage Settings"].includes(p)),
  "Case Handling Officer": ["View Dashboard", "View Cases", "Create/Edit Cases", "View Appeals", "Create/Edit Appeals", "View Hearings", "Update Hearings", "View Alerts", "View Reports", "View Documents", "Upload Documents"],
  "Data Entry Operator": ["View Dashboard", "View Cases", "Create/Edit Cases", "View Appeals", "Create/Edit Appeals", "View Hearings", "View Documents", "Upload Documents"],
  "Read-Only Viewer": ["View Dashboard", "View Cases", "View Appeals", "View Hearings", "View Alerts", "View Reports", "View Documents"],
};

export default function RolesPermissions() {
  return (
    <AppLayout>
      <PageHeader
        title="Roles & Permissions"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Administration" }, { label: "Roles & Permissions" }]}
      />
      <div className="govt-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full govt-table">
            <thead>
              <tr>
                <th className="sticky left-0 bg-muted z-10 min-w-[180px]">Permission</th>
                {roles.map(r => <th key={r} className="text-center min-w-[120px]">{r}</th>)}
              </tr>
            </thead>
            <tbody>
              {permissions.map(p => (
                <tr key={p}>
                  <td className="sticky left-0 bg-card z-10 font-medium text-foreground text-xs">{p}</td>
                  {roles.map(r => (
                    <td key={r} className="text-center">
                      <Checkbox checked={matrix[r]?.includes(p)} disabled className="mx-auto" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
