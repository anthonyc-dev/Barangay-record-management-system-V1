import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { Resident } from "@/services/api/residentService";

const formSchema = z.object({
  // Personal Information
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  middleName: z.string().optional(),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  suffix: z.string().optional(),
  dateOfBirth: z.date(),
  gender: z.enum(["Male", "Female"], {
    message: "Please select a gender",
  }),
  civilStatus: z.enum(
    ["Single", "Married", "Divorced", "Widowed", "Separated"],
    {
      message: "Please select civil status",
    }
  ),
  placeOfBirth: z.string().min(1, "Place of birth is required"),
  nationality: z.string().min(1, "Nationality is required"),
  religion: z.string().optional(),
  occupation: z.string().min(1, "Occupation is required"),

  // Contact Information
  contactNumber: z
    .string()
    .min(11, "Contact number must be at least 11 digits"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),

  // Address Information
  houseNumber: z.string().min(1, "House number is required"),
  street: z.string().min(1, "Street is required"),
  zone: z.string().min(1, "Zone/Purok is required"),
  city: z.string().min(1, "City is required"),
  province: z.string().min(1, "Province is required"),

  // Family Information
  fatherFirstName: z.string().min(1, "Father's first name is required"),
  fatherMiddleName: z.string().optional(),
  fatherLastName: z.string().min(1, "Father's last name is required"),
  motherFirstName: z.string().min(1, "Mother's first name is required"),
  motherMiddleName: z.string().optional(),
  motherMaidenName: z.string().min(1, "Mother's maiden name is required"),

  // Document Information
  uploadId: z.string().min(1, "Upload ID is required"),
  uploadDate: z.date(),
});

export type FormData = z.infer<typeof formSchema>;

export interface EditResidentFormData extends FormData {
  validIdFile?: File | null;
  validIdBase64?: string | null;
}

