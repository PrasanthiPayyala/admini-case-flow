import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, X } from "lucide-react";
import { Link } from "react-router-dom";

export default function AddAppeal() {
  return (
    <AppLayout>
      <PageHeader
        title="File New Appeal"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Appeals", href: "/appeals" }, { label: "New Appeal" }]}
        actions={<Link to="/appeals"><Button variant="outline" size="sm"><X className="h-3.5 w-3.5 mr-1.5" />Cancel</Button></Link>}
      />
      <form onSubmit={e => e.preventDefault()} className="space-y-6 max-w-4xl">
        <div className="govt-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Appeal Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs">Parent Case ID *</Label>
              <Select>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Link to parent case" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="c1">LCMS/YBG/2024/001</SelectItem>
                  <SelectItem value="c2">LCMS/YBG/2024/002</SelectItem>
                  <SelectItem value="c5">LCMS/YBG/2024/005</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Appeal Number *</Label>
              <Input placeholder="e.g. WA 234/2024" className="h-9 text-sm" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Appeal Court *</Label>
              <Input placeholder="e.g. Division Bench, HC Telangana" className="h-9 text-sm" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Filing Date *</Label>
              <Input type="date" className="h-9 text-sm" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Assigned Officer *</Label>
              <Select>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select officer" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="srinivas">K. Srinivas Rao</SelectItem>
                  <SelectItem value="padma">S. Padma Kumari</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Next Hearing Date</Label>
              <Input type="date" className="h-9 text-sm" />
            </div>
          </div>
        </div>
        <div className="govt-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Grounds & Remarks</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs">Grounds of Appeal *</Label>
              <Textarea placeholder="State the grounds for this appeal..." rows={3} className="text-sm" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Remarks</Label>
              <Textarea placeholder="Additional remarks..." rows={2} className="text-sm" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button type="submit"><Save className="h-3.5 w-3.5 mr-1.5" />File Appeal</Button>
          <Link to="/appeals"><Button variant="ghost">Cancel</Button></Link>
        </div>
      </form>
    </AppLayout>
  );
}
