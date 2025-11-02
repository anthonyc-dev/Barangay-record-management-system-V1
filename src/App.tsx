import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routers";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AdminProvider, useAdmin } from "@/contexts/AdminContext";
import { UserProfileProvider } from "@/contexts/UserProfileContext";
import { Toaster } from "@/components/ui/sonner";

function AppContent() {
  const { logoutLoading } = useAuth();
  const { isLoading } = useAdmin();

  return (
    <>
      {(logoutLoading || isLoading) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="text-center flex flex-col items-center">
            {/* Logo at the top */}
            <img
              src="/image/2s.png"
              alt="Barangay RMS Logo"
              className="h-18 w-18 mb-4 rounded-full shadow-lg bg-white object-cover"
              style={{ background: "white" }}
            />
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-sm text-muted-foreground">
              {logoutLoading ? "Logging out..." : "Loading..."}
            </p>
          </div>
        </div>
      )}
      <AppRoutes />
      <Toaster />
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AdminProvider>
          <UserProfileProvider>
            <AppContent />
          </UserProfileProvider>
        </AdminProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
