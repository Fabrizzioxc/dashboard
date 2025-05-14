"use client"

import { useState } from "react"
import {
  Calendar,
  Download,
  FileSpreadsheet,
  FileText,
  Filter,
  History,
  Package,
  Search,
  ShoppingCart,
  User,
} from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import { AppSidebar } from "@/components/app-sidebar"

// Sample products data
const productsData = [
  {
    id: 1,
    name: "Camiseta Básica",
    category: "Camisetas",
    variants: [
      { color: "Negro", size: "M", stock: 15 },
      { color: "Negro", size: "L", stock: 10 },
      { color: "Blanco", size: "M", stock: 5 },
      { color: "Blanco", size: "L", stock: 5 },
    ],
    totalStock: 35,
    price: 29.99,
  },
  {
    id: 2,
    name: "Jeans Slim Fit",
    category: "Pantalones",
    variants: [
      { color: "Azul", size: "32", stock: 10 },
      { color: "Azul", size: "34", stock: 5 },
      { color: "Negro", size: "32", stock: 3 },
      { color: "Negro", size: "34", stock: 2 },
    ],
    totalStock: 20,
    price: 59.99,
  },
  {
    id: 3,
    name: "Vestido Floral",
    category: "Vestidos",
    variants: [
      { color: "Rojo", size: "S", stock: 5 },
      { color: "Rojo", size: "M", stock: 5 },
      { color: "Azul", size: "S", stock: 3 },
      { color: "Azul", size: "M", stock: 2 },
    ],
    totalStock: 15,
    price: 79.99,
  },
  {
    id: 4,
    name: "Chaqueta de Cuero",
    category: "Chaquetas",
    variants: [
      { color: "Negro", size: "M", stock: 3 },
      { color: "Negro", size: "L", stock: 3 },
      { color: "Marrón", size: "M", stock: 1 },
      { color: "Marrón", size: "L", stock: 1 },
    ],
    totalStock: 8,
    price: 149.99,
  },
  {
    id: 5,
    name: "Sudadera con Capucha",
    category: "Sudaderas",
    variants: [
      { color: "Gris", size: "L", stock: 10 },
      { color: "Gris", size: "XL", stock: 5 },
      { color: "Negro", size: "L", stock: 5 },
      { color: "Negro", size: "XL", stock: 5 },
    ],
    totalStock: 25,
    price: 49.99,
  },
  {
    id: 6,
    name: "Falda Plisada",
    category: "Faldas",
    variants: [
      { color: "Negro", size: "S", stock: 3 },
      { color: "Negro", size: "M", stock: 2 },
      { color: "Azul", size: "S", stock: 2 },
      { color: "Azul", size: "M", stock: 1 },
    ],
    totalStock: 8,
    price: 39.99,
  },
  {
    id: 7,
    name: "Camisa de Lino",
    category: "Camisas",
    variants: [
      { color: "Blanco", size: "M", stock: 8 },
      { color: "Blanco", size: "L", stock: 7 },
      { color: "Azul", size: "M", stock: 5 },
      { color: "Azul", size: "L", stock: 5 },
    ],
    totalStock: 25,
    price: 45.99,
  },
  {
    id: 8,
    name: "Shorts Deportivos",
    category: "Shorts",
    variants: [
      { color: "Negro", size: "M", stock: 12 },
      { color: "Negro", size: "L", stock: 8 },
      { color: "Gris", size: "M", stock: 7 },
      { color: "Gris", size: "L", stock: 3 },
    ],
    totalStock: 30,
    price: 24.99,
  },
]

