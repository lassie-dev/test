import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import MainLayout from '@/components/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter, Briefcase, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import type { Service, ServiceFilters } from '@/features/services/types';
import type { PaginatedData } from '@/types/common';
import {
  formatCurrency,
  calculateServiceStats,
  getServiceStatusVariant,
} from '@/features/services/functions';

interface CategoryOption {
  id: number;
  name: string;
  slug: string;
}

interface Props {
  services: PaginatedData<Service>;
  categories: CategoryOption[];
  filters: ServiceFilters;
}

export default function Index({ services, categories, filters }: Props) {
  const { t } = useTranslation();
  const [search, setSearch] = useState(filters.search || '');
  const [categoryFilter, setCategoryFilter] = useState(filters.category || 'all');
  const [statusFilter, setStatusFilter] = useState(filters.status || 'all');

  const handleSearch = () => {
    router.get(
      '/services',
      {
        search,
        category: categoryFilter === 'all' ? '' : categoryFilter,
        status: statusFilter === 'all' ? '' : statusFilter,
      },
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

        {/* Main Content with Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Filters */}
          <aside className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  {t('common.filters')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    {t('common.search')}
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder={t('services.searchPlaceholder')}
                      className="pl-9"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">
                    {t('services.category')}
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors">
                      <input
                        type="radio"
                        name="category"
                        value="all"
                        checked={categoryFilter === 'all'}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="w-4 h-4 text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-gray-700">{t('services.allCategories')}</span>
                    </label>
                    {categories.map((category) => (
                      <label
                        key={category.id}
                        className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors"
                      >
                        <input
                          type="radio"
                          name="category"
                          value={category.id.toString()}
                          checked={categoryFilter === category.id.toString()}
                          onChange={(e) => setCategoryFilter(e.target.value)}
                          className="w-4 h-4 text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-gray-700">{category.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Status Filter */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">
                    {t('services.status')}
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors">
                      <input
                        type="radio"
                        name="status"
                        value="all"
                        checked={statusFilter === 'all'}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-4 h-4 text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-gray-700">{t('services.allStatuses')}</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors">
                      <input
                        type="radio"
                        name="status"
                        value="active"
                        checked={statusFilter === 'active'}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-4 h-4 text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-gray-700 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        {t('services.active')}
                      </span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors">
                      <input
                        type="radio"
                        name="status"
                        value="inactive"
                        checked={statusFilter === 'inactive'}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-4 h-4 text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-gray-700 flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-gray-400" />
                        {t('services.inactive')}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Apply Filters Button */}
                <Button onClick={handleSearch} className="w-full gap-2">
                  <Filter className="h-4 w-4" />
                  {t('common.filter')}
                </Button>
              </CardContent>
            </Card>
          </aside>

          {/* Right Content - Services */}
          <div className="lg:col-span-3 space-y-6">
            {/* Services Header */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {t('services.showingResults', { count: services.data.length, total: services.total })}
              </p>
            </div>

            {/* Services Grid */}
            {services.data.length === 0 ? (
              <Card>
                <CardContent className="py-12">
                  <div className="flex flex-col items-center justify-center text-center">
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
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {services.data.map((service) => (
                  <div key={service.id} className="relative overflow-hidden rounded-lg border-2 bg-card text-card-foreground shadow-sm hover:shadow-lg transition-shadow duration-200">
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3 z-10">
                      <Badge variant={getServiceStatusVariant(service.activo) as any}>
                        {service.activo ? t('services.active') : t('services.inactive')}
                      </Badge>
                    </div>

                    <div className="p-6 space-y-4">
                      {/* Service Icon & Name */}
                      <div className="space-y-2">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Briefcase className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0 pr-16">
                            <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                              {service.nombre}
                            </h3>
                            {service.category && (
                              <p className="text-xs text-gray-500 mt-1">
                                {service.category.name}
                              </p>
                            )}
                          </div>
                        </div>

                        {service.descripcion && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {service.descripcion}
                          </p>
                        )}
                      </div>

                      {/* Divider */}
                      <div className="border-t pt-4">
                        {/* Price */}
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-sm text-gray-500">{t('services.price')}</span>
                          <span className="text-xl font-bold text-primary">
                            {formatCurrency(service.precio)}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <Link href={`/services/${service.id}/edit`} className="flex-1">
                            <Button variant="outline" size="sm" className="w-full gap-1">
                              <Edit className="h-4 w-4" />
                              {t('common.edit')}
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(service.id, service.nombre)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
