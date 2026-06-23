# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.




### React
For each operation, there is a wrapper hook that can be used to call the operation.

Here are all of the hooks that get generated:
```ts
import { useCreateUsuario, useCreateProducto, useUpdateProducto, useDeleteProducto, useCreatePedido, useCreatePedidoItem, useUpdatePedidoEstado, useListProductosActivos, useListProductosAdmin, useListPedidosByUsuario } from '@dataconnect/generated/react';
// The types of these hooks are available in react/index.d.ts

const { data, isPending, isSuccess, isError, error } = useCreateUsuario(createUsuarioVars);

const { data, isPending, isSuccess, isError, error } = useCreateProducto(createProductoVars);

const { data, isPending, isSuccess, isError, error } = useUpdateProducto(updateProductoVars);

const { data, isPending, isSuccess, isError, error } = useDeleteProducto(deleteProductoVars);

const { data, isPending, isSuccess, isError, error } = useCreatePedido(createPedidoVars);

const { data, isPending, isSuccess, isError, error } = useCreatePedidoItem(createPedidoItemVars);

const { data, isPending, isSuccess, isError, error } = useUpdatePedidoEstado(updatePedidoEstadoVars);

const { data, isPending, isSuccess, isError, error } = useListProductosActivos();

const { data, isPending, isSuccess, isError, error } = useListProductosAdmin();

const { data, isPending, isSuccess, isError, error } = useListPedidosByUsuario(listPedidosByUsuarioVars);

```

Here's an example from a different generated SDK:

```ts
import { useListAllMovies } from '@dataconnect/generated/react';

function MyComponent() {
  const { isLoading, data, error } = useListAllMovies();
  if(isLoading) {
    return <div>Loading...</div>
  }
  if(error) {
    return <div> An Error Occurred: {error} </div>
  }
}

// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MyComponent from './my-component';

function App() {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
    <MyComponent />
  </QueryClientProvider>
}
```



## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createUsuario, createProducto, updateProducto, deleteProducto, createPedido, createPedidoItem, updatePedidoEstado, listProductosActivos, listProductosAdmin, listPedidosByUsuario } from '@dataconnect/generated';


// Operation CreateUsuario:  For variables, look at type CreateUsuarioVars in ../index.d.ts
const { data } = await CreateUsuario(dataConnect, createUsuarioVars);

// Operation CreateProducto:  For variables, look at type CreateProductoVars in ../index.d.ts
const { data } = await CreateProducto(dataConnect, createProductoVars);

// Operation UpdateProducto:  For variables, look at type UpdateProductoVars in ../index.d.ts
const { data } = await UpdateProducto(dataConnect, updateProductoVars);

// Operation DeleteProducto:  For variables, look at type DeleteProductoVars in ../index.d.ts
const { data } = await DeleteProducto(dataConnect, deleteProductoVars);

// Operation CreatePedido:  For variables, look at type CreatePedidoVars in ../index.d.ts
const { data } = await CreatePedido(dataConnect, createPedidoVars);

// Operation CreatePedidoItem:  For variables, look at type CreatePedidoItemVars in ../index.d.ts
const { data } = await CreatePedidoItem(dataConnect, createPedidoItemVars);

// Operation UpdatePedidoEstado:  For variables, look at type UpdatePedidoEstadoVars in ../index.d.ts
const { data } = await UpdatePedidoEstado(dataConnect, updatePedidoEstadoVars);

// Operation ListProductosActivos: 
const { data } = await ListProductosActivos(dataConnect);

// Operation ListProductosAdmin: 
const { data } = await ListProductosAdmin(dataConnect);

// Operation ListPedidosByUsuario:  For variables, look at type ListPedidosByUsuarioVars in ../index.d.ts
const { data } = await ListPedidosByUsuario(dataConnect, listPedidosByUsuarioVars);


```