// Sample sales data
const salesData = [
  {
    id: "INV-001",
    date: "2025-05-12T09:30:00",
    customer: "Juan Pérez",
    total: 1299.99,
    paymentMethod: "Tarjeta",
    status: "completed",
    items: [
      { id: 1, name: "Camiseta Básica", variant: "Negro - M", price: 29.99, quantity: 2, subtotal: 59.98 },
      { id: 2, name: "Jeans Slim Fit", variant: "Azul - 32", price: 59.99, quantity: 1, subtotal: 59.99 },
      { id: 3, name: "Chaqueta de Cuero", variant: "Negro - L", price: 149.99, quantity: 1, subtotal: 149.99 },
    ],
    subtotal: 269.96,
    tax: 48.59,
    discount: 0,
  },
  {
    id: "INV-002",
    date: "2025-05-11T14:45:00",
    customer: "María González",
    total: 999.99,
    paymentMethod: "Efectivo",
    status: "completed",
    items: [
      { id: 1, name: "Vestido Floral", variant: "Rojo - S", price: 79.99, quantity: 1, subtotal: 79.99 },
      { id: 2, name: "Zapatos de Tacón", variant: "Negro - 37", price: 89.99, quantity: 1, subtotal: 89.99 },
    ],
    subtotal: 169.98,
    tax: 30.6,
    discount: 10,
  },
  {
    id: "INV-003",
    date: "2025-05-11T11:20:00",
    customer: "Carlos Rodríguez",
    total: 349.99,
    paymentMethod: "Transferencia",
    status: "pending",
    items: [
      { id: 1, name: "Sudadera con Capucha", variant: "Gris - XL", price: 49.99, quantity: 1, subtotal: 49.99 },
      { id: 2, name: "Pantalones Deportivos", variant: "Negro - L", price: 39.99, quantity: 1, subtotal: 39.99 },
    ],
    subtotal: 89.98,
    tax: 16.2,
    discount: 0,
  },
  {
    id: "INV-004",
    date: "2025-05-10T16:15:00",
    customer: "Ana Martínez",
    total: 129.99,
    paymentMethod: "Tarjeta",
    status: "completed",
    items: [
      { id: 1, name: "Blusa de Seda", variant: "Blanco - M", price: 69.99, quantity: 1, subtotal: 69.99 },
      { id: 2, name: "Bufanda de Lana", variant: "Gris", price: 29.99, quantity: 1, subtotal: 29.99 },
    ],
    subtotal: 99.98,
    tax: 18.0,
    discount: 0,
  },
  {
    id: "INV-005",
    date: "2025-05-10T10:05:00",
    customer: "Roberto Sánchez",
    total: 249.99,
    paymentMethod: "Efectivo",
    status: "completed",
    items: [
      { id: 1, name: "Zapatillas Deportivas", variant: "Blanco - 42", price: 99.99, quantity: 1, subtotal: 99.99 },
      { id: 2, name: "Shorts Deportivos", variant: "Negro - M", price: 24.99, quantity: 2, subtotal: 49.98 },
    ],
    subtotal: 149.97,
    tax: 27.0,
    discount: 0,
  },
  {
    id: "INV-006",
    date: "2025-05-09T13:40:00",
    customer: "Laura Díaz",
    total: 599.99,
    paymentMethod: "Transferencia",
    status: "cancelled",
    items: [
      { id: 1, name: "Abrigo de Invierno", variant: "Negro - M", price: 199.99, quantity: 1, subtotal: 199.99 },
      { id: 2, name: "Botas de Cuero", variant: "Marrón - 38", price: 149.99, quantity: 1, subtotal: 149.99 },
    ],
    subtotal: 349.98,
    tax: 63.0,
    discount: 0,
  },
  {
    id: "INV-007",
    date: "2025-05-09T09:10:00",
    customer: "Miguel Torres",
    total: 899.99,
    paymentMethod: "Tarjeta",
    status: "completed",
    items: [
      { id: 1, name: "Traje Formal", variant: "Azul Marino - 50", price: 299.99, quantity: 1, subtotal: 299.99 },
      { id: 2, name: "Camisa de Vestir", variant: "Blanco - M", price: 59.99, quantity: 2, subtotal: 119.98 },
      { id: 3, name: "Zapatos de Vestir", variant: "Negro - 42", price: 129.99, quantity: 1, subtotal: 129.99 },
    ],
    subtotal: 549.96,
    tax: 99.0,
    discount: 0,
  },
]

// Sample report history data
const reportHistoryData = [
  {
    id: 1,
    type: "products",
    date: "2025-05-12T14:30:00",
    user: "Admin",
    format: "pdf",
    url: "#",
  },
  {
    id: 2,
    type: "sales",
    date: "2025-05-11T10:15:00",
    user: "Admin",
    format: "excel",
    url: "#",
  },
  {
    id: 3,
    type: "products",
    date: "2025-05-10T16:45:00",
    user: "Admin",
    format: "excel",
    url: "#",
  },
  {
    id: 4,
    type: "sales",
    date: "2025-05-09T09:20:00",
    user: "Admin",
    format: "pdf",
    url: "#",
  },
  {
    id: 5,
    type: "products",
    date: "2025-05-08T11:30:00",
    user: "Admin",
    format: "pdf",
    url: "#",
  },
]

// Available categories
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
]

