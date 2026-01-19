"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ExternalLink, FileText } from "lucide-react";
import { MenuItemDto } from "@/shared/types/swagger";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/shared/components/ui/collapsible";
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
  return (
    <ul className={cn("space-y-1", depth > 0 && "pl-3")}>
      {items.map((item) => (
        <MenuTreeItem key={item.id ?? `${item.label}-${depth}`} item={item} depth={depth} />
      ))}
    </ul>
  );
};

const MenuTreeItem = ({ item, depth }: { item: MenuItemDto; depth: number }) => {
  const hasChildren = Boolean(item.children && item.children.length > 0);
  const [open, setOpen] = useState(depth < 1);
  const route = getMenuRoute(item);

  if (hasChildren) {
    return (
      <li>
        <Collapsible open={open} onOpenChange={setOpen}>
          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm font-medium hover:bg-accent">
            <span className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              {item.label ?? "Menu"}
            </span>
            <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-1">
            {item.children ? <MenuTree items={item.children} depth={depth + 1} /> : null}
          </CollapsibleContent>
        </Collapsible>
      </li>
    );
  }

  if (item.resourceType === "EXTERNAL_LINK" && item.route) {
    return (
      <li>
        <a
          href={item.route}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent"
        >
          <ExternalLink className="h-4 w-4 text-muted-foreground" />
          {item.label}
        </a>
      </li>
    );
  }

  return (
    <li>
      <Link href={route} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent">
        <FileText className="h-4 w-4 text-muted-foreground" />
        {item.label}
      </Link>
    </li>
  );
};
