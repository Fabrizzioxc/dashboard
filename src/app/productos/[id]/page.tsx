"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Plus, Trash2, Upload, X } from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { AppSidebar } from "@/components/app-sidebar"

// Available categories
const categories = [
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

// Available colors
const colors = [
  { name: "Negro", value: "negro" },
  { name: "Blanco", value: "blanco" },
  { name: "Rojo", value: "rojo" },
  { name: "Azul", value: "azul" },
  { name: "Verde", value: "verde" },
  { name: "Amarillo", value: "amarillo" },
  { name: "Gris", value: "gris" },
  { name: "Beige", value: "beige" },
  { name: "Rosa", value: "rosa" },
  { name: "Morado", value: "morado" },
]

// Available sizes
const sizes = [
  { name: "XS", value: "xs" },
  { name: "S", value: "s" },
  { name: "M", value: "m" },
  { name: "L", value: "l" },
  { name: "XL", value: "xl" },
  { name: "XXL", value: "xxl" },
]

// Sample product data (in a real app, this would come from an API)
const sampleProducts = [
  {
    id: "1",
    name: "Camiseta Básica",
    description: "Camiseta básica de algodón de alta calidad, perfecta para el uso diario.",
    category: "Camisetas",
    salePrice: "29.99",
    cost: "15.50",
    image: "/placeholder.svg?height=128&width=128",
    isActive: true,
    variants: [
      {
        id: 1,
        color: "negro",
        size: "s",
        stock: 20,
        sku: "CB-NEG-S-001",
      },
      {
        id: 2,
        color: "negro",
        size: "m",
        stock: 35,
        sku: "CB-NEG-M-002",
      },
      {
        id: 3,
        color: "blanco",
        size: "m",
        stock: 15,
        sku: "CB-BLA-M-003",
      },
      {
        id: 4,
        color: "rojo",
        size: "l",
        stock: 10,
        sku: "CB-ROJ-L-004",
      },
    ],
  },
  {
    id: "2",
    name: "Jeans Slim Fit",
    description: "Jeans de corte slim con elasticidad para mayor comodidad.",
    category: "Pantalones",
    salePrice: "59.99",
    cost: "32.75",
    image: "/placeholder.svg?height=128&width=128",
    isActive: true,
    variants: [
      {
        id: 1,
        color: "azul",
        size: "m",
        stock: 12,
        sku: "JSF-AZU-M-001",
      },
      {
        id: 2,
        color: "azul",
        size: "l",
        stock: 18,
        sku: "JSF-AZU-L-002",
      },
      {
        id: 3,
        color: "negro",
        size: "m",
        stock: 8,
        sku: "JSF-NEG-M-003",
      },
      {
        id: 4,
        color: "negro",
        size: "l",
        stock: 7,
        sku: "JSF-NEG-L-004",
      },
    ],
  },
]

// Initial variant template
const initialVariant = {
  id: Date.now(),
  color: "",
  size: "",
  stock: 0,
  sku: "",
}

export default function EditarProductoPage() {
  const params = useParams()
  const productId = params.id as string

  // State for loading
  const [isLoading, setIsLoading] = useState(true)

  // Basic product information
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [salePrice, setSalePrice] = useState("")
  const [cost, setCost] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Product variants
  const [variants, setVariants] = useState([{ ...initialVariant }])

  // Fetch product data
  useEffect(() => {
    // Simulate API call
    setIsLoading(true)
    setTimeout(() => {
      const product = sampleProducts.find((p) => p.id === productId)
      if (product) {
        setName(product.name)
        setDescription(product.description)
        setCategory(product.category)
        setSalePrice(product.salePrice)
        setCost(product.cost)
        setIsActive(product.isActive)
        setImagePreview(product.image)
        setVariants(product.variants)
      }
      setIsLoading(false)
    }, 1000)
  }, [productId])

  // Calculate total stock
  const totalStock = variants.reduce((sum, variant) => sum + Number(variant.stock || 0), 0)

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Add a new variant
  const addVariant = () => {
    setVariants([...variants, { ...initialVariant, id: Date.now() }])
  }

  // Remove a variant
  const removeVariant = (id: number) => {
    if (variants.length > 1) {
      setVariants(variants.filter((variant) => variant.id !== id))
    } else {
      toast("No se puede eliminar la última variante")

    }
  }

  // Update a variant property
  const updateVariant = (id: number, field: string, value: string | number) => {
    setVariants(
      variants.map((variant) =>
        variant.id === id ? { ...variant, [field]: value } : variant
      )
    )
  }

  // Generate SKU based on product name, color and size
  const generateSku = (variantId: number) => {
    const variant = variants.find((v) => v.id === variantId)
    if (!variant) return

    const namePrefix = name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
    const colorCode = variant.color.substring(0, 3).toUpperCase()
    const sizeCode = variant.size.toUpperCase()
    const randomNum = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")

    const sku = `${namePrefix}-${colorCode}-${sizeCode}-${randomNum}`
    updateVariant(variantId, "sku", sku)
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!name || !category || !salePrice || !cost) {
      toast("Porfavor complete todos los campos obligatorios.")
      return
    }

    // Validate variants
    const invalidVariants = variants.some(
      (variant) => !variant.color || !variant.size || !variant.sku
    )
    if (invalidVariants) {
      toast("Porfavor complete todos los campos de las variantes.")
      return
    }

    // Here you would typically send the data to your API
    console.log({
      id: productId,
      name,
      description,
      category,
      salePrice: Number.parseFloat(salePrice),
      cost: Number.parseFloat(cost),
      isActive,
      image: imagePreview,
      variants,
      totalStock,
    })

    toast("Producto actualizado con éxito",)

    // Reset form or redirect
    // router.push('/productos')
  }

  if (isLoading) {
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
                  <BreadcrumbPage>Editar Producto</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-72" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-24 w-full" />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="flex items-center space-x-2">
                <Skeleton className="h-6 w-10" />
                <Skeleton className="h-4 w-24" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-72" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-10 w-36" />
              </div>
              <Skeleton className="h-48 w-full" />
            </CardContent>
            <CardFooter className="flex justify-between border-t px-6 py-4">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </CardFooter>
          </Card>
        </div>
        </SidebarInset>
      </SidebarProvider>
      </>
    )
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
                <BreadcrumbPage>Editar Producto</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Editar Producto</h1>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/productos">Cancelar</Link>
            </Button>
            <Button onClick={handleSubmit}>Guardar Cambios</Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Información Básica</CardTitle>
              <CardDescription>
                Edite la información general del producto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Nombre <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nombre del producto"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">
                    Categoría <span className="text-red-500">*</span>
                  </Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descripción detallada del producto"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="salePrice">
                    Precio de Venta <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                      S/.
                    </span>
                    <Input
                      id="salePrice"
                      type="number"
                      step="0.01"
                      min="0"
                      value={salePrice}
                      onChange={(e) => setSalePrice(e.target.value)}
                      placeholder="0.00"
                      className="pl-8"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost">
                    Costo <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                      S/.
                    </span>
                    <Input
                      id="cost"
                      type="number"
                      step="0.01"
                      min="0"
                      value={cost}
                      onChange={(e) => setCost(e.target.value)}
                      placeholder="0.00"
                      className="pl-8"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Imagen Principal</Label>
                <div className="flex flex-col items-center gap-4 md:flex-row">
                  <div className="flex h-32 w-32 items-center justify-center rounded-md border border-dashed">
                    {imagePreview ? (
                      <div className="relative h-full w-full">
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Vista previa"
                          className="h-full w-full rounded-md object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute right-0 top-0 h-6 w-6 -translate-y-1/2 translate-x-1/2 rounded-full"
                          onClick={() => setImagePreview(null)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center text-muted-foreground">
                        <Upload className="mb-2 h-8 w-8" />
                        <span className="text-xs">Subir imagen</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="cursor-pointer"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      Formatos aceptados: JPG, PNG. Tamaño máximo: 2MB.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
                <Label htmlFor="active">Producto Activo</Label>
              </div>
            </CardContent>
          </Card>

          {/* Variants */}
          <Card>
            <CardHeader>
              <CardTitle>Variantes del Producto</CardTitle>
              <CardDescription>
                Edite las diferentes combinaciones de color, talla y stock
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Stock Total: {totalStock}</h3>
                  <p className="text-xs text-muted-foreground">
                    Suma del stock de todas las variantes
                  </p>
                </div>
                <Button type="button" onClick={addVariant} variant="outline" size="sm">
                  <Plus className="mr-1 h-4 w-4" /> Agregar Variante
                </Button>
              </div>

              {variants.map((variant, index) => (
                <div
                  key={variant.id}
                  className="rounded-lg border p-4"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="font-medium">Variante {index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeVariant(variant.id)}
                      disabled={variants.length === 1}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-2">
                      <Label htmlFor={`color-${variant.id}`}>
                        Color <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={variant.color}
                        onValueChange={(value) =>
                          updateVariant(variant.id, "color", value)
                        }
                        required
                      >
                        <SelectTrigger id={`color-${variant.id}`}>
                          <SelectValue placeholder="Seleccionar color" />
                        </SelectTrigger>
                        <SelectContent>
                          {colors.map((color) => (
                            <SelectItem key={color.value} value={color.value}>
                              {color.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`size-${variant.id}`}>
                        Talla <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={variant.size}
                        onValueChange={(value) =>
                          updateVariant(variant.id, "size", value)
                        }
                        required
                      >
                        <SelectTrigger id={`size-${variant.id}`}>
                          <SelectValue placeholder="Seleccionar talla" />
                        </SelectTrigger>
                        <SelectContent>
                          {sizes.map((size) => (
                            <SelectItem key={size.value} value={size.value}>
                              {size.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`stock-${variant.id}`}>
                        Stock <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`stock-${variant.id}`}
                        type="number"
                        min="0"
                        value={variant.stock}
                        onChange={(e) =>
                          updateVariant(
                            variant.id,
                            "stock",
                            Number.parseInt(e.target.value) || 0
                          )
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={`sku-${variant.id}`}>
                          SKU / Código <span className="text-red-500">*</span>
                        </Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 text-xs"
                          onClick={() => generateSku(variant.id)}
                          disabled={!name || !variant.color || !variant.size}
                        >
                          Generar
                        </Button>
                      </div>
                      <Input
                        id={`sku-${variant.id}`}
                        value={variant.sku}
                        onChange={(e) =>
                          updateVariant(variant.id, "sku", e.target.value)
                        }
                        placeholder="SKU o código de barras"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex justify-between border-t px-6 py-4">
              <Button variant="outline" asChild>
                <Link href="/productos">Cancelar</Link>
              </Button>
                          <Button type="submit">Guardar Cambios</Button>
                        </CardFooter>
                      </Card>
                    </form>
      </div>
          </SidebarInset>
      </SidebarProvider>
                </>
    );
}; 
