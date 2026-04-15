import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { HC_STATUS_URL } from "@/data/sampleData";
import type { Party } from "@/data/sampleData";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, FileText, Calendar, ArrowLeft, ExternalLink, ShieldCheck, Plus, Printer, Scale, Users, Clock, Gavel, FolderOpen, Activity, Briefcase, Building2, CheckCircle2, AlertTriangle } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const demoDocuments = [
  { id: 1, title: "Writ Petition Copy", type: "Petition", stage: "Filed", date: "2024-01-15", uploadedBy: "District Legal Officer" },
  { id: 2, title: "Counter Affidavit Draft", type: "Counter", stage: "Counter", date: "2024-03-10", uploadedBy: "Section Officer" },
  { id: 3, title: "Interim Order Copy", type: "Court Order", stage: "Interim", date: "2024-04-02", uploadedBy: "HC Liaison" },
  { id: 4, title: "Compliance Report", type: "Report", stage: "Compliance", date: "2024-04-08", uploadedBy: "Revenue Officer" },
];
const docStages = ["Filed", "Interim", "Counter", "Compliance", "Judgment", "Miscellaneous"];

function DetailField({ label, value, className }: { label: string; value: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <p className="detail-label">{label}</p>
      <div className="detail-value">{value || "-"}</div>
    </div>
  );
}

