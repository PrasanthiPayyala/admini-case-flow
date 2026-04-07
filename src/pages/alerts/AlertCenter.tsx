import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { alerts } from "@/data/sampleData";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Mail, MessageSquare } from "lucide-react";

export default function AlertCenter() {
  return (
    <AppLayout>
      <PageHeader
        title="Alerts & Notifications"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Alerts" }]}
      />

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="govt-card p-4 flex items-center gap-3">
          <div className="p-2 rounded-md bg-status-warning/10"><Bell className="h-4 w-4 text-status-warning" /></div>
          <div>
            <p className="text-lg font-bold text-foreground">{alerts.filter(a => a.status === "Pending").length}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </div>
        </div>
        <div className="govt-card p-4 flex items-center gap-3">
          <div className="p-2 rounded-md bg-status-success/10"><Mail className="h-4 w-4 text-status-success" /></div>
          <div>
            <p className="text-lg font-bold text-foreground">{alerts.filter(a => a.status === "Sent").length}</p>
            <p className="text-xs text-muted-foreground">Sent</p>
          </div>
        </div>
        <div className="govt-card p-4 flex items-center gap-3">
          <div className="p-2 rounded-md bg-status-urgent/10"><MessageSquare className="h-4 w-4 text-status-urgent" /></div>
          <div>
            <p className="text-lg font-bold text-foreground">{alerts.filter(a => a.status === "Failed").length}</p>
            <p className="text-xs text-muted-foreground">Failed</p>
          </div>
        </div>
      </div>

      <div className="govt-card p-4 mb-4">
        <div className="flex gap-3">
          <Select>
            <SelectTrigger className="w-[160px] h-9 text-sm"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="hearing">Hearing Reminder</SelectItem>
              <SelectItem value="overdue">Overdue Update</SelectItem>
              <SelectItem value="appeal">Appeal Deadline</SelectItem>
              <SelectItem value="escalation">Escalation</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[160px] h-9 text-sm"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="govt-card overflow-hidden">
        <table className="w-full govt-table">
          <thead>
            <tr><th>Alert ID</th><th>Type</th><th>Message</th><th>Officer</th><th>Date</th><th>Priority</th><th>Channel</th><th>Status</th></tr>
          </thead>
          <tbody>
            {alerts.map(a => (
              <tr key={a.id}>
                <td className="font-mono text-xs">{a.id}</td>
                <td className="text-xs">{a.type}</td>
                <td className="max-w-[250px] truncate">{a.message}</td>
                <td className="text-xs">{a.officer}</td>
                <td className="text-xs">{a.date}</td>
                <td><StatusBadge value={a.priority} type="priority" /></td>
                <td className="text-xs">{a.channel}</td>
                <td><StatusBadge value={a.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}
