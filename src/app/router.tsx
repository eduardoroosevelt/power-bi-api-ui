import { createBrowserRouter } from "react-router-dom";
import { createRoutes } from "@/app/routes";
import { MenuItemDto } from "@/shared/types/swagger";

export const createRouter = (menuTree: MenuItemDto[] = []) => {
  return createBrowserRouter(createRoutes(menuTree));
};
