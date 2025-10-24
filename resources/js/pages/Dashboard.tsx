import { Head } from '@inertiajs/react';
import MainLayout from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, DollarSign, Package, TrendingUp } from 'lucide-react';

interface DashboardStats {
  contracts_month: number;
  revenue_month: number;
  inventory_low: number;
  pending_payments: number;
}

interface DashboardProps {
  stats: DashboardStats;
}

export default function Dashboard({ stats }: DashboardProps) {
  const cardData = [
    {
      title: 'Contratos del Mes',
      value: stats.contracts_month || 0,
      icon: FileText,
      description: 'Contratos nuevos este mes',
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
    },
    {
      title: 'Ingresos del Mes',
      value: `$${(stats.revenue_month || 0).toLocaleString('es-CL')}`,
      icon: DollarSign,
      description: 'Total facturado',
      color: 'text-success',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Inventario Bajo',
      value: stats.inventory_low || 0,
      icon: Package,
      description: 'Productos con stock mínimo',
      color: 'text-warning',
      bgColor: 'bg-amber-50',
    },
    {
      title: 'Pagos Pendientes',
      value: stats.pending_payments || 0,
      icon: TrendingUp,
      description: 'Pagos por cobrar',
      color: 'text-error',
      bgColor: 'bg-red-50',
    },
  ];

  return (
    <MainLayout>
      <Head title="Dashboard" />

      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">
            Resumen general de la operación funeraria
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {cardData.map((card) => {
            const Icon = card.icon;
            return (
              <Card key={card.title} className="border-gray-200 bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">
                    {card.title}
                  </CardTitle>
                  <div className={`rounded-lg p-2 ${card.bgColor}`}>
                    <Icon className={`h-4 w-4 ${card.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{card.value}</div>
                  <p className="text-xs text-gray-500 mt-1">{card.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Welcome Message */}
        <Card className="border-gray-200 bg-white">
          <CardHeader>
            <CardTitle className="text-gray-900">Bienvenido al Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Este es el sistema de gestión funeraria. Aquí podrás administrar contratos,
              inventario, pagos, personal y generar reportes de toda la operación.
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
