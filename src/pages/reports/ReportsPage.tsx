import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, FileText, FileSpreadsheet } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const courtData = [
  { court: "High Court", cases: 3 },
  { court: "District Court", cases: 1 },
  { court: "Tribunal", cases: 1 },
  { court: "Consumer Forum", cases: 1 },
];

const officerData = [
  { officer: "K. Srinivas Rao", active: 3, closed: 0 },
  { officer: "S. Padma Kumari", active: 2, closed: 0 },
  { officer: "D. Rajender", active: 1, closed: 1 },
];

const trendData = [
  { month: "Sep", cases: 2 },
  { month: "Oct", cases: 3 },
  { month: "Nov", cases: 4 },
  { month: "Dec", cases: 5 },
  { month: "Jan", cases: 4 },
  { month: "Feb", cases: 5 },
  { month: "Mar", cases: 6 },
];

export default function ReportsPage() {
  return (
    <AppLayout>
      <PageHeader
        title="Reports & Analytics"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Reports" }]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><FileText className="h-3.5 w-3.5 mr-1.5" />Export PDF</Button>
            <Button variant="outline" size="sm"><FileSpreadsheet className="h-3.5 w-3.5 mr-1.5" />Export Excel</Button>
          </div>
        }
      />

      {/* Filters */}
      <div className="govt-card p-4 mb-6">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="space-y-1">
            <Label className="text-xs">From Date</Label>
            <Input type="date" className="h-9 text-sm w-[160px]" defaultValue="2024-01-01" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">To Date</Label>
            <Input type="date" className="h-9 text-sm w-[160px]" defaultValue="2024-04-07" />
          </div>
          <Select>
            <SelectTrigger className="w-[160px] h-9 text-sm"><SelectValue placeholder="Department" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="revenue">Revenue</SelectItem>
              <SelectItem value="admin">Administration</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[160px] h-9 text-sm"><SelectValue placeholder="Court" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courts</SelectItem>
              <SelectItem value="hc">High Court</SelectItem>
              <SelectItem value="dc">District Court</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm">Generate Report</Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Cases", val: "6" },
          { label: "Active Cases", val: "5" },
          { label: "Closed Cases", val: "1" },
          { label: "Total Appeals", val: "2" },
        ].map(s => (
          <div key={s.label} className="govt-card p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{s.val}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="govt-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Court-wise Case Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={courtData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,20%,88%)" />
              <XAxis type="number" fontSize={11} stroke="hsl(215,14%,45%)" />
              <YAxis type="category" dataKey="court" fontSize={11} stroke="hsl(215,14%,45%)" width={100} />
              <Tooltip />
              <Bar dataKey="cases" fill="hsl(215,55%,28%)" radius={[0,3,3,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="govt-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Case Trend (Last 7 Months)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,20%,88%)" />
              <XAxis dataKey="month" fontSize={11} stroke="hsl(215,14%,45%)" />
              <YAxis fontSize={11} stroke="hsl(215,14%,45%)" />
              <Tooltip />
              <Line type="monotone" dataKey="cases" stroke="hsl(215,55%,28%)" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Officer Workload */}
      <div className="govt-card">
        <div className="px-5 py-3 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Officer Workload Summary</h3>
        </div>
        <table className="w-full govt-table">
          <thead>
            <tr><th>Officer</th><th>Active Cases</th><th>Closed Cases</th><th>Total</th></tr>
          </thead>
          <tbody>
            {officerData.map(o => (
              <tr key={o.officer}>
                <td className="font-medium">{o.officer}</td>
                <td>{o.active}</td>
                <td>{o.closed}</td>
                <td className="font-semibold">{o.active + o.closed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}
