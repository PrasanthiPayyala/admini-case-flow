import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatsCard } from "@/components/shared/StatsCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { cases, hearings, alerts, caseTypes, mandals, departments } from "@/data/sampleData";
import {
  Briefcase, Scale, CalendarDays, Bell, AlertTriangle, CheckCircle2,
  Clock, TrendingUp, MapPin, Gavel, Building2, ShieldCheck, FileText, Activity
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const statusData = [
  { name: "Fresh", value: cases.filter(c => c.status === "Fresh").length, color: "hsl(142,50%,40%)" },
  { name: "Ongoing", value: cases.filter(c => c.status === "Ongoing").length, color: "hsl(207,60%,45%)" },
  { name: "Hearing Scheduled", value: cases.filter(c => c.status === "Hearing Scheduled").length, color: "hsl(35,80%,50%)" },
  { name: "Counter Pending", value: cases.filter(c => c.status === "Counter Pending").length, color: "hsl(25,85%,50%)" },
  { name: "Under Review", value: cases.filter(c => c.status === "Under Review").length, color: "hsl(270,40%,50%)" },
  { name: "Appealed", value: cases.filter(c => c.status === "Appealed").length, color: "hsl(270,40%,50%)" },
  { name: "Closed", value: cases.filter(c => c.status === "Closed").length, color: "hsl(215,15%,55%)" },
].filter(d => d.value > 0);

const caseTypeData = caseTypes.map(ct => ({ name: ct, value: cases.filter(c => c.caseType === ct).length })).filter(d => d.value > 0);
const caseTypeColors = ["hsl(215,55%,28%)", "hsl(142,50%,40%)", "hsl(35,80%,50%)", "hsl(25,85%,50%)", "hsl(270,40%,50%)", "hsl(207,60%,45%)", "hsl(0,60%,50%)", "hsl(180,40%,45%)", "hsl(320,40%,50%)"];

const courtData = (() => {
  const m: Record<string, number> = {};
  cases.forEach(c => { m[c.court] = (m[c.court] || 0) + 1; });
  return Object.entries(m).map(([court, count]) => ({ court, cases: count }));
})();

const mandalData = (() => {
  const m: Record<string, number> = {};
  cases.forEach(c => { if (c.mandal) m[c.mandal] = (m[c.mandal] || 0) + 1; });
  return Object.entries(m).map(([mandal, count]) => ({ mandal, cases: count })).sort((a, b) => b.cases - a.cases);
})();

const deptData = (() => {
  const m: Record<string, number> = {};
  cases.forEach(c => { m[c.department] = (m[c.department] || 0) + 1; });
  return Object.entries(m).map(([dept, count]) => ({ dept, cases: count })).sort((a, b) => b.cases - a.cases);
})();

const priorityData = (() => {
  const m: Record<string, number> = {};
  cases.forEach(c => { m[c.priority] = (m[c.priority] || 0) + 1; });
  return Object.entries(m).map(([priority, count]) => ({ priority, cases: count }));
})();

const longPendingCases = cases.filter(c => {
  if (c.status === "Closed") return false;
  const diff = (new Date("2024-04-08").getTime() - new Date(c.filingDate).getTime()) / (1000 * 60 * 60 * 24);
  return diff > 180;
});

const collectRespondent = cases.filter(c => c.collectorateInvolvement === "Collectorate as Respondent");
const collectCoRespondent = cases.filter(c => c.collectorateInvolvement === "Collectorate as Co-Respondent");
const landDisputes = cases.filter(c => c.landDisputeFlag && c.status !== "Closed");
const compliancePending = cases.filter(c => c.complianceRequired && c.complianceStatus === "Pending");
const compliancePartial = cases.filter(c => c.complianceRequired && c.complianceStatus === "Partially Complied");
const complied = cases.filter(c => c.complianceRequired && c.complianceStatus === "Complied");
const last7Days = cases.filter(c => {
  const d = new Date(c.lastUpdated);
  const ref = new Date("2024-04-08");
  return (ref.getTime() - d.getTime()) / (1000 * 60 * 60 * 24) <= 7;
});

const monthlyData = [
  { month: "Oct", filed: 2, closed: 0 }, { month: "Nov", filed: 1, closed: 0 }, { month: "Dec", filed: 0, closed: 0 },
  { month: "Jan", filed: 3, closed: 0 }, { month: "Feb", filed: 2, closed: 0 }, { month: "Mar", filed: 5, closed: 1 },
  { month: "Apr", filed: 5, closed: 1 },
];

export default function Dashboard() {
  const upcomingHearings = hearings.filter(h => h.status === "Scheduled");
  const pendingAlerts = alerts.filter(a => a.status !== "Sent");
  const freshCases = cases.filter(c => c.status === "Fresh");
  const activeCases = cases.filter(c => c.status !== "Closed");

  return (
    <AppLayout>
      <PageHeader title="Dashboard" breadcrumbs={[{ label: "Home", href: "/" }, { label: "Dashboard" }]} />

      {/* Row 1: Core stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-5">
        <StatsCard title="Total Cases" value={cases.length} icon={Briefcase} subtitle="All registered" />
        <StatsCard title="Active Cases" value={activeCases.length} icon={Clock} subtitle="Ongoing matters" />
        <StatsCard title="Fresh Cases" value={freshCases.length} icon={TrendingUp} subtitle="Newly filed" />
        <StatsCard title="Upcoming Hearings" value={upcomingHearings.length} icon={CalendarDays} subtitle="Scheduled" />
        <StatsCard title="Appeals" value={2} icon={Scale} subtitle="Total appeals" />
        <StatsCard title="Pending Alerts" value={pendingAlerts.length} icon={AlertTriangle} subtitle="Action needed" />
      </div>

      {/* Row 2: Compliance + Collectorate + Land */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-5">
        <StatsCard title="Orders Complied" value={complied.length} icon={CheckCircle2} subtitle="Fully complied" />
        <StatsCard title="Compliance Pending" value={compliancePending.length} icon={Clock} subtitle="Awaiting action" />
        <StatsCard title="Partially Complied" value={compliancePartial.length} icon={AlertTriangle} />
        <StatsCard title="Collectorate as Respondent" value={collectRespondent.length} icon={Building2} />
        <StatsCard title="Land Disputes (Active)" value={landDisputes.length} icon={MapPin} subtitle="Sensitive matters" />
        <StatsCard title="Updated Last 7 Days" value={last7Days.length} icon={Activity} />
      </div>

      {/* Charts Row 1: Status + Case Type */}
      <div className="grid md:grid-cols-2 gap-5 mb-5">
        <div className="govt-card p-4">
          <h3 className="text-xs font-semibold text-foreground mb-3">Cases by Status</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart><Pie data={statusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`} fontSize={9}>
              {statusData.map((e, i) => <Cell key={i} fill={e.color} />)}
            </Pie><Tooltip /></PieChart>
          </ResponsiveContainer>
        </div>
        <div className="govt-card p-4">
          <h3 className="text-xs font-semibold text-foreground mb-3">Cases by Case Type</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart><Pie data={caseTypeData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`} fontSize={9}>
              {caseTypeData.map((_, i) => <Cell key={i} fill={caseTypeColors[i % caseTypeColors.length]} />)}
            </Pie><Tooltip /></PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2: Court + Mandal */}
      <div className="grid md:grid-cols-2 gap-5 mb-5">
        <div className="govt-card p-4">
          <h3 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5"><Gavel className="h-3.5 w-3.5" />Cases by Court</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={courtData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,20%,88%)" />
              <XAxis type="number" fontSize={10} stroke="hsl(215,14%,45%)" />
              <YAxis type="category" dataKey="court" fontSize={9} stroke="hsl(215,14%,45%)" width={140} />
              <Tooltip /><Bar dataKey="cases" fill="hsl(215,55%,28%)" radius={[0,3,3,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="govt-card p-4">
          <h3 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />Cases by Mandal</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mandalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,20%,88%)" />
              <XAxis dataKey="mandal" fontSize={9} stroke="hsl(215,14%,45%)" />
              <YAxis fontSize={10} stroke="hsl(215,14%,45%)" />
              <Tooltip /><Bar dataKey="cases" fill="hsl(142,50%,40%)" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 3: Department + Priority */}
      <div className="grid md:grid-cols-2 gap-5 mb-5">
        <div className="govt-card p-4">
          <h3 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" />Cases by Department</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={deptData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,20%,88%)" />
              <XAxis type="number" fontSize={10} stroke="hsl(215,14%,45%)" />
              <YAxis type="category" dataKey="dept" fontSize={9} stroke="hsl(215,14%,45%)" width={160} />
              <Tooltip /><Bar dataKey="cases" fill="hsl(35,80%,50%)" radius={[0,3,3,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="govt-card p-4">
          <h3 className="text-xs font-semibold text-foreground mb-3">Cases by Priority</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={priorityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,20%,88%)" />
              <XAxis dataKey="priority" fontSize={9} stroke="hsl(215,14%,45%)" />
              <YAxis fontSize={10} stroke="hsl(215,14%,45%)" />
              <Tooltip /><Bar dataKey="cases" fill="hsl(0,60%,50%)" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="govt-card p-4 mb-5">
        <h3 className="text-xs font-semibold text-foreground mb-3">Monthly Case Inflow vs Closure</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,20%,88%)" />
            <XAxis dataKey="month" fontSize={10} stroke="hsl(215,14%,45%)" />
            <YAxis fontSize={10} stroke="hsl(215,14%,45%)" />
            <Tooltip />
            <Bar dataKey="filed" fill="hsl(215,55%,28%)" name="Filed" radius={[3,3,0,0]} />
            <Bar dataKey="closed" fill="hsl(142,50%,40%)" name="Closed" radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Compliance Summary + Collectorate Involvement */}
      <div className="grid md:grid-cols-2 gap-5 mb-5">
        <div className="govt-card">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" />Compliance Summary</h3>
          </div>
          <div className="p-4 grid grid-cols-2 gap-3">
            {[
              { label: "Complied", val: complied.length, cls: "text-status-success" },
              { label: "Pending", val: compliancePending.length, cls: "text-status-urgent" },
              { label: "Partially Complied", val: compliancePartial.length, cls: "text-status-warning" },
              { label: "Total Orders", val: cases.filter(c => c.orderPassed).length, cls: "text-foreground" },
            ].map(s => (
              <div key={s.label} className="text-center p-3 bg-muted/50 rounded">
                <p className={`text-xl font-bold ${s.cls}`}>{s.val}</p>
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="govt-card">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" />Collectorate Involvement</h3>
          </div>
          <div className="p-4 grid grid-cols-2 gap-3">
            {[
              { label: "As Respondent", val: collectRespondent.length },
              { label: "As Co-Respondent", val: collectCoRespondent.length },
              { label: "Dept. Involved", val: cases.filter(c => c.collectorateInvolvement === "Department Involved").length },
              { label: "Monitoring Only", val: cases.filter(c => c.collectorateInvolvement === "Monitoring Only").length },
            ].map(s => (
              <div key={s.label} className="text-center p-3 bg-muted/50 rounded">
                <p className="text-xl font-bold text-foreground">{s.val}</p>
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tables Row 1: Upcoming Hearings + Land Disputes */}
      <div className="grid md:grid-cols-2 gap-5 mb-5">
        <div className="govt-card">
          <div className="px-4 py-3 border-b border-border"><h3 className="text-xs font-semibold text-foreground">Upcoming Hearings</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full govt-table">
              <thead><tr><th>Case</th><th>Court</th><th>Date</th><th>Officer</th></tr></thead>
              <tbody>
                {upcomingHearings.slice(0, 6).map(h => (
                  <tr key={h.id}>
                    <td className="font-medium text-foreground text-xs">{h.caseTitle}</td>
                    <td className="text-[10px]">{h.court}</td>
                    <td className="text-xs">{h.date}</td>
                    <td className="text-xs">{h.officer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="govt-card">
          <div className="px-4 py-3 border-b border-border"><h3 className="text-xs font-semibold text-foreground">Active Land Disputes (Sensitive)</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full govt-table">
              <thead><tr><th>Case</th><th>Mandal</th><th>Priority</th><th>Status</th></tr></thead>
              <tbody>
                {landDisputes.map(c => (
                  <tr key={c.id}>
                    <td className="font-medium text-foreground text-xs max-w-[160px] truncate">{c.title}</td>
                    <td className="text-xs">{c.mandal}</td>
                    <td><StatusBadge value={c.priority} type="priority" /></td>
                    <td><StatusBadge value={c.status} /></td>
                  </tr>
                ))}
                {landDisputes.length === 0 && <tr><td colSpan={4} className="text-center text-muted-foreground py-4 text-xs">None</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Tables Row 2: Long Pending + Last 7 Days */}
      <div className="grid md:grid-cols-2 gap-5 mb-5">
        <div className="govt-card">
          <div className="px-4 py-3 border-b border-border"><h3 className="text-xs font-semibold text-foreground">Long-Pending Cases (&gt;6 months)</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full govt-table">
              <thead><tr><th>Case</th><th>Mandal</th><th>Filed</th><th>Status</th></tr></thead>
              <tbody>
                {longPendingCases.length > 0 ? longPendingCases.map(c => (
                  <tr key={c.id}>
                    <td className="font-medium text-foreground text-xs">{c.title}</td>
                    <td className="text-xs">{c.mandal}</td>
                    <td className="text-xs">{c.filingDate}</td>
                    <td><StatusBadge value={c.status} /></td>
                  </tr>
                )) : <tr><td colSpan={4} className="text-center text-muted-foreground py-4 text-xs">None</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
        <div className="govt-card">
          <div className="px-4 py-3 border-b border-border"><h3 className="text-xs font-semibold text-foreground">Cases Updated in Last 7 Days</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full govt-table">
              <thead><tr><th>Case</th><th>Department</th><th>Last Updated</th><th>Status</th></tr></thead>
              <tbody>
                {last7Days.map(c => (
                  <tr key={c.id}>
                    <td className="font-medium text-foreground text-xs max-w-[160px] truncate">{c.title}</td>
                    <td className="text-[10px]">{c.department}</td>
                    <td className="text-xs">{c.lastUpdated}</td>
                    <td><StatusBadge value={c.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="govt-card">
        <div className="px-4 py-3 border-b border-border"><h3 className="text-xs font-semibold text-foreground">Recent Alerts</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full govt-table">
            <thead><tr><th>Type</th><th>Alert</th><th>Officer</th><th>Priority</th><th>Status</th></tr></thead>
            <tbody>
              {alerts.slice(0, 6).map(a => (
                <tr key={a.id}>
                  <td className="text-xs font-medium">{a.type}</td>
                  <td className="max-w-[250px] truncate text-xs">{a.message}</td>
                  <td className="text-xs">{a.officer}</td>
                  <td><StatusBadge value={a.priority} type="priority" /></td>
                  <td><StatusBadge value={a.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
