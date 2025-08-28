import { StatsCard } from "@/components/analytics/StatsCard";
import { ChartCard } from "@/components/analytics/ChartCard";
import { Shield, AlertTriangle, CheckCircle, Clock } from "lucide-react";

export function IncidentAnalytics() {
  const incidentStats = [
    {
      title: "Total Cases",
      value: "23",
      change: "-15%",
      trend: "down" as const,
      icon: Shield,
      color: "primary" as const,
    },
    {
      title: "Resolved Cases",
      value: "18",
      change: "+8%",
      trend: "up" as const,
      icon: CheckCircle,
      color: "success" as const,
    },
    {
      title: "Pending Cases",
      value: "5",
      change: "-50%",
      trend: "down" as const,
      icon: Clock,
      color: "warning" as const,
    },
    {
      title: "Resolution Rate",
      value: "78%",
      change: "+12%",
      trend: "up" as const,
      icon: AlertTriangle,
      color: "accent" as const,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Cases & Incidents
        </h1>
        <p className="text-muted-foreground mt-2">
          Track and analyze barangay incident reports and case management.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {incidentStats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Cases by Type"
          type="bar"
          data={[
            { type: "Disputes", count: 8 },
            { type: "Theft", count: 5 },
            { type: "Noise", count: 6 },
            { type: "Others", count: 4 },
          ]}
        />

        <ChartCard
          title="Monthly Case Trends"
          type="line"
          data={[
            { month: "Jan", cases: 15 },
            { month: "Feb", cases: 22 },
            { month: "Mar", cases: 18 },
            { month: "Apr", cases: 12 },
            { month: "May", cases: 28 },
            { month: "Jun", cases: 23 },
          ]}
        />
      </div>
    </div>
  );
}
