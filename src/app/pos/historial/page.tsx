"use client"

import { useState } from "react"
import { Download, Eye, Filter, Search } from "lucide-react"
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { AppSidebar } from "@/components/app-sidebar"

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
]

export default function HistorialVentasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("all")
  const [selectedDateFrom, setSelectedDateFrom] = useState<Date | undefined>(undefined)
  const [selectedDateTo, setSelectedDateTo] = useState<Date | undefined>(undefined)
  const [selectedSale, setSelectedSale] = useState<any>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)

  // Filter sales based on search term and filters
  const filteredSales = salesData.filter((sale) => {
    // Filter by search term
    const matchesSearch =
      sale.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.customer.toLowerCase().includes(searchTerm.toLowerCase())

    // Filter by status
    const matchesStatus = selectedStatus === "all" || sale.status === selectedStatus

    // Filter by payment method
    const matchesPaymentMethod = selectedPaymentMethod === "all" || sale.paymentMethod === selectedPaymentMethod

    // Filter by date range
    const saleDate = new Date(sale.date)
    const matchesDateFrom = !selectedDateFrom || saleDate >= selectedDateFrom
    const matchesDateTo = !selectedDateTo || saleDate <= selectedDateTo

    return matchesSearch && matchesStatus && matchesPaymentMethod && matchesDateFrom && matchesDateTo
  })

  // Handle viewing sale details
  const handleViewDetails = (sale: any) => {
    setSelectedSale(sale)
    setIsDetailsDialogOpen(true)
  }

  // Handle exporting sales
  const handleExportSales = () => {
    // In a real application, this would generate a CSV or PDF file
    console.log("Exporting sales:", filteredSales)
    alert("Exportando ventas... Esta funcionalidad se implementará en el futuro.")
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

interface SaleItem {
  id: string
  name: string
  variant: string
  price: number
  quantity: number
  subtotal: number
}


interface Sale {
  id: string;
  date: Date;
  customer: string;
  paymentMethod: string;
  status: string;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  items: SaleItem[];
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
                <BreadcrumbLink href="/pos">POS</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Historial de Ventas</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Historial de Ventas</h1>
          <Button variant="outline" onClick={handleExportSales}>
            <Download className="mr-2 h-4 w-4" /> Exportar
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filtros de Búsqueda</CardTitle>
            <CardDescription>Filtre las ventas por diferentes criterios</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="search">Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    type="search"
                    placeholder="Buscar por factura o cliente..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
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
                <Label htmlFor="payment-method" >Método de Pago</Label>
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
              <div className="space-y-2">
                <Label>Rango de Fechas</Label>
                <div className="flex items-center gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="max-w-[180px] w-full justify-start text-left font-normal">
                        {selectedDateFrom ? format(selectedDateFrom, "dd/MM/yyyy") : "Desde"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={selectedDateFrom} onSelect={setSelectedDateFrom} initialFocus />
                    </PopoverContent>
                  </Popover>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="max-w-[180px] w-full justify-start text-left font-normal">
                        {selectedDateTo ? format(selectedDateTo, "dd/MM/yyyy") : "Hasta"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={selectedDateTo} onSelect={setSelectedDateTo} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Listado de Ventas</CardTitle>
            <CardDescription>
              {filteredSales.length === 0
                ? "No se encontraron ventas"
                : `${filteredSales.length} venta${filteredSales.length > 1 ? "s" : ""} encontrada${
                    filteredSales.length > 1 ? "s" : ""
                  }`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Factura</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Método de Pago</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSales.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        <div className="flex flex-col items-center justify-center py-6">
                          <Filter className="mb-2 h-10 w-10 text-muted-foreground" />
                          <p className="text-muted-foreground">No se encontraron ventas</p>
                          <p className="text-xs text-muted-foreground">Intente con diferentes criterios de búsqueda</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSales.map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell className="font-medium">{sale.id}</TableCell>
                        <TableCell>{formatDate(sale.date)}</TableCell>
                        <TableCell>{sale.customer}</TableCell>
                        <TableCell className="text-right">S/. {sale.total.toFixed(2)}</TableCell>
                        <TableCell>{sale.paymentMethod}</TableCell>
                        <TableCell>{getStatusBadge(sale.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleViewDetails(sale)}>
                            <Eye className="mr-1 h-4 w-4" /> Ver
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
      </div>

      {/* Sale Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
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
                      {(selectedSale.items as SaleItem[]).map((item) => (
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

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Método de Pago</h3>
                  <p>{selectedSale.paymentMethod}</p>
                </div>
                <div>
                  <Button variant="outline" className="w-full" onClick={() => window.print()}>
                    <Download className="mr-2 h-4 w-4" /> Imprimir Factura
                  </Button>
                </div>
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
