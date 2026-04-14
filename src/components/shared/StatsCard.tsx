import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
  trend?: string;
  className?: string;
  href?: string;
  accent?: "default" | "success" | "warning" | "urgent" | "info";
}

const accentStyles = {
  default: "bg-primary/5 text-primary",
  success: "bg-status-success/10 text-status-success",
  warning: "bg-status-warning/10 text-status-warning",
  urgent: "bg-status-urgent/10 text-status-urgent",
  info: "bg-chart-2/10 text-chart-2",
};

export function StatsCard({ title, value, icon: Icon, subtitle, trend, className, href, accent = "default" }: StatsCardProps) {
  const content = (
    <div className={cn(
      "govt-card p-4 transition-all duration-150",
      href && "cursor-pointer hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-0.5 min-w-0">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider leading-tight">{title}</p>
          <p className="text-2xl font-bold text-foreground leading-none mt-1">{value}</p>
          {subtitle && <p className="text-[10px] text-muted-foreground mt-1">{subtitle}</p>}
          {trend && <p className="text-[10px] text-status-success font-medium mt-1">{trend}</p>}
        </div>
        <div className={cn("p-2 rounded-md flex-shrink-0", accentStyles[accent])}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </div>
  );

  if (href) {
    return <Link to={href} className="block">{content}</Link>;
  }
  return content;
}
