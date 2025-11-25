import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Shield } from "lucide-react";
import { useEffect } from "react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Official } from "@/services/api/officialService";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().optional().or(z.literal("")),
  role: z.enum(["Admin", "Official", "Capitan"], "Please select a role"),
});

export type FormData = z.infer<typeof formSchema>;

interface EditOfficialFormProps {
  initialData: Official;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

// Helper function to normalize role
const normalizeRole = (
  role: string | undefined
): "Admin" | "Official" | "Capitan" => {
  if (!role) return "Official";
  const roleLower = role.toLowerCase();
  if (roleLower === "admin") return "Admin";
  if (roleLower === "official") return "Official";
  if (roleLower === "capitan") return "Capitan";
  return "Official";
};

export function EditOfficialForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: EditOfficialFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      username: initialData?.username || "",
      password: "",
      role: normalizeRole(initialData?.role),
    },
  });

  // Update form when initialData changes (after async fetch)
  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name || "",
        username: initialData.username || "",
        password: "",
        role: normalizeRole(initialData.role),
      });
    }
  }, [initialData, form]);

  const handleFormSubmit = (data: FormData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6"
      >
        {/* Official Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Official Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Juan Dela Cruz" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username *</FormLabel>
                  <FormControl>
                    <Input placeholder="jdelacruz" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password (Leave blank to keep current)</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter new password (optional)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-sm text-muted-foreground">
                    Only fill this if you want to change the password
                  </p>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Official">Official</SelectItem>
                      <SelectItem value="Capitan">Barangay Captain</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            {isLoading ? "Updating..." : "Update Official"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
