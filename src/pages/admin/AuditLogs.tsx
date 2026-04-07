import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { auditLogs } from "@/data/sampleData";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

export default function AuditLogs() {
  return (
    <AppLayout>
      <PageHeader
        title="Audit Logs"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Administration" }, { label: "Audit Logs" }]}
      />

      <div className="govt-card p-4 mb-4">
        <div className="flex gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input placeholder="Search logs..." className="pl-9 h-9 text-sm" />
          </div>
          <Select>
            <SelectTrigger className="w-[160px] h-9 text-sm"><SelectValue placeholder="Action Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="created">Created</SelectItem>
              <SelectItem value="updated">Updated</SelectItem>
              <SelectItem value="uploaded">Uploaded</SelectItem>
              <SelectItem value="modified">Modified</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[160px] h-9 text-sm"><SelectValue placeholder="User" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="srinivas">K. Srinivas Rao</SelectItem>
              <SelectItem value="padma">S. Padma Kumari</SelectItem>
              <SelectItem value="priya">M. Priya</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="govt-card overflow-hidden">
        <table className="w-full govt-table">
          <thead>
            <tr><th>Timestamp</th><th>User</th><th>Role</th><th>Action</th><th>Object</th><th>Details</th></tr>
          </thead>
          <tbody>
            {auditLogs.map(log => (
              <tr key={log.id}>
                <td className="font-mono text-xs">{log.timestamp}</td>
                <td className="font-medium text-foreground text-xs">{log.user}</td>
                <td className="text-xs">{log.role}</td>
                <td>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    log.action === "Created" ? "bg-status-fresh/10 text-status-fresh" :
                    log.action === "Updated" ? "bg-status-ongoing/10 text-status-ongoing" :
                    log.action === "Uploaded" ? "bg-status-appealed/10 text-status-appealed" :
                    "bg-status-warning/10 text-status-warning"
                  }`}>{log.action}</span>
                </td>
                <td className="text-xs">{log.object}</td>
                <td className="text-xs max-w-[250px] truncate">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}
