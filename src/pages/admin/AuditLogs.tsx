import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { auditLogs } from "@/data/sampleData";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

export default function AuditLogs() {
  return (
    <AppLayout>
      <PageHeader title="Audit Logs" breadcrumbs={[{ label: "Home", href: "/" }, { label: "Administration" }, { label: "Audit Logs" }]} />

      <div className="govt-card p-3 mb-4">
        <div className="flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input placeholder="Search by user, action, object..." className="pl-9 h-8 text-xs" />
          </div>
          <Select><SelectTrigger className="w-[120px] h-8 text-xs"><SelectValue placeholder="Module" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Modules</SelectItem>
              {["Cases","Hearings","Compliance","Appeals","Documents","Users","Alerts","Reports"].map(m => <SelectItem key={m} value={m.toLowerCase()}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select><SelectTrigger className="w-[120px] h-8 text-xs"><SelectValue placeholder="Action" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              {["Created","Updated","Uploaded","Modified","Exported","Bulk Upload"].map(a => <SelectItem key={a} value={a.toLowerCase()}>{a}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="govt-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full govt-table">
            <thead><tr><th>Timestamp</th><th>User</th><th>Role</th><th>Module</th><th>Action</th><th>Object</th><th>Details</th></tr></thead>
            <tbody>
              {auditLogs.map(log => (
                <tr key={log.id}>
                  <td className="text-xs whitespace-nowrap">{log.timestamp}</td>
                  <td className="text-xs font-medium">{log.user}</td>
                  <td className="text-[10px]">{log.role}</td>
                  <td className="text-xs"><span className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground text-[10px]">{log.module}</span></td>
                  <td className="text-xs">{log.action}</td>
                  <td className="text-xs max-w-[150px] truncate">{log.object}</td>
                  <td className="text-xs max-w-[200px] truncate text-muted-foreground">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2 border-t border-border text-xs text-muted-foreground">Showing {auditLogs.length} log entries</div>
      </div>
    </AppLayout>
  );
}
