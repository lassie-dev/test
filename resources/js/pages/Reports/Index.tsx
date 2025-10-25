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
import { useTranslation } from 'react-i18next';

export default function Index() {
  const { t } = useTranslation();

  const reportTypes = [
    {
      title: t('reports.salesReport'),
      description: t('reports.salesReportDescription'),
      icon: DollarSign,
      color: 'text-success',
      bgColor: 'bg-green-50',
    },
    {
      title: t('reports.inventoryReport'),
      description: t('reports.inventoryReportDescription'),
      icon: BarChart3,
      color: 'text-info',
      bgColor: 'bg-blue-50',
    },
    {
      title: t('reports.paymentsReport'),
      description: t('reports.paymentsReportDescription'),
      icon: TrendingUp,
      color: 'text-warning',
      bgColor: 'bg-amber-50',
    },
    {
      title: t('reports.staffReport'),
      description: t('reports.staffReportDescription'),
      icon: Users,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
    },
    {
      title: t('reports.monthlyReport'),
      description: t('reports.monthlyReportDescription'),
      icon: Calendar,
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-50',
    },
    {
      title: t('reports.customReport'),
      description: t('reports.customReportDescription'),
      icon: FileText,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
    },
  ];

  return (
    <MainLayout>
      <Head />

      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('reports.title')}</h1>
          <p className="mt-2 text-sm text-gray-600">
            {t('reports.subtitle')}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('reports.contractsThisMonth')}</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">{t('reports.newContracts')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('reports.revenue')}</CardTitle>
              <DollarSign className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$0</div>
              <p className="text-xs text-muted-foreground">{t('reports.collectedThisMonth')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('reports.expenses')}</CardTitle>
              <TrendingUp className="h-4 w-4 text-error" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$0</div>
              <p className="text-xs text-muted-foreground">{t('reports.monthlyExpenses')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('reports.balance')}</CardTitle>
              <BarChart3 className="h-4 w-4 text-info" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$0</div>
              <p className="text-xs text-muted-foreground">{t('reports.monthlyProfit')}</p>
            </CardContent>
          </Card>
        </div>

        {/* Report Types */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('reports.reportTypes')}</h2>
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
                      {t('reports.generateReport')}
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
            <CardTitle>{t('reports.recentReports')}</CardTitle>
            <CardDescription>{t('reports.lastGeneratedReports')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-gray-100 p-3 mb-4">
                <FileText className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {t('reports.noReports')}
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                {t('reports.noReportsDescription')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
