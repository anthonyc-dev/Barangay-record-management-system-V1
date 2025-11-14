import { ChevronLeft, UserPen } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { residentService, type Resident } from "@/services/api/residentService";
import {
  EditResidentForm,
  type EditResidentFormData,
} from "@/components/adminComponents/form/EditResidentForm";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function EditResident() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [residentData, setResidentData] = useState<Resident | null>(null);

  const fetchResident = useCallback(
    async (residentId: number) => {
      try {
        setIsFetching(true);
        const response = await residentService.getById(residentId);
        setResidentData(response.data);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to fetch resident data";
        toast.error(errorMessage);
        navigate("/admin/residents");
      } finally {
        setIsFetching(false);
      }
    },
    [navigate]
  );

  // Fetch resident data on component mount
  useEffect(() => {
    if (id) {
      fetchResident(parseInt(id));
    }
  }, [id, fetchResident]);

  const handleSubmit = async (data: EditResidentFormData) => {
    if (!id) return;

    setIsLoading(true);

    try {
      console.log("Form data received:", data);
      console.log(
        "Valid ID File:",
        data.validIdFile
          ? `File present: ${data.validIdFile.name}, type: ${data.validIdFile.type}, size: ${data.validIdFile.size}`
          : "No file"
      );
      console.log(
        "validIdFile instanceof File:",
        data.validIdFile instanceof File
      );
      console.log("validIdFile type:", typeof data.validIdFile);

      // Always use FormData for updates to ensure file uploads work correctly
      // Laravel can handle both file and non-file updates with FormData
      const formData = new FormData();

      // Some Laravel backends require _method for PUT requests with FormData
      formData.append("_method", "PUT");

      // Add all resident fields
      formData.append("first_name", data.firstName);
      if (data.middleName) formData.append("middle_name", data.middleName);
      formData.append("last_name", data.lastName);
      if (data.suffix) formData.append("suffix", data.suffix);
      formData.append(
        "birth_date",
        data.dateOfBirth?.toISOString().split("T")[0] || ""
      );
      formData.append("gender", data.gender);
      formData.append("place_of_birth", data.placeOfBirth);
      formData.append("civil_status", data.civilStatus);
      formData.append("nationality", data.nationality);
      if (data.religion) formData.append("religion", data.religion);
      formData.append("occupation", data.occupation);
      formData.append("house_number", data.houseNumber);
      formData.append("street", data.street);
      formData.append("zone", data.zone);
      formData.append("city", data.city);
      formData.append("province", data.province);
      formData.append("contact_number", data.contactNumber);
      if (data.email) formData.append("email", data.email);
      formData.append("father_first_name", data.fatherFirstName);
      if (data.fatherMiddleName)
        formData.append("father_middle_name", data.fatherMiddleName);
      formData.append("father_last_name", data.fatherLastName);
      formData.append("mother_first_name", data.motherFirstName);
      if (data.motherMiddleName)
        formData.append("mother_middle_name", data.motherMiddleName);
      formData.append("mother_maiden_name", data.motherMaidenName);
      formData.append("upload_id", data.uploadId);
      formData.append(
        "upload_date",
        data.uploadDate
          ? data.uploadDate.toISOString().split("T")[0] +
              " " +
              data.uploadDate.toTimeString().split(" ")[0]
          : ""
      );

      // Add valid ID file if a new file was uploaded
      // Laravel expects the file upload field to be named 'valid_id'
      // The backend should store the file and update the 'valid_id_path' column
      if (data.validIdFile && data.validIdFile instanceof File) {
        formData.append("valid_id", data.validIdFile);
        console.log(
          "Added file to FormData:",
          data.validIdFile.name,
          "Size:",
          data.validIdFile.size,
          "Type:",
          data.validIdFile.type
        );
      } else {
        console.log("No new file uploaded, keeping existing valid_id_path");
      }

      // Log FormData contents for debugging
      console.log("FormData contents:");
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(
            `${key}: File(${value.name}, ${value.size} bytes, ${value.type})`
          );
        } else {
          console.log(`${key}: ${value}`);
        }
      }

      console.log("Sending resident data using FormData");
      const response = await residentService.updateWithFile(
        parseInt(id),
        formData
      );
      toast.success(response.message || "Resident updated successfully!");
      console.log("Resident updated:", response);

      // Navigate back to residents list
      // The list will refresh when the component mounts
      navigate("/admin/residents");
    } catch (error: unknown) {
      let errorMessage = "Failed to update resident";

      // Handle API validation errors (422) - based on config.ts error structure
      if (error && typeof error === "object" && "errors" in error) {
        const apiError = error as {
          message?: string;
          errors?: Record<string, string[]> | null;
          data?: { message?: string; errors?: Record<string, string[]> };
        };

        console.error("Full API Error:", apiError);

        // Check for validation errors in errors field
        if (apiError.errors) {
          const validationErrors = Object.entries(apiError.errors)
            .map(
              ([field, messages]) =>
                `${field}: ${
                  Array.isArray(messages) ? messages.join(", ") : messages
                }`
            )
            .join("\n");
          errorMessage = validationErrors;
        }
        // Check for errors in data.errors (nested structure)
        else if (apiError.data?.errors) {
          const validationErrors = Object.entries(apiError.data.errors)
            .map(
              ([field, messages]) =>
                `${field}: ${
                  Array.isArray(messages) ? messages.join(", ") : messages
                }`
            )
            .join("\n");
          errorMessage = validationErrors;
        }
        // Use message if available
        else if (apiError.message) {
          errorMessage = apiError.message;
        } else if (apiError.data?.message) {
          errorMessage = apiError.data.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
      console.error("Error updating resident:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/residents");
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!residentData) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Resident not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 group"
          >
            <ChevronLeft className="h-10 w-10 font-bold transition-transform duration-200 group-hover:scale-110 group-hover:text-primary" />
          </Button>
          <div className="h-6 border-l border-border" />
          <div>
            <h1 className="text-3xl font-bold flex items-center space-x-3">
              <UserPen className="h-8 w-8 text-primary" />
              <span>Edit Resident</span>
            </h1>
            <p className="text-muted-foreground">
              Update resident information in the barangay management system
            </p>
          </div>
        </div>
      </div>

      {/* Instructions Card */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
        <h3 className="font-semibold text-primary mb-2">Update Instructions</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Update only the fields that need to be changed</li>
          <li>• All required fields marked with asterisk (*) must be filled</li>
          <li>• Verify contact and address information for accuracy</li>
          <li>• All changes will be saved immediately upon submission</li>
        </ul>
      </div>

      {/* Edit Form */}
      <EditResidentForm
        initialData={residentData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </div>
  );
}
