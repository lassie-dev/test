import { Card } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Area, AreaChart as RechartsAreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

interface AreaChartProps {
  data: Array<{
    date: string;
    desktop: number;
    mobile: number;
    tablet: number;
  }>;
}

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'hsl(var(--chart-1))',
  },
  mobile: {
    label: 'Mobile',
    color: 'hsl(var(--chart-2))',
  },
  tablet: {
    label: 'Tablet',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

export function AreaChart({ data }: AreaChartProps) {
  return (
    <ChartContainer config={chartConfig} className="h-[400px] w-full">
      <RechartsAreaChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <defs>
          <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-desktop)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--color-desktop)" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-mobile)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--color-mobile)" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="fillTablet" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-tablet)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--color-tablet)" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value}
        />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          type="monotone"
          dataKey="desktop"
          stroke="var(--color-desktop)"
          fillOpacity={1}
          fill="url(#fillDesktop)"
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="mobile"
          stroke="var(--color-mobile)"
          fillOpacity={1}
          fill="url(#fillMobile)"
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="tablet"
          stroke="var(--color-tablet)"
          fillOpacity={1}
          fill="url(#fillTablet)"
          strokeWidth={2}
        />
      </RechartsAreaChart>
    </ChartContainer>
  );
}
