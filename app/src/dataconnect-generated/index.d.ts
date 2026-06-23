import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;


export enum CategoriaProducto {
  HAMBURGUESAS = "HAMBURGUESAS",
  PAPAS = "PAPAS",
  BEBIDAS = "BEBIDAS",
  POSTRES = "POSTRES",
};

export enum EstadoPedido {
  PREPARING = "PREPARING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
};

export enum ModalidadEntrega {
  DELIVERY = "DELIVERY",
  TAKEAWAY = "TAKEAWAY",
};

export enum RolUsuario {
  CLIENTE = "CLIENTE",
  ADMIN = "ADMIN",
};



export interface CreatePedidoData {
  pedido_insert: Pedido_Key;
}

export interface CreatePedidoItemData {
  pedidoItem_insert: PedidoItem_Key;
}

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

export interface CreateProductoData {
  producto_insert: Producto_Key;
}

export interface CreateProductoVariables {
  nombre: string;
  descripcion: string;
  ingredientes?: string | null;
  precio: number;
  categoria: CategoriaProducto;
  imagenUrl: string;
}

export interface CreateUsuarioProfileData {
  usuario_insert: Usuario_Key;
}

export interface CreateUsuarioProfileVariables {
  nombreCompleto: string;
  email: string;
  rol?: RolUsuario | null;
}

export interface DeleteProductoData {
  producto_update?: Producto_Key | null;
}

export interface DeleteProductoVariables {
  id: UUIDString;
}

export interface GetMeData {
  usuarios: ({
    id: UUIDString;
    nombreCompleto: string;
    email: string;
    rol: RolUsuario;
  } & Usuario_Key)[];
}

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

export interface GetProductoByIdVariables {
  id: UUIDString;
}

export interface LinkMyAccountData {
  usuario_update?: Usuario_Key | null;
}

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

export interface PedidoItem_Key {
  id: UUIDString;
  __typename?: 'PedidoItem_Key';
}

export interface Pedido_Key {
  id: UUIDString;
  __typename?: 'Pedido_Key';
}

export interface Producto_Key {
  id: UUIDString;
  __typename?: 'Producto_Key';
}

export interface UpdatePedidoEstadoData {
  pedido_update?: Pedido_Key | null;
}

export interface UpdatePedidoEstadoVariables {
  id: UUIDString;
  estado: EstadoPedido;
}

export interface UpdateProductoData {
  producto_update?: Producto_Key | null;
}

export interface UpdateProductoVariables {
  id: UUIDString;
  nombre: string;
  descripcion: string;
  ingredientes?: string | null;
  precio: number;
  categoria: CategoriaProducto;
  imagenUrl: string;
}

export interface Usuario_Key {
  id: UUIDString;
  __typename?: 'Usuario_Key';
}

interface CreateUsuarioProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUsuarioProfileVariables): MutationRef<CreateUsuarioProfileData, CreateUsuarioProfileVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateUsuarioProfileVariables): MutationRef<CreateUsuarioProfileData, CreateUsuarioProfileVariables>;
  operationName: string;
}
export const createUsuarioProfileRef: CreateUsuarioProfileRef;

export function createUsuarioProfile(vars: CreateUsuarioProfileVariables): MutationPromise<CreateUsuarioProfileData, CreateUsuarioProfileVariables>;
export function createUsuarioProfile(dc: DataConnect, vars: CreateUsuarioProfileVariables): MutationPromise<CreateUsuarioProfileData, CreateUsuarioProfileVariables>;

interface LinkMyAccountRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<LinkMyAccountData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<LinkMyAccountData, undefined>;
  operationName: string;
}
export const linkMyAccountRef: LinkMyAccountRef;

export function linkMyAccount(): MutationPromise<LinkMyAccountData, undefined>;
export function linkMyAccount(dc: DataConnect): MutationPromise<LinkMyAccountData, undefined>;

interface CreateProductoRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateProductoVariables): MutationRef<CreateProductoData, CreateProductoVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateProductoVariables): MutationRef<CreateProductoData, CreateProductoVariables>;
  operationName: string;
}
export const createProductoRef: CreateProductoRef;

export function createProducto(vars: CreateProductoVariables): MutationPromise<CreateProductoData, CreateProductoVariables>;
export function createProducto(dc: DataConnect, vars: CreateProductoVariables): MutationPromise<CreateProductoData, CreateProductoVariables>;

interface UpdateProductoRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateProductoVariables): MutationRef<UpdateProductoData, UpdateProductoVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateProductoVariables): MutationRef<UpdateProductoData, UpdateProductoVariables>;
  operationName: string;
}
export const updateProductoRef: UpdateProductoRef;

export function updateProducto(vars: UpdateProductoVariables): MutationPromise<UpdateProductoData, UpdateProductoVariables>;
export function updateProducto(dc: DataConnect, vars: UpdateProductoVariables): MutationPromise<UpdateProductoData, UpdateProductoVariables>;

