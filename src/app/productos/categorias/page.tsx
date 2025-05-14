"use client"

import { useState } from "react"
import { Edit, MoreHorizontal, Plus, Trash2 } from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AppSidebar } from "@/components/app-sidebar"

// Sample categories data
const categoriesData = [
  {
    id: 1,
    name: "Camisetas",
    description: "Camisetas de manga corta y larga",
    productCount: 24,
    isActive: true,
  },
  {
    id: 2,
    name: "Pantalones",
    description: "Jeans, chinos y pantalones de vestir",
    productCount: 18,
    isActive: true,
  },
  {
    id: 3,
    name: "Vestidos",
    description: "Vestidos casuales y formales",
    productCount: 15,
    isActive: true,
  },
  {
    id: 4,
    name: "Chaquetas",
    description: "Chaquetas y abrigos para todas las estaciones",
    productCount: 12,
    isActive: true,
  },
  {
    id: 5,
    name: "Sudaderas",
    description: "Sudaderas con y sin capucha",
    productCount: 10,
    isActive: true,
  },
  {
    id: 6,
    name: "Faldas",
    description: "Faldas de diferentes largos y estilos",
    productCount: 8,
    isActive: true,
  },
  {
    id: 7,
    name: "Camisas",
    description: "Camisas formales e informales",
    productCount: 14,
    isActive: true,
  },
  {
    id: 8,
    name: "Shorts",
    description: "Shorts para verano y deporte",
    productCount: 9,
    isActive: true,
  },
  {
    id: 9,
    name: "Blazers",
    description: "Blazers y trajes formales",
    productCount: 6,
    isActive: false,
  },
  {
    id: 10,
    name: "Suéteres",
    description: "Suéteres y cardigans",
    productCount: 11,
    isActive: true,
  },
  {
    id: 11,
    name: "Zapatos",
    description: "Calzado para hombres y mujeres",
    productCount: 32,
    isActive: true,
  },
  {
    id: 12,
    name: "Accesorios",
    description: "Cinturones, bufandas, gorros y más",
    productCount: 28,
    isActive: true,
  },
  {
    id: 13,
    name: "Ropa Interior",
    description: "Ropa interior para hombres y mujeres",
    productCount: 16,
    isActive: true,
  },
  {
    id: 14,
    name: "Ropa Deportiva",
    description: "Ropa para actividades físicas y deportes",
    productCount: 22,
    isActive: true,
  },
  {
    id: 15,
    name: "Pijamas",
    description: "Ropa para dormir y estar en casa",
    productCount: 7,
    isActive: false,
  },
]

export default function CategoriasPage() {
  const [categories, setCategories] = useState(categoriesData)
  const [searchTerm, setSearchTerm] = useState("")
  const [newCategory, setNewCategory] = useState({ name: "", description: "" })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<null | { id: number; name: string; description: string }>(null)

  // Filter categories based on search term
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Handle adding a new category
  const handleAddCategory = () => {
    if (!newCategory.name) return

    const newId = Math.max(...categories.map((cat) => cat.id)) + 1
    setCategories([
      ...categories,
      {
        id: newId,
        name: newCategory.name,
        description: newCategory.description,
        productCount: 0,
        isActive: true,
      },
    ])
    setNewCategory({ name: "", description: "" })
    setIsDialogOpen(false)
  }

  // Handle editing a category
  const handleEditCategory = () => {
    if (!editingCategory || !editingCategory.name) return

    setCategories(
      categories.map((cat) =>
        cat.id === editingCategory.id
          ? {
              ...cat,
              name: editingCategory.name,
              description: editingCategory.description,
            }
          : cat,
      ),
    )
    setEditingCategory(null)
  }

  // Handle toggling category status
  const toggleCategoryStatus = (id: number) => {
    setCategories(
      categories.map((cat) =>
        cat.id === id
          ? {
              ...cat,
              isActive: !cat.isActive,
            }
          : cat,
      ),
    )
  }

  // Handle deleting a category
  const deleteCategory = (id: number) => {
    setCategories(categories.filter((cat) => cat.id !== id))
  }

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
                <BreadcrumbLink href="/productos">Productos</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Categorías</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Categorías de Productos</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Nueva Categoría
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar Nueva Categoría</DialogTitle>
                <DialogDescription>Ingrese los detalles de la nueva categoría de productos.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre de la Categoría</Label>
                  <Input
                    id="name"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    placeholder="Ej: Zapatos, Accesorios, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Input
                    id="description"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                    placeholder="Breve descripción de la categoría"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddCategory}>Guardar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Gestión de Categorías</CardTitle>
            <CardDescription>Administre las categorías de productos de su tienda de ropa</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input
                placeholder="Buscar categorías..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead className="text-center">Productos</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        No se encontraron categorías
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCategories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell>{category.description}</TableCell>
                        <TableCell className="text-center">{category.productCount}</TableCell>
                        <TableCell>
                          <Badge variant={category.isActive ? "default" : "secondary"}>
                            {category.isActive ? "Activa" : "Inactiva"}
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
                              <Dialog>
                                <DialogTrigger asChild>
                                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    <span>Editar</span>
                                  </DropdownMenuItem>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Editar Categoría</DialogTitle>
                                    <DialogDescription>Modifique los detalles de la categoría.</DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-name">Nombre de la Categoría</Label>
                                      <Input
                                        id="edit-name"
                                        defaultValue={category.name}
                                        onChange={(e) =>
                                          setEditingCategory({
                                            id: category.id,
                                            name: e.target.value,
                                            description: editingCategory?.description || category.description,
                                          })
                                        }
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-description">Descripción</Label>
                                      <Input
                                        id="edit-description"
                                        defaultValue={category.description}
                                        onChange={(e) =>
                                          setEditingCategory({
                                            id: category.id,
                                            name: editingCategory?.name || category.name,
                                            description: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button variant="outline" onClick={() => setEditingCategory(null)}>
                                      Cancelar
                                    </Button>
                                    <Button onClick={handleEditCategory}>Guardar Cambios</Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                              <DropdownMenuItem onClick={() => toggleCategoryStatus(category.id)}>
                                {category.isActive ? (
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
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => deleteCategory(category.id)}
                                disabled={category.productCount > 0}
                              >
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
          </CardContent>
        </Card>
      </div>
      </SidebarInset>
      </SidebarProvider>
    </>
  )
}
