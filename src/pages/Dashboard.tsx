import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatsCard } from "@/components/shared/StatsCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { cases, hearings, alerts } from "@/data/sampleData";
import {
  Briefcase, Scale, CalendarDays, Bell, AlertTriangle, CheckCircle2,
  Clock, TrendingUp
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const statusData = [
  { name: "Fresh", value: 1, color: "hsl(142,50%,40%)" },
  { name: "Ongoing", value: 1, color: "hsl(207,60%,45%)" },
  { name: "Hearing Scheduled", value: 1, color: "hsl(35,80%,50%)" },
  { name: "Counter Pending", value: 1, color: "hsl(25,85%,50%)" },
  { name: "Appealed", value: 1, color: "hsl(270,40%,50%)" },
  { name: "Closed", value: 1, color: "hsl(215,15%,55%)" },
];

const monthlyData = [
  { month: "Oct", filed: 3, closed: 1 },
  { month: "Nov", filed: 2, closed: 2 },
  { month: "Dec", filed: 4, closed: 1 },
  { month: "Jan", filed: 2, closed: 0 },
  { month: "Feb", filed: 3, closed: 1 },
  { month: "Mar", filed: 1, closed: 0 },
];

export default function Dashboard() {
  const upcomingHearings = hearings.filter(h => h.status === "Scheduled");
  const pendingAlerts = alerts.filter(a => a.status !== "Sent");

  return (
    <AppLayout>
      <PageHeader
        title="Dashboard"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Dashboard" }]}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatsCard title="Total Cases" value={cases.length} icon={Briefcase} subtitle="All registered cases" />
        <StatsCard title="Ongoing" value={cases.filter(c => c.status !== "Closed").length} icon={Clock} subtitle="Active matters" />
        <StatsCard title="Upcoming Hearings" value={upcomingHearings.length} icon={CalendarDays} subtitle="Scheduled hearings" />
        <StatsCard title="Pending Alerts" value={pendingAlerts.length} icon={AlertTriangle} subtitle="Action required" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatsCard title="Fresh Cases" value={1} icon={TrendingUp} />
        <StatsCard title="Appeals" value={2} icon={Scale} />
        <StatsCard title="Closed Cases" value={1} icon={CheckCircle2} />
        <StatsCard title="Urgent Alerts" value={alerts.filter(a => a.priority === "Urgent").length} icon={Bell} />
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="govt-card p-5">
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
      </div>

      {/* Tables */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="govt-card">
          <div className="px-5 py-3 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">Upcoming Hearings</h3>
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
                    <td>{h.court}</td>
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
