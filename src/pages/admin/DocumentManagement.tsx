import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { documents } from "@/data/sampleData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Search, Download, Eye, FileText, File } from "lucide-react";
import { Link } from "react-router-dom";

export default function DocumentManagement() {
  return (
    <AppLayout>
      <PageHeader
        title="Document Management"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Administration" }, { label: "Documents" }]}
        actions={<Button size="sm"><Upload className="h-3.5 w-3.5 mr-1.5" />Upload Document</Button>}
      />

      <div className="govt-card p-4 mb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input placeholder="Search documents..." className="pl-9 h-9 text-sm" />
        </div>
      </div>

      <div className="govt-card overflow-hidden">
        <table className="w-full govt-table">
          <thead>
            <tr><th>Doc ID</th><th>Name</th><th>Category</th><th>Linked Case</th><th>Uploaded By</th><th>Date</th><th>Size</th><th>Type</th><th className="w-20">Actions</th></tr>
          </thead>
          <tbody>
            {documents.map(d => (
              <tr key={d.id}>
                <td className="font-mono text-xs">{d.id}</td>
                <td className="font-medium text-foreground flex items-center gap-2">
                  {d.type === "PDF" ? <FileText className="h-4 w-4 text-status-urgent flex-shrink-0" /> : <File className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
                  <span className="truncate max-w-[200px]">{d.name}</span>
                </td>
                <td className="text-xs">{d.category}</td>
                <td className="text-xs"><Link to={`/cases/${encodeURIComponent(d.linkedCase)}`} className="text-primary hover:underline">{d.linkedCase}</Link></td>
                <td className="text-xs">{d.uploadedBy}</td>
                <td className="text-xs">{d.uploadDate}</td>
                <td className="text-xs">{d.size}</td>
                <td className="text-xs">{d.type}</td>
                <td>
                  <div className="flex gap-1">
                    <button className="p-1 hover:bg-muted rounded" title="Preview"><Eye className="h-3.5 w-3.5 text-muted-foreground" /></button>
                    <button className="p-1 hover:bg-muted rounded" title="Download"><Download className="h-3.5 w-3.5 text-muted-foreground" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}
