# Registro de Interacciones con la IA · StackBurger E3

* **Materia:** Desarrollo de Aplicaciones Móviles  
* **Entrega:** Entrega 3 — Producto Final Escalado (E3)  
* **Asistente de IA:** Asistente de Desarrollo (Cursor)  

* **Archivo de Entrega:** `/ia/entrega-3/conversaciones.md`

---

## 📌 Índice de Temas Consultados

1. [Consulta 1: Precio por sucursal y pedido asociado a sucursal](#consulta-1-precio-por-sucursal-y-pedido-asociado-a-sucursal)
2. [Consulta 2: Deploy y migración Firebase Data Connect](#consulta-2-deploy-y-migración-firebase-data-connect)
3. [Consulta 3: Selección obligatoria de sucursal y precios por sucursal en cliente](#consulta-3-selección-obligatoria-de-sucursal-y-precios-por-sucursal-en-cliente)
4. [Consulta 4: Modal de sucursal, corrección de precios y crash al personalizar producto](#consulta-4-modal-de-sucursal-corrección-de-precios-y-crash-al-personalizar-producto)
5. [Consulta 5: Filtros de sucursal y estado en pedidos de clientes (admin)](#consulta-5-filtros-de-sucursal-y-estado-en-pedidos-de-clientes-admin)
6. [Consulta 6: Estado de producto por sucursal (Activo, Sin stock, Inexistente)](#consulta-6-estado-de-producto-por-sucursal-activo-sin-stock-inexistente)
7. [Consulta 7: Pantalla de estadísticas del negocio para administradores](#consulta-7-pantalla-de-estadísticas-del-negocio-para-administradores)
8. [Consulta 8: Recálculo de estadísticas al acceder a la pantalla](#consulta-8-recálculo-de-estadísticas-al-acceder-a-la-pantalla)
9. [Consulta 9: Crear sucursal desde admin con precios y estados por defecto](#consulta-9-crear-sucursal-desde-admin-con-precios-y-estados-por-defecto)
10. [Consulta 10: Sucursales dinámicas, filtros desplegables y validaciones de formularios](#consulta-10-sucursales-dinámicas-filtros-desplegables-y-validaciones-de-formularios)

---

_Exported on 7/29/2026 at 16:53:56 GMT-3 from Cursor (3.12.17)_

---

### Consulta 1: Precio por sucursal y pedido asociado a sucursal

**User**

# Tarea: Precio por sucursal + pedido asociado a sucursal (StackBurger — entrega-3)
## Contexto del proyecto
- Repo: SBURGER (React Native 0.85.3 + Firebase Auth + Firebase Data Connect + PostgreSQL)
- Rama de trabajo: **`entrega-3`** (NO tocar `entrega-2`)
- Backend: `dataconnect/` (gitignored en entrega-2; en entrega-3 está trackeado)
- App en: `app/`
- Ya existe tabla `Sucursal` con seed de 5 locales en `dataconnect/seed_04_sucursales.gql`:
  - Centro La Plata — Av 1 y 60 — id `44444444-4444-4444-4444-444444444401`
  - Beriso — Av 4 490 — id `44444444-4444-4444-4444-444444444402`
  - Quilmes — Av Mitre 20190 — id `44444444-4444-4444-4444-444444444403`
  - Berazategui — Calle 14 y 5 — id `44444444-4444-4444-4444-444444444404`
  - Palermo — Av Libertador 122 — id `44444444-4444-4444-4444-444444444405`
## Objetivo funcional
1. Cada **producto** puede tener un **precio distinto por sucursal**.
2. Cada **pedido** debe estar asociado a **una sucursal específica**.
3. Cada **PedidoItem** debe guardar el **precio cobrado en esa sucursal** al momento del pedido (snapshot en `precioUnitario` / `precioTotalLinea` — ya existen en el schema).
## Cambios de schema (Firebase Data Connect)
En `dataconnect/schema/schema.gql`:
1. Agregar tabla intermedia:
```graphql
type ProductoSucursal @table {
  producto: Producto!
  sucursal: Sucursal!
  precio: Int!
}
En Pedido, agregar relación a sucursal:

Primero nullable para migración: sucursal: Sucursal
Después del backfill, si aplica: sucursal: Sucursal!
Mantener Producto.precio como precio base/fallback (no eliminar sin plan de migración).

PedidoItem NO necesita campo extra de precio por sucursal si al crear el pedido se copia el precio de ProductoSucursal a precioUnitario.

Queries y mutations (dataconnect/connector/)
Agregar/actualizar:

Query para listar productos con precio por sucursal (ej. ListProductosPorSucursal($sucursalId: UUID!))
Actualizar CreatePedido para recibir $sucursalId: UUID!
Mutations CRUD admin para ProductoSucursal (crear/actualizar precio por sucursal)
Incluir sucursal { id nombre direccion } en queries de pedidos admin y cliente si corresponde
Migración de datos existentes
Crear dataconnect/seed_05_migracion_sucursales.gql (o script equivalente) que:

ProductoSucursal: para cada producto activo × cada sucursal, insertar registro con precio = Producto.precio actual (mismo precio en todas las sucursales al inicio).
Pedido: asignar sucursalId default a todos los pedidos existentes sin sucursal → usar Centro La Plata (44444444-4444-4444-4444-444444444401).
PedidoItem: NO reescribir precios históricos; validar que sean consistentes con el precio migrado, pero el snapshot del pedido manda.
Actualizar scripts/seed-firebase.ps1 para incluir el paso de migración si corresponde.

Deploy:

npx firebase-tools dataconnect:sql:migrate --force
npx firebase-tools deploy --only dataconnect
npx firebase-tools dataconnect:execute dataconnect/seed_05_migracion_sucursales.gql
powershell -File scripts\generate-dataconnect-sdk.ps1
Cambios en la app (app/src/)
Selección de sucursal antes o al inicio del flujo cliente (Home o Checkout): guardar sucursal seleccionada en contexto o estado global.
Catálogo: cargar precios desde ProductoSucursal según sucursal elegida (no solo Producto.precio).
Carrito: usar precios de la sucursal activa.
Checkout / orderService.ts: pasar sucursalId a CreatePedido; al crear cada PedidoItem, usar precio de esa sucursal en precioUnitario.
Admin productos: permitir editar precio por sucursal (tabla o formulario por local).
Mappers (firebaseMappers.ts): adaptar si cambia la forma del catálogo.
Mantener convenciones del repo (TypeScript, React Query, Context API).
Archivos clave a revisar
dataconnect/schema/schema.gql
dataconnect/connector/queries.gql
dataconnect/connector/mutations.gql
dataconnect/seed_04_sucursales.gql
app/src/services/orderService.ts
app/src/screens/CheckoutScreen.tsx
app/src/screens/HomeScreen.tsx
app/src/screens/AdminProductsScreen.tsx
app/src/context/CartContext.tsx
dataconnect.example/ — mantener sincronizado con dataconnect/
Restricciones
Trabajar en rama entrega-3
No romper flujos de E2 (auth, admin pedidos/productos, historial cliente)
No commitear secretos (firebaseConfig.ts, credenciales)
Cambios mínimos y enfocados; seguir estilo existente del código
Probar que compile tras regenerar SDK
Criterios de aceptación
 Existe ProductoSucursal en DB con precios para productos × sucursales
 Pedidos nuevos requieren y guardan sucursalId
 Pedidos viejos tienen sucursal default asignada
 PedidoItem guarda precio de la sucursal al confirmar

---

**Cursor**

Implementando precio por sucursal y pedidos asociados a sucursal. Explorando el código actual para aplicar los cambios de forma coherente.


Implementando los cambios de schema, queries, migración y la app.


Generando el seed de migración y actualizando los scripts.


## Implementación completada (rama `entrega-3`)

### Backend — Data Connect

**Schema** (`dataconnect/schema/schema.gql` + `dataconnect.example/`):
- Nueva tabla `ProductoSucursal` (producto + sucursal + precio)
- `Pedido.sucursal` nullable (para migración; luego puede hacerse required)

**Queries nuevas/actualizadas:**
- `ListProductosPorSucursal($sucursalId)` — catálogo con precio por sucursal
- `ListProductoSucursalByProducto($productoId)` — admin
- `ListMyPedidos` / `ListPedidosAdmin` — incluyen `sucursal { id nombre direccion }`

**Mutations:**
- `CreatePedido` ahora requiere `$sucursalId`
- `CreateProductoSucursal` / `UpdateProductoSucursal`

**Migración:** `dataconnect/seed_05_migracion_sucursales.gql`
- 80 registros `ProductoSucursal` (16 productos × 5 sucursales, mismo precio base)
- 6 pedidos existentes → sucursal default **Centro La Plata**

**Scripts:** `scripts/seed-firebase.ps1` y `.example` incluyen el paso 05.

### App

- **`SucursalContext`** — selección de sucursal global; al cambiar vacía el carrito si hay ítems
- **`HomeScreen`** — selector de sucursal + catálogo vía `ListProductosPorSucursal`
- **`CheckoutScreen`** — muestra sucursal y envía `sucursalId` al crear pedido
- **`orderService`** — pasa `sucursalId` a `CreatePedido`
- **Admin productos** — botón `$` por producto → modal de precios por sucursal; al crear producto se generan precios en todas las sucursales
- **Pedidos** — sucursal visible en admin, detalle admin e historial cliente
- **SDK regenerado** con `scripts/generate-dataconnect-sdk.ps1`

### Deploy pendiente (en tu entorno Firebase)

```powershell
npx firebase-tools dataconnect:sql:migrate --force
npx firebase-tools deploy --only dataconnect
npx firebase-tools dataconnect:execute dataconnect/seed_05_migracion_sucursales.gql
powershell -File scripts\generate-dataconnect-sdk.ps1
```

O todo el seed: `powershell -File scripts\seed-firebase.ps1` (incluye migración al final).

### Criterios de aceptación

| Criterio | Estado |
|---|---|
| `ProductoSucursal` con precios producto × sucursal | Seed 05 listo |
| Pedidos nuevos requieren y guardan `sucursalId` | `CreatePedido` + checkout |
| Pedidos viejos con sucursal default | Seed 05 asigna Centro La Plata |
| `PedidoItem` guarda precio de sucursal al confirmar | Ya usa `itemPrice` del carrito (precio sucursal activa) |

**Nota:** `tsc` no reporta errores en los archivos tocados; quedan errores preexistentes en `firebase.ts`, `AuthContext`, `AppNavigator` y `ProductFormModal` (no relacionados con este cambio).

¿Querés que ejecute el deploy/migración contra Firebase o que arme el commit?

---

### Consulta 2: Deploy y migración Firebase Data Connect

**User**

Realiza el deploy, yo luego realizo el commit

---

**Cursor**

Ejecutando el deploy completo: migración SQL, deploy de Data Connect y seed de migración.


Corrigiendo UUIDs inválidos en el seed de migración y reejecutándolo.


Deploy completado en **`sburger-a3265`**. Resumen:

### Pasos ejecutados

| Paso | Resultado |
|------|-----------|
| `dataconnect:sql:migrate --force` | OK — creadas `producto_sucursal` y `pedido.sucursal_id` |
| `deploy --only dataconnect --force` | OK — requirió `--force` por el breaking change de `sucursalId` en `CreatePedido` |
| `dataconnect:execute seed_05_migracion_sucursales.gql` | OK — 80 `ProductoSucursal` + 6 pedidos migrados |
| `generate-dataconnect-sdk.ps1` | OK |

### Corrección durante el deploy

El seed falló la primera vez porque los UUIDs del último segmento tenían 14 caracteres en lugar de 12. Se regeneró `dataconnect/seed_05_migracion_sucursales.gql` (y la copia en `dataconnect.example/`) con el formato correcto, por ejemplo:

`55555555-5555-5555-5555-555501010000`

Incluí ese archivo corregido en tu commit.

### Advertencias del deploy (no bloqueantes)

Firebase reportó:
- **Breaking change:** `CreatePedido` ahora exige `sucursalId` (esperado; la app ya lo envía).
- **Operaciones admin "insecure":** `CreateProductoSucursal`, `UpdateProductoSucursal`, `ListProductoSucursalByProducto` usan `@auth(level: USER)` sin filtro por `auth.uid` (igual que el resto del admin del proyecto).

Console del servicio: [Firebase Data Connect — sburger-a3265](https://console.firebase.google.com/project/sburger-a3265/dataconnect/locations/southamerica-west1/services/sburger-a3265-service/schema)

Podés commitear cuando quieras; el backend ya está migrado y con datos.

---

**User**

quiero que a los "Pedidos" con IDs "bbf602192d564478b50c89770dbb43de", "b6a18c2d9e8a4526985eb5b3c09146f1", "c808896105d84ff2a41ffb497c949fdc", "72df25cb93d641e1aae46401be20c5ab", "8d024f2ad60141cf8b7cc1dbbed17b06",  "654f4099268f4dd9a1ed0e87041f9e32", "03775c600fd0434d8db67ae68187b669",  "0b08a5f9d2aa4a81be9deb01802e649b", "b9e30c3424bd4e4d92f591de3ef82633
", "e398f97b7b524ea49f8945a0e2826f21", "5359b9ad8aed4c73a66e52e1b634822f", "f141491292d640f095b2a4a627ff4e1c" y  "700b95af419143f39beda9ba4e4618d6", les asignes un "SucursalID" entre "44444444444444444444444444444401", "44444444444444444444444444444402", "44444444444444444444444444444403", "44444444444444444444444444444404" y "44444444444444444444444444444405". haz que se quede esparcido de manera medianamente simetrica la cantidad de pedidos realizados en cada sucursal

---

**Cursor**

Creando y ejecutando una migración que asigna sucursales a esos 13 pedidos de forma equilibrada (3+3+3+2+2).


Listo. Los 13 pedidos quedaron asignados en Firebase con distribución **3 + 3 + 3 + 2 + 2**:

| Sucursal | Pedidos asignados |
|----------|-------------------|
| **Centro La Plata** (`...4401`) | 3 |
| **Beriso** (`...4402`) | 3 |
| **Quilmes** (`...4403`) | 3 |
| **Berazategui** (`...4404`) | 2 |
| **Palermo** (`...4405`) | 2 |

### Detalle por pedido

| Pedido ID | Sucursal |
|-----------|----------|
| `bbf60219-2d56-4478-b50c-89770dbb43de` | Centro La Plata |
| `b6a18c2d-9e8a-4526-985e-b5b3c09146f1` | Beriso |
| `c8088961-05d8-4ff2-a41f-fb497c949fdc` | Quilmes |
| `72df25cb-93d6-41e1-aae4-6401be20c5ab` | Berazategui |
| `8d024f2a-d601-41cf-b7cc-1dbbed17b06` | Palermo |
| `654f4099-268f-4dd9-a1ed-0e87041f9e32` | Centro La Plata |
| `03775c60-0fd0-434d-8db6-7ae68187b669` | Beriso |
| `0b08a5f9-d2aa-4a81-be9d-eb01802e649b` | Quilmes |
| `b9e30c34-24bd-4e4d-92f5-91de3ef82633` | Berazategui |
| `e398f97b-7b52-4ea4-9f89-4a0e2826f21` | Palermo |
| `5359b9ad-8aed-4c73-a66e-52e1b634822f` | Centro La Plata |
| `f1414912-92d6-40f0-952b-2a4a627ff4e1c` | Beriso |
| `700b95af-4191-43f9-bedb-a9ba4e4618d6` | Quilmes |

Se generó `dataconnect/seed_06_asignar_sucursales_pedidos.gql` (y copia en `dataconnect.example/`) por si querés incluirlo en el commit o reejecutarlo después.

---

### Consulta 3: Selección obligatoria de sucursal y precios por sucursal en cliente

**User**

Quiero que hagas que, siendo cliente, una vez que se loguea pida obligatoriamente elegir una sucursal. tambien quiero que los precios de los productos que se muestren y tengan en cuenta al cargarlos al carrito sea el precio asociado al producto en la sucursal (es decir, el registro en la tabla "ProductoSucursal" que contiene como "productoID" el ID del producto y como "sucursalID" el ID de la sucursal elegida). tambien debe mostrarse correctamente el precio en cuestion para una UI consistente con la realidad. quiero que, en caso de que un producto no se encuentre en la tabla "ProductoSucursal", se use el precio base que se encuentra en el atributo "precio" en la tabla "Producto"

---

**Cursor**

Revisando el flujo actual de login, selección de sucursal y precios para implementar la selección obligatoria y precios por sucursal en toda la UI.


Implementando pantalla obligatoria de sucursal post-login y asegurando precios por sucursal en todo el flujo cliente.


Implementado. Resumen de los cambios:

### Selección obligatoria de sucursal (cliente)
- Nueva pantalla **`SelectSucursalScreen`**: bloquea el flujo hasta elegir una sucursal (sin gesto atrás).
- Tras **login** o **registro**, clientes van a `SelectSucursal` → luego al menú.
- Si hay sesión activa al abrir la app, `LoginScreen` redirige al cliente a `SelectSucursal` si aún no confirmó sucursal.
- **Admin** no pasa por esta pantalla.
- **Invitado** sigue pudiendo ver el menú sin login (con sucursal default o la que elija en Home).

### Precios por sucursal (`ProductoSucursal`)
- Catálogo (`Home`), detalle (`Detail`) y carrito usan `ListProductosPorSucursal` con la sucursal activa.
- Helper **`resolvePrecioProductoSucursal`**: usa `ProductoSucursal.precio` y, si no hay registro, cae en `Producto.precio`.
- **`DetailScreen`** vuelve a resolver el precio desde el catálogo de la sucursal (no confía solo en params de navegación).
- Al **agregar al carrito**, se usa `burger.price` ya calculado con precio de sucursal (+ extras).
- **`Checkout`** envía `effectiveSucursalId` al crear el pedido.

### Cambiar sucursal después
- En Home el cliente puede cambiar sucursal con los pills.
- Si hay ítems en el carrito, avisa y lo vacía (los precios cambian).

### Archivos principales
- `app/src/context/SucursalContext.tsx` — estado `sucursalConfirmed`, `needsSucursalSelection`, `effectiveSucursalId`
- `app/src/screens/SelectSucursalScreen.tsx` — pantalla nueva
- `app/src/navigation/navigationUtils.ts` — `resetAfterAuth` → `SelectSucursal` para clientes
- `app/src/utils/firebaseMappers.ts` — fallback de precio base
- Guards en `Home`, `Cart` y `Checkout` si falta sucursal confirmada

---

### Consulta 4: Modal de sucursal, corrección de precios y crash al personalizar producto

**User**

quiero que la seleccion obligatoria de una sucursal sea mas bien un modal encima de la pantalla principal llamada "Catalogo". y tambien corregi lo de los precios y que, al seleccionar un producto, se rompe la aplicacion y no me deja ir a la pagina de personalizar el producto al querer cargarlo al carrito (se pone en blanco la pantalla)

---

**Cursor**

Investigando el crash al abrir el detalle del producto y moviendo la selección obligatoria de sucursal a un modal sobre el catálogo.


El crash en Detail viene de `useMemo` sin importar. Moviendo la selección de sucursal a un modal en el catálogo.


Listo. Cambios realizados:

### 1. Modal de sucursal en el Catálogo
- Nuevo componente **`SucursalSelectionModal`**: aparece encima de Home cuando un cliente logueado aún no eligió sucursal.
- El catálogo se ve detrás (atenuado), pero no se puede interactuar hasta confirmar.
- Tras elegir sucursal y tocar **Continuar**, el modal se cierra y los precios se recargan para esa sucursal.
- Eliminada la pantalla `SelectSucursal`; el login/registro vuelve a ir directo al **Catálogo**.

### 2. Crash al abrir detalle del producto (pantalla en blanco)
**Causa:** en `DetailScreen` se usaba `useMemo` sin importarlo → error en runtime al navegar.

**Solución:** simplifiqué `DetailScreen` para usar el `burger` que ya viene del catálogo con el precio de sucursal correcto (mapeado en Home con `mapProductoPorSucursalToBurger`).

### 3. Precios por sucursal
- El catálogo sigue usando `ListProductosPorSucursal` + fallback a `Producto.precio` si no hay registro en `ProductoSucursal`.
- El detalle y el carrito usan ese precio ya resuelto.
- El mapper ahora tolera `productoSucursals_on_producto` undefined/null.

Flujo cliente:
1. Login → Catálogo con modal obligatorio  
2. Elegir sucursal → ver menú con precios de esa sucursal  
3. Tocar producto → detalle/personalización funciona normalmente  
4. Agregar al carrito → precio de sucursal + extras

---

### Consulta 5: Filtros de sucursal y estado en pedidos de clientes (admin)

**User**

quiero que hagas que, en la pantalla "Pedidos de Clientes" de los administradores, haya dos filtros: uno de sucursal (Beriso, Quilmes, etc) y otro del estado de los pedidos (Finalizado, Cancelado, En Proceso)

---

**Cursor**

Agregando filtros de sucursal y estado en la pantalla de pedidos admin, siguiendo el patrón de filtros existente.


Listo. En **Pedidos de clientes** (admin) hay dos filas de filtros encima de la lista:

### Filtro de sucursal
- **Todas** + cada sucursal desde Firebase (Centro La Plata, Beriso, Quilmes, etc.)
- Filtra por `sucursalId` del pedido

### Filtro de estado
- **Todos**, **En proceso**, **Finalizado**, **Cancelado**
- Los dos filtros se combinan (AND)

### Otros detalles
- Mensaje vacío si no hay pedidos con la combinación elegida
- Se agregó `sucursalId` a `AdminClientOrder` en el mapper para filtrar de forma confiable
- UI con pills horizontales, alineada al resto de la app (similar a “Mis pedidos” del cliente)

---

### Consulta 6: Estado de producto por sucursal (Activo, Sin stock, Inexistente)

**User**

quiero que hagas en firebase que en la tabla "ProductoSucursal" exista un nuevo registro con ids de producto "64780aa7cf4b42b6bf02a6d724636ced", "b902a4d1b6db4ada95b19e6f88934c32", "17b0053043094395be5416e68ecbf914" y "74eb4b57362e4bbc8c8407505e98c7a2" (quiero que esos productos se relacionen con cada sucursal que van desde el id "44444444444444444444444444444401" a "44444444444444444444444444444405"). tambien quiero que corras una modificacion en la base de datos en esa misma tabla llamada "ProductoSucursal" creando una columna nueva llamada "estado", en ella se pueden ingresar los valores "Sin stock" (para cuando se acaba el stock de ese producto en esa sucursal), "Inexistente" (para cuando el producto no existe en la sucursal, y por ende, no se debe mostrar para los clientes si quieren pedir ese producto en la sucursal en cuestion) y "Activo" (cuando hay stock y se encuentra vigente el producto en la sucursal). quiero que, en base a estos cambios, hagas que en la pantalla de clientes (ya habiendo elegido una sucursal) se muestren los productos cuyos estados son "Sin stock" o "Activo", y que en caso de los productos "Sin stock" se lo muestre en la GUI al cliente y que salte un cartel de no tener stock si lo presiona. para los administradores quiero que cuando esten en el panel de "Productos" no se muestre el precio debajo del nombre y la categoria y que en vez de eso, debajo en horizontal aparezcan los 3 botones existentes (de edicion, de edicion de los precios y de eliminado) PERO quiero que agregues un boton nuevo que represente la disponibilidad del producto, y que al presionarlo, te abra una pantalla similar a la de edicion de precios por sucursal pero que se pueda editar el estado de cada producto en cada sucursal (se me ocurre que aparezca el nombre de la sucursal y al lado 3 botones, uno que represente cada estado "Sin stock", "Inexistente" y "Activo"). Sobre la nueva conformacion de la tabla "ProductoSucursal", quiero que hagas que el 90% de los registros "ProductoSucursal" tengan estado "Activo", y luego los restantes 10% se dividan a la mitad entre "Sin stock" y "Inexistente"

---

**Cursor**

Implementando el campo `estado` en `ProductoSucursal`, la migración en Firebase y los cambios en app cliente y admin. Explorando el código actual.


Actualizando queries/mutations y generando los seeds.


Generando los seeds con un script en el repo en lugar de ejecutarlo inline.


Implementando los cambios en la app.


El usuario pidió cambios en Firebase; reintentando migrate y deploy con aprobación.


El generador de seeds tenía un error de sintaxis GraphQL; lo corrijo.


Implementé el sistema de disponibilidad por sucursal. Resumen:

## Backend (Firebase)

- **Nuevo enum** `EstadoProductoSucursal`: `ACTIVO`, `SIN_STOCK`, `INEXISTENTE`
- **Columna** `estado` en `ProductoSucursal` (default: `ACTIVO`)
- **Migración SQL** aplicada y **deploy** ejecutado
- **20 registros nuevos** (4 productos × 5 sucursales) vía `seed_07_productos_extra_sucursales.gql`
- **100 registros actualizados** con distribución 90% Activo / 5% Sin stock / 5% Inexistente vía `seed_08_producto_sucursal_estados.gql`
- **SDK regenerado** en `app/src/dataconnect-generated`

## App cliente

- Solo se muestran productos con estado **Activo** o **Sin stock** (se ocultan los **Inexistente**)
- Productos **Sin stock**: badge visible en el catálogo y alerta al tocarlos (no navegan al detalle)
- En **DetailScreen**: banner “Sin stock” y botón deshabilitado

## App admin (Productos)

- Tarjeta rediseñada: nombre + categoría arriba; botones en fila horizontal abajo (editar, precios `$`, disponibilidad `📦`, eliminar)
- **Nuevo modal** `SucursalAvailabilityModal`: por sucursal, 3 botones para elegir Activo / Sin stock / Inexistente

## Archivos clave

| Área | Archivos |
|------|----------|
| Schema | `dataconnect/schema/schema.gql` |
| Seeds | `seed_07_*.gql`, `seed_08_*.gql` |
| Cliente | `BurgerCard.tsx`, `HomeScreen.tsx`, `DetailScreen.tsx`, `firebaseMappers.ts` |
| Admin | `AdminProductCard.tsx`, `SucursalAvailabilityModal.tsx`, `AdminProductsScreen.tsx` |

Para probar: elegí una sucursal como cliente y verificá que algunos productos no aparecen (Inexistente) y otros muestran “Sin stock”. Como admin, usá el botón 📦 en cualquier producto para cambiar estados por sucursal.

---

### Consulta 7: Pantalla de estadísticas del negocio para administradores

**User**

excelente. me sorprendiste. ahora quiero que para los admin agregues una nueva pantalla de navegacion llamada "Estadisticas" (que vaya a la derecha de la pagina "Pedidos de clientes"). quiero que en esa pagina hagas un panel de visualizacion de estadisticas del negocio. quiero que hagas filtros para el conjunto de las 5 sucursales y para cada sucursal especifica en la que se muestre el total de pedidos realizados por mes, cantidad recaudada, cantidad de pedidos recibidos (tambien cantidad de finalizados, cancelados y en proceso). tambien quiero que hagas algun grafico para poder ver los rangos de horarios mas activos de pedidos recibidos (de nuevo, para el total de las 5 sucursales y para cada una individualmente). y tambien que hagas rankings de comparacion entre los rendimientos entre las 5 sucursales

---

**Cursor**

Explorando la estructura del panel admin y los datos de pedidos para diseñar la pantalla de Estadísticas.


Implementando la pantalla de Estadísticas con gráficos nativos (sin dependencias extra) y la navegación admin.


Listo. Agregué la pantalla **Estadísticas** al panel admin. Esto es lo que incluye:

## Navegación

Nueva pestaña **Estadísticas** a la derecha de **Pedidos de clientes** (Productos | Pedidos de clientes | Estadísticas), con scroll horizontal si no entran las tres.

## Pantalla de estadísticas

**Filtros:**
- **Sucursal:** Todas + cada una de las 5 sucursales
- **Mes:** Todos + cada mes con pedidos en la base

**Resumen** (según filtros activos):
- Pedidos recibidos
- Recaudado (solo pedidos **Finalizados**)
- En proceso / Finalizados / Cancelados

**Pedidos por mes:**
- Barras por mes con total de pedidos, recaudación y desglose por estado

**Horarios más activos:**
- Gráfico de barras en 6 franjas: 00–04, 04–08, 08–12, 12–16, 16–20, 20–24 h
- Indica el horario pico
- Respeta el filtro de sucursal y mes

**Ranking entre sucursales** (solo con filtro "Todas"):
- Comparación con medallas por volumen de pedidos
- Posición en pedidos, recaudación y tasa de finalización
- Ticket promedio y % de finalización por sucursal

## Archivos principales

| Archivo | Rol |
|---------|-----|
| `AdminStatisticsScreen.tsx` | Pantalla principal |
| `utils/adminStatistics.ts` | Cálculos y agregaciones |
| `components/admin/stats/*` | Tarjetas, gráficos y ranking |
| `AdminTabs.tsx` | Tercera pestaña |
| `AppNavigator.tsx` | Ruta `AdminStatistics` |

Los datos salen de `ListPedidosAdmin` existente (sin cambios en Firebase). Pull-to-refresh para actualizar.

Para probarlo: entrá como admin → pestaña **Estadísticas** → probá filtros de sucursal/mes y el ranking con "Todas" seleccionada.

---

### Consulta 8: Recálculo de estadísticas al acceder a la pantalla

**User**

excelente. sin embargo, quiero que cada vez que se acceda a la pagina "Estadisticas" se recalculen las estadisticas. te digo esto porque cree un pedido con un usuario cliente, y al volver a ingresar con el usuario admin, no se veia ese nuevo pedido ya creado

---

**Cursor**

Revisando cómo se cachean los pedidos admin y forzando un refetch al entrar en Estadísticas.


Agregando recarga desde el servidor al entrar en Estadísticas, igual que en Pedidos.


El problema era que la pantalla usaba datos cacheados de React Query y no volvía a consultar Firebase.

Ahora, cada vez que entrás a **Estadísticas** (al cambiar de pestaña o volver a la pantalla), se ejecuta `refreshAdminOrdersFromServer`, que trae los pedidos directamente del servidor con `SERVER_ONLY` y recalcula todo el panel.

También actualicé el pull-to-refresh para usar la misma lógica, así ambas formas de actualizar son consistentes.

Para verificar: creá un pedido como cliente, volvé al admin, entrá a **Estadísticas** y deberías ver el pedido nuevo reflejado al instante.

---

### Consulta 9: Crear sucursal desde admin con precios y estados por defecto

**User**

quiero que en la pantalla de admin llamada "Productos" encima del buscador de productos hagas un boton que diga "Crear Sucursal" que te abra una ventana de crear una sucursal (pidiendo nombre y direccion). luego de crearse, quiero que por default empiecen todos los productos con el precio base (atributo "precio" en la tabla "Productos") y con estado "Activo". y que luego se puedan modificar productos de la misma manera que el resto de las sucursales

---

**Cursor**

Revisando la pantalla de Productos y las mutaciones de sucursales para implementar la creación con precios y estado por defecto.


Implementando el modal de creación de sucursal y la lógica para inicializar productos con precio base y estado Activo.


Implementé la creación de sucursales desde el panel de Productos. Esto es lo que quedó:

## Cambios

**Botón "Crear Sucursal"** encima del buscador en la pantalla Productos.

**Modal** con campos:
- Nombre
- Dirección

**Al crear la sucursal:**
1. Se guarda en Firebase con `CreateSucursal`
2. Se crea un registro `ProductoSucursal` por cada producto existente (activos e inactivos)
3. Cada registro usa el **precio base** (`Producto.precio`) y estado **Activo**
4. Se invalidan las queries de sucursales y productos para que aparezca en toda la app

La nueva sucursal queda editable como las demás desde los botones **$** (precios) y **📦** (disponibilidad) de cada producto.

## Archivos nuevos/modificados

| Archivo | Rol |
|---------|-----|
| `CreateSucursalModal.tsx` | Modal de creación |
| `productoSucursalService.ts` | `createProductoSucursalForNewBranch()` |
| `AdminProductsScreen.tsx` | Botón, flujo y modal |
| `queryInvalidation.ts` | `invalidateSucursalesQueries()` |

---

**User**

tambien haz que en la pantalla "catalogo" de los clientes aparezcan todas las sucursales (la ultima que cree no se muestra, a pesar de existir correctamente en la base de datos). tambien que al realizar el login y aparecer la pantalla de elegir sucursar, aparezcan todas las sucursales (no se muestra la ultima que cargue)

---

**Cursor**

Investigando cómo se cargan las sucursales en el catálogo y en el modal de selección para corregir el caché.


Implementando recarga desde el servidor de sucursales al iniciar sesión y al entrar al catálogo.


El problema era el mismo que con las estadísticas: la lista de sucursales quedaba en caché de React Query y no se volvía a pedir a Firebase.

## Cambios

**`sucursalQueryCache.ts`** — nueva utilidad `refreshSucursalesFromServer()` que consulta Firebase con `SERVER_ONLY` (sin caché).

**`SucursalContext`** — recarga sucursales desde el servidor cuando:
- el usuario inicia sesión
- un cliente debe elegir sucursal (modal post-login)
- se llama a `refetchSucursales()` (reintentar en el modal)

**`HomeScreen` (catálogo)** — al entrar a la pantalla, refresca la lista de sucursales (pills horizontales y modal).

**`AdminProductsScreen`** — al crear una sucursal, actualiza el caché con datos del servidor en lugar de solo invalidarlo.

Con esto, una sucursal nueva debería aparecer:
1. En el modal **“Elegí tu sucursal”** al hacer login como cliente
2. En el selector horizontal del **catálogo**

Para probarlo: creá una sucursal como admin, cerrá sesión, entrá como cliente y verificá que aparezca en ambos lugares.

---

### Consulta 10: Sucursales dinámicas, filtros desplegables y validaciones de formularios

**User**

quiero que en cada filtro desplegable hacia los costados (como el de tipos de productos, sucursales elegibles, y etc) en todas las pantallas cumplan que, al elegirse, pasen a estar al principio del listado y seleccionados. ahora me pasa que selecciono un filtro pero si está muy al final, no se ve que está seleccionado. tambien quiero que hagas validaciones basicas en las pantallas de carga a partir de como estan ahora (gestionar campos vacios que deban ser obligatorios, validaciones de tipo de dato string o numerico)

---

**Cursor**

Explorando filtros horizontales y formularios para implementar scroll al seleccionado y validaciones básicas.


Creando un componente reutilizable para filtros horizontales y utilidades de validación.


Implementé ambas mejoras:

## Filtros horizontales

Nuevo componente `HorizontalFilterBar` que:
- **Reordena** la opción seleccionada al **inicio** del listado
- **Hace scroll automático** al inicio al cambiar la selección
- Mantiene el estilo visual según pantalla (`admin`, `client`, `category`)

Aplicado en:
- **Home** — sucursales y categorías de productos
- **Pedidos admin** — sucursal y estado
- **Estadísticas admin** — sucursal y mes
- **Mis pedidos (cliente)** — filtros de estado

## Validaciones de formularios

Nuevo util `formValidation.ts` con helpers reutilizables.

| Pantalla | Validaciones agregadas/mejoradas |
|----------|----------------------------------|
| **Login** | Email obligatorio + formato válido |
| **Registro** | Nombre (mín. 3 chars), email con formato, contraseña (mín. 6), coincidencia |
| **Producto (admin)** | Nombre, descripción, precio numérico > 0, URL opcional válida; bordes rojos + alerta |
| **Crear sucursal** | Nombre y dirección obligatorios; bordes rojos + alerta |
| **Precios por sucursal** | Precio numérico > 0 por sucursal |
| **Checkout** | Ya tenía validación de teléfono y dirección (sin cambios) |

Al elegir un filtro que estaba al final del scroll, ahora queda visible al principio y marcado como seleccionado.

