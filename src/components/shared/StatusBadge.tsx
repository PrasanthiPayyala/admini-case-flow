import { cn } from "@/lib/utils";
import { statusColors, priorityColors } from "@/data/sampleData";

interface StatusBadgeProps {
  value: string;
  type?: "status" | "priority";
  className?: string;
}

export function StatusBadge({ value, type = "status", className }: StatusBadgeProps) {
  const colorMap = type === "priority" ? priorityColors : statusColors;
  const colors = colorMap[value] || "bg-muted text-muted-foreground border-border";

  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium border", colors, className)}>
      {value}
    </span>
  );
}
