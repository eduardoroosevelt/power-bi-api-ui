import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useMenuStore } from "@/features/menu/menu.store";
import { MenuTree } from "@/features/menu/MenuTree";
import { Loading } from "@/shared/components/Loading";
import { ErrorState } from "@/shared/components/ErrorState";
import {
  Sidebar as SidebarRoot,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

export const Sidebar = () => {
  const { menuTree, loading, error, loadMenu } = useMenuStore();

  useEffect(() => {
    loadMenu();
  }, [loadMenu]);

  return (
    <SidebarRoot className="sidebar-gradient text-white">
      <SidebarHeader>
        <NavLink to="/" className="text-lg font-semibold text-white">
          Portal Power BI
        </NavLink>
        <p className="text-xs text-white/70">Menu dinâmico por perfil</p>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          {loading ? <Loading label="Carregando menu" /> : null}
          {error ? <ErrorState description={error} /> : null}
          {!loading && !error ? <MenuTree items={menuTree} /> : null}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
      <SidebarRail />
    </SidebarRoot>
  );
};
