import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatsCard } from "@/components/shared/StatsCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRoleFilter, getRoleDashboardType } from "@/hooks/useRoleFilter";
import { departments, divisions } from "@/data/sampleData";
import {
  Briefcase, Scale, CalendarDays, Bell, AlertTriangle, CheckCircle2,
  Clock, TrendingUp, MapPin, Gavel, Building2, ShieldCheck, Activity, FileText, Users,
  ArrowRight, Landmark, UserCheck, FolderOpen, Archive, Eye, Hourglass, ClipboardList, Lock as LockIcon
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const REF_DATE = new Date();

export default function Dashboard() {
  const { cases: allCases, hearings: allHearings, alerts, appeals, globalAudit } = useData();
  const { currentUser, permissions, users } = useAuth();
  const { filteredCases, filteredHearings, scopeLabel } = useRoleFilter();
  const navigate = useNavigate();
  const role = currentUser?.role;
  const dashType = getRoleDashboardType(role);

  // Use role-filtered data for all calculations
  const cases = filteredCases;
  const hearings = filteredHearings;

  const activeCases = cases.filter(c => c.status !== "Closed");
  const freshCases = cases.filter(c => c.status === "Fresh");
  const ongoingCases = cases.filter(c => c.status === "Ongoing");
  const closedCases = cases.filter(c => c.status === "Closed");
  const upcomingHearings = hearings.filter(h => h.status === "Scheduled");
  const pendingAlerts = alerts.filter(a => a.status !== "Sent");
  const complied = cases.filter(c => c.complianceRequired && c.complianceStatus === "Complied");
  const compliancePending = cases.filter(c => c.complianceRequired && c.complianceStatus === "Pending");
  const compliancePartial = cases.filter(c => c.complianceRequired && c.complianceStatus === "Partially Complied");
  const collectRespondent = cases.filter(c => c.collectorateInvolvement === "Collectorate as Respondent");
  const collectCoRespondent = cases.filter(c => c.collectorateInvolvement === "Collectorate as Co-Respondent");
  const landDisputes = cases.filter(c => c.landDisputeFlag && c.status !== "Closed");
  const last7Days = cases.filter(c => { const d = new Date(c.lastUpdated); return (REF_DATE.getTime() - d.getTime()) / (1000*60*60*24) <= 7; });
  const longPendingCases = cases.filter(c => { if (c.status === "Closed") return false; return (REF_DATE.getTime() - new Date(c.filingDate).getTime()) / (1000*60*60*24) > 365; });
  const counterPending = cases.filter(c => c.status === "Counter Pending" || c.counterDraftStatus === "Pending" || c.counterDraftStatus === "Draft Ready");
  const gpApprovalPending = cases.filter(c => c.gpApprovalStatus === "Pending");
  const collectorApprovalPending = cases.filter(c => c.collectorApprovalStatus === "Pending");
  const hearingScheduled = cases.filter(c => c.status === "Hearing Scheduled");
  // Government workflow KPIs
  const instructionsPending = cases.filter(c => c.status !== "Closed" && (c.instructionsFiled === "Pending" || c.instructionsFiled === "No"));
  const srNumberPending = cases.filter(c => c.status !== "Closed" && c.counterFiled === "Yes" && !c.srNumber);
  const directionsPending = cases.filter(c => (c.directions || []).some(d => d.status !== "Completed"));
  const closurePending = cases.filter(c => c.disposed === "Yes" && !c.closed);

  // Urgency: hearings tomorrow
  const tomorrow = new Date(REF_DATE);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];
  const todayStr = REF_DATE.toISOString().split("T")[0];
  const hearingsToday = hearings.filter(h => h.date === todayStr && h.status === "Scheduled");
  const hearingsTomorrow = hearings.filter(h => h.date === tomorrowStr && h.status === "Scheduled");

  const greeting = (() => {
    switch (dashType) {
      case "superadmin": return "System Administration Dashboard";
      case "admin": return "Admin Operations Dashboard";
      case "collector": return "District Collector – Executive Dashboard";
      case "addlcollector": return `Additional Collector Dashboard – ${scopeLabel}`;
      case "dro": return `${role} – Operational Dashboard`;
      case "legal": return "District Legal Officer – Operations";
      case "section": return `${role} Dashboard – ${scopeLabel}`;
      case "rdo": return `${role} – Divisional Dashboard`;
      case "mandal": return `Mandal Dashboard – ${currentUser?.mandal}`;
      case "department": return `Department Dashboard – ${currentUser?.department}`;
      case "liaison": return "Court Liaison – Daily Operations";
      case "casehandler": return "Case Handler Dashboard";
      case "dataentry": return "Data Entry Dashboard";
      case "readonly": return "Dashboard (View Only)";
      default: return "Dashboard";
    }
  })();

  const isCollector = dashType === "collector";
  const showCharts = !isCollector && ["superadmin", "admin", "legal", "addlcollector", "dro", "readonly"].includes(dashType);
  const showDeptTiles = !isCollector && ["superadmin", "admin", "legal", "addlcollector", "dro", "readonly"].includes(dashType);
  const showCollectorCards = false;
  const showApprovalCards = !isCollector && ["legal", "admin", "superadmin", "addlcollector", "dro"].includes(dashType);

  // Chart data
  const statusData = [
    { name: "Fresh", value: freshCases.length, color: "hsl(142,50%,40%)" },
    { name: "Ongoing", value: ongoingCases.length, color: "hsl(207,60%,45%)" },
    { name: "Hearing Scheduled", value: hearingScheduled.length, color: "hsl(35,80%,50%)" },
    { name: "Counter Pending", value: cases.filter(c => c.status === "Counter Pending").length, color: "hsl(25,85%,50%)" },
    { name: "Under Review", value: cases.filter(c => c.status === "Under Review").length, color: "hsl(270,40%,50%)" },
    { name: "Appealed", value: cases.filter(c => c.status === "Appealed").length, color: "hsl(320,40%,50%)" },
    { name: "Closed", value: closedCases.length, color: "hsl(215,15%,55%)" },
  ].filter(d => d.value > 0);

  const caseTypeData = (() => { const m: Record<string, number> = {}; cases.forEach(c => { m[c.caseType] = (m[c.caseType] || 0) + 1; }); return Object.entries(m).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value); })();
  const caseTypeColors = ["hsl(215,55%,28%)", "hsl(142,50%,40%)", "hsl(35,80%,50%)", "hsl(25,85%,50%)", "hsl(270,40%,50%)", "hsl(207,60%,45%)", "hsl(0,60%,50%)", "hsl(180,40%,45%)", "hsl(320,40%,50%)", "hsl(45,70%,50%)"];
  const courtData = (() => { const m: Record<string, number> = {}; cases.forEach(c => { m[c.court] = (m[c.court] || 0) + 1; }); return Object.entries(m).map(([court, cases]) => ({ court, cases })).sort((a, b) => b.cases - a.cases); })();
  const mandalData = (() => { const m: Record<string, number> = {}; cases.forEach(c => { m[c.mandal] = (m[c.mandal] || 0) + 1; }); return Object.entries(m).map(([mandal, cases]) => ({ mandal, cases })).sort((a, b) => b.cases - a.cases); })();
  const deptData = (() => { const m: Record<string, number> = {}; cases.forEach(c => { m[c.department] = (m[c.department] || 0) + 1; }); return Object.entries(m).map(([dept, cases]) => ({ dept, cases })).sort((a, b) => b.cases - a.cases); })();
  const priorityData = (() => { const m: Record<string, number> = {}; cases.forEach(c => { m[c.priority] = (m[c.priority] || 0) + 1; }); return Object.entries(m).map(([priority, cases]) => ({ priority, cases })); })();
  const deptCompliance = (() => { const m: Record<string, { pending: number; partial: number; complied: number }> = {}; cases.filter(c => c.complianceRequired).forEach(c => { if (!m[c.department]) m[c.department] = { pending: 0, partial: 0, complied: 0 }; if (c.complianceStatus === "Pending") m[c.department].pending++; else if (c.complianceStatus === "Partially Complied") m[c.department].partial++; else if (c.complianceStatus === "Complied") m[c.department].complied++; }); return Object.entries(m).map(([dept, v]) => ({ dept, ...v })); })();

  const deptCaseCounts: Record<string, number> = {};
  departments.forEach(d => { deptCaseCounts[d] = cases.filter(c => c.department === d).length; });

  const divCounts: Record<string, number> = {};
  Object.entries(divisions).forEach(([div, mandals]) => {
    divCounts[div] = cases.filter(c => mandals.includes(c.mandal)).length;
  });

  // Pending-at-level summary
  const pendingAtSummary = (() => {
    const m: Record<string, number> = {};
    activeCases.forEach(c => { if (c.pendingAtLevel) m[c.pendingAtLevel] = (m[c.pendingAtLevel] || 0) + 1; });
    return Object.entries(m).map(([level, count]) => ({ level, count })).sort((a, b) => b.count - a.count);
  })();

  return (
    <AppLayout>
      <PageHeader
        title={greeting}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Dashboard" }]}
        actions={
          <div className="text-right">
            <p className="text-[10px] text-muted-foreground">{role}</p>
            <p className="text-xs font-semibold text-foreground">{currentUser?.name}</p>
            {scopeLabel !== "District-wide" && <p className="text-[10px] text-primary font-medium">{scopeLabel}</p>}
          </div>
        }
      />

      {/* Super Admin: system stats */}
      {dashType === "superadmin" && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-4">
          <StatsCard title="Total Users" value={users.length} icon={Users} subtitle="System accounts" href="/users" accent="info" />
          <StatsCard title="Active Users" value={users.filter(u => u.status === "Active").length} icon={UserCheck} subtitle="Currently active" href="/users" accent="success" />
          <StatsCard title="Total Cases" value={allCases.length} icon={Briefcase} subtitle="All registered" href="/cases" />
          <StatsCard title="Total Hearings" value={allHearings.length} icon={CalendarDays} subtitle="All records" href="/hearings" />
        </div>
      )}

      {/* Data Entry: quick actions */}
      {dashType === "dataentry" && (
        <div className="govt-card p-4 mb-4">
          <h3 className="text-xs font-semibold text-foreground mb-3">Quick Actions</h3>
          <div className="flex gap-3">
            <Link to="/cases/new"><Button size="sm">Create New Case</Button></Link>
            <Link to="/cases/bulk-upload"><Button variant="outline" size="sm">Bulk Upload</Button></Link>
            <Link to="/cases"><Button variant="outline" size="sm">View Cases</Button></Link>
          </div>
        </div>
      )}

      {/* Liaison: today's priority */}
      {dashType === "liaison" && (
        <div className="govt-card p-4 mb-4">
          <h3 className="text-xs font-semibold text-foreground mb-3">Today's Priority</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-3">
            <StatsCard title="Hearings Today" value={hearingsToday.length} icon={Gavel} href="/hearings" accent="urgent" />
            <StatsCard title="Hearings Tomorrow" value={hearingsTomorrow.length} icon={CalendarDays} href="/hearings" accent="warning" />
            <StatsCard title="Compliance Pending" value={compliancePending.length} icon={Clock} href="/compliance" accent="urgent" />
            <StatsCard title="Total Scheduled" value={upcomingHearings.length} icon={CalendarDays} href="/hearings" accent="info" />
          </div>
          <div className="flex gap-2">
            <Link to="/court-liaison"><Button size="sm"><Gavel className="h-3.5 w-3.5 mr-1.5" />Open Daily Update Desk</Button></Link>
            <Link to="/hearings"><Button variant="outline" size="sm"><CalendarDays className="h-3.5 w-3.5 mr-1.5" />All Hearings</Button></Link>
          </div>
        </div>
      )}

      {isCollector && (() => {
        const disposedOpen = cases.filter(c => c.disposed === "Yes" && !c.closed);
        const closedAll = cases.filter(c => c.closed || c.status === "Closed");
        const dayMs = 1000 * 60 * 60 * 24;
        const daysFromToday = (d: string) => Math.ceil((new Date(d).getTime() - REF_DATE.getTime()) / dayMs);
        const urgencyChip = (days: number) => {
          if (days <= 0) return "bg-status-urgent/10 text-status-urgent";
          if (days <= 3) return "bg-status-warning/10 text-status-warning";
          return "bg-status-success/10 text-status-success";
        };
        const attentionHearings = hearings
          .filter(h => h.status === "Scheduled")
          .map(h => ({ h, days: daysFromToday(h.date) }))
          .filter(x => x.days <= 3)
          .sort((a, b) => a.days - b.days)
          .slice(0, 10);
        const caseById = (id: string) => cases.find(c => c.id === id);

        const pendingActionCases = activeCases.filter(c => {
          const counterMissing = c.counterFiled !== "Yes";
          const srMissing = c.counterFiled === "Yes" && !c.srNumber;
          const dirOpen = (c.directions || []).some(d => d.status !== "Completed");
          const compPending = c.complianceRequired && c.complianceStatus === "Pending";
          return counterMissing || srMissing || dirOpen || compPending;
        }).slice(0, 10);

        const nextHearingFor = (caseId: string) => {
          const future = hearings
            .filter(h => h.caseId === caseId && h.status === "Scheduled")
            .sort((a, b) => a.date.localeCompare(b.date));
          return future[0]?.date || "";
        };
        const urgentInvolvement = (list: typeof cases) => list
          .filter(c => c.status !== "Closed")
          .map(c => ({ c, next: nextHearingFor(c.id) }))
          .sort((a, b) => (a.next || "9999").localeCompare(b.next || "9999"))
          .slice(0, 5);

        const respUrgent = urgentInvolvement(collectRespondent);
        const coRespUrgent = urgentInvolvement(collectCoRespondent);

        const weekEnd = new Date(REF_DATE.getTime() + 7 * dayMs).toISOString().split("T")[0];
        const deptRows = departments.map(dept => {
          const deptCases = cases.filter(c => c.department === dept);
          const pending = deptCases.filter(c => c.status !== "Closed").length;
          const compPending = deptCases.filter(c => c.complianceRequired && c.complianceStatus === "Pending").length;
          const hearingsWeek = hearings.filter(h => h.status === "Scheduled" && h.date >= todayStr && h.date <= weekEnd && deptCases.some(c => c.id === h.caseId)).length;
          return { dept, total: deptCases.length, pending, compPending, hearingsWeek };
        }).filter(r => r.total > 0).sort((a, b) => b.pending - a.pending);

        const divRows = Object.entries(divisions).map(([div, mandals]) => {
          const divCases = cases.filter(c => mandals.includes(c.mandal));
          const pending = divCases.filter(c => c.status !== "Closed").length;
          const upcoming = hearings.filter(h => h.status === "Scheduled" && h.date >= todayStr && divCases.some(c => c.id === h.caseId)).length;
          return { div, total: divCases.length, pending, upcoming };
        });

        const sevenDaysAgo = new Date(REF_DATE.getTime() - 7 * dayMs).toISOString();
        const trackedActions = ["Hearing", "Counter", "Direction", "Action Taken", "Disposed", "Closed"];
        const recentFeed = (globalAudit || [])
          .filter(a => a.ts >= sevenDaysAgo && trackedActions.some(t => a.action.includes(t)))
          .slice(0, 15);

        const statusDonut = [
          { name: "Fresh", value: freshCases.length, color: "hsl(142,50%,40%)" },
          { name: "Ongoing", value: ongoingCases.length, color: "hsl(207,60%,45%)" },
          { name: "Counter Pending", value: counterPending.length, color: "hsl(25,85%,50%)" },
          { name: "Disposed", value: disposedOpen.length, color: "hsl(270,40%,50%)" },
          { name: "Closed", value: closedAll.length, color: "hsl(215,15%,55%)" },
        ].filter(d => d.value > 0);

        return (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2.5 mb-3">
              <StatsCard title="Total Cases" value={cases.length} icon={Briefcase} href="/cases" />
              <StatsCard title="Fresh" value={freshCases.length} icon={TrendingUp} href="/cases?status=Fresh" accent="success" />
              <StatsCard title="Ongoing" value={ongoingCases.length} icon={Clock} href="/cases?status=Ongoing" accent="info" />
              <StatsCard title="Disposed" value={disposedOpen.length} icon={Archive} href="/cases?closure=Pending" accent="info" />
              <StatsCard title="Closed" value={closedAll.length} icon={CheckCircle2} href="/cases/closed" />
              <StatsCard title="Hearings Tomorrow" value={hearingsTomorrow.length} icon={CalendarDays} href="/hearings" accent="warning" />
              <StatsCard title="Counter Pending" value={counterPending.length} icon={FileText} href="/cases?status=Counter+Pending" accent="warning" />
              <StatsCard title="Compliance Pending" value={compliancePending.length} icon={ShieldCheck} href="/compliance" accent="urgent" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2.5 mb-4">
              <StatsCard title="Collectorate Respondent" value={collectRespondent.length} icon={Landmark} href="/cases?involvement=Collectorate+as+Respondent" accent="urgent" />
              <StatsCard title="Co-Respondent" value={collectCoRespondent.length} icon={Building2} href="/cases?involvement=Collectorate+as+Co-Respondent" accent="warning" />
              <StatsCard title="Directions Pending" value={directionsPending.length} icon={AlertTriangle} href="/cases?directions=Pending" accent="urgent" />
              <StatsCard title="Action Taken Pending" value={instructionsPending.length} icon={ClipboardList} href="/cases?instructions=Pending" accent="warning" />
              <StatsCard title="GP Approval" value={gpApprovalPending.length} icon={FileText} href="/cases?gpApproval=Pending" accent="warning" />
              <StatsCard title="Collector Approval" value={collectorApprovalPending.length} icon={CheckCircle2} href="/cases?collectorApproval=Pending" accent="urgent" />
              <StatsCard title="Long Pending" value={longPendingCases.length} icon={Hourglass} subtitle=">1 year" href="/cases" accent="warning" />
              <StatsCard title="Last 7 Days Updates" value={last7Days.length} icon={Activity} href="/cases" accent="info" />
            </div>

            <div className="govt-card mb-4">
              <div className="govt-card-header">
                <h3><Gavel className="h-3.5 w-3.5" />Hearings Requiring Attention ({attentionHearings.length})</h3>
                <Link to="/hearings" className="text-[10px] text-primary hover:underline flex items-center gap-0.5">All Hearings <ArrowRight className="h-3 w-3" /></Link>
              </div>
              <table className="w-full govt-table">
                <thead><tr><th>Case No.</th><th>Petitioner</th><th>Department</th><th>Next Hearing</th><th>Days Left</th><th>Status</th></tr></thead>
                <tbody>
                  {attentionHearings.map(({ h, days }) => {
                    const c = caseById(h.caseId);
                    return (
                      <tr key={h.id} className="cursor-pointer" onClick={() => navigate(`/cases/${encodeURIComponent(h.caseId)}`)}>
                        <td className="text-xs font-medium text-foreground whitespace-nowrap">{c?.caseNumber || h.caseId}</td>
                        <td className="text-xs max-w-[180px] truncate">{c?.petitioner || h.caseTitle}</td>
                        <td className="text-[10px]">{c?.department || "—"}</td>
                        <td className="text-xs whitespace-nowrap">{h.date}</td>
                        <td><span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${urgencyChip(days)}`}>{days <= 0 ? `${Math.abs(days)}d overdue` : `${days}d left`}</span></td>
                        <td><StatusBadge value={c?.status || h.status} /></td>
                      </tr>
                    );
                  })}
                  {attentionHearings.length === 0 && <tr><td colSpan={6} className="text-center py-4 text-muted-foreground text-xs">No urgent hearings in the next 3 days</td></tr>}
                </tbody>
              </table>
            </div>

            <div className="govt-card mb-4">
              <div className="govt-card-header">
                <h3><AlertTriangle className="h-3.5 w-3.5" />Pending Action Cases ({pendingActionCases.length})</h3>
                <Link to="/cases?status=Counter+Pending" className="text-[10px] text-primary hover:underline flex items-center gap-0.5">View All <ArrowRight className="h-3 w-3" /></Link>
              </div>
              <table className="w-full govt-table">
                <thead><tr><th>Case No.</th><th>Department</th><th>Pending At</th><th>Responsible Officer</th><th>Due Date</th><th>Priority</th></tr></thead>
                <tbody>
                  {pendingActionCases.map(c => (
                    <tr key={c.id} className="cursor-pointer" onClick={() => navigate(`/cases/${encodeURIComponent(c.id)}`)}>
                      <td className="text-xs font-medium text-foreground whitespace-nowrap">{c.caseNumber}</td>
                      <td className="text-[10px]">{c.department}</td>
                      <td className="text-[10px] font-medium">{c.pendingAtLevel || "—"}</td>
                      <td className="text-[10px]">{c.assignedOfficer}</td>
                      <td className="text-xs whitespace-nowrap">{(c as any).counterFilingDueDate || c.complianceDueDate || "—"}</td>
                      <td><StatusBadge value={c.priority} type="priority" /></td>
                    </tr>
                  ))}
                  {pendingActionCases.length === 0 && <tr><td colSpan={6} className="text-center py-4 text-muted-foreground text-xs">No pending action cases</td></tr>}
                </tbody>
              </table>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              {[
                { label: "Collectorate as Respondent", list: respUrgent, total: collectRespondent.length, href: "/cases?involvement=Collectorate+as+Respondent", icon: Landmark },
                { label: "Collectorate as Co-Respondent", list: coRespUrgent, total: collectCoRespondent.length, href: "/cases?involvement=Collectorate+as+Co-Respondent", icon: Building2 },
              ].map(({ label, list, total, href, icon: Icn }) => (
                <div key={label} className="govt-card">
                  <div className="govt-card-header">
                    <h3><Icn className="h-3.5 w-3.5" />{label}</h3>
                    <Link to={href} className="text-[10px] text-primary hover:underline flex items-center gap-0.5">{total} cases <ArrowRight className="h-3 w-3" /></Link>
                  </div>
                  <table className="w-full govt-table">
                    <thead><tr><th>Case No.</th><th>Petitioner</th><th>Next Hearing</th><th>Status</th></tr></thead>
                    <tbody>
                      {list.map(({ c, next }) => (
                        <tr key={c.id} className="cursor-pointer" onClick={() => navigate(`/cases/${encodeURIComponent(c.id)}`)}>
                          <td className="text-xs font-medium whitespace-nowrap">{c.caseNumber}</td>
                          <td className="text-xs max-w-[160px] truncate">{c.petitioner}</td>
                          <td className="text-xs whitespace-nowrap">{next || "—"}</td>
                          <td><StatusBadge value={c.status} /></td>
                        </tr>
                      ))}
                      {list.length === 0 && <tr><td colSpan={4} className="text-center py-4 text-muted-foreground text-xs">No active matters</td></tr>}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="govt-card md:col-span-2">
                <div className="govt-card-header"><h3><Building2 className="h-3.5 w-3.5" />Department-wise Snapshot</h3></div>
                <table className="w-full govt-table">
                  <thead><tr><th>Department</th><th className="text-right">Total</th><th className="text-right">Pending</th><th className="text-right">Compliance Pending</th><th className="text-right">Hearings This Week</th></tr></thead>
                  <tbody>
                    {deptRows.map(r => (
                      <tr key={r.dept}>
                        <td className="text-xs font-medium"><Link to={`/cases?department=${encodeURIComponent(r.dept)}`} className="hover:text-primary">{r.dept}</Link></td>
                        <td className="text-xs text-right">{r.total}</td>
                        <td className="text-xs text-right text-status-warning font-semibold">{r.pending || "—"}</td>
                        <td className="text-xs text-right text-status-urgent font-semibold">{r.compPending || "—"}</td>
                        <td className="text-xs text-right">{r.hearingsWeek || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="govt-card p-4">
                <h3 className="text-xs font-semibold text-foreground mb-2">Cases by Status</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={statusDonut} cx="50%" cy="50%" innerRadius={40} outerRadius={75} dataKey="value" label={({ name, value }) => `${name}: ${value}`} fontSize={9}>
                      {statusDonut.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              {divRows.map(r => (
                <Link key={r.div} to={`/cases?division=${encodeURIComponent(r.div)}`} className="govt-card p-4 hover:border-primary/40 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Division</p>
                      <h4 className="text-sm font-bold text-foreground">{r.div}</h4>
                    </div>
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center p-2 bg-muted/50 rounded"><p className="text-lg font-bold text-foreground">{r.total}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
                    <div className="text-center p-2 bg-muted/50 rounded"><p className="text-lg font-bold text-status-warning">{r.pending}</p><p className="text-[10px] text-muted-foreground">Pending</p></div>
                    <div className="text-center p-2 bg-muted/50 rounded"><p className="text-lg font-bold text-primary">{r.upcoming}</p><p className="text-[10px] text-muted-foreground">Hearings</p></div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="govt-card mb-4">
              <div className="govt-card-header"><h3><Activity className="h-3.5 w-3.5" />Recent Updates (Last 7 Days)</h3></div>
              <div className="max-h-80 overflow-y-auto">
                <table className="w-full govt-table">
                  <thead className="sticky top-0 bg-card"><tr><th>Timestamp</th><th>Case No.</th><th>Action</th><th>By</th></tr></thead>
                  <tbody>
                    {recentFeed.map(a => {
                      const m = a.details?.match(/^\[([^\]]+)\]/);
                      const caseId = m?.[1];
                      const c = caseId ? caseById(caseId) : undefined;
                      return (
                        <tr key={a.id} className={caseId ? "cursor-pointer" : ""} onClick={() => caseId && navigate(`/cases/${encodeURIComponent(caseId)}`)}>
                          <td className="text-[10px] whitespace-nowrap">{new Date(a.ts).toLocaleString()}</td>
                          <td className="text-xs font-medium whitespace-nowrap">{c?.caseNumber || caseId || "—"}</td>
                          <td className="text-xs">{a.action}</td>
                          <td className="text-[10px]">{a.actor} <span className="text-muted-foreground">({a.role})</span></td>
                        </tr>
                      );
                    })}
                    {recentFeed.length === 0 && <tr><td colSpan={4} className="text-center py-4 text-muted-foreground text-xs">No workflow activity in the last 7 days</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        );
      })()}

      {/* Core KPI Row 1 */}
      {!isCollector && (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2.5 mb-4">
        <StatsCard title="Total Cases" value={cases.length} icon={Briefcase} href="/cases" />
        <StatsCard title="Fresh" value={freshCases.length} icon={TrendingUp} href="/cases?status=Fresh" accent="success" />
        <StatsCard title="Ongoing" value={ongoingCases.length} icon={Clock} href="/cases?status=Ongoing" accent="info" />
        <StatsCard title="Closed" value={closedCases.length} icon={CheckCircle2} href="/cases/closed" />
        <StatsCard title="Hearings Due" value={upcomingHearings.length} icon={CalendarDays} href="/hearings" accent="warning" />
        <StatsCard title="Appeals" value={appeals.length} icon={Scale} href="/appeals" accent="info" />
        <StatsCard title="Alerts" value={pendingAlerts.length} icon={AlertTriangle} href="/alerts" accent="urgent" />
      </div>
      )}

      {/* Row 2: Urgency + Compliance */}
      {showApprovalCards && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2.5 mb-4">
          <StatsCard title="Hearings Today" value={hearingsToday.length} icon={Gavel} href="/hearings" accent="urgent" />
          <StatsCard title="Hearings Tomorrow" value={hearingsTomorrow.length} icon={CalendarDays} href="/hearings" accent="warning" />
          <StatsCard title="Counter Pending" value={counterPending.length} icon={FileText} href="/cases?status=Counter+Pending" accent="warning" />
          <StatsCard title="GP Approval" value={gpApprovalPending.length} icon={AlertTriangle} href="/cases?gpApproval=Pending" accent="urgent" />
          <StatsCard title="Collector Approval" value={collectorApprovalPending.length} icon={CheckCircle2} href="/cases?collectorApproval=Pending" accent="warning" />
          <StatsCard title="Compliance Pending" value={compliancePending.length} icon={Clock} href="/compliance" accent="urgent" />
          <StatsCard title="Orders Complied" value={complied.length} icon={ShieldCheck} href="/compliance" accent="success" />
          <StatsCard title="Long-Pending" value={longPendingCases.length} icon={Hourglass} subtitle=">1 year" href="/cases" accent="warning" />
        </div>
      )}

      {/* Government workflow KPI row */}
      {showApprovalCards && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-4">
          <StatsCard title="Instructions Pending" value={instructionsPending.length} icon={FileText} subtitle="Awaiting dept input" href="/cases?instructions=Pending" accent="urgent" />
          <StatsCard title="S.R. Number Pending" value={srNumberPending.length} icon={ClipboardList} subtitle="Counter filed, no SR" href="/cases?sr=missing" accent="warning" />
          <StatsCard title="Action Taken Pending" value={directionsPending.length} icon={AlertTriangle} subtitle="Directions open" href="/cases?directions=Pending" accent="urgent" />
          <StatsCard title="Pending Closures" value={closurePending.length} icon={LockIcon} subtitle="Disposed not closed" href="/cases?closure=Pending" accent="info" />
        </div>
      )}


      {showCollectorCards && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-4">
          <StatsCard title="Collectorate as Respondent" value={collectRespondent.length} icon={Landmark} href="/cases?involvement=Collectorate+as+Respondent" accent="urgent" />
          <StatsCard title="Collectorate Co-Respondent" value={collectCoRespondent.length} icon={Building2} href="/cases?involvement=Collectorate+as+Co-Respondent" accent="warning" />
          <StatsCard title="Last 7 Days Updates" value={last7Days.length} icon={Activity} href="/cases" accent="info" />
          <StatsCard title="Land Disputes" value={landDisputes.length} icon={MapPin} href="/cases?land=true" accent="urgent" />
        </div>
      )}

      {/* Pending-At-Level Summary */}
      {showApprovalCards && pendingAtSummary.length > 0 && (
        <div className="govt-card mb-4">
          <div className="govt-card-header"><h3><Clock className="h-3.5 w-3.5" />Pending at Level Summary</h3></div>
          <div className="p-3 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
            {pendingAtSummary.map(p => (
              <div key={p.level} className="text-center p-2 bg-muted/50 rounded">
                <p className="text-lg font-bold text-foreground">{p.count}</p>
                <p className="text-[10px] text-muted-foreground">{p.level}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Division-wise counts (for Collector, Admin, Legal, DRO) */}
      {["admin", "superadmin", "legal", "dro", "addlcollector", "readonly"].includes(dashType) && (
        <div className="govt-card mb-4">
          <div className="govt-card-header"><h3><MapPin className="h-3.5 w-3.5" />Division-wise Cases</h3></div>
          <div className="p-3 grid grid-cols-2 gap-2">
            {Object.entries(divCounts).map(([div, count]) => (
              <Link key={div} to={`/cases?division=${encodeURIComponent(div)}`} className="dept-tile">
                <span className="count">{count}</span>
                <p>{div}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Department Quick Access Tiles */}
      {showDeptTiles && (
        <div className="govt-card mb-4">
          <div className="govt-card-header">
            <h3><Building2 className="h-3.5 w-3.5" />Department-wise Cases</h3>
            <Link to="/cases" className="text-[10px] text-primary hover:underline flex items-center gap-0.5">View All <ArrowRight className="h-3 w-3" /></Link>
          </div>
          <div className="p-3 grid grid-cols-2 md:grid-cols-5 gap-2">
            {departments.map(dept => (
              <Link key={dept} to={`/cases?department=${encodeURIComponent(dept)}`} className="dept-tile">
                <span className="count">{deptCaseCounts[dept] || 0}</span>
                <p>{dept}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Charts */}
      {showCharts && (
        <>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="govt-card p-4">
              <h3 className="text-xs font-semibold text-foreground mb-3">Cases by Status</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart><Pie data={statusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`} fontSize={9}>
                  {statusData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie><Tooltip /></PieChart>
              </ResponsiveContainer>
            </div>
            <div className="govt-card p-4">
              <h3 className="text-xs font-semibold text-foreground mb-3">Cases by Type</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart><Pie data={caseTypeData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`} fontSize={8}>
                  {caseTypeData.map((_, i) => <Cell key={i} fill={caseTypeColors[i % caseTypeColors.length]} />)}
                </Pie><Tooltip /></PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="govt-card p-4">
              <h3 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5"><Gavel className="h-3.5 w-3.5" />Cases by Court</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={courtData} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="hsl(214,20%,88%)" /><XAxis type="number" fontSize={10} stroke="hsl(215,14%,45%)" /><YAxis type="category" dataKey="court" fontSize={9} stroke="hsl(215,14%,45%)" width={160} /><Tooltip /><Bar dataKey="cases" fill="hsl(215,55%,28%)" radius={[0,3,3,0]} /></BarChart>
              </ResponsiveContainer>
            </div>
            <div className="govt-card p-4">
              <h3 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />Cases by Mandal</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={mandalData}><CartesianGrid strokeDasharray="3 3" stroke="hsl(214,20%,88%)" /><XAxis dataKey="mandal" fontSize={8} stroke="hsl(215,14%,45%)" angle={-20} textAnchor="end" height={40} /><YAxis fontSize={10} stroke="hsl(215,14%,45%)" /><Tooltip /><Bar dataKey="cases" fill="hsl(142,50%,40%)" radius={[3,3,0,0]} /></BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="govt-card p-4">
              <h3 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" />Cases by Department</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={deptData} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="hsl(214,20%,88%)" /><XAxis type="number" fontSize={10} stroke="hsl(215,14%,45%)" /><YAxis type="category" dataKey="dept" fontSize={8} stroke="hsl(215,14%,45%)" width={160} /><Tooltip /><Bar dataKey="cases" fill="hsl(35,80%,50%)" radius={[0,3,3,0]} /></BarChart>
              </ResponsiveContainer>
            </div>
            <div className="govt-card p-4">
              <h3 className="text-xs font-semibold text-foreground mb-3">Cases by Priority</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={priorityData}><CartesianGrid strokeDasharray="3 3" stroke="hsl(214,20%,88%)" /><XAxis dataKey="priority" fontSize={9} stroke="hsl(215,14%,45%)" /><YAxis fontSize={10} stroke="hsl(215,14%,45%)" /><Tooltip /><Bar dataKey="cases" fill="hsl(0,60%,50%)" radius={[3,3,0,0]} /></BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {/* Compliance + Collectorate summary panels */}
      {showCharts && (
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="govt-card">
            <div className="govt-card-header"><h3><ShieldCheck className="h-3.5 w-3.5" />Compliance Summary</h3></div>
            <div className="p-4 grid grid-cols-2 gap-3">
              {[
                { label: "Complied", val: complied.length, cls: "text-emerald-700" },
                { label: "Pending", val: compliancePending.length, cls: "text-orange-600" },
                { label: "Partially Complied", val: compliancePartial.length, cls: "text-amber-600" },
                { label: "Total Orders Passed", val: cases.filter(c => c.orderPassed).length, cls: "text-foreground" },
              ].map(s => (
                <div key={s.label} className="text-center p-3 bg-muted/50 rounded">
                  <p className={`text-xl font-bold ${s.cls}`}>{s.val}</p>
                  <p className="text-[10px] text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="govt-card">
            <div className="govt-card-header"><h3><Building2 className="h-3.5 w-3.5" />Collectorate Involvement</h3></div>
            <div className="p-4 grid grid-cols-2 gap-3">
              {[
                { label: "As Respondent", val: collectRespondent.length },
                { label: "As Co-Respondent", val: collectCoRespondent.length },
                { label: "Dept. Involved", val: cases.filter(c => c.collectorateInvolvement === "Department Involved").length },
                { label: "Monitoring Only", val: cases.filter(c => c.collectorateInvolvement === "Monitoring Only").length },
              ].map(s => (
                <Link key={s.label} to={`/cases?involvement=${encodeURIComponent(s.label === "As Respondent" ? "Collectorate as Respondent" : s.label === "As Co-Respondent" ? "Collectorate as Co-Respondent" : s.label === "Dept. Involved" ? "Department Involved" : "Monitoring Only")}`} className="text-center p-3 bg-muted/50 rounded hover:bg-muted transition-colors">
                  <p className="text-xl font-bold text-foreground">{s.val}</p>
                  <p className="text-[10px] text-muted-foreground">{s.label}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Dept Compliance Table */}
      {showCharts && deptCompliance.length > 0 && (
        <div className="govt-card mb-4">
          <div className="govt-card-header"><h3>Pending Compliance by Department</h3></div>
          <table className="w-full govt-table">
            <thead><tr><th>Department</th><th>Pending</th><th>Partially Complied</th><th>Complied</th></tr></thead>
            <tbody>{deptCompliance.map(d => (<tr key={d.dept}><td className="text-xs font-medium">{d.dept}</td><td className="text-xs text-orange-600 font-semibold">{d.pending || "-"}</td><td className="text-xs text-amber-600 font-semibold">{d.partial || "-"}</td><td className="text-xs text-emerald-700 font-semibold">{d.complied || "-"}</td></tr>))}</tbody>
          </table>
        </div>
      )}

      {/* Upcoming Hearings + Land Disputes */}
      {dashType !== "dataentry" && !isCollector && (
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="govt-card">
            <div className="govt-card-header">
              <h3><CalendarDays className="h-3.5 w-3.5" />Upcoming Hearings ({upcomingHearings.length})</h3>
              <Link to="/hearings" className="text-[10px] text-primary hover:underline flex items-center gap-0.5">View All <ArrowRight className="h-3 w-3" /></Link>
            </div>
            <table className="w-full govt-table">
              <thead><tr><th>Case</th><th>Court</th><th>Date</th><th>Officer</th></tr></thead>
              <tbody>
                {upcomingHearings.slice(0, 8).map(h => (<tr key={h.id} className="cursor-pointer" onClick={() => navigate(`/cases/${encodeURIComponent(h.caseId)}`)}><td className="font-medium text-foreground text-xs max-w-[150px] truncate">{h.caseTitle}</td><td className="text-[10px]">{h.court}</td><td className="text-xs whitespace-nowrap">{h.date}</td><td className="text-[10px]">{h.officer}</td></tr>))}
                {upcomingHearings.length === 0 && <tr><td colSpan={4} className="text-center py-4 text-muted-foreground text-xs">No upcoming hearings</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="govt-card">
            <div className="govt-card-header">
              <h3><MapPin className="h-3.5 w-3.5" />Active Land Disputes ({landDisputes.length})</h3>
              <Link to="/cases?land=true" className="text-[10px] text-primary hover:underline flex items-center gap-0.5">View All <ArrowRight className="h-3 w-3" /></Link>
            </div>
            <table className="w-full govt-table">
              <thead><tr><th>Case</th><th>Mandal</th><th>Priority</th><th>Status</th></tr></thead>
              <tbody>
                {landDisputes.slice(0, 8).map(c => (<tr key={c.id} className="cursor-pointer" onClick={() => navigate(`/cases/${encodeURIComponent(c.id)}`)}><td className="font-medium text-foreground text-xs max-w-[150px] truncate">{c.title}</td><td className="text-xs">{c.mandal}</td><td><StatusBadge value={c.priority} type="priority" /></td><td><StatusBadge value={c.status} /></td></tr>))}
                {landDisputes.length === 0 && <tr><td colSpan={4} className="text-center py-4 text-muted-foreground text-xs">None</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent Updates + Alerts */}
      {dashType !== "dataentry" && !isCollector && (
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="govt-card">
            <div className="govt-card-header"><h3><Activity className="h-3.5 w-3.5" />Updated in Last 7 Days ({last7Days.length})</h3></div>
            <table className="w-full govt-table">
              <thead><tr><th>Case</th><th>Department</th><th>Updated</th><th>Status</th></tr></thead>
              <tbody>
                {last7Days.slice(0, 8).map(c => (<tr key={c.id} className="cursor-pointer" onClick={() => navigate(`/cases/${encodeURIComponent(c.id)}`)}><td className="font-medium text-foreground text-xs max-w-[150px] truncate">{c.title}</td><td className="text-[10px]">{c.department}</td><td className="text-xs">{c.lastUpdated}</td><td><StatusBadge value={c.status} /></td></tr>))}
              </tbody>
            </table>
          </div>
          <div className="govt-card">
            <div className="govt-card-header"><h3><Bell className="h-3.5 w-3.5" />Recent Alerts ({alerts.length})</h3></div>
            <table className="w-full govt-table">
              <thead><tr><th>Type</th><th>Alert</th><th>Officer</th><th>Priority</th></tr></thead>
              <tbody>
                {alerts.slice(0, 8).map(a => (<tr key={a.id}><td className="text-xs font-medium whitespace-nowrap">{a.type}</td><td className="max-w-[250px] truncate text-xs">{a.message}</td><td className="text-[10px] whitespace-nowrap">{a.officer}</td><td><StatusBadge value={a.priority} type="priority" /></td></tr>))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
