import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const products = [
  '64780aa7-cf4b-42b6-bf02-a6d724636ced',
  'b902a4d1-b6db-4ada-95b1-9e6f88934c32',
  '17b00530-4309-4395-be54-16e68ecbf914',
  '74eb4b57-362e-4bbc-8c84-07505e98c7a2',
];

const sucursales = [
  '44444444-4444-4444-4444-444444444401',
  '44444444-4444-4444-4444-444444444402',
  '44444444-4444-4444-4444-444444444403',
  '44444444-4444-4444-4444-444444444404',
  '44444444-4444-4444-4444-444444444405',
];

let seed07 =
  'mutation SeedProductoSucursalExtra @auth(level: PUBLIC, insecureReason: "Productos adicionales por sucursal") {\n\n';

const ids07 = [];

products.forEach((productoId, productIndex) => {
  sucursales.forEach((sucursalId, sucursalIndex) => {
    const productSuffix = String(productIndex + 1).padStart(2, '0');
    const sucursalSuffix = String(sucursalIndex + 1).padStart(2, '0');
    const id = `66666666-6666-6666-6666-6666${productSuffix}${sucursalSuffix}0001`;
    ids07.push(id);

    seed07 += `  ps_extra_p${productSuffix}_s${sucursalSuffix}: productoSucursal_insert(
    data: {
      id: "${id}"
      productoId: "${productoId}"
      sucursalId: "${sucursalId}"
      precio: 4500
      estado: ACTIVO
    }
  )

`;
  });
});

seed07 += '}\n';

const ids05 = [];

for (let product = 1; product <= 16; product += 1) {
  for (let sucursal = 1; sucursal <= 5; sucursal += 1) {
    const productSuffix = String(product).padStart(2, '0');
    const sucursalSuffix = String(sucursal).padStart(2, '0');
    ids05.push(`55555555-5555-5555-5555-5555${productSuffix}${sucursalSuffix}0000`);
  }
}

const allIds = [...ids05, ...ids07].sort();

let seed08 =
  'mutation SeedProductoSucursalEstados @auth(level: PUBLIC, insecureReason: "Distribucion de estados ProductoSucursal") {\n\n';

allIds.forEach((id, index) => {
  let estado = 'ACTIVO';

  if (index >= 90 && index < 95) {
    estado = 'SIN_STOCK';
  } else if (index >= 95) {
    estado = 'INEXISTENTE';
  }

  seed08 += `  ps_est_${String(index + 1).padStart(3, '0')}: productoSucursal_update(id: "${id}", data: { estado: ${estado} })\n\n`;
});

seed08 += '}\n';

for (const folder of ['dataconnect', 'dataconnect.example']) {
  const target = path.join(root, folder);
  fs.writeFileSync(path.join(target, 'seed_07_productos_extra_sucursales.gql'), seed07);
  fs.writeFileSync(path.join(target, 'seed_08_producto_sucursal_estados.gql'), seed08);
}

console.log(`Generated seed files with ${allIds.length} estado updates.`);
