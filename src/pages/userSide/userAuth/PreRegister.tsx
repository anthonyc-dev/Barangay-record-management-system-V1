import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Upload,
  FileImage,
  X,
  Check,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  ChevronLeft,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

// Combined Registration Schema
const registrationSchema = z
  .object({
    // Account Information
    fullName: z.string().min(3, "Full name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm your password"),

    // Personal Information
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    middleName: z.string().min(1, "Middle name is required"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    suffix: z.string().optional(),
    birthDate: z.string().min(1, "Birthdate is required"),
    gender: z.enum(["Male", "Female"], { message: "Please select gender" }),
    placeOfBirth: z.string().min(2, "Place of birth is required"),
    civilStatus: z.enum(
      ["Single", "Married", "Widowed", "Divorced", "Separated"],
      { message: "Please select civil status" }
    ),

    // Address Information
    houseNumber: z.string().min(1, "House number is required"),
    street: z.string().min(1, "Street is required"),
    zone: z.string().min(1, "Zone/Purok is required"),
    city: z.string().min(1, "City is required"),
    province: z.string().min(1, "Province is required"),

    // Contact Information
    contactNumber: z
      .string()
      .min(11, "Contact number must be at least 11 digits")
      .regex(
        /^09\d{9}$/,
        "Must be a valid Philippine mobile number (09xxxxxxxxx)"
      ),

    // Personal Details
    nationality: z.string().min(1, "Nationality is required"),
    religion: z.string().min(1, "Religion is required"),
    occupation: z.string().min(1, "Occupation is required"),

    // Parents Information
    fatherFirstName: z.string().min(1, "Father's first name is required"),
    fatherMiddleName: z.string().optional(),
    fatherLastName: z.string().min(1, "Father's last name is required"),
    motherFirstName: z.string().min(1, "Mother's first name is required"),
    motherMiddleName: z.string().optional(),
    motherMaidenName: z.string().min(1, "Mother's maiden name is required"),

    // Valid ID Upload
    validId: z
      .any()
      .refine((file) => file instanceof File, "Valid ID image is required")
      .refine(
        (file) => file instanceof File && file.size <= 10 * 1024 * 1024,
        "File size must be less than 10MB"
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegistrationFormData = z.infer<typeof registrationSchema>;

interface UploadedFileData {
  file: File;
  uploadId: string;
  uploadDate: Date;
  status: "uploading" | "completed" | "error";
  progress: number;
}

const PreRegister = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFileData | null>(
    null
  );
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [uploadError, setUploadError] = useState<string>("");

  const navigate = useNavigate();

  // Registration Form
  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      middleName: "",
      lastName: "",
      suffix: "",
      birthDate: "",
      placeOfBirth: "",
      gender: undefined,
      civilStatus: undefined,
      houseNumber: "",
      street: "",
      zone: "",
      city: "",
      province: "",
      contactNumber: "",
      nationality: "Filipino",
      religion: "Roman Catholic",
      occupation: "",
      fatherFirstName: "",
      fatherMiddleName: "",
      fatherLastName: "",
      motherFirstName: "",
      motherMiddleName: "",
      motherMaidenName: "",
      validId: undefined,
    },
  });

  // Cleanup preview URL on component unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Generate unique upload ID
  const generateUploadId = (): string => {
    return `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Submit Handler - Create User Account and Resident Record in one step
  const handleSubmit = async (data: RegistrationFormData) => {
    setIsSubmitting(true);

    try {
      // Prepare resident data with file upload
      const formData = new FormData();

      // Add user account information
      formData.append("name", data.fullName);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("status", "pending");

      // Add all resident fields - ensure all required fields are included
      formData.append("first_name", data.firstName);
      formData.append("middle_name", data.middleName);
      formData.append("last_name", data.lastName);
      if (data.suffix) formData.append("suffix", data.suffix);
      formData.append("birth_date", data.birthDate);
      formData.append("gender", data.gender);
      formData.append("place_of_birth", data.placeOfBirth);
      formData.append("civil_status", data.civilStatus);
      formData.append("house_number", data.houseNumber);
      formData.append("street", data.street);
      formData.append("zone", data.zone);
      formData.append("city", data.city);
      formData.append("province", data.province);
      formData.append("contact_number", data.contactNumber);
      formData.append("email", data.email);
      formData.append("nationality", data.nationality);
      formData.append("religion", data.religion);
      formData.append("occupation", data.occupation);
      formData.append("father_first_name", data.fatherFirstName);
      if (data.fatherMiddleName)
        formData.append("father_middle_name", data.fatherMiddleName);
      formData.append("father_last_name", data.fatherLastName);
      formData.append("mother_first_name", data.motherFirstName);
      if (data.motherMiddleName)
        formData.append("mother_middle_name", data.motherMiddleName);
      formData.append("mother_maiden_name", data.motherMaidenName);

      // Add valid ID file
      if (data.validId instanceof File) {
        formData.append("valid_id_path", data.validId);
      }

      // Debug: Log the form data being sent
      console.log("Form data being sent:");
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      // Submit to residents endpoint
      const residentResponse = await fetch(
        "http://localhost:8000/api/register",
        {
          method: "POST",
          body: formData,
        }
      );

      const registrationResult = await residentResponse.json();

      console.log("Registration response:", registrationResult);

      if (residentResponse.ok) {
        // Check if registration was successful
        if (
          registrationResult.message === "Successfully registered" ||
          registrationResult.id
        ) {
          toast.success(
            "Your account has been created successfully. You can now login."
          );

          // Redirect to login page after 2 seconds
          setTimeout(() => {
            navigate("/registerConfirm");
          }, 2000);
        } else {
          // Handle validation errors
          if (registrationResult.errors) {
            const errorMessages = Object.values(registrationResult.errors)
              .flat()
              .join(", ");
            throw new Error(errorMessages);
          }
          throw new Error(
            registrationResult.message || "Failed to complete registration"
          );
        }
      } else {
        // Handle HTTP errors
        if (registrationResult.errors) {
          const errorMessages = Object.values(registrationResult.errors)
            .flat()
            .join(", ");
          throw new Error(errorMessages);
        }
        throw new Error(
          registrationResult.message || "Failed to complete registration"
        );
      }
    } catch (error: unknown) {
      console.error("Registration error:", error);

      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? String(error.message)
          : "Failed to complete registration. Please try again.";

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleAlreadyHaveAccount = () => {
    navigate("/");
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    setUploadError("");

    if (file) {
      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
        "application/pdf",
      ];

      if (!allowedTypes.includes(file.type)) {
        setUploadError(
          "Please upload a valid file (JPEG, JPG, PNG, GIF, WebP, PDF)"
        );
        return;
      }

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        setUploadError("File size must be less than 10MB");
        return;
      }

      // Cleanup previous preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      // Generate upload ID and create file data object
      const uploadId = generateUploadId();
      const fileData: UploadedFileData = {
        file,
        uploadId,
        uploadDate: new Date(),
        status: "uploading",
        progress: 0,
      };

      setUploadedFile(fileData);
      form.setValue("validId", file);

      // Simulate upload progress (in real app, this would be actual upload progress)
      const simulateUpload = () => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 20;
          if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setUploadedFile((prev) =>
              prev ? { ...prev, status: "completed", progress: 100 } : null
            );
          } else {
            setUploadedFile((prev) => (prev ? { ...prev, progress } : null));
          }
        }, 200);
      };

      // Create preview URL for images
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      }

      // Start upload simulation
      simulateUpload();
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setPreviewUrl("");
    setUploadError("");
    form.setValue("validId", undefined);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center py-8 px-4">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url(/image/4.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 w-full max-w-6xl">
        <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
          <div className="bg-gradient-to-r  text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                type="button"
                onClick={handleBack}
                className="text-black hover:bg-white/20 pl-8 rounded-full"
                disabled={isSubmitting}
              >
                <ChevronLeft className="inline-block" /> Back
              </Button>
              <div className="text-center flex-1">
                <CardTitle className="text-3xl font-bold mb-2 text-black">
                  Resident Registration
                </CardTitle>
                <CardDescription className="text-blue-400">
                  Please fill out all required information accurately
                </CardDescription>
              </div>
              <div className="w-20" />
            </div>
          </div>

          <CardContent className="p-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-10"
              >
                {/* Account Information Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-semibold">1</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Account Information
                    </h3>
                    <Badge variant="secondary" className="ml-auto">
                      Required
                    </Badge>
                  </div>
                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Full Name *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Juan Dela Cruz"
                              {...field}
                              className="h-11 border-2 focus:border-blue-500"
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Email Address *
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="juan.delacruz@email.com"
                              {...field}
                              className="h-11 border-2 focus:border-blue-500"
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Password *
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                {...field}
                                className="h-11 border-2 focus:border-blue-500 pr-10"
                                disabled={isSubmitting}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                              >
                                {showPassword ? (
                                  <EyeOff className="w-5 h-5" />
                                ) : (
                                  <Eye className="w-5 h-5" />
                                )}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Confirm Password *
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm your password"
                                {...field}
                                className="h-11 border-2 focus:border-blue-500 pr-10"
                                disabled={isSubmitting}
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  setShowConfirmPassword(!showConfirmPassword)
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="w-5 h-5" />
                                ) : (
                                  <Eye className="w-5 h-5" />
                                )}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Valid ID Upload Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 font-semibold">2</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Valid ID Upload
                    </h3>
                    <Badge variant="secondary" className="ml-auto">
                      Required
                    </Badge>
                  </div>
                  <Separator />

                  <FormField
                    control={form.control}
                    name="validId"
                    render={() => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Upload Valid ID *
                        </FormLabel>
                        <FormControl>
                          <div className="space-y-4">
                            {uploadError && (
                              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <AlertCircle className="w-5 h-5 text-red-500" />
                                <span className="text-sm text-red-700">
                                  {uploadError}
                                </span>
                              </div>
                            )}

                            {!uploadedFile ? (
                              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                                <input
                                  type="file"
                                  accept="image/*,.pdf"
                                  onChange={handleFileUpload}
                                  className="hidden"
                                  id="id-upload"
                                />
                                <label
                                  htmlFor="id-upload"
                                  className="cursor-pointer flex flex-col items-center space-y-3"
                                >
                                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                    <Upload className="w-8 h-8 text-blue-600" />
                                  </div>
                                  <div>
                                    <p className="text-lg font-medium text-gray-700">
                                      Click to upload your Valid ID
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                      Accepted formats: JPEG, JPG, PNG, GIF,
                                      WebP, PDF (Max 10MB)
                                    </p>
                                    <p className="text-xs text-gray-400 mt-2">
                                      Examples: Driver's License, Passport,
                                      National ID, PRC ID
                                    </p>
                                  </div>
                                </label>
                              </div>
                            ) : (
                              <div
                                className={`border-2 rounded-lg p-4 ${
                                  uploadedFile.status === "completed"
                                    ? "border-green-200 bg-green-50"
                                    : uploadedFile.status === "error"
                                    ? "border-red-200 bg-red-50"
                                    : "border-blue-200 bg-blue-50"
                                }`}
                              >
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                      <div
                                        className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                          uploadedFile.status === "completed"
                                            ? "bg-green-100"
                                            : uploadedFile.status === "error"
                                            ? "bg-red-100"
                                            : "bg-blue-100"
                                        }`}
                                      >
                                        <FileImage
                                          className={`w-6 h-6 ${
                                            uploadedFile.status === "completed"
                                              ? "text-green-600"
                                              : uploadedFile.status === "error"
                                              ? "text-red-600"
                                              : "text-blue-600"
                                          }`}
                                        />
                                      </div>
                                      <div>
                                        <p className="font-medium text-gray-800">
                                          {uploadedFile.file.name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                          {(
                                            uploadedFile.file.size /
                                            1024 /
                                            1024
                                          ).toFixed(2)}{" "}
                                          MB
                                        </p>
                                      </div>
                                      {uploadedFile.status === "completed" && (
                                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                          <Check className="w-4 h-4 text-green-600" />
                                        </div>
                                      )}
                                    </div>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={removeFile}
                                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                                    >
                                      <X className="w-4 h-4" />
                                    </Button>
                                  </div>

                                  {uploadedFile.status === "uploading" && (
                                    <div className="space-y-2">
                                      <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">
                                          Uploading...
                                        </span>
                                        <span className="text-gray-600">
                                          {Math.round(uploadedFile.progress)}%
                                        </span>
                                      </div>
                                      <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                          style={{
                                            width: `${uploadedFile.progress}%`,
                                          }}
                                        />
                                      </div>
                                    </div>
                                  )}

                                  {previewUrl &&
                                    uploadedFile.file.type.startsWith(
                                      "image/"
                                    ) && (
                                      <div className="mt-4">
                                        <img
                                          src={previewUrl}
                                          alt="ID Preview"
                                          className="max-w-full h-48 object-contain rounded-lg border bg-white"
                                        />
                                      </div>
                                    )}

                                  {uploadedFile.file.type ===
                                    "application/pdf" && (
                                    <div className="mt-4 p-3 bg-white/50 rounded-lg border">
                                      <p className="text-sm text-gray-600 text-center">
                                        PDF file uploaded successfully
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Personal Information Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">3</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Personal Information
                    </h3>
                    <Badge variant="secondary" className="ml-auto">
                      Required
                    </Badge>
                  </div>
                  <Separator />

                  {/* Name fields */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-sm font-medium text-gray-700">
                            First Name *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Juan"
                              {...field}
                              className="h-11 border-2 focus:border-blue-500 transition-colors"
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="middleName"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Middle Name *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Santos"
                              {...field}
                              className="h-11 border-2 focus:border-blue-500 transition-colors"
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Last Name *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Dela Cruz"
                              {...field}
                              className="h-11 border-2 focus:border-blue-500 transition-colors"
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="suffix"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Suffix
                          </FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              disabled={isSubmitting}
                            >
                              <SelectTrigger className="w-full h-11 border-2 focus:border-blue-500">
                                <SelectValue placeholder="Select suffix" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Jr">Jr.</SelectItem>
                                <SelectItem value="Sr">Sr.</SelectItem>
                                <SelectItem value="II">II</SelectItem>
                                <SelectItem value="III">III</SelectItem>
                                <SelectItem value="IV">IV</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Birth info and personal details */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <FormField
                      control={form.control}
                      name="birthDate"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Birthdate *
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                              className="h-11 border-2 focus:border-blue-500 transition-colors"
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Gender *
                          </FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              disabled={isSubmitting}
                            >
                              <SelectTrigger className="w-full h-11 border-2 focus:border-blue-500">
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="civilStatus"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Civil Status *
                          </FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              disabled={isSubmitting}
                            >
                              <SelectTrigger className="w-full h-11 border-2 focus:border-blue-500">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Single">Single</SelectItem>
                                <SelectItem value="Married">Married</SelectItem>
                                <SelectItem value="Widowed">Widowed</SelectItem>
                                <SelectItem value="Divorced">
                                  Divorced
                                </SelectItem>
                                <SelectItem value="Separated">
                                  Separated
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="nationality"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Nationality *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Filipino"
                              {...field}
                              className="h-11 border-2 focus:border-blue-500 transition-colors"
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="placeOfBirth"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Place of Birth *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Manila, Philippines"
                              {...field}
                              className="h-11 border-2 focus:border-blue-500 transition-colors"
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="religion"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Religion *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Roman Catholic"
                              {...field}
                              className="h-11 border-2 focus:border-blue-500 transition-colors"
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="occupation"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Occupation *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Teacher"
                              {...field}
                              className="h-11 border-2 focus:border-blue-500 transition-colors"
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Address Information Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-semibold">4</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Address Information
                    </h3>
                    <Badge variant="secondary" className="ml-auto">
                      Required
                    </Badge>
                  </div>
                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    <FormField
                      control={form.control}
                      name="houseNumber"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-sm font-medium text-gray-700">
                            House Number *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="123"
                              {...field}
                              className="h-11 border-2 focus:border-blue-500 transition-colors"
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="street"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Street *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Main Street"
                              {...field}
                              className="h-11 border-2 focus:border-blue-500 transition-colors"
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="zone"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Zone/Purok *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Zone 1"
                              {...field}
                              className="h-11 border-2 focus:border-blue-500 transition-colors"
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-sm font-medium text-gray-700">
                            City/Municipality *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Quezon City"
                              {...field}
                              className="h-11 border-2 focus:border-blue-500 transition-colors"
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="province"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Province *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Metro Manila"
                              {...field}
                              className="h-11 border-2 focus:border-blue-500 transition-colors"
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Contact Information Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                      <span className="text-teal-600 font-semibold">5</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Contact Information
                    </h3>
                    <Badge variant="secondary" className="ml-auto">
                      Required
                    </Badge>
                  </div>
                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                    <FormField
                      control={form.control}
                      name="contactNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Contact Number *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="09123456789"
                              {...field}
                              className="h-11 border-2 focus:border-blue-500 transition-colors"
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Parents Information Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-indigo-600 font-semibold">6</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Parents Information
                    </h3>
                    <Badge variant="secondary" className="ml-auto">
                      Required
                    </Badge>
                  </div>
                  <Separator />

                  {/* Father's Information */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700 flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                      Father's Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="fatherFirstName"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel className="text-sm font-medium text-gray-700">
                              Father's First Name *
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Pedro"
                                {...field}
                                className="h-11 border-2 focus:border-blue-500 transition-colors"
                                disabled={isSubmitting}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="fatherMiddleName"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel className="text-sm font-medium text-gray-700">
                              Father's Middle Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Garcia"
                                {...field}
                                className="h-11 border-2 focus:border-blue-500 transition-colors"
                                disabled={isSubmitting}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="fatherLastName"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel className="text-sm font-medium text-gray-700">
                              Father's Last Name *
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Dela Cruz"
                                {...field}
                                className="h-11 border-2 focus:border-blue-500 transition-colors"
                                disabled={isSubmitting}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Mother's Information */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700 flex items-center gap-2">
                      <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
                      Mother's Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="motherFirstName"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel className="text-sm font-medium text-gray-700">
                              Mother's First Name *
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Maria"
                                {...field}
                                className="h-11 border-2 focus:border-blue-500 transition-colors"
                                disabled={isSubmitting}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="motherMiddleName"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel className="text-sm font-medium text-gray-700">
                              Mother's Middle Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Santos"
                                {...field}
                                className="h-11 border-2 focus:border-blue-500 transition-colors"
                                disabled={isSubmitting}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="motherMaidenName"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel className="text-sm font-medium text-gray-700">
                              Mother's Maiden Name *
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Reyes"
                                {...field}
                                className="h-11 border-2 focus:border-blue-500 transition-colors"
                                disabled={isSubmitting}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                <Separator className="my-8" />

                <div className="flex flex-col space-y-6 pt-6">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-11"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting Registration...
                      </>
                    ) : (
                      "Submit Registration"
                    )}
                  </Button>
                  <div className="flex justify-center items-center">
                    <span className="text-sm text-gray-600 mr-2">
                      Already have an account?
                    </span>
                    <Button
                      type="button"
                      variant="link"
                      className="p-0 h-auto text-blue-600 hover:text-blue-800"
                      onClick={handleAlreadyHaveAccount}
                    >
                      Sign in here
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PreRegister;