function PartyCard({ title, parties, icon }: { title: string; parties: Party[]; icon?: React.ReactNode }) {
  if (!parties || parties.length === 0) return null;
  return (
    <div className="bg-muted/30 rounded p-3">
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
        {icon}{title} ({parties.length})
      </p>
      <div className="space-y-2">
        {parties.map((p, i) => (
          <div key={i} className="flex items-start justify-between gap-2 text-xs">
            <div>
              <span className="font-medium text-foreground">{i + 1}. {p.name}</span>
              {p.type && <Badge variant="secondary" className="ml-1.5 text-[9px] px-1 py-0">{p.type}</Badge>}
            </div>
            <div className="text-right shrink-0">
              {p.department && <span className="text-[10px] text-muted-foreground">{p.department}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WorkflowStep({ label, status, isActive }: { label: string; status: string; isActive?: boolean }) {
  const getColor = (s: string) => {
    if (s === "Completed" || s === "Approved" || s === "Filed" || s === "Complied" || s === "Received") return "bg-emerald-100 text-emerald-800 border-emerald-300";
    if (s === "Pending" || s === "Draft Ready") return "bg-amber-100 text-amber-800 border-amber-300";
    if (s === "Not Started" || s === "Not Applicable") return "bg-muted text-muted-foreground border-border";
    if (s === "In Progress") return "bg-blue-100 text-blue-800 border-blue-300";
    return "bg-muted text-muted-foreground border-border";
  };
  return (
    <div className={`rounded-md border p-3 text-center ${isActive ? 'ring-2 ring-primary/30' : ''} ${getColor(status)}`}>
      <p className="text-[10px] font-semibold uppercase tracking-wider mb-1">{label}</p>
      <p className="text-xs font-bold">{status}</p>
    </div>
  );
}

export default function CaseDetails() {
  const { id } = useParams();
  const { cases, hearings, addHearing, updateCase, generateHearingId } = useData();
  const { permissions } = useAuth();
  const { toast } = useToast();
  const caseData = cases.find(c => c.id === decodeURIComponent(id || ""));
  const [hearingDialog, setHearingDialog] = useState(false);
  const [hForm, setHForm] = useState({ date: "", time: "", type: "Regular Hearing", outcome: "", remarks: "", orderPassed: false, orderSummary: "", complianceRequired: false, complianceStatus: "Not Applicable", complianceDueDate: "" });

  if (!caseData) return <AppLayout><div className="text-center py-20 text-muted-foreground">Case not found</div></AppLayout>;

  const caseHearings = hearings.filter(h => h.caseId === caseData.id);

  const handleAddHearing = () => {
    const hid = generateHearingId();
    addHearing({
      id: hid, caseId: caseData.id, caseTitle: caseData.title, court: caseData.court,
      date: hForm.date, time: hForm.time, type: hForm.type, officer: caseData.assignedOfficer,
      status: hForm.outcome ? "Completed" : "Scheduled", outcome: hForm.outcome, remarks: hForm.remarks,
      orderPassed: hForm.orderPassed, orderSummary: hForm.orderSummary,
      complianceRequired: hForm.complianceRequired, complianceStatus: hForm.complianceStatus,
      complianceDueDate: hForm.complianceDueDate,
    });
    const updates: Partial<typeof caseData> = { lastUpdated: new Date().toISOString().slice(0, 10) };
    if (hForm.outcome) { updates.lastHearing = hForm.date; updates.status = hForm.outcome === "Disposed" || hForm.outcome === "Dismissed" ? "Closed" : "Ongoing"; }
    if (hForm.orderPassed) { updates.orderPassed = true; updates.orderSummary = hForm.orderSummary; }
    if (hForm.complianceRequired) { updates.complianceRequired = true; updates.complianceStatus = hForm.complianceStatus; updates.complianceDueDate = hForm.complianceDueDate; }
    updateCase(caseData.id, updates);
    toast({ title: "Hearing added", description: `Hearing on ${hForm.date} recorded.` });
    setHearingDialog(false);
    setHForm({ date: "", time: "", type: "Regular Hearing", outcome: "", remarks: "", orderPassed: false, orderSummary: "", complianceRequired: false, complianceStatus: "Not Applicable", complianceDueDate: "" });
  };

  return (
    <AppLayout>
      <PageHeader
        title={caseData.title}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Cases", href: "/cases" }, { label: caseData.caseNumber }]}
        actions={
          <div className="flex items-center gap-2">
            <Link to="/cases"><Button variant="outline" size="sm"><ArrowLeft className="h-3.5 w-3.5 mr-1.5" />Back</Button></Link>
            <a href={HC_STATUS_URL} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm"><ExternalLink className="h-3.5 w-3.5 mr-1.5" />HC Status</Button>
            </a>
            {permissions?.canUpdateHearing && <Button variant="outline" size="sm" onClick={() => setHearingDialog(true)}><Plus className="h-3.5 w-3.5 mr-1.5" />Add Hearing</Button>}
            {permissions?.canEditCase && <Link to={`/cases/${encodeURIComponent(caseData.id)}/edit`}><Button size="sm"><Edit className="h-3.5 w-3.5 mr-1.5" />Edit Case</Button></Link>}
            <Button variant="outline" size="sm" onClick={() => window.print()}><Printer className="h-3.5 w-3.5 mr-1.5" />Print</Button>
          </div>
        }
      />

      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-4">
          {/* Case Summary */}
          <div className="govt-section-card p-4">
            <h3 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5" />Case Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <DetailField label="Case ID" value={caseData.id} />
              <DetailField label="Case Number" value={caseData.caseNumber} />
              <DetailField label="Case Type" value={caseData.caseType} />
              <DetailField label="Court Name" value={caseData.court} />
              <DetailField label="Court Type" value={caseData.courtType} />
              <DetailField label="Nature of Case" value={caseData.natureOfCase} />
              <DetailField label="Filing Date" value={caseData.filingDate} />
              <DetailField label="Filing Year" value={caseData.filingYear} />
              <DetailField label="Department" value={caseData.department} />
              <DetailField label="Mandal" value={caseData.mandal} />
              <DetailField label="Division" value={caseData.division} />
              <DetailField label="Assigned Officer" value={caseData.assignedOfficer} />
              <DetailField label="Collectorate Involvement" value={caseData.collectorateInvolvement} />
              <DetailField label="Pending At Level" value={<StatusBadge value={caseData.pendingAtLevel} />} />
            </div>
          </div>

          {/* Multiple Parties */}
          <div className="govt-section-card p-4">
            <h3 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />Parties Involved</h3>
            <div className="grid md:grid-cols-2 gap-3">
              <PartyCard title="Petitioners" parties={caseData.petitioners} />
              <PartyCard title="Respondents" parties={caseData.respondents} icon={<Building2 className="h-3 w-3" />} />
            </div>
            {caseData.coRespondentParties && caseData.coRespondentParties.length > 0 && (
              <div className="mt-3">
                <PartyCard title="Co-Respondents" parties={caseData.coRespondentParties} />
              </div>
            )}
            <div className="grid grid-cols-2 gap-3 mt-3">
              <DetailField label="Advocate" value={caseData.advocate} />
              <DetailField label="Advocate Contact" value={caseData.advocateContact} />
            </div>
          </div>

          {/* Subject & Remarks */}
          <div className="govt-card p-4">
            <h3 className="text-xs font-semibold text-foreground mb-2">Subject & Remarks</h3>
            <p className="text-xs text-foreground mb-2">{caseData.subject}</p>
            {caseData.remarks && <p className="text-xs text-muted-foreground italic border-t border-border pt-2 mt-2">{caseData.remarks}</p>}
          </div>

          {/* Approval Workflow Pipeline */}
          <div className="govt-section-card p-4">
            <h3 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5"><Gavel className="h-3.5 w-3.5" />Legal Progress & Approval Workflow</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 mb-4">
              <WorkflowStep label="Counter Draft" status={caseData.counterDraftStatus} isActive={caseData.pendingAtLevel === "Counter Filing"} />
              <WorkflowStep label="GP Approval" status={caseData.gpApprovalStatus} isActive={caseData.pendingAtLevel === "GP Approval"} />
              <WorkflowStep label="Collector Approval" status={caseData.collectorApprovalStatus} isActive={caseData.pendingAtLevel === "Collector Approval"} />
              <WorkflowStep label="Counter Filed" status={caseData.counterDraftStatus === "Filed" ? "Filed" : "Pending"} />
              <WorkflowStep label="Interim Order" status={caseData.interimOrderStatus} />
              <WorkflowStep label="Final Judgment" status={caseData.finalJudgmentStatus} />
              <WorkflowStep label="Final Action" status={caseData.finalActionStatus} isActive={caseData.pendingAtLevel === "Final Action"} />
            </div>
            {caseData.counterFilingDueDate && (
              <div className="bg-amber-50 border border-amber-200 rounded p-2 text-xs">
                <span className="font-semibold text-amber-800">Counter Filing Due:</span>{" "}
                <span className="text-amber-700">{caseData.counterFilingDueDate}</span>
              </div>
            )}

            {/* Approval Actions */}
            {(permissions?.canApproveGP || permissions?.canApproveCollector) && (
              <div className="mt-3 flex gap-2">
                {permissions?.canApproveGP && caseData.gpApprovalStatus === "Pending" && (
                  <Button size="sm" variant="outline" className="text-xs" onClick={() => {
                    updateCase(caseData.id, { gpApprovalStatus: "Approved", pendingAtLevel: "Collector Approval", lastUpdated: new Date().toISOString().slice(0, 10) });
                    toast({ title: "GP Approval granted" });
                  }}>
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />Approve GP
                  </Button>
                )}
                {permissions?.canApproveCollector && caseData.collectorApprovalStatus === "Pending" && (
                  <Button size="sm" onClick={() => {
                    updateCase(caseData.id, { collectorApprovalStatus: "Approved", counterDraftStatus: "Filed", pendingAtLevel: "Hearing Update", lastUpdated: new Date().toISOString().slice(0, 10) });
                    toast({ title: "Collector Approval granted" });
                  }}>
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />Collector Approve
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Order & Compliance */}
          <div className="govt-section-card p-4">
            <h3 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" />Order & Compliance Tracking</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <DetailField label="Order Passed" value={caseData.orderPassed ? <StatusBadge value="Yes" /> : "No"} />
              <DetailField label="Compliance Required" value={caseData.complianceRequired ? <StatusBadge value="Yes" /> : "No"} />
              <DetailField label="Compliance Status" value={<StatusBadge value={caseData.complianceStatus} />} />
              <DetailField label="Compliance Due Date" value={caseData.complianceDueDate || "-"} />
            </div>
            {caseData.orderPassed && (
              <div className="mt-3 bg-muted/30 rounded p-3">
                <p className="detail-label">Order Summary</p>
                <p className="text-xs font-medium">{caseData.orderSummary}</p>
              </div>
            )}
            {caseData.complianceCompletedDate && <div className="mt-2"><DetailField label="Completed Date" value={caseData.complianceCompletedDate} /></div>}
            
            {/* Compliance update action */}
            {permissions?.canUpdateCompliance && caseData.complianceRequired && caseData.complianceStatus !== "Complied" && (
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="outline" className="text-xs" onClick={() => {
                  updateCase(caseData.id, { complianceStatus: "Partially Complied", lastUpdated: new Date().toISOString().slice(0, 10) });
                  toast({ title: "Compliance updated to Partially Complied" });
                }}>
                  <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />Mark Partial
                </Button>
                <Button size="sm" className="text-xs" onClick={() => {
                  updateCase(caseData.id, { complianceStatus: "Complied", complianceCompletedDate: new Date().toISOString().slice(0, 10), pendingAtLevel: "Closed", lastUpdated: new Date().toISOString().slice(0, 10) });
                  toast({ title: "Compliance marked as Complied" });
                }}>
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />Mark Complied
                </Button>
              </div>
            )}
          </div>

          {/* Hearing Timeline */}
          <div className="govt-card">
            <div className="govt-card-header">
              <h3><Calendar className="h-3.5 w-3.5" />Hearing History ({caseHearings.length})</h3>
              {permissions?.canUpdateHearing && <Button size="sm" variant="outline" onClick={() => setHearingDialog(true)}><Plus className="h-3 w-3 mr-1" />Add Hearing</Button>}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full govt-table">
                <thead><tr><th>Date</th><th>Type</th><th>Status</th><th>Outcome</th><th>Order</th><th>Compliance</th><th>Remarks</th></tr></thead>
                <tbody>
                  {caseHearings.map(h => (
                    <tr key={h.id}>
                      <td className="whitespace-nowrap">{h.date}</td>
                      <td>{h.type}</td>
                      <td><StatusBadge value={h.status} size="sm" /></td>
                      <td>{h.outcome || "-"}</td>
                      <td>{h.orderPassed ? <StatusBadge value="Yes" size="sm" /> : "-"}</td>
                      <td><StatusBadge value={h.complianceStatus} size="sm" /></td>
                      <td className="max-w-[180px] truncate">{h.remarks}</td>
                    </tr>
                  ))}
                  {caseHearings.length === 0 && <tr><td colSpan={7} className="text-center text-muted-foreground py-4">No hearings recorded</td></tr>}
                </tbody>
              </table>
            </div>
          </div>

          {/* Documents by Stage */}
          <div className="govt-card">
            <div className="govt-card-header">
              <h3><FolderOpen className="h-3.5 w-3.5" />Documents by Stage</h3>
              {permissions?.canUploadDocuments && <Button size="sm" variant="outline"><Plus className="h-3 w-3 mr-1" />Upload</Button>}
            </div>
            <Tabs defaultValue="Filed" className="p-3">
              <TabsList className="mb-3">
                {docStages.map(stage => (
                  <TabsTrigger key={stage} value={stage} className="text-[10px]">
                    {stage} ({demoDocuments.filter(d => d.stage === stage).length})
                  </TabsTrigger>
                ))}
              </TabsList>
              {docStages.map(stage => (
                <TabsContent key={stage} value={stage}>
                  {demoDocuments.filter(d => d.stage === stage).length > 0 ? (
                    <table className="w-full govt-table">
                      <thead><tr><th>Title</th><th>Type</th><th>Date</th><th>Uploaded By</th><th>Actions</th></tr></thead>
                      <tbody>
                        {demoDocuments.filter(d => d.stage === stage).map(doc => (
                          <tr key={doc.id}>
                            <td className="font-medium">{doc.title}</td>
                            <td>{doc.type}</td>
                            <td>{doc.date}</td>
                            <td>{doc.uploadedBy}</td>
                            <td><Button variant="ghost" size="sm" className="h-6 text-[10px]"><FileText className="h-3 w-3 mr-1" />View</Button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground text-xs">No {stage.toLowerCase()} documents uploaded</div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Activity Trail */}
          <div className="govt-card">
            <div className="govt-card-header"><h3><Activity className="h-3.5 w-3.5" />Activity Trail</h3></div>
            <div className="p-4 space-y-3">
              {[
                { action: "Case registered", by: "District Legal Officer", date: caseData.filingDate },
                ...(caseData.counterDraftStatus !== "Not Started" ? [{ action: `Counter draft: ${caseData.counterDraftStatus}`, by: "Section Officer", date: caseData.lastHearing !== "-" ? caseData.lastHearing : caseData.filingDate }] : []),
                ...(caseData.gpApprovalStatus !== "Not Applicable" ? [{ action: `GP Approval: ${caseData.gpApprovalStatus}`, by: "Government Pleader", date: caseData.lastUpdated }] : []),
                ...(caseData.collectorApprovalStatus !== "Not Applicable" ? [{ action: `Collector Approval: ${caseData.collectorApprovalStatus}`, by: "District Collector", date: caseData.lastUpdated }] : []),
                ...(caseData.orderPassed ? [{ action: "Order recorded", by: "HC Liaison Officer", date: caseData.lastUpdated }] : []),
                ...(caseData.complianceRequired ? [{ action: `Compliance: ${caseData.complianceStatus}`, by: "Revenue Officer", date: caseData.lastUpdated }] : []),
                { action: "Last updated", by: "System", date: caseData.lastUpdated },
              ].map((entry, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-foreground">{entry.action}</p>
                    <p className="text-[10px] text-muted-foreground">{entry.by} • {entry.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="govt-section-card p-4 space-y-3">
            <div className="flex items-center justify-between"><span className="detail-label">Status</span><StatusBadge value={caseData.status} /></div>
            <div className="flex items-center justify-between"><span className="detail-label">Priority</span><StatusBadge value={caseData.priority} type="priority" /></div>
            <div className="border-t border-border pt-2"><DetailField label="Case Type" value={caseData.caseType} /></div>
            <DetailField label="Division" value={caseData.division} />
            <DetailField label="Mandal" value={caseData.mandal} />
            <DetailField label="Department" value={caseData.department} />
            <div className="border-t border-border pt-2"><DetailField label="Last Hearing" value={caseData.lastHearing} /></div>
            <DetailField label="Next Hearing" value={caseData.nextHearing} />
            <DetailField label="Last Updated" value={caseData.lastUpdated} />
            {caseData.landDisputeFlag && (
              <div className="border-t border-border pt-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-red-50 text-red-700 border border-red-200">⚠ Land Dispute</span>
              </div>
            )}
          </div>

          <div className="govt-card p-4">
            <h3 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />Pending At</h3>
            <StatusBadge value={caseData.pendingAtLevel} />
          </div>

          <div className="govt-card p-4">
            <h3 className="text-xs font-semibold text-foreground mb-2">Tags</h3>
            <div className="flex flex-wrap gap-1">{caseData.tags.map(tag => <span key={tag} className="px-2 py-0.5 rounded text-[10px] bg-muted text-muted-foreground font-medium">{tag}</span>)}</div>
          </div>

          <div className="govt-card p-4">
            <h3 className="text-xs font-semibold text-foreground mb-2">Quick Actions</h3>
            <div className="space-y-1.5">
              {permissions?.canUpdateHearing && <Button variant="outline" size="sm" className="w-full justify-start text-[10px]" onClick={() => setHearingDialog(true)}><Calendar className="h-3.5 w-3.5 mr-2" />Add Hearing Update</Button>}
              {permissions?.canCreateAppeal && <Link to="/appeals/new" className="block"><Button variant="outline" size="sm" className="w-full justify-start text-[10px]"><Scale className="h-3.5 w-3.5 mr-2" />Add Appeal</Button></Link>}
              <Button variant="outline" size="sm" className="w-full justify-start text-[10px]"><FileText className="h-3.5 w-3.5 mr-2" />Upload Document</Button>
              <a href={HC_STATUS_URL} target="_blank" rel="noopener noreferrer" className="block">
                <Button variant="outline" size="sm" className="w-full justify-start text-[10px]"><ExternalLink className="h-3.5 w-3.5 mr-2" />Check HC Status</Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Add Hearing Dialog */}
      <Dialog open={hearingDialog} onOpenChange={setHearingDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Add Hearing Update</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1"><Label className="text-xs">Hearing Date *</Label><Input type="date" value={hForm.date} onChange={e => setHForm({ ...hForm, date: e.target.value })} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Time</Label><Input type="time" value={hForm.time} onChange={e => setHForm({ ...hForm, time: e.target.value })} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Type</Label>
              <Select value={hForm.type} onValueChange={v => setHForm({ ...hForm, type: v })}><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>{["Regular Hearing","Arguments","Counter Filing","First Hearing","Final Hearing"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><Label className="text-xs">Outcome</Label>
              <Select value={hForm.outcome} onValueChange={v => setHForm({ ...hForm, outcome: v })}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{["Adjourned","Part-Heard","Reserved for Orders","Disposed","Dismissed","Allowed","Directions Issued"].map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3"><Switch checked={hForm.orderPassed} onCheckedChange={v => setHForm({ ...hForm, orderPassed: v })} /><Label className="text-xs">Order Passed?</Label></div>
            <div className="flex items-center gap-3"><Switch checked={hForm.complianceRequired} onCheckedChange={v => setHForm({ ...hForm, complianceRequired: v })} /><Label className="text-xs">Compliance Required?</Label></div>
            {hForm.orderPassed && <div className="space-y-1 col-span-2"><Label className="text-xs">Order Summary</Label><Textarea value={hForm.orderSummary} onChange={e => setHForm({ ...hForm, orderSummary: e.target.value })} rows={2} className="text-xs" /></div>}
            {hForm.complianceRequired && (
              <>
                <div className="space-y-1"><Label className="text-xs">Compliance Status</Label>
                  <Select value={hForm.complianceStatus} onValueChange={v => setHForm({ ...hForm, complianceStatus: v })}><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="Not Applicable">Not Applicable</SelectItem><SelectItem value="Pending">Pending</SelectItem><SelectItem value="Partially Complied">Partially Complied</SelectItem><SelectItem value="Complied">Complied</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-1"><Label className="text-xs">Due Date</Label><Input type="date" value={hForm.complianceDueDate} onChange={e => setHForm({ ...hForm, complianceDueDate: e.target.value })} className="h-8 text-xs" /></div>
              </>
            )}
            <div className="space-y-1 col-span-2"><Label className="text-xs">Remarks</Label><Textarea value={hForm.remarks} onChange={e => setHForm({ ...hForm, remarks: e.target.value })} rows={2} className="text-xs" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setHearingDialog(false)}>Cancel</Button>
            <Button onClick={handleAddHearing} disabled={!hForm.date}>Save Hearing</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
