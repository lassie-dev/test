import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Calendar, Download, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ProfitLossData {
  period: {
    start: string;
    end: string;
  };
  revenue: number;
  expenses: Record<string, number>;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
}

export default function ProfitLoss() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ProfitLossData | null>(null);
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const fetchProfitLoss = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/expenses/profit-loss?start_date=${startDate}&end_date=${endDate}`);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching P&L data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfitLoss();
  }, []);

  // Prepare data for expense breakdown chart
  const expenseChartData = data
    ? Object.entries(data.expenses).map(([category, amount]) => ({
        category: t(`expenses.${category}`),
        amount: amount,
        percentage: ((amount / data.totalExpenses) * 100).toFixed(1),
      }))
    : [];

  // Colors for pie chart
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

  // Prepare data for revenue vs expenses comparison
  const comparisonData = data
    ? [
        { name: t('expenses.revenue'), value: data.revenue },
        { name: t('expenses.totalExpenses'), value: data.totalExpenses },
        { name: t('expenses.netProfit'), value: data.netProfit },
      ]
    : [];

  const isProfitable = data && data.netProfit > 0;
  const profitMarginColor = data
    ? data.profitMargin >= 35
      ? 'text-green-600'
      : data.profitMargin >= 20
      ? 'text-yellow-600'
      : 'text-red-600'
    : '';

  return (
    <MainLayout>
      <Head title={t('expenses.profitLossStatement')} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('expenses.profitLossStatement')}</h1>
            <p className="mt-2 text-sm text-gray-600">{t('expenses.profitLossDescription')}</p>
          </div>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            {t('common.exportPDF')}
          </Button>
        </div>

        {/* Date Range Selector */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {t('expenses.selectPeriod')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex-1 min-w-[200px]">
                <Label htmlFor="start_date">{t('common.from')}</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="flex-1 min-w-[200px]">
                <Label htmlFor="end_date">{t('common.to')}</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <Button onClick={fetchProfitLoss} disabled={loading}>
                {loading ? t('common.loading') : t('common.generate')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {data && (
          <>
            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t('expenses.totalRevenue')}</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{formatCurrency(data.revenue)}</div>
                  <p className="text-xs text-muted-foreground">{t('expenses.fromContracts')}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t('expenses.totalExpenses')}</CardTitle>
                  <TrendingDown className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{formatCurrency(data.totalExpenses)}</div>
                  <p className="text-xs text-muted-foreground">
                    {((data.totalExpenses / data.revenue) * 100).toFixed(1)}% {t('expenses.ofRevenue')}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t('expenses.netProfit')}</CardTitle>
                  {isProfitable ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${isProfitable ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(data.netProfit)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isProfitable ? t('expenses.profitable') : t('expenses.losing')}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t('expenses.profitMargin')}</CardTitle>
                  <TrendingUp className={`h-4 w-4 ${profitMarginColor}`} />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${profitMarginColor}`}>{data.profitMargin.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground">
                    {t('expenses.target')}: 35%{' '}
                    {data.profitMargin >= 35 ? '✅' : data.profitMargin >= 20 ? '⚠️' : '🔴'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Alert for low profit margin */}
            {data.profitMargin < 20 && (
              <Alert className="border-red-500 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <strong>{t('expenses.lowProfitWarning')}</strong> {t('expenses.lowProfitDescription')}
                </AlertDescription>
              </Alert>
            )}

            {/* Alert for negative profit */}
            {data.netProfit < 0 && (
              <Alert className="border-red-600 bg-red-100">
                <AlertCircle className="h-4 w-4 text-red-700" />
                <AlertDescription className="text-red-900">
                  <strong>{t('expenses.negativeProfit')}</strong> {t('expenses.negativeDescription')}
                </AlertDescription>
              </Alert>
            )}

            {/* Charts Row */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Revenue vs Expenses Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('expenses.revenueVsExpenses')}</CardTitle>
                  <CardDescription>{t('expenses.financialOverview')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value)}
                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
                      />
                      <Bar dataKey="value" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Expense Breakdown by Category */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('expenses.expenseBreakdown')}</CardTitle>
                  <CardDescription>{t('expenses.byCategory')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={expenseChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.category}: ${entry.percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="amount"
                      >
                        {expenseChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Detailed P&L Statement Table */}
            <Card>
              <CardHeader>
                <CardTitle>{t('expenses.detailedStatement')}</CardTitle>
                <CardDescription>
                  {t('expenses.periodStatement')}:{' '}
                  {new Date(data.period.start).toLocaleDateString('es-CL')} -{' '}
                  {new Date(data.period.end).toLocaleDateString('es-CL')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Revenue Section */}
                  <div className="border-b pb-4">
                    <div className="flex justify-between text-lg font-semibold text-green-700">
                      <span>{t('expenses.totalRevenue')}</span>
                      <span>{formatCurrency(data.revenue)}</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{t('expenses.contractsCompleted')}</p>
                  </div>

                  {/* Expenses Section */}
                  <div className="border-b pb-4">
                    <div className="mb-3 text-lg font-semibold text-gray-700">{t('expenses.expensesByCategory')}</div>
                    <div className="space-y-2">
                      {Object.entries(data.expenses).map(([category, amount]) => (
                        <div key={category} className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            {t(`expenses.${category}`)}
                            <span className="ml-2 text-gray-400">
                              ({((amount / data.totalExpenses) * 100).toFixed(1)}%)
                            </span>
                          </span>
                          <span className="font-medium text-red-600">{formatCurrency(amount)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex justify-between border-t pt-3 font-semibold text-red-700">
                      <span>{t('expenses.totalExpenses')}</span>
                      <span>{formatCurrency(data.totalExpenses)}</span>
                    </div>
                  </div>

                  {/* Net Profit Section */}
                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="flex items-center justify-between text-xl font-bold">
                      <span className="text-gray-700">{t('expenses.netProfit')}</span>
                      <span className={isProfitable ? 'text-green-600' : 'text-red-600'}>
                        {formatCurrency(data.netProfit)}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
                      <span>{t('expenses.profitMargin')}</span>
                      <span className={`font-semibold ${profitMarginColor}`}>{data.profitMargin.toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {!data && !loading && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">{t('expenses.selectPeriodToGenerate')}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
