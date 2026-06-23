import { CreateUsuarioProfileData, CreateUsuarioProfileVariables, LinkMyAccountData, CreateProductoData, CreateProductoVariables, UpdateProductoData, UpdateProductoVariables, DeleteProductoData, DeleteProductoVariables, CreatePedidoData, CreatePedidoVariables, CreatePedidoItemData, CreatePedidoItemVariables, UpdatePedidoEstadoData, UpdatePedidoEstadoVariables, ListProductosActivosData, ListProductosAdminData, ListMyPedidosData, ListPedidosAdminData, GetMeData, GetProductoByIdData, GetProductoByIdVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateUsuarioProfile(options?: useDataConnectMutationOptions<CreateUsuarioProfileData, FirebaseError, CreateUsuarioProfileVariables>): UseDataConnectMutationResult<CreateUsuarioProfileData, CreateUsuarioProfileVariables>;
export function useCreateUsuarioProfile(dc: DataConnect, options?: useDataConnectMutationOptions<CreateUsuarioProfileData, FirebaseError, CreateUsuarioProfileVariables>): UseDataConnectMutationResult<CreateUsuarioProfileData, CreateUsuarioProfileVariables>;

export function useLinkMyAccount(options?: useDataConnectMutationOptions<LinkMyAccountData, FirebaseError, void>): UseDataConnectMutationResult<LinkMyAccountData, undefined>;
export function useLinkMyAccount(dc: DataConnect, options?: useDataConnectMutationOptions<LinkMyAccountData, FirebaseError, void>): UseDataConnectMutationResult<LinkMyAccountData, undefined>;

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

export function useListMyPedidos(options?: useDataConnectQueryOptions<ListMyPedidosData>): UseDataConnectQueryResult<ListMyPedidosData, undefined>;
export function useListMyPedidos(dc: DataConnect, options?: useDataConnectQueryOptions<ListMyPedidosData>): UseDataConnectQueryResult<ListMyPedidosData, undefined>;

export function useListPedidosAdmin(options?: useDataConnectQueryOptions<ListPedidosAdminData>): UseDataConnectQueryResult<ListPedidosAdminData, undefined>;
export function useListPedidosAdmin(dc: DataConnect, options?: useDataConnectQueryOptions<ListPedidosAdminData>): UseDataConnectQueryResult<ListPedidosAdminData, undefined>;

export function useGetMe(options?: useDataConnectQueryOptions<GetMeData>): UseDataConnectQueryResult<GetMeData, undefined>;
export function useGetMe(dc: DataConnect, options?: useDataConnectQueryOptions<GetMeData>): UseDataConnectQueryResult<GetMeData, undefined>;

export function useGetProductoById(vars: GetProductoByIdVariables, options?: useDataConnectQueryOptions<GetProductoByIdData>): UseDataConnectQueryResult<GetProductoByIdData, GetProductoByIdVariables>;
export function useGetProductoById(dc: DataConnect, vars: GetProductoByIdVariables, options?: useDataConnectQueryOptions<GetProductoByIdData>): UseDataConnectQueryResult<GetProductoByIdData, GetProductoByIdVariables>;
