# BOM CHALLENGE! — Windows kiosk launcher
# Run from PowerShell:
#   powershell -ExecutionPolicy Bypass -File .\scripts\start-kiosk.ps1
#
# Starts the local server, opens Chromium in kiosk mode with a dedicated profile.
# Press Alt+F4 to exit kiosk; the script then stops the server it started.

param(
  [int]$Port = 8123,
  [switch]$NoServer
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$server = $null

function Find-Browser {
  $candidates = @(
    "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
    "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
    "$env:LocalAppData\Google\Chrome\Application\chrome.exe",
    "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
    "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe"
  )
  foreach ($path in $candidates) {
    if (Test-Path $path) { return $path }
  }
  throw 'Chrome/Edge not found. Install a Chromium browser or edit $candidates.'
}

try {
  $browser = Find-Browser
  $node = (Get-Command node -ErrorAction Stop).Source

  if (-not $NoServer) {
    Write-Host "Starting BOM CHALLENGE! server on port $Port..."
    $server = Start-Process -FilePath $node -ArgumentList @('serve.mjs', "$Port") -WorkingDirectory $root -WindowStyle Hidden -PassThru
    Start-Sleep -Seconds 2
  }

  $url = "http://localhost:$Port"
  $profile = Join-Path $root '.kiosk-profile'
  New-Item -ItemType Directory -Force -Path $profile | Out-Null

  Write-Host "Launching kiosk: $browser"
  $chromeArgs = @(
    '--kiosk',
    '--no-first-run',
    '--disable-session-crashed-bubble',
    '--autoplay-policy=no-user-gesture-required',
    '--touch-events=enabled',
    '--overscroll-history-navigation=0',
    '--disable-pinch',
    "--user-data-dir=$profile",
    $url
  )
  Start-Process -FilePath $browser -ArgumentList $chromeArgs -Wait
}
finally {
  if ($server -and -not $server.HasExited) {
    Write-Host 'Stopping local server...'
    Stop-Process -Id $server.Id -Force
  }
}
