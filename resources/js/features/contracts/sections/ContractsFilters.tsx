import { useState } from 'react';
import { router } from '@inertiajs/react';
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
import { Search, Filter, X } from 'lucide-react';
import { ESTADOS_CONTRATO_OPTIONS, TIPOS_CONTRATO_OPTIONS } from '../constants';
import { useDebouncedCallback } from 'use-debounce';

interface ContractsFiltersProps {
  filters?: {
    search?: string;
    status?: string;
    type?: string;
  };
}

export function ContractsFilters({ filters = {} }: ContractsFiltersProps) {
  const [searchValue, setSearchValue] = useState(filters.search || '');
  const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');
  const [selectedType, setSelectedType] = useState(filters.type || 'all');
  const [showFilters, setShowFilters] = useState(false);

  // Debounce search to avoid too many requests
  const debouncedSearch = useDebouncedCallback((value: string) => {
    router.get('/contracts',
      {
        search: value || undefined,
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
        type: selectedType !== 'all' ? selectedType : undefined,
      },
      {
        preserveState: true,
        preserveScroll: true,
      }
    );
  }, 500);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    debouncedSearch(value);
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    router.get('/contracts',
      {
        search: searchValue || undefined,
        status: value !== 'all' ? value : undefined,
        type: selectedType !== 'all' ? selectedType : undefined,
      },
      {
        preserveState: true,
        preserveScroll: true,
      }
    );
  };

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    router.get('/contracts',
      {
        search: searchValue || undefined,
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
        type: value !== 'all' ? value : undefined,
      },
      {
        preserveState: true,
        preserveScroll: true,
      }
    );
  };

  const handleClearFilters = () => {
    setSearchValue('');
    setSelectedStatus('all');
    setSelectedType('all');
    router.get('/contracts', {}, { preserveState: true });
  };

  const hasActiveFilters = searchValue || selectedStatus !== 'all' || selectedType !== 'all';

  return (
    <Card className="border-gray-200">
      <CardContent className="pt-6">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Buscar por número, cliente o difunto..."
              className="pl-9"
              value={searchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>

          <Popover open={showFilters} onOpenChange={setShowFilters}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filtros
                {hasActiveFilters && (
                  <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                    {[searchValue, selectedStatus !== 'all', selectedType !== 'all'].filter(Boolean).length}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Filtros</h4>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearFilters}
                      className="h-auto gap-1 px-2 py-1 text-xs"
                    >
                      <X className="h-3 w-3" />
                      Limpiar
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Estado</label>
                  <Select value={selectedStatus} onValueChange={handleStatusChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      {ESTADOS_CONTRATO_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tipo</label>
                  <Select value={selectedType} onValueChange={handleTypeChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      {TIPOS_CONTRATO_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </Card>
  );
}
