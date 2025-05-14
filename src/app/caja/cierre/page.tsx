"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { AlertCircle, CheckCircle2, CreditCard, DollarSign, LockKeyhole, QrCode, Smartphone, X } from "lucide-react"

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
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "sonner"
import { AppSidebar } from "@/components/app-sidebar"

// Simulación de datos de caja actual
const cajaActual = {
  id: 1,
  montoInicial: 500,
  fechaApertura: "2025-05-13T08:30:00",
  tipoCaja: "principal",
  usuarioApertura: {
    id: 1,
    nombre: "Juan Pérez",
  },
  ventas: [
    {
      id: 1,
      monto: 150.5,
      metodoPago: "efectivo",
    },
    {
      id: 2,
      monto: 75.25,
      metodoPago: "tarjeta",
    },
    {
      id: 3,
      monto: 200,
      metodoPago: "efectivo",
    },
    {
      id: 4,
      monto: 120,
      metodoPago: "yape",
    },
    {
      id: 5,
      monto: 45.75,
      metodoPago: "plin",
    },
    {
      id: 6,
      monto: 180.3,
      metodoPago: "tarjeta",
    },
  ],
  movimientos: [
    {
      id: 1,
      tipo: "ingreso",
      monto: 100,
      motivo: "Depósito adicional",
    },
    {
      id: 2,
      tipo: "egreso",
      monto: 50,
      motivo: "Pago a proveedor",
    },
  ],
}

// Simulación de usuario actual
const usuarioActual = {
  id: 1,
  nombre: "Juan Pérez",
  rol: "Cajero",
}

