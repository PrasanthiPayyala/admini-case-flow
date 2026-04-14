import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useData } from "@/contexts/DataContext";
import { Link } from "react-router-dom";
import { Eye, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function ClosedCases() {
  const { cases } = useData();
  const closed = cases.filter(c => c.status === "Closed");

  return (
    <AppLayout>
      <PageHeader title="Closed Cases Archive" breadcrumbs={[{ label: "Home", href: "/" }, { label: "Cases", href: "/cases" }, { label: "Closed" }]} />
      <div className="govt-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full govt-table">
            <thead><tr><th>Case No.</th><th>Title</th><th>Court</th><th>Mandal</th><th>Dept</th><th>Compliance</th><th>Final Action</th><th>Last Updated</th><th>Actions</th></tr></thead>
            <tbody>
              {closed.map(c => (
                <tr key={c.id}>
                  <td className="font-medium whitespace-nowrap"><Link to={`/cases/${encodeURIComponent(c.id)}`} className="hover:text-primary hover:underline">{c.caseNumber}</Link></td>
                  <td className="max-w-[180px] truncate">{c.title}</td>
                  <td className="max-w-[100px] truncate">{c.court}</td>
                  <td>{c.mandal}</td>
                  <td className="max-w-[100px] truncate">{c.department}</td>
                  <td><StatusBadge value={c.complianceStatus} size="sm" /></td>
                  <td><StatusBadge value={c.finalActionStatus} size="sm" /></td>
                  <td className="whitespace-nowrap">{c.lastUpdated}</td>
                  <td>
                    <DropdownMenu><DropdownMenuTrigger asChild><button className="p-1 hover:bg-muted rounded"><MoreHorizontal className="h-4 w-4 text-muted-foreground" /></button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild><Link to={`/cases/${encodeURIComponent(c.id)}`}><Eye className="h-3.5 w-3.5 mr-2" />View</Link></DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
              {closed.length === 0 && <tr><td colSpan={9} className="text-center py-6 text-muted-foreground text-xs">No closed cases</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2 border-t border-border text-xs text-muted-foreground">Total: {closed.length} cases</div>
      </div>
    </AppLayout>
  );
}
