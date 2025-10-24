import { Head } from '@inertiajs/react';
import MainLayout from '@/components/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  BarChart3,
  FileText,
  Download,
  TrendingUp,
  DollarSign,
  Users,
  Calendar
} from 'lucide-react';

export default function Index() {
  const reportTypes = [
    {
      title: 'Reporte de Ventas',
      description: 'Análisis de contratos y ventas del período',
      icon: DollarSign,
      color: 'text-success',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Reporte de Inventario',
      description: 'Estado actual del inventario y movimientos',
      icon: BarChart3,
      color: 'text-info',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Reporte de Pagos',
      description: 'Cuotas, pagos recibidos y pendientes',
      icon: TrendingUp,
      color: 'text-warning',
      bgColor: 'bg-amber-50',
    },
    {
      title: 'Reporte de Personal',
      description: 'Nómina, liquidaciones y estadísticas',
      icon: Users,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
    },
    {
      title: 'Reporte Mensual',
      description: 'Resumen ejecutivo del mes',
      icon: Calendar,
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-50',
    },
    {
      title: 'Reporte Personalizado',
      description: 'Crea reportes con filtros específicos',
      icon: FileText,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
    },
  ];

  return (
    <MainLayout>
      <Head title="Reportes" />

      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reportes</h1>
          <p className="mt-2 text-sm text-gray-600">
            Genera y descarga reportes detallados de la operación
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contratos del Mes</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Nuevos contratos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
              <DollarSign className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$0</div>
              <p className="text-xs text-muted-foreground">Recaudado este mes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gastos</CardTitle>
              <TrendingUp className="h-4 w-4 text-error" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$0</div>
              <p className="text-xs text-muted-foreground">Gastos del mes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Balance</CardTitle>
              <BarChart3 className="h-4 w-4 text-info" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$0</div>
              <p className="text-xs text-muted-foreground">Utilidad del mes</p>
            </CardContent>
          </Card>
        </div>

        {/* Report Types */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tipos de Reportes</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reportTypes.map((report) => {
              const Icon = report.icon;
              return (
                <Card key={report.title} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className={`rounded-lg p-2 ${report.bgColor}`}>
                        <Icon className={`h-5 w-5 ${report.color}`} />
                      </div>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardTitle className="text-lg">{report.title}</CardTitle>
                    <CardDescription>{report.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full gap-2">
                      <FileText className="h-4 w-4" />
                      Generar Reporte
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Reportes Recientes</CardTitle>
            <CardDescription>Últimos reportes generados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-gray-100 p-3 mb-4">
                <FileText className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                No hay reportes generados
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Los reportes que generes aparecerán aquí.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
