# PNG EXPORT MIRROR

This folder is a convenience export of the modular SVG asset pack, at **1× natural size**.

- **180 PNG files**
  - 175 mirrors of `assets/**/*.svg` (same relative folders and basenames).
  - `brand/logo-lockup.png` — 1680×800 transparent master.
  - `characters/avatar-*.png` — 480×480 circular masters.
- **Transparency**: all UI, character, puzzle, icon and FX assets have transparent backgrounds. The two full-bleed backgrounds (`backgrounds/bg-*.png`) are opaque.
- **Source of truth**: the SVGs in `/assets`, or the PNG masters under `/assets/brand` and `/assets/characters` for the logo/avatars.
- **Manifest**: `export-manifest.json` includes width, height, byte size, source path, format, transparency and whether the source is SVG or a PNG master.
- **Regenerate manifest** after adding/removing PNGs:

```powershell
node tools/build-export-manifest.mjs
```

## Use

- **This folder is the full 1× PNG mirror, kept for export/tools.** The game's default runtime now loads a curated subset of PNGs (comic backgrounds, logo, avatars, 18 comic UI cuts, used props), not the entire mirror. That brought cold boot to about **3.4–3.7s** in a fresh Chromium context (old mirror ~5.3s, SVG ~10.1–10.8s).
- The SVG sources remain the editable masters. Add `?assets=svg` to the game URL to force the vector loader for props.
- Import into tools that cannot consume SVG (After Effects, Figma batch import, PowerPoint, Unity UI, etc.).
- For print or native 4K, re-render from SVG at 2× / 4× rather than upscaling these PNGs.
- The UI button PNGs have a **9-slice-safe** design: use the slice values documented in [`docs/ASSET_SPEC.md`](../../docs/ASSET_SPEC.md).

## Do not

- Do not hand-edit the generated PNGs; update the SVG generator and re-export.
- Do not rename folders without updating the manifest.
- Do not assume a white background. Open the PNGs on a dark or checkerboard canvas; transparent edges may look black in some image viewers.
