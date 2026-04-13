import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, MoreHorizontal, Edit, KeyRound, Power, Search } from "lucide-react";

type UserStatus = "Active" | "Inactive";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth, DemoUser } from "@/contexts/AuthContext";
import { ALL_ROLES, AppRole } from "@/lib/permissions";
import { mandals, departments } from "@/data/sampleData";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const emptyForm = { name: "", email: "", mobile: "", role: "" as AppRole, department: "", mandal: "", password: "", status: "Active" as "Active" | "Inactive" };

export default function UserList() {
  const { users, permissions, addUser, updateUser, resetPassword, toggleUserStatus } = useAuth();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<DemoUser | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetUserId, setResetUserId] = useState("");
  const [newPassword, setNewPassword] = useState("demo123");

  const canManage = permissions?.canCreateUser;

  const filtered = users.filter(u => {
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    if (roleFilter !== "all" && u.role !== roleFilter) return false;
    if (statusFilter !== "all" && u.status !== statusFilter) return false;
    return true;
  });

  const openAdd = () => {
    setEditingUser(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (u: DemoUser) => {
    setEditingUser(u);
    setForm({ name: u.name, email: u.email, mobile: u.mobile, role: u.role, department: u.department, mandal: u.mandal, password: "", status: u.status });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.email || !form.role || !form.department || !form.mandal) {
      toast({ title: "Validation Error", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }
    if (editingUser) {
      updateUser(editingUser.id, { name: form.name, email: form.email, mobile: form.mobile, role: form.role, department: form.department, mandal: form.mandal, status: form.status });
      toast({ title: "User updated", description: `${form.name} has been updated.` });
    } else {
      if (!form.password) { toast({ title: "Password required", variant: "destructive" }); return; }
      addUser({ name: form.name, email: form.email, mobile: form.mobile, role: form.role, department: form.department, mandal: form.mandal, password: form.password, status: form.status });
      toast({ title: "User created", description: `${form.name} can now login.` });
    }
    setDialogOpen(false);
  };

  const handleReset = () => {
    resetPassword(resetUserId, newPassword);
    toast({ title: "Password reset", description: "New password set successfully." });
    setResetDialogOpen(false);
  };

  const handleToggle = (u: DemoUser) => {
    toggleUserStatus(u.id);
    toast({ title: u.status === "Active" ? "User deactivated" : "User activated" });
  };

  return (
    <AppLayout>
      <PageHeader
        title="User Management"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Administration" }, { label: "Users" }]}
        actions={canManage ? <Button size="sm" onClick={openAdd}><Plus className="h-3.5 w-3.5 mr-1.5" />Add User</Button> : undefined}
      />

      {/* Filters */}
      <div className="govt-card p-3 mb-4">
        <div className="flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-8 text-xs" />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[160px] h-8 text-xs"><SelectValue placeholder="Role" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {ALL_ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[120px] h-8 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="govt-card overflow-hidden">
        <table className="w-full govt-table">
          <thead>
            <tr><th>User ID</th><th>Name</th><th>Email</th><th>Mobile</th><th>Role</th><th>Department</th><th>Mandal</th><th>Status</th><th>Last Login</th>{canManage && <th className="w-12"></th>}</tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id}>
                <td className="font-mono text-xs">{u.id}</td>
                <td className="font-medium text-foreground">{u.name}</td>
                <td className="text-xs">{u.email}</td>
                <td className="text-xs">{u.mobile}</td>
                <td className="text-xs">{u.role}</td>
                <td className="text-xs">{u.department}</td>
                <td className="text-xs">{u.mandal}</td>
                <td><StatusBadge value={u.status} /></td>
                <td className="text-xs">{u.lastLogin}</td>
                {canManage && (
                  <td>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 hover:bg-muted rounded"><MoreHorizontal className="h-4 w-4 text-muted-foreground" /></button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(u)}><Edit className="h-3.5 w-3.5 mr-2" />Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setResetUserId(u.id); setNewPassword("demo123"); setResetDialogOpen(true); }}><KeyRound className="h-3.5 w-3.5 mr-2" />Reset Password</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggle(u)}><Power className="h-3.5 w-3.5 mr-2" />{u.status === "Active" ? "Deactivate" : "Activate"}</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                )}
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={10} className="text-center py-6 text-muted-foreground text-xs">No users found</td></tr>}
          </tbody>
        </table>
        <div className="px-4 py-2 border-t border-border text-xs text-muted-foreground">
          Showing {filtered.length} of {users.length} users
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editingUser ? "Edit User" : "Add New User"}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1 col-span-2"><Label className="text-xs">Full Name *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Email *</Label><Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Mobile</Label><Input value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Role *</Label>
              <Select value={form.role} onValueChange={v => setForm({ ...form, role: v as AppRole })}>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select role" /></SelectTrigger>
                <SelectContent>{ALL_ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><Label className="text-xs">Department *</Label>
              <Select value={form.department} onValueChange={v => setForm({ ...form, department: v })}>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><Label className="text-xs">Mandal *</Label>
              <Select value={form.mandal} onValueChange={v => setForm({ ...form, mandal: v })}>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  {mandals.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><Label className="text-xs">Status</Label>
              <Select value={form.status} onValueChange={v => setForm({ ...form, status: v as "Active" | "Inactive" })}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="Active">Active</SelectItem><SelectItem value="Inactive">Inactive</SelectItem></SelectContent>
              </Select>
            </div>
            {!editingUser && <div className="space-y-1"><Label className="text-xs">Password *</Label><Input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="h-8 text-xs" placeholder="Set password" /></div>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editingUser ? "Save Changes" : "Create User"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Reset Password</DialogTitle></DialogHeader>
          <div className="space-y-2">
            <Label className="text-xs">New Password</Label>
            <Input value={newPassword} onChange={e => setNewPassword(e.target.value)} className="h-8 text-xs" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleReset}>Reset Password</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
