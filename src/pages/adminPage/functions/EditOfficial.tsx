import { ChevronLeft, UserPen } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { officialService, type Official } from "@/services/api/officialService";
import {
  EditOfficialForm,
  type FormData,
} from "@/components/adminComponents/form/EditOfficialForm";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function EditOfficial() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [officialData, setOfficialData] = useState<Official | null>(null);

  const fetchOfficial = useCallback(
    async (officialId: number) => {
      try {
        setIsFetching(true);
        const response = await officialService.getById(officialId);
        setOfficialData(response.data);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to fetch official data";
        toast.error(errorMessage);
        navigate("/admin/officials");
      } finally {
        setIsFetching(false);
      }
    },
    [navigate]
  );

  // Fetch official data on component mount
  useEffect(() => {
    if (id) {
      fetchOfficial(parseInt(id));
    }
  }, [id, fetchOfficial]);

  const handleSubmit = async (data: FormData) => {
    if (!id) return;

    setIsLoading(true);

    try {
      console.log("Form data received:", data);

      // Prepare official data
      const officialData: Partial<Official> = {
        name: data.name,
        username: data.username,
        role: data.role,
      };

      // Only include password if it was provided (not empty)
      if (data.password && data.password.trim() !== "") {
        officialData.password = data.password;
      }

      console.log("Sending official data to API");
      const response = await officialService.update(
        parseInt(id),
        officialData
      );
      toast.success(response.message || "Official updated successfully!");
      console.log("Official updated:", response);
      navigate("/admin/officials");
    } catch (error: unknown) {
      let errorMessage = "Failed to update official";

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
      console.error("Error updating official:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/officials");
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!officialData) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Official not found</p>
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
              <span>Edit Official</span>
            </h1>
            <p className="text-muted-foreground">
              Update official information in the barangay management system
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
          <li>• Leave password field blank to keep current password</li>
          <li>• All changes will be saved immediately upon submission</li>
        </ul>
      </div>

      {/* Edit Form */}
      <EditOfficialForm
        initialData={officialData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </div>
  );
}
