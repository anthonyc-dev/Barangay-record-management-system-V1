import { StatsCard } from "@/components/analytics/StatsCard";
import { ChartCard } from "@/components/analytics/ChartCard";
import { Map, MapPin, Home, Users } from "lucide-react";

export function GeographicalAnalytics() {
  const geoStats = [
    {
      title: "Total Puroks",
      value: "7",
      change: "0%",
      trend: "up" as const,
      icon: Map,
      color: "primary" as const,
    },
    {
      title: "Densest Purok",
      value: "Purok 3",
      change: "+5%",
      trend: "up" as const,
      icon: MapPin,
      color: "success" as const,
    },
    {
      title: "Avg Household/Purok",
      value: "161",
      change: "+3%",
      trend: "up" as const,
      icon: Home,
      color: "accent" as const,
    },
    {
      title: "Population Density",
      value: "24/km²",
      change: "+2%",
      trend: "up" as const,
      icon: Users,
      color: "warning" as const,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Geographical Analytics
        </h1>
        <p className="text-muted-foreground mt-2">
          Analyze population distribution across puroks and geographical
          insights.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {geoStats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Population by Purok"
          type="bar"
          data={[
            { purok: "Purok 1", population: 580 },
            { purok: "Purok 2", population: 632 },
            { purok: "Purok 3", population: 721 },
            { purok: "Purok 4", population: 598 },
            { purok: "Purok 5", population: 645 },
            { purok: "Purok 6", population: 567 },
            { purok: "Purok 7", population: 769 },
          ]}
        />

        <ChartCard
          title="Household Distribution"
          type="bar"
          data={[
            { purok: "Purok 1", households: 145 },
            { purok: "Purok 2", households: 158 },
            { purok: "Purok 3", households: 180 },
            { purok: "Purok 4", households: 149 },
            { purok: "Purok 5", households: 161 },
            { purok: "Purok 6", households: 142 },
            { purok: "Purok 7", households: 193 },
          ]}
        />
      </div>
    </div>
  );
}
