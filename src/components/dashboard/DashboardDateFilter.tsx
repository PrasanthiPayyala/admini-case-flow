import { CalendarDays, X } from "lucide-react";

interface Props {
  from: string;
  to: string;
  onChange: (from: string, to: string) => void;
  className?: string;
}

export function DashboardDateFilter({ from, to, onChange, className }: Props) {
  const clear = () => onChange("", "");
  const hasFilter = from || to;
  return (
    <div className={`govt-card px-3 py-2 mb-3 flex flex-wrap items-center gap-2 ${className || ""}`}>
      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-foreground">
        <CalendarDays className="h-3.5 w-3.5 text-primary" />
        Date Filter (Filing Date)
      </div>
      <div className="flex items-center gap-1.5">
        <label className="text-[10px] text-muted-foreground">From</label>
        <input
          type="date"
          value={from}
          onChange={e => onChange(e.target.value, to)}
          className="h-7 text-[11px] rounded border border-border bg-background px-2 focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <label className="text-[10px] text-muted-foreground ml-1">To</label>
        <input
          type="date"
          value={to}
          onChange={e => onChange(from, e.target.value)}
          className="h-7 text-[11px] rounded border border-border bg-background px-2 focus:outline-none focus:ring-1 focus:ring-primary"
        />
        {hasFilter && (
          <button
            onClick={clear}
            className="h-7 px-2 inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground rounded border border-border"
          >
            <X className="h-3 w-3" /> Clear
          </button>
        )}
      </div>
      {hasFilter && (
        <span className="text-[10px] text-primary ml-auto">
          Filtering by filing date
        </span>
      )}
    </div>
  );
}
