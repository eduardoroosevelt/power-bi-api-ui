"use client";

import { ReactNode } from "react";
import { Sidebar } from "@/layout/Sidebar";
import { Topbar } from "@/layout/Topbar";

export const AppLayout = ({ children }: { children: ReactNode }) => {
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
