import { Head, router, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
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
import { AlertCircle, Building2, User, CreditCard, FileText } from 'lucide-react';

export default function Create() {
  const { t } = useTranslation();

  const { data, setData, post, processing, errors } = useForm({
    code: '',
    company_name: '',
    contact_name: '',
    contact_phone: '',
    contact_email: '',
    address: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    covered_employees: '',
    status: 'active',
    discount_percentage: '',
    company_pays_percentage: '50',
    employee_pays_percentage: '50',
    payment_method: 'direct_billing',
    credit_months: '12',
    included_services: '',
    special_conditions: '',
    notes: '',
  });

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length === 0) return '';
    if (cleaned.length <= 1) return `+56 ${cleaned}`;
    if (cleaned.length <= 5) return `+56 ${cleaned.slice(0, 1)} ${cleaned.slice(1)}`;
    return `+56 ${cleaned.slice(0, 1)} ${cleaned.slice(1, 5)} ${cleaned.slice(5, 9)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setData('contact_phone', formatted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate percentages add up to 100
    const companyPays = parseFloat(data.company_pays_percentage);
    const employeePays = parseFloat(data.employee_pays_percentage);
    if (companyPays + employeePays !== 100) {
      alert(t('agreements.percentageMustAddTo100'));
      return;
    }

    post('/agreements', {
      onSuccess: () => {
        router.visit('/agreements');
      },
    });
  };

  const companyPaysAmount = parseFloat(data.company_pays_percentage || '0');
  const employeePaysAmount = parseFloat(data.employee_pays_percentage || '0');
  const totalPercentage = companyPaysAmount + employeePaysAmount;
  const percentageValid = totalPercentage === 100;

  return (
    <MainLayout>
      <Head title={t('agreements.create')} />

      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('agreements.create')}</h1>
          <p className="mt-2 text-sm text-gray-600">{t('agreements.createDescription')}</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Company Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                {t('agreements.companyInformation')}
              </CardTitle>
              <CardDescription>{t('agreements.companyInformationDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Agreement Code and Company Name */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="code">
                    {t('agreements.code')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="code"
                    value={data.code}
                    onChange={(e) => setData('code', e.target.value.toUpperCase())}
                    placeholder="AGR-001"
                    required
                    maxLength={50}
                  />
                  {errors.code && <p className="mt-1 text-sm text-red-600">{errors.code}</p>}
                  <p className="mt-1 text-xs text-gray-500">{t('agreements.codeExample')}</p>
                </div>

                <div>
                  <Label htmlFor="company_name">
                    {t('agreements.companyName')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="company_name"
                    value={data.company_name}
                    onChange={(e) => setData('company_name', e.target.value)}
                    placeholder={t('agreements.companyNamePlaceholder')}
                    required
                  />
                  {errors.company_name && <p className="mt-1 text-sm text-red-600">{errors.company_name}</p>}
                </div>
              </div>

              {/* Covered Employees and Status */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="covered_employees">
                    {t('agreements.coveredEmployees')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="covered_employees"
                    type="number"
                    min="0"
                    value={data.covered_employees}
                    onChange={(e) => setData('covered_employees', e.target.value)}
                    placeholder="1000"
                    required
                  />
                  {errors.covered_employees && <p className="mt-1 text-sm text-red-600">{errors.covered_employees}</p>}
                </div>

                <div>
                  <Label htmlFor="status">{t('common.status')}</Label>
                  <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">{t('agreements.statusActive')}</SelectItem>
                      <SelectItem value="suspended">{t('agreements.statusSuspended')}</SelectItem>
                      <SelectItem value="expired">{t('agreements.statusExpired')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Address */}
              <div>
                <Label htmlFor="address">{t('agreements.address')}</Label>
                <Textarea
                  id="address"
                  value={data.address}
                  onChange={(e) => setData('address', e.target.value)}
                  placeholder={t('agreements.addressPlaceholder')}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {t('agreements.contactInformation')}
              </CardTitle>
              <CardDescription>{t('agreements.contactInformationDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="contact_name">
                    {t('agreements.contactName')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="contact_name"
                    value={data.contact_name}
                    onChange={(e) => setData('contact_name', e.target.value)}
                    placeholder={t('agreements.contactNamePlaceholder')}
                    required
                  />
                  {errors.contact_name && <p className="mt-1 text-sm text-red-600">{errors.contact_name}</p>}
                </div>

                <div>
                  <Label htmlFor="contact_phone">
                    {t('agreements.contactPhone')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="contact_phone"
                    value={data.contact_phone}
                    onChange={handlePhoneChange}
                    placeholder="+56 9 8765 4321"
                    required
                  />
                  {errors.contact_phone && <p className="mt-1 text-sm text-red-600">{errors.contact_phone}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="contact_email">{t('agreements.contactEmail')}</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={data.contact_email}
                  onChange={(e) => setData('contact_email', e.target.value)}
                  placeholder="hr.benefits@company.cl"
                />
                {errors.contact_email && <p className="mt-1 text-sm text-red-600">{errors.contact_email}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Contract Period */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{t('agreements.contractPeriod')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="start_date">
                    {t('agreements.startDate')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={data.start_date}
                    onChange={(e) => setData('start_date', e.target.value)}
                    required
                  />
                  {errors.start_date && <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>}
                </div>

                <div>
                  <Label htmlFor="end_date">
                    {t('agreements.endDate')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={data.end_date}
                    onChange={(e) => setData('end_date', e.target.value)}
                    required
                  />
                  {errors.end_date && <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Terms */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                {t('agreements.financialTerms')}
              </CardTitle>
              <CardDescription>{t('agreements.financialTermsDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Discount */}
              <div>
                <Label htmlFor="discount_percentage">
                  {t('agreements.discountPercentage')} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="discount_percentage"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={data.discount_percentage}
                  onChange={(e) => setData('discount_percentage', e.target.value)}
                  placeholder="25"
                  required
                />
                {errors.discount_percentage && <p className="mt-1 text-sm text-red-600">{errors.discount_percentage}</p>}
                <p className="mt-1 text-xs text-gray-500">{t('agreements.discountExample')}</p>
              </div>

              {/* Payment Split */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="company_pays_percentage">
                    {t('agreements.companyPaysPercentage')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="company_pays_percentage"
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={data.company_pays_percentage}
                    onChange={(e) => setData('company_pays_percentage', e.target.value)}
                    required
                  />
                  {errors.company_pays_percentage && <p className="mt-1 text-sm text-red-600">{errors.company_pays_percentage}</p>}
                </div>

                <div>
                  <Label htmlFor="employee_pays_percentage">
                    {t('agreements.employeePaysPercentage')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="employee_pays_percentage"
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={data.employee_pays_percentage}
                    onChange={(e) => setData('employee_pays_percentage', e.target.value)}
                    required
                  />
                  {errors.employee_pays_percentage && <p className="mt-1 text-sm text-red-600">{errors.employee_pays_percentage}</p>}
                </div>
              </div>

              {!percentageValid && totalPercentage > 0 && (
                <Alert className="border-red-500 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-sm text-red-800">
                    {t('agreements.percentageWarning', { total: totalPercentage })}
                  </AlertDescription>
                </Alert>
              )}

              {/* Payment Method and Credit Terms */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="payment_method">{t('agreements.paymentMethod')}</Label>
                  <Select value={data.payment_method} onValueChange={(value) => setData('payment_method', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="direct_billing">{t('agreements.directBilling')}</SelectItem>
                      <SelectItem value="reimbursement">{t('agreements.reimbursement')}</SelectItem>
                      <SelectItem value="mixed">{t('agreements.mixed')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="credit_months">
                    {t('agreements.creditMonths')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="credit_months"
                    type="number"
                    min="1"
                    max="60"
                    value={data.credit_months}
                    onChange={(e) => setData('credit_months', e.target.value)}
                    required
                  />
                  {errors.credit_months && <p className="mt-1 text-sm text-red-600">{errors.credit_months}</p>}
                  <p className="mt-1 text-xs text-gray-500">{t('agreements.creditMonthsExample')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Services and Conditions */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {t('agreements.servicesAndConditions')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="included_services">{t('agreements.includedServices')}</Label>
                <Textarea
                  id="included_services"
                  value={data.included_services}
                  onChange={(e) => setData('included_services', e.target.value)}
                  placeholder={t('agreements.includedServicesPlaceholder')}
                  rows={4}
                />
                <p className="mt-1 text-xs text-gray-500">{t('agreements.includedServicesHint')}</p>
              </div>

              <div>
                <Label htmlFor="special_conditions">{t('agreements.specialConditions')}</Label>
                <Textarea
                  id="special_conditions"
                  value={data.special_conditions}
                  onChange={(e) => setData('special_conditions', e.target.value)}
                  placeholder={t('agreements.specialConditionsPlaceholder')}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="notes">{t('common.notes')}</Label>
                <Textarea
                  id="notes"
                  value={data.notes}
                  onChange={(e) => setData('notes', e.target.value)}
                  placeholder={t('agreements.notesPlaceholder')}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.visit('/agreements')}
              disabled={processing}
            >
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={processing || !percentageValid}>
              {processing ? t('common.saving') : t('agreements.createAgreement')}
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
