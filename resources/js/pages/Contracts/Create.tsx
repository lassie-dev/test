import { Head, useForm, router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import {
  TIPOS_CONTRATO_OPTIONS,
  ESTADOS_CONTRATO_OPTIONS,
  PORCENTAJES_DESCUENTO,
} from '@/features/contracts/constants';
import {
  calcularTotalesContrato,
  validarRut,
  formatearRut,
  formatearMoneda,
} from '@/features/contracts/functions';
import type { Servicio } from '@/features/contracts/types';

interface Service extends Servicio {}

interface CreateProps {
  services: Service[];
}

interface ServiceItem {
  service_id: number;
  quantity: number;
  unit_price: number;
}

export default function Create({ services }: CreateProps) {
  const { data, setData, post, processing, errors } = useForm({
    // Contract basic info
    type: 'necesidad_inmediata' as string,
    status: 'cotizacion' as string,
    is_holiday: false,
    is_night_shift: false,

    // Client info
    client_name: '',
    client_rut: '',
    client_phone: '',
    client_email: '',
    client_address: '',

    // Deceased info (only for immediate need)
    deceased_name: '',
    deceased_death_date: '',
    deceased_death_place: '',

    // Services
    services: [] as ServiceItem[],
    discount_percentage: 0,
  });

  const [rutError, setRutError] = useState('');
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);

  const handleRutChange = (value: string) => {
    setData('client_rut', value);

    // Validate RUT on blur
    if (value && !validarRut(value)) {
      setRutError('RUT inválido');
    } else {
      setRutError('');
    }
  };

  const handleRutBlur = () => {
    if (data.client_rut) {
      const formattedRut = formatearRut(data.client_rut);
      setData('client_rut', formattedRut);
    }
  };

  const handleAddService = () => {
    if (!selectedService) return;

    const service = services.find(s => s.id === selectedService);
    if (!service) return;

    const existingIndex = data.services.findIndex(s => s.service_id === selectedService);

    if (existingIndex >= 0) {
      // Update existing service quantity
      const updatedServices = [...data.services];
      updatedServices[existingIndex].quantity += quantity;
      setData('services', updatedServices);
    } else {
      // Add new service
      setData('services', [
        ...data.services,
        {
          service_id: selectedService,
          quantity,
          unit_price: service.precio,
        },
      ]);
    }

    setSelectedService(null);
    setQuantity(1);
  };

  const handleRemoveService = (serviceId: number) => {
    setData('services', data.services.filter(s => s.service_id !== serviceId));
  };

  const getServiceDetails = (serviceId: number) => {
    return services.find(s => s.id === serviceId);
  };

  const calculateServiceSubtotal = (item: ServiceItem) => {
    return item.quantity * item.unit_price;
  };

  const totals = calcularTotalesContrato(
    data.services.map(item => ({
      servicio: getServiceDetails(item.service_id)!,
      cantidad: item.quantity,
      precio_unitario: item.unit_price,
      subtotal: calculateServiceSubtotal(item),
    })),
    data.discount_percentage
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (rutError) {
      return;
    }

    post('/contracts', {
      onSuccess: () => {
        router.visit('/contracts');
      },
    });
  };

  const handleCancel = () => {
    router.visit('/contracts');
  };

  return (
    <MainLayout>
      <Head/>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCancel}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-3xl font-bold text-gray-900">Crear Contrato</h1>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Complete la información para crear un nuevo contrato funerario
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contract Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Información del Contrato</CardTitle>
              <CardDescription>Datos básicos del contrato</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo de Contrato</Label>
                  <Select
                    value={data.type}
                    onValueChange={(value) => setData('type', value)}
                  >
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {TIPOS_CONTRATO_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.type && <p className="text-sm text-destructive">{errors.type}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Estado</Label>
                  <Select
                    value={data.status}
                    onValueChange={(value) => setData('status', value)}
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {ESTADOS_CONTRATO_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.status && <p className="text-sm text-destructive">{errors.status}</p>}
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_holiday"
                    checked={data.is_holiday}
                    onCheckedChange={(checked) => setData('is_holiday', checked as boolean)}
                  />
                  <Label htmlFor="is_holiday" className="font-normal cursor-pointer">
                    Día Festivo (+3% comisión)
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_night_shift"
                    checked={data.is_night_shift}
                    onCheckedChange={(checked) => setData('is_night_shift', checked as boolean)}
                  />
                  <Label htmlFor="is_night_shift" className="font-normal cursor-pointer">
                    Turno Nocturno (+2% comisión)
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Client Information */}
          <Card>
            <CardHeader>
              <CardTitle>Información del Cliente</CardTitle>
              <CardDescription>Datos del cliente contratante</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client_name">Nombre Completo *</Label>
                  <Input
                    id="client_name"
                    value={data.client_name}
                    onChange={(e) => setData('client_name', e.target.value)}
                    placeholder="Juan Pérez González"
                    required
                  />
                  {errors.client_name && <p className="text-sm text-destructive">{errors.client_name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client_rut">RUT *</Label>
                  <Input
                    id="client_rut"
                    value={data.client_rut}
                    onChange={(e) => handleRutChange(e.target.value)}
                    onBlur={handleRutBlur}
                    placeholder="12.345.678-9"
                    required
                  />
                  {(rutError || errors.client_rut) && (
                    <p className="text-sm text-destructive">{rutError || errors.client_rut}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client_phone">Teléfono *</Label>
                  <Input
                    id="client_phone"
                    type="tel"
                    value={data.client_phone}
                    onChange={(e) => setData('client_phone', e.target.value)}
                    placeholder="+56 9 1234 5678"
                    required
                  />
                  {errors.client_phone && <p className="text-sm text-destructive">{errors.client_phone}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client_email">Email</Label>
                  <Input
                    id="client_email"
                    type="email"
                    value={data.client_email}
                    onChange={(e) => setData('client_email', e.target.value)}
                    placeholder="cliente@ejemplo.com"
                  />
                  {errors.client_email && <p className="text-sm text-destructive">{errors.client_email}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="client_address">Dirección</Label>
                <Input
                  id="client_address"
                  value={data.client_address}
                  onChange={(e) => setData('client_address', e.target.value)}
                  placeholder="Calle Principal 123, Ciudad"
                />
                {errors.client_address && <p className="text-sm text-destructive">{errors.client_address}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Deceased Information - Only for immediate need */}
          {data.type === 'necesidad_inmediata' && (
            <Card>
              <CardHeader>
                <CardTitle>Información del Difunto</CardTitle>
                <CardDescription>Datos del fallecido</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="deceased_name">Nombre Completo *</Label>
                    <Input
                      id="deceased_name"
                      value={data.deceased_name}
                      onChange={(e) => setData('deceased_name', e.target.value)}
                      placeholder="María González López"
                      required={data.type === 'necesidad_inmediata'}
                    />
                    {errors.deceased_name && <p className="text-sm text-destructive">{errors.deceased_name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deceased_death_date">Fecha de Fallecimiento *</Label>
                    <Input
                      id="deceased_death_date"
                      type="date"
                      value={data.deceased_death_date}
                      onChange={(e) => setData('deceased_death_date', e.target.value)}
                      required={data.type === 'necesidad_inmediata'}
                    />
                    {errors.deceased_death_date && <p className="text-sm text-destructive">{errors.deceased_death_date}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deceased_death_place">Lugar de Fallecimiento</Label>
                  <Input
                    id="deceased_death_place"
                    value={data.deceased_death_place}
                    onChange={(e) => setData('deceased_death_place', e.target.value)}
                    placeholder="Hospital Regional, Ciudad"
                  />
                  {errors.deceased_death_place && <p className="text-sm text-destructive">{errors.deceased_death_place}</p>}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Services */}
          <Card>
            <CardHeader>
              <CardTitle>Servicios</CardTitle>
              <CardDescription>Agregue los servicios incluidos en el contrato</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add Service */}
              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="service">Servicio</Label>
                  <Select
                    value={selectedService?.toString()}
                    onValueChange={(value) => setSelectedService(parseInt(value))}
                  >
                    <SelectTrigger id="service">
                      <SelectValue placeholder="Seleccionar servicio" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id.toString()}>
                          {service.nombre} - {formatearMoneda(service.precio)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-32 space-y-2">
                  <Label htmlFor="quantity">Cantidad</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  />
                </div>

                <div className="flex items-end">
                  <Button
                    type="button"
                    onClick={handleAddService}
                    disabled={!selectedService}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Agregar
                  </Button>
                </div>
              </div>

              {/* Services List */}
              {data.services.length > 0 && (
                <div className="mt-4 space-y-2">
                  <div className="rounded-lg border">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium">Servicio</th>
                          <th className="px-4 py-2 text-right text-sm font-medium">Cantidad</th>
                          <th className="px-4 py-2 text-right text-sm font-medium">Precio Unit.</th>
                          <th className="px-4 py-2 text-right text-sm font-medium">Subtotal</th>
                          <th className="px-4 py-2 text-right text-sm font-medium">Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.services.map((item) => {
                          const service = getServiceDetails(item.service_id);
                          const subtotal = calculateServiceSubtotal(item);

                          return (
                            <tr key={item.service_id} className="border-t">
                              <td className="px-4 py-2 text-sm">{service?.nombre}</td>
                              <td className="px-4 py-2 text-right text-sm">{item.quantity}</td>
                              <td className="px-4 py-2 text-right text-sm">
                                {formatearMoneda(item.unit_price)}
                              </td>
                              <td className="px-4 py-2 text-right text-sm font-medium">
                                {formatearMoneda(subtotal)}
                              </td>
                              <td className="px-4 py-2 text-right">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRemoveService(item.service_id)}
                                  className="h-8 w-8 text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {errors.services && <p className="text-sm text-destructive">{errors.services}</p>}
            </CardContent>
          </Card>

          {/* Totals */}
          <Card>
            <CardHeader>
              <CardTitle>Totales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="discount_percentage">Descuento</Label>
                <Select
                  value={data.discount_percentage.toString()}
                  onValueChange={(value) => setData('discount_percentage', parseInt(value))}
                >
                  <SelectTrigger id="discount_percentage">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {PORCENTAJES_DESCUENTO.map((percent) => (
                      <SelectItem key={percent} value={percent.toString()}>
                        {percent}%
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">{formatearMoneda(totals.subtotal)}</span>
                </div>

                {totals.descuentoMonto > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Descuento ({data.discount_percentage}%):
                    </span>
                    <span className="font-medium text-destructive">
                      -{formatearMoneda(totals.descuentoMonto)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between border-t pt-2">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-lg font-bold text-primary">
                    {formatearMoneda(totals.total)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={processing}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={processing || rutError !== '' || data.services.length === 0}>
              {processing ? 'Guardando...' : 'Crear Contrato'}
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
