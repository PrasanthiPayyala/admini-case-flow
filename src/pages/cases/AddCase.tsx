import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, X, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { caseTypes, mandals, courtNames, departments, priorities, collectorateInvolvementTypes, natureOfCaseOptions } from "@/data/sampleData";

export default function AddCase() {
  const [coRespondents, setCoRespondents] = useState<string[]>([""]);
  const addCR = () => setCoRespondents([...coRespondents, ""]);
  const removeCR = (i: number) => setCoRespondents(coRespondents.filter((_, idx) => idx !== i));
  const updateCR = (i: number, v: string) => { const u = [...coRespondents]; u[i] = v; setCoRespondents(u); };

  return (
    <AppLayout>
      <PageHeader
        title="Register New Case"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Cases", href: "/cases" }, { label: "New Case" }]}
        actions={<Link to="/cases"><Button variant="outline" size="sm"><X className="h-3.5 w-3.5 mr-1.5" />Cancel</Button></Link>}
      />
      <form onSubmit={e => e.preventDefault()} className="space-y-5 max-w-4xl">
        {/* Case Details */}
        <div className="govt-card p-5">
          <h3 className="text-xs font-semibold text-foreground mb-3">Case Details</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1"><Label className="text-[10px]">Case Number (No./Year) *</Label><Input placeholder="e.g. WP(C) 14523/2024" className="h-8 text-xs" /></div>
            <div className="space-y-1 col-span-2"><Label className="text-[10px]">Case Title *</Label><Input placeholder="Brief title" className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-[10px]">Case Type *</Label>
              <Select><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{caseTypes.map(ct => <SelectItem key={ct} value={ct.toLowerCase().replace(/\s/g,'-')}>{ct}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><Label className="text-[10px]">Filing Date *</Label><Input type="date" className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-[10px]">Filing Year</Label><Input placeholder="e.g. 2024" className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-[10px]">Court Name *</Label>
              <Select><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{courtNames.map(cn => <SelectItem key={cn} value={cn.toLowerCase().replace(/[\s,]/g,'-')}>{cn}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><Label className="text-[10px]">Court Type *</Label>
              <Select><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {["High Court","District Court","Tribunal","Consumer Forum","Revenue Court","Civil Court"].map(c => <SelectItem key={c} value={c.toLowerCase().replace(/\s/g,'-')}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><Label className="text-[10px]">Mandal *</Label>
              <Select><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{mandals.map(m => <SelectItem key={m} value={m.toLowerCase()}>{m}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><Label className="text-[10px]">Department *</Label>
              <Select><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{departments.map(d => <SelectItem key={d} value={d.toLowerCase().replace(/\s/g,'-')}>{d}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><Label className="text-[10px]">Priority</Label>
              <Select><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{priorities.map(p => <SelectItem key={p} value={p.toLowerCase().replace(/\s/g,'-')}>{p}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><Label className="text-[10px]">Nature of Case</Label>
              <Select><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{natureOfCaseOptions.map(n => <SelectItem key={n} value={n.toLowerCase().replace(/\s/g,'-')}>{n}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><Label className="text-[10px]">Collectorate Involvement</Label>
              <Select><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{collectorateInvolvementTypes.map(c => <SelectItem key={c} value={c.toLowerCase().replace(/\s/g,'-')}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3 pt-5">
              <Switch id="land-dispute" /><Label htmlFor="land-dispute" className="text-xs">Land Dispute?</Label>
            </div>
          </div>
        </div>

        {/* Parties */}
        <div className="govt-card p-5">
          <h3 className="text-xs font-semibold text-foreground mb-3">Parties</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1"><Label className="text-[10px]">Petitioner *</Label><Input placeholder="Full name" className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-[10px]">Respondent *</Label><Input placeholder="Full name" className="h-8 text-xs" /></div>
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
            <div className="space-y-1"><Label className="text-[10px]">Advocate Name</Label><Input placeholder="Advocate" className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-[10px]">Advocate Contact</Label><Input placeholder="Phone" className="h-8 text-xs" /></div>
          </div>
        </div>

        {/* Assignment */}
        <div className="govt-card p-5">
          <h3 className="text-xs font-semibold text-foreground mb-3">Assignment & Schedule</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1"><Label className="text-[10px]">Assigned Officer *</Label>
              <Select><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="dlo">District Legal Officer</SelectItem>
                  <SelectItem value="sro">Senior Reviewing Officer</SelectItem>
                  <SelectItem value="so-land">Section Officer – Land Matters</SelectItem>
                  <SelectItem value="hcr">High Court Representative Officer</SelectItem>
                  <SelectItem value="ro">Revenue Officer – Collectorate</SelectItem>
                  <SelectItem value="mno-b">Mandal Nodal Officer – Bhongir</SelectItem>
                  <SelectItem value="mno-c">Mandal Nodal Officer – Choutuppal</SelectItem>
                  <SelectItem value="dno-r">Department Nodal Officer – Revenue</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><Label className="text-[10px]">Last Hearing Date</Label><Input type="date" className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-[10px]">Next Hearing Date</Label><Input type="date" className="h-8 text-xs" /></div>
          </div>
        </div>

        {/* Subject */}
        <div className="govt-card p-5">
          <h3 className="text-xs font-semibold text-foreground mb-3">Subject & Remarks</h3>
          <div className="space-y-3">
            <div className="space-y-1"><Label className="text-[10px]">Subject Summary *</Label><Textarea placeholder="Brief description..." rows={2} className="text-xs" /></div>
            <div className="space-y-1"><Label className="text-[10px]">Remarks</Label><Textarea placeholder="Additional notes..." rows={2} className="text-xs" /></div>
            <div className="space-y-1"><Label className="text-[10px]">Tags / Labels</Label><Input placeholder="Comma-separated tags" className="h-8 text-xs" /></div>
          </div>
        </div>

        {/* Attachments */}
        <div className="govt-card p-5">
          <h3 className="text-xs font-semibold text-foreground mb-3">Attachments</h3>
          <div className="border-2 border-dashed border-border rounded-md p-6 text-center">
            <p className="text-xs text-muted-foreground">Drag and drop files here or click to browse</p>
            <p className="text-[10px] text-muted-foreground mt-1">PDF, DOCX, JPG up to 10MB each</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit"><Save className="h-3.5 w-3.5 mr-1.5" />Register Case</Button>
          <Button variant="outline">Save as Draft</Button>
          <Link to="/cases"><Button variant="ghost">Cancel</Button></Link>
        </div>
      </form>
    </AppLayout>
  );
}
