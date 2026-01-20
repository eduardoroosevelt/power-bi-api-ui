import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Sidebar } from "@/app/layout/Sidebar";
import { Topbar } from "@/app/layout/Topbar";
import { setUnauthorizedHandler } from "@/shared/api/axios";

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
  }, [isReportRoute]);

  const showSidebar = !isReportRoute && isSidebarOpen;

  return (
    <div className="flex min-h-screen bg-muted/40">
      {showSidebar ? <Sidebar /> : null}
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          sidebarToggleDisabled={isReportRoute}
        />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
