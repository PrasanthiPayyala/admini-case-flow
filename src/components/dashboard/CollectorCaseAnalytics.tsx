import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, Scale, CheckCircle2, AlertTriangle, FileText, Clock, CalendarDays } from "lucide-react";
import type { CaseRecord } from "@/data/sampleData";
import type { HearingRecord } from "@/contexts/DataContext";

interface Props {
  cases: CaseRecord[];
  hearings: HearingRecord[];
}

const ALL = "All";

export function CollectorCaseAnalytics({ cases, hearings }: Props) {
  const courtTypes = useMemo(
    () => Array.from(new Set(cases.map(c => c.courtType).filter(Boolean))).sort(),
    [cases]
  );
  const caseTypes = useMemo(
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

  const disposedCount = filtered.filter(c => c.disposed === "Yes" || c.status === "Closed").length;
  const pendingCounterCount = filtered.filter(
    c => c.status !== "Closed" && c.counterFiled !== "Yes"
  ).length;

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
            {caseTypes.map(ct => (
              <option key={ct} value={ct}>{ct}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary tiles */}
      <div className="px-3 pt-3 grid grid-cols-3 gap-2">
        <div className="text-center p-2 rounded bg-primary/5 border border-primary/20">
          <p className="text-lg font-bold text-primary">{filtered.length}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total Cases</p>
        </div>
        <div className="text-center p-2 rounded bg-status-success/10 border border-status-success/20">
          <p className="text-lg font-bold text-status-success">{disposedCount}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Disposed</p>
        </div>
        <div className="text-center p-2 rounded bg-status-warning/10 border border-status-warning/20">
          <p className="text-lg font-bold text-status-warning">{pendingCounterCount}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Pending Counter</p>
        </div>
      </div>

      {/* Per-court blocks */}
      <div className="p-3 space-y-3">
        {groupedByCourt.length === 0 && (
          <p className="text-center text-xs text-muted-foreground py-6">No cases match the selected filters.</p>
        )}
        {groupedByCourt.map(([ct, group]) => {
          const disposed = group.filter(c => c.disposed === "Yes" || c.status === "Closed");
          const pendingCounter = group.filter(c => c.status !== "Closed" && c.counterFiled !== "Yes");

          // Disposed: complied / non-complied dept-wise
          const dispDept: Record<string, { complied: number; nonComplied: number }> = {};
          disposed.forEach(c => {
            const d = c.department || "Unspecified";
            if (!dispDept[d]) dispDept[d] = { complied: 0, nonComplied: 0 };
            const isComplied = c.complianceStatus === "Complied" || (!c.complianceRequired);
            if (isComplied) dispDept[d].complied++;
            else dispDept[d].nonComplied++;
          });

          // Pending counter: counter filed (false here since we only have not-filed) / counter pending dept-wise
          // For dashboard analytics: also show 'Counter Filed' active cases (filed but case still open)
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

          return (
            <div key={ct} className="border border-border rounded">
              <div className="flex items-center justify-between bg-muted/40 px-3 py-1.5 border-b border-border">
                <div className="flex items-center gap-2">
                  <Scale className="h-3 w-3 text-primary" />
                  <span className="text-xs font-semibold text-foreground">{ct}</span>
                  <span className="text-[10px] text-muted-foreground">· {group.length} cases</span>
                </div>
                <div className="flex gap-3 text-[10px]">
                  <span className="text-status-success font-medium">Disposed: {disposed.length}</span>
                  <span className="text-status-warning font-medium">Pending Counter: {pendingCounter.length}</span>
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
                              <td className="text-[11px] text-right text-status-success font-semibold">{v.complied}</td>
                              <td className="text-[11px] text-right text-status-urgent font-semibold">{v.nonComplied}</td>
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
                              <td className="text-[11px] text-right text-status-success font-semibold">{v.filed}</td>
                              <td className="text-[11px] text-right text-status-warning font-semibold">{v.pending}</td>
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
        <Link to="/cases" className="text-primary hover:underline inline-flex items-center gap-0.5">
          Open full case list <AlertTriangle className="h-3 w-3 opacity-0" />
        </Link>
      </div>
    </div>
  );
}
