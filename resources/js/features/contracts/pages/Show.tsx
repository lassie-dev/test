import { Head, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import MainLayout from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Edit,
  Trash2,
  FileText,
  Calendar,
  User,
  Users,
  DollarSign,
  Package,
  Printer,
  MapPin,
  Clock,
  MessageSquare,
  CreditCard,
  UserCheck,
  Briefcase,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Contrato } from '@/features/contracts/types';
import {
  formatearMoneda,
  formatearFecha,
  formatearFechaHora,
  obtenerVarianteBadgeEstado,
  obtenerEtiquetaEstado,
  obtenerEtiquetaTipo,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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

  const handlePrintQuotation = () => {
    window.open(`/contracts/${contract.id}/print-quotation`, '_blank');
  };

  const handlePrintContract = () => {
    window.open(`/contracts/${contract.id}/print-contract`, '_blank');
  };

  const handlePrintSocialMediaAuth = () => {
    window.open(`/contracts/${contract.id}/print-social-media-auth`, '_blank');
  };

  const handlePrintReceipt = () => {
    window.open(`/contracts/${contract.id}/print-receipt`, '_blank');
  };

  return (
    <MainLayout>
      <Head title={`${t('contracts.contract')} ${contract.numero_contrato}`} />

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

            {/* Print Documents Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="gap-2">
                  <Printer className="h-4 w-4" />
                  {t('contracts.print')}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t('contracts.documents')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handlePrintQuotation}>
                  <FileText className="mr-2 h-4 w-4" />
                  {t('contracts.printQuotation')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handlePrintContract}>
                  <FileText className="mr-2 h-4 w-4" />
                  {t('contracts.printContract')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handlePrintSocialMediaAuth}>
                  <FileText className="mr-2 h-4 w-4" />
                  {t('contracts.printSocialMediaAuth')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handlePrintReceipt}>
                  <FileText className="mr-2 h-4 w-4" />
                  {t('contracts.printReceipt')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              className="gap-2 text-destructive hover:text-destructive"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
              {t('common.delete')}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contract Info */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{t('contracts.contractInfo')}</CardTitle>
                    <CardDescription>{t('contracts.generalData')}</CardDescription>
                  </div>
                  <Badge variant={obtenerVarianteBadgeEstado(contract.estado) as any}>
                    {t(obtenerEtiquetaEstado(contract.estado))}
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
                    <p className="mt-1 text-base">{t(obtenerEtiquetaTipo(contract.tipo))}</p>
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

                  {contract.cliente.direccion && (
                    <div className="col-span-2">
                      <p className="text-sm font-medium text-gray-500">{t('contracts.clientAddress')}</p>
                      <p className="mt-1 text-base">{contract.cliente.direccion}</p>
                    </div>
                  )}

                  {contract.cliente.parentesco && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">{t('contracts.clientRelationship')}</p>
                      <p className="mt-1 text-base">{contract.cliente.parentesco}</p>
                    </div>
                  )}

                  {contract.cliente.ocupacion && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">{t('contracts.clientOccupation')}</p>
                      <p className="mt-1 text-base">{contract.cliente.ocupacion}</p>
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

                    {contract.difunto.edad && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">{t('contracts.deceasedAge')}</p>
                        <p className="mt-1 text-base">{contract.difunto.edad} {t('contracts.years')}</p>
                      </div>
                    )}

                    <div>
                      <p className="text-sm font-medium text-gray-500">{t('contracts.deceasedDeathDate')}</p>
                      <p className="mt-1 text-base">
                        {formatearFecha(contract.difunto.fecha_fallecimiento)}
                        {contract.difunto.hora_fallecimiento && ` • ${contract.difunto.hora_fallecimiento}`}
                      </p>
                    </div>

                    {contract.difunto.lugar_fallecimiento && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">{t('contracts.deceasedDeathPlace')}</p>
                        <p className="mt-1 text-base">{contract.difunto.lugar_fallecimiento}</p>
                      </div>
                    )}

                    {contract.difunto.causa_fallecimiento && (
                      <div className="col-span-2">
                        <p className="text-sm font-medium text-gray-500">{t('contracts.deceasedCauseOfDeath')}</p>
                        <p className="mt-1 text-base">{contract.difunto.causa_fallecimiento}</p>
                      </div>
                    )}

                    {contract.difunto.nivel_estudio && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">{t('contracts.deceasedEducationLevel')}</p>
                        <p className="mt-1 text-base">{contract.difunto.nivel_estudio}</p>
                      </div>
                    )}

                    {contract.difunto.profesion && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">{t('contracts.deceasedProfession')}</p>
                        <p className="mt-1 text-base">{contract.difunto.profesion}</p>
                      </div>
                    )}

                    {contract.difunto.estado_civil && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">{t('contracts.deceasedMaritalStatus')}</p>
                        <p className="mt-1 text-base">{contract.difunto.estado_civil}</p>
                      </div>
                    )}

                    {contract.difunto.religion && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">{t('contracts.deceasedReligion')}</p>
                        <p className="mt-1 text-base">{contract.difunto.religion}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Services */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  {t('contracts.services')}
                </CardTitle>
                <CardDescription>{t('contracts.includedServices')}</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('contracts.service')}</TableHead>
                      <TableHead className="text-center">{t('common.quantity')}</TableHead>
                      <TableHead className="text-right">{t('contracts.unitPrice')}</TableHead>
                      <TableHead className="text-right">{t('contracts.subtotal')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contract.servicios.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.servicio.nombre}</p>
                            {item.servicio.descripcion && (
                              <p className="text-sm text-gray-500">{item.servicio.descripcion}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{item.cantidad}</TableCell>
                        <TableCell className="text-right">{formatearMoneda(item.precio_unitario)}</TableCell>
                        <TableCell className="text-right font-semibold">{formatearMoneda(item.subtotal)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Products */}
            {contract.productos && contract.productos.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    {t('inventory.products')}
                  </CardTitle>
                  <CardDescription>{t('contracts.includedProducts')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('common.product')}</TableHead>
                        <TableHead className="text-center">{t('common.quantity')}</TableHead>
                        <TableHead className="text-right">{t('contracts.unitPrice')}</TableHead>
                        <TableHead className="text-right">{t('contracts.subtotal')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contract.productos.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{item.producto.nombre}</p>
                              {item.producto.descripcion && (
                                <p className="text-sm text-gray-500">{item.producto.descripcion}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">{item.cantidad}</TableCell>
                          <TableCell className="text-right">{formatearMoneda(item.precio_unitario)}</TableCell>
                          <TableCell className="text-right font-semibold">{formatearMoneda(item.subtotal)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {/* Service Details */}
            {(contract.ubicacion_servicio || contract.fecha_hora_servicio || contract.solicitudes_especiales) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    {t('contracts.serviceDetails')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {contract.ubicacion_servicio && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {t('contracts.serviceLocation')}
                      </p>
                      <p className="mt-1 text-base">{contract.ubicacion_servicio}</p>
                    </div>
                  )}

                  {contract.fecha_hora_servicio && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {t('contracts.serviceDatetime')}
                      </p>
                      <p className="mt-1 text-base">{formatearFechaHora(contract.fecha_hora_servicio)}</p>
                    </div>
                  )}

                  {contract.solicitudes_especiales && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        {t('contracts.specialRequests')}
                      </p>
                      <p className="mt-1 text-base">{contract.solicitudes_especiales}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Additional Service Details */}
            {(contract.ubicacion_recepcion || contract.modelo_ataud || contract.sector_cementerio || contract.detalles_cortejo || contract.notas_personal_adicional) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    {t('contracts.additionalDetails')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {contract.ubicacion_recepcion && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {t('contracts.receptionLocation')}
                      </p>
                      <p className="mt-1 text-base">{contract.ubicacion_recepcion}</p>
                    </div>
                  )}

                  {contract.modelo_ataud && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">{t('contracts.coffinModel')}</p>
                      <p className="mt-1 text-base">{contract.modelo_ataud}</p>
                    </div>
                  )}

                  {contract.sector_cementerio && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">{t('contracts.cemeterySector')}</p>
                      <p className="mt-1 text-base">{contract.sector_cementerio}</p>
                    </div>
                  )}

                  {contract.detalles_cortejo && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">{t('contracts.processionDetails')}</p>
                      <p className="mt-1 text-base">{contract.detalles_cortejo}</p>
                    </div>
                  )}

                  {contract.notas_personal_adicional && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        {t('contracts.additionalStaffNotes')}
                      </p>
                      <p className="mt-1 text-base">{contract.notas_personal_adicional}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Staff Assignments */}
            {(contract.conductor_asignado || contract.auxiliar_asignado || contract.vehiculo_asignado) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5" />
                    {t('contracts.assignedStaff')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {contract.conductor_asignado && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">{t('contracts.assignedDriver')}</p>
                        <p className="mt-1 text-base font-semibold">{contract.conductor_asignado.nombre}</p>
                        <p className="text-sm text-gray-500">{contract.conductor_asignado.email}</p>
                      </div>
                    )}

                    {contract.auxiliar_asignado && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">{t('contracts.assignedAssistant')}</p>
                        <p className="mt-1 text-base font-semibold">{contract.auxiliar_asignado.nombre}</p>
                        <p className="text-sm text-gray-500">{contract.auxiliar_asignado.email}</p>
                      </div>
                    )}

                    {contract.vehiculo_asignado && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">{t('contracts.assignedVehicle')}</p>
                        <p className="mt-1 text-base font-semibold">{contract.vehiculo_asignado.nombre}</p>
                        <p className="text-sm text-gray-500">{contract.vehiculo_asignado.email}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
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

                  {contract.convenio && contract.convenio.empresa_paga_porcentaje > 0 && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {t('contracts.insuranceCoverage')} ({contract.convenio.empresa_paga_porcentaje}%):
                        </span>
                        <span className="font-medium text-blue-600">
                          -{formatearMoneda((contract.subtotal * contract.convenio.empresa_paga_porcentaje) / 100)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm border-t pt-1">
                        <span className="text-gray-600">{t('contracts.amountAfterInsurance')}:</span>
                        <span className="font-medium">
                          {formatearMoneda(contract.subtotal - (contract.subtotal * contract.convenio.empresa_paga_porcentaje) / 100)}
                        </span>
                      </div>
                    </>
                  )}

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
                    <span className="text-lg font-semibold">{t('contracts.totalClientPays')}:</span>
                    <span className="text-lg font-bold text-primary">
                      {formatearMoneda(contract.total)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  {t('contracts.paymentMethod')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">{t('contracts.method')}</p>
                  <p className="mt-1 text-base font-semibold">
                    {contract.metodo_pago === 'cash' ? t('contracts.cash') : t('contracts.credit')}
                  </p>
                </div>

                {contract.metodo_pago === 'credit' && (
                  <>
                    <div>
                      <p className="text-sm font-medium text-gray-500">{t('contracts.installments')}</p>
                      <p className="mt-1 text-base">{contract.cuotas} {t('contracts.months')}</p>
                    </div>

                    {contract.pie && contract.pie > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">{t('contracts.downPayment')}</p>
                        <p className="mt-1 text-base font-semibold">{formatearMoneda(contract.pie || 0)}</p>
                      </div>
                    )}

                    <div>
                      <p className="text-sm font-medium text-gray-500">{t('contracts.monthlyPayment')}</p>
                      <p className="mt-1 text-base font-semibold">
                        {formatearMoneda((contract.total - (contract.pie || 0)) / (contract.cuotas || 1))}
                      </p>
                    </div>
                  </>
                )}
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
                      {formatearMoneda(contract.monto_comision || 0)}
                    </span>
                  </div>

                  {contract.secretaria && (
                    <div className="pt-2 border-t">
                      <p className="text-xs text-gray-500">{t('contracts.createdBy')}</p>
                      <p className="text-sm font-medium">{contract.secretaria.nombre}</p>
                    </div>
                  )}
                </div>
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
