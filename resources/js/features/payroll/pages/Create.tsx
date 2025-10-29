import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import MainLayout from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Create() {
  const { t } = useTranslation();

  return (
    <MainLayout>
      <Head title={t('payroll.create')} />
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('payroll.create')}</h1>
          <p className="mt-2 text-sm text-gray-600">{t('payroll.createDescription')}</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{t('payroll.formComingSoon')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{t('payroll.formComingSoonDescription')}</p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
