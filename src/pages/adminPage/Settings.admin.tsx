import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { User, Save, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAdmin } from "@/contexts/AdminContext";
import { adminService } from "@/services/api";
import { toast } from "sonner";
import GeneralLoading from "@/components/GeneralLoading";

// Form validation schema
const profileFormSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      // If password is provided, confirmPassword must match
      if (data.password && data.password.length > 0) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const Settings = () => {
  const { adminInfo, checkAuth } = useAdmin();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Fetch fresh admin data from API on component mount
  useEffect(() => {
    const fetchAdminData = async () => {
      if (!adminInfo?.id) return;

      setIsFetchingData(true);
      try {
        const response = await adminService.getAdminById(adminInfo.id);

        // Update form with fetched data
        form.reset({
          name: response.name,
          username: response.username,
          password: "",
          confirmPassword: "",
        });
      } catch (error) {
        console.error("Failed to fetch admin data:", error);
        toast.error("Failed to load profile data");

        // Fallback to adminInfo from context if API fails
        if (adminInfo) {
          form.reset({
            name: adminInfo.name,
            username: adminInfo.username,
            password: "",
            confirmPassword: "",
          });
        }
      } finally {
        setIsFetchingData(false);
      }
    };

    fetchAdminData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminInfo?.id]);

  const onSubmit = async (values: ProfileFormValues) => {
    if (!adminInfo?.id) {
      toast.error("Admin information not found");
      return;
    }

    setIsLoading(true);
    try {
      // Prepare update data - only include password if it's provided
      const updateData: {
        name: string;
        username: string;
        password?: string;
      } = {
        name: values.name,
        username: values.username,
      };

      // Only include password if user entered one
      if (values.password && values.password.length > 0) {
        updateData.password = values.password;
      }

      const response = await adminService.updateAdmin(adminInfo.id, updateData);

      if (response.status === "success") {
        toast.success(response.message || "Profile updated successfully");

        // Clear password fields after successful update
        form.setValue("password", "");
        form.setValue("confirmPassword", "");

        // Refresh auth context to update admin info
        checkAuth();
      } else {
        toast.success(response.message || "Failed to update profile");
      }
    } catch (error: unknown) {
      console.error("Update error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update profile. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!adminInfo) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <User className="h-8 w-8" />
            Admin Settings
          </h1>
          <p className="text-muted-foreground mt-2">
            Update your profile information
          </p>
        </div>
      </div>

      {/* Profile Settings Card */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <p className="text-sm text-muted-foreground">
            Update your name, username, and password. Role cannot be changed.
          </p>
        </CardHeader>
        <CardContent>
          {isFetchingData ? (
            <div className="flex items-center justify-center py-8">
              <GeneralLoading
                loading={isFetchingData}
                message="Loading profile data..."
              />
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Display Role (Read-only) */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Role</label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={
                        adminInfo.role.charAt(0).toUpperCase() +
                        adminInfo.role.slice(1)
                      }
                      disabled
                      className="bg-muted"
                    />
                    <span className="text-xs text-muted-foreground">
                      (Cannot be changed)
                    </span>
                  </div>
                </div>

                {/* Name Field */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Username Field */}
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Section */}
                <div className="space-y-4 border-t pt-6">
                  <h3 className="text-lg font-medium">Change Password</h3>
                  <p className="text-sm text-muted-foreground">
                    Leave blank to keep your current password
                  </p>

                  {/* New Password Field */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter new password (optional)"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Confirm Password Field */}
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm new password"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
