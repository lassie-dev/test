import { Head, Link, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import MainLayout from '@/components/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Trash2, Briefcase } from 'lucide-react';
import type { Service } from '@/features/services/types';
import { formatCurrency, getServiceStatusVariant } from '@/features/services/functions';
import { useState } from 'react';
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

interface Props {
  service: Service;
}

export default function Show({ service }: Props) {
  const { t } = useTranslation();
  const [deleteDialog, setDeleteDialog] = useState(false);

  const handleDelete = () => {
    router.delete(`/services/${service.id}`, {
      onSuccess: (page: any) => {
        if (page.props.flash?.success) {
          toast.success(page.props.flash.success);
        }
        router.visit('/services');
      },
      onError: (errors: any) => {
        const errorMessage = errors.message || 'Error al eliminar el servicio';
        toast.error(errorMessage);
        setDeleteDialog(false);
      },
    });
  };

  return (
    <MainLayout>
      <Head title={service.nombre} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{service.nombre}</h1>
            <p className="mt-2 text-sm text-gray-600">
              {t('services.serviceDetails')}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.visit('/services')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('common.back')}
            </Button>
            <Link href={`/services/${service.id}/edit`}>
              <Button variant="outline" className="gap-2">
                <Edit className="h-4 w-4" />
                {t('common.edit')}
              </Button>
            </Link>
            <Button
              variant="outline"
              className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => setDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4" />
              {t('common.delete')}
            </Button>
          </div>
        </div>

        {/* Service Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    {t('services.serviceInformation')}
                  </CardTitle>
                  <Badge variant={getServiceStatusVariant(service.activo) as any}>
                    {service.activo ? t('services.active') : t('services.inactive')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">{t('services.serviceName')}</h3>
                  <p className="mt-1 text-lg font-semibold">{service.nombre}</p>
                </div>

                {service.descripcion && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">{t('services.description')}</h3>
                    <p className="mt-1 text-gray-900">{service.descripcion}</p>
                  </div>
                )}

                {service.category && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">{t('services.category')}</h3>
                    <p className="mt-1 text-gray-900">{service.category.name}</p>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-medium text-gray-500">{t('services.price')}</h3>
                  <p className="mt-1 text-2xl font-bold text-primary">
                    {formatCurrency(service.precio)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Meta Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>{t('services.additionalInfo')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">{t('common.createdAt')}</h3>
                  <p className="mt-1 text-gray-900">
                    {new Date(service.created_at).toLocaleDateString('es-CL', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">{t('common.updatedAt')}</h3>
                  <p className="mt-1 text-gray-900">
                    {new Date(service.updated_at).toLocaleDateString('es-CL', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('services.deleteConfirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('services.deleteConfirmMessage')} <strong>{service.nombre}</strong>.
              <span className="block mt-2">
                {t('common.cannotUndo')}
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
