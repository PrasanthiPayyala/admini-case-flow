import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatsCard } from "@/components/shared/StatsCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { cases } from "@/data/sampleData";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, FileSpreadsheet, CheckCircle2, Clock, AlertTriangle, Search } from "lucide-react";
import { Link } from "react-router-dom";

const complianceCases = cases.filter(c => c.complianceRequired);
const complied = complianceCases.filter(c => c.complianceStatus === "Complied");
const pending = complianceCases.filter(c => c.complianceStatus === "Pending");
const partial = complianceCases.filter(c => c.complianceStatus === "Partially Complied");

export default function ComplianceTracker() {
  return (
    <AppLayout>
      <PageHeader
        title="Order Compliance Tracking"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Compliance" }]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><FileText className="h-3.5 w-3.5 mr-1.5" />Export PDF</Button>
            <Button variant="outline" size="sm"><FileSpreadsheet className="h-3.5 w-3.5 mr-1.5" />Export Excel</Button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatsCard title="Total Orders" value={complianceCases.length} icon={FileText} subtitle="Orders requiring compliance" />
        <StatsCard title="Complied" value={complied.length} icon={CheckCircle2} subtitle="Orders fully complied" />
        <StatsCard title="Pending" value={pending.length} icon={Clock} subtitle="Compliance pending" />
        <StatsCard title="Partially Complied" value={partial.length} icon={AlertTriangle} subtitle="Partial compliance" />
      </div>

      {/* Filters */}
      <div className="govt-card p-4 mb-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input placeholder="Search by case number or title..." className="pl-9 h-9 text-sm" />
          </div>
          <Select>
            <SelectTrigger className="w-[160px] h-9 text-sm"><SelectValue placeholder="Compliance Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="partial">Partially Complied</SelectItem>
              <SelectItem value="complied">Complied</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[150px] h-9 text-sm"><SelectValue placeholder="Department" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="revenue">Revenue Department</SelectItem>
              <SelectItem value="legal">Collectorate Legal Cell</SelectItem>
              <SelectItem value="municipal">Municipal Administration</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Label className="text-xs whitespace-nowrap">Due Before</Label>
            <Input type="date" className="h-9 text-sm w-[150px]" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="govt-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full govt-table">
            <thead>
              <tr>
                <th>Case Number</th>
                <th>Title</th>
                <th>Court</th>
                <th>Order Summary</th>
                <th>Department</th>
                <th>Compliance Status</th>
                <th>Due Date</th>
                <th>Completed</th>
                <th>Officer</th>
              </tr>
            </thead>
            <tbody>
              {complianceCases.map(c => (
                <tr key={c.id}>
                  <td className="font-medium text-foreground whitespace-nowrap">
                    <Link to={`/cases/${encodeURIComponent(c.id)}`} className="hover:underline">{c.caseNumber}</Link>
                  </td>
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
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-border text-xs text-muted-foreground">
          Showing {complianceCases.length} compliance records
        </div>
      </div>
    </AppLayout>
  );
}
