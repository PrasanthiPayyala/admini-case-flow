import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Eye, Edit, MoreHorizontal, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { HC_STATUS_URL } from "@/data/sampleData";

export default function FreshCases() {
  const { cases } = useData();
  const { permissions } = useAuth();
  const fresh = cases.filter(c => c.status === "Fresh");

  return (
    <AppLayout>
      <PageHeader title="Fresh Cases" breadcrumbs={[{ label: "Home", href: "/" }, { label: "Cases", href: "/cases" }, { label: "Fresh" }]} />
      <div className="govt-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full govt-table">
            <thead><tr><th>Case No.</th><th>Title</th><th>Type</th><th>Court</th><th>Mandal</th><th>Dept</th><th>Priority</th><th>Pending At</th><th>Next Hearing</th><th>Actions</th></tr></thead>
            <tbody>
              {fresh.map(c => (
                <tr key={c.id}>
                  <td className="font-medium whitespace-nowrap"><Link to={`/cases/${encodeURIComponent(c.id)}`} className="hover:text-primary hover:underline">{c.caseNumber}</Link></td>
                  <td className="max-w-[160px] truncate">{c.title}</td>
                  <td className="whitespace-nowrap">{c.caseType}</td>
                  <td className="max-w-[100px] truncate">{c.court}</td>
                  <td>{c.mandal}</td>
                  <td className="max-w-[100px] truncate">{c.department}</td>
                  <td><StatusBadge value={c.priority} type="priority" size="sm" /></td>
                  <td><StatusBadge value={c.pendingAtLevel} size="sm" /></td>
                  <td className="whitespace-nowrap">{c.nextHearing}</td>
                  <td>
                    <DropdownMenu><DropdownMenuTrigger asChild><button className="p-1 hover:bg-muted rounded"><MoreHorizontal className="h-4 w-4 text-muted-foreground" /></button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild><Link to={`/cases/${encodeURIComponent(c.id)}`}><Eye className="h-3.5 w-3.5 mr-2" />View</Link></DropdownMenuItem>
                        {permissions?.canEditCase && <DropdownMenuItem asChild><Link to={`/cases/${encodeURIComponent(c.id)}/edit`}><Edit className="h-3.5 w-3.5 mr-2" />Edit</Link></DropdownMenuItem>}
                        <DropdownMenuItem asChild><a href={HC_STATUS_URL} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-3.5 w-3.5 mr-2" />HC Status</a></DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
              {fresh.length === 0 && <tr><td colSpan={10} className="text-center py-6 text-muted-foreground text-xs">No fresh cases</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2 border-t border-border text-xs text-muted-foreground">Total: {fresh.length} cases</div>
      </div>
    </AppLayout>
  );
}
