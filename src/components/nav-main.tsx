"use client"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
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
import Link from "next/link"

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
  const pathname = usePathname()

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

  // Asegurarse de que el submenú se abra cuando se hace clic en el título
  const handleSubmenuClick = (title: string, event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    toggleSubmenu(title)
  }

  const handleItemClick = (itemTitle: string) => {
    // No longer needed as isActive is determined by pathname
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Módulos</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isCollapsibleGroup = ["POS", "Finanzas", "Productos", "Reportes", "Caja"].includes(item.title)
            const hasSubItems = item.items && item.items.length > 0
            const isSubmenuOpen = openSubmenus[item.title] || false

            const isActive = pathname === item.url

            if (hasSubItems) {
              return (
                <Collapsible
                  key={item.title}
                  open={isSubmenuOpen && state !== "collapsed"}
                  onOpenChange={(open) => {
                    setOpenSubmenus((prev) => ({
                      ...prev,
                      [item.title]: open,
                    }))
                  }}
                  className="w-full"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger
                      className={`flex w-full items-center justify-between rounded-md p-2 hover:bg-sidebar-accent ${isCollapsibleGroup ? "group/collapsible" : ""} ${isActive ? "bg-sidebar-selected" : ""}`}
                      onClick={(e) => handleSubmenuClick(item.title, e)}
                    >
                      <div className="flex items-center gap-2">
                        {item.icon && <item.icon className="h-4 w-4" />}
                        <span className="text-lg font-medium ml-1 group-data-[collapsible=icon]:hidden">
                          {item.title}
                        </span>
                      </div>
                      {isCollapsibleGroup ? (
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
                          <Link
                            href={subItem.url}
                            className={`flex w-full items-center gap-2 font-medium rounded-md p-2 text-sm hover:bg-sidebar-accent ${pathname === subItem.url ? "bg-sidebar-selected" : ""}`}
                          >
                            <span>{subItem.title}</span>
                          </Link>
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
                <SidebarMenuButton asChild>
                  <Link
                    href={item.url}
                    className={`flex items-center gap-2 ${isActive ? "bg-sidebar-selected" : ""}`}
                  >
                    {item.icon && <item.icon className="h-5 w-5" />}
                    <span className="text-lg font-medium ml-1">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
