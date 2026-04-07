import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Shield, Database, Bell, Server } from "lucide-react";

export default function SettingsPage() {
  return (
    <AppLayout>
      <PageHeader
        title="System Settings"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Administration" }, { label: "Settings" }]}
      />

      <div className="space-y-6 max-w-3xl">
        {/* Departments */}
        <div className="govt-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Departments</h3>
          <div className="space-y-2 text-sm">
            {["Revenue", "Administration", "Municipal", "Finance", "Legal Cell", "Planning", "IT"].map(d => (
              <div key={d} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <span>{d}</span>
                <Button variant="ghost" size="sm" className="text-xs h-7">Edit</Button>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="mt-3 text-xs">+ Add Department</Button>
        </div>

        {/* Courts */}
        <div className="govt-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Court Types</h3>
          <div className="space-y-2 text-sm">
            {["High Court", "District Court", "Tribunal", "Consumer Forum", "Revenue Court"].map(c => (
              <div key={c} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <span>{c}</span>
                <Button variant="ghost" size="sm" className="text-xs h-7">Edit</Button>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="govt-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Notification Settings</h3>
          </div>
          <div className="space-y-4">
            {[
              { label: "Email Notifications", desc: "Send email alerts for hearing reminders" },
              { label: "SMS Notifications", desc: "Send SMS alerts for urgent matters" },
              { label: "Escalation Alerts", desc: "Auto-escalate overdue cases after 30 days" },
            ].map(n => (
              <div key={n.label} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{n.label}</p>
                  <p className="text-xs text-muted-foreground">{n.desc}</p>
                </div>
                <Switch defaultChecked />
              </div>
            ))}
            <div className="space-y-2 pt-2">
              <Label className="text-xs">Hearing Reminder Days Before</Label>
              <Input type="number" defaultValue="3" className="h-9 text-sm w-24" />
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="govt-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Security</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">SSL Certificate</p>
                <p className="text-xs text-muted-foreground">Valid until Dec 2025</p>
              </div>
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-status-success/10 text-status-success">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Session Timeout</p>
                <p className="text-xs text-muted-foreground">Auto-logout after inactivity</p>
              </div>
              <Input type="number" defaultValue="30" className="h-9 text-sm w-24" />
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="govt-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Server className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">System Health</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center justify-between py-2">
              <span className="text-muted-foreground">Database Status</span>
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-status-success/10 text-status-success">Online</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-muted-foreground">Last Backup</span>
              <span className="font-medium">2024-04-07 02:00</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-muted-foreground">Server Uptime</span>
              <span className="font-medium">99.97%</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-muted-foreground">Storage Used</span>
              <span className="font-medium">12.4 GB / 50 GB</span>
            </div>
          </div>
        </div>

        <Button>Save Settings</Button>
      </div>
    </AppLayout>
  );
}
