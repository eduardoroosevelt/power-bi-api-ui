import { apiClient } from "@/shared/api/axios";
import { MenuItemDto } from "@/shared/types/swagger";

export const menuService = {
  async getMenu() {
    const { data } = await apiClient.get<MenuItemDto[]>("/api/me/menu");
    return data;
  }
};
