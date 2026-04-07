import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";

export default function Profile() {
  return (
    <AppLayout>
      <PageHeader
        title="My Profile"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Account" }, { label: "Profile" }]}
      />
      <div className="max-w-2xl space-y-6">
        <div className="govt-card p-5 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
            <User className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">K. Srinivas Rao</h2>
            <p className="text-sm text-muted-foreground">Legal Officer • Legal Cell</p>
            <p className="text-xs text-muted-foreground">legal.officer1@ybg.telangana.gov.in</p>
          </div>
        </div>

        <div className="govt-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Personal Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs">Full Name</Label>
              <Input defaultValue="K. Srinivas Rao" className="h-9 text-sm" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Email</Label>
              <Input defaultValue="legal.officer1@ybg.telangana.gov.in" className="h-9 text-sm" readOnly />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Department</Label>
              <Input defaultValue="Legal Cell" className="h-9 text-sm" readOnly />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Role</Label>
              <Input defaultValue="Legal Officer" className="h-9 text-sm" readOnly />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Phone</Label>
              <Input defaultValue="+91 98765 43210" className="h-9 text-sm" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Employee ID</Label>
              <Input defaultValue="YBG/LC/002" className="h-9 text-sm" readOnly />
            </div>
          </div>
        </div>

        <Button>Update Profile</Button>
      </div>
    </AppLayout>
  );
}
