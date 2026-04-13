import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, FileSpreadsheet } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { caseTypes, mandals, departments, priorities } from "@/data/sampleData";
import { useData } from "@/contexts/DataContext";
import { useState } from "react";

export default function ReportsPage() {
  const { cases } = useData();
  const [typeF, setTypeF] = useState("all");
  const [mandalF, setMandalF] = useState("all");
  const [deptF, setDeptF] = useState("all");
  const [priorityF, setPriorityF] = useState("all");

  const filtered = cases.filter(c => {
    if (typeF !== "all" && c.caseType !== typeF) return false;
    if (mandalF !== "all" && c.mandal !== mandalF) return false;
    if (deptF !== "all" && c.department !== deptF) return false;
    if (priorityF !== "all" && c.priority !== priorityF) return false;
    return true;
  });

  const caseTypeReport = caseTypes.map(ct => ({ type: ct, count: filtered.filter(c => c.caseType === ct).length })).filter(d => d.count > 0);
  const caseTypeColors = ["hsl(215,55%,28%)", "hsl(142,50%,40%)", "hsl(35,80%,50%)", "hsl(25,85%,50%)", "hsl(270,40%,50%)", "hsl(207,60%,45%)", "hsl(0,60%,50%)", "hsl(180,40%,45%)", "hsl(320,40%,50%)"];
  const courtData = (() => { const m: Record<string, number> = {}; filtered.forEach(c => { m[c.court] = (m[c.court] || 0) + 1; }); return Object.entries(m).map(([court, count]) => ({ court, cases: count })); })();
  const mandalReport = (() => { const m: Record<string, { active: number; closed: number }> = {}; filtered.forEach(c => { if (!m[c.mandal]) m[c.mandal] = { active: 0, closed: 0 }; if (c.status === "Closed") m[c.mandal].closed++; else m[c.mandal].active++; }); return Object.entries(m).map(([mandal, d]) => ({ mandal, ...d, total: d.active + d.closed })); })();
  const deptReport = (() => { const m: Record<string, { active: number; closed: number }> = {}; filtered.forEach(c => { if (!m[c.department]) m[c.department] = { active: 0, closed: 0 }; if (c.status === "Closed") m[c.department].closed++; else m[c.department].active++; }); return Object.entries(m).map(([dept, d]) => ({ dept, ...d, total: d.active + d.closed })); })();
  const complianceReport = (() => { const m: Record<string, number> = { "Complied": 0, "Pending": 0, "Partially Complied": 0, "Not Applicable": 0 }; filtered.forEach(c => { m[c.complianceStatus] = (m[c.complianceStatus] || 0) + 1; }); return Object.entries(m).map(([status, count]) => ({ status, count })); })();
  const last7Days = filtered.filter(c => (Date.now() - new Date(c.lastUpdated).getTime()) / (1000*60*60*24) <= 7);

  return (
    <AppLayout>
      <PageHeader title="Reports & Analytics" breadcrumbs={[{ label: "Home", href: "/" }, { label: "Reports" }]}
        actions={<div className="flex gap-2"><Button variant="outline" size="sm"><FileText className="h-3.5 w-3.5 mr-1.5" />Export PDF</Button><Button variant="outline" size="sm"><FileSpreadsheet className="h-3.5 w-3.5 mr-1.5" />Export Excel</Button></div>} />

      <div className="govt-card p-3 mb-5">
        <div className="flex flex-wrap gap-2 items-end">
          <Select value={typeF} onValueChange={setTypeF}><SelectTrigger className="w-[120px] h-8 text-xs"><SelectValue placeholder="Case Type" /></SelectTrigger><SelectContent><SelectItem value="all">All Types</SelectItem>{caseTypes.map(ct => <SelectItem key={ct} value={ct}>{ct}</SelectItem>)}</SelectContent></Select>
          <Select value={mandalF} onValueChange={setMandalF}><SelectTrigger className="w-[120px] h-8 text-xs"><SelectValue placeholder="Mandal" /></SelectTrigger><SelectContent><SelectItem value="all">All Mandals</SelectItem>{mandals.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent></Select>
          <Select value={deptF} onValueChange={setDeptF}><SelectTrigger className="w-[120px] h-8 text-xs"><SelectValue placeholder="Department" /></SelectTrigger><SelectContent><SelectItem value="all">All Depts</SelectItem>{departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select>
          <Select value={priorityF} onValueChange={setPriorityF}><SelectTrigger className="w-[120px] h-8 text-xs"><SelectValue placeholder="Priority" /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem>{priorities.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select>
        </div>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-5">
        {[{ label: "Total Cases", val: filtered.length }, { label: "Active", val: filtered.filter(c => c.status !== "Closed").length }, { label: "Closed", val: filtered.filter(c => c.status === "Closed").length }, { label: "Appeals", val: 4 }, { label: "Compliance Pending", val: filtered.filter(c => c.complianceStatus === "Pending").length }, { label: "Updated 7d", val: last7Days.length }].map(s => (
          <div key={s.label} className="govt-card p-3 text-center"><p className="text-xl font-bold text-foreground">{s.val}</p><p className="text-[10px] text-muted-foreground">{s.label}</p></div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-5 mb-5">
        <div className="govt-card p-4"><h3 className="text-xs font-semibold text-foreground mb-3">Case Type Distribution</h3>
          <ResponsiveContainer width="100%" height={220}><PieChart><Pie data={caseTypeReport} cx="50%" cy="50%" outerRadius={80} dataKey="count" nameKey="type" label={({ type, count }) => `${type}: ${count}`} fontSize={9}>{caseTypeReport.map((_, i) => <Cell key={i} fill={caseTypeColors[i % caseTypeColors.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer>
        </div>
        <div className="govt-card p-4"><h3 className="text-xs font-semibold text-foreground mb-3">Compliance Summary</h3>
          <ResponsiveContainer width="100%" height={220}><PieChart><Pie data={complianceReport} cx="50%" cy="50%" outerRadius={80} dataKey="count" nameKey="status" label={({ status, count }) => `${status}: ${count}`} fontSize={9}>{complianceReport.map((_, i) => <Cell key={i} fill={["hsl(142,50%,40%)", "hsl(0,60%,50%)", "hsl(35,80%,50%)", "hsl(215,15%,55%)"][i]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5 mb-5">
        <div className="govt-card p-4"><h3 className="text-xs font-semibold text-foreground mb-3">Court-wise Distribution</h3>
          <ResponsiveContainer width="100%" height={220}><BarChart data={courtData} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="hsl(214,20%,88%)" /><XAxis type="number" fontSize={10} stroke="hsl(215,14%,45%)" /><YAxis type="category" dataKey="court" fontSize={9} stroke="hsl(215,14%,45%)" width={140} /><Tooltip /><Bar dataKey="cases" fill="hsl(215,55%,28%)" radius={[0,3,3,0]} /></BarChart></ResponsiveContainer>
        </div>
        <div className="govt-card"><div className="px-4 py-2 border-b border-border"><h3 className="text-xs font-semibold">Mandal-wise Summary</h3></div>
          <table className="w-full govt-table"><thead><tr><th>Mandal</th><th>Active</th><th>Closed</th><th>Total</th></tr></thead>
            <tbody>{mandalReport.map(m => <tr key={m.mandal}><td className="font-medium text-xs">{m.mandal}</td><td className="text-xs">{m.active}</td><td className="text-xs">{m.closed}</td><td className="font-semibold text-xs">{m.total}</td></tr>)}</tbody>
          </table>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5 mb-5">
        <div className="govt-card"><div className="px-4 py-2 border-b border-border"><h3 className="text-xs font-semibold">Department-wise Summary</h3></div>
          <table className="w-full govt-table"><thead><tr><th>Department</th><th>Active</th><th>Closed</th><th>Total</th></tr></thead>
            <tbody>{deptReport.map(d => <tr key={d.dept}><td className="font-medium text-xs max-w-[140px] truncate">{d.dept}</td><td className="text-xs">{d.active}</td><td className="text-xs">{d.closed}</td><td className="font-semibold text-xs">{d.total}</td></tr>)}</tbody>
          </table>
        </div>
        <div className="govt-card"><div className="px-4 py-2 border-b border-border"><h3 className="text-xs font-semibold">Department-wise Compliance</h3></div>
          <table className="w-full govt-table">
            <thead><tr><th>Department</th><th>Orders</th><th>Complied</th><th>Pending</th><th>Partial</th></tr></thead>
            <tbody>
              {(() => { const m: Record<string, { total: number; complied: number; pending: number; partial: number }> = {}; filtered.filter(c => c.complianceRequired).forEach(c => { if (!m[c.department]) m[c.department] = { total: 0, complied: 0, pending: 0, partial: 0 }; m[c.department].total++; if (c.complianceStatus === "Complied") m[c.department].complied++; if (c.complianceStatus === "Pending") m[c.department].pending++; if (c.complianceStatus === "Partially Complied") m[c.department].partial++; }); return Object.entries(m).map(([dept, d]) => (<tr key={dept}><td className="font-medium text-xs max-w-[140px] truncate">{dept}</td><td className="text-xs">{d.total}</td><td className="text-xs">{d.complied}</td><td className="text-xs">{d.pending}</td><td className="text-xs">{d.partial}</td></tr>)); })()}
            </tbody>
          </table>
        </div>
      </div>

      {/* Last 7 Days */}
      <div className="govt-card">
        <div className="px-4 py-2 border-b border-border"><h3 className="text-xs font-semibold">Last 7 Days Updates ({last7Days.length})</h3></div>
        <table className="w-full govt-table">
          <thead><tr><th>Case Number</th><th>Title</th><th>Department</th><th>Status</th><th>Compliance</th><th>Updated</th></tr></thead>
          <tbody>
            {last7Days.map(c => (<tr key={c.id}><td className="font-medium text-xs">{c.caseNumber}</td><td className="text-xs max-w-[160px] truncate">{c.title}</td><td className="text-xs">{c.department}</td><td><span className="text-xs">{c.status}</span></td><td><span className="text-xs">{c.complianceStatus}</span></td><td className="text-xs">{c.lastUpdated}</td></tr>))}
            {last7Days.length === 0 && <tr><td colSpan={6} className="text-center py-4 text-muted-foreground text-xs">No updates in last 7 days</td></tr>}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}
