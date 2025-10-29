import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import MainLayout from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Show() {
  const { t } = useTranslation();

  return (
    <MainLayout>
      <Head title={t('documents.view')} />

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('documents.view')}</h1>
          <p className="mt-2 text-sm text-gray-600">{t('documents.viewDescription')}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('documents.detailsComingSoon')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              {t('documents.detailsComingSoonDescription')}
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
