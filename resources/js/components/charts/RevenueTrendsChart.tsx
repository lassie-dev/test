import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { TrendingUp, DollarSign } from 'lucide-react';

interface RevenueDataPoint {
  month: string;
  revenue: number;
  previous_revenue: number;
}

interface RevenueTrendsChartProps {
  data: RevenueDataPoint[];
  title?: string;
  description?: string;
}

export default function RevenueTrendsChart({
  data,
  title = "Tendencias de Ingresos",
  description = "Comparación de ingresos mensuales"
}: RevenueTrendsChartProps) {
  const [timeRange, setTimeRange] = useState<'3months' | '6months' | '1year'>('6months');

  const getFilteredData = () => {
    const dataLength = data.length;
    switch (timeRange) {
      case '3months':
        return data.slice(Math.max(0, dataLength - 3));
      case '6months':
        return data.slice(Math.max(0, dataLength - 6));
      case '1year':
        return data.slice(Math.max(0, dataLength - 12));
      default:
        return data;
    }
  };

  const filteredData = getFilteredData();

  // Calculate total revenue
  const totalRevenue = filteredData.reduce((sum, item) => sum + item.revenue, 0);
  const avgRevenue = filteredData.length > 0 ? totalRevenue / filteredData.length : 0;

  const timeRangeOptions = [
    { value: '3months', label: 'Últimos 3 meses' },
    { value: '6months', label: 'Últimos 6 meses' },
    { value: '1year', label: 'Último año' },
  ];

  const formatCurrency = (value: number) => {
    return `$${(value / 1000).toFixed(0)}k`;
  };

  return (
    <Card className="border-gray-200 bg-white">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
              <TrendingUp className="h-5 w-5 text-green-700" />
            </div>
            <div>
              <CardTitle className="text-text-primary">{title}</CardTitle>
              <CardDescription className="text-text-subtle">{description}</CardDescription>
              <div className="mt-2 flex items-center gap-4">
                <div>
                  <p className="text-xs text-text-muted">Total</p>
                  <p className="text-lg font-bold text-text-primary">
                    ${totalRevenue.toLocaleString('es-CL')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Promedio</p>
                  <p className="text-lg font-bold text-text-primary">
                    ${Math.round(avgRevenue).toLocaleString('es-CL')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as '3months' | '6months' | '1year')}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
          >
            {timeRangeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsAreaChart
              data={filteredData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPrevRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis
                dataKey="month"
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
                tickFormatter={formatCurrency}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
                        <p className="text-xs font-medium text-text-muted mb-2">
                          {payload[0].payload.month}
                        </p>
                        {payload.map((entry, index) => (
                          <div key={index} className="flex items-center justify-between gap-8">
                            <div className="flex items-center gap-2">
                              <div
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: entry.color }}
                              />
                              <span className="text-xs font-medium text-text-secondary">
                                {entry.name === 'revenue' ? 'Actual' : 'Anterior'}
                              </span>
                            </div>
                            <span className="text-sm font-bold text-text-primary">
                              ${Number(entry.value).toLocaleString('es-CL')}
                            </span>
                          </div>
                        ))}
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
                    {payload?.map((entry, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-sm"
                          style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-xs font-medium text-text-secondary">
                          {entry.value === 'revenue' ? 'Ingresos Actuales' : 'Período Anterior'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              />
              <Area
                type="monotone"
                dataKey="previous_revenue"
                name="previous_revenue"
                stroke="#94a3b8"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorPrevRevenue)"
                strokeDasharray="5 5"
              />
              <Area
                type="monotone"
                dataKey="revenue"
                name="revenue"
                stroke="#059669"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </RechartsAreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
