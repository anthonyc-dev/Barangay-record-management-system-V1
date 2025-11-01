import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routers";
import { AuthProvider } from "@/contexts/AuthContext";
import { UserProfileProvider } from "@/contexts/UserProfileContext";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <Router>
      <AuthProvider>
        <UserProfileProvider>
          <AppRoutes />
          <Toaster />
        </UserProfileProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
