import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface BankInformationSectionProps {
  bank_name: string;
  bank_account: string;
  onBankNameChange: (value: string) => void;
  onBankAccountChange: (value: string) => void;
  errors?: {
    bank_name?: string;
    bank_account?: string;
  };
}

export default function BankInformationSection({
  bank_name,
  bank_account,
  onBankNameChange,
  onBankAccountChange,
  errors,
}: BankInformationSectionProps) {
  const { t } = useTranslation();

  return (
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
              value={bank_name}
              onChange={(e) => onBankNameChange(e.target.value)}
              placeholder={t('staff.bankNamePlaceholder')}
              className={errors?.bank_name ? 'border-red-500' : ''}
            />
            {errors?.bank_name && <p className="text-sm text-red-500">{errors.bank_name}</p>}
          </div>

          {/* Bank Account */}
          <div className="space-y-2">
            <Label htmlFor="bank_account">{t('staff.bankAccount')}</Label>
            <Input
              id="bank_account"
              type="text"
              value={bank_account}
              onChange={(e) => onBankAccountChange(e.target.value)}
              placeholder={t('staff.bankAccountPlaceholder')}
              className={errors?.bank_account ? 'border-red-500' : ''}
            />
            {errors?.bank_account && <p className="text-sm text-red-500">{errors.bank_account}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
