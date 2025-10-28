import { useState } from "react";
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

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const UserLogin = () => {
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const navigate = useNavigate();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setLoginError(null);

    try {
      const requestData = {
        email: data.email,
        password: data.password,
      };

      console.log("Sending login request:", requestData);

      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();
      console.log("Server response:", result);

      if (response.ok) {
        // Store authentication data if provided
        if (result.token) {
          localStorage.setItem("auth_token", result.token);
        }
        if (result.user) {
          localStorage.setItem("user_info", JSON.stringify(result.user));
        }

        // Navigate to resident dashboard
        navigate("/resident");
      } else {
        // Handle error response with more detailed information
        let errorMessage = "Login failed. Please try again.";

        if (result.message) {
          errorMessage = result.message;
        } else if (result.errors) {
          // Handle validation errors
          const errorKeys = Object.keys(result.errors);
          if (errorKeys.length > 0) {
            errorMessage = result.errors[errorKeys[0]][0] || errorMessage;
          }
        } else if (result.error) {
          errorMessage = result.error;
        }

        setLoginError(errorMessage);
      }
    } catch (error: unknown) {
      console.error("Login error:", error);

      // Handle network errors
      setLoginError(
        "Unable to connect to server. Please check your internet connection."
      );
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
          backgroundImage:
            "url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80')",
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
              <div className="text-red-600 text-sm text-center">
                {loginError}
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
