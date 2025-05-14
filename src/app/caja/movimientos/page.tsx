"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import {
  AlertCircle,
  ArrowDownCircle,
  ArrowUpCircle,
  Calendar,
  CheckCircle2,
  DollarSign,
  Filter,
  Plus,
  Search,
  User,
} from "lucide-react"

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "sonner"
import { AppSidebar } from "@/components/app-sidebar"

// Simulación de datos de movimientos
const movimientosData = [
  {
    id: 1,
    tipo: "ingreso",
    monto: 100,
    motivo: "Depósito adicional",
    usuario: "Juan Pérez",
    fecha: "2025-05-13T10:30:00",
  },
  {
    id: 2,
    tipo: "egreso",
    monto: 50,
    motivo: "Pago a proveedor",
    usuario: "Juan Pérez",
    fecha: "2025-05-13T11:45:00",
  },
  {
    id: 3,
    tipo: "ingreso",
    monto: 75.5,
    motivo: "Venta de artículo en efectivo",
    usuario: "María Gómez",
    fecha: "2025-05-13T13:20:00",
  },
  {
    id: 4,
    tipo: "egreso",
    monto: 25,
    motivo: "Compra de suministros",
    usuario: "Juan Pérez",
    fecha: "2025-05-13T14:10:00",
  },
  {
    id: 5,
    tipo: "egreso",
    monto: 15.75,
    motivo: "Pago de servicio de limpieza",
    usuario: "María Gómez",
    fecha: "2025-05-12T09:30:00",
  },
  {
    id: 6,
    tipo: "ingreso",
    monto: 200,
    motivo: "Cobro de factura pendiente",
    usuario: "Juan Pérez",
    fecha: "2025-05-12T16:45:00",
  },
  {
    id: 7,
    tipo: "egreso",
    monto: 80,
    motivo: "Pago de transporte",
    usuario: "María Gómez",
    fecha: "2025-05-11T11:20:00",
  },
]

// Simulación de usuario actual
const usuarioActual = {
  id: 1,
  nombre: "Juan Pérez",
  rol: "Cajero",
}

