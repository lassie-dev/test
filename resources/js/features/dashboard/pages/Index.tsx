import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import RevenueTrendsChart from '@/features/dashboard/components/RevenueTrendsChart';
import ContractStatusChart from '@/features/dashboard/components/ContractStatusChart';
import ServicesTimelineChart from '@/features/dashboard/components/ServicesTimelineChart';
import PaymentStatusChart from '@/features/dashboard/components/PaymentStatusChart';
import BranchPerformanceChart from '@/features/dashboard/components/BranchPerformanceChart';
import { useTranslation } from 'react-i18next';
import {
  FileSignature,
  Calendar,
  Clock,
  ChevronRight,
  Building2,
} from 'lucide-react';

// Feature imports - NO re-exports
import type { DashboardProps } from '@/features/dashboard/types';
import {
  handleBranchChange,
  getStatusBadge,
  formatDate,
  generateStatCards,
} from '@/features/dashboard/functions';
import {
  ALL_BRANCHES_VALUE,
  QUICK_ACTIONS,
  MAX_RECENT_CONTRACTS,
  MAX_UPCOMING_SERVICES,
} from '@/features/dashboard/constants';
import {
  mockRevenueTrendsData,
  mockContractStatusData,
  mockPaymentStatusData,
  mockServicesTimelineData,
  mockBranchPerformanceData,
} from '@/features/dashboard/mockData';

export default function Dashboard({
  stats,
  recent_contracts = [],
  upcoming_services = [],
  branches = [],
  current_branch = null,
  is_admin = false
}: DashboardProps) {
  const { t } = useTranslation();
  const statCards = generateStatCards(stats);

  // Use mock data for charts
  const charts = {
    revenue_trends: mockRevenueTrendsData,
    contract_status: mockContractStatusData,
    payment_status: mockPaymentStatusData,
    services_timeline: mockServicesTimelineData,
    branch_performance: mockBranchPerformanceData,
  };

  return (
    <MainLayout>
      <Head />

      <div className="space-y-6">
        {/* Header with Branch Selector */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold font-display text-text-primary">{t('dashboard.title')}</h1>
            <p className="mt-2 text-sm text-text-muted">
              {t('dashboard.subtitle')}
            </p>
          </div>

          {/* Branch Selector - Only for admins */}
          {is_admin && branches.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <Building2 className="h-4 w-4" />
                <span>{t('dashboard.branch')}</span>
              </div>
              <select
                value={current_branch?.id || ALL_BRANCHES_VALUE}
                onChange={(e) => handleBranchChange(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              >
                <option value={ALL_BRANCHES_VALUE}>{t('dashboard.allBranches')}</option>
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
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.title} href={card.href}>
                <Card className="border-gray-200 bg-white hover:border-primary-300 transition-all cursor-pointer h-full">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-text-secondary">
                      {t(card.title)}
                    </CardTitle>
                    <div className={`rounded-lg p-2 ${card.bgColor}`}>
                      <Icon className={`h-5 w-5 ${card.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-text-primary">{card.value}</div>
                    <p className="text-xs text-text-subtle mt-1">{t(card.description)}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="space-y-6">
          {/* Revenue Trends Chart */}
          {charts.revenue_trends.length > 0 && (
            <RevenueTrendsChart data={charts.revenue_trends} />
          )}

          {/* Two Column Charts */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Contract Status Chart */}
            {charts.contract_status.length > 0 && (
              <ContractStatusChart data={charts.contract_status} />
            )}

            {/* Payment Status Chart */}
            {charts.payment_status.length > 0 && (
              <PaymentStatusChart data={charts.payment_status} />
            )}
          </div>

          {/* Services Timeline Chart */}
          {charts.services_timeline.length > 0 && (
            <ServicesTimelineChart data={charts.services_timeline} />
          )}

          {/* Branch Performance Chart - Only for Admins */}
          {is_admin && charts.branch_performance.length > 0 && (
            <BranchPerformanceChart data={charts.branch_performance} />
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Contracts */}
          <Card className="border-gray-200 bg-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-text-primary">{t('dashboard.recentContracts')}</CardTitle>
                  <CardDescription className="text-text-subtle">
                    {t('dashboard.lastRegisteredContracts')}
                  </CardDescription>
                </div>
                <Link href="/contracts" className="text-text-accent hover:text-text-primary text-sm font-medium flex items-center gap-1">
                  {t('common.viewAll')}
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {recent_contracts.length > 0 ? (
                <div className="space-y-4">
                  {recent_contracts.slice(0, MAX_RECENT_CONTRACTS).map((contract) => {
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
                              {t(badge.label)}
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
                  <p className="mt-2 text-sm text-text-muted">{t('dashboard.noRecentContracts')}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Services */}
          <Card className="border-gray-200 bg-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-text-primary">{t('dashboard.upcomingServices')}</CardTitle>
                  <CardDescription className="text-text-subtle">
                    {t('dashboard.scheduledCeremonies')}
                  </CardDescription>
                </div>
                <Link href="/contracts?view=calendar" className="text-text-accent hover:text-text-primary text-sm font-medium flex items-center gap-1">
                  {t('dashboard.calendar')}
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {upcoming_services.length > 0 ? (
                <div className="space-y-4">
                  {upcoming_services.slice(0, MAX_UPCOMING_SERVICES).map((service) => (
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
                  <p className="mt-2 text-sm text-text-muted">{t('dashboard.noScheduledServices')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-gray-200 bg-white">
          <CardHeader>
            <CardTitle className="text-text-primary">{t('dashboard.quickActions')}</CardTitle>
            <CardDescription className="text-text-subtle">
              {t('dashboard.commonTaskShortcuts')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              {QUICK_ACTIONS.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.title}
                    href={action.href}
                    className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all"
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${action.iconBg}`}>
                      <Icon className={`h-5 w-5 ${action.iconColor}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">{t(action.title)}</p>
                      <p className="text-xs text-text-subtle">{t(action.description)}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
