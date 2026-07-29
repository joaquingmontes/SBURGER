import { QueryClient } from '@tanstack/react-query';
import { QueryFetchPolicy } from 'firebase/data-connect';
import {
  listProductosActivos,
  listProductosAdmin,
  ListProductosActivosData,
  ListProductosAdminData,
} from '@dataconnect/generated';
import { dataConnect } from '../config/firebase';
import { mapAdminProductToFirebase } from './firebaseMappers';
import { AdminProduct } from '../constants/adminProducts';

const SERVER_ONLY = { fetchPolicy: QueryFetchPolicy.SERVER_ONLY };

type ProductoWithId = { id: string };

export const preserveProductListOrder = <T extends ProductoWithId>(
  previous: T[] | undefined,
  next: T[],
): T[] => {
  if (!previous?.length) {
    return next;
  }

  const nextById = new Map(next.map(item => [item.id, item]));
  const ordered: T[] = [];

  for (const item of previous) {
    const updated = nextById.get(item.id);
    if (updated) {
      ordered.push(updated);
      nextById.delete(item.id);
    }
  }

  return [...ordered, ...nextById.values()];
};

export const fetchAdminProductsFromServer = async (): Promise<
  ListProductosAdminData | undefined
> => {
  const response = await listProductosAdmin(dataConnect, SERVER_ONLY);
  return response.data;
};

export const applyAdminProductsToCache = (
  queryClient: QueryClient,
  data: ListProductosAdminData | undefined,
  options?: { preserveOrder?: boolean },
): void => {
  if (!data?.productos) {
    return;
  }

  let productos = data.productos;

  if (options?.preserveOrder) {
    const previous = queryClient.getQueriesData<ListProductosAdminData>({
      queryKey: ['ListProductosAdmin'],
    })[0]?.[1];
    productos = preserveProductListOrder(previous?.productos, productos);
  }

  queryClient.setQueriesData<ListProductosAdminData>(
    { queryKey: ['ListProductosAdmin'] },
    { productos },
  );
};

export const applyActiveProductsToCache = async (
  queryClient: QueryClient,
  options?: { preserveOrder?: boolean },
): Promise<void> => {
  const response = await listProductosActivos(dataConnect, SERVER_ONLY);

  if (!response.data?.productos) {
    return;
  }

  let productos = response.data.productos;

  if (options?.preserveOrder) {
    const previous = queryClient.getQueriesData<ListProductosActivosData>({
      queryKey: ['ListProductosActivos'],
    })[0]?.[1];
    productos = preserveProductListOrder(previous?.productos, productos);
  }

  queryClient.setQueriesData<ListProductosActivosData>(
    { queryKey: ['ListProductosActivos'] },
    { productos },
  );
};

export const reloadProductsFromServer = async (
  queryClient: QueryClient,
  refetchAdmin?: () => Promise<unknown>,
): Promise<void> => {
  let synced = false;

  try {
    const adminData = await fetchAdminProductsFromServer();
    applyAdminProductsToCache(queryClient, adminData, { preserveOrder: true });
    await applyActiveProductsToCache(queryClient, { preserveOrder: true });
    synced = true;
  } catch {
    // Si falla el fetch directo, invalidamos y dejamos que el hook refetch.
  }

  await queryClient.invalidateQueries({
    queryKey: ['ListProductosAdmin'],
    refetchType: synced ? 'none' : 'active',
  });
  await queryClient.invalidateQueries({
    queryKey: ['ListProductosActivos'],
    refetchType: synced ? 'none' : 'active',
  });

  if (refetchAdmin && !synced) {
    await refetchAdmin();
  }
};

export const findProductIdOnServer = (
  data: ListProductosAdminData | undefined,
  target: AdminProduct,
): string | undefined => {
  const activos = (data?.productos ?? []).filter(item => item.activo);

  if (target.id) {
    const byId = activos.find(item => item.id === target.id);
    if (byId?.id) {
      return byId.id;
    }
  }

  const exactMatch = activos.find(
    item =>
      item.nombre === target.name &&
      item.precio === target.price &&
      item.descripcion === target.description,
  );
  if (exactMatch?.id) {
    return exactMatch.id;
  }

  return activos.find(item => item.nombre === target.name && item.precio === target.price)
    ?.id;
};

export const patchAdminProductInCache = (
  queryClient: QueryClient,
  product: AdminProduct,
): void => {
  if (!product.id) {
    return;
  }

  const payload = mapAdminProductToFirebase(product);

  queryClient.setQueriesData<ListProductosAdminData>(
    { queryKey: ['ListProductosAdmin'] },
    old => {
      if (!old) {
        return old;
      }

      return {
        ...old,
        productos: old.productos.map(item =>
          item.id === product.id
            ? {
                ...item,
                nombre: payload.nombre,
                descripcion: payload.descripcion,
                ingredientes: payload.ingredientes,
                precio: payload.precio,
                categoria: payload.categoria,
                imagenUrl: payload.imagenUrl,
              }
            : item,
        ),
      };
    },
  );
};

export const patchActiveProductInCache = (
  queryClient: QueryClient,
  product: AdminProduct,
): void => {
  if (!product.id) {
    return;
  }

  const payload = mapAdminProductToFirebase(product);

  queryClient.setQueriesData<ListProductosActivosData>(
    { queryKey: ['ListProductosActivos'] },
    old => {
      if (!old) {
        return old;
      }

      return {
        ...old,
        productos: old.productos.map(item =>
          item.id === product.id
            ? {
                ...item,
                nombre: payload.nombre,
                descripcion: payload.descripcion,
                ingredientes: payload.ingredientes,
                precio: payload.precio,
                categoria: payload.categoria,
                imagenUrl: payload.imagenUrl,
              }
            : item,
        ),
      };
    },
  );
};

export const syncProductCachesAfterEdit = (
  queryClient: QueryClient,
  product: AdminProduct,
): void => {
  patchAdminProductInCache(queryClient, product);
  patchActiveProductInCache(queryClient, product);
};

export const refreshAllProductsFromServer = reloadProductsFromServer;
