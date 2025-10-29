import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface PersonalInformationSectionProps {
  name: string;
  rut: string;
  email: string;
  phone: string;
  address: string;
  onNameChange: (value: string) => void;
  onRutChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onAddressChange: (value: string) => void;
  errors?: {
    name?: string;
    rut?: string;
    email?: string;
    phone?: string;
    address?: string;
  };
}

export default function PersonalInformationSection({
  name,
  rut,
  email,
  phone,
  address,
  onNameChange,
  onRutChange,
  onEmailChange,
  onPhoneChange,
  onAddressChange,
  errors,
}: PersonalInformationSectionProps) {
  const { t } = useTranslation();

  return (
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
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder={t('staff.namePlaceholder')}
              className={errors?.name ? 'border-red-500' : ''}
            />
            {errors?.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          {/* RUT */}
          <div className="space-y-2">
            <Label htmlFor="rut">
              {t('staff.rut')} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="rut"
              type="text"
              value={rut}
              onChange={(e) => onRutChange(e.target.value)}
              placeholder="12.345.678-9"
              className={errors?.rut ? 'border-red-500' : ''}
            />
            {errors?.rut && <p className="text-sm text-red-500">{errors.rut}</p>}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">{t('staff.email')}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder={t('staff.emailPlaceholder')}
              className={errors?.email ? 'border-red-500' : ''}
            />
            {errors?.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">
              {t('staff.phone')} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value)}
              placeholder="+56 9 1234 5678"
              className={errors?.phone ? 'border-red-500' : ''}
            />
            {errors?.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
          </div>
        </div>

        {/* Address */}
        <div className="space-y-2">
          <Label htmlFor="address">{t('staff.address')}</Label>
          <Textarea
            id="address"
            value={address}
            onChange={(e) => onAddressChange(e.target.value)}
            placeholder={t('staff.addressPlaceholder')}
            className={errors?.address ? 'border-red-500' : ''}
            rows={2}
          />
          {errors?.address && <p className="text-sm text-red-500">{errors.address}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
