import {
  createPedido,
  createPedidoItem,
  ModalidadEntrega,
  updatePedidoEstado,
} from '@dataconnect/generated';
import { dataConnect } from '../config/firebase';
import { CartItem } from '../context/CartContext';
import { AdminOrderStatus } from '../constants/mockAdminOrders';
import { mapAdminStatusToFirebase } from '../utils/firebaseMappers';

export interface CreateOrderInput {
  usuarioId: string;
  sucursalId: string;
  codigo: string;
  subtotal: number;
  costoEnvio: number;
  total: number;
  modalidadEntrega: ModalidadEntrega;
  nombreContacto: string;
  telefonoContacto: string;
  direccion?: string | null;
  items: CartItem[];
}

export const createOrderInFirebase = async (
  input: CreateOrderInput,
): Promise<{ pedidoId: string; codigo: string }> => {
  const pedidoResult = await createPedido(dataConnect, {
    codigo: input.codigo,
    usuarioId: input.usuarioId,
    sucursalId: input.sucursalId,
    subtotal: input.subtotal,
    costoEnvio: input.costoEnvio,
    total: input.total,
    modalidadEntrega: input.modalidadEntrega,
    nombreContacto: input.nombreContacto,
    telefonoContacto: input.telefonoContacto,
    direccion: input.direccion ?? null,
  });

  const pedidoId = pedidoResult.data.pedido_insert.id;

  for (const item of input.items) {
    await createPedidoItem(dataConnect, {
      pedidoId,
      productoId: item.burger.id,
      nombreProducto: item.burger.name,
      cantidad: item.quantity,
      precioUnitario: item.itemPrice,
      precioTotalLinea: item.totalPrice,
      extraMedallon: item.customizations.medallon,
      extraCheddar: item.customizations.cheddar,
      extraPanceta: item.customizations.panceta,
      extraCebolla: item.customizations.cebolla,
      notas: item.notes || null,
    });
  }

  return { pedidoId, codigo: input.codigo };
};

export const generateOrderCode = (): string =>
  `SB-${Math.floor(Math.random() * 90000) + 10000}`;

export const updateOrderStatusInFirebase = async (
  orderId: string,
  status: AdminOrderStatus,
): Promise<void> => {
  await updatePedidoEstado(dataConnect, {
    id: orderId,
    estado: mapAdminStatusToFirebase(status),
  });
};
