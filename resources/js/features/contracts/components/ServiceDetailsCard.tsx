import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ServiceDetailsCardProps {
  service_location: string;
  service_datetime: string;
  special_requests: string;
  onLocationChange: (value: string) => void;
  onDateTimeChange: (value: string) => void;
  onSpecialRequestsChange: (value: string) => void;
  errors?: {
    service_location?: string;
    service_datetime?: string;
    special_requests?: string;
  };
}

export default function ServiceDetailsCard({
  service_location,
  service_datetime,
  special_requests,
  onLocationChange,
  onDateTimeChange,
  onSpecialRequestsChange,
  errors,
}: ServiceDetailsCardProps) {
  return (
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
              value={service_location}
              onChange={(e) => onLocationChange(e.target.value)}
              placeholder="e.g., Chapel, Cemetery name"
            />
            {errors?.service_location && <p className="text-sm text-destructive">{errors.service_location}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="service_datetime">Service Date & Time</Label>
            <Input
              id="service_datetime"
              type="datetime-local"
              value={service_datetime}
              onChange={(e) => onDateTimeChange(e.target.value)}
            />
            {errors?.service_datetime && <p className="text-sm text-destructive">{errors.service_datetime}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="special_requests">Special Requests</Label>
          <textarea
            id="special_requests"
            value={special_requests}
            onChange={(e) => onSpecialRequestsChange(e.target.value)}
            placeholder="Any special requests or notes for the service"
            className="w-full min-h-[100px] px-3 py-2 text-sm border rounded-md"
          />
          {errors?.special_requests && <p className="text-sm text-destructive">{errors.special_requests}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