export default function MovimientosCajaPage() {
  const [cajaAbierta, setCajaAbierta] = useState(true)
  const [verificando, setVerificando] = useState(true)
  const [movimientos, setMovimientos] = useState(movimientosData)
  const [filteredMovimientos, setFilteredMovimientos] = useState(movimientosData)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDateFrom, setSelectedDateFrom] = useState<Date | undefined>(undefined)
  const [selectedDateTo, setSelectedDateTo] = useState<Date | undefined>(undefined)
  const [selectedTipo, setSelectedTipo] = useState("todos")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [nuevoMovimiento, setNuevoMovimiento] = useState({
    tipo: "ingreso",
    monto: "",
    motivo: "",
  })
  const [cargando, setCargando] = useState(false)

  // Verificar si hay una caja abierta al cargar la página
  useEffect(() => {
    // Simulación de verificación con API
    const verificarCajaAbierta = async () => {
      setVerificando(true)
      // Simulamos una llamada a API
      setTimeout(() => {
        // Para propósitos de demostración, asumimos que hay una caja abierta
        setCajaAbierta(true)
        setVerificando(false)
      }, 1000)
    }

    verificarCajaAbierta()
  }, [])

  // Filtrar movimientos cuando cambian los filtros
  useEffect(() => {
    let filtered = movimientos

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (mov) =>
          mov.motivo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mov.usuario.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filtrar por tipo
    if (selectedTipo !== "todos") {
      filtered = filtered.filter((mov) => mov.tipo === selectedTipo)
    }

    // Filtrar por fecha desde
    if (selectedDateFrom) {
      filtered = filtered.filter((mov) => new Date(mov.fecha) >= selectedDateFrom)
    }

    // Filtrar por fecha hasta
    if (selectedDateTo) {
      const dateToEnd = new Date(selectedDateTo)
      dateToEnd.setHours(23, 59, 59, 999)
      filtered = filtered.filter((mov) => new Date(mov.fecha) <= dateToEnd)
    }

    // Ordenar por fecha descendente
    filtered = [...filtered].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())

    setFilteredMovimientos(filtered)
  }, [movimientos, searchTerm, selectedTipo, selectedDateFrom, selectedDateTo])

  // Manejar registro de nuevo movimiento
  const handleRegistrarMovimiento = async () => {
    // Validar campos
    if (!nuevoMovimiento.monto || Number.parseFloat(nuevoMovimiento.monto) <= 0) {
      toast("El monto debe ser mayor a cero.")
      return
    }

    if (!nuevoMovimiento.motivo) {
      toast("El motivo es obligatorio.")
      return
    }

    setCargando(true)

    // Simulación de registro de movimiento
    try {
      // Simulamos una llamada a API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Crear nuevo movimiento
      const nuevoId = Math.max(...movimientos.map((m) => m.id)) + 1
      const movimiento = {
        id: nuevoId,
        tipo: nuevoMovimiento.tipo,
        monto: Number.parseFloat(nuevoMovimiento.monto),
        motivo: nuevoMovimiento.motivo,
        usuario: usuarioActual.nombre,
        fecha: new Date().toISOString(),
      }

      // Actualizar estado
      setMovimientos([movimiento, ...movimientos])

      // Mostrar mensaje de éxito
      toast(`Se ha registrado un ${
          nuevoMovimiento.tipo === "ingreso" ? "ingreso" : "egreso"
        } de S/. ${nuevoMovimiento.monto}`)

      // Cerrar diálogo y resetear formulario
      setIsDialogOpen(false)
      setNuevoMovimiento({
        tipo: "ingreso",
        monto: "",
        motivo: "",
      })
    } catch (error) {
      console.error("Error al registrar movimiento:", error)
      toast("Ha ocurrido un error al intentar registrar el movimiento. Intente nuevamente.")
    } finally {
      setCargando(false)
    }
  }

  // Calcular totales
  const totalIngresos = filteredMovimientos
    .filter((mov) => mov.tipo === "ingreso")
    .reduce((sum, mov) => sum + mov.monto, 0)

  const totalEgresos = filteredMovimientos
    .filter((mov) => mov.tipo === "egreso")
    .reduce((sum, mov) => sum + mov.monto, 0)

  // Si está verificando, mostrar indicador de carga
  if (verificando) {
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
                  <BreadcrumbLink href="/caja">Caja</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Movimientos</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Card>
            <CardHeader>
              <CardTitle>Verificando estado de caja</CardTitle>
              <CardDescription>Por favor espere mientras verificamos si hay una caja abierta...</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-10">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </CardContent>
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
                <BreadcrumbLink href="/caja">Caja</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Movimientos</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Movimientos de Caja</h1>
          <div className="rounded-md bg-muted px-3 py-1 text-sm">
            {cajaAbierta ? (
              <span className="flex items-center text-green-600">
                <CheckCircle2 className="mr-1 h-4 w-4" /> Caja abierta
              </span>
            ) : (
              <span className="flex items-center text-amber-600">
                <AlertCircle className="mr-1 h-4 w-4" /> Caja cerrada
              </span>
            )}
          </div>
        </div>

        {!cajaAbierta && (
          <Alert variant="destructive">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle>No hay caja abierta</AlertTitle>
            <AlertDescription>
              No se encontró ninguna caja abierta. Para registrar movimientos, primero debe abrir una caja.
            </AlertDescription>
          </Alert>
        )}

        {cajaAbierta && (
          <>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="w-full md:w-auto">
                    <Plus className="mr-2 h-5 w-5" /> Registrar Movimiento
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Registrar Movimiento</DialogTitle>
                    <DialogDescription>Complete los datos para registrar un nuevo movimiento de caja</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="tipo-movimiento">Tipo de Movimiento</Label>
                      <Select
                        value={nuevoMovimiento.tipo}
                        onValueChange={(value) => setNuevoMovimiento({ ...nuevoMovimiento, tipo: value })}
                      >
                        <SelectTrigger id="tipo-movimiento">
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ingreso">Ingreso</SelectItem>
                          <SelectItem value="egreso">Egreso</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="monto-movimiento" className="flex items-center">
                        Monto <span className="ml-1 text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="monto-movimiento"
                          type="number"
                          step="0.01"
                          min="0.01"
                          placeholder="0.00"
                          className="pl-9"
                          value={nuevoMovimiento.monto}
                          onChange={(e) => setNuevoMovimiento({ ...nuevoMovimiento, monto: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="motivo-movimiento" className="flex items-center">
                        Motivo / Descripción <span className="ml-1 text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="motivo-movimiento"
                        placeholder="Ingrese el motivo del movimiento"
                        value={nuevoMovimiento.motivo}
                        onChange={(e) => setNuevoMovimiento({ ...nuevoMovimiento, motivo: e.target.value })}
                        rows={3}
                        required
                      />
                    </div>

                    <div className="rounded-md bg-muted p-3">
                      <div className="flex items-center">
                        <User className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          Registrando como: <strong>{usuarioActual.nombre}</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleRegistrarMovimiento} disabled={cargando}>
                      {cargando ? (
                        <>
                          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                          Procesando...
                        </>
                      ) : (
                        "Registrar"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <div className="grid grid-cols-2 gap-2 md:flex md:items-center">
                <div className="rounded-lg border bg-card p-3 text-center">
                  <p className="text-xs text-muted-foreground">Ingresos</p>
                  <p className="text-lg font-bold text-green-600">S/. {totalIngresos.toFixed(2)}</p>
                </div>
                <div className="rounded-lg border bg-card p-3 text-center">
                  <p className="text-xs text-muted-foreground">Egresos</p>
                  <p className="text-lg font-bold text-red-600">S/. {totalEgresos.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Filtros de Búsqueda</CardTitle>
                <CardDescription>Filtre los movimientos por diferentes criterios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-2">
                    <Label htmlFor="search">Buscar</Label>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search"
                        type="search"
                        placeholder="Buscar por motivo o usuario..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2 col-span-1 md:col-span-1">
                    <Label>Rango de Fechas</Label>
                    <div className="flex flex-col sm:flex-row items-center gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal mb-2 sm:mb-0">
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
                    <Label htmlFor="tipo">Tipo de Movimiento</Label>
                    <Select value={selectedTipo} onValueChange={setSelectedTipo}>
                      <SelectTrigger id="tipo">
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="ingreso">Ingresos</SelectItem>
                        <SelectItem value="egreso">Egresos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setSearchTerm("")
                        setSelectedDateFrom(undefined)
                        setSelectedDateTo(undefined)
                        setSelectedTipo("todos")
                      }}
                    >
                      <Filter className="mr-2 h-4 w-4" /> Limpiar Filtros
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Listado de Movimientos</CardTitle>
                <CardDescription>
                  {filteredMovimientos.length === 0
                    ? "No se encontraron movimientos"
                    : `${filteredMovimientos.length} movimiento${
                        filteredMovimientos.length > 1 ? "s" : ""
                      } encontrado${filteredMovimientos.length > 1 ? "s" : ""}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Motivo</TableHead>
                        <TableHead className="text-right">Monto</TableHead>
                        <TableHead>Usuario</TableHead>
                        <TableHead>Fecha</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMovimientos.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center">
                            <div className="flex flex-col items-center justify-center py-6">
                              <Filter className="mb-2 h-10 w-10 text-muted-foreground" />
                              <p className="text-muted-foreground">No se encontraron movimientos</p>
                              <p className="text-xs text-muted-foreground">
                                Intente con diferentes criterios de búsqueda o registre un nuevo movimiento
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredMovimientos.map((movimiento) => (
                          <TableRow key={movimiento.id}>
                            <TableCell>
                              {movimiento.tipo === "ingreso" ? (
                                <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300">
                                  <ArrowUpCircle className="mr-1 h-3 w-3" /> Ingreso
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900 dark:text-red-300"
                                >
                                  <ArrowDownCircle className="mr-1 h-3 w-3" /> Egreso
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="font-medium">{movimiento.motivo}</TableCell>
                            <TableCell className="text-right">
                              <span
                                className={
                                  movimiento.tipo === "ingreso"
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-red-600 dark:text-red-400"
                                }
                              >
                                S/. {movimiento.monto.toFixed(2)}
                              </span>
                            </TableCell>
                            <TableCell>{movimiento.usuario}</TableCell>
                            <TableCell>
                              {format(new Date(movimiento.fecha), "dd/MM/yyyy HH:mm", { locale: es })}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
      </SidebarInset>
</SidebarProvider>
    </>
  )
}
