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
import { hearings, cases } from "@/data/sampleData";
import { useState } from "react";

const todayHearings = hearings.filter(h => h.status === "Scheduled");

export default function CourtLiaisonUpdates() {
  const [selectedHearing, setSelectedHearing] = useState<string | null>(null);
  const selected = todayHearings.find(h => h.id === selectedHearing);
  const linkedCase = selected ? cases.find(c => c.id === selected.caseId) : null;

  return (
    <AppLayout>
      <PageHeader
        title="Court Liaison – Daily Hearing Updates"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Hearings", href: "/hearings" }, { label: "Daily Updates" }]}
      />

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left: Hearing list */}
        <div className="govt-card">
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input placeholder="Search case number..." className="pl-9 h-8 text-xs" />
            </div>
          </div>
          <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
            {todayHearings.map(h => (
              <button
                key={h.id}
                onClick={() => setSelectedHearing(h.id)}
                className={`w-full text-left p-3 hover:bg-muted/50 transition-colors ${selectedHearing === h.id ? "bg-muted" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{h.caseTitle}</p>
                    <p className="text-[10px] text-muted-foreground">{h.court} • {h.date} {h.time}</p>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                </div>
              </button>
            ))}
            {todayHearings.length === 0 && (
              <div className="p-6 text-center text-xs text-muted-foreground">No scheduled hearings</div>
            )}
          </div>
        </div>

        {/* Right: Quick update form */}
        <div className="md:col-span-2">
          {selected && linkedCase ? (
            <div className="space-y-4">
              {/* Case summary strip */}
              <div className="govt-card p-4">
                <div className="grid grid-cols-4 gap-3 text-xs">
                  <div><span className="text-muted-foreground">Case No.</span><p className="font-semibold text-foreground">{linkedCase.caseNumber}</p></div>
                  <div><span className="text-muted-foreground">Court</span><p className="font-medium">{selected.court}</p></div>
                  <div><span className="text-muted-foreground">Type</span><p className="font-medium">{selected.type}</p></div>
                  <div><span className="text-muted-foreground">Status</span><StatusBadge value={linkedCase.status} /></div>
                </div>
              </div>

              {/* Quick Update Form */}
              <div className="govt-card p-5">
                <h3 className="text-sm font-semibold text-foreground mb-4">Quick Hearing Update</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Hearing Listed?</Label>
                    <Select defaultValue="yes">
                      <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes - Listed</SelectItem>
                        <SelectItem value="no">No - Not Listed</SelectItem>
                        <SelectItem value="adjourned">Adjourned</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Hearing Outcome</Label>
                    <Select>
                      <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select outcome" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="adjourned">Adjourned</SelectItem>
                        <SelectItem value="part-heard">Part-Heard</SelectItem>
                        <SelectItem value="reserved">Reserved for Orders</SelectItem>
                        <SelectItem value="disposed">Disposed</SelectItem>
                        <SelectItem value="dismissed">Dismissed</SelectItem>
                        <SelectItem value="allowed">Allowed</SelectItem>
                        <SelectItem value="directions">Directions Issued</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Next Hearing Date</Label>
                    <Input type="date" className="h-8 text-xs" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Next Hearing Time</Label>
                    <Input type="time" className="h-8 text-xs" />
                  </div>
                </div>
              </div>

              {/* Order & Compliance */}
              <div className="govt-card p-5">
                <h3 className="text-sm font-semibold text-foreground mb-4">Order & Compliance</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Switch id="order-passed" />
                    <Label htmlFor="order-passed" className="text-xs">Order Passed?</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch id="compliance-req" />
                    <Label htmlFor="compliance-req" className="text-xs">Compliance Required?</Label>
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label className="text-xs">Order Summary</Label>
                    <Textarea placeholder="Brief summary of order passed..." rows={2} className="text-xs" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Compliance Status</Label>
                    <Select>
                      <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="na">Not Applicable</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="partial">Partially Complied</SelectItem>
                        <SelectItem value="complied">Complied</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Compliance Due Date</Label>
                    <Input type="date" className="h-8 text-xs" />
                  </div>
                </div>
              </div>

              {/* Remarks */}
              <div className="govt-card p-5">
                <Label className="text-xs">Remarks</Label>
                <Textarea placeholder="Add any additional remarks..." rows={2} className="text-xs mt-2" />
              </div>

              <div className="flex gap-3">
                <Button size="sm"><Save className="h-3.5 w-3.5 mr-1.5" />Quick Save</Button>
                <Button variant="outline" size="sm">Save & Next</Button>
              </div>
            </div>
          ) : (
            <div className="govt-card p-12 text-center">
              <p className="text-sm text-muted-foreground">Select a hearing from the list to update</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
