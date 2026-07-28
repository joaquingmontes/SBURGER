import { EstadoPedido } from '@dataconnect/generated';
import { AdminOrderStatus } from '../constants/mockAdminOrders';

export interface StatsOrder {
  id: string;
  createdAt: string;
  total: number;
  status: AdminOrderStatus;
  sucursalId: string | null;
  sucursalName: string | null;
}

export interface StatsSucursal {
  id: string;
  nombre: string;
}

export interface OrderSummary {
  totalOrders: number;
  revenue: number;
  preparing: number;
  completed: number;
  cancelled: number;
}

export interface MonthlyStat {
  key: string;
  label: string;
  totalOrders: number;
  revenue: number;
  preparing: number;
  completed: number;
  cancelled: number;
}

export interface HourlyBucket {
  label: string;
  startHour: number;
  count: number;
}

export interface BranchRankingEntry {
  sucursalId: string;
  sucursalName: string;
  totalOrders: number;
  revenue: number;
  completed: number;
  completionRate: number;
  averageTicket: number;
  rankByOrders: number;
  rankByRevenue: number;
  rankByCompletion: number;
}

const MONTHS_ES = [
  'Ene',
  'Feb',
  'Mar',
  'Abr',
  'May',
  'Jun',
  'Jul',
  'Ago',
  'Sep',
  'Oct',
  'Nov',
  'Dic',
];

const HOUR_BUCKETS: Array<{ label: string; startHour: number; endHour: number }> = [
  { label: '00-04 h', startHour: 0, endHour: 3 },
  { label: '04-08 h', startHour: 4, endHour: 7 },
  { label: '08-12 h', startHour: 8, endHour: 11 },
  { label: '12-16 h', startHour: 12, endHour: 15 },
  { label: '16-20 h', startHour: 16, endHour: 19 },
  { label: '20-24 h', startHour: 20, endHour: 23 },
];

const STATUS_FROM_ESTADO: Record<EstadoPedido, AdminOrderStatus> = {
  [EstadoPedido.PREPARING]: 'preparing',
  [EstadoPedido.COMPLETED]: 'completed',
  [EstadoPedido.CANCELLED]: 'cancelled',
};

export const mapPedidoToStatsOrder = (pedido: {
  id: string;
  createdAt: string;
  total: number;
  estado: EstadoPedido;
  sucursal?: { id: string; nombre: string } | null;
}): StatsOrder => ({
  id: pedido.id,
  createdAt: pedido.createdAt,
  total: pedido.total,
  status: STATUS_FROM_ESTADO[pedido.estado],
  sucursalId: pedido.sucursal?.id ?? null,
  sucursalName: pedido.sucursal?.nombre ?? null,
});

export const getMonthKey = (createdAt: string): string => {
  const date = new Date(createdAt);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${date.getFullYear()}-${month}`;
};

export const formatMonthLabel = (monthKey: string): string => {
  const [year, month] = monthKey.split('-');
  const monthIndex = Number(month) - 1;
  return `${MONTHS_ES[monthIndex] ?? month} ${year}`;
};

export const getAvailableMonthKeys = (orders: StatsOrder[]): string[] => {
  const keys = new Set(orders.map(order => getMonthKey(order.createdAt)));
  return Array.from(keys).sort((a, b) => b.localeCompare(a));
};

export const filterStatsOrders = (
  orders: StatsOrder[],
  options: {
    sucursalId?: string | 'all';
    monthKey?: string | 'all';
  },
): StatsOrder[] =>
  orders.filter(order => {
    const matchesSucursal =
      !options.sucursalId ||
      options.sucursalId === 'all' ||
      order.sucursalId === options.sucursalId;

    const matchesMonth =
      !options.monthKey ||
      options.monthKey === 'all' ||
      getMonthKey(order.createdAt) === options.monthKey;

    return matchesSucursal && matchesMonth;
  });

export const computeOrderSummary = (orders: StatsOrder[]): OrderSummary => {
  let revenue = 0;
  let preparing = 0;
  let completed = 0;
  let cancelled = 0;

  for (const order of orders) {
    if (order.status === 'preparing') {
      preparing += 1;
    } else if (order.status === 'completed') {
      completed += 1;
      revenue += order.total;
    } else if (order.status === 'cancelled') {
      cancelled += 1;
    }
  }

  return {
    totalOrders: orders.length,
    revenue,
    preparing,
    completed,
    cancelled,
  };
};

export const computeMonthlyStats = (orders: StatsOrder[]): MonthlyStat[] => {
  const grouped = new Map<string, StatsOrder[]>();

  for (const order of orders) {
    const key = getMonthKey(order.createdAt);
    const bucket = grouped.get(key) ?? [];
    bucket.push(order);
    grouped.set(key, bucket);
  }

  return Array.from(grouped.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([key, monthOrders]) => {
      const summary = computeOrderSummary(monthOrders);
      return {
        key,
        label: formatMonthLabel(key),
        ...summary,
      };
    });
};

export const computeHourlyBuckets = (orders: StatsOrder[]): HourlyBucket[] =>
  HOUR_BUCKETS.map(bucket => {
    const count = orders.filter(order => {
      const hour = new Date(order.createdAt).getHours();
      return hour >= bucket.startHour && hour <= bucket.endHour;
    }).length;

    return {
      label: bucket.label,
      startHour: bucket.startHour,
      count,
    };
  });

export const computeBranchRankings = (
  orders: StatsOrder[],
  sucursales: StatsSucursal[],
): BranchRankingEntry[] => {
  const entries: BranchRankingEntry[] = sucursales.map(sucursal => {
    const branchOrders = orders.filter(order => order.sucursalId === sucursal.id);
    const summary = computeOrderSummary(branchOrders);
    const completionRate =
      summary.totalOrders > 0
        ? Math.round((summary.completed / summary.totalOrders) * 100)
        : 0;
    const averageTicket =
      summary.completed > 0 ? Math.round(summary.revenue / summary.completed) : 0;

    return {
      sucursalId: sucursal.id,
      sucursalName: sucursal.nombre,
      totalOrders: summary.totalOrders,
      revenue: summary.revenue,
      completed: summary.completed,
      completionRate,
      averageTicket,
      rankByOrders: 0,
      rankByRevenue: 0,
      rankByCompletion: 0,
    };
  });

  const rankBy = (selector: (entry: BranchRankingEntry) => number) => {
    const sortedIds = [...entries]
      .sort((a, b) => selector(b) - selector(a))
      .map(entry => entry.sucursalId);
    const rankMap = new Map<string, number>();
    sortedIds.forEach((id, index) => rankMap.set(id, index + 1));
    return rankMap;
  };

  const ordersRank = rankBy(entry => entry.totalOrders);
  const revenueRank = rankBy(entry => entry.revenue);
  const completionRank = rankBy(entry => entry.completionRate);

  return entries
    .map(entry => ({
      ...entry,
      rankByOrders: ordersRank.get(entry.sucursalId) ?? entries.length,
      rankByRevenue: revenueRank.get(entry.sucursalId) ?? entries.length,
      rankByCompletion: completionRank.get(entry.sucursalId) ?? entries.length,
    }))
    .sort((a, b) => a.rankByOrders - b.rankByOrders);
};

export const formatCurrency = (amount: number): string =>
  `$${amount.toLocaleString('es-AR')}`;

export const getPeakHourLabel = (buckets: HourlyBucket[]): string | null => {
  if (buckets.length === 0) {
    return null;
  }

  const peak = buckets.reduce((best, bucket) =>
    bucket.count > best.count ? bucket : best,
  );

  if (peak.count === 0) {
    return null;
  }

  return peak.label;
};
