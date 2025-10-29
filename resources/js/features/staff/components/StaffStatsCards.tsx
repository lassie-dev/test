import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

interface StaffStatsCardsProps {
  total: number;
  active: number;
  inactive: number;
}

export default function StaffStatsCards({ total, active, inactive }: StaffStatsCardsProps) {
  const { t } = useTranslation();

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('staff.totalEmployees')}</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{total}</div>
          <p className="text-xs text-muted-foreground">{t('staff.registeredEmployees')}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('staff.active')}</CardTitle>
          <Users className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{active}</div>
          <p className="text-xs text-muted-foreground">{t('staff.activeEmployees')}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('staff.inactive')}</CardTitle>
          <Users className="h-4 w-4 text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{inactive}</div>
          <p className="text-xs text-muted-foreground">{t('staff.inactiveEmployees')}</p>
        </CardContent>
      </Card>
    </div>
  );
}
