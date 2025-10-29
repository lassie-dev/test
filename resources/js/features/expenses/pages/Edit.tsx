import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import MainLayout from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EditProps {
  expense: any;
}

export default function Edit({ expense }: EditProps) {
  const { t } = useTranslation();

  return (
    <MainLayout>
      <Head title={t('expenses.edit')} />

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('expenses.edit')}</h1>
          <p className="mt-2 text-sm text-gray-600">{t('expenses.editDescription')}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('expenses.formComingSoon')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              {t('expenses.formComingSoonDescription')}
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
