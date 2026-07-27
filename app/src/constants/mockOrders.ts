export type OrderStatus = 'preparing' | 'completed' | 'cancelled';

export type OrderFilter = 'all' | OrderStatus;

export interface OrderItem {
  quantity: number;
  name: string;
  price: number;
  modifiers?: string[];
}

export interface DeliveryInfo {
  name: string;
  phone: string;
  method: string;
  branchName?: string | null;
  branchAddress?: string | null;
}

export interface Order {
  id: string;
  status: OrderStatus;
  dateTime: string;
  productCount: number;
  unitCount: number;
  total: number;
  items: OrderItem[];
  delivery: DeliveryInfo;
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  preparing: 'En preparación',
  completed: 'Finalizado',
  cancelled: 'Cancelado',
};

export const ORDER_FILTERS: { id: OrderFilter; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'preparing', label: 'En preparación' },
  { id: 'completed', label: 'Finalizado' },
  { id: 'cancelled', label: 'Cancelado' },
];
