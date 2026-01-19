"use server";

import { apiRequest } from "@/app/actions/api";
import { MenuItemDto } from "@/shared/types/swagger";

export const getMenuAction = async () => {
  return apiRequest<MenuItemDto[]>("/api/me/menu");
};
