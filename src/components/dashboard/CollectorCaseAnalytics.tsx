import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, Scale, CheckCircle2, AlertTriangle, FileText, Clock, CalendarDays, ArrowRight } from "lucide-react";
import type { CaseRecord } from "@/data/sampleData";
import type { HearingRecord } from "@/contexts/DataContext";

interface Props {
  cases: CaseRecord[];
  hearings: HearingRecord[];
  dateFrom?: string;
  dateTo?: string;
}

const ALL = "All";

// Compliance logic: a disposed case is Non-Complied if it required compliance
// AND its compliance status is anything other than "Complied" (i.e. any direction
// or compliance item is still pending). Cases that did not require compliance
// are treated as Complied.
function isNonComplied(c: CaseRecord) {
  return !!c.complianceRequired && c.complianceStatus !== "Complied";
}

export function CollectorCaseAnalytics({ cases, hearings, dateFrom, dateTo }: Props) {
  const courtTypes = useMemo(
    () => Array.from(new Set(cases.map(c => c.courtType).filter(Boolean))).sort(),
    [cases]
  );
  const caseTypesOptions = useMemo(
    () => Array.from(new Set(cases.map(c => c.caseType).filter(Boolean))).sort(),
    [cases]
  );

  const [courtType, setCourtType] = useState<string>(ALL);
  const [caseType, setCaseType] = useState<string>(ALL);

  const filtered = useMemo(
    () =>
      cases.filter(
        c =>
          (courtType === ALL || c.courtType === courtType) &&
          (caseType === ALL || c.caseType === caseType)
      ),
    [cases, courtType, caseType]
  );

  // Group by court type for rendering
  const groupedByCourt = useMemo(() => {
    const map: Record<string, CaseRecord[]> = {};
    filtered.forEach(c => {
      const k = c.courtType || "Unspecified";
      (map[k] = map[k] || []).push(c);
    });
    return Object.entries(map).sort((a, b) => b[1].length - a[1].length);
  }, [filtered]);

  // Upcoming hearing date per case
  const todayStr = new Date().toISOString().split("T")[0];
  const nextHearingByCase = useMemo(() => {
    const m: Record<string, string> = {};
    hearings
      .filter(h => h.status === "Scheduled" && h.date >= todayStr)
      .sort((a, b) => a.date.localeCompare(b.date))
      .forEach(h => {
        if (!m[h.caseId]) m[h.caseId] = h.date;
      });
    return m;
  }, [hearings, todayStr]);

  const disposedList = filtered.filter(c => c.disposed === "Yes" || c.status === "Closed");
  const pendingCounterList = filtered.filter(c => c.status !== "Closed" && c.counterFiled !== "Yes");

  // Build query string carrying current filters
  const baseParams = () => {
    const p = new URLSearchParams();
    if (courtType !== ALL) p.set("courtType", courtType);
    if (caseType !== ALL) p.set("caseType", caseType);
    if (dateFrom) p.set("dateFrom", dateFrom);
    if (dateTo) p.set("dateTo", dateTo);
    return p;
  };
  const linkWith = (extra: Record<string, string>) => {
    const p = baseParams();
    Object.entries(extra).forEach(([k, v]) => p.set(k, v));
    return `/cases?${p.toString()}`;
  };

  return (
    <div className="govt-card mb-4">
      <div className="govt-card-header">
        <h3>
          <Briefcase className="h-3.5 w-3.5 text-primary" />
          Total Cases — Court-wise Classification
        </h3>
        <div className="flex items-center gap-2">
          <Scale className="h-3 w-3 text-muted-foreground" />
          <select
            value={courtType}
            onChange={e => setCourtType(e.target.value)}
            className="h-7 text-[11px] rounded border border-border bg-background px-2 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value={ALL}>All Court Types</option>
            {courtTypes.map(ct => (
              <option key={ct} value={ct}>{ct}</option>
            ))}
          </select>
          <select
            value={caseType}
            onChange={e => setCaseType(e.target.value)}
            className="h-7 text-[11px] rounded border border-border bg-background px-2 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value={ALL}>All Case Types</option>
            {caseTypesOptions.map(ct => (
              <option key={ct} value={ct}>{ct}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Clickable summary cards */}
      <div className="px-3 pt-3 grid grid-cols-3 gap-2">
        <Link
          to={linkWith({})}
          className="text-center p-3 rounded bg-primary/5 border border-primary/20 hover:border-primary/50 hover:bg-primary/10 transition-colors group"
        >
          <p className="text-2xl font-bold text-primary">{filtered.length}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">Total Cases</p>
          <p className="text-[9px] text-primary/70 mt-1 inline-flex items-center gap-0.5 group-hover:text-primary">View list <ArrowRight className="h-2.5 w-2.5" /></p>
        </Link>
        <Link
          to={linkWith({ disposed: "Yes" })}
          className="text-center p-3 rounded bg-status-success/10 border border-status-success/20 hover:border-status-success/50 hover:bg-status-success/15 transition-colors group"
        >
          <p className="text-2xl font-bold text-status-success">{disposedList.length}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">Disposed Cases</p>
          <p className="text-[9px] text-status-success/80 mt-1 inline-flex items-center gap-0.5">View list <ArrowRight className="h-2.5 w-2.5" /></p>
        </Link>
        <Link
          to={linkWith({ counterPending: "true" })}
          className="text-center p-3 rounded bg-status-warning/10 border border-status-warning/20 hover:border-status-warning/50 hover:bg-status-warning/15 transition-colors group"
        >
          <p className="text-2xl font-bold text-status-warning">{pendingCounterList.length}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">Pending Counter</p>
          <p className="text-[9px] text-status-warning/80 mt-1 inline-flex items-center gap-0.5">View list <ArrowRight className="h-2.5 w-2.5" /></p>
        </Link>
      </div>

      {/* Per-court blocks */}
      <div className="p-3 space-y-3">
        {groupedByCourt.length === 0 && (
          <p className="text-center text-xs text-muted-foreground py-6">No cases match the selected filters.</p>
        )}
        {groupedByCourt.map(([ct, group]) => {
          const disposed = group.filter(c => c.disposed === "Yes" || c.status === "Closed");
          const pendingCounter = group.filter(c => c.status !== "Closed" && c.counterFiled !== "Yes");

          // Disposed: complied / non-complied dept-wise (primary department)
          const dispDept: Record<string, { complied: number; nonComplied: number }> = {};
          disposed.forEach(c => {
            const d = c.department || "Unspecified";
            if (!dispDept[d]) dispDept[d] = { complied: 0, nonComplied: 0 };
            if (isNonComplied(c)) dispDept[d].nonComplied++;
            else dispDept[d].complied++;
          });

          // Counter: filed (active, open) and pending dept-wise
          const counterFiledActive = group.filter(c => c.status !== "Closed" && c.counterFiled === "Yes");
          const counterDept: Record<string, { filed: number; pending: number; nextHearing?: string }> = {};
          [...counterFiledActive, ...pendingCounter].forEach(c => {
            const d = c.department || "Unspecified";
            if (!counterDept[d]) counterDept[d] = { filed: 0, pending: 0 };
            if (c.counterFiled === "Yes") counterDept[d].filed++;
            else counterDept[d].pending++;
            const nh = nextHearingByCase[c.id];
            if (nh && (!counterDept[d].nextHearing || nh < counterDept[d].nextHearing)) {
              counterDept[d].nextHearing = nh;
            }
          });

          const ctParams = () => {
            const p = baseParams();
            if (ct !== "Unspecified") p.set("courtType", ct);
            return p;
          };
          const courtLink = (extra: Record<string, string>) => {
            const p = ctParams();
            Object.entries(extra).forEach(([k, v]) => p.set(k, v));
            return `/cases?${p.toString()}`;
          };

          return (
            <div key={ct} className="border border-border rounded">
              <div className="flex items-center justify-between bg-muted/40 px-3 py-1.5 border-b border-border">
                <div className="flex items-center gap-2">
                  <Scale className="h-3 w-3 text-primary" />
                  <span className="text-xs font-semibold text-foreground">{ct}</span>
                  <span className="text-[10px] text-muted-foreground">· {group.length} cases</span>
                </div>
                <div className="flex gap-3 text-[10px]">
                  <Link to={courtLink({ disposed: "Yes" })} className="text-status-success font-medium hover:underline">Disposed: {disposed.length}</Link>
                  <Link to={courtLink({ counterPending: "true" })} className="text-status-warning font-medium hover:underline">Pending Counter: {pendingCounter.length}</Link>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-border">
                {/* Disposed dept-wise */}
                <div className="p-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <CheckCircle2 className="h-3 w-3 text-status-success" />
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Disposed — Department-wise
                    </p>
                  </div>
                  {Object.keys(dispDept).length === 0 ? (
                    <p className="text-[11px] text-muted-foreground py-2">No disposed cases.</p>
                  ) : (
                    <table className="w-full govt-table">
                      <thead>
                        <tr>
                          <th>Department</th>
                          <th className="text-right">Complied</th>
                          <th className="text-right">Non-Complied</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(dispDept)
                          .sort((a, b) => b[1].complied + b[1].nonComplied - (a[1].complied + a[1].nonComplied))
                          .map(([d, v]) => (
                            <tr key={d}>
                              <td className="text-[11px]">{d}</td>
                              <td className="text-[11px] text-right">
                                {v.complied > 0 ? (
                                  <Link to={courtLink({ disposed: "Yes", compliance: "complied", department: d })} className="text-status-success font-semibold hover:underline">{v.complied}</Link>
                                ) : <span className="text-muted-foreground">—</span>}
                              </td>
                              <td className="text-[11px] text-right">
                                {v.nonComplied > 0 ? (
                                  <Link to={courtLink({ disposed: "Yes", compliance: "noncomplied", department: d })} className="text-status-urgent font-semibold hover:underline">{v.nonComplied}</Link>
                                ) : <span className="text-muted-foreground">—</span>}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  )}
                </div>

                {/* Pending counter dept-wise */}
                <div className="p-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <FileText className="h-3 w-3 text-status-warning" />
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Counter Status — Department-wise
                    </p>
                  </div>
                  {Object.keys(counterDept).length === 0 ? (
                    <p className="text-[11px] text-muted-foreground py-2">No active counter matters.</p>
                  ) : (
                    <table className="w-full govt-table">
                      <thead>
                        <tr>
                          <th>Department</th>
                          <th className="text-right">Counter Filed</th>
                          <th className="text-right">Counter Pending</th>
                          <th>Next Hearing</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(counterDept)
                          .sort((a, b) => b[1].pending - a[1].pending)
                          .map(([d, v]) => (
                            <tr key={d}>
                              <td className="text-[11px]">{d}</td>
                              <td className="text-[11px] text-right">
                                {v.filed > 0 ? (
                                  <Link to={courtLink({ counterFiled: "true", department: d })} className="text-status-success font-semibold hover:underline">{v.filed}</Link>
                                ) : <span className="text-muted-foreground">—</span>}
                              </td>
                              <td className="text-[11px] text-right">
                                {v.pending > 0 ? (
                                  <Link to={courtLink({ counterPending: "true", department: d })} className="text-status-warning font-semibold hover:underline">{v.pending}</Link>
                                ) : <span className="text-muted-foreground">—</span>}
                              </td>
                              <td className="text-[11px] whitespace-nowrap">
                                {v.nextHearing ? (
                                  <span className="inline-flex items-center gap-1">
                                    <CalendarDays className="h-3 w-3 text-muted-foreground" />
                                    {v.nextHearing}
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground">—</span>
                                )}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-4 py-2 border-t border-border text-[10px] text-muted-foreground flex items-center justify-between">
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Updates live with case &amp; hearing entries
        </span>
        <Link to={linkWith({})} className="text-primary hover:underline inline-flex items-center gap-0.5">
          Open full case list <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
