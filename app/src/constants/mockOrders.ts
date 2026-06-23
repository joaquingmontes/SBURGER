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

export const MOCK_ORDERS: Order[] = [
  {
    id: 'SB-37827',
    status: 'preparing',
    dateTime: '21 de jun de 2026, 05:25 p. m.',
    productCount: 1,
    unitCount: 1,
    total: 4800,
    items: [
      {
        quantity: 1,
        name: 'Stack Veggie Premium',
        price: 4800,
      },
    ],
    delivery: {
      name: 'Yamil Tundis',
      phone: '11939393939',
      method: 'Retiro en local',
    },
  },
  {
    id: 'SB-37828',
    status: 'completed',
    dateTime: '20 de jun de 2026, 08:35 p. m.',
    productCount: 1,
    unitCount: 2,
    total: 5200,
    items: [
      {
        quantity: 1,
        name: 'Stack Bacon & Cheddar',
        price: 5200,
        modifiers: ['1x Medallón'],
      },
    ],
    delivery: {
      name: 'Yamil Tundis',
      phone: '11939393939',
      method: 'Delivery',
    },
  },
  {
    id: 'SB-37820',
    status: 'cancelled',
    dateTime: '18 de jun de 2026, 01:15 p. m.',
    productCount: 1,
    unitCount: 1,
    total: 4500,
    items: [
      {
        quantity: 1,
        name: 'Stack Simple',
        price: 4500,
      },
    ],
    delivery: {
      name: 'Yamil Tundis',
      phone: '11939393939',
      method: 'Retiro en local',
    },
  },
];

export const ORDER_FILTERS: { id: OrderFilter; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'preparing', label: 'En preparación' },
  { id: 'completed', label: 'Finalizado' },
  { id: 'cancelled', label: 'Cancelado' },
];
