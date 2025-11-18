import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, FileText, FileDown } from "lucide-react";
import { toast } from "sonner";
import folderService from "@/services/api/folderService";
import type { Folder } from "@/services/api/folderService";

interface SelectFilesDownloadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folder: Folder | null;
}

const SelectFilesDownloadDialog = ({
  open,
  onOpenChange,
  folder,
}: SelectFilesDownloadDialogProps) => {
  const [downloadingSingleFile, setDownloadingSingleFile] = useState<
    string | null
  >(null);

  // Helper function to parse original_files (handles both array and JSON string)
  const parseFiles = (files?: string[] | string): string[] => {
    if (!files) return [];

    if (Array.isArray(files)) {
      return files;
    } else if (typeof files === "string") {
      try {
        return JSON.parse(files);
      } catch (e) {
        console.error("Failed to parse original_files:", e);
        return [];
      }
    }
    return [];
  };

  const handleDownloadSingleFile = async (fileName: string) => {
    if (!folder?.id) {
      toast.error("Folder information not available");
      return;
    }

    console.log("Download attempt:", {
      folderId: folder.id,
      fileName: fileName,
      folderName: folder.folder_name,
      totalFiles: parseFiles(folder.original_files).length,
    });

    setDownloadingSingleFile(fileName);

    try {
      // Call backend endpoint to download single file
      const blob = await folderService.downloadSingleFile(folder.id, fileName);

      // Check if the blob is actually an error response (has JSON content)
      if (blob.type === "application/json") {
        const text = await blob.text();
        const errorData = JSON.parse(text);
        throw new Error(errorData.message || "Failed to download file");
      }

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(`Downloaded: ${fileName}`);
      // Don't close dialog - let user download more files
    } catch (error) {
      console.error("Download error:", error);

      // Handle blob error responses
      if (error && typeof error === "object" && "data" in error) {
        const errorData = error as { status: number; message: string; data: unknown };

        // If data is a Blob, try to read it as JSON
        if (errorData.data instanceof Blob) {
          try {
            const text = await errorData.data.text();
            console.log("Backend error response:", text);
            const jsonError = JSON.parse(text);

            const backendMessage = jsonError.message || jsonError.error || "File not found";
            toast.error(`${backendMessage}: ${fileName}`);

            // Log additional info for debugging
            console.error("Backend error details:", {
              status: errorData.status,
              message: backendMessage,
              fileName: fileName,
              folderId: folder?.id,
            });
            return;
          } catch (parseError) {
            console.error("Failed to parse error blob:", parseError);
            // If parsing fails, show generic error
            toast.error(`File not found or cannot be downloaded: ${fileName}`);
            return;
          }
        }

        toast.error(errorData.message || "Failed to download file");
        return;
      }

      const errorMessage =
        error instanceof Error ? error.message : "Failed to download file";
      toast.error(errorMessage);
    } finally {
      setDownloadingSingleFile(null);
    }
  };

  const handleClose = () => {
    if (!downloadingSingleFile) {
      onOpenChange(false);
    }
  };

  if (!folder) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Download Files</DialogTitle>
          <DialogDescription>
            Select one file at a time to download from "{folder.folder_name}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* File List */}
          <ScrollArea className="h-[400px] border rounded-md p-4">
            <div className="space-y-2">
              {parseFiles(folder.original_files).length > 0 ? (
                parseFiles(folder.original_files).map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between space-x-3 p-3 rounded-md hover:bg-gray-50 transition-colors border border-gray-200"
                  >
                    <div className="flex items-center flex-1 min-w-0">
                      <FileText className="h-4 w-4 text-gray-400 mr-3 flex-shrink-0" />
                      <span className="text-sm text-gray-900 truncate">
                        {file}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadSingleFile(file)}
                      disabled={downloadingSingleFile !== null}
                      className="flex-shrink-0"
                    >
                      {downloadingSingleFile === file ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Downloading...
                        </>
                      ) : (
                        <>
                          <FileDown className="mr-2 h-4 w-4" />
                          Download
                        </>
                      )}
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No files available</p>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Download Info */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800 font-medium">
              Download files one at a time. Click the "Download" button next to
              each file.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={downloadingSingleFile !== null}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SelectFilesDownloadDialog;
