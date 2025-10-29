import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Branch } from '../types';

interface EmploymentInformationSectionProps {
  role: string;
  branch_id: string;
  hire_date: string;
  base_salary: number | string;
  is_active: boolean;
  branches: Branch[];
  onRoleChange: (value: string) => void;
  onBranchChange: (value: string) => void;
  onHireDateChange: (value: string) => void;
  onBaseSalaryChange: (value: string) => void;
  onIsActiveChange: (value: boolean) => void;
  errors?: {
    role?: string;
    branch_id?: string;
    hire_date?: string;
    base_salary?: string;
  };
}

export default function EmploymentInformationSection({
  role,
  branch_id,
  hire_date,
  base_salary,
  is_active,
  branches,
  onRoleChange,
  onBranchChange,
  onHireDateChange,
  onBaseSalaryChange,
  onIsActiveChange,
  errors,
}: EmploymentInformationSectionProps) {
  const { t } = useTranslation();

  const roleOptions = [
    { value: 'secretaria', labelKey: 'staff.roles.secretary' },
    { value: 'conductor', labelKey: 'staff.roles.driver' },
    { value: 'auxiliar', labelKey: 'staff.roles.assistant' },
    { value: 'administrador', labelKey: 'staff.roles.administrator' },
    { value: 'propietario', labelKey: 'staff.roles.owner' },
  ];

  return (
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
            <Select value={role} onValueChange={onRoleChange}>
              <SelectTrigger className={errors?.role ? 'border-red-500' : ''}>
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
            {errors?.role && <p className="text-sm text-red-500">{errors.role}</p>}
          </div>

          {/* Branch */}
          <div className="space-y-2">
            <Label htmlFor="branch_id">{t('common.branch')}</Label>
            <Select value={branch_id} onValueChange={onBranchChange}>
              <SelectTrigger className={errors?.branch_id ? 'border-red-500' : ''}>
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
            {errors?.branch_id && <p className="text-sm text-red-500">{errors.branch_id}</p>}
          </div>

          {/* Hire Date */}
          <div className="space-y-2">
            <Label htmlFor="hire_date">
              {t('staff.hireDate')} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="hire_date"
              type="date"
              value={hire_date}
              onChange={(e) => onHireDateChange(e.target.value)}
              className={errors?.hire_date ? 'border-red-500' : ''}
            />
            {errors?.hire_date && <p className="text-sm text-red-500">{errors.hire_date}</p>}
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
              value={base_salary}
              onChange={(e) => onBaseSalaryChange(e.target.value)}
              placeholder="0.00"
              className={errors?.base_salary ? 'border-red-500' : ''}
            />
            {errors?.base_salary && <p className="text-sm text-red-500">{errors.base_salary}</p>}
          </div>
        </div>

        {/* Active Status */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_active"
            checked={is_active}
            onCheckedChange={(checked) => onIsActiveChange(checked === true)}
          />
          <Label htmlFor="is_active" className="font-normal cursor-pointer">
            {t('staff.isActive')}
          </Label>
        </div>
      </CardContent>
    </Card>
  );
}
