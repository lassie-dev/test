import { Head, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import MainLayout from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Edit, Trash2, FileText, Calendar, User, Users, DollarSign } from 'lucide-react';
import type { Contrato } from '@/features/contracts/types';
import {
  formatearMoneda,
  formatearFecha,
  obtenerVarianteBadgeEstado,
  obtenerEtiquetaEstado,
  obtenerEtiquetaTipo,
  calcularComisionSecretaria,
} from '@/features/contracts/functions';
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

interface ShowProps {
  contract: Contrato;
}

export default function Show({ contract }: ShowProps) {
  const { t } = useTranslation();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleEdit = () => {
    router.visit(`/contracts/${contract.id}/edit`);
  };

  const handleDelete = () => {
    router.delete(`/contracts/${contract.id}`, {
      onSuccess: () => {
        router.visit('/contracts');
      },
    });
  };

  const handleBack = () => {
    router.visit('/contracts');
  };

  const comisionSecretaria = calcularComisionSecretaria(contract);

  return (
    <MainLayout>
      <Head />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {t('contracts.contract')} {contract.numero_contrato}
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                  {t('contracts.completeDetails')}
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleEdit} className="gap-2">
              <Edit className="h-4 w-4" />
              {t('common.edit')}
            </Button>
            <Button
              variant="outline"
              className="gap-2 text-destructive hover:text-destructive"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
              {t('common.delete')}
            </Button>
            <Button className="gap-2">
              <FileText className="h-4 w-4" />
              {t('contracts.generatePDF')}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="col-span-2 space-y-6">
            {/* Contract Info */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{t('contracts.contractInfo')}</CardTitle>
                    <CardDescription>{t('contracts.generalData')}</CardDescription>
                  </div>
                  <Badge variant={obtenerVarianteBadgeEstado(contract.estado) as any}>
                    {obtenerEtiquetaEstado(contract.estado)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{t('contracts.contractNumber')}</p>
                    <p className="mt-1 text-base font-semibold">{contract.numero_contrato}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">{t('contracts.type')}</p>
                    <p className="mt-1 text-base">{obtenerEtiquetaTipo(contract.tipo)}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">{t('contracts.creationDate')}</p>
                    <p className="mt-1 text-base flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {formatearFecha(contract.created_at)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">{t('contracts.lastUpdate')}</p>
                    <p className="mt-1 text-base flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {formatearFecha(contract.updated_at)}
                    </p>
                  </div>
                </div>

                {(contract.es_festivo || contract.es_nocturno) && (
                  <>
                    <Separator />
                    <div className="flex gap-4">
                      {contract.es_festivo && (
                        <Badge variant="secondary">{t('contracts.holidayShort')}</Badge>
                      )}
                      {contract.es_nocturno && (
                        <Badge variant="secondary">{t('contracts.nightShiftShort')}</Badge>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Client Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {t('contracts.client')}
                </CardTitle>
                <CardDescription>{t('contracts.clientData')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{t('contracts.clientName')}</p>
                    <p className="mt-1 text-base font-semibold">{contract.cliente.nombre}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">{t('contracts.clientRut')}</p>
                    <p className="mt-1 text-base">{contract.cliente.rut}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">{t('contracts.clientPhone')}</p>
                    <p className="mt-1 text-base">{contract.cliente.telefono}</p>
                  </div>

                  {contract.cliente.email && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">{t('contracts.clientEmail')}</p>
                      <p className="mt-1 text-base">{contract.cliente.email}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Deceased Info */}
            {contract.difunto && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {t('contracts.deceased')}
                  </CardTitle>
                  <CardDescription>{t('contracts.deceasedData')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">{t('contracts.deceasedName')}</p>
                      <p className="mt-1 text-base font-semibold">{contract.difunto.nombre}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">{t('contracts.deceasedDeathDate')}</p>
                      <p className="mt-1 text-base">
                        {formatearFecha(contract.difunto.fecha_fallecimiento)}
                      </p>
                    </div>

                    {contract.difunto.lugar_fallecimiento && (
                      <div className="col-span-2">
                        <p className="text-sm font-medium text-gray-500">{t('contracts.deceasedDeathPlace')}</p>
                        <p className="mt-1 text-base">{contract.difunto.lugar_fallecimiento}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Services */}
            <Card>
              <CardHeader>
                <CardTitle>{t('contracts.services')}</CardTitle>
                <CardDescription>{t('contracts.includedServices')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                          {t('contracts.service')}
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                          {t('common.quantity')}
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                          {t('contracts.unitPriceFull')}
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                          {t('contracts.subtotal')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {contract.servicios.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-medium text-gray-900">{item.servicio.name}</p>
                              {item.servicio.description && (
                                <p className="text-sm text-gray-500">{item.servicio.description}</p>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right text-gray-900">{item.cantidad}</td>
                          <td className="px-4 py-3 text-right text-gray-900">
                            {formatearMoneda(item.precio_unitario)}
                          </td>
                          <td className="px-4 py-3 text-right font-medium text-gray-900">
                            {formatearMoneda(item.subtotal)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Totals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  {t('contracts.totals')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t('contracts.subtotal')}:</span>
                    <span className="font-medium">{formatearMoneda(contract.subtotal)}</span>
                  </div>

                  {contract.descuento_porcentaje > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {t('contracts.discount')} ({contract.descuento_porcentaje}%):
                      </span>
                      <span className="font-medium text-destructive">
                        -{formatearMoneda(contract.descuento_monto)}
                      </span>
                    </div>
                  )}

                  <Separator />

                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">{t('contracts.total')}:</span>
                    <span className="text-lg font-bold text-primary">
                      {formatearMoneda(contract.total)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Commission */}
            <Card>
              <CardHeader>
                <CardTitle>{t('contracts.commission')}</CardTitle>
                <CardDescription>
                  {t('contracts.commissionDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t('contracts.baseCommission')}</span>
                    <span>{formatearMoneda((contract.total * 5) / 100)}</span>
                  </div>

                  {contract.es_nocturno && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t('contracts.nightCommission')}</span>
                      <span>{formatearMoneda((contract.total * 2) / 100)}</span>
                    </div>
                  )}

                  {contract.es_festivo && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t('contracts.holidayCommission')}</span>
                      <span>{formatearMoneda((contract.total * 3) / 100)}</span>
                    </div>
                  )}

                  <Separator />

                  <div className="flex justify-between">
                    <span className="font-semibold">{t('contracts.totalCommission')}</span>
                    <span className="font-bold text-green-600">
                      {formatearMoneda(comisionSecretaria)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>{t('dashboard.quickActions')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <FileText className="h-4 w-4" />
                  {t('contracts.downloadPDF')}
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Edit className="h-4 w-4" />
                  {t('contracts.modifyStatus')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('contracts.deleteTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('contracts.deleteConfirm')}{' '}
              <span className="font-semibold">{contract.numero_contrato}</span>? {t('contracts.deleteWarning')}
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
