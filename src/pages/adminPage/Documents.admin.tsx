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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Filter,
  Download,
  FileText,
  Calendar,
  DollarSign,
  Eye,
  Printer,
  Trash2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import documentService from "@/services/api/documentService";
import type { DocumentRequest } from "@/services/api/documentService";

const documentTypes = [
  {
    name: "Barangay Clearance",
    description: "Certification for employment, travel, and other purposes",
    fee: "₱50.00",
    icon: FileText,
    color: "bg-primary",
  },
  {
    name: "Certificate of Indigency",
    description: "For qualified residents needing assistance",
    fee: "Free",
    icon: FileText,
    color: "bg-green-500",
  },
  {
    name: "Certificate of Residency",
    description: "Proof of residence in the barangay",
    fee: "₱30.00",
    icon: FileText,
    color: "bg-yellow-500",
  },
  {
    name: "Business Permit",
    description: "Local business registration and permits",
    fee: "₱100.00",
    icon: DollarSign,
    color: "bg-destructive",
  },
];

export default function Documents() {
  const [documents, setDocuments] = useState<DocumentRequest[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<DocumentRequest[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<number | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentRequest | null>(null);

  // Fetch all documents on component mount
  useEffect(() => {
    fetchDocuments();
  }, []);

  // Filter documents when search query changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredDocuments(documents);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = documents.filter(
        (doc) =>
          doc.reference_number?.toLowerCase().includes(query) ||
          doc.full_name.toLowerCase().includes(query) ||
          doc.document_type.toLowerCase().includes(query) ||
          doc.email.toLowerCase().includes(query)
      );
      setFilteredDocuments(filtered);
    }
  }, [searchQuery, documents]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await documentService.getAllDocuments();
      setDocuments(response.data);
      setFilteredDocuments(response.data);
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast.error("Failed to load documents. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (
    documentId: number,
    newStatus: "pending" | "ready"
  ) => {
    try {
      setUpdatingStatus(documentId);
      await documentService.updateRequest(documentId, { status: newStatus });

      // Update local state
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === documentId ? { ...doc, status: newStatus } : doc
        )
      );

      toast.success(`Document status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating document status:", error);
      toast.error("Failed to update document status. Please try again.");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleDeleteClick = (documentId: number) => {
    setDocumentToDelete(documentId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (documentToDelete === null) return;

    try {
      await documentService.deleteRequest(documentToDelete);

      // Remove from local state
      setDocuments((prev) => prev.filter((doc) => doc.id !== documentToDelete));

      toast.success("Document deleted successfully");
      setDeleteDialogOpen(false);
      setDocumentToDelete(null);
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Failed to delete document. Please try again.");
    }
  };

  const handleViewDocument = (document: DocumentRequest) => {
    setSelectedDocument(document);
    setViewDialogOpen(true);
  };

  const handlePrintDocument = (document: DocumentRequest) => {
    // Create a print-friendly window
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Please allow popups to print documents");
      return;
    }

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Document Request - ${document.reference_number || "N/A"}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              max-width: 800px;
              margin: 0 auto;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #333;
              padding-bottom: 20px;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
            }
            .header p {
              margin: 5px 0;
              color: #666;
            }
            .content {
              margin: 20px 0;
            }
            .field {
              margin: 15px 0;
              display: flex;
              border-bottom: 1px solid #eee;
              padding: 10px 0;
            }
            .field-label {
              font-weight: bold;
              width: 200px;
              color: #333;
            }
            .field-value {
              flex: 1;
              color: #666;
            }
            .status {
              display: inline-block;
              padding: 5px 15px;
              border-radius: 5px;
              font-weight: bold;
              text-transform: uppercase;
            }
            .status-pending {
              background-color: #fff3cd;
              color: #856404;
            }
            .status-ready {
              background-color: #d4edda;
              color: #155724;
            }
            @media print {
              body {
                padding: 20px;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Barangay Document Request</h1>
            <p>Document Management System</p>
          </div>
          <div class="content">
            <div class="field">
              <div class="field-label">Reference Number:</div>
              <div class="field-value">${document.reference_number || "N/A"}</div>
            </div>
            <div class="field">
              <div class="field-label">Document Type:</div>
              <div class="field-value">${document.document_type}</div>
            </div>
            <div class="field">
              <div class="field-label">Full Name:</div>
              <div class="field-value">${document.full_name}</div>
            </div>
            <div class="field">
              <div class="field-label">Email:</div>
              <div class="field-value">${document.email}</div>
            </div>
            <div class="field">
              <div class="field-label">Contact Number:</div>
              <div class="field-value">${document.contact_number}</div>
            </div>
            <div class="field">
              <div class="field-label">Purpose:</div>
              <div class="field-value">${document.purpose}</div>
            </div>
            <div class="field">
              <div class="field-label">Status:</div>
              <div class="field-value">
                <span class="status status-${document.status || "pending"}">
                  ${document.status || "pending"}
                </span>
              </div>
            </div>
            <div class="field">
              <div class="field-label">Request Date:</div>
              <div class="field-value">${document.created_at ? new Date(document.created_at).toLocaleDateString() : "N/A"}</div>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    toast.success("Print dialog opened");
  };

  const handleExportToExcel = () => {
    try {
      // Prepare data for Excel export
      const exportData = filteredDocuments.map((doc) => ({
        "Reference Number": doc.reference_number || "N/A",
        "Document Type": doc.document_type,
        "Full Name": doc.full_name,
        "Email": doc.email,
        "Contact Number": doc.contact_number,
        "Purpose": doc.purpose,
        "Status": doc.status || "pending",
        "Request Date": doc.created_at
          ? new Date(doc.created_at).toLocaleDateString()
          : "N/A",
      }));

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
        { wch: 10 }, // Status
        { wch: 15 }, // Request Date
      ];
      ws["!cols"] = colWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, "Document Requests");

      // Generate filename with current date
      const fileName = `Document_Requests_${new Date().toISOString().split("T")[0]}.xlsx`;

      // Save file
      XLSX.writeFile(wb, fileName);

      toast.success("Excel file exported successfully");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      toast.error("Failed to export to Excel. Please try again.");
    }
  };

  // Calculate stats
  const stats = {
    total: documents.length,
    pending: documents.filter((doc) => doc.status === "pending").length,
    ready: documents.filter((doc) => doc.status === "ready").length,
  };

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Document Management</h1>
          <p className="text-muted-foreground">
            Track and manage resident document requests
          </p>
        </div>
      </div>

      {/* Document Types Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {documentTypes.map((docType) => {
          const Icon = docType.icon;
          return (
            <Card
              key={docType.name}
              className="cursor-pointer transition-all hover:shadow-md"
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-lg ${docType.color}`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{docType.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {docType.description}
                    </p>
                    <p className="text-sm font-medium text-primary mt-2">
                      {docType.fee}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
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
                  Ready for Pickup
                </p>
                <p className="text-2xl font-bold text-success">{stats.ready}</p>
              </div>
              <Calendar className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
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
              <Button variant="outline">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={handleExportToExcel}
                disabled={filteredDocuments.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Export to Excel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle>Document Requests</CardTitle>
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
                  ? "No documents found matching your search."
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
                        Contact
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Actions
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
                          <p className="text-sm">{document.contact_number}</p>
                        </td>
                        <td className="py-3 px-4">
                          <Select
                            value={document.status || "pending"}
                            onValueChange={(value: "pending" | "ready") =>
                              handleStatusUpdate(document.id!, value)
                            }
                            disabled={updatingStatus === document.id}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">
                                <Badge
                                  variant="secondary"
                                  className="bg-warning/10 text-warning"
                                >
                                  Pending
                                </Badge>
                              </SelectItem>
                              <SelectItem value="ready">
                                <Badge
                                  variant="secondary"
                                  className="bg-success/10 text-success"
                                >
                                  Ready
                                </Badge>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              title="View details"
                              onClick={() => handleViewDocument(document)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Print"
                              onClick={() => handlePrintDocument(document)}
                            >
                              <Printer className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteClick(document.id!)}
                              title="Delete"
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this document request. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDocumentToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View Document Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Document Request Details</DialogTitle>
            <DialogDescription>
              Complete information about this document request
            </DialogDescription>
          </DialogHeader>

          {selectedDocument && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Reference Number
                  </p>
                  <p className="text-base font-semibold">
                    {selectedDocument.reference_number || "N/A"}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Status
                  </p>
                  <Badge
                    variant="secondary"
                    className={
                      selectedDocument.status === "ready"
                        ? "bg-success/10 text-success"
                        : "bg-warning/10 text-warning"
                    }
                  >
                    {selectedDocument.status || "pending"}
                  </Badge>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Document Information</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Document Type
                    </p>
                    <p className="text-base">{selectedDocument.document_type}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Purpose
                    </p>
                    <p className="text-base">{selectedDocument.purpose}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Requestor Information</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Full Name
                    </p>
                    <p className="text-base">{selectedDocument.full_name}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Email Address
                    </p>
                    <p className="text-base">{selectedDocument.email}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Contact Number
                    </p>
                    <p className="text-base">{selectedDocument.contact_number}</p>
                  </div>
                </div>
              </div>

              {selectedDocument.created_at && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Request Details</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Request Date
                      </p>
                      <p className="text-base">
                        {new Date(selectedDocument.created_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => handlePrintDocument(selectedDocument)}
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
                <Button
                  variant="default"
                  onClick={() => setViewDialogOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
