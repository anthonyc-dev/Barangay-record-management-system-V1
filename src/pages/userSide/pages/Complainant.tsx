import { useState, useEffect } from "react";
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
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  User,
  MapPin,
  Loader2,
  Pencil,
} from "lucide-react";
import { toast } from "sonner";
import complainantService, {
  type CreateComplaintRequest,
  type Complaint,
} from "@/services/api/complainantService";
import { authService } from "@/services/api";
import GeneralLoading from "@/components/GeneralLoading";

const Complainant = () => {
  const [activeTab, setActiveTab] = useState("report");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingReports, setIsLoadingReports] = useState(false);
  const [userReports, setUserReports] = useState<Complaint[]>([]);
  const [formData, setFormData] = useState({
    reportType: "",
    title: "",
    description: "",
    location: "",
    dateTime: "",
    complainantName: "",
    contactNumber: "",
    email: "",
    isAnonymous: false,
    witnesses: "",
    additionalInfo: "",
  });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingComplaint, setEditingComplaint] = useState<Complaint | null>(
    null
  );
  const [editFormData, setEditFormData] = useState({
    reportType: "",
    title: "",
    description: "",
    location: "",
    dateTime: "",
    complainantName: "",
    contactNumber: "",
    email: "",
    isAnonymous: false,
    witnesses: "",
    additionalInfo: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);

  console.log("from complainant", userReports);

  const reportTypes = [
    "Noise Complaint",
    "Traffic Accident",
    "Theft/Robbery",
    "Public Disturbance",
    "Property Damage",
    "Environmental Issue",
    "Animal-related Issue",
    "Infrastructure Problem",
    "Violence/Assault",
    "Other",
  ];

  // Fetch user's complaints when the history tab is active
  useEffect(() => {
    if (activeTab === "history") {
      fetchUserReports();
    }
  }, [activeTab]);

  const fetchUserReports = async () => {
    setIsLoadingReports(true);
    try {
      const userInfo = authService.getStoredUserInfo();
      if (!userInfo?.id) {
        toast.error("User not authenticated. Please log in again.");
        return;
      }

      console.log("Fetching complaints for user ID:", userInfo.id);
      const complaints = await complainantService.getComplaintById(userInfo.id);

      // The API returns an array directly
      setUserReports(Array.isArray(complaints) ? complaints : []);
      console.log("Fetched complaints:", complaints);
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Error fetching reports");
      // Set empty array on error to prevent undefined issues
      setUserReports([]);

      // Handle API error format from our interceptor
      if (error && typeof error === "object" && "message" in error) {
        toast.error((error as { message: string }).message);
      } else {
        toast.error("Failed to load your reports. Please try again.");
      }
    } finally {
      setIsLoadingReports(false);
    }
  };

  const validateForm = (): string | null => {
    // Validate required fields
    if (!formData.reportType.trim()) {
      return "Please select a report type";
    }
    if (!formData.title.trim()) {
      return "Please enter a report title";
    }
    if (!formData.description.trim()) {
      return "Please provide a detailed description";
    }

    if (!formData.location.trim()) {
      return "Please enter the location";
    }
    if (!formData.dateTime) {
      return "Please select the date and time";
    }

    // Validate complainant info if not anonymous
    if (!formData.isAnonymous) {
      if (!formData.complainantName.trim()) {
        return "Please enter your full name";
      }
      if (!formData.contactNumber.trim()) {
        return "Please enter your contact number";
      }
      // Basic phone number validation (Philippine format)
      const phoneRegex = /^(09|\+639)\d{9}$/;
      if (!phoneRegex.test(formData.contactNumber.replace(/\s|-/g, ""))) {
        return "Please enter a valid Philippine mobile number (e.g., 09123456789)";
      }
      // Email validation if provided
      if (
        formData.email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
      ) {
        return "Please enter a valid email address";
      }
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const userInfo = authService.getStoredUserInfo();
      if (!userInfo?.id) {
        toast.error("User not authenticated. Please log in again.");
        return;
      }

      // Convert datetime-local format to MySQL datetime format
      const dateTimeFormatted = formData.dateTime.replace("T", " ") + ":00";

      // Prepare complaint data matching API schema
      const complaintData: CreateComplaintRequest = {
        userId: userInfo.id,
        report_type: formData.reportType,
        title: formData.title,
        description: formData.description,
        location: formData.location,
        date_time: dateTimeFormatted,
        complainant_name: formData.isAnonymous
          ? null
          : formData.complainantName,
        contact_number: formData.isAnonymous ? null : formData.contactNumber,
        email: formData.isAnonymous || !formData.email ? null : formData.email,
        is_anonymous: formData.isAnonymous,
        witnesses: formData.witnesses.trim() || null,
        additional_info: formData.additionalInfo.trim() || null,
      };

      // Submit to API
      const response = await complainantService.createComplaint(complaintData);

      // Show success message
      toast.success(
        response.message || "Your report has been submitted successfully!"
      );

      // Reset form
      setFormData({
        reportType: "",
        title: "",
        description: "",
        location: "",
        dateTime: "",
        complainantName: "",
        contactNumber: "",
        email: "",
        isAnonymous: false,
        witnesses: "",
        additionalInfo: "",
      });

      // Optionally switch to history tab to show the new report
      setTimeout(() => {
        setActiveTab("history");
      }, 1500);
    } catch (error) {
      console.error("Error submitting report:", error);

      // Handle API error format from our interceptor
      if (error && typeof error === "object") {
        const apiError = error as {
          message?: string;
          errors?: Record<string, string[]>;
        };

        // Handle validation errors from backend
        if (apiError.errors) {
          const errorMessages = Object.values(apiError.errors)
            .flat()
            .join(", ");
          toast.error(errorMessages);
        } else if (apiError.message) {
          toast.error(apiError.message);
        } else {
          toast.error("Failed to submit your report. Please try again.");
        }
      } else {
        toast.error("Failed to submit your report. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "under_investigation":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "under_investigation":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "resolved":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-red-600 bg-red-50 border-red-200";
    }
  };

  const handleEditComplaint = (complaint: Complaint) => {
    setEditingComplaint(complaint);

    // Convert MySQL datetime format (YYYY-MM-DD HH:mm:ss) to datetime-local format (YYYY-MM-DDTHH:mm)
    const dateTimeValue = complaint.date_time.replace(" ", "T").slice(0, 16);

    setEditFormData({
      reportType: complaint.report_type,
      title: complaint.title,
      description: complaint.description,
      location: complaint.location,
      dateTime: dateTimeValue,
      complainantName: complaint.complainant_name || "",
      contactNumber: complaint.contact_number || "",
      email: complaint.email || "",
      isAnonymous: complaint.is_anonymous,
      witnesses: complaint.witnesses || "",
      additionalInfo: complaint.additional_info || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingComplaint(null);
    setEditFormData({
      reportType: "",
      title: "",
      description: "",
      location: "",
      dateTime: "",
      complainantName: "",
      contactNumber: "",
      email: "",
      isAnonymous: false,
      witnesses: "",
      additionalInfo: "",
    });
  };

  const validateEditForm = (): string | null => {
    if (!editFormData.reportType.trim()) {
      return "Please select a report type";
    }
    if (!editFormData.title.trim()) {
      return "Please enter a report title";
    }
    if (!editFormData.description.trim()) {
      return "Please provide a detailed description";
    }
    if (!editFormData.location.trim()) {
      return "Please enter the location";
    }
    if (!editFormData.dateTime) {
      return "Please select the date and time";
    }

    if (!editFormData.isAnonymous) {
      if (!editFormData.complainantName.trim()) {
        return "Please enter your full name";
      }
      if (!editFormData.contactNumber.trim()) {
        return "Please enter your contact number";
      }
      const phoneRegex = /^(09|\+639)\d{9}$/;
      if (!phoneRegex.test(editFormData.contactNumber.replace(/\s|-/g, ""))) {
        return "Please enter a valid Philippine mobile number (e.g., 09123456789)";
      }
      if (
        editFormData.email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editFormData.email)
      ) {
        return "Please enter a valid email address";
      }
    }

    return null;
  };

  const handleUpdateComplaint = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingComplaint?.id) {
      toast.error("Invalid complaint.");
      return;
    }

    // Validate form
    const validationError = validateEditForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsUpdating(true);

    try {
      // Convert datetime-local format to MySQL datetime format
      const dateTimeFormatted = editFormData.dateTime.replace("T", " ") + ":00";

      // Build update data - only include fields that have changed
      const updateData: Partial<CreateComplaintRequest> = {};

      // Always include these core fields
      updateData.report_type = editFormData.reportType;
      updateData.title = editFormData.title;
      updateData.description = editFormData.description;
      updateData.location = editFormData.location;
      updateData.date_time = dateTimeFormatted;
      updateData.is_anonymous = editFormData.isAnonymous;

      // Handle nullable fields properly
      updateData.complainant_name = editFormData.isAnonymous
        ? null
        : editFormData.complainantName || null;

      updateData.contact_number = editFormData.isAnonymous
        ? null
        : editFormData.contactNumber || null;

      updateData.email =
        editFormData.isAnonymous || !editFormData.email
          ? null
          : editFormData.email;

      // Handle optional fields
      updateData.witnesses = editFormData.witnesses.trim() || null;
      updateData.additional_info = editFormData.additionalInfo.trim() || null;

      console.log("Updating complaint with ID:", editingComplaint.id);
      console.log("Update data:", updateData);

      const response = await complainantService.updateComplaint(
        editingComplaint.id,
        updateData
      );

      toast.success(response.message || "Complaint updated successfully!");

      // Close dialog and refresh the list
      handleCloseEditDialog();

      // Refresh the reports list to show updated data
      await fetchUserReports();
    } catch (error: unknown) {
      console.error("Error updating complaint:", error);

      if (error && typeof error === "object") {
        const apiError = error as {
          message?: string;
          errors?: Record<string, string[]>;
          response?: {
            data?: {
              message?: string;
              errors?: Record<string, string[]>;
            };
            status?: number;
          };
        };

        // Check if it's an axios error with response data
        if (apiError.response?.data) {
          const responseData = apiError.response.data;

          if (responseData.errors) {
            const errorMessages = Object.entries(responseData.errors)
              .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
              .join("; ");
            toast.error(`Validation errors: ${errorMessages}`);
          } else if (responseData.message) {
            toast.error(responseData.message);
          } else {
            toast.error("Failed to update complaint. Please try again.");
          }

          // Log additional debug info
          console.error("API Error Response:", {
            status: apiError.response.status,
            data: responseData,
          });
        } else if (apiError.errors) {
          const errorMessages = Object.values(apiError.errors)
            .flat()
            .join(", ");
          toast.error(errorMessages);
        } else if (apiError.message) {
          toast.error(apiError.message);
        } else {
          toast.error("Failed to update complaint. Please try again.");
        }
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
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
            Incident Report & Complaints
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Report incidents, accidents, or file complaints to the barangay
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            {activeTab === "report" ? (
              <BreadcrumbPage className="text-blue-600 font-semibold">
                New Report
              </BreadcrumbPage>
            ) : (
              <BreadcrumbLink
                onClick={() => setActiveTab("report")}
                className="cursor-pointer"
              >
                New Report
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            {activeTab === "history" ? (
              <BreadcrumbPage className="text-blue-600 font-semibold">
                File History
              </BreadcrumbPage>
            ) : (
              <BreadcrumbLink
                onClick={() => setActiveTab("history")}
                className="cursor-pointer"
              >
                Report History
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* File Report Tab */}
      {activeTab === "report" && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Report Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Report Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reportType">Type of Report *</Label>
                <Select
                  value={formData.reportType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, reportType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Report Title *</Label>
                <Input
                  id="title"
                  placeholder="Brief description of the incident"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    placeholder="Where did this happen?"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateTime">Date & Time *</Label>
                  <Input
                    id="dateTime"
                    type="datetime-local"
                    value={formData.dateTime}
                    onChange={(e) =>
                      setFormData({ ...formData, dateTime: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Detailed Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Please provide a detailed description of what happened..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="witnesses">Witnesses (if any)</Label>
                <Textarea
                  id="witnesses"
                  placeholder="List any witnesses with their contact information..."
                  value={formData.witnesses}
                  onChange={(e) =>
                    setFormData({ ...formData, witnesses: e.target.value })
                  }
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Complainant Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Complainant Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* <div className="flex items-center space-x-2 mb-4">
                <Checkbox
                  id="anonymous"
                  checked={formData.isAnonymous}
                  onCheckedChange={(checked) => {
                    const newIsAnonymous = checked === true;
                    setFormData({
                      ...formData,
                      isAnonymous: newIsAnonymous,
                      // Clear complainant fields when switching to anonymous
                      complainantName: newIsAnonymous
                        ? ""
                        : formData.complainantName,
                      contactNumber: newIsAnonymous
                        ? ""
                        : formData.contactNumber,
                      email: newIsAnonymous ? "" : formData.email,
                    });
                  }}
                />
                <Label
                  htmlFor="anonymous"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Submit anonymously
                </Label>
              </div> */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label
                    htmlFor="complainantName"
                    className={formData.isAnonymous ? "text-gray-400" : ""}
                  >
                    Full Name {!formData.isAnonymous && "*"}
                  </Label>
                  <Input
                    id="complainantName"
                    name="complainantName"
                    type="text"
                    placeholder={
                      formData.isAnonymous
                        ? "Anonymous"
                        : "Enter your full name"
                    }
                    value={formData.complainantName}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        complainantName: e.target.value,
                      });
                    }}
                    disabled={formData.isAnonymous}
                    className={formData.isAnonymous ? "bg-gray-100" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="contactNumber"
                    className={formData.isAnonymous ? "text-gray-400" : ""}
                  >
                    Contact Number {!formData.isAnonymous && "*"}
                  </Label>
                  <Input
                    id="contactNumber"
                    name="contactNumber"
                    type="text"
                    placeholder={
                      formData.isAnonymous ? "Anonymous" : "09123456789"
                    }
                    value={formData.contactNumber}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        contactNumber: e.target.value,
                      });
                    }}
                    disabled={formData.isAnonymous}
                    className={formData.isAnonymous ? "bg-gray-100" : ""}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label
                    htmlFor="email"
                    className={formData.isAnonymous ? "text-gray-400" : ""}
                  >
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={
                      formData.isAnonymous
                        ? "Anonymous"
                        : "your.email@example.com"
                    }
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                    }}
                    disabled={formData.isAnonymous}
                    className={formData.isAnonymous ? "bg-gray-100" : ""}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="additionalInfo">Additional Notes</Label>
                <Textarea
                  id="additionalInfo"
                  placeholder="Any additional information that might be helpful..."
                  value={formData.additionalInfo}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      additionalInfo: e.target.value,
                    })
                  }
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Report"
            )}
          </Button>
        </form>
      )}

      {/* Report History Tab */}
      {activeTab === "history" && (
        <div className="space-y-4">
          {isLoadingReports ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <GeneralLoading
                  loading={isLoadingReports}
                  message="Loading your reports..."
                />
              </CardContent>
            </Card>
          ) : !userReports || userReports.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 px-4">
                <FileText className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                  No reports found
                </h3>
                <p className="text-sm sm:text-base text-gray-500 text-center">
                  You haven't submitted any reports yet
                </p>
              </CardContent>
            </Card>
          ) : (
            userReports.map((report) => (
              <Card key={report.id}>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    {/* Report Details Section */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                        <h3 className="font-semibold text-sm sm:text-base text-gray-900 break-words">
                          {report.title}
                        </h3>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border whitespace-nowrap w-fit ${getStatusColor(
                            report.status
                          )}`}
                        >
                          {getStatusIcon(report.status)}
                          <span className="ml-1 capitalize">
                            {report.status.replace("_", " ")}
                          </span>
                        </span>
                      </div>
                      <div className="space-y-1.5 text-xs sm:text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span className="truncate">
                            Type: {report.report_type}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span className="truncate">
                            Location: {report.location}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span>
                            Reported: {report.created_at.split("T")[0]}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span>
                            Incident Date:{" "}
                            {report.date_time
                              .replace("T", " ")
                              .replace(".000000Z", "")
                              .replace(/:\d{2}$/, "")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions Section */}
                    <div className="flex flex-row sm:flex-col lg:flex-col items-start sm:items-end gap-2 lg:flex-shrink-0">
                      {(report.status === "pending" ||
                        report.status === "under_investigation") && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditComplaint(report)}
                          className="whitespace-nowrap"
                        >
                          <Pencil className="h-4 w-4 sm:mr-1" />
                          <span className="hidden sm:inline">Edit</span>
                        </Button>
                      )}
                      {/* <span className="text-xs text-gray-500">
                        ID: #{report.id.toString().padStart(4, "0")}
                      </span> */}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-lg sm:text-xl">
              Edit Complaint/Report
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Update your complaint or incident report. Only pending and under
              investigation reports can be edited.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleUpdateComplaint}
            className="space-y-4 sm:space-y-6"
          >
            {/* Report Details */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-700">
                Report Details
              </h3>
              <div className="space-y-2">
                <Label htmlFor="edit-reportType">Type of Report *</Label>
                <Select
                  value={editFormData.reportType}
                  onValueChange={(value) =>
                    setEditFormData({ ...editFormData, reportType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-title">Report Title *</Label>
                <Input
                  id="edit-title"
                  placeholder="Brief description of the incident"
                  value={editFormData.title}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-location">Location *</Label>
                  <Input
                    id="edit-location"
                    placeholder="Where did this happen?"
                    value={editFormData.location}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        location: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-dateTime">Date & Time *</Label>
                  <Input
                    id="edit-dateTime"
                    type="datetime-local"
                    value={editFormData.dateTime}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        dateTime: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Detailed Description *</Label>
                <Textarea
                  id="edit-description"
                  placeholder="Please provide a detailed description of what happened..."
                  value={editFormData.description}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      description: e.target.value,
                    })
                  }
                  rows={4}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-witnesses">Witnesses (if any)</Label>
                <Textarea
                  id="edit-witnesses"
                  placeholder="List any witnesses with their contact information..."
                  value={editFormData.witnesses}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      witnesses: e.target.value,
                    })
                  }
                  rows={2}
                />
              </div>
            </div>

            {/* Complainant Information */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-700">
                Complainant Information
              </h3>
              {/* <div className="flex items-center space-x-2 mb-4">
                <Checkbox
                  id="edit-anonymous"
                  checked={editFormData.isAnonymous}
                  onCheckedChange={(checked) => {
                    const newIsAnonymous = checked === true;
                    setEditFormData({
                      ...editFormData,
                      isAnonymous: newIsAnonymous,
                      // Clear complainant fields when switching to anonymous
                      complainantName: newIsAnonymous
                        ? ""
                        : editFormData.complainantName,
                      contactNumber: newIsAnonymous
                        ? ""
                        : editFormData.contactNumber,
                      email: newIsAnonymous ? "" : editFormData.email,
                    });
                  }}
                />
                <Label
                  htmlFor="edit-anonymous"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Submit anonymously
                </Label>
              </div> */}
              <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label
                    htmlFor="edit-complainantName"
                    className={editFormData.isAnonymous ? "text-gray-400" : ""}
                  >
                    Full Name {!editFormData.isAnonymous && "*"}
                  </Label>
                  <Input
                    id="edit-complainantName"
                    name="complainantName"
                    type="text"
                    placeholder={
                      editFormData.isAnonymous
                        ? "Anonymous"
                        : "Enter your full name"
                    }
                    value={editFormData.complainantName}
                    onChange={(e) => {
                      setEditFormData({
                        ...editFormData,
                        complainantName: e.target.value,
                      });
                    }}
                    disabled={editFormData.isAnonymous}
                    className={editFormData.isAnonymous ? "bg-gray-100" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="edit-contactNumber"
                    className={editFormData.isAnonymous ? "text-gray-400" : ""}
                  >
                    Contact Number {!editFormData.isAnonymous && "*"}
                  </Label>
                  <Input
                    id="edit-contactNumber"
                    name="contactNumber"
                    type="text"
                    placeholder={
                      editFormData.isAnonymous ? "Anonymous" : "09123456789"
                    }
                    value={editFormData.contactNumber}
                    onChange={(e) => {
                      setEditFormData({
                        ...editFormData,
                        contactNumber: e.target.value,
                      });
                    }}
                    disabled={editFormData.isAnonymous}
                    className={editFormData.isAnonymous ? "bg-gray-100" : ""}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label
                    htmlFor="edit-email"
                    className={editFormData.isAnonymous ? "text-gray-400" : ""}
                  >
                    Email Address
                  </Label>
                  <Input
                    id="edit-email"
                    name="email"
                    type="email"
                    placeholder={
                      editFormData.isAnonymous
                        ? "Anonymous"
                        : "your.email@example.com"
                    }
                    value={editFormData.email}
                    onChange={(e) => {
                      setEditFormData({
                        ...editFormData,
                        email: e.target.value,
                      });
                    }}
                    disabled={editFormData.isAnonymous}
                    className={editFormData.isAnonymous ? "bg-gray-100" : ""}
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-700">
                Additional Information
              </h3>
              <div className="space-y-2">
                <Label htmlFor="edit-additionalInfo">Additional Notes</Label>
                <Textarea
                  id="edit-additionalInfo"
                  placeholder="Any additional information that might be helpful..."
                  value={editFormData.additionalInfo}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      additionalInfo: e.target.value,
                    })
                  }
                  rows={3}
                />
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
                disabled={isUpdating}
                className="w-full sm:w-auto"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Report"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Complainant;
