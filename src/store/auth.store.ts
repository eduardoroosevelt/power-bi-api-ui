import { create } from "zustand";
import { LoginResponse } from "@/shared/types/swagger";

const TOKEN_KEY = "accessToken";

interface AuthState {
  token: string | null;
  login: (response: LoginResponse) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null,
  login: (response) => {
    const token = response.accessToken ?? null;
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    }
    set({ token });
  },
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    set({ token: null });
  },
  hydrate: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    set({ token });
  }
}));
