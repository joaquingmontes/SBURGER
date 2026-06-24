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

Write-Host "Seed completo. Credenciales en credenciales-prueba.txt" -ForegroundColor Green
