import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, ArrowLeft, Lock, CheckCircle2, AlertTriangle } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { caseTypes, mandals, courtNames, departments, priorities, collectorateInvolvementTypes, natureOfCaseOptions, type Party } from "@/data/sampleData";
import { PartyEditor } from "./AddCase";

export default function EditCase() {
  const { id } = useParams();
  const { cases, updateCase, closeFile } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const caseData = cases.find(c => c.id === decodeURIComponent(id || ""));

  const [form, setForm] = useState(caseData ? { ...caseData } : null);
  const [petitioners, setPetitioners] = useState<Party[]>(caseData?.petitioners || []);
  const [respondents, setRespondents] = useState<Party[]>(caseData?.respondents || []);
  const [coRespondents, setCoRespondents] = useState<Party[]>(caseData?.coRespondentParties || []);

  if (!form || !caseData) return <AppLayout><div className="text-center py-20 text-muted-foreground">Case not found</div></AppLayout>;

  const set = (field: string, value: any) => setForm(prev => prev ? { ...prev, [field]: value } : prev);
  const updateParty = (list: Party[], setter: (l: Party[]) => void, idx: number, field: keyof Party, val: any) =>
    setter(list.map((p, i) => i === idx ? { ...p, [field]: val } : p));

  const handleSave = () => {
    const cleanPet = petitioners.filter(p => p.name.trim());
    const cleanResp = respondents.filter(p => p.name.trim());
    const cleanCo = coRespondents.filter(p => p.name.trim());
    updateCase(caseData.id, {
      ...form,
      petitioners: cleanPet,
      respondents: cleanResp,
      coRespondentParties: cleanCo,
      petitioner: cleanPet[0]?.name || form.petitioner,
      respondent: cleanResp[0]?.name || form.respondent,
      coRespondents: cleanCo.map(p => p.name),
      lastUpdated: new Date().toISOString().slice(0, 10),
    });
    toast({ title: "Case updated", description: `${form.caseNumber} saved successfully.` });
    navigate(`/cases/${encodeURIComponent(caseData.id)}`);
  };

  const handleClose = () => {
    const r = closeFile(caseData.id, user?.name || "Unknown", user?.role || "");
    if (r.ok) {
      toast({ title: "File closed", description: `${form.caseNumber} archived.` });
      navigate(`/cases/${encodeURIComponent(caseData.id)}`);
    } else {
      toast({ title: "Cannot close file", description: r.reason, variant: "destructive" });
    }
  };

  const openDirs = (form.directions || []).filter(d => d.status !== "Completed").length;
  const closeReady = form.disposed === "Yes" && openDirs === 0;

  return (
    <AppLayout>
      <PageHeader
        title={`Edit Case: ${caseData.caseNumber}`}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Cases", href: "/cases" }, { label: "Edit" }]}
        actions={<Link to={`/cases/${encodeURIComponent(caseData.id)}`}><Button variant="outline" size="sm"><ArrowLeft className="h-3.5 w-3.5 mr-1.5" />Back</Button></Link>}
      />
      <form onSubmit={e => { e.preventDefault(); handleSave(); }} className="space-y-5 max-w-4xl">
        {/* Identifiers */}
        <div className="govt-card p-5">
          <h3 className="text-xs font-semibold text-foreground mb-3">Case Identifiers</h3>
          <div className="grid grid-cols-4 gap-3">
            <div className="space-y-1"><Label className="text-[10px]">Sl. No.</Label><Input value={`#${form.slNo ?? "-"}`} disabled className="h-8 text-xs bg-muted" /></div>
            <div className="space-y-1"><Label className="text-[10px]">Case Number *</Label><Input value={form.caseNumber} onChange={e => set("caseNumber", e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-[10px]">Case Year</Label><Input value={form.caseYear || form.filingYear || ""} onChange={e => set("caseYear", e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-[10px]">Filing Year</Label><Input value={form.filingYear} onChange={e => set("filingYear", e.target.value)} className="h-8 text-xs" /></div>
          </div>
        </div>

        {/* Case Details */}
        <div className="govt-card p-5">
          <h3 className="text-xs font-semibold text-foreground mb-3">Case Details</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1 col-span-3"><Label className="text-[10px]">Case Title *</Label><Input value={form.title} onChange={e => set("title", e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-[10px]">Case Type *</Label>
              <Select value={form.caseType} onValueChange={v => set("caseType", v)}><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>{caseTypes.map(ct => <SelectItem key={ct} value={ct}>{ct}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><Label className="text-[10px]">Filing Date *</Label><Input type="date" value={form.filingDate} onChange={e => set("filingDate", e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-[10px]">Court Name *</Label>
              <Select value={form.court} onValueChange={v => set("court", v)}><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>{courtNames.map(cn => <SelectItem key={cn} value={cn}>{cn}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><Label className="text-[10px]">Court Type</Label>
              <Select value={form.courtType} onValueChange={v => set("courtType", v)}><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>{["High Court","District Court","Tribunal","Consumer Forum","Revenue Court","Civil Court"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><Label className="text-[10px]">Mandal *</Label>
              <Select value={form.mandal} onValueChange={v => set("mandal", v)}><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>{mandals.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><Label className="text-[10px]">Department *</Label>
              <Select value={form.department} onValueChange={v => set("department", v)}><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>{departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><Label className="text-[10px]">Priority</Label>
              <Select value={form.priority} onValueChange={v => set("priority", v)}><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>{priorities.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><Label className="text-[10px]">Status</Label>
              <Select value={form.status} onValueChange={v => set("status", v)}><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>{["Fresh","Ongoing","Hearing Scheduled","Counter Pending","Under Review","Appealed","Closed"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><Label className="text-[10px]">Nature of Case</Label>
              <Select value={form.natureOfCase} onValueChange={v => set("natureOfCase", v)}><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>{natureOfCaseOptions.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><Label className="text-[10px]">Collectorate Involvement</Label>
              <Select value={form.collectorateInvolvement} onValueChange={v => set("collectorateInvolvement", v)}><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>{collectorateInvolvementTypes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3 pt-5">
              <Switch id="land-dispute" checked={form.landDisputeFlag} onCheckedChange={v => set("landDisputeFlag", v)} />
              <Label htmlFor="land-dispute" className="text-xs">Land Dispute?</Label>
            </div>
          </div>
        </div>

        <PartyEditor title="Petitioners" parties={petitioners}
          onAdd={() => setPetitioners([...petitioners, { name: "", type: "Individual", department: "", isInternalDept: false, remarks: "" }])}
          onRemove={(i) => setPetitioners(petitioners.filter((_, idx) => idx !== i))}
          onChange={(i, f, v) => updateParty(petitioners, setPetitioners, i, f, v)}
        />
        <PartyEditor title="Respondents (multi-department supported)" parties={respondents} showDepartment
          onAdd={() => setRespondents([...respondents, { name: "", type: "Government", department: "", isInternalDept: true, remarks: "" }])}
          onRemove={(i) => setRespondents(respondents.filter((_, idx) => idx !== i))}
          onChange={(i, f, v) => updateParty(respondents, setRespondents, i, f, v)}
        />
        <PartyEditor title="Co-Respondents" parties={coRespondents} showDepartment allowEmpty
          onAdd={() => setCoRespondents([...coRespondents, { name: "", type: "Government", department: "", isInternalDept: false, remarks: "" }])}
          onRemove={(i) => setCoRespondents(coRespondents.filter((_, idx) => idx !== i))}
          onChange={(i, f, v) => updateParty(coRespondents, setCoRespondents, i, f, v)}
        />

        <div className="govt-card p-5">
          <h3 className="text-xs font-semibold text-foreground mb-3">Advocate & Schedule</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1"><Label className="text-[10px]">Advocate</Label><Input value={form.advocate} onChange={e => set("advocate", e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-[10px]">Advocate Contact</Label><Input value={form.advocateContact} onChange={e => set("advocateContact", e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-[10px]">Assigned Officer</Label><Input value={form.assignedOfficer} onChange={e => set("assignedOfficer", e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-[10px]">Last Hearing</Label><Input type="date" value={form.lastHearing !== "-" ? form.lastHearing : ""} onChange={e => set("lastHearing", e.target.value || "-")} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-[10px]">Next Hearing</Label><Input type="date" value={form.nextHearing !== "-" ? form.nextHearing : ""} onChange={e => set("nextHearing", e.target.value || "-")} className="h-8 text-xs" /></div>
          </div>
        </div>

        {/* Instructions / Counter */}
        <div className="govt-card p-5">
          <h3 className="text-xs font-semibold text-foreground mb-3">Instructions / Counter</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1"><Label className="text-[10px]">Instructions Filed?</Label>
              <Select value={form.instructionsFiled || "Pending"} onValueChange={v => set("instructionsFiled", v)}><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="Yes">Yes</SelectItem><SelectItem value="No">No</SelectItem><SelectItem value="Pending">Pending</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><Label className="text-[10px]">Counter Filed?</Label>
              <Select value={form.counterFiled || "No"} onValueChange={v => set("counterFiled", v)}><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="Yes">Yes</SelectItem><SelectItem value="No">No</SelectItem><SelectItem value="Pending">Pending</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><Label className="text-[10px]">S.R. Number of Counter</Label><Input value={form.srNumber || ""} onChange={e => set("srNumber", e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-[10px]">Counter Filing Due</Label><Input type="date" value={form.counterFilingDueDate} onChange={e => set("counterFilingDueDate", e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1 col-span-2"><Label className="text-[10px]">Approved Counter (file name)</Label>
              <Input value={form.approvedCounterDoc?.name || ""} onChange={e => set("approvedCounterDoc", e.target.value ? { name: e.target.value, uploadedBy: user?.name || "Self", uploadedAt: new Date().toISOString().slice(0,10) } : null)} className="h-8 text-xs" />
            </div>
          </div>
        </div>

        {/* Disposal */}
        <div className="govt-card p-5">
          <h3 className="text-xs font-semibold text-foreground mb-3">Disposal</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1"><Label className="text-[10px]">Disposed?</Label>
              <Select value={form.disposed || "No"} onValueChange={v => set("disposed", v)}><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="No">No</SelectItem><SelectItem value="Yes">Yes</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><Label className="text-[10px]">Disposal Date</Label><Input type="date" value={form.disposalDate || ""} onChange={e => set("disposalDate", e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-[10px]">Judgment (file name)</Label>
              <Input value={form.judgmentDoc?.name || ""} onChange={e => set("judgmentDoc", e.target.value ? { name: e.target.value, uploadedBy: user?.name || "Self", uploadedAt: new Date().toISOString().slice(0,10) } : null)} className="h-8 text-xs" />
            </div>
            <div className="space-y-1 col-span-3"><Label className="text-[10px]">Disposal Summary</Label><Textarea value={form.disposalSummary || ""} onChange={e => set("disposalSummary", e.target.value)} rows={2} className="text-xs" /></div>
          </div>
        </div>

        {/* Subject */}
        <div className="govt-card p-5">
          <h3 className="text-xs font-semibold text-foreground mb-3">Subject & Remarks</h3>
          <div className="space-y-3">
            <div className="space-y-1"><Label className="text-[10px]">Subject</Label><Textarea value={form.subject} onChange={e => set("subject", e.target.value)} rows={2} className="text-xs" /></div>
            <div className="space-y-1"><Label className="text-[10px]">Remarks</Label><Textarea value={form.remarks} onChange={e => set("remarks", e.target.value)} rows={2} className="text-xs" /></div>
          </div>
        </div>

        {/* Close File */}
        <div className="govt-card p-5">
          <h3 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5"><Lock className="h-3.5 w-3.5" />Close File</h3>
          {form.closed ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded p-3 text-xs flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-700" />
              <span>File closed by <strong>{form.closedBy}</strong> on {form.closedAt}.</span>
            </div>
          ) : (
            <>
              <div className={`rounded p-3 text-xs flex items-start gap-2 mb-3 ${closeReady ? "bg-emerald-50 border border-emerald-200" : "bg-amber-50 border border-amber-200"}`}>
                {closeReady ? <CheckCircle2 className="h-4 w-4 text-emerald-700 mt-0.5" /> : <AlertTriangle className="h-4 w-4 text-amber-700 mt-0.5" />}
                <div>
                  <p className="font-semibold mb-1">Closure rules</p>
                  <ul className="list-disc pl-4 space-y-0.5">
                    <li>Disposed must be Yes — currently <strong>{form.disposed || "No"}</strong></li>
                    <li>All directions completed — <strong>{openDirs}</strong> open</li>
                    <li>Authorised role required (Collector / Addl Collector / Legal Officer / Admin)</li>
                  </ul>
                </div>
              </div>
              <Button type="button" variant="destructive" size="sm" disabled={!closeReady} onClick={handleClose}>
                <Lock className="h-3.5 w-3.5 mr-1.5" />Close & Archive File
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit"><Save className="h-3.5 w-3.5 mr-1.5" />Save Changes</Button>
          <Link to={`/cases/${encodeURIComponent(caseData.id)}`}><Button variant="ghost" type="button">Cancel</Button></Link>
        </div>
      </form>
    </AppLayout>
  );
}
