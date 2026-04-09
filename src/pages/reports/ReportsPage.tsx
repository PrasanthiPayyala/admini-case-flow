import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, FileSpreadsheet } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { cases, caseTypes, mandals, departments, priorities } from "@/data/sampleData";

const caseTypeReport = caseTypes.map(ct => ({ type: ct, count: cases.filter(c => c.caseType === ct).length })).filter(d => d.count > 0);
const caseTypeColors = ["hsl(215,55%,28%)", "hsl(142,50%,40%)", "hsl(35,80%,50%)", "hsl(25,85%,50%)", "hsl(270,40%,50%)", "hsl(207,60%,45%)", "hsl(0,60%,50%)", "hsl(180,40%,45%)", "hsl(320,40%,50%)"];

const courtData = (() => { const m: Record<string, number> = {}; cases.forEach(c => { m[c.court] = (m[c.court] || 0) + 1; }); return Object.entries(m).map(([court, count]) => ({ court, cases: count })); })();
const mandalReport = (() => { const m: Record<string, { active: number; closed: number }> = {}; cases.forEach(c => { if (!m[c.mandal]) m[c.mandal] = { active: 0, closed: 0 }; if (c.status === "Closed") m[c.mandal].closed++; else m[c.mandal].active++; }); return Object.entries(m).map(([mandal, d]) => ({ mandal, ...d, total: d.active + d.closed })); })();
const deptReport = (() => { const m: Record<string, { active: number; closed: number }> = {}; cases.forEach(c => { if (!m[c.department]) m[c.department] = { active: 0, closed: 0 }; if (c.status === "Closed") m[c.department].closed++; else m[c.department].active++; }); return Object.entries(m).map(([dept, d]) => ({ dept, ...d, total: d.active + d.closed })); })();
const respondentReport = (() => { const m: Record<string, number> = {}; cases.forEach(c => { m[c.respondent] = (m[c.respondent] || 0) + 1; }); return Object.entries(m).map(([r, count]) => ({ respondent: r, cases: count })).sort((a, b) => b.cases - a.cases); })();
const coRespondentReport = (() => { const m: Record<string, number> = {}; cases.forEach(c => c.coRespondents.forEach(cr => { m[cr] = (m[cr] || 0) + 1; })); return Object.entries(m).map(([name, count]) => ({ name, cases: count })).sort((a, b) => b.cases - a.cases); })();
const officerData = (() => { const m: Record<string, { active: number; closed: number }> = {}; cases.forEach(c => { if (!m[c.assignedOfficer]) m[c.assignedOfficer] = { active: 0, closed: 0 }; if (c.status === "Closed") m[c.assignedOfficer].closed++; else m[c.assignedOfficer].active++; }); return Object.entries(m).map(([officer, d]) => ({ officer, ...d })); })();
const complianceReport = (() => { const m: Record<string, number> = { "Complied": 0, "Pending": 0, "Partially Complied": 0, "Not Applicable": 0 }; cases.forEach(c => { m[c.complianceStatus] = (m[c.complianceStatus] || 0) + 1; }); return Object.entries(m).map(([status, count]) => ({ status, count })); })();
const collectInvReport = (() => { const m: Record<string, number> = {}; cases.forEach(c => { m[c.collectorateInvolvement] = (m[c.collectorateInvolvement] || 0) + 1; }); return Object.entries(m).map(([type, count]) => ({ type, count })); })();
const longPending = cases.filter(c => { if (c.status === "Closed") return false; return (new Date("2024-04-08").getTime() - new Date(c.filingDate).getTime()) / (1000*60*60*24) > 180; });
const last7Days = cases.filter(c => (new Date("2024-04-08").getTime() - new Date(c.lastUpdated).getTime()) / (1000*60*60*24) <= 7);
const trendData = [{ month: "Sep", cases: 1 }, { month: "Oct", cases: 2 }, { month: "Nov", cases: 1 }, { month: "Dec", cases: 0 }, { month: "Jan", cases: 3 }, { month: "Feb", cases: 2 }, { month: "Mar", cases: 5 }, { month: "Apr", cases: 5 }];

