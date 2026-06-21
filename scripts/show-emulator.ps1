# Quick fix if the emulator is running but hidden off-screen.
. (Join-Path $PSScriptRoot "emulator-fix.ps1")

if (-not (Wait-ForAndroidDevice -TimeoutSeconds 10)) { exit 1 }
Finish-AndroidDev
Write-Host "Done."
