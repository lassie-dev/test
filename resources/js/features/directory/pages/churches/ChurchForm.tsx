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

interface Church {
  id?: number;
  name: string;
  religion: string;
  address: string;
  city: string;
  region: string;
  phone: string;
  email?: string;
  capacity?: number;
  notes?: string;
}

interface Props {
  church?: Church;
}

export default function ChurchForm({ church }: Props) {
  const { t } = useTranslation();
  const isEditing = !!church;

  const { data, setData, post, put, processing, errors } = useForm<Church>({
    name: church?.name || '',
    religion: church?.religion || '',
    address: church?.address || '',
    city: church?.city || '',
    region: church?.region || '',
    phone: church?.phone || '',
    email: church?.email || '',
    capacity: church?.capacity || undefined,
    notes: church?.notes || '',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (isEditing && church?.id) {
      put(`/directory/churches/${church.id}`, {
        onSuccess: () => {
          toast.success(t('directory.successUpdated'));
          router.visit('/directory/churches');
        },
        onError: () => {
          toast.error(t('common.error'));
        },
      });
    } else {
      post('/directory/churches', {
        onSuccess: () => {
          toast.success(t('directory.successCreated'));
          router.visit('/directory/churches');
        },
        onError: () => {
          toast.error(t('common.error'));
        },
      });
    }
  };

  const religions = ['catholic', 'evangelical', 'baptist', 'jewish', 'other'];

  return (
    <MainLayout>
      <Head title={isEditing ? t('directory.editChurch') : t('directory.createChurch')} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? t('directory.editChurch') : t('directory.createChurch')}
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              {isEditing
                ? 'Update church information'
                : 'Add a new church to the directory'}
            </p>
          </div>
          <Button variant="outline" onClick={() => router.visit('/directory/churches')} className="gap-2">
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
                    placeholder="Church name"
                    required
                  />
                  {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="religion">
                    {t('directory.religion')} <span className="text-red-500">*</span>
                  </Label>
                  <Select value={data.religion} onValueChange={(value) => setData('religion', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select religion" />
                    </SelectTrigger>
                    <SelectContent>
                      {religions.map((religion) => (
                        <SelectItem key={religion} value={religion}>
                          {t(`directory.${religion}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.religion && <p className="text-sm text-red-600">{errors.religion}</p>}
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
                  <Label htmlFor="email">{t('directory.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    placeholder="church@example.com"
                  />
                  {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capacity">{t('directory.capacity')}</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={data.capacity || ''}
                    onChange={(e) => setData('capacity', e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="Number of people"
                    min="0"
                  />
                  {errors.capacity && <p className="text-sm text-red-600">{errors.capacity}</p>}
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
              onClick={() => router.visit('/directory/churches')}
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
