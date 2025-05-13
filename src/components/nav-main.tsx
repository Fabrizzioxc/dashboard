"use client"
import { useState, useEffect } from "react"
import { ChevronDown, ChevronRight, type LucideIcon } from "lucide-react"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"



export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const { state } = useSidebar()
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (state === "collapsed") {
      setOpenSubmenus({})
    }
  }, [state])

  const toggleSubmenu = (title: string) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Módulos</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isPosOrFinanzas = item.title === "POS" || item.title === "Finanzas"
            const hasSubItems = item.items && item.items.length > 0
            const isSubmenuOpen = openSubmenus[item.title] || false

            if (hasSubItems) {
              return (
                <Collapsible
                  key={item.title}
                  open={isSubmenuOpen && state !== "collapsed"}
                  onOpenChange={() => toggleSubmenu(item.title)}
                  className="w-full"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger
                      className={`flex w-full items-center justify-between rounded-md p-2 hover:bg-sidebar-accent ${isPosOrFinanzas ? "group/collapsible" : ""}`}
                    >
                      <div className="flex items-center gap-2">
                        {item.icon && <item.icon className="h-4 w-4" />}
                        <span className="text-lg font-medium ml-1 group-data-[collapsible=icon]:hidden">
                          {item.title}
                        </span>
                      </div>
                      {isPosOrFinanzas ? (
                        <ChevronRight className="h-4 w-4 ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      ) : (
                        <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                      )}
                    </CollapsibleTrigger>
                  </SidebarMenuItem>
                  <CollapsibleContent className="group-data-[collapsible=icon]:hidden">
                    <div className="ml-4 pl-2 border-l border-sidebar-border">
                      {(item.items ?? []).map((subItem) => (
                        <SidebarMenuItem key={subItem.title}>
                          <a
                            href={subItem.url}
                            className="flex w-full items-center gap-2 font-medium rounded-md p-2 text-sm hover:bg-sidebar-accent"
                          >
                            <span>{subItem.title}</span>
                          </a>
                        </SidebarMenuItem>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )
            }

            // Ítems simples sin submenús
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title}>
                  <a href={item.url} className="flex items-center gap-2">
                    {item.icon && <item.icon className="h-5 w-5" />}
                    <span className="text-lg font-medium ml-1 group-data-[collapsible=icon]:hidden">
                      {item.title}
                    </span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
