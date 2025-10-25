import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';
import { FileSignature } from 'lucide-react';

interface ContractStatusData {
  status: string;
  current_month: number;
  previous_month: number;
  label: string;
  color: string;
}

interface ContractStatusChartProps {
  data: ContractStatusData[];
  title?: string;
  description?: string;
}

export default function ContractStatusChart({
  data,
  title = "Estado de Contratos",
  description = "Distribución actual vs mes anterior"
}: ContractStatusChartProps) {
  const totalCurrent = data.reduce((sum, item) => sum + item.current_month, 0);
  const totalPrevious = data.reduce((sum, item) => sum + item.previous_month, 0);
  const percentChange = totalPrevious > 0
    ? ((totalCurrent - totalPrevious) / totalPrevious * 100).toFixed(1)
    : 0;

  return (
    <Card className="border-gray-200 bg-white">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <FileSignature className="h-5 w-5 text-blue-700" />
            </div>
            <div>
              <CardTitle className="text-text-primary">{title}</CardTitle>
              <CardDescription className="text-text-subtle">{description}</CardDescription>
              <div className="mt-2 flex items-center gap-4">
                <div>
                  <p className="text-xs text-text-muted">Este mes</p>
                  <p className="text-lg font-bold text-text-primary">{totalCurrent}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Cambio</p>
                  <p className={`text-lg font-bold ${Number(percentChange) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Number(percentChange) >= 0 ? '+' : ''}{percentChange}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis
                dataKey="label"
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
                        <p className="text-xs font-medium text-text-muted mb-2">
                          {data.label}
                        </p>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-8">
                            <span className="text-xs font-medium text-text-secondary">
                              Mes actual
                            </span>
                            <span className="text-sm font-bold text-text-primary">
                              {data.current_month}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-8">
                            <span className="text-xs font-medium text-text-secondary">
                              Mes anterior
                            </span>
                            <span className="text-sm font-bold text-text-primary">
                              {data.previous_month}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                content={({ payload }) => (
                  <div className="flex items-center justify-center gap-6 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-sm bg-primary-500" />
                      <span className="text-xs font-medium text-text-secondary">
                        Mes Actual
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-sm bg-gray-300" />
                      <span className="text-xs font-medium text-text-secondary">
                        Mes Anterior
                      </span>
                    </div>
                  </div>
                )}
              />
              <Bar
                dataKey="previous_month"
                fill="#d1d5db"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="current_month"
                fill="#059669"
                radius={[4, 4, 0, 0]}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
