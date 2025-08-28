import { StatsCard } from "@/components/analytics/StatsCard";
import { ChartCard } from "@/components/analytics/ChartCard";
import { FileText, Award, DollarSign, TrendingUp } from "lucide-react";

export function DocumentAnalytics() {
  const documentStats = [
    {
      title: "Documents Issued",
      value: "156",
      change: "+12%",
      trend: "up" as const,
      icon: FileText,
      color: "primary" as const,
    },
    {
      title: "Clearances",
      value: "89",
      change: "+8%",
      trend: "up" as const,
      icon: Award,
      color: "success" as const,
    },
    {
      title: "Revenue Generated",
      value: "₱15,600",
      change: "+18%",
      trend: "up" as const,
      icon: DollarSign,
      color: "accent" as const,
    },
    {
      title: "Processing Time",
      value: "1.2 days",
      change: "-20%",
      trend: "down" as const,
      icon: TrendingUp,
      color: "warning" as const,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Document Services
        </h1>
        <p className="text-muted-foreground mt-2">
          Monitor document requests, processing times, and revenue generation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {documentStats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Document Types Issued"
          type="bar"
          data={[
            { type: "Clearance", count: 89 },
            { type: "Permit", count: 34 },
            { type: "Certificate", count: 23 },
            { type: "ID", count: 10 },
          ]}
        />

        <ChartCard
          title="Daily Request Volume"
          type="line"
          data={[
            { day: "Mon", requests: 12 },
            { day: "Tue", requests: 19 },
            { day: "Wed", requests: 15 },
            { day: "Thu", requests: 22 },
            { day: "Fri", requests: 18 },
            { day: "Sat", requests: 8 },
          ]}
        />
      </div>
    </div>
  );
}
