import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ClientInformationCardProps {
  client_name: string;
  client_rut: string;
  client_phone: string;
  client_email: string;
  client_address: string;
  rutError: string;
  onNameChange: (value: string) => void;
  onRutChange: (value: string) => void;
  onRutBlur: () => void;
  onPhoneChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onAddressChange: (value: string) => void;
  errors?: {
    client_name?: string;
    client_rut?: string;
    client_phone?: string;
    client_email?: string;
    client_address?: string;
  };
}

export default function ClientInformationCard({
  client_name,
  client_rut,
  client_phone,
  client_email,
  client_address,
  rutError,
  onNameChange,
  onRutChange,
  onRutBlur,
  onPhoneChange,
  onEmailChange,
  onAddressChange,
  errors,
}: ClientInformationCardProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('contracts.clientInfo')}</CardTitle>
        <CardDescription>{t('contracts.clientData')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="client_name">{t('contracts.clientNameRequired')}</Label>
            <Input
              id="client_name"
              value={client_name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder={t('contracts.clientNamePlaceholder')}
              required
            />
            {errors?.client_name && <p className="text-sm text-destructive">{errors.client_name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="client_rut">{t('contracts.clientRutRequired')}</Label>
            <Input
              id="client_rut"
              value={client_rut}
              onChange={(e) => onRutChange(e.target.value)}
              onBlur={onRutBlur}
              placeholder={t('contracts.clientRutPlaceholder')}
              required
            />
            {(rutError || errors?.client_rut) && (
              <p className="text-sm text-destructive">{rutError || errors?.client_rut}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="client_phone">{t('contracts.clientPhoneRequired')}</Label>
            <Input
              id="client_phone"
              type="tel"
              value={client_phone}
              onChange={(e) => onPhoneChange(e.target.value)}
              placeholder={t('contracts.clientPhonePlaceholder')}
              required
            />
            {errors?.client_phone && <p className="text-sm text-destructive">{errors.client_phone}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="client_email">{t('contracts.clientEmail')}</Label>
            <Input
              id="client_email"
              type="email"
              value={client_email}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder={t('contracts.clientEmailPlaceholder')}
            />
            {errors?.client_email && <p className="text-sm text-destructive">{errors.client_email}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="client_address">{t('contracts.clientAddress')}</Label>
          <Input
            id="client_address"
            value={client_address}
            onChange={(e) => onAddressChange(e.target.value)}
            placeholder={t('contracts.clientAddressPlaceholder')}
          />
          {errors?.client_address && <p className="text-sm text-destructive">{errors.client_address}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
