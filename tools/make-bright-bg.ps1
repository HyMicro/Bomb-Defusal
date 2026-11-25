# Bright comic pages: pop-art for the menu/story, pale halftone panels for the game.
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$root = Split-Path -Parent $PSScriptRoot
$outDir = Join-Path $root 'assets\backgrounds'
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

function Save-JpgPage([string]$src, [string]$dst, [int]$creamAlpha, [switch]$cropWide) {
  $img = [System.Drawing.Image]::FromFile($src)
  $bmp = New-Object System.Drawing.Bitmap 1920, 1080
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = 'HighQualityBicubic'
  $g.PixelOffsetMode = 'HighQuality'
  $dstRect = New-Object System.Drawing.Rectangle 0, 0, 1920, 1080
  if ($cropWide) {
    $srcRect = New-Object System.Drawing.Rectangle 0, 900, 4000, 2250
    $g.DrawImage($img, $dstRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
  } else {
    $g.DrawImage($img, $dstRect, (New-Object System.Drawing.Rectangle 0,0,$img.Width,$img.Height), [System.Drawing.GraphicsUnit]::Pixel)
  }
  $wash = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb($creamAlpha, 255, 244, 223))
  $g.FillRectangle($wash, $dstRect)
  $wash.Dispose()
  # Soft white centre so panels/text sit comfortably.
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $path.AddEllipse(260, 80, 1400, 920)
  $pg = New-Object System.Drawing.Drawing2D.PathGradientBrush $path
  $pg.CenterColor = [System.Drawing.Color]::FromArgb(54, 255, 255, 255)
  $pg.SurroundColors = @([System.Drawing.Color]::FromArgb(0, 255, 255, 255))
  $g.FillPath($pg, $path)
  $pg.Dispose(); $path.Dispose()
  # Light warm edge, no dark vignette.
  $edge = New-Object System.Drawing.Drawing2D.GraphicsPath
  $edge.AddEllipse(-380, -250, 2680, 1580)
  $ep = New-Object System.Drawing.Drawing2D.PathGradientBrush $edge
  $ep.CenterColor = [System.Drawing.Color]::FromArgb(0, 120, 86, 40)
  $ep.SurroundColors = @([System.Drawing.Color]::FromArgb(42, 120, 86, 40))
  $g.FillPath($ep, $edge)
  $ep.Dispose(); $edge.Dispose()
  $g.Dispose()
  $bmp.Save($dst, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose(); $img.Dispose()
}

Save-JpgPage (Join-Path $root 'assets\Comic Pop-Art Bombburst HUD Background.png') (Join-Path $outDir 'bg-bright-menu.png') 74
Save-JpgPage (Join-Path $root 'assets\1443969_11427.jpg') (Join-Path $outDir 'bg-bright-page.png') 186 -cropWide
Save-JpgPage (Join-Path $root 'assets\1443969_11427.jpg') (Join-Path $outDir 'bg-bright-game.png') 208 -cropWide
Write-Output 'bright backgrounds written'
