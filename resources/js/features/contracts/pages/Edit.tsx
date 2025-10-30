import { Head, useForm, router, usePage } from '@inertiajs/react';
import { FormEvent, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import MainLayout from '@/components/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import {
  validarRut,
  formatearRut,
  calculateItemsTotals,
  calculateCommission,
} from '@/features/contracts/functions';
import type {
  Servicio,
  Product,
  Staff,
  ServiceItem,
  ProductItem,
  Contrato,
} from '@/features/contracts/types';

// Import components
import ContractBasicInfoCard from '@/features/contracts/components/ContractBasicInfoCard';
import ClientInformationCard from '@/features/contracts/components/ClientInformationCard';
import DeceasedInformationCard from '@/features/contracts/components/DeceasedInformationCard';
import ServiceSelectionCard from '@/features/contracts/components/ServiceSelectionCard';
import ProductSelectionCard from '@/features/contracts/components/ProductSelectionCard';
import PaymentConfigurationCard from '@/features/contracts/components/PaymentConfigurationCard';
import ServiceDetailsCard from '@/features/contracts/components/ServiceDetailsCard';
import ServiceDetailsExtendedCard from '@/features/contracts/components/ServiceDetailsExtendedCard';
import StaffAssignmentCard from '@/features/contracts/components/StaffAssignmentCard';
import TotalsAndCommissionCard from '@/features/contracts/components/TotalsAndCommissionCard';
import AgreementSelectionCard from '@/features/contracts/components/AgreementSelectionCard';
import DirectorySelectionCard from '@/features/contracts/components/DirectorySelectionCard';

interface Agreement {
  id: number;
  company_name: string;
  code: string;
  discount_percentage: number;
  company_pays_percentage: number;
  employee_pays_percentage: number;
}

interface Church {
  id: number;
  name: string;
  city: string;
  religion: string;
}

interface Cemetery {
  id: number;
  name: string;
  city: string;
  type: string;
}

interface WakeRoom {
  id: number;
  name: string;
  funeral_home_name: string;
  city: string;
}

interface EditProps {
  contract: Contrato;
  services: Servicio[];
  products: Product[];
  drivers: Staff[];
  assistants: Staff[];
  churches: Church[];
  cemeteries: Cemetery[];
  wakeRooms: WakeRoom[];
  agreements: Agreement[];
}

