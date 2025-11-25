import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Search,
  Download,
  Eye,
  Trash2,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  Plus,
  Edit,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import {
  complainantService,
  type Complaint,
  type ComplaintStatus,
} from "@/services/api/complainantService";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

// Helper function to format datetime
const formatDateTime = (dateString: string | null | undefined): string => {
  if (!dateString) return "N/A";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return dateString;
  }
};

// Status badge color mapping
const getStatusColor = (
  status: ComplaintStatus
): {
  variant: "default" | "secondary" | "destructive" | "outline";
  icon: LucideIcon;
} => {
  switch (status) {
    case "pending":
      return { variant: "secondary", icon: Clock };
    case "under_investigation":
      return { variant: "default", icon: AlertCircle };
    case "resolved":
      return { variant: "outline", icon: CheckCircle };
    case "rejected":
      return { variant: "destructive", icon: XCircle };
    default:
      return { variant: "secondary", icon: Clock };
  }
};

// // Urgency badge color mapping
// const getUrgencyColor = (urgency: string): string => {
//   switch (urgency?.toLowerCase()) {
//     case "emergency":
//       return "bg-red-500 hover:bg-red-600 text-white border-red-500";
//     case "high":
//       return "bg-orange-500 hover:bg-orange-600 text-white border-orange-500";
//     case "medium":
//       return "bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500";
//     case "low":
//       return "bg-green-500 hover:bg-green-600 text-white border-green-500";
//     default:
//       return "bg-gray-500 hover:bg-gray-600 text-white border-gray-500";
//   }
// };

// // Format urgency text to capitalize first letter
// const formatUrgencyText = (urgency: string): string => {
//   if (!urgency) return "N/A";
//   return urgency.charAt(0).toUpperCase() + urgency.slice(1).toLowerCase();
// };

type ComplaintFormData = {
  report_type: string;
  title: string;
  description: string;
  location: string;
  date_time: string;
  complainant_name: string;
  contact_number: string;
  email: string;
  witnesses: string;
  additional_info: string;
  status: ComplaintStatus;
  is_anonymous: boolean;
};

