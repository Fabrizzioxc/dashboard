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
  Building2,
} from "lucide-react"

import { ModeToggle } from "@/components/mode-toggle"

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
      plan: "asd",
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
          url: "/productos/nuevo",
        },
        {
          title: "Lista de productos",
          url: "/productos",
        },
        {
          title: "Categorías de productos",
          url: "/productos/categorias",
        },
      ],
    },
    {
      title: "POS",
      url: "/pos",
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
          url: "/caja/cierre",
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
      <SidebarHeader className="flex flex-col items-center gap-2 px-4 py-3">
      <div className="flex items-center gap-2 w-full">
        <Building2 className="h-5 w-5 text-primary shrink-0" />
        <h1 className="text-3xl font-extrabold tracking-tight text-primary leading-tight whitespace-nowrap overflow-hidden">
          Matrioska
        </h1>
      </div>
      <ModeToggle />
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
