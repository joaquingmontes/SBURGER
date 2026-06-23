# Genera el SDK de Data Connect para la app React Native.
$ErrorActionPreference = "Stop"
Set-Location (Split-Path $PSScriptRoot -Parent)

npx -y firebase-tools@latest dataconnect:sdk:generate

Write-Host "SDK generado en app/src/dataconnect-generated" -ForegroundColor Green
