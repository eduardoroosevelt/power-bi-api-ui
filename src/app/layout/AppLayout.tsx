import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Sidebar } from "@/app/layout/Sidebar";
import { Topbar } from "@/app/layout/Topbar";
import { setUnauthorizedHandler } from "@/shared/api/axios";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isReportRoute = location.pathname.startsWith("/reports/");

  useEffect(() => {
    setUnauthorizedHandler(() => navigate("/login", { replace: true }));
  }, [navigate]);

  useEffect(() => {
    if (isReportRoute) {
      setIsSidebarOpen(false);
    }
  }, [isReportRoute, location.pathname]);

  return (
    <SidebarProvider open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
      <div className="flex flex-1 min-h-screen bg-muted/40">
        <Sidebar />
        <SidebarInset >
          <Topbar />
          <main className=" flex-1 p-6">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
