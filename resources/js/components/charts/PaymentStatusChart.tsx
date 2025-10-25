import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { Wallet } from 'lucide-react';

interface PaymentStatusData {
  status: string;
  value: number;
  label: string;
  color: string;
}

interface PaymentStatusChartProps {
  data: PaymentStatusData[];
  title?: string;
  description?: string;
}

export default function PaymentStatusChart({
  data,
  title = "Estado de Pagos",
  description = "Distribución de pagos por estado"
}: PaymentStatusChartProps) {
  // Filter out zero values and ensure valid data
  const validData = data.filter(item => item.value > 0);
  const total = validData.reduce((sum, item) => sum + item.value, 0);

  // If no valid data, show empty state
  if (validData.length === 0 || total === 0) {
    return (
      <Card className="border-gray-200 bg-white">
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
              <Wallet className="h-5 w-5 text-amber-700" />
            </div>
            <div>
              <CardTitle className="text-text-primary">{title}</CardTitle>
              <CardDescription className="text-text-subtle">{description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full flex items-center justify-center">
            <div className="text-center">
              <Wallet className="mx-auto h-12 w-12 text-text-subtle" />
              <p className="mt-2 text-sm text-text-muted">No hay datos de pagos disponibles</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-gray-200 bg-white">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
            <Wallet className="h-5 w-5 text-amber-700" />
          </div>
          <div>
            <CardTitle className="text-text-primary">{title}</CardTitle>
            <CardDescription className="text-text-subtle">{description}</CardDescription>
            <div className="mt-2">
              <p className="text-xs text-text-muted">Total</p>
              <p className="text-lg font-bold text-text-primary">
                ${total.toLocaleString('es-CL')}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                data={validData}
                cx="50%"
                cy="45%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                label={false}
              >
                {validData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
                    return (
                      <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <p className="text-xs font-medium text-text-muted">
                            {item.label}
                          </p>
                        </div>
                        <p className="text-sm font-bold text-text-primary">
                          ${item.value.toLocaleString('es-CL')}
                        </p>
                        <p className="text-xs text-text-subtle mt-1">
                          {percentage}% del total
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={60}
                content={() => (
                  <div className="grid grid-cols-1 gap-2 mt-4">
                    {validData.map((item, index) => {
                      const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
                      return (
                        <div
                          key={`legend-${index}`}
                          className="flex items-center justify-between px-2 py-1 rounded hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="h-3 w-3 rounded-full flex-shrink-0"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="text-xs font-medium text-text-secondary">
                              {item.label}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-bold text-text-primary">
                              ${item.value.toLocaleString('es-CL')}
                            </span>
                            <span className="text-xs text-text-subtle ml-2">
                              ({percentage}%)
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
