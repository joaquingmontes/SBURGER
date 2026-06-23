# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `default`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListProductosActivos*](#listproductosactivos)
  - [*ListProductosAdmin*](#listproductosadmin)
  - [*ListMyPedidos*](#listmypedidos)
  - [*ListPedidosAdmin*](#listpedidosadmin)
  - [*GetMe*](#getme)
  - [*GetProductoById*](#getproductobyid)
- [**Mutations**](#mutations)
  - [*CreateUsuarioProfile*](#createusuarioprofile)
  - [*LinkMyAccount*](#linkmyaccount)
  - [*CreateProducto*](#createproducto)
  - [*UpdateProducto*](#updateproducto)
  - [*DeleteProducto*](#deleteproducto)
  - [*CreatePedido*](#createpedido)
  - [*CreatePedidoItem*](#createpedidoitem)
  - [*UpdatePedidoEstado*](#updatepedidoestado)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `default`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `default` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListProductosActivos
You can execute the `ListProductosActivos` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listProductosActivos(options?: ExecuteQueryOptions): QueryPromise<ListProductosActivosData, undefined>;

interface ListProductosActivosRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListProductosActivosData, undefined>;
}
export const listProductosActivosRef: ListProductosActivosRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listProductosActivos(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListProductosActivosData, undefined>;

interface ListProductosActivosRef {
  ...
  (dc: DataConnect): QueryRef<ListProductosActivosData, undefined>;
}
export const listProductosActivosRef: ListProductosActivosRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listProductosActivosRef:
```typescript
const name = listProductosActivosRef.operationName;
console.log(name);
```

### Variables
The `ListProductosActivos` query has no variables.
### Return Type
Recall that executing the `ListProductosActivos` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListProductosActivosData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListProductosActivosData {
  productos: ({
    id: UUIDString;
    nombre: string;
    descripcion: string;
    ingredientes?: string | null;
    precio: number;
    categoria: CategoriaProducto;
    imagenUrl: string;
  } & Producto_Key)[];
}
```
### Using `ListProductosActivos`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listProductosActivos } from '@dataconnect/generated';


// Call the `listProductosActivos()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listProductosActivos();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listProductosActivos(dataConnect);

console.log(data.productos);

// Or, you can use the `Promise` API.
listProductosActivos().then((response) => {
  const data = response.data;
  console.log(data.productos);
});
```

### Using `ListProductosActivos`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listProductosActivosRef } from '@dataconnect/generated';


// Call the `listProductosActivosRef()` function to get a reference to the query.
const ref = listProductosActivosRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listProductosActivosRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.productos);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.productos);
});
```

## ListProductosAdmin
You can execute the `ListProductosAdmin` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listProductosAdmin(options?: ExecuteQueryOptions): QueryPromise<ListProductosAdminData, undefined>;

interface ListProductosAdminRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListProductosAdminData, undefined>;
}
export const listProductosAdminRef: ListProductosAdminRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listProductosAdmin(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListProductosAdminData, undefined>;

interface ListProductosAdminRef {
  ...
  (dc: DataConnect): QueryRef<ListProductosAdminData, undefined>;
}
export const listProductosAdminRef: ListProductosAdminRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listProductosAdminRef:
```typescript
const name = listProductosAdminRef.operationName;
console.log(name);
```

### Variables
The `ListProductosAdmin` query has no variables.
### Return Type
Recall that executing the `ListProductosAdmin` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListProductosAdminData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListProductosAdminData {
  productos: ({
    id: UUIDString;
    nombre: string;
    descripcion: string;
    ingredientes?: string | null;
    precio: number;
    categoria: CategoriaProducto;
    imagenUrl: string;
    activo: boolean;
  } & Producto_Key)[];
}
```
### Using `ListProductosAdmin`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listProductosAdmin } from '@dataconnect/generated';


// Call the `listProductosAdmin()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listProductosAdmin();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listProductosAdmin(dataConnect);

console.log(data.productos);

// Or, you can use the `Promise` API.
listProductosAdmin().then((response) => {
  const data = response.data;
  console.log(data.productos);
});
```

### Using `ListProductosAdmin`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listProductosAdminRef } from '@dataconnect/generated';


// Call the `listProductosAdminRef()` function to get a reference to the query.
const ref = listProductosAdminRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listProductosAdminRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.productos);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.productos);
});
```

## ListMyPedidos
You can execute the `ListMyPedidos` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listMyPedidos(options?: ExecuteQueryOptions): QueryPromise<ListMyPedidosData, undefined>;

interface ListMyPedidosRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyPedidosData, undefined>;
}
export const listMyPedidosRef: ListMyPedidosRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listMyPedidos(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMyPedidosData, undefined>;

interface ListMyPedidosRef {
  ...
  (dc: DataConnect): QueryRef<ListMyPedidosData, undefined>;
}
export const listMyPedidosRef: ListMyPedidosRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listMyPedidosRef:
```typescript
const name = listMyPedidosRef.operationName;
console.log(name);
```

### Variables
The `ListMyPedidos` query has no variables.
### Return Type
Recall that executing the `ListMyPedidos` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListMyPedidosData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListMyPedidosData {
  pedidos: ({
    id: UUIDString;
    codigo: string;
    estado: EstadoPedido;
    subtotal: number;
    costoEnvio: number;
    total: number;
    modalidadEntrega: ModalidadEntrega;
    nombreContacto: string;
    telefonoContacto: string;
    direccion?: string | null;
    createdAt: TimestampString;
    pedidoItems_on_pedido: ({
      id: UUIDString;
      nombreProducto: string;
      cantidad: number;
      precioUnitario: number;
      precioTotalLinea: number;
      extraMedallon: number;
      extraCheddar: number;
      extraPanceta: number;
      extraCebolla: number;
      notas?: string | null;
    } & PedidoItem_Key)[];
  } & Pedido_Key)[];
}
```
### Using `ListMyPedidos`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listMyPedidos } from '@dataconnect/generated';


// Call the `listMyPedidos()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listMyPedidos();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listMyPedidos(dataConnect);

console.log(data.pedidos);

// Or, you can use the `Promise` API.
listMyPedidos().then((response) => {
  const data = response.data;
  console.log(data.pedidos);
});
```

### Using `ListMyPedidos`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listMyPedidosRef } from '@dataconnect/generated';


// Call the `listMyPedidosRef()` function to get a reference to the query.
const ref = listMyPedidosRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listMyPedidosRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.pedidos);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.pedidos);
});
```

## ListPedidosAdmin
You can execute the `ListPedidosAdmin` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listPedidosAdmin(options?: ExecuteQueryOptions): QueryPromise<ListPedidosAdminData, undefined>;

interface ListPedidosAdminRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListPedidosAdminData, undefined>;
}
export const listPedidosAdminRef: ListPedidosAdminRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listPedidosAdmin(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListPedidosAdminData, undefined>;

interface ListPedidosAdminRef {
  ...
  (dc: DataConnect): QueryRef<ListPedidosAdminData, undefined>;
}
export const listPedidosAdminRef: ListPedidosAdminRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listPedidosAdminRef:
```typescript
const name = listPedidosAdminRef.operationName;
console.log(name);
```

### Variables
The `ListPedidosAdmin` query has no variables.
### Return Type
Recall that executing the `ListPedidosAdmin` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListPedidosAdminData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListPedidosAdminData {
  pedidos: ({
    id: UUIDString;
    codigo: string;
    estado: EstadoPedido;
    subtotal: number;
    costoEnvio: number;
    total: number;
    modalidadEntrega: ModalidadEntrega;
    nombreContacto: string;
    telefonoContacto: string;
    direccion?: string | null;
    createdAt: TimestampString;
    pedidoItems_on_pedido: ({
      id: UUIDString;
      nombreProducto: string;
      cantidad: number;
      precioUnitario: number;
      precioTotalLinea: number;
      extraMedallon: number;
      extraCheddar: number;
      extraPanceta: number;
      extraCebolla: number;
      notas?: string | null;
    } & PedidoItem_Key)[];
  } & Pedido_Key)[];
}
```
### Using `ListPedidosAdmin`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listPedidosAdmin } from '@dataconnect/generated';


// Call the `listPedidosAdmin()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listPedidosAdmin();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listPedidosAdmin(dataConnect);

console.log(data.pedidos);

// Or, you can use the `Promise` API.
listPedidosAdmin().then((response) => {
  const data = response.data;
  console.log(data.pedidos);
});
```

### Using `ListPedidosAdmin`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listPedidosAdminRef } from '@dataconnect/generated';


// Call the `listPedidosAdminRef()` function to get a reference to the query.
const ref = listPedidosAdminRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listPedidosAdminRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.pedidos);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.pedidos);
});
```

## GetMe
You can execute the `GetMe` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getMe(options?: ExecuteQueryOptions): QueryPromise<GetMeData, undefined>;

interface GetMeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMeData, undefined>;
}
export const getMeRef: GetMeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMe(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetMeData, undefined>;

interface GetMeRef {
  ...
  (dc: DataConnect): QueryRef<GetMeData, undefined>;
}
export const getMeRef: GetMeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMeRef:
```typescript
const name = getMeRef.operationName;
console.log(name);
```

### Variables
The `GetMe` query has no variables.
### Return Type
Recall that executing the `GetMe` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMeData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetMeData {
  usuarios: ({
    id: UUIDString;
    nombreCompleto: string;
    email: string;
    rol: RolUsuario;
  } & Usuario_Key)[];
}
```
### Using `GetMe`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMe } from '@dataconnect/generated';


// Call the `getMe()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMe();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMe(dataConnect);

console.log(data.usuarios);

// Or, you can use the `Promise` API.
getMe().then((response) => {
  const data = response.data;
  console.log(data.usuarios);
});
```

### Using `GetMe`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMeRef } from '@dataconnect/generated';


// Call the `getMeRef()` function to get a reference to the query.
const ref = getMeRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMeRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.usuarios);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.usuarios);
});
```

## GetProductoById
You can execute the `GetProductoById` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getProductoById(vars: GetProductoByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetProductoByIdData, GetProductoByIdVariables>;

interface GetProductoByIdRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetProductoByIdVariables): QueryRef<GetProductoByIdData, GetProductoByIdVariables>;
}
export const getProductoByIdRef: GetProductoByIdRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getProductoById(dc: DataConnect, vars: GetProductoByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetProductoByIdData, GetProductoByIdVariables>;

interface GetProductoByIdRef {
  ...
  (dc: DataConnect, vars: GetProductoByIdVariables): QueryRef<GetProductoByIdData, GetProductoByIdVariables>;
}
export const getProductoByIdRef: GetProductoByIdRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getProductoByIdRef:
```typescript
const name = getProductoByIdRef.operationName;
console.log(name);
```

### Variables
The `GetProductoById` query requires an argument of type `GetProductoByIdVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetProductoByIdVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetProductoById` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetProductoByIdData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetProductoByIdData {
  productos: ({
    id: UUIDString;
    nombre: string;
    descripcion: string;
    ingredientes?: string | null;
    precio: number;
    categoria: CategoriaProducto;
    imagenUrl: string;
  } & Producto_Key)[];
}
```
### Using `GetProductoById`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getProductoById, GetProductoByIdVariables } from '@dataconnect/generated';

// The `GetProductoById` query requires an argument of type `GetProductoByIdVariables`:
const getProductoByIdVars: GetProductoByIdVariables = {
  id: ..., 
};

// Call the `getProductoById()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getProductoById(getProductoByIdVars);
// Variables can be defined inline as well.
const { data } = await getProductoById({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getProductoById(dataConnect, getProductoByIdVars);

console.log(data.productos);

// Or, you can use the `Promise` API.
getProductoById(getProductoByIdVars).then((response) => {
  const data = response.data;
  console.log(data.productos);
});
```

### Using `GetProductoById`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getProductoByIdRef, GetProductoByIdVariables } from '@dataconnect/generated';

// The `GetProductoById` query requires an argument of type `GetProductoByIdVariables`:
const getProductoByIdVars: GetProductoByIdVariables = {
  id: ..., 
};

// Call the `getProductoByIdRef()` function to get a reference to the query.
const ref = getProductoByIdRef(getProductoByIdVars);
// Variables can be defined inline as well.
const ref = getProductoByIdRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getProductoByIdRef(dataConnect, getProductoByIdVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.productos);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.productos);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `default` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateUsuarioProfile
You can execute the `CreateUsuarioProfile` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createUsuarioProfile(vars: CreateUsuarioProfileVariables): MutationPromise<CreateUsuarioProfileData, CreateUsuarioProfileVariables>;

interface CreateUsuarioProfileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUsuarioProfileVariables): MutationRef<CreateUsuarioProfileData, CreateUsuarioProfileVariables>;
}
export const createUsuarioProfileRef: CreateUsuarioProfileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createUsuarioProfile(dc: DataConnect, vars: CreateUsuarioProfileVariables): MutationPromise<CreateUsuarioProfileData, CreateUsuarioProfileVariables>;

interface CreateUsuarioProfileRef {
  ...
  (dc: DataConnect, vars: CreateUsuarioProfileVariables): MutationRef<CreateUsuarioProfileData, CreateUsuarioProfileVariables>;
}
export const createUsuarioProfileRef: CreateUsuarioProfileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createUsuarioProfileRef:
```typescript
const name = createUsuarioProfileRef.operationName;
console.log(name);
```

### Variables
The `CreateUsuarioProfile` mutation requires an argument of type `CreateUsuarioProfileVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateUsuarioProfileVariables {
  nombreCompleto: string;
  email: string;
  rol?: RolUsuario | null;
}
```
### Return Type
Recall that executing the `CreateUsuarioProfile` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateUsuarioProfileData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateUsuarioProfileData {
  usuario_insert: Usuario_Key;
}
```
### Using `CreateUsuarioProfile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createUsuarioProfile, CreateUsuarioProfileVariables } from '@dataconnect/generated';

// The `CreateUsuarioProfile` mutation requires an argument of type `CreateUsuarioProfileVariables`:
const createUsuarioProfileVars: CreateUsuarioProfileVariables = {
  nombreCompleto: ..., 
  email: ..., 
  rol: ..., // optional
};

// Call the `createUsuarioProfile()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createUsuarioProfile(createUsuarioProfileVars);
// Variables can be defined inline as well.
const { data } = await createUsuarioProfile({ nombreCompleto: ..., email: ..., rol: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createUsuarioProfile(dataConnect, createUsuarioProfileVars);

console.log(data.usuario_insert);

// Or, you can use the `Promise` API.
createUsuarioProfile(createUsuarioProfileVars).then((response) => {
  const data = response.data;
  console.log(data.usuario_insert);
});
```

### Using `CreateUsuarioProfile`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createUsuarioProfileRef, CreateUsuarioProfileVariables } from '@dataconnect/generated';

// The `CreateUsuarioProfile` mutation requires an argument of type `CreateUsuarioProfileVariables`:
const createUsuarioProfileVars: CreateUsuarioProfileVariables = {
  nombreCompleto: ..., 
  email: ..., 
  rol: ..., // optional
};

// Call the `createUsuarioProfileRef()` function to get a reference to the mutation.
const ref = createUsuarioProfileRef(createUsuarioProfileVars);
// Variables can be defined inline as well.
const ref = createUsuarioProfileRef({ nombreCompleto: ..., email: ..., rol: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createUsuarioProfileRef(dataConnect, createUsuarioProfileVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.usuario_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.usuario_insert);
});
```

## LinkMyAccount
You can execute the `LinkMyAccount` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
linkMyAccount(): MutationPromise<LinkMyAccountData, undefined>;

interface LinkMyAccountRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<LinkMyAccountData, undefined>;
}
export const linkMyAccountRef: LinkMyAccountRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
linkMyAccount(dc: DataConnect): MutationPromise<LinkMyAccountData, undefined>;

interface LinkMyAccountRef {
  ...
  (dc: DataConnect): MutationRef<LinkMyAccountData, undefined>;
}
export const linkMyAccountRef: LinkMyAccountRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the linkMyAccountRef:
```typescript
const name = linkMyAccountRef.operationName;
console.log(name);
```

### Variables
The `LinkMyAccount` mutation has no variables.
### Return Type
Recall that executing the `LinkMyAccount` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `LinkMyAccountData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface LinkMyAccountData {
  usuario_update?: Usuario_Key | null;
}
```
### Using `LinkMyAccount`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, linkMyAccount } from '@dataconnect/generated';


// Call the `linkMyAccount()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await linkMyAccount();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await linkMyAccount(dataConnect);

console.log(data.usuario_update);

// Or, you can use the `Promise` API.
linkMyAccount().then((response) => {
  const data = response.data;
  console.log(data.usuario_update);
});
```

### Using `LinkMyAccount`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, linkMyAccountRef } from '@dataconnect/generated';


// Call the `linkMyAccountRef()` function to get a reference to the mutation.
const ref = linkMyAccountRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = linkMyAccountRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.usuario_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.usuario_update);
});
```

## CreateProducto
You can execute the `CreateProducto` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createProducto(vars: CreateProductoVariables): MutationPromise<CreateProductoData, CreateProductoVariables>;

interface CreateProductoRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateProductoVariables): MutationRef<CreateProductoData, CreateProductoVariables>;
}
export const createProductoRef: CreateProductoRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createProducto(dc: DataConnect, vars: CreateProductoVariables): MutationPromise<CreateProductoData, CreateProductoVariables>;

interface CreateProductoRef {
  ...
  (dc: DataConnect, vars: CreateProductoVariables): MutationRef<CreateProductoData, CreateProductoVariables>;
}
export const createProductoRef: CreateProductoRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createProductoRef:
```typescript
const name = createProductoRef.operationName;
console.log(name);
```

### Variables
The `CreateProducto` mutation requires an argument of type `CreateProductoVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateProductoVariables {
  nombre: string;
  descripcion: string;
  ingredientes?: string | null;
  precio: number;
  categoria: CategoriaProducto;
  imagenUrl: string;
}
```
### Return Type
Recall that executing the `CreateProducto` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateProductoData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateProductoData {
  producto_insert: Producto_Key;
}
```
### Using `CreateProducto`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createProducto, CreateProductoVariables } from '@dataconnect/generated';

// The `CreateProducto` mutation requires an argument of type `CreateProductoVariables`:
const createProductoVars: CreateProductoVariables = {
  nombre: ..., 
  descripcion: ..., 
  ingredientes: ..., // optional
  precio: ..., 
  categoria: ..., 
  imagenUrl: ..., 
};

// Call the `createProducto()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createProducto(createProductoVars);
// Variables can be defined inline as well.
const { data } = await createProducto({ nombre: ..., descripcion: ..., ingredientes: ..., precio: ..., categoria: ..., imagenUrl: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createProducto(dataConnect, createProductoVars);

console.log(data.producto_insert);

// Or, you can use the `Promise` API.
createProducto(createProductoVars).then((response) => {
  const data = response.data;
  console.log(data.producto_insert);
});
```

### Using `CreateProducto`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createProductoRef, CreateProductoVariables } from '@dataconnect/generated';

// The `CreateProducto` mutation requires an argument of type `CreateProductoVariables`:
const createProductoVars: CreateProductoVariables = {
  nombre: ..., 
  descripcion: ..., 
  ingredientes: ..., // optional
  precio: ..., 
  categoria: ..., 
  imagenUrl: ..., 
};

// Call the `createProductoRef()` function to get a reference to the mutation.
const ref = createProductoRef(createProductoVars);
// Variables can be defined inline as well.
const ref = createProductoRef({ nombre: ..., descripcion: ..., ingredientes: ..., precio: ..., categoria: ..., imagenUrl: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createProductoRef(dataConnect, createProductoVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.producto_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.producto_insert);
});
```

## UpdateProducto
You can execute the `UpdateProducto` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateProducto(vars: UpdateProductoVariables): MutationPromise<UpdateProductoData, UpdateProductoVariables>;

interface UpdateProductoRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateProductoVariables): MutationRef<UpdateProductoData, UpdateProductoVariables>;
}
export const updateProductoRef: UpdateProductoRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateProducto(dc: DataConnect, vars: UpdateProductoVariables): MutationPromise<UpdateProductoData, UpdateProductoVariables>;

interface UpdateProductoRef {
  ...
  (dc: DataConnect, vars: UpdateProductoVariables): MutationRef<UpdateProductoData, UpdateProductoVariables>;
}
export const updateProductoRef: UpdateProductoRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateProductoRef:
```typescript
const name = updateProductoRef.operationName;
console.log(name);
```

### Variables
The `UpdateProducto` mutation requires an argument of type `UpdateProductoVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateProductoVariables {
  id: UUIDString;
  nombre: string;
  descripcion: string;
  ingredientes?: string | null;
  precio: number;
  categoria: CategoriaProducto;
  imagenUrl: string;
}
```
### Return Type
Recall that executing the `UpdateProducto` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateProductoData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateProductoData {
  producto_update?: Producto_Key | null;
}
```
### Using `UpdateProducto`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateProducto, UpdateProductoVariables } from '@dataconnect/generated';

// The `UpdateProducto` mutation requires an argument of type `UpdateProductoVariables`:
const updateProductoVars: UpdateProductoVariables = {
  id: ..., 
  nombre: ..., 
  descripcion: ..., 
  ingredientes: ..., // optional
  precio: ..., 
  categoria: ..., 
  imagenUrl: ..., 
};

// Call the `updateProducto()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateProducto(updateProductoVars);
// Variables can be defined inline as well.
const { data } = await updateProducto({ id: ..., nombre: ..., descripcion: ..., ingredientes: ..., precio: ..., categoria: ..., imagenUrl: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateProducto(dataConnect, updateProductoVars);

console.log(data.producto_update);

// Or, you can use the `Promise` API.
updateProducto(updateProductoVars).then((response) => {
  const data = response.data;
  console.log(data.producto_update);
});
```

### Using `UpdateProducto`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateProductoRef, UpdateProductoVariables } from '@dataconnect/generated';

// The `UpdateProducto` mutation requires an argument of type `UpdateProductoVariables`:
const updateProductoVars: UpdateProductoVariables = {
  id: ..., 
  nombre: ..., 
  descripcion: ..., 
  ingredientes: ..., // optional
  precio: ..., 
  categoria: ..., 
  imagenUrl: ..., 
};

// Call the `updateProductoRef()` function to get a reference to the mutation.
const ref = updateProductoRef(updateProductoVars);
// Variables can be defined inline as well.
const ref = updateProductoRef({ id: ..., nombre: ..., descripcion: ..., ingredientes: ..., precio: ..., categoria: ..., imagenUrl: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateProductoRef(dataConnect, updateProductoVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.producto_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.producto_update);
});
```

## DeleteProducto
You can execute the `DeleteProducto` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteProducto(vars: DeleteProductoVariables): MutationPromise<DeleteProductoData, DeleteProductoVariables>;

interface DeleteProductoRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteProductoVariables): MutationRef<DeleteProductoData, DeleteProductoVariables>;
}
export const deleteProductoRef: DeleteProductoRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteProducto(dc: DataConnect, vars: DeleteProductoVariables): MutationPromise<DeleteProductoData, DeleteProductoVariables>;

interface DeleteProductoRef {
  ...
  (dc: DataConnect, vars: DeleteProductoVariables): MutationRef<DeleteProductoData, DeleteProductoVariables>;
}
export const deleteProductoRef: DeleteProductoRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteProductoRef:
```typescript
const name = deleteProductoRef.operationName;
console.log(name);
```

### Variables
The `DeleteProducto` mutation requires an argument of type `DeleteProductoVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteProductoVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteProducto` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteProductoData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteProductoData {
  producto_update?: Producto_Key | null;
}
```
### Using `DeleteProducto`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteProducto, DeleteProductoVariables } from '@dataconnect/generated';

// The `DeleteProducto` mutation requires an argument of type `DeleteProductoVariables`:
const deleteProductoVars: DeleteProductoVariables = {
  id: ..., 
};

// Call the `deleteProducto()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteProducto(deleteProductoVars);
// Variables can be defined inline as well.
const { data } = await deleteProducto({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteProducto(dataConnect, deleteProductoVars);

console.log(data.producto_update);

// Or, you can use the `Promise` API.
deleteProducto(deleteProductoVars).then((response) => {
  const data = response.data;
  console.log(data.producto_update);
});
```

### Using `DeleteProducto`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteProductoRef, DeleteProductoVariables } from '@dataconnect/generated';

// The `DeleteProducto` mutation requires an argument of type `DeleteProductoVariables`:
const deleteProductoVars: DeleteProductoVariables = {
  id: ..., 
};

// Call the `deleteProductoRef()` function to get a reference to the mutation.
const ref = deleteProductoRef(deleteProductoVars);
// Variables can be defined inline as well.
const ref = deleteProductoRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteProductoRef(dataConnect, deleteProductoVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.producto_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.producto_update);
});
```

## CreatePedido
You can execute the `CreatePedido` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createPedido(vars: CreatePedidoVariables): MutationPromise<CreatePedidoData, CreatePedidoVariables>;

interface CreatePedidoRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreatePedidoVariables): MutationRef<CreatePedidoData, CreatePedidoVariables>;
}
export const createPedidoRef: CreatePedidoRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createPedido(dc: DataConnect, vars: CreatePedidoVariables): MutationPromise<CreatePedidoData, CreatePedidoVariables>;

interface CreatePedidoRef {
  ...
  (dc: DataConnect, vars: CreatePedidoVariables): MutationRef<CreatePedidoData, CreatePedidoVariables>;
}
export const createPedidoRef: CreatePedidoRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createPedidoRef:
```typescript
const name = createPedidoRef.operationName;
console.log(name);
```

### Variables
The `CreatePedido` mutation requires an argument of type `CreatePedidoVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreatePedidoVariables {
  codigo: string;
  usuarioId: UUIDString;
  subtotal: number;
  costoEnvio: number;
  total: number;
  modalidadEntrega: ModalidadEntrega;
  nombreContacto: string;
  telefonoContacto: string;
  direccion?: string | null;
}
```
### Return Type
Recall that executing the `CreatePedido` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreatePedidoData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreatePedidoData {
  pedido_insert: Pedido_Key;
}
```
### Using `CreatePedido`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createPedido, CreatePedidoVariables } from '@dataconnect/generated';

// The `CreatePedido` mutation requires an argument of type `CreatePedidoVariables`:
const createPedidoVars: CreatePedidoVariables = {
  codigo: ..., 
  usuarioId: ..., 
  subtotal: ..., 
  costoEnvio: ..., 
  total: ..., 
  modalidadEntrega: ..., 
  nombreContacto: ..., 
  telefonoContacto: ..., 
  direccion: ..., // optional
};

// Call the `createPedido()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createPedido(createPedidoVars);
// Variables can be defined inline as well.
const { data } = await createPedido({ codigo: ..., usuarioId: ..., subtotal: ..., costoEnvio: ..., total: ..., modalidadEntrega: ..., nombreContacto: ..., telefonoContacto: ..., direccion: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createPedido(dataConnect, createPedidoVars);

console.log(data.pedido_insert);

// Or, you can use the `Promise` API.
createPedido(createPedidoVars).then((response) => {
  const data = response.data;
  console.log(data.pedido_insert);
});
```

### Using `CreatePedido`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createPedidoRef, CreatePedidoVariables } from '@dataconnect/generated';

// The `CreatePedido` mutation requires an argument of type `CreatePedidoVariables`:
const createPedidoVars: CreatePedidoVariables = {
  codigo: ..., 
  usuarioId: ..., 
  subtotal: ..., 
  costoEnvio: ..., 
  total: ..., 
  modalidadEntrega: ..., 
  nombreContacto: ..., 
  telefonoContacto: ..., 
  direccion: ..., // optional
};

// Call the `createPedidoRef()` function to get a reference to the mutation.
const ref = createPedidoRef(createPedidoVars);
// Variables can be defined inline as well.
const ref = createPedidoRef({ codigo: ..., usuarioId: ..., subtotal: ..., costoEnvio: ..., total: ..., modalidadEntrega: ..., nombreContacto: ..., telefonoContacto: ..., direccion: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createPedidoRef(dataConnect, createPedidoVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.pedido_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.pedido_insert);
});
```

## CreatePedidoItem
You can execute the `CreatePedidoItem` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createPedidoItem(vars: CreatePedidoItemVariables): MutationPromise<CreatePedidoItemData, CreatePedidoItemVariables>;

interface CreatePedidoItemRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreatePedidoItemVariables): MutationRef<CreatePedidoItemData, CreatePedidoItemVariables>;
}
export const createPedidoItemRef: CreatePedidoItemRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createPedidoItem(dc: DataConnect, vars: CreatePedidoItemVariables): MutationPromise<CreatePedidoItemData, CreatePedidoItemVariables>;

interface CreatePedidoItemRef {
  ...
  (dc: DataConnect, vars: CreatePedidoItemVariables): MutationRef<CreatePedidoItemData, CreatePedidoItemVariables>;
}
export const createPedidoItemRef: CreatePedidoItemRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createPedidoItemRef:
```typescript
const name = createPedidoItemRef.operationName;
console.log(name);
```

### Variables
The `CreatePedidoItem` mutation requires an argument of type `CreatePedidoItemVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreatePedidoItemVariables {
  pedidoId: UUIDString;
  productoId?: UUIDString | null;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  precioTotalLinea: number;
  extraMedallon?: number | null;
  extraCheddar?: number | null;
  extraPanceta?: number | null;
  extraCebolla?: number | null;
  notas?: string | null;
}
```
### Return Type
Recall that executing the `CreatePedidoItem` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreatePedidoItemData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreatePedidoItemData {
  pedidoItem_insert: PedidoItem_Key;
}
```
### Using `CreatePedidoItem`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createPedidoItem, CreatePedidoItemVariables } from '@dataconnect/generated';

// The `CreatePedidoItem` mutation requires an argument of type `CreatePedidoItemVariables`:
const createPedidoItemVars: CreatePedidoItemVariables = {
  pedidoId: ..., 
  productoId: ..., // optional
  nombreProducto: ..., 
  cantidad: ..., 
  precioUnitario: ..., 
  precioTotalLinea: ..., 
  extraMedallon: ..., // optional
  extraCheddar: ..., // optional
  extraPanceta: ..., // optional
  extraCebolla: ..., // optional
  notas: ..., // optional
};

// Call the `createPedidoItem()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createPedidoItem(createPedidoItemVars);
// Variables can be defined inline as well.
const { data } = await createPedidoItem({ pedidoId: ..., productoId: ..., nombreProducto: ..., cantidad: ..., precioUnitario: ..., precioTotalLinea: ..., extraMedallon: ..., extraCheddar: ..., extraPanceta: ..., extraCebolla: ..., notas: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createPedidoItem(dataConnect, createPedidoItemVars);

console.log(data.pedidoItem_insert);

// Or, you can use the `Promise` API.
createPedidoItem(createPedidoItemVars).then((response) => {
  const data = response.data;
  console.log(data.pedidoItem_insert);
});
```

### Using `CreatePedidoItem`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createPedidoItemRef, CreatePedidoItemVariables } from '@dataconnect/generated';

// The `CreatePedidoItem` mutation requires an argument of type `CreatePedidoItemVariables`:
const createPedidoItemVars: CreatePedidoItemVariables = {
  pedidoId: ..., 
  productoId: ..., // optional
  nombreProducto: ..., 
  cantidad: ..., 
  precioUnitario: ..., 
  precioTotalLinea: ..., 
  extraMedallon: ..., // optional
  extraCheddar: ..., // optional
  extraPanceta: ..., // optional
  extraCebolla: ..., // optional
  notas: ..., // optional
};

// Call the `createPedidoItemRef()` function to get a reference to the mutation.
const ref = createPedidoItemRef(createPedidoItemVars);
// Variables can be defined inline as well.
const ref = createPedidoItemRef({ pedidoId: ..., productoId: ..., nombreProducto: ..., cantidad: ..., precioUnitario: ..., precioTotalLinea: ..., extraMedallon: ..., extraCheddar: ..., extraPanceta: ..., extraCebolla: ..., notas: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createPedidoItemRef(dataConnect, createPedidoItemVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.pedidoItem_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.pedidoItem_insert);
});
```

## UpdatePedidoEstado
You can execute the `UpdatePedidoEstado` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updatePedidoEstado(vars: UpdatePedidoEstadoVariables): MutationPromise<UpdatePedidoEstadoData, UpdatePedidoEstadoVariables>;

interface UpdatePedidoEstadoRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdatePedidoEstadoVariables): MutationRef<UpdatePedidoEstadoData, UpdatePedidoEstadoVariables>;
}
export const updatePedidoEstadoRef: UpdatePedidoEstadoRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updatePedidoEstado(dc: DataConnect, vars: UpdatePedidoEstadoVariables): MutationPromise<UpdatePedidoEstadoData, UpdatePedidoEstadoVariables>;

interface UpdatePedidoEstadoRef {
  ...
  (dc: DataConnect, vars: UpdatePedidoEstadoVariables): MutationRef<UpdatePedidoEstadoData, UpdatePedidoEstadoVariables>;
}
export const updatePedidoEstadoRef: UpdatePedidoEstadoRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updatePedidoEstadoRef:
```typescript
const name = updatePedidoEstadoRef.operationName;
console.log(name);
```

### Variables
The `UpdatePedidoEstado` mutation requires an argument of type `UpdatePedidoEstadoVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdatePedidoEstadoVariables {
  id: UUIDString;
  estado: EstadoPedido;
}
```
### Return Type
Recall that executing the `UpdatePedidoEstado` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdatePedidoEstadoData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdatePedidoEstadoData {
  pedido_update?: Pedido_Key | null;
}
```
### Using `UpdatePedidoEstado`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updatePedidoEstado, UpdatePedidoEstadoVariables } from '@dataconnect/generated';

// The `UpdatePedidoEstado` mutation requires an argument of type `UpdatePedidoEstadoVariables`:
const updatePedidoEstadoVars: UpdatePedidoEstadoVariables = {
  id: ..., 
  estado: ..., 
};

// Call the `updatePedidoEstado()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updatePedidoEstado(updatePedidoEstadoVars);
// Variables can be defined inline as well.
const { data } = await updatePedidoEstado({ id: ..., estado: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updatePedidoEstado(dataConnect, updatePedidoEstadoVars);

console.log(data.pedido_update);

// Or, you can use the `Promise` API.
updatePedidoEstado(updatePedidoEstadoVars).then((response) => {
  const data = response.data;
  console.log(data.pedido_update);
});
```

### Using `UpdatePedidoEstado`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updatePedidoEstadoRef, UpdatePedidoEstadoVariables } from '@dataconnect/generated';

// The `UpdatePedidoEstado` mutation requires an argument of type `UpdatePedidoEstadoVariables`:
const updatePedidoEstadoVars: UpdatePedidoEstadoVariables = {
  id: ..., 
  estado: ..., 
};

// Call the `updatePedidoEstadoRef()` function to get a reference to the mutation.
const ref = updatePedidoEstadoRef(updatePedidoEstadoVars);
// Variables can be defined inline as well.
const ref = updatePedidoEstadoRef({ id: ..., estado: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updatePedidoEstadoRef(dataConnect, updatePedidoEstadoVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.pedido_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.pedido_update);
});
```

