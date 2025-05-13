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
        { title: "Agregar productos", url: "/productos/agregar" },
        { title: "Lista de productos", url: "/productos/lista" },
        { title: "Lista de categorías", url: "/productos/categorias" },
      ],
    },
    {
      title: "POS",
      url: "#",
      icon: SquareTerminal,
      items: [
        { title: "Nueva venta", url: "/pos/nueva-venta" },
        { title: "Historial", url: "/pos/historial" },
      ],
    },
    {
      title: "Reportes",
      url: "/reportes",
      icon: BookOpen,
      items: [
        { title: "Generar reporte", url: "/reportes/generar" },
        { title: "Últimos reportes", url: "/reportes/ultimos" },
      ],
    },
    {
      title: "Finanzas",
      url: "#",
      icon: AudioWaveform,
      items: [
        { title: "Nueva caja", url: "/finanzas/nueva-caja" },
        { title: "Caja chica", url: "/finanzas/caja-chica" },
        { title: "Flujo", url: "/finanzas/flujo" },
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
