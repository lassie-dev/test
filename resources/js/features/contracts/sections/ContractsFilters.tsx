import { useState } from 'react';
import { router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Search, Filter, X, Download, ArrowUpDown } from 'lucide-react';
import { ESTADOS_CONTRATO_OPTIONS, TIPOS_CONTRATO_OPTIONS } from '../constants';
import { useDebouncedCallback } from 'use-debounce';

interface ContractsFiltersProps {
  filters?: {
    search?: string;
    status?: string;
    type?: string;
    date_from?: string;
    date_to?: string;
    total_min?: string;
    total_max?: string;
    payment_method?: string;
    sort_by?: string;
    sort_order?: string;
  };
}

export function ContractsFilters({ filters = {} }: ContractsFiltersProps) {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState(filters.search || '');
  const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');
  const [selectedType, setSelectedType] = useState(filters.type || 'all');
  const [dateFrom, setDateFrom] = useState(filters.date_from || '');
  const [dateTo, setDateTo] = useState(filters.date_to || '');
  const [totalMin, setTotalMin] = useState(filters.total_min || '');
  const [totalMax, setTotalMax] = useState(filters.total_max || '');
  const [paymentMethod, setPaymentMethod] = useState(filters.payment_method || 'all');
  const [sortBy, setSortBy] = useState(filters.sort_by || 'created_at');
  const [sortOrder, setSortOrder] = useState(filters.sort_order || 'desc');
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);

  // Build filter params helper
  const buildFilterParams = (overrides = {}) => {
    const params = {
      search: searchValue || undefined,
      status: selectedStatus !== 'all' ? selectedStatus : undefined,
      type: selectedType !== 'all' ? selectedType : undefined,
      date_from: dateFrom || undefined,
      date_to: dateTo || undefined,
      total_min: totalMin || undefined,
      total_max: totalMax || undefined,
      payment_method: paymentMethod !== 'all' ? paymentMethod : undefined,
      sort_by: sortBy,
      sort_order: sortOrder,
      ...overrides,
    };
    // Remove undefined values
    return Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined));
  };

  // Debounce search to avoid too many requests
  const debouncedSearch = useDebouncedCallback((value: string) => {
    router.get('/contracts', buildFilterParams({ search: value || undefined }), {
      preserveState: true,
      preserveScroll: true,
    });
  }, 500);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    debouncedSearch(value);
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    router.get('/contracts', buildFilterParams({ status: value !== 'all' ? value : undefined }), {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    router.get('/contracts', buildFilterParams({ type: value !== 'all' ? value : undefined }), {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleApplyFilters = () => {
    router.get('/contracts', buildFilterParams(), {
      preserveState: true,
      preserveScroll: true,
    });
    setShowFilters(false);
  };

  const handleApplySort = () => {
    router.get('/contracts', buildFilterParams(), {
      preserveState: true,
      preserveScroll: true,
    });
    setShowSort(false);
  };

  const handleClearFilters = () => {
    setSearchValue('');
    setSelectedStatus('all');
    setSelectedType('all');
    setDateFrom('');
    setDateTo('');
    setTotalMin('');
    setTotalMax('');
    setPaymentMethod('all');
    setSortBy('created_at');
    setSortOrder('desc');
    router.get('/contracts', {}, { preserveState: true });
  };

  const handleExport = () => {
    const params = new URLSearchParams(buildFilterParams() as any);
    window.open(`/contracts/export?${params.toString()}`, '_blank');
  };

  const hasActiveFilters =
    searchValue ||
    selectedStatus !== 'all' ||
    selectedType !== 'all' ||
    dateFrom ||
    dateTo ||
    totalMin ||
    totalMax ||
    paymentMethod !== 'all' ||
    sortBy !== 'created_at' ||
    sortOrder !== 'desc';

  return (
    <Card className="border-gray-200">
      <CardContent className="pt-6">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder={t('contracts.searchPlaceholder')}
              className="pl-9"
              value={searchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>

          <Popover open={showFilters} onOpenChange={setShowFilters}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                {t('common.filters')}
                {hasActiveFilters && (
                  <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                    {
                      [
                        searchValue,
                        selectedStatus !== 'all',
                        selectedType !== 'all',
                        dateFrom,
                        dateTo,
                        totalMin,
                        totalMax,
                        paymentMethod !== 'all',
                      ].filter(Boolean).length
                    }
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 max-h-[80vh] overflow-y-auto scrollbar-hide" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between sticky top-0 bg-white pb-2 z-10">
                  <h4 className="font-semibold">{t('common.filters')}</h4>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearFilters}
                      className="h-auto gap-1 px-2 py-1 text-xs"
                    >
                      <X className="h-3 w-3" />
                      {t('common.clear')}
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('contracts.status')}</label>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('contracts.selectStatus')} />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="all">{t('common.all')}</SelectItem>
                        {ESTADOS_CONTRATO_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {t(option.labelKey)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('contracts.type')}</label>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('contracts.selectType')} />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="all">{t('common.all')}</SelectItem>
                        {TIPOS_CONTRATO_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {t(option.labelKey)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('contracts.dateRange')}</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      placeholder={t('contracts.from')}
                    />
                    <Input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      placeholder={t('contracts.to')}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('contracts.totalRange')}</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      value={totalMin}
                      onChange={(e) => setTotalMin(e.target.value)}
                      placeholder={t('contracts.minAmount')}
                    />
                    <Input
                      type="number"
                      value={totalMax}
                      onChange={(e) => setTotalMax(e.target.value)}
                      placeholder={t('contracts.maxAmount')}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('contracts.paymentMethod')}</label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('contracts.selectPaymentMethod')} />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="all">{t('common.all')}</SelectItem>
                      <SelectItem value="cash">{t('contracts.cash')}</SelectItem>
                      <SelectItem value="credit">{t('contracts.credit')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-2 sticky bottom-0 bg-white">
                  <Button onClick={handleApplyFilters} className="w-full">
                    {t('common.apply')}
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Popover open={showSort} onOpenChange={setShowSort}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <ArrowUpDown className="h-4 w-4" />
                {t('common.sort')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72" align="end">
              <div className="space-y-4">
                <h4 className="font-semibold">{t('common.sortOptions')}</h4>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('common.sortBy')}</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="created_at">{t('contracts.createdAt')}</SelectItem>
                      <SelectItem value="updated_at">{t('contracts.updatedAt')}</SelectItem>
                      <SelectItem value="contract_number">{t('contracts.contractNumber')}</SelectItem>
                      <SelectItem value="total">{t('contracts.total')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('common.sortOrder')}</label>
                  <Select value={sortOrder} onValueChange={setSortOrder}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="desc">{t('common.descending')}</SelectItem>
                      <SelectItem value="asc">{t('common.ascending')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-2">
                  <Button onClick={handleApplySort} className="w-full">
                    {t('common.apply')}
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            {t('common.export')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
