import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Loader2,
  Pencil,
} from "lucide-react";
import {
  documentService,
  type DocumentRequest,
} from "@/services/api/documentService";
import { authService } from "@/services/api/authService";
import { toast } from "sonner";
import GeneralLoading from "@/components/GeneralLoading";

const Documents = () => {
  const [activeTab, setActiveTab] = useState("request");
  const [formData, setFormData] = useState({
    documentType: "",
    purpose: "",
    fullName: "",
    address: "",
    contactNumber: "",
    email: "",
  });
  const [requests, setRequests] = useState<DocumentRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingRequests, setIsFetchingRequests] = useState(false);
  const [referenceCounter, setReferenceCounter] = useState(101);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<DocumentRequest | null>(
    null
  );
  const [editFormData, setEditFormData] = useState({
    documentType: "",
    purpose: "",
    fullName: "",
    address: "",
    contactNumber: "",
    email: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);

  console.log("...", requests, referenceCounter);

  const documentTypes = ["Clearance Certification", "Certification"];

  // Auto-fill user information on mount
  useEffect(() => {
    const userInfo = authService.getStoredUserInfo();
    if (userInfo) {
      setFormData((prev) => ({
        ...prev,
        fullName: "",
        email: "",
      }));
    }
  }, []);

  const fetchDocumentRequests = useCallback(async () => {
    setIsFetchingRequests(true);
    try {
      const userInfo = authService.getStoredUserInfo();
      if (!userInfo?.id) {
        toast.error("User not authenticated. Please log in again.");
        return;
      }

      console.log("from documents", userInfo.id);

      const response = await documentService.getRequestById(userInfo.id);
      if (response.data) {
        const dataArray = Array.isArray(response.data)
          ? response.data
          : [response.data];
        setRequests(dataArray);
      }

      console.log(response.data);
    } catch (error: unknown) {
      toast.error(
        error && typeof error === "object" && "message" in error
          ? (error.message as string)
          : "Failed to fetch document requests. Please try again."
      );
    } finally {
      setIsFetchingRequests(false);
    }
  }, []);

  // Fetch document requests on mount and when switching to history tab
  useEffect(() => {
    if (activeTab === "history") {
      fetchDocumentRequests();
    }
  }, [activeTab, fetchDocumentRequests]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userInfo = authService.getStoredUserInfo();
      if (!userInfo?.id) {
        toast.error("User not authenticated. Please log in again.");
        return;
      }

      const generateReferenceNumber = () => {
        const datePart = new Date()
          .toISOString()
          .slice(0, 10)
          .replace(/-/g, "");
        const randomPart = Math.random()
          .toString(36)
          .substring(2, 8)
          .toUpperCase();
        return `DOC-${datePart}-${randomPart}`;
      };

      const requestData = {
        user_id: userInfo.id,
        document_type: formData.documentType,
        full_name: formData.fullName,
        address: formData.address,
        contact_number: formData.contactNumber,
        email: formData.email,
        purpose: formData.purpose,
        reference_number: generateReferenceNumber(),
        status: "pending" as const,
      };

      // After successful submission, increment and save
      setReferenceCounter((prev) => {
        const newCounter = prev + 1;
        localStorage.setItem("referenceCounter", newCounter.toString());
        return newCounter;
      });

      const response = await documentService.createRequest(requestData);

      toast.success(
        response.message || "Document request submitted successfully!"
      );

      // Reset form
      setFormData({
        documentType: "",
        purpose: "",
        fullName: "",
        address: "",
        contactNumber: "",
        email: "",
      });

      // Refresh requests list
      fetchDocumentRequests();
    } catch (error: unknown) {
      console.error("Error submitting document request:", error);
      toast.error(
        error && typeof error === "object" && "message" in error
          ? (error.message as string)
          : "Failed to submit document request. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "processing":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "ready":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "claimed":
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "processing":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "ready":
        return "text-green-600 bg-green-50 border-green-200";
      case "claimed":
        return "text-gray-600 bg-gray-50 border-gray-200";
      default:
        return "text-red-600 bg-red-50 border-red-200";
    }
  };

  const handleEditRequest = (request: DocumentRequest) => {
    setEditingRequest(request);
    setEditFormData({
      documentType: request.document_type,
      purpose: request.purpose,
      fullName: request.full_name,
      address: request.address,
      contactNumber: request.contact_number,
      email: request.email,
    });
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingRequest(null);
    setEditFormData({
      documentType: "",
      purpose: "",
      fullName: "",
      address: "",
      contactNumber: "",
      email: "",
    });
  };

  const handleUpdateRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingRequest?.id) {
      toast.error("Invalid document request.");
      return;
    }

    setIsUpdating(true);

    try {
      const updateData = {
        document_type: editFormData.documentType,
        full_name: editFormData.fullName,
        address: editFormData.address,
        contact_number: editFormData.contactNumber,
        email: editFormData.email,
        purpose: editFormData.purpose,
      };

      const response = await documentService.updateRequest(
        editingRequest.id,
        updateData
      );

      toast.success(
        response.message || "Document request updated successfully!"
      );

      handleCloseEditDialog();
      fetchDocumentRequests();
    } catch (error: unknown) {
      console.error("Error updating document request:", error);
      toast.error(
        error && typeof error === "object" && "message" in error
          ? (error.message as string)
          : "Failed to update document request. Please try again."
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="flex items-center space-x-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Document Requests
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Request barangay documents and track your applications
          </p>
        </div>
      </div>

      {/* Navigation Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            {activeTab === "request" ? (
              <BreadcrumbPage className="text-blue-600 font-semibold">
                New Request
              </BreadcrumbPage>
            ) : (
              <BreadcrumbLink
                onClick={() => setActiveTab("request")}
                className="cursor-pointer"
              >
                New Request
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            {activeTab === "history" ? (
              <BreadcrumbPage className="text-blue-600 font-semibold">
                Request History
              </BreadcrumbPage>
            ) : (
              <BreadcrumbLink
                onClick={() => setActiveTab("history")}
                className="cursor-pointer"
              >
                Request History
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* New Request Tab */}
      {activeTab === "request" && (
        <div className="space-y-6">
          {/* Personal Information Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Personal Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactNumber">Contact Number *</Label>
                  <Input
                    id="contactNumber"
                    placeholder="09XXXXXXXXX"
                    value={formData.contactNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contactNumber: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Complete Address *</Label>
                  <Input
                    id="address"
                    placeholder="House No., Street, Purok/Sitio, Barangay"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Document Request Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Document Request Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="documentType">Document Type *</Label>
                  <Select
                    value={formData.documentType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, documentType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      {documentTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purpose">Purpose *</Label>
                  <Textarea
                    id="purpose"
                    placeholder="e.g., Employment, School Requirements, Government Transaction"
                    value={formData.purpose}
                    onChange={(e) =>
                      setFormData({ ...formData, purpose: e.target.value })
                    }
                    rows={3}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={
                    isLoading ||
                    !formData.documentType ||
                    !formData.purpose ||
                    !formData.fullName ||
                    !formData.email ||
                    !formData.address ||
                    !formData.contactNumber
                  }
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Request"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Request History Tab */}
      {activeTab === "history" && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">
                Request History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isFetchingRequests ? (
                <div className="flex justify-center items-center py-8">
                  <GeneralLoading
                    loading={isFetchingRequests}
                    message="Loading your request"
                  />
                </div>
              ) : requests.length === 0 ? (
                <div className="text-center py-8 px-4 text-muted-foreground">
                  <p className="text-sm sm:text-base">
                    No document requests found.
                  </p>
                  <p className="text-xs sm:text-sm mt-2">
                    Submit a new request to get started.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {requests.map((request, index) => (
                    <div
                      key={request.id || index}
                      className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-4 sm:p-6 border border-border rounded-lg"
                    >
                      {/* Request Details Section */}
                      <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
                        <div className="flex-shrink-0 mt-1 sm:mt-0">
                          {getStatusIcon(request.status || "pending")}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm sm:text-base break-words">
                            {request.document_type}
                          </h4>
                          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mt-1">
                            {request.purpose}
                          </p>
                          <div className="mt-2 space-y-0.5">
                            {request.reference_number && (
                              <p className="text-xs text-muted-foreground truncate">
                                Ref: {request.reference_number}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground truncate">
                              Requestor: {request.full_name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              Contact: {request.contact_number}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Requested:{" "}
                              {request.created_at
                                ? new Date(
                                    request.created_at
                                  ).toLocaleDateString()
                                : "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Actions Section */}
                      <div className="flex flex-row sm:flex-row items-center gap-2 sm:gap-3 lg:flex-shrink-0">
                        <span
                          className={`px-2 sm:px-3 py-1 text-xs font-medium rounded-full border whitespace-nowrap ${getStatusColor(
                            request.status || "pending"
                          )}`}
                        >
                          {(request.status || "pending")
                            .charAt(0)
                            .toUpperCase() +
                            (request.status || "pending").slice(1)}
                        </span>
                        {request.status === "pending" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditRequest(request)}
                            className="whitespace-nowrap"
                          >
                            <Pencil className="h-4 w-4 sm:mr-1" />
                            <span className="hidden sm:inline">Edit</span>
                          </Button>
                        )}
                        {request.status === "ready" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="whitespace-nowrap"
                          >
                            Claim
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">
                Important Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                <div className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-1.5 sm:mt-2 flex-shrink-0"></div>
                  <p className="flex-1">
                    Processing time: 3-5 business days for most documents
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-1.5 sm:mt-2 flex-shrink-0"></div>
                  <p className="flex-1">
                    Bring valid ID when claiming documents
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-1.5 sm:mt-2 flex-shrink-0"></div>
                  <p className="flex-1">
                    Office hours: Monday-Friday, 8:00 AM - 5:00 PM
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-1.5 sm:mt-2 flex-shrink-0"></div>
                  <p className="flex-1">
                    For urgent requests, visit the barangay office directly
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-1.5 sm:mt-2 flex-shrink-0"></div>
                  <p className="flex-1">
                    All fields marked with (*) are required
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-lg sm:text-xl">
              Edit Document Request
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Update your document request information. Only pending and
              processing requests can be edited.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleUpdateRequest}
            className="space-y-4 sm:space-y-6"
          >
            {/* Personal Information Section */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-700">
                Personal Information
              </h3>
              <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-fullName">Full Name *</Label>
                  <Input
                    id="edit-fullName"
                    placeholder="Enter your full name"
                    value={editFormData.fullName}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        fullName: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email Address *</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={editFormData.email}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        email: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-contactNumber">Contact Number *</Label>
                  <Input
                    id="edit-contactNumber"
                    placeholder="09XXXXXXXXX"
                    value={editFormData.contactNumber}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        contactNumber: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="edit-address">Complete Address *</Label>
                  <Input
                    id="edit-address"
                    placeholder="House No., Street, Purok/Sitio, Barangay"
                    value={editFormData.address}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        address: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>
            </div>

            {/* Document Details Section */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-700">
                Document Details
              </h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-documentType">Document Type *</Label>
                  <Select
                    value={editFormData.documentType}
                    onValueChange={(value) =>
                      setEditFormData({
                        ...editFormData,
                        documentType: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      {documentTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-purpose">Purpose *</Label>
                  <Textarea
                    id="edit-purpose"
                    placeholder="e.g., Employment, School Requirements, Government Transaction"
                    value={editFormData.purpose}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        purpose: e.target.value,
                      })
                    }
                    rows={3}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseEditDialog}
                disabled={isUpdating}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  isUpdating ||
                  !editFormData.documentType ||
                  !editFormData.purpose ||
                  !editFormData.fullName ||
                  !editFormData.email ||
                  !editFormData.address ||
                  !editFormData.contactNumber
                }
                className="w-full sm:w-auto"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Request"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Documents;
