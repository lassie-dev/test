import { Head, router, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import MainLayout from '@/components/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  category_id: number;
  category?: Category;
  price: number;
  stock: number;
  min_stock: number;
  is_active: boolean;
}

interface Props {
  product: Product;
  categories: Category[];
}

export default function Edit({ product, categories }: Props) {
  const { t } = useTranslation();
  const { data, setData, put, processing, errors } = useForm({
    name: product.name || '',
    description: product.description || '',
    category_id: product.category_id ? product.category_id.toString() : '',
    price: product.price ? product.price.toString() : '',
    stock: product.stock ? product.stock.toString() : '',
    min_stock: product.min_stock ? product.min_stock.toString() : '',
    is_active: product.is_active ?? true,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    put(`/inventory/${product.id}`);
  };

  return (
    <MainLayout>
      <Head title={t('inventory.editProduct')} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('inventory.editProduct')}</h1>
            <p className="mt-2 text-sm text-gray-600">
              {t('inventory.editProductSubtitle')}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.visit('/inventory')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('common.back')}
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>{t('inventory.productDetails')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Product Name */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  {t('inventory.productName')} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  placeholder={t('inventory.productNamePlaceholder')}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">{t('inventory.description')}</Label>
                <Textarea
                  id="description"
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  placeholder={t('inventory.descriptionPlaceholder')}
                  rows={4}
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description}</p>
                )}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category_id">
                  {t('inventory.category')} <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={data.category_id}
                  onValueChange={(value) => setData('category_id', value)}
                >
                  <SelectTrigger className={errors.category_id ? 'border-red-500' : ''}>
                    <SelectValue placeholder={t('inventory.selectCategory')} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category_id && (
                  <p className="text-sm text-red-500">{errors.category_id}</p>
                )}
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price">
                  {t('inventory.price')} (CLP) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={data.price}
                  onChange={(e) => setData('price', e.target.value)}
                  placeholder="0.00"
                  className={errors.price ? 'border-red-500' : ''}
                />
                {errors.price && (
                  <p className="text-sm text-red-500">{errors.price}</p>
                )}
              </div>

              {/* Stock and Min Stock */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="stock">
                    {t('inventory.stock')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    value={data.stock}
                    onChange={(e) => setData('stock', e.target.value)}
                    placeholder="0"
                    className={errors.stock ? 'border-red-500' : ''}
                  />
                  {errors.stock && (
                    <p className="text-sm text-red-500">{errors.stock}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="min_stock">
                    {t('inventory.minStock')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="min_stock"
                    type="number"
                    min="0"
                    value={data.min_stock}
                    onChange={(e) => setData('min_stock', e.target.value)}
                    placeholder="0"
                    className={errors.min_stock ? 'border-red-500' : ''}
                  />
                  {errors.min_stock && (
                    <p className="text-sm text-red-500">{errors.min_stock}</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-4 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.visit('/inventory')}
                  disabled={processing}
                >
                  {t('common.cancel')}
                </Button>
                <Button type="submit" disabled={processing} className="gap-2">
                  <Save className="h-4 w-4" />
                  {processing ? t('common.saving') : t('common.save')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </MainLayout>
  );
}
