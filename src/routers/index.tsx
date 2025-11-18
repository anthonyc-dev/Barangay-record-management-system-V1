import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/adminLayout";
import Residents from "@/pages/adminPage/Resident.admin";
import Documents from "@/pages/adminPage/Documents.admin";
import ResidentLayout from "@/layouts/ResidentLayout";
import Signin from "@/pages/general/auth/signin";
import Signup from "@/pages/general/auth/signup";
import AddResident from "@/pages/adminPage/functions/AddResident";
import EditResident from "@/pages/adminPage/functions/EditResident";
import ComplaintForm from "@/pages/userPage/section/ComplaintForm";
import DocumentRequest from "@/pages/userPage/section/DocumentRequest";
import PreRegister from "@/pages/userSide/userAuth/PreRegister";
import UserLogin from "@/pages/userSide/userAuth/UserLogin";
import Home from "@/pages/userSide/Home";
import Announcement from "@/pages/userSide/pages/Announcement";
import Settings from "@/pages/userSide/pages/Settings";
import { PopulationAnalytics } from "@/components/analytics/PopulationAnalytics";
import { IncidentAnalytics } from "@/components/analytics/IncidentAnalytics";
import { FinancialAnalytics } from "@/components/analytics/FinancialAnalytics";
import { GeographicalAnalytics } from "@/components/analytics/GeographicalAnalytics";
import { OverviewSection } from "@/components/analytics/OverviewSection";
import { DocumentAnalytics } from "@/components/analytics/DocumentAnalytics";
import FolderStorage from "@/pages/adminPage/Folder-storage.admin";
import AnnouncementAdmin from "@/pages/adminPage/Announcement.admin";
import SettingsAdmin from "@/pages/adminPage/Settings.admin";
import DocumentsUser from "@/pages/userSide/pages/Documents";
import Complainant from "@/pages/userSide/pages/Complainant";
import LoginAdmin from "@/pages/adminPage/auth.admin/Login";
import HomeAdmin from "@/pages/adminPage/Home.admin";
import ProtectedRoute from "@/components/ProtectedRoute";
import Officials from "@/pages/adminPage/Official.admint";
import AddOfficial from "@/pages/adminPage/functions/AddOfficial";
import EditOfficial from "@/pages/adminPage/functions/EditOfficial";
import ComplainantAdmin from "@/pages/adminPage/Complainant.admin";
import Report from "@/pages/adminPage/Report";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public login routes - accessible without authentication */}
      <Route path="/admin/login" element={<LoginAdmin />} />
      <Route path="/resident/login" element={<UserLogin />} />

      {/* admin side - Protected routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredType="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<HomeAdmin />} />
        <Route path="home" element={<HomeAdmin />} />
        <Route path="residents" element={<Residents />} />
        <Route path="addResident" element={<AddResident />} />
        <Route path="editResident/:id" element={<EditResident />} />
        <Route path="documents" element={<Documents />} />
        <Route path="officials" element={<Officials />} />
        <Route path="addOfficial" element={<AddOfficial />} />
        <Route path="editOfficial/:id" element={<EditOfficial />} />
        <Route path="complainantAdmin" element={<ComplainantAdmin />} />
        <Route path="report" element={<Report />} />
        {/* analytics */}
        <Route path="analytics" element={<OverviewSection />} />
        <Route path="analytics/population" element={<PopulationAnalytics />} />
        <Route path="analytics/documents" element={<DocumentAnalytics />} />
        <Route path="analytics/incidents" element={<IncidentAnalytics />} />
        <Route path="analytics/financial" element={<FinancialAnalytics />} />
        <Route
          path="analytics/geographical"
          element={<GeographicalAnalytics />}
        />
        <Route path="announcement" element={<AnnouncementAdmin />} />
        <Route path="folder-storage" element={<FolderStorage />} />
        <Route path="settings" element={<SettingsAdmin />} />
      </Route>

      {/* user side - Protected routes for authenticated users */}
      <Route
        path="/resident"
        element={
          <ProtectedRoute requiredType="user">
            <ResidentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="documents" element={<DocumentsUser />} />
        <Route path="complainant" element={<Complainant />} />
        <Route path="announcement" element={<Announcement />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* general public routes */}
      <Route path="/" element={<UserLogin />} />
      <Route path="preRegister" element={<PreRegister />} />
      <Route path="complaint" element={<ComplaintForm />} />
      <Route path="documentReq" element={<DocumentRequest />} />
      <Route path="signin" element={<Signin />} />
      <Route path="signup" element={<Signup />} />
    </Routes>
  );
}
