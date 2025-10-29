import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import MainLayout from '@/components/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  FileText,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface Payment {
  id: number;
  contract_id: number;
  contract_number: string;
  client_name: string;
  client_rut: string;
  deceased_name?: string;
  amount: number;
  payment_method?: string;
  payment_date?: string;
  due_date: string;
  status: string;
  receipt_number?: string;
  is_overdue: boolean;
  notes?: string;
  processed_by?: string;
  created_at: string;
}

interface PaginatedPayments {
  data: Payment[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface Stats {
  monthly_collected: number;
  pending_count: number;
  pending_amount: number;
  overdue_count: number;
  overdue_amount: number;
  total_owed: number;
}

interface Filters {
  search?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
}

interface Props {
  payments: PaginatedPayments;
  stats: Stats;
  filters: Filters;
}

export default function Index({ payments, stats, filters }: Props) {
  const { t } = useTranslation();
  const [search, setSearch] = useState(filters.search || '');
  const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
  const [dateFrom, setDateFrom] = useState(filters.date_from || '');
  const [dateTo, setDateTo] = useState(filters.date_to || '');
  const [markAsPaidDialogOpen, setMarkAsPaidDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [receiptNumber, setReceiptNumber] = useState('');
  const [notes, setNotes] = useState('');

  const handleSearch = () => {
    router.get(
      '/payments',
      {
        search,
        status: statusFilter === 'all' ? '' : statusFilter,
        date_from: dateFrom,
        date_to: dateTo,
      },
      { preserveState: true, preserveScroll: true }
    );
  };

  const handleMarkAsPaid = (payment: Payment) => {
    setSelectedPayment(payment);
    setPaymentMethod('cash');
    setPaymentDate(new Date().toISOString().split('T')[0]);
    setReceiptNumber('');
    setNotes('');
    setMarkAsPaidDialogOpen(true);
  };

  const submitMarkAsPaid = () => {
    if (!selectedPayment) return;

    router.post(
      `/payments/${selectedPayment.id}/mark-as-paid`,
      {
        payment_method: paymentMethod,
        payment_date: paymentDate,
        receipt_number: receiptNumber,
        notes: notes,
      },
      {
        onSuccess: () => {
          setMarkAsPaidDialogOpen(false);
          setSelectedPayment(null);
        },
      }
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getStatusBadge = (payment: Payment) => {
    if (payment.status === 'paid') {
      return (
        <Badge variant="default" className="bg-green-500 hover:bg-green-600">
          <CheckCircle className="mr-1 h-3 w-3" />
          {t('payments.paid')}
        </Badge>
      );
    }
    if (payment.is_overdue) {
      return (
        <Badge variant="destructive">
          <AlertTriangle className="mr-1 h-3 w-3" />
          {t('payments.overdue')}
        </Badge>
      );
    }
    return (
      <Badge variant="secondary">
        <Clock className="mr-1 h-3 w-3" />
        {t('payments.pending')}
      </Badge>
    );
  };

  const handleViewContract = (contractId: number) => {
    router.visit(`/contracts/${contractId}`);
  };

  const handlePrintReceipt = (payment: Payment) => {
    window.open(`/contracts/${payment.contract_id}/print-receipt/${payment.id}`, '_blank');
  };

  return (
    <MainLayout>
      <Head title={t('payments.title')} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('payments.title')}</h1>
            <p className="mt-2 text-sm text-gray-600">{t('payments.subtitle')}</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('payments.monthlyPayments')}
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.monthly_collected)}</div>
              <p className="text-xs text-muted-foreground">
                {t('payments.collectedThisMonth')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('payments.pendingPayments')}
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending_count}</div>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(stats.pending_amount)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('payments.overduePayments')}
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.overdue_count}</div>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(stats.overdue_amount)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('payments.totalOwed')}</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.total_owed)}</div>
              <p className="text-xs text-muted-foreground">
                {t('payments.totalPendingAmount')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder={t('payments.searchPlaceholder')}
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={t('payments.filterByStatus')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('payments.allStatuses')}</SelectItem>
                  <SelectItem value="pending">{t('payments.pending')}</SelectItem>
                  <SelectItem value="paid">{t('payments.paid')}</SelectItem>
                  <SelectItem value="overdue">{t('payments.overdue')}</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                placeholder={t('payments.from')}
              />
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                placeholder={t('payments.to')}
              />
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={handleSearch} className="gap-2">
                <Filter className="h-4 w-4" />
                {t('common.filter')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Payments Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              {t('payments.list')} ({payments.total})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {payments.data.length === 0 ? (
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
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('payments.contract')}</TableHead>
                      <TableHead>{t('payments.client')}</TableHead>
                      <TableHead>{t('payments.dueDate')}</TableHead>
                      <TableHead className="text-right">{t('payments.amount')}</TableHead>
                      <TableHead>{t('payments.status')}</TableHead>
                      <TableHead>{t('payments.paymentDate')}</TableHead>
                      <TableHead className="text-right">{t('common.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.data.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{payment.contract_number}</p>
                            {payment.deceased_name && (
                              <p className="text-xs text-gray-500">{payment.deceased_name}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{payment.client_name}</p>
                            <p className="text-xs text-gray-500">{payment.client_rut}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span
                            className={
                              payment.is_overdue && payment.status !== 'paid'
                                ? 'text-red-600 font-semibold'
                                : ''
                            }
                          >
                            {formatDate(payment.due_date)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatCurrency(payment.amount)}
                        </TableCell>
                        <TableCell>{getStatusBadge(payment)}</TableCell>
                        <TableCell>
                          {payment.payment_date ? (
                            <div>
                              <p className="text-sm">{formatDate(payment.payment_date)}</p>
                              {payment.receipt_number && (
                                <p className="text-xs text-gray-500">
                                  {t('payments.receiptNo')}: {payment.receipt_number}
                                </p>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewContract(payment.contract_id)}
                              title={t('payments.viewContract')}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {payment.status === 'paid' && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handlePrintReceipt(payment)}
                                title={t('contracts.printReceipt')}
                              >
                                <FileText className="h-4 w-4" />
                              </Button>
                            )}
                            {payment.status === 'pending' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleMarkAsPaid(payment)}
                                className="gap-1"
                              >
                                <CheckCircle className="h-4 w-4" />
                                {t('payments.markAsPaid')}
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Mark as Paid Dialog */}
      <Dialog open={markAsPaidDialogOpen} onOpenChange={setMarkAsPaidDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('payments.markAsPaidTitle')}</DialogTitle>
            <DialogDescription>
              {t('payments.markAsPaidDescription')}
              {selectedPayment && (
                <div className="mt-2 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm">
                    <strong>{t('payments.contract')}:</strong> {selectedPayment.contract_number}
                  </p>
                  <p className="text-sm">
                    <strong>{t('payments.client')}:</strong> {selectedPayment.client_name}
                  </p>
                  <p className="text-sm">
                    <strong>{t('payments.amount')}:</strong>{' '}
                    {formatCurrency(selectedPayment.amount)}
                  </p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="payment_method">{t('payments.paymentMethod')}</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger id="payment_method">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">{t('payments.cash')}</SelectItem>
                  <SelectItem value="credit">{t('payments.creditCard')}</SelectItem>
                  <SelectItem value="transfer">{t('payments.transfer')}</SelectItem>
                  <SelectItem value="check">{t('payments.check')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="payment_date">{t('payments.paymentDate')}</Label>
              <Input
                id="payment_date"
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="receipt_number">{t('payments.receiptNumber')}</Label>
              <Input
                id="receipt_number"
                value={receiptNumber}
                onChange={(e) => setReceiptNumber(e.target.value)}
                placeholder={t('payments.receiptNumberPlaceholder')}
              />
            </div>
            <div>
              <Label htmlFor="notes">{t('payments.notes')}</Label>
              <Input
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t('payments.notesPlaceholder')}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMarkAsPaidDialogOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={submitMarkAsPaid}>{t('payments.confirmPayment')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
