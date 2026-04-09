import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { cases, hearings, HC_STATUS_URL } from "@/data/sampleData";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Edit, FileText, Calendar, ArrowLeft, ExternalLink, ShieldCheck } from "lucide-react";

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
            <a href={HC_STATUS_URL} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm"><ExternalLink className="h-3.5 w-3.5 mr-1.5" />HC Status</Button>
            </a>
            <Button size="sm"><Edit className="h-3.5 w-3.5 mr-1.5" />Edit Case</Button>
          </>
        }
      />

      <div className="grid md:grid-cols-3 gap-5">
        {/* Main */}
        <div className="md:col-span-2 space-y-5">
          <div className="govt-card p-5">
            <h3 className="text-xs font-semibold text-foreground mb-3">Case Information</h3>
            <div className="grid grid-cols-3 gap-3 text-sm">
              {[
                ["Case ID", caseData.id], ["Case Number", caseData.caseNumber], ["Case Type", caseData.caseType],
                ["Court Name", caseData.court], ["Court Type", caseData.courtType], ["Mandal", caseData.mandal],
                ["Department", caseData.department], ["Filing Date", caseData.filingDate], ["Filing Year", caseData.filingYear],
                ["Assigned Officer", caseData.assignedOfficer], ["Nature of Case", caseData.natureOfCase],
                ["Collectorate Involvement", caseData.collectorateInvolvement],
              ].map(([label, val]) => (
                <div key={label}>
                  <p className="text-[10px] text-muted-foreground mb-0.5">{label}</p>
                  <p className="font-medium text-foreground text-xs">{val}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="govt-card p-5">
            <h3 className="text-xs font-semibold text-foreground mb-3">Parties</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-[10px] text-muted-foreground mb-0.5">Petitioner</p><p className="font-medium text-xs">{caseData.petitioner}</p></div>
              <div><p className="text-[10px] text-muted-foreground mb-0.5">Respondent</p><p className="font-medium text-xs">{caseData.respondent}</p></div>
              <div className="col-span-2">
                <p className="text-[10px] text-muted-foreground mb-1">Co-Respondent(s)</p>
                {caseData.coRespondents.length > 0 ? (
                  <ul className="space-y-0.5">{caseData.coRespondents.map((cr, i) => <li key={i} className="font-medium text-xs">{i + 1}. {cr}</li>)}</ul>
                ) : <p className="text-muted-foreground text-xs">None</p>}
              </div>
              <div><p className="text-[10px] text-muted-foreground mb-0.5">Advocate</p><p className="font-medium text-xs">{caseData.advocate}</p></div>
              <div><p className="text-[10px] text-muted-foreground mb-0.5">Advocate Contact</p><p className="font-medium text-xs">{caseData.advocateContact}</p></div>
            </div>
          </div>

          {/* Order & Compliance */}
          <div className="govt-card p-5">
            <h3 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" />Order & Compliance</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-[10px] text-muted-foreground mb-0.5">Order Passed</p><p className="font-medium text-xs">{caseData.orderPassed ? "Yes" : "No"}</p></div>
              <div><p className="text-[10px] text-muted-foreground mb-0.5">Compliance Required</p><p className="font-medium text-xs">{caseData.complianceRequired ? "Yes" : "No"}</p></div>
              {caseData.orderPassed && <div className="col-span-2"><p className="text-[10px] text-muted-foreground mb-0.5">Order Summary</p><p className="font-medium text-xs">{caseData.orderSummary}</p></div>}
              <div><p className="text-[10px] text-muted-foreground mb-0.5">Compliance Status</p><StatusBadge value={caseData.complianceStatus} /></div>
              <div><p className="text-[10px] text-muted-foreground mb-0.5">Compliance Due Date</p><p className="font-medium text-xs">{caseData.complianceDueDate || "-"}</p></div>
              {caseData.complianceCompletedDate && <div><p className="text-[10px] text-muted-foreground mb-0.5">Completed Date</p><p className="font-medium text-xs">{caseData.complianceCompletedDate}</p></div>}
            </div>
          </div>

          <div className="govt-card p-5">
            <h3 className="text-xs font-semibold text-foreground mb-3">Subject & Remarks</h3>
            <p className="text-xs text-foreground mb-2">{caseData.subject}</p>
            <p className="text-xs text-muted-foreground italic">{caseData.remarks}</p>
          </div>

          {/* Hearing History */}
          <div className="govt-card">
            <div className="px-5 py-3 border-b border-border flex items-center justify-between">
              <h3 className="text-xs font-semibold text-foreground">Hearing History</h3>
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <table className="w-full govt-table">
              <thead><tr><th>Date</th><th>Type</th><th>Status</th><th>Outcome</th><th>Order</th><th>Remarks</th></tr></thead>
              <tbody>
                {caseHearings.map(h => (
                  <tr key={h.id}>
                    <td className="text-xs">{h.date}</td>
                    <td className="text-xs">{h.type}</td>
                    <td><StatusBadge value={h.status} /></td>
                    <td className="text-xs">{h.outcome || "-"}</td>
                    <td className="text-xs">{h.orderPassed ? "Yes" : "-"}</td>
                    <td className="max-w-[180px] truncate text-xs">{h.remarks}</td>
                  </tr>
                ))}
                {caseHearings.length === 0 && <tr><td colSpan={6} className="text-center text-muted-foreground py-4 text-xs">No hearings recorded</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="govt-card p-4 space-y-2">
            <div className="flex items-center justify-between"><span className="text-[10px] text-muted-foreground">Status</span><StatusBadge value={caseData.status} /></div>
            <div className="flex items-center justify-between"><span className="text-[10px] text-muted-foreground">Priority</span><StatusBadge value={caseData.priority} type="priority" /></div>
            <div className="border-t border-border pt-2">
              <p className="text-[10px] text-muted-foreground mb-0.5">Case Type</p>
              <p className="text-xs font-medium">{caseData.caseType}</p>
            </div>
            <div><p className="text-[10px] text-muted-foreground mb-0.5">Mandal</p><p className="text-xs font-medium">{caseData.mandal}</p></div>
            <div><p className="text-[10px] text-muted-foreground mb-0.5">Department</p><p className="text-xs font-medium">{caseData.department}</p></div>
            <div className="border-t border-border pt-2">
              <p className="text-[10px] text-muted-foreground mb-0.5">Last Hearing</p>
              <p className="text-xs font-medium">{caseData.lastHearing}</p>
            </div>
            <div><p className="text-[10px] text-muted-foreground mb-0.5">Next Hearing</p><p className="text-xs font-medium">{caseData.nextHearing}</p></div>
            <div><p className="text-[10px] text-muted-foreground mb-0.5">Last Updated</p><p className="text-xs font-medium">{caseData.lastUpdated}</p></div>
            {caseData.landDisputeFlag && (
              <div className="border-t border-border pt-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-status-urgent/10 text-status-urgent">⚠ Land Dispute</span>
              </div>
            )}
          </div>

          <div className="govt-card p-4">
            <h3 className="text-xs font-semibold text-foreground mb-2">Tags</h3>
            <div className="flex flex-wrap gap-1">
              {caseData.tags.map(tag => <span key={tag} className="px-2 py-0.5 rounded text-[10px] bg-muted text-muted-foreground">{tag}</span>)}
            </div>
          </div>

          <div className="govt-card p-4">
            <h3 className="text-xs font-semibold text-foreground mb-2">Quick Actions</h3>
            <div className="space-y-1.5">
              <Button variant="outline" size="sm" className="w-full justify-start text-[10px]"><Calendar className="h-3.5 w-3.5 mr-2" />Schedule Hearing</Button>
              <Button variant="outline" size="sm" className="w-full justify-start text-[10px]"><FileText className="h-3.5 w-3.5 mr-2" />Upload Document</Button>
              <a href={HC_STATUS_URL} target="_blank" rel="noopener noreferrer" className="block">
                <Button variant="outline" size="sm" className="w-full justify-start text-[10px]"><ExternalLink className="h-3.5 w-3.5 mr-2" />Check HC Status</Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
