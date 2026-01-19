"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { useAuthStore } from "@/features/auth/auth.store";

const THEME_KEY = "theme";

export const Topbar = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem(THEME_KEY) as "light" | "dark" | null;
    if (stored) {
      setTheme(stored);
      document.documentElement.classList.toggle("dark", stored === "dark");
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem(THEME_KEY, next);
  };

  return (
    <header className="flex items-center justify-between border-b bg-background px-6 py-3">
      <div>
        <p className="text-lg font-semibold">Power BI Admin</p>
        <p className="text-sm text-muted-foreground">
          Controle central de relatórios e políticas
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" onClick={toggleTheme}>
          {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </Button>
        <Button
          variant="destructive"
          onClick={() => {
            logout();
            router.replace("/login");
          }}
        >
          Sair
        </Button>
      </div>
    </header>
  );
};
