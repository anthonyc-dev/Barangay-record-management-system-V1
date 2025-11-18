import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import folderService from "@/services/api/folderService";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "application/zip",
  "application/x-zip-compressed",
];

const formSchema = z.object({
  folder_name: z.string().min(1, "Folder name is required"),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface UploadFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const UploadFolderDialog = ({
  open,
  onOpenChange,
  onSuccess,
}: UploadFolderDialogProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      folder_name: "",
      description: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const validFiles: File[] = [];
      const invalidFiles: string[] = [];

      filesArray.forEach((file) => {
        if (file.size > MAX_FILE_SIZE) {
          invalidFiles.push(`${file.name} (exceeds 50MB)`);
        } else if (
          !ACCEPTED_FILE_TYPES.includes(file.type) &&
          !file.type.startsWith("text/")
        ) {
          invalidFiles.push(`${file.name} (unsupported file type)`);
        } else {
          validFiles.push(file);
        }
      });

      if (invalidFiles.length > 0) {
        toast.error(`Invalid files: ${invalidFiles.join(", ")}`);
      }

      setSelectedFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const onSubmit = async (data: FormValues) => {
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one file to upload");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("folder_name", data.folder_name);
      if (data.description) {
        formData.append("description", data.description);
      }

      // Append all files - backend expects "folder[]"
      selectedFiles.forEach((file, index) => {
        formData.append("folder[]", file);
        console.log(
          `File ${index}:`,
          file.name,
          file.type,
          `${formatFileSize(file.size)}`
        );
      });

      console.log(
        "Uploading folder:",
        data.folder_name,
        "with",
        selectedFiles.length,
        "files"
      );

      const response = await folderService.create(formData);

      toast.success(response.message || "Folder uploaded successfully");
      form.reset();
      setSelectedFiles([]);
      onSuccess();
      onOpenChange(false);
    } catch (error: unknown) {
      console.error("Upload error:", error);

      // Enhanced error handling
      let errorMessage = "Failed to upload folder";

      if (error && typeof error === "object") {
        const err = error as {
          data?: {
            message?: string;
            error?: string;
            errors?: Record<string, string[]>;
          };
          message?: string;
          status?: number;
        };

        // Log full error for debugging
        console.error("Full error object:", JSON.stringify(err, null, 2));

        // Extract message from various error formats
        if (err.data?.message) {
          errorMessage = err.data.message;
        } else if (err.data?.error) {
          errorMessage = err.data.error;
        } else if (err.message) {
          errorMessage = err.message;
        }

        // Show validation errors if available
        if (err.data?.errors) {
          console.error("Validation errors:", err.data.errors);
          const validationMessages = Object.entries(err.data.errors)
            .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
            .join("; ");
          if (validationMessages) {
            errorMessage = validationMessages;
          }
        }

        // Add status code to message if available
        if (err.status) {
          errorMessage = `[${err.status}] ${errorMessage}`;
        }
      }

      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    if (!uploading) {
      form.reset();
      setSelectedFiles([]);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Folder</DialogTitle>
          <DialogDescription>
            Upload multiple files to create a new folder. All files will be
            zipped together.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="folder_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Folder Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter folder name"
                      {...field}
                      disabled={uploading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter folder description"
                      {...field}
                      disabled={uploading}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Files</FormLabel>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="text-sm font-medium text-blue-600 hover:text-blue-500">
                      Click to upload
                    </span>
                    <span className="text-sm text-gray-500">
                      {" "}
                      or drag and drop
                    </span>
                  </label>
                  <Input
                    id="file-upload"
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    disabled={uploading}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.zip,.txt"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, GIF, ZIP, TXT (Max 50MB
                  per file)
                </p>
              </div>

              {selectedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium">
                    Selected Files ({selectedFiles.length})
                  </p>
                  <div className="max-h-[200px] overflow-y-auto space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          disabled={uploading}
                          className="ml-2"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={uploading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={uploading}>
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Upload"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadFolderDialog;
