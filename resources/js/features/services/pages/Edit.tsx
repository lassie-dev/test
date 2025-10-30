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
import { Checkbox } from '@/components/ui/checkbox';
import type { Service } from '@/features/services/types';

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Props {
  service: Service;
  categories: Category[];
}

export default function Edit({ service, categories }: Props) {
  const { t } = useTranslation();
  const { data, setData, put, processing, errors } = useForm({
    nombre: service.nombre || '',
    descripcion: service.descripcion || '',
    category_id: service.category?.id ? service.category.id.toString() : '',
    precio: service.precio ? service.precio.toString() : '',
    activo: service.activo ?? true,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    put(`/services/${service.id}`);
  };

  return (
    <MainLayout>
      <Head title={t('services.editService')} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('services.editService')}</h1>
            <p className="mt-2 text-sm text-gray-600">
              {t('services.editServiceSubtitle')}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.visit('/services')}
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
              <CardTitle>{t('services.serviceDetails')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Service Name */}
              <div className="space-y-2">
                <Label htmlFor="nombre">
                  {t('services.serviceName')} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nombre"
                  type="text"
                  value={data.nombre}
                  onChange={(e) => setData('nombre', e.target.value)}
                  placeholder={t('services.serviceNamePlaceholder')}
                  className={errors.nombre ? 'border-red-500' : ''}
                />
                {errors.nombre && (
                  <p className="text-sm text-red-500">{errors.nombre}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="descripcion">{t('services.description')}</Label>
                <Textarea
                  id="descripcion"
                  value={data.descripcion}
                  onChange={(e) => setData('descripcion', e.target.value)}
                  placeholder={t('services.descriptionPlaceholder')}
                  rows={4}
                  className={errors.descripcion ? 'border-red-500' : ''}
                />
                {errors.descripcion && (
                  <p className="text-sm text-red-500">{errors.descripcion}</p>
                )}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category_id">{t('services.category')}</Label>
                <Select
                  value={data.category_id || undefined}
                  onValueChange={(value) => setData('category_id', value)}
                >
                  <SelectTrigger className={errors.category_id ? 'border-red-500' : ''}>
                    <SelectValue placeholder={t('services.selectCategory')} />
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
                <Label htmlFor="precio">
                  {t('services.price')} (CLP) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="precio"
                  type="number"
                  step="0.01"
                  min="0"
                  value={data.precio}
                  onChange={(e) => setData('precio', e.target.value)}
                  placeholder="0.00"
                  className={errors.precio ? 'border-red-500' : ''}
                />
                {errors.precio && (
                  <p className="text-sm text-red-500">{errors.precio}</p>
                )}
              </div>

              {/* Active Status */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="activo"
                  checked={data.activo}
                  onCheckedChange={(checked) => setData('activo', checked as boolean)}
                />
                <Label
                  htmlFor="activo"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {t('services.active')}
                </Label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-4 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.visit('/services')}
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
