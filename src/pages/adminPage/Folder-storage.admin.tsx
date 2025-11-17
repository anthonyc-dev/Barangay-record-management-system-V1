import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Folder,
  Download,
  Trash2,
  Search,
  Calendar,
  FolderPlus,
  Loader2,
  SquarePen,
} from "lucide-react";
import { FaFolder } from "react-icons/fa";
import { toast } from "sonner";
import folderService, {
  type Folder as FolderType,
} from "@/services/api/folderService";
import UploadFolderDialog from "@/components/adminComponents/UploadFolderDialog";
import EditFolderDialog from "@/components/adminComponents/EditFolderDialog";
import SelectFilesDownloadDialog from "@/components/adminComponents/SelectFilesDownloadDialog";

const FolderStorage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<FolderType | null>(null);
  const [folderToDownload, setFolderToDownload] = useState<FolderType | null>(
    null
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<FolderType | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      setLoading(true);
      const data = await folderService.getAll();
      setFolders(data);
    } catch (error) {
      console.error("Fetch error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load folders";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = () => {
    fetchFolders();
  };

  const handleEditSuccess = () => {
    fetchFolders();
  };

  const handleViewFolder = (folder: FolderType) => {
    setSelectedFolder(folder);
    setEditDialogOpen(true);
  };

  const handleDownloadFolder = (folder: FolderType) => {
    setFolderToDownload(folder);
    setDownloadDialogOpen(true);
  };

  const handleDeleteClick = (folder: FolderType) => {
    setFolderToDelete(folder);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!folderToDelete?.id) return;

    try {
      setDeleting(true);
      const response = await folderService.delete(folderToDelete.id);
      toast.success(response.message || "Folder deleted successfully");
      fetchFolders();
      setDeleteDialogOpen(false);
      setFolderToDelete(null);
    } catch (error) {
      console.error("Delete error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete folder";
      toast.error(errorMessage);
    } finally {
      setDeleting(false);
    }
  };

  const filteredFolders = folders.filter((item) =>
    item.folder_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (date?: string) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  const parseFiles = (files?: string[] | string): string[] => {
    if (!files) return [];

    if (Array.isArray(files)) {
      return files;
    } else if (typeof files === 'string') {
      try {
        return JSON.parse(files);
      } catch (e) {
        console.error('Failed to parse files:', e);
        return [];
      }
    }
    return [];
  };

  const calculateFolderSize = (files?: string[] | string) => {
    const fileArray = parseFiles(files);
    if (fileArray.length === 0) return "0 files";
    return `${fileArray.length} file${fileArray.length > 1 ? 's' : ''}`;
  };

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Folder Storage</h1>
          <p className="text-gray-600">
            Manage and organize barangay documents and files
          </p>
        </div>
        <div className="flex space-x-3">
          <Button
            onClick={() => setUploadDialogOpen(true)}
            className="flex items-center space-x-2"
          >
            <FolderPlus className="h-4 w-4" />
            <span>Upload Folder</span>
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search folders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Files and Folders Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Folder className="h-5 w-5" />
            <span>Folders</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Name</TableHead>
                    <TableHead>Files</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Modified</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFolders.map((item) => (
                    <TableRow key={item.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-3">
                          <FaFolder className="h-7 w-7 text-blue-600" />
                          <div>
                            <div className="font-medium text-gray-900">
                              {item.folder_name}
                            </div>
                            {parseFiles(item.original_files).length > 0 && (
                              <div className="text-sm text-gray-500">
                                {parseFiles(item.original_files).length} file(s)
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-gray-600">
                          {calculateFolderSize(item.original_files)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-gray-600 text-sm line-clamp-1">
                          {item.description || "No description"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">
                            {formatDate(item.updated_at || item.created_at)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewFolder(item)}
                            title="View Details"
                          >
                            <SquarePen className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadFolder(item)}
                            disabled={!item.zip_name}
                            title="Select Files to Download"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteClick(item)}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredFolders.length === 0 && (
                <div className="text-center py-12">
                  <Folder className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No folders found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchQuery
                      ? "Try adjusting your search query"
                      : "Get started by uploading a folder"}
                  </p>
                  {!searchQuery && (
                    <Button
                      onClick={() => setUploadDialogOpen(true)}
                      className="mt-4"
                      variant="outline"
                    >
                      <FolderPlus className="mr-2 h-4 w-4" />
                      Upload Folder
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <UploadFolderDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onSuccess={handleUploadSuccess}
      />

      {/* Edit/View Dialog */}
      <EditFolderDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        folder={selectedFolder}
        onSuccess={handleEditSuccess}
      />

      {/* Download Files Selection Dialog */}
      <SelectFilesDownloadDialog
        open={downloadDialogOpen}
        onOpenChange={setDownloadDialogOpen}
        folder={folderToDownload}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the folder "
              {folderToDelete?.folder_name}" and all its contents. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FolderStorage;
