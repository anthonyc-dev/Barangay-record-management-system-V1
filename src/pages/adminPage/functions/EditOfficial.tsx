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
  const [fetchError, setFetchError] = useState<string | null>(null);

  console.log(officialData);

  const fetchOfficial = useCallback(
    async (officialId: number) => {
      try {
        setIsFetching(true);
        setFetchError(null);
        const response = await officialService.getById(officialId);
        console.log("Fetched official data - Full response:", response);

        // Handle different response structures
        let official: Official | null = null;

        // Check if response has nested data structure
        if (response && typeof response === "object") {
          if ("data" in response && response.data) {
            // Standard structure: { status: string, data: Official }
            official = response.data as Official;
          } else if ("id" in response || "name" in response) {
            // Direct structure: Official object directly
            official = response as Official;
          }
        }

        console.log("Extracted official data:", official);

        if (!official || !official.id) {
          throw new Error("Official data not found in response");
        }

        setOfficialData(official);
      } catch (error: unknown) {
        console.error("Error fetching official:", error);
        let errorMessage = "Failed to fetch official data";

        if (error && typeof error === "object" && "message" in error) {
          errorMessage = String(error.message);
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }

        setFetchError(errorMessage);
        toast.error(errorMessage);

        // Delay navigation to allow user to see the error
        setTimeout(() => {
          navigate("/admin/officials");
        }, 2000);
      } finally {
        setIsFetching(false);
      }
    },
    [navigate]
  );

  // Fetch official data on component mount
  useEffect(() => {
    if (!id) {
      console.error("No ID provided in URL params");
      setFetchError("No official ID provided");
      setIsFetching(false);
      return;
    }

    const officialId = parseInt(id);
    if (isNaN(officialId)) {
      console.error("Invalid ID format:", id);
      setFetchError(`Invalid official ID format: ${id}`);
      setIsFetching(false);
      return;
    }

    console.log("Fetching official with ID:", officialId);
    fetchOfficial(officialId);
  }, [id, fetchOfficial]);

  const handleSubmit = async (data: FormData) => {
    if (!id) return;

    setIsLoading(true);

    try {
      console.log("Form data received:", data);
      console.log("Current role from form:", data.role);

      // Prepare official data
      // Convert role to lowercase to match API expectations (consistent with AddOfficialForm)
      const roleValue = data.role.toLowerCase();
      console.log("Role value to send (lowercase):", roleValue);
      console.log("Original role from form:", data.role);

      // Always include role in the update request - this is required for role updates
      const officialData: Partial<Official> = {
        name: data.name,
        username: data.username,
        role: roleValue, // CRITICAL: Always include role field to allow role updates
      };

      // Only include password if it was provided (not empty)
      if (data.password && data.password.trim() !== "") {
        officialData.password = data.password;
      }

      // Ensure role is explicitly set and valid
      if (
        !officialData.role ||
        (officialData.role !== "admin" &&
          officialData.role !== "official" &&
          officialData.role !== "capitan")
      ) {
        console.error(
          "Role is missing or invalid in officialData!",
          officialData.role
        );
        throw new Error("Role is required and must be 'admin' or 'official'");
      }

      // Double-check role is in the payload
      console.log("Final payload before sending:", {
        ...officialData,
        role: officialData.role,
        roleType: typeof officialData.role,
      });

      console.log(
        "Sending official data to API:",
        JSON.stringify(officialData, null, 2)
      );
      console.log("Role field in request:", officialData.role);
      console.log("Official ID:", parseInt(id));

      const response = await officialService.update(parseInt(id), officialData);

      console.log("API Response:", response);
      console.log("Updated official data:", response.data);
      console.log("Updated role in response:", response.data?.role);

      // Verify the role was actually updated
      if (
        response.data?.role &&
        response.data.role.toLowerCase() !== roleValue
      ) {
        console.warn(
          `Role mismatch! Sent: ${roleValue}, Received: ${response.data.role}`
        );
        toast.warning(
          `Role update may have failed. Expected: ${roleValue}, Got: ${response.data.role}`
        );
      }

      toast.success(response.message || "Official updated successfully!");
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
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading official data...</p>
        </div>
      </div>
    );
  }

  if (fetchError || !officialData) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto space-y-4">
          <div className="text-destructive text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold">Official Not Found</h2>
          <p className="text-muted-foreground">
            {fetchError ||
              "The official you are trying to edit could not be found. This may be because:"}
          </p>
          {!fetchError && (
            <ul className="text-sm text-muted-foreground space-y-1 text-left">
              <li>• The official was deleted</li>
              <li>• The ID is invalid</li>
              <li>• The backend server is not running</li>
              <li>• You don't have permission to access this official</li>
            </ul>
          )}
          <Button onClick={() => navigate("/admin/officials")} className="mt-4">
            Back to Officials List
          </Button>
        </div>
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
