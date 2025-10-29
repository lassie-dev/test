import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface VehicleInformationSectionProps {
  vehicle_plate: string;
  vehicle_model: string;
  onVehiclePlateChange: (value: string) => void;
  onVehicleModelChange: (value: string) => void;
  errors?: {
    vehicle_plate?: string;
    vehicle_model?: string;
  };
}

export default function VehicleInformationSection({
  vehicle_plate,
  vehicle_model,
  onVehiclePlateChange,
  onVehicleModelChange,
  errors,
}: VehicleInformationSectionProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('staff.vehicleInformation')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Vehicle Plate */}
          <div className="space-y-2">
            <Label htmlFor="vehicle_plate">{t('staff.vehiclePlate')}</Label>
            <Input
              id="vehicle_plate"
              type="text"
              value={vehicle_plate}
              onChange={(e) => onVehiclePlateChange(e.target.value)}
              placeholder="ABCD12"
              className={errors?.vehicle_plate ? 'border-red-500' : ''}
            />
            {errors?.vehicle_plate && <p className="text-sm text-red-500">{errors.vehicle_plate}</p>}
          </div>

          {/* Vehicle Model */}
          <div className="space-y-2">
            <Label htmlFor="vehicle_model">{t('staff.vehicleModel')}</Label>
            <Input
              id="vehicle_model"
              type="text"
              value={vehicle_model}
              onChange={(e) => onVehicleModelChange(e.target.value)}
              placeholder={t('staff.vehicleModelPlaceholder')}
              className={errors?.vehicle_model ? 'border-red-500' : ''}
            />
            {errors?.vehicle_model && <p className="text-sm text-red-500">{errors.vehicle_model}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
