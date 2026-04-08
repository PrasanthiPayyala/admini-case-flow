import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatsCard } from "@/components/shared/StatsCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { cases, hearings, alerts, caseTypes, mandals } from "@/data/sampleData";
import {
  Briefcase, Scale, CalendarDays, Bell, AlertTriangle, CheckCircle2,
  Clock, TrendingUp, MapPin, Gavel
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const statusData = [
  { name: "Fresh", value: cases.filter(c => c.status === "Fresh").length, color: "hsl(142,50%,40%)" },
  { name: "Ongoing", value: cases.filter(c => c.status === "Ongoing").length, color: "hsl(207,60%,45%)" },
  { name: "Hearing Scheduled", value: cases.filter(c => c.status === "Hearing Scheduled").length, color: "hsl(35,80%,50%)" },
  { name: "Counter Pending", value: cases.filter(c => c.status === "Counter Pending").length, color: "hsl(25,85%,50%)" },
  { name: "Appealed", value: cases.filter(c => c.status === "Appealed").length, color: "hsl(270,40%,50%)" },
  { name: "Closed", value: cases.filter(c => c.status === "Closed").length, color: "hsl(215,15%,55%)" },
];

const caseTypeData = caseTypes
  .map(ct => ({ name: ct, value: cases.filter(c => c.caseType === ct).length }))
  .filter(d => d.value > 0);

const caseTypeColors = ["hsl(215,55%,28%)", "hsl(142,50%,40%)", "hsl(35,80%,50%)", "hsl(25,85%,50%)", "hsl(270,40%,50%)", "hsl(207,60%,45%)", "hsl(0,60%,50%)", "hsl(180,40%,45%)"];

const courtData = (() => {
  const courtMap: Record<string, number> = {};
  cases.forEach(c => { courtMap[c.court] = (courtMap[c.court] || 0) + 1; });
  return Object.entries(courtMap).map(([court, count]) => ({ court, cases: count }));
})();

const mandalData = (() => {
  const map: Record<string, number> = {};
  cases.forEach(c => { if (c.mandal) map[c.mandal] = (map[c.mandal] || 0) + 1; });
  return Object.entries(map).map(([mandal, count]) => ({ mandal, cases: count })).sort((a, b) => b.cases - a.cases);
})();

const monthlyData = [
  { month: "Oct", filed: 3, closed: 1 },
  { month: "Nov", filed: 2, closed: 2 },
  { month: "Dec", filed: 4, closed: 1 },
  { month: "Jan", filed: 2, closed: 0 },
  { month: "Feb", filed: 3, closed: 1 },
  { month: "Mar", filed: 3, closed: 0 },
  { month: "Apr", filed: 2, closed: 0 },
];

const longPendingCases = cases.filter(c => {
  if (c.status === "Closed") return false;
  const filed = new Date(c.filingDate);
  const now = new Date("2024-04-08");
  const diffDays = (now.getTime() - filed.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays > 180;
});

export default function Dashboard() {
  const upcomingHearings = hearings.filter(h => h.status === "Scheduled");
  const pendingAlerts = alerts.filter(a => a.status !== "Sent");
  const freshCases = cases.filter(c => c.status === "Fresh");
  const activeCases = cases.filter(c => c.status !== "Closed");

  return (
    <AppLayout>
      <PageHeader
        title="Dashboard"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Dashboard" }]}
      />

      {/* Stats Row 1 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatsCard title="Total Cases" value={cases.length} icon={Briefcase} subtitle="All registered cases" />
        <StatsCard title="Active Cases" value={activeCases.length} icon={Clock} subtitle="Ongoing matters" />
        <StatsCard title="Upcoming Hearings" value={upcomingHearings.length} icon={CalendarDays} subtitle="Scheduled hearings" />
        <StatsCard title="Pending Alerts" value={pendingAlerts.length} icon={AlertTriangle} subtitle="Action required" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatsCard title="Fresh Cases" value={freshCases.length} icon={TrendingUp} />
        <StatsCard title="Appeals" value={2} icon={Scale} />
        <StatsCard title="Closed Cases" value={cases.filter(c => c.status === "Closed").length} icon={CheckCircle2} />
        <StatsCard title="Urgent Alerts" value={alerts.filter(a => a.priority === "Urgent").length} icon={Bell} />
      </div>

      {/* Charts Row 1: Status + Case Type */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="govt-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Cases by Status</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" outerRadius={85} dataKey="value" label={({ name, value }) => `${name}: ${value}`} fontSize={10}>
                {statusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="govt-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Cases by Case Type</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={caseTypeData} cx="50%" cy="50%" outerRadius={85} dataKey="value" label={({ name, value }) => `${name}: ${value}`} fontSize={10}>
                {caseTypeData.map((_, i) => <Cell key={i} fill={caseTypeColors[i % caseTypeColors.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2: Court + Mandal */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="govt-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2"><Gavel className="h-4 w-4" />Cases by Court</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={courtData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,20%,88%)" />
              <XAxis type="number" fontSize={11} stroke="hsl(215,14%,45%)" />
              <YAxis type="category" dataKey="court" fontSize={10} stroke="hsl(215,14%,45%)" width={160} />
              <Tooltip />
              <Bar dataKey="cases" fill="hsl(215,55%,28%)" radius={[0,3,3,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="govt-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2"><MapPin className="h-4 w-4" />Cases by Mandal</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={mandalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,20%,88%)" />
              <XAxis dataKey="mandal" fontSize={10} stroke="hsl(215,14%,45%)" />
              <YAxis fontSize={11} stroke="hsl(215,14%,45%)" />
              <Tooltip />
              <Bar dataKey="cases" fill="hsl(142,50%,40%)" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="govt-card p-5 mb-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Monthly Case Inflow vs Closure</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,20%,88%)" />
            <XAxis dataKey="month" fontSize={11} stroke="hsl(215,14%,45%)" />
            <YAxis fontSize={11} stroke="hsl(215,14%,45%)" />
            <Tooltip />
            <Bar dataKey="filed" fill="hsl(215,55%,28%)" name="Filed" radius={[3,3,0,0]} />
            <Bar dataKey="closed" fill="hsl(142,50%,40%)" name="Closed" radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tables */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="govt-card">
          <div className="px-5 py-3 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">Upcoming Hearings by Court</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full govt-table">
              <thead>
                <tr>
                  <th>Case</th>
                  <th>Court</th>
                  <th>Date</th>
                  <th>Officer</th>
                </tr>
              </thead>
              <tbody>
                {upcomingHearings.map(h => (
                  <tr key={h.id}>
                    <td className="font-medium text-foreground">{h.caseTitle}</td>
                    <td className="text-xs">{h.court}</td>
                    <td>{h.date}</td>
                    <td>{h.officer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="govt-card">
          <div className="px-5 py-3 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">Long-Pending Cases (&gt;6 months)</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full govt-table">
              <thead>
                <tr>
                  <th>Case</th>
                  <th>Mandal</th>
                  <th>Filed</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {longPendingCases.length > 0 ? longPendingCases.map(c => (
                  <tr key={c.id}>
                    <td className="font-medium text-foreground">{c.title}</td>
                    <td className="text-xs">{c.mandal}</td>
                    <td className="text-xs">{c.filingDate}</td>
                    <td><StatusBadge value={c.status} /></td>
                  </tr>
                )) : (
                  <tr><td colSpan={4} className="text-center text-muted-foreground py-4">No long-pending cases</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Alerts + Recent Filings */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="govt-card">
          <div className="px-5 py-3 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">Recent Filings</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full govt-table">
              <thead>
                <tr><th>Case</th><th>Type</th><th>Mandal</th><th>Filed</th></tr>
              </thead>
              <tbody>
                {[...cases].sort((a, b) => new Date(b.filingDate).getTime() - new Date(a.filingDate).getTime()).slice(0, 5).map(c => (
                  <tr key={c.id}>
                    <td className="font-medium text-foreground max-w-[180px] truncate">{c.title}</td>
                    <td className="text-xs">{c.caseType}</td>
                    <td className="text-xs">{c.mandal}</td>
                    <td className="text-xs">{c.filingDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="govt-card">
          <div className="px-5 py-3 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">Recent Alerts</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full govt-table">
              <thead>
                <tr>
                  <th>Alert</th>
                  <th>Priority</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {alerts.slice(0, 4).map(a => (
                  <tr key={a.id}>
                    <td className="max-w-[200px] truncate">{a.message}</td>
                    <td><StatusBadge value={a.priority} type="priority" /></td>
                    <td><StatusBadge value={a.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
