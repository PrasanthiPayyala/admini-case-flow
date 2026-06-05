import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Search, Save, ChevronRight, AlertTriangle, Flag, Clock, FileUp, ChevronDown,
  Calendar as CalIcon, Gavel,
} from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";

type TabKey = "today" | "tomorrow" | "pending" | "important" | "all";

const OUTCOMES = [
  "Listed", "Adjourned", "Heard", "Counter Directed", "Notice Issued",
  "Order Reserved", "Order Passed", "Disposed", "Dismissed",
  "Compliance Directed", "Posted for Next Hearing",
];

const todayStr = () => new Date().toISOString().slice(0, 10);
const tomorrowStr = () => { const t = new Date(); t.setDate(t.getDate() + 1); return t.toISOString().slice(0, 10); };

export default function DailyHearingDesk() {
  const { hearings, cases, updateHearing, updateCase, markDisposed } = useData();
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const [tab, setTab] = useState<TabKey>("today");
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState<"today" | "tomorrow" | "custom" | "all">("all");
  const [customDate, setCustomDate] = useState("");
  const [courtType, setCourtType] = useState("all");
  const [caseType, setCaseType] = useState("all");
  const [priority, setPriority] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [importantFlags, setImportantFlags] = useState<Record<string, boolean>>({});
  const [legalCellFlags, setLegalCellFlags] = useState<Record<string, boolean>>({});
  const [recentUpdates, setRecentUpdates] = useState<Array<{ ts: string; caseNo: string; outcome: string; nextDate: string }>>([]);

  const today = todayStr();
  const tomorrow = tomorrowStr();

  const enriched = useMemo(() => hearings.map(h => {
    const c = cases.find(x => x.id === h.caseId);
    const isContempt = c?.caseType === "Contempt Case" || c?.caseType?.toLowerCase?.().includes("contempt");
    const isCollectorate = c?.collectorateInvolvement === "Collectorate as Respondent";
    const isOverdue = h.status === "Scheduled" && h.date < today;
    const orderPending = h.orderPassed && (!h.orderSummary || h.orderSummary.trim() === "");
    const important =
      importantFlags[h.id] ||
      isContempt ||
      h.date === today || h.date === tomorrow ||
      h.orderPassed === true ||
      h.complianceRequired === true ||
      isCollectorate;
    const pendingUpdate =
      isOverdue ||
      orderPending ||
      legalCellFlags[h.id];
    return { h, c, important, pendingUpdate, isOverdue, isContempt };
  }), [hearings, cases, today, tomorrow, importantFlags, legalCellFlags]);

  const courtTypes = useMemo(() => Array.from(new Set(hearings.map(h => h.court))).filter(Boolean), [hearings]);
  const caseTypes = useMemo(() => Array.from(new Set(cases.map(c => c.caseType))).filter(Boolean), [cases]);

  const filtered = enriched.filter(({ h, c, important, pendingUpdate }) => {
    if (tab === "today" && h.date !== today) return false;
    if (tab === "tomorrow" && h.date !== tomorrow) return false;
    if (tab === "pending" && !pendingUpdate) return false;
    if (tab === "important" && !important) return false;

    if (dateFilter === "today" && h.date !== today) return false;
    if (dateFilter === "tomorrow" && h.date !== tomorrow) return false;
    if (dateFilter === "custom" && customDate && h.date !== customDate) return false;

    if (courtType !== "all" && h.court !== courtType) return false;
    if (caseType !== "all" && c?.caseType !== caseType) return false;
    if (priority !== "all" && (c?.priority || "Medium") !== priority) return false;

    if (search) {
      const s = search.toLowerCase();
      const hay = `${h.caseTitle} ${c?.caseNumber || ""} ${c?.petitioner || ""} ${c?.respondent || ""}`.toLowerCase();
      if (!hay.includes(s)) return false;
    }
    return true;
  }).sort((a, b) => Number(b.important) - Number(a.important));

  // Top summary cards
  const hearingsToday = enriched.filter(e => e.h.date === today).length;
  const hearingsTomorrow = enriched.filter(e => e.h.date === tomorrow).length;
  const pendingUpdatesCount = enriched.filter(e => e.pendingUpdate).length;
  const ordersPassedToday = enriched.filter(e => e.h.date === today && e.h.orderPassed).length;
  const importantCount = enriched.filter(e => e.important).length;

  const cards = [
    { key: "today", label: "Hearings Today", value: hearingsToday, tab: "today" as TabKey, tone: "text-blue-700" },
    { key: "tomorrow", label: "Hearings Tomorrow", value: hearingsTomorrow, tab: "tomorrow" as TabKey, tone: "text-orange-700" },
    { key: "pending", label: "Pending Updates", value: pendingUpdatesCount, tab: "pending" as TabKey, tone: "text-red-700" },
    { key: "orders", label: "Orders Passed Today", value: ordersPassedToday, tab: "today" as TabKey, tone: "text-purple-700" },
    { key: "important", label: "Important Matters", value: importantCount, tab: "important" as TabKey, tone: "text-red-700" },
  ];

  const selected = filtered.find(f => f.h.id === selectedId) || enriched.find(f => f.h.id === selectedId);
  const selH = selected?.h;
  const selC = selected?.c;

  const [form, setForm] = useState({
    hearingDate: "", outcome: "", nextDate: "", nextTime: "",
    orderPassed: false, complianceRequired: false, orderSummary: "", remarks: "",
    markImportant: false, markForLegalCell: false,
  });

  // Reset form whenever selection changes
  useMemo(() => {
    if (selH) {
      setForm({
        hearingDate: selH.date || today,
        outcome: "", nextDate: "", nextTime: "",
        orderPassed: !!selH.orderPassed, complianceRequired: !!selH.complianceRequired,
        orderSummary: selH.orderSummary || "", remarks: "",
        markImportant: !!importantFlags[selH.id],
        markForLegalCell: !!legalCellFlags[selH.id],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  const handleSave = (advance = false) => {
    if (!selH || !selC) return;
    updateHearing(selH.id, {
      status: "Completed",
      date: form.hearingDate || selH.date,
      outcome: form.outcome || selH.outcome || "Updated",
      remarks: form.remarks,
      orderPassed: form.orderPassed,
      orderSummary: form.orderSummary,
      complianceRequired: form.complianceRequired,
    });
    const caseUpdates: any = { lastHearing: form.hearingDate || selH.date, lastUpdated: today };
    if (form.nextDate) caseUpdates.nextHearing = form.nextDate;
    if (form.outcome === "Disposed" || form.outcome === "Dismissed") {
      caseUpdates.status = "Closed";
      markDisposed(selC.id, {
        disposalDate: form.hearingDate || selH.date,
        disposalSummary: form.orderSummary || form.remarks || `${form.outcome} at ${selH.court}`,
      }, currentUser?.name || "HC Liaison Officer", currentUser?.role || "High Court Representative Officer");
    } else if (form.outcome) {
      caseUpdates.status = "Ongoing";
    }
    updateCase(selC.id, caseUpdates);
    setImportantFlags(prev => ({ ...prev, [selH.id]: form.markImportant }));
    setLegalCellFlags(prev => ({ ...prev, [selH.id]: form.markForLegalCell }));
    setRecentUpdates(prev => [{
      ts: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      caseNo: selC.caseNumber, outcome: form.outcome || "Updated", nextDate: form.nextDate || "—",
    }, ...prev].slice(0, 8));
    toast({ title: "Hearing updated", description: `${selC.caseNumber} — ${form.outcome || "saved"}` });

    if (advance) {
      const idx = filtered.findIndex(f => f.h.id === selH.id);
      const next = filtered[idx + 1];
      setSelectedId(next ? next.h.id : null);
    } else {
      setSelectedId(null);
    }
  };

  const handleMarkPending = () => {
    if (!selH) return;
    setLegalCellFlags(prev => ({ ...prev, [selH.id]: true }));
    toast({ title: "Marked Pending", description: "Will appear under Pending Updates." });
  };

  const handleFlagImportant = () => {
    if (!selH) return;
    setImportantFlags(prev => ({ ...prev, [selH.id]: true }));
    toast({ title: "Flagged Important" });
  };

  const rowTone = (e: typeof enriched[0]) => {
    if (e.isOverdue || e.isContempt || e.h.orderPassed) return "border-l-4 border-l-destructive";
    if (e.h.date === today || e.h.date === tomorrow) return "border-l-4 border-l-orange-400";
    return "border-l-4 border-l-transparent";
  };

  return (
    <AppLayout>
      <PageHeader
        title="Court Liaison – Daily Hearing Desk"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Hearings", href: "/hearings" }, { label: "Daily Hearing Desk" }]}
      />
      <p className="text-xs text-muted-foreground -mt-3 mb-4">Quick daily update screen for High Court hearing outcomes and next actions</p>

      {/* Filters */}
      <div className="govt-card p-3 mb-4 flex flex-wrap gap-2 items-end">
        <div className="flex-1 min-w-[180px]">
          <Label className="text-[10px] text-muted-foreground">Search</Label>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Case No. / Petitioner / Respondent" className="pl-7 h-8 text-xs" />
          </div>
        </div>
        <div>
          <Label className="text-[10px] text-muted-foreground">Date</Label>
          <Select value={dateFilter} onValueChange={(v: any) => setDateFilter(v)}>
            <SelectTrigger className="h-8 text-xs w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Dates</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="tomorrow">Tomorrow</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {dateFilter === "custom" && (
          <Input type="date" value={customDate} onChange={e => setCustomDate(e.target.value)} className="h-8 text-xs w-36" />
        )}
        <div>
          <Label className="text-[10px] text-muted-foreground">Court Type</Label>
          <Select value={courtType} onValueChange={setCourtType}>
            <SelectTrigger className="h-8 text-xs w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courts</SelectItem>
              {courtTypes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-[10px] text-muted-foreground">Case Type</Label>
          <Select value={caseType} onValueChange={setCaseType}>
            <SelectTrigger className="h-8 text-xs w-36"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {caseTypes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-[10px] text-muted-foreground">Priority</Label>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger className="h-8 text-xs w-28"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
        {cards.map(c => (
          <button
            key={c.key}
            onClick={() => setTab(c.tab)}
            className={`govt-card p-3 text-left hover:shadow-md transition-all ${tab === c.tab ? "ring-2 ring-primary" : ""}`}
          >
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">{c.label}</p>
            <p className={`text-2xl font-bold mt-1 ${c.tone}`}>{c.value}</p>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* LEFT: Queue */}
        <div className="lg:col-span-2 govt-card">
          <div className="p-2 border-b border-border flex gap-1 flex-wrap">
            {([
              ["today", "Today"], ["tomorrow", "Tomorrow"],
              ["pending", "Pending Update"], ["important", "Important"], ["all", "All"],
            ] as [TabKey, string][]).map(([k, label]) => (
              <button
                key={k}
                onClick={() => setTab(k)}
                className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors ${
                  tab === k ? "bg-primary text-primary-foreground border-primary" : "bg-muted/40 text-muted-foreground border-border hover:bg-muted"
                }`}
              >{label}</button>
            ))}
          </div>
          <div className="divide-y divide-border max-h-[640px] overflow-y-auto">
            {filtered.map(e => {
              const c = e.c;
              return (
                <button
                  key={e.h.id}
                  onClick={() => setSelectedId(e.h.id)}
                  className={`w-full text-left p-3 hover:bg-muted/40 transition-colors ${selectedId === e.h.id ? "bg-muted/60" : ""} ${rowTone(e)}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-foreground">{c?.caseNumber || e.h.caseTitle}</span>
                        <span className="text-[10px] text-muted-foreground">/ {c?.filingYear || ""}</span>
                        {e.isContempt && <span className="text-[9px] px-1.5 py-0.5 rounded bg-destructive/10 text-destructive font-semibold">CONTEMPT</span>}
                        {importantFlags[e.h.id] && <Flag className="h-3 w-3 text-destructive" />}
                        {e.isOverdue && <AlertTriangle className="h-3 w-3 text-destructive" />}
                      </div>
                      <p className="text-[11px] text-foreground truncate">{c?.petitioner || "—"} <span className="text-muted-foreground">vs</span> {c?.respondent || "—"}</p>
                      <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground">
                        <span>{c?.caseType || "—"}</span>
                        <span>•</span>
                        <span>{c?.department || "—"}</span>
                        <span>•</span>
                        <span>{e.h.court}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] font-medium text-foreground">{e.h.date} {e.h.time}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${
                          (c?.priority || "Medium") === "High" ? "bg-destructive/10 text-destructive" :
                          (c?.priority || "Medium") === "Low" ? "bg-muted text-muted-foreground" :
                          "bg-orange-100 text-orange-700"
                        }`}>{c?.priority || "Medium"}</span>
                        {c && <StatusBadge value={c.status} />}
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="text-[10px] h-7" onClick={(ev) => { ev.stopPropagation(); setSelectedId(e.h.id); }}>
                      Quick Update <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <div className="p-10 text-center text-xs text-muted-foreground">No hearings in this view</div>
            )}
          </div>
        </div>

        {/* RIGHT: Quick Update Panel */}
        <div className="space-y-4">
          {selH && selC ? (
            <div className="govt-card p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-2 mb-1">
                <div>
                  <p className="text-xs font-semibold text-foreground">{selC.caseNumber}</p>
                  <p className="text-[10px] text-muted-foreground">{selC.petitioner} vs {selC.respondent}</p>
                </div>
                <Gavel className="h-4 w-4 text-muted-foreground" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-[10px]">Hearing Date</Label>
                  <Input type="date" value={form.hearingDate} onChange={e => setForm({ ...form, hearingDate: e.target.value })} className="h-8 text-xs" />
                </div>
                <div>
                  <Label className="text-[10px]">Hearing Time</Label>
                  <Input type="time" value={form.nextTime} onChange={e => setForm({ ...form, nextTime: e.target.value })} className="h-8 text-xs" />
                </div>
                <div className="col-span-2">
                  <Label className="text-[10px]">Hearing Outcome</Label>
                  <Select value={form.outcome} onValueChange={v => setForm({ ...form, outcome: v })}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select outcome" /></SelectTrigger>
                    <SelectContent>
                      {OUTCOMES.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label className="text-[10px]">Next Hearing Date</Label>
                  <Input type="date" value={form.nextDate} onChange={e => setForm({ ...form, nextDate: e.target.value })} className="h-8 text-xs" />
                </div>

                <div className="flex items-center gap-2"><Switch checked={form.orderPassed} onCheckedChange={v => setForm({ ...form, orderPassed: v })} /><Label className="text-[10px]">Order Passed?</Label></div>
                <div className="flex items-center gap-2"><Switch checked={form.complianceRequired} onCheckedChange={v => setForm({ ...form, complianceRequired: v })} /><Label className="text-[10px]">Compliance Required?</Label></div>

                {form.orderPassed && (
                  <div className="col-span-2">
                    <Label className="text-[10px]">Short Order Summary (optional)</Label>
                    <Textarea rows={2} value={form.orderSummary} onChange={e => setForm({ ...form, orderSummary: e.target.value })} className="text-xs" />
                  </div>
                )}

                <div className="col-span-2">
                  <Label className="text-[10px]">Short Remarks</Label>
                  <Textarea rows={2} value={form.remarks} onChange={e => setForm({ ...form, remarks: e.target.value })} className="text-xs" />
                </div>

                <div className="flex items-center gap-2"><Switch checked={form.markImportant} onCheckedChange={v => setForm({ ...form, markImportant: v })} /><Label className="text-[10px]">Mark Important</Label></div>
                <div className="flex items-center gap-2"><Switch checked={form.markForLegalCell} onCheckedChange={v => setForm({ ...form, markForLegalCell: v })} /><Label className="text-[10px]">Legal Cell Attention</Label></div>
              </div>

              <Collapsible>
                <CollapsibleTrigger className="flex items-center gap-2 text-[10px] text-muted-foreground hover:text-foreground">
                  <FileUp className="h-3 w-3" /> Important Order Upload (Optional) <ChevronDown className="h-3 w-3" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-2 space-y-2">
                  <Input type="file" className="h-8 text-xs" />
                  <p className="text-[10px] text-muted-foreground italic">
                    Upload only if interim/final/urgent order copy is immediately available. Otherwise mark
                    "Document to be uploaded later by Legal Cell / DLO".
                  </p>
                </CollapsibleContent>
              </Collapsible>

              <div className="flex flex-wrap gap-2 pt-1">
                <Button size="sm" onClick={() => handleSave(false)}><Save className="h-3 w-3 mr-1" />Save</Button>
                <Button size="sm" variant="default" onClick={() => handleSave(true)}>Save & Next</Button>
                <Button size="sm" variant="outline" onClick={handleMarkPending}><Clock className="h-3 w-3 mr-1" />Mark Pending</Button>
                <Button size="sm" variant="outline" onClick={handleFlagImportant}><Flag className="h-3 w-3 mr-1" />Flag Important</Button>
              </div>
            </div>
          ) : (
            <div className="govt-card p-8 text-center text-xs text-muted-foreground">
              <CalIcon className="h-6 w-6 mx-auto mb-2 opacity-50" />
              Select a hearing from the queue to update
            </div>
          )}

          {/* Recent updates */}
          <div className="govt-card p-3">
            <p className="text-[11px] font-semibold text-foreground mb-2">Recent Updates by Liaison Officer</p>
            {recentUpdates.length === 0 ? (
              <p className="text-[10px] text-muted-foreground italic">No updates yet in this session.</p>
            ) : (
              <ul className="space-y-1.5">
                {recentUpdates.map((r, i) => (
                  <li key={i} className="text-[10px] flex items-center justify-between border-b border-border/50 pb-1 last:border-0">
                    <span className="text-muted-foreground">{r.ts}</span>
                    <span className="font-medium text-foreground truncate mx-2">{r.caseNo}</span>
                    <span className="text-muted-foreground">{r.outcome}</span>
                    <span className="text-muted-foreground ml-2">→ {r.nextDate}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
