"use client"

import { useState, useEffect } from "react"
import { CreditCard, DollarSign, Minus, Plus, Search, ShoppingCart, Trash2, User, X } from "lucide-react"

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { AppSidebar } from "@/components/app-sidebar"

// Sample products data
const productsData = [
  {
    id: 1,
    name: "Camiseta Básica",
    sku: "CB-NEG-M-001",
    price: 29.99,
    stock: 35,
    image: "/placeholder.svg?height=40&width=40",
    category: "Camisetas",
    variants: [
      { id: 1, color: "Negro", size: "M", stock: 15 },
      { id: 2, color: "Negro", size: "L", stock: 10 },
      { id: 3, color: "Blanco", size: "M", stock: 5 },
      { id: 4, color: "Blanco", size: "L", stock: 5 },
    ],
  },
  {
    id: 2,
    name: "Jeans Slim Fit",
    sku: "JSF-AZU-32-002",
    price: 59.99,
    stock: 20,
    image: "/placeholder.svg?height=40&width=40",
    category: "Pantalones",
    variants: [
      { id: 1, color: "Azul", size: "32", stock: 10 },
      { id: 2, color: "Azul", size: "34", stock: 5 },
      { id: 3, color: "Negro", size: "32", stock: 3 },
      { id: 4, color: "Negro", size: "34", stock: 2 },
    ],
  },
  {
    id: 3,
    name: "Vestido Floral",
    sku: "VF-ROJ-S-003",
    price: 79.99,
    stock: 15,
    image: "/placeholder.svg?height=40&width=40",
    category: "Vestidos",
    variants: [
      { id: 1, color: "Rojo", size: "S", stock: 5 },
      { id: 2, color: "Rojo", size: "M", stock: 5 },
      { id: 3, color: "Azul", size: "S", stock: 3 },
      { id: 4, color: "Azul", size: "M", stock: 2 },
    ],
  },
  {
    id: 4,
    name: "Chaqueta de Cuero",
    sku: "CC-NEG-L-004",
    price: 149.99,
    stock: 8,
    image: "/placeholder.svg?height=40&width=40",
    category: "Chaquetas",
    variants: [
      { id: 1, color: "Negro", size: "M", stock: 3 },
      { id: 2, color: "Negro", size: "L", stock: 3 },
      { id: 3, color: "Marrón", size: "M", stock: 1 },
      { id: 4, color: "Marrón", size: "L", stock: 1 },
    ],
  },
  {
    id: 5,
    name: "Sudadera con Capucha",
    sku: "SC-GRI-XL-005",
    price: 49.99,
    stock: 25,
    image: "/placeholder.svg?height=40&width=40",
    category: "Sudaderas",
    variants: [
      { id: 1, color: "Gris", size: "L", stock: 10 },
      { id: 2, color: "Gris", size: "XL", stock: 5 },
      { id: 3, color: "Negro", size: "L", stock: 5 },
      { id: 4, color: "Negro", size: "XL", stock: 5 },
    ],
  },
]

// Sample customers data
const customersData = [
  { id: 1, name: "Juan Pérez", email: "juan@example.com", phone: "987654321" },
  { id: 2, name: "María González", email: "maria@example.com", phone: "987654322" },
  { id: 3, name: "Carlos Rodríguez", email: "carlos@example.com", phone: "987654323" },
  { id: 4, name: "Ana Martínez", email: "ana@example.com", phone: "987654324" },
  { id: 5, name: "Roberto Sánchez", email: "roberto@example.com", phone: "987654325" },
]

// Payment methods
const paymentMethods = [
  { id: "cash", name: "Efectivo", icon: DollarSign },
  { id: "card", name: "Tarjeta", icon: CreditCard },
  { id: "transfer", name: "Transferencia", icon: CreditCard },
]

// Discount types
const discountTypes = [
  { id: "percentage", name: "Porcentaje (%)" },
  { id: "amount", name: "Monto (S/.)" },
]

type CartItem = {
  id: number
  productId: number
  name: string
  variant: string
  price: number
  quantity: number
  subtotal: number
}

