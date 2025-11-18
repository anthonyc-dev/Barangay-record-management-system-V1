import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  CheckCircle2,
  XCircle,
  Eye,
  Search,
  Download,
  UserCheck,
  UserX,
  Clock,
  FileText,
} from "lucide-react";

interface PendingRegistration {
  id: string;
  status: "pending" | "approved" | "reject";
  submittedAt: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
  // Account Information
  fullName: string;
  email: string;
  password: string;
  // Personal Information
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  birthDate: string;
  gender: string;
  placeOfBirth: string;
  civilStatus: string;
  // Address Information
  houseNumber: string;
  street: string;
  zone: string;
  city: string;
  province: string;
  // Contact Information
  contactNumber: string;
  // Personal Details
  nationality: string;
  religion: string;
  occupation: string;
  // Parents Information
  fatherFirstName: string;
  fatherMiddleName: string;
  fatherLastName: string;
  motherFirstName: string;
  motherMiddleName: string;
  motherMaidenName: string;
  // Valid ID
  validIdFile: {
    name: string;
    type: string;
    size: number;
    data: string;
  };
}

const PreRegisterAdmin = () => {
  const [registrations, setRegistrations] = useState<PendingRegistration[]>([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState<
    PendingRegistration[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegistration, setSelectedRegistration] =
    useState<PendingRegistration | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject">("approve");
  const [activeTab, setActiveTab] = useState("pending");

  // Load registrations from backend
  useEffect(() => {
    loadRegistrations();
  }, []);

  const loadRegistrations = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/residents", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch residents");
      }

      const result = await response.json();
      console.log("Residents from backend:", result);

      // Transform backend data to match frontend interface
      const transformedData = (result.data || []).map(
        (reg: {
          id: number;
          status?: string;
          created_at?: string;
          name?: string;
          email?: string;
          password?: string;
          first_name?: string;
          middle_name?: string;
          last_name?: string;
          suffix?: string;
          birth_date?: string;
          gender?: string;
          place_of_birth?: string;
          civil_status?: string;
          house_number?: string;
          street?: string;
          zone?: string;
          city?: string;
          province?: string;
          contact_number?: string;
          nationality?: string;
          religion?: string;
          occupation?: string;
          father_first_name?: string;
          father_middle_name?: string;
          father_last_name?: string;
          mother_first_name?: string;
          mother_middle_name?: string;
          mother_maiden_name?: string;
          valid_id_path?: string;
        }) => ({
          id: String(reg.id),
          status: (reg.status || "approved") as
            | "pending"
            | "approved"
            | "reject",
          submittedAt: reg.created_at || new Date().toISOString(),
          reviewedAt: null,
          reviewedBy: null,
          fullName:
            reg.name || `${reg.first_name || ""} ${reg.last_name || ""}`.trim(),
          email: reg.email || "",
          password: reg.password || "",
          firstName: reg.first_name || "",
          middleName: reg.middle_name || "",
          lastName: reg.last_name || "",
          suffix: reg.suffix || "",
          birthDate: reg.birth_date || "",
          gender: reg.gender || "",
          placeOfBirth: reg.place_of_birth || "",
          civilStatus: reg.civil_status || "",
          houseNumber: reg.house_number || "",
          street: reg.street || "",
          zone: reg.zone || "",
          city: reg.city || "",
          province: reg.province || "",
          contactNumber: reg.contact_number || "",
          nationality: reg.nationality || "",
          religion: reg.religion || "",
          occupation: reg.occupation || "",
          fatherFirstName: reg.father_first_name || "",
          fatherMiddleName: reg.father_middle_name || "",
          fatherLastName: reg.father_last_name || "",
          motherFirstName: reg.mother_first_name || "",
          motherMiddleName: reg.mother_middle_name || "",
          motherMaidenName: reg.mother_maiden_name || "",
          validIdFile: {
            name: reg.valid_id_path
              ? reg.valid_id_path.split("/").pop() || ""
              : "",
            type: "image/jpeg",
            size: 0,
            data: reg.valid_id_path
              ? `http://localhost:8000/storage/${reg.valid_id_path}`
              : "",
          },
        })
      );

      setRegistrations(transformedData);
      setFilteredRegistrations(transformedData);
    } catch (error) {
      console.error("Error loading pre-registrations:", error);
      toast.error("Failed to load pre-registrations");
    }
  };

  // Filter registrations based on search and active tab
  useEffect(() => {
    const filtered = registrations.filter((reg) => {
      const matchesSearch =
        reg.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.contactNumber.includes(searchTerm);

      const matchesTab = reg.status === activeTab;

      return matchesSearch && matchesTab;
    });

    setFilteredRegistrations(filtered);
  }, [searchTerm, registrations, activeTab]);

  const handleViewDetails = (registration: PendingRegistration) => {
    setSelectedRegistration(registration);
    setViewDialogOpen(true);
  };

  const handleApprove = (registration: PendingRegistration) => {
    setSelectedRegistration(registration);
    setActionType("approve");
    setConfirmDialogOpen(true);
  };

  const handleReject = (registration: PendingRegistration) => {
    setSelectedRegistration(registration);
    setActionType("reject");
    setConfirmDialogOpen(true);
  };

  const confirmAction = async () => {
    if (!selectedRegistration) return;

    try {
      // Update resident status using PUT /api/residents/{id}
      const newStatus = actionType === "approve" ? "approved" : "reject";

      const response = await fetch(
        `http://localhost:8000/api/residents/${selectedRegistration.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to update registration status"
        );
      }

      const result = await response.json();
      console.log("Update status response:", result);

      // Reload registrations to get updated data
      await loadRegistrations();

      setConfirmDialogOpen(false);
      setSelectedRegistration(null);

      toast.success(
        `Registration ${
          actionType === "approve" ? "approved" : "rejected"
        } successfully!${
          actionType === "approve" ? " User can now login." : ""
        }`
      );
    } catch (error) {
      console.error("Error updating registration status:", error);
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? String(error.message)
          : "Failed to update registration status";
      toast.error(errorMessage);
    }
  };

  const downloadValidId = (registration: PendingRegistration) => {
    if (!registration.validIdFile.data) {
      toast.error("No valid ID file found");
      return;
    }

    // Create a download link
    const link = document.createElement("a");
    link.href = registration.validIdFile.data;
    link.download = registration.validIdFile.name || "valid_id.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Valid ID downloaded successfully");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Approved
          </Badge>
        );
      case "reject":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700">
            <XCircle className="mr-1 h-3 w-3" />
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  const pendingCount = registrations.filter(
    (r) => r.status === "pending"
  ).length;
  const approvedCount = registrations.filter(
    (r) => r.status === "approved"
  ).length;
  const rejectedCount = registrations.filter(
    (r) => r.status === "reject"
  ).length;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Pre-Registration Management
        </h1>
        <p className="text-muted-foreground mt-2">
          Review and approve resident registration applications
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Reviews
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting your review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedCount}</div>
            <p className="text-xs text-muted-foreground">Verified residents</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <UserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedCount}</div>
            <p className="text-xs text-muted-foreground">
              Not barangay residents
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Registration Applications</CardTitle>
            <div className="relative w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or contact..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pending">
                Pending ({pendingCount})
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approved ({approvedCount})
              </TabsTrigger>
              <TabsTrigger value="reject">
                Rejected ({rejectedCount})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {filteredRegistrations.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">
                    No registrations found
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    {searchTerm
                      ? "Try adjusting your search terms"
                      : `No ${activeTab} registrations at this time`}
                  </p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Full Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Contact Number</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Submitted At</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRegistrations.map((registration) => (
                        <TableRow key={registration.id}>
                          <TableCell className="font-medium">
                            {registration.fullName}
                          </TableCell>
                          <TableCell>{registration.email}</TableCell>
                          <TableCell>{registration.contactNumber}</TableCell>
                          <TableCell>
                            {registration.street}, Zone {registration.zone}
                          </TableCell>
                          <TableCell>
                            {formatDate(registration.submittedAt)}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(registration.status)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewDetails(registration)}
                              >
                                <Eye className="mr-1 h-4 w-4" />
                                View
                              </Button>
                              {registration.status === "pending" && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-green-600 hover:text-green-700"
                                    onClick={() => handleApprove(registration)}
                                  >
                                    <CheckCircle2 className="mr-1 h-4 w-4" />
                                    Approve
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700"
                                    onClick={() => handleReject(registration)}
                                  >
                                    <XCircle className="mr-1 h-4 w-4" />
                                    Reject
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* View Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Registration Details</DialogTitle>
            <DialogDescription>
              Complete information submitted by the applicant
            </DialogDescription>
          </DialogHeader>

          {selectedRegistration && (
            <div className="space-y-6">
              {/* Status Information */}
              <div className="rounded-lg border p-4 bg-muted/50">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Status
                    </Label>
                    <div className="mt-1">
                      {getStatusBadge(selectedRegistration.status)}
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Submitted At
                    </Label>
                    <p className="text-sm font-medium mt-1">
                      {formatDate(selectedRegistration.submittedAt)}
                    </p>
                  </div>
                  {selectedRegistration.reviewedAt && (
                    <>
                      <div>
                        <Label className="text-xs text-muted-foreground">
                          Reviewed At
                        </Label>
                        <p className="text-sm font-medium mt-1">
                          {formatDate(selectedRegistration.reviewedAt)}
                        </p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">
                          Reviewed By
                        </Label>
                        <p className="text-sm font-medium mt-1">
                          {selectedRegistration.reviewedBy}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Personal Information */}
              <div>
                <h3 className="font-semibold mb-4">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      First Name
                    </Label>
                    <p className="text-sm font-medium mt-1">
                      {selectedRegistration.firstName}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Middle Name
                    </Label>
                    <p className="text-sm font-medium mt-1">
                      {selectedRegistration.middleName}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Last Name
                    </Label>
                    <p className="text-sm font-medium mt-1">
                      {selectedRegistration.lastName}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Suffix
                    </Label>
                    <p className="text-sm font-medium mt-1">
                      {selectedRegistration.suffix || "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Birth Date
                    </Label>
                    <p className="text-sm font-medium mt-1">
                      {selectedRegistration.birthDate}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Gender
                    </Label>
                    <p className="text-sm font-medium mt-1">
                      {selectedRegistration.gender}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Place of Birth
                    </Label>
                    <p className="text-sm font-medium mt-1">
                      {selectedRegistration.placeOfBirth}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Civil Status
                    </Label>
                    <p className="text-sm font-medium mt-1">
                      {selectedRegistration.civilStatus}
                    </p>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div>
                <h3 className="font-semibold mb-4">Address Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      House Number
                    </Label>
                    <p className="text-sm font-medium mt-1">
                      {selectedRegistration.houseNumber}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Street
                    </Label>
                    <p className="text-sm font-medium mt-1">
                      {selectedRegistration.street}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Zone
                    </Label>
                    <p className="text-sm font-medium mt-1">
                      {selectedRegistration.zone}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      City
                    </Label>
                    <p className="text-sm font-medium mt-1">
                      {selectedRegistration.city}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Province
                    </Label>
                    <p className="text-sm font-medium mt-1">
                      {selectedRegistration.province}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="font-semibold mb-4">Contact Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Email
                    </Label>
                    <p className="text-sm font-medium mt-1">
                      {selectedRegistration.email}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Contact Number
                    </Label>
                    <p className="text-sm font-medium mt-1">
                      {selectedRegistration.contactNumber}
                    </p>
                  </div>
                </div>
              </div>

              {/* Other Details */}
              <div>
                <h3 className="font-semibold mb-4">Other Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Nationality
                    </Label>
                    <p className="text-sm font-medium mt-1">
                      {selectedRegistration.nationality}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Religion
                    </Label>
                    <p className="text-sm font-medium mt-1">
                      {selectedRegistration.religion}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Occupation
                    </Label>
                    <p className="text-sm font-medium mt-1">
                      {selectedRegistration.occupation}
                    </p>
                  </div>
                </div>
              </div>

              {/* Parents Information */}
              <div>
                <h3 className="font-semibold mb-4">Parents Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Father's Name
                    </Label>
                    <p className="text-sm font-medium mt-1">
                      {selectedRegistration.fatherFirstName}{" "}
                      {selectedRegistration.fatherMiddleName}{" "}
                      {selectedRegistration.fatherLastName}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Mother's Maiden Name
                    </Label>
                    <p className="text-sm font-medium mt-1">
                      {selectedRegistration.motherFirstName}{" "}
                      {selectedRegistration.motherMiddleName}{" "}
                      {selectedRegistration.motherMaidenName}
                    </p>
                  </div>
                </div>
              </div>

              {/* Valid ID */}
              <div>
                <h3 className="font-semibold mb-4">Valid ID</h3>
                {selectedRegistration.validIdFile.data ? (
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-sm font-medium">
                            {selectedRegistration.validIdFile.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {(
                              selectedRegistration.validIdFile.size / 1024
                            ).toFixed(2)}{" "}
                            KB
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadValidId(selectedRegistration)}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </div>
                      <img
                        src={selectedRegistration.validIdFile.data}
                        alt="Valid ID"
                        className="w-full rounded-md border"
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No valid ID uploaded
                  </p>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
            {selectedRegistration?.status === "pending" && (
              <>
                <Button
                  variant="outline"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => {
                    setViewDialogOpen(false);
                    handleReject(selectedRegistration);
                  }}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    setViewDialogOpen(false);
                    handleApprove(selectedRegistration);
                  }}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Approve
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve" ? "Approve" : "Reject"} Registration
            </DialogTitle>
            <DialogDescription>
              {actionType === "approve"
                ? "This will approve the registration and allow the user to login to the system."
                : "This will reject the registration. The user will not be able to login with this account."}
            </DialogDescription>
          </DialogHeader>

          {selectedRegistration && (
            <div className="rounded-lg border p-4 bg-muted/50">
              <p className="font-medium">{selectedRegistration.fullName}</p>
              <p className="text-sm text-muted-foreground">
                {selectedRegistration.email}
              </p>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className={
                actionType === "approve"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }
              onClick={confirmAction}
            >
              {actionType === "approve" ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Confirm Approval
                </>
              ) : (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  Confirm Rejection
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PreRegisterAdmin;
