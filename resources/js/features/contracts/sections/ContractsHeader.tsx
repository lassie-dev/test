import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface ContractsHeaderProps {
  onCreateClick: () => void;
}

export function ContractsHeader({ onCreateClick }: ContractsHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('contracts.titleShort')}</h1>
        <p className="mt-2 text-sm text-gray-600">
          {t('contracts.subtitle')}
        </p>
      </div>
      <Button onClick={onCreateClick} className="gap-2">
        <Plus className="h-4 w-4" />
        {t('contracts.newContract')}
      </Button>
    </div>
  );
}
