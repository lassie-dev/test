import { Head, router, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import MainLayout from '@/components/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';

interface Cemetery {
  id?: number;
  name: string;
  type: 'public' | 'private' | 'parque';
  address: string;
  city: string;
  region: string;
  phone: string;
  administrator_name?: string;
  email?: string;
  office_hours?: string;
  notes?: string;
}

interface Props {
  cemetery?: Cemetery;
}

export default function CemeteryForm({ cemetery }: Props) {
  const { t } = useTranslation();
  const isEditing = !!cemetery;

  const { data, setData, post, put, processing, errors } = useForm<Cemetery>({
    name: cemetery?.name || '',
    type: cemetery?.type || 'public',
    address: cemetery?.address || '',
    city: cemetery?.city || '',
    region: cemetery?.region || '',
    phone: cemetery?.phone || '',
    administrator_name: cemetery?.administrator_name || '',
    email: cemetery?.email || '',
    office_hours: cemetery?.office_hours || '',
    notes: cemetery?.notes || '',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (isEditing && cemetery?.id) {
      put(`/directory/cemeteries/${cemetery.id}`, {
        onSuccess: () => {
          toast.success(t('directory.successUpdated'));
          router.visit('/directory/cemeteries');
        },
        onError: () => {
          toast.error(t('common.error'));
        },
      });
    } else {
      post('/directory/cemeteries', {
        onSuccess: () => {
          toast.success(t('directory.successCreated'));
          router.visit('/directory/cemeteries');
        },
        onError: () => {
          toast.error(t('common.error'));
        },
      });
    }
  };

  const types: Array<'public' | 'private' | 'parque'> = ['public', 'private', 'parque'];

  return (
    <MainLayout>
      <Head title={isEditing ? t('directory.editCemetery') : t('directory.createCemetery')} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? t('directory.editCemetery') : t('directory.createCemetery')}
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              {isEditing
                ? 'Update cemetery information'
                : 'Add a new cemetery to the directory'}
            </p>
          </div>
          <Button variant="outline" onClick={() => router.visit('/directory/cemeteries')} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t('common.back')}
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('common.basicInformation')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    {t('directory.name')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="Cemetery name"
                    required
                  />
                  {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">
                    {t('directory.type')} <span className="text-red-500">*</span>
                  </Label>
                  <Select value={data.type} onValueChange={(value: 'public' | 'private' | 'parque') => setData('type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {types.map((type) => (
                        <SelectItem key={type} value={type}>
                          {t(`directory.${type}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.type && <p className="text-sm text-red-600">{errors.type}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">
                    {t('directory.address')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="address"
                    type="text"
                    value={data.address}
                    onChange={(e) => setData('address', e.target.value)}
                    placeholder="Street address"
                    required
                  />
                  {errors.address && <p className="text-sm text-red-600">{errors.address}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">
                    {t('directory.city')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="city"
                    type="text"
                    value={data.city}
                    onChange={(e) => setData('city', e.target.value)}
                    placeholder="City"
                    required
                  />
                  {errors.city && <p className="text-sm text-red-600">{errors.city}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="region">
                    {t('directory.region')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="region"
                    type="text"
                    value={data.region}
                    onChange={(e) => setData('region', e.target.value)}
                    placeholder="Region"
                    required
                  />
                  {errors.region && <p className="text-sm text-red-600">{errors.region}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">
                    {t('directory.phone')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={data.phone}
                    onChange={(e) => setData('phone', e.target.value)}
                    placeholder="+56 9 1234 5678"
                    required
                  />
                  {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="administrator_name">{t('directory.administrator')}</Label>
                  <Input
                    id="administrator_name"
                    type="text"
                    value={data.administrator_name}
                    onChange={(e) => setData('administrator_name', e.target.value)}
                    placeholder="Administrator name"
                  />
                  {errors.administrator_name && <p className="text-sm text-red-600">{errors.administrator_name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{t('directory.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    placeholder="cemetery@example.com"
                  />
                  {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="office_hours">{t('directory.officeHours')}</Label>
                  <Input
                    id="office_hours"
                    type="text"
                    value={data.office_hours}
                    onChange={(e) => setData('office_hours', e.target.value)}
                    placeholder="Mon-Fri 9:00-17:00"
                  />
                  {errors.office_hours && <p className="text-sm text-red-600">{errors.office_hours}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="notes">{t('directory.notes')}</Label>
                  <Textarea
                    id="notes"
                    value={data.notes}
                    onChange={(e) => setData('notes', e.target.value)}
                    placeholder="Additional information"
                    rows={4}
                  />
                  {errors.notes && <p className="text-sm text-red-600">{errors.notes}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.visit('/directory/cemeteries')}
            >
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={processing} className="gap-2">
              <Save className="h-4 w-4" />
              {processing ? t('common.saving') : t('common.save')}
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
