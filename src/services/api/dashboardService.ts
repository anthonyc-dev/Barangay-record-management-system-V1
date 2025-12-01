import { residentService } from "./residentService";
import type { Resident } from "./residentService";
import { complainantService } from "./complainantService";
import type { Complaint, GetComplaintsResponse } from "./complainantService";
import { documentService } from "./documentService";
import type { DocumentRequest } from "./documentService";
import { reportService } from "./reportService";
import type { ReportEntry } from "./reportService";
import { eventService } from "./eventService";
import type { Event } from "./eventService";
import { folderService } from "./folderService";
import type { Folder } from "./folderService";
import { officialService } from "./officialService";
import type { Official } from "./officialService";

export interface DashboardStats {
  totalPopulation: number;
  activeCases: number;
  clearingOfficers: number;
  documentsIssued: number;
  readyDocuments: number;
  readyDocumentsRevenue: number;
  totalRevenue: number;
  growthRate: number;
}

export interface DashboardAnalytics {
  stats: DashboardStats;
  residents: Resident[];
  complaints: Complaint[];
  documents: DocumentRequest[];
  events: Event[];
  folders: Folder[];
  officials: Official[];
  populationGrowth: Array<{ month: string; population: number }>;
  serviceRequests: Array<{ month: string; requests: number }>;
}

export const dashboardService = {
  /**
   * Fetch all dashboard data for analytics
   * Aggregates data from multiple endpoints
   */
  getDashboardAnalytics: async (): Promise<DashboardAnalytics> => {
    try {
      // Fetch all data in parallel for better performance
      const [
        residentsData,
        complaintsData,
        documentsData,
        reportsData,
        eventsData,
        foldersData,
        officialsData,
      ] = await Promise.all([
        residentService.getAll().catch(() => ({ data: [] as Resident[] })),
        complainantService.getAllComplaints().catch(() => [] as Complaint[]),
        documentService
          .getAllDocuments()
          .catch(() => ({ data: [] as DocumentRequest[] })),
        reportService.getReportDisplay().catch(() => [] as ReportEntry[]),
        eventService.getAll().catch(() => [] as Event[]),
        folderService.getAll().catch(() => [] as Folder[]),
        officialService.getAll().catch(() => ({ data: [] as Official[] })),
      ]);

      // Extract data from responses
      const residents = residentsData.data || [];
      const complaints = normalizeComplaintsResponse(complaintsData);
      const documents = documentsData.data || [];
      const reports = reportsData || [];
      const events = eventsData || [];
      const folders = foldersData || [];
      const officials = officialsData.data || [];

      // Calculate statistics (now using reports for revenue)
      const stats = calculateStats(
        residents,
        complaints,
        documents,
        reports,
        officials
      );

      // Calculate trends
      const populationGrowth = calculatePopulationGrowth(residents);
      const serviceRequests = calculateServiceRequests(documents);

      return {
        stats,
        residents,
        complaints,
        documents,
        events,
        folders,
        officials,
        populationGrowth,
        serviceRequests,
      };
    } catch (error) {
      console.error("Error fetching dashboard analytics:", error);
      throw error;
    }
  },

  /**
   * Fetch only statistics (lighter payload)
   */
  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      const [
        residentsData,
        complaintsData,
        documentsData,
        reportsData,
        officialsData,
      ] = await Promise.all([
        residentService.getAll().catch(() => ({ data: [] as Resident[] })),
        complainantService.getAllComplaints().catch(() => [] as Complaint[]),
        documentService
          .getAllDocuments()
          .catch(() => ({ data: [] as DocumentRequest[] })),
        reportService.getReportDisplay().catch(() => [] as ReportEntry[]),
        officialService.getAll().catch(() => ({ data: [] as Official[] })),
      ]);

      const residents = residentsData.data || [];
      const complaints = normalizeComplaintsResponse(complaintsData);
      const documents = documentsData.data || [];
      const reports = reportsData || [];
      const officials = officialsData.data || [];

      return calculateStats(
        residents,
        complaints,
        documents,
        reports,
        officials
      );
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw error;
    }
  },

  /**
   * Fetch upcoming events
   */
  getUpcomingEvents: async (): Promise<Event[]> => {
    try {
      const events = await eventService.getAll();
      const now = new Date();

      // Filter and sort upcoming events
      return events
        .filter((event) => new Date(event.date) >= now)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 5); // Return top 5 upcoming events
    } catch (error) {
      console.error("Error fetching upcoming events:", error);
      return [];
    }
  },
};

function normalizeComplaintsResponse(
  complaints: Complaint[] | GetComplaintsResponse
): Complaint[] {
  if (Array.isArray(complaints)) {
    return complaints;
  }

  return complaints.data || [];
}

/**
 * Helper function to parse price from string to number
 */
function parsePrice(price: string | undefined): number {
  if (!price) return 30;
  const parsed = parseFloat(price);
  return isNaN(parsed) ? 30 : parsed;
}

