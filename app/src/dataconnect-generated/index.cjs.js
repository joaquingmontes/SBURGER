const { queryRef, executeQuery, validateArgsWithOptions, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const CategoriaProducto = {
  HAMBURGUESAS: "HAMBURGUESAS",
  PAPAS: "PAPAS",
  BEBIDAS: "BEBIDAS",
  POSTRES: "POSTRES",
}
exports.CategoriaProducto = CategoriaProducto;

const EstadoPedido = {
  PREPARING: "PREPARING",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
}
exports.EstadoPedido = EstadoPedido;

const ModalidadEntrega = {
  DELIVERY: "DELIVERY",
  TAKEAWAY: "TAKEAWAY",
}
exports.ModalidadEntrega = ModalidadEntrega;

const RolUsuario = {
  CLIENTE: "CLIENTE",
  ADMIN: "ADMIN",
}
exports.RolUsuario = RolUsuario;

const connectorConfig = {
  connector: 'default',
  service: 'sburger-a3265-service',
  location: 'southamerica-west1'
};
exports.connectorConfig = connectorConfig;

const createUsuarioProfileRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateUsuarioProfile', inputVars);
}
createUsuarioProfileRef.operationName = 'CreateUsuarioProfile';
exports.createUsuarioProfileRef = createUsuarioProfileRef;

exports.createUsuarioProfile = function createUsuarioProfile(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createUsuarioProfileRef(dcInstance, inputVars));
}
;

const linkMyAccountRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'LinkMyAccount');
}
linkMyAccountRef.operationName = 'LinkMyAccount';
exports.linkMyAccountRef = linkMyAccountRef;

exports.linkMyAccount = function linkMyAccount(dc) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dc, undefined);
  return executeMutation(linkMyAccountRef(dcInstance, inputVars));
}
;

const createProductoRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateProducto', inputVars);
}
createProductoRef.operationName = 'CreateProducto';
exports.createProductoRef = createProductoRef;

exports.createProducto = function createProducto(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createProductoRef(dcInstance, inputVars));
}
;

const updateProductoRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateProducto', inputVars);
}
updateProductoRef.operationName = 'UpdateProducto';
exports.updateProductoRef = updateProductoRef;

exports.updateProducto = function updateProducto(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateProductoRef(dcInstance, inputVars));
}
;

const deleteProductoRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteProducto', inputVars);
}
deleteProductoRef.operationName = 'DeleteProducto';
exports.deleteProductoRef = deleteProductoRef;

exports.deleteProducto = function deleteProducto(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteProductoRef(dcInstance, inputVars));
}
;

const createPedidoRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreatePedido', inputVars);
}
createPedidoRef.operationName = 'CreatePedido';
exports.createPedidoRef = createPedidoRef;

exports.createPedido = function createPedido(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createPedidoRef(dcInstance, inputVars));
}
;

const createPedidoItemRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreatePedidoItem', inputVars);
}
createPedidoItemRef.operationName = 'CreatePedidoItem';
exports.createPedidoItemRef = createPedidoItemRef;

exports.createPedidoItem = function createPedidoItem(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createPedidoItemRef(dcInstance, inputVars));
}
;

const updatePedidoEstadoRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdatePedidoEstado', inputVars);
}
updatePedidoEstadoRef.operationName = 'UpdatePedidoEstado';
exports.updatePedidoEstadoRef = updatePedidoEstadoRef;

exports.updatePedidoEstado = function updatePedidoEstado(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updatePedidoEstadoRef(dcInstance, inputVars));
}
;

const listProductosActivosRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListProductosActivos');
}
listProductosActivosRef.operationName = 'ListProductosActivos';
exports.listProductosActivosRef = listProductosActivosRef;

exports.listProductosActivos = function listProductosActivos(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listProductosActivosRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listProductosAdminRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListProductosAdmin');
}
listProductosAdminRef.operationName = 'ListProductosAdmin';
exports.listProductosAdminRef = listProductosAdminRef;

exports.listProductosAdmin = function listProductosAdmin(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listProductosAdminRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listMyPedidosRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListMyPedidos');
}
listMyPedidosRef.operationName = 'ListMyPedidos';
exports.listMyPedidosRef = listMyPedidosRef;

exports.listMyPedidos = function listMyPedidos(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listMyPedidosRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listPedidosAdminRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListPedidosAdmin');
}
listPedidosAdminRef.operationName = 'ListPedidosAdmin';
exports.listPedidosAdminRef = listPedidosAdminRef;

exports.listPedidosAdmin = function listPedidosAdmin(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listPedidosAdminRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getMeRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMe');
}
getMeRef.operationName = 'GetMe';
exports.getMeRef = getMeRef;

exports.getMe = function getMe(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(getMeRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getProductoByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetProductoById', inputVars);
}
getProductoByIdRef.operationName = 'GetProductoById';
exports.getProductoByIdRef = getProductoByIdRef;

exports.getProductoById = function getProductoById(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getProductoByIdRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;
