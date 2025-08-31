import { Header } from "@/components/adminComponents/Navbar";
import { Sidebar } from "@/components/adminComponents/SidebarMenu";
import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

const SidebarLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${location.pathname === "/admin" ? "hidden" : "lg:block"}`}
      >
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`
          fixed inset-0 z-50 lg:hidden transition-opacity duration-300
          ${
            sidebarOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }
        `}
        aria-hidden={!sidebarOpen}
      >
        <div
          className="absolute inset-0 bg-background/80 transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
        <div
          className={`
            transition-transform duration-300 h-full
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            relative z-50
          `}
          style={{ width: "16rem", maxWidth: "100vw" }}
        >
          <Sidebar className="h-full" onClose={() => setSidebarOpen(false)} />
        </div>
      </div>

      <main className="flex-1 overflow-y-auto">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          className={`${location.pathname === "/admin" ? "hidden" : ""}`}
        />
        <div className={`${location.pathname === "/admin" ? "p-0" : "p-6"}`}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default SidebarLayout;
