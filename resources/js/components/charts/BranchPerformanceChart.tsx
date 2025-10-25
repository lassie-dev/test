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
} from 'recharts';
import { Building2 } from 'lucide-react';

interface BranchPerformanceData {
  branch_name: string;
  revenue: number;
  contracts: number;
  services: number;
}

interface BranchPerformanceChartProps {
  data: BranchPerformanceData[];
  title?: string;
  description?: string;
}

export default function BranchPerformanceChart({
  data,
  title = "Rendimiento por Sucursal",
  description = "Comparación de métricas entre sucursales"
}: BranchPerformanceChartProps) {
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const totalContracts = data.reduce((sum, item) => sum + item.contracts, 0);
  const bestPerformer = data.length > 0
    ? data.reduce((prev, current) => (prev.revenue > current.revenue ? prev : current))
    : null;

  const formatCurrency = (value: number) => {
    return `$${(value / 1000).toFixed(0)}k`;
  };

  return (
    <Card className="border-gray-200 bg-white">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
              <Building2 className="h-5 w-5 text-indigo-700" />
            </div>
            <div>
              <CardTitle className="text-text-primary">{title}</CardTitle>
              <CardDescription className="text-text-subtle">{description}</CardDescription>
              <div className="mt-2 flex items-center gap-4">
                <div>
                  <p className="text-xs text-text-muted">Total Ingresos</p>
                  <p className="text-lg font-bold text-text-primary">
                    ${totalRevenue.toLocaleString('es-CL')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Total Contratos</p>
                  <p className="text-lg font-bold text-text-primary">{totalContracts}</p>
                </div>
                {bestPerformer && (
                  <div>
                    <p className="text-xs text-text-muted">Mejor sucursal</p>
                    <p className="text-lg font-bold text-primary-600">{bestPerformer.branch_name}</p>
                  </div>
                )}
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
                dataKey="branch_name"
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                yAxisId="left"
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatCurrency}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
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
                          {data.branch_name}
                        </p>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-8">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-green-600" />
                              <span className="text-xs font-medium text-text-secondary">
                                Ingresos
                              </span>
                            </div>
                            <span className="text-sm font-bold text-text-primary">
                              ${data.revenue.toLocaleString('es-CL')}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-8">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-blue-600" />
                              <span className="text-xs font-medium text-text-secondary">
                                Contratos
                              </span>
                            </div>
                            <span className="text-sm font-bold text-text-primary">
                              {data.contracts}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-8">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-purple-600" />
                              <span className="text-xs font-medium text-text-secondary">
                                Servicios
                              </span>
                            </div>
                            <span className="text-sm font-bold text-text-primary">
                              {data.services}
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
                      <div className="h-3 w-3 rounded-sm bg-green-600" />
                      <span className="text-xs font-medium text-text-secondary">
                        Ingresos
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-sm bg-blue-600" />
                      <span className="text-xs font-medium text-text-secondary">
                        Contratos
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-sm bg-purple-600" />
                      <span className="text-xs font-medium text-text-secondary">
                        Servicios
                      </span>
                    </div>
                  </div>
                )}
              />
              <Bar
                yAxisId="left"
                dataKey="revenue"
                fill="#059669"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                yAxisId="right"
                dataKey="contracts"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                yAxisId="right"
                dataKey="services"
                fill="#8b5cf6"
                radius={[4, 4, 0, 0]}
              />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
