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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Upload, FileImage, X, Check, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

const preRegisterSchema = z.object({
  // Personal Information
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  middleName: z.string().min(1, "Middle name is required"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  suffix: z.string().optional(),
  birthDate: z.string().min(1, "Birthdate is required"),
  gender: z.enum(["Male", "Female"], "Gender is required"),
  placeOfBirth: z.string().min(2, "Place of birth is required"),
  civilStatus: z.enum(
    ["Single", "Married", "Widowed", "Divorced", "Separated"],
    "Civil status is required"
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
    .min(11, "Contact number must be at least 11 digits"),
  email: z.string().email("Invalid email address"),

  // Personal Details
  nationality: z.string().min(1, "Nationality is required"),
  religion: z.string().optional(),
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
    .refine((file) => file instanceof File, "Valid ID image is required"),
});

type PreRegisterFormData = z.infer<typeof preRegisterSchema>;

// Interface for uploaded file with metadata
interface UploadedFileData {
  file: File;
  uploadId: string;
  uploadDate: Date;
  status: "uploading" | "completed" | "error";
  progress: number;
}

const PreRegister = () => {
  const [uploadedFile, setUploadedFile] = useState<UploadedFileData | null>(
    null
  );
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [uploadError, setUploadError] = useState<string>("");

  const form = useForm<PreRegisterFormData>({
    resolver: zodResolver(preRegisterSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      suffix: "",
      birthDate: "",
      placeOfBirth: "",
      houseNumber: "",
      street: "",
      zone: "",
      city: "",
      province: "",
      contactNumber: "",
      email: "",
      nationality: "Filipino",
      religion: "",
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

  const navigate = useNavigate();

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

  const onSubmit = (data: PreRegisterFormData) => {
    // Include upload metadata in submission
    const submissionData = {
      ...data,
      uploadInfo: uploadedFile
        ? {
            uploadId: uploadedFile.uploadId,
            fileName: uploadedFile.file.name,
            fileSize: uploadedFile.file.size,
            uploadDate: uploadedFile.uploadDate,
            status: uploadedFile.status,
          }
        : null,
    };

    console.log("Registration submitted with upload info:", submissionData);
    alert(
      "Registration submitted successfully!\nUpload ID: " +
        (uploadedFile?.uploadId || "No file uploaded")
    );
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
          backgroundImage:
            "url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80')",
        }}
      />

      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 w-full max-w-6xl">
        <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                type="button"
                onClick={handleBack}
                className="text-white hover:bg-white/20 p-2 rounded-full"
              >
                ← Back
              </Button>
              <div className="text-center flex-1">
                <CardTitle className="text-3xl font-bold mb-2">
                  Resident Registration
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Please fill out all required information accurately
                </CardDescription>
              </div>
              <div className="w-20" />
            </div>
          </CardHeader>

          <CardContent className="p-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-10"
              >
                {/* Valid ID Upload Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 font-semibold">1</span>
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
                            {/* Error Message */}
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
                                  {/* File Info Header */}
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

                                  {/* Upload Progress */}
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

                                  {/* Upload Info */}
                                  {uploadedFile.status === "completed" && (
                                    <div className="bg-white/50 rounded-lg p-3 space-y-1">
                                      <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">
                                          Upload ID:
                                        </span>
                                        <span className="font-mono text-gray-800 text-xs bg-gray-100 px-2 py-1 rounded">
                                          {uploadedFile.uploadId}
                                        </span>
                                      </div>
                                      <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">
                                          Upload Date:
                                        </span>
                                        <span className="text-gray-800">
                                          {uploadedFile.uploadDate.toLocaleString()}
                                        </span>
                                      </div>
                                      <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">
                                          Status:
                                        </span>
                                        <Badge
                                          variant="secondary"
                                          className="bg-green-100 text-green-800"
                                        >
                                          Completed
                                        </Badge>
                                      </div>
                                    </div>
                                  )}

                                  {/* Preview */}
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

                                  {/* PDF Info */}
                                  {uploadedFile.file.type ===
                                    "application/pdf" && (
                                    <div className="mt-4 p-3 bg-white/50 rounded-lg border">
                                      <p className="text-sm text-gray-600 text-center">
                                        📄 PDF file uploaded successfully
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
                      <span className="text-blue-600 font-semibold">2</span>
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
                            >
                              <SelectTrigger className="w-full h-11 border-2 focus:border-blue-500">
                                <SelectValue placeholder="Select suffix" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Jr.">Jr.</SelectItem>
                                <SelectItem value="Sr.">Sr.</SelectItem>
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
                            Religion
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Roman Catholic"
                              {...field}
                              className="h-11 border-2 focus:border-blue-500 transition-colors"
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
                      <span className="text-green-600 font-semibold">3</span>
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
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-semibold">4</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Contact Information
                    </h3>
                    <Badge variant="secondary" className="ml-auto">
                      Required
                    </Badge>
                  </div>
                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                              className="h-11 border-2 focus:border-blue-500 transition-colors"
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
                      <span className="text-indigo-600 font-semibold">5</span>
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
                  <Button type="submit">Submit Registration</Button>
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
