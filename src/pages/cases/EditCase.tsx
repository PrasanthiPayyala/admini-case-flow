import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, X, ArrowLeft } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { useToast } from "@/hooks/use-toast";
import { caseTypes, mandals, courtNames, departments, priorities, collectorateInvolvementTypes, natureOfCaseOptions } from "@/data/sampleData";

export default function EditCase() {
  const { id } = useParams();
  const { cases, updateCase } = useData();
  const navigate = useNavigate();
  const { toast } = useToast();
  const caseData = cases.find(c => c.id === decodeURIComponent(id || ""));

  const [form, setForm] = useState(caseData ? { ...caseData } : null);

  if (!form || !caseData) return <AppLayout><div className="text-center py-20 text-muted-foreground">Case not found</div></AppLayout>;

  const set = (field: string, value: any) => setForm(prev => prev ? { ...prev, [field]: value } : prev);

  const handleSave = () => {
    updateCase(caseData.id, { ...form, lastUpdated: new Date().toISOString().slice(0, 10) });
    toast({ title: "Case updated", description: `${form.caseNumber} saved successfully.` });
    navigate(`/cases/${encodeURIComponent(caseData.id)}`);
  };

  return (
    <AppLayout>
      <PageHeader
        title={`Edit Case: ${caseData.caseNumber}`}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Cases", href: "/cases" }, { label: "Edit" }]}
        actions={<Link to={`/cases/${encodeURIComponent(caseData.id)}`}><Button variant="outline" size="sm"><ArrowLeft className="h-3.5 w-3.5 mr-1.5" />Back</Button></Link>}
      />
      <form onSubmit={e => { e.preventDefault(); handleSave(); }} className="space-y-5 max-w-4xl">
        <div className="govt-card p-5">
          <h3 className="text-xs font-semibold text-foreground mb-3">Case Details</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1"><Label className="text-[10px]">Case Number *</Label><Input value={form.caseNumber} onChange={e => set("caseNumber", e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1 col-span-2"><Label className="text-[10px]">Case Title *</Label><Input value={form.title} onChange={e => set("title", e.target.value)} className="h-8 text-xs" /></div>
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

        <div className="govt-card p-5">
          <h3 className="text-xs font-semibold text-foreground mb-3">Parties</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1"><Label className="text-[10px]">Petitioner *</Label><Input value={form.petitioner} onChange={e => set("petitioner", e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-[10px]">Respondent *</Label><Input value={form.respondent} onChange={e => set("respondent", e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-[10px]">Advocate</Label><Input value={form.advocate} onChange={e => set("advocate", e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-[10px]">Advocate Contact</Label><Input value={form.advocateContact} onChange={e => set("advocateContact", e.target.value)} className="h-8 text-xs" /></div>
          </div>
        </div>

        <div className="govt-card p-5">
          <h3 className="text-xs font-semibold text-foreground mb-3">Schedule & Assignment</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1"><Label className="text-[10px]">Assigned Officer</Label><Input value={form.assignedOfficer} onChange={e => set("assignedOfficer", e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-[10px]">Last Hearing</Label><Input type="date" value={form.lastHearing !== "-" ? form.lastHearing : ""} onChange={e => set("lastHearing", e.target.value || "-")} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-[10px]">Next Hearing</Label><Input type="date" value={form.nextHearing !== "-" ? form.nextHearing : ""} onChange={e => set("nextHearing", e.target.value || "-")} className="h-8 text-xs" /></div>
          </div>
        </div>

        <div className="govt-card p-5">
          <h3 className="text-xs font-semibold text-foreground mb-3">Subject & Remarks</h3>
          <div className="space-y-3">
            <div className="space-y-1"><Label className="text-[10px]">Subject</Label><Textarea value={form.subject} onChange={e => set("subject", e.target.value)} rows={2} className="text-xs" /></div>
            <div className="space-y-1"><Label className="text-[10px]">Remarks</Label><Textarea value={form.remarks} onChange={e => set("remarks", e.target.value)} rows={2} className="text-xs" /></div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit"><Save className="h-3.5 w-3.5 mr-1.5" />Save Changes</Button>
          <Link to={`/cases/${encodeURIComponent(caseData.id)}`}><Button variant="ghost" type="button">Cancel</Button></Link>
        </div>
      </form>
    </AppLayout>
  );
}
