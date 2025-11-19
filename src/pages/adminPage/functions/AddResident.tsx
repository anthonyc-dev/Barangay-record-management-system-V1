import { ChevronLeft, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AddResidentForm,
  type FormData,
} from "@/components/adminComponents/form/AddResidentForm";
import { residentService } from "@/services/api/residentService";
import { toast } from "sonner";

export default function AddResident() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: FormData) => {
    setIsLoading(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();

      // Add user account information
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("status", "pending");

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

      // Add valid ID file if uploaded
      if (data.validIdFile instanceof File) {
        formData.append("valid_id_path", data.validIdFile);
      }

      const response = await residentService.createWithFile(formData);

      toast.success("Resident registered successfully!");

      console.log("Resident created:", response);

      // Navigate back to residents page after successful submission
      navigate("/admin/residents");
    } catch (error: unknown) {
      let errorMessage = "Failed to register resident";

      // Handle API validation errors (422) - based on config.ts error structure
      if (error && typeof error === "object" && "errors" in error) {
        const apiError = error as {
          message?: string;
          errors?: Record<string, string[]> | null;
          data?: { message?: string; errors?: Record<string, string[]> };
        };

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
      console.error("Error creating resident:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/residents");
  };

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
              <UserPlus className="h-8 w-8 text-primary" />
              <span>Register New Resident</span>
            </h1>
            <p className="text-muted-foreground">
              Add a new resident to the barangay management system
            </p>
          </div>
        </div>
      </div>

      {/* Instructions Card */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
        <h3 className="font-semibold text-primary mb-2">
          Registration Instructions
        </h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Fill out all required fields marked with asterisk (*)</li>
          <li>• Upload a clear profile photo for identification purposes</li>
          <li>• Provide accurate contact and address information</li>
          <li>• Emergency contact details are required for safety purposes</li>
          <li>• All information will be kept confidential and secure</li>
        </ul>
      </div>

      {/* Registration Form */}
      <AddResidentForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </div>
  );
}
