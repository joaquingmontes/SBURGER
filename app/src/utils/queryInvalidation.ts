import { QueryClient } from '@tanstack/react-query';

export const invalidateOrdersQueries = async (
  queryClient: QueryClient,
): Promise<void> => {
  await queryClient.invalidateQueries({
    predicate: query =>
      query.queryKey[0] === 'ListPedidosAdmin' ||
      query.queryKey[0] === 'ListMyPedidos',
  });
};

export const invalidateUserOrdersQueries = async (
  queryClient: QueryClient,
): Promise<void> => {
  await queryClient.invalidateQueries({
    predicate: query => query.queryKey[0] === 'ListMyPedidos',
  });
};

export const invalidateProductsQueries = async (
  queryClient: QueryClient,
): Promise<void> => {
  await queryClient.invalidateQueries({
    predicate: query =>
      query.queryKey[0] === 'ListProductosActivos' ||
      query.queryKey[0] === 'ListProductosAdmin' ||
      query.queryKey[0] === 'GetProductoById',
  });
};

export const invalidateAllFirebaseQueries = async (
  queryClient: QueryClient,
): Promise<void> => {
  await queryClient.invalidateQueries();
};
