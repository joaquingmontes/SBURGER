import {
  CategoriaProducto,
  EstadoPedido,
  ModalidadEntrega,
} from '@dataconnect/generated';
import { Burger, MenuCategory } from '../constants/mockData';
import { AdminProduct, ProductCategory } from '../constants/adminProducts';
import { DEFAULT_PRODUCT_IMAGE } from '../constants/productImages';
import { Order, OrderItem, OrderStatus } from '../constants/mockOrders';
import { AdminClientOrder, AdminOrderStatus } from '../constants/mockAdminOrders';

const CATEGORY_TO_MENU: Record<CategoriaProducto, MenuCategory> = {
  [CategoriaProducto.HAMBURGUESAS]: 'burgers',
  [CategoriaProducto.PAPAS]: 'fries',
  [CategoriaProducto.BEBIDAS]: 'drinks',
  [CategoriaProducto.POSTRES]: 'desserts',
};

const MENU_TO_CATEGORY: Record<MenuCategory, CategoriaProducto> = {
  burgers: CategoriaProducto.HAMBURGUESAS,
  fries: CategoriaProducto.PAPAS,
  drinks: CategoriaProducto.BEBIDAS,
  desserts: CategoriaProducto.POSTRES,
};

const ADMIN_CATEGORY_TO_FIREBASE: Record<ProductCategory, CategoriaProducto> = {
  Hamburguesas: CategoriaProducto.HAMBURGUESAS,
  Papas: CategoriaProducto.PAPAS,
  Bebidas: CategoriaProducto.BEBIDAS,
  Postres: CategoriaProducto.POSTRES,
};

const FIREBASE_CATEGORY_TO_ADMIN: Record<CategoriaProducto, ProductCategory> = {
  [CategoriaProducto.HAMBURGUESAS]: 'Hamburguesas',
  [CategoriaProducto.PAPAS]: 'Papas',
  [CategoriaProducto.BEBIDAS]: 'Bebidas',
  [CategoriaProducto.POSTRES]: 'Postres',
};

const ESTADO_TO_ORDER_STATUS: Record<EstadoPedido, OrderStatus> = {
  [EstadoPedido.PREPARING]: 'preparing',
  [EstadoPedido.COMPLETED]: 'completed',
  [EstadoPedido.CANCELLED]: 'cancelled',
};

const ORDER_STATUS_TO_ESTADO: Record<AdminOrderStatus, EstadoPedido> = {
  preparing: EstadoPedido.PREPARING,
  completed: EstadoPedido.COMPLETED,
  cancelled: EstadoPedido.CANCELLED,
};

const MONTHS_ES = [
  'ene',
  'feb',
  'mar',
  'abr',
  'may',
  'jun',
  'jul',
  'ago',
  'sep',
  'oct',
  'nov',
  'dic',
];

export const mapProductoToBurger = (producto: {
  id: string;
  nombre: string;
  descripcion: string;
  ingredientes?: string | null;
  precio: number;
  categoria: CategoriaProducto;
  imagenUrl: string;
}): Burger => ({
  id: producto.id,
  name: producto.nombre,
  description: producto.descripcion,
  ingredients: producto.ingredientes ?? producto.descripcion,
  price: producto.precio,
  image: producto.imagenUrl,
  category: CATEGORY_TO_MENU[producto.categoria],
});

export const mapProductoToAdminProduct = (producto: {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: CategoriaProducto;
  imagenUrl: string;
}): AdminProduct => ({
  id: producto.id,
  name: producto.nombre,
  description: producto.descripcion,
  price: producto.precio,
  category: FIREBASE_CATEGORY_TO_ADMIN[producto.categoria],
  image: producto.imagenUrl,
});

export const mapAdminProductToFirebase = (product: AdminProduct) => ({
  nombre: product.name,
  descripcion: product.description,
  ingredientes: product.category === 'Hamburguesas' ? product.description : null,
  precio: product.price,
  categoria: ADMIN_CATEGORY_TO_FIREBASE[product.category],
  imagenUrl: product.image.trim() || DEFAULT_PRODUCT_IMAGE,
});

export const matchesMenuCategory = (
  category: MenuCategory,
  selectedCategory: string,
): boolean => selectedCategory === category;

export const formatFirebaseDateTime = (createdAt: string): string => {
  const date = new Date(createdAt);
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const period = hours >= 12 ? 'p. m.' : 'a. m.';
  const hour12 = hours % 12 || 12;

  return `${date.getDate()} de ${MONTHS_ES[date.getMonth()]} de ${date.getFullYear()}, ${hour12}:${minutes} ${period}`;
};

