import { Head, router, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import MainLayout from '@/components/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';
import type { Branch, StaffFormData } from '../types';

interface Props {
  branches: Branch[];
}

export default function Create({ branches }: Props) {
  const { t } = useTranslation();
  const { data, setData, post, processing, errors } = useForm<StaffFormData>({
    name: '',
    rut: '',
    role: '',
    email: '',
    phone: '',
    address: '',
    hire_date: '',
    base_salary: '',
    bank_account: '',
    bank_name: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    vehicle_plate: '',
    vehicle_model: '',
    is_active: true,
    branch_id: '',
    notes: '',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    post('/staff');
  };

  const roleOptions = [
    { value: 'secretaria', labelKey: 'staff.roles.secretary' },
    { value: 'conductor', labelKey: 'staff.roles.driver' },
    { value: 'auxiliar', labelKey: 'staff.roles.assistant' },
    { value: 'administrador', labelKey: 'staff.roles.administrator' },
    { value: 'propietario', labelKey: 'staff.roles.owner' },
  ];

  const isDriver = data.role === 'conductor';

  return (
    <MainLayout>
      <Head title={t('staff.addEmployee')} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('staff.addEmployee')}</h1>
            <p className="mt-2 text-sm text-gray-600">{t('staff.addEmployeeSubtitle')}</p>
          </div>
          <Button variant="outline" onClick={() => router.visit('/staff')} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t('common.back')}
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>{t('staff.personalInformation')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">
                    {t('staff.name')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder={t('staff.namePlaceholder')}
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>

                {/* RUT */}
                <div className="space-y-2">
                  <Label htmlFor="rut">
                    {t('staff.rut')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="rut"
                    type="text"
                    value={data.rut}
                    onChange={(e) => setData('rut', e.target.value)}
                    placeholder="12.345.678-9"
                    className={errors.rut ? 'border-red-500' : ''}
                  />
                  {errors.rut && <p className="text-sm text-red-500">{errors.rut}</p>}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">{t('staff.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    placeholder={t('staff.emailPlaceholder')}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">
                    {t('staff.phone')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={data.phone}
                    onChange={(e) => setData('phone', e.target.value)}
                    placeholder="+56 9 1234 5678"
                    className={errors.phone ? 'border-red-500' : ''}
                  />
                  {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address">{t('staff.address')}</Label>
                <Textarea
                  id="address"
                  value={data.address}
                  onChange={(e) => setData('address', e.target.value)}
                  placeholder={t('staff.addressPlaceholder')}
                  className={errors.address ? 'border-red-500' : ''}
                  rows={2}
                />
                {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Employment Information */}
          <Card>
            <CardHeader>
              <CardTitle>{t('staff.employmentInformation')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Role */}
                <div className="space-y-2">
                  <Label htmlFor="role">
                    {t('staff.role')} <span className="text-red-500">*</span>
                  </Label>
                  <Select value={data.role} onValueChange={(value) => setData('role', value)}>
                    <SelectTrigger className={errors.role ? 'border-red-500' : ''}>
                      <SelectValue placeholder={t('staff.selectRole')} />
                    </SelectTrigger>
                    <SelectContent>
                      {roleOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {t(option.labelKey)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
                </div>

                {/* Branch */}
                <div className="space-y-2">
                  <Label htmlFor="branch_id">{t('common.branch')}</Label>
                  <Select value={data.branch_id} onValueChange={(value) => setData('branch_id', value)}>
                    <SelectTrigger className={errors.branch_id ? 'border-red-500' : ''}>
                      <SelectValue placeholder={t('staff.selectBranch')} />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map((branch) => (
                        <SelectItem key={branch.id} value={String(branch.id)}>
                          {branch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.branch_id && <p className="text-sm text-red-500">{errors.branch_id}</p>}
                </div>

                {/* Hire Date */}
                <div className="space-y-2">
                  <Label htmlFor="hire_date">
                    {t('staff.hireDate')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="hire_date"
                    type="date"
                    value={data.hire_date}
                    onChange={(e) => setData('hire_date', e.target.value)}
                    className={errors.hire_date ? 'border-red-500' : ''}
                  />
                  {errors.hire_date && <p className="text-sm text-red-500">{errors.hire_date}</p>}
                </div>

                {/* Base Salary */}
                <div className="space-y-2">
                  <Label htmlFor="base_salary">
                    {t('staff.baseSalary')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="base_salary"
                    type="number"
                    step="0.01"
                    value={data.base_salary}
                    onChange={(e) => setData('base_salary', e.target.value)}
                    placeholder="0.00"
                    className={errors.base_salary ? 'border-red-500' : ''}
                  />
                  {errors.base_salary && <p className="text-sm text-red-500">{errors.base_salary}</p>}
                </div>
              </div>

              {/* Active Status */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_active"
                  checked={data.is_active}
                  onCheckedChange={(checked) => setData('is_active', checked === true)}
                />
                <Label htmlFor="is_active" className="font-normal cursor-pointer">
                  {t('staff.isActive')}
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Bank Information */}
          <Card>
            <CardHeader>
              <CardTitle>{t('staff.bankInformation')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Bank Name */}
                <div className="space-y-2">
                  <Label htmlFor="bank_name">{t('staff.bankName')}</Label>
                  <Input
                    id="bank_name"
                    type="text"
                    value={data.bank_name}
                    onChange={(e) => setData('bank_name', e.target.value)}
                    placeholder={t('staff.bankNamePlaceholder')}
                    className={errors.bank_name ? 'border-red-500' : ''}
                  />
                  {errors.bank_name && <p className="text-sm text-red-500">{errors.bank_name}</p>}
                </div>

                {/* Bank Account */}
                <div className="space-y-2">
                  <Label htmlFor="bank_account">{t('staff.bankAccount')}</Label>
                  <Input
                    id="bank_account"
                    type="text"
                    value={data.bank_account}
                    onChange={(e) => setData('bank_account', e.target.value)}
                    placeholder={t('staff.bankAccountPlaceholder')}
                    className={errors.bank_account ? 'border-red-500' : ''}
                  />
                  {errors.bank_account && <p className="text-sm text-red-500">{errors.bank_account}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card>
            <CardHeader>
              <CardTitle>{t('staff.emergencyContact')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Emergency Contact Name */}
                <div className="space-y-2">
                  <Label htmlFor="emergency_contact_name">{t('staff.emergencyContactName')}</Label>
                  <Input
                    id="emergency_contact_name"
                    type="text"
                    value={data.emergency_contact_name}
                    onChange={(e) => setData('emergency_contact_name', e.target.value)}
                    placeholder={t('staff.emergencyContactNamePlaceholder')}
                    className={errors.emergency_contact_name ? 'border-red-500' : ''}
                  />
                  {errors.emergency_contact_name && (
                    <p className="text-sm text-red-500">{errors.emergency_contact_name}</p>
                  )}
                </div>

                {/* Emergency Contact Phone */}
                <div className="space-y-2">
                  <Label htmlFor="emergency_contact_phone">{t('staff.emergencyContactPhone')}</Label>
                  <Input
                    id="emergency_contact_phone"
                    type="tel"
                    value={data.emergency_contact_phone}
                    onChange={(e) => setData('emergency_contact_phone', e.target.value)}
                    placeholder="+56 9 1234 5678"
                    className={errors.emergency_contact_phone ? 'border-red-500' : ''}
                  />
                  {errors.emergency_contact_phone && (
                    <p className="text-sm text-red-500">{errors.emergency_contact_phone}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Information (only for drivers) */}
          {isDriver && (
            <Card>
              <CardHeader>
                <CardTitle>{t('staff.vehicleInformation')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Vehicle Plate */}
                  <div className="space-y-2">
                    <Label htmlFor="vehicle_plate">{t('staff.vehiclePlate')}</Label>
                    <Input
                      id="vehicle_plate"
                      type="text"
                      value={data.vehicle_plate}
                      onChange={(e) => setData('vehicle_plate', e.target.value)}
                      placeholder="ABCD12"
                      className={errors.vehicle_plate ? 'border-red-500' : ''}
                    />
                    {errors.vehicle_plate && <p className="text-sm text-red-500">{errors.vehicle_plate}</p>}
                  </div>

                  {/* Vehicle Model */}
                  <div className="space-y-2">
                    <Label htmlFor="vehicle_model">{t('staff.vehicleModel')}</Label>
                    <Input
                      id="vehicle_model"
                      type="text"
                      value={data.vehicle_model}
                      onChange={(e) => setData('vehicle_model', e.target.value)}
                      placeholder={t('staff.vehicleModelPlaceholder')}
                      className={errors.vehicle_model ? 'border-red-500' : ''}
                    />
                    {errors.vehicle_model && <p className="text-sm text-red-500">{errors.vehicle_model}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>{t('staff.notes')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="notes">{t('staff.additionalNotes')}</Label>
                <Textarea
                  id="notes"
                  value={data.notes}
                  onChange={(e) => setData('notes', e.target.value)}
                  placeholder={t('staff.notesPlaceholder')}
                  className={errors.notes ? 'border-red-500' : ''}
                  rows={4}
                />
                {errors.notes && <p className="text-sm text-red-500">{errors.notes}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.visit('/staff')}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={processing} className="gap-2">
              <Save className="h-4 w-4" />
              {processing ? t('common.saving') : t('common.save')}
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
