"use client"

import { useState } from "react"
import { ArrowLeft, Check, Search, ShoppingBag } from "lucide-react"
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { AppSidebar } from "@/components/app-sidebar"

// Sample sales data (same as in historial/page.tsx)
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
]

// Return reasons
const returnReasons = [
  { value: "defective", label: "Producto defectuoso" },
  { value: "wrong-size", label: "Talla incorrecta" },
  { value: "wrong-item", label: "Producto incorrecto" },
  { value: "not-as-described", label: "No es como se describió" },
  { value: "not-satisfied", label: "No satisfecho" },
  { value: "other", label: "Otro" },
]

// Refund methods
const refundMethods = [
  { value: "original", label: "Método original de pago" },
  { value: "cash", label: "Efectivo" },
  { value: "store-credit", label: "Crédito en tienda" },
]

export default function DevolucionesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredSales, setFilteredSales] = useState<any[]>([])
  const [selectedSale, setSelectedSale] = useState<any>(null)
  const [step, setStep] = useState(1) // 1: Search, 2: Select Items, 3: Refund Details, 4: Confirmation
  const [selectedItems, setSelectedItems] = useState<any[]>([])
  const [returnReason, setReturnReason] = useState("")
  const [otherReason, setOtherReason] = useState("")
  const [refundMethod, setRefundMethod] = useState("")
  const [refundAmount, setRefundAmount] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [returnNote, setReturnNote] = useState("")

  // Handle search
  const handleSearch = () => {
    if (!searchTerm) {
      toast("Campo vacio porfavor ingrese un número de factura o cliente")
      return
    }

    const filtered = salesData.filter(
      (sale) =>
        sale.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.customer.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (filtered.length === 0) {
      toast("No se encontraron resultados o ventas completadas") 
    }

    setFilteredSales(filtered)
  }

  // Handle sale selection
  const handleSelectSale = (sale: any) => {
    // Only completed sales can be returned
    if (sale.status !== "completed") {
      toast("Sola las ventas completadas pueden ser devueltas")
      return
    }

    setSelectedSale(sale)
    setSelectedItems([])
    setStep(2)
  }

  // Handle item selection for return
  const handleItemSelection = (item: any, isSelected: boolean) => {
    if (isSelected) {
      setSelectedItems([...selectedItems, { ...item, returnQuantity: 1 }])
    } else {
      setSelectedItems(selectedItems.filter((i) => i.id !== item.id))
    }
  }

  // Handle return quantity change
  const handleQuantityChange = (itemId: number, quantity: number) => {
    const item = selectedSale.items.find((i: any) => i.id === itemId)
    if (!item || quantity < 1 || quantity > item.quantity) return

    setSelectedItems(selectedItems.map((i) => (i.id === itemId ? { ...i, returnQuantity: quantity } : i)))
  }

  // Calculate refund amount
  const calculateRefundAmount = () => {
    const itemsTotal = selectedItems.reduce((sum, item) => sum + item.price * item.returnQuantity, 0)
    const taxRate = 0.18 // 18% IGV
    const tax = itemsTotal * taxRate
    return itemsTotal + tax
  }

  // Handle continue to refund details
  const handleContinueToRefundDetails = () => {
    if (selectedItems.length === 0) {
      toast("Porfavor seleccione al menos un producto para devolver")
      return
    }

    const amount = calculateRefundAmount()
    setRefundAmount(amount)
    setStep(3)
  }

  // Handle continue to confirmation
  const handleContinueToConfirmation = () => {
    if (!returnReason) {
      toast("Porfavor seleccione una razón de devolución")
      return
    }

    if (returnReason === "other" && !otherReason) {
      toast("Porfavor especifique la razón de devolución")
      return
    }

    if (!refundMethod) {
      toast("Porfavor seleccione un método de reembolso")
      return
    }

    setStep(4)
  }

  // Handle process return
  const handleProcessReturn = () => {
    setIsProcessing(true)

    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false)
      setIsComplete(true)

      // Here you would typically send the return data to your API
      console.log("Return processed:", {
        saleId: selectedSale.id,
        customer: selectedSale.customer,
        items: selectedItems,
        returnReason: returnReason === "other" ? otherReason : returnReason,
        refundMethod,
        refundAmount,
        returnNote,
        date: new Date(),
      })
    }, 2000)
  }

  // Handle reset
  const handleReset = () => {
    setSearchTerm("")
    setFilteredSales([])
    setSelectedSale(null)
    setSelectedItems([])
    setReturnReason("")
    setOtherReason("")
    setRefundMethod("")
    setRefundAmount(0)
    setIsComplete(false)
    setReturnNote("")
    setStep(1)
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMM yyyy, HH:mm", { locale: es })
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
                <BreadcrumbPage>Devoluciones</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Gestión de Devoluciones</h1>
          {step > 1 && !isComplete && (
            <Button variant="outline" onClick={handleReset}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Volver al inicio
            </Button>
          )}
        </div>

        {/* Step 1: Search for Sale */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Buscar Venta</CardTitle>
              <CardDescription>
                Ingrese el número de factura o nombre del cliente para buscar la venta original
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar por número de factura o cliente..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button onClick={handleSearch}>Buscar</Button>
              </div>

              {filteredSales.length > 0 && (
                <div className="mt-4 rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Factura</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSales.map((sale) => (
                        <TableRow key={sale.id}>
                          <TableCell className="font-medium">{sale.id}</TableCell>
                          <TableCell>{formatDate(sale.date)}</TableCell>
                          <TableCell>{sale.customer}</TableCell>
                          <TableCell className="text-right">S/. {sale.total.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge
                              variant={sale.status === "completed" ? "default" : "secondary"}
                              className={
                                sale.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                  : sale.status === "cancelled"
                                    ? "bg-red-100 text-red-800 hover:bg-red-100"
                                    : ""
                              }
                            >
                              {sale.status === "completed"
                                ? "Completada"
                                : sale.status === "pending"
                                  ? "Pendiente"
                                  : "Cancelada"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSelectSale(sale)}
                              disabled={sale.status !== "completed"}
                            >
                              Seleccionar
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 2: Select Items to Return */}
        {step === 2 && selectedSale && (
          <Card>
            <CardHeader>
              <CardTitle>Seleccionar Productos a Devolver</CardTitle>
              <CardDescription>
                Seleccione los productos que desea devolver de la venta {selectedSale.id}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 rounded-md border p-4">
                <div className="grid gap-2 md:grid-cols-3">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Factura</h3>
                    <p className="font-medium">{selectedSale.id}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Fecha</h3>
                    <p>{formatDate(selectedSale.date)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Cliente</h3>
                    <p>{selectedSale.customer}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]"></TableHead>
                      <TableHead>Producto</TableHead>
                      <TableHead>Variante</TableHead>
                      <TableHead className="text-right">Precio</TableHead>
                      <TableHead className="text-center">Cant. Original</TableHead>
                      <TableHead className="text-center">Cant. a Devolver</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedSale.items.map((item: any) => {
                      const isSelected = selectedItems.some((i) => i.id === item.id)
                      const selectedItem = selectedItems.find((i) => i.id === item.id)

                      return (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked) => handleItemSelection(item, !!checked)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.variant}</TableCell>
                          <TableCell className="text-right">S/. {item.price.toFixed(2)}</TableCell>
                          <TableCell className="text-center">{item.quantity}</TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center">
                              <Input
                                type="number"
                                min="1"
                                max={item.quantity}
                                value={selectedItem?.returnQuantity || 1}
                                onChange={(e) => handleQuantityChange(item.id, Number.parseInt(e.target.value) || 1)}
                                className="w-16 text-center"
                                disabled={!isSelected}
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                Atrás
              </Button>
              <Button onClick={handleContinueToRefundDetails} disabled={selectedItems.length === 0}>
                Continuar
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Step 3: Refund Details */}
        {step === 3 && selectedSale && (
          <Card>
            <CardHeader>
              <CardTitle>Detalles de la Devolución</CardTitle>
              <CardDescription>Complete los detalles para procesar la devolución de {selectedSale.id}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="return-reason">Razón de la Devolución</Label>
                <Select value={returnReason} onValueChange={setReturnReason}>
                  <SelectTrigger id="return-reason">
                    <SelectValue placeholder="Seleccionar razón" />
                  </SelectTrigger>
                  <SelectContent>
                    {returnReasons.map((reason) => (
                      <SelectItem key={reason.value} value={reason.value}>
                        {reason.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {returnReason === "other" && (
                <div className="space-y-2">
                  <Label htmlFor="other-reason">Especifique la Razón</Label>
                  <Textarea
                    id="other-reason"
                    value={otherReason}
                    onChange={(e) => setOtherReason(e.target.value)}
                    placeholder="Describa la razón de la devolución..."
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="return-note">Nota Adicional (opcional)</Label>
                <Textarea
                  id="return-note"
                  value={returnNote}
                  onChange={(e) => setReturnNote(e.target.value)}
                  placeholder="Agregue cualquier nota o comentario adicional..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="refund-method">Método de Reembolso</Label>
                <Select value={refundMethod} onValueChange={setRefundMethod}>
                  <SelectTrigger id="refund-method">
                    <SelectValue placeholder="Seleccionar método" />
                  </SelectTrigger>
                  <SelectContent>
                    {refundMethods.map((method) => (
                      <SelectItem key={method.value} value={method.value}>
                        {method.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {refundMethod === "original" && (
                <div className="rounded-md bg-muted p-3">
                  <p className="text-sm">
                    El reembolso se realizará al método de pago original: <strong>{selectedSale.paymentMethod}</strong>
                  </p>
                </div>
              )}

              <div className="rounded-md border p-4">
                <h3 className="mb-2 font-medium">Resumen de la Devolución</h3>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Productos seleccionados:</span>
                    <span>{selectedItems.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cantidad total a devolver:</span>
                    <span>{selectedItems.reduce((sum, item) => sum + item.returnQuantity, 0)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold">
                    <span>Monto a reembolsar:</span>
                    <span>S/. {refundAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                Atrás
              </Button>
              <Button onClick={handleContinueToConfirmation}>Continuar</Button>
            </CardFooter>
          </Card>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && selectedSale && !isComplete && (
          <Card>
            <CardHeader>
              <CardTitle>Confirmar Devolución</CardTitle>
              <CardDescription>Revise los detalles y confirme la devolución de {selectedSale.id}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border p-4">
                <h3 className="mb-2 font-medium">Detalles de la Venta Original</h3>
                <div className="grid gap-2 md:grid-cols-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Factura</p>
                    <p className="font-medium">{selectedSale.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Fecha</p>
                    <p>{formatDate(selectedSale.date)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Cliente</p>
                    <p>{selectedSale.customer}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-md border p-4">
                <h3 className="mb-2 font-medium">Productos a Devolver</h3>
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
                    {selectedItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.variant}</TableCell>
                        <TableCell className="text-right">S/. {item.price.toFixed(2)}</TableCell>
                        <TableCell className="text-center">{item.returnQuantity}</TableCell>
                        <TableCell className="text-right">
                          S/. {(item.price * item.returnQuantity).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="rounded-md border p-4">
                <h3 className="mb-2 font-medium">Detalles de la Devolución</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Razón de la Devolución</p>
                    <p>
                      {returnReason === "other"
                        ? otherReason
                        : returnReasons.find((r) => r.value === returnReason)?.label}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Método de Reembolso</p>
                    <p>{refundMethods.find((m) => m.value === refundMethod)?.label}</p>
                  </div>
                </div>
                {returnNote && (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground">Nota Adicional</p>
                    <p>{returnNote}</p>
                  </div>
                )}
              </div>

              <div className="rounded-md border p-4">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>
                      S/. {selectedItems.reduce((sum, item) => sum + item.price * item.returnQuantity, 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>IGV (18%):</span>
                    <span>
                      S/.{" "}
                      {(selectedItems.reduce((sum, item) => sum + item.price * item.returnQuantity, 0) * 0.18).toFixed(
                        2,
                      )}
                    </span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold">
                    <span>Total a Reembolsar:</span>
                    <span>S/. {refundAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(3)}>
                Atrás
              </Button>
              <Button onClick={handleProcessReturn} disabled={isProcessing}>
                {isProcessing ? "Procesando..." : "Procesar Devolución"}
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Step 5: Completion */}
        {isComplete && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-green-600">
                <Check className="mr-2 h-5 w-5" /> Devolución Completada
              </CardTitle>
              <CardDescription>La devolución ha sido procesada exitosamente</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md bg-green-50 p-6 text-center dark:bg-green-950">
                <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-green-600" />
                <h3 className="mb-2 text-xl font-bold text-green-600">¡Devolución Exitosa!</h3>
                <p>
                  La devolución para la factura <strong>{selectedSale?.id}</strong> ha sido procesada correctamente.
                </p>
                <p className="mt-2">
                  Se ha reembolsado <strong>S/. {refundAmount.toFixed(2)}</strong> al cliente{" "}
                  <strong>{selectedSale?.customer}</strong>.
                </p>
              </div>

              <div className="rounded-md border p-4">
                <h3 className="mb-2 font-medium">Detalles del Reembolso</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Método de Reembolso</p>
                    <p className="font-medium">
                      {refundMethod === "original"
                        ? `Método original (${selectedSale?.paymentMethod})`
                        : refundMethod === "cash"
                          ? "Efectivo"
                          : "Crédito en tienda"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Número de Referencia</p>
                    <p className="font-medium">
                      REF-
                      {Math.floor(Math.random() * 10000)
                        .toString()
                        .padStart(4, "0")}
                    </p>
                  </div>
                </div>
              </div>

              {refundMethod === "cash" && (
                <div className="rounded-md bg-muted p-4">
                  <h3 className="mb-2 font-medium">Instrucciones para Reembolso en Efectivo</h3>
                  <p className="text-sm">
                    Por favor entregue <strong>S/. {refundAmount.toFixed(2)}</strong> al cliente y solicite que firme el
                    comprobante de devolución.
                  </p>
                </div>
              )}

              {refundMethod === "store-credit" && (
                <div className="rounded-md bg-muted p-4">
                  <h3 className="mb-2 font-medium">Instrucciones para Crédito en Tienda</h3>
                  <p className="text-sm">
                    Se ha generado un crédito en tienda por <strong>S/. {refundAmount.toFixed(2)}</strong> para el
                    cliente <strong>{selectedSale?.customer}</strong>. El cliente puede usar este crédito en su próxima
                    compra.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button onClick={handleReset}>Procesar Nueva Devolución</Button>
            </CardFooter>
          </Card>
        )}
      </div>
      </SidebarInset>
      </SidebarProvider>
    </>
  )
}
