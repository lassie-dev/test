import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import MainLayout from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ShowProps {
  expense: any;
}

export default function Show({ expense }: ShowProps) {
  const { t } = useTranslation();

  return (
    <MainLayout>
      <Head title={t('expenses.view')} />

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('expenses.view')}</h1>
          <p className="mt-2 text-sm text-gray-600">{t('expenses.viewDescription')}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('expenses.detailsComingSoon')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              {t('expenses.detailsComingSoonDescription')}
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
