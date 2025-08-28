import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/adminLayout";
import HomePage from "@/pages/adminPage/Home.admin";
import Residents from "@/pages/adminPage/Resident.admin";
import Documents from "@/pages/adminPage/Documents.admin";
import ResidentLayout from "@/layouts/ResidentLayout";
import Signin from "@/pages/general/auth/signin";
import Signup from "@/pages/general/auth/signup";
import AddResident from "@/pages/adminPage/functions/AddResident";
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

export default function AppRoutes() {
  return (
    <Routes>
      {/* admin side */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<HomePage />} />
        <Route path="residents" element={<Residents />} />
        <Route path="addResident" element={<AddResident />} />
        <Route path="documents" element={<Documents />} />
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
      </Route>
      {/* user side */}
      <Route path="/resident" element={<ResidentLayout />}>
        <Route index element={<Home />} />
        <Route path="announcement" element={<Announcement />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* general */}
      <Route path="/" element={<UserLogin />} />
      <Route path="preRegister" element={<PreRegister />} />
      <Route path="complaint" element={<ComplaintForm />} />
      <Route path="documentReq" element={<DocumentRequest />} />
      <Route path="signin" element={<Signin />} />
      <Route path="signup" element={<Signup />} />
    </Routes>
  );
}
