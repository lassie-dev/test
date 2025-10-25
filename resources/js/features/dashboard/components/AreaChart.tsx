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
import { Activity } from 'lucide-react';

interface ChartDataPoint {
  date: string;
  mobile: number;
  desktop: number;
}

interface AreaChartProps {
  data: ChartDataPoint[];
  title?: string;
  description?: string;
}

export default function AreaChart({
  data,
  title = "Área de Actividad - Interactiva",
  description = "Mostrando total de visitantes para los últimos 3 meses"
}: AreaChartProps) {
  const [timeRange, setTimeRange] = useState<'3months' | '6months' | '1year'>('3months');

  // Filter data based on time range
  const getFilteredData = () => {
    const now = new Date();
    const cutoffDate = new Date();

    switch (timeRange) {
      case '3months':
        cutoffDate.setMonth(now.getMonth() - 3);
        break;
      case '6months':
        cutoffDate.setMonth(now.getMonth() - 6);
        break;
      case '1year':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    return data.filter(item => new Date(item.date) >= cutoffDate);
  };

  const filteredData = getFilteredData();

  const timeRangeOptions = [
    { value: '3months', label: 'Últimos 3 meses' },
    { value: '6months', label: 'Últimos 6 meses' },
    { value: '1year', label: 'Último año' },
  ];

  return (
    <Card className="border-gray-200 bg-white">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50">
              <Activity className="h-5 w-5 text-text-accent" />
            </div>
            <div>
              <CardTitle className="text-text-primary">{title}</CardTitle>
              <CardDescription className="text-text-subtle">{description}</CardDescription>
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
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsAreaChart
              data={filteredData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorMobile" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorDesktop" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#64748b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#64748b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
                }}
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
                    const date = new Date(payload[0].payload.date);
                    return (
                      <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
                        <p className="text-xs text-text-muted mb-2">
                          {date.toLocaleDateString('es-ES', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                        {payload.map((entry, index) => (
                          <div key={index} className="flex items-center justify-between gap-8">
                            <div className="flex items-center gap-2">
                              <div
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: entry.color }}
                              />
                              <span className="text-xs font-medium text-text-secondary">
                                {entry.name === 'mobile' ? 'Móvil' : 'Escritorio'}
                              </span>
                            </div>
                            <span className="text-sm font-bold text-text-primary">
                              {entry.value}
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
                          {entry.value === 'mobile' ? 'Móvil' : 'Escritorio'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              />
              <Area
                type="monotone"
                dataKey="mobile"
                name="mobile"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorMobile)"
              />
              <Area
                type="monotone"
                dataKey="desktop"
                name="desktop"
                stroke="#64748b"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorDesktop)"
              />
            </RechartsAreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
