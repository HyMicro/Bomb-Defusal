# Extracts the supplied UI concept sheets into transparent PNG cuts for the game.
# Source sheets: /assets/*.jpg   Output: /assets/ui/comic/*.png
# Background removal = flood fill from crop edges only, so enclosed dark details
# (bomb body, X keys, outlines) stay intact.

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$srcRoot = Join-Path $root 'assets'
$outRoot = Join-Path $srcRoot 'ui\comic'
New-Item -ItemType Directory -Force -Path $outRoot | Out-Null

$sheets = @{
  frames = Join-Path $srcRoot 'Frame Modul, Panel Metal, Timer & Indikator Status.jpg'
  actions = Join-Path $srcRoot 'Tombol Aksi Utama, Banner Peringatan & Bingkai Kartu Hukuman.jpg'
  fx = Join-Path $srcRoot 'Ikon Bom, Efek Sabotase & Ledakan.jpg'
  parts = Join-Path $srcRoot 'Elemen Interaktif (Tombol Arcade, Kabel, Slider & Fingerprint).jpg'
  icons = Join-Path $srcRoot 'Simbol Crowd Cipher, Keypad Angka & Ikon Sistem.jpg'
  logo = Join-Path $srcRoot 'BOMB DEFUSAL Timer Logo.png'
  buttons = Join-Path $srcRoot 'Button UI Assets.png'
  ren = Join-Path $srcRoot 'd07d20cd-2658-4e12-ae52-4240ef548c40.png'
  kai = Join-Path $srcRoot 'KAI_ The Strategist Character Sheet.png'
  mira = Join-Path $srcRoot 'Mira the Energizer Character Sheet.png'
  rin = Join-Path $srcRoot 'RIN_ The Wild Card Character Sheet.png'
}

# name, sheet, x, y, w, h, tolerance
$cuts = @(
  @('frame-card', 'frames', 45, 35, 440, 405, 30),
  @('plate-warn', 'frames', 1035, 35, 545, 320, 30),
  @('plate-metal', 'frames', 1035, 380, 545, 345, 30),
  @('led-red', 'frames', 1645, 35, 235, 265, 34),
  @('led-green', 'frames', 1885, 35, 235, 265, 34),
  @('panel-lcd', 'frames', 1040, 795, 1040, 345, 34),
  @('x-red', 'frames', 2110, 845, 265, 285, 30),
  @('x-off', 'frames', 2400, 845, 250, 285, 30),

  @('dial-bomb', 'actions', 45, 40, 575, 565, 30),
  @('btn-play', 'actions', 770, 90, 820, 470, 30),
  @('banner-trophy', 'actions', 1645, 40, 1030, 370, 30),
  @('banner-warn', 'actions', 75, 595, 1010, 365, 30),
  @('frame-penalty', 'actions', 1140, 610, 710, 840, 30),
  @('frame-metal', 'actions', 1910, 535, 750, 930, 30),
  @('ribbon-trophy', 'actions', 50, 1030, 1060, 460, 30),

  @('bomb', 'fx', 50, 20, 430, 420, 30),
  @('fx-boom', 'fx', 1150, 70, 450, 470, 30),
  @('fx-cloud', 'fx', 1730, 560, 410, 380, 30),
  @('fx-ice', 'fx', 1150, 570, 520, 380, 30),
  @('hazard', 'fx', 1150, 1060, 1530, 80, 26),

  @('brand-logo', 'logo', 30, 220, 1060, 900, 26),

  @('ui-start-normal', 'buttons', 40, 166, 252, 64, 24),
  @('ui-start-hover', 'buttons', 40, 234, 252, 64, 24),
  @('ui-start-pressed', 'buttons', 40, 300, 252, 64, 24),
  @('ui-start-disabled', 'buttons', 40, 370, 252, 64, 24),
  @('ui-settings-normal', 'buttons', 450, 166, 175, 60, 24),
  @('ui-settings-hover', 'buttons', 450, 234, 175, 60, 24),
  @('ui-settings-pressed', 'buttons', 450, 300, 175, 60, 24),
  @('ui-settings-disabled', 'buttons', 450, 366, 175, 60, 24),
  @('ui-cara-normal', 'buttons', 634, 166, 174, 60, 24),
  @('ui-cara-hover', 'buttons', 634, 234, 174, 60, 24),
  @('ui-cara-pressed', 'buttons', 634, 300, 174, 60, 24),
  @('ui-cara-disabled', 'buttons', 634, 366, 174, 60, 24),
  @('ui-board-normal', 'buttons', 818, 166, 188, 60, 24),
  @('ui-board-hover', 'buttons', 818, 234, 188, 60, 24),
  @('ui-board-pressed', 'buttons', 818, 300, 188, 60, 24),
  @('ui-board-disabled', 'buttons', 818, 366, 188, 60, 24),
  @('ui-next', 'buttons', 465, 452, 380, 64, 24),
  @('ui-retry', 'buttons', 845, 452, 250, 64, 24),
  @('ui-skip', 'buttons', 1105, 452, 248, 64, 24),
  @('ui-bomb', 'buttons', 45, 568, 355, 76, 24),
  @('ui-confirm', 'buttons', 522, 568, 198, 66, 24),
  @('ui-cancel', 'buttons', 733, 568, 228, 66, 24),

  @('pose-ren', 'ren', 520, 82, 190, 320, 40),
  @('pose-kai', 'kai', 520, 82, 190, 320, 40),
  @('pose-mira', 'mira', 520, 82, 190, 320, 40),
  @('pose-rin', 'rin', 520, 82, 190, 320, 40),
  @('btn-red', 'parts', 100, 125, 235, 235, 30),
  @('btn-yellow', 'parts', 590, 125, 235, 235, 30),
  @('btn-blue', 'parts', 100, 380, 235, 235, 30),
  @('btn-green', 'parts', 100, 640, 235, 235, 30),
  @('btn-orange', 'parts', 590, 640, 235, 235, 30),

  @('icon-trophy', 'icons', 1440, 380, 300, 340, 30),
  @('icon-check', 'icons', 1430, 100, 320, 300, 30),
  @('icon-x', 'icons', 1440, 850, 300, 330, 30),
  @('icon-gear', 'icons', 780, 420, 240, 240, 30),
  @('icon-sound', 'icons', 1080, 1160, 380, 310, 30),
  @('icon-mute', 'icons', 1455, 1165, 320, 300, 30)
)

