"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import {
  AlertCircle,
  ArrowDownToLine,
  ArrowUpFromLine,
  Clock,
  Download,
  FileSpreadsheet,
  HelpCircle,
  Loader2,
  Plus,
  Save,
  Search,
  Trash,
  Upload,
  User,
  X,
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { toast } from "sonner"
import { AppSidebar } from "@/components/app-sidebar"

// Datos de ejemplo
const usuarios = [
  {
    id: 1,
    nombre: "Juan Pérez",
    correo: "juan@ejemplo.com",
    rol: "Administrador",
    ultimoAcceso: "2023-05-10T08:30:00",
  },
  { id: 2, nombre: "María López", correo: "maria@ejemplo.com", rol: "Cajero", ultimoAcceso: "2023-05-09T14:45:00" },
  {
    id: 3,
    nombre: "Carlos Gómez",
    correo: "carlos@ejemplo.com",
    rol: "Almacenero",
    ultimoAcceso: "2023-05-08T10:15:00",
  },
]

const metodoPago = [
  { id: 1, nombre: "Efectivo", activo: true, comision: 0, requiereQR: false },
  { id: 2, nombre: "Yape", activo: true, comision: 0, requiereQR: true },
  { id: 3, nombre: "Plin", activo: true, comision: 0, requiereQR: true },
  { id: 4, nombre: "Tarjeta", activo: true, comision: 3.5, requiereQR: false },
  { id: 5, nombre: "Transferencia", activo: true, comision: 0, requiereQR: false },
]

const registroActividad = [
  { id: 1, usuario: "Juan Pérez", accion: "Inicio de sesión", fecha: "2023-05-10T08:30:00", modulo: "Autenticación" },
  { id: 2, usuario: "María López", accion: "Venta registrada #00123", fecha: "2023-05-09T14:45:00", modulo: "Ventas" },
  {
    id: 3,
    usuario: "Carlos Gómez",
    accion: "Producto actualizado SKU-001",
    fecha: "2023-05-08T10:15:00",
    modulo: "Inventario",
  },
  {
    id: 4,
    usuario: "Juan Pérez",
    accion: "Usuario creado: Ana Silva",
    fecha: "2023-05-07T16:20:00",
    modulo: "Ajustes",
  },
  { id: 5, usuario: "María López", accion: "Cierre de caja #00045", fecha: "2023-05-06T19:00:00", modulo: "Caja" },
]

