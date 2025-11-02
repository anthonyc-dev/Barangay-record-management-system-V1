import { Header } from "@/components/adminComponents/Navbar";
import { Sidebar } from "@/components/adminComponents/SidebarMenu";
import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

const SidebarLayout: React.FC = () => {
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        {location.pathname !== "/admin" && <Sidebar />}
        <SidebarInset>
          {location.pathname !== "/admin" && <Header />}
          <main className="flex-1 p-6 overflow-y-auto bg-gray-100">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default SidebarLayout;
