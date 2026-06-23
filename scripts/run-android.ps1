# Builds/installs SBURGER and applies Windows emulator fixes automatically.
param(
  [switch]$Install,
  [switch]$LaunchOnly
)

$ErrorActionPreference = "Continue"

$repoRoot = Split-Path -Parent $PSScriptRoot
$appDir = Join-Path $repoRoot "app"
$androidDir = Join-Path $appDir "android"
$apkPath = Join-Path $appDir "android\app\build\outputs\apk\debug\app-debug.apk"
. (Join-Path $PSScriptRoot "emulator-fix.ps1")

Set-Location $appDir
$env:ORG_GRADLE_PROJECT_reactNativeArchitectures = "x86_64"

Write-Host "Checking emulator..."
if (-not (Prepare-AndroidDev)) {
  exit 1
}

if ($LaunchOnly) {
  Write-Host "Launching app..."
  Finish-AndroidDev
  Write-Host "SBURGER launched."
  exit 0
}

$alreadyInstalled = Test-AppInstalled

if ($alreadyInstalled -and -not $Install) {
  Write-Host "App already installed - skipping build/install (fast path)."
  Write-Host "Reload JS with Metro (npm start) + press R in emulator."
  Write-Host "Native reinstall: npm run android:install"
  Write-Host ""
  Finish-AndroidDev
  Write-Host "SBURGER is running."
  exit 0
}

Write-Host "Building debug APK (x86_64)..."
Push-Location $androidDir
.\gradlew.bat assembleDebug -PreactNativeArchitectures=x86_64 --console=plain -q
$buildCode = $LASTEXITCODE
Pop-Location

if ($buildCode -ne 0) {
  Write-Host "Build failed."
  exit $buildCode
}

if (-not (Install-ApkWithRetry -ApkPath $apkPath)) {
  if ($alreadyInstalled) {
    Write-Host ""
    Write-Host "Install failed - launching the version already on the emulator."
    Write-InstallHelp
  } else {
    Write-Host "Install failed."
    Write-InstallHelp
    exit 1
  }
}

Write-Host "Launching app..."
Finish-AndroidDev
Write-Host ""
Write-Host "SBURGER is running. Keep Metro up: npm start"
exit 0
