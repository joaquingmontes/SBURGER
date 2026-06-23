# Generated React README
This README will guide you through the process of using the generated React SDK package for the connector `default`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `JavaScript README`, you can find it at [`dataconnect-generated/README.md`](../README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

You can use this generated SDK by importing from the package `@dataconnect/generated/react` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#react).

# Table of Contents
- [**Overview**](#generated-react-readme)
- [**TanStack Query Firebase & TanStack React Query**](#tanstack-query-firebase-tanstack-react-query)
  - [*Package Installation*](#installing-tanstack-query-firebase-and-tanstack-react-query-packages)
  - [*Configuring TanStack Query*](#configuring-tanstack-query)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListProductosActivos*](#listproductosactivos)
  - [*ListProductosAdmin*](#listproductosadmin)
  - [*ListPedidosByUsuario*](#listpedidosbyusuario)
  - [*ListPedidosAdmin*](#listpedidosadmin)
  - [*GetUsuarioByEmail*](#getusuariobyemail)
  - [*GetProductoById*](#getproductobyid)
- [**Mutations**](#mutations)
  - [*CreateUsuario*](#createusuario)
  - [*CreateProducto*](#createproducto)
  - [*UpdateProducto*](#updateproducto)
  - [*DeleteProducto*](#deleteproducto)
  - [*CreatePedido*](#createpedido)
  - [*CreatePedidoItem*](#createpedidoitem)
  - [*UpdatePedidoEstado*](#updatepedidoestado)

# TanStack Query Firebase & TanStack React Query
This SDK provides [React](https://react.dev/) hooks generated specific to your application, for the operations found in the connector `default`. These hooks are generated using [TanStack Query Firebase](https://react-query-firebase.invertase.dev/) by our partners at Invertase, a library built on top of [TanStack React Query v5](https://tanstack.com/query/v5/docs/framework/react/overview).

***You do not need to be familiar with Tanstack Query or Tanstack Query Firebase to use this SDK.*** However, you may find it useful to learn more about them, as they will empower you as a user of this Generated React SDK.

## Installing TanStack Query Firebase and TanStack React Query Packages
In order to use the React generated SDK, you must install the `TanStack React Query` and `TanStack Query Firebase` packages.
```bash
npm i --save @tanstack/react-query @tanstack-query-firebase/react
```
```bash
npm i --save firebase@latest # Note: React has a peer dependency on ^11.3.0
```

You can also follow the installation instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#tanstack-install), or the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/react) and [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/installation).

## Configuring TanStack Query
In order to use the React generated SDK in your application, you must wrap your application's component tree in a `QueryClientProvider` component from TanStack React Query. None of your generated React SDK hooks will work without this provider.

```javascript
import { QueryClientProvider } from '@tanstack/react-query';

// Create a TanStack Query client instance
const queryClient = new QueryClient()

function App() {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <MyApplication />
    </QueryClientProvider>
  )
}
```

To learn more about `QueryClientProvider`, see the [TanStack React Query documentation](https://tanstack.com/query/latest/docs/framework/react/quick-start) and the [TanStack Query Firebase documentation](https://invertase.docs.page/tanstack-query-firebase/react#usage).

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `default`.

You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#emulator-react-angular).

```javascript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) using the hooks provided from your generated React SDK.

# Queries

The React generated SDK provides Query hook functions that call and return [`useDataConnectQuery`](https://react-query-firebase.invertase.dev/react/data-connect/querying) hooks from TanStack Query Firebase.

Calling these hook functions will return a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and the most recent data returned by the Query, among other things. To learn more about these hooks and how to use them, see the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/react/data-connect/querying).

TanStack React Query caches the results of your Queries, so using the same Query hook function in multiple places in your application allows the entire application to automatically see updates to that Query's data.

Query hooks execute their Queries automatically when called, and periodically refresh, unless you change the `queryOptions` for the Query. To learn how to stop a Query from automatically executing, including how to make a query "lazy", see the [TanStack React Query documentation](https://tanstack.com/query/latest/docs/framework/react/guides/disabling-queries).

To learn more about TanStack React Query's Queries, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/queries).

## Using Query Hooks
Here's a general overview of how to use the generated Query hooks in your code:

- If the Query has no variables, the Query hook function does not require arguments.
- If the Query has any required variables, the Query hook function will require at least one argument: an object that contains all the required variables for the Query.
- If the Query has some required and some optional variables, only required variables are necessary in the variables argument object, and optional variables may be provided as well.
- If all of the Query's variables are optional, the Query hook function does not require any arguments.
- Query hook functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.
- Query hooks functions can be called with or without passing in an `options` argument of type `useDataConnectQueryOptions`. To learn more about the `options` argument, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/query-options).
  - ***Special case:***  If the Query has all optional variables and you would like to provide an `options` argument to the Query hook function without providing any variables, you must pass `undefined` where you would normally pass the Query's variables, and then may provide the `options` argument.

Below are examples of how to use the `default` connector's generated Query hook functions to execute each Query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#operations-react-angular).

## ListProductosActivos
You can execute the `ListProductosActivos` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListProductosActivos(dc: DataConnect, options?: useDataConnectQueryOptions<ListProductosActivosData>): UseDataConnectQueryResult<ListProductosActivosData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListProductosActivos(options?: useDataConnectQueryOptions<ListProductosActivosData>): UseDataConnectQueryResult<ListProductosActivosData, undefined>;
```

### Variables
The `ListProductosActivos` Query has no variables.
### Return Type
Recall that calling the `ListProductosActivos` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListProductosActivos` Query is of type `ListProductosActivosData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListProductosActivos`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';
import { useListProductosActivos } from '@dataconnect/generated/react'

export default function ListProductosActivosComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListProductosActivos();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListProductosActivos(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListProductosActivos(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListProductosActivos(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.productos);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListProductosAdmin
You can execute the `ListProductosAdmin` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListProductosAdmin(dc: DataConnect, options?: useDataConnectQueryOptions<ListProductosAdminData>): UseDataConnectQueryResult<ListProductosAdminData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListProductosAdmin(options?: useDataConnectQueryOptions<ListProductosAdminData>): UseDataConnectQueryResult<ListProductosAdminData, undefined>;
```

### Variables
The `ListProductosAdmin` Query has no variables.
### Return Type
Recall that calling the `ListProductosAdmin` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListProductosAdmin` Query is of type `ListProductosAdminData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListProductosAdmin`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';
import { useListProductosAdmin } from '@dataconnect/generated/react'

export default function ListProductosAdminComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListProductosAdmin();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListProductosAdmin(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListProductosAdmin(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListProductosAdmin(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.productos);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListPedidosByUsuario
You can execute the `ListPedidosByUsuario` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListPedidosByUsuario(dc: DataConnect, vars: ListPedidosByUsuarioVariables, options?: useDataConnectQueryOptions<ListPedidosByUsuarioData>): UseDataConnectQueryResult<ListPedidosByUsuarioData, ListPedidosByUsuarioVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListPedidosByUsuario(vars: ListPedidosByUsuarioVariables, options?: useDataConnectQueryOptions<ListPedidosByUsuarioData>): UseDataConnectQueryResult<ListPedidosByUsuarioData, ListPedidosByUsuarioVariables>;
```

### Variables
The `ListPedidosByUsuario` Query requires an argument of type `ListPedidosByUsuarioVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface ListPedidosByUsuarioVariables {
  usuarioId: UUIDString;
}
```
### Return Type
Recall that calling the `ListPedidosByUsuario` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListPedidosByUsuario` Query is of type `ListPedidosByUsuarioData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface ListPedidosByUsuarioData {
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListPedidosByUsuario`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, ListPedidosByUsuarioVariables } from '@dataconnect/generated';
import { useListPedidosByUsuario } from '@dataconnect/generated/react'

export default function ListPedidosByUsuarioComponent() {
  // The `useListPedidosByUsuario` Query hook requires an argument of type `ListPedidosByUsuarioVariables`:
  const listPedidosByUsuarioVars: ListPedidosByUsuarioVariables = {
    usuarioId: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListPedidosByUsuario(listPedidosByUsuarioVars);
  // Variables can be defined inline as well.
  const query = useListPedidosByUsuario({ usuarioId: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListPedidosByUsuario(dataConnect, listPedidosByUsuarioVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListPedidosByUsuario(listPedidosByUsuarioVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListPedidosByUsuario(dataConnect, listPedidosByUsuarioVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.pedidos);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListPedidosAdmin
You can execute the `ListPedidosAdmin` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListPedidosAdmin(dc: DataConnect, options?: useDataConnectQueryOptions<ListPedidosAdminData>): UseDataConnectQueryResult<ListPedidosAdminData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListPedidosAdmin(options?: useDataConnectQueryOptions<ListPedidosAdminData>): UseDataConnectQueryResult<ListPedidosAdminData, undefined>;
```

### Variables
The `ListPedidosAdmin` Query has no variables.
### Return Type
Recall that calling the `ListPedidosAdmin` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListPedidosAdmin` Query is of type `ListPedidosAdminData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListPedidosAdmin`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';
import { useListPedidosAdmin } from '@dataconnect/generated/react'

export default function ListPedidosAdminComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListPedidosAdmin();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListPedidosAdmin(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListPedidosAdmin(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListPedidosAdmin(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.pedidos);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## GetUsuarioByEmail
You can execute the `GetUsuarioByEmail` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetUsuarioByEmail(dc: DataConnect, vars: GetUsuarioByEmailVariables, options?: useDataConnectQueryOptions<GetUsuarioByEmailData>): UseDataConnectQueryResult<GetUsuarioByEmailData, GetUsuarioByEmailVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetUsuarioByEmail(vars: GetUsuarioByEmailVariables, options?: useDataConnectQueryOptions<GetUsuarioByEmailData>): UseDataConnectQueryResult<GetUsuarioByEmailData, GetUsuarioByEmailVariables>;
```

### Variables
The `GetUsuarioByEmail` Query requires an argument of type `GetUsuarioByEmailVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetUsuarioByEmailVariables {
  email: string;
}
```
### Return Type
Recall that calling the `GetUsuarioByEmail` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetUsuarioByEmail` Query is of type `GetUsuarioByEmailData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface GetUsuarioByEmailData {
  usuarios: ({
    id: UUIDString;
    nombreCompleto: string;
    email: string;
    passwordHash: string;
    rol: RolUsuario;
  } & Usuario_Key)[];
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetUsuarioByEmail`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, GetUsuarioByEmailVariables } from '@dataconnect/generated';
import { useGetUsuarioByEmail } from '@dataconnect/generated/react'

export default function GetUsuarioByEmailComponent() {
  // The `useGetUsuarioByEmail` Query hook requires an argument of type `GetUsuarioByEmailVariables`:
  const getUsuarioByEmailVars: GetUsuarioByEmailVariables = {
    email: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetUsuarioByEmail(getUsuarioByEmailVars);
  // Variables can be defined inline as well.
  const query = useGetUsuarioByEmail({ email: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetUsuarioByEmail(dataConnect, getUsuarioByEmailVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetUsuarioByEmail(getUsuarioByEmailVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetUsuarioByEmail(dataConnect, getUsuarioByEmailVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.usuarios);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## GetProductoById
You can execute the `GetProductoById` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetProductoById(dc: DataConnect, vars: GetProductoByIdVariables, options?: useDataConnectQueryOptions<GetProductoByIdData>): UseDataConnectQueryResult<GetProductoByIdData, GetProductoByIdVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetProductoById(vars: GetProductoByIdVariables, options?: useDataConnectQueryOptions<GetProductoByIdData>): UseDataConnectQueryResult<GetProductoByIdData, GetProductoByIdVariables>;
```

### Variables
The `GetProductoById` Query requires an argument of type `GetProductoByIdVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetProductoByIdVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `GetProductoById` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetProductoById` Query is of type `GetProductoByIdData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetProductoById`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, GetProductoByIdVariables } from '@dataconnect/generated';
import { useGetProductoById } from '@dataconnect/generated/react'

export default function GetProductoByIdComponent() {
  // The `useGetProductoById` Query hook requires an argument of type `GetProductoByIdVariables`:
  const getProductoByIdVars: GetProductoByIdVariables = {
    id: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetProductoById(getProductoByIdVars);
  // Variables can be defined inline as well.
  const query = useGetProductoById({ id: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetProductoById(dataConnect, getProductoByIdVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetProductoById(getProductoByIdVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetProductoById(dataConnect, getProductoByIdVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.productos);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

# Mutations

The React generated SDK provides Mutations hook functions that call and return [`useDataConnectMutation`](https://react-query-firebase.invertase.dev/react/data-connect/mutations) hooks from TanStack Query Firebase.

Calling these hook functions will return a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, and the most recent data returned by the Mutation, among other things. To learn more about these hooks and how to use them, see the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/react/data-connect/mutations).

Mutation hooks do not execute their Mutations automatically when called. Rather, after calling the Mutation hook function and getting a `UseMutationResult` object, you must call the `UseMutationResult.mutate()` function to execute the Mutation.

To learn more about TanStack React Query's Mutations, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/mutations).

## Using Mutation Hooks
Here's a general overview of how to use the generated Mutation hooks in your code:

- Mutation hook functions are not called with the arguments to the Mutation. Instead, arguments are passed to `UseMutationResult.mutate()`.
- If the Mutation has no variables, the `mutate()` function does not require arguments.
- If the Mutation has any required variables, the `mutate()` function will require at least one argument: an object that contains all the required variables for the Mutation.
- If the Mutation has some required and some optional variables, only required variables are necessary in the variables argument object, and optional variables may be provided as well.
- If all of the Mutation's variables are optional, the Mutation hook function does not require any arguments.
- Mutation hook functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.
- Mutation hooks also accept an `options` argument of type `useDataConnectMutationOptions`. To learn more about the `options` argument, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/mutations#mutation-side-effects).
  - `UseMutationResult.mutate()` also accepts an `options` argument of type `useDataConnectMutationOptions`.
  - ***Special case:*** If the Mutation has no arguments (or all optional arguments and you wish to provide none), and you want to pass `options` to `UseMutationResult.mutate()`, you must pass `undefined` where you would normally pass the Mutation's arguments, and then may provide the options argument.

Below are examples of how to use the `default` connector's generated Mutation hook functions to execute each Mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#operations-react-angular).

## CreateUsuario
You can execute the `CreateUsuario` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useCreateUsuario(options?: useDataConnectMutationOptions<CreateUsuarioData, FirebaseError, CreateUsuarioVariables>): UseDataConnectMutationResult<CreateUsuarioData, CreateUsuarioVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateUsuario(dc: DataConnect, options?: useDataConnectMutationOptions<CreateUsuarioData, FirebaseError, CreateUsuarioVariables>): UseDataConnectMutationResult<CreateUsuarioData, CreateUsuarioVariables>;
```

### Variables
The `CreateUsuario` Mutation requires an argument of type `CreateUsuarioVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface CreateUsuarioVariables {
  nombreCompleto: string;
  email: string;
  passwordHash: string;
  rol?: RolUsuario | null;
}
```
### Return Type
Recall that calling the `CreateUsuario` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreateUsuario` Mutation is of type `CreateUsuarioData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateUsuarioData {
  usuario_insert: Usuario_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreateUsuario`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateUsuarioVariables } from '@dataconnect/generated';
import { useCreateUsuario } from '@dataconnect/generated/react'

export default function CreateUsuarioComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateUsuario();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateUsuario(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateUsuario(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateUsuario(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateUsuario` Mutation requires an argument of type `CreateUsuarioVariables`:
  const createUsuarioVars: CreateUsuarioVariables = {
    nombreCompleto: ..., 
    email: ..., 
    passwordHash: ..., 
    rol: ..., // optional
  };
  mutation.mutate(createUsuarioVars);
  // Variables can be defined inline as well.
  mutation.mutate({ nombreCompleto: ..., email: ..., passwordHash: ..., rol: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createUsuarioVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.usuario_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## CreateProducto
You can execute the `CreateProducto` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useCreateProducto(options?: useDataConnectMutationOptions<CreateProductoData, FirebaseError, CreateProductoVariables>): UseDataConnectMutationResult<CreateProductoData, CreateProductoVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateProducto(dc: DataConnect, options?: useDataConnectMutationOptions<CreateProductoData, FirebaseError, CreateProductoVariables>): UseDataConnectMutationResult<CreateProductoData, CreateProductoVariables>;
```

### Variables
The `CreateProducto` Mutation requires an argument of type `CreateProductoVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `CreateProducto` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreateProducto` Mutation is of type `CreateProductoData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateProductoData {
  producto_insert: Producto_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreateProducto`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateProductoVariables } from '@dataconnect/generated';
import { useCreateProducto } from '@dataconnect/generated/react'

export default function CreateProductoComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateProducto();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateProducto(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateProducto(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateProducto(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateProducto` Mutation requires an argument of type `CreateProductoVariables`:
  const createProductoVars: CreateProductoVariables = {
    nombre: ..., 
    descripcion: ..., 
    ingredientes: ..., // optional
    precio: ..., 
    categoria: ..., 
    imagenUrl: ..., 
  };
  mutation.mutate(createProductoVars);
  // Variables can be defined inline as well.
  mutation.mutate({ nombre: ..., descripcion: ..., ingredientes: ..., precio: ..., categoria: ..., imagenUrl: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createProductoVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.producto_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpdateProducto
You can execute the `UpdateProducto` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpdateProducto(options?: useDataConnectMutationOptions<UpdateProductoData, FirebaseError, UpdateProductoVariables>): UseDataConnectMutationResult<UpdateProductoData, UpdateProductoVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpdateProducto(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateProductoData, FirebaseError, UpdateProductoVariables>): UseDataConnectMutationResult<UpdateProductoData, UpdateProductoVariables>;
```

### Variables
The `UpdateProducto` Mutation requires an argument of type `UpdateProductoVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `UpdateProducto` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpdateProducto` Mutation is of type `UpdateProductoData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateProductoData {
  producto_update?: Producto_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpdateProducto`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpdateProductoVariables } from '@dataconnect/generated';
import { useUpdateProducto } from '@dataconnect/generated/react'

export default function UpdateProductoComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpdateProducto();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpdateProducto(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateProducto(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateProducto(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpdateProducto` Mutation requires an argument of type `UpdateProductoVariables`:
  const updateProductoVars: UpdateProductoVariables = {
    id: ..., 
    nombre: ..., 
    descripcion: ..., 
    ingredientes: ..., // optional
    precio: ..., 
    categoria: ..., 
    imagenUrl: ..., 
  };
  mutation.mutate(updateProductoVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., nombre: ..., descripcion: ..., ingredientes: ..., precio: ..., categoria: ..., imagenUrl: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(updateProductoVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.producto_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## DeleteProducto
You can execute the `DeleteProducto` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useDeleteProducto(options?: useDataConnectMutationOptions<DeleteProductoData, FirebaseError, DeleteProductoVariables>): UseDataConnectMutationResult<DeleteProductoData, DeleteProductoVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useDeleteProducto(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteProductoData, FirebaseError, DeleteProductoVariables>): UseDataConnectMutationResult<DeleteProductoData, DeleteProductoVariables>;
```

### Variables
The `DeleteProducto` Mutation requires an argument of type `DeleteProductoVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface DeleteProductoVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `DeleteProducto` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `DeleteProducto` Mutation is of type `DeleteProductoData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface DeleteProductoData {
  producto_update?: Producto_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `DeleteProducto`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, DeleteProductoVariables } from '@dataconnect/generated';
import { useDeleteProducto } from '@dataconnect/generated/react'

export default function DeleteProductoComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useDeleteProducto();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useDeleteProducto(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteProducto(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteProducto(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useDeleteProducto` Mutation requires an argument of type `DeleteProductoVariables`:
  const deleteProductoVars: DeleteProductoVariables = {
    id: ..., 
  };
  mutation.mutate(deleteProductoVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(deleteProductoVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.producto_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## CreatePedido
You can execute the `CreatePedido` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useCreatePedido(options?: useDataConnectMutationOptions<CreatePedidoData, FirebaseError, CreatePedidoVariables>): UseDataConnectMutationResult<CreatePedidoData, CreatePedidoVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreatePedido(dc: DataConnect, options?: useDataConnectMutationOptions<CreatePedidoData, FirebaseError, CreatePedidoVariables>): UseDataConnectMutationResult<CreatePedidoData, CreatePedidoVariables>;
```

### Variables
The `CreatePedido` Mutation requires an argument of type `CreatePedidoVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `CreatePedido` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreatePedido` Mutation is of type `CreatePedidoData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreatePedidoData {
  pedido_insert: Pedido_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreatePedido`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreatePedidoVariables } from '@dataconnect/generated';
import { useCreatePedido } from '@dataconnect/generated/react'

export default function CreatePedidoComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreatePedido();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreatePedido(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreatePedido(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreatePedido(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreatePedido` Mutation requires an argument of type `CreatePedidoVariables`:
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
  mutation.mutate(createPedidoVars);
  // Variables can be defined inline as well.
  mutation.mutate({ codigo: ..., usuarioId: ..., subtotal: ..., costoEnvio: ..., total: ..., modalidadEntrega: ..., nombreContacto: ..., telefonoContacto: ..., direccion: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createPedidoVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.pedido_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## CreatePedidoItem
You can execute the `CreatePedidoItem` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useCreatePedidoItem(options?: useDataConnectMutationOptions<CreatePedidoItemData, FirebaseError, CreatePedidoItemVariables>): UseDataConnectMutationResult<CreatePedidoItemData, CreatePedidoItemVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreatePedidoItem(dc: DataConnect, options?: useDataConnectMutationOptions<CreatePedidoItemData, FirebaseError, CreatePedidoItemVariables>): UseDataConnectMutationResult<CreatePedidoItemData, CreatePedidoItemVariables>;
```

### Variables
The `CreatePedidoItem` Mutation requires an argument of type `CreatePedidoItemVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `CreatePedidoItem` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreatePedidoItem` Mutation is of type `CreatePedidoItemData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreatePedidoItemData {
  pedidoItem_insert: PedidoItem_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreatePedidoItem`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreatePedidoItemVariables } from '@dataconnect/generated';
import { useCreatePedidoItem } from '@dataconnect/generated/react'

export default function CreatePedidoItemComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreatePedidoItem();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreatePedidoItem(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreatePedidoItem(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreatePedidoItem(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreatePedidoItem` Mutation requires an argument of type `CreatePedidoItemVariables`:
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
  mutation.mutate(createPedidoItemVars);
  // Variables can be defined inline as well.
  mutation.mutate({ pedidoId: ..., productoId: ..., nombreProducto: ..., cantidad: ..., precioUnitario: ..., precioTotalLinea: ..., extraMedallon: ..., extraCheddar: ..., extraPanceta: ..., extraCebolla: ..., notas: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createPedidoItemVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.pedidoItem_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpdatePedidoEstado
You can execute the `UpdatePedidoEstado` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpdatePedidoEstado(options?: useDataConnectMutationOptions<UpdatePedidoEstadoData, FirebaseError, UpdatePedidoEstadoVariables>): UseDataConnectMutationResult<UpdatePedidoEstadoData, UpdatePedidoEstadoVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpdatePedidoEstado(dc: DataConnect, options?: useDataConnectMutationOptions<UpdatePedidoEstadoData, FirebaseError, UpdatePedidoEstadoVariables>): UseDataConnectMutationResult<UpdatePedidoEstadoData, UpdatePedidoEstadoVariables>;
```

### Variables
The `UpdatePedidoEstado` Mutation requires an argument of type `UpdatePedidoEstadoVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpdatePedidoEstadoVariables {
  id: UUIDString;
  estado: EstadoPedido;
}
```
### Return Type
Recall that calling the `UpdatePedidoEstado` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpdatePedidoEstado` Mutation is of type `UpdatePedidoEstadoData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdatePedidoEstadoData {
  pedido_update?: Pedido_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpdatePedidoEstado`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpdatePedidoEstadoVariables } from '@dataconnect/generated';
import { useUpdatePedidoEstado } from '@dataconnect/generated/react'

export default function UpdatePedidoEstadoComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpdatePedidoEstado();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpdatePedidoEstado(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdatePedidoEstado(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdatePedidoEstado(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpdatePedidoEstado` Mutation requires an argument of type `UpdatePedidoEstadoVariables`:
  const updatePedidoEstadoVars: UpdatePedidoEstadoVariables = {
    id: ..., 
    estado: ..., 
  };
  mutation.mutate(updatePedidoEstadoVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., estado: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(updatePedidoEstadoVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.pedido_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

