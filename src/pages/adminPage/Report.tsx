import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Download,
  FileText,
  DollarSign,
  TrendingUp,
  Calendar,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import documentService from "@/services/api/documentService";
import type { DocumentRequest } from "@/services/api/documentService";

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

const Report = () => {
  const [documents, setDocuments] = useState<DocumentRequest[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<DocumentRequest[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Fetch all documents on component mount
  useEffect(() => {
    fetchDocuments();
  }, []);

  // Filter documents when search query or status filter changes
  useEffect(() => {
    let filtered = documents;

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

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((doc) => doc.status === statusFilter);
    }

    setFilteredDocuments(filtered);
  }, [searchQuery, statusFilter, documents]);

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
      XLSX.utils.book_append_sheet(wb, ws, "Document Requests Report");

      // Generate filename with current date
      const fileName = `Document_Requests_Report_${
        new Date().toISOString().split("T")[0]
      }.xlsx`;

      // Save file
      XLSX.writeFile(wb, fileName);

      toast.success("Excel report exported successfully");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      toast.error("Failed to export report. Please try again.");
    }
  };

  // Calculate statistics
  const stats = {
    total: documents.length,
    pending: documents.filter((doc) => doc.status === "pending").length,
    ready: documents.filter((doc) => doc.status === "ready").length,
    totalRevenue: documents.reduce((sum, doc) => sum + (doc.price || 30), 0),
    filteredRevenue: filteredDocuments.reduce(
      (sum, doc) => sum + (doc.price || 30),
      0
    ),
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
      <div className="grid gap-4 md:grid-cols-4">
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

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                  ₱{stats.totalRevenue.toLocaleString()}.00
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Document Type Breakdown */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                <div className="space-y-1 text-right">
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="text-xl font-bold text-green-600">
                    ₱{data.revenue.toLocaleString()}.00
                  </p>
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
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="ready">Ready</SelectItem>
                  <SelectItem value="reject">Reject</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
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
        </CardContent>
      </Card>

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Document Requests Details</CardTitle>
            {statusFilter !== "all" || searchQuery ? (
              <Badge variant="secondary" className="text-sm">
                Filtered Revenue: ₱{stats.filteredRevenue.toLocaleString()}.00
              </Badge>
            ) : null}
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
                {searchQuery || statusFilter !== "all"
                  ? "No documents found matching your filters."
                  : "No document requests yet."}
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
                        Purpose
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
