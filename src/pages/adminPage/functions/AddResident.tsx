import { ChevronLeft, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AddResidentForm } from "@/components/adminComponents/form/AddResidentForm";

export default function AddResident() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Resident data submitted:", data);

    setIsLoading(false);

    // Navigate back to residents page after successful submission
    navigate("/admin/residents");
  };

  const handleCancel = () => {
    navigate("/admin/residents");
  };

  return (
    <div className="space-y-6">
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

      {/* Progress Indicator */}
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
              1
            </div>
            <span className="text-sm font-medium">Personal Information</span>
          </div>
          <div className="h-px bg-border flex-1" />
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-medium">
              2
            </div>
            <span className="text-sm text-muted-foreground">
              Document Generation
            </span>
          </div>
          <div className="h-px bg-border flex-1" />
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-medium">
              3
            </div>
            <span className="text-sm text-muted-foreground">Confirmation</span>
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
