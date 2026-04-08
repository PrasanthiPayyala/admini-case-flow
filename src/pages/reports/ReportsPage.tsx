import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, FileSpreadsheet } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { cases, caseTypes, mandals } from "@/data/sampleData";

// Case Type report data
const caseTypeReport = caseTypes
  .map(ct => ({ type: ct, count: cases.filter(c => c.caseType === ct).length }))
  .filter(d => d.count > 0);

const caseTypeColors = ["hsl(215,55%,28%)", "hsl(142,50%,40%)", "hsl(35,80%,50%)", "hsl(25,85%,50%)", "hsl(270,40%,50%)", "hsl(207,60%,45%)", "hsl(0,60%,50%)", "hsl(180,40%,45%)"];

// Court-wise data
const courtData = (() => {
  const map: Record<string, number> = {};
  cases.forEach(c => { map[c.court] = (map[c.court] || 0) + 1; });
  return Object.entries(map).map(([court, count]) => ({ court, cases: count }));
})();

// Mandal-wise data
const mandalReport = (() => {
  const map: Record<string, { active: number; closed: number }> = {};
  cases.forEach(c => {
    if (!map[c.mandal]) map[c.mandal] = { active: 0, closed: 0 };
    if (c.status === "Closed") map[c.mandal].closed++;
    else map[c.mandal].active++;
  });
  return Object.entries(map).map(([mandal, d]) => ({ mandal, ...d, total: d.active + d.closed }));
})();

// Respondent data
const respondentReport = (() => {
  const map: Record<string, number> = {};
  cases.forEach(c => { map[c.respondent] = (map[c.respondent] || 0) + 1; });
  return Object.entries(map).map(([respondent, count]) => ({ respondent, cases: count })).sort((a, b) => b.cases - a.cases);
})();

// Co-Respondent data
const coRespondentReport = (() => {
  const map: Record<string, number> = {};
  cases.forEach(c => c.coRespondents.forEach(cr => { map[cr] = (map[cr] || 0) + 1; }));
  return Object.entries(map).map(([name, count]) => ({ name, cases: count })).sort((a, b) => b.cases - a.cases);
})();

// Officer workload
const officerData = (() => {
  const map: Record<string, { active: number; closed: number }> = {};
  cases.forEach(c => {
    if (!map[c.assignedOfficer]) map[c.assignedOfficer] = { active: 0, closed: 0 };
    if (c.status === "Closed") map[c.assignedOfficer].closed++;
    else map[c.assignedOfficer].active++;
  });
  return Object.entries(map).map(([officer, d]) => ({ officer, ...d }));
})();

const trendData = [
  { month: "Sep", cases: 2 },
  { month: "Oct", cases: 3 },
  { month: "Nov", cases: 4 },
  { month: "Dec", cases: 5 },
  { month: "Jan", cases: 4 },
  { month: "Feb", cases: 5 },
  { month: "Mar", cases: 7 },
  { month: "Apr", cases: 8 },
];

// Long-pending
const longPending = cases.filter(c => {
  if (c.status === "Closed") return false;
  const diff = (new Date("2024-04-08").getTime() - new Date(c.filingDate).getTime()) / (1000 * 60 * 60 * 24);
  return diff > 180;
});

