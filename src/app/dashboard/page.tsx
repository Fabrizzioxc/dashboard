"use client"

import { useState } from "react"
import Link from "next/link"
import { DollarSign, ShoppingCart, Users } from "lucide-react"
import { format } from "date-fns"

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
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "@/components/ui/chart"
import { AppSidebar } from "@/components/app-sidebar"

// Add this to the top of the file, after the imports
const cardClasses = "border-[0.5px] border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm"

// Sample data for the dashboard
const salesData = [
  { month: "Ene", sales: 4000 },
  { month: "Feb", sales: 3000 },
  { month: "Mar", sales: 5000 },
  { month: "Abr", sales: 2780 },
  { month: "May", sales: 1890 },
  { month: "Jun", sales: 2390 },
  { month: "Jul", sales: 3490 },
  { month: "Ago", sales: 4000 },
  { month: "Sep", sales: 5200 },
  { month: "Oct", sales: 5500 },
  { month: "Nov", sales: 4900 },
  { month: "Dic", sales: 6000 },
]

const recentSales = [
  {
    id: "INV-001",
    customer: "Juan Pérez",
    product: "Laptop Dell XPS 13",
    amount: 1299.99,
    date: "2025-05-12T09:30:00",
    status: "Completada",
  },
  {
    id: "INV-002",
    customer: "María González",
    product: "iPhone 15 Pro",
    amount: 999.99,
    date: "2025-05-11T14:45:00",
    status: "Completada",
  },
  {
    id: "INV-003",
    customer: "Carlos Rodríguez",
    product: 'Monitor Samsung 32"',
    amount: 349.99,
    date: "2025-05-11T11:20:00",
    status: "Pendiente",
  },
  {
    id: "INV-004",
    customer: "Ana Martínez",
    product: "Teclado Mecánico Logitech",
    amount: 129.99,
    date: "2025-05-10T16:15:00",
    status: "Completada",
  },
  {
    id: "INV-005",
    customer: "Roberto Sánchez",
    product: "AirPods Pro",
    amount: 249.99,
    date: "2025-05-10T10:05:00",
    status: "Completada",
  },
  {
    id: "INV-006",
    customer: "Laura Díaz",
    product: "iPad Air",
    amount: 599.99,
    date: "2025-05-09T13:40:00",
    status: "Cancelada",
  },
  {
    id: "INV-007",
    customer: "Miguel Torres",
    product: "Cámara Sony Alpha",
    amount: 899.99,
    date: "2025-05-09T09:10:00",
    status: "Completada",
  },
]

export default function DashboardPage() {
  const [activeTooltipIndex, setActiveTooltipIndex] = useState<number | null>(null)

  // Calculate total sales
  const totalSales = salesData.reduce((sum, item) => sum + item.sales, 0)

  // Calculate average order value
  const averageOrderValue = recentSales.reduce((sum, sale) => sum + sale.amount, 0) / recentSales.length

  // Count completed transactions
  const completedTransactions = recentSales.filter((sale) => sale.status === "Completada").length

  // Calculate conversion rate (completed / total)
  const conversionRate = (completedTransactions / recentSales.length) * 100

  const getPercentageColorClass = (percentage: string) => {
    if (percentage.startsWith("-")) {
      return "text-red-500"
    }
    return "text-green-500"
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
                        <BreadcrumbPage>Dashboard</BreadcrumbPage>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>
              </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              {/* Sales Metrics Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
  <Card className={cardClasses}>
    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
      <div className="space-y-1">
        <CardTitle className="text-xl font-semibold tracking-tight">Ventas Totales</CardTitle>
        <div className="text-4xl font-bold">${totalSales.toLocaleString()}</div>
      </div>
      <DollarSign className="h-8 w-8 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <p className={`text-sm font-medium ${getPercentageColorClass("+20.1")}`}>
        +20.1% respecto al mes anterior
      </p>
    </CardContent>
  </Card>

  <Card className={cardClasses}>
    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
      <div className="space-y-1">
        <CardTitle className="text-xl font-semibold tracking-tight">Valor Promedio</CardTitle>
        <div className="text-4xl font-bold">${averageOrderValue.toFixed(2)}</div>
      </div>
      <ShoppingCart className="h-8 w-8 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <p className={`text-sm font-medium ${getPercentageColorClass("+4.5")}`}>
        +4.5% respecto al mes anterior
      </p>
    </CardContent>
  </Card>

  <Card className={cardClasses}>
    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
      <div className="space-y-1">
        <CardTitle className="text-xl font-semibold tracking-tight">Clientes</CardTitle>
        <div className="text-4xl font-bold">{completedTransactions}</div>
      </div>
      <Users className="h-8 w-8 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <p className="text-sm font-medium text-red-500">-2% respecto al mes anterior</p>
    </CardContent>
  </Card>

  <Card className={cardClasses}>
    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
      <div className="space-y-1">
        <CardTitle className="text-xl font-semibold tracking-tight">Tasa de Conversión</CardTitle>
        <div className="text-4xl font-bold">{conversionRate.toFixed(1)}%</div>
      </div>
      <Users className="h-8 w-8 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <p className={`text-sm font-medium ${getPercentageColorClass("+7.4")}`}>
        +7.4% respecto al mes anterior
      </p>
    </CardContent>
  </Card>
</div>

              {/* Sales Chart */}
              <Card className={`col-span-4 ${cardClasses}`}>
                <CardHeader>
                  <CardTitle>Ventas Mensuales</CardTitle>
                  <CardDescription>Tendencia de ventas durante el último año</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis
                          dataKey="month"
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `$${value}`}
                        />
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <RechartsTooltip
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="flex flex-col">
                                      <span className="text-[0.70rem] uppercase text-muted-foreground">Mes</span>
                                      <span className="font-bold text-muted-foreground">{label}</span>
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-[0.70rem] uppercase text-muted-foreground">Ventas</span>
                                      <span className="font-bold">${payload[0].value}</span>
                                    </div>
                                  </div>
                                </div>
                              )
                            }
                            return null
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="sales"
                          stroke="hsl(var(--chart-1))"
                          fillOpacity={1}
                          fill="url(#colorSales)"
                          activeDot={{ r: 8 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

        {/* Sales Table */}
        <Card className={cardClasses}>
          <CardHeader>
            <CardTitle>Ventas Recientes</CardTitle>
            <CardDescription>Últimas transacciones registradas en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Factura</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentSales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">{sale.id}</TableCell>
                    <TableCell>{sale.customer}</TableCell>
                    <TableCell>{sale.product}</TableCell>
                    <TableCell className="text-right">${sale.amount.toFixed(2)}</TableCell>
                    <TableCell>{format(new Date(sale.date), "dd/MM/yyyy HH:mm")}</TableCell>
                    <TableCell>
                      <div
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          sale.status === "Completada"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : sale.status === "Pendiente"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        }`}
                      >
                        {sale.status}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Exportar</Button>
            <Button asChild>
              <Link href="/ventas">Ver todas las ventas</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
  </SidebarInset>
</SidebarProvider>

      
    </>
  )
}
