import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
  type UrgencyLevel,
} from "@/services/api/complainantService";
import { authService } from "@/services/api";

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
    urgencyLevel: "",
    witnesses: "",
    additionalInfo: "",
  });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingComplaint, setEditingComplaint] = useState<Complaint | null>(null);
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
    urgencyLevel: "",
    witnesses: "",
    additionalInfo: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);

  console.log("from complaiant", userReports);

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

  const urgencyLevels = [
    { value: "low", label: "Low Priority", color: "text-green-600" },
    { value: "medium", label: "Medium Priority", color: "text-yellow-600" },
    { value: "high", label: "High Priority", color: "text-orange-600" },
    { value: "emergency", label: "Emergency", color: "text-red-600" },
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
    if (!formData.urgencyLevel) {
      return "Please select an urgency level";
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
        urgency_level: formData.urgencyLevel as UrgencyLevel,
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
        urgencyLevel: "",
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

  const getUrgencyColor = (urgencyLevel: string) => {
    switch (urgencyLevel) {
      case "low":
        return "text-green-600 bg-green-50 border-green-200";
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "high":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "emergency":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
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
      urgencyLevel: complaint.urgency_level,
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
      urgencyLevel: "",
      witnesses: "",
      additionalInfo: "",
    });
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

      const updateData: Partial<CreateComplaintRequest> = {
        report_type: editFormData.reportType,
        title: editFormData.title,
        description: editFormData.description,
        location: editFormData.location,
        date_time: dateTimeFormatted,
        complainant_name: editFormData.isAnonymous
          ? null
          : editFormData.complainantName,
        contact_number: editFormData.isAnonymous
          ? null
          : editFormData.contactNumber,
        email:
          editFormData.isAnonymous || !editFormData.email
            ? null
            : editFormData.email,
        is_anonymous: editFormData.isAnonymous,
        urgency_level: editFormData.urgencyLevel as UrgencyLevel,
        witnesses: editFormData.witnesses.trim() || null,
        additional_info: editFormData.additionalInfo.trim() || null,
      };

      const response = await complainantService.updateComplaint(
        editingComplaint.id,
        updateData
      );

      toast.success(
        response.message || "Complaint updated successfully!"
      );

      handleCloseEditDialog();
      fetchUserReports();
    } catch (error: unknown) {
      console.error("Error updating complaint:", error);

      if (error && typeof error === "object") {
        const apiError = error as {
          message?: string;
          errors?: Record<string, string[]>;
        };

        if (apiError.errors) {
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
        toast.error("Failed to update complaint. Please try again.");
      }
    } finally {
      setIsUpdating(false);
    }
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
    if (!editFormData.urgencyLevel) {
      return "Please select an urgency level";
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center space-x-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Incident Report & Complaints
          </h1>
          <p className="text-gray-600">
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
              <div className="grid gap-4 md:grid-cols-2">
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
                  <Label htmlFor="urgencyLevel">Urgency Level *</Label>
                  <Select
                    value={formData.urgencyLevel}
                    onValueChange={(value) =>
                      setFormData({ ...formData, urgencyLevel: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select urgency level" />
                    </SelectTrigger>
                    <SelectContent>
                      {urgencyLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          <span className={level.color}>{level.label}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
              <div className="flex items-center space-x-2 mb-4">
                <Checkbox
                  id="anonymous"
                  checked={formData.isAnonymous}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      isAnonymous: checked === true,
                      // Clear complainant fields when switching to anonymous
                      complainantName: checked === true ? "" : formData.complainantName,
                      contactNumber: checked === true ? "" : formData.contactNumber,
                      email: checked === true ? "" : formData.email,
                    })
                  }
                />
                <Label
                  htmlFor="anonymous"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Submit anonymously
                </Label>
              </div>
              {!formData.isAnonymous && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="complainantName">Full Name *</Label>
                    <Input
                      id="complainantName"
                      placeholder="Enter your full name"
                      value={formData.complainantName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          complainantName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactNumber">Contact Number *</Label>
                    <Input
                      id="contactNumber"
                      placeholder="09123456789"
                      value={formData.contactNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contactNumber: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                </div>
              )}
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
                <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                <p className="text-gray-500">Loading your reports...</p>
              </CardContent>
            </Card>
          ) : !userReports || userReports.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No reports found
                </h3>
                <p className="text-gray-500 text-center">
                  You haven't submitted any reports yet
                </p>
              </CardContent>
            </Card>
          ) : (
            userReports.map((report) => (
              <Card key={report.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {report.title}
                        </h3>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            report.status
                          )}`}
                        >
                          {getStatusIcon(report.status)}
                          <span className="ml-1 capitalize">
                            {report.status.replace("_", " ")}
                          </span>
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4" />
                          <span>Type: {report.report_type}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4" />
                          <span>Location: {report.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Reported:{" "}
                            {new Date(report.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>
                            Incident Date:{" "}
                            {new Date(report.date_time).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(
                          report.urgency_level
                        )}`}
                      >
                        {report.urgency_level === "emergency"
                          ? "Emergency"
                          : `${
                              report.urgency_level.charAt(0).toUpperCase() +
                              report.urgency_level.slice(1)
                            } Priority`}
                      </span>
                      {(report.status === "pending" ||
                        report.status === "under_investigation") && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditComplaint(report)}
                        >
                          <Pencil className="h-4 w-4 mr-1" />
                          Edit
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Complaint/Report</DialogTitle>
            <DialogDescription>
              Update your complaint or incident report. Only pending and under
              investigation reports can be edited.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdateComplaint} className="space-y-6">
            {/* Report Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700">
                Report Details
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
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
                  <Label htmlFor="edit-urgencyLevel">Urgency Level *</Label>
                  <Select
                    value={editFormData.urgencyLevel}
                    onValueChange={(value) =>
                      setEditFormData({ ...editFormData, urgencyLevel: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select urgency level" />
                    </SelectTrigger>
                    <SelectContent>
                      {urgencyLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          <span className={level.color}>{level.label}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700">
                Complainant Information
              </h3>
              <div className="flex items-center space-x-2 mb-4">
                <Checkbox
                  id="edit-anonymous"
                  checked={editFormData.isAnonymous}
                  onCheckedChange={(checked) =>
                    setEditFormData({
                      ...editFormData,
                      isAnonymous: checked === true,
                      // Clear complainant fields when switching to anonymous
                      complainantName: checked === true ? "" : editFormData.complainantName,
                      contactNumber: checked === true ? "" : editFormData.contactNumber,
                      email: checked === true ? "" : editFormData.email,
                    })
                  }
                />
                <Label
                  htmlFor="edit-anonymous"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Submit anonymously
                </Label>
              </div>
              {!editFormData.isAnonymous && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="edit-complainantName">Full Name *</Label>
                    <Input
                      id="edit-complainantName"
                      placeholder="Enter your full name"
                      value={editFormData.complainantName}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          complainantName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-contactNumber">Contact Number *</Label>
                    <Input
                      id="edit-contactNumber"
                      placeholder="09123456789"
                      value={editFormData.contactNumber}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          contactNumber: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="edit-email">Email Address</Label>
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
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700">
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
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseEditDialog}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating}>
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
