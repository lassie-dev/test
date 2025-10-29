import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface NotesSectionProps {
  notes: string;
  onNotesChange: (value: string) => void;
  errors?: {
    notes?: string;
  };
}

export default function NotesSection({ notes, onNotesChange, errors }: NotesSectionProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('staff.notes')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="notes">{t('staff.additionalNotes')}</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder={t('staff.notesPlaceholder')}
            className={errors?.notes ? 'border-red-500' : ''}
            rows={4}
          />
          {errors?.notes && <p className="text-sm text-red-500">{errors.notes}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
