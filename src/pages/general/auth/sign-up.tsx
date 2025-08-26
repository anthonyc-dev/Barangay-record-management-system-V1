import { useSignUp } from "@clerk/clerk-react";
import { useState } from "react";

export default function CustomSignUp() {
  const { isLoaded, signUp } = useSignUp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [number, setNumber] = useState("");
  const [gender, setGender] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isLoaded) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    try {
      await signUp.create({
        emailAddress: email,
        password,
        phoneNumber: number,
        unsafeMetadata: { gender },
      });
      await signUp.prepareEmailAddressVerification();
      setSuccess(true);
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Sign up failed");
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: window.location.origin + "/signup",
        redirectUrlComplete: window.location.origin + "/",
      });
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Google sign up failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-900">
          Create your account
        </h2>
        <button
          type="button"
          onClick={handleGoogleSignUp}
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-md py-2 mb-4 hover:bg-gray-50 transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          <span className="font-medium text-gray-700">Sign up with Google</span>
        </button>
        <div className="flex items-center my-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="mx-2 text-gray-400 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              required
              placeholder="e.g. +639123456789"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              required
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="" disabled>
                Select gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </div>
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          {success && (
            <div className="text-green-600 text-sm text-center">
              Sign up successful! Please check your email for verification.
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-900 text-white font-semibold py-2 rounded-md hover:bg-blue-800 transition"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
