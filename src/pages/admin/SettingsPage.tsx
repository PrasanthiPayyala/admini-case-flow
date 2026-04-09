import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Shield, Bell, Server, Info } from "lucide-react";
import { caseTypes, mandals, courtNames, departments, priorities, collectorateInvolvementTypes, natureOfCaseOptions } from "@/data/sampleData";

const MasterList = ({ title, items }: { title: string; items: string[] }) => (
  <div className="govt-card p-5">
    <h3 className="text-xs font-semibold text-foreground mb-3">{title}</h3>
    <div className="space-y-1.5 text-sm">
      {items.map(item => (
        <div key={item} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
          <span className="text-xs">{item}</span>
          <Button variant="ghost" size="sm" className="text-[10px] h-6">Edit</Button>
        </div>
      ))}
    </div>
    <Button variant="outline" size="sm" className="mt-3 text-[10px]">+ Add</Button>
  </div>
);

export default function SettingsPage() {
  return (
    <AppLayout>
      <PageHeader title="System Settings" breadcrumbs={[{ label: "Home", href: "/" }, { label: "Administration" }, { label: "Settings" }]} />
      <div className="space-y-5 max-w-3xl">
        <MasterList title="Departments" items={departments} />
        <MasterList title="Case Types" items={caseTypes} />
        <MasterList title="Court Names" items={courtNames} />
        <MasterList title="Mandals" items={mandals} />
        <MasterList title="Priorities" items={priorities} />
        <MasterList title="Collectorate Involvement Types" items={collectorateInvolvementTypes} />
        <MasterList title="Nature of Case" items={natureOfCaseOptions} />
        <MasterList title="Court Types" items={["High Court", "District Court", "Tribunal", "Consumer Forum", "Revenue Court", "Civil Court"]} />
        <MasterList title="Case Statuses" items={["Fresh", "Ongoing", "Hearing Scheduled", "Counter Pending", "Under Review", "Appealed", "Closed"]} />
        <MasterList title="Compliance Statuses" items={["Not Applicable", "Pending", "Partially Complied", "Complied"]} />

        {/* Notifications */}
        <div className="govt-card p-5">
          <div className="flex items-center gap-2 mb-3"><Bell className="h-3.5 w-3.5 text-primary" /><h3 className="text-xs font-semibold text-foreground">Notification Settings</h3></div>
          <div className="space-y-3">
            {[
              { label: "Email Notifications", desc: "Send email alerts for hearing reminders" },
              { label: "SMS Notifications", desc: "Send SMS alerts for urgent matters" },
              { label: "Escalation Alerts", desc: "Auto-escalate overdue cases after 30 days" },
              { label: "Compliance Alerts", desc: "Alert when compliance due date is approaching" },
            ].map(n => (
              <div key={n.label} className="flex items-center justify-between">
                <div><p className="text-xs font-medium">{n.label}</p><p className="text-[10px] text-muted-foreground">{n.desc}</p></div>
                <Switch defaultChecked />
              </div>
            ))}
            <div className="space-y-1 pt-2"><Label className="text-[10px]">Hearing Reminder Days Before</Label><Input type="number" defaultValue="3" className="h-8 text-xs w-24" /></div>
          </div>
        </div>

        {/* Security */}
        <div className="govt-card p-5">
          <div className="flex items-center gap-2 mb-3"><Shield className="h-3.5 w-3.5 text-primary" /><h3 className="text-xs font-semibold text-foreground">Security</h3></div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div><p className="text-xs font-medium">SSL Certificate</p><p className="text-[10px] text-muted-foreground">Valid until Dec 2025</p></div>
              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-status-success/10 text-status-success">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <div><p className="text-xs font-medium">Session Timeout</p><p className="text-[10px] text-muted-foreground">Auto-logout after inactivity</p></div>
              <Input type="number" defaultValue="30" className="h-8 text-xs w-24" />
            </div>
            <div className="flex items-center justify-between">
              <div><p className="text-xs font-medium">RBAC Enforcement</p><p className="text-[10px] text-muted-foreground">Role-based access control</p></div>
              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-status-success/10 text-status-success">Enabled</span>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="govt-card p-5">
          <div className="flex items-center gap-2 mb-3"><Server className="h-3.5 w-3.5 text-primary" /><h3 className="text-xs font-semibold text-foreground">System Health</h3></div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              ["Database Status", "Online", true], ["Last Backup", "2024-04-07 02:00", false],
              ["Server Uptime", "99.97%", false], ["Storage Used", "12.4 GB / 50 GB", false],
              ["Domain", "lcms.ybg-collectorate.in", false], ["Environment", "Production", false],
            ].map(([label, val, isStatus]) => (
              <div key={label as string} className="flex items-center justify-between py-1.5">
                <span className="text-[10px] text-muted-foreground">{label as string}</span>
                {isStatus ? <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-status-success/10 text-status-success">{val as string}</span> : <span className="font-medium text-xs">{val as string}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Future Integration */}
        <div className="govt-card p-5">
          <div className="flex items-center gap-2 mb-3"><Info className="h-3.5 w-3.5 text-primary" /><h3 className="text-xs font-semibold text-foreground">Future Integration Readiness</h3></div>
          <div className="p-4 bg-muted/50 rounded text-xs text-muted-foreground leading-relaxed">
            <p className="font-medium text-foreground mb-1">Integration Provision Note</p>
            <p>Future phase provision can support integration with authorized court/judicial data sources or court apps, subject to API/data access availability, permissions, and feasibility, to assist in tracking case history, hearing dates, concerned departments, and nature of cases.</p>
            <p className="mt-2 italic">This is not currently a live feature. The system operates on structured manual entry workflows.</p>
          </div>
        </div>

        <Button>Save Settings</Button>
      </div>
    </AppLayout>
  );
}
