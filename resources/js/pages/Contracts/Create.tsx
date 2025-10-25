import { Head, useForm, router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
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

interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  min_stock: number;
  is_active: boolean;
}

interface Staff {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface CreateProps {
  services: Service[];
  products: Product[];
  drivers: Staff[];
  assistants: Staff[];
}

interface ServiceItem {
  service_id: number;
  quantity: number;
  unit_price: number;
}

interface ProductItem {
  product_id: number;
  quantity: number;
  unit_price: number;
}

export default function Create({ services, products = [], drivers = [], assistants = [] }: CreateProps) {
  const { t } = useTranslation();
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
    deceased_death_time: '',
    deceased_death_place: '',
    deceased_age: '',
    deceased_cause_of_death: '',

    // Services and products
    services: [] as ServiceItem[],
    products: [] as ProductItem[],
    discount_percentage: 0,

    // Payment
    payment_method: 'cash' as string,
    installments: 1,
    down_payment: 0,

    // Service details
    service_location: '',
    service_datetime: '',
    special_requests: '',

    // Staff assignment
    assigned_driver_id: null as number | null,
    assigned_assistant_id: null as number | null,
  });

  const [rutError, setRutError] = useState('');
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [productQuantity, setProductQuantity] = useState(1);

  const handleRutChange = (value: string) => {
    setData('client_rut', value);

    // Validate RUT on blur
    if (value && !validarRut(value)) {
      setRutError(t('validation.invalidRut'));
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

  const handleAddProduct = () => {
    if (!selectedProduct) return;

    const product = products.find(p => p.id === selectedProduct);
    if (!product) return;

    // Check stock
    if (product.stock < productQuantity) {
      alert(t('contracts.insufficientStock'));
      return;
    }

    const existingIndex = data.products.findIndex(p => p.product_id === selectedProduct);

    if (existingIndex >= 0) {
      const updatedProducts = [...data.products];
      const newQuantity = updatedProducts[existingIndex].quantity + productQuantity;

      if (product.stock < newQuantity) {
        alert(t('contracts.insufficientStock'));
        return;
      }

      updatedProducts[existingIndex].quantity = newQuantity;
      setData('products', updatedProducts);
    } else {
      setData('products', [
        ...data.products,
        {
          product_id: selectedProduct,
          quantity: productQuantity,
          unit_price: product.price,
        },
      ]);
    }

    setSelectedProduct(null);
    setProductQuantity(1);
  };

  const handleRemoveProduct = (productId: number) => {
    setData('products', data.products.filter(p => p.product_id !== productId));
  };

  const getServiceDetails = (serviceId: number) => {
    return services.find(s => s.id === serviceId);
  };

  const getProductDetails = (productId: number) => {
    return products.find(p => p.id === productId);
  };

  const calculateServiceSubtotal = (item: ServiceItem) => {
    return item.quantity * item.unit_price;
  };

  const calculateProductSubtotal = (item: ProductItem) => {
    return item.quantity * item.unit_price;
  };

  // Calculate totals including products
  const servicesSubtotal = data.services.reduce((sum, item) => sum + calculateServiceSubtotal(item), 0);
  const productsSubtotal = data.products.reduce((sum, item) => sum + calculateProductSubtotal(item), 0);
  const subtotal = servicesSubtotal + productsSubtotal;
  const discountAmount = (subtotal * data.discount_percentage) / 100;
  const total = subtotal - discountAmount;

  const totals = {
    subtotal,
    descuentoMonto: discountAmount,
    total,
  };

  // Calculate commission
  const calculateCommission = () => {
    let commissionRate = 5; // Base 5%
    if (data.is_night_shift) commissionRate += 2;
    if (data.is_holiday) commissionRate += 3;
    const commissionAmount = (total * commissionRate) / 100;
    return { commissionRate, commissionAmount };
  };

  const commission = calculateCommission();

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
              <h1 className="text-3xl font-bold text-gray-900">{t('contracts.create')}</h1>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              {t('contracts.complete')}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contract Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>{t('contracts.contractInfo')}</CardTitle>
              <CardDescription>{t('contracts.basicInfo')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">{t('contracts.type')}</Label>
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
                          {t(option.labelKey)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.type && <p className="text-sm text-destructive">{errors.type}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">{t('contracts.status')}</Label>
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
                          {t(option.labelKey)}
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
                    {t('contracts.holiday')}
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_night_shift"
                    checked={data.is_night_shift}
                    onCheckedChange={(checked) => setData('is_night_shift', checked as boolean)}
                  />
                  <Label htmlFor="is_night_shift" className="font-normal cursor-pointer">
                    {t('contracts.nightShift')}
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Client Information */}
          <Card>
            <CardHeader>
              <CardTitle>{t('contracts.clientInfo')}</CardTitle>
              <CardDescription>{t('contracts.clientData')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client_name">{t('contracts.clientNameRequired')}</Label>
                  <Input
                    id="client_name"
                    value={data.client_name}
                    onChange={(e) => setData('client_name', e.target.value)}
                    placeholder={t('contracts.clientNamePlaceholder')}
                    required
                  />
                  {errors.client_name && <p className="text-sm text-destructive">{errors.client_name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client_rut">{t('contracts.clientRutRequired')}</Label>
                  <Input
                    id="client_rut"
                    value={data.client_rut}
                    onChange={(e) => handleRutChange(e.target.value)}
                    onBlur={handleRutBlur}
                    placeholder={t('contracts.clientRutPlaceholder')}
                    required
                  />
                  {(rutError || errors.client_rut) && (
                    <p className="text-sm text-destructive">{rutError || errors.client_rut}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client_phone">{t('contracts.clientPhoneRequired')}</Label>
                  <Input
                    id="client_phone"
                    type="tel"
                    value={data.client_phone}
                    onChange={(e) => setData('client_phone', e.target.value)}
                    placeholder={t('contracts.clientPhonePlaceholder')}
                    required
                  />
                  {errors.client_phone && <p className="text-sm text-destructive">{errors.client_phone}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client_email">{t('contracts.clientEmail')}</Label>
                  <Input
                    id="client_email"
                    type="email"
                    value={data.client_email}
                    onChange={(e) => setData('client_email', e.target.value)}
                    placeholder={t('contracts.clientEmailPlaceholder')}
                  />
                  {errors.client_email && <p className="text-sm text-destructive">{errors.client_email}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="client_address">{t('contracts.clientAddress')}</Label>
                <Input
                  id="client_address"
                  value={data.client_address}
                  onChange={(e) => setData('client_address', e.target.value)}
                  placeholder={t('contracts.clientAddressPlaceholder')}
                />
                {errors.client_address && <p className="text-sm text-destructive">{errors.client_address}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Deceased Information - Only for immediate need */}
          {data.type === 'necesidad_inmediata' && (
            <Card>
              <CardHeader>
                <CardTitle>{t('contracts.deceasedInfo')}</CardTitle>
                <CardDescription>{t('contracts.deceasedData')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="deceased_name">{t('contracts.deceasedNameRequired')}</Label>
                    <Input
                      id="deceased_name"
                      value={data.deceased_name}
                      onChange={(e) => setData('deceased_name', e.target.value)}
                      placeholder={t('contracts.deceasedNamePlaceholder')}
                      required={data.type === 'necesidad_inmediata'}
                    />
                    {errors.deceased_name && <p className="text-sm text-destructive">{errors.deceased_name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deceased_age">Age</Label>
                    <Input
                      id="deceased_age"
                      type="number"
                      value={data.deceased_age}
                      onChange={(e) => setData('deceased_age', e.target.value)}
                      placeholder="Age at death"
                    />
                    {errors.deceased_age && <p className="text-sm text-destructive">{errors.deceased_age}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deceased_death_date">{t('contracts.deceasedDeathDateRequired')}</Label>
                    <Input
                      id="deceased_death_date"
                      type="date"
                      value={data.deceased_death_date}
                      onChange={(e) => setData('deceased_death_date', e.target.value)}
                      required={data.type === 'necesidad_inmediata'}
                    />
                    {errors.deceased_death_date && <p className="text-sm text-destructive">{errors.deceased_death_date}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deceased_death_time">Time of Death</Label>
                    <Input
                      id="deceased_death_time"
                      type="time"
                      value={data.deceased_death_time}
                      onChange={(e) => setData('deceased_death_time', e.target.value)}
                    />
                    {errors.deceased_death_time && <p className="text-sm text-destructive">{errors.deceased_death_time}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deceased_death_place">{t('contracts.deceasedDeathPlace')}</Label>
                    <Input
                      id="deceased_death_place"
                      value={data.deceased_death_place}
                      onChange={(e) => setData('deceased_death_place', e.target.value)}
                      placeholder={t('contracts.deceasedDeathPlacePlaceholder')}
                    />
                    {errors.deceased_death_place && <p className="text-sm text-destructive">{errors.deceased_death_place}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deceased_cause_of_death">Cause of Death (optional)</Label>
                    <Input
                      id="deceased_cause_of_death"
                      value={data.deceased_cause_of_death}
                      onChange={(e) => setData('deceased_cause_of_death', e.target.value)}
                      placeholder="Optional cause of death"
                    />
                    {errors.deceased_cause_of_death && <p className="text-sm text-destructive">{errors.deceased_cause_of_death}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Services */}
          <Card>
            <CardHeader>
              <CardTitle>{t('contracts.services')}</CardTitle>
              <CardDescription>{t('contracts.servicesDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add Service */}
              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="service">{t('contracts.service')}</Label>
                  <Select
                    value={selectedService?.toString()}
                    onValueChange={(value) => setSelectedService(parseInt(value))}
                  >
                    <SelectTrigger id="service">
                      <SelectValue placeholder={t('contracts.selectServicePlaceholder')} />
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
                  <Label htmlFor="quantity">{t('common.quantity')}</Label>
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
                    {t('common.add')}
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
                          <th className="px-4 py-2 text-left text-sm font-medium">{t('contracts.service')}</th>
                          <th className="px-4 py-2 text-right text-sm font-medium">{t('common.quantity')}</th>
                          <th className="px-4 py-2 text-right text-sm font-medium">{t('contracts.unitPrice')}</th>
                          <th className="px-4 py-2 text-right text-sm font-medium">{t('contracts.subtotal')}</th>
                          <th className="px-4 py-2 text-right text-sm font-medium">{t('common.action')}</th>
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

          {/* Products */}
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <CardDescription>Select coffins, urns, flowers, and memorial items</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add Product */}
              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="product">Product</Label>
                  <Select
                    value={selectedProduct?.toString()}
                    onValueChange={(value) => setSelectedProduct(parseInt(value))}
                  >
                    <SelectTrigger id="product">
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {products.map((product) => {
                        const isLowStock = product.stock <= product.min_stock;
                        const isOutOfStock = product.stock <= 0;

                        return (
                          <SelectItem
                            key={product.id}
                            value={product.id.toString()}
                            disabled={isOutOfStock}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span>{product.name} - {formatearMoneda(product.price)}</span>
                              {isOutOfStock ? (
                                <span className="ml-2 text-xs text-red-600 font-semibold">Out of Stock</span>
                              ) : isLowStock ? (
                                <span className="ml-2 text-xs text-yellow-600 font-semibold">Low Stock ({product.stock})</span>
                              ) : (
                                <span className="ml-2 text-xs text-gray-500">Stock: {product.stock}</span>
                              )}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-32 space-y-2">
                  <Label htmlFor="product_quantity">Quantity</Label>
                  <Input
                    id="product_quantity"
                    type="number"
                    min="1"
                    value={productQuantity}
                    onChange={(e) => setProductQuantity(parseInt(e.target.value) || 1)}
                  />
                </div>

                <div className="flex items-end">
                  <Button
                    type="button"
                    onClick={handleAddProduct}
                    disabled={!selectedProduct}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    {t('common.add')}
                  </Button>
                </div>
              </div>

              {/* Products List */}
              {data.products.length > 0 && (
                <div className="mt-4 space-y-2">
                  <div className="rounded-lg border">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium">Product</th>
                          <th className="px-4 py-2 text-right text-sm font-medium">{t('common.quantity')}</th>
                          <th className="px-4 py-2 text-right text-sm font-medium">{t('contracts.unitPrice')}</th>
                          <th className="px-4 py-2 text-right text-sm font-medium">{t('contracts.subtotal')}</th>
                          <th className="px-4 py-2 text-right text-sm font-medium">{t('common.action')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.products.map((item) => {
                          const product = getProductDetails(item.product_id);
                          const subtotal = calculateProductSubtotal(item);

                          return (
                            <tr key={item.product_id} className="border-t">
                              <td className="px-4 py-2 text-sm">
                                {product?.name}
                                <span className="ml-2 text-xs text-gray-500">({product?.category})</span>
                              </td>
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
                                  onClick={() => handleRemoveProduct(item.product_id)}
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

              {errors.products && <p className="text-sm text-destructive">{errors.products}</p>}
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>Select how the client will pay</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Payment Type</Label>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="payment_cash"
                      name="payment_method"
                      value="cash"
                      checked={data.payment_method === 'cash'}
                      onChange={(e) => setData('payment_method', e.target.value)}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="payment_cash" className="font-normal cursor-pointer">
                      Cash (Full Payment)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="payment_credit"
                      name="payment_method"
                      value="credit"
                      checked={data.payment_method === 'credit'}
                      onChange={(e) => setData('payment_method', e.target.value)}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="payment_credit" className="font-normal cursor-pointer">
                      Credit (Installments)
                    </Label>
                  </div>
                </div>
              </div>

              {data.payment_method === 'credit' && (
                <div className="grid grid-cols-2 gap-4 border-t pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="installments">Number of Installments</Label>
                    <Select
                      value={data.installments.toString()}
                      onValueChange={(value) => setData('installments', parseInt(value))}
                    >
                      <SelectTrigger id="installments">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        {[1, 3, 6, 9, 12].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? 'month' : 'months'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="down_payment">Down Payment (Optional)</Label>
                    <Input
                      id="down_payment"
                      type="number"
                      min="0"
                      max={total}
                      value={data.down_payment}
                      onChange={(e) => setData('down_payment', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>

                  <div className="col-span-2 bg-blue-50 p-4 rounded-lg">
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Total Contract:</span>
                        <span className="font-semibold">{formatearMoneda(total)}</span>
                      </div>
                      {data.down_payment > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>Down Payment:</span>
                          <span className="font-semibold">-{formatearMoneda(data.down_payment)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm border-t pt-1">
                        <span>Remaining:</span>
                        <span className="font-semibold">{formatearMoneda(total - data.down_payment)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold text-blue-700 border-t pt-2">
                        <span>Monthly Payment:</span>
                        <span>{formatearMoneda((total - data.down_payment) / data.installments)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Service Details */}
          <Card>
            <CardHeader>
              <CardTitle>Service Details</CardTitle>
              <CardDescription>Location, date, and special requests</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="service_location">Service Location</Label>
                  <Input
                    id="service_location"
                    value={data.service_location}
                    onChange={(e) => setData('service_location', e.target.value)}
                    placeholder="e.g., Chapel, Cemetery name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service_datetime">Service Date & Time</Label>
                  <Input
                    id="service_datetime"
                    type="datetime-local"
                    value={data.service_datetime}
                    onChange={(e) => setData('service_datetime', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="special_requests">Special Requests</Label>
                <textarea
                  id="special_requests"
                  value={data.special_requests}
                  onChange={(e) => setData('special_requests', e.target.value)}
                  placeholder="Any special requests or notes for the service"
                  className="w-full min-h-[100px] px-3 py-2 text-sm border rounded-md"
                />
              </div>
            </CardContent>
          </Card>

          {/* Staff Assignment - Only for immediate need */}
          {data.type === 'necesidad_inmediata' && (
            <Card>
              <CardHeader>
                <CardTitle>Staff Assignment</CardTitle>
                <CardDescription>Assign driver and assistant for this service</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="assigned_driver">Driver (Optional)</Label>
                    <Select
                      value={data.assigned_driver_id?.toString() || 'none'}
                      onValueChange={(value) => setData('assigned_driver_id', value === 'none' ? null : parseInt(value))}
                    >
                      <SelectTrigger id="assigned_driver">
                        <SelectValue placeholder="No driver assigned" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="none">No driver assigned</SelectItem>
                        {drivers.map((driver) => (
                          <SelectItem key={driver.id} value={driver.id.toString()}>
                            {driver.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="assigned_assistant">Assistant (Optional)</Label>
                    <Select
                      value={data.assigned_assistant_id?.toString() || 'none'}
                      onValueChange={(value) => setData('assigned_assistant_id', value === 'none' ? null : parseInt(value))}
                    >
                      <SelectTrigger id="assigned_assistant">
                        <SelectValue placeholder="No assistant assigned" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="none">No assistant assigned</SelectItem>
                        {assistants.map((assistant) => (
                          <SelectItem key={assistant.id} value={assistant.id.toString()}>
                            {assistant.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Totals */}
          <Card>
            <CardHeader>
              <CardTitle>{t('contracts.totals')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="discount_percentage">{t('contracts.discount')}</Label>
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
                  <span className="text-gray-600">{t('common.subtotal')}:</span>
                  <span className="font-medium">{formatearMoneda(totals.subtotal)}</span>
                </div>

                {totals.descuentoMonto > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {t('contracts.discountAmount', { percent: data.discount_percentage })}:
                    </span>
                    <span className="font-medium text-destructive">
                      -{formatearMoneda(totals.descuentoMonto)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between border-t pt-2">
                  <span className="text-lg font-semibold">{t('common.total')}:</span>
                  <span className="text-lg font-bold text-primary">
                    {formatearMoneda(totals.total)}
                  </span>
                </div>
              </div>

              {/* Commission Preview */}
              <div className="border-t pt-4 bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-3">Commission Preview</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-green-800">Base Commission Rate:</span>
                    <span className="font-medium">5%</span>
                  </div>
                  {data.is_night_shift && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-800">Night Shift Bonus:</span>
                      <span className="font-medium text-green-700">+2%</span>
                    </div>
                  )}
                  {data.is_holiday && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-800">Holiday Bonus:</span>
                      <span className="font-medium text-green-700">+3%</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-green-200 pt-2">
                    <span className="font-bold text-green-900">Total Commission Rate:</span>
                    <span className="font-bold text-green-700">{commission.commissionRate}%</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span className="font-bold text-green-900">Commission Amount:</span>
                    <span className="font-bold text-green-600">
                      {formatearMoneda(commission.commissionAmount)}
                    </span>
                  </div>
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
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={processing || rutError !== '' || data.services.length === 0}>
              {processing ? t('common.saving') : t('contracts.create')}
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