export default function Edit({
  contract,
  services,
  products = [],
  drivers = [],
  assistants = [],
  churches = [],
  cemeteries = [],
  wakeRooms = [],
  agreements = [],
}: EditProps) {
  const { t } = useTranslation();
  const { flash } = usePage().props as any;

  // Pre-populate form with existing contract data
  const { data, setData, put, processing, errors } = useForm({
    // Contract basic info
    type: contract.tipo as string,
    status: contract.estado as string,
    is_holiday: contract.es_festivo || false,
    is_night_shift: contract.es_nocturno || false,

    // Client info
    client_name: contract.cliente?.nombre || '',
    client_rut: contract.cliente?.rut || '',
    client_phone: contract.cliente?.telefono || '',
    client_email: contract.cliente?.email || '',
    client_address: contract.cliente?.direccion || '',

    // Deceased info (only for immediate need)
    deceased_name: contract.difunto?.nombre || '',
    deceased_death_date: typeof contract.difunto?.fecha_fallecimiento === 'string'
      ? contract.difunto.fecha_fallecimiento
      : contract.difunto?.fecha_fallecimiento instanceof Date
        ? contract.difunto.fecha_fallecimiento.toISOString().split('T')[0]
        : '',
    deceased_death_time: contract.difunto?.hora_fallecimiento || '',
    deceased_death_place: contract.difunto?.lugar_fallecimiento || '',
    deceased_age: contract.difunto?.edad?.toString() || '',
    deceased_cause_of_death: contract.difunto?.causa_fallecimiento || '',

    // Services and products - Transform existing data to the format expected by the form
    services: (contract.servicios || []).map((item: any) => ({
      service_id: item.servicio.id,
      quantity: item.cantidad,
      unit_price: item.precio_unitario,
    })) as ServiceItem[],
    products: (contract.productos || []).map((item: any) => ({
      product_id: item.producto.id,
      quantity: item.cantidad,
      unit_price: item.precio_unitario,
    })) as ProductItem[],
    discount_percentage: contract.descuento_porcentaje || 0,

    // Payment
    payment_method: contract.metodo_pago || 'cash',
    installments: contract.cuotas || 1,
    down_payment: contract.pie || 0,

    // Service details
    service_location: contract.ubicacion_servicio || '',
    service_datetime: typeof contract.fecha_hora_servicio === 'string'
      ? contract.fecha_hora_servicio
      : contract.fecha_hora_servicio?.toISOString() || '',
    special_requests: contract.solicitudes_especiales || '',

    // Staff assignment
    assigned_driver_id: contract.conductor_asignado?.id || null,
    assigned_assistant_id: contract.auxiliar_asignado?.id || null,

    // Directory and agreement references
    agreement_id: contract.convenio?.id || null,
    church_id: contract.iglesia?.id || null,
    cemetery_id: contract.cementerio?.id || null,
    wake_room_id: contract.sala_velacion?.id || null,
  });

  const [rutError, setRutError] = useState('');
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [productQuantity, setProductQuantity] = useState(1);

  // New state variables for extended fields
  const [clientRelationshipToDeceased, setClientRelationshipToDeceased] = useState('');
  const [clientOccupation, setClientOccupation] = useState('');
  const [deceasedEducationLevel, setDeceasedEducationLevel] = useState('');
  const [deceasedProfession, setDeceasedProfession] = useState('');
  const [deceasedMaritalStatus, setDeceasedMaritalStatus] = useState('');
  const [deceasedReligion, setDeceasedReligion] = useState('');
  const [receptionLocation, setReceptionLocation] = useState('');
  const [coffinModel, setCoffinModel] = useState('');
  const [cemeterySector, setCemeterySector] = useState('');
  const [processionDetails, setProcessionDetails] = useState('');
  const [additionalStaffNotes, setAdditionalStaffNotes] = useState('');
  const [assignedVehicleId, setAssignedVehicleId] = useState<number | null>(null);

  // Initialize extended fields from contract data
  useEffect(() => {
    if (contract) {
      setClientRelationshipToDeceased(contract.cliente?.parentesco || '');
      setClientOccupation(contract.cliente?.ocupacion || '');
      setDeceasedEducationLevel(contract.difunto?.nivel_estudio || '');
      setDeceasedProfession(contract.difunto?.profesion || '');
      setDeceasedMaritalStatus(contract.difunto?.estado_civil || '');
      setDeceasedReligion(contract.difunto?.religion || '');
      setReceptionLocation(contract.ubicacion_recepcion || '');
      setCoffinModel(contract.modelo_ataud || '');
      setCemeterySector(contract.sector_cementerio || '');
      setProcessionDetails(contract.detalles_cortejo || '');
      setAdditionalStaffNotes(contract.notas_personal_adicional || '');
      setAssignedVehicleId(contract.vehiculo_asignado?.id || null);
    }
  }, [contract]);

  // Show flash messages as toasts
  useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success);
    }
    if (flash?.error) {
      toast.error(flash.error);
    }
  }, [flash]);

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
      // Service already added, don't add duplicates
      alert(t('contracts.serviceAlreadyAdded'));
      return;
    }

    // Add new service with quantity = 1
    setData('services', [
      ...data.services,
      {
        service_id: selectedService,
        quantity: 1,
        unit_price: service.precio,
      },
    ]);

    setSelectedService(null);
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
          unit_price: product.precio,
        },
      ]);
    }

    setSelectedProduct(null);
    setProductQuantity(1);
  };

  const handleRemoveProduct = (productId: number) => {
    setData('products', data.products.filter(p => p.product_id !== productId));
  };

  // Get selected agreement to access company_pays_percentage
  const selectedAgreement = agreements.find(a => a.id === data.agreement_id);
  const companyPaysPercentage = selectedAgreement?.company_pays_percentage || 0;

  // Calculate totals using extracted function (with insurance logic)
  const totals = calculateItemsTotals(
    data.services,
    data.products,
    data.discount_percentage,
    companyPaysPercentage
  );

  // Calculate commission using extracted function
  const commission = calculateCommission(totals.total, data.is_night_shift, data.is_holiday);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (rutError) {
      toast.error(t('validation.invalidRut'));
      return;
    }

    if (data.services.length === 0) {
      toast.error(t('contracts.pleaseSelectService'));
      return;
    }

    // Use PUT method for updating
    const submitData: any = {
      ...data,
      client_relationship_to_deceased: clientRelationshipToDeceased,
      client_occupation: clientOccupation,
      deceased_education_level: deceasedEducationLevel,
      deceased_profession: deceasedProfession,
      deceased_marital_status: deceasedMaritalStatus,
      deceased_religion: deceasedReligion,
      reception_location: receptionLocation,
      coffin_model: coffinModel,
      cemetery_sector: cemeterySector,
      procession_details: processionDetails,
      additional_staff_notes: additionalStaffNotes,
      assigned_vehicle_id: assignedVehicleId,
    };

    // For Future Need contracts, remove deceased fields (not required)
    if (data.type === 'necesidad_futura') {
      delete submitData.deceased_name;
      delete submitData.deceased_death_date;
      delete submitData.deceased_death_time;
      delete submitData.deceased_death_place;
      delete submitData.deceased_age;
      delete submitData.deceased_cause_of_death;
    }

    put(`/contracts/${contract.id}`, {
      onSuccess: () => {
        toast.success(t('contracts.updatedSuccessfully'));
        router.visit(`/contracts/${contract.id}`);
      },
      onError: (errors: any) => {
        // Show validation errors
        const errorMessages = Object.values(errors);
        if (errorMessages.length > 0) {
          errorMessages.forEach((error) => {
            toast.error(String(error));
          });
        } else {
          toast.error(t('contracts.updateFailed'));
        }
      },
    });
  };

  const handleCancel = () => {
    router.visit(`/contracts/${contract.id}`);
  };

  return (
    <MainLayout>
      <Head title={`${t('common.edit')} ${contract.numero_contrato}`} />

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
              <h1 className="text-3xl font-bold text-gray-900">
                {t('common.edit')} {contract.numero_contrato}
              </h1>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              {t('contracts.updateContractDetails')}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contract Basic Info */}
          <ContractBasicInfoCard
            type={data.type}
            status={data.status}
            is_holiday={data.is_holiday}
            is_night_shift={data.is_night_shift}
            onTypeChange={(value) => setData('type', value)}
            onStatusChange={(value) => setData('status', value)}
            onHolidayChange={(checked) => setData('is_holiday', checked)}
            onNightShiftChange={(checked) => setData('is_night_shift', checked)}
            errors={{ type: errors.type, status: errors.status }}
          />

          {/* Client Information */}
          <ClientInformationCard
            client_name={data.client_name}
            client_rut={data.client_rut}
            client_phone={data.client_phone}
            client_email={data.client_email}
            client_address={data.client_address}
            client_relationship_to_deceased={clientRelationshipToDeceased}
            client_occupation={clientOccupation}
            rutError={rutError}
            onNameChange={(value) => setData('client_name', value)}
            onRutChange={handleRutChange}
            onRutBlur={handleRutBlur}
            onPhoneChange={(value) => setData('client_phone', value)}
            onEmailChange={(value) => setData('client_email', value)}
            onAddressChange={(value) => setData('client_address', value)}
            onRelationshipChange={setClientRelationshipToDeceased}
            onOccupationChange={setClientOccupation}
            errors={{
              client_name: errors.client_name,
              client_rut: errors.client_rut,
              client_phone: errors.client_phone,
              client_email: errors.client_email,
              client_address: errors.client_address,
            }}
          />

          {/* Deceased Information - Only for immediate need */}
          <DeceasedInformationCard
            deceased_name={data.deceased_name}
            deceased_age={data.deceased_age}
            deceased_death_date={data.deceased_death_date}
            deceased_death_time={data.deceased_death_time}
            deceased_death_place={data.deceased_death_place}
            deceased_cause_of_death={data.deceased_cause_of_death}
            deceased_education_level={deceasedEducationLevel}
            deceased_profession={deceasedProfession}
            deceased_marital_status={deceasedMaritalStatus}
            deceased_religion={deceasedReligion}
            contractType={data.type}
            onNameChange={(value) => setData('deceased_name', value)}
            onAgeChange={(value) => setData('deceased_age', value)}
            onDeathDateChange={(value) => setData('deceased_death_date', value)}
            onDeathTimeChange={(value) => setData('deceased_death_time', value)}
            onDeathPlaceChange={(value) => setData('deceased_death_place', value)}
            onCauseOfDeathChange={(value) => setData('deceased_cause_of_death', value)}
            onEducationLevelChange={setDeceasedEducationLevel}
            onProfessionChange={setDeceasedProfession}
            onMaritalStatusChange={setDeceasedMaritalStatus}
            onReligionChange={setDeceasedReligion}
            errors={{
              deceased_name: errors.deceased_name,
              deceased_age: errors.deceased_age,
              deceased_death_date: errors.deceased_death_date,
              deceased_death_time: errors.deceased_death_time,
              deceased_death_place: errors.deceased_death_place,
              deceased_cause_of_death: errors.deceased_cause_of_death,
            }}
          />

          {/* Services */}
          <ServiceSelectionCard
            services={services}
            selectedService={selectedService}
            contractServices={data.services}
            onServiceSelect={setSelectedService}
            onAddService={handleAddService}
            onRemoveService={handleRemoveService}
            errors={{ services: errors.services }}
          />

          {/* Products */}
          <ProductSelectionCard
            products={products}
            selectedProduct={selectedProduct}
            productQuantity={productQuantity}
            contractProducts={data.products}
            onProductSelect={setSelectedProduct}
            onQuantityChange={setProductQuantity}
            onAddProduct={handleAddProduct}
            onRemoveProduct={handleRemoveProduct}
            errors={{ products: errors.products }}
          />

          {/* Payment Method */}
          <PaymentConfigurationCard
            payment_method={data.payment_method}
            installments={data.installments}
            down_payment={data.down_payment}
            total={totals.total}
            onPaymentMethodChange={(value) => setData('payment_method', value)}
            onInstallmentsChange={(value) => setData('installments', value)}
            onDownPaymentChange={(value) => setData('down_payment', value)}
            errors={{
              payment_method: errors.payment_method,
              installments: errors.installments,
              down_payment: errors.down_payment,
            }}
          />

          {/* Service Details */}
          <ServiceDetailsCard
            service_location={data.service_location}
            service_datetime={data.service_datetime}
            special_requests={data.special_requests}
            onLocationChange={(value) => setData('service_location', value)}
            onDateTimeChange={(value) => setData('service_datetime', value)}
            onSpecialRequestsChange={(value) => setData('special_requests', value)}
            errors={{
              service_location: errors.service_location,
              service_datetime: errors.service_datetime,
              special_requests: errors.special_requests,
            }}
          />

          {/* Service Details Extended */}
          <ServiceDetailsExtendedCard
            reception_location={receptionLocation}
            coffin_model={coffinModel}
            cemetery_sector={cemeterySector}
            procession_details={processionDetails}
            additional_staff_notes={additionalStaffNotes}
            onReceptionLocationChange={setReceptionLocation}
            onCoffinModelChange={setCoffinModel}
            onCemeterySectorChange={setCemeterySector}
            onProcessionDetailsChange={setProcessionDetails}
            onAdditionalStaffNotesChange={setAdditionalStaffNotes}
            errors={errors as any}
          />

          {/* Staff Assignment - Only for immediate need */}
          <StaffAssignmentCard
            drivers={drivers}
            assistants={assistants}
            vehicles={drivers}
            assigned_driver_id={data.assigned_driver_id}
            assigned_assistant_id={data.assigned_assistant_id}
            assigned_vehicle_id={assignedVehicleId}
            contractType={data.type}
            onDriverChange={(value) => setData('assigned_driver_id', value)}
            onAssistantChange={(value) => setData('assigned_assistant_id', value)}
            onVehicleChange={setAssignedVehicleId}
            errors={{
              assigned_driver_id: errors.assigned_driver_id,
              assigned_assistant_id: errors.assigned_assistant_id,
            }}
          />

          {/* Corporate Agreement Selection */}
          {agreements.length > 0 && (
            <AgreementSelectionCard
              agreements={agreements}
              selectedAgreementId={data.agreement_id}
              onAgreementChange={(agreementId) => setData('agreement_id', agreementId)}
            />
          )}

          {/* Directory Selection (Church, Cemetery, Wake Room) */}
          {(churches.length > 0 || cemeteries.length > 0 || wakeRooms.length > 0) && (
            <DirectorySelectionCard
              churches={churches}
              cemeteries={cemeteries}
              wakeRooms={wakeRooms}
              selectedChurchId={data.church_id}
              selectedCemeteryId={data.cemetery_id}
              selectedWakeRoomId={data.wake_room_id}
              onChurchChange={(churchId) => setData('church_id', churchId)}
              onCemeteryChange={(cemeteryId) => setData('cemetery_id', cemeteryId)}
              onWakeRoomChange={(wakeRoomId) => setData('wake_room_id', wakeRoomId)}
            />
          )}

          {/* Totals */}
          <TotalsAndCommissionCard
            discount_percentage={data.discount_percentage}
            is_holiday={data.is_holiday}
            is_night_shift={data.is_night_shift}
            totals={totals}
            commission={commission}
            onDiscountChange={(value) => setData('discount_percentage', value)}
            errors={{ discount_percentage: errors.discount_percentage }}
          />

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
              {processing ? t('common.saving') : t('common.save')}
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
