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
import { caseTypes, mandals, courtNames, departments, priorities, collectorateInvolvementTypes, natureOfCaseOptions, type Party } from "@/data/sampleData";
import { useData } from "@/contexts/DataContext";
import { useToast } from "@/hooks/use-toast";

type PartyForm = Party;
const blankPetitioner = (): PartyForm => ({ name: "", type: "Individual", department: "", isInternalDept: false, remarks: "" });
const blankRespondent = (): PartyForm => ({ name: "", type: "Government", department: "", isInternalDept: true, remarks: "" });

export default function AddCase() {
  const { addCase, generateCaseId, cases } = useData();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [petitioners, setPetitioners] = useState<PartyForm[]>([blankPetitioner()]);
  const [respondents, setRespondents] = useState<PartyForm[]>([blankRespondent()]);
  const [coRespondents, setCoRespondents] = useState<PartyForm[]>([]);

  const updateParty = (
    list: PartyForm[], setter: (l: PartyForm[]) => void, idx: number, field: keyof PartyForm, val: any
  ) => {
    const next = list.map((p, i) => i === idx ? { ...p, [field]: val } : p);
    setter(next);
  };

  const [form, setForm] = useState({
    caseNumber: "", caseYear: String(new Date().getFullYear()),
    title: "", caseType: "", filingDate: "", filingYear: "",
    court: "", courtType: "", mandal: "", department: "", priority: "Medium",
    natureOfCase: "", collectorateInvolvement: "", landDisputeFlag: false,
    advocate: "", advocateContact: "",
    assignedOfficer: "", lastHearing: "-", nextHearing: "-",
    subject: "", remarks: "", tags: "",
    // Workflow
    instructionsFiled: "Pending" as "Yes" | "No" | "Pending",
    counterFiled: "No" as "Yes" | "No" | "Pending",
    srNumber: "",
    counterFilingDueDate: "",
    approvedCounterDocName: "",
    disposed: "No" as "Yes" | "No",
    disposalDate: "",
    disposalSummary: "",
    judgmentDocName: "",
  });

  const set = (field: string, value: any) => setForm(prev => ({ ...prev, [field]: value }));
  const nextSlNo = (cases.length || 0) + 1;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.caseNumber || !form.title || !form.caseType || !form.court || !form.mandal || !form.department || !petitioners[0]?.name || !respondents[0]?.name) {
      toast({ title: "Validation Error", description: "Please fill all required fields including at least one petitioner and respondent.", variant: "destructive" });
      return;
    }
    const id = generateCaseId();
    const cleanPet = petitioners.filter(p => p.name.trim());
    const cleanResp = respondents.filter(p => p.name.trim());
    const cleanCo = coRespondents.filter(p => p.name.trim());
    const caseRecord: import("@/data/sampleData").CaseRecord = {
      id,
      caseNumber: form.caseNumber,
      title: form.title,
      court: form.court,
      courtType: form.courtType,
      caseType: form.caseType,
      petitioner: cleanPet[0]?.name || "",
      respondent: cleanResp[0]?.name || "",
      coRespondents: cleanCo.map(p => p.name),
      petitioners: cleanPet,
      respondents: cleanResp,
      coRespondentParties: cleanCo,
      department: form.department,
      mandal: form.mandal,
      division: "",
      filingDate: form.filingDate,
      filingYear: form.filingYear || form.caseYear || form.filingDate?.slice(0, 4) || "",
      assignedOfficer: form.assignedOfficer,
      priority: form.priority,
      status: form.disposed === "Yes" ? "Closed" : "Fresh",
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
      counterDraftStatus: form.counterFiled === "Yes" ? "Filed" : "Not Started",
      gpApprovalStatus: "Not Applicable",
      collectorApprovalStatus: "Not Applicable",
      counterFilingDueDate: form.counterFilingDueDate,
      pendingAtLevel: form.disposed === "Yes" ? "Closed" : form.counterFiled === "No" ? "Counter Filing" : "Hearing Update",
      interimOrderStatus: "Not Applicable",
      finalJudgmentStatus: form.disposed === "Yes" ? "Received" : "Pending",
      finalActionStatus: form.disposed === "Yes" ? "Completed" : "In Progress",
      slNo: nextSlNo,
      caseYear: form.caseYear,
      instructionsFiled: form.instructionsFiled,
      counterFiled: form.counterFiled,
      srNumber: form.srNumber,
      approvedCounterDoc: form.approvedCounterDocName ? { name: form.approvedCounterDocName, uploadedBy: "Self", uploadedAt: new Date().toISOString().slice(0, 10) } : null,
      disposed: form.disposed,
      disposalDate: form.disposalDate,
      disposalSummary: form.disposalSummary,
      judgmentDoc: form.judgmentDocName ? { name: form.judgmentDocName, uploadedBy: "Self", uploadedAt: new Date().toISOString().slice(0, 10) } : null,
      directions: [],
      actionsTaken: [],
      closed: false,
      closedBy: "",
      closedAt: "",
      auditTrail: [{ id: `AUD-${Date.now()}`, ts: new Date().toISOString(), actor: "Self", role: "User", action: "Case Registered", details: form.caseNumber }],
    };
    addCase(caseRecord);
    toast({ title: "Case registered", description: `${form.caseNumber} (Sl. No. ${nextSlNo}) created successfully.` });
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
        {/* Identifiers */}
        <div className="govt-card p-5">
          <h3 className="text-xs font-semibold text-foreground mb-3">Case Identifiers</h3>
          <div className="grid grid-cols-4 gap-3">
            <div className="space-y-1"><Label className="text-[10px]">Sl. No.</Label><Input value={`#${nextSlNo}`} disabled className="h-8 text-xs bg-muted" /></div>
            <div className="space-y-1"><Label className="text-[10px]">Case Number *</Label><Input value={form.caseNumber} onChange={e => set("caseNumber", e.target.value)} placeholder="e.g. WP 14523" className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-[10px]">Case Year *</Label><Input value={form.caseYear} onChange={e => set("caseYear", e.target.value)} placeholder="2024" className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-[10px]">Display</Label><Input disabled value={form.caseNumber && form.caseYear ? `${form.caseNumber}/${form.caseYear}` : "—"} className="h-8 text-xs bg-muted" /></div>
          </div>
        </div>

        {/* Case Details */}
        <div className="govt-card p-5">
          <h3 className="text-xs font-semibold text-foreground mb-3">Case Details</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1 col-span-3"><Label className="text-[10px]">Case Title *</Label><Input value={form.title} onChange={e => set("title", e.target.value)} placeholder="Brief title" className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-[10px]">Case Type *</Label>
              <Select value={form.caseType} onValueChange={v => set("caseType", v)}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{caseTypes.map(ct => <SelectItem key={ct} value={ct}>{ct}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><Label className="text-[10px]">Filing Date *</Label><Input type="date" value={form.filingDate} onChange={e => set("filingDate", e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-[10px]">Filing Year</Label><Input value={form.filingYear} onChange={e => set("filingYear", e.target.value)} placeholder="2024" className="h-8 text-xs" /></div>
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

        {/* Petitioners */}
        <PartyEditor
          title="Petitioners"
          parties={petitioners}
          onAdd={() => setPetitioners([...petitioners, blankPetitioner()])}
          onRemove={(i) => setPetitioners(petitioners.filter((_, idx) => idx !== i))}
          onChange={(i, f, v) => updateParty(petitioners, setPetitioners, i, f, v)}
        />

        {/* Respondents */}
        <PartyEditor
          title="Respondents (multi-department supported)"
          parties={respondents}
          showDepartment
          onAdd={() => setRespondents([...respondents, blankRespondent()])}
          onRemove={(i) => setRespondents(respondents.filter((_, idx) => idx !== i))}
          onChange={(i, f, v) => updateParty(respondents, setRespondents, i, f, v)}
        />

        {/* Co-Respondents */}
        <PartyEditor
          title="Co-Respondents"
          parties={coRespondents}
          showDepartment
          allowEmpty
          onAdd={() => setCoRespondents([...coRespondents, blankRespondent()])}
          onRemove={(i) => setCoRespondents(coRespondents.filter((_, idx) => idx !== i))}
          onChange={(i, f, v) => updateParty(coRespondents, setCoRespondents, i, f, v)}
        />

        {/* Advocate */}
        <div className="govt-card p-5">
          <h3 className="text-xs font-semibold text-foreground mb-3">Advocate</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1"><Label className="text-[10px]">Advocate Name</Label><Input value={form.advocate} onChange={e => set("advocate", e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-[10px]">Advocate Contact</Label><Input value={form.advocateContact} onChange={e => set("advocateContact", e.target.value)} className="h-8 text-xs" /></div>
          </div>
        </div>

        {/* Assignment & Hearing */}
        <div className="govt-card p-5">
          <h3 className="text-xs font-semibold text-foreground mb-3">Assignment & Hearing</h3>
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
            <div className="space-y-1"><Label className="text-[10px]">Last Hearing</Label><Input type="date" value={form.lastHearing !== "-" ? form.lastHearing : ""} onChange={e => set("lastHearing", e.target.value || "-")} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-[10px]">Next Hearing Date</Label><Input type="date" value={form.nextHearing !== "-" ? form.nextHearing : ""} onChange={e => set("nextHearing", e.target.value || "-")} className="h-8 text-xs" /></div>
          </div>
        </div>

        {/* Instructions / Counter */}
        <div className="govt-card p-5">
          <h3 className="text-xs font-semibold text-foreground mb-3">Instructions / Counter</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1"><Label className="text-[10px]">Instructions Filed?</Label>
              <Select value={form.instructionsFiled} onValueChange={v => set("instructionsFiled", v)}><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="Yes">Yes</SelectItem><SelectItem value="No">No</SelectItem><SelectItem value="Pending">Pending</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><Label className="text-[10px]">Counter Filed?</Label>
              <Select value={form.counterFiled} onValueChange={v => set("counterFiled", v)}><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="Yes">Yes</SelectItem><SelectItem value="No">No</SelectItem><SelectItem value="Pending">Pending</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><Label className="text-[10px]">S.R. Number of Counter</Label><Input value={form.srNumber} onChange={e => set("srNumber", e.target.value)} placeholder="e.g. SR/1234/2024" className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-[10px]">Counter Filing Due Date</Label><Input type="date" value={form.counterFilingDueDate} onChange={e => set("counterFilingDueDate", e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1 col-span-2"><Label className="text-[10px]">Approved Counter (file name)</Label><Input value={form.approvedCounterDocName} onChange={e => set("approvedCounterDocName", e.target.value)} placeholder="Approved_Counter_xxx.pdf" className="h-8 text-xs" /></div>
          </div>
        </div>

        {/* Disposal */}
        <div className="govt-card p-5">
          <h3 className="text-xs font-semibold text-foreground mb-3">Disposal</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1"><Label className="text-[10px]">Disposed?</Label>
              <Select value={form.disposed} onValueChange={v => set("disposed", v)}><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="No">No</SelectItem><SelectItem value="Yes">Yes</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><Label className="text-[10px]">Disposal Date</Label><Input type="date" value={form.disposalDate} onChange={e => set("disposalDate", e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-[10px]">Judgment (file name)</Label><Input value={form.judgmentDocName} onChange={e => set("judgmentDocName", e.target.value)} placeholder="Judgment_xxx.pdf" className="h-8 text-xs" /></div>
            <div className="space-y-1 col-span-3"><Label className="text-[10px]">Disposal Summary</Label><Textarea value={form.disposalSummary} onChange={e => set("disposalSummary", e.target.value)} rows={2} className="text-xs" /></div>
          </div>
        </div>

        {/* Subject */}
        <div className="govt-card p-5">
          <h3 className="text-xs font-semibold text-foreground mb-3">Subject & Remarks</h3>
          <div className="space-y-3">
            <div className="space-y-1"><Label className="text-[10px]">Subject Summary *</Label><Textarea value={form.subject} onChange={e => set("subject", e.target.value)} placeholder="Brief description..." rows={2} className="text-xs" /></div>
            <div className="space-y-1"><Label className="text-[10px]">Remarks</Label><Textarea value={form.remarks} onChange={e => set("remarks", e.target.value)} placeholder="Additional notes..." rows={2} className="text-xs" /></div>
            <div className="space-y-1"><Label className="text-[10px]">Tags / Labels</Label><Input value={form.tags} onChange={e => set("tags", e.target.value)} placeholder="Comma-separated tags" className="h-8 text-xs" /></div>
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

export function PartyEditor({
  title, parties, showDepartment, allowEmpty, onAdd, onRemove, onChange,
}: {
  title: string;
  parties: Party[];
  showDepartment?: boolean;
  allowEmpty?: boolean;
  onAdd: () => void;
  onRemove: (i: number) => void;
  onChange: (i: number, field: keyof Party, value: any) => void;
}) {
  return (
    <div className="govt-card p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-foreground">{title}</h3>
        <Button type="button" variant="outline" size="sm" className="h-7 text-[10px]" onClick={onAdd}><Plus className="h-3 w-3 mr-1" />Add</Button>
      </div>
      {parties.length === 0 && allowEmpty && <p className="text-[10px] text-muted-foreground italic">No co-respondents added.</p>}
      <div className="space-y-2">
        {parties.map((p, i) => (
          <div key={i} className={`grid ${showDepartment ? "grid-cols-12" : "grid-cols-10"} gap-2 items-end border border-border rounded p-2`}>
            <div className={`${showDepartment ? "col-span-3" : "col-span-4"} space-y-1`}>
              <Label className="text-[9px]">Name *</Label>
              <Input value={p.name} onChange={e => onChange(i, "name", e.target.value)} className="h-8 text-xs" />
            </div>
            <div className="col-span-2 space-y-1">
              <Label className="text-[9px]">Type</Label>
              <Select value={p.type} onValueChange={v => onChange(i, "type", v)}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Individual">Individual</SelectItem>
                  <SelectItem value="Government">Government</SelectItem>
                  <SelectItem value="Organisation">Organisation</SelectItem>
                  <SelectItem value="Association">Association</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {showDepartment && (
              <>
                <div className="col-span-3 space-y-1">
                  <Label className="text-[9px]">Department / Office</Label>
                  <Input value={p.department || ""} onChange={e => onChange(i, "department", e.target.value)} placeholder="e.g. Revenue Department" className="h-8 text-xs" />
                </div>
                <div className="col-span-2 space-y-1 flex flex-col">
                  <Label className="text-[9px]">Internal Dept?</Label>
                  <div className="flex items-center gap-2 h-8">
                    <Switch checked={!!p.isInternalDept} onCheckedChange={v => onChange(i, "isInternalDept", v)} />
                    <span className="text-[10px] text-muted-foreground">{p.isInternalDept ? "Yes" : "No"}</span>
                  </div>
                </div>
              </>
            )}
            <div className={`${showDepartment ? "col-span-1" : "col-span-3"} space-y-1`}>
              <Label className="text-[9px]">Remarks</Label>
              <Input value={p.remarks || ""} onChange={e => onChange(i, "remarks", e.target.value)} className="h-8 text-xs" />
            </div>
            <div className="col-span-1 flex justify-end">
              <Button type="button" variant="ghost" size="sm" className="h-8 px-2" onClick={() => onRemove(i)}><Trash2 className="h-3 w-3 text-muted-foreground" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
