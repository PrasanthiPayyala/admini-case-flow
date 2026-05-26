import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Lock, ShieldCheck, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DEFAULT_STATUSES = [
  "Fresh", "Under Process", "Under Hearing", "Pending",
  "Hearing Scheduled", "Counter Pending", "Under Review",
  "Ongoing", "Appealed", "Disposed", "Closed",
];

const ALLOWED_ROLES = ["Super Admin", "District Legal Officer"];

export default function CaseStatusMaster() {
  const { caseStatuses, addCaseStatus, deleteCaseStatus, isStatusInUse, cases } = useData();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [newStatus, setNewStatus] = useState("");

  const role = currentUser?.role || "";
  const canManage = ALLOWED_ROLES.includes(role);

  const usageCount = (s: string) => cases.filter(c => c.status === s).length;

  const handleAdd = () => {
    if (!currentUser) return;
    const res = addCaseStatus(newStatus, currentUser.name, role);
    if (res.ok) {
      toast({ title: "Status added", description: `"${newStatus.trim()}" is now available across the system.` });
      setNewStatus("");
    } else {
      toast({ title: "Could not add", description: res.reason, variant: "destructive" });
    }
  };

  const handleDelete = (s: string) => {
    if (!currentUser) return;
    const res = deleteCaseStatus(s, currentUser.name, role);
    if (res.ok) toast({ title: "Status removed", description: `"${s}" was removed.` });
    else toast({ title: "Cannot delete", description: res.reason, variant: "destructive" });
  };

  return (
    <AppLayout>
      <PageHeader
        title="Case Status Master"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Administration" }, { label: "Case Status Master" }]}
      />

      {!canManage && (
        <div className="govt-card p-4 mb-4 border-l-4 border-l-status-warning flex items-center gap-3">
          <Lock className="h-5 w-5 text-status-warning" />
          <div>
            <p className="text-sm font-semibold text-foreground">Read-only access</p>
            <p className="text-xs text-muted-foreground">Only Super Admin and District Legal Officer can add or remove case statuses. All other roles see the current list only.</p>
          </div>
        </div>
      )}

      {/* Add new status */}
      {canManage && (
        <div className="govt-card p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Plus className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Add New Case Status</h3>
          </div>
          <div className="flex gap-2 items-center">
            <Input
              placeholder="e.g. Reserved for Orders"
              value={newStatus}
              onChange={e => setNewStatus(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleAdd()}
              className="h-9 text-xs max-w-sm"
            />
            <Button size="sm" onClick={handleAdd} disabled={!newStatus.trim()}>
              <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Status
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" />
            New statuses appear in all case status dropdowns automatically. All actions are recorded in the audit log.
          </p>
        </div>
      )}

      {/* Status list */}
      <div className="govt-card">
        <div className="govt-card-header">
          <h3><ShieldCheck className="h-3.5 w-3.5 text-primary" />Configured Case Statuses ({caseStatuses.length})</h3>
        </div>
        <table className="w-full govt-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Type</th>
              <th className="text-right">Cases Using</th>
              <th>Status</th>
              <th className="w-24">Actions</th>
            </tr>
          </thead>
          <tbody>
            {caseStatuses.map(s => {
              const inUse = isStatusInUse(s);
              const isDefault = DEFAULT_STATUSES.includes(s);
              return (
                <tr key={s}>
                  <td className="text-xs font-medium">{s}</td>
                  <td>
                    {isDefault ? (
                      <Badge variant="secondary" className="text-[10px]">Default (system)</Badge>
                    ) : (
                      <Badge className="text-[10px] bg-primary/10 text-primary border-primary/30">Custom</Badge>
                    )}
                  </td>
                  <td className="text-xs text-right font-semibold">{usageCount(s)}</td>
                  <td>
                    {inUse ? (
                      <span className="text-[10px] text-status-warning inline-flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" /> In use — cannot delete
                      </span>
                    ) : (
                      <span className="text-[10px] text-muted-foreground">Unused</span>
                    )}
                  </td>
                  <td>
                    {canManage && !isDefault && !inUse ? (
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(s)} className="h-7 text-[10px] text-status-urgent hover:text-status-urgent hover:bg-status-urgent/10">
                        <Trash2 className="h-3 w-3 mr-1" /> Remove
                      </Button>
                    ) : (
                      <span className="text-[10px] text-muted-foreground">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="p-3 border-t border-border text-[10px] text-muted-foreground">
          Default statuses are system-protected. Custom statuses can be removed only when no case is using them. All add/remove actions are logged in audit history.
        </div>
      </div>
    </AppLayout>
  );
}
