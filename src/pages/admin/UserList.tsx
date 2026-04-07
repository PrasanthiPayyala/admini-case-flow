import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { users } from "@/data/sampleData";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal, Edit, KeyRound, Power } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function UserList() {
  return (
    <AppLayout>
      <PageHeader
        title="User Management"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Administration" }, { label: "Users" }]}
        actions={<Button size="sm"><Plus className="h-3.5 w-3.5 mr-1.5" />Add User</Button>}
      />
      <div className="govt-card overflow-hidden">
        <table className="w-full govt-table">
          <thead>
            <tr><th>User ID</th><th>Name</th><th>Email</th><th>Role</th><th>Department</th><th>Status</th><th>Last Login</th><th className="w-12"></th></tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td className="font-mono text-xs">{u.id}</td>
                <td className="font-medium text-foreground">{u.name}</td>
                <td className="text-xs">{u.email}</td>
                <td className="text-xs">{u.role}</td>
                <td className="text-xs">{u.department}</td>
                <td><StatusBadge value={u.status} /></td>
                <td className="text-xs">{u.lastLogin}</td>
                <td>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1 hover:bg-muted rounded"><MoreHorizontal className="h-4 w-4 text-muted-foreground" /></button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem><Edit className="h-3.5 w-3.5 mr-2" />Edit</DropdownMenuItem>
                      <DropdownMenuItem><KeyRound className="h-3.5 w-3.5 mr-2" />Reset Password</DropdownMenuItem>
                      <DropdownMenuItem><Power className="h-3.5 w-3.5 mr-2" />Deactivate</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}
