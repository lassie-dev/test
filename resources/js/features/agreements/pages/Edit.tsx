import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import MainLayout from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Edit() {
  const { t } = useTranslation();

  return (
    <MainLayout>
      <Head title={t('agreements.edit')} />
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{t('agreements.edit')}</h1>
        <Card>
          <CardHeader>
            <CardTitle>{t('agreements.editDescription')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{t('agreements.formComingSoon')}</p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
