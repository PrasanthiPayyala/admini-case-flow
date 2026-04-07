import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { appeals } from "@/data/sampleData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Download, Search, MoreHorizontal, Eye, Edit } from "lucide-react";
import { Link } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function AppealList() {
  return (
    <AppLayout>
      <PageHeader
        title="Appeal Management"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Appeals" }]}
        actions={
          <>
            <Button variant="outline" size="sm"><Download className="h-3.5 w-3.5 mr-1.5" />Export</Button>
            <Link to="/appeals/new"><Button size="sm"><Plus className="h-3.5 w-3.5 mr-1.5" />Add Appeal</Button></Link>
          </>
        }
      />

      <div className="govt-card p-4 mb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input placeholder="Search appeals..." className="pl-9 h-9 text-sm" />
        </div>
      </div>

      <div className="govt-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full govt-table">
            <thead>
              <tr>
                <th>Appeal ID</th>
                <th>Appeal Number</th>
                <th>Parent Case</th>
                <th>Court</th>
                <th>Stage</th>
                <th>Officer</th>
                <th>Next Hearing</th>
                <th>Outcome</th>
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody>
              {appeals.map(a => (
                <tr key={a.id}>
                  <td className="font-mono text-xs">{a.id}</td>
                  <td className="font-medium text-foreground">{a.appealNumber}</td>
                  <td className="text-xs"><Link to={`/cases/${encodeURIComponent(a.parentCaseId)}`} className="text-primary hover:underline">{a.parentCaseId}</Link></td>
                  <td className="text-xs">{a.court}</td>
                  <td><StatusBadge value={a.stage} /></td>
                  <td className="text-xs">{a.assignedOfficer}</td>
                  <td className="text-xs">{a.nextHearing}</td>
                  <td><StatusBadge value={a.outcome} /></td>
                  <td>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 hover:bg-muted rounded"><MoreHorizontal className="h-4 w-4 text-muted-foreground" /></button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><Eye className="h-3.5 w-3.5 mr-2" />View Details</DropdownMenuItem>
                        <DropdownMenuItem><Edit className="h-3.5 w-3.5 mr-2" />Edit</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
