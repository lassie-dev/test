import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ServiceDetailsExtendedCardProps {
  reception_location: string;
  coffin_model: string;
  cemetery_sector: string;
  procession_details: string;
  additional_staff_notes: string;
  onReceptionLocationChange: (value: string) => void;
  onCoffinModelChange: (value: string) => void;
  onCemeterySectorChange: (value: string) => void;
  onProcessionDetailsChange: (value: string) => void;
  onAdditionalStaffNotesChange: (value: string) => void;
  errors?: {
    reception_location?: string;
    coffin_model?: string;
    cemetery_sector?: string;
    procession_details?: string;
    additional_staff_notes?: string;
  };
}

export default function ServiceDetailsExtendedCard({
  reception_location,
  coffin_model,
  cemetery_sector,
  procession_details,
  additional_staff_notes,
  onReceptionLocationChange,
  onCoffinModelChange,
  onCemeterySectorChange,
  onProcessionDetailsChange,
  onAdditionalStaffNotesChange,
  errors,
}: ServiceDetailsExtendedCardProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('contracts.additionalDetails')}</CardTitle>
        <CardDescription>{t('contracts.serviceDetails')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="reception_location">{t('contracts.receptionLocation')}</Label>
            <Input
              id="reception_location"
              value={reception_location}
              onChange={(e) => onReceptionLocationChange(e.target.value)}
              placeholder={t('contracts.receptionLocationPlaceholder')}
            />
            {errors?.reception_location && <p className="text-sm text-destructive">{errors.reception_location}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="coffin_model">{t('contracts.coffinModel')}</Label>
            <Input
              id="coffin_model"
              value={coffin_model}
              onChange={(e) => onCoffinModelChange(e.target.value)}
              placeholder={t('contracts.coffinModelPlaceholder')}
            />
            {errors?.coffin_model && <p className="text-sm text-destructive">{errors.coffin_model}</p>}
          </div>

          <div className="space-y-2 col-span-2">
            <Label htmlFor="cemetery_sector">{t('contracts.cemeterySector')}</Label>
            <Input
              id="cemetery_sector"
              value={cemetery_sector}
              onChange={(e) => onCemeterySectorChange(e.target.value)}
              placeholder={t('contracts.cemeterySectorPlaceholder')}
            />
            {errors?.cemetery_sector && <p className="text-sm text-destructive">{errors.cemetery_sector}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="procession_details">{t('contracts.processionDetails')}</Label>
          <Textarea
            id="procession_details"
            value={procession_details}
            onChange={(e) => onProcessionDetailsChange(e.target.value)}
            placeholder={t('contracts.processionDetailsPlaceholder')}
            rows={3}
          />
          {errors?.procession_details && <p className="text-sm text-destructive">{errors.procession_details}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="additional_staff_notes">{t('contracts.additionalStaffNotes')}</Label>
          <Textarea
            id="additional_staff_notes"
            value={additional_staff_notes}
            onChange={(e) => onAdditionalStaffNotesChange(e.target.value)}
            placeholder={t('contracts.additionalStaffNotesPlaceholder')}
            rows={3}
          />
          {errors?.additional_staff_notes && <p className="text-sm text-destructive">{errors.additional_staff_notes}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
