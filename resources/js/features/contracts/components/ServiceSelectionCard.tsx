import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { formatearMoneda } from '@/features/contracts/functions';
import type { Servicio, ServiceItem } from '@/features/contracts/types';

interface ServiceSelectionCardProps {
  services: Servicio[];
  selectedService: number | null;
  contractServices: ServiceItem[];
  onServiceSelect: (serviceId: number | null) => void;
  onAddService: () => void;
  onRemoveService: (serviceId: number) => void;
  errors?: {
    services?: string;
  };
}

export default function ServiceSelectionCard({
  services,
  selectedService,
  contractServices,
  onServiceSelect,
  onAddService,
  onRemoveService,
  errors,
}: ServiceSelectionCardProps) {
  const { t } = useTranslation();

  const getServiceDetails = (serviceId: number) => {
    return services.find(s => s.id === serviceId);
  };

  return (
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
              onValueChange={(value) => onServiceSelect(parseInt(value))}
            >
              <SelectTrigger id="service">
                <SelectValue placeholder={t('contracts.selectServicePlaceholder')} />
              </SelectTrigger>
              <SelectContent position="popper">
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id.toString()}>
                    <div className="flex items-center justify-between w-full">
                      <span>{service.name} - {formatearMoneda(service.price)}</span>
                      <span className="ml-2 text-xs text-green-600 font-semibold">Available</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button
              type="button"
              onClick={onAddService}
              disabled={!selectedService}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              {t('common.add')}
            </Button>
          </div>
        </div>

        {/* Services List */}
        {contractServices.length > 0 && (
          <div className="mt-4 space-y-2">
            <div className="rounded-lg border">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium">{t('contracts.service')}</th>
                    <th className="px-4 py-2 text-right text-sm font-medium">{t('contracts.price')}</th>
                    <th className="px-4 py-2 text-right text-sm font-medium">{t('common.action')}</th>
                  </tr>
                </thead>
                <tbody>
                  {contractServices.map((item) => {
                    const service = getServiceDetails(item.service_id);

                    return (
                      <tr key={item.service_id} className="border-t">
                        <td className="px-4 py-2 text-sm">{service?.name}</td>
                        <td className="px-4 py-2 text-right text-sm font-medium">
                          {formatearMoneda(item.unit_price)}
                        </td>
                        <td className="px-4 py-2 text-right">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => onRemoveService(item.service_id)}
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

        {errors?.services && <p className="text-sm text-destructive">{errors.services}</p>}
      </CardContent>
    </Card>
  );
}
