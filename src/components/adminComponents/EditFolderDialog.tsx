import { useState, useEffect } from "react";
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
import { Loader2, FileText, Upload, X } from "lucide-react";
import { toast } from "sonner";
import folderService from "@/services/api/folderService";
import type { Folder } from "@/services/api/folderService";

const formSchema = z.object({
  folder_name: z.string().min(1, "Folder name is required"),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folder: Folder | null;
  onSuccess: () => void;
}

const EditFolderDialog = ({
  open,
  onOpenChange,
  folder,
  onSuccess,
}: EditFolderDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<string[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      folder_name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (folder) {
      form.reset({
        folder_name: folder.folder_name || "",
        description: folder.description || "",
      });

      // Parse original_files - handle both array and JSON string
      let files: string[] = [];
      if (folder.original_files) {
        if (Array.isArray(folder.original_files)) {
          files = folder.original_files;
        } else if (typeof folder.original_files === "string") {
          try {
            files = JSON.parse(folder.original_files);
          } catch (e) {
            console.error("Failed to parse original_files:", e);
            files = [];
          }
        }
      }
      setExistingFiles(files);
      setNewFiles([]);
    }
  }, [folder, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setNewFiles((prev) => [...prev, ...filesArray]);
    }
  };

  const removeNewFile = (index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingFile = (index: number) => {
    setExistingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: FormValues) => {
    if (!folder?.id) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("folder_name", data.folder_name);
      formData.append("description", data.description || "");

      // Add new files if any
      if (newFiles.length > 0) {
        newFiles.forEach((file) => {
          formData.append("files[]", file);
        });
      }

      // Send list of existing files to keep
      if (existingFiles.length > 0) {
        formData.append("existing_files", JSON.stringify(existingFiles));
      }

      const response = await folderService.update(folder.id, formData);

      toast.success(response.message || "Folder updated successfully");
      onSuccess();
      onOpenChange(false);
    } catch (error: unknown) {
      console.error("Update error:", error);

      let errorMessage = "Failed to update folder";

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

        if (err.data?.message) {
          errorMessage = err.data.message;
        } else if (err.data?.error) {
          errorMessage = err.data.error;
        } else if (err.message) {
          errorMessage = err.message;
        }

        if (err.data?.errors) {
          const validationMessages = Object.entries(err.data.errors)
            .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
            .join("; ");
          if (validationMessages) {
            errorMessage = validationMessages;
          }
        }

        if (err.status) {
          errorMessage = `[${err.status}] ${errorMessage}`;
        }
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      form.reset();
      setNewFiles([]);
      setExistingFiles([]);
      onOpenChange(false);
    }
  };

  if (!folder) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Folder</DialogTitle>
          <DialogDescription>
            Update folder information and manage files.
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
                      disabled={loading}
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter folder description"
                      {...field}
                      disabled={loading}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Existing Files */}
            {existingFiles.length > 0 && (
              <div className="space-y-2">
                <FormLabel>Current Files ({existingFiles.length})</FormLabel>
                <div className="max-h-[200px] overflow-y-auto space-y-2">
                  {existingFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 bg-gray-50 rounded-md"
                    >
                      <FileText className="h-4 w-4 text-gray-400" />
                      <p className="text-sm text-gray-900 flex-1 truncate">
                        {file}
                      </p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExistingFile(index)}
                        disabled={loading}
                        className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Files Upload */}
            <div className="space-y-2">
              <FormLabel>Add New Files</FormLabel>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  disabled={loading}
                  className="cursor-pointer"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    document
                      .querySelector<HTMLInputElement>('input[type="file"]')
                      ?.click()
                  }
                  disabled={loading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Browse
                </Button>
              </div>
              {newFiles.length > 0 && (
                <div className="mt-2 space-y-2">
                  <p className="text-sm text-gray-600">
                    New files to add ({newFiles.length}):
                  </p>
                  <div className="max-h-[150px] overflow-y-auto space-y-2">
                    {newFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 bg-blue-50 rounded-md"
                      >
                        <FileText className="h-4 w-4 text-blue-600" />
                        <p className="text-sm text-gray-900 flex-1 truncate">
                          {file.name}
                        </p>
                        <span className="text-xs text-gray-500">
                          {(file.size / 1024).toFixed(1)} KB
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeNewFile(index)}
                          disabled={loading}
                          className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="text-xs text-gray-500 space-y-1">
              <p>
                Created:{" "}
                {folder.created_at
                  ? new Date(folder.created_at).toLocaleString()
                  : "N/A"}
              </p>
              <p>
                Updated:{" "}
                {folder.updated_at
                  ? new Date(folder.updated_at).toLocaleString()
                  : "N/A"}
              </p>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditFolderDialog;
