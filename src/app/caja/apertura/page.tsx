"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { AlertCircle, CheckCircle2, DollarSign } from "lucide-react"

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
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "sonner"
import { AppSidebar } from "@/components/app-sidebar"

// Tipos de caja disponibles
const tiposCaja = [
  { id: "principal", nombre: "Caja Principal" },
  { id: "secundaria", nombre: "Caja Secundaria" },
  { id: "express", nombre: "Caja Express" },
]

// Simulación de usuario actual
const usuarioActual = {
  id: 1,
  nombre: "Juan Pérez",
  rol: "Cajero",
}

export default function AperturaCajaPage() {
  const [montoInicial, setMontoInicial] = useState("")
  const [tipoCaja, setTipoCaja] = useState("principal")
  const [observaciones, setObservaciones] = useState("")
  const [fechaHoraActual, setFechaHoraActual] = useState(new Date())
  const [cajaAbierta, setCajaAbierta] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [verificando, setVerificando] = useState(true)

  // Verificar si ya hay una caja abierta al cargar la página
  useEffect(() => {
    // Simulación de verificación con API
    const verificarCajaAbierta = async () => {
      setVerificando(true)
      // Simulamos una llamada a API
      setTimeout(() => {
        // Para propósitos de demostración, asumimos que no hay caja abierta inicialmente
        setCajaAbierta(false)
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

  // Manejar la apertura de caja
  const handleAbrirCaja = async () => {
    // Validar monto inicial
    if (!montoInicial || Number.parseFloat(montoInicial) <= 0) {
      toast("El monto inicial debe ser mayor a cero.")
      return
    }

    setCargando(true)

    // Simulación de apertura de caja
    try {
      // Simulamos una llamada a API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Datos que se enviarían a la API
      const datosCaja = {
        montoInicial: Number.parseFloat(montoInicial),
        tipoCaja,
        observaciones,
        fechaApertura: fechaHoraActual.toISOString(),
        usuarioId: usuarioActual.id,
      }

      console.log("Caja abierta con éxito:", datosCaja)

      // Mostrar mensaje de éxito
      toast(`Se ha abierto la caja con un monto inicial de S/. ${montoInicial}`)

      // Actualizar estado
      setCajaAbierta(true)
    } catch (error) {
      console.error("Error al abrir caja:", error)
      toast("Ha ocurrido un error al intentar abrir la caja. Intente nuevamente.")
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
                  <BreadcrumbPage>Apertura de Caja</BreadcrumbPage>
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
                <BreadcrumbPage>Apertura de Caja</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Apertura de Caja</h1>
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

        {cajaAbierta ? (
          <Alert className="bg-green-50 dark:bg-green-950">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <AlertTitle className="text-green-600">Caja abierta correctamente</AlertTitle>
            <AlertDescription>
              La caja ha sido abierta con un monto inicial de S/. {montoInicial}. Puede proceder a realizar operaciones.
            </AlertDescription>
          </Alert>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Apertura de Nueva Caja</CardTitle>
              <CardDescription>Complete los datos para abrir una nueva caja</CardDescription>
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
                    <p className="font-medium">{format(fechaHoraActual, "dd 'de' MMMM 'de' yyyy", { locale: es })}</p>
                    <p className="text-xs text-muted-foreground">{format(fechaHoraActual, "HH:mm:ss")}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="monto-inicial" className="flex items-center">
                  Monto Inicial <span className="ml-1 text-red-500">*</span>
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="monto-inicial"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="pl-9"
                    value={montoInicial}
                    onChange={(e) => setMontoInicial(e.target.value)}
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Ingrese el monto en efectivo con el que inicia operaciones
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo-caja">Tipo de Caja</Label>
                <Select value={tipoCaja} onValueChange={setTipoCaja}>
                  <SelectTrigger id="tipo-caja">
                    <SelectValue placeholder="Seleccionar tipo de caja" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposCaja.map((tipo) => (
                      <SelectItem key={tipo.id} value={tipo.id}>
                        {tipo.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observaciones">Observaciones</Label>
                <Textarea
                  id="observaciones"
                  placeholder="Ingrese cualquier observación relevante para esta apertura de caja"
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
                onClick={handleAbrirCaja}
                disabled={!montoInicial || Number.parseFloat(montoInicial) <= 0 || cargando}
              >
                {cargando ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                    Procesando...
                  </>
                ) : (
                  "Abrir Caja"
                )}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
        </SidebarInset>
</SidebarProvider>
    </>
  )
}
