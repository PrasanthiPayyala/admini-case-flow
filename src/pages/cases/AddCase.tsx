import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, X, Plus, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { caseTypes, mandals, courtNames, departments, priorities, collectorateInvolvementTypes, natureOfCaseOptions } from "@/data/sampleData";
import { useData } from "@/contexts/DataContext";
import { useToast } from "@/hooks/use-toast";

export default function AddCase() {
  const { addCase, generateCaseId } = useData();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [coRespondents, setCoRespondents] = useState<string[]>([""]);
  const addCR = () => setCoRespondents([...coRespondents, ""]);
  const removeCR = (i: number) => setCoRespondents(coRespondents.filter((_, idx) => idx !== i));
  const updateCR = (i: number, v: string) => { const u = [...coRespondents]; u[i] = v; setCoRespondents(u); };

  const [form, setForm] = useState({
    caseNumber: "", title: "", caseType: "", filingDate: "", filingYear: "",
    court: "", courtType: "", mandal: "", department: "", priority: "Medium",
    natureOfCase: "", collectorateInvolvement: "", landDisputeFlag: false,
    petitioner: "", respondent: "", advocate: "", advocateContact: "",
    assignedOfficer: "", lastHearing: "-", nextHearing: "-",
    subject: "", remarks: "", tags: "",
  });

  const set = (field: string, value: any) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.caseNumber || !form.title || !form.caseType || !form.court || !form.mandal || !form.department || !form.petitioner || !form.respondent) {
      toast({ title: "Validation Error", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }
    const id = generateCaseId();
    const caseRecord: import("@/data/sampleData").CaseRecord = {
      id,
      caseNumber: form.caseNumber,
      title: form.title,
      court: form.court,
      courtType: form.courtType,
      caseType: form.caseType,
      petitioner: form.petitioner,
      respondent: form.respondent,
      coRespondents: coRespondents.filter(c => c.trim()),
      petitioners: [{ name: form.petitioner, type: "Individual", department: "", remarks: "" }],
      respondents: [{ name: form.respondent, type: "Government", department: form.department, remarks: "" }],
      coRespondentParties: coRespondents.filter(c => c.trim()).map(cr => ({ name: cr, type: "Government", department: "", remarks: "" })),
      department: form.department,
      mandal: form.mandal,
      division: "",
      filingDate: form.filingDate,
      filingYear: form.filingYear || form.filingDate?.slice(0, 4) || "",
      assignedOfficer: form.assignedOfficer,
      priority: form.priority,
      status: "Fresh",
      lastHearing: form.lastHearing || "-",
      nextHearing: form.nextHearing || "-",
      advocate: form.advocate,
      advocateContact: form.advocateContact,
      subject: form.subject,
      remarks: form.remarks,
      tags: form.tags ? form.tags.split(",").map(t => t.trim()) : [],
      collectorateInvolvement: form.collectorateInvolvement,
      natureOfCase: form.natureOfCase,
      landDisputeFlag: form.landDisputeFlag,
      orderPassed: false,
      orderSummary: "",
      complianceRequired: false,
      complianceStatus: "Not Applicable",
      complianceDueDate: "",
      complianceCompletedDate: "",
      lastUpdated: new Date().toISOString().slice(0, 10),
      counterDraftStatus: "Not Started",
      gpApprovalStatus: "Not Applicable",
      collectorApprovalStatus: "Not Applicable",
      counterFilingDueDate: "",
      pendingAtLevel: "Department",
      interimOrderStatus: "Not Applicable",
      finalJudgmentStatus: "Pending",
      finalActionStatus: "In Progress",
    };
    addCase(caseRecord);
    toast({ title: "Case registered", description: `${form.caseNumber} created successfully.` });
    navigate("/cases");
  };

  return (
    <AppLayout>
      <PageHeader
        title="Register New Case"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Cases", href: "/cases" }, { label: "New Case" }]}
        actions={<Link to="/cases"><Button variant="outline" size="sm"><X className="h-3.5 w-3.5 mr-1.5" />Cancel</Button></Link>}
      />
      <form onSubmit={handleSubmit} className="space-y-5 max-w-4xl">
        <div className="govt-card p-5">
          <h3 className="text-xs font-semibold text-foreground mb-3">Case Details</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1"><Label className="text-[10px]">Case Number (No./Year) *</Label><Input value={form.caseNumber} onChange={e => set("caseNumber", e.target.value)} placeholder="e.g. WP(C) 14523/2024" className="h-8 text-xs" /></div>
            <div className="space-y-1 col-span-2"><Label className="text-[10px]">Case Title *</Label><Input value={form.title} onChange={e => set("title", e.target.value)} placeholder="Brief title" className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-[10px]">Case Type *</Label>
              <Select value={form.caseType} onValueChange={v => set("caseType", v)}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{caseTypes.map(ct => <SelectItem key={ct} value={ct}>{ct}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><Label className="text-[10px]">Filing Date *</Label><Input type="date" value={form.filingDate} onChange={e => set("filingDate", e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-[10px]">Filing Year</Label><Input value={form.filingYear} onChange={e => set("filingYear", e.target.value)} placeholder="e.g. 2024" className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-[10px]">Court Name *</Label>
              <Select value={form.court} onValueChange={v => set("court", v)}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{courtNames.map(cn => <SelectItem key={cn} value={cn}>{cn}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><Label className="text-[10px]">Court Type *</Label>
              <Select value={form.courtType} onValueChange={v => set("courtType", v)}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{["High Court","District Court","Tribunal","Consumer Forum","Revenue Court","Civil Court"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><Label className="text-[10px]">Mandal *</Label>
              <Select value={form.mandal} onValueChange={v => set("mandal", v)}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{mandals.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><Label className="text-[10px]">Department *</Label>
              <Select value={form.department} onValueChange={v => set("department", v)}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><Label className="text-[10px]">Priority</Label>
              <Select value={form.priority} onValueChange={v => set("priority", v)}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{priorities.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><Label className="text-[10px]">Nature of Case</Label>
              <Select value={form.natureOfCase} onValueChange={v => set("natureOfCase", v)}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{natureOfCaseOptions.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><Label className="text-[10px]">Collectorate Involvement</Label>
              <Select value={form.collectorateInvolvement} onValueChange={v => set("collectorateInvolvement", v)}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{collectorateInvolvementTypes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3 pt-5">
              <Switch id="land-dispute" checked={form.landDisputeFlag} onCheckedChange={v => set("landDisputeFlag", v)} /><Label htmlFor="land-dispute" className="text-xs">Land Dispute?</Label>
            </div>
          </div>
        </div>

        <div className="govt-card p-5">
          <h3 className="text-xs font-semibold text-foreground mb-3">Parties</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1"><Label className="text-[10px]">Petitioner *</Label><Input value={form.petitioner} onChange={e => set("petitioner", e.target.value)} placeholder="Full name" className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-[10px]">Respondent *</Label><Input value={form.respondent} onChange={e => set("respondent", e.target.value)} placeholder="Full name" className="h-8 text-xs" /></div>
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1.5">
              <Label className="text-[10px]">Co-Respondent(s)</Label>
              <Button type="button" variant="outline" size="sm" className="h-6 text-[10px]" onClick={addCR}><Plus className="h-3 w-3 mr-1" />Add</Button>
            </div>
            <div className="space-y-1.5">
              {coRespondents.map((cr, i) => (
                <div key={i} className="flex gap-2">
                  <Input placeholder={`Co-Respondent ${i+1}`} className="h-8 text-xs" value={cr} onChange={e => updateCR(i, e.target.value)} />
                  {coRespondents.length > 1 && <Button type="button" variant="ghost" size="sm" className="h-8 px-2" onClick={() => removeCR(i)}><Trash2 className="h-3 w-3 text-muted-foreground" /></Button>}
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="space-y-1"><Label className="text-[10px]">Advocate Name</Label><Input value={form.advocate} onChange={e => set("advocate", e.target.value)} placeholder="Advocate" className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-[10px]">Advocate Contact</Label><Input value={form.advocateContact} onChange={e => set("advocateContact", e.target.value)} placeholder="Phone" className="h-8 text-xs" /></div>
          </div>
        </div>

        <div className="govt-card p-5">
          <h3 className="text-xs font-semibold text-foreground mb-3">Assignment & Schedule</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1"><Label className="text-[10px]">Assigned Officer *</Label>
              <Select value={form.assignedOfficer} onValueChange={v => set("assignedOfficer", v)}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="District Legal Officer">District Legal Officer</SelectItem>
                  <SelectItem value="Senior Reviewing Officer">Senior Reviewing Officer</SelectItem>
                  <SelectItem value="Section Officer – Land Matters">Section Officer – Land Matters</SelectItem>
                  <SelectItem value="High Court Representative Officer">High Court Representative Officer</SelectItem>
                  <SelectItem value="Revenue Officer – Collectorate">Revenue Officer – Collectorate</SelectItem>
                  <SelectItem value="Department Nodal Officer – Revenue">Department Nodal Officer – Revenue</SelectItem>
                  <SelectItem value="Mandal Nodal Officer – Bhongir">Mandal Nodal Officer – Bhongir</SelectItem>
                  <SelectItem value="Mandal Nodal Officer – Choutuppal">Mandal Nodal Officer – Choutuppal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><Label className="text-[10px]">Last Hearing Date</Label><Input type="date" value={form.lastHearing !== "-" ? form.lastHearing : ""} onChange={e => set("lastHearing", e.target.value || "-")} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-[10px]">Next Hearing Date</Label><Input type="date" value={form.nextHearing !== "-" ? form.nextHearing : ""} onChange={e => set("nextHearing", e.target.value || "-")} className="h-8 text-xs" /></div>
          </div>
        </div>

        <div className="govt-card p-5">
          <h3 className="text-xs font-semibold text-foreground mb-3">Subject & Remarks</h3>
          <div className="space-y-3">
            <div className="space-y-1"><Label className="text-[10px]">Subject Summary *</Label><Textarea value={form.subject} onChange={e => set("subject", e.target.value)} placeholder="Brief description..." rows={2} className="text-xs" /></div>
            <div className="space-y-1"><Label className="text-[10px]">Remarks</Label><Textarea value={form.remarks} onChange={e => set("remarks", e.target.value)} placeholder="Additional notes..." rows={2} className="text-xs" /></div>
            <div className="space-y-1"><Label className="text-[10px]">Tags / Labels</Label><Input value={form.tags} onChange={e => set("tags", e.target.value)} placeholder="Comma-separated tags" className="h-8 text-xs" /></div>
          </div>
        </div>

        <div className="govt-card p-5">
          <h3 className="text-xs font-semibold text-foreground mb-3">Attachments</h3>
          <div className="border-2 border-dashed border-border rounded-md p-6 text-center">
            <p className="text-xs text-muted-foreground">Drag and drop files here or click to browse</p>
            <p className="text-[10px] text-muted-foreground mt-1">PDF, DOCX, JPG up to 10MB each</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit"><Save className="h-3.5 w-3.5 mr-1.5" />Register Case</Button>
          <Link to="/cases"><Button variant="ghost" type="button">Cancel</Button></Link>
        </div>
      </form>
    </AppLayout>
  );
}
