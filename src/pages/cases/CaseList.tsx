import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { caseTypes, mandals, departments, courtNames, priorities, collectorateInvolvementTypes, HC_STATUS_URL } from "@/data/sampleData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Download, Search, Eye, Edit, MoreHorizontal, Upload, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

const STATUSES = ["Fresh","Ongoing","Hearing Scheduled","Counter Pending","Under Review","Appealed","Closed"];
const PAGE_SIZE = 15;

export default function CaseList() {
  const { cases } = useData();
  const { permissions } = useAuth();
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState("all");
  const [typeF, setTypeF] = useState("all");
  const [courtF, setCourtF] = useState("all");
  const [mandalF, setMandalF] = useState("all");
  const [deptF, setDeptF] = useState("all");
  const [priorityF, setPriorityF] = useState("all");
  const [collectF, setCollectF] = useState("all");
  const [complianceF, setComplianceF] = useState("all");
  const [page, setPage] = useState(1);

  const filtered = cases.filter(c => {
    if (search) {
      const s = search.toLowerCase();
      if (!c.caseNumber.toLowerCase().includes(s) && !c.title.toLowerCase().includes(s) && !c.petitioner.toLowerCase().includes(s) && !c.respondent.toLowerCase().includes(s)) return false;
    }
    if (statusF !== "all" && c.status !== statusF) return false;
    if (typeF !== "all" && c.caseType !== typeF) return false;
    if (courtF !== "all" && c.court !== courtF) return false;
    if (mandalF !== "all" && c.mandal !== mandalF) return false;
    if (deptF !== "all" && c.department !== deptF) return false;
    if (priorityF !== "all" && c.priority !== priorityF) return false;
    if (collectF !== "all" && c.collectorateInvolvement !== collectF) return false;
    if (complianceF !== "all") {
      if (complianceF === "pending" && c.complianceStatus !== "Pending") return false;
      if (complianceF === "partial" && c.complianceStatus !== "Partially Complied") return false;
      if (complianceF === "complied" && c.complianceStatus !== "Complied") return false;
      if (complianceF === "na" && c.complianceStatus !== "Not Applicable") return false;
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <AppLayout>
      <PageHeader
        title="Case Management"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Cases" }]}
        actions={
          <>
            <Button variant="outline" size="sm"><Download className="h-3.5 w-3.5 mr-1.5" />Export</Button>
            {permissions?.canBulkUpload && <Link to="/cases/bulk-upload"><Button variant="outline" size="sm"><Upload className="h-3.5 w-3.5 mr-1.5" />Bulk Upload</Button></Link>}
            {permissions?.canCreateCase && <Link to="/cases/new"><Button size="sm"><Plus className="h-3.5 w-3.5 mr-1.5" />Add Case</Button></Link>}
          </>
        }
      />

      <div className="govt-card p-3 mb-4">
        <div className="flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input placeholder="Search case number, title, petitioner, respondent..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="pl-9 h-8 text-xs" />
          </div>
          <Select value={statusF} onValueChange={v => { setStatusF(v); setPage(1); }}><SelectTrigger className="w-[130px] h-8 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All Status</SelectItem>{STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={typeF} onValueChange={v => { setTypeF(v); setPage(1); }}><SelectTrigger className="w-[130px] h-8 text-xs"><SelectValue placeholder="Case Type" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All Types</SelectItem>{caseTypes.map(ct => <SelectItem key={ct} value={ct}>{ct}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={courtF} onValueChange={v => { setCourtF(v); setPage(1); }}><SelectTrigger className="w-[130px] h-8 text-xs"><SelectValue placeholder="Court" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All Courts</SelectItem>{courtNames.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={mandalF} onValueChange={v => { setMandalF(v); setPage(1); }}><SelectTrigger className="w-[120px] h-8 text-xs"><SelectValue placeholder="Mandal" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All Mandals</SelectItem>{mandals.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={deptF} onValueChange={v => { setDeptF(v); setPage(1); }}><SelectTrigger className="w-[130px] h-8 text-xs"><SelectValue placeholder="Department" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All Departments</SelectItem>{departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={priorityF} onValueChange={v => { setPriorityF(v); setPage(1); }}><SelectTrigger className="w-[120px] h-8 text-xs"><SelectValue placeholder="Priority" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All Priorities</SelectItem>{priorities.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={collectF} onValueChange={v => { setCollectF(v); setPage(1); }}><SelectTrigger className="w-[150px] h-8 text-xs"><SelectValue placeholder="Collectorate Role" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All</SelectItem>{collectorateInvolvementTypes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={complianceF} onValueChange={v => { setComplianceF(v); setPage(1); }}><SelectTrigger className="w-[130px] h-8 text-xs"><SelectValue placeholder="Compliance" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="pending">Pending</SelectItem><SelectItem value="partial">Partially Complied</SelectItem><SelectItem value="complied">Complied</SelectItem><SelectItem value="na">Not Applicable</SelectItem></SelectContent>
          </Select>
        </div>
      </div>

      <div className="govt-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full govt-table">
            <thead>
              <tr>
                <th>Case Number</th><th>Title</th><th>Case Type</th><th>Court</th><th>Mandal</th>
                <th>Department</th><th>Respondent</th><th>Filed</th><th>Status</th><th>Priority</th>
                <th>Compliance</th><th>Officer</th><th>Next Hearing</th><th>Last Updated</th><th className="w-16">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map(c => (
                <tr key={c.id}>
                  <td className="font-medium text-foreground whitespace-nowrap">{c.caseNumber}</td>
                  <td className="max-w-[140px] truncate">{c.title}</td>
                  <td className="text-[10px] whitespace-nowrap">{c.caseType}</td>
                  <td className="text-[10px] max-w-[100px] truncate">{c.court}</td>
                  <td className="text-[10px] whitespace-nowrap">{c.mandal}</td>
                  <td className="text-[10px] max-w-[100px] truncate">{c.department}</td>
                  <td className="text-[10px] max-w-[100px] truncate">{c.respondent}</td>
                  <td className="text-[10px] whitespace-nowrap">{c.filingDate}</td>
                  <td><StatusBadge value={c.status} /></td>
                  <td><StatusBadge value={c.priority} type="priority" /></td>
                  <td><StatusBadge value={c.complianceStatus} /></td>
                  <td className="text-[10px] whitespace-nowrap">{c.assignedOfficer}</td>
                  <td className="text-[10px] whitespace-nowrap">{c.nextHearing}</td>
                  <td className="text-[10px] whitespace-nowrap">{c.lastUpdated}</td>
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
              ))}
              {paged.length === 0 && <tr><td colSpan={15} className="text-center py-6 text-muted-foreground text-xs">No cases found</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>Showing {(page-1)*PAGE_SIZE+1}-{Math.min(page*PAGE_SIZE, filtered.length)} of {filtered.length} cases</span>
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
