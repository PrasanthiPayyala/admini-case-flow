import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { cases, hearings } from "@/data/sampleData";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Edit, FileText, Calendar, ArrowLeft } from "lucide-react";

export default function CaseDetails() {
  const { id } = useParams();
  const caseData = cases.find(c => c.id === decodeURIComponent(id || ""));
  
  if (!caseData) return <AppLayout><div className="text-center py-20 text-muted-foreground">Case not found</div></AppLayout>;

  const caseHearings = hearings.filter(h => h.caseId === caseData.id);

  return (
    <AppLayout>
      <PageHeader
        title={caseData.title}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Cases", href: "/cases" }, { label: caseData.caseNumber }]}
        actions={
          <>
            <Link to="/cases"><Button variant="outline" size="sm"><ArrowLeft className="h-3.5 w-3.5 mr-1.5" />Back</Button></Link>
            <Button size="sm"><Edit className="h-3.5 w-3.5 mr-1.5" />Edit Case</Button>
          </>
        }
      />

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="govt-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Case Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                ["Case ID", caseData.id],
                ["Case Number", caseData.caseNumber],
                ["Case Type", caseData.caseType],
                ["Court Name", caseData.court],
                ["Court Type", caseData.courtType],
                ["Mandal", caseData.mandal],
                ["Department", caseData.department],
                ["Filing Date", caseData.filingDate],
                ["Assigned Officer", caseData.assignedOfficer],
              ].map(([label, val]) => (
                <div key={label}>
                  <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
                  <p className="font-medium text-foreground">{val}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="govt-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Parties</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Petitioner</p>
                <p className="font-medium">{caseData.petitioner}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Respondent</p>
                <p className="font-medium">{caseData.respondent}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-muted-foreground mb-1">Co-Respondent(s)</p>
                {caseData.coRespondents.length > 0 ? (
                  <ul className="space-y-0.5">
                    {caseData.coRespondents.map((cr, i) => (
                      <li key={i} className="font-medium text-sm">{i + 1}. {cr}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground text-sm">None</p>
                )}
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Advocate</p>
                <p className="font-medium">{caseData.advocate}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Advocate Contact</p>
                <p className="font-medium">{caseData.advocateContact}</p>
              </div>
            </div>
          </div>

          <div className="govt-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Subject & Remarks</h3>
            <p className="text-sm text-foreground mb-3">{caseData.subject}</p>
            <p className="text-sm text-muted-foreground italic">{caseData.remarks}</p>
          </div>

          {/* Hearing History */}
          <div className="govt-card">
            <div className="px-5 py-3 border-b border-border flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Hearing History</h3>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </div>
            <table className="w-full govt-table">
              <thead>
                <tr><th>Date</th><th>Type</th><th>Status</th><th>Outcome</th><th>Remarks</th></tr>
              </thead>
              <tbody>
                {caseHearings.map(h => (
                  <tr key={h.id}>
                    <td>{h.date}</td>
                    <td>{h.type}</td>
                    <td><StatusBadge value={h.status} /></td>
                    <td>{h.outcome || "-"}</td>
                    <td className="max-w-[200px] truncate">{h.remarks}</td>
                  </tr>
                ))}
                {caseHearings.length === 0 && (
                  <tr><td colSpan={5} className="text-center text-muted-foreground py-6">No hearings recorded</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="govt-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Status</span>
              <StatusBadge value={caseData.status} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Priority</span>
              <StatusBadge value={caseData.priority} type="priority" />
            </div>
            <div className="border-t border-border pt-3">
              <p className="text-xs text-muted-foreground mb-0.5">Case Type</p>
              <p className="text-sm font-medium">{caseData.caseType}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Mandal</p>
              <p className="text-sm font-medium">{caseData.mandal}</p>
            </div>
            <div className="border-t border-border pt-3">
              <p className="text-xs text-muted-foreground mb-0.5">Last Hearing</p>
              <p className="text-sm font-medium">{caseData.lastHearing}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Next Hearing</p>
              <p className="text-sm font-medium">{caseData.nextHearing}</p>
            </div>
          </div>

          <div className="govt-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">Tags</h3>
            <div className="flex flex-wrap gap-1.5">
              {caseData.tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 rounded text-xs bg-muted text-muted-foreground">{tag}</span>
              ))}
            </div>
          </div>

          <div className="govt-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start text-xs"><Calendar className="h-3.5 w-3.5 mr-2" />Schedule Hearing</Button>
              <Button variant="outline" size="sm" className="w-full justify-start text-xs"><FileText className="h-3.5 w-3.5 mr-2" />Upload Document</Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
