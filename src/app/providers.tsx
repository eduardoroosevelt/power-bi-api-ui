"use client";

import { ReactNode } from "react";
import { Toaster } from "sonner";

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <>
      {children}
      <Toaster richColors position="top-right" />
    </>
  );
};
