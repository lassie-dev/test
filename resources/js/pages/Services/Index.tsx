import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import MainLayout from '@/components/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter, Briefcase, Edit, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Service, ServiceFilters } from '@/features/services/types';
import type { PaginatedData } from '@/types/common';
import { SERVICE_STATUS_OPTIONS } from '@/features/services/constants';
import {
  formatCurrency,
  calculateServiceStats,
  getServiceStatusVariant,
} from '@/features/services/functions';

interface Props {
  services: PaginatedData<Service>;
  filters: ServiceFilters;
}

export default function Index({ services, filters }: Props) {
  const { t } = useTranslation();
  const [search, setSearch] = useState(filters.search || '');
  const [activeFilter, setActiveFilter] = useState(filters.active || 'all');

  const handleSearch = () => {
    router.get(
      '/services',
      { search, active: activeFilter === 'all' ? '' : activeFilter },
      { preserveState: true, preserveScroll: true }
    );
  };

  const handleDelete = (id: number, name: string) => {
    if (confirm(`${t('services.deleteConfirm')}\n\n${name}\n\n${t('services.deleteWarning')}`)) {
      router.delete(`/services/${id}`, {
        preserveScroll: true,
      });
    }
  };

  const stats = calculateServiceStats(services.data);

  return (
    <MainLayout>
      <Head title={t('services.title')} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('services.title')}</h1>
            <p className="mt-2 text-sm text-gray-600">
              {t('services.subtitle')}
            </p>
          </div>
          <Link href="/services/create">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              {t('services.createService')}
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('common.total')}</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">{t('services.title')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('services.active')}</CardTitle>
              <Briefcase className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.active}</div>
              <p className="text-xs text-muted-foreground">{t('services.active')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('services.inactive')}</CardTitle>
              <Briefcase className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inactive}</div>
              <p className="text-xs text-muted-foreground">{t('services.inactive')}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder={t('common.searchPlaceholder')}
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Select value={activeFilter} onValueChange={setActiveFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder={t('services.allStatuses')} />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {t(option.labelKey)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleSearch} className="gap-2">
                <Filter className="h-4 w-4" />
                {t('common.filter')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>{t('services.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            {services.data.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-gray-100 p-3 mb-4">
                  <Briefcase className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('services.noServices')}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  {t('services.noServicesDescription')}
                </p>
                <Link href="/services/create">
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    {t('services.createService')}
                  </Button>
                </Link>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('services.serviceName')}</TableHead>
                    <TableHead>{t('services.description')}</TableHead>
                    <TableHead>{t('services.price')}</TableHead>
                    <TableHead>{t('services.status')}</TableHead>
                    <TableHead className="text-right">{t('common.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.data.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell className="font-medium">{service.nombre}</TableCell>
                      <TableCell className="max-w-md truncate">
                        {service.descripcion || '-'}
                      </TableCell>
                      <TableCell>{formatCurrency(service.precio)}</TableCell>
                      <TableCell>
                        <Badge variant={getServiceStatusVariant(service.activo) as any}>
                          {service.activo ? t('services.active') : t('services.inactive')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/services/${service.id}/edit`}>
                            <Button variant="ghost" size="sm" className="gap-1">
                              <Edit className="h-4 w-4" />
                              {t('common.edit')}
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1 text-destructive hover:text-destructive"
                            onClick={() => handleDelete(service.id, service.nombre)}
                          >
                            <Trash2 className="h-4 w-4" />
                            {t('common.delete')}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
