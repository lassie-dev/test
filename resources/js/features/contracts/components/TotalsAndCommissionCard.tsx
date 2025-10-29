import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatearMoneda } from '@/features/contracts/functions';

interface TotalsAndCommissionCardProps {
  discount_percentage: number;
  is_holiday: boolean;
  is_night_shift: boolean;
  totals: {
    servicesSubtotal: number;
    productsSubtotal: number;
    subtotal: number;
    discountAmount: number;
    total: number;
  };
  commission: {
    commissionRate: number;
    commissionAmount: number;
  };
  onDiscountChange: (percentage: number) => void;
  errors?: {
    discount_percentage?: string;
  };
}

export default function TotalsAndCommissionCard({
  discount_percentage,
  is_holiday,
  is_night_shift,
  totals,
  commission,
  onDiscountChange,
  errors,
}: TotalsAndCommissionCardProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('contracts.totals')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="discount_percentage">{t('contracts.discount')}</Label>
          <div className="flex items-center gap-2">
            <Input
              id="discount_percentage"
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={discount_percentage}
              onChange={(e) => onDiscountChange(parseFloat(e.target.value) || 0)}
              placeholder="0"
              className="w-32"
            />
            <span className="text-sm text-gray-600">%</span>
          </div>
          <p className="text-xs text-gray-500">{t('contracts.discountHint')}</p>
          {errors?.discount_percentage && <p className="text-sm text-destructive">{errors.discount_percentage}</p>}
        </div>

        <div className="space-y-2 border-t pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">{t('common.subtotal')}:</span>
            <span className="font-medium">{formatearMoneda(totals.subtotal)}</span>
          </div>

          {totals.discountAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                {t('contracts.discountAmount', { percent: discount_percentage })}:
              </span>
              <span className="font-medium text-destructive">
                -{formatearMoneda(totals.discountAmount)}
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
            {is_night_shift && (
              <div className="flex justify-between text-sm">
                <span className="text-green-800">Night Shift Bonus:</span>
                <span className="font-medium text-green-700">+2%</span>
              </div>
            )}
            {is_holiday && (
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
  );
}