$code = @'
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;

public static class ComicCut
{
    public static string Cut(string src, int cx, int cy, int cw, int ch, string dst, int tol, bool soften = true, bool white = false)
    {
        using (var sheet = new Bitmap(src))
        {
            var rect = new Rectangle(cx, cy, cw, ch);
            using (var crop = sheet.Clone(rect, PixelFormat.Format32bppArgb))
            {
                int W = crop.Width, H = crop.Height;
                var bd = crop.LockBits(new Rectangle(0, 0, W, H), ImageLockMode.ReadWrite, PixelFormat.Format32bppArgb);
                int stride = bd.Stride;
                byte[] buf = new byte[stride * H];
                Marshal.Copy(bd.Scan0, buf, 0, buf.Length);

                // Estimate the sheet background from neutral border pixels.
                long sum = 0; int n = 0;
                for (int x = 0; x < W; x += 3)
                {
                    sum += Lum(buf, stride, x, 0); n++;
                    sum += Lum(buf, stride, x, H - 1); n++;
                }
                for (int y = 0; y < H; y += 3)
                {
                    sum += Lum(buf, stride, 0, y); n++;
                    sum += Lum(buf, stride, W - 1, y); n++;
                }
                int bgLum = (int)(sum / Math.Max(1, n));

                bool[] dead = new bool[W * H];
                var q = new Queue<int>();
                for (int x = 0; x < W; x++) { Seed(buf, stride, W, H, x, 0, bgLum, tol, dead, q, white); Seed(buf, stride, W, H, x, H - 1, bgLum, tol, dead, q, white); }
                for (int y = 0; y < H; y++) { Seed(buf, stride, W, H, 0, y, bgLum, tol, dead, q, white); Seed(buf, stride, W, H, W - 1, y, bgLum, tol, dead, q, white); }

                int[] dx = { 1, -1, 0, 0 };
                int[] dy = { 0, 0, 1, -1 };
                while (q.Count > 0)
                {
                    int p = q.Dequeue();
                    int px = p % W, py = p / W;
                    for (int i = 0; i < 4; i++)
                    {
                        int nx = px + dx[i], ny = py + dy[i];
                        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
                        Seed(buf, stride, W, H, nx, ny, bgLum, tol, dead, q, white);
                    }
                }

                int minX = W, minY = H, maxX = -1, maxY = -1;
                for (int y = 0; y < H; y++)
                {
                    for (int x = 0; x < W; x++)
                    {
                        int o = y * stride + x * 4;
                        if (dead[y * W + x])
                        {
                            buf[o + 3] = 0;
                            continue;
                        }
                        // Keep faint JPEG fringes from forming a grey halo.
                        int lum = Lum(buf, stride, x, y);
                        int spread = Spread(buf, stride, x, y);
                        if (soften && spread < 20 && lum >= bgLum - tol && lum <= bgLum + tol)
                            buf[o + 3] = (byte)Math.Min((int)buf[o + 3], 90);
                        if (buf[o + 3] > 8)
                        {
                            if (x < minX) minX = x;
                            if (y < minY) minY = y;
                            if (x > maxX) maxX = x;
                            if (y > maxY) maxY = y;
                        }
                    }
                }
                Marshal.Copy(buf, 0, bd.Scan0, buf.Length);
                crop.UnlockBits(bd);

                if (maxX < 0) return "EMPTY " + dst;
                int pad = 2;
                minX = Math.Max(0, minX - pad); minY = Math.Max(0, minY - pad);
                maxX = Math.Min(W - 1, maxX + pad); maxY = Math.Min(H - 1, maxY + pad);
                var outRect = new Rectangle(minX, minY, maxX - minX + 1, maxY - minY + 1);
                using (var final = crop.Clone(outRect, PixelFormat.Format32bppArgb))
                {
                    final.Save(dst, ImageFormat.Png);
                    return final.Width + "x" + final.Height;
                }
            }
        }
    }

