import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatsCard } from "@/components/shared/StatsCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { departments } from "@/data/sampleData";
import {
  Briefcase, Scale, CalendarDays, Bell, AlertTriangle, CheckCircle2,
  Clock, TrendingUp, MapPin, Gavel, Building2, ShieldCheck, Activity, FileText, Users,
  ArrowRight, Landmark, UserCheck
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const REF_DATE = new Date();

export default function Dashboard() {
  const { cases, hearings, alerts, appeals } = useData();
  const { currentUser, permissions, users } = useAuth();
  const navigate = useNavigate();
  const role = currentUser?.role;

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

  const statusData = [
    { name: "Fresh", value: freshCases.length, color: "hsl(142,50%,40%)" },
    { name: "Ongoing", value: ongoingCases.length, color: "hsl(207,60%,45%)" },
    { name: "Hearing Scheduled", value: cases.filter(c => c.status === "Hearing Scheduled").length, color: "hsl(35,80%,50%)" },
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

  const greeting = (() => {
    switch (role) {
      case "Super Admin": return "System Administration Dashboard";
      case "Admin": return "Admin Operations Dashboard";
      case "District Collector": return "District Review Dashboard";
      case "District Legal Officer": return "Legal Operations Dashboard";
      case "High Court Representative Officer": return "Court Liaison Dashboard";
      case "Department Nodal Officer": return `Department Dashboard – ${currentUser?.department}`;
      case "Mandal-Level User": return `Mandal Dashboard – ${currentUser?.mandal}`;
      case "Data Entry Operator": return "Data Entry Dashboard";
      case "Read-Only Viewer": return "Dashboard (View Only)";
      default: return "Dashboard";
    }
  })();

  const showFullDashboard = ["Super Admin", "Admin", "District Collector", "District Legal Officer"].includes(role || "");
  const isCollector = role === "District Collector";
  const isLiaison = role === "High Court Representative Officer";
  const isDeptNodal = role === "Department Nodal Officer";
  const isMandalUser = role === "Mandal-Level User";
  const isDataEntry = role === "Data Entry Operator";
  const isReadOnly = role === "Read-Only Viewer";

  const userCases = isDeptNodal ? cases.filter(c => c.department === currentUser?.department) : isMandalUser ? cases.filter(c => c.mandal === currentUser?.mandal) : cases;
  const userActiveCases = userCases.filter(c => c.status !== "Closed");

  // Dept counts for quick tiles
  const deptCaseCounts: Record<string, number> = {};
  departments.forEach(d => { deptCaseCounts[d] = cases.filter(c => c.department === d).length; });

  return (
    <AppLayout>
      <PageHeader
        title={greeting}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Dashboard" }]}
        actions={
          isCollector ? (
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground">District Collector</p>
              <p className="text-xs font-semibold text-foreground">{currentUser?.name}</p>
            </div>
          ) : undefined
        }
      />

      {/* Super Admin extras */}
      {role === "Super Admin" && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-4">
          <StatsCard title="Total Users" value={users.length} icon={Users} subtitle="System accounts" href="/users" accent="info" />
          <StatsCard title="Active Users" value={users.filter(u => u.status === "Active").length} icon={UserCheck} subtitle="Currently active" href="/users" accent="success" />
          <StatsCard title="Total Cases" value={cases.length} icon={Briefcase} subtitle="All registered" href="/cases" />
          <StatsCard title="Total Hearings" value={hearings.length} icon={CalendarDays} subtitle="All records" href="/hearings" />
        </div>
      )}

      {/* Data Entry quick actions */}
      {isDataEntry && (
        <div className="govt-card p-4 mb-4">
          <h3 className="text-xs font-semibold text-foreground mb-3">Quick Actions</h3>
          <div className="flex gap-3">
            <Link to="/cases/new"><Button size="sm">Create New Case</Button></Link>
            <Link to="/cases/bulk-upload"><Button variant="outline" size="sm">Bulk Upload</Button></Link>
            <Link to="/cases"><Button variant="outline" size="sm">View Cases</Button></Link>
          </div>
        </div>
      )}

      {/* Liaison quick actions */}
      {isLiaison && (
        <div className="govt-card p-4 mb-4">
          <h3 className="text-xs font-semibold text-foreground mb-3">Today's Priority</h3>
          <div className="flex gap-3 mb-3">
            <StatsCard title="Hearings Today" value={upcomingHearings.length} icon={Gavel} className="flex-1" href="/hearings" accent="warning" />
            <StatsCard title="Compliance Pending" value={compliancePending.length} icon={Clock} className="flex-1" href="/compliance" accent="urgent" />
          </div>
          <Link to="/court-liaison"><Button size="sm"><Gavel className="h-3.5 w-3.5 mr-1.5" />Open Daily Update Desk</Button></Link>
        </div>
      )}

      {/* Core KPI cards - clickable */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2.5 mb-4">
        <StatsCard title="Total Cases" value={isDeptNodal || isMandalUser ? userCases.length : cases.length} icon={Briefcase} href="/cases" />
        <StatsCard title="Fresh" value={isDeptNodal || isMandalUser ? userCases.filter(c => c.status === "Fresh").length : freshCases.length} icon={TrendingUp} href="/cases?status=Fresh" accent="success" />
        <StatsCard title="Ongoing" value={isDeptNodal || isMandalUser ? userActiveCases.length : ongoingCases.length} icon={Clock} href="/cases?status=Ongoing" accent="info" />
        <StatsCard title="Closed" value={isDeptNodal || isMandalUser ? userCases.filter(c => c.status === "Closed").length : closedCases.length} icon={CheckCircle2} href="/cases?status=Closed" />
        <StatsCard title="Hearings Due" value={upcomingHearings.length} icon={CalendarDays} href="/hearings" accent="warning" />
        <StatsCard title="Appeals" value={appeals.length} icon={Scale} href="/appeals" accent="info" />
        <StatsCard title="Alerts" value={pendingAlerts.length} icon={AlertTriangle} href="/alerts" accent="urgent" />
      </div>

      {/* Compliance + Collectorate KPI row */}
      {(showFullDashboard || isReadOnly) && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-4">
          <StatsCard title="Orders Complied" value={complied.length} icon={CheckCircle2} href="/compliance" accent="success" />
          <StatsCard title="Compliance Pending" value={compliancePending.length} icon={Clock} href="/compliance" accent="urgent" />
          <StatsCard title="Partially Complied" value={compliancePartial.length} icon={AlertTriangle} href="/compliance" accent="warning" />
          <StatsCard title="Collectorate Respondent" value={collectRespondent.length} icon={Building2} href="/cases?involvement=Collectorate+as+Respondent" />
          <StatsCard title="Land Disputes" value={landDisputes.length} icon={MapPin} href="/cases?land=true" accent="urgent" />
          <StatsCard title="Long-Pending" value={longPendingCases.length} icon={FileText} subtitle=">1 year" href="/cases" accent="warning" />
        </div>
      )}

      {/* Collector-specific blocks */}
      {isCollector && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-4">
          <StatsCard title="Collectorate as Respondent" value={collectRespondent.length} icon={Landmark} href="/cases?involvement=Collectorate+as+Respondent" accent="urgent" />
          <StatsCard title="Collectorate as Co-Respondent" value={collectCoRespondent.length} icon={Building2} href="/cases?involvement=Collectorate+as+Co-Respondent" accent="warning" />
          <StatsCard title="Last 7 Days Updates" value={last7Days.length} icon={Activity} href="/cases" accent="info" />
          <StatsCard title="High Priority Land" value={cases.filter(c => c.landDisputeFlag && c.priority === "High").length} icon={MapPin} href="/cases?land=true" accent="urgent" />
        </div>
      )}

      {/* Department Quick Access Tiles */}
      {(showFullDashboard || isReadOnly) && (
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
      {(showFullDashboard || isReadOnly) && (
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
      {(showFullDashboard || isReadOnly) && (
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
      {(showFullDashboard || isReadOnly) && deptCompliance.length > 0 && (
        <div className="govt-card mb-4">
          <div className="govt-card-header"><h3>Pending Compliance by Department</h3></div>
          <table className="w-full govt-table">
            <thead><tr><th>Department</th><th>Pending</th><th>Partially Complied</th><th>Complied</th></tr></thead>
            <tbody>{deptCompliance.map(d => (<tr key={d.dept}><td className="text-xs font-medium">{d.dept}</td><td className="text-xs text-orange-600 font-semibold">{d.pending || "-"}</td><td className="text-xs text-amber-600 font-semibold">{d.partial || "-"}</td><td className="text-xs text-emerald-700 font-semibold">{d.complied || "-"}</td></tr>))}</tbody>
          </table>
        </div>
      )}

      {/* Upcoming Hearings + Land Disputes */}
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

      {/* Last 7 Days + Alerts */}
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
    </AppLayout>
  );
}
