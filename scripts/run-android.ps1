# Builds/installs SBURGER and applies Windows emulator fixes automatically.
$ErrorActionPreference = "Continue"

$repoRoot = Split-Path -Parent $PSScriptRoot
$appDir = Join-Path $repoRoot "app"
. (Join-Path $PSScriptRoot "emulator-fix.ps1")

Set-Location $appDir

Write-Host "Checking emulator..."
if (-not (Prepare-AndroidDev)) {
  exit 1
}

Write-Host "Building and installing app..."
npx react-native run-android --no-packager @args
$exitCode = $LASTEXITCODE

Write-Host "Applying emulator fixes (window + Metro + launch)..."
Finish-AndroidDev

if ($exitCode -ne 0) {
  Write-Host "Build failed. Fix the errors above and run npm run android again."
  exit $exitCode
}

Write-Host "SBURGER should be visible on the emulator."
exit 0