    static int Lum(byte[] buf, int stride, int x, int y)
    {
        int o = y * stride + x * 4;
        return (buf[o + 2] * 30 + buf[o + 1] * 59 + buf[o] * 11) / 100;
    }

    static int Spread(byte[] buf, int stride, int x, int y)
    {
        int o = y * stride + x * 4;
        int b = buf[o], g = buf[o + 1], r = buf[o + 2];
        int max = Math.Max(r, Math.Max(g, b));
        int min = Math.Min(r, Math.Min(g, b));
        return max - min;
    }

    static void Seed(byte[] buf, int stride, int W, int H, int x, int y, int bgLum, int tol, bool[] dead, Queue<int> q, bool white = false)
    {
        int idx = y * W + x;
        if (dead[idx]) return;
        int o = y * stride + x * 4;
        int b = buf[o], g = buf[o + 1], r = buf[o + 2];
        if (white)
        {
            int min = Math.Min(r, Math.Min(g, b));
            if (min < 255 - tol) return;
            if (Spread(buf, stride, x, y) > 20) return;
        }
        else
        {
            int lum = Lum(buf, stride, x, y);
            if (lum < bgLum - tol || lum > bgLum + tol) return;
            if (Spread(buf, stride, x, y) > 26) return;
        }
        dead[idx] = true;
        q.Enqueue(idx);
    }
}
'@
if (-not ('ComicCut' -as [type])) {
  Add-Type -TypeDefinition $code -ReferencedAssemblies System.Drawing
}

$report = @()
foreach ($cut in $cuts) {
  $name, $sheetKey, $x, $y, $w, $h, $tol = $cut
  $dst = if ($name -eq 'brand-logo') { Join-Path $root 'assets\brand\bomb-defusal-logo.png' } else { Join-Path $outRoot "$name.png" }
  $soften = $name -notmatch '^(brand-logo|pose-|portrait-)'
  $white = $name -match '^pose-'
  $size = [ComicCut]::Cut($sheets[$sheetKey], $x, $y, $w, $h, $dst, $tol, $soften, $white)
  $report += "{0,-16} {1}" -f $name, $size
}
$report | ForEach-Object { Write-Output $_ }
Write-Output "Wrote $($cuts.Count) PNG cuts to assets/ui/comic"
