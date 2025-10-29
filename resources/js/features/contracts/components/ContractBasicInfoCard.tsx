import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { TIPOS_CONTRATO_OPTIONS, ESTADOS_CONTRATO_CREATE_OPTIONS } from '@/features/contracts/constants';

interface ContractBasicInfoCardProps {
  type: string;
  status: string;
  is_holiday: boolean;
  is_night_shift: boolean;
  onTypeChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onHolidayChange: (checked: boolean) => void;
  onNightShiftChange: (checked: boolean) => void;
  errors?: {
    type?: string;
    status?: string;
  };
}

export default function ContractBasicInfoCard({
  type,
  status,
  is_holiday,
  is_night_shift,
  onTypeChange,
  onStatusChange,
  onHolidayChange,
  onNightShiftChange,
  errors,
}: ContractBasicInfoCardProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('contracts.contractInfo')}</CardTitle>
        <CardDescription>{t('contracts.basicInfo')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="type">{t('contracts.type')}</Label>
            <Select value={type} onValueChange={onTypeChange}>
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper">
                {TIPOS_CONTRATO_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {t(option.labelKey)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors?.type && <p className="text-sm text-destructive">{errors.type}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">{t('contracts.status')}</Label>
            <Select value={status} onValueChange={onStatusChange}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper">
                {ESTADOS_CONTRATO_CREATE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {t(option.labelKey)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors?.status && <p className="text-sm text-destructive">{errors.status}</p>}
          </div>
        </div>

        <div className="flex gap-6">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_holiday"
              checked={is_holiday}
              onCheckedChange={(checked) => onHolidayChange(checked as boolean)}
            />
            <Label htmlFor="is_holiday" className="font-normal cursor-pointer">
              {t('contracts.holiday')}
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_night_shift"
              checked={is_night_shift}
              onCheckedChange={(checked) => onNightShiftChange(checked as boolean)}
            />
            <Label htmlFor="is_night_shift" className="font-normal cursor-pointer">
              {t('contracts.nightShift')}
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