export default function ComplainantAdmin() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [complaintToDelete, setComplaintToDelete] = useState<number | null>(
    null
  );
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(
    null
  );
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [complaintToUpdate, setComplaintToUpdate] = useState<Complaint | null>(
    null
  );
  const [newStatus, setNewStatus] = useState<ComplaintStatus>("pending");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Form dialog state
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingComplaint, setEditingComplaint] = useState<Complaint | null>(
    null
  );
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formData, setFormData] = useState<ComplaintFormData>({
    report_type: "",
    title: "",
    description: "",
    location: "",
    date_time: "",
    complainant_name: "",
    contact_number: "",
    email: "",
    witnesses: "",
    additional_info: "",
    status: "pending",
    is_anonymous: false,
  });

  const fetchComplaints = useCallback(async () => {
    try {
      setLoading(true);
      const response = await complainantService.getAllComplaints();
      console.log("API Response:", response);

      // The backend returns array directly, service already extracts response.data
      // So 'response' here IS the data we need
      if (Array.isArray(response)) {
        // Backend returns array directly
        setComplaints(response);
      } else if (
        response &&
        typeof response === "object" &&
        "data" in response
      ) {
        // Backend returns { data: [...] }
        const data = (response as { data: Complaint[] }).data;
        if (Array.isArray(data)) {
          setComplaints(data);
        } else {
          console.warn("Unexpected response structure:", response);
          setComplaints([]);
        }
      } else {
        console.warn("Unexpected response structure:", response);
        setComplaints([]);
      }
    } catch (error: unknown) {
      console.error("Error fetching complaints:", error);
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? (error as { message: string }).message
          : "Failed to fetch complaints";
      toast.error(errorMessage);
      setComplaints([]); // Ensure complaints is always an array even on error
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch complaints on component mount
  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const handleDelete = async () => {
    if (!complaintToDelete) return;

    try {
      await complainantService.deleteComplaint(complaintToDelete);
      toast.success("Complaint deleted successfully");
      fetchComplaints(); // Refresh the list
      setDeleteDialogOpen(false);
      setComplaintToDelete(null);
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? (error as { message: string }).message
          : "Failed to delete complaint";
      toast.error(errorMessage);
    }
  };

  const handleUpdateStatus = async () => {
    if (!complaintToUpdate) return;

    try {
      setUpdatingStatus(true);
      await complainantService.updateComplaintStatus(
        complaintToUpdate.id,
        newStatus
      );
      toast.success("Complaint status updated successfully");
      fetchComplaints(); // Refresh the list
      setStatusDialogOpen(false);
      setComplaintToUpdate(null);
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? (error as { message: string }).message
          : "Failed to update complaint status";
      toast.error(errorMessage);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const openDeleteDialog = (id: number) => {
    setComplaintToDelete(id);
    setDeleteDialogOpen(true);
  };

  const openViewDialog = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setViewDialogOpen(true);
  };

  const openStatusDialog = (complaint: Complaint) => {
    setComplaintToUpdate(complaint);
    setNewStatus(complaint.status);
    setStatusDialogOpen(true);
  };

  // Form handlers
  const openAddDialog = () => {
    setEditingComplaint(null);
    setFormData({
      report_type: "",
      title: "",
      description: "",
      location: "",
      date_time: "",
      complainant_name: "",
      contact_number: "",
      email: "",
      witnesses: "",
      additional_info: "",
      status: "pending",
      is_anonymous: false,
    });
    setFormDialogOpen(true);
  };

  const openEditDialog = (complaint: Complaint) => {
    setEditingComplaint(complaint);

    // Format date_time for datetime-local input (YYYY-MM-DDTHH:mm)
    let formattedDateTime = "";
    if (complaint.date_time) {
      try {
        const date = new Date(complaint.date_time);
        if (!isNaN(date.getTime())) {
          // Format to YYYY-MM-DDTHH:mm (required format for datetime-local)
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          const hours = String(date.getHours()).padStart(2, "0");
          const minutes = String(date.getMinutes()).padStart(2, "0");
          formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
        }
      } catch (error) {
        console.error("Error formatting date:", error);
      }
    }

    setFormData({
      report_type: complaint.report_type || "",
      title: complaint.title || "",
      description: complaint.description || "",
      location: complaint.location || "",
      date_time: formattedDateTime,
      complainant_name: complaint.complainant_name || "",
      contact_number: complaint.contact_number || "",
      email: complaint.email || "",
      witnesses: complaint.witnesses || "",
      additional_info: complaint.additional_info || "",
      status: complaint.status || "pending",
      is_anonymous: complaint.is_anonymous ?? false,
    });
    setFormDialogOpen(true);
  };

  const handleFormSubmit = async () => {
    // Validate required fields
    if (
      !formData.report_type ||
      !formData.title ||
      !formData.description ||
      !formData.location
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate date_time is provided
    if (!formData.date_time) {
      toast.error("Please select the date and time");
      return;
    }

    // Validate complainant info if not anonymous
    if (!formData.is_anonymous) {
      if (!formData.complainant_name.trim()) {
        toast.error("Please enter complainant name");
        return;
      }
      if (!formData.contact_number.trim()) {
        toast.error("Please enter contact number");
        return;
      }
      // Basic phone number validation (Philippine format)
      const phoneRegex = /^(09|\+639)\d{9}$/;
      if (!phoneRegex.test(formData.contact_number.replace(/\s|-/g, ""))) {
        toast.error(
          "Please enter a valid Philippine mobile number (e.g., 09123456789)"
        );
        return;
      }
      // Email validation if provided
      if (
        formData.email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
      ) {
        toast.error("Please enter a valid email address");
        return;
      }
    }

    try {
      setFormSubmitting(true);

      const trimmedName = formData.complainant_name.trim();
      const trimmedContact = formData.contact_number.trim();
      const trimmedEmail = formData.email.trim();
      const trimmedWitnesses = formData.witnesses.trim();
      const trimmedAdditionalInfo = formData.additional_info.trim();

      // Convert datetime-local format to MySQL datetime format
      const dateTimeFormatted = formData.date_time.replace("T", " ") + ":00";

      // IMPORTANT: Backend automatically sets user_id = auth()->id() from the token
      // The admin's ID (1) from token doesn't exist in users table
      // FIX: Create a user with ID 1 in the users table OR modify backend to use payload user_id
      const complaintPayload = {
        report_type: formData.report_type,
        title: formData.title,
        description: formData.description,
        location: formData.location,
        date_time: dateTimeFormatted,
        complainant_name:
          formData.is_anonymous || !trimmedName ? null : trimmedName,
        contact_number:
          formData.is_anonymous || !trimmedContact ? null : trimmedContact,
        email: formData.is_anonymous || !trimmedEmail ? null : trimmedEmail,
        is_anonymous: formData.is_anonymous,
        witnesses: trimmedWitnesses || null,
        additional_info: trimmedAdditionalInfo || null,
        status: formData.status,
      };

      console.log(
        "Sending complaint payload (backend will add user_id from auth token):",
        complaintPayload
      );

      if (editingComplaint) {
        // Update existing complaint
        await complainantService.updateComplaint(
          editingComplaint.id,
          complaintPayload
        );
        toast.success("Complaint updated successfully");
      } else {
        // Create new complaint
        await complainantService.adminCreateComplaint(complaintPayload);
        toast.success("Complaint created successfully");
      }

      fetchComplaints(); // Refresh the list
      setFormDialogOpen(false);
      setEditingComplaint(null);
    } catch (error: unknown) {
      console.error("Error submitting complaint:", error);

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
          toast.error(
            editingComplaint
              ? "Failed to update complaint"
              : "Failed to create complaint"
          );
        }
      } else {
        toast.error(
          editingComplaint
            ? "Failed to update complaint. Please try again."
            : "Failed to create complaint. Please try again."
        );
      }
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleFormChange = <K extends keyof ComplaintFormData>(
    field: K,
    value: ComplaintFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Calculate statistics
  const safeComplaints = Array.isArray(complaints) ? complaints : [];
  const totalComplaints = safeComplaints.length;
  const pendingCount = safeComplaints.filter(
    (c) => c.status === "pending"
  ).length;
  const underInvestigationCount = safeComplaints.filter(
    (c) => c.status === "under_investigation"
  ).length;
  const resolvedCount = safeComplaints.filter(
    (c) => c.status === "resolved"
  ).length;

  // Filter complaints based on search
  const filteredComplaints = safeComplaints.filter((complaint) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      complaint.title?.toLowerCase().includes(searchLower) ||
      complaint.description?.toLowerCase().includes(searchLower) ||
      complaint.complainant_name?.toLowerCase().includes(searchLower) ||
      complaint.report_type?.toLowerCase().includes(searchLower) ||
      complaint.location?.toLowerCase().includes(searchLower)
    );
  });

  // Export to Excel function
  const handleExportToExcel = () => {
    try {
      import("xlsx")
        .then((XLSX) => {
          const exportData = filteredComplaints.map((complaint) => ({
            ID: complaint.id,
            "Report Type": complaint.report_type,
            Title: complaint.title,
            Description: complaint.description,
            Location: complaint.location,
            "Date & Time": formatDateTime(complaint.date_time),
            "Complainant Name": complaint.is_anonymous
              ? "Anonymous"
              : complaint.complainant_name || "N/A",
            "Contact Number": complaint.is_anonymous
              ? "N/A"
              : complaint.contact_number || "N/A",
            Email: complaint.is_anonymous ? "N/A" : complaint.email || "N/A",
            "Is Anonymous": complaint.is_anonymous ? "Yes" : "No",
            "Urgency Level": complaint.urgency_level,
            Witnesses: complaint.witnesses || "N/A",
            "Additional Info": complaint.additional_info || "N/A",
            Status: complaint.status,
            "Created At": formatDateTime(complaint.created_at),
            "Updated At": formatDateTime(complaint.updated_at),
          }));

          const worksheet = XLSX.utils.json_to_sheet(exportData);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, "Complaints");

          const fileName = `Complaints_Export_${
            new Date().toISOString().split("T")[0]
          }.xlsx`;
          XLSX.writeFile(workbook, fileName);

          toast.success(
            `Exported ${filteredComplaints.length} complaints to Excel`
          );
        })
        .catch(() => {
          toast.error("Failed to export to Excel");
        });
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      toast.error("Failed to export to Excel");
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Complaint Management</h1>
          <p className="text-muted-foreground">
            Manage and track all complaints and incident reports
          </p>
        </div>
        <Button className="shadow-primary" onClick={openAddDialog}>
          <Plus className="h-4 w-4" />
          Add Complaint
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Complaints
                </p>
                <p className="text-2xl font-bold">{totalComplaints}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-primary" />
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
                <p className="text-2xl font-bold">{pendingCount}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Under Investigation
                </p>
                <p className="text-2xl font-bold">{underInvestigationCount}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Resolved
                </p>
                <p className="text-2xl font-bold">{resolvedCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
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
                  placeholder="Search complaints by title, type, location..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={handleExportToExcel}>
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Complaints Table */}
      <Card>
        <CardHeader>
          <CardTitle>Complaints & Incident Reports</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No complaints found
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Title & Type
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Complainant
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Location
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Date & Time
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Witnesses
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
                    {filteredComplaints.map((complaint) => {
                      const { variant, icon: StatusIcon } = getStatusColor(
                        complaint.status
                      );
                      return (
                        <tr
                          key={complaint.id}
                          className="border-b border-border hover:bg-muted/50 transition-colors"
                        >
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium">{complaint.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {complaint.report_type}
                              </p>
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            {complaint.is_anonymous ? (
                              <Badge variant="secondary">Anonymous</Badge>
                            ) : (
                              <div>
                                <p className="font-medium">
                                  {complaint.complainant_name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {complaint.contact_number}
                                </p>
                              </div>
                            )}
                          </td>

                          <td className="py-3 px-4">
                            <p className="text-sm">{complaint.location}</p>
                          </td>

                          <td className="py-3 px-4">
                            <p className="text-sm">
                              {formatDateTime(complaint.date_time)}
                            </p>
                          </td>
                          <td className="py-3 px-4">
                            <p className="text-sm">{complaint.witnesses}</p>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={variant} className="gap-1">
                              <StatusIcon className="h-3 w-3" />
                              {complaint.status === "pending"
                                ? "Pending"
                                : complaint.status === "rejected"
                                ? "Rejected"
                                : complaint.status === "resolved"
                                ? "Resolved"
                                : complaint.status === "under_investigation"
                                ? "Under Investigation"
                                : ""}
                            </Badge>
                          </td>

                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openViewDialog(complaint)}
                                title="View Details"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditDialog(complaint)}
                                title="Edit Complaint"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openStatusDialog(complaint)}
                                title="Update Status"
                              >
                                <AlertCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                                onClick={() => openDeleteDialog(complaint.id)}
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredComplaints.length} of {totalComplaints}{" "}
                  complaints
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Complaint Details</DialogTitle>
            <DialogDescription>
              View detailed information about this complaint
            </DialogDescription>
          </DialogHeader>
          {selectedComplaint && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Report Type</Label>
                  <p className="font-medium">{selectedComplaint.report_type}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <Badge
                    variant={getStatusColor(selectedComplaint.status).variant}
                  >
                    {selectedComplaint.status.replace("_", " ")}
                  </Badge>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">Title</Label>
                <p className="font-medium">{selectedComplaint.title}</p>
              </div>

              <div>
                <Label className="text-muted-foreground">Description</Label>
                <p className="text-sm">{selectedComplaint.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Location</Label>
                  <p className="text-sm">{selectedComplaint.location}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Date & Time</Label>
                  <p className="text-sm">
                    {formatDateTime(selectedComplaint.date_time)}
                  </p>
                </div>
              </div>

              {/* <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Urgency Level</Label>
                  <Badge
                    className={getUrgencyColor(selectedComplaint.urgency_level)}
                  >
                    {formatUrgencyText(selectedComplaint.urgency_level)}
                  </Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground">Anonymous</Label>
                  <p className="text-sm">
                    {selectedComplaint.is_anonymous ? "Yes" : "No"}
                  </p>
                </div>
              </div> */}

              {!selectedComplaint.is_anonymous && (
                <div className="space-y-4 border-t pt-4">
                  <h4 className="font-semibold">Complainant Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Name</Label>
                      <p className="text-sm">
                        {selectedComplaint.complainant_name}
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">
                        Contact Number
                      </Label>
                      <p className="text-sm">
                        {selectedComplaint.contact_number}
                      </p>
                    </div>
                    {selectedComplaint.email && (
                      <div>
                        <Label className="text-muted-foreground">Email</Label>
                        <p className="text-sm">{selectedComplaint.email}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedComplaint.witnesses && (
                <div>
                  <Label className="text-muted-foreground">Witnesses</Label>
                  <p className="text-sm">{selectedComplaint.witnesses}</p>
                </div>
              )}

              {selectedComplaint.additional_info && (
                <div>
                  <Label className="text-muted-foreground">
                    Additional Information
                  </Label>
                  <p className="text-sm">{selectedComplaint.additional_info}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 border-t pt-4">
                <div>
                  <Label className="text-muted-foreground">Created At</Label>
                  <p className="text-sm">
                    {formatDateTime(selectedComplaint.created_at)}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Last Updated</Label>
                  <p className="text-sm">
                    {formatDateTime(selectedComplaint.updated_at)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Complaint Status</DialogTitle>
            <DialogDescription>
              Change the status of this complaint
            </DialogDescription>
          </DialogHeader>
          {complaintToUpdate && (
            <div className="space-y-4">
              <div>
                <Label className="text-muted-foreground">Complaint</Label>
                <p className="font-medium">{complaintToUpdate.title}</p>
              </div>

              <div>
                <Label className="text-muted-foreground">Current Status</Label>
                <Badge
                  variant={getStatusColor(complaintToUpdate.status).variant}
                >
                  {complaintToUpdate.status.replace("_", " ")}
                </Badge>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">New Status</Label>
                <Select
                  value={newStatus}
                  onValueChange={(value) =>
                    setNewStatus(value as ComplaintStatus)
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="under_investigation">
                      Under Investigation
                    </SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setStatusDialogOpen(false)}
                  disabled={updatingStatus}
                >
                  Cancel
                </Button>
                <Button onClick={handleUpdateStatus} disabled={updatingStatus}>
                  {updatingStatus && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Update Status
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add/Edit Form Dialog */}
      <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingComplaint ? "Edit Complaint" : "Add New Complaint"}
            </DialogTitle>
            <DialogDescription>
              {editingComplaint
                ? "Update the complaint information"
                : "Fill in the details to create a new complaint"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="report_type">
                  Report Type <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.report_type}
                  onValueChange={(value) =>
                    handleFormChange("report_type", value)
                  }
                >
                  <SelectTrigger id="report_type">
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Noise Complaint">
                      Noise Complaint
                    </SelectItem>
                    <SelectItem value="Traffic Accident">
                      Traffic Accident
                    </SelectItem>
                    <SelectItem value="Theft/Robbery">Theft/Robbery</SelectItem>
                    <SelectItem value="Public Disturbance">
                      Public Disturbance
                    </SelectItem>
                    <SelectItem value="Property Damage">
                      Property Damage
                    </SelectItem>
                    <SelectItem value="Environmental Issue">
                      Environmental Issue
                    </SelectItem>
                    <SelectItem value="Animal-related Issue">
                      Animal-related Issue
                    </SelectItem>
                    <SelectItem value="Infrastructure Problem">
                      Infrastructure Problem
                    </SelectItem>
                    <SelectItem value="Violence/Assault">
                      Violence/Assault
                    </SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">
                  Location <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleFormChange("location", e.target.value)}
                  placeholder="Incident location"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleFormChange("title", e.target.value)}
                placeholder="Brief title of the complaint"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleFormChange("description", e.target.value)
                }
                placeholder="Detailed description of the complaint"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date_time">
                  Date & Time <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="date_time"
                  type="datetime-local"
                  value={formData.date_time}
                  onChange={(e) =>
                    handleFormChange("date_time", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    handleFormChange("status", value as ComplaintStatus)
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="under_investigation">
                      Under Investigation
                    </SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* <div className="flex items-start justify-between rounded-md border p-4">
              <div>
                <Label
                  htmlFor="is_anonymous"
                  className="text-base font-semibold"
                >
                  Submit as Anonymous
                </Label>
                <p className="text-sm text-muted-foreground">
                  Hide the complainant&apos;s identity and contact details
                </p>
              </div>
              <Switch
                id="is_anonymous"
                checked={formData.is_anonymous}
                onCheckedChange={(checked) =>
                  handleFormChange("is_anonymous", checked)
                }
                aria-label="Toggle anonymous complaint"
              />
            </div> */}

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-4">Complainant Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="complainant_name">Complainant Name</Label>
                  <Input
                    id="complainant_name"
                    value={formData.complainant_name}
                    onChange={(e) =>
                      handleFormChange("complainant_name", e.target.value)
                    }
                    placeholder={
                      formData.is_anonymous
                        ? "Hidden for anonymous reports"
                        : "Name of complainant"
                    }
                    disabled={formData.is_anonymous}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_number">Contact Number</Label>
                  <Input
                    id="contact_number"
                    value={formData.contact_number}
                    onChange={(e) =>
                      handleFormChange("contact_number", e.target.value)
                    }
                    placeholder={
                      formData.is_anonymous
                        ? "Hidden for anonymous reports"
                        : "Phone number"
                    }
                    disabled={formData.is_anonymous}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleFormChange("email", e.target.value)}
                    placeholder={
                      formData.is_anonymous
                        ? "Hidden for anonymous reports"
                        : "Email address"
                    }
                    disabled={formData.is_anonymous}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="witnesses">Witnesses</Label>
              <Textarea
                id="witnesses"
                value={formData.witnesses}
                onChange={(e) => handleFormChange("witnesses", e.target.value)}
                placeholder="Names and details of witnesses"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="additional_info">Additional Information</Label>
              <Textarea
                id="additional_info"
                value={formData.additional_info}
                onChange={(e) =>
                  handleFormChange("additional_info", e.target.value)
                }
                placeholder="Any other relevant information"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setFormDialogOpen(false)}
                disabled={formSubmitting}
              >
                Cancel
              </Button>
              <Button onClick={handleFormSubmit} disabled={formSubmitting}>
                {formSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {editingComplaint ? "Update" : "Create"} Complaint
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              complaint from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
