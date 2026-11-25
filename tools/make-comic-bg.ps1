# Builds the comic halftone page backgrounds from the supplied panel sheet.
# Source: assets/1443969_11427.jpg (4000x4000). Output: 1920x1080 PNGs.
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$src = Join-Path $root 'assets\1443969_11427.jpg'
$outDir = Join-Path $root 'assets\backgrounds'
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

function Make-Bg([string]$file, [int]$overlayAlpha, [float]$saturation) {
  $img = [System.Drawing.Image]::FromFile($src)
  $bmp = New-Object System.Drawing.Bitmap 1920, 1080
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = 'HighQualityBicubic'
  $g.PixelOffsetMode = 'HighQuality'

  # Full-width 16:9 band through the middle of the 4-panel sheet.
  $srcRect = New-Object System.Drawing.Rectangle 0, 900, 4000, 2250
  $dstRect = New-Object System.Drawing.Rectangle 0, 0, 1920, 1080

  if ($saturation -lt 0.99) {
    $attrs = New-Object System.Drawing.Imaging.ImageAttributes
    $matrix = New-Object System.Drawing.Imaging.ColorMatrix
    $matrix.Matrix00 = 0.213 + 0.787 * $saturation
    $matrix.Matrix01 = 0.715 - 0.715 * $saturation
    $matrix.Matrix02 = 0.072 - 0.072 * $saturation
    $matrix.Matrix10 = 0.213 - 0.213 * $saturation
    $matrix.Matrix11 = 0.715 + 0.285 * $saturation
    $matrix.Matrix12 = 0.072 - 0.072 * $saturation
    $matrix.Matrix20 = 0.213 - 0.213 * $saturation
    $matrix.Matrix21 = 0.715 - 0.715 * $saturation
    $matrix.Matrix22 = 0.072 + 0.928 * $saturation
    $attrs.SetColorMatrix($matrix)
    $g.DrawImage($img, $dstRect, $srcRect.X, $srcRect.Y, $srcRect.Width, $srcRect.Height, [System.Drawing.GraphicsUnit]::Pixel, $attrs)
    $attrs.Dispose()
  } else {
    $g.DrawImage($img, $dstRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
  }

  # Vertical ink wash: darker top HUD, calmer middle.
  $rect = New-Object System.Drawing.Rectangle 0, 0, 1920, 1080
  $c1 = [System.Drawing.Color]::FromArgb([Math]::Min(255, $overlayAlpha + 12), 7, 16, 28)
  $c2 = [System.Drawing.Color]::FromArgb($overlayAlpha, 7, 16, 28)
  $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush $rect, $c1, $c2, 90
  $blend = New-Object System.Drawing.Drawing2D.ColorBlend 3
  $blend.Colors = @($c1, [System.Drawing.Color]::FromArgb([Math]::Min(255, $overlayAlpha - 6), 7, 16, 28), [System.Drawing.Color]::FromArgb([Math]::Min(255, $overlayAlpha + 8), 7, 16, 28))
  $blend.Positions = @(0.0, 0.55, 1.0)
  $brush.InterpolationColors = $blend
  $g.FillRectangle($brush, $rect)
  $brush.Dispose()

  # Vignette for text edges.
  $vignette = New-Object System.Drawing.Drawing2D.GraphicsPath
  $vignette.AddEllipse(-380, -240, 2680, 1560)
  $pth = New-Object System.Drawing.Drawing2D.PathGradientBrush $vignette
  $pth.CenterColor = [System.Drawing.Color]::FromArgb(0, 2, 4, 10)
  $pth.SurroundColors = @([System.Drawing.Color]::FromArgb(150, 2, 4, 10))
  $g.FillPath($pth, $vignette)
  $pth.Dispose(); $vignette.Dispose()

  $g.Dispose()
  $bmp.Save($file, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose(); $img.Dispose()
}

Make-Bg (Join-Path $outDir 'bg-comic.png') 226 0.4
Make-Bg (Join-Path $outDir 'bg-comic-quiet.png') 232 0.35
Write-Output "Wrote bg-comic.png and bg-comic-quiet.png"