export default function ReportsPage() {
  return (
    <AppLayout>
      <PageHeader title="Reports & Analytics" breadcrumbs={[{ label: "Home", href: "/" }, { label: "Reports" }]}
        actions={<div className="flex gap-2"><Button variant="outline" size="sm"><FileText className="h-3.5 w-3.5 mr-1.5" />Export PDF</Button><Button variant="outline" size="sm"><FileSpreadsheet className="h-3.5 w-3.5 mr-1.5" />Export Excel</Button></div>} />

      {/* Filters */}
      <div className="govt-card p-3 mb-5">
        <div className="flex flex-wrap gap-2 items-end">
          <div className="space-y-0.5"><Label className="text-[10px]">From</Label><Input type="date" className="h-8 text-xs w-[140px]" defaultValue="2024-01-01" /></div>
          <div className="space-y-0.5"><Label className="text-[10px]">To</Label><Input type="date" className="h-8 text-xs w-[140px]" defaultValue="2024-04-07" /></div>
          <Select><SelectTrigger className="w-[120px] h-8 text-xs"><SelectValue placeholder="Case Type" /></SelectTrigger><SelectContent><SelectItem value="all">All Types</SelectItem>{caseTypes.map(ct => <SelectItem key={ct} value={ct}>{ct}</SelectItem>)}</SelectContent></Select>
          <Select><SelectTrigger className="w-[120px] h-8 text-xs"><SelectValue placeholder="Court" /></SelectTrigger><SelectContent><SelectItem value="all">All Courts</SelectItem></SelectContent></Select>
          <Select><SelectTrigger className="w-[120px] h-8 text-xs"><SelectValue placeholder="Mandal" /></SelectTrigger><SelectContent><SelectItem value="all">All Mandals</SelectItem>{mandals.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent></Select>
          <Select><SelectTrigger className="w-[120px] h-8 text-xs"><SelectValue placeholder="Department" /></SelectTrigger><SelectContent><SelectItem value="all">All Depts</SelectItem>{departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select>
          <Select><SelectTrigger className="w-[120px] h-8 text-xs"><SelectValue placeholder="Priority" /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem>{priorities.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select>
          <Button size="sm" className="h-8 text-xs">Generate</Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-5">
        {[
          { label: "Total Cases", val: cases.length }, { label: "Active", val: cases.filter(c => c.status !== "Closed").length },
          { label: "Closed", val: cases.filter(c => c.status === "Closed").length }, { label: "Appeals", val: 2 },
          { label: "Long-Pending", val: longPending.length }, { label: "Updated 7d", val: last7Days.length },
        ].map(s => (
          <div key={s.label} className="govt-card p-3 text-center">
            <p className="text-xl font-bold text-foreground">{s.val}</p>
            <p className="text-[10px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid md:grid-cols-2 gap-5 mb-5">
        <div className="govt-card p-4"><h3 className="text-xs font-semibold text-foreground mb-3">Case Type Distribution</h3>
          <ResponsiveContainer width="100%" height={220}><PieChart><Pie data={caseTypeReport} cx="50%" cy="50%" outerRadius={80} dataKey="count" nameKey="type" label={({ type, count }) => `${type}: ${count}`} fontSize={9}>{caseTypeReport.map((_, i) => <Cell key={i} fill={caseTypeColors[i % caseTypeColors.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer>
        </div>
        <div className="govt-card p-4"><h3 className="text-xs font-semibold text-foreground mb-3">Court-wise Distribution</h3>
          <ResponsiveContainer width="100%" height={220}><BarChart data={courtData} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="hsl(214,20%,88%)" /><XAxis type="number" fontSize={10} stroke="hsl(215,14%,45%)" /><YAxis type="category" dataKey="court" fontSize={9} stroke="hsl(215,14%,45%)" width={140} /><Tooltip /><Bar dataKey="cases" fill="hsl(215,55%,28%)" radius={[0,3,3,0]} /></BarChart></ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid md:grid-cols-2 gap-5 mb-5">
        <div className="govt-card p-4"><h3 className="text-xs font-semibold text-foreground mb-3">Compliance Summary</h3>
          <ResponsiveContainer width="100%" height={220}><PieChart><Pie data={complianceReport} cx="50%" cy="50%" outerRadius={80} dataKey="count" nameKey="status" label={({ status, count }) => `${status}: ${count}`} fontSize={9}>{complianceReport.map((_, i) => <Cell key={i} fill={["hsl(142,50%,40%)", "hsl(0,60%,50%)", "hsl(35,80%,50%)", "hsl(215,15%,55%)"][i]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer>
        </div>
        <div className="govt-card p-4"><h3 className="text-xs font-semibold text-foreground mb-3">Collectorate Involvement</h3>
          <ResponsiveContainer width="100%" height={220}><BarChart data={collectInvReport}><CartesianGrid strokeDasharray="3 3" stroke="hsl(214,20%,88%)" /><XAxis dataKey="type" fontSize={8} stroke="hsl(215,14%,45%)" /><YAxis fontSize={10} stroke="hsl(215,14%,45%)" /><Tooltip /><Bar dataKey="count" fill="hsl(25,85%,50%)" radius={[3,3,0,0]} /></BarChart></ResponsiveContainer>
        </div>
      </div>

      {/* Filing Trend */}
      <div className="govt-card p-4 mb-5"><h3 className="text-xs font-semibold text-foreground mb-3">Case Filing Trend</h3>
        <ResponsiveContainer width="100%" height={200}><LineChart data={trendData}><CartesianGrid strokeDasharray="3 3" stroke="hsl(214,20%,88%)" /><XAxis dataKey="month" fontSize={10} stroke="hsl(215,14%,45%)" /><YAxis fontSize={10} stroke="hsl(215,14%,45%)" /><Tooltip /><Line type="monotone" dataKey="cases" stroke="hsl(215,55%,28%)" strokeWidth={2} dot={{ r: 3 }} /></LineChart></ResponsiveContainer>
      </div>

      {/* Tables */}
      <div className="grid md:grid-cols-2 gap-5 mb-5">
        <div className="govt-card"><div className="px-4 py-2 border-b border-border"><h3 className="text-xs font-semibold">Mandal-wise Summary</h3></div>
          <table className="w-full govt-table"><thead><tr><th>Mandal</th><th>Active</th><th>Closed</th><th>Total</th></tr></thead>
            <tbody>{mandalReport.map(m => <tr key={m.mandal}><td className="font-medium text-xs">{m.mandal}</td><td className="text-xs">{m.active}</td><td className="text-xs">{m.closed}</td><td className="font-semibold text-xs">{m.total}</td></tr>)}</tbody>
          </table>
        </div>
        <div className="govt-card"><div className="px-4 py-2 border-b border-border"><h3 className="text-xs font-semibold">Department-wise Summary</h3></div>
          <table className="w-full govt-table"><thead><tr><th>Department</th><th>Active</th><th>Closed</th><th>Total</th></tr></thead>
            <tbody>{deptReport.map(d => <tr key={d.dept}><td className="font-medium text-xs max-w-[140px] truncate">{d.dept}</td><td className="text-xs">{d.active}</td><td className="text-xs">{d.closed}</td><td className="font-semibold text-xs">{d.total}</td></tr>)}</tbody>
          </table>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5 mb-5">
        <div className="govt-card"><div className="px-4 py-2 border-b border-border"><h3 className="text-xs font-semibold">Respondent-wise Summary</h3></div>
          <table className="w-full govt-table"><thead><tr><th>Respondent</th><th>Cases</th></tr></thead>
            <tbody>{respondentReport.map(r => <tr key={r.respondent}><td className="font-medium text-xs max-w-[200px] truncate">{r.respondent}</td><td className="text-xs">{r.cases}</td></tr>)}</tbody>
          </table>
        </div>
        <div className="govt-card"><div className="px-4 py-2 border-b border-border"><h3 className="text-xs font-semibold">Co-Respondent-wise Summary</h3></div>
          <table className="w-full govt-table"><thead><tr><th>Co-Respondent</th><th>Cases</th></tr></thead>
            <tbody>{coRespondentReport.map(r => <tr key={r.name}><td className="font-medium text-xs max-w-[200px] truncate">{r.name}</td><td className="text-xs">{r.cases}</td></tr>)}</tbody>
          </table>
        </div>
      </div>

      {/* Long Pending + Officer */}
      <div className="grid md:grid-cols-2 gap-5 mb-5">
        <div className="govt-card"><div className="px-4 py-2 border-b border-border"><h3 className="text-xs font-semibold">Long-Pending Cases (&gt;6 months)</h3></div>
          <table className="w-full govt-table"><thead><tr><th>Case Number</th><th>Type</th><th>Court</th><th>Filed</th><th>Officer</th></tr></thead>
            <tbody>{longPending.length > 0 ? longPending.map(c => <tr key={c.id}><td className="font-medium text-xs">{c.caseNumber}</td><td className="text-[10px]">{c.caseType}</td><td className="text-[10px] max-w-[100px] truncate">{c.court}</td><td className="text-xs">{c.filingDate}</td><td className="text-xs">{c.assignedOfficer}</td></tr>) : <tr><td colSpan={5} className="text-center text-muted-foreground py-4 text-xs">None</td></tr>}</tbody>
          </table>
        </div>
        <div className="govt-card"><div className="px-4 py-2 border-b border-border"><h3 className="text-xs font-semibold">Officer Workload</h3></div>
          <table className="w-full govt-table"><thead><tr><th>Officer</th><th>Active</th><th>Closed</th><th>Total</th></tr></thead>
            <tbody>{officerData.map(o => <tr key={o.officer}><td className="font-medium text-xs">{o.officer}</td><td className="text-xs">{o.active}</td><td className="text-xs">{o.closed}</td><td className="font-semibold text-xs">{o.active + o.closed}</td></tr>)}</tbody>
          </table>
        </div>
      </div>

      {/* Department-wise Compliance */}
      <div className="govt-card">
        <div className="px-4 py-2 border-b border-border"><h3 className="text-xs font-semibold">Department-wise Compliance Report</h3></div>
        <table className="w-full govt-table">
          <thead><tr><th>Department</th><th>Orders</th><th>Complied</th><th>Pending</th><th>Partial</th></tr></thead>
          <tbody>
            {(() => {
              const m: Record<string, { total: number; complied: number; pending: number; partial: number }> = {};
              cases.filter(c => c.complianceRequired).forEach(c => {
                if (!m[c.department]) m[c.department] = { total: 0, complied: 0, pending: 0, partial: 0 };
                m[c.department].total++;
                if (c.complianceStatus === "Complied") m[c.department].complied++;
                if (c.complianceStatus === "Pending") m[c.department].pending++;
                if (c.complianceStatus === "Partially Complied") m[c.department].partial++;
              });
              return Object.entries(m).map(([dept, d]) => (
                <tr key={dept}><td className="font-medium text-xs max-w-[140px] truncate">{dept}</td><td className="text-xs">{d.total}</td><td className="text-xs">{d.complied}</td><td className="text-xs">{d.pending}</td><td className="text-xs">{d.partial}</td></tr>
              ));
            })()}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}
