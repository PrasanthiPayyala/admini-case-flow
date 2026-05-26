import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { caseTypes, mandals, departments, courtNames, priorities, collectorateInvolvementTypes, HC_STATUS_URL, divisions, pendingAtLevels, caseNoYear } from "@/data/sampleData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Plus, Download, Search, Eye, Edit, MoreHorizontal, Upload, ExternalLink } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useRoleFilter } from "@/hooks/useRoleFilter";
import { useState, useEffect, useMemo } from "react";
import type { Party, CaseRecord } from "@/data/sampleData";

const STATUSES = ["Fresh","Ongoing","Hearing Scheduled","Counter Pending","Under Review","Appealed","Closed"];
const DIVISION_NAMES = Object.keys(divisions);
const PAGE_SIZE = 15;

function getDaysLeft(dateStr: string): { label: string; className: string } {
  if (!dateStr || dateStr === "-") return { label: "—", className: "text-muted-foreground" };
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return { label: `${Math.abs(diff)}d overdue`, className: "text-destructive font-semibold" };
  if (diff === 0) return { label: "Today", className: "text-destructive font-semibold" };
  if (diff === 1) return { label: "Tomorrow", className: "text-orange-600 font-semibold" };
  if (diff <= 3) return { label: `${diff} days`, className: "text-orange-600 font-medium" };
  if (diff <= 7) return { label: `${diff} days`, className: "text-green-700 font-medium" };
  return { label: `${diff} days`, className: "text-muted-foreground" };
}

