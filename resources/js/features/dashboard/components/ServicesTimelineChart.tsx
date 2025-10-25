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
import { Calendar } from 'lucide-react';

interface ServicesTimelineData {
  date: string;
  scheduled: number;
  completed: number;
}

interface ServicesTimelineChartProps {
  data: ServicesTimelineData[];
  title?: string;
  description?: string;
}

export default function ServicesTimelineChart({
  data,
  title = "Línea de Tiempo de Servicios",
  description = "Servicios programados vs completados"
}: ServicesTimelineChartProps) {
  const [timeRange, setTimeRange] = useState<'1month' | '3months' | '6months'>('3months');

  const getFilteredData = () => {
    const now = new Date();
    const cutoffDate = new Date();

    switch (timeRange) {
      case '1month':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case '3months':
        cutoffDate.setMonth(now.getMonth() - 3);
        break;
      case '6months':
        cutoffDate.setMonth(now.getMonth() - 6);
        break;
    }

    return data.filter(item => new Date(item.date) >= cutoffDate);
  };

  const filteredData = getFilteredData();

  const totalScheduled = filteredData.reduce((sum, item) => sum + item.scheduled, 0);
  const totalCompleted = filteredData.reduce((sum, item) => sum + item.completed, 0);
  const completionRate = totalScheduled > 0 ? ((totalCompleted / totalScheduled) * 100).toFixed(1) : 0;

  const timeRangeOptions = [
    { value: '1month', label: 'Último mes' },
    { value: '3months', label: 'Últimos 3 meses' },
    { value: '6months', label: 'Últimos 6 meses' },
  ];

  return (
    <Card className="border-gray-200 bg-white">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
              <Calendar className="h-5 w-5 text-purple-700" />
            </div>
            <div>
              <CardTitle className="text-text-primary">{title}</CardTitle>
              <CardDescription className="text-text-subtle">{description}</CardDescription>
              <div className="mt-2 flex items-center gap-4">
                <div>
                  <p className="text-xs text-text-muted">Programados</p>
                  <p className="text-lg font-bold text-text-primary">{totalScheduled}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Completados</p>
                  <p className="text-lg font-bold text-text-primary">{totalCompleted}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Tasa</p>
                  <p className="text-lg font-bold text-green-600">{completionRate}%</p>
                </div>
              </div>
            </div>
          </div>

          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as '1month' | '3months' | '6months')}
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
                <linearGradient id="colorScheduled" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0} />
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
                                {entry.name === 'scheduled' ? 'Programados' : 'Completados'}
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
                          {entry.value === 'scheduled' ? 'Programados' : 'Completados'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              />
              <Area
                type="monotone"
                dataKey="scheduled"
                name="scheduled"
                stroke="#8b5cf6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorScheduled)"
              />
              <Area
                type="monotone"
                dataKey="completed"
                name="completed"
                stroke="#059669"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorCompleted)"
              />
            </RechartsAreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