// Status options
const statusOptions = [
  { value: "all", label: "Todos" },
  { value: "completed", label: "Completada" },
  { value: "pending", label: "Pendiente" },
  { value: "cancelled", label: "Cancelada" },
]

// Payment method options
const paymentMethodOptions = [
  { value: "all", label: "Todos" },
  { value: "Efectivo", label: "Efectivo" },
  { value: "Tarjeta", label: "Tarjeta" },
  { value: "Transferencia", label: "Transferencia" },
  { value: "Yape", label: "Yape" },
  { value: "Plin", label: "Plin" },
]

// Report type options
const reportTypeOptions = [
  { value: "all", label: "Todos" },
  { value: "products", label: "Productos" },
  { value: "sales", label: "Ventas" },
]

export default function ReportesPage() {
  // Products report state
  const [productCategory, setProductCategory] = useState("Todas")
  const [minStock, setMinStock] = useState("")
  const [productSearchTerm, setProductSearchTerm] = useState("")
  const [isGeneratingProductReport, setIsGeneratingProductReport] = useState(false)

  // Sales report state
  const [selectedDateFrom, setSelectedDateFrom] = useState<Date | undefined>(undefined)
  const [selectedDateTo, setSelectedDateTo] = useState<Date | undefined>(undefined)
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("all")
  const [salesSearchTerm, setSalesSearchTerm] = useState("")
  const [isGeneratingSalesReport, setIsGeneratingSalesReport] = useState(false)
  const [selectedSale, setSelectedSale] = useState<any>(null)
  const [isSaleDetailsOpen, setIsSaleDetailsOpen] = useState(false)

  // Report history state
  const [selectedReportType, setSelectedReportType] = useState("all")
  const [historySearchTerm, setHistorySearchTerm] = useState("")
  const [isDownloading, setIsDownloading] = useState(false)

  // Filter products based on category, min stock, and search term
  const filteredProducts = productsData.filter((product) => {
    // Filter by category
    const matchesCategory = productCategory === "Todas" || product.category === productCategory

    // Filter by min stock
    const matchesMinStock = !minStock || product.totalStock <= Number.parseInt(minStock)

    // Filter by search term
    const matchesSearch = product.name.toLowerCase().includes(productSearchTerm.toLowerCase())

    return matchesCategory && matchesMinStock && matchesSearch
  })

  // Filter sales based on date range, status, payment method, and search term
  const filteredSales = salesData.filter((sale) => {
    // Filter by date range
    const saleDate = new Date(sale.date)
    const matchesDateFrom = !selectedDateFrom || saleDate >= selectedDateFrom
    const matchesDateTo = !selectedDateTo || saleDate <= selectedDateTo

    // Filter by status
    const matchesStatus = selectedStatus === "all" || sale.status === selectedStatus

    // Filter by payment method
    const matchesPaymentMethod = selectedPaymentMethod === "all" || sale.paymentMethod === selectedPaymentMethod

    // Filter by search term
    const matchesSearch =
      sale.id.toLowerCase().includes(salesSearchTerm.toLowerCase()) ||
      sale.customer.toLowerCase().includes(salesSearchTerm.toLowerCase())

    return matchesDateFrom && matchesDateTo && matchesStatus && matchesPaymentMethod && matchesSearch
  })

  // Filter report history based on type and search term
  const filteredHistory = reportHistoryData.filter((report) => {
    // Filter by type
    const matchesType = selectedReportType === "all" || report.type === selectedReportType

    // Filter by search term
    const matchesSearch =
      report.user.toLowerCase().includes(historySearchTerm.toLowerCase()) ||
      report.format.toLowerCase().includes(historySearchTerm.toLowerCase())

    return matchesType && matchesSearch
  })

  // Handle generating product report
  const handleGenerateProductReport = (format: string) => {
    setIsGeneratingProductReport(true)

    // Simulate API call
    setTimeout(() => {
      setIsGeneratingProductReport(false)
      toast(`El reporte de productos ha sido generado en formato ${format.toUpperCase()}.`)
    }, 1500)
  }

  // Handle generating sales report
  const handleGenerateSalesReport = (format: string) => {
    setIsGeneratingSalesReport(true)

    // Simulate API call
    setTimeout(() => {
      setIsGeneratingSalesReport(false)
      toast(`El reporte de ventas ha sido generado en formato ${format.toUpperCase()}.`)
    }, 1500)
  }

  // Handle downloading report
  const handleDownloadReport = (reportId: number) => {
    setIsDownloading(true)

    // Simulate API call
    setTimeout(() => {
      setIsDownloading(false)
      toast("El reporte ha sido descargado exitosamente.")
    }, 1000)
  }

  // Handle viewing sale details
  const handleViewSaleDetails = (sale: any) => {
    setSelectedSale(sale)
    setIsSaleDetailsOpen(true)
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMM yyyy, HH:mm", { locale: es })
  }

  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="default">Completada</Badge>
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Pendiente
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
            Cancelada
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
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
                <BreadcrumbPage>Reportes</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Informes y Reportes</h1>
        </div>

        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span>Reporte de Productos</span>
            </TabsTrigger>
            <TabsTrigger value="sales" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              <span>Reporte de Ventas</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              <span>Historial de Reportes</span>
            </TabsTrigger>
          </TabsList>

          {/* Products Report Tab */}
          <TabsContent value="products">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Reporte de Productos</CardTitle>
                  <CardDescription>Genere un reporte detallado del inventario de productos</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleGenerateProductReport("excel")}
                    disabled={isGeneratingProductReport}
                  >
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Exportar Excel
                  </Button>
                  <Button onClick={() => handleGenerateProductReport("pdf")} disabled={isGeneratingProductReport}>
                    <FileText className="mr-2 h-4 w-4" />
                    Generar PDF
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4 grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="product-search">Buscar Producto</Label>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="product-search"
                        type="search"
                        placeholder="Buscar por nombre..."
                        className="pl-8"
                        value={productSearchTerm}
                        onChange={(e) => setProductSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoría</Label>
                    <Select value={productCategory} onValueChange={setProductCategory}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Seleccionar categoría" />
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
                  <div className="space-y-2">
                    <Label htmlFor="min-stock">Stock Mínimo</Label>
                    <Input
                      id="min-stock"
                      type="number"
                      placeholder="Filtrar por stock menor o igual a..."
                      value={minStock}
                      onChange={(e) => setMinStock(e.target.value)}
                    />
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Categoría</TableHead>
                        <TableHead>Variantes</TableHead>
                        <TableHead className="text-right">Stock Total</TableHead>
                        <TableHead className="text-right">Precio Unitario</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center">
                            <div className="flex flex-col items-center justify-center py-6">
                              <Filter className="mb-2 h-10 w-10 text-muted-foreground" />
                              <p className="text-muted-foreground">No se encontraron productos</p>
                              <p className="text-xs text-muted-foreground">
                                Intente con diferentes criterios de búsqueda
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredProducts.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell>{product.category}</TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {product.variants.map((variant, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {variant.color} - {variant.size} ({variant.stock})
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <span
                                className={
                                  product.totalStock === 0
                                    ? "text-red-500 font-medium"
                                    : product.totalStock < 10
                                      ? "text-amber-500 font-medium"
                                      : ""
                                }
                              >
                                {product.totalStock}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">S/. {product.price.toFixed(2)}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sales Report Tab */}
          <TabsContent value="sales">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Reporte de Ventas</CardTitle>
                  <CardDescription>Genere un reporte detallado de las ventas realizadas</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleGenerateSalesReport("excel")}
                    disabled={isGeneratingSalesReport}
                  >
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Exportar Excel
                  </Button>
                  <Button onClick={() => handleGenerateSalesReport("pdf")} disabled={isGeneratingSalesReport}>
                    <FileText className="mr-2 h-4 w-4" />
                    Generar PDF
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-2">
                    <Label htmlFor="sales-search">Buscar</Label>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="sales-search"
                        type="search"
                        placeholder="Buscar por factura o cliente..."
                        className="pl-8"
                        value={salesSearchTerm}
                        onChange={(e) => setSalesSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Rango de Fechas</Label>
                    <div className="flex items-center gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <Calendar className="mr-2 h-4 w-4" />
                            {selectedDateFrom ? format(selectedDateFrom, "dd/MM/yyyy") : "Desde"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={selectedDateFrom}
                            onSelect={setSelectedDateFrom}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <Calendar className="mr-2 h-4 w-4" />
                            {selectedDateTo ? format(selectedDateTo, "dd/MM/yyyy") : "Hasta"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={selectedDateTo}
                            onSelect={setSelectedDateTo}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Estado</Label>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payment-method">Método de Pago</Label>
                    <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                      <SelectTrigger id="payment-method">
                        <SelectValue placeholder="Seleccionar método" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethodOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID Venta</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Método de Pago</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-right">Acción</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSales.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center">
                            <div className="flex flex-col items-center justify-center py-6">
                              <Filter className="mb-2 h-10 w-10 text-muted-foreground" />
                              <p className="text-muted-foreground">No se encontraron ventas</p>
                              <p className="text-xs text-muted-foreground">
                                Intente con diferentes criterios de búsqueda
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredSales.map((sale) => (
                          <TableRow key={sale.id}>
                            <TableCell className="font-medium">{sale.id}</TableCell>
                            <TableCell>{formatDate(sale.date)}</TableCell>
                            <TableCell>{sale.customer}</TableCell>
                            <TableCell>{sale.paymentMethod}</TableCell>
                            <TableCell>{getStatusBadge(sale.status)}</TableCell>
                            <TableCell className="text-right">S/. {sale.total.toFixed(2)}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" onClick={() => handleViewSaleDetails(sale)}>
                                Ver detalles
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Report History Tab */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Historial de Reportes</CardTitle>
                <CardDescription>Consulte y descargue los reportes generados anteriormente</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="history-search">Buscar</Label>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="history-search"
                        type="search"
                        placeholder="Buscar por usuario o formato..."
                        className="pl-8"
                        value={historySearchTerm}
                        onChange={(e) => setHistorySearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="report-type">Tipo de Reporte</Label>
                    <Select value={selectedReportType} onValueChange={setSelectedReportType}>
                      <SelectTrigger id="report-type">
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {reportTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tipo de Reporte</TableHead>
                        <TableHead>Fecha de Generación</TableHead>
                        <TableHead>Usuario</TableHead>
                        <TableHead>Formato</TableHead>
                        <TableHead className="text-right">Acción</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredHistory.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center">
                            <div className="flex flex-col items-center justify-center py-6">
                              <History className="mb-2 h-10 w-10 text-muted-foreground" />
                              <p className="text-muted-foreground">No hay reportes en el historial</p>
                              <p className="text-xs text-muted-foreground">
                                Genere un reporte desde las pestañas de Productos o Ventas
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredHistory.map((report) => (
                          <TableRow key={report.id}>
                            <TableCell>
                              {report.type === "products" ? (
                                <div className="flex items-center">
                                  <Package className="mr-2 h-4 w-4" />
                                  <span>Productos</span>
                                </div>
                              ) : (
                                <div className="flex items-center">
                                  <ShoppingCart className="mr-2 h-4 w-4" />
                                  <span>Ventas</span>
                                </div>
                              )}
                            </TableCell>
                            <TableCell>{formatDate(report.date)}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <User className="mr-2 h-4 w-4" />
                                <span>{report.user}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  report.format === "pdf"
                                    ? "bg-red-100 text-red-800 hover:bg-red-100"
                                    : "bg-green-100 text-green-800 hover:bg-green-100"
                                }
                              >
                                {report.format.toUpperCase()}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownloadReport(report.id)}
                                disabled={isDownloading}
                              >
                                <Download className="mr-2 h-4 w-4" />
                                Descargar
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Sale Details Dialog */}
      <Dialog open={isSaleDetailsOpen} onOpenChange={setIsSaleDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalles de la Venta</DialogTitle>
            <DialogDescription>Información completa de la venta seleccionada</DialogDescription>
          </DialogHeader>
          {selectedSale && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Factura</h3>
                  <p className="font-medium">{selectedSale.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Fecha</h3>
                  <p>{formatDate(selectedSale.date)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Estado</h3>
                  <div className="mt-1">{getStatusBadge(selectedSale.status)}</div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Cliente</h3>
                <p>{selectedSale.customer}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Productos</h3>
                <div className="mt-2 rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Producto</TableHead>
                        <TableHead>Variante</TableHead>
                        <TableHead className="text-right">Precio</TableHead>
                        <TableHead className="text-center">Cantidad</TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedSale.items.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.variant}</TableCell>
                          <TableCell className="text-right">S/. {item.price.toFixed(2)}</TableCell>
                          <TableCell className="text-center">{item.quantity}</TableCell>
                          <TableCell className="text-right">S/. {item.subtotal.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="rounded-md border p-4">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>S/. {selectedSale.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>IGV (18%):</span>
                    <span>S/. {selectedSale.tax.toFixed(2)}</span>
                  </div>
                  {selectedSale.discount > 0 && (
                    <div className="flex justify-between">
                      <span>Descuento:</span>
                      <span>S/. {selectedSale.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>S/. {selectedSale.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Método de Pago</h3>
                <p>{selectedSale.paymentMethod}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      </SidebarInset>
</SidebarProvider>
    </>
  )
}
