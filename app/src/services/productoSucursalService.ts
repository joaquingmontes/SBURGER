import { dataConnect } from '../config/firebase';
import {
  createProductoSucursal,
  listSucursales,
} from '@dataconnect/generated';

export const createProductoSucursalPricesForAllBranches = async (
  productoId: string,
  precioBase: number,
): Promise<void> => {
  const response = await listSucursales(dataConnect);
  const sucursales = response.data.sucursals ?? [];

  for (const sucursal of sucursales) {
    await createProductoSucursal(dataConnect, {
      productoId,
      sucursalId: sucursal.id,
      precio: precioBase,
    });
  }
};