export default function AjustesPage() {
  // Estados para los diferentes formularios
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [openUserDialog, setOpenUserDialog] = useState(false)
  const [openQRDialog, setOpenQRDialog] = useState(false)
  const [selectedMetodoPago, setSelectedMetodoPago] = useState<number | null>(null)

  // Función para manejar la carga de imágenes
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setLogoPreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Función para guardar cambios (simulada)
  const handleSaveChanges = () => {
    setIsSubmitting(true)

    // Simulamos una petición a la API
    setTimeout(() => {
      setIsSubmitting(false)
      toast("Los cambios han sido guardados correctamente.")
    }, 1500)
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
                <BreadcrumbPage>Ajustes</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="min-h-[80vh] flex-1 rounded-xl bg-background md:min-h-min">
          <div className="p-4 md:p-6">
            <h1 className="text-2xl font-bold mb-6">Configuración del Sistema</h1>

            <Tabs defaultValue="datos-tienda" className="w-full">
              <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 mb-6">
                <TabsTrigger value="datos-tienda">Datos de la tienda</TabsTrigger>
                <TabsTrigger value="preferencias">Preferencias</TabsTrigger>
                <TabsTrigger value="usuarios">Usuarios y roles</TabsTrigger>
                <TabsTrigger value="metodos-pago">Métodos de pago</TabsTrigger>
                <TabsTrigger value="inventario">Inventario</TabsTrigger>
                <TabsTrigger value="backup">Copia de seguridad</TabsTrigger>
                <TabsTrigger value="actividad">Registro de actividad</TabsTrigger>
              </TabsList>

              {/* 1. Datos de la tienda */}
              <TabsContent value="datos-tienda">
                <Card>
                  <CardHeader>
                    <CardTitle>Datos de la tienda</CardTitle>
                    <CardDescription>
                      Configura la información básica de tu negocio que aparecerá en documentos y comprobantes.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="nombre-comercial">Nombre comercial</Label>
                          <Input
                            id="nombre-comercial"
                            placeholder="Ingrese el nombre de su tienda"
                            defaultValue="Fashion Store"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="ruc-dni">RUC o DNI</Label>
                          <Input id="ruc-dni" placeholder="Ingrese su RUC o DNI" defaultValue="20123456789" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="direccion">Dirección</Label>
                          <Input
                            id="direccion"
                            placeholder="Ingrese la dirección de su tienda"
                            defaultValue="Av. Principal 123, Lima"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="telefono">Teléfono</Label>
                          <Input
                            id="telefono"
                            placeholder="Ingrese su número de teléfono"
                            defaultValue="+51 987654321"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Correo electrónico</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="Ingrese su correo electrónico"
                            defaultValue="contacto@fashionstore.com"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="logo">Logo de la tienda</Label>
                          <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 h-64">
                            {logoPreview ? (
                              <div className="relative w-full h-full">
                                <Image
                                  src={logoPreview || "/placeholder.svg"}
                                  alt="Logo preview"
                                  fill
                                  className="object-contain"
                                />
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  className="absolute top-2 right-2"
                                  onClick={() => setLogoPreview(null)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center text-center">
                                <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                                <p className="text-sm text-muted-foreground mb-2">Arrastra y suelta tu logo aquí o</p>
                                <Label
                                  htmlFor="logo-upload"
                                  className="cursor-pointer text-sm font-medium text-primary hover:underline"
                                >
                                  selecciona un archivo
                                </Label>
                                <Input
                                  id="logo-upload"
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={handleImageUpload}
                                />
                                <p className="text-xs text-muted-foreground mt-2">PNG, JPG o SVG (máx. 2MB)</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button onClick={handleSaveChanges} disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Guardando...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Guardar cambios
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* 2. Preferencias del sistema */}
              <TabsContent value="preferencias">
                <Card>
                  <CardHeader>
                    <CardTitle>Preferencias del sistema</CardTitle>
                    <CardDescription>
                      Personaliza el comportamiento y apariencia del sistema según tus necesidades.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="moneda">Moneda</Label>
                          <Select defaultValue="PEN">
                            <SelectTrigger id="moneda">
                              <SelectValue placeholder="Selecciona una moneda" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PEN">Soles (S/.)</SelectItem>
                              <SelectItem value="USD">Dólares ($)</SelectItem>
                              <SelectItem value="EUR">Euros (€)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="idioma">Idioma del sistema</Label>
                          <Select defaultValue="es">
                            <SelectTrigger id="idioma">
                              <SelectValue placeholder="Selecciona un idioma" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="es">Español</SelectItem>
                              <SelectItem value="en">Inglés</SelectItem>
                              <SelectItem value="pt">Portugués</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="formato-fecha">Formato de fecha</Label>
                          <Select defaultValue="dd/MM/yyyy">
                            <SelectTrigger id="formato-fecha">
                              <SelectValue placeholder="Selecciona un formato" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="dd/MM/yyyy">DD/MM/AAAA (31/12/2023)</SelectItem>
                              <SelectItem value="MM/dd/yyyy">MM/DD/AAAA (12/31/2023)</SelectItem>
                              <SelectItem value="yyyy-MM-dd">AAAA-MM-DD (2023-12-31)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="dark-mode">Modo oscuro</Label>
                            <p className="text-sm text-muted-foreground">
                              Activa el modo oscuro para reducir la fatiga visual.
                            </p>
                          </div>
                          <Switch id="dark-mode" />
                        </div>

                        <Separator />

                        <div className="flex items-center space-x-2">
                          <Checkbox id="stock-negativo" />
                          <div className="grid gap-1.5 leading-none">
                            <Label htmlFor="stock-negativo">Mostrar stock negativo</Label>
                            <p className="text-sm text-muted-foreground">
                              Permite que el stock de productos pueda ser negativo.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox id="reducir-stock" defaultChecked />
                          <div className="grid gap-1.5 leading-none">
                            <Label htmlFor="reducir-stock">Reducir stock automáticamente al vender</Label>
                            <p className="text-sm text-muted-foreground">
                              El stock se reducirá automáticamente al registrar una venta.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox id="imprimir-boleta" defaultChecked />
                          <div className="grid gap-1.5 leading-none">
                            <Label htmlFor="imprimir-boleta">Imprimir boleta automáticamente al vender</Label>
                            <p className="text-sm text-muted-foreground">
                              Se imprimirá la boleta automáticamente al finalizar una venta.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button onClick={handleSaveChanges} disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Guardando...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Guardar cambios
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* 3. Usuarios y roles */}
              <TabsContent value="usuarios">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Usuarios y roles</CardTitle>
                      <CardDescription>
                        Administra los usuarios que tienen acceso al sistema y sus permisos.
                      </CardDescription>
                    </div>
                    <Dialog open={openUserDialog} onOpenChange={setOpenUserDialog}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="mr-2 h-4 w-4" />
                          Agregar usuario
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Agregar nuevo usuario</DialogTitle>
                          <DialogDescription>
                            Completa los datos para crear un nuevo usuario en el sistema.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="nuevo-nombre">Nombre completo</Label>
                            <Input id="nuevo-nombre" placeholder="Ingrese el nombre completo" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="nuevo-correo">Correo electrónico</Label>
                            <Input id="nuevo-correo" type="email" placeholder="Ingrese el correo electrónico" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="nueva-contraseña">Contraseña</Label>
                            <Input id="nueva-contraseña" type="password" placeholder="Ingrese la contraseña" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="nuevo-rol">Rol</Label>
                            <Select defaultValue="cajero">
                              <SelectTrigger id="nuevo-rol">
                                <SelectValue placeholder="Selecciona un rol" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="administrador">Administrador</SelectItem>
                                <SelectItem value="cajero">Cajero</SelectItem>
                                <SelectItem value="almacenero">Almacenero</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setOpenUserDialog(false)}>
                            Cancelar
                          </Button>
                          <Button
                            onClick={() => {
                              toast("El usuario ha sido creado correctamente.")
                              setOpenUserDialog(false)
                            }}
                          >
                            Crear usuario
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Correo electrónico</TableHead>
                            <TableHead>Rol</TableHead>
                            <TableHead>Último acceso</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {usuarios.map((usuario) => (
                            <TableRow key={usuario.id}>
                              <TableCell className="font-medium">{usuario.nombre}</TableCell>
                              <TableCell>{usuario.correo}</TableCell>
                              <TableCell>
                                <span
                                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    usuario.rol === "Administrador"
                                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                      : usuario.rol === "Cajero"
                                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                  }`}
                                >
                                  {usuario.rol}
                                </span>
                              </TableCell>
                              <TableCell>
                                {format(new Date(usuario.ultimoAcceso), "dd/MM/yyyy HH:mm", { locale: es })}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button variant="ghost" size="icon">
                                    <User className="h-4 w-4" />
                                    <span className="sr-only">Editar usuario</span>
                                  </Button>
                                  <Button variant="ghost" size="icon">
                                    <Trash className="h-4 w-4" />
                                    <span className="sr-only">Eliminar usuario</span>
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 4. Métodos de pago */}
              <TabsContent value="metodos-pago">
                <Card>
                  <CardHeader>
                    <CardTitle>Métodos de pago</CardTitle>
                    <CardDescription>Configura los métodos de pago que aceptará tu negocio.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Método de pago</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Comisión (%)</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {metodoPago.map((metodo) => (
                            <TableRow key={metodo.id}>
                              <TableCell className="font-medium">{metodo.nombre}</TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Switch
                                    id={`metodo-${metodo.id}`}
                                    defaultChecked={metodo.activo}
                                    onCheckedChange={(checked) => {
                                      toast("Método activado")
                                    }}
                                  />
                                  <Label htmlFor={`metodo-${metodo.id}`}>{metodo.activo ? "Activo" : "Inactivo"}</Label>
                                </div>
                              </TableCell>
                              <TableCell>
                                {metodo.nombre === "Tarjeta" ? (
                                  <div className="flex items-center space-x-2 w-24">
                                    <Input
                                      type="number"
                                      defaultValue={metodo.comision}
                                      min="0"
                                      max="100"
                                      step="0.1"
                                      className="h-8"
                                    />
                                    <span>%</span>
                                  </div>
                                ) : (
                                  "N/A"
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  {metodo.requiereQR && (
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => setSelectedMetodoPago(metodo.id)}
                                        >
                                          Configurar QR
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent>
                                        <DialogHeader>
                                          <DialogTitle>Configurar QR para {metodo.nombre}</DialogTitle>
                                          <DialogDescription>
                                            Sube una imagen del código QR para pagos con {metodo.nombre}.
                                          </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                          <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 h-64">
                                            <div className="flex flex-col items-center justify-center text-center">
                                              <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                                              <p className="text-sm text-muted-foreground mb-2">
                                                Arrastra y suelta tu QR aquí o
                                              </p>
                                              <Label
                                                htmlFor="qr-upload"
                                                className="cursor-pointer text-sm font-medium text-primary hover:underline"
                                              >
                                                selecciona un archivo
                                              </Label>
                                              <Input id="qr-upload" type="file" accept="image/*" className="hidden" />
                                              <p className="text-xs text-muted-foreground mt-2">PNG, JPG (máx. 1MB)</p>
                                            </div>
                                          </div>

                                          <div className="space-y-2">
                                            <Label htmlFor="alias-qr">Alias o número</Label>
                                            <Input
                                              id="alias-qr"
                                              placeholder={`Ingrese su número de ${metodo.nombre}`}
                                            />
                                          </div>
                                        </div>
                                        <DialogFooter>
                                          <Button variant="outline">Cancelar</Button>
                                          <Button
                                            onClick={() => {
                                              toast(`El QR para ${metodo.nombre} ha sido configurado correctamente.`)
                                            }}
                                          >
                                            Guardar
                                          </Button>
                                        </DialogFooter>
                                      </DialogContent>
                                    </Dialog>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button onClick={handleSaveChanges} disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Guardando...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Guardar cambios
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* 5. Inventario */}
              <TabsContent value="inventario">
                <Card>
                  <CardHeader>
                    <CardTitle>Configuración de inventario</CardTitle>
                    <CardDescription>Configura las opciones relacionadas con el manejo de inventario.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="stock-minimo">
                            Stock mínimo para alertas
                            <span className="ml-2 inline-flex">
                              <Popover>
                                <PopoverTrigger>
                                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                  <p className="text-sm">
                                    Cuando el stock de un producto sea menor a este valor, se mostrará una alerta en el
                                    sistema.
                                  </p>
                                </PopoverContent>
                              </Popover>
                            </span>
                          </Label>
                          <Input id="stock-minimo" type="number" min="0" defaultValue="5" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="unidad-medida">Unidad de medida por defecto</Label>
                          <Select defaultValue="unidad">
                            <SelectTrigger id="unidad-medida">
                              <SelectValue placeholder="Selecciona una unidad" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="unidad">Unidad</SelectItem>
                              <SelectItem value="par">Par</SelectItem>
                              <SelectItem value="docena">Docena</SelectItem>
                              <SelectItem value="metro">Metro</SelectItem>
                              <SelectItem value="kg">Kilogramo</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="permitir-sin-stock" defaultChecked />
                          <div className="grid gap-1.5 leading-none">
                            <Label htmlFor="permitir-sin-stock">Permitir productos sin stock</Label>
                            <p className="text-sm text-muted-foreground">
                              Permite vender productos aunque no haya stock disponible.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox id="alertas-stock" defaultChecked />
                          <div className="grid gap-1.5 leading-none">
                            <Label htmlFor="alertas-stock">Mostrar alertas de stock bajo</Label>
                            <p className="text-sm text-muted-foreground">
                              Muestra notificaciones cuando el stock de un producto esté por debajo del mínimo.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox id="codigo-barras" />
                          <div className="grid gap-1.5 leading-none">
                            <Label htmlFor="codigo-barras">Generar códigos de barras automáticamente</Label>
                            <p className="text-sm text-muted-foreground">
                              Genera códigos de barras para productos nuevos automáticamente.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button onClick={handleSaveChanges} disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Guardando...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Guardar cambios
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* 6. Copia de seguridad y exportación */}
              <TabsContent value="backup">
                <Card>
                  <CardHeader>
                    <CardTitle>Copia de seguridad y exportación</CardTitle>
                    <CardDescription>Gestiona las copias de seguridad y exporta datos del sistema.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Copia de seguridad</CardTitle>
                          <CardDescription>
                            Crea y restaura copias de seguridad de todos los datos del sistema.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex flex-col gap-4">
                            <Button className="w-full justify-start">
                              <ArrowDownToLine className="mr-2 h-4 w-4" />
                              Crear copia de seguridad
                            </Button>
                            <div className="relative">
                              <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                              </div>
                              <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground">O</span>
                              </div>
                            </div>
                            <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                              <div className="flex flex-col items-center justify-center text-center">
                                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                                <p className="text-sm text-muted-foreground mb-2">
                                  Arrastra y suelta tu archivo de respaldo o
                                </p>
                                <Label
                                  htmlFor="backup-upload"
                                  className="cursor-pointer text-sm font-medium text-primary hover:underline"
                                >
                                  selecciona un archivo
                                </Label>
                                <Input id="backup-upload" type="file" accept=".json,.sql,.zip" className="hidden" />
                                <p className="text-xs text-muted-foreground mt-2">JSON, SQL o ZIP</p>
                              </div>
                            </div>
                            <Button variant="outline" className="w-full justify-start">
                              <ArrowUpFromLine className="mr-2 h-4 w-4" />
                              Restaurar copia de seguridad
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Exportación de datos</CardTitle>
                          <CardDescription>
                            Exporta datos específicos del sistema en diferentes formatos.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex flex-col gap-4">
                            <div className="space-y-2">
                              <Label>Exportar productos</Label>
                              <div className="flex gap-2">
                                <Button variant="outline" className="flex-1 justify-start">
                                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                                  Excel
                                </Button>
                                <Button variant="outline" className="flex-1 justify-start">
                                  <Download className="mr-2 h-4 w-4" />
                                  CSV
                                </Button>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label>Exportar ventas</Label>
                              <div className="flex gap-2">
                                <Button variant="outline" className="flex-1 justify-start">
                                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                                  Excel
                                </Button>
                                <Button variant="outline" className="flex-1 justify-start">
                                  <Download className="mr-2 h-4 w-4" />
                                  CSV
                                </Button>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label>Exportar inventario</Label>
                              <div className="flex gap-2">
                                <Button variant="outline" className="flex-1 justify-start">
                                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                                  Excel
                                </Button>
                                <Button variant="outline" className="flex-1 justify-start">
                                  <Download className="mr-2 h-4 w-4" />
                                  CSV
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="rounded-md bg-muted p-4">
                      <div className="flex items-start gap-4">
                        <AlertCircle className="mt-1 h-5 w-5 text-muted-foreground" />
                        <div>
                          <h4 className="text-sm font-medium">Información importante</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Las copias de seguridad contienen todos los datos de tu negocio. Asegúrate de guardarlas en
                            un lugar seguro y realizar respaldos periódicamente.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 7. Registro de actividad */}
              <TabsContent value="actividad">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Registro de actividad</CardTitle>
                      <CardDescription>Visualiza todas las acciones realizadas en el sistema.</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="relative w-60">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input type="search" placeholder="Buscar actividad..." className="pl-8" />
                      </div>
                      <Select defaultValue="todos">
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Filtrar por módulo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todos">Todos los módulos</SelectItem>
                          <SelectItem value="autenticacion">Autenticación</SelectItem>
                          <SelectItem value="ventas">Ventas</SelectItem>
                          <SelectItem value="inventario">Inventario</SelectItem>
                          <SelectItem value="ajustes">Ajustes</SelectItem>
                          <SelectItem value="caja">Caja</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Usuario</TableHead>
                            <TableHead>Acción</TableHead>
                            <TableHead>Módulo</TableHead>
                            <TableHead>Fecha y hora</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {registroActividad.map((registro) => (
                            <TableRow key={registro.id}>
                              <TableCell className="font-medium">{registro.usuario}</TableCell>
                              <TableCell>{registro.accion}</TableCell>
                              <TableCell>
                                <span
                                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    registro.modulo === "Autenticación"
                                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                      : registro.modulo === "Ventas"
                                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                        : registro.modulo === "Inventario"
                                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                          : registro.modulo === "Ajustes"
                                            ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                                            : "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
                                  }`}
                                >
                                  {registro.modulo}
                                </span>
                              </TableCell>
                              <TableCell>
                                {format(new Date(registro.fecha), "dd/MM/yyyy HH:mm", { locale: es })}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    <div className="flex items-center justify-end space-x-2 py-4">
                      <Button variant="outline" size="sm" disabled>
                        Anterior
                      </Button>
                      <Button variant="outline" size="sm" disabled>
                        Siguiente
                      </Button>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">
                      <FileSpreadsheet className="mr-2 h-4 w-4" />
                      Exportar registro
                    </Button>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Mostrando los últimos 30 días de actividad</span>
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
        </SidebarInset>
</SidebarProvider>
    </>
  )
}
