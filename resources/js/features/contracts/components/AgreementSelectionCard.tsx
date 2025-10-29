import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Building2 } from 'lucide-react';

interface Agreement {
  id: number;
  company_name: string;
  code: string;
  discount_percentage: number;
}

interface AgreementSelectionCardProps {
  agreements: Agreement[];
  selectedAgreementId: number | null;
  onAgreementChange: (agreementId: number | null) => void;
}

export default function AgreementSelectionCard({
  agreements,
  selectedAgreementId,
  onAgreementChange,
}: AgreementSelectionCardProps) {
  const { t } = useTranslation();

  const selectedAgreement = agreements.find(a => a.id === selectedAgreementId);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-purple-600" />
          <CardTitle>{t('contracts.corporateAgreement')}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>{t('agreements.selectAgreement')}</Label>
          <Select
            value={selectedAgreementId?.toString() || ''}
            onValueChange={(value) => onAgreementChange(value ? parseInt(value) : null)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('agreements.selectAgreement')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">{t('common.none')}</SelectItem>
              {agreements.map((agreement) => (
                <SelectItem key={agreement.id} value={agreement.id.toString()}>
                  {agreement.company_name} ({agreement.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedAgreement && (
          <div className="rounded-lg bg-purple-50 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                {t('agreements.companyName')}:
              </span>
              <span className="text-sm text-gray-900">{selectedAgreement.company_name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                {t('agreements.code')}:
              </span>
              <Badge variant="secondary">{selectedAgreement.code}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                {t('agreements.discountPercentage')}:
              </span>
              <Badge variant="default" className="bg-green-600">
                {selectedAgreement.discount_percentage}% {t('common.discount')}
              </Badge>
            </div>
          </div>
        )}

        {!selectedAgreement && (
          <p className="text-sm text-gray-500 italic">
            {t('contracts.noAgreementSelected')}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
