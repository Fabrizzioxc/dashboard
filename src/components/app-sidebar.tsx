"use client"

import type * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import { TeamSwitcher } from "./team-switcher"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "Admin",
    email: "admin@example.com",
    avatar: "/avatars/admin.jpg",
  },
  teams: [
    {
      name: "Mi Empresa",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: PieChart,
      isActive: true,
      items: [],
    },
    {
      title: "Productos",
      url: "#",
      icon: Frame,
      items: [],
    },
    {
      title: "POS",
      url: "#",
      icon: SquareTerminal,
      items: [
        {
          title: "Nueva venta",
          url: "#",
        },
        {
          title: "Historial",
          url: "#",
        },
      ],
    },
    {
      title: "Ventas",
      url: "#",
      icon: Map,
      items: [],
    },
    {
      title: "Reportes",
      url: "#",
      icon: BookOpen,
      items: [],
    },
    {
      title: "Finanzas",
      url: "#",
      icon: AudioWaveform,
      items: [
        {
          title: "Nueva caja",
          url: "#",
        },
        {
          title: "Caja chica",
          url: "#",
        },
        {
          title: "Flujo",
          url: "#",
        },
      ],
    },
    {
      title: "Ajustes",
      url: "#",
      icon: Settings2,
      items: [],
    },
  ],
  projects: [],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
