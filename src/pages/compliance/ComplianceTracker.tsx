import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatsCard } from "@/components/shared/StatsCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, FileSpreadsheet, CheckCircle2, Clock, AlertTriangle, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useData } from "@/contexts/DataContext";
import { departments } from "@/data/sampleData";
import { useState } from "react";

export default function ComplianceTracker() {
  const { cases } = useData();
  const [statusF, setStatusF] = useState("all");
  const [deptF, setDeptF] = useState("all");
  const [search, setSearch] = useState("");

  const complianceCases = cases.filter(c => c.complianceRequired);
  const filtered = complianceCases.filter(c => {
    if (search && !c.caseNumber.toLowerCase().includes(search.toLowerCase()) && !c.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusF === "pending" && c.complianceStatus !== "Pending") return false;
    if (statusF === "partial" && c.complianceStatus !== "Partially Complied") return false;
    if (statusF === "complied" && c.complianceStatus !== "Complied") return false;
    if (deptF !== "all" && c.department !== deptF) return false;
    return true;
  });

  const complied = complianceCases.filter(c => c.complianceStatus === "Complied");
  const pending = complianceCases.filter(c => c.complianceStatus === "Pending");
  const partial = complianceCases.filter(c => c.complianceStatus === "Partially Complied");

  return (
    <AppLayout>
      <PageHeader title="Order Compliance Tracking" breadcrumbs={[{ label: "Home", href: "/" }, { label: "Compliance" }]}
        actions={<div className="flex gap-2"><Button variant="outline" size="sm"><FileText className="h-3.5 w-3.5 mr-1.5" />Export PDF</Button><Button variant="outline" size="sm"><FileSpreadsheet className="h-3.5 w-3.5 mr-1.5" />Export Excel</Button></div>} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatsCard title="Total Orders" value={complianceCases.length} icon={FileText} subtitle="Orders requiring compliance" />
        <StatsCard title="Complied" value={complied.length} icon={CheckCircle2} subtitle="Orders fully complied" />
        <StatsCard title="Pending" value={pending.length} icon={Clock} subtitle="Compliance pending" />
        <StatsCard title="Partially Complied" value={partial.length} icon={AlertTriangle} subtitle="Partial compliance" />
      </div>

      <div className="govt-card p-4 mb-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input placeholder="Search by case number or title..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
          </div>
          <Select value={statusF} onValueChange={setStatusF}>
            <SelectTrigger className="w-[160px] h-9 text-sm"><SelectValue placeholder="Compliance Status" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="pending">Pending</SelectItem><SelectItem value="partial">Partially Complied</SelectItem><SelectItem value="complied">Complied</SelectItem></SelectContent>
          </Select>
          <Select value={deptF} onValueChange={setDeptF}>
            <SelectTrigger className="w-[150px] h-9 text-sm"><SelectValue placeholder="Department" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All Departments</SelectItem>{departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>

      <div className="govt-card overflow-hidden">
        <table className="w-full govt-table">
          <thead><tr><th>Case Number</th><th>Title</th><th>Court</th><th>Order Summary</th><th>Department</th><th>Compliance Status</th><th>Due Date</th><th>Completed</th><th>Officer</th></tr></thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id}>
                <td className="font-medium text-foreground whitespace-nowrap"><Link to={`/cases/${encodeURIComponent(c.id)}`} className="hover:underline">{c.caseNumber}</Link></td>
                <td className="max-w-[160px] truncate">{c.title}</td>
                <td className="text-xs max-w-[120px] truncate">{c.court}</td>
                <td className="text-xs max-w-[180px] truncate">{c.orderSummary || "-"}</td>
                <td className="text-xs whitespace-nowrap">{c.department}</td>
                <td><StatusBadge value={c.complianceStatus} /></td>
                <td className="text-xs whitespace-nowrap">{c.complianceDueDate || "-"}</td>
                <td className="text-xs whitespace-nowrap">{c.complianceCompletedDate || "-"}</td>
                <td className="text-xs whitespace-nowrap">{c.assignedOfficer}</td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={9} className="text-center py-6 text-muted-foreground text-xs">No compliance records found</td></tr>}
          </tbody>
        </table>
        <div className="px-4 py-3 border-t border-border text-xs text-muted-foreground">Showing {filtered.length} compliance records</div>
      </div>
    </AppLayout>
  );
}
