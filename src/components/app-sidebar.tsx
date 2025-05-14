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
  Banknote,
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
      url: "/dashboard",
      icon: PieChart,
      isActive: true,
      items: [],
    },
    {
      title: "Productos",
      url: "/productos",
      icon: Frame,
      items: [
        {
          title: "Agregar producto",
          url: "/productos/agregar",
        },
        {
          title: "Lista de productos",
          url: "/productos/lista",
        },
        {
          title: "Categorías de productos",
          url: "/productos/categorias",
        },
      ],
    },
    {
      title: "POS",
      url: "#",
      icon: SquareTerminal,
      items: [
        {
          title: "Nueva venta",
          url: "/pos/nueva-venta",
        },
        {
          title: "Historial de ventas",
          url: "/pos/historial",
        },
        {
          title: "Devoluciones",
          url: "/pos/devoluciones",
        },
      ],
    },
    {
      title: "Reportes",
      url: "/reportes",
      icon: PieChart,
      isActive: true,
      items: [],
    },
    {
      title: "Caja",
      url: "#",
      icon: AudioWaveform,
      items: [
        {
          title: "Apertura de caja",
          url: "/caja/apertura",
        },
        {
          title: "Cierre de caja",
          url: "/caja/cierre-caja",
        },
        {
          title: "Movimientos",
          url: "/caja/movimientos",
        },
      ],
    },
    {
      title: "Ajustes",
      url: "/ajustes",
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
