import { dataConnect } from '../config/firebase';
import {
  createProductoSucursal,
  EstadoProductoSucursal,
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
      estado: EstadoProductoSucursal.ACTIVO,
    });
  }
};

export const createProductoSucursalForNewBranch = async (
  sucursalId: string,
  productos: Array<{ id: string; precio: number }>,
): Promise<void> => {
  for (const producto of productos) {
    await createProductoSucursal(dataConnect, {
      productoId: producto.id,
      sucursalId,
      precio: producto.precio,
      estado: EstadoProductoSucursal.ACTIVO,
    });
  }
};
