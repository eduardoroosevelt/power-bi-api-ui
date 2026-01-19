import { useEffect, useMemo } from "react";
import { RouterProvider } from "react-router-dom";
import { createRouter } from "@/app/router";
import { useMenuStore } from "@/features/menu/menu.store";
import { useAuthStore } from "@/features/auth/auth.store";
import { Loading } from "@/shared/components/Loading";

export const AppRouter = () => {
  const token = useAuthStore((state) => state.token);
  const { menuTree, loading, loadMenu } = useMenuStore();

  useEffect(() => {
    if (token && menuTree.length === 0 && !loading) {
      loadMenu();
    }
  }, [token, menuTree.length, loading, loadMenu]);

  const router = useMemo(() => createRouter(token ? menuTree : []), [token, menuTree]);

  if (token && loading && menuTree.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loading label="Carregando permissões" />
      </div>
    );
  }

  return <RouterProvider router={router} />;
};
