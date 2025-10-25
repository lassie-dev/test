import { Head, router } from '@inertiajs/react';
import MainLayout from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

// Feature imports - NO re-exports, direct imports only
import type { Contrato } from '@/features/contracts/types';
import { ContractsHeader } from '@/features/contracts/sections/ContractsHeader';
import { ContractsFilters } from '@/features/contracts/sections/ContractsFilters';
import { ContractsTable } from '@/features/contracts/components/ContractsTable';

interface PaginationLinks {
  url: string | null;
  label: string;
  active: boolean;
}

interface PaginatedData<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  links: PaginationLinks[];
}

interface ContractsIndexProps {
  contracts: PaginatedData<Contrato>;
  filters?: {
    search?: string;
    status?: string;
    type?: string;
  };
}

export default function Index({ contracts, filters }: ContractsIndexProps) {
  const handleCreate = () => {
    router.visit('/contracts/create');
  };

  const handlePageChange = (url: string) => {
    router.visit(url, { preserveState: true });
  };

  return (
    <MainLayout>
      <Head />

      <div className="space-y-6">
        {/* Header */}
        <ContractsHeader onCreateClick={handleCreate} />

        {/* Filters */}
        <ContractsFilters filters={filters} />

        {/* Table */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">
              Lista de Contratos
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({contracts.total} {contracts.total === 1 ? 'contrato' : 'contratos'})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ContractsTable contracts={contracts.data} onCreateClick={handleCreate} />

            {/* Pagination */}
            {contracts.last_page > 1 && (
              <div className="mt-6">
                <Pagination>
                  <PaginationContent>
                    {contracts.links.map((link, index) => {
                      // Previous button
                      if (index === 0) {
                        return (
                          <PaginationItem key="prev">
                            <PaginationPrevious
                              onClick={() => link.url && handlePageChange(link.url)}
                              className={!link.url ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />
                          </PaginationItem>
                        );
                      }

                      // Next button
                      if (index === contracts.links.length - 1) {
                        return (
                          <PaginationItem key="next">
                            <PaginationNext
                              onClick={() => link.url && handlePageChange(link.url)}
                              className={!link.url ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />
                          </PaginationItem>
                        );
                      }

                      // Page numbers
                      if (link.label === '...') {
                        return (
                          <PaginationItem key={`ellipsis-${index}`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }

                      return (
                        <PaginationItem key={index}>
                          <PaginationLink
                            onClick={() => link.url && handlePageChange(link.url)}
                            isActive={link.active}
                            className="cursor-pointer"
                          >
                            {link.label}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
