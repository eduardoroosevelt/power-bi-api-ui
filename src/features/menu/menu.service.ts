import { getMenuAction } from "@/app/actions/menu";
import { withAuthHandling } from "@/shared/api/client";

export const menuService = {
  async getMenu() {
    return withAuthHandling(() => getMenuAction());
  }
};
