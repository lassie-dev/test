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
  deceased_education_level: string;
  deceased_profession: string;
  deceased_marital_status: string;
  deceased_religion: string;
  contractType: string;
  onNameChange: (value: string) => void;
  onAgeChange: (value: string) => void;
  onDeathDateChange: (value: string) => void;
  onDeathTimeChange: (value: string) => void;
  onDeathPlaceChange: (value: string) => void;
  onCauseOfDeathChange: (value: string) => void;
  onEducationLevelChange: (value: string) => void;
  onProfessionChange: (value: string) => void;
  onMaritalStatusChange: (value: string) => void;
  onReligionChange: (value: string) => void;
  errors?: {
    deceased_name?: string;
    deceased_age?: string;
    deceased_death_date?: string;
    deceased_death_time?: string;
    deceased_death_place?: string;
    deceased_cause_of_death?: string;
    deceased_education_level?: string;
    deceased_profession?: string;
    deceased_marital_status?: string;
    deceased_religion?: string;
  };
}

export default function DeceasedInformationCard({
  deceased_name,
  deceased_age,
  deceased_death_date,
  deceased_death_time,
  deceased_death_place,
  deceased_cause_of_death,
  deceased_education_level,
  deceased_profession,
  deceased_marital_status,
  deceased_religion,
  contractType,
  onNameChange,
  onAgeChange,
  onDeathDateChange,
  onDeathTimeChange,
  onDeathPlaceChange,
  onCauseOfDeathChange,
  onEducationLevelChange,
  onProfessionChange,
  onMaritalStatusChange,
  onReligionChange,
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

          <div className="space-y-2">
            <Label htmlFor="deceased_education_level">{t('contracts.deceasedEducationLevel')}</Label>
            <Input
              id="deceased_education_level"
              value={deceased_education_level}
              onChange={(e) => onEducationLevelChange(e.target.value)}
              placeholder={t('contracts.deceasedEducationLevelPlaceholder')}
            />
            {errors?.deceased_education_level && <p className="text-sm text-destructive">{errors.deceased_education_level}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="deceased_profession">{t('contracts.deceasedProfession')}</Label>
            <Input
              id="deceased_profession"
              value={deceased_profession}
              onChange={(e) => onProfessionChange(e.target.value)}
              placeholder={t('contracts.deceasedProfessionPlaceholder')}
            />
            {errors?.deceased_profession && <p className="text-sm text-destructive">{errors.deceased_profession}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="deceased_marital_status">{t('contracts.deceasedMaritalStatus')}</Label>
            <Input
              id="deceased_marital_status"
              value={deceased_marital_status}
              onChange={(e) => onMaritalStatusChange(e.target.value)}
              placeholder={t('contracts.deceasedMaritalStatusPlaceholder')}
            />
            {errors?.deceased_marital_status && <p className="text-sm text-destructive">{errors.deceased_marital_status}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="deceased_religion">{t('contracts.deceasedReligion')}</Label>
            <Input
              id="deceased_religion"
              value={deceased_religion}
              onChange={(e) => onReligionChange(e.target.value)}
              placeholder={t('contracts.deceasedReligionPlaceholder')}
            />
            {errors?.deceased_religion && <p className="text-sm text-destructive">{errors.deceased_religion}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
