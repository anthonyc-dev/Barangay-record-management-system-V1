import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FileText, Clock, CheckCircle, Download } from "lucide-react";

const documentSchema = z.object({
  documentType: z.string().min(1, "Please select a document type"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  contactNumber: z.string().min(11, "Please enter a valid contact number"),
  email: z.string().email("Please enter a valid email address"),
  purpose: z.string().min(10, "Purpose must be at least 10 characters"),
});

type DocumentFormValues = z.infer<typeof documentSchema>;

const DocumentRequest = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      documentType: "",
      fullName: "",
      address: "",
      contactNumber: "",
      email: "",
      purpose: "",
    },
  });

  const onSubmit = (data: DocumentFormValues) => {
    console.log("Document request submitted:", data);
    setIsSubmitted(true);
  };

  const documentTypes = [
    { value: "indigency", label: "Certificate of Indigency", fee: "Free" },
    { value: "clearance", label: "Barangay Clearance", fee: "₱50.00" },
    { value: "residency", label: "Certificate of Residency", fee: "₱30.00" },
    { value: "business", label: "Business Permit Clearance", fee: "₱100.00" },
  ];

  const processingSteps = [
    {
      icon: FileText,
      title: "Submit Request",
      description: "Fill out the online form",
    },
    { icon: Clock, title: "Processing", description: "3-5 business days" },
    {
      icon: CheckCircle,
      title: "Ready for Pickup",
      description: "Notification sent",
    },
    {
      icon: Download,
      title: "Claim Document",
      description: "Visit barangay office",
    },
  ];

  if (isSubmitted) {
    return (
      <section id="documents" className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto bg-white/90 backdrop-blur-sm shadow-elegant border-0">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-primary">
                Request Submitted Successfully!
              </CardTitle>
              <CardDescription className="text-lg">
                Your document request has been received. Reference Number:{" "}
                <strong>DOC-2024-001</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                You will receive an SMS/Email notification when your document is
                ready for pickup.
              </p>
              <Button onClick={() => setIsSubmitted(false)} className="mt-4">
                Submit Another Request
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section
      id="documents"
      className="py-20 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">
              Request Barangay Documents
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Apply for official barangay documents online. Skip the queues and
              submit your requests digitally.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Document Request Form */}
            <Card className="bg-white/90 backdrop-blur-sm shadow-elegant border-0">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">
                  Document Request Form
                </CardTitle>
                <CardDescription>
                  Fill out this form to request official barangay documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    {/* Make Document Type full width and on its own row */}
                    <div className="w-full">
                      <FormField
                        control={form.control}
                        name="documentType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Document Type</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select document type" />
                                </SelectTrigger>
                                <SelectContent>
                                  {documentTypes.map((doc) => (
                                    <SelectItem
                                      key={doc.value}
                                      value={doc.value}
                                    >
                                      <div className="flex justify-between items-center w-full">
                                        <span>{doc.label}</span>
                                        <span className="text-sm text-muted-foreground ml-2">
                                          {doc.fee}
                                        </span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Juan Dela Cruz" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="contactNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Number</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="+63 9XX XXX XXXX"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Make Complete Address full width */}
                    <div className="w-full">
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Complete Address</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="House No., Street, Barangay, City"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="juan@example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="purpose"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Purpose/Reason for Request</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Please specify the purpose of your document request..."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-900 via-blue-700 to-blue-600 text-white font-bold py-3 rounded-lg shadow hover:opacity-90 transition-opacity"
                      disabled={form.formState.isSubmitting}
                    >
                      {form.formState.isSubmitting
                        ? "Submitting..."
                        : "Submit Request"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Processing Information */}
            <div className="space-y-8">
              <Card className="bg-white/90 backdrop-blur-sm shadow-elegant border-0">
                <CardHeader>
                  <CardTitle className="text-xl text-primary">
                    Available Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {documentTypes.map((doc) => (
                      <div
                        key={doc.value}
                        className="flex justify-between items-center p-3 bg-gray-100 rounded-lg"
                      >
                        <span className="font-medium">{doc.label}</span>
                        <span className="text-primary font-semibold">
                          {doc.fee}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm shadow-elegant border-0">
                <CardHeader>
                  <CardTitle className="text-xl text-primary">
                    Processing Timeline
                  </CardTitle>
                  <CardDescription>
                    Track your document request through these stages
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {processingSteps.map((step, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          {/* Fix icon rendering */}
                          {step.icon && (
                            <step.icon className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold text-primary">
                            {step.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-primary/5 backdrop-blur-sm shadow-elegant border border-primary/20">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-primary mb-2">
                    Requirements Reminder
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Valid ID for verification</li>
                    <li>• Proof of residency in barangay</li>
                    <li>• Payment of applicable fees</li>
                    <li>• Original copy for validation</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DocumentRequest;
