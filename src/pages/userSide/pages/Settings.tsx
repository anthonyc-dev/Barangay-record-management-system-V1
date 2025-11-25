import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { User, Mail, Save, Camera, Lock, Eye, EyeOff } from "lucide-react";
import { authService } from "@/services/api/authService";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { toast } from "sonner";

// Password change validation schema
const passwordChangeSchema = z
  .object({
    oldPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordChangeFormValues = z.infer<typeof passwordChangeSchema>;

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<
    string | null
  >(null);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
  });

  // Get user profile context for real-time updates
  const { userProfile, refreshProfile } = useUserProfile();

  // Load user data on component mount and when userProfile changes
  useEffect(() => {
    if (userProfile) {
      setProfileData({
        name: userProfile.name || "",
        email: userProfile.email || "",
      });

      // Load existing profile picture if available
      if (userProfile.profile_url) {
        setProfilePicturePreview(userProfile.profile_url);
      }
    } else {
      // Fallback to localStorage if context hasn't loaded yet
      const userInfo = authService.getStoredUserInfo();
      if (userInfo) {
        setProfileData({
          name: userInfo.name || "",
          email: userInfo.email || "",
        });

        if (userInfo.profile_url) {
          setProfilePicturePreview(userInfo.profile_url);
        }
      }
    }
  }, [userProfile]);
  // Password change form
  const passwordForm = useForm<PasswordChangeFormValues>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size must be less than 2MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file (JPG, PNG, or GIF)");
        return;
      }

      setProfilePicture(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);

    try {
      const userInfo = authService.getStoredUserInfo();
      if (!userInfo?.id) {
        toast.error("User not authenticated. Please log in again.");
        return;
      }

      const formData = new FormData();
      formData.append("name", profileData.name);
      formData.append("email", profileData.email);

      if (profilePicture) {
        formData.append("profile", profilePicture);
      }

      const response = await authService.updateProfile(userInfo.id, formData);

      toast.success("Your profile information has been updated successfully.");

      // Update profile picture preview if a new profile picture was returned
      if (response.user_info?.profile_url) {
        setProfilePicturePreview(response.user_info.profile_url);
      }

      // Clear profile picture file after successful upload
      setProfilePicture(null);

      // Refresh the user profile context to update Navbar and Sidebar in real-time
      await refreshProfile();
    } catch (error: unknown) {
      console.error("Profile update error:", error);

      let errorMessage = "Failed to update profile. Please try again.";

      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response
      ) {
        const responseData = error.response.data as Record<string, unknown>;

        if (responseData.message && typeof responseData.message === "string") {
          errorMessage = responseData.message;
        } else if (
          responseData.errors &&
          typeof responseData.errors === "object"
        ) {
          const errors = responseData.errors as Record<string, string[]>;
          errorMessage = Object.values(errors).flat().join(", ");
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordChange = async (data: PasswordChangeFormValues) => {
    setIsChangingPassword(true);

    try {
      const userInfo = authService.getStoredUserInfo();
      if (!userInfo?.id) {
        toast.error("User not authenticated. Please log in again.");
        return;
      }

      const passwordData = {
        current_password: data.oldPassword,
        new_password: data.newPassword,
        new_password_confirmation: data.confirmPassword,
      };

      console.log("Updating password for user ID:", userInfo.id);

      await authService.updatePassword(userInfo.id, passwordData);

      toast.success("Your password has been changed successfully.");

      // Reset form
      passwordForm.reset();
    } catch (error: unknown) {
      console.error("Password update error:", error);

      // Extract error message from API response
      let errorMessage = "Failed to update password. Please try again.";

      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response
      ) {
        const responseData = error.response.data as Record<string, unknown>;

        if (responseData.message && typeof responseData.message === "string") {
          errorMessage = responseData.message;
        } else if (
          responseData.errors &&
          typeof responseData.errors === "object"
        ) {
          // Handle Laravel validation errors
          const errors = responseData.errors as Record<string, string[]>;
          errorMessage = Object.values(errors).flat().join(", ");
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center space-x-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account</p>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <Breadcrumb>
        <BreadcrumbList>
          {activeTab === "profile" ? (
            <BreadcrumbItem>
              <BreadcrumbPage className="text-blue-600 font-semibold">
                Profile
              </BreadcrumbPage>
            </BreadcrumbItem>
          ) : (
            <BreadcrumbItem>
              <BreadcrumbLink
                onClick={() => setActiveTab("profile")}
                className="cursor-pointer"
              >
                Profile
              </BreadcrumbLink>
            </BreadcrumbItem>
          )}
          <BreadcrumbSeparator />
          {activeTab === "security" ? (
            <BreadcrumbItem>
              <BreadcrumbPage className="text-blue-600 font-semibold">
                Security
              </BreadcrumbPage>
            </BreadcrumbItem>
          ) : (
            <BreadcrumbItem>
              <BreadcrumbLink
                onClick={() => setActiveTab("security")}
                className="cursor-pointer"
              >
                Security
              </BreadcrumbLink>
            </BreadcrumbItem>
          )}
        </BreadcrumbList>
      </Breadcrumb>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Profile Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              {/* Profile Picture Section */}
              <div className="space-y-2">
                <Label>Profile Picture</Label>
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                    {profilePicturePreview ? (
                      <img
                        src={profilePicturePreview}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-10 w-10 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <Input
                      id="profilePicture"
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        document.getElementById("profilePicture")?.click()
                      }
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Change Photo
                    </Button>
                    <p className="text-sm text-gray-500 mt-1">
                      JPG, PNG or GIF. Max size 2MB.
                    </p>
                  </div>
                </div>
              </div>

              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      name: e.target.value,
                    })
                  }
                  placeholder="Enter your full name"
                  disabled
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    className="pl-10"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        email: e.target.value,
                      })
                    }
                    placeholder="Enter your email address"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>
                    {isUpdatingProfile ? "Updating..." : "Save Changes"}
                  </span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lock className="h-5 w-5" />
              <span>Change Password</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...passwordForm}>
              <form
                onSubmit={passwordForm.handleSubmit(handlePasswordChange)}
                className="space-y-4"
              >
                <FormField
                  control={passwordForm.control}
                  name="oldPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          <Input
                            {...field}
                            type={showOldPassword ? "text" : "password"}
                            placeholder="Enter your current password"
                            className="pl-10 pr-10"
                            disabled={isChangingPassword}
                          />
                          <button
                            type="button"
                            onClick={() => setShowOldPassword(!showOldPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showOldPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          <Input
                            {...field}
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Enter your new password"
                            className="pl-10 pr-10"
                            disabled={isChangingPassword}
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-gray-500 mt-1">
                        Password must be at least 8 characters with uppercase,
                        lowercase, and number
                      </p>
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          <Input
                            {...field}
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your new password"
                            className="pl-10 pr-10"
                            disabled={isChangingPassword}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    disabled={isChangingPassword}
                    className="flex items-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>
                      {isChangingPassword ? "Updating..." : "Update Password"}
                    </span>
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Settings;
