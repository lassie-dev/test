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
import { Plus, Search, Filter, Edit, Trash2, Package, Briefcase, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  type: 'service' | 'product';
  icon: string | null;
  is_active: boolean;
  parent_id: number | null;
  products_count?: number;
  services_count?: number;
}

interface PaginatedCategories {
  data: Category[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface Stats {
  total: number;
  product: number;
  service: number;
  active: number;
}

interface Filters {
  search?: string;
  type?: string;
}

interface Props {
  categories: PaginatedCategories;
  stats: Stats;
  filters: Filters;
  categoryType?: 'all' | 'product' | 'service';
}

const TYPE_OPTIONS = [
  { value: 'all', label: 'Todos' },
  { value: 'product', label: 'Productos' },
  { value: 'service', label: 'Servicios' },
];

export default function Index({ categories, stats, filters, categoryType = 'all' }: Props) {
  const { t } = useTranslation();
  const [search, setSearch] = useState(filters.search || '');
  const [typeFilter, setTypeFilter] = useState(filters.type || 'all');

  // Determine the base URL based on categoryType
  const getBaseUrl = () => {
    if (categoryType === 'product') return '/categories/products';
    if (categoryType === 'service') return '/categories/services';
    return '/categories';
  };

  const handleSearch = () => {
    router.get(
      getBaseUrl(),
      {
        search,
        ...(categoryType === 'all' && typeFilter !== 'all' ? { type: typeFilter } : {}),
      },
      { preserveState: true, preserveScroll: true }
    );
  };

  const handleDelete = (id: number, name: string) => {
    if (confirm(`¿Estás seguro de eliminar la categoría "${name}"?\n\nEsta acción no se puede deshacer.`)) {
      router.delete(`/categories/${id}`, {
        preserveScroll: true,
      });
    }
  };


  const getItemsCount = (category: Category) => {
    if (category.type === 'product') {
      return category.products_count || 0;
    }
    return category.services_count || 0;
  };

  const getTypeBadgeVariant = (type: string) => {
    return type === 'product' ? 'default' : 'secondary';
  };

  // Get page title and subtitle based on category type
  const getPageTitle = () => {
    if (categoryType === 'product') return 'Categorías de Productos';
    if (categoryType === 'service') return 'Categorías de Servicios';
    return 'Categorías';
  };

  const getPageSubtitle = () => {
    if (categoryType === 'product') return 'Gestiona las categorías de productos';
    if (categoryType === 'service') return 'Gestiona las categorías de servicios';
    return 'Gestiona las categorías de servicios y productos';
  };

  return (
    <MainLayout>
      <Head title={getPageTitle()} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{getPageTitle()}</h1>
            <p className="mt-2 text-sm text-gray-600">
              {getPageSubtitle()}
            </p>
          </div>
          <Link href={categoryType !== 'all' ? `/categories/create?type=${categoryType}` : '/categories/create'}>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nueva Categoría
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <Tag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Categorías totales</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Productos</CardTitle>
              <Package className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.product}</div>
              <p className="text-xs text-muted-foreground">Categorías de productos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Servicios</CardTitle>
              <Briefcase className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.service}</div>
              <p className="text-xs text-muted-foreground">Categorías de servicios</p>
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
                  placeholder="Buscar categorías..."
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              {/* Only show type filter on "all categories" page */}
              {categoryType === 'all' && (
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <Button onClick={handleSearch} className="gap-2">
                <Filter className="h-4 w-4" />
                Filtrar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Categories Table */}
        <Card>
          <CardHeader>
            <CardTitle>Listado de Categorías</CardTitle>
          </CardHeader>
          <CardContent>
            {categories.data.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-gray-100 p-3 mb-4">
                  <Tag className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No hay categorías
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Comienza creando tu primera categoría
                </p>
                <Link href={categoryType !== 'all' ? `/categories/create?type=${categoryType}` : '/categories/create'}>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Nueva Categoría
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">ID</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead className="text-center">Elementos</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.data.map((category) => (
                      <TableRow key={category.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{category.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {category.icon ? (
                              <span className="text-lg">{category.icon}</span>
                            ) : (
                              <Tag className="h-4 w-4 text-muted-foreground" />
                            )}
                            <div className="font-medium">{category.name}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getTypeBadgeVariant(category.type) as any} className="gap-1">
                            {category.type === 'product' ? (
                              <>
                                <Package className="h-3 w-3" />
                                Producto
                              </>
                            ) : (
                              <>
                                <Briefcase className="h-3 w-3" />
                                Servicio
                              </>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          {category.description ? (
                            <span className="text-sm text-muted-foreground line-clamp-2">
                              {category.description}
                            </span>
                          ) : (
                            <span className="text-sm text-muted-foreground italic">Sin descripción</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <span className="font-medium">{getItemsCount(category)}</span>
                            <span className="text-xs text-muted-foreground">items</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/categories/${category.id}/edit`}>
                              <Button variant="outline" size="sm" className="gap-1">
                                <Edit className="h-3 w-3" />
                                Editar
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleDelete(category.id, category.name)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Pagination */}
            {categories.data.length > 0 && categories.last_page > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Mostrando {categories.data.length} de {categories.total} categorías
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={categories.current_page === 1}
                    onClick={() => router.get(`${getBaseUrl()}?page=${categories.current_page - 1}`)}
                  >
                    Anterior
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: categories.last_page }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={page === categories.current_page ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => router.get(`${getBaseUrl()}?page=${page}`)}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={categories.current_page === categories.last_page}
                    onClick={() => router.get(`${getBaseUrl()}?page=${categories.current_page + 1}`)}
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
