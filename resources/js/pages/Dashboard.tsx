import { Head, Link, router } from '@inertiajs/react';
import MainLayout from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  FileSignature,
  Wallet,
  Archive,
  UsersRound,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Heart,
  ChevronRight,
  Building2,
} from 'lucide-react';

interface Contract {
  id: number;
  contract_number: string;
  deceased_name: string;
  family_contact: string;
  status: string;
  service_date: string | null;
  created_at: string;
  total: number;
}

interface DashboardStats {
  contracts_month: number;
  revenue_month: number;
  inventory_low: number;
  pending_payments: number;
  active_services: number;
  families_served: number;
  pending_arrangements: number;
}

interface Branch {
  id: number;
  name: string;
  code: string;
  city: string | null;
}

interface DashboardProps {
  stats: DashboardStats;
  recent_contracts: Contract[];
  upcoming_services: Contract[];
  branches: Branch[];
  current_branch: Branch | null;
  is_admin: boolean;
}

export default function Dashboard({
  stats,
  recent_contracts = [],
  upcoming_services = [],
  branches = [],
  current_branch = null,
  is_admin = false
}: DashboardProps) {

  const handleBranchChange = (branchId: number) => {
    router.get('/', { branch_id: branchId }, { preserveState: true });
  };
  const cardData = [
    {
      title: 'Servicios Activos',
      value: stats.active_services || 0,
      icon: Calendar,
      description: 'En proceso esta semana',
      color: 'text-text-accent',
      bgColor: 'bg-primary-50',
      href: '/contracts?status=active',
    },
    {
      title: 'Familias Atendidas',
      value: stats.families_served || stats.contracts_month || 0,
      icon: Heart,
      description: 'Este mes',
      color: 'text-text-accent',
      bgColor: 'bg-primary-50',
      href: '/contracts',
    },
    {
      title: 'Arreglos Pendientes',
      value: stats.pending_arrangements || 0,
      icon: FileSignature,
      description: 'Requieren atención',
      color: 'text-warning',
      bgColor: 'bg-amber-50',
      href: '/contracts?status=pending',
    },
    {
      title: 'Pagos Pendientes',
      value: stats.pending_payments || 0,
      icon: Wallet,
      description: 'Por cobrar',
      color: 'text-error',
      bgColor: 'bg-red-50',
      href: '/payments',
    },
    {
      title: 'Ingresos del Mes',
      value: `$${(stats.revenue_month || 0).toLocaleString('es-CL')}`,
      icon: TrendingUp,
      description: 'Total facturado',
      color: 'text-text-secondary',
      bgColor: 'bg-green-50',
      href: '/reports',
    },
    {
      title: 'Alertas de Inventario',
      value: stats.inventory_low || 0,
      icon: Archive,
      description: 'Stock bajo',
      color: 'text-warning',
      bgColor: 'bg-amber-50',
      href: '/inventory',
    },
  ];

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { label: string; className: string }> = {
      pending: { label: 'Pendiente', className: 'bg-amber-100 text-amber-800' },
      active: { label: 'Activo', className: 'bg-blue-100 text-blue-800' },
      completed: { label: 'Completado', className: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Cancelado', className: 'bg-gray-100 text-gray-800' },
    };
    return badges[status] || { label: status, className: 'bg-gray-100 text-gray-800' };
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-CL', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <MainLayout>
      <Head title="Dashboard" />

      <div className="space-y-6">
        {/* Header with Branch Selector */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold font-display text-text-primary">Panel de Control</h1>
            <p className="mt-2 text-sm text-text-muted">
              Resumen general de servicios funerarios y operaciones
            </p>
          </div>

          {/* Branch Selector - Only for admins */}
          {is_admin && branches.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <Building2 className="h-4 w-4" />
                <span>Sucursal:</span>
              </div>
              <select
                value={current_branch?.id || ''}
                onChange={(e) => handleBranchChange(Number(e.target.value))}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              >
                <option value="">Todas las sucursales</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name} {branch.city ? `- ${branch.city}` : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Branch Display - For non-admins */}
          {!is_admin && current_branch && (
            <div className="flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-lg">
              <Building2 className="h-4 w-4 text-text-accent" />
              <span className="text-sm font-medium text-text-primary">
                {current_branch.name}
              </span>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cardData.map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.title} href={card.href}>
                <Card className="border-gray-200 bg-white hover:border-primary-300 transition-all cursor-pointer h-full">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-text-secondary">
                      {card.title}
                    </CardTitle>
                    <div className={`rounded-lg p-2 ${card.bgColor}`}>
                      <Icon className={`h-5 w-5 ${card.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-text-primary">{card.value}</div>
                    <p className="text-xs text-text-subtle mt-1">{card.description}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Contracts */}
          <Card className="border-gray-200 bg-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-text-primary">Contratos Recientes</CardTitle>
                  <CardDescription className="text-text-subtle">
                    Últimos contratos registrados
                  </CardDescription>
                </div>
                <Link href="/contracts" className="text-text-accent hover:text-text-primary text-sm font-medium flex items-center gap-1">
                  Ver todos
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {recent_contracts.length > 0 ? (
                <div className="space-y-4">
                  {recent_contracts.slice(0, 5).map((contract) => {
                    const badge = getStatusBadge(contract.status);
                    return (
                      <Link
                        key={contract.id}
                        href={`/contracts/${contract.id}`}
                        className="flex items-start justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-medium text-text-primary truncate">
                              {contract.deceased_name}
                            </p>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${badge.className}`}>
                              {badge.label}
                            </span>
                          </div>
                          <p className="text-xs text-text-muted">
                            {contract.contract_number} • {contract.family_contact}
                          </p>
                          <p className="text-xs text-text-subtle mt-1">
                            {formatDate(contract.created_at)}
                          </p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-sm font-semibold text-text-primary">
                            ${contract.total.toLocaleString('es-CL')}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileSignature className="mx-auto h-12 w-12 text-text-subtle" />
                  <p className="mt-2 text-sm text-text-muted">No hay contratos recientes</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Services */}
          <Card className="border-gray-200 bg-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-text-primary">Servicios Próximos</CardTitle>
                  <CardDescription className="text-text-subtle">
                    Ceremonias programadas
                  </CardDescription>
                </div>
                <Link href="/contracts?view=calendar" className="text-text-accent hover:text-text-primary text-sm font-medium flex items-center gap-1">
                  Calendario
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {upcoming_services.length > 0 ? (
                <div className="space-y-4">
                  {upcoming_services.slice(0, 5).map((service) => (
                    <Link
                      key={service.id}
                      href={`/contracts/${service.id}`}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                    >
                      <div className="flex-shrink-0 mt-1">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50">
                          <Calendar className="h-5 w-5 text-text-accent" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">
                          {service.deceased_name}
                        </p>
                        <p className="text-xs text-text-muted mt-0.5">
                          {service.family_contact}
                        </p>
                        {service.service_date && (
                          <div className="flex items-center gap-1 mt-1">
                            <Clock className="h-3 w-3 text-text-subtle" />
                            <p className="text-xs text-text-subtle">
                              {formatDate(service.service_date)}
                            </p>
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="mx-auto h-12 w-12 text-text-subtle" />
                  <p className="mt-2 text-sm text-text-muted">No hay servicios programados</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-gray-200 bg-white">
          <CardHeader>
            <CardTitle className="text-text-primary">Acciones Rápidas</CardTitle>
            <CardDescription className="text-text-subtle">
              Accesos directos a tareas comunes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              <Link
                href="/contracts/create"
                className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100">
                  <FileSignature className="h-5 w-5 text-text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">Nuevo Contrato</p>
                  <p className="text-xs text-text-subtle">Registrar servicio</p>
                </div>
              </Link>
              <Link
                href="/payments"
                className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                  <Wallet className="h-5 w-5 text-green-700" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">Registrar Pago</p>
                  <p className="text-xs text-text-subtle">Procesar cobro</p>
                </div>
              </Link>
              <Link
                href="/inventory"
                className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                  <Archive className="h-5 w-5 text-amber-700" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">Ver Inventario</p>
                  <p className="text-xs text-text-subtle">Stock disponible</p>
                </div>
              </Link>
              <Link
                href="/reports"
                className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                  <TrendingUp className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">Ver Reportes</p>
                  <p className="text-xs text-text-subtle">Análisis y métricas</p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
