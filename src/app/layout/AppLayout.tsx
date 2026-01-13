import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar } from "@/app/layout/Sidebar";
import { Topbar } from "@/app/layout/Topbar";
import { setUnauthorizedHandler } from "@/shared/api/axios";

export const AppLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setUnauthorizedHandler(() => navigate("/login", { replace: true }));
  }, [navigate]);

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
