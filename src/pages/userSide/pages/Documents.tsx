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
import { Plus, Clock, CheckCircle, XCircle, User, Loader2 } from "lucide-react";
import {
  documentService,
  type DocumentRequest,
} from "@/services/api/documentService";
import { authService } from "@/services/api/authService";
import { toast } from "sonner";

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

  console.log("...", requests, referenceCounter);

  const documentTypes = [
    "Barangay Clearance",
    "Certificate of Residency",
    "Certificate of Indigency",
    "Business Permit",
    "Community Tax Certificate",
    "Certificate of Good Moral Character",
    "Certificate of Non-Issuance of Building Permit",
  ];

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
        userid: userInfo.id,
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center space-x-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Document Requests
          </h1>
          <p className="text-gray-600">
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
              <CardTitle>Request History</CardTitle>
            </CardHeader>
            <CardContent>
              {isFetchingRequests ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : requests.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No document requests found.</p>
                  <p className="text-sm mt-2">
                    Submit a new request to get started.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {requests.map((request, index) => (
                    <div
                      key={request.id || index}
                      className="flex items-center justify-between p-4 border border-border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(request.status || "pending")}
                          <div>
                            <h4 className="font-medium">
                              {request.document_type}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {request.purpose}
                            </p>
                            {request.reference_number && (
                              <p className="text-xs text-muted-foreground">
                                Ref: {request.reference_number}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground">
                              Requestor: {request.full_name}
                            </p>
                            <p className="text-xs text-muted-foreground">
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
                      <div className="flex items-center space-x-3">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                            request.status || "pending"
                          )}`}
                        >
                          {(request.status || "pending")
                            .charAt(0)
                            .toUpperCase() +
                            (request.status || "pending").slice(1)}
                        </span>
                        {request.status === "ready" && (
                          <Button size="sm" variant="outline">
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
              <CardTitle>Important Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                  <p>Processing time: 3-5 business days for most documents</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                  <p>Bring valid ID when claiming documents</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                  <p>Office hours: Monday-Friday, 8:00 AM - 5:00 PM</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                  <p>For urgent requests, visit the barangay office directly</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                  <p>All fields marked with (*) are required</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Documents;
