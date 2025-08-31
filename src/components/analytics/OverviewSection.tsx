import { StatsCard } from "@/components/analytics/StatsCard";
import { ChartCard } from "@/components/analytics/ChartCard";
import {
  Users,
  Heart,
  Shield,
  FileText,
  DollarSign,
  TrendingUp,
} from "lucide-react";

export function OverviewSection() {
  const statsData = [
    {
      title: "Total Population",
      value: "4,512",
      change: "+2.3%",
      trend: "up" as const,
      icon: Users,
      color: "primary" as const,
    },
    {
      title: "Active Cases",
      value: "23",
      change: "-15%",
      trend: "down" as const,
      icon: Shield,
      color: "warning" as const,
    },
    {
      title: "Services Rendered",
      value: "342",
      change: "+8.5%",
      trend: "up" as const,
      icon: Heart,
      color: "success" as const,
    },
    {
      title: "Documents Issued",
      value: "156",
      change: "+12%",
      trend: "up" as const,
      icon: FileText,
      color: "accent" as const,
    },
    {
      title: "Revenue This Month",
      value: "₱45,280",
      change: "+18%",
      trend: "up" as const,
      icon: DollarSign,
      color: "primary" as const,
    },
    {
      title: "Growth Rate",
      value: "3.2%",
      change: "+0.5%",
      trend: "up" as const,
      icon: TrendingUp,
      color: "success" as const,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to Barangay Analytics Dashboard. Here's your community
          overview.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Population Growth Trend"
          type="line"
          data={[
            { month: "Jan", population: 4200 },
            { month: "Feb", population: 4280 },
            { month: "Mar", population: 4350 },
            { month: "Apr", population: 4420 },
            { month: "May", population: 4485 },
            { month: "Jun", population: 4512 },
          ]}
        />

        <ChartCard
          title="Monthly Service Requests"
          type="bar"
          data={[
            { month: "Jan", requests: 120 },
            { month: "Feb", requests: 145 },
            { month: "Mar", requests: 132 },
            { month: "Apr", requests: 167 },
            { month: "May", requests: 189 },
            { month: "Jun", requests: 156 },
          ]}
        />
      </div>
    </div>
  );
}
