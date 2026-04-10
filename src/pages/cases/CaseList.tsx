import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { cases, caseTypes, mandals, departments, courtNames, priorities, collectorateInvolvementTypes, HC_STATUS_URL } from "@/data/sampleData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Download, Search, Eye, Edit, MoreHorizontal, Upload, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function CaseList() {
  return (
    <AppLayout>
      <PageHeader
        title="Case Management"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Cases" }]}
        actions={
          <>
            <Button variant="outline" size="sm"><Download className="h-3.5 w-3.5 mr-1.5" />Export</Button>
            <Link to="/cases/bulk-upload"><Button variant="outline" size="sm"><Upload className="h-3.5 w-3.5 mr-1.5" />Bulk Upload</Button></Link>
            <Link to="/cases/new"><Button size="sm"><Plus className="h-3.5 w-3.5 mr-1.5" />Add Case</Button></Link>
          </>
        }
      />

      {/* Filters */}
      <div className="govt-card p-3 mb-4">
        <div className="flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input placeholder="Search case number, title, petitioner, respondent..." className="pl-9 h-8 text-xs" />
          </div>
          <Select><SelectTrigger className="w-[130px] h-8 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {["Fresh","Ongoing","Hearing Scheduled","Counter Pending","Under Review","Appealed","Closed"].map(s => <SelectItem key={s} value={s.toLowerCase().replace(/\s/g,'-')}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select><SelectTrigger className="w-[130px] h-8 text-xs"><SelectValue placeholder="Case Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {caseTypes.map(ct => <SelectItem key={ct} value={ct.toLowerCase().replace(/\s/g,'-')}>{ct}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select><SelectTrigger className="w-[130px] h-8 text-xs"><SelectValue placeholder="Court" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courts</SelectItem>
              {courtNames.map(c => <SelectItem key={c} value={c.toLowerCase().replace(/[\s,]/g,'-')}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select><SelectTrigger className="w-[120px] h-8 text-xs"><SelectValue placeholder="Mandal" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Mandals</SelectItem>
              {mandals.map(m => <SelectItem key={m} value={m.toLowerCase()}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select><SelectTrigger className="w-[130px] h-8 text-xs"><SelectValue placeholder="Department" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map(d => <SelectItem key={d} value={d.toLowerCase().replace(/\s/g,'-')}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select><SelectTrigger className="w-[120px] h-8 text-xs"><SelectValue placeholder="Priority" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              {priorities.map(p => <SelectItem key={p} value={p.toLowerCase().replace(/\s/g,'-')}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select><SelectTrigger className="w-[150px] h-8 text-xs"><SelectValue placeholder="Collectorate Role" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {collectorateInvolvementTypes.map(c => <SelectItem key={c} value={c.toLowerCase().replace(/\s/g,'-')}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select><SelectTrigger className="w-[130px] h-8 text-xs"><SelectValue placeholder="Compliance" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="partial">Partially Complied</SelectItem>
              <SelectItem value="complied">Complied</SelectItem>
              <SelectItem value="na">Not Applicable</SelectItem>
            </SelectContent>
          </Select>
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
                <th>Case Type</th>
                <th>Court</th>
                <th>Mandal</th>
                <th>Department</th>
                <th>Respondent</th>
                <th>Co-Respondent(s)</th>
                <th>Filed</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Compliance</th>
                <th>Officer</th>
                <th>Next Hearing</th>
                <th>Last Updated</th>
                <th className="w-16">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cases.map(c => (
                <tr key={c.id}>
                  <td className="font-medium text-foreground whitespace-nowrap">{c.caseNumber}</td>
                  <td className="max-w-[140px] truncate">{c.title}</td>
                  <td className="text-[10px] whitespace-nowrap">{c.caseType}</td>
                  <td className="text-[10px] max-w-[100px] truncate">{c.court}</td>
                  <td className="text-[10px] whitespace-nowrap">{c.mandal}</td>
                  <td className="text-[10px] max-w-[100px] truncate">{c.department}</td>
                  <td className="text-[10px] max-w-[100px] truncate">{c.respondent}</td>
                  <td className="text-[10px] max-w-[120px] truncate">{c.coRespondents.join(", ") || "-"}</td>
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
                        <DropdownMenuItem><Edit className="h-3.5 w-3.5 mr-2" />Edit</DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <a href={HC_STATUS_URL} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-3.5 w-3.5 mr-2" />HC Status</a>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>Showing {cases.length} of {cases.length} cases • Last refreshed: 10-Apr-2026</span>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled className="h-7 text-xs">Previous</Button>
            <Button variant="outline" size="sm" className="h-7 text-xs bg-primary text-primary-foreground">1</Button>
            <Button variant="outline" size="sm" disabled className="h-7 text-xs">Next</Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
