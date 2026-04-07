import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ChangePassword() {
  return (
    <AppLayout>
      <PageHeader
        title="Change Password"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Account" }, { label: "Change Password" }]}
      />
      <div className="max-w-md">
        <div className="govt-card p-5">
          <form onSubmit={e => e.preventDefault()} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs">Current Password</Label>
              <Input type="password" className="h-9 text-sm" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">New Password</Label>
              <Input type="password" className="h-9 text-sm" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Confirm New Password</Label>
              <Input type="password" className="h-9 text-sm" />
            </div>
            <div className="text-xs text-muted-foreground">
              Password must be at least 8 characters with uppercase, lowercase, and a number.
            </div>
            <Button type="submit">Update Password</Button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
