import { StatsCard } from "@/components/analytics/StatsCard";
import { ChartCard } from "@/components/analytics/ChartCard";
import { DollarSign, TrendingUp, PieChart, CreditCard } from "lucide-react";

export function FinancialAnalytics() {
  const financialStats = [
    {
      title: "Monthly Revenue",
      value: "₱45,280",
      change: "+18%",
      trend: "up" as const,
      icon: DollarSign,
      color: "primary" as const,
    },
    {
      title: "Collections",
      value: "₱32,150",
      change: "+12%",
      trend: "up" as const,
      icon: CreditCard,
      color: "success" as const,
    },
    {
      title: "Budget Allocation",
      value: "₱180,000",
      change: "+5%",
      trend: "up" as const,
      icon: PieChart,
      color: "accent" as const,
    },
    {
      title: "Growth Rate",
      value: "8.5%",
      change: "+2.1%",
      trend: "up" as const,
      icon: TrendingUp,
      color: "warning" as const,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Financial Analytics
        </h1>
        <p className="text-muted-foreground mt-2">
          Track revenue, collections, budget allocation, and financial
          performance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {financialStats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Revenue Sources"
          type="bar"
          data={[
            { source: "Permits", revenue: 15600 },
            { source: "Clearances", revenue: 22400 },
            { source: "Fees", revenue: 7280 },
            { source: "Others", revenue: 3200 },
          ]}
        />

        <ChartCard
          title="Monthly Revenue Trend"
          type="line"
          data={[
            { month: "Jan", revenue: 38500 },
            { month: "Feb", revenue: 42200 },
            { month: "Mar", revenue: 39800 },
            { month: "Apr", revenue: 44100 },
            { month: "May", revenue: 46700 },
            { month: "Jun", revenue: 45280 },
          ]}
        />
      </div>
    </div>
  );
}
