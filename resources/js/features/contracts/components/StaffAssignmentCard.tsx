import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Staff } from '@/features/contracts/types';

interface StaffAssignmentCardProps {
  drivers: Staff[];
  assistants: Staff[];
  assigned_driver_id: number | null;
  assigned_assistant_id: number | null;
  contractType: string;
  onDriverChange: (driverId: number | null) => void;
  onAssistantChange: (assistantId: number | null) => void;
  errors?: {
    assigned_driver_id?: string;
    assigned_assistant_id?: string;
  };
}

export default function StaffAssignmentCard({
  drivers,
  assistants,
  assigned_driver_id,
  assigned_assistant_id,
  contractType,
  onDriverChange,
  onAssistantChange,
  errors,
}: StaffAssignmentCardProps) {
  if (contractType !== 'necesidad_inmediata') {
    return null;
  }

  return (
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
              value={assigned_driver_id?.toString() || 'none'}
              onValueChange={(value) => onDriverChange(value === 'none' ? null : parseInt(value))}
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
            {errors?.assigned_driver_id && <p className="text-sm text-destructive">{errors.assigned_driver_id}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="assigned_assistant">Assistant (Optional)</Label>
            <Select
              value={assigned_assistant_id?.toString() || 'none'}
              onValueChange={(value) => onAssistantChange(value === 'none' ? null : parseInt(value))}
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
            {errors?.assigned_assistant_id && <p className="text-sm text-destructive">{errors.assigned_assistant_id}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
