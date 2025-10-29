import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import MainLayout from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Show() {
  const { t } = useTranslation();

  return (
    <MainLayout>
      <Head title={t('agreements.view')} />
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{t('agreements.view')}</h1>
        <Card>
          <CardHeader>
            <CardTitle>{t('agreements.viewDescription')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{t('agreements.detailsComingSoon')}</p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