/**
 * Calculate dashboard statistics from raw data
 */
function calculateStats(
  residents: Resident[],
  complaints: Complaint[],
  documents: DocumentRequest[],
  reports: ReportEntry[],
  officials: Official[]
): DashboardStats {
  // Total population - only count approved residents
  const totalPopulation = residents.filter(
    (r) => r.status?.toLowerCase() === "approved"
  ).length;

  // Active cases (pending or under investigation)
  const activeCases = complaints.filter(
    (c) => c.status === "pending" || c.status === "under_investigation"
  ).length;

  // Clearing Officers (count of all officials/admins)
  const clearingOfficers = officials.length;

  // Documents issued this month - only count documents with "ready" status
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const documentsIssued = documents.filter((d) => {
    if (!d.created_at || d.status !== "ready") return false;
    const docDate = new Date(d.created_at);
    return (
      docDate.getMonth() === currentMonth &&
      docDate.getFullYear() === currentYear
    );
  }).length;

  // Ready documents (for transparency - documents ready for pickup/claim)
  const readyDocuments = documents.filter((d) => d.status === "ready").length;

  // Calculate revenue from ready status reports only (using report entries)
  const readyReports = reports.filter((r) => r.status === "ready");

  const readyDocumentsRevenue = readyReports.reduce((sum, report) => {
    return sum + parsePrice(report.price);
  }, 0);

  // Total revenue - only count reports with "ready" status
  const totalRevenue = readyReports.reduce((sum, report) => {
    return sum + parsePrice(report.price);
  }, 0);

  // Revenue this month (for growth rate calculation) - only count "ready" reports
  const revenueThisMonth = reports
    .filter((r) => {
      if (r.status !== "ready") return false;
      const reportDate = r.request_date || r.created_at;
      if (!reportDate) return false;
      const docDate = new Date(reportDate);
      return (
        docDate.getMonth() === currentMonth &&
        docDate.getFullYear() === currentYear
      );
    })
    .reduce((sum, report) => {
      return sum + parsePrice(report.price);
    }, 0);

  // Revenue last month (for growth rate calculation) - only count "ready" reports
  const lastMonth = currentMonth - 1;
  const lastMonthYear = lastMonth < 0 ? currentYear - 1 : currentYear;
  const lastMonthIndex = lastMonth < 0 ? 11 : lastMonth;

  const revenueLastMonth = reports
    .filter((r) => {
      if (r.status !== "ready") return false;
      const reportDate = r.request_date || r.created_at;
      if (!reportDate) return false;
      const docDate = new Date(reportDate);
      return (
        docDate.getMonth() === lastMonthIndex &&
        docDate.getFullYear() === lastMonthYear
      );
    })
    .reduce((sum, report) => {
      return sum + parsePrice(report.price);
    }, 0);

  // Growth rate (revenue growth compared to last month)
  const growthRate =
    revenueLastMonth > 0
      ? ((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100
      : revenueThisMonth > 0
      ? 100 // If no revenue last month but have revenue this month, 100% growth
      : 0; // If no revenue in both months, 0% growth

  return {
    totalPopulation,
    activeCases,
    clearingOfficers,
    documentsIssued,
    readyDocuments,
    readyDocumentsRevenue,
    totalRevenue,
    growthRate,
  };
}

/**
 * Calculate population growth trend (last 6 months)
 */
function calculatePopulationGrowth(
  residents: Resident[]
): Array<{ month: string; population: number }> {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const now = new Date();
  const result: Array<{ month: string; population: number }> = [];

  // Get last 6 months
  for (let i = 5; i >= 0; i--) {
    const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthIndex = targetDate.getMonth();
    const year = targetDate.getFullYear();

    // Count approved residents registered up to this month
    const population = residents.filter((r) => {
      if (!r.created_at || r.status?.toLowerCase() !== "approved") return false;
      const resDate = new Date(r.created_at);
      return resDate <= new Date(year, monthIndex + 1, 0);
    }).length;

    result.push({
      month: months[monthIndex],
      population,
    });
  }

  return result;
}

/**
 * Calculate service requests trend (last 6 months)
 */
function calculateServiceRequests(
  documents: DocumentRequest[]
): Array<{ month: string; requests: number }> {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const now = new Date();
  const result: Array<{ month: string; requests: number }> = [];

  // Get last 6 months
  for (let i = 5; i >= 0; i--) {
    const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthIndex = targetDate.getMonth();
    const year = targetDate.getFullYear();

    // Count documents created in this month
    const requests = documents.filter((d) => {
      if (!d.created_at) return false;
      const docDate = new Date(d.created_at);
      return (
        docDate.getMonth() === monthIndex && docDate.getFullYear() === year
      );
    }).length;

    result.push({
      month: months[monthIndex],
      requests,
    });
  }

  return result;
}

export default dashboardService;
