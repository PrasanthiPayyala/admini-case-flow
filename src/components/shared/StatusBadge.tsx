import { cn } from "@/lib/utils";

const statusMap: Record<string, string> = {
  "Fresh": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Ongoing": "bg-blue-50 text-blue-700 border-blue-200",
  "Hearing Scheduled": "bg-amber-50 text-amber-700 border-amber-200",
  "Counter Pending": "bg-orange-50 text-orange-700 border-orange-200",
  "Under Review": "bg-violet-50 text-violet-700 border-violet-200",
  "Appealed": "bg-purple-50 text-purple-700 border-purple-200",
  "Closed": "bg-slate-100 text-slate-600 border-slate-200",
  "Scheduled": "bg-blue-50 text-blue-700 border-blue-200",
  "Completed": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Adjourned": "bg-amber-50 text-amber-700 border-amber-200",
  "Active": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Inactive": "bg-slate-100 text-slate-500 border-slate-200",
  "Sent": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Pending": "bg-orange-50 text-orange-700 border-orange-200",
  "Complied": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Partially Complied": "bg-amber-50 text-amber-700 border-amber-200",
  "Not Applicable": "bg-slate-50 text-slate-500 border-slate-200",
  "Admitted": "bg-blue-50 text-blue-700 border-blue-200",
  "Awaiting Arguments": "bg-amber-50 text-amber-700 border-amber-200",
  "Disposed": "bg-slate-100 text-slate-600 border-slate-200",
  "Dismissed": "bg-red-50 text-red-600 border-red-200",
  "Allowed": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Directions Issued": "bg-indigo-50 text-indigo-700 border-indigo-200",
  // Approval workflow statuses
  "Approved": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "GP Approved": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Collector Approved": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Returned": "bg-red-50 text-red-600 border-red-200",
  "Draft Ready": "bg-blue-50 text-blue-700 border-blue-200",
  "Filed": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Not Started": "bg-slate-50 text-slate-500 border-slate-200",
  "Received": "bg-blue-50 text-blue-700 border-blue-200",
  "In Progress": "bg-blue-50 text-blue-700 border-blue-200",
  // Pending at level statuses
  "Department": "bg-blue-50 text-blue-700 border-blue-200",
  "GP Approval": "bg-amber-50 text-amber-700 border-amber-200",
  "Collector Approval": "bg-orange-50 text-orange-700 border-orange-200",
  "Counter Filing": "bg-orange-50 text-orange-700 border-orange-200",
  "Compliance": "bg-violet-50 text-violet-700 border-violet-200",
  "Hearing Update": "bg-blue-50 text-blue-700 border-blue-200",
  "Final Action": "bg-red-50 text-red-600 border-red-200",
  "Under Process": "bg-blue-50 text-blue-700 border-blue-200",
  "Under Hearing": "bg-amber-50 text-amber-700 border-amber-200",
  "Yes": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "No": "bg-slate-50 text-slate-500 border-slate-200",
  "Critical": "bg-red-100 text-red-800 border-red-300 font-semibold",
};

const priorityMap: Record<string, string> = {
  "High": "bg-red-50 text-red-700 border-red-200",
  "Medium": "bg-amber-50 text-amber-700 border-amber-200",
  "Low": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Time-Sensitive": "bg-orange-50 text-orange-700 border-orange-200",
  "Court-Critical": "bg-red-100 text-red-800 border-red-300 font-semibold",
};

interface StatusBadgeProps {
  value: string;
  type?: "status" | "priority";
  className?: string;
  size?: "sm" | "default";
}

export function StatusBadge({ value, type = "status", className, size = "default" }: StatusBadgeProps) {
  const colorMap = type === "priority" ? priorityMap : statusMap;
  const colors = colorMap[value] || "bg-muted text-muted-foreground border-border";

  return (
    <span className={cn(
      "inline-flex items-center rounded border font-medium whitespace-nowrap",
      size === "sm" ? "px-1.5 py-0 text-[9px]" : "px-2 py-0.5 text-[10px]",
      colors,
      className
    )}>
      {value}
    </span>
  );
}
