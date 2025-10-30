import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import MainLayout from '@/components/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter, Package, AlertTriangle, Edit, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  category?: Category;
  price: number;
  stock: number;
  min_stock: number;
  is_active: boolean;
}

interface PaginatedProducts {
  data: Product[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface Stats {
  total: number;
  lowStock: number;
  outOfStock: number;
  totalValue: number;
}

interface Filters {
  search?: string;
  category?: string;
  stock_status?: string;
}

interface Props {
  products: PaginatedProducts;
  stats: Stats;
  categories: Category[];
  filters: Filters;
}

const STOCK_STATUS_OPTIONS = [
  { value: 'all', labelKey: 'inventory.allStatuses' },
  { value: 'low', labelKey: 'inventory.lowStock' },
  { value: 'out', labelKey: 'inventory.outOfStock' },
];

export default function Index({ products, stats, categories, filters }: Props) {
  const { t } = useTranslation();
  const [search, setSearch] = useState(filters.search || '');
  const [categoryFilter, setCategoryFilter] = useState(filters.category || 'all');
  const [stockStatusFilter, setStockStatusFilter] = useState(filters.stock_status || 'all');
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; product: Product | null }>({
    open: false,
    product: null,
  });

  const handleSearch = () => {
    router.get(
      '/inventory',
      {
        search,
        category: categoryFilter === 'all' ? '' : categoryFilter,
        stock_status: stockStatusFilter === 'all' ? '' : stockStatusFilter,
      },
      { preserveState: true, preserveScroll: true }
    );
  };

  const handleDelete = (product: Product) => {
    setDeleteDialog({ open: true, product });
  };

  const confirmDelete = () => {
    if (!deleteDialog.product) return;

    router.delete(`/inventory/${deleteDialog.product.id}`, {
      preserveScroll: true,
      onSuccess: (page: any) => {
        if (page.props.flash?.success) {
          toast.success(page.props.flash.success);
        }
        if (page.props.flash?.error) {
          toast.error(page.props.flash.error);
        }
        setDeleteDialog({ open: false, product: null });
      },
      onError: (errors: any) => {
        const errorMessage = errors.message || 'Error al eliminar el producto';
        toast.error(errorMessage);
        setDeleteDialog({ open: false, product: null });
      },
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(amount);
  };

  const getCategoryName = (product: Product) => {
    // Access the category relationship loaded from the backend
    return product.category?.name || t('inventory.uncategorized');
  };

  const getStockBadgeVariant = (product: Product) => {
    if (product.stock <= 0) return 'destructive';
    if (product.stock <= product.min_stock) return 'warning';
    return 'success';
  };

  const getStockLabel = (product: Product) => {
    if (product.stock <= 0) return t('inventory.outOfStock');
    if (product.stock <= product.min_stock) return t('inventory.lowStock');
    return t('inventory.inStock');
  };

  return (
    <MainLayout>
      <Head title={t('inventory.title')} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('inventory.title')}</h1>
            <p className="mt-2 text-sm text-gray-600">
              {t('inventory.subtitle')}
            </p>
          </div>
          <Button className="gap-2" onClick={() => router.visit('/inventory/create')}>
            <Plus className="h-4 w-4" />
            {t('inventory.addProduct')}
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('inventory.totalProducts')}</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">{t('inventory.registeredProducts')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('inventory.lowStock')}</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.lowStock}</div>
              <p className="text-xs text-muted-foreground">{t('inventory.lowStockProducts')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('inventory.outOfStock')}</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.outOfStock}</div>
              <p className="text-xs text-muted-foreground">{t('inventory.outOfStockProducts')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('inventory.totalValue')}</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</div>
              <p className="text-xs text-muted-foreground">{t('inventory.inventoryValue')}</p>
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
                      placeholder={t('inventory.searchPlaceholder')}
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
                    {t('inventory.category')}
                  </label>
                  <div className="space-y-2">
                    <label
                      className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors"
                    >
                      <input
                        type="radio"
                        name="category"
                        value="all"
                        checked={categoryFilter === 'all'}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="w-4 h-4 text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-gray-700">{t('inventory.allCategories')}</span>
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

                {/* Stock Status Filter */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">
                    {t('inventory.stockStatus')}
                  </label>
                  <div className="space-y-2">
                    {STOCK_STATUS_OPTIONS.map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors"
                      >
                        <input
                          type="radio"
                          name="stock_status"
                          value={option.value}
                          checked={stockStatusFilter === option.value}
                          onChange={(e) => setStockStatusFilter(e.target.value)}
                          className="w-4 h-4 text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-gray-700">{t(option.labelKey)}</span>
                      </label>
                    ))}
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

          {/* Right Content - Products */}
          <div className="lg:col-span-3 space-y-6">
            {/* Products Header */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {t('inventory.showingResults', { count: products.data.length, total: products.total })}
              </p>
            </div>

            {/* Products Grid */}
            {products.data.length === 0 ? (
              <Card>
                <CardContent className="py-12">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="rounded-full bg-gray-100 p-3 mb-4">
                      <Package className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {t('inventory.noProducts')}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      {t('inventory.noProductsDescription')}
                    </p>
                    <Button className="gap-2" onClick={() => router.visit('/inventory/create')}>
                      <Plus className="h-4 w-4" />
                      {t('inventory.createFirstProduct')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {products.data.map((product) => (
                  <div key={product.id} className="relative overflow-hidden rounded-lg border-2 bg-card text-card-foreground shadow-sm hover:shadow-lg transition-shadow duration-200">
                    {/* Stock Status Badge */}
                    <div className="absolute top-3 right-3 z-10">
                      <Badge variant={getStockBadgeVariant(product) as any}>
                        {getStockLabel(product)}
                      </Badge>
                    </div>

                    <div className="p-6 space-y-4">
                      {/* Product Icon & Name */}
                      <div className="space-y-2">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Package className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0 pr-16">
                            <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                              {product.name}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">
                              {getCategoryName(product)}
                            </p>
                          </div>
                        </div>

                        {product.description && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {product.description}
                          </p>
                        )}
                      </div>

                      {/* Divider */}
                      <div className="border-t pt-4 space-y-3">
                        {/* Price & Stock */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">{t('inventory.price')}</span>
                            <span className="text-lg font-bold text-primary">
                              {formatCurrency(product.price)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">{t('inventory.stock')}</span>
                            <span className="text-sm font-medium">
                              {product.stock} {t('inventory.units')}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">{t('inventory.minStock')}</span>
                            <span className="text-sm font-medium">
                              {product.min_stock} {t('inventory.units')}
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 gap-1"
                            onClick={() => router.visit(`/inventory/${product.id}/edit`)}
                          >
                            <Edit className="h-4 w-4" />
                            {t('common.edit')}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(product)}
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, product: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro de eliminar este producto?</AlertDialogTitle>
            <AlertDialogDescription>
              Estás a punto de eliminar el producto <strong>{deleteDialog.product?.name}</strong>.
              <span className="block mt-2">
                Esta acción no se puede deshacer.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
