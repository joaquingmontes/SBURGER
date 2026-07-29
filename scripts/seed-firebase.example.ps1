# Despliega Data Connect y carga usuarios, productos y pedidos (3 pasos).
# Requiere: npx firebase-tools login
#
# Copiá este archivo como scripts/seed-firebase.ps1

$ErrorActionPreference = "Stop"
Set-Location (Split-Path $PSScriptRoot -Parent)

$firebase = "npx -y firebase-tools@latest"

Write-Host "Desplegando Firebase Data Connect..." -ForegroundColor Cyan
Invoke-Expression "$firebase deploy --only dataconnect"

Write-Host "Cargando usuarios..." -ForegroundColor Cyan
Invoke-Expression "$firebase dataconnect:execute dataconnect/seed_01_usuarios.gql"

Write-Host "Cargando productos..." -ForegroundColor Cyan
Invoke-Expression "$firebase dataconnect:execute dataconnect/seed_02_productos.gql"

Write-Host "Cargando pedidos..." -ForegroundColor Cyan
Invoke-Expression "$firebase dataconnect:execute dataconnect/seed_03_pedidos.gql"

Write-Host "Cargando sucursales..." -ForegroundColor Cyan
Invoke-Expression "$firebase dataconnect:execute dataconnect/seed_04_sucursales.gql"

Write-Host "Migrando precios por sucursal y pedidos existentes..." -ForegroundColor Cyan
Invoke-Expression "$firebase dataconnect:execute dataconnect/seed_05_migracion_sucursales.gql"

Write-Host "Asignando sucursales a pedidos existentes..." -ForegroundColor Cyan
Invoke-Expression "$firebase dataconnect:execute dataconnect/seed_06_asignar_sucursales_pedidos.gql"

Write-Host "Cargando productos extra por sucursal..." -ForegroundColor Cyan
Invoke-Expression "$firebase dataconnect:execute dataconnect/seed_07_productos_extra_sucursales.gql"

Write-Host "Distribuyendo estados de ProductoSucursal..." -ForegroundColor Cyan
Invoke-Expression "$firebase dataconnect:execute dataconnect/seed_08_producto_sucursal_estados.gql"

Write-Host "Seed completo. Credenciales en credenciales-prueba.txt" -ForegroundColor Green
