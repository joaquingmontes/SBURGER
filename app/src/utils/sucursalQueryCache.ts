import { QueryClient } from '@tanstack/react-query';
import { QueryFetchPolicy } from 'firebase/data-connect';
import {
  listSucursales,
  listSucursalesRef,
  ListSucursalesData,
} from '@dataconnect/generated';
import { dataConnect } from '../config/firebase';

const SERVER_ONLY = { fetchPolicy: QueryFetchPolicy.SERVER_ONLY };

export const getSucursalesQueryKey = () =>
  [listSucursalesRef(dataConnect).name, null] as const;

export const refreshSucursalesFromServer = async (
  queryClient: QueryClient,
): Promise<ListSucursalesData> => {
  const { data } = await listSucursales(dataConnect, SERVER_ONLY);
  queryClient.setQueryData(getSucursalesQueryKey(), data);
  return data;
};
