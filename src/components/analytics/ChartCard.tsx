import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

interface ChartData {
  month?: string;
  population?: number;
  requests?: number;
  type?: string;
  count?: number;
  source?: string;
  revenue?: number;
  households?: number;
  vaccine?: string;
  assistance?: number;
  day?: string;
  purok?: string;
  coverage?: number;
  cases?: number;
  year?: string;
  category?: string;
}

interface ChartCardProps {
  title: string;
  type: "line" | "bar";
  data: ChartData[];
}

export function ChartCard({ title, type, data }: ChartCardProps) {
  return (
    <Card className="p-6 bg-card border-0 shadow-none">
      <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {type === "line" ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="month"
                className="stroke-muted-foreground text-xs"
                fontSize={12}
              />
              <YAxis
                className="stroke-muted-foreground text-xs"
                fontSize={12}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                  color: "hsl(var(--card-foreground))",
                }}
              />
              <Line
                type="monotone"
                dataKey="population"
                className="stroke-primary"
                strokeWidth={3}
                dot={{
                  className: "fill-primary stroke-primary",
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="month"
                className="stroke-muted-foreground text-xs"
                fontSize={12}
              />
              <YAxis
                className="stroke-muted-foreground text-xs"
                fontSize={12}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                  color: "hsl(var(--card-foreground))",
                }}
              />
              <Bar dataKey="requests" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
