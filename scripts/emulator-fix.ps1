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

function Invoke-Adb {
  param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$Args,
    [int]$TimeoutSeconds = 20
  )

  $adb = Get-AdbPath
  $job = Start-Job -ScriptBlock {
    param($adbPath, $adbArgs)
    & $adbPath @adbArgs 2>&1 | Out-String
  } -ArgumentList $adb, $Args

  $completed = Wait-Job $job -Timeout $TimeoutSeconds
  if (-not $completed) {
    Stop-Job $job -Force | Out-Null
    Remove-Job $job -Force | Out-Null
    return @{ Ok = $false; TimedOut = $true; Output = "" }
  }

  $output = (Receive-Job $job).Trim()
  Remove-Job $job -Force | Out-Null
  return @{ Ok = ($LASTEXITCODE -eq 0); TimedOut = $false; Output = $output }
}

function Test-AdbResponsive {
  $result = Invoke-Adb -Args @("shell", "echo", "ok") -TimeoutSeconds 8
  return $result.Ok -and ($result.Output -match "ok")
}

function Restart-AdbServer {
  $adb = Get-AdbPath
  Write-Host "Restarting ADB server..."
  & $adb kill-server 2>&1 | Out-Null
  Start-Sleep -Seconds 1
  & $adb start-server 2>&1 | Out-Null
  Start-Sleep -Seconds 1
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
  return $false
}

function Wait-ForAndroidBootComplete {
  param([int]$TimeoutSeconds = 120)

  $adb = Get-AdbPath
  $deadline = (Get-Date).AddSeconds($TimeoutSeconds)

  Write-Host "Waiting for emulator to finish booting..."
  while ((Get-Date) -lt $deadline) {
    $bootCompleted = (& $adb shell getprop sys.boot_completed 2>&1 | Out-String).Trim()
    if ($bootCompleted -eq "1") {
      Write-Host "Emulator boot complete."
      return $true
    }
    Start-Sleep -Seconds 2
  }

  Write-Host "Emulator boot did not finish in time."
  return $false
}

function Test-AppInstalled {
  param([string]$PackageName = "com.sburger")

  $result = Invoke-Adb -Args @("shell", "pm", "path", $PackageName) -TimeoutSeconds 10
  return $result.Ok -and ($result.Output -match "package:")
}

function Install-ApkWithRetry {
  param(
    [string]$ApkPath,
    [int]$MaxAttempts = 2,
    [int]$InstallTimeoutSeconds = 90
  )

  if (-not (Test-Path $ApkPath)) {
    Write-Host "APK not found at $ApkPath"
    return $false
  }

  $adb = Get-AdbPath
  $remoteApk = "/data/local/tmp/sburger-debug.apk"
  $sizeMb = [math]::Round((Get-Item $ApkPath).Length / 1MB, 1)
  Write-Host "Installing APK (${sizeMb} MB)..."

  for ($attempt = 1; $attempt -le $MaxAttempts; $attempt++) {
    if ($attempt -gt 1) {
      Write-Host "Retrying install (attempt $attempt/$MaxAttempts)..."
      Restart-AdbServer
      if (-not (Wait-ForAndroidDevice -TimeoutSeconds 20)) { return $false }
      Set-MetroPortForward
    }

    Write-Host "Pushing APK to emulator..."
    $push = Invoke-Adb -Args @("push", $ApkPath, $remoteApk) -TimeoutSeconds 120
    if (-not $push.Ok) {
      Write-Host $push.Output
      continue
    }

    Write-Host "Running package manager install..."
    $install = Invoke-Adb -Args @(
      "shell", "pm", "install", "-r", "-d", "-t", $remoteApk
    ) -TimeoutSeconds $InstallTimeoutSeconds

    Invoke-Adb -Args @("shell", "rm", "-f", $remoteApk) -TimeoutSeconds 10 | Out-Null

    if ($install.Ok -and ($install.Output -match "Success")) {
      Write-Host "APK installed successfully."
      return $true
    }

    if ($install.TimedOut) {
      Write-Host "Install timed out after ${InstallTimeoutSeconds}s (emulator package manager stuck)."
    } else {
      Write-Host $install.Output
    }
  }

  return $false
}

function Set-MetroPortForward {
  Invoke-Adb -Args @("reverse", "tcp:8081", "tcp:8081") -TimeoutSeconds 10 | Out-Null
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
      Write-Host "Emulator window not found yet."
    }
    return $false
  }

  $hwnd = $proc.MainWindowHandle
  $rect = New-Object EmulatorWindow+RECT
  [EmulatorWindow]::GetWindowRect($hwnd, [ref]$rect) | Out-Null

  if (Test-WindowOnScreen -Rect $rect) {
    return $true
  }

  $screenW = [EmulatorWindow]::GetSystemMetrics(0)
  $screenH = [EmulatorWindow]::GetSystemMetrics(1)
  $x = [Math]::Max(20, [int](($screenW - $Width) / 2))
  $y = [Math]::Max(20, [int](($screenH - $Height) / 2))

  [EmulatorWindow]::MoveWindow($hwnd, $x, $y, $Width, $Height, $true) | Out-Null
  [EmulatorWindow]::SetForegroundWindow($hwnd) | Out-Null
  return $true
}

function Launch-SBurger {
  $result = Invoke-Adb -Args @(
    "shell", "am", "start", "-n", "com.sburger/.MainActivity"
  ) -TimeoutSeconds 15

  if ($result.Output -match "Error") {
    Write-Host $result.Output
    return $false
  }

  return $true
}

function Prepare-AndroidDev {
  if (-not (Wait-ForAndroidDevice -TimeoutSeconds 15)) { return $false }

  if (-not (Test-AdbResponsive)) {
    Write-Host "ADB is not responding. Restarting..."
    Restart-AdbServer
    if (-not (Wait-ForAndroidDevice -TimeoutSeconds 20)) { return $false }
    if (-not (Test-AdbResponsive)) {
      Write-Host ""
      Write-Host "Emulator/ADB frozen. Close the emulator window and run:"
      Write-Host "  npm run emulator"
      Write-Host "Then run npm run android again."
      return $false
    }
  }

  Write-Host "Emulator ready."
  Set-MetroPortForward
  Fix-EmulatorWindow -Quiet | Out-Null
  return $true
}

function Finish-AndroidDev {
  Set-MetroPortForward
  Fix-EmulatorWindow | Out-Null
  Launch-SBurger | Out-Null
}

function Write-InstallHelp {
  Write-Host ""
  Write-Host "If install keeps failing:"
  Write-Host "  1. Close the emulator completely"
  Write-Host "  2. Android Studio -> Device Manager -> Pixel_6_Pro -> Cold Boot Now"
  Write-Host "  3. npm run android:install"
}