interface EditResidentFormProps {
  initialData: Resident;
  onSubmit: (data: EditResidentFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function EditResidentForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: EditResidentFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [validIdFile, setValidIdFile] = useState<File | null>(null);
  const [validIdBase64, setValidIdBase64] = useState<string | null>(null);

  // Get the valid ID image URL - handle both base64 and URL formats
  const validIdImageUrl = initialData.valid_id_url
    ? (initialData.valid_id_url.startsWith('data:')
        ? initialData.valid_id_url
        : initialData.valid_id_url)
    : null;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: initialData.first_name || "",
      middleName: initialData.middle_name || "",
      lastName: initialData.last_name || "",
      suffix: initialData.suffix || "",
      dateOfBirth: initialData.birth_date
        ? new Date(initialData.birth_date)
        : new Date(),
      gender: (initialData.gender as "Male" | "Female") || "Male",
      civilStatus:
        (initialData.civil_status as
          | "Single"
          | "Married"
          | "Divorced"
          | "Widowed"
          | "Separated") || "Single",
      contactNumber: initialData.contact_number || "",
      email: initialData.email || "",
      houseNumber: initialData.house_number || "",
      street: initialData.street || "",
      zone: initialData.zone || "",
      city: initialData.city || "Quezon City",
      province: initialData.province || "Metro Manila",
      occupation: initialData.occupation || "",
      placeOfBirth: initialData.place_of_birth || "",
      nationality: initialData.nationality || "Filipino",
      religion: initialData.religion || "",
      fatherFirstName: initialData.father_first_name || "",
      fatherMiddleName: initialData.father_middle_name || "",
      fatherLastName: initialData.father_last_name || "",
      motherFirstName: initialData.mother_first_name || "",
      motherMiddleName: initialData.mother_middle_name || "",
      motherMaidenName: initialData.mother_maiden_name || "",
      uploadId: initialData.upload_id || "",
      uploadDate: initialData.upload_date
        ? new Date(initialData.upload_date)
        : new Date(),
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log("File selected:", file);
    if (file) {
      console.log("File details:", {
        name: file.name,
        size: file.size,
        type: file.type,
      });
      setValidIdFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        setImagePreview(base64String);
        setValidIdBase64(base64String); // Store base64 for submission
        console.log("Image converted to base64 successfully");
      };
      reader.readAsDataURL(file);
    } else {
      console.log("No file selected");
    }
  };

  const handleFormSubmit = (data: FormData) => {
    console.log("Form submitted!");
    console.log("validIdFile state:", validIdFile);
    console.log("validIdBase64 state:", validIdBase64 ? "Base64 string present" : "No base64");
    const formDataWithFile: EditResidentFormData = {
      ...data,
      validIdFile: validIdFile,
      validIdBase64: validIdBase64, // Include base64 string
    };
    console.log("Passing to parent:", formDataWithFile);
    onSubmit(formDataWithFile);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-8"
      >
        {/* Valid ID Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Valid ID</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="h-48 w-64 rounded-lg border-2 border-dashed border-border bg-muted flex items-center justify-center overflow-hidden">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="ID preview"
                      className="h-full w-full object-contain"
                    />
                  ) : validIdImageUrl ? (
                    <img
                      src={validIdImageUrl}
                      alt="Valid ID"
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <User className="h-12 w-12 text-muted-foreground" />
                  )}
                </div>
                {validIdImageUrl && !imagePreview && (
                  <div className="mt-2">
                    <p className="text-xs text-muted-foreground text-center">
                      Current Valid ID
                    </p>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="valid-id">
                  {validIdImageUrl
                    ? "Update Valid ID (Optional)"
                    : "Upload Valid ID"}
                </Label>
                <Input
                  id="valid-id"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full"
                />
                {validIdImageUrl ? (
                  <div className="space-y-1">
                    <p className="text-sm text-green-600 dark:text-green-500">
                      Valid ID already uploaded. You can upload a new one to
                      replace it.
                    </p>
                    <p className="text-xs text-muted-foreground break-all">
                      Current: {initialData.valid_id_url}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Upload a clear image of valid ID. Max file size: 5MB.
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Name Fields: First, Middle, Last, Suffix */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="middleName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Middle Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Reyes" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="suffix"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Suffix</FormLabel>
                    <FormControl>
                      <Input placeholder="Jr" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Birth Details: Date of Birth, Place of Birth */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="placeOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Place of Birth *</FormLabel>
                    <FormControl>
                      <Input placeholder="Quezon City" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Gender, Civil Status, Nationality, Religion */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="civilStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Civil Status *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select civil status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Single">Single</SelectItem>
                        <SelectItem value="Married">Married</SelectItem>
                        <SelectItem value="Divorced">Divorced</SelectItem>
                        <SelectItem value="Widowed">Widowed</SelectItem>
                        <SelectItem value="Separated">Separated</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nationality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nationality *</FormLabel>
                    <FormControl>
                      <Input placeholder="Filipino" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="religion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Religion</FormLabel>
                    <FormControl>
                      <Input placeholder="Catholic" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contactNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Number *</FormLabel>
                    <FormControl>
                      <Input placeholder="09171234567" {...field} />
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
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="john1@gmail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardHeader>
            <CardTitle>Address Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="houseNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>House Number *</FormLabel>
                    <FormControl>
                      <Input placeholder="123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street *</FormLabel>
                    <FormControl>
                      <Input placeholder="Mabini Street" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="zone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zone/Purok *</FormLabel>
                    <FormControl>
                      <Input placeholder="2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City *</FormLabel>
                    <FormControl>
                      <Input placeholder="Quezon City" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="province"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Province *</FormLabel>
                    <FormControl>
                      <Input placeholder="Metro Manila" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Occupation */}
        <Card>
          <CardHeader>
            <CardTitle>Employment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="occupation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Occupation *</FormLabel>
                  <FormControl>
                    <Input placeholder="Software Engineer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Family Information */}
        <Card>
          <CardHeader>
            <CardTitle>Family Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold mb-3">
                Father's Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="fatherFirstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Father's First Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Robert" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fatherMiddleName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Father's Middle Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Cruz" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fatherLastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Father's Last Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-3">
                Mother's Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="motherFirstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mother's First Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Maria" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="motherMiddleName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mother's Middle Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Santos" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="motherMaidenName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mother's Maiden Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Reyes" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Document Information */}
        <Card>
          <CardHeader>
            <CardTitle>Document Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="uploadId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload ID *</FormLabel>
                    <FormControl>
                      <Input placeholder="ID123456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="uploadDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload Date *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="shadow-primary">
            {isLoading ? "Updating..." : "Update Resident"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
