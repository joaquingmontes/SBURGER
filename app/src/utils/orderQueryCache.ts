import { QueryClient } from '@tanstack/react-query';
import { QueryFetchPolicy } from 'firebase/data-connect';
import {
  listPedidosAdmin,
  listPedidosAdminRef,
  listPedidosByUsuario,
  ListPedidosAdminData,
} from '@dataconnect/generated';
import { dataConnect } from '../config/firebase';
import { AdminOrderStatus } from '../constants/mockAdminOrders';
import { mapAdminStatusToFirebase } from './firebaseMappers';

const SERVER_ONLY = { fetchPolicy: QueryFetchPolicy.SERVER_ONLY };

export const getAdminOrdersQueryKey = () =>
  [listPedidosAdminRef(dataConnect).name, null] as const;

export const patchAdminOrderStatusInCache = (
  queryClient: QueryClient,
  orderId: string,
  status: AdminOrderStatus,
): ListPedidosAdminData | undefined => {
  const queryKey = getAdminOrdersQueryKey();
  const previousData = queryClient.getQueryData<ListPedidosAdminData>(queryKey);

  queryClient.setQueryData<ListPedidosAdminData>(queryKey, old => {
    if (!old) {
      return old;
    }

    const firebaseStatus = mapAdminStatusToFirebase(status);

    return {
      ...old,
      pedidos: old.pedidos.map(pedido =>
        pedido.id === orderId
          ? { ...pedido, estado: firebaseStatus }
          : pedido,
      ),
    };
  });

  return previousData;
};

export const refreshAdminOrdersFromServer = async (
  queryClient: QueryClient,
): Promise<void> => {
  const { data } = await listPedidosAdmin(dataConnect, SERVER_ONLY);
  queryClient.setQueryData(getAdminOrdersQueryKey(), data);
};

export const refreshCachedUserOrdersFromServer = async (
  queryClient: QueryClient,
): Promise<void> => {
  const cachedQueries = queryClient.getQueriesData({
    predicate: query => query.queryKey[0] === 'ListPedidosByUsuario',
  });

  await Promise.all(
    cachedQueries.map(async ([queryKey]) => {
      const variables = queryKey[1] as { usuarioId?: string } | null;
      const usuarioId = variables?.usuarioId;

      if (!usuarioId) {
        return;
      }

      const { data } = await listPedidosByUsuario(
        dataConnect,
        { usuarioId },
        SERVER_ONLY,
      );
      queryClient.setQueryData(queryKey, data);
    }),
  );
};

export const refreshUserOrdersFromServer = async (
  queryClient: QueryClient,
  usuarioId: string,
): Promise<void> => {
  const queryKey = ['ListPedidosByUsuario', { usuarioId }] as const;
  const { data } = await listPedidosByUsuario(
    dataConnect,
    { usuarioId },
    SERVER_ONLY,
  );
  queryClient.setQueryData(queryKey, data);
};
