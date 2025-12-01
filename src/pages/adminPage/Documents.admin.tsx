import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Download,
  FileText,
  Calendar,
  Eye,
  Printer,
  Loader2,
  Edit,
} from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import documentService from "@/services/api/documentService";
import type { DocumentRequest } from "@/services/api/documentService";
import { apiClient, reportService } from "@/services/api";

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

type StatusFilter = "ready" | "pending" | "reject";

export default function Documents() {
  const [documents, setDocuments] = useState<DocumentRequest[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<DocumentRequest[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStatus, setActiveStatus] = useState<StatusFilter>("ready");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<number | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] =
    useState<DocumentRequest | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingDocument, setEditingDocument] =
    useState<DocumentRequest | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<DocumentRequest>>(
    {}
  );
  const [isUpdatingDocument, setIsUpdatingDocument] = useState(false);

  // Fetch all documents on component mount
  useEffect(() => {
    fetchDocuments();
  }, []);

  // Filter documents by status and search query
  useEffect(() => {
    // First filter by status
    const statusFiltered = documents.filter(
      (doc) => doc.status === activeStatus
    );

    // Then filter by search query
    if (searchQuery.trim() === "") {
      setFilteredDocuments(statusFiltered);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = statusFiltered.filter(
        (doc) =>
          doc.reference_number?.toLowerCase().includes(query) ||
          doc.full_name.toLowerCase().includes(query) ||
          doc.document_type.toLowerCase().includes(query) ||
          doc.email.toLowerCase().includes(query)
      );
      setFilteredDocuments(filtered);
    }
  }, [searchQuery, documents, activeStatus]);

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

  const handleStatusUpdate = async (
    documentId: number,
    newStatus: "pending" | "ready" | "reject"
  ) => {
    try {
      setUpdatingStatus(documentId);
      await documentService.updateRequest(documentId, { status: newStatus });

      // Find the document being updated
      const document = documents.find((doc) => doc.id === documentId);

      // Update local state
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === documentId ? { ...doc, status: newStatus } : doc
        )
      );

      toast.success(`Document status updated to ${newStatus}`);

      if (newStatus === "ready" && document) {
        try {
          // Update status, amount, and pickup_location as per requirement
          await apiClient.put(`/document-request-email/${documentId}/status`, {
            status: newStatus,
            amount: getDocumentPrice(document.document_type).toString(),
            pickup_location: "Barangay Simpak, Main Office",
          });

          toast.success(
            "Document marked as ready and notification email sent."
          );

          // Save Report entry after successful email update
          try {
            const reportResponse = await reportService.createReportEntry({
              document_type: document.document_type,
              requestor: document.full_name,
              purpose: document.purpose,
              reference_no: document.reference_number || "",
              price: getDocumentPrice(document.document_type).toString(),
              status: newStatus,
            });

            // Check response status
            if (
              reportResponse.status === "success" ||
              reportResponse.response_code === 201
            ) {
              toast.success("Report added successfully!");
            } else {
              toast.info(
                "Report entry saved with status: " + reportResponse.status
              );
            }
          } catch (reportError) {
            console.error("Error creating report entry:", reportError);
            toast.warning("Document updated but report entry creation failed.");
          }
        } catch (error) {
          console.error("Error updating document status and details:", error);
          toast.error(
            "Failed to update document status and send notification email."
          );
        }
      }

      // Send email for rejection
      if (newStatus === "reject" && document) {
        try {
          await apiClient.put(`/document-rejects-email/${documentId}/status`, {
            status: newStatus,
          });
          toast.success("Document marked as Rejected and notification sent.");

          if (document.reference_number) {
            try {
              const response = await reportService.deleteByReference(
                document.reference_number // ✓ Correct - passing string
              );

              if (response) {
                toast.success(
                  `${document.reference_number} remove to report successfully!`
                );
              }
            } catch (reportError) {
              console.error("Error deleting report added:", reportError);
              toast.warning(
                "Document rejected but report added deletion failed."
              );
            }
          }
        } catch (reportError) {
          console.error("Error delete report entry:", reportError);
          toast.warning("Document deleted but report delete ");
        }
      }

      //Pendig
      if (newStatus === "pending" && document) {
        try {
          if (document.reference_number) {
            try {
              const response = await reportService.deleteByReference(
                document.reference_number // ✓ Correct - passing string
              );

              if (response) {
                toast.success("Report added to pending successfully!");
              }
            } catch (reportError) {
              console.error(
                "Error deleting report added pending:",
                reportError
              );
              toast.warning("Document pending but report added pending");
            }
          }
        } catch (reportError) {
          console.error("Error delete report entry:", reportError);
          toast.warning("Document deleted but report delete failed.");
        }
      }
    } catch (error) {
      console.error("Error updating document status:", error);
      toast.error("Failed to update document status. Please try again.");
    } finally {
      setUpdatingStatus(null);
    }
  };

  // const handleDeleteClick = (documentId: number) => {
  //   setDocumentToDelete(documentId);
  //   setDeleteDialogOpen(true);
  // };

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

  const handleEditDocument = (document: DocumentRequest) => {
    setEditingDocument(document);
    setEditFormData({
      document_type: document.document_type,
      full_name: document.full_name,
      address: document.address,
      contact_number: document.contact_number,
      email: document.email,
      purpose: document.purpose,
      status: document.status,
    });
    setEditDialogOpen(true);
  };

  const handleEditFormChange = (
    field: keyof DocumentRequest,
    value: string
  ) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdateDocument = async () => {
    if (!editingDocument?.id) return;

    try {
      setIsUpdatingDocument(true);
      await documentService.updateRequest(editingDocument.id, editFormData);

      // Update local state
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === editingDocument.id ? { ...doc, ...editFormData } : doc
        )
      );

      toast.success("Document updated successfully");
      setEditDialogOpen(false);
      setEditingDocument(null);
      setEditFormData({});
    } catch (error) {
      console.error("Error updating document:", error);
      toast.error("Failed to update document. Please try again.");
    } finally {
      setIsUpdatingDocument(false);
    }
  };

  const handlePrintDocument = (document: DocumentRequest) => {
    // Create a print-friendly window
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Please allow popups to print documents");
      return;
    }

    // Determine which template to use based on document type
    const isClearance = document.document_type
      .toLowerCase()
      .includes("clearance");

    // Generate random age between 21 and 38
    const randomAge = Math.floor(Math.random() * (38 - 21 + 1)) + 21;

    // Generate random purok between 1 and 10
    const randomPurok = Math.floor(Math.random() * 10) + 1;

    // Common styles
    const commonStyles = `
      body {
        font-family: 'Times New Roman', Times, serif;
        padding: 60px 80px;
        max-width: 850px;
        margin: 0 auto;
        line-height: 1.8;
      }
      .header-container {
        display: flex;
        align-items: flex-start;
        margin-bottom: 40px;
        position: relative;
      }
      .logo {
        position: absolute;
        left: 0;
        top: 0;
        width: 80px;
        height: 80px;
        object-fit: contain;
      }
      .letterhead {
        flex: 1;
        text-align: center;
      }
      .letterhead p {
        margin: 2px 0;
        font-size: 14px;
        font-weight: bold;
      }
      .office-title {
        margin: 20px 0;
        font-size: 13px;
        letter-spacing: 2px;
      }
      .document-title {
        text-align: center;
        font-size: 20px;
        font-weight: bold;
        margin: 30px 0;
        text-decoration: underline;
      }
      .salutation {
        font-weight: bold;
        margin: 30px 0 20px 0;
      }
      .content-text {
        text-align: justify;
        text-indent: 50px;
        margin: 20px 0;
        font-size: 14px;
      }
      .signature-section {
        margin-top: 60px;
        text-align: right;
      }
      .signature-name {
        font-weight: bold;
        text-decoration: underline;
        margin-top: 40px;
      }
      .signature-title {
        font-style: italic;
      }
      .footer-info {
        margin-top: 60px;
        font-size: 12px;
      }
      @media print {
        body {
          padding: 40px;
        }
      }
    `;

    let printContent = "";

    if (isClearance) {
      // Clearance Certification Template
      printContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Clearance Certification - ${
              document.reference_number || "N/A"
            }</title>
            <style>
              ${commonStyles}
            </style>
          </head>
          <body>
            <div class="header-container">
              <img src="/image/2s.png" alt="Barangay Logo" class="logo" />
              <div class="letterhead">
                <p>REPUBLIC OF THE PHILIPPINES</p>
                <p>REGION 10</p>
                <p>PROVINCE OF LANAO DEL NORTE</p>
                <p>MUNICIPALITY OF LALA</p>
                <p>BARANGAY SIMPAK</p>
                <p class="office-title">OFFICE OF THE PUNONG BARANGAY</p>
              </div>
            </div>

            <div class="document-title">CLEARANCE CERTIFICATION</div>

            <div class="content-text">
              This is to certify that <strong>${
                document.full_name
              }</strong>, ${randomAge} years of age, Filipino,
              resident of Purok ${randomPurok}, Simpak, Lala, Lanao del Norte is a bona fide member of this Barangay.
            </div>

            <div class="content-text">
              This certifies further that, as per record, the above-named person has never been involved in any
              unlawful act nor has any pending case for violation of any laws or ordinances promulgated by
              this office. As such, he/she is a person of good moral character and a law abiding citizen.
            </div>

            <div class="content-text">
              This certification is issued upon the request of the aforementioned name for <strong>${document.purpose.toUpperCase()}</strong>
              and for any legal purpose it may serve best.
            </div>

            <div class="content-text">
              Issued this ${
                document.created_at
                  ? new Date(document.created_at).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "_____ day of _____ 2025"
              }
              at the Barangay Local Government Center of Simpak, Lala, Lanao del Norte.
            </div>

            <div class="signature-section">
              <div class="signature-name">HON. EMILYN N. CABASIS</div>
              <div class="signature-title">Punong Barangay</div>
            </div>

            <div class="footer-info">
              <p>________________________</p>
              <p>Signature over printed Name</p>
              <p style="margin-top: 20px;">Issued on: ${
                document.created_at
                  ? new Date(document.created_at).toLocaleDateString()
                  : "_______"
              }</p>
              <p>Issued at: Barangay Simpak</p>
              <p>Control No. ${document.reference_number || "_______"}</p>
              <p style="margin-top: 20px;">Brgy. Dry-Seal</p>
            </div>

            <script>
              window.onload = function() {
                window.print();
              }
            </script>
          </body>
        </html>
      `;
    } else {
      // Certification (Residency) Template
      printContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Certification - ${document.reference_number || "N/A"}</title>
            <style>
              ${commonStyles}
            </style>
          </head>
          <body>
            <div class="header-container">
              <img src="/image/2s.png" alt="Barangay Logo" class="logo" />
              <div class="letterhead">
                <p>REPUBLIC OF THE PHILIPPINES</p>
                <p>PROVINCE OF LANAO DEL NORTE</p>
                <p>MUNICIPALITY OF LALA</p>
                <p>BARANGAY SIMPAK</p>
                <p class="office-title">OFFICE OF THE PUNONG BARANGAY</p>
              </div>
            </div>

            <div class="document-title">CERTIFICATION</div>

            <div class="salutation">TO WHOM IT MAY CONCERN</div>

            <div class="content-text">
              This is to certify that <strong>${
                document.full_name
              }</strong>, ${randomAge} years of age,
              is a bonafide resident of Purok ${randomPurok}, Simpak, Lala, Lanao del Norte.
            </div>

            <div class="content-text">
              As per record, this certification is issued for the purpose of <strong>${
                document.purpose
              }</strong>.
            </div>

            <div class="content-text">
              This certification is issued upon their request for any legal purpose it may serve them best.
            </div>

            <div class="content-text">
              Given this ${
                document.created_at
                  ? new Date(document.created_at).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "_____ day of _____ 2025"
              }
              at the Barangay Local Government Center of Simpak, Lala, Lanao del Norte.
            </div>

            <div class="signature-section">
              <div class="signature-name">HON. EMILYN N. CABASIS</div>
              <div class="signature-title">Punong Barangay</div>
              <p style="margin-top: 60px;">Barangay Seal</p>
            </div>

            <script>
              window.onload = function() {
                window.print();
              }
            </script>
          </body>
        </html>
      `;
    }

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
        Email: doc.email,
        "Contact Number": doc.contact_number,
        Purpose: doc.purpose,
        Price: `₱${doc.price || 30}.00`,
        Status: doc.status || "pending",
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
        { wch: 12 }, // Price
        { wch: 10 }, // Status
        { wch: 15 }, // Request Date
      ];
      ws["!cols"] = colWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, "Document Requests");

      // Generate filename with current date
      const fileName = `Document_Requests_${
        new Date().toISOString().split("T")[0]
      }.xlsx`;

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
      {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
      </div> */}

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

      {/* Status Navigation Buttons */}
      <div className="flex gap-2">
        <Button
          variant={activeStatus === "ready" ? "default" : "outline"}
          onClick={() => setActiveStatus("ready")}
        >
          Ready ({stats.ready})
        </Button>
        <Button
          variant={activeStatus === "pending" ? "default" : "outline"}
          onClick={() => setActiveStatus("pending")}
        >
          Pending ({stats.pending})
        </Button>
        <Button
          variant={activeStatus === "reject" ? "default" : "outline"}
          onClick={() => setActiveStatus("reject")}
        >
          Rejected ({documents.filter((doc) => doc.status === "reject").length})
        </Button>
      </div>

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
                        Purpose/Tumong/Rason
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Price
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
                          <p className="text-sm font-semibold text-green-600">
                            ₱{document.price || 30}.00
                          </p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm">{document.contact_number}</p>
                        </td>
                        <td className="py-3 px-4">
                          {document.status === "pending" ? (
                            <Badge
                              variant="secondary"
                              className="bg-warning/10 text-warning"
                            >
                              Pending
                            </Badge>
                          ) : (
                            <Select
                              value={document.status || "pending"}
                              onValueChange={(
                                value: "pending" | "ready" | "reject"
                              ) => handleStatusUpdate(document.id!, value)}
                              disabled={updatingStatus === document.id}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="ready">
                                  <Badge
                                    variant="secondary"
                                    className="bg-success/10 text-success"
                                  >
                                    Ready
                                  </Badge>
                                </SelectItem>
                                <SelectItem value="reject">
                                  <Badge
                                    variant="secondary"
                                    className="bg-destructive/10 text-destructive"
                                  >
                                    Rejected
                                  </Badge>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          )}
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
                              title="Edit"
                              onClick={() => handleEditDocument(document)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Print"
                              onClick={() => handlePrintDocument(document)}
                            >
                              <Printer className="h-4 w-4" />
                            </Button>
                            {/* <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteClick(document.id!)}
                              title="Delete"
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button> */}
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
                        : selectedDocument.status === "pending"
                        ? "bg-warning/10 text-warning"
                        : selectedDocument.status === "reject"
                        ? "bg-destructive/10 text-destructive"
                        : ""
                    }
                  >
                    {selectedDocument.status === "reject"
                      ? "Rejected"
                      : selectedDocument.status === "ready"
                      ? "Ready"
                      : selectedDocument.status === "pending"
                      ? "Pending"
                      : ""}
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
                    <p className="text-base">
                      {selectedDocument.document_type}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Purpose/Tumong/Rason
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
                    <p className="text-base">
                      {selectedDocument.contact_number}
                    </p>
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
                        {new Date(
                          selectedDocument.created_at
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
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

      {/* Edit Document Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Document Request</DialogTitle>
            <DialogDescription>
              Update the document request information
            </DialogDescription>
          </DialogHeader>

          {editingDocument && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-document-type">Document Type</Label>
                  <Select
                    value={editFormData.document_type || ""}
                    onValueChange={(value) =>
                      handleEditFormChange("document_type", value)
                    }
                  >
                    <SelectTrigger id="edit-document-type">
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Barangay Clearance">
                        Clearance Certification
                      </SelectItem>
                      <SelectItem value="Certificate of Residency">
                        Certification
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={editFormData.status || "pending"}
                    onValueChange={(value) =>
                      handleEditFormChange("status", value)
                    }
                  >
                    <SelectTrigger id="edit-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="ready">Ready</SelectItem>
                      <SelectItem value="reject">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-full-name">Full Name</Label>
                <Input
                  id="edit-full-name"
                  value={editFormData.full_name || ""}
                  onChange={(e) =>
                    handleEditFormChange("full_name", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-address">Address</Label>
                <Textarea
                  id="edit-address"
                  value={editFormData.address || ""}
                  onChange={(e) =>
                    handleEditFormChange("address", e.target.value)
                  }
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editFormData.email || ""}
                    onChange={(e) =>
                      handleEditFormChange("email", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-contact">Contact Number</Label>
                  <Input
                    id="edit-contact"
                    value={editFormData.contact_number || ""}
                    onChange={(e) =>
                      handleEditFormChange("contact_number", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-purpose"> Purpose/Tumong/Rason</Label>
                <Textarea
                  id="edit-purpose"
                  value={editFormData.purpose || ""}
                  onChange={(e) =>
                    handleEditFormChange("purpose", e.target.value)
                  }
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setEditDialogOpen(false)}
                  disabled={isUpdatingDocument}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  onClick={handleUpdateDocument}
                  disabled={isUpdatingDocument}
                >
                  {isUpdatingDocument ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Document"
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
