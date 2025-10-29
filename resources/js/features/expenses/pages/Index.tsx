import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import MainLayout from '@/components/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Search, DollarSign, AlertCircle, TrendingDown } from 'lucide-react';

interface Expense {
  id: number;
  category: string;
  description: string;
  amount: number;
  expense_date: string;
  status: string;
  vendor_name: string | null;
  invoice_number: string | null;
  receipt_path: string | null;
}

interface Stats {
  thisMonthTotal: number;
  pendingCount: number;
  byCategory: Record<string, number>;
}

interface IndexProps {
  expenses: {
    data: Expense[];
    links: any[];
    current_page: number;
    last_page: number;
  };
  filters: {
    category?: string;
    status?: string;
    search?: string;
    date_from?: string;
    date_to?: string;
  };
  stats: Stats;
}

export default function Index({ expenses, filters, stats }: IndexProps) {
  const { t } = useTranslation();
  const [search, setSearch] = useState(filters.search || '');
  const [category, setCategory] = useState(filters.category || '');
  const [status, setStatus] = useState(filters.status || '');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleSearch = () => {
    router.get('/expenses', {
      search,
      category,
      status,
    }, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      salaries: 'bg-blue-100 text-blue-800',
      supplies: 'bg-green-100 text-green-800',
      utilities: 'bg-yellow-100 text-yellow-800',
      vehicle: 'bg-purple-100 text-purple-800',
      maintenance: 'bg-orange-100 text-orange-800',
      marketing: 'bg-pink-100 text-pink-800',
      administrative: 'bg-gray-100 text-gray-800',
      other: 'bg-slate-100 text-slate-800',
    };
    return <Badge className={colors[category] || ''}>{t(`expenses.${category}`)}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-blue-100 text-blue-800',
      paid: 'bg-green-100 text-green-800',
    };
    return <Badge className={colors[status]}>{t(`expenses.status${status.charAt(0).toUpperCase() + status.slice(1)}`)}</Badge>;
  };

  return (
    <MainLayout>
      <Head title={t('expenses.title')} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('expenses.title')}</h1>
            <p className="mt-2 text-sm text-gray-600">{t('expenses.subtitle')}</p>
          </div>
          <div className="flex gap-2">
            <Link href="/expenses/profit-loss-report">
              <Button variant="outline">
                <TrendingDown className="mr-2 h-4 w-4" />
                {t('expenses.profitLossStatement')}
              </Button>
            </Link>
            <Link href="/expenses/create">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {t('expenses.create')}
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('expenses.thisMonthTotal')}</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.thisMonthTotal)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('expenses.pendingApproval')}</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('expenses.topCategory')}</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">
                {Object.keys(stats.byCategory).length > 0 ? (
                  <>
                    {t(`expenses.${Object.keys(stats.byCategory).reduce((a, b) =>
                      stats.byCategory[a] > stats.byCategory[b] ? a : b
                    )}`)}
                  </>
                ) : (
                  t('common.noDataAvailable')
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder={t('expenses.searchPlaceholder')}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder={t('expenses.selectCategory')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t('common.all')}</SelectItem>
                  <SelectItem value="salaries">{t('expenses.salaries')}</SelectItem>
                  <SelectItem value="supplies">{t('expenses.supplies')}</SelectItem>
                  <SelectItem value="utilities">{t('expenses.utilities')}</SelectItem>
                  <SelectItem value="vehicle">{t('expenses.vehicle')}</SelectItem>
                  <SelectItem value="maintenance">{t('expenses.maintenance')}</SelectItem>
                  <SelectItem value="marketing">{t('expenses.marketing')}</SelectItem>
                  <SelectItem value="administrative">{t('expenses.administrative')}</SelectItem>
                  <SelectItem value="other">{t('expenses.other')}</SelectItem>
                </SelectContent>
              </Select>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder={t('expenses.selectStatus')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t('common.all')}</SelectItem>
                  <SelectItem value="pending">{t('expenses.statusPending')}</SelectItem>
                  <SelectItem value="approved">{t('expenses.statusApproved')}</SelectItem>
                  <SelectItem value="paid">{t('expenses.statusPaid')}</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleSearch}>
                <Search className="mr-2 h-4 w-4" />
                {t('common.search')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Expenses Table */}
        <Card>
          <CardHeader>
            <CardTitle>{t('expenses.list')}</CardTitle>
          </CardHeader>
          <CardContent>
            {expenses.data.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('common.date')}</TableHead>
                    <TableHead>{t('expenses.category')}</TableHead>
                    <TableHead>{t('expenses.description')}</TableHead>
                    <TableHead>{t('expenses.vendor')}</TableHead>
                    <TableHead>{t('common.amount')}</TableHead>
                    <TableHead>{t('common.status')}</TableHead>
                    <TableHead>{t('expenses.receipt')}</TableHead>
                    <TableHead>{t('common.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.data.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>{new Date(expense.expense_date).toLocaleDateString('es-CL')}</TableCell>
                      <TableCell>{getCategoryBadge(expense.category)}</TableCell>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell>{expense.vendor_name || '-'}</TableCell>
                      <TableCell className="font-semibold">{formatCurrency(expense.amount)}</TableCell>
                      <TableCell>{getStatusBadge(expense.status)}</TableCell>
                      <TableCell>
                        {expense.receipt_path ? (
                          <Badge variant="secondary">{t('common.yes')}</Badge>
                        ) : (
                          <span className="text-gray-400">{t('common.no')}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Link href={`/expenses/${expense.id}`}>
                          <Button variant="ghost" size="sm">
                            {t('common.view')}
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="py-12 text-center">
                <p className="text-gray-500">{t('expenses.noExpenses')}</p>
                <p className="mt-2 text-sm text-gray-400">{t('expenses.noExpensesDescription')}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
