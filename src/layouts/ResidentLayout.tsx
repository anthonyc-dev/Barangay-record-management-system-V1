import { useState } from "react";
import { Navbar } from "@/pages/userSide/ui/Navbar";
import { Sidebar } from "@/pages/userSide/ui/SidebarMenu";
import { Outlet } from "react-router-dom";

const ResidentLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ease-in-out ${
          sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div
          className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ease-in-out ${
            sidebarOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={handleSidebarClose}
        />
        <div
          className={`relative transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar onClose={handleSidebarClose} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Navbar onMenuClick={handleMenuClick} />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ResidentLayout;
