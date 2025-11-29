import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Download,
  FileText,
  DollarSign,
  TrendingUp,
  Calendar,
  Loader2,
  CalendarDays,
  CalendarRange,
} from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import documentService from "@/services/api/documentService";
import type { DocumentRequest } from "@/services/api/documentService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TimePeriod = "all" | "daily" | "weekly" | "monthly" | "yearly";

// Helper function to get document price based on type
const getDocumentPrice = (documentType: string): number => {
  const type = documentType.toLowerCase();

  // Clearance Certification - ₱40
  if (type.includes("clearance")) {
    return 40;
  }

  // Certification (Residency, etc.) - ₱30
  if (type.includes("certification") || type.includes("certificate")) {
    return 30;
  }

  // Default price
  return 30;
};

// Helper function to filter documents by time period
const filterByTimePeriod = (
  documents: DocumentRequest[],
  period: TimePeriod
): DocumentRequest[] => {
  if (period === "all") return documents;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return documents.filter((doc) => {
    if (!doc.created_at) return false;
    const docDate = new Date(doc.created_at);

    switch (period) {
      case "daily": {
        // Compare only year, month, and day (ignore time)
        return (
          docDate.getFullYear() === now.getFullYear() &&
          docDate.getMonth() === now.getMonth() &&
          docDate.getDate() === now.getDate()
        );
      }
      case "weekly": {
        // Last 7 days including today
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 7);
        // Reset time to start of day for proper comparison
        const docDay = new Date(
          docDate.getFullYear(),
          docDate.getMonth(),
          docDate.getDate()
        );
        return docDay >= weekAgo && docDay <= today;
      }
      case "monthly": {
        return (
          docDate.getMonth() === now.getMonth() &&
          docDate.getFullYear() === now.getFullYear()
        );
      }
      case "yearly": {
        return docDate.getFullYear() === now.getFullYear();
      }
      default:
        return true;
    }
  });
};

// Helper function to filter documents by custom date range
const filterByDateRange = (
  documents: DocumentRequest[],
  startDate: string,
  endDate: string
): DocumentRequest[] => {
  if (!startDate || !endDate) return documents;

  const start = new Date(startDate);
  const end = new Date(endDate);
  // Set end date to end of day
  end.setHours(23, 59, 59, 999);

  return documents.filter((doc) => {
    if (!doc.created_at) return false;
    const docDate = new Date(doc.created_at);
    const docDay = new Date(
      docDate.getFullYear(),
      docDate.getMonth(),
      docDate.getDate()
    );
    return docDay >= start && docDay <= end;
  });
};

