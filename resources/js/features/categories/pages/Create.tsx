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

export default function Create() {
  const { t } = useTranslation();
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    description: '',
    type: '',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    post('/categories');
  };

  return (
    <MainLayout>
      <Head title={t('categories.newCategory')} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('categories.newCategory')}</h1>
            <p className="mt-2 text-sm text-gray-600">
              {t('categories.newCategorySubtitle')}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.visit('/categories')}
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
              <CardTitle>{t('categories.categoryInfo')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  {t('categories.name')} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  placeholder={t('categories.namePlaceholder')}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Type */}
              <div className="space-y-2">
                <Label htmlFor="type">
                  {t('categories.type')} <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={data.type}
                  onValueChange={(value) => setData('type', value)}
                >
                  <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                    <SelectValue placeholder={t('categories.selectType')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="product">{t('categories.product')}</SelectItem>
                    <SelectItem value="service">{t('categories.service')}</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-sm text-red-500">{errors.type}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">{t('categories.description')}</Label>
                <Textarea
                  id="description"
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  placeholder={t('categories.descriptionPlaceholder')}
                  rows={4}
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-4 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.visit('/categories')}
                  disabled={processing}
                >
                  {t('common.cancel')}
                </Button>
                <Button type="submit" disabled={processing} className="gap-2">
                  <Save className="h-4 w-4" />
                  {processing ? t('common.saving') : t('categories.createCategory')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </MainLayout>
  );
}
