import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { CheckCircle2, ArrowLeft } from "lucide-react";
// import { toast } from "sonner";
// import { z } from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   Form,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormControl,
//   FormMessage,
// } from "@/components/ui/form";

// const resendEmailSchema = z.object({
//   email: z.string().email("Invalid email address"),
// });

// type ResendEmailFormData = z.infer<typeof resendEmailSchema>;

const RegisterConfirm = () => {
  const navigate = useNavigate();
  // const [isResending, setIsResending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // const form = useForm<ResendEmailFormData>({
  //   resolver: zodResolver(resendEmailSchema),
  //   defaultValues: {
  //     email: "",
  //   },
  // });

  // const handleResendEmail = async (data: ResendEmailFormData) => {
  //   setIsResending(true);

  //   try {
  //     const response = await fetch("http://localhost:8000/api/email/resend", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Accept: "application/json",
  //       },
  //       body: JSON.stringify({ email: data.email }),
  //     });

  //     const result = await response.json();

  //     if (response.ok) {
  //       setEmailSent(true);
  //       toast.success(
  //         "Verification email sent successfully! Please check your inbox."
  //       );
  //     } else {
  //       // Handle different error cases
  //       if (response.status === 400) {
  //         toast.error(result.message || "Email already verified");
  //       } else if (response.status === 404) {
  //         toast.error("No account found with this email address");
  //       } else {
  //         toast.error(result.message || "Failed to send verification email");
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Resend email error:", error);
  //     toast.error("Failed to send verification email. Please try again.");
  //   } finally {
  //     setIsResending(false);
  //   }
  // };

  const handleBackToLogin = () => {
    navigate("/");
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
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 w-full max-w-md">
        <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
          <CardContent className="p-8">
            {!emailSent ? (
              <>
                {/* <div className="text-center space-y-6 mb-8">
                  <div className="flex justify-center">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                      <Mail className="w-10 h-10 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-800 mb-2">
                      Registration Successful!
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Thank you for registering! We've sent a verification email
                      to your inbox. Please check your email and click the
                      verification link to activate your account.
                    </CardDescription>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">
                      What's Next?
                    </h4>
                    <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
                      <li>Check your email inbox (and spam folder)</li>
                      <li>Click the verification link in the email</li>
                      <li>
                        Once verified, your account will be pending admin
                        approval
                      </li>
                      <li>You'll be able to log in after admin approval</li>
                    </ol>
                  </div>

                  <div className="border-t pt-6">
                    <p className="text-sm text-gray-600 mb-4 text-center">
                      Didn't receive the email? Enter your email below to
                      resend:
                    </p>
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(handleResendEmail)}
                        className="space-y-4"
                      >
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">
                                Email Address
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="your.email@example.com"
                                  {...field}
                                  className="h-11 border-2 focus:border-blue-500"
                                  disabled={isResending}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="submit"
                          disabled={isResending}
                          className="w-full h-11"
                        >
                          {isResending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Mail className="mr-2 h-4 w-4" />
                              Resend Verification Email
                            </>
                          )}
                        </Button>
                      </form>
                    </Form>
                  </div>

                  <Button
                    onClick={handleBackToLogin}
                    variant="outline"
                    className="w-full h-11"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Login
                  </Button>
                </div> */}
                <div className="text-center space-y-6">
                  <div className="flex justify-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-800 mb-2">
                      Email Sent!
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      We've sent a new verification email to your inbox. Please
                      check your email and click the verification link.
                    </CardDescription>
                  </div>
                  <div className="space-y-3">
                    {/* <Button
                    onClick={() => setEmailSent(false)}
                    variant="outline"
                    className="w-full h-11"
                  >
                    Send to Different Email
                  </Button> */}
                    <Button onClick={handleBackToLogin} className="w-full h-11">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Login
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-800 mb-2">
                    Email Sent!
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    We've sent a new verification email to your inbox. Please
                    check your email and click the verification link.
                  </CardDescription>
                </div>
                <div className="space-y-3">
                  <Button
                    onClick={() => setEmailSent(false)}
                    variant="outline"
                    className="w-full h-11"
                  >
                    Send to Different Email
                  </Button>
                  <Button onClick={handleBackToLogin} className="w-full h-11">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Login
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterConfirm;