export default function ReportsPage() {
  const activeCases = cases.filter(c => c.status !== "Closed");

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
            <SelectTrigger className="w-[150px] h-9 text-sm"><SelectValue placeholder="Case Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Case Types</SelectItem>
              {caseTypes.map(ct => (
                <SelectItem key={ct} value={ct.toLowerCase().replace(/\s/g, '-')}>{ct}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[150px] h-9 text-sm"><SelectValue placeholder="Court" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courts</SelectItem>
              <SelectItem value="hc">High Court</SelectItem>
              <SelectItem value="dc">District Court</SelectItem>
              <SelectItem value="tribunal">Tribunal</SelectItem>
              <SelectItem value="consumer">Consumer Forum</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[150px] h-9 text-sm"><SelectValue placeholder="Mandal" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Mandals</SelectItem>
              {mandals.map(m => (
                <SelectItem key={m} value={m.toLowerCase()}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[150px] h-9 text-sm"><SelectValue placeholder="Officer" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Officers</SelectItem>
              <SelectItem value="srinivas">K. Srinivas Rao</SelectItem>
              <SelectItem value="padma">S. Padma Kumari</SelectItem>
              <SelectItem value="rajender">D. Rajender</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm">Generate Report</Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {[
          { label: "Total Cases", val: String(cases.length) },
          { label: "Active Cases", val: String(activeCases.length) },
          { label: "Closed Cases", val: String(cases.filter(c => c.status === "Closed").length) },
          { label: "Total Appeals", val: "2" },
          { label: "Long-Pending", val: String(longPending.length) },
        ].map(s => (
          <div key={s.label} className="govt-card p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{s.val}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row 1: Case Type + Court */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="govt-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Case Type-wise Distribution</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={caseTypeReport} cx="50%" cy="50%" outerRadius={85} dataKey="count" nameKey="type" label={({ type, count }) => `${type}: ${count}`} fontSize={10}>
                {caseTypeReport.map((_, i) => <Cell key={i} fill={caseTypeColors[i % caseTypeColors.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="govt-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Court-wise Case Distribution</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={courtData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,20%,88%)" />
              <XAxis type="number" fontSize={11} stroke="hsl(215,14%,45%)" />
              <YAxis type="category" dataKey="court" fontSize={10} stroke="hsl(215,14%,45%)" width={160} />
              <Tooltip />
              <Bar dataKey="cases" fill="hsl(215,55%,28%)" radius={[0,3,3,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2: Mandal + Trend */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="govt-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Mandal-wise Case Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={mandalReport}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,20%,88%)" />
              <XAxis dataKey="mandal" fontSize={10} stroke="hsl(215,14%,45%)" />
              <YAxis fontSize={11} stroke="hsl(215,14%,45%)" />
              <Tooltip />
              <Bar dataKey="active" fill="hsl(215,55%,28%)" name="Active" radius={[3,3,0,0]} stackId="a" />
              <Bar dataKey="closed" fill="hsl(142,50%,40%)" name="Closed" radius={[3,3,0,0]} stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="govt-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Case Filing Trend</h3>
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

      {/* Mandal-wise Summary Table */}
      <div className="govt-card mb-6">
        <div className="px-5 py-3 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Mandal-wise Summary</h3>
        </div>
        <table className="w-full govt-table">
          <thead>
            <tr><th>Mandal</th><th>Active Cases</th><th>Closed Cases</th><th>Total</th></tr>
          </thead>
          <tbody>
            {mandalReport.map(m => (
              <tr key={m.mandal}>
                <td className="font-medium">{m.mandal}</td>
                <td>{m.active}</td>
                <td>{m.closed}</td>
                <td className="font-semibold">{m.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Respondent-wise + Co-Respondent */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="govt-card">
          <div className="px-5 py-3 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">Respondent-wise Summary</h3>
          </div>
          <table className="w-full govt-table">
            <thead>
              <tr><th>Respondent</th><th>Cases</th></tr>
            </thead>
            <tbody>
              {respondentReport.map(r => (
                <tr key={r.respondent}>
                  <td className="font-medium max-w-[250px] truncate">{r.respondent}</td>
                  <td>{r.cases}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="govt-card">
          <div className="px-5 py-3 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">Co-Respondent-wise Summary</h3>
          </div>
          <table className="w-full govt-table">
            <thead>
              <tr><th>Co-Respondent</th><th>Cases</th></tr>
            </thead>
            <tbody>
              {coRespondentReport.map(r => (
                <tr key={r.name}>
                  <td className="font-medium max-w-[250px] truncate">{r.name}</td>
                  <td>{r.cases}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Long Pending Cases */}
      <div className="govt-card mb-6">
        <div className="px-5 py-3 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Long-Pending Cases Report (&gt;6 months)</h3>
        </div>
        <table className="w-full govt-table">
          <thead>
            <tr><th>Case Number</th><th>Title</th><th>Case Type</th><th>Court</th><th>Mandal</th><th>Filed</th><th>Status</th><th>Officer</th></tr>
          </thead>
          <tbody>
            {longPending.length > 0 ? longPending.map(c => (
              <tr key={c.id}>
                <td className="font-medium">{c.caseNumber}</td>
                <td className="max-w-[160px] truncate">{c.title}</td>
                <td className="text-xs">{c.caseType}</td>
                <td className="text-xs max-w-[120px] truncate">{c.court}</td>
                <td className="text-xs">{c.mandal}</td>
                <td className="text-xs">{c.filingDate}</td>
                <td><span className="px-2 py-0.5 rounded text-xs font-medium bg-status-urgent/10 text-status-urgent">{c.status}</span></td>
                <td className="text-xs">{c.assignedOfficer}</td>
              </tr>
            )) : (
              <tr><td colSpan={8} className="text-center text-muted-foreground py-4">No long-pending cases</td></tr>
            )}
          </tbody>
        </table>
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