function PartyCell({ parties }: { parties: Party[] }) {
  if (!parties || parties.length === 0) return <span className="text-muted-foreground">—</span>;
  const primary = parties[0];
  const overflow = parties.length - 1;

  if (overflow === 0) {
    return <span className="truncate block max-w-[130px]" title={primary.name}>{primary.name}</span>;
  }

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button className="text-left flex items-center gap-1 group">
          <span className="truncate block max-w-[100px]" title={primary.name}>{primary.name}</span>
          <Badge variant="secondary" className="text-[10px] px-1 py-0 h-4 shrink-0 cursor-pointer group-hover:bg-primary group-hover:text-primary-foreground">
            +{overflow}
          </Badge>
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-72 p-3" align="start">
        <p className="text-xs font-semibold mb-2 text-muted-foreground">All Parties ({parties.length})</p>
        <div className="space-y-1.5">
          {parties.map((p, i) => (
            <div key={i} className="text-xs flex justify-between items-start gap-2">
              <span className="font-medium">{p.name}</span>
              {p.department && <span className="text-muted-foreground text-[10px] shrink-0">{p.department}</span>}
            </div>
          ))}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

export default function CaseList() {
  const { filteredCases: cases, scopeLabel } = useRoleFilter();
  const { permissions } = useAuth();
  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState("all");
  const [typeF, setTypeF] = useState("all");
  const [courtF, setCourtF] = useState("all");
  const [mandalF, setMandalF] = useState("all");
  const [deptF, setDeptF] = useState("all");
  const [priorityF, setPriorityF] = useState("all");
  const [collectF, setCollectF] = useState("all");
  const [complianceF, setComplianceF] = useState("all");
  const [landF, setLandF] = useState("all");
  const [divisionF, setDivisionF] = useState("all");
  const [pendingAtF, setPendingAtF] = useState("all");
  const [instructionsF, setInstructionsF] = useState("all");
  const [counterF, setCounterF] = useState("all");
  const [disposedF, setDisposedF] = useState("all");
  const [closedF, setClosedF] = useState("all");
  const [courtTypeF, setCourtTypeF] = useState("all");
  const [dateFromF, setDateFromF] = useState("");
  const [dateToF, setDateToF] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const s = searchParams.get("status");
    const inv = searchParams.get("involvement");
    const land = searchParams.get("land");
    const dept = searchParams.get("department");
    const div = searchParams.get("division");
    const gp = searchParams.get("gpApproval");
    const ca = searchParams.get("collectorApproval");
    const comp = searchParams.get("compliance");
    const ins = searchParams.get("instructions");
    const cnt = searchParams.get("counter");
    const dis = searchParams.get("disposed");
    const cls = searchParams.get("closed");
    const ct = searchParams.get("caseType");
    const courtType = searchParams.get("courtType");
    const counterPending = searchParams.get("counterPending");
    const counterFiled = searchParams.get("counterFiled");
    const dFrom = searchParams.get("dateFrom");
    const dTo = searchParams.get("dateTo");
    if (s && STATUSES.includes(s)) setStatusF(s);
    if (inv) setCollectF(inv);
    if (land === "true") setLandF("yes");
    if (dept) setDeptF(dept);
    if (div && DIVISION_NAMES.includes(div)) setDivisionF(div);
    if (gp === "Pending") setPendingAtF("GP Approval");
    if (ca === "Pending") setPendingAtF("Collector Approval");
    if (comp) setComplianceF(comp);
    if (ins) setInstructionsF(ins);
    if (cnt) setCounterF(cnt);
    if (dis) setDisposedF(dis);
    if (cls) setClosedF(cls);
    if (ct) setTypeF(ct);
    if (courtType) setCourtTypeF(courtType);
    if (counterPending === "true") setCounterF("Pending-Open");
    if (counterFiled === "true") setCounterF("Yes");
    if (dFrom) setDateFromF(dFrom);
    if (dTo) setDateToF(dTo);
  }, [searchParams]);

  const filtered = useMemo(() => cases.filter(c => {
    if (search) {
      const s = search.toLowerCase();
      if (!c.caseNumber.toLowerCase().includes(s) && !c.title.toLowerCase().includes(s) && !c.petitioner.toLowerCase().includes(s) && !c.respondent.toLowerCase().includes(s) && !(c.srNumber || "").toLowerCase().includes(s)) return false;
    }
    if (statusF !== "all" && c.status !== statusF) return false;
    if (typeF !== "all" && c.caseType !== typeF) return false;
    if (courtF !== "all" && c.court !== courtF) return false;
    if (mandalF !== "all" && c.mandal !== mandalF) return false;
    if (deptF !== "all" && c.department !== deptF) return false;
    if (priorityF !== "all" && c.priority !== priorityF) return false;
    if (collectF !== "all" && c.collectorateInvolvement !== collectF) return false;
    if (divisionF !== "all" && c.division !== divisionF) return false;
    if (pendingAtF !== "all" && c.pendingAtLevel !== pendingAtF) return false;
    if (landF === "yes" && !c.landDisputeFlag) return false;
    if (complianceF !== "all") {
      if (complianceF === "pending" && c.complianceStatus !== "Pending") return false;
      if (complianceF === "partial" && c.complianceStatus !== "Partially Complied") return false;
      if (complianceF === "complied" && c.complianceStatus !== "Complied") return false;
      if (complianceF === "na" && c.complianceStatus !== "Not Applicable") return false;
      if (complianceF === "noncomplied") {
        // Non-complied = required compliance but not complied
        if (!c.complianceRequired) return false;
        if (c.complianceStatus === "Complied") return false;
      }
    }
    if (instructionsF !== "all" && (c.instructionsFiled || "Pending") !== instructionsF) return false;
    if (counterF !== "all") {
      if (counterF === "Pending-Open") {
        if (c.status === "Closed" || c.counterFiled === "Yes") return false;
      } else if ((c.counterFiled || "No") !== counterF) return false;
    }
    if (disposedF !== "all" && (c.disposed || "No") !== disposedF) return false;
    if (closedF === "yes" && !c.closed) return false;
    if (closedF === "no" && c.closed) return false;
    if (closedF === "disposed_not_closed" && (c.disposed !== "Yes" || c.closed)) return false;
    if (courtTypeF !== "all" && c.courtType !== courtTypeF) return false;
    if (dateFromF && c.filingDate < dateFromF) return false;
    if (dateToF && c.filingDate > dateToF) return false;
    return true;
  }), [cases, search, statusF, typeF, courtF, mandalF, deptF, priorityF, collectF, complianceF, landF, divisionF, pendingAtF, instructionsF, counterF, disposedF, closedF, courtTypeF, dateFromF, dateToF]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const clearFilters = () => {
    setSearch(""); setStatusF("all"); setTypeF("all"); setCourtF("all"); setMandalF("all");
    setDeptF("all"); setPriorityF("all"); setCollectF("all"); setComplianceF("all"); setLandF("all");
    setDivisionF("all"); setPendingAtF("all"); setInstructionsF("all"); setCounterF("all");
    setDisposedF("all"); setClosedF("all"); setCourtTypeF("all"); setDateFromF(""); setDateToF(""); setPage(1);
  };

  const hasFilters = statusF !== "all" || typeF !== "all" || courtF !== "all" || mandalF !== "all" || deptF !== "all" || priorityF !== "all" || collectF !== "all" || complianceF !== "all" || landF !== "all" || divisionF !== "all" || pendingAtF !== "all" || instructionsF !== "all" || counterF !== "all" || disposedF !== "all" || closedF !== "all" || courtTypeF !== "all" || dateFromF || dateToF || search;

  const exportCsv = () => {
    const headers = ["Sl.No","Department","Case Type","Case No./Year","Title","Petitioner","Respondent","Instructions Filed","Counter Filed","S.R. Number","Next Hearing","Disposed","Compliance","Pending At","Officer","Last Updated"];
    const rows = filtered.map((c, i) => [
      c.slNo ?? i + 1, c.department, c.caseType, caseNoYear(c), c.title,
      c.petitioners?.[0]?.name || c.petitioner, c.respondents?.[0]?.name || c.respondent,
      c.instructionsFiled || "Pending", c.counterFiled || "No", c.srNumber || "",
      c.nextHearing, c.disposed || "No", c.complianceStatus, c.pendingAtLevel,
      c.assignedOfficer, c.lastUpdated,
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `lcms-cases-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };


  return (
    <AppLayout>
      <PageHeader
        title="Case Management"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Cases" }]}
        actions={
          <>
            {scopeLabel !== "District-wide" && <Badge variant="secondary" className="text-[10px]">{scopeLabel}</Badge>}
            <Button variant="outline" size="sm" onClick={exportCsv}><Download className="h-3.5 w-3.5 mr-1.5" />Export CSV</Button>
            {permissions?.canBulkUpload && <Link to="/cases/bulk-upload"><Button variant="outline" size="sm"><Upload className="h-3.5 w-3.5 mr-1.5" />Bulk Upload</Button></Link>}
            {permissions?.canCreateCase && <Link to="/cases/new"><Button size="sm"><Plus className="h-3.5 w-3.5 mr-1.5" />Add Case</Button></Link>}
          </>
        }
      />

      {/* Filters */}
      <div className="govt-card p-3 mb-4">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input placeholder="Search case no., title, petitioner, respondent..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="pl-9 h-8 text-xs" />
          </div>
          <Select value={statusF} onValueChange={v => { setStatusF(v); setPage(1); }}><SelectTrigger className="w-[120px] h-8 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All Status</SelectItem>{STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={typeF} onValueChange={v => { setTypeF(v); setPage(1); }}><SelectTrigger className="w-[120px] h-8 text-xs"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All Types</SelectItem>{caseTypes.map(ct => <SelectItem key={ct} value={ct}>{ct}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={courtF} onValueChange={v => { setCourtF(v); setPage(1); }}><SelectTrigger className="w-[120px] h-8 text-xs"><SelectValue placeholder="Court" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All Courts</SelectItem>{courtNames.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={divisionF} onValueChange={v => { setDivisionF(v); setPage(1); }}><SelectTrigger className="w-[130px] h-8 text-xs"><SelectValue placeholder="Division" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All Divisions</SelectItem>{DIVISION_NAMES.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={mandalF} onValueChange={v => { setMandalF(v); setPage(1); }}><SelectTrigger className="w-[110px] h-8 text-xs"><SelectValue placeholder="Mandal" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All Mandals</SelectItem>{mandals.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={deptF} onValueChange={v => { setDeptF(v); setPage(1); }}><SelectTrigger className="w-[120px] h-8 text-xs"><SelectValue placeholder="Dept" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All Depts</SelectItem>{departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={priorityF} onValueChange={v => { setPriorityF(v); setPage(1); }}><SelectTrigger className="w-[110px] h-8 text-xs"><SelectValue placeholder="Priority" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All</SelectItem>{priorities.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={pendingAtF} onValueChange={v => { setPendingAtF(v); setPage(1); }}><SelectTrigger className="w-[130px] h-8 text-xs"><SelectValue placeholder="Pending At" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All Levels</SelectItem>{pendingAtLevels.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={collectF} onValueChange={v => { setCollectF(v); setPage(1); }}><SelectTrigger className="w-[140px] h-8 text-xs"><SelectValue placeholder="Involvement" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All</SelectItem>{collectorateInvolvementTypes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={complianceF} onValueChange={v => { setComplianceF(v); setPage(1); }}><SelectTrigger className="w-[120px] h-8 text-xs"><SelectValue placeholder="Compliance" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="pending">Pending</SelectItem><SelectItem value="partial">Partial</SelectItem><SelectItem value="complied">Complied</SelectItem><SelectItem value="na">N/A</SelectItem></SelectContent>
          </Select>
          <Select value={instructionsF} onValueChange={v => { setInstructionsF(v); setPage(1); }}><SelectTrigger className="w-[130px] h-8 text-xs"><SelectValue placeholder="Instructions" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All Instr.</SelectItem><SelectItem value="Yes">Filed</SelectItem><SelectItem value="No">Not Filed</SelectItem><SelectItem value="Pending">Pending</SelectItem></SelectContent>
          </Select>
          <Select value={counterF} onValueChange={v => { setCounterF(v); setPage(1); }}><SelectTrigger className="w-[120px] h-8 text-xs"><SelectValue placeholder="Counter" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All Counter</SelectItem><SelectItem value="Yes">Filed</SelectItem><SelectItem value="No">Not Filed</SelectItem><SelectItem value="Pending">Pending</SelectItem></SelectContent>
          </Select>
          <Select value={disposedF} onValueChange={v => { setDisposedF(v); setPage(1); }}><SelectTrigger className="w-[120px] h-8 text-xs"><SelectValue placeholder="Disposed" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="Yes">Disposed</SelectItem><SelectItem value="No">Not Disposed</SelectItem></SelectContent>
          </Select>
          <Select value={closedF} onValueChange={v => { setClosedF(v); setPage(1); }}><SelectTrigger className="w-[150px] h-8 text-xs"><SelectValue placeholder="Closed" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All Files</SelectItem><SelectItem value="yes">Closed</SelectItem><SelectItem value="no">Open</SelectItem><SelectItem value="disposed_not_closed">Disposed, Not Closed</SelectItem></SelectContent>
          </Select>
          {hasFilters && <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground" onClick={clearFilters}>Clear</Button>}
        </div>
        {hasFilters && <p className="text-[10px] text-muted-foreground mt-2">Showing {filtered.length} of {cases.length} cases</p>}
      </div>

      <div className="govt-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full govt-table text-[11px]">
            <thead>
              <tr>
                <th className="w-10">Sl.</th>
                <th>Dept</th>
                <th>Type</th>
                <th>Case No./Year</th>
                <th>Title</th>
                <th>Petitioner</th>
                <th>Respondent</th>
                <th>Instr.</th>
                <th>Counter</th>
                <th>S.R. No.</th>
                <th>Next Hearing</th>
                <th>→ Hearing</th>
                <th>→ Counter</th>
                <th>Disposed</th>
                <th>Action Status</th>
                <th>Pending At</th>
                <th>Officer</th>
                <th>Updated</th>
                <th className="w-12">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((c, idx) => {
                const hearingDays = getDaysLeft(c.nextHearing);
                const counterDays = getDaysLeft(c.counterFilingDueDate);
                const slNo = c.slNo ?? ((page - 1) * PAGE_SIZE + idx + 1);
                const openDirs = (c.directions || []).filter(d => d.status !== "Completed").length;
                const actionStatus = c.closed ? "Closed" : c.disposed === "Yes" ? "Disposed, Open" : openDirs > 0 ? `${openDirs} Direction(s) Open` : c.complianceStatus === "Pending" ? "Compliance Pending" : c.complianceStatus === "Partially Complied" ? "Partial" : "On Track";
                return (
                  <tr key={c.id}>
                    <td className="text-center text-muted-foreground">{slNo}</td>
                    <td className="max-w-[100px] truncate" title={c.department}>{c.department}</td>
                    <td className="whitespace-nowrap">{c.caseType}</td>
                    <td className="font-medium text-foreground whitespace-nowrap">
                      <Link to={`/cases/${encodeURIComponent(c.id)}`} className="hover:text-primary hover:underline">{caseNoYear(c)}</Link>
                    </td>
                    <td className="max-w-[140px] truncate" title={c.title}>{c.title}</td>
                    <td className="whitespace-nowrap"><PartyCell parties={c.petitioners} /></td>
                    <td className="whitespace-nowrap"><PartyCell parties={c.respondents} /></td>
                    <td><StatusBadge value={c.instructionsFiled || "Pending"} size="sm" /></td>
                    <td><StatusBadge value={c.counterFiled || "No"} size="sm" /></td>
                    <td className="text-[10px] whitespace-nowrap">{c.srNumber || "—"}</td>
                    <td className="whitespace-nowrap text-[10px]">{c.nextHearing && c.nextHearing !== "-" ? c.nextHearing : "—"}</td>
                    <td className={`whitespace-nowrap ${hearingDays.className}`}>{hearingDays.label}</td>
                    <td className={`whitespace-nowrap ${counterDays.className}`}>{counterDays.label}</td>
                    <td>
                      {c.closed
                        ? <Badge className="text-[9px] px-1 py-0 h-4 bg-muted text-muted-foreground">Closed</Badge>
                        : c.disposed === "Yes"
                          ? <Badge className="text-[9px] px-1 py-0 h-4 bg-emerald-100 text-emerald-800 border-emerald-300">Yes</Badge>
                          : <span className="text-muted-foreground text-[10px]">No</span>}
                    </td>
                    <td className="text-[10px] whitespace-nowrap">{actionStatus}</td>
                    <td><StatusBadge value={c.pendingAtLevel} size="sm" /></td>
                    <td className="text-[10px] max-w-[80px] truncate" title={c.assignedOfficer}>{c.assignedOfficer}</td>
                    <td className="text-[10px] whitespace-nowrap text-muted-foreground">{c.lastUpdated}</td>
                    <td>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1 hover:bg-muted rounded"><MoreHorizontal className="h-4 w-4 text-muted-foreground" /></button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild><Link to={`/cases/${encodeURIComponent(c.id)}`}><Eye className="h-3.5 w-3.5 mr-2" />View</Link></DropdownMenuItem>
                          {permissions?.canEditCase && <DropdownMenuItem asChild><Link to={`/cases/${encodeURIComponent(c.id)}/edit`}><Edit className="h-3.5 w-3.5 mr-2" />Edit</Link></DropdownMenuItem>}
                          <DropdownMenuItem asChild>
                            <a href={HC_STATUS_URL} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-3.5 w-3.5 mr-2" />HC Status</a>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
              {paged.length === 0 && <tr><td colSpan={20} className="text-center py-6 text-muted-foreground text-xs">No cases found matching your filters</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>Showing {Math.min((page-1)*PAGE_SIZE+1, filtered.length)}-{Math.min(page*PAGE_SIZE, filtered.length)} of {filtered.length}</span>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="h-7 text-xs">Previous</Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button key={i} variant="outline" size="sm" onClick={() => setPage(i + 1)} className={`h-7 text-xs ${page === i + 1 ? "bg-primary text-primary-foreground" : ""}`}>{i + 1}</Button>
            )).slice(Math.max(0, page - 3), page + 2)}
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="h-7 text-xs">Next</Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
