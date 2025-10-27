import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import MainLayout from '@/components/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft } from 'lucide-react';
import { DEFAULT_SERVICE_VALUES } from '@/features/services/constants';
import type { ServiceFormInput } from '@/features/services/schemas';

export default function Create() {
  const { t } = useTranslation();
  const { data, setData, post, processing, errors } = useForm<ServiceFormInput>(DEFAULT_SERVICE_VALUES);

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post('/services');
  };

  return (
    <MainLayout>
      <Head title={t('services.createService')} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('services.createService')}</h1>
            <p className="mt-2 text-sm text-gray-600">
              {t('services.subtitle')}
            </p>
          </div>
          <Link href="/services">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t('services.backToServices')}
            </Button>
          </Link>
        </div>

        {/* Form */}
        <form onSubmit={submit}>
          <Card>
            <CardHeader>
              <CardTitle>{t('services.createService')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Service Name */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  {t('services.serviceName')} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  placeholder={t('services.serviceNamePlaceholder')}
                  className={errors.name ? 'border-destructive' : ''}
                  required
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">{t('services.description')}</Label>
                <Textarea
                  id="description"
                  value={data.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('description', e.target.value)}
                  placeholder={t('services.descriptionPlaceholder')}
                  rows={4}
                  className={errors.description ? 'border-destructive' : ''}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description}</p>
                )}
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price">
                  {t('services.price')} (CLP) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={data.price}
                  onChange={(e) => setData('price', e.target.value)}
                  placeholder={t('services.pricePlaceholder')}
                  min="0"
                  step="1"
                  className={errors.price ? 'border-destructive' : ''}
                  required
                />
                {errors.price && (
                  <p className="text-sm text-destructive">{errors.price}</p>
                )}
              </div>

              {/* Active Status */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="active"
                  checked={data.active}
                  onCheckedChange={(checked) => setData('active', checked as boolean)}
                />
                <Label
                  htmlFor="active"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t('services.active')}
                </Label>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-4 pt-4">
                <Link href="/services">
                  <Button type="button" variant="outline">
                    {t('common.cancel')}
                  </Button>
                </Link>
                <Button type="submit" disabled={processing}>
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
