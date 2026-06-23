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

export interface CreateUsuarioData {
  usuario_insert: Usuario_Key;
}

export interface CreateUsuarioVariables {
  nombreCompleto: string;
  email: string;
  passwordHash: string;
  rol?: RolUsuario | null;
}

export interface DeleteProductoData {
  producto_update?: Producto_Key | null;
}

export interface DeleteProductoVariables {
  id: UUIDString;
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

export interface GetUsuarioByEmailData {
  usuarios: ({
    id: UUIDString;
    nombreCompleto: string;
    email: string;
    passwordHash: string;
    rol: RolUsuario;
  } & Usuario_Key)[];
}

export interface GetUsuarioByEmailVariables {
  email: string;
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

export interface ListPedidosByUsuarioVariables {
  usuarioId: UUIDString;
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

interface CreateUsuarioRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUsuarioVariables): MutationRef<CreateUsuarioData, CreateUsuarioVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateUsuarioVariables): MutationRef<CreateUsuarioData, CreateUsuarioVariables>;
  operationName: string;
}
export const createUsuarioRef: CreateUsuarioRef;

export function createUsuario(vars: CreateUsuarioVariables): MutationPromise<CreateUsuarioData, CreateUsuarioVariables>;
export function createUsuario(dc: DataConnect, vars: CreateUsuarioVariables): MutationPromise<CreateUsuarioData, CreateUsuarioVariables>;

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

interface ListPedidosByUsuarioRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListPedidosByUsuarioVariables): QueryRef<ListPedidosByUsuarioData, ListPedidosByUsuarioVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListPedidosByUsuarioVariables): QueryRef<ListPedidosByUsuarioData, ListPedidosByUsuarioVariables>;
  operationName: string;
}
export const listPedidosByUsuarioRef: ListPedidosByUsuarioRef;

export function listPedidosByUsuario(vars: ListPedidosByUsuarioVariables, options?: ExecuteQueryOptions): QueryPromise<ListPedidosByUsuarioData, ListPedidosByUsuarioVariables>;
export function listPedidosByUsuario(dc: DataConnect, vars: ListPedidosByUsuarioVariables, options?: ExecuteQueryOptions): QueryPromise<ListPedidosByUsuarioData, ListPedidosByUsuarioVariables>;

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

interface GetUsuarioByEmailRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUsuarioByEmailVariables): QueryRef<GetUsuarioByEmailData, GetUsuarioByEmailVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUsuarioByEmailVariables): QueryRef<GetUsuarioByEmailData, GetUsuarioByEmailVariables>;
  operationName: string;
}
export const getUsuarioByEmailRef: GetUsuarioByEmailRef;

export function getUsuarioByEmail(vars: GetUsuarioByEmailVariables, options?: ExecuteQueryOptions): QueryPromise<GetUsuarioByEmailData, GetUsuarioByEmailVariables>;
export function getUsuarioByEmail(dc: DataConnect, vars: GetUsuarioByEmailVariables, options?: ExecuteQueryOptions): QueryPromise<GetUsuarioByEmailData, GetUsuarioByEmailVariables>;

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

