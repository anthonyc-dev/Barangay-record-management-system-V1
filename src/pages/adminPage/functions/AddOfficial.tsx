import { ChevronLeft, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AddOfficialForm,
  type FormData,
} from "@/components/adminComponents/form/AddOfficialForm";
import { officialService } from "@/services/api/officialService";
import { toast } from "sonner";

export default function AddOfficial() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: FormData) => {
    setIsLoading(true);

    try {
      const response = await officialService.create({
        name: data.name,
        username: data.username,
        password: data.password,
        role: data.role,
      });

      toast.success("Official registered successfully!");

      console.log("Official created:", response);

      // Navigate back to officials page after successful submission
      navigate("/admin/officials");
    } catch (error: unknown) {
      let errorMessage = "Failed to register official";

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
      console.error("Error creating official:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/officials");
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
              <span>Register New Official</span>
            </h1>
            <p className="text-muted-foreground">
              Add a new official/admin to the barangay management system
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
          <li>• Choose appropriate role based on responsibilities</li>
          <li>• Ensure username is unique and easy to remember</li>
          <li>• Use a strong password for security</li>
          <li>• All information will be kept confidential and secure</li>
        </ul>
      </div>

      {/* Registration Form */}
      <AddOfficialForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </div>
  );
}
