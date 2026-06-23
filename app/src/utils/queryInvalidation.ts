import { QueryClient } from '@tanstack/react-query';
import {
  refreshAdminOrdersFromServer,
  refreshCachedUserOrdersFromServer,
} from './orderQueryCache';

export const invalidateOrdersQueries = async (
  queryClient: QueryClient,
): Promise<void> => {
  await queryClient.invalidateQueries({
    predicate: query =>
      query.queryKey[0] === 'ListPedidosAdmin' ||
      query.queryKey[0] === 'ListMyPedidos',
  });

  await Promise.all([
    refreshAdminOrdersFromServer(queryClient),
    refreshCachedUserOrdersFromServer(queryClient),
  ]);
};

const isProductsQuery = (queryKey: unknown): boolean => {
  const key = queryKey[0];
  return key === 'ListProductosActivos' || key === 'ListProductosAdmin';
};

const isProductDetailQuery = (queryKey: unknown): boolean => {
  return queryKey[0] === 'GetProductoById';
};

export const invalidateProductsQueries = async (
  queryClient: QueryClient,
): Promise<void> => {
  await queryClient.invalidateQueries({
    predicate: query =>
      isProductsQuery(query.queryKey) || isProductDetailQuery(query.queryKey),
  });
  await queryClient.refetchQueries({
    predicate: query =>
      isProductsQuery(query.queryKey) || isProductDetailQuery(query.queryKey),
  });
};

export const invalidateAllFirebaseQueries = async (
  queryClient: QueryClient,
): Promise<void> => {
  await queryClient.invalidateQueries();
  await queryClient.refetchQueries({ type: 'active' });
};
