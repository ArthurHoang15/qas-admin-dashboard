import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number | string;
  previousValue?: number;
  suffix?: string;
  icon?: React.ReactNode;
}

export function StatsCard({
  title,
  value,
  previousValue,
  suffix,
  icon,
}: StatsCardProps) {
  const currentValue = typeof value === "number" ? value : 0;
  const change =
    previousValue !== undefined && previousValue > 0
      ? ((currentValue - previousValue) / previousValue) * 100
      : 0;

  const isPositive = change > 0;
  const isNegative = change < 0;
  const isNeutral = change === 0;

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      <div className="mt-2 text-3xl font-bold text-foreground">
        {typeof value === "number" ? value.toLocaleString() : value}
      </div>
      {previousValue !== undefined && (
        <div className="mt-1 flex items-center gap-1 text-xs">
          {isPositive && (
            <>
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className="text-emerald-500">+{change.toFixed(1)}%</span>
            </>
          )}
          {isNegative && (
            <>
              <TrendingDown className="h-3 w-3 text-rose-500" />
              <span className="text-rose-500">{change.toFixed(1)}%</span>
            </>
          )}
          {isNeutral && (
            <>
              <Minus className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">0%</span>
            </>
          )}
          {suffix && (
            <span className="text-muted-foreground ml-1">{suffix}</span>
          )}
        </div>
      )}
    </div>
  );
}
