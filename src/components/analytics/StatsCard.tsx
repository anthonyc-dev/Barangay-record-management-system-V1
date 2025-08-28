import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: LucideIcon;
  color: "primary" | "success" | "warning" | "accent";
}

export function StatsCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  color,
}: StatsCardProps) {
  const colorClasses = {
    primary: "bg-primary text-primary-foreground",
    success: "bg-gradient-to-br from-green-500 to-green-600 text-white",
    warning: "bg-gradient-to-br from-yellow-500 to-yellow-600 text-white",
    accent: "bg-gradient-to-br from-green-500 to-green-600 text-white",
  };

  return (
    <Card className="p-6 bg-card border-0 shadow-none hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <div className="flex items-center space-x-1">
              {trend === "up" ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span
                className={cn(
                  "text-sm font-medium",
                  trend === "up" ? "text-green-500" : "text-red-500"
                )}
              >
                {change}
              </span>
            </div>
          </div>
        </div>

        <div
          className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center",
            colorClasses[color]
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </Card>
  );
}
