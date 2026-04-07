import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
  trend?: string;
  className?: string;
}

export function StatsCard({ title, value, icon: Icon, subtitle, trend, className }: StatsCardProps) {
  return (
    <div className={cn("govt-card p-5", className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          {trend && <p className="text-xs text-status-success font-medium">{trend}</p>}
        </div>
        <div className="p-2.5 rounded-md bg-primary/5">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
    </div>
  );
}
