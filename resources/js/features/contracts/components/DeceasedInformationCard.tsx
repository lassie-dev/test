import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DeceasedInformationCardProps {
  deceased_name: string;
  deceased_age: string;
  deceased_death_date: string;
  deceased_death_time: string;
  deceased_death_place: string;
  deceased_cause_of_death: string;
  contractType: string;
  onNameChange: (value: string) => void;
  onAgeChange: (value: string) => void;
  onDeathDateChange: (value: string) => void;
  onDeathTimeChange: (value: string) => void;
  onDeathPlaceChange: (value: string) => void;
  onCauseOfDeathChange: (value: string) => void;
  errors?: {
    deceased_name?: string;
    deceased_age?: string;
    deceased_death_date?: string;
    deceased_death_time?: string;
    deceased_death_place?: string;
    deceased_cause_of_death?: string;
  };
}

export default function DeceasedInformationCard({
  deceased_name,
  deceased_age,
  deceased_death_date,
  deceased_death_time,
  deceased_death_place,
  deceased_cause_of_death,
  contractType,
  onNameChange,
  onAgeChange,
  onDeathDateChange,
  onDeathTimeChange,
  onDeathPlaceChange,
  onCauseOfDeathChange,
  errors,
}: DeceasedInformationCardProps) {
  const { t } = useTranslation();

  if (contractType !== 'necesidad_inmediata') {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('contracts.deceasedInfo')}</CardTitle>
        <CardDescription>{t('contracts.deceasedData')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="deceased_name">{t('contracts.deceasedNameRequired')}</Label>
            <Input
              id="deceased_name"
              value={deceased_name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder={t('contracts.deceasedNamePlaceholder')}
              required={contractType === 'necesidad_inmediata'}
            />
            {errors?.deceased_name && <p className="text-sm text-destructive">{errors.deceased_name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="deceased_age">Age</Label>
            <Input
              id="deceased_age"
              type="number"
              value={deceased_age}
              onChange={(e) => onAgeChange(e.target.value)}
              placeholder="Age at death"
            />
            {errors?.deceased_age && <p className="text-sm text-destructive">{errors.deceased_age}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="deceased_death_date">{t('contracts.deceasedDeathDateRequired')}</Label>
            <Input
              id="deceased_death_date"
              type="date"
              value={deceased_death_date}
              onChange={(e) => onDeathDateChange(e.target.value)}
              required={contractType === 'necesidad_inmediata'}
            />
            {errors?.deceased_death_date && <p className="text-sm text-destructive">{errors.deceased_death_date}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="deceased_death_time">Time of Death</Label>
            <Input
              id="deceased_death_time"
              type="time"
              value={deceased_death_time}
              onChange={(e) => onDeathTimeChange(e.target.value)}
            />
            {errors?.deceased_death_time && <p className="text-sm text-destructive">{errors.deceased_death_time}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="deceased_death_place">{t('contracts.deceasedDeathPlace')}</Label>
            <Input
              id="deceased_death_place"
              value={deceased_death_place}
              onChange={(e) => onDeathPlaceChange(e.target.value)}
              placeholder={t('contracts.deceasedDeathPlacePlaceholder')}
            />
            {errors?.deceased_death_place && <p className="text-sm text-destructive">{errors.deceased_death_place}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="deceased_cause_of_death">Cause of Death (optional)</Label>
            <Input
              id="deceased_cause_of_death"
              value={deceased_cause_of_death}
              onChange={(e) => onCauseOfDeathChange(e.target.value)}
              placeholder="Optional cause of death"
            />
            {errors?.deceased_cause_of_death && <p className="text-sm text-destructive">{errors.deceased_cause_of_death}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