export default function NuevaVentaPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredProducts, setFilteredProducts] = useState(productsData)
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null)
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [discountType, setDiscountType] = useState("percentage")
  const [discountValue, setDiscountValue] = useState("")
  const [note, setNote] = useState("")
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [selectedVariant, setSelectedVariant] = useState<any>(null)
  const [quantity, setQuantity] = useState(1)
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false)
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [cashReceived, setCashReceived] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvv, setCardCvv] = useState("")
  const [transferReference, setTransferReference] = useState("")

  // Filter products based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = productsData.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.sku.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredProducts(filtered)
    } else {
      setFilteredProducts(productsData)
    }
  }, [searchTerm])

  // Calculate cart totals
  const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0)
  const tax = subtotal * 0.18 // 18% IGV

  // Calculate discount
  const calculateDiscount = () => {
    if (!discountValue) return 0
    const value = Number.parseFloat(discountValue)
    if (isNaN(value) || value < 0) return 0

    if (discountType === "percentage") {
      return subtotal * (value / 100)
    } else {
      return value > subtotal ? subtotal : value
    }
  }

  const discount = calculateDiscount()
  const total = subtotal + tax - discount

  // Calculate change for cash payments
  const calculateChange = () => {
    if (paymentMethod !== "cash" || !cashReceived) return 0
    const received = Number.parseFloat(cashReceived)
    if (isNaN(received)) return 0
    return received - total > 0 ? received - total : 0
  }

  const change = calculateChange()

  // Handle product selection
  const handleProductSelect = (product: any) => {
    setSelectedProduct(product)
    setSelectedVariant(null)
    setQuantity(1)
    setIsProductDialogOpen(true)
  }

  // Handle adding product to cart
  const handleAddToCart = () => {
    if (!selectedProduct || !selectedVariant || quantity <= 0) {
      toast("Porfavor seleccione una variante y cantidad válida")
      return
    }

    const variantText = `${selectedVariant.color} - ${selectedVariant.size}`
    const cartItemId = Date.now()
    const newItem: CartItem = {
      id: cartItemId,
      productId: selectedProduct.id,
      name: selectedProduct.name,
      variant: variantText,
      price: selectedProduct.price,
      quantity,
      subtotal: selectedProduct.price * quantity,
    }

    setCart([...cart, newItem])
    setIsProductDialogOpen(false)
    setSelectedProduct(null)
    setSelectedVariant(null)
    setQuantity(1)

    toast("Producto agregado al carrito")
  }

  // Handle removing item from cart
  const handleRemoveFromCart = (itemId: number) => {
    setCart(cart.filter((item) => item.id !== itemId))
  }

  // Handle updating item quantity
  const handleUpdateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) return

    setCart(
      cart.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity: newQuantity,
            subtotal: item.price * newQuantity,
          }
        }
        return item
      }),
    )
  }

  // Handle customer selection
  const handleCustomerSelect = (customerId: number) => {
    setSelectedCustomer(customerId)
    setIsCustomerDialogOpen(false)
  }

  // Handle payment method selection
  const handlePaymentMethodSelect = (method: string) => {
    setPaymentMethod(method)
  }

  // Handle completing the sale
  const handleCompleteSale = () => {
    // Validate cart is not empty
    if (cart.length === 0) {
      toast("Agregue al menos un producto para completar la venta.")
      return
    }

    // Validate payment details
    if (paymentMethod === "cash" && (!cashReceived || Number.parseFloat(cashReceived) < total)) {
      toast("El monto recibido debe ser igual o mayor al total.")
      return
    }

    if (paymentMethod === "card" && (!cardNumber || !cardExpiry || !cardCvv)) {
      toast("Complete todos los campos de la tarjeta.")
      return
    }

    if (paymentMethod === "transfer" && !transferReference) {
      toast("Ingrese el número de referencia de la transferencia.")
      return
    }

    // Here you would typically send the sale data to your API
    const saleData = {
      items: cart,
      customer: selectedCustomer,
      subtotal,
      tax,
      discount,
      total,
      paymentMethod,
      paymentDetails: {
        cashReceived: paymentMethod === "cash" ? Number.parseFloat(cashReceived) : null,
        change: paymentMethod === "cash" ? change : null,
        cardNumber: paymentMethod === "card" ? cardNumber : null,
        cardExpiry: paymentMethod === "card" ? cardExpiry : null,
        transferReference: paymentMethod === "transfer" ? transferReference : null,
      },
      note,
      date: new Date(),
    }

    console.log("Sale completed:", saleData)

    // Show success message
    toast(`Venta por S/. ${total.toFixed(2)} procesada exitosamente.`)

    // Reset the form
    setCart([])
    setSelectedCustomer(null)
    setPaymentMethod("cash")
    setDiscountType("percentage")
    setDiscountValue("")
    setNote("")
    setCashReceived("")
    setCardNumber("")
    setCardExpiry("")
    setCardCvv("")
    setTransferReference("")
    setIsPaymentDialogOpen(false)
  }

  // Get selected customer details
  const getSelectedCustomer = () => {
    if (!selectedCustomer) return null
    return customersData.find((customer) => customer.id === selectedCustomer)
  }

  const customer = getSelectedCustomer()

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
                <BreadcrumbPage>Nueva Venta</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Left Column - Product Search and List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Búsqueda de Productos</CardTitle>
                <CardDescription>Busque productos por nombre o código</CardDescription>
                <div className="relative mt-2">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar productos o escanear código de barras..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-[400px] overflow-auto">
                  <Table>
                    <TableHeader className="sticky top-0 bg-card">
                      <TableRow>
                        <TableHead className="w-[80px]">Imagen</TableHead>
                        <TableHead>Producto</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead className="text-right">Precio</TableHead>
                        <TableHead className="text-right">Stock</TableHead>
                        <TableHead className="text-right">Acción</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center">
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
                            <TableCell>{product.sku}</TableCell>
                            <TableCell className="text-right">S/. {product.price.toFixed(2)}</TableCell>
                            <TableCell className="text-right">
                              <span
                                className={
                                  product.stock === 0
                                    ? "text-red-500 font-medium"
                                    : product.stock < 5
                                      ? "text-amber-500 font-medium"
                                      : ""
                                }
                              >
                                {product.stock}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                size="sm"
                                onClick={() => handleProductSelect(product)}
                                disabled={product.stock === 0}
                              >
                                <Plus className="mr-1 h-4 w-4" /> Agregar
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

          {/* Right Column - Cart and Checkout */}
          <div className="flex flex-col gap-4">
            {/* Customer Selection */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Cliente</CardTitle>
                  <Dialog open={isCustomerDialogOpen} onOpenChange={setIsCustomerDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <User className="mr-1 h-4 w-4" /> {customer ? "Cambiar" : "Seleccionar"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Seleccionar Cliente</DialogTitle>
                        <DialogDescription>Elija un cliente para asociar a esta venta</DialogDescription>
                      </DialogHeader>
                      <div className="max-h-[300px] overflow-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Nombre</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Teléfono</TableHead>
                              <TableHead className="text-right">Acción</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {customersData.map((customer) => (
                              <TableRow key={customer.id}>
                                <TableCell className="font-medium">{customer.name}</TableCell>
                                <TableCell>{customer.email}</TableCell>
                                <TableCell>{customer.phone}</TableCell>
                                <TableCell className="text-right">
                                  <Button size="sm" variant="outline" onClick={() => handleCustomerSelect(customer.id)}>
                                    Seleccionar
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCustomerDialogOpen(false)}>
                          Cancelar
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                {customer && (
                  <div className="mt-2 rounded-md border p-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-sm text-muted-foreground">{customer.email}</p>
                        <p className="text-sm text-muted-foreground">{customer.phone}</p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => setSelectedCustomer(null)} className="h-6 w-6">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardHeader>
            </Card>

            {/* Shopping Cart */}
            <Card className="flex-1">
              <CardHeader className="pb-3">
                <CardTitle>Carrito de Compra</CardTitle>
                <CardDescription>
                  {cart.length === 0
                    ? "No hay productos en el carrito"
                    : `${cart.length} producto${cart.length > 1 ? "s" : ""} en el carrito`}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-[300px] overflow-auto">
                  <Table>
                    <TableHeader className="sticky top-0 bg-card">
                      <TableRow>
                        <TableHead>Producto</TableHead>
                        <TableHead className="text-right">Precio</TableHead>
                        <TableHead className="text-center">Cant.</TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cart.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center">
                            <div className="flex flex-col items-center justify-center py-6">
                              <ShoppingCart className="mb-2 h-10 w-10 text-muted-foreground" />
                              <p className="text-muted-foreground">El carrito está vacío</p>
                              <p className="text-xs text-muted-foreground">Agregue productos para comenzar una venta</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        cart.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-xs text-muted-foreground">{item.variant}</p>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">S/. {item.price.toFixed(2)}</TableCell>
                            <TableCell>
                              <div className="flex items-center justify-center">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">S/. {item.subtotal.toFixed(2)}</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => handleRemoveFromCart(item.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-stretch border-t p-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>S/. {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>IGV (18%):</span>
                    <span>S/. {tax.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Descuento:</span>
                    <div className="flex items-center gap-2">
                      <Select value={discountType} onValueChange={setDiscountType}>
                        <SelectTrigger className="h-7 w-[110px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {discountTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        value={discountValue}
                        onChange={(e) => setDiscountValue(e.target.value)}
                        className="h-7 w-[80px]"
                        placeholder="0"
                      />
                      <span>S/. {discount.toFixed(2)}</span>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>S/. {total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <Label htmlFor="note">Nota (opcional)</Label>
                  <Input
                    id="note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Agregar nota a la venta..."
                  />
                </div>

                <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="mt-4" size="lg" disabled={cart.length === 0}>
                      Procesar Pago
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Procesar Pago</DialogTitle>
                      <DialogDescription>Complete los detalles del pago para finalizar la venta</DialogDescription>
                    </DialogHeader>
                    <Tabs defaultValue="cash" value={paymentMethod} onValueChange={handlePaymentMethodSelect}>
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="cash">Efectivo</TabsTrigger>
                        <TabsTrigger value="card">Tarjeta</TabsTrigger>
                        <TabsTrigger value="transfer">Transferencia</TabsTrigger>
                      </TabsList>
                      <TabsContent value="cash" className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="cash-received">Monto Recibido</Label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                              S/.
                            </span>
                            <Input
                              id="cash-received"
                              type="number"
                              value={cashReceived}
                              onChange={(e) => setCashReceived(e.target.value)}
                              className="pl-8"
                              placeholder="0.00"
                            />
                          </div>
                        </div>
                        {Number.parseFloat(cashReceived) > 0 && (
                          <div className="rounded-md bg-muted p-3">
                            <div className="flex justify-between">
                              <span>Total a Pagar:</span>
                              <span>S/. {total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Monto Recibido:</span>
                              <span>S/. {Number.parseFloat(cashReceived).toFixed(2)}</span>
                            </div>
                            <Separator className="my-2" />
                            <div className="flex justify-between font-bold">
                              <span>Cambio:</span>
                              <span>S/. {change.toFixed(2)}</span>
                            </div>
                          </div>
                        )}
                      </TabsContent>
                      <TabsContent value="card" className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="card-number">Número de Tarjeta</Label>
                          <Input
                            id="card-number"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="XXXX XXXX XXXX XXXX"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="card-expiry">Fecha de Expiración</Label>
                            <Input
                              id="card-expiry"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              placeholder="MM/AA"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="card-cvv">CVV</Label>
                            <Input
                              id="card-cvv"
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value)}
                              placeholder="XXX"
                            />
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="transfer" className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="transfer-reference">Número de Referencia</Label>
                          <Input
                            id="transfer-reference"
                            value={transferReference}
                            onChange={(e) => setTransferReference(e.target.value)}
                            placeholder="Ingrese el número de referencia"
                          />
                        </div>
                        <div className="rounded-md bg-muted p-3">
                          <p className="text-sm">
                            Instrucciones: Solicite al cliente que realice la transferencia a la siguiente cuenta:
                          </p>
                          <p className="mt-2 font-medium">Banco: BCP</p>
                          <p className="font-medium">Cuenta: 123-456789-0</p>
                          <p className="font-medium">Titular: Mi Empresa S.A.</p>
                          <p className="mt-2 text-sm">
                            Una vez confirmada la transferencia, ingrese el número de referencia proporcionado por el
                            cliente.
                          </p>
                        </div>
                      </TabsContent>
                    </Tabs>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleCompleteSale}>Finalizar Venta</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      {/* Product Selection Dialog */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Producto</DialogTitle>
            <DialogDescription>Seleccione la variante y cantidad del producto</DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4">
                <img
                  src={selectedProduct.image || "/placeholder.svg"}
                  alt={selectedProduct.name}
                  className="h-16 w-16 rounded-md object-cover"
                />
                <div>
                  <h3 className="font-medium">{selectedProduct.name}</h3>
                  <p className="text-sm text-muted-foreground">SKU: {selectedProduct.sku}</p>
                  <p className="text-sm font-medium">Precio: S/. {selectedProduct.price.toFixed(2)}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="variant">Variante</Label>
                <Select onValueChange={(value) => setSelectedVariant(JSON.parse(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar variante" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedProduct.variants.map((variant: any) => (
                      <SelectItem key={variant.id} value={JSON.stringify(variant)} disabled={variant.stock === 0}>
                        {variant.color} - {variant.size} ({variant.stock} disponibles)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Cantidad</Label>
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
                    className="mx-2 text-center"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={selectedVariant && quantity >= selectedVariant.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {selectedVariant && (
                  <p className="text-xs text-muted-foreground">{selectedVariant.stock} unidades disponibles</p>
                )}
              </div>
              {selectedVariant && quantity > 0 && (
                <div className="rounded-md bg-muted p-3">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>S/. {(selectedProduct.price * quantity).toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsProductDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddToCart} disabled={!selectedVariant || quantity <= 0}>
              Agregar al Carrito
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </SidebarInset>
      </SidebarProvider>
    </>
  )
}
