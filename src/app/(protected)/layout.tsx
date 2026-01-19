"use client";

import { ReactNode } from "react";
import { ProtectedLayout } from "@/layout/ProtectedLayout";

export default function ProtectedRoutesLayout({ children }: { children: ReactNode }) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
