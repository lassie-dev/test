import { Head } from '@inertiajs/react';
import { useState } from 'react';
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
  Calendar,
  Package
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

interface Stats {
  contracts_this_month: number;
  revenue_this_month: number;
  expenses_this_month: number;
  balance: number;
}

interface IndexProps {
  stats: Stats;
}

export default function Index({ stats }: IndexProps) {
  const { t } = useTranslation();
  const [loadingReport, setLoadingReport] = useState<string | null>(null);

  // Helper to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Generate report with date range
  const handleGenerateReport = async (reportType: string) => {
    setLoadingReport(reportType);

    // Default to current month
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const endDate = now.toISOString().split('T')[0];

    try {
      let response;

      switch (reportType) {
        case 'sales':
          response = await axios.post('/reports/sales', { start_date: startDate, end_date: endDate });
          console.log('Sales Report:', response.data);
          // You could open a modal here to show the report data
          alert(`Sales Report Generated!\nTotal Revenue: ${formatCurrency(response.data.total_revenue)}\nTotal Contracts: ${response.data.total_contracts}`);
          break;

        case 'staff':
          response = await axios.post('/reports/staff', { start_date: startDate, end_date: endDate });
          console.log('Staff Report:', response.data);
          alert('Staff Report Generated! Check console for details.');
          break;

        case 'financial':
          response = await axios.post('/reports/financial', { start_date: startDate, end_date: endDate });
          console.log('Financial Report:', response.data);
          alert(`Financial Report Generated!\nCollected: ${formatCurrency(response.data.cash_flow.collected)}\nPending: ${formatCurrency(response.data.cash_flow.pending)}`);
          break;

        case 'inventory':
          response = await axios.get('/reports/inventory');
          console.log('Inventory Report:', response.data);
          alert(`Inventory Report Generated!\nStock Valuation: ${formatCurrency(response.data.stock_valuation)}\nLow Stock Items: ${response.data.low_stock.length}\nOut of Stock: ${response.data.out_of_stock.length}`);
          break;
      }
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Error generating report. Please try again.');
    } finally {
      setLoadingReport(null);
    }
  };

  // Export sales report
  const handleExportSales = () => {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const endDate = now.toISOString().split('T')[0];
    window.open(`/reports/export-sales?start_date=${startDate}&end_date=${endDate}`, '_blank');
  };

  const reportTypes = [
    {
      type: 'sales',
      title: t('reports.salesReport'),
      description: t('reports.salesReportDescription'),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      type: 'inventory',
      title: t('reports.inventoryReport'),
      description: t('reports.inventoryReportDescription'),
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      type: 'financial',
      title: t('reports.financialReport'),
      description: t('reports.financialReportDescription'),
      icon: TrendingUp,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      type: 'staff',
      title: t('reports.staffReport'),
      description: t('reports.staffReportDescription'),
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
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
              <div className="text-2xl font-bold">{stats.contracts_this_month}</div>
              <p className="text-xs text-muted-foreground">{t('reports.newContracts')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('reports.revenue')}</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.revenue_this_month)}</div>
              <p className="text-xs text-muted-foreground">{t('reports.collectedThisMonth')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('reports.expenses')}</CardTitle>
              <TrendingUp className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.expenses_this_month)}</div>
              <p className="text-xs text-muted-foreground">{t('reports.monthlyExpenses')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('reports.balance')}</CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stats.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(stats.balance)}
              </div>
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
              const isLoading = loadingReport === report.type;
              return (
                <Card key={report.type} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className={`rounded-lg p-2 ${report.bgColor}`}>
                        <Icon className={`h-5 w-5 ${report.color}`} />
                      </div>
                      {report.type === 'sales' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleExportSales}
                          title={t('reports.exportToCSV')}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <CardTitle className="text-lg">{report.title}</CardTitle>
                    <CardDescription>{report.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="outline"
                      className="w-full gap-2"
                      onClick={() => handleGenerateReport(report.type)}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <BarChart3 className="h-4 w-4 animate-spin" />
                          {t('common.loading')}
                        </>
                      ) : (
                        <>
                          <FileText className="h-4 w-4" />
                          {t('reports.generateReport')}
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

      </div>
    </MainLayout>
  );
}
