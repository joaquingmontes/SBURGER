export type AdminOrderStatus = 'preparing' | 'completed' | 'cancelled';

export interface AdminOrderItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  extras: string[];
  notes?: string | null;
}

export interface AdminClientOrder {
  id: string;
  codigo: string;
  customerName: string;
  phone: string;
  deliveryMethod: string;
  address?: string | null;
  sucursalName?: string | null;
  sucursalAddress?: string | null;
  date: string;
  time: string;
  items: AdminOrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  status: AdminOrderStatus;
}

export const ADMIN_ORDER_STATUS_LABELS: Record<AdminOrderStatus, string> = {
  preparing: 'En proceso',
  completed: 'Finalizado',
  cancelled: 'Cancelado',
};
