# Shared helpers for Android emulator on Windows (hidden window + Metro port).
Add-Type @"
using System; using System.Runtime.InteropServices;
public class EmulatorWindow {
  [DllImport("user32.dll")] public static extern int GetSystemMetrics(int nIndex);
  [DllImport("user32.dll")] public static extern bool MoveWindow(IntPtr h, int x, int y, int w, int ht, bool r);
  [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr h);
  [DllImport("user32.dll")] public static extern bool GetWindowRect(IntPtr h, out RECT r);
  public struct RECT { public int Left, Top, Right, Bottom; }
}
"@

$script:EmulatorWidth = 320
$script:EmulatorHeight = 680

function Get-AdbPath {
  if ($env:ANDROID_HOME -and (Test-Path "$env:ANDROID_HOME\platform-tools\adb.exe")) {
    return "$env:ANDROID_HOME\platform-tools\adb.exe"
  }
  $default = "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe"
  if (Test-Path $default) { return $default }
  return "adb"
}

function Wait-ForAndroidDevice {
  param([int]$TimeoutSeconds = 120)

  $adb = Get-AdbPath
  $deadline = (Get-Date).AddSeconds($TimeoutSeconds)

  while ((Get-Date) -lt $deadline) {
    $devices = & $adb devices 2>&1 | Select-String "device$"
    if ($devices) { return $true }
    Start-Sleep -Seconds 2
  }

  Write-Host ""
  Write-Host "No Android device/emulator detected."
  Write-Host "Start one with: npm run emulator"
  Write-Host "Or open Android Studio -> Device Manager -> Play on Pixel_6_Pro"
  return $false
}

function Set-MetroPortForward {
  $adb = Get-AdbPath
  & $adb reverse tcp:8081 tcp:8081 2>&1 | Out-Null
}

function Test-WindowOnScreen {
  param([EmulatorWindow+RECT]$Rect)

  $screenW = [EmulatorWindow]::GetSystemMetrics(0)
  $screenH = [EmulatorWindow]::GetSystemMetrics(1)
  $width = $Rect.Right - $Rect.Left
  $height = $Rect.Bottom - $Rect.Top

  if ($width -le 0 -or $height -le 0) { return $false }
  if ($Rect.Top -lt -50) { return $false }
  if ($Rect.Left -lt -100) { return $false }
  if ($Rect.Top -gt ($screenH - 80)) { return $false }
  if ($Rect.Left -gt ($screenW - 80)) { return $false }

  return $true
}

function Fix-EmulatorWindow {
  param(
    [int]$Width = $script:EmulatorWidth,
    [int]$Height = $script:EmulatorHeight,
    [switch]$Quiet
  )

  $proc = Get-Process qemu-system-x86_64 -ErrorAction SilentlyContinue | Select-Object -First 1
  if (-not $proc -or $proc.MainWindowHandle -eq [IntPtr]::Zero) {
    if (-not $Quiet) {
      Write-Host "Emulator window not found yet (process may still be starting)."
    }
    return $false
  }

  $hwnd = $proc.MainWindowHandle
  $rect = New-Object EmulatorWindow+RECT
  [EmulatorWindow]::GetWindowRect($hwnd, [ref]$rect) | Out-Null

  if (Test-WindowOnScreen -Rect $rect) {
    if (-not $Quiet) {
      Write-Host "Emulator window already visible."
    }
    return $true
  }

  $screenW = [EmulatorWindow]::GetSystemMetrics(0)
  $screenH = [EmulatorWindow]::GetSystemMetrics(1)
  $x = [Math]::Max(20, [int](($screenW - $Width) / 2))
  $y = [Math]::Max(20, [int](($screenH - $Height) / 2))

  [EmulatorWindow]::MoveWindow($hwnd, $x, $y, $Width, $Height, $true) | Out-Null
  [EmulatorWindow]::SetForegroundWindow($hwnd) | Out-Null

  [EmulatorWindow]::GetWindowRect($hwnd, [ref]$rect) | Out-Null
  if (-not $Quiet) {
    Write-Host "Emulator moved on-screen at ($($rect.Left), $($rect.Top))."
  }

  return $true
}

function Wait-AndFix-EmulatorWindow {
  param([int]$TimeoutSeconds = 90)

  $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
  while ((Get-Date) -lt $deadline) {
    if (Fix-EmulatorWindow -Quiet) { return $true }
    Start-Sleep -Seconds 2
  }
  return $false
}

function Launch-SBurger {
  $adb = Get-AdbPath
  & $adb shell am start -n com.sburger/.MainActivity 2>&1 | Out-Null
}

function Prepare-AndroidDev {
  if (-not (Wait-ForAndroidDevice)) { return $false }
  Set-MetroPortForward
  Wait-AndFix-EmulatorWindow | Out-Null
  return $true
}

function Finish-AndroidDev {
  Set-MetroPortForward
  Fix-EmulatorWindow | Out-Null
  Launch-SBurger
}
