import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Users,
  Loader2,
} from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { residentService, type Resident } from "@/services/api/residentService";
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
import { useUserProfile } from "@/contexts/UserProfileContext";
import { toast } from "sonner";

// Helper function to format date string to YYYY-MM-DD
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "N/A";

  try {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return dateString;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  } catch {
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateString;
    }
    return dateString;
  }
};

export default function Residents() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [residentToDelete, setResidentToDelete] = useState<number | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedResident, setSelectedResident] = useState<Resident | null>(
    null
  );
  const navigate = useNavigate();
  const { userProfile } = useUserProfile();

  const fetchResidents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await residentService.getAll();
      setResidents(response.data);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch residents";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch residents on component mount
  useEffect(() => {
    fetchResidents();
  }, [fetchResidents]);

  const handleDelete = async () => {
    if (!residentToDelete) return;

    try {
      await residentService.delete(residentToDelete);

      toast.success("Resident deleted successfully");
      fetchResidents(); // Refresh the list
      setDeleteDialogOpen(false);
      setResidentToDelete(null);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete resident";
      toast.error(errorMessage);
    }
  };

  const openDeleteDialog = (id: number) => {
    setResidentToDelete(id);
    setDeleteDialogOpen(true);
  };

  const openViewDialog = (resident: Resident) => {
    setSelectedResident(resident);
    setViewDialogOpen(true);
  };

  // Calculate statistics
  const totalResidents = residents.length;
  const maleCount = residents.filter((r) => r.gender === "Male").length;
  const femaleCount = residents.filter((r) => r.gender === "Female").length;

  // Filter residents based on search
  const filteredResidents = residents.filter((resident) => {
    const searchLower = searchQuery.toLowerCase();
    const fullName = `${resident.first_name || ""} ${
      resident.middle_name || ""
    } ${resident.last_name || ""}`.toLowerCase();
    const address = `${resident.house_number || ""} ${resident.street || ""} ${
      resident.zone || ""
    }`.toLowerCase();
    const contact = resident.contact_number?.toLowerCase() || "";

    return (
      fullName.includes(searchLower) ||
      address.includes(searchLower) ||
      contact.includes(searchLower) ||
      resident.email?.toLowerCase().includes(searchLower)
    );
  });

  // Export to Excel function
  const handleExportToExcel = () => {
    try {
      // Try to use xlsx library if available
      import("xlsx")
        .then((XLSX) => {
          // Prepare data for export
          const exportData = filteredResidents.map((resident) => ({
            ID: resident.id || "",
            Name: resident.name || "",
            "First Name": resident.first_name || "",
            "Middle Name": resident.middle_name || "",
            "Last Name": resident.last_name || "",
            Suffix: resident.suffix || "",
            "Full Name": `${resident.first_name || ""} ${
              resident.middle_name || ""
            } ${resident.last_name || ""} ${resident.suffix || ""}`.trim(),
            "Birth Date": formatDate(resident.birth_date),
            Gender: resident.gender || "",
            "Place of Birth": resident.place_of_birth || "",
            "Civil Status": resident.civil_status || "",
            Nationality: resident.nationality || "",
            Religion: resident.religion || "",
            Occupation: resident.occupation || "",
            Email: resident.email || "",
            "Contact Number": resident.contact_number || "",
            "House Number": resident.house_number || "",
            Street: resident.street || "",
            Zone: resident.zone || "",
            City: resident.city || "",
            Province: resident.province || "",
            "Full Address": `${resident.house_number || ""} ${
              resident.street || ""
            }, Zone ${resident.zone || ""}, ${resident.city || ""}, ${
              resident.province || ""
            }`.trim(),
            "Father's First Name": resident.father_first_name || "",
            "Father's Middle Name": resident.father_middle_name || "",
            "Father's Last Name": resident.father_last_name || "",
            "Mother's First Name": resident.mother_first_name || "",
            "Mother's Middle Name": resident.mother_middle_name || "",
            "Mother's Maiden Name": resident.mother_maiden_name || "",
            "Upload ID": resident.upload_id || "",
            "Upload Date": formatDate(resident.upload_date),
            Status: resident.status || "",
          }));

          // Create workbook and worksheet
          const worksheet = XLSX.utils.json_to_sheet(exportData);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, "Residents");

          // Set column widths
          const columnWidths = [
            { wch: 8 }, // ID
            { wch: 20 }, // Name
            { wch: 15 }, // First Name
            { wch: 15 }, // Middle Name
            { wch: 15 }, // Last Name
            { wch: 8 }, // Suffix
            { wch: 30 }, // Full Name
            { wch: 12 }, // Birth Date
            { wch: 10 }, // Gender
            { wch: 20 }, // Place of Birth
            { wch: 15 }, // Civil Status
            { wch: 15 }, // Nationality
            { wch: 15 }, // Religion
            { wch: 20 }, // Occupation
            { wch: 25 }, // Email
            { wch: 15 }, // Contact Number
            { wch: 12 }, // House Number
            { wch: 20 }, // Street
            { wch: 10 }, // Zone
            { wch: 15 }, // City
            { wch: 15 }, // Province
            { wch: 50 }, // Full Address
            { wch: 20 }, // Father's First Name
            { wch: 20 }, // Father's Middle Name
            { wch: 20 }, // Father's Last Name
            { wch: 20 }, // Mother's First Name
            { wch: 20 }, // Mother's Middle Name
            { wch: 20 }, // Mother's Maiden Name
            { wch: 15 }, // Upload ID
            { wch: 20 }, // Upload Date
            { wch: 10 }, // Status
          ];
          worksheet["!cols"] = columnWidths;

          // Generate Excel file and download
          const fileName = `Residents_Export_${
            new Date().toISOString().split("T")[0]
          }.xlsx`;
          XLSX.writeFile(workbook, fileName);

          toast.success(
            `Exported ${filteredResidents.length} residents to Excel`
          );
        })
        .catch(() => {
          // Fallback to CSV if xlsx is not available
          exportToCSV();
        });
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      // Fallback to CSV
      exportToCSV();
    }
  };

  // Fallback CSV export function
  const exportToCSV = () => {
    // Prepare CSV headers
    const headers = [
      "ID",
      "Name",
      "First Name",
      "Middle Name",
      "Last Name",
      "Suffix",
      "Full Name",
      "Birth Date",
      "Gender",
      "Place of Birth",
      "Civil Status",
      "Nationality",
      "Religion",
      "Occupation",
      "Email",
      "Contact Number",
      "House Number",
      "Street",
      "Zone",
      "City",
      "Province",
      "Full Address",
      "Father's First Name",
      "Father's Middle Name",
      "Father's Last Name",
      "Mother's First Name",
      "Mother's Middle Name",
      "Mother's Maiden Name",
      "Upload ID",
      "Upload Date",
      "Status",
    ];

    // Prepare CSV rows
    const csvRows = [
      headers.join(","),
      ...filteredResidents.map((resident) => {
        const row = [
          resident.id || "",
          resident.name || "",
          resident.first_name || "",
          resident.middle_name || "",
          resident.last_name || "",
          resident.suffix || "",
          `${resident.first_name || ""} ${resident.middle_name || ""} ${
            resident.last_name || ""
          } ${resident.suffix || ""}`.trim(),
          formatDate(resident.birth_date),
          resident.gender || "",
          resident.place_of_birth || "",
          resident.civil_status || "",
          resident.nationality || "",
          resident.religion || "",
          resident.occupation || "",
          resident.email || "",
          resident.contact_number || "",
          resident.house_number || "",
          resident.street || "",
          resident.zone || "",
          resident.city || "",
          resident.province || "",
          `${resident.house_number || ""} ${resident.street || ""}, Zone ${
            resident.zone || ""
          }, ${resident.city || ""}, ${resident.province || ""}`.trim(),
          resident.father_first_name || "",
          resident.father_middle_name || "",
          resident.father_last_name || "",
          resident.mother_first_name || "",
          resident.mother_middle_name || "",
          resident.mother_maiden_name || "",
          resident.upload_id || "",
          formatDate(resident.upload_date),
          resident.status || "",
        ];
        // Escape commas and quotes in CSV
        return row
          .map((cell) => {
            const cellStr = String(cell);
            if (
              cellStr.includes(",") ||
              cellStr.includes('"') ||
              cellStr.includes("\n")
            ) {
              return `"${cellStr.replace(/"/g, '""')}"`;
            }
            return cellStr;
          })
          .join(",");
      }),
    ];

    // Create CSV content
    const csvContent = csvRows.join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `Residents_Export_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Exported ${filteredResidents.length} residents to CSV`);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Resident Management</h1>
          <p className="text-muted-foreground">
            Manage and track all registered residents in your barangay
          </p>
        </div>
        <Link to="/admin/addResident">
          <Button className="shadow-primary">
            <Plus className="h-4 w-4" />
            Add New Resident
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Residents
                </p>
                <p className="text-2xl font-bold">{totalResidents}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Male
                </p>
                <p className="text-2xl font-bold">{maleCount}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Female
                </p>
                <p className="text-2xl font-bold">{femaleCount}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-4 w-4 text-primary" />
              </div>
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
                  placeholder="Search residents by name, address, or contact..."
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
              <Button variant="outline" onClick={handleExportToExcel}>
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Residents Table */}
      <Card>
        <CardHeader>
          <CardTitle>Registered Residents</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredResidents.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No residents found
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Name
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Gender
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Civil Status
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Occupation
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Contact
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredResidents.map((resident) => (
                      <tr
                        key={resident.id}
                        className="border-b border-border hover:bg-muted/50 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">
                              {resident.first_name} {resident.middle_name}{" "}
                              {resident.last_name} {resident.suffix}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {resident.house_number} {resident.street}, Zone{" "}
                              {resident.zone}
                            </p>
                          </div>
                        </td>

                        <td className="py-3 px-4">{resident.gender}</td>
                        <td className="py-3 px-4">{resident.civil_status}</td>
                        <td className="py-3 px-4">{resident.occupation}</td>
                        <td className="py-3 px-4">{resident.contact_number}</td>

                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openViewDialog(resident)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                navigate(`/admin/editResident/${resident.id}`)
                              }
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => openDeleteDialog(resident.id!)}
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
                  Showing {filteredResidents.length} of {totalResidents}{" "}
                  residents
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* View Resident Modal */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Resident Details</DialogTitle>
            <DialogDescription>
              Complete information of the selected resident
            </DialogDescription>
          </DialogHeader>

          {selectedResident && (
            <div className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3 pb-2 border-b">
                  Personal Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">First Name</p>
                    <p className="font-medium">
                      {selectedResident.first_name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Middle Name</p>
                    <p className="font-medium">
                      {selectedResident.middle_name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Name</p>
                    <p className="font-medium">
                      {selectedResident.last_name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Suffix</p>
                    <p className="font-medium">
                      {selectedResident.suffix || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Birth Date</p>
                    <p className="font-medium">
                      {formatDate(selectedResident.birth_date)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Gender</p>
                    <p className="font-medium">
                      {selectedResident.gender || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Place of Birth
                    </p>
                    <p className="font-medium">
                      {selectedResident.place_of_birth || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Civil Status
                    </p>
                    <p className="font-medium">
                      {selectedResident.civil_status || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Nationality</p>
                    <p className="font-medium">
                      {selectedResident.nationality || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Religion</p>
                    <p className="font-medium">
                      {selectedResident.religion || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Occupation</p>
                    <p className="font-medium">
                      {selectedResident.occupation || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3 pb-2 border-b">
                  Contact Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">
                      {selectedResident.email || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Contact Number
                    </p>
                    <p className="font-medium">
                      {selectedResident.contact_number || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3 pb-2 border-b">
                  Address Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      House Number
                    </p>
                    <p className="font-medium">
                      {selectedResident.house_number || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Street</p>
                    <p className="font-medium">
                      {selectedResident.street || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Zone</p>
                    <p className="font-medium">
                      {selectedResident.zone || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">City</p>
                    <p className="font-medium">
                      {selectedResident.city || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Province</p>
                    <p className="font-medium">
                      {selectedResident.province || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Family Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3 pb-2 border-b">
                  Family Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Father's First Name
                    </p>
                    <p className="font-medium">
                      {selectedResident.father_first_name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Father's Middle Name
                    </p>
                    <p className="font-medium">
                      {selectedResident.father_middle_name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Father's Last Name
                    </p>
                    <p className="font-medium">
                      {selectedResident.father_last_name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Mother's First Name
                    </p>
                    <p className="font-medium">
                      {selectedResident.mother_first_name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Mother's Middle Name
                    </p>
                    <p className="font-medium">
                      {selectedResident.mother_middle_name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Mother's Maiden Name
                    </p>
                    <p className="font-medium">
                      {selectedResident.mother_maiden_name || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Document Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3 pb-2 border-b">
                  Document Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Upload ID</p>
                    <p className="font-medium">
                      {userProfile?.profile_url || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Upload Date</p>
                    <p className="font-medium">
                      {formatDate(selectedResident.upload_date)}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">Valid ID</p>
                  <div className="border rounded-lg p-4 bg-muted/50">
                    {selectedResident.valid_id_url ? (
                      <img
                        src={selectedResident.valid_id_url}
                        alt="Valid ID"
                        className="max-w-full h-auto rounded-lg object-contain max-h-96 mx-auto"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                        }}
                      />
                    ) : (
                      <p className="text-center text-muted-foreground py-8">
                        No valid ID uploaded
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              resident record from the database.
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
