import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2, Mail } from "lucide-react";
import { toast } from "sonner";

const EmailVerification = () => {
  const { id, hash } = useParams<{ id: string; hash: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState<
    "verifying" | "success" | "error" | "expired"
  >("verifying");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!id || !hash) {
        setVerificationStatus("error");
        setErrorMessage("Invalid verification link");
        return;
      }

      try {
        // Get query parameters for signature and expires
        const expires = searchParams.get("expires");
        const signature = searchParams.get("signature");

        if (!expires || !signature) {
          setVerificationStatus("error");
          setErrorMessage("Invalid verification link - missing parameters");
          return;
        }

        // Construct the verification URL with query parameters
        const verificationUrl = `http://localhost:8000/api/email/verify/${id}/${hash}?expires=${expires}&signature=${signature}`;

        const response = await fetch(verificationUrl, {
          method: "GET",
          headers: {
            "Accept": "application/json",
          },
        });

        const data = await response.json();

        if (response.ok) {
          setVerificationStatus("success");
          toast.success("Email verified successfully! You can now log in.");

          // Redirect to login page after 3 seconds
          setTimeout(() => {
            navigate("/");
          }, 3000);
        } else {
          // Handle different error cases
          if (response.status === 403) {
            setVerificationStatus("error");
            setErrorMessage("Email already verified");
          } else if (response.status === 401 || data.message?.includes("expired")) {
            setVerificationStatus("expired");
            setErrorMessage("Verification link has expired");
          } else {
            setVerificationStatus("error");
            setErrorMessage(data.message || "Verification failed");
          }
        }
      } catch (error) {
        console.error("Verification error:", error);
        setVerificationStatus("error");
        setErrorMessage("Failed to verify email. Please try again.");
      }
    };

    verifyEmail();
  }, [id, hash, searchParams, navigate]);

  const handleGoToLogin = () => {
    navigate("/");
  };

  const handleResendVerification = () => {
    navigate("/registerConfirm");
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
            <div className="text-center space-y-6">
              {verificationStatus === "verifying" && (
                <>
                  <div className="flex justify-center">
                    <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-800">
                    Verifying Your Email
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Please wait while we verify your email address...
                  </CardDescription>
                </>
              )}

              {verificationStatus === "success" && (
                <>
                  <div className="flex justify-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-12 h-12 text-green-600" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-800">
                    Email Verified Successfully!
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Your email has been verified. You can now log in to your account.
                  </CardDescription>
                  <Button
                    onClick={handleGoToLogin}
                    className="w-full h-11 bg-green-600 hover:bg-green-700"
                  >
                    Go to Login
                  </Button>
                </>
              )}

              {verificationStatus === "error" && (
                <>
                  <div className="flex justify-center">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                      <XCircle className="w-12 h-12 text-red-600" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-800">
                    Verification Failed
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {errorMessage || "We couldn't verify your email address."}
                  </CardDescription>
                  <div className="space-y-3">
                    <Button
                      onClick={handleResendVerification}
                      className="w-full h-11"
                      variant="outline"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Resend Verification Email
                    </Button>
                    <Button
                      onClick={handleGoToLogin}
                      className="w-full h-11"
                      variant="secondary"
                    >
                      Back to Login
                    </Button>
                  </div>
                </>
              )}

              {verificationStatus === "expired" && (
                <>
                  <div className="flex justify-center">
                    <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
                      <XCircle className="w-12 h-12 text-orange-600" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-800">
                    Link Expired
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    This verification link has expired. Please request a new verification email.
                  </CardDescription>
                  <div className="space-y-3">
                    <Button
                      onClick={handleResendVerification}
                      className="w-full h-11"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Resend Verification Email
                    </Button>
                    <Button
                      onClick={handleGoToLogin}
                      className="w-full h-11"
                      variant="outline"
                    >
                      Back to Login
                    </Button>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmailVerification;
