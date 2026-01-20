import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ExternalLink, FileText } from "lucide-react";
import { MenuItemDto } from "@/shared/types/swagger";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/shared/components/ui/collapsible";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { cn } from "@/shared/utils/cn";

interface MenuTreeProps {
  items: MenuItemDto[];
  depth?: number;
}

const getMenuRoute = (item: MenuItemDto) => {
  if (item.route) return item.route;
  if (item.resourceType === "POWERBI_REPORT" && item.resourceId) {
    return `/reports/${item.resourceId}`;
  }
  return "#";
};

export const MenuTree = ({ items, depth = 0 }: MenuTreeProps) => {
  const MenuList = depth === 0 ? SidebarMenu : SidebarMenuSub;
  return (
    <MenuList>
      {items.map((item) => (
        <MenuTreeItem key={item.id ?? `${item.label}-${depth}`} item={item} depth={depth} />
      ))}
    </MenuList>
  );
};

const MenuTreeItem = ({ item, depth }: { item: MenuItemDto; depth: number }) => {
  const hasChildren = Boolean(item.children && item.children.length > 0);
  const [open, setOpen] = useState(depth < 1);
  const route = getMenuRoute(item);
  const isSub = depth > 0;
  const MenuItem = isSub ? SidebarMenuSubItem : SidebarMenuItem;
  const MenuButton = isSub ? SidebarMenuSubButton : SidebarMenuButton;

  if (hasChildren) {
    return (
      <MenuItem>
        <Collapsible open={open} onOpenChange={setOpen}>
          <CollapsibleTrigger asChild>
            <MenuButton className="justify-between">
              <span className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                {item.label ?? "Menu"}
              </span>
              <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
            </MenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-1 space-y-1">
            {item.children ? <MenuTree items={item.children} depth={depth + 1} /> : null}
          </CollapsibleContent>
        </Collapsible>
      </MenuItem>
    );
  }

  if (item.resourceType === "EXTERNAL_LINK" && item.route) {
    return (
      <MenuItem>
        <MenuButton asChild>
          <a href={item.route} target="_blank" rel="noreferrer">
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
            {item.label}
          </a>
        </MenuButton>
      </MenuItem>
    );
  }

  return (
    <MenuItem>
      <MenuButton asChild>
        <Link to={route}>
          <FileText className="h-4 w-4 text-muted-foreground" />
          {item.label}
        </Link>
      </MenuButton>
    </MenuItem>
  );
};
