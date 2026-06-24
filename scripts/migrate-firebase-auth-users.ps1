# Migra usuarios de Data Connect a Firebase Authentication
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

if (-not (Test-Path "node_modules")) {
  Write-Host "Instalando firebase-admin..."
  npm install
}

Write-Host ""
Write-Host "Asegurate de tener:"
Write-Host "  1. Email/Password habilitado en Firebase Console -> Authentication"
Write-Host "  2. GOOGLE_APPLICATION_CREDENTIALS con un service account, o gcloud ADC"
Write-Host ""

node migrate-firebase-auth-users.mjs