const Report = () => {
  const [documents, setDocuments] = useState<DocumentRequest[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<DocumentRequest[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Fetch all documents on component mount
  useEffect(() => {
    fetchDocuments();
  }, []);

  // Filter documents when search query or time period changes - only show "ready" status
  useEffect(() => {
    let filtered = documents;

    // Only show documents with "ready" status
    filtered = filtered.filter((doc) => doc.status === "ready");

    // Apply time period filter first
    filtered = filterByTimePeriod(filtered, timePeriod);

    // Apply custom date range filter if both dates are set
    if (startDate && endDate) {
      filtered = filterByDateRange(filtered, startDate, endDate);
    }

    // Apply search filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (doc) =>
          doc.reference_number?.toLowerCase().includes(query) ||
          doc.full_name.toLowerCase().includes(query) ||
          doc.document_type.toLowerCase().includes(query) ||
          doc.email.toLowerCase().includes(query)
      );
    }

    setFilteredDocuments(filtered);
  }, [searchQuery, documents, timePeriod, startDate, endDate]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await documentService.getAllDocuments();

      // Add price to each document based on type
      const documentsWithPrice = response.data.map((doc) => ({
        ...doc,
        price: doc.price || getDocumentPrice(doc.document_type),
      }));

      setDocuments(documentsWithPrice);
      setFilteredDocuments(documentsWithPrice);
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast.error("Failed to load documents. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleExportToExcel = () => {
    try {
      // Get period label
      const periodLabels: Record<TimePeriod, string> = {
        all: "All Time",
        daily: "Today",
        weekly: "This Week",
        monthly: "This Month",
        yearly: "This Year",
      };

      // Add date range info if custom dates are set
      let periodLabel = periodLabels[timePeriod];
      if (startDate && endDate) {
        periodLabel += ` (${startDate} to ${endDate})`;
      }

      // Prepare data for Excel export
      const exportData: Array<Record<string, string>> = filteredDocuments.map(
        (doc) => ({
          "Reference Number": doc.reference_number || "N/A",
          "Document Type": doc.document_type,
          "Full Name": doc.full_name,
          Email: doc.email,
          "Contact Number": doc.contact_number,
          Purpose: doc.purpose,
          Price: `₱${doc.price || 30}.00`,
          Status: doc.status || "pending",
          "Request Date": doc.created_at
            ? new Date(doc.created_at).toLocaleDateString()
            : "N/A",
        })
      );

      // Add summary row
      const totalRevenue = filteredDocuments.reduce(
        (sum, doc) => sum + (doc.price || 30),
        0
      );

      exportData.push({
        "Reference Number": "",
        "Document Type": "",
        "Full Name": "",
        Email: "",
        "Contact Number": "",
        Purpose: "TOTAL REVENUE",
        Price: `₱${totalRevenue}.00`,
        Status: "",
        "Request Date": "",
      });

      // Create a new workbook
      const wb = XLSX.utils.book_new();

      // Convert data to worksheet
      const ws = XLSX.utils.json_to_sheet(exportData);

      // Set column widths
      const colWidths = [
        { wch: 18 }, // Reference Number
        { wch: 25 }, // Document Type
        { wch: 20 }, // Full Name
        { wch: 25 }, // Email
        { wch: 15 }, // Contact Number
        { wch: 30 }, // Purpose
        { wch: 12 }, // Price
        { wch: 10 }, // Status
        { wch: 15 }, // Request Date
      ];
      ws["!cols"] = colWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, "Document Requests");

      // Create summary sheet with time period stats
      const summaryData = [
        { Period: "Report Period", Value: periodLabel },
        { Period: "Report Generated", Value: new Date().toLocaleString() },
        { Period: "", Value: "" },
        { Period: "Time Period Breakdown", Value: "" },
        {
          Period: "Today",
          Value: `${
            stats.daily.count
          } docs - ₱${stats.daily.revenue.toLocaleString()}.00`,
        },
        {
          Period: "This Week",
          Value: `${
            stats.weekly.count
          } docs - ₱${stats.weekly.revenue.toLocaleString()}.00`,
        },
        {
          Period: "This Month",
          Value: `${
            stats.monthly.count
          } docs - ₱${stats.monthly.revenue.toLocaleString()}.00`,
        },
        {
          Period: "This Year",
          Value: `${
            stats.yearly.count
          } docs - ₱${stats.yearly.revenue.toLocaleString()}.00`,
        },
        { Period: "", Value: "" },
        {
          Period: "Current Filter Total",
          Value: `${
            filteredDocuments.length
          } docs - ₱${totalRevenue.toLocaleString()}.00`,
        },
      ];

      const summaryWs = XLSX.utils.json_to_sheet(summaryData);
      summaryWs["!cols"] = [{ wch: 25 }, { wch: 40 }];
      XLSX.utils.book_append_sheet(wb, summaryWs, "Summary");

      // Generate filename with current date and period
      const fileName = `Document_Report_${periodLabel
        .replace(/\s/g, "_")
        .replace(/[()]/g, "")}_${new Date().toISOString().split("T")[0]}.xlsx`;

      // Save file
      XLSX.writeFile(wb, fileName);

      toast.success("Excel report exported successfully");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      toast.error("Failed to export report. Please try again.");
    }
  };

  // Calculate statistics for different time periods
  const readyDocuments = documents.filter((doc) => doc.status === "ready");

  const dailyDocs = filterByTimePeriod(readyDocuments, "daily");
  const weeklyDocs = filterByTimePeriod(readyDocuments, "weekly");
  const monthlyDocs = filterByTimePeriod(readyDocuments, "monthly");
  const yearlyDocs = filterByTimePeriod(readyDocuments, "yearly");

  // Debug: Log the dates to console
  console.log("Current date:", new Date());
  console.log(
    "Ready documents with dates:",
    readyDocuments.map((doc) => ({
      ref: doc.reference_number,
      created_at: doc.created_at,
      parsed: doc.created_at ? new Date(doc.created_at) : null,
    }))
  );
  console.log("Daily docs:", dailyDocs.length);
  console.log("Weekly docs:", weeklyDocs.length);
  console.log("Monthly docs:", monthlyDocs.length);
  console.log("Yearly docs:", yearlyDocs.length);

  const stats = {
    total: documents.length,
    pending: documents.filter((doc) => doc.status === "pending").length,
    ready: readyDocuments.length,
    totalRevenue: documents.reduce((sum, doc) => sum + (doc.price || 30), 0),
    filteredRevenue: filteredDocuments.reduce(
      (sum, doc) => sum + (doc.price || 30),
      0
    ),
    daily: {
      count: dailyDocs.length,
      revenue: dailyDocs.reduce((sum, doc) => sum + (doc.price || 30), 0),
    },
    weekly: {
      count: weeklyDocs.length,
      revenue: weeklyDocs.reduce((sum, doc) => sum + (doc.price || 30), 0),
    },
    monthly: {
      count: monthlyDocs.length,
      revenue: monthlyDocs.reduce((sum, doc) => sum + (doc.price || 30), 0),
    },
    yearly: {
      count: yearlyDocs.length,
      revenue: yearlyDocs.reduce((sum, doc) => sum + (doc.price || 30), 0),
    },
  };

  // Group by document type
  const documentsByType = documents.reduce((acc, doc) => {
    const type = doc.document_type;
    if (!acc[type]) {
      acc[type] = { count: 0, revenue: 0 };
    }
    acc[type].count += 1;
    acc[type].revenue += doc.price || 30;
    return acc;
  }, {} as Record<string, { count: number; revenue: number }>);

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Document Requests Report</h1>
          <p className="text-muted-foreground">
            Comprehensive report of all document requests and revenue
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      {/* <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Requests
                </p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Pending
                </p>
                <p className="text-2xl font-bold text-warning">
                  {stats.pending}
                </p>
              </div>
              <div className="h-8 w-8 rounded-full bg-warning/10 flex items-center justify-center">
                <FileText className="h-4 w-4 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Ready
                </p>
                <p className="text-2xl font-bold text-success">{stats.ready}</p>
              </div>
              <Calendar className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div> */}

      {/* Time Period Revenue Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue by Time Period (Ready Documents Only)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Daily Report */}
            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-muted-foreground">
                      Today
                    </p>
                    <CalendarDays className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                    ₱{stats.daily.revenue.toLocaleString()}.00
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {stats.daily.count} document
                    {stats.daily.count !== 1 ? "s" : ""}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Report */}
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-muted-foreground">
                      This Week
                    </p>
                    <CalendarRange className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                    ₱{stats.weekly.revenue.toLocaleString()}.00
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {stats.weekly.count} document
                    {stats.weekly.count !== 1 ? "s" : ""}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Report */}
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-muted-foreground">
                      This Month
                    </p>
                    <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                    ₱{stats.monthly.revenue.toLocaleString()}.00
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {stats.monthly.count} document
                    {stats.monthly.count !== 1 ? "s" : ""}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Yearly Report */}
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-muted-foreground">
                      This Year
                    </p>
                    <DollarSign className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                    ₱{stats.yearly.revenue.toLocaleString()}.00
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {stats.yearly.count} document
                    {stats.yearly.count !== 1 ? "s" : ""}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Document Type Breakdown */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Card for Total Ready Revenue */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Record Revenue
                </p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  ₱{stats.filteredRevenue.toLocaleString()}.00
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Document Type Breakdown */}
        {Object.entries(documentsByType).map(([type, data]) => (
          <Card key={type}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">{type}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Requests</p>
                  <p className="text-2xl font-bold">{data.count}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
              <div className="flex flex-1 items-center space-x-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by reference number, name, email..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Select
                  value={timePeriod}
                  onValueChange={(value: TimePeriod) => setTimePeriod(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="daily">Today</SelectItem>
                    <SelectItem value="weekly">This Week</SelectItem>
                    <SelectItem value="monthly">This Month</SelectItem>
                    <SelectItem value="yearly">This Year</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  onClick={handleExportToExcel}
                  disabled={filteredDocuments.length === 0}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Report to Excel
                </Button>
              </div>
            </div>

            {/* Custom Date Range Inputs - Always Visible */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t">
              <Label className="text-sm font-semibold">
                Filter by Date Range:
              </Label>
              <div className="flex flex-col sm:flex-row items-center gap-3 flex-1">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Label
                    htmlFor="start-date"
                    className="text-sm whitespace-nowrap"
                  >
                    From:
                  </Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full sm:w-auto"
                  />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Label
                    htmlFor="end-date"
                    className="text-sm whitespace-nowrap"
                  >
                    To:
                  </Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full sm:w-auto"
                    min={startDate}
                  />
                </div>
                {startDate && endDate && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setStartDate("");
                      setEndDate("");
                    }}
                    className="w-full sm:w-auto"
                  >
                    Clear Dates
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Document Requests Details (Ready Documents)
              {(timePeriod !== "all" || (startDate && endDate)) && (
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  -{" "}
                  {timePeriod !== "all" &&
                    {
                      daily: "Today",
                      weekly: "This Week",
                      monthly: "This Month",
                      yearly: "This Year",
                    }[timePeriod]}
                  {timePeriod !== "all" && startDate && endDate && " | "}
                  {startDate && endDate && `${startDate} to ${endDate}`}
                </span>
              )}
            </CardTitle>
            <Badge variant="secondary" className="text-sm">
              Filtered Revenue: ₱{stats.filteredRevenue.toLocaleString()}.00
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchQuery
                  ? "No ready documents found matching your search."
                  : "No ready document requests yet."}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Reference #
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Document Type
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Requestor
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Purpose/Tumong/Rason
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Price
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Request Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDocuments.map((document) => (
                      <tr
                        key={document.id}
                        className="border-b border-border hover:bg-muted/50 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <p className="font-medium">
                            {document.reference_number || "N/A"}
                          </p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-medium">
                            {document.document_type}
                          </p>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{document.full_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {document.email}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm">{document.purpose}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm font-semibold text-green-600">
                            ₱{document.price || 30}.00
                          </p>
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            variant="secondary"
                            className={
                              document.status === "ready"
                                ? "bg-success/10 text-success"
                                : "bg-warning/10 text-warning"
                            }
                          >
                            {document.status || "pending"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm">
                            {document.created_at
                              ? new Date(
                                  document.created_at
                                ).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })
                              : "N/A"}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-primary bg-muted/30">
                      <td
                        colSpan={4}
                        className="py-4 px-4 text-right font-bold text-lg"
                      >
                        TOTAL:
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-lg font-bold text-green-600">
                          ₱{stats.filteredRevenue.toLocaleString()}.00
                        </p>
                      </td>
                      <td colSpan={2} className="py-4 px-4">
                        <p className="text-sm text-muted-foreground">
                          {filteredDocuments.length} request(s)
                        </p>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredDocuments.length} of {documents.length}{" "}
                  documents
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Report;
