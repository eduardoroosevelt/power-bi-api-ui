"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useMenuStore } from "@/features/menu/menu.store";
import { MenuTree } from "@/features/menu/MenuTree";
import { Loading } from "@/shared/components/Loading";
import { ErrorState } from "@/shared/components/ErrorState";

export const Sidebar = () => {
  const { menuTree, loading, error, loadMenu } = useMenuStore();

  useEffect(() => {
    loadMenu();
  }, [loadMenu]);

  return (
    <aside className="hidden w-72 flex-col border-r bg-background p-4 lg:flex">
      <div className="mb-6">
        <Link href="/" className="text-lg font-semibold">
          Portal Power BI
        </Link>
        <p className="text-xs text-muted-foreground">Menu dinâmico por perfil</p>
      </div>
      <div className="flex-1 space-y-3">
        {loading ? <Loading label="Carregando menu" /> : null}
        {error ? <ErrorState description={error} /> : null}
        {!loading && !error ? <MenuTree items={menuTree} /> : null}
      </div>
    </aside>
  );
};
