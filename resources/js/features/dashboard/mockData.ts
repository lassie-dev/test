// Mock data for dashboard charts
// This data will be used temporarily until real backend data is available

export const mockRevenueTrendsData = [
  { month: 'Ene 2025', revenue: 3500000, previous_revenue: 2800000 },
  { month: 'Feb 2025', revenue: 4200000, previous_revenue: 3100000 },
  { month: 'Mar 2025', revenue: 3800000, previous_revenue: 3500000 },
  { month: 'Abr 2025', revenue: 4500000, previous_revenue: 3200000 },
  { month: 'May 2025', revenue: 5100000, previous_revenue: 4000000 },
  { month: 'Jun 2025', revenue: 4800000, previous_revenue: 3900000 },
  { month: 'Jul 2025', revenue: 5200000, previous_revenue: 4100000 },
  { month: 'Ago 2025', revenue: 4900000, previous_revenue: 4300000 },
  { month: 'Sep 2025', revenue: 5400000, previous_revenue: 4500000 },
  { month: 'Oct 2025', revenue: 5800000, previous_revenue: 4700000 },
];

export const mockContractStatusData = [
  {
    status: 'quote',
    label: 'Cotización',
    color: '#f59e0b',
    current_month: 15,
    previous_month: 12,
  },
  {
    status: 'contract',
    label: 'Contrato',
    color: '#3b82f6',
    current_month: 28,
    previous_month: 25,
  },
  {
    status: 'completed',
    label: 'Completado',
    color: '#059669',
    current_month: 32,
    previous_month: 30,
  },
  {
    status: 'cancelled',
    label: 'Cancelado',
    color: '#dc2626',
    current_month: 3,
    previous_month: 5,
  },
];

export const mockPaymentStatusData = [
  {
    status: 'paid',
    label: 'Pagado',
    value: 12500000,
    color: '#059669',
  },
  {
    status: 'pending',
    label: 'Pendiente',
    value: 4800000,
    color: '#f59e0b',
  },
  {
    status: 'overdue',
    label: 'Vencido',
    value: 1900000,
    color: '#dc2626',
  },
];

// Generate daily data for the last 6 months
const generateServicesTimelineData = () => {
  const data = [];
  const now = new Date();
  const startDate = new Date();
  startDate.setMonth(now.getMonth() - 6);

  for (let date = new Date(startDate); date <= now; date.setDate(date.getDate() + 1)) {
    const dateStr = date.toISOString().split('T')[0];
    const scheduled = Math.floor(Math.random() * 5);
    const completed = Math.floor(scheduled * (0.7 + Math.random() * 0.3));

    data.push({
      date: dateStr,
      scheduled,
      completed,
    });
  }

  return data;
};

export const mockServicesTimelineData = generateServicesTimelineData();

export const mockBranchPerformanceData = [
  {
    branch_name: 'Centro',
    revenue: 8500000,
    contracts: 42,
    services: 38,
  },
  {
    branch_name: 'Norte',
    revenue: 6200000,
    contracts: 31,
    services: 28,
  },
  {
    branch_name: 'Sur',
    revenue: 7100000,
    contracts: 36,
    services: 33,
  },
  {
    branch_name: 'Oriente',
    revenue: 5800000,
    contracts: 28,
    services: 25,
  },
];
