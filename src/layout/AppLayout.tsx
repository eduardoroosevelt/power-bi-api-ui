"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/layout/Sidebar";
import { Topbar } from "@/layout/Topbar";
import { setUnauthorizedHandler } from "@/shared/api/axios";

export const AppLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  useEffect(() => {
    setUnauthorizedHandler(() => router.replace("/login"));
  }, [router]);

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};
