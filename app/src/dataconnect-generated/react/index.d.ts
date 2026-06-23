import { CreateUsuarioData, CreateUsuarioVariables, CreateProductoData, CreateProductoVariables, UpdateProductoData, UpdateProductoVariables, DeleteProductoData, DeleteProductoVariables, CreatePedidoData, CreatePedidoVariables, CreatePedidoItemData, CreatePedidoItemVariables, UpdatePedidoEstadoData, UpdatePedidoEstadoVariables, ListProductosActivosData, ListProductosAdminData, ListPedidosByUsuarioData, ListPedidosByUsuarioVariables, ListPedidosAdminData, GetUsuarioByEmailData, GetUsuarioByEmailVariables, GetProductoByIdData, GetProductoByIdVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateUsuario(options?: useDataConnectMutationOptions<CreateUsuarioData, FirebaseError, CreateUsuarioVariables>): UseDataConnectMutationResult<CreateUsuarioData, CreateUsuarioVariables>;
export function useCreateUsuario(dc: DataConnect, options?: useDataConnectMutationOptions<CreateUsuarioData, FirebaseError, CreateUsuarioVariables>): UseDataConnectMutationResult<CreateUsuarioData, CreateUsuarioVariables>;

export function useCreateProducto(options?: useDataConnectMutationOptions<CreateProductoData, FirebaseError, CreateProductoVariables>): UseDataConnectMutationResult<CreateProductoData, CreateProductoVariables>;
export function useCreateProducto(dc: DataConnect, options?: useDataConnectMutationOptions<CreateProductoData, FirebaseError, CreateProductoVariables>): UseDataConnectMutationResult<CreateProductoData, CreateProductoVariables>;

export function useUpdateProducto(options?: useDataConnectMutationOptions<UpdateProductoData, FirebaseError, UpdateProductoVariables>): UseDataConnectMutationResult<UpdateProductoData, UpdateProductoVariables>;
export function useUpdateProducto(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateProductoData, FirebaseError, UpdateProductoVariables>): UseDataConnectMutationResult<UpdateProductoData, UpdateProductoVariables>;

export function useDeleteProducto(options?: useDataConnectMutationOptions<DeleteProductoData, FirebaseError, DeleteProductoVariables>): UseDataConnectMutationResult<DeleteProductoData, DeleteProductoVariables>;
export function useDeleteProducto(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteProductoData, FirebaseError, DeleteProductoVariables>): UseDataConnectMutationResult<DeleteProductoData, DeleteProductoVariables>;

export function useCreatePedido(options?: useDataConnectMutationOptions<CreatePedidoData, FirebaseError, CreatePedidoVariables>): UseDataConnectMutationResult<CreatePedidoData, CreatePedidoVariables>;
export function useCreatePedido(dc: DataConnect, options?: useDataConnectMutationOptions<CreatePedidoData, FirebaseError, CreatePedidoVariables>): UseDataConnectMutationResult<CreatePedidoData, CreatePedidoVariables>;

export function useCreatePedidoItem(options?: useDataConnectMutationOptions<CreatePedidoItemData, FirebaseError, CreatePedidoItemVariables>): UseDataConnectMutationResult<CreatePedidoItemData, CreatePedidoItemVariables>;
export function useCreatePedidoItem(dc: DataConnect, options?: useDataConnectMutationOptions<CreatePedidoItemData, FirebaseError, CreatePedidoItemVariables>): UseDataConnectMutationResult<CreatePedidoItemData, CreatePedidoItemVariables>;

export function useUpdatePedidoEstado(options?: useDataConnectMutationOptions<UpdatePedidoEstadoData, FirebaseError, UpdatePedidoEstadoVariables>): UseDataConnectMutationResult<UpdatePedidoEstadoData, UpdatePedidoEstadoVariables>;
export function useUpdatePedidoEstado(dc: DataConnect, options?: useDataConnectMutationOptions<UpdatePedidoEstadoData, FirebaseError, UpdatePedidoEstadoVariables>): UseDataConnectMutationResult<UpdatePedidoEstadoData, UpdatePedidoEstadoVariables>;

export function useListProductosActivos(options?: useDataConnectQueryOptions<ListProductosActivosData>): UseDataConnectQueryResult<ListProductosActivosData, undefined>;
export function useListProductosActivos(dc: DataConnect, options?: useDataConnectQueryOptions<ListProductosActivosData>): UseDataConnectQueryResult<ListProductosActivosData, undefined>;

export function useListProductosAdmin(options?: useDataConnectQueryOptions<ListProductosAdminData>): UseDataConnectQueryResult<ListProductosAdminData, undefined>;
export function useListProductosAdmin(dc: DataConnect, options?: useDataConnectQueryOptions<ListProductosAdminData>): UseDataConnectQueryResult<ListProductosAdminData, undefined>;

export function useListPedidosByUsuario(vars: ListPedidosByUsuarioVariables, options?: useDataConnectQueryOptions<ListPedidosByUsuarioData>): UseDataConnectQueryResult<ListPedidosByUsuarioData, ListPedidosByUsuarioVariables>;
export function useListPedidosByUsuario(dc: DataConnect, vars: ListPedidosByUsuarioVariables, options?: useDataConnectQueryOptions<ListPedidosByUsuarioData>): UseDataConnectQueryResult<ListPedidosByUsuarioData, ListPedidosByUsuarioVariables>;

export function useListPedidosAdmin(options?: useDataConnectQueryOptions<ListPedidosAdminData>): UseDataConnectQueryResult<ListPedidosAdminData, undefined>;
export function useListPedidosAdmin(dc: DataConnect, options?: useDataConnectQueryOptions<ListPedidosAdminData>): UseDataConnectQueryResult<ListPedidosAdminData, undefined>;

export function useGetUsuarioByEmail(vars: GetUsuarioByEmailVariables, options?: useDataConnectQueryOptions<GetUsuarioByEmailData>): UseDataConnectQueryResult<GetUsuarioByEmailData, GetUsuarioByEmailVariables>;
export function useGetUsuarioByEmail(dc: DataConnect, vars: GetUsuarioByEmailVariables, options?: useDataConnectQueryOptions<GetUsuarioByEmailData>): UseDataConnectQueryResult<GetUsuarioByEmailData, GetUsuarioByEmailVariables>;

export function useGetProductoById(vars: GetProductoByIdVariables, options?: useDataConnectQueryOptions<GetProductoByIdData>): UseDataConnectQueryResult<GetProductoByIdData, GetProductoByIdVariables>;
export function useGetProductoById(dc: DataConnect, vars: GetProductoByIdVariables, options?: useDataConnectQueryOptions<GetProductoByIdData>): UseDataConnectQueryResult<GetProductoByIdData, GetProductoByIdVariables>;
