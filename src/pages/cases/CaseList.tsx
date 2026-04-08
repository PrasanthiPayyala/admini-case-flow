import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { cases, caseTypes, mandals } from "@/data/sampleData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Download, Search, Eye, Edit, MoreHorizontal } from "lucide-react";
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
            <Link to="/cases/new"><Button size="sm"><Plus className="h-3.5 w-3.5 mr-1.5" />Add Case</Button></Link>
          </>
        }
      />

      {/* Filters */}
      <div className="govt-card p-4 mb-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input placeholder="Search by case number, title, petitioner, respondent..." className="pl-9 h-9 text-sm" />
          </div>
          <Select>
            <SelectTrigger className="w-[150px] h-9 text-sm"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="fresh">Fresh</SelectItem>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="hearing">Hearing Scheduled</SelectItem>
              <SelectItem value="counter">Counter Pending</SelectItem>
              <SelectItem value="appealed">Appealed</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[150px] h-9 text-sm"><SelectValue placeholder="Case Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Case Types</SelectItem>
              {caseTypes.map(ct => (
                <SelectItem key={ct} value={ct.toLowerCase().replace(/\s/g, '-')}>{ct}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[150px] h-9 text-sm"><SelectValue placeholder="Court" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courts</SelectItem>
              <SelectItem value="hc">High Court</SelectItem>
              <SelectItem value="dc">District Court</SelectItem>
              <SelectItem value="tribunal">Tribunal</SelectItem>
              <SelectItem value="consumer">Consumer Forum</SelectItem>
              <SelectItem value="revenue">Revenue Court</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[150px] h-9 text-sm"><SelectValue placeholder="Mandal" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Mandals</SelectItem>
              {mandals.map(m => (
                <SelectItem key={m} value={m.toLowerCase()}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[150px] h-9 text-sm"><SelectValue placeholder="Officer" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Officers</SelectItem>
              <SelectItem value="srinivas">K. Srinivas Rao</SelectItem>
              <SelectItem value="padma">S. Padma Kumari</SelectItem>
              <SelectItem value="rajender">D. Rajender</SelectItem>
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
                <th>Respondent</th>
                <th>Co-Respondent(s)</th>
                <th>Filed</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Officer</th>
                <th>Next Hearing</th>
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody>
              {cases.map(c => (
                <tr key={c.id}>
                  <td className="font-medium text-foreground whitespace-nowrap">{c.caseNumber}</td>
                  <td className="max-w-[160px] truncate">{c.title}</td>
                  <td className="text-xs whitespace-nowrap">{c.caseType}</td>
                  <td className="text-xs max-w-[120px] truncate">{c.court}</td>
                  <td className="text-xs whitespace-nowrap">{c.mandal}</td>
                  <td className="text-xs max-w-[120px] truncate">{c.respondent}</td>
                  <td className="text-xs max-w-[140px] truncate">{c.coRespondents.join(", ") || "-"}</td>
                  <td className="text-xs whitespace-nowrap">{c.filingDate}</td>
                  <td><StatusBadge value={c.status} /></td>
                  <td><StatusBadge value={c.priority} type="priority" /></td>
                  <td className="text-xs whitespace-nowrap">{c.assignedOfficer}</td>
                  <td className="text-xs whitespace-nowrap">{c.nextHearing}</td>
                  <td>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 hover:bg-muted rounded"><MoreHorizontal className="h-4 w-4 text-muted-foreground" /></button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild><Link to={`/cases/${encodeURIComponent(c.id)}`}><Eye className="h-3.5 w-3.5 mr-2" />View</Link></DropdownMenuItem>
                        <DropdownMenuItem><Edit className="h-3.5 w-3.5 mr-2" />Edit</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>Showing {cases.length} of {cases.length} cases</span>
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
