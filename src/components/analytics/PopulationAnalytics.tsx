import { StatsCard } from "@/components/analytics/StatsCard";
import { ChartCard } from "@/components/analytics/ChartCard";
import { Users, Baby, UserCheck, Home } from "lucide-react";

export function PopulationAnalytics() {
  const populationStats = [
    {
      title: "Total Population",
      value: "4,512",
      change: "+2.3%",
      trend: "up" as const,
      icon: Users,
      color: "primary" as const,
    },
    {
      title: "Children (0-17)",
      value: "1,234",
      change: "+1.8%",
      trend: "up" as const,
      icon: Baby,
      color: "success" as const,
    },
    {
      title: "Senior Citizens (60+)",
      value: "567",
      change: "+4.2%",
      trend: "up" as const,
      icon: UserCheck,
      color: "accent" as const,
    },
    {
      title: "Households",
      value: "1,128",
      change: "+3.1%",
      trend: "up" as const,
      icon: Home,
      color: "warning" as const,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Population Analytics
        </h1>
        <p className="text-muted-foreground mt-2">
          Detailed insights into barangay population demographics and trends.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {populationStats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Age Group Distribution"
          type="bar"
          data={[
            { category: "0-17", count: 1234 },
            { category: "18-59", count: 2711 },
            { category: "60+", count: 567 },
          ]}
        />

        <ChartCard
          title="Population Growth by Year"
          type="line"
          data={[
            { year: "2019", population: 4100 },
            { year: "2020", population: 4200 },
            { year: "2021", population: 4300 },
            { year: "2022", population: 4400 },
            { year: "2023", population: 4512 },
          ]}
        />
      </div>
    </div>
  );
}
