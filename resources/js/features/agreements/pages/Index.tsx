import { Head, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import MainLayout from '@/components/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Eye, Edit, Trash2, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface Agreement {
  id: number;
  code: string;
  company_name: string;
  contact_name: string;
  contact_phone: string;
  status: 'active' | 'expired' | 'suspended';
  start_date: string;
  end_date: string;
  company_pays_percentage: number;
  employee_pays_percentage: number;
  covered_employees: number;
}

interface PaginatedData<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface IndexProps {
  agreements: PaginatedData<Agreement>;
  expiring_soon_count: number;
  filters?: {
    search?: string;
    status?: string;
  };
}

export default function Index({ agreements, expiring_soon_count, filters }: IndexProps) {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState(filters?.search || '');

  const handleCreate = () => {
    router.visit('/agreements/create');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get('/agreements', { search: searchValue }, { preserveState: true });
  };

  const handleView = (id: number) => {
    router.visit(`/agreements/${id}`);
  };

  const handleEdit = (id: number) => {
    router.visit(`/agreements/${id}/edit`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-600">{t('agreements.statusActive')}</Badge>;
      case 'expired':
        return <Badge variant="secondary">{t('agreements.statusExpired')}</Badge>;
      case 'suspended':
        return <Badge variant="destructive">{t('agreements.statusSuspended')}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-CL');
  };

  return (
    <MainLayout>
      <Head title={t('agreements.title')} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('agreements.title')}</h1>
            <p className="mt-2 text-sm text-gray-600">{t('agreements.subtitle')}</p>
          </div>
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            {t('agreements.create')}
          </Button>
        </div>

        {/* Expiring Soon Alert */}
        {expiring_soon_count > 0 && (
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="flex items-center gap-3 pt-6">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <p className="text-sm text-amber-900">
                {t('agreements.expiringSoonAlert', { count: expiring_soon_count })}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder={t('agreements.searchPlaceholder')}
                  className="pl-9"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
              <Button type="submit">{t('common.search')}</Button>
            </form>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              {t('agreements.list')}
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({agreements.total} {t('agreements.total')})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {agreements.data.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('agreements.code')}</TableHead>
                    <TableHead>{t('agreements.companyName')}</TableHead>
                    <TableHead>{t('agreements.contactName')}</TableHead>
                    <TableHead>{t('agreements.status')}</TableHead>
                    <TableHead>{t('agreements.coverage')}</TableHead>
                    <TableHead>{t('agreements.endDate')}</TableHead>
                    <TableHead className="text-right">{t('common.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agreements.data.map((agreement) => (
                    <TableRow key={agreement.id}>
                      <TableCell className="font-medium">{agreement.code}</TableCell>
                      <TableCell>{agreement.company_name}</TableCell>
                      <TableCell>{agreement.contact_name}</TableCell>
                      <TableCell>{getStatusBadge(agreement.status)}</TableCell>
                      <TableCell>{agreement.company_pays_percentage}%</TableCell>
                      <TableCell>{formatDate(agreement.end_date)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleView(agreement.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(agreement.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-gray-100 p-3 mb-4">
                  <Plus className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {t('agreements.noAgreements')}
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  {t('agreements.noAgreementsDescription')}
                </p>
                <Button onClick={handleCreate} className="mt-4 gap-2">
                  <Plus className="h-4 w-4" />
                  {t('agreements.createFirst')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
