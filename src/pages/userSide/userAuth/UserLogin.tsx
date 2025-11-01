import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/services/api";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const UserLogin = () => {
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isAuthenticated, userType, login } = useAuth();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (isAuthenticated && userType === "user") {
      navigate("/resident", { replace: true });
    }
  }, [isAuthenticated, userType, navigate]);

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setLoginError(null);

    try {
      const result = await authService.userLogin({
        email: data.email,
        password: data.password,
      });

      console.log("Login successful:", result);
      toast.success("Login successful");
      login(result.user_info, "user");

      navigate("/resident", { replace: true });
    } catch (error: unknown) {
      console.error("Login error:", error);

      let errorMessage = "Login failed. Please try again.";

      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: Record<string, unknown> };
        };
        if (axiosError.response?.data) {
          const result = axiosError.response.data;
          if (result.message && typeof result.message === "string") {
            errorMessage = result.message;
          } else if (
            result.errors &&
            typeof result.errors === "object" &&
            result.errors !== null
          ) {
            // Handle validation errors
            const errors = result.errors as Record<string, string[]>;
            const errorKeys = Object.keys(errors);
            if (errorKeys.length > 0 && errors[errorKeys[0]][0]) {
              errorMessage = errors[errorKeys[0]][0];
            }
          } else if (result.error && typeof result.error === "string") {
            errorMessage = result.error;
          }
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      } else {
        errorMessage =
          "Unable to connect to server. Please check your internet connection.";
      }

      setLoginError(errorMessage);
      toast.error(errorMessage, {
        duration: 5000, // Show error for 5 seconds
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    navigate("/preRegister");
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
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
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative z-10 w-full max-w-md mx-auto p-8 rounded-2xl shadow-lg border-0 bg-white/95 backdrop-blur-sm">
        <h2 className="text-3xl font-bold text-center mb-2 ">Sign In</h2>
        <p className="text-center text-gray-500 mb-8">
          Welcome back! Please log in to your account.
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@email.com"
                      autoComplete="email"
                      {...field}
                      disabled={loading}
                    />
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
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    <Button
                      type="button"
                      variant="link"
                      className="p-0 h-auto text-blue-600 text-sm"
                      onClick={handleForgotPassword}
                      disabled={loading}
                      tabIndex={0}
                    >
                      Forgot password?
                    </Button>
                  </div>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                <div className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{loginError}</span>
                </div>
              </div>
            )}
            <Button
              type="submit"
              className="w-full  text-white font-semibold py-2 rounded-lg transition-colors"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
            <div className="flex justify-center mt-4">
              <span className="text-sm text-gray-600 mr-2">
                Don't have an account?
              </span>
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto text-blue-600"
                onClick={handleRegister}
                disabled={loading}
              >
                Register
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default UserLogin;
