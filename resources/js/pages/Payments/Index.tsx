import { Head } from '@inertiajs/react';
import MainLayout from '@/components/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter, DollarSign, TrendingUp, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';

export default function Index() {
  const { t } = useTranslation();
  return (
    <MainLayout>
      <Head />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('payments.title')}</h1>
            <p className="mt-2 text-sm text-gray-600">
              {t('payments.subtitle')}
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            {t('payments.register')}
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('payments.monthlyPayments')}</CardTitle>
              <DollarSign className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$0</div>
              <p className="text-xs text-muted-foreground">{t('payments.collectedThisMonth')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('payments.pendingPayments')}</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">{t('payments.paymentsToCollect')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('payments.overduePayments')}</CardTitle>
              <Clock className="h-4 w-4 text-error" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">{t('payments.overduePaymentsDescription')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('payments.totalOwed')}</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$0</div>
              <p className="text-xs text-muted-foreground">{t('payments.totalPendingAmount')}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input placeholder={t('payments.searchPlaceholder')} className="pl-9" />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                {t('common.filters')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Empty State */}
        <Card>
          <CardHeader>
            <CardTitle>{t('payments.list')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-gray-100 p-3 mb-4">
                <DollarSign className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {t('payments.noPayments')}
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                {t('payments.noPaymentsDescription')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
