import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Church, MapPin, Building2 } from 'lucide-react';

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

interface DirectorySelectionCardProps {
  churches: Church[];
  cemeteries: Cemetery[];
  wakeRooms: WakeRoom[];
  selectedChurchId: number | null;
  selectedCemeteryId: number | null;
  selectedWakeRoomId: number | null;
  onChurchChange: (churchId: number | null) => void;
  onCemeteryChange: (cemeteryId: number | null) => void;
  onWakeRoomChange: (wakeRoomId: number | null) => void;
}

export default function DirectorySelectionCard({
  churches,
  cemeteries,
  wakeRooms,
  selectedChurchId,
  selectedCemeteryId,
  selectedWakeRoomId,
  onChurchChange,
  onCemeteryChange,
  onWakeRoomChange,
}: DirectorySelectionCardProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('contracts.serviceLocations')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Church Selection */}
        <div>
          <Label className="flex items-center gap-2">
            <Church className="h-4 w-4 text-blue-600" />
            {t('directory.church')}
          </Label>
          <Select
            value={selectedChurchId?.toString() || undefined}
            onValueChange={(value) => onChurchChange(value ? parseInt(value) : null)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('contracts.selectChurch')} />
            </SelectTrigger>
            <SelectContent>
              {churches.map((church) => (
                <SelectItem key={church.id} value={church.id.toString()}>
                  {church.name} - {church.city} ({church.religion})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Cemetery Selection */}
        <div>
          <Label className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-green-600" />
            {t('directory.cemetery')}
          </Label>
          <Select
            value={selectedCemeteryId?.toString() || undefined}
            onValueChange={(value) => onCemeteryChange(value ? parseInt(value) : null)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('contracts.selectCemetery')} />
            </SelectTrigger>
            <SelectContent>
              {cemeteries.map((cemetery) => (
                <SelectItem key={cemetery.id} value={cemetery.id.toString()}>
                  {cemetery.name} - {cemetery.city} ({cemetery.type})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Wake Room Selection */}
        <div>
          <Label className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-purple-600" />
            {t('directory.wakeRoom')}
          </Label>
          <Select
            value={selectedWakeRoomId?.toString() || undefined}
            onValueChange={(value) => onWakeRoomChange(value ? parseInt(value) : null)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('contracts.selectWakeRoom')} />
            </SelectTrigger>
            <SelectContent>
              {wakeRooms.map((wakeRoom) => (
                <SelectItem key={wakeRoom.id} value={wakeRoom.id.toString()}>
                  {wakeRoom.name} ({wakeRoom.funeral_home_name}) - {wakeRoom.city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <p className="text-sm text-gray-500 italic">
          {t('contracts.directoryOptional')}
        </p>
      </CardContent>
    </Card>
  );
}
