import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { auditLogs as seededAuditLogs } from "@/data/sampleData";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { useMemo, useState } from "react";

interface UnifiedLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  module: string;
  action: string;
  object: string;
  details: string;
}

export default function AuditLogs() {
  const { globalAudit } = useData();
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [actionFilter, setActionFilter] = useState("all");

  const allLogs = useMemo<UnifiedLog[]>(() => {
    const live: UnifiedLog[] = globalAudit.map(a => {
      const m = a.details?.match(/^\[([^\]]+)\]\s*(.*)$/);
      const caseId = m?.[1] || "";
      const detailsTxt = m?.[2] || a.details || "";
      return {
        id: a.id,
        timestamp: a.ts.slice(0, 19).replace("T", " "),
        user: a.actor,
        role: a.role,
        module: "Cases",
        action: a.action,
        object: caseId,
        details: detailsTxt,
      };
    });
    const seedAsUnified: UnifiedLog[] = seededAuditLogs.map(s => ({ ...s, id: String(s.id) }));
    return [...live, ...seedAsUnified];
  }, [globalAudit]);

  const filtered = allLogs.filter(l => {
    if (moduleFilter !== "all" && l.module.toLowerCase() !== moduleFilter) return false;
    if (actionFilter !== "all" && !l.action.toLowerCase().includes(actionFilter)) return false;
    if (search && ![l.user, l.action, l.object, l.details].some(v => v?.toLowerCase().includes(search.toLowerCase()))) return false;
    return true;
  });

  return (
    <AppLayout>
      <PageHeader title="Audit Logs" breadcrumbs={[{ label: "Home", href: "/" }, { label: "Administration" }, { label: "Audit Logs" }]} />

      <div className="govt-card p-3 mb-4">
        <div className="flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by user, action, object..." className="pl-9 h-8 text-xs" />
          </div>
          <Select value={moduleFilter} onValueChange={setModuleFilter}>
            <SelectTrigger className="w-[120px] h-8 text-xs"><SelectValue placeholder="Module" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Modules</SelectItem>
              {["Cases","Hearings","Compliance","Appeals","Documents","Users","Alerts","Reports"].map(m => <SelectItem key={m} value={m.toLowerCase()}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-[140px] h-8 text-xs"><SelectValue placeholder="Action" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              {["Direction","Action Taken","Approved","Counter","Disposed","Closed","Created","Updated","Uploaded"].map(a => <SelectItem key={a} value={a.toLowerCase()}>{a}</SelectItem>)}
            </SelectContent>
          </Select>
          <span className="text-xs text-muted-foreground self-center">Showing {filtered.length} of {allLogs.length} ({globalAudit.length} live)</span>
        </div>
      </div>

      <div className="govt-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full govt-table">
            <thead><tr><th>Timestamp</th><th>User</th><th>Role</th><th>Module</th><th>Action</th><th>Object</th><th>Details</th></tr></thead>
            <tbody>
              {filtered.map(log => (
                <tr key={log.id}>
                  <td className="text-xs whitespace-nowrap">{log.timestamp}</td>
                  <td className="text-xs font-medium">{log.user}</td>
                  <td className="text-[10px]">{log.role}</td>
                  <td className="text-xs"><span className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground text-[10px]">{log.module}</span></td>
                  <td className="text-xs">{log.action}</td>
                  <td className="text-xs max-w-[160px] truncate">{log.object}</td>
                  <td className="text-xs max-w-[260px] truncate text-muted-foreground">{log.details}</td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={7} className="text-center text-xs text-muted-foreground py-6">No log entries match.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
