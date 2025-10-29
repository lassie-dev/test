import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import MainLayout from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Church, MapPin, Building2 } from 'lucide-react';

interface IndexProps {
  churches_count: number;
  cemeteries_count: number;
  wake_rooms_count: number;
  cities: string[];
  filters?: {
    search?: string;
    city?: string;
  };
}

export default function Index({ churches_count, cemeteries_count, wake_rooms_count }: IndexProps) {
  const { t } = useTranslation();

  const directories = [
    {
      title: t('directory.churches'),
      description: t('directory.churchesDescription'),
      count: churches_count,
      icon: Church,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: t('directory.cemeteries'),
      description: t('directory.cemeteriesDescription'),
      count: cemeteries_count,
      icon: MapPin,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: t('directory.wakeRooms'),
      description: t('directory.wakeRoomsDescription'),
      count: wake_rooms_count,
      icon: Building2,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <MainLayout>
      <Head title={t('directory.title')} />

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('directory.title')}</h1>
          <p className="mt-2 text-sm text-gray-600">{t('directory.subtitle')}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {directories.map((dir) => {
            const Icon = dir.icon;
            return (
              <Card key={dir.title} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className={`rounded-lg p-2 w-fit ${dir.bgColor}`}>
                    <Icon className={`h-6 w-6 ${dir.color}`} />
                  </div>
                  <CardTitle className="text-lg">{dir.title}</CardTitle>
                  <CardDescription>{dir.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{dir.count}</div>
                  <p className="text-sm text-gray-600 mt-1">{t('directory.entries')}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('directory.comingSoon')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{t('directory.comingSoonDescription')}</p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
