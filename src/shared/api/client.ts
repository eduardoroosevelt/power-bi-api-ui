"use client";

import { useAuthStore } from "@/features/auth/auth.store";

export const withAuthHandling = async <T>(action: () => Promise<T>): Promise<T> => {
  try {
    return await action();
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      useAuthStore.getState().logout();
    }
    throw error;
  }
};
