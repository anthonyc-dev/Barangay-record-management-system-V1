import { useEffect, useState } from "react";
import { StatsCard } from "@/components/analytics/StatsCard";
import { ChartCard } from "@/components/analytics/ChartCard";
import { Users, UserCheck, DollarSign, Loader2 } from "lucide-react";
import { dashboardService } from "@/services/api/dashboardService";
import type { DashboardAnalytics } from "@/services/api/dashboardService";
import { useToast } from "@/hooks/use-toast";

export function OverviewSectionResident() {
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getDashboardAnalytics();
        setAnalytics(data);
      } catch (error) {
        console.error("Failed to fetch dashboard analytics:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard analytics. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center text-muted-foreground py-8">
        Failed to load dashboard data.
      </div>
    );
  }

  // Calculate trends
  // const activeCasesTrend: "up" | "down" =
  //   analytics.stats.activeCases < 10 ? "down" : "up";
  const revenueTrend: "up" | "down" =
    analytics.stats.growthRate >= 0 ? "up" : "down";

  // Format growth rate for display
  const growthRateDisplay =
    analytics.stats.growthRate >= 0
      ? `+${analytics.stats.growthRate.toFixed(1)}%`
      : `${analytics.stats.growthRate.toFixed(1)}%`;

  // Count approved residents
  const approvedResidentsCount = analytics.residents.filter(
    (r) => r.status?.toLowerCase() === "approved"
  ).length;

  const statsData = [
    {
      title: "Total Population",
      value: analytics.stats.totalPopulation.toLocaleString(),
      change: `${approvedResidentsCount} Population`,
      trend: "up" as const,
      icon: Users,
      color: "primary" as const,
    },
    // {
    //   title: "Active Cases",
    //   value: analytics.stats.activeCases.toString(),
    //   change:
    //     analytics.complaints.length > 0
    //       ? `${(
    //           (analytics.stats.activeCases / analytics.complaints.length) *
    //           100
    //         ).toFixed(1)}%`
    //       : "0%",
    //   trend: activeCasesTrend,
    //   icon: Shield,
    //   color: "warning" as const,
    // },
    {
      title: "Clearing Officers",
      value: analytics.stats.clearingOfficers.toString(),
      change: `${analytics.officials.length} officers`,
      trend: "up" as const,
      icon: UserCheck,
      color: "success" as const,
    },
    // {
    //   title: "Documents Issued",
    //   value: analytics.stats.documentsIssued.toString(),
    //   change: "this month",
    //   trend: "up" as const,
    //   icon: FileText,
    //   color: "accent" as const,
    // },
    // {
    //   title: "Ready Documents",
    //   value: analytics.stats.readyDocuments.toString(),
    //   change: `₱${analytics.stats.readyDocumentsRevenue.toLocaleString()} total revenue`,
    //   trend: "up" as const,
    //   icon: FileCheck,
    //   color: "success" as const,
    // },
    {
      title: "Total Revenue",
      value: `₱${analytics.stats.totalRevenue.toLocaleString()}`,
      change: growthRateDisplay,
      trend: revenueTrend,
      icon: DollarSign,
      color: "primary" as const,
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

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <ChartCard
          title="Population Growth Trend"
          type="line"
          data={analytics.populationGrowth}
        />

        {/* <ChartCard
          title="Monthly Service Requests"
          type="bar"
          data={analytics.serviceRequests}
        /> */}
      </div>
    </div>
  );
}
