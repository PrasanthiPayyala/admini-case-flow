import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { useState } from "react";

export default function HearingList() {
  const { hearings } = useData();
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = hearings.filter(h => {
    if (statusFilter === "scheduled") return h.status === "Scheduled";
    if (statusFilter === "completed") return h.status === "Completed";
    return true;
  });

  const scheduled = filtered.filter(h => h.status === "Scheduled");
  const completed = filtered.filter(h => h.status === "Completed");

  return (
    <AppLayout>
      <PageHeader
        title="Hearing Management"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Hearings" }]}
        actions={<Button variant="outline" size="sm"><Download className="h-3.5 w-3.5 mr-1.5" />Export</Button>}
      />

      <div className="govt-card p-4 mb-4">
        <div className="flex gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px] h-9 text-sm"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="govt-card mb-6">
        <div className="px-5 py-3 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Upcoming Hearings ({scheduled.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full govt-table">
            <thead><tr><th>Date</th><th>Time</th><th>Case</th><th>Court</th><th>Type</th><th>Officer</th><th>Remarks</th><th>Status</th></tr></thead>
            <tbody>
              {scheduled.map(h => (
                <tr key={h.id}>
                  <td className="font-medium">{h.date}</td><td>{h.time}</td>
                  <td className="text-foreground">{h.caseTitle}</td><td className="text-xs">{h.court}</td>
                  <td className="text-xs">{h.type}</td><td className="text-xs">{h.officer}</td>
                  <td className="max-w-[200px] truncate text-xs">{h.remarks}</td><td><StatusBadge value={h.status} /></td>
                </tr>
              ))}
              {scheduled.length === 0 && <tr><td colSpan={8} className="text-center py-4 text-muted-foreground text-xs">No scheduled hearings</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <div className="govt-card">
        <div className="px-5 py-3 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Completed Hearings ({completed.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full govt-table">
            <thead><tr><th>Date</th><th>Case</th><th>Court</th><th>Type</th><th>Outcome</th><th>Compliance</th><th>Remarks</th><th>Status</th></tr></thead>
            <tbody>
              {completed.map(h => (
                <tr key={h.id}>
                  <td className="font-medium">{h.date}</td>
                  <td className="text-foreground">{h.caseTitle}</td><td className="text-xs">{h.court}</td>
                  <td className="text-xs">{h.type}</td><td className="font-medium">{h.outcome}</td>
                  <td><StatusBadge value={h.complianceStatus} /></td>
                  <td className="max-w-[200px] truncate text-xs">{h.remarks}</td><td><StatusBadge value={h.status} /></td>
                </tr>
              ))}
              {completed.length === 0 && <tr><td colSpan={8} className="text-center py-4 text-muted-foreground text-xs">No completed hearings</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
