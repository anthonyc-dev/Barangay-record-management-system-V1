import { StatsCard } from "@/components/analytics/StatsCard";
import { ChartCard } from "@/components/analytics/ChartCard";
import { Heart, User, Gift } from "lucide-react";

export function HealthAnalytics() {
  const healthStats = [
    {
      title: "Senior Citizens",
      value: "567",
      change: "+4.2%",
      trend: "up" as const,
      icon: User,
      color: "primary" as const,
    },
    {
      title: "PWDs Registered",
      value: "89",
      change: "+1.1%",
      trend: "up" as const,
      icon: Heart,
      color: "success" as const,
    },
    {
      title: "Pregnant Women",
      value: "34",
      change: "-2.9%",
      trend: "down" as const,
      icon: Heart,
      color: "warning" as const,
    },
    {
      title: "Assistance Provided",
      value: "234",
      change: "+15.6%",
      trend: "up" as const,
      icon: Gift,
      color: "accent" as const,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Health & Social Services
        </h1>
        <p className="text-muted-foreground mt-2">
          Monitor health services and social assistance programs in the
          barangay.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {healthStats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Vaccination Coverage"
          type="bar"
          data={[
            { vaccine: "COVID-19", coverage: 92 },
            { vaccine: "Flu", coverage: 78 },
            { vaccine: "Pneumonia", coverage: 65 },
            { vaccine: "Measles", coverage: 98 },
          ]}
        />

        <ChartCard
          title="Monthly Assistance Distribution"
          type="line"
          data={[
            { month: "Jan", assistance: 45 },
            { month: "Feb", assistance: 52 },
            { month: "Mar", assistance: 38 },
            { month: "Apr", assistance: 67 },
            { month: "May", assistance: 59 },
            { month: "Jun", assistance: 73 },
          ]}
        />
      </div>
    </div>
  );
}