interface DeleteProductoRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteProductoVariables): MutationRef<DeleteProductoData, DeleteProductoVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteProductoVariables): MutationRef<DeleteProductoData, DeleteProductoVariables>;
  operationName: string;
}
export const deleteProductoRef: DeleteProductoRef;

export function deleteProducto(vars: DeleteProductoVariables): MutationPromise<DeleteProductoData, DeleteProductoVariables>;
export function deleteProducto(dc: DataConnect, vars: DeleteProductoVariables): MutationPromise<DeleteProductoData, DeleteProductoVariables>;

interface CreatePedidoRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreatePedidoVariables): MutationRef<CreatePedidoData, CreatePedidoVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreatePedidoVariables): MutationRef<CreatePedidoData, CreatePedidoVariables>;
  operationName: string;
}
export const createPedidoRef: CreatePedidoRef;

export function createPedido(vars: CreatePedidoVariables): MutationPromise<CreatePedidoData, CreatePedidoVariables>;
export function createPedido(dc: DataConnect, vars: CreatePedidoVariables): MutationPromise<CreatePedidoData, CreatePedidoVariables>;

interface CreatePedidoItemRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreatePedidoItemVariables): MutationRef<CreatePedidoItemData, CreatePedidoItemVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreatePedidoItemVariables): MutationRef<CreatePedidoItemData, CreatePedidoItemVariables>;
  operationName: string;
}
export const createPedidoItemRef: CreatePedidoItemRef;

export function createPedidoItem(vars: CreatePedidoItemVariables): MutationPromise<CreatePedidoItemData, CreatePedidoItemVariables>;
export function createPedidoItem(dc: DataConnect, vars: CreatePedidoItemVariables): MutationPromise<CreatePedidoItemData, CreatePedidoItemVariables>;

interface UpdatePedidoEstadoRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdatePedidoEstadoVariables): MutationRef<UpdatePedidoEstadoData, UpdatePedidoEstadoVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdatePedidoEstadoVariables): MutationRef<UpdatePedidoEstadoData, UpdatePedidoEstadoVariables>;
  operationName: string;
}
export const updatePedidoEstadoRef: UpdatePedidoEstadoRef;

export function updatePedidoEstado(vars: UpdatePedidoEstadoVariables): MutationPromise<UpdatePedidoEstadoData, UpdatePedidoEstadoVariables>;
export function updatePedidoEstado(dc: DataConnect, vars: UpdatePedidoEstadoVariables): MutationPromise<UpdatePedidoEstadoData, UpdatePedidoEstadoVariables>;

interface ListProductosActivosRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListProductosActivosData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListProductosActivosData, undefined>;
  operationName: string;
}
export const listProductosActivosRef: ListProductosActivosRef;

export function listProductosActivos(options?: ExecuteQueryOptions): QueryPromise<ListProductosActivosData, undefined>;
export function listProductosActivos(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListProductosActivosData, undefined>;

interface ListProductosAdminRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListProductosAdminData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListProductosAdminData, undefined>;
  operationName: string;
}
export const listProductosAdminRef: ListProductosAdminRef;

export function listProductosAdmin(options?: ExecuteQueryOptions): QueryPromise<ListProductosAdminData, undefined>;
export function listProductosAdmin(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListProductosAdminData, undefined>;

interface ListMyPedidosRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyPedidosData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListMyPedidosData, undefined>;
  operationName: string;
}
export const listMyPedidosRef: ListMyPedidosRef;

export function listMyPedidos(options?: ExecuteQueryOptions): QueryPromise<ListMyPedidosData, undefined>;
export function listMyPedidos(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMyPedidosData, undefined>;

interface ListPedidosAdminRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListPedidosAdminData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListPedidosAdminData, undefined>;
  operationName: string;
}
export const listPedidosAdminRef: ListPedidosAdminRef;

export function listPedidosAdmin(options?: ExecuteQueryOptions): QueryPromise<ListPedidosAdminData, undefined>;
export function listPedidosAdmin(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListPedidosAdminData, undefined>;

interface GetMeRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMeData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetMeData, undefined>;
  operationName: string;
}
export const getMeRef: GetMeRef;

export function getMe(options?: ExecuteQueryOptions): QueryPromise<GetMeData, undefined>;
export function getMe(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetMeData, undefined>;

interface GetProductoByIdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetProductoByIdVariables): QueryRef<GetProductoByIdData, GetProductoByIdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetProductoByIdVariables): QueryRef<GetProductoByIdData, GetProductoByIdVariables>;
  operationName: string;
}
export const getProductoByIdRef: GetProductoByIdRef;

export function getProductoById(vars: GetProductoByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetProductoByIdData, GetProductoByIdVariables>;
export function getProductoById(dc: DataConnect, vars: GetProductoByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetProductoByIdData, GetProductoByIdVariables>;

