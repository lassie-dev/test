import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EmergencyContactSectionProps {
  emergency_contact_name: string;
  emergency_contact_phone: string;
  onEmergencyContactNameChange: (value: string) => void;
  onEmergencyContactPhoneChange: (value: string) => void;
  errors?: {
    emergency_contact_name?: string;
    emergency_contact_phone?: string;
  };
}

export default function EmergencyContactSection({
  emergency_contact_name,
  emergency_contact_phone,
  onEmergencyContactNameChange,
  onEmergencyContactPhoneChange,
  errors,
}: EmergencyContactSectionProps) {
  const { t } = useTranslation();

  return (
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
              value={emergency_contact_name}
              onChange={(e) => onEmergencyContactNameChange(e.target.value)}
              placeholder={t('staff.emergencyContactNamePlaceholder')}
              className={errors?.emergency_contact_name ? 'border-red-500' : ''}
            />
            {errors?.emergency_contact_name && (
              <p className="text-sm text-red-500">{errors.emergency_contact_name}</p>
            )}
          </div>

          {/* Emergency Contact Phone */}
          <div className="space-y-2">
            <Label htmlFor="emergency_contact_phone">{t('staff.emergencyContactPhone')}</Label>
            <Input
              id="emergency_contact_phone"
              type="tel"
              value={emergency_contact_phone}
              onChange={(e) => onEmergencyContactPhoneChange(e.target.value)}
              placeholder="+56 9 1234 5678"
              className={errors?.emergency_contact_phone ? 'border-red-500' : ''}
            />
            {errors?.emergency_contact_phone && (
              <p className="text-sm text-red-500">{errors.emergency_contact_phone}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