export const formatFirebaseDate = (createdAt: string): string => {
  const date = new Date(createdAt);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${day}/${month}/${date.getFullYear()}`;
};

export const formatFirebaseTime = (createdAt: string): string => {
  const date = new Date(createdAt);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

const buildItemExtras = (item: {
  extraMedallon: number;
  extraCheddar: number;
  extraPanceta: number;
  extraCebolla: number;
}): string[] => {
  const extras: string[] = [];

  if (item.extraMedallon > 0) {
    extras.push(`${item.extraMedallon}x Medallón`);
  }
  if (item.extraCheddar > 0) {
    extras.push(`${item.extraCheddar}x Cheddar extra`);
  }
  if (item.extraPanceta > 0) {
    extras.push(`${item.extraPanceta}x Panceta extra`);
  }
  if (item.extraCebolla > 0) {
    extras.push(`${item.extraCebolla}x Cebolla extra`);
  }

  return extras;
};

const buildModifiers = (item: {
  extraMedallon: number;
  extraCheddar: number;
  extraPanceta: number;
  extraCebolla: number;
  notas?: string | null;
}): string[] => {
  const modifiers = buildItemExtras(item);

  if (item.notas) {
    modifiers.push(item.notas);
  }

  return modifiers;
};

export const mapPedidoToOrder = (pedido: {
  codigo: string;
  estado: EstadoPedido;
  total: number;
  modalidadEntrega: ModalidadEntrega;
  nombreContacto: string;
  telefonoContacto: string;
  direccion?: string | null;
  createdAt: string;
  pedidoItems_on_pedido: Array<{
    nombreProducto: string;
    cantidad: number;
    precioUnitario: number;
    precioTotalLinea: number;
    extraMedallon: number;
    extraCheddar: number;
    extraPanceta: number;
    extraCebolla: number;
    notas?: string | null;
  }>;
}): Order => {
  const items: OrderItem[] = pedido.pedidoItems_on_pedido.map(item => ({
    quantity: item.cantidad,
    name: item.nombreProducto,
    price: item.precioTotalLinea,
    modifiers: buildModifiers(item),
  }));

  const unitCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return {
    id: pedido.codigo,
    status: ESTADO_TO_ORDER_STATUS[pedido.estado],
    dateTime: formatFirebaseDateTime(pedido.createdAt),
    productCount: items.length,
    unitCount,
    total: pedido.total,
    items,
    delivery: {
      name: pedido.nombreContacto,
      phone: pedido.telefonoContacto,
      method:
        pedido.modalidadEntrega === ModalidadEntrega.DELIVERY
          ? 'Delivery'
          : 'Retiro en local',
    },
  };
};

export const mapPedidoToAdminOrder = (pedido: {
  id: string;
  codigo: string;
  estado: EstadoPedido;
  subtotal: number;
  costoEnvio: number;
  total: number;
  modalidadEntrega: ModalidadEntrega;
  nombreContacto: string;
  telefonoContacto: string;
  direccion?: string | null;
  createdAt: string;
  pedidoItems_on_pedido: Array<{
    id: string;
    nombreProducto: string;
    cantidad: number;
    precioUnitario: number;
    precioTotalLinea: number;
    extraMedallon: number;
    extraCheddar: number;
    extraPanceta: number;
    extraCebolla: number;
    notas?: string | null;
  }>;
}): AdminClientOrder => ({
  id: pedido.id,
  codigo: pedido.codigo,
  customerName: pedido.nombreContacto,
  phone: pedido.telefonoContacto,
  deliveryMethod:
    pedido.modalidadEntrega === ModalidadEntrega.DELIVERY
      ? 'Delivery'
      : 'Retiro en local',
  address: pedido.direccion,
  date: formatFirebaseDate(pedido.createdAt),
  time: formatFirebaseTime(pedido.createdAt),
  items: pedido.pedidoItems_on_pedido.map(item => ({
    id: item.id,
    name: item.nombreProducto,
    quantity: item.cantidad,
    unitPrice: item.precioUnitario,
    lineTotal: item.precioTotalLinea,
    extras: buildItemExtras(item),
    notes: item.notas,
  })),
  subtotal: pedido.subtotal,
  shippingCost: pedido.costoEnvio,
  total: pedido.total,
  status: ESTADO_TO_ORDER_STATUS[pedido.estado] as AdminOrderStatus,
});

export const mapAdminStatusToFirebase = (
  status: AdminOrderStatus,
): EstadoPedido => ORDER_STATUS_TO_ESTADO[status];

export { MENU_TO_CATEGORY };
