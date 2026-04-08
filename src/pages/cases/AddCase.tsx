import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, X, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { caseTypes, mandals, courtNames } from "@/data/sampleData";

export default function AddCase() {
  const [coRespondents, setCoRespondents] = useState<string[]>([""]);

  const addCoRespondent = () => setCoRespondents([...coRespondents, ""]);
  const removeCoRespondent = (index: number) => setCoRespondents(coRespondents.filter((_, i) => i !== index));
  const updateCoRespondent = (index: number, value: string) => {
    const updated = [...coRespondents];
    updated[index] = value;
    setCoRespondents(updated);
  };

  return (
    <AppLayout>
      <PageHeader
        title="Register New Case"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Cases", href: "/cases" }, { label: "New Case" }]}
        actions={
          <Link to="/cases"><Button variant="outline" size="sm"><X className="h-3.5 w-3.5 mr-1.5" />Cancel</Button></Link>
        }
      />

      <form onSubmit={e => e.preventDefault()} className="space-y-6 max-w-4xl">
        {/* Case Details */}
        <div className="govt-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Case Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs">Case Number *</Label>
              <Input placeholder="e.g. WP(C) 14523/2024" className="h-9 text-sm" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Case Title *</Label>
              <Input placeholder="Brief title of the case" className="h-9 text-sm" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Case Type *</Label>
              <Select>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select case type" /></SelectTrigger>
                <SelectContent>
                  {caseTypes.map(ct => (
                    <SelectItem key={ct} value={ct.toLowerCase().replace(/\s/g, '-')}>{ct}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Filing Date *</Label>
              <Input type="date" className="h-9 text-sm" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Court Name *</Label>
              <Select>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select court" /></SelectTrigger>
                <SelectContent>
                  {courtNames.map(cn => (
                    <SelectItem key={cn} value={cn.toLowerCase().replace(/[\s,]/g, '-')}>{cn}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Court Type *</Label>
              <Select>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select court type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="hc">High Court</SelectItem>
                  <SelectItem value="dc">District Court</SelectItem>
                  <SelectItem value="tribunal">Tribunal</SelectItem>
                  <SelectItem value="consumer">Consumer Forum</SelectItem>
                  <SelectItem value="revenue">Revenue Court</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Mandal *</Label>
              <Select>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select mandal" /></SelectTrigger>
                <SelectContent>
                  {mandals.map(m => (
                    <SelectItem key={m} value={m.toLowerCase()}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Department / Section *</Label>
              <Select>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select department" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">Revenue</SelectItem>
                  <SelectItem value="admin">Administration</SelectItem>
                  <SelectItem value="municipal">Municipal</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Priority</Label>
              <Select>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select priority" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Parties */}
        <div className="govt-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Parties</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs">Petitioner Name *</Label>
              <Input placeholder="Full name of petitioner" className="h-9 text-sm" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Respondent Name *</Label>
              <Input placeholder="Full name of respondent" className="h-9 text-sm" />
            </div>
          </div>

          {/* Co-Respondents */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs">Co-Respondent(s)</Label>
              <Button type="button" variant="outline" size="sm" className="h-7 text-xs" onClick={addCoRespondent}>
                <Plus className="h-3 w-3 mr-1" />Add Co-Respondent
              </Button>
            </div>
            <div className="space-y-2">
              {coRespondents.map((cr, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    placeholder={`Co-Respondent ${i + 1}`}
                    className="h-9 text-sm"
                    value={cr}
                    onChange={e => updateCoRespondent(i, e.target.value)}
                  />
                  {coRespondents.length > 1 && (
                    <Button type="button" variant="ghost" size="sm" className="h-9 px-2" onClick={() => removeCoRespondent(i)}>
                      <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <Label className="text-xs">Advocate Name</Label>
              <Input placeholder="Advocate handling the case" className="h-9 text-sm" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Advocate Contact</Label>
              <Input placeholder="Phone number" className="h-9 text-sm" />
            </div>
          </div>
        </div>

        {/* Assignment */}
        <div className="govt-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Assignment & Schedule</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs">Assigned Officer *</Label>
              <Select>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select officer" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="srinivas">K. Srinivas Rao</SelectItem>
                  <SelectItem value="padma">S. Padma Kumari</SelectItem>
                  <SelectItem value="rajender">D. Rajender</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Next Hearing Date</Label>
              <Input type="date" className="h-9 text-sm" />
            </div>
          </div>
        </div>

        {/* Subject */}
        <div className="govt-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Subject & Remarks</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs">Subject Summary *</Label>
              <Textarea placeholder="Brief description of the case subject matter..." rows={3} className="text-sm" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Remarks</Label>
              <Textarea placeholder="Additional notes or observations..." rows={2} className="text-sm" />
            </div>
          </div>
        </div>

        {/* Attachments */}
        <div className="govt-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Attachments</h3>
          <div className="border-2 border-dashed border-border rounded-md p-8 text-center">
            <p className="text-sm text-muted-foreground">Drag and drop files here or click to browse</p>
            <p className="text-xs text-muted-foreground mt-1">PDF, DOCX, JPG up to 10MB each</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button type="submit"><Save className="h-3.5 w-3.5 mr-1.5" />Register Case</Button>
          <Button variant="outline">Save as Draft</Button>
          <Link to="/cases"><Button variant="ghost">Cancel</Button></Link>
        </div>
      </form>
    </AppLayout>
  );
}