export default function CierreCajaPage() {
  const [cajaAbierta, setCajaAbierta] = useState(true)
  const [verificando, setVerificando] = useState(true)
  const [efectivoContado, setEfectivoContado] = useState("")
  const [observaciones, setObservaciones] = useState("")
  const [cargando, setCargando] = useState(false)
  const [cierreCorrecto, setCierreCorrecto] = useState(false)
  const [fechaHoraActual, setFechaHoraActual] = useState(new Date())

  // Calcular totales por método de pago
  const totalEfectivo = cajaActual.ventas
    .filter((venta) => venta.metodoPago === "efectivo")
    .reduce((sum, venta) => sum + venta.monto, 0)

  const totalTarjeta = cajaActual.ventas
    .filter((venta) => venta.metodoPago === "tarjeta")
    .reduce((sum, venta) => sum + venta.monto, 0)

  const totalYape = cajaActual.ventas
    .filter((venta) => venta.metodoPago === "yape")
    .reduce((sum, venta) => sum + venta.monto, 0)

  const totalPlin = cajaActual.ventas
    .filter((venta) => venta.metodoPago === "plin")
    .reduce((sum, venta) => sum + venta.monto, 0)

  // Calcular ingresos y egresos de movimientos
  const totalIngresos = cajaActual.movimientos
    .filter((mov) => mov.tipo === "ingreso")
    .reduce((sum, mov) => sum + mov.monto, 0)

  const totalEgresos = cajaActual.movimientos
    .filter((mov) => mov.tipo === "egreso")
    .reduce((sum, mov) => sum + mov.monto, 0)

  // Calcular saldo esperado en efectivo
  const saldoEsperado = cajaActual.montoInicial + totalEfectivo + totalIngresos - totalEgresos

  // Calcular diferencia
  const diferencia = efectivoContado ? Number.parseFloat(efectivoContado) - saldoEsperado : 0

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

  // Actualizar la fecha y hora cada segundo
  useEffect(() => {
    const intervalo = setInterval(() => {
      setFechaHoraActual(new Date())
    }, 1000)

    return () => clearInterval(intervalo)
  }, [])

  // Manejar el cierre de caja
  const handleCerrarCaja = async () => {
    // Validar efectivo contado
    if (!efectivoContado || Number.parseFloat(efectivoContado) < 0) {
      toast("El monto de efectivo contado debe ser mayor o igual a cero.")
      return
    }

    setCargando(true)

    // Simulación de cierre de caja
    try {
      // Simulamos una llamada a API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Datos que se enviarían a la API
      const datosCierre = {
        cajaId: cajaActual.id,
        efectivoContado: Number.parseFloat(efectivoContado),
        diferencia,
        observaciones,
        fechaCierre: fechaHoraActual.toISOString(),
        usuarioId: usuarioActual.id,
        totalVentas: totalEfectivo + totalTarjeta + totalYape + totalPlin,
        desglose: {
          efectivo: totalEfectivo,
          tarjeta: totalTarjeta,
          yape: totalYape,
          plin: totalPlin,
        },
        movimientos: {
          ingresos: totalIngresos,
          egresos: totalEgresos,
        },
      }

      console.log("Caja cerrada con éxito:", datosCierre)

      // Mostrar mensaje de éxito
      toast(`Se ha cerrado la caja con un saldo final de S/. ${efectivoContado}`)

      // Actualizar estado
      setCajaAbierta(false)
      setCierreCorrecto(true)
    } catch (error) {
      console.error("Error al cerrar caja:", error)
      toast("Ha ocurrido un error al intentar cerrar la caja. Intente nuevamente.")
    } finally {
      setCargando(false)
    }
  }

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
                  <BreadcrumbPage>Cierre de Caja</BreadcrumbPage>
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
                <BreadcrumbPage>Cierre de Caja</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Cierre de Caja</h1>
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

        {!cajaAbierta && !cierreCorrecto && (
          <Alert variant="destructive">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle>No hay caja abierta</AlertTitle>
            <AlertDescription>
              No se encontró ninguna caja abierta. Por favor, abra una caja antes de intentar cerrarla.
            </AlertDescription>
          </Alert>
        )}

        {cierreCorrecto && (
          <Alert className="bg-green-50 dark:bg-green-950">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <AlertTitle className="text-green-600">Caja cerrada correctamente</AlertTitle>
            <AlertDescription>
              La caja ha sido cerrada con éxito. El saldo final en efectivo es de S/. {efectivoContado}.
            </AlertDescription>
          </Alert>
        )}

        {cajaAbierta && !cierreCorrecto && (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              {/* Información de la caja */}
              <Card>
                <CardHeader>
                  <CardTitle>Información de la Caja</CardTitle>
                  <CardDescription>Detalles de la caja actual</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-md bg-muted p-4">
                    <div className="grid gap-2 md:grid-cols-2">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Usuario</p>
                        <p className="font-medium">{usuarioActual.nombre}</p>
                        <p className="text-xs text-muted-foreground">{usuarioActual.rol}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Fecha y Hora</p>
                        <p className="font-medium">
                          {format(fechaHoraActual, "dd 'de' MMMM 'de' yyyy", { locale: es })}
                        </p>
                        <p className="text-xs text-muted-foreground">{format(fechaHoraActual, "HH:mm:ss")}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Monto Inicial</Label>
                    <div className="flex h-10 items-center rounded-md border bg-muted/50 px-3">
                      <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>S/. {cajaActual.montoInicial.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Fecha de Apertura</Label>
                    <div className="flex h-10 items-center rounded-md border bg-muted/50 px-3">
                      <span>{format(new Date(cajaActual.fechaApertura), "dd/MM/yyyy HH:mm", { locale: es })}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Resumen de ventas */}
              <Card>
                <CardHeader>
                  <CardTitle>Resumen de Ventas</CardTitle>
                  <CardDescription>Ventas por método de pago</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center">
                        <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                          <DollarSign className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Efectivo</p>
                          <p className="text-xs text-muted-foreground">
                            {cajaActual.ventas.filter((v) => v.metodoPago === "efectivo").length} ventas
                          </p>
                        </div>
                      </div>
                      <p className="font-bold">S/. {totalEfectivo.toFixed(2)}</p>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center">
                        <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                          <CreditCard className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Tarjeta</p>
                          <p className="text-xs text-muted-foreground">
                            {cajaActual.ventas.filter((v) => v.metodoPago === "tarjeta").length} ventas
                          </p>
                        </div>
                      </div>
                      <p className="font-bold">S/. {totalTarjeta.toFixed(2)}</p>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center">
                        <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                          <QrCode className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Yape</p>
                          <p className="text-xs text-muted-foreground">
                            {cajaActual.ventas.filter((v) => v.metodoPago === "yape").length} ventas
                          </p>
                        </div>
                      </div>
                      <p className="font-bold">S/. {totalYape.toFixed(2)}</p>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center">
                        <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                          <Smartphone className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Plin</p>
                          <p className="text-xs text-muted-foreground">
                            {cajaActual.ventas.filter((v) => v.metodoPago === "plin").length} ventas
                          </p>
                        </div>
                      </div>
                      <p className="font-bold">S/. {totalPlin.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="rounded-md bg-muted p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Total Ventas:</span>
                      <span className="font-bold">
                        S/. {(totalEfectivo + totalTarjeta + totalYape + totalPlin).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Movimientos de caja */}
            <Card>
              <CardHeader>
                <CardTitle>Movimientos de Caja</CardTitle>
                <CardDescription>Ingresos y egresos adicionales</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border p-4">
                    <div className="mb-2 flex items-center">
                      <div className="mr-2 rounded-full bg-green-100 p-1 text-green-700 dark:bg-green-900 dark:text-green-300">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <h3 className="font-medium">Ingresos</h3>
                    </div>
                    <p className="text-2xl font-bold">S/. {totalIngresos.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">
                      {cajaActual.movimientos.filter((m) => m.tipo === "ingreso").length} movimientos
                    </p>
                  </div>

                  <div className="rounded-lg border p-4">
                    <div className="mb-2 flex items-center">
                      <div className="mr-2 rounded-full bg-red-100 p-1 text-red-700 dark:bg-red-900 dark:text-red-300">
                        <X className="h-4 w-4" />
                      </div>
                      <h3 className="font-medium">Egresos</h3>
                    </div>
                    <p className="text-2xl font-bold">S/. {totalEgresos.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">
                      {cajaActual.movimientos.filter((m) => m.tipo === "egreso").length} movimientos
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Formulario de cierre */}
            <Card>
              <CardHeader>
                <CardTitle>Cierre de Caja</CardTitle>
                <CardDescription>Complete los datos para cerrar la caja</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md bg-muted p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium">Saldo Esperado en Efectivo:</span>
                    <span className="font-bold">S/. {saldoEsperado.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Monto inicial (S/. {cajaActual.montoInicial.toFixed(2)}) + Ventas en efectivo (S/.{" "}
                    {totalEfectivo.toFixed(2)}) + Ingresos (S/. {totalIngresos.toFixed(2)}) - Egresos (S/.{" "}
                    {totalEgresos.toFixed(2)})
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="efectivo-contado" className="flex items-center">
                    Efectivo Contado <span className="ml-1 text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="efectivo-contado"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      className="pl-9"
                      value={efectivoContado}
                      onChange={(e) => setEfectivoContado(e.target.value)}
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Ingrese el monto en efectivo contado físicamente al cierre
                  </p>
                </div>

                {efectivoContado && (
                  <div
                    className={`rounded-md p-3 ${
                      diferencia === 0
                        ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                        : diferencia > 0
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                          : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Diferencia:</span>
                      <span className="font-bold">S/. {diferencia.toFixed(2)}</span>
                    </div>
                    <p className="mt-1 text-sm">
                      {diferencia === 0
                        ? "La caja cuadra perfectamente."
                        : diferencia > 0
                          ? "Hay un sobrante en la caja."
                          : "Hay un faltante en la caja."}
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="observaciones-cierre">Observaciones</Label>
                  <Textarea
                    id="observaciones-cierre"
                    placeholder="Ingrese cualquier observación relevante para este cierre de caja"
                    value={observaciones}
                    onChange={(e) => setObservaciones(e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleCerrarCaja}
                  disabled={!efectivoContado || Number.parseFloat(efectivoContado) < 0 || cargando}
                >
                  {cargando ? (
                    <>
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                      Procesando...
                    </>
                  ) : (
                    <>
                      <LockKeyhole className="mr-2 h-5 w-5" /> Cerrar Caja
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
            
          </>
        )}
      </div>
      </SidebarInset>
        </SidebarProvider>
    </>
  )
}
