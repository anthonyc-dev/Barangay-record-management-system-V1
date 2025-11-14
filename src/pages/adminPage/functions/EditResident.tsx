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
      // Check if a new image was uploaded (base64 format)
      console.log("Form data received:", data);
      console.log("Valid ID Base64:", data.validIdBase64 ? "Base64 present" : "No base64");

      // Prepare resident data with all fields
      const residentData = {
        first_name: data.firstName,
        middle_name: data.middleName || "",
        last_name: data.lastName,
        suffix: data.suffix || "",
        birth_date: data.dateOfBirth?.toISOString().split("T")[0],
        gender: data.gender,
        place_of_birth: data.placeOfBirth,
        civil_status: data.civilStatus,
        nationality: data.nationality,
        religion: data.religion || "",
        occupation: data.occupation,
        house_number: data.houseNumber,
        street: data.street,
        zone: data.zone,
        city: data.city,
        province: data.province,
        contact_number: data.contactNumber,
        email: data.email || "",
        father_first_name: data.fatherFirstName,
        father_middle_name: data.fatherMiddleName || "",
        father_last_name: data.fatherLastName,
        mother_first_name: data.motherFirstName,
        mother_middle_name: data.motherMiddleName || "",
        mother_maiden_name: data.motherMaidenName,
        upload_id: data.uploadId,
        upload_date:
          data.uploadDate?.toISOString().split("T")[0] +
            " " +
            data.uploadDate?.toTimeString().split(" ")[0] || "",
        status: "Active",
        // Include valid_id_url as base64 string if new image was uploaded
        ...(data.validIdBase64 && { valid_id_url: data.validIdBase64 }),
      };

      console.log("Sending resident data with base64 image to API");
      const response = await residentService.update(
        parseInt(id),
        residentData
      );
      toast.success(response.message || "Resident updated successfully!");
      console.log("Resident updated:", response);
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
