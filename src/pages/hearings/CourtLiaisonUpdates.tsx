import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Search, Save, ChevronRight } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function CourtLiaisonUpdates() {
  const { hearings, cases, updateHearing, updateCase, markDisposed } = useData();
  const { toast } = useToast();
  const scheduledHearings = hearings.filter(h => h.status === "Scheduled");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "tomorrow">("all");
  const [form, setForm] = useState({ listed: "yes", outcome: "", nextDate: "", nextTime: "", orderPassed: false, orderSummary: "", complianceRequired: false, complianceStatus: "Not Applicable", complianceDueDate: "", remarks: "" });

  const today = new Date().toISOString().slice(0, 10);
  const tomorrowStr = (() => { const t = new Date(); t.setDate(t.getDate() + 1); return t.toISOString().slice(0, 10); })();

  const filtered = scheduledHearings.filter(h => {
    if (searchTerm && !h.caseTitle.toLowerCase().includes(searchTerm.toLowerCase()) && !h.court.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (dateFilter === "today" && h.date !== today) return false;
    if (dateFilter === "tomorrow" && h.date !== tomorrowStr) return false;
    return true;
  });
  const selected = filtered.find(h => h.id === selectedId);
  const linkedCase = selected ? cases.find(c => c.id === selected.caseId) : null;

  const handleSave = () => {
    if (!selected || !linkedCase) return;
    updateHearing(selected.id, {
      status: "Completed",
      outcome: form.outcome || (form.listed === "no" ? "Not Listed" : "Adjourned"),
      remarks: form.remarks,
      orderPassed: form.orderPassed,
      orderSummary: form.orderSummary,
      complianceRequired: form.complianceRequired,
      complianceStatus: form.complianceStatus,
      complianceDueDate: form.complianceDueDate,
    });
    const caseUpdates: any = { lastHearing: selected.date, lastUpdated: new Date().toISOString().slice(0, 10) };
    if (form.nextDate) caseUpdates.nextHearing = form.nextDate;
    if (form.orderPassed) { caseUpdates.orderPassed = true; caseUpdates.orderSummary = form.orderSummary; }
    if (form.complianceRequired) { caseUpdates.complianceRequired = true; caseUpdates.complianceStatus = form.complianceStatus; caseUpdates.complianceDueDate = form.complianceDueDate; }
    if (form.outcome === "Disposed" || form.outcome === "Dismissed") caseUpdates.status = "Closed";
    else if (form.outcome) caseUpdates.status = "Ongoing";
    updateCase(linkedCase.id, caseUpdates);
    toast({ title: "Hearing updated", description: `${linkedCase.caseNumber} updated successfully.` });
    setSelectedId(null);
    setForm({ listed: "yes", outcome: "", nextDate: "", nextTime: "", orderPassed: false, orderSummary: "", complianceRequired: false, complianceStatus: "Not Applicable", complianceDueDate: "", remarks: "" });
  };

  const handleSaveAndNext = () => {
    handleSave();
    const idx = filtered.findIndex(h => h.id === selectedId);
    if (idx >= 0 && idx < filtered.length - 1) setSelectedId(filtered[idx + 1].id);
  };

  return (
    <AppLayout>
      <PageHeader title="Court Liaison – Daily Hearing Updates" breadcrumbs={[{ label: "Home", href: "/" }, { label: "Hearings", href: "/hearings" }, { label: "Daily Updates" }]} />
      <div className="grid md:grid-cols-3 gap-6">
        <div className="govt-card">
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input placeholder="Search case..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9 h-8 text-xs" />
            </div>
          </div>
          <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
            {filtered.map(h => (
              <button key={h.id} onClick={() => setSelectedId(h.id)} className={`w-full text-left p-3 hover:bg-muted/50 transition-colors ${selectedId === h.id ? "bg-muted" : ""}`}>
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{h.caseTitle}</p>
                    <p className="text-[10px] text-muted-foreground">{h.court} • {h.date} {h.time}</p>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                </div>
              </button>
            ))}
            {filtered.length === 0 && <div className="p-6 text-center text-xs text-muted-foreground">No scheduled hearings</div>}
          </div>
        </div>

        <div className="md:col-span-2">
          {selected && linkedCase ? (
            <div className="space-y-4">
              <div className="govt-card p-4">
                <div className="grid grid-cols-4 gap-3 text-xs">
                  <div><span className="text-muted-foreground">Case No.</span><p className="font-semibold text-foreground">{linkedCase.caseNumber}</p></div>
                  <div><span className="text-muted-foreground">Court</span><p className="font-medium">{selected.court}</p></div>
                  <div><span className="text-muted-foreground">Type</span><p className="font-medium">{selected.type}</p></div>
                  <div><span className="text-muted-foreground">Status</span><StatusBadge value={linkedCase.status} /></div>
                </div>
              </div>
              <div className="govt-card p-5">
                <h3 className="text-sm font-semibold text-foreground mb-4">Quick Hearing Update</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label className="text-xs">Hearing Listed?</Label>
                    <Select value={form.listed} onValueChange={v => setForm({ ...form, listed: v })}><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="yes">Yes - Listed</SelectItem><SelectItem value="no">No - Not Listed</SelectItem><SelectItem value="adjourned">Adjourned</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2"><Label className="text-xs">Hearing Outcome</Label>
                    <Select value={form.outcome} onValueChange={v => setForm({ ...form, outcome: v })}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select outcome" /></SelectTrigger>
                      <SelectContent>{["Adjourned","Part-Heard","Reserved for Orders","Disposed","Dismissed","Allowed","Directions Issued"].map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2"><Label className="text-xs">Next Hearing Date</Label><Input type="date" value={form.nextDate} onChange={e => setForm({ ...form, nextDate: e.target.value })} className="h-8 text-xs" /></div>
                  <div className="space-y-2"><Label className="text-xs">Next Hearing Time</Label><Input type="time" value={form.nextTime} onChange={e => setForm({ ...form, nextTime: e.target.value })} className="h-8 text-xs" /></div>
                </div>
              </div>
              <div className="govt-card p-5">
                <h3 className="text-sm font-semibold text-foreground mb-4">Order & Compliance</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3"><Switch checked={form.orderPassed} onCheckedChange={v => setForm({ ...form, orderPassed: v })} /><Label className="text-xs">Order Passed?</Label></div>
                  <div className="flex items-center gap-3"><Switch checked={form.complianceRequired} onCheckedChange={v => setForm({ ...form, complianceRequired: v })} /><Label className="text-xs">Compliance Required?</Label></div>
                  {form.orderPassed && <div className="space-y-2 col-span-2"><Label className="text-xs">Order Summary</Label><Textarea value={form.orderSummary} onChange={e => setForm({ ...form, orderSummary: e.target.value })} rows={2} className="text-xs" /></div>}
                  {form.complianceRequired && (
                    <>
                      <div className="space-y-2"><Label className="text-xs">Compliance Status</Label>
                        <Select value={form.complianceStatus} onValueChange={v => setForm({ ...form, complianceStatus: v })}><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent><SelectItem value="Not Applicable">Not Applicable</SelectItem><SelectItem value="Pending">Pending</SelectItem><SelectItem value="Partially Complied">Partially Complied</SelectItem><SelectItem value="Complied">Complied</SelectItem></SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2"><Label className="text-xs">Compliance Due Date</Label><Input type="date" value={form.complianceDueDate} onChange={e => setForm({ ...form, complianceDueDate: e.target.value })} className="h-8 text-xs" /></div>
                    </>
                  )}
                </div>
              </div>
              <div className="govt-card p-5">
                <Label className="text-xs">Remarks</Label>
                <Textarea value={form.remarks} onChange={e => setForm({ ...form, remarks: e.target.value })} placeholder="Add any additional remarks..." rows={2} className="text-xs mt-2" />
              </div>
              <div className="flex gap-3">
                <Button size="sm" onClick={handleSave}><Save className="h-3.5 w-3.5 mr-1.5" />Quick Save</Button>
                <Button variant="outline" size="sm" onClick={handleSaveAndNext}>Save & Next</Button>
              </div>
            </div>
          ) : (
            <div className="govt-card p-12 text-center"><p className="text-sm text-muted-foreground">Select a hearing from the list to update</p></div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
