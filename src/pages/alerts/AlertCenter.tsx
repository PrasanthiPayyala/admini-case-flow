import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Mail, MessageSquare } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { useRoleFilter } from "@/hooks/useRoleFilter";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

interface DerivedAlert {
  id: string;
  type: string;
  message: string;
  caseId: string;
  officer: string;
  date: string;
  priority: string;
  status: string;
  channel: string;
}

export default function AlertCenter() {
  const { alerts: seeded } = useData();
  const { filteredCases } = useRoleFilter();
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const derived = useMemo<DerivedAlert[]>(() => {
    const today = new Date();
    const out: DerivedAlert[] = [];
    filteredCases.forEach(c => {
      // Counter filing due
      if (c.counterFilingDueDate && c.counterFiled !== "Yes") {
        const due = new Date(c.counterFilingDueDate);
        const days = Math.floor((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (days <= 7) {
          out.push({
            id: `DRV-CTR-${c.id}`,
            type: "Counter Filing Due",
            message: `Counter filing due ${days < 0 ? `${Math.abs(days)} day(s) ago` : `in ${days} day(s)`} — ${c.caseNumber}`,
            caseId: c.id,
            officer: c.assignedOfficer,
            date: c.counterFilingDueDate,
            priority: days < 0 ? "Critical" : days <= 2 ? "High" : "Medium",
            status: "Pending",
            channel: "System",
          });
        }
      }
      // SR Number pending
      if (c.counterFiled === "Yes" && !c.srNumber && c.status !== "Closed") {
        out.push({
          id: `DRV-SR-${c.id}`,
          type: "S.R. Number Pending",
          message: `Counter filed but S.R. number not entered — ${c.caseNumber}`,
          caseId: c.id,
          officer: c.assignedOfficer,
          date: c.lastUpdated,
          priority: "Medium",
          status: "Pending",
          channel: "System",
        });
      }
      // Pending directions
      (c.directions || []).filter(d => d.status !== "Completed").forEach(d => {
        if (d.dueDate) {
          const days = Math.floor((new Date(d.dueDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          if (days <= 7) {
            out.push({
              id: `DRV-DIR-${d.id}`,
              type: "Direction Pending",
              message: `${d.concernedOfficer}: ${d.text.slice(0, 60)} — ${c.caseNumber}`,
              caseId: c.id,
              officer: d.concernedOfficer,
              date: d.dueDate,
              priority: days < 0 ? "Critical" : d.priority,
              status: "Pending",
              channel: "System",
            });
          }
        }
      });
      // Pending closure
      if (c.disposed === "Yes" && !c.closed) {
        out.push({
          id: `DRV-CLS-${c.id}`,
          type: "Closure Pending",
          message: `Disposed but file not closed — ${c.caseNumber}`,
          caseId: c.id,
          officer: c.assignedOfficer,
          date: c.disposalDate || c.lastUpdated,
          priority: "Low",
          status: "Pending",
          channel: "System",
        });
      }
    });
    return out;
  }, [filteredCases]);

  const allAlerts = [...derived, ...seeded];
  const visible = allAlerts.filter(a => {
    if (typeFilter !== "all" && !a.type.toLowerCase().includes(typeFilter)) return false;
    if (statusFilter !== "all" && a.status.toLowerCase() !== statusFilter) return false;
    return true;
  });

  const pending = allAlerts.filter(a => a.status === "Pending").length;
  const sent = allAlerts.filter(a => a.status === "Sent").length;
  const failed = allAlerts.filter(a => a.status === "Failed").length;

  return (
    <AppLayout>
      <PageHeader title="Alerts & Notifications" breadcrumbs={[{ label: "Home", href: "/" }, { label: "Alerts" }]} />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="govt-card p-4 flex items-center gap-3">
          <div className="p-2 rounded-md bg-status-warning/10"><Bell className="h-4 w-4 text-status-warning" /></div>
          <div><p className="text-lg font-bold text-foreground">{pending}</p><p className="text-xs text-muted-foreground">Pending</p></div>
        </div>
        <div className="govt-card p-4 flex items-center gap-3">
          <div className="p-2 rounded-md bg-status-success/10"><Mail className="h-4 w-4 text-status-success" /></div>
          <div><p className="text-lg font-bold text-foreground">{sent}</p><p className="text-xs text-muted-foreground">Sent</p></div>
        </div>
        <div className="govt-card p-4 flex items-center gap-3">
          <div className="p-2 rounded-md bg-status-urgent/10"><MessageSquare className="h-4 w-4 text-status-urgent" /></div>
          <div><p className="text-lg font-bold text-foreground">{failed}</p><p className="text-xs text-muted-foreground">Failed</p></div>
        </div>
      </div>

      <div className="govt-card p-4 mb-4">
        <div className="flex gap-3 flex-wrap">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px] h-9 text-sm"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="counter">Counter Filing Due</SelectItem>
              <SelectItem value="sr">S.R. Number Pending</SelectItem>
              <SelectItem value="direction">Direction Pending</SelectItem>
              <SelectItem value="closure">Closure Pending</SelectItem>
              <SelectItem value="hearing">Hearing Reminder</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px] h-9 text-sm"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-xs text-muted-foreground self-center">Showing {visible.length} of {allAlerts.length} ({derived.length} derived)</span>
        </div>
      </div>

      <div className="govt-card overflow-hidden">
        <table className="w-full govt-table">
          <thead>
            <tr><th>Alert ID</th><th>Type</th><th>Message</th><th>Case</th><th>Officer</th><th>Date</th><th>Priority</th><th>Status</th></tr>
          </thead>
          <tbody>
            {visible.map(a => (
              <tr key={a.id}>
                <td className="font-mono text-[10px]">{a.id}</td>
                <td className="text-xs">{a.type}</td>
                <td className="max-w-[300px] truncate text-xs">{a.message}</td>
                <td className="text-[10px]"><Link to={`/cases/${encodeURIComponent(a.caseId)}`} className="text-primary hover:underline">{a.caseId}</Link></td>
                <td className="text-xs">{a.officer}</td>
                <td className="text-xs">{a.date}</td>
                <td><StatusBadge value={a.priority} type="priority" /></td>
                <td><StatusBadge value={a.status} /></td>
              </tr>
            ))}
            {visible.length === 0 && <tr><td colSpan={8} className="text-center py-6 text-xs text-muted-foreground">No alerts match the selected filters.</td></tr>}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}
