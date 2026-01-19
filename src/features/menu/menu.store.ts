import { create } from "zustand";
import { MenuItemDto } from "@/shared/types/swagger";
import { menuService } from "@/features/menu/menu.service";

interface MenuState {
  menuTree: MenuItemDto[];
  loading: boolean;
  error: string | null;
  loadMenu: () => Promise<void>;
}

export const useMenuStore = create<MenuState>((set) => ({
  menuTree: [],
  loading: false,
  error: null,
  loadMenu: async () => {
    set({ loading: true, error: null });
    try {
      const menuTree = await menuService.getMenu();
      set({ menuTree, loading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao carregar menu";
      set({ loading: false, error: message });
    }
  }
}));
