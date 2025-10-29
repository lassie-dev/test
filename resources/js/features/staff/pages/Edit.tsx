import { Head, router, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import MainLayout from '@/components/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';
import type { Branch, StaffFormData } from '../types';

// Import new components
import PersonalInformationSection from '../components/PersonalInformationSection';
import EmploymentInformationSection from '../components/EmploymentInformationSection';
import BankInformationSection from '../components/BankInformationSection';
import EmergencyContactSection from '../components/EmergencyContactSection';
import VehicleInformationSection from '../components/VehicleInformationSection';
import NotesSection from '../components/NotesSection';

interface Props {
  staffMember: StaffFormData & { id: number };
  branches: Branch[];
}

export default function Edit({ staffMember, branches }: Props) {
  const { t } = useTranslation();
  const { data, setData, put, processing, errors } = useForm<StaffFormData>({
    name: staffMember.name,
    rut: staffMember.rut,
    role: staffMember.role,
    email: staffMember.email,
    phone: staffMember.phone,
    address: staffMember.address,
    hire_date: staffMember.hire_date,
    base_salary: staffMember.base_salary,
    bank_account: staffMember.bank_account,
    bank_name: staffMember.bank_name,
    emergency_contact_name: staffMember.emergency_contact_name,
    emergency_contact_phone: staffMember.emergency_contact_phone,
    vehicle_plate: staffMember.vehicle_plate,
    vehicle_model: staffMember.vehicle_model,
    is_active: staffMember.is_active,
    branch_id: staffMember.branch_id,
    notes: staffMember.notes,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    put(`/staff/${staffMember.id}`);
  };

  const isDriver = data.role === 'conductor';

  return (
    <MainLayout>
      <Head title={t('staff.editEmployee')} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('staff.editEmployee')}</h1>
            <p className="mt-2 text-sm text-gray-600">{t('staff.editEmployeeSubtitle')}</p>
          </div>
          <Button variant="outline" onClick={() => router.visit('/staff')} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t('common.back')}
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <PersonalInformationSection
            name={data.name}
            rut={data.rut}
            email={data.email}
            phone={data.phone}
            address={data.address}
            onNameChange={(value) => setData('name', value)}
            onRutChange={(value) => setData('rut', value)}
            onEmailChange={(value) => setData('email', value)}
            onPhoneChange={(value) => setData('phone', value)}
            onAddressChange={(value) => setData('address', value)}
            errors={{
              name: errors.name,
              rut: errors.rut,
              email: errors.email,
              phone: errors.phone,
              address: errors.address,
            }}
          />

          {/* Employment Information */}
          <EmploymentInformationSection
            role={data.role}
            branch_id={data.branch_id}
            hire_date={data.hire_date}
            base_salary={data.base_salary}
            is_active={data.is_active}
            branches={branches}
            onRoleChange={(value) => setData('role', value)}
            onBranchChange={(value) => setData('branch_id', value)}
            onHireDateChange={(value) => setData('hire_date', value)}
            onBaseSalaryChange={(value) => setData('base_salary', value)}
            onIsActiveChange={(value) => setData('is_active', value)}
            errors={{
              role: errors.role,
              branch_id: errors.branch_id,
              hire_date: errors.hire_date,
              base_salary: errors.base_salary,
            }}
          />

          {/* Bank Information */}
          <BankInformationSection
            bank_name={data.bank_name}
            bank_account={data.bank_account}
            onBankNameChange={(value) => setData('bank_name', value)}
            onBankAccountChange={(value) => setData('bank_account', value)}
            errors={{
              bank_name: errors.bank_name,
              bank_account: errors.bank_account,
            }}
          />

          {/* Emergency Contact */}
          <EmergencyContactSection
            emergency_contact_name={data.emergency_contact_name}
            emergency_contact_phone={data.emergency_contact_phone}
            onEmergencyContactNameChange={(value) => setData('emergency_contact_name', value)}
            onEmergencyContactPhoneChange={(value) => setData('emergency_contact_phone', value)}
            errors={{
              emergency_contact_name: errors.emergency_contact_name,
              emergency_contact_phone: errors.emergency_contact_phone,
            }}
          />

          {/* Vehicle Information (only for drivers) */}
          {isDriver && (
            <VehicleInformationSection
              vehicle_plate={data.vehicle_plate}
              vehicle_model={data.vehicle_model}
              onVehiclePlateChange={(value) => setData('vehicle_plate', value)}
              onVehicleModelChange={(value) => setData('vehicle_model', value)}
              errors={{
                vehicle_plate: errors.vehicle_plate,
                vehicle_model: errors.vehicle_model,
              }}
            />
          )}

          {/* Notes */}
          <NotesSection
            notes={data.notes}
            onNotesChange={(value) => setData('notes', value)}
            errors={{ notes: errors.notes }}
          />

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
