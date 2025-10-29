import { Head, router, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Upload, FileText, CheckCircle } from 'lucide-react';

export default function Create() {
  const { t } = useTranslation();
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  const { data, setData, post, processing, errors } = useForm({
    category: '',
    subcategory: '',
    description: '',
    amount: '',
    expense_date: new Date().toISOString().split('T')[0],
    payment_method: '',
    vendor_name: '',
    vendor_rut: '',
    invoice_number: '',
    receipt: null as File | null,
    is_recurring: false,
    recurring_frequency: '',
    status: 'pending',
    notes: '',
  });

  // Format RUT as user types
  const formatRUT = (value: string) => {
    const clean = value.replace(/[^0-9kK]/g, '');
    if (clean.length <= 1) return clean;

    const body = clean.slice(0, -1);
    const verifier = clean.slice(-1);

    // Format with dots and dash: 12.345.678-9
    const formatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${formatted}-${verifier}`;
  };

  const handleRUTChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatRUT(e.target.value);
    setData('vendor_rut', formatted);
  };

  // Check for duplicate invoice number
  const checkDuplicateInvoice = async (invoiceNumber: string) => {
    if (!invoiceNumber || invoiceNumber.length < 3) {
      setDuplicateWarning(null);
      return;
    }

    try {
      const response = await fetch(`/api/expenses/check-duplicate?invoice_number=${invoiceNumber}`);
      const result = await response.json();

      if (result.exists) {
        setDuplicateWarning(
          `⚠️ ${t('expenses.duplicateInvoiceWarning')}: ${result.expense.description} (${new Date(result.expense.expense_date).toLocaleDateString('es-CL')}) - ${formatCurrency(result.expense.amount)}`
        );
      } else {
        setDuplicateWarning(null);
      }
    } catch (error) {
      console.error('Error checking duplicate:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert(t('expenses.fileTooLarge'));
        return;
      }

      // Check file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        alert(t('expenses.invalidFileType'));
        return;
      }

      setReceiptFile(file);
      setData('receipt', file);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation: Receipt required for amounts >= 50,000
    const amount = parseFloat(data.amount);
    if (amount >= 50000 && !data.receipt) {
      alert(t('expenses.receiptRequiredForLargeExpenses'));
      return;
    }

    post('/expenses', {
      forceFormData: true,
      onSuccess: () => {
        router.visit('/expenses');
      },
    });
  };

  // Check if amount requires receipt
  const requiresReceipt = parseFloat(data.amount || '0') >= 50000;

  return (
    <MainLayout>
      <Head title={t('expenses.create')} />

      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('expenses.create')}</h1>
          <p className="mt-2 text-sm text-gray-600">{t('expenses.createDescription')}</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Basic Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{t('expenses.basicInformation')}</CardTitle>
              <CardDescription>{t('expenses.basicInformationDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Category */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="category">
                    {t('expenses.category')} <span className="text-red-500">*</span>
                  </Label>
                  <Select value={data.category} onValueChange={(value) => setData('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('expenses.selectCategory')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="salaries">{t('expenses.salaries')}</SelectItem>
                      <SelectItem value="inventory">{t('expenses.inventory')}</SelectItem>
                      <SelectItem value="vehicle">{t('expenses.vehicle')}</SelectItem>
                      <SelectItem value="facilities">{t('expenses.facilities')}</SelectItem>
                      <SelectItem value="marketing">{t('expenses.marketing')}</SelectItem>
                      <SelectItem value="professional">{t('expenses.professional')}</SelectItem>
                      <SelectItem value="administrative">{t('expenses.administrative')}</SelectItem>
                      <SelectItem value="other">{t('expenses.other')}</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                </div>

                <div>
                  <Label htmlFor="subcategory">{t('expenses.subcategory')}</Label>
                  <Input
                    id="subcategory"
                    value={data.subcategory}
                    onChange={(e) => setData('subcategory', e.target.value)}
                    placeholder={t('expenses.subcategoryPlaceholder')}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">
                  {t('expenses.description')} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="description"
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  placeholder={t('expenses.descriptionPlaceholder')}
                  required
                />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
              </div>

              {/* Amount and Date */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="amount">
                    {t('common.amount')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    step="1"
                    min="0"
                    value={data.amount}
                    onChange={(e) => setData('amount', e.target.value)}
                    placeholder="500000"
                    required
                  />
                  {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount}</p>}
                  {data.amount && (
                    <p className="mt-1 text-sm text-gray-600">
                      {formatCurrency(parseFloat(data.amount))}
                    </p>
                  )}
                  {requiresReceipt && (
                    <Alert className="mt-2 border-yellow-500 bg-yellow-50">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <AlertDescription className="text-xs text-yellow-800">
                        {t('expenses.receiptRequiredAlert')}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <div>
                  <Label htmlFor="expense_date">
                    {t('common.date')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="expense_date"
                    type="date"
                    value={data.expense_date}
                    onChange={(e) => setData('expense_date', e.target.value)}
                    required
                  />
                  {errors.expense_date && <p className="mt-1 text-sm text-red-600">{errors.expense_date}</p>}
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <Label htmlFor="payment_method">
                  {t('expenses.paymentMethod')} <span className="text-red-500">*</span>
                </Label>
                <Select value={data.payment_method} onValueChange={(value) => setData('payment_method', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('expenses.selectPaymentMethod')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">{t('expenses.cash')}</SelectItem>
                    <SelectItem value="transfer">{t('expenses.transfer')}</SelectItem>
                    <SelectItem value="check">{t('expenses.check')}</SelectItem>
                    <SelectItem value="credit_card">{t('expenses.creditCard')}</SelectItem>
                  </SelectContent>
                </Select>
                {errors.payment_method && <p className="mt-1 text-sm text-red-600">{errors.payment_method}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Vendor Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{t('expenses.vendorInformation')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="vendor_name">{t('expenses.vendorName')}</Label>
                  <Input
                    id="vendor_name"
                    value={data.vendor_name}
                    onChange={(e) => setData('vendor_name', e.target.value)}
                    placeholder={t('expenses.vendorNamePlaceholder')}
                  />
                </div>

                <div>
                  <Label htmlFor="vendor_rut">{t('expenses.vendorRUT')}</Label>
                  <Input
                    id="vendor_rut"
                    value={data.vendor_rut}
                    onChange={handleRUTChange}
                    placeholder="12.345.678-9"
                    maxLength={12}
                  />
                  {errors.vendor_rut && <p className="mt-1 text-sm text-red-600">{errors.vendor_rut}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="invoice_number">
                  {t('expenses.invoiceNumber')} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="invoice_number"
                  value={data.invoice_number}
                  onChange={(e) => {
                    setData('invoice_number', e.target.value);
                    checkDuplicateInvoice(e.target.value);
                  }}
                  placeholder={t('expenses.invoiceNumberPlaceholder')}
                />
                {errors.invoice_number && <p className="mt-1 text-sm text-red-600">{errors.invoice_number}</p>}
                {duplicateWarning && (
                  <Alert className="mt-2 border-red-500 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-sm text-red-800">
                      {duplicateWarning}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Receipt Upload */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>
                {t('expenses.receiptUpload')}
                {requiresReceipt && <span className="text-red-500"> *</span>}
              </CardTitle>
              <CardDescription>
                {t('expenses.receiptUploadDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="receipt" className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    {t('expenses.uploadReceipt')}
                  </Label>
                  <Input
                    id="receipt"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="mt-2"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {t('expenses.acceptedFormats')}: PDF, JPG, PNG (max 5MB)
                  </p>
                </div>

                {receiptFile && (
                  <Alert className="border-green-500 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-sm text-green-800">
                      <FileText className="mr-2 inline h-4 w-4" />
                      {receiptFile.name} ({(receiptFile.size / 1024).toFixed(0)} KB)
                    </AlertDescription>
                  </Alert>
                )}

                {!data.receipt && requiresReceipt && (
                  <Alert className="border-orange-500 bg-orange-50">
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                    <AlertDescription className="text-sm text-orange-800">
                      {t('expenses.receiptMandatoryWarning')}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{t('expenses.additionalInformation')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="notes">{t('expenses.notes')}</Label>
                <Textarea
                  id="notes"
                  value={data.notes}
                  onChange={(e) => setData('notes', e.target.value)}
                  placeholder={t('expenses.notesPlaceholder')}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="status">{t('common.status')}</Label>
                <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">{t('expenses.statusPending')}</SelectItem>
                    <SelectItem value="approved">{t('expenses.statusApproved')}</SelectItem>
                    <SelectItem value="paid">{t('expenses.statusPaid')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.visit('/expenses')}
              disabled={processing}
            >
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={processing || (requiresReceipt && !data.receipt)}>
              {processing ? t('common.saving') : t('expenses.createExpense')}
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
