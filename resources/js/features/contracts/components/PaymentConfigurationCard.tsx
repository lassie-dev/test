import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatearMoneda } from '@/features/contracts/functions';

interface PaymentConfigurationCardProps {
  payment_method: string;
  installments: number;
  down_payment: number;
  total: number;
  onPaymentMethodChange: (method: string) => void;
  onInstallmentsChange: (count: number) => void;
  onDownPaymentChange: (amount: number) => void;
  errors?: {
    payment_method?: string;
    installments?: string;
    down_payment?: string;
  };
}

export default function PaymentConfigurationCard({
  payment_method,
  installments,
  down_payment,
  total,
  onPaymentMethodChange,
  onInstallmentsChange,
  onDownPaymentChange,
  errors,
}: PaymentConfigurationCardProps) {
  return (
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
                checked={payment_method === 'cash'}
                onChange={(e) => onPaymentMethodChange(e.target.value)}
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
                checked={payment_method === 'credit'}
                onChange={(e) => onPaymentMethodChange(e.target.value)}
                className="h-4 w-4"
              />
              <Label htmlFor="payment_credit" className="font-normal cursor-pointer">
                Credit (Installments)
              </Label>
            </div>
          </div>
          {errors?.payment_method && <p className="text-sm text-destructive">{errors.payment_method}</p>}
        </div>

        {payment_method === 'credit' && (
          <div className="grid grid-cols-2 gap-4 border-t pt-4">
            <div className="space-y-2">
              <Label htmlFor="installments">Number of Installments</Label>
              <Select
                value={installments.toString()}
                onValueChange={(value) => onInstallmentsChange(parseInt(value))}
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
              {errors?.installments && <p className="text-sm text-destructive">{errors.installments}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="down_payment">Down Payment (Optional)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <Input
                  id="down_payment"
                  type="number"
                  min="0"
                  max={total}
                  value={down_payment}
                  onChange={(e) => onDownPaymentChange(parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  className="pl-7"
                />
              </div>
              <p className="text-xs text-gray-500">Enter amount in Chilean pesos (e.g., 50000)</p>
              {errors?.down_payment && <p className="text-sm text-destructive">{errors.down_payment}</p>}
            </div>

            <div className="col-span-2 bg-blue-50 p-4 rounded-lg">
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Total Contract:</span>
                  <span className="font-semibold">{formatearMoneda(total)}</span>
                </div>
                {down_payment > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Down Payment:</span>
                    <span className="font-semibold">-{formatearMoneda(down_payment)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm border-t pt-1">
                  <span>Remaining:</span>
                  <span className="font-semibold">{formatearMoneda(total - down_payment)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-blue-700 border-t pt-2">
                  <span>Monthly Payment:</span>
                  <span>{formatearMoneda((total - down_payment) / installments)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
