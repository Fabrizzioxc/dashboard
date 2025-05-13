"use client"

import { useState } from "react"
import Link from "next/link"
import { Copy, Edit, Filter, MoreHorizontal, Plus, Search, SlidersHorizontal, Trash2 } from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { AppSidebar } from "@/components/app-sidebar"

// Sample product data
const products = [
  {
    id: 1,
    image: "/placeholder.svg?height=40&width=40",
    name: "Camiseta Básica",
    category: "Camisetas",
    salePrice: 29.99,
    totalStock: 120,
    status: "active",
  },
  {
    id: 2,
    image: "/placeholder.svg?height=40&width=40",
    name: "Jeans Slim Fit",
    category: "Pantalones",
    salePrice: 59.99,
    totalStock: 45,
    status: "active",
  },
  {
    id: 3,
    image: "/placeholder.svg?height=40&width=40",
    name: "Vestido Floral",
    category: "Vestidos",
    salePrice: 79.99,
    totalStock: 30,
    status: "active",
  },
  {
    id: 4,
    image: "/placeholder.svg?height=40&width=40",
    name: "Chaqueta de Cuero",
    category: "Chaquetas",
    salePrice: 149.99,
    totalStock: 15,
    status: "active",
  },
  {
    id: 5,
    image: "/placeholder.svg?height=40&width=40",
    name: "Sudadera con Capucha",
    category: "Sudaderas",
    salePrice: 49.99,
    totalStock: 60,
    status: "active",
  },
  {
    id: 6,
    image: "/placeholder.svg?height=40&width=40",
    name: "Falda Plisada",
    category: "Faldas",
    salePrice: 39.99,
    totalStock: 25,
    status: "inactive",
  },
  {
    id: 7,
    image: "/placeholder.svg?height=40&width=40",
    name: "Camisa de Lino",
    category: "Camisas",
    salePrice: 45.99,
    totalStock: 35,
    status: "active",
  },
  {
    id: 8,
    image: "/placeholder.svg?height=40&width=40",
    name: "Shorts Deportivos",
    category: "Shorts",
    salePrice: 24.99,
    totalStock: 50,
    status: "active",
  },
  {
    id: 9,
    image: "/placeholder.svg?height=40&width=40",
    name: "Blazer Formal",
    category: "Blazers",
    salePrice: 89.99,
    totalStock: 20,
    status: "inactive",
  },
  {
    id: 10,
    image: "/placeholder.svg?height=40&width=40",
    name: "Suéter de Lana",
    category: "Suéteres",
    salePrice: 69.99,
    totalStock: 0,
    status: "inactive",
  },
]

// Available categories for filtering
const categories = [
  "Todas",
  "Camisetas",
  "Pantalones",
  "Vestidos",
  "Chaquetas",
  "Sudaderas",
  "Faldas",
  "Camisas",
  "Shorts",
  "Blazers",
  "Suéteres",
]

export default function ProductosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todas")
  const [selectedStatus, setSelectedStatus] = useState("Todos")
  const [sortBy, setSortBy] = useState("none")

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      // Filter by search term
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())

      // Filter by category
      const matchesCategory = selectedCategory === "Todas" || product.category === selectedCategory

      // Filter by status
      const matchesStatus =
        selectedStatus === "Todos" ||
        (selectedStatus === "Activos" && product.status === "active") ||
        (selectedStatus === "Inactivos" && product.status === "inactive") ||
        (selectedStatus === "Sin Stock" && product.totalStock === 0)

      return matchesSearch && matchesCategory && matchesStatus
    })
    .sort((a, b) => {
      // Sort by selected criteria
      if (sortBy === "price-asc") return a.salePrice - b.salePrice
      if (sortBy === "price-desc") return b.salePrice - a.salePrice
      if (sortBy === "stock-asc") return a.totalStock - b.totalStock
      if (sortBy === "stock-desc") return b.totalStock - a.totalStock
      if (sortBy === "name-asc") return a.name.localeCompare(b.name)
      if (sortBy === "name-desc") return b.name.localeCompare(a.name)
      return 0
    })

  return (
    <>
    <SidebarProvider>
        <AppSidebar />
          <SidebarInset>

          
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Módulos</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Productos</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Gestión de Inventario</h1>
            <Button asChild>
              <Link href="/productos/nuevo">
                <Plus className="mr-2 h-4 w-4" /> Nuevo Producto
              </Link>
            </Button>
          </div>
          <Card className="p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar productos..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Todos">Todos</SelectItem>
                      <SelectItem value="Activos">Activos</SelectItem>
                      <SelectItem value="Inactivos">Inactivos</SelectItem>
                      <SelectItem value="Sin Stock">Sin Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sin ordenar</SelectItem>
                      <SelectItem value="name-asc">Nombre (A-Z)</SelectItem>
                      <SelectItem value="name-desc">Nombre (Z-A)</SelectItem>
                      <SelectItem value="price-asc">Precio (menor a mayor)</SelectItem>
                      <SelectItem value="price-desc">Precio (mayor a menor)</SelectItem>
                      <SelectItem value="stock-asc">Stock (menor a mayor)</SelectItem>
                      <SelectItem value="stock-desc">Stock (mayor a menor)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </Card>
          <Card>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Imagen</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead className="text-right">Precio</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        No se encontraron productos
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="h-10 w-10 rounded-md object-cover"
                          />
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell className="text-right">S/. {product.salePrice.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <span
                            className={
                              product.totalStock === 0
                                ? "text-red-500 font-medium"
                                : product.totalStock < 20
                                  ? "text-amber-500 font-medium"
                                  : ""
                            }
                          >
                            {product.totalStock}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={product.status === "active" ? "default" : "secondary"}>
                            {product.status === "active" ? "Activo" : "Inactivo"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Abrir menú</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/productos/${product.id}`}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  <span>Editar</span>
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Copy className="mr-2 h-4 w-4" />
                                <span>Duplicar</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                {product.status === "active" ? (
                                  <>
                                    <span className="mr-2">🔴</span>
                                    <span>Desactivar</span>
                                  </>
                                ) : (
                                  <>
                                    <span className="mr-2">🟢</span>
                                    <span>Activar</span>
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Eliminar</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      </div>
                </SidebarInset>
    </SidebarProvider>
    </>
  )
}
