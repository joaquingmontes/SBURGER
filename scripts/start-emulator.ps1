# Starts Pixel_6_Pro and keeps the emulator window on-screen (Windows).
. (Join-Path $PSScriptRoot "emulator-fix.ps1")

$emulator = "$env:LOCALAPPDATA\Android\Sdk\emulator\emulator.exe"
if ($env:ANDROID_HOME) {
  $candidate = Join-Path $env:ANDROID_HOME "emulator\emulator.exe"
  if (Test-Path $candidate) { $emulator = $candidate }
}

if (-not (Test-Path $emulator)) {
  Write-Host "Android emulator not found. Install Android Studio and the SDK first."
  exit 1
}

$running = Get-Process qemu-system-x86_64 -ErrorAction SilentlyContinue
if ($running) {
  Write-Host "Emulator already running. Fixing window position..."
  Wait-AndFix-EmulatorWindow | Out-Null
  Set-MetroPortForward
  exit 0
}

Write-Host "Starting Pixel_6_Pro emulator..."
Start-Process -FilePath $emulator -ArgumentList @("-avd", "Pixel_6_Pro") -WindowStyle Normal

if (-not (Wait-ForAndroidDevice -TimeoutSeconds 180)) {
  exit 1
}

Write-Host "Waiting for emulator window..."
Wait-AndFix-EmulatorWindow -TimeoutSeconds 120 | Out-Null
Set-MetroPortForward
Write-Host "Emulator ready. Run npm start and npm run android in the app folder."
