import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  Download,
  Eye,
  Edit,
  Trash2,
  Shield,
  Loader2,
  UserCog,
  Users,
} from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { officialService, type Official } from "@/services/api/officialService";
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

export default function Officials() {
  const [officials, setOfficials] = useState<Official[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [officialToDelete, setOfficialToDelete] = useState<number | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedOfficial, setSelectedOfficial] = useState<Official | null>(
    null
  );
  const navigate = useNavigate();

  const fetchOfficials = useCallback(async () => {
    try {
      setLoading(true);
      const response = await officialService.getAll();
      setOfficials(response.data);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch officials";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch officials on component mount
  useEffect(() => {
    fetchOfficials();
  }, [fetchOfficials]);

  const handleDelete = async () => {
    if (!officialToDelete) return;

    try {
      await officialService.delete(officialToDelete);
      toast.success("Official deleted successfully");
      fetchOfficials(); // Refresh the list
      setDeleteDialogOpen(false);
      setOfficialToDelete(null);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete official";
      toast.error(errorMessage);
    }
  };

  const openDeleteDialog = (id: number) => {
    setOfficialToDelete(id);
    setDeleteDialogOpen(true);
  };

  const openViewDialog = (official: Official) => {
    setSelectedOfficial(official);
    setViewDialogOpen(true);
  };

  // Calculate statistics
  const totalOfficials = officials.length;
  const adminCount = officials.filter((o) => o.role === "admin").length;
  const officialCount = officials.filter((o) => o.role === "official").length;

  // Filter officials based on search
  const filteredOfficials = officials.filter((official) => {
    const searchLower = searchQuery.toLowerCase();
    const name = official.name?.toLowerCase() || "";
    const username = official.username?.toLowerCase() || "";
    const role = official.role?.toLowerCase() || "";

    return (
      name.includes(searchLower) ||
      username.includes(searchLower) ||
      role.includes(searchLower)
    );
  });

  // Export to Excel function
  const handleExportToExcel = () => {
    try {
      // Try to use xlsx library if available
      import("xlsx")
        .then((XLSX) => {
          // Prepare data for export
          const exportData = filteredOfficials.map((official) => ({
            ID: official.id || "",
            Name: official.name || "",
            Username: official.username || "",
            Role: official.role || "",
            "Created At": formatDate(official.created_at),
            "Updated At": formatDate(official.updated_at),
          }));

          // Create workbook and worksheet
          const worksheet = XLSX.utils.json_to_sheet(exportData);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, "Officials");

          // Set column widths
          const columnWidths = [
            { wch: 8 }, // ID
            { wch: 25 }, // Name
            { wch: 20 }, // Username
            { wch: 15 }, // Role
            { wch: 20 }, // Created At
            { wch: 20 }, // Updated At
          ];
          worksheet["!cols"] = columnWidths;

          // Generate Excel file and download
          const fileName = `Officials_Export_${
            new Date().toISOString().split("T")[0]
          }.xlsx`;
          XLSX.writeFile(workbook, fileName);

          toast.success(
            `Exported ${filteredOfficials.length} officials to Excel`
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
      "Username",
      "Role",
      "Created At",
      "Updated At",
    ];

    // Prepare CSV rows
    const csvRows = [
      headers.join(","),
      ...filteredOfficials.map((official) => {
        const row = [
          official.id || "",
          official.name || "",
          official.username || "",
          official.role || "",
          formatDate(official.created_at),
          formatDate(official.updated_at),
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
      `Officials_Export_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Exported ${filteredOfficials.length} officials to CSV`);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Official Management</h1>
          <p className="text-muted-foreground">
            Manage and track all officials and admins in your barangay
          </p>
        </div>
        <Link to="/admin/addOfficial">
          <Button className="shadow-primary">
            <Plus className="h-4 w-4" />
            Add New Official
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
                  Total Officials
                </p>
                <p className="text-2xl font-bold">{totalOfficials}</p>
              </div>
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Admins
                </p>
                <p className="text-2xl font-bold">{adminCount}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <UserCog className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Officials
                </p>
                <p className="text-2xl font-bold">{officialCount}</p>
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
                  placeholder="Search officials by name, username, or role..."
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

      {/* Officials Table */}
      <Card>
        <CardHeader>
          <CardTitle>Registered Officials</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredOfficials.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No officials found
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
                        Username
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Role
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Created At
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOfficials.map((official) => (
                      <tr
                        key={official.id}
                        className="border-b border-border hover:bg-muted/50 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <Shield className="h-4 w-4 text-primary" />
                            </div>
                            <p className="font-medium">{official.name}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">{official.username}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              official.role === "admin"
                                ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                                : official.role === "capitan"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                : official.role === "official"
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                                : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            }`}
                          >
                            {official.role === "admin"
                              ? "Admin"
                              : official.role === "official"
                              ? "Official"
                              : official.role === "capitan"
                              ? "Capitan"
                              : null}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {formatDate(official.created_at)}
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openViewDialog(official)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                navigate(`/admin/editOfficial/${official.id}`)
                              }
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => openDeleteDialog(official.id!)}
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
                  Showing {filteredOfficials.length} of {totalOfficials}{" "}
                  officials
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* View Official Modal */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Official Details</DialogTitle>
            <DialogDescription>
              Complete information of the selected official
            </DialogDescription>
          </DialogHeader>

          {selectedOfficial && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3 pb-2 border-b">
                  Basic Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {/* <div>
                    <p className="text-sm text-muted-foreground">ID</p>
                    <p className="font-medium">
                      {selectedOfficial.id || "N/A"}
                    </p>
                  </div> */}
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">
                      {selectedOfficial.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Username</p>
                    <p className="font-medium">
                      {selectedOfficial.username || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Role</p>
                    <p className="font-medium">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          selectedOfficial.role === "admin"
                            ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                            : selectedOfficial.role === "capitan"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : selectedOfficial.role === "official"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                            : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        }`}
                      >
                        {selectedOfficial.role === "admin"
                          ? "Admin"
                          : selectedOfficial.role === "official"
                          ? "Official"
                          : selectedOfficial.role === "capitan"
                          ? "Capitan"
                          : null}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Created At</p>
                    <p className="font-medium">
                      {formatDate(selectedOfficial.created_at)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Updated At</p>
                    <p className="font-medium">
                      {formatDate(selectedOfficial.updated_at)}
                    </p>
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
              official record from the database.
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
