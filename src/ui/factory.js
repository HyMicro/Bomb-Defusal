import { CSS, FONT, THEME } from '../config.js';

/* ------------------------------------------------------------------ *
 *  Text
 * ------------------------------------------------------------------ */
export function txt(scene, x, y, text, {
  size = 24, font = FONT.body, color = CSS.cream, align = 'center', origin = 0.5,
  stroke = null, strokeThickness = 0, shadow = null, letterSpacing = 0, lineSpacing = 0,
  wrap = 0, fixed = false, alpha = 1, bold = true, wordWrapUseAdvanced = true,
} = {}) {
  const style = {
    fontFamily: font,
    fontSize: `${size}px`,
    color,
    align,
    fontStyle: 'normal',
    lineSpacing,
  };
  if (letterSpacing) style.letterSpacing = letterSpacing;
  if (stroke) { style.stroke = stroke; style.strokeThickness = strokeThickness; }
  if (wrap) style.wordWrap = { width: wrap, useAdvancedWrap: wordWrapUseAdvanced };
  const t = scene.add.text(x, y, text, style).setOrigin(origin);
  if (shadow) t.setShadow(shadow.x ?? 0, shadow.y ?? 5, shadow.color ?? CSS.ink, shadow.blur ?? 0, shadow.stroke ?? false, shadow.fill ?? true);
  if (fixed) t.setScrollFactor(0);
  t.setAlpha(alpha);
  return t;
}

export function fitText(t, maxWidth, minSize = 14) {
  let size = parseInt(t.style.fontSize, 10) || 24;
  while (t.width > maxWidth && size > minSize) {
    size -= 1;
    t.setFontSize(size);
  }
  return t;
}

/** Multi-style logotype used as a fallback (and on documents). */
export function textLogo(scene, x, y, scale = 1) {
  const c = scene.add.container(x, y);
  const burst = scene.add.image(0, 0, 'logo-mark').setDisplaySize(400 * scale, 400 * scale);
  const bom = txt(scene, 220 * scale, -72 * scale, 'BOM', {
    size: 170 * scale, font: FONT.display, color: CSS.yellow, stroke: CSS.ink, strokeThickness: 12 * scale,
  }).setShadow(0, 9 * scale, CSS.red, 0, true, true);
  const challenge = txt(scene, 240 * scale, 54 * scale, 'CHALLENGE!', {
    size: 106 * scale, font: FONT.display, color: CSS.cream, stroke: CSS.ink, strokeThickness: 9 * scale,
  }).setShadow(0, 7 * scale, CSS.blue, 0, true, true);
  c.add([burst, bom, challenge]);
  return c;
}

/* ------------------------------------------------------------------ *
 *  Panels / frames
 * ------------------------------------------------------------------ */
export function panel(scene, x, y, w, h, {
  alpha = 1, depth = 0, fill = THEME.panel, border = THEME.border, radius = 18,
} = {}) {
  const g = scene.add.graphics().setDepth(depth);
  g.fillStyle(fill, 1).fillRoundedRect(x, y, w, h, radius);
  g.lineStyle(1.5, border, Math.min(1, alpha + .08)).strokeRoundedRect(x + .75, y + .75, w - 1.5, h - 1.5, radius);
  g.lineStyle(1, 0xffffff, .55).lineBetween(x + 22, y + 1, x + w - 22, y + 1);
  return g;
}

export function plate(scene, x, y, key, w = null, h = null, origin = 0.5) {
  const img = scene.add.image(x, y, key).setOrigin(origin);
  if (w || h) {
    const sw = w || (img.width * ((h || img.height) / img.height));
    const sh = h || (img.height * ((w || img.width) / img.width));
    img.setDisplaySize(sw, sh);
  }
  return img;
}

export function accentStrip(scene, x, y, w, color, h = 5, alpha = 0.9) {
  const g = scene.add.graphics();
  g.fillStyle(color, alpha).fillRoundedRect(x, y, w, h, h / 2);
  g.fillStyle(0xffffff, 0.25).fillRoundedRect(x + 3, y + 1, w - 6, Math.max(1, h * 0.3), h / 4);
  return g;
}

/* ------------------------------------------------------------------ *
 *  Buttons
 * ------------------------------------------------------------------ */
const BUTTON_STYLES = {
  primary: { base: 0xffc93c, hover: 0xffd766, pressed: 0xe5ad16, border: 0xd59b0d, text: '#1B1406', sub: 'rgba(27,20,6,.72)' },
  blue: { base: 0x2c7ce6, hover: 0x4c9bff, pressed: 0x1f61c0, border: 0x78b5ff, text: '#FFFFFF', sub: 'rgba(255,255,255,.76)' },
  danger: { base: 0xe84b56, hover: 0xf2555f, pressed: 0xc93c47, border: 0xff8a90, text: '#FFFFFF', sub: 'rgba(255,255,255,.78)' },
  success: { base: 0x33b986, hover: 0x45d6a0, pressed: 0x259468, border: 0x89e9c0, text: '#061A12', sub: 'rgba(6,26,18,.72)' },
  ghost: { base: 0xfff4df, hover: 0xfff0cf, pressed: 0xe7d3ae, border: 0x1b1406, text: '#1B1406', sub: 'rgba(27,20,6,.66)' },
  purple: { base: 0x815dbb, hover: 0x9a72d5, pressed: 0x67459f, border: 0xb99ada, text: '#FFFFFF', sub: 'rgba(255,255,255,.76)' },
  orange: { base: 0xe89a36, hover: 0xffb45e, pressed: 0xc97f20, border: 0xffcf96, text: '#211505', sub: 'rgba(33,21,5,.72)' },
};

export function button(scene, {
  x = 0, y = 0, w = 360, h = 104, label = 'MULAI', sub = null, icon = null,
  variant = 'primary', onClick = null, disabled = false, fontSize = 30, subSize = 13,
  labelColor = null, depth = 0, cooldown = 160, iconScale = 0.62, align = 'center',
} = {}) {
  const style = BUTTON_STYLES[variant] || BUTTON_STYLES.primary;
  const container = scene.add.container(x, y).setDepth(depth);
  const g = scene.add.graphics();
  container.add(g);
  const radius = h < 70 ? 13 : 16;
  const color = labelColor || style.text;
  const contentX = align === 'left' ? -w / 2 + (icon ? 76 : 28) : icon ? 16 : 0;
  let iconObj = null;
  if (icon && scene.textures.exists(icon)) {
    iconObj = scene.add.image(align === 'left' ? -w / 2 + 34 : -w / 2 + 40, 0, icon)
      .setDisplaySize(48 * iconScale * 1.7, 48 * iconScale * 1.7)
      .setTint(variant === 'primary' || variant === 'success' || variant === 'orange' ? 0x1b1406 : 0xfff4df);
    container.add(iconObj);
  }
  const labelObj = txt(scene, contentX, sub ? -12 : 0, label, {
    size: fontSize, font: FONT.heading, color, letterSpacing: 0.2,
  });
  labelObj.setOrigin(align === 'left' ? 0 : 0.5, 0.5);
  fitText(labelObj, w - (iconObj ? 140 : 50), 15);
  container.add(labelObj);
  let subObj = null;
  if (sub) {
    subObj = txt(scene, contentX, 18, sub, {
      size: subSize, font: FONT.body, color: style.sub, letterSpacing: 0.2,
    });
    subObj.setOrigin(align === 'left' ? 0 : 0.5, 0.5);
    if (subObj.width > w - 50) subObj.setScale((w - 50) / subObj.width);
    container.add(subObj);
  }

  const zone = scene.add.zone(0, 0, Math.max(140, w), Math.max(120, h)).setOrigin(0.5).setInteractive({ useHandCursor: true });
  container.add(zone);

  let isDisabled = !!disabled;
  let hovered = false;
  let downPointer = null;
  let downAt = 0;
  let lastClick = -1000;

  const paint = (state) => {
    const fill = isDisabled ? 0x29364b : state === 'hover' ? style.hover : state === 'pressed' ? style.pressed : style.base;
    const border = isDisabled ? 0x3b4860 : style.border;
    g.clear();
    g.fillStyle(0x05090f, 0.32).fillRoundedRect(-w / 2 + 3, -h / 2 + 4, w - 6, h - 6, radius);
    g.fillStyle(fill, 1).fillRoundedRect(-w / 2, -h / 2, w, h, radius);
    g.lineStyle(1.5, border, 0.95).strokeRoundedRect(-w / 2 + .75, -h / 2 + .75, w - 1.5, h - 1.5, radius);
    g.lineStyle(1, 0xffffff, 0.10).lineBetween(-w / 2 + 24, -h / 2 + 9, w / 2 - 24, -h / 2 + 9);
    labelObj.setColor(isDisabled ? '#7d8aa1' : color);
    if (subObj) subObj.setColor(isDisabled ? '#69768d' : style.sub);
    if (iconObj) iconObj.setAlpha(isDisabled ? 0.45 : 1);
  };
  const reset = () => {
    container.setScale(1);
    paint('normal');
  };
  zone.on('pointerover', () => {
    hovered = true;
    if (isDisabled) return;
    paint('hover');
    container.setScale(1.015);
  });
  zone.on('pointerout', () => {
    hovered = false;
    if (isDisabled) return;
    reset();
    downPointer = null;
  });
  zone.on('pointerdown', (pointer) => {
    if (isDisabled) return;
    downPointer = pointer;
    downAt = performance.now();
    paint('pressed');
    container.setScale(0.985);
    if (scene.__audioClick) scene.__audioClick();
  });
  zone.on('pointerup', () => {
    if (isDisabled) { downPointer = null; return; }
    paint(hovered ? 'hover' : 'normal');
    container.setScale(1);
    const moved = downPointer ? downPointer.getDistance() : 999;
    const elapsed = performance.now() - downAt;
    const now = performance.now();
    downPointer = null;
    if (moved < 34 && elapsed < 1200 && now - lastClick > cooldown) {
      lastClick = now;
      if (onClick) onClick();
    }
  });

  const api = {
    container, label: labelObj, subLabel: subObj, zone,
    setDisabled(v) {
      isDisabled = !!v;
      paint(hovered && !isDisabled ? 'hover' : 'normal');
      container.setAlpha(1);
      zone.input.cursor = isDisabled ? 'default' : 'pointer';
    },
    setLabel(v) { labelObj.setText(v); fitText(labelObj, w - (iconObj ? 140 : 50), 14); },
    setSubLabel(v) {
      if (!subObj) return;
      subObj.setText(v);
      if (subObj.width > w - 50) subObj.setScale((w - 50) / subObj.width);
    },
    destroy() { container.destroy(true); },
    setDepth(d) { container.setDepth(d); return api; },
    setPosition(nx, ny) { x = nx; y = ny; container.setPosition(nx, ny); return api; },
    get disabled() { return isDisabled; },
  };
  paint(isDisabled ? 'disabled' : 'normal');
  return api;
}

export function iconButton(scene, {
  x = 0, y = 0, size = 96, icon = 'icon-settings', variant = 'ghost',
  onClick = null, depth = 0, disabled = false,
} = {}) {
  const c = scene.add.container(x, y).setDepth(depth);
  const style = BUTTON_STYLES[variant] || BUTTON_STYLES.ghost;
  const g = scene.add.graphics();
  const iconObj = scene.add.image(0, 0, icon).setDisplaySize(size * 0.42, size * 0.42);
  if (variant === 'primary') iconObj.setTint(0x1b1406);
  c.add([g, iconObj]);
  const zone = scene.add.zone(0, 0, Math.max(140, size), Math.max(140, size)).setOrigin(0.5).setInteractive({ useHandCursor: true });
  c.add(zone);
  let last = -1000;
  let isDisabled = disabled;
  let hovered = false;
  const paint = (state) => {
    const fill = isDisabled ? 0x222e41 : state === 'hover' ? style.hover : state === 'pressed' ? style.pressed : 0x121c2c;
    g.clear();
    g.fillStyle(fill, 1).fillCircle(0, 0, size / 2);
    g.lineStyle(1.5, isDisabled ? 0x37445a : style.border, .85).strokeCircle(0, 0, size / 2 - .75);
    iconObj.setAlpha(isDisabled ? .4 : .9);
  };
  paint('normal');
  zone.on('pointerover', () => { hovered = true; if (!isDisabled) paint('hover'); });
  zone.on('pointerout', () => { hovered = false; if (!isDisabled) paint('normal'); });
  zone.on('pointerdown', () => {
    if (isDisabled) return;
    paint('pressed');
    scene.tweens.add({ targets: c, scale: 0.94, duration: 55 });
  });
  zone.on('pointerup', () => {
    if (isDisabled) return;
    paint(hovered ? 'hover' : 'normal');
    scene.tweens.add({ targets: c, scale: 1, duration: 100, ease: 'Back.Out' });
    const now = performance.now();
    if (now - last > 180) {
      last = now;
      if (scene.__audioClick) scene.__audioClick();
      if (onClick) onClick();
    }
  });
  return {
    container: c, icon: iconObj,
    setDisabled(v) { isDisabled = !!v; paint('normal'); },
    setPosition(nx, ny) { c.setPosition(nx, ny); },
    destroy() { c.destroy(true); },
  };
}

/* ------------------------------------------------------------------ *
 *  Art-image buttons (the supplied arcade cuts)
 * ------------------------------------------------------------------ */
export function imageButton(scene, {
  x = 0, y = 0, key = 'cut-play', states = null, w = 420, h = 236, onClick = null,
  depth = 0, disabled = false, scaleHover = 1.025, burstColor = 0xffc93c,
} = {}) {
  const c = scene.add.container(x, y).setDepth(depth);
  const textures = states || { normal: key, hover: key, pressed: key };
  const img = scene.add.image(0, 0, textures.normal || key).setDisplaySize(w, h);
  c.add(img);
  const zone = scene.add.zone(0, 0, Math.max(160, w), Math.max(120, h)).setOrigin(0.5).setInteractive({ useHandCursor: true });
  c.add(zone);
  let isDisabled = disabled;
  let last = -1000;
  let hovered = false;
  const paint = (state) => {
    const k = textures[state] || textures.normal;
    if (k && img.texture.key !== k) img.setTexture(k).setDisplaySize(w, h);
  };
  const burst = () => {
    if (burstColor != null) sparkBurst(scene, x, y, burstColor, 6, { scale: 0.2, speed: 100, depth: depth + 1 });
  };
  zone.on('pointerover', () => {
    hovered = true;
    if (isDisabled) return;
    paint('hover');
    scene.tweens.add({ targets: c, scale: scaleHover, duration: 110 });
  });
  zone.on('pointerout', () => {
    hovered = false;
    if (isDisabled) return;
    paint('normal');
    scene.tweens.add({ targets: c, scale: 1, duration: 110 });
  });
  zone.on('pointerdown', () => {
    if (isDisabled) return;
    paint('pressed');
    c.setScale(0.975);
    if (scene.__audioClick) scene.__audioClick();
  });
  zone.on('pointerup', () => {
    if (isDisabled) return;
    paint(hovered ? 'hover' : 'normal');
    c.setScale(1);
    const now = performance.now();
    if (now - last < 260) return;
    last = now;
    burst();
    onClick?.();
  });
  return {
    container: c, img, zone,
    setDisabled(v) {
      isDisabled = !!v;
      paint(isDisabled ? 'disabled' : 'normal');
      c.setAlpha(textures.disabled ? 1 : (isDisabled ? 0.45 : 1));
    },
    setPosition(nx, ny) { c.setPosition(nx, ny); },
    destroy() { c.destroy(true); },
  };
}

/* ------------------------------------------------------------------ *
 *  Badges / avatars
 * ------------------------------------------------------------------ */
export function avatarBadge(scene, x, y, player, size = 64, {
  ring = true, number = false, dim = false, depth = 0,
} = {}) {
  const c = scene.add.container(x, y).setDepth(depth);
  const r = size / 2;
  const shadow = scene.add.circle(2, 5, r, 0x05070d, 0.5);
  const disc = scene.add.circle(0, 0, r, 0x0b101c, 1);
  const accent = scene.add.circle(0, 0, r - 4, player.color, 0.22);
  let img;
  if (player.avatarCrop && scene.textures.exists(player.avatarCrop)) {
    img = scene.add.image(0, 0, player.avatarCrop).setDisplaySize(size, size);
  } else {
    img = scene.add.image(0, -size * 0.82, player.avatar).setOrigin(0.5, 0);
    const scale = (size * 1.62) / img.width;
    img.setScale(scale);
  }
  c.add([shadow, disc, accent, img]);
  if (ring) {
    const ringG = scene.add.graphics();
    ringG.lineStyle(Math.max(3, size * 0.055), player.color, dim ? 0.4 : 0.95).strokeCircle(0, 0, r - 3);
    ringG.lineStyle(2, 0x090d18, 0.95).strokeCircle(0, 0, r);
    c.add(ringG);
  }
  if (number) {
    const b = scene.add.circle(r * 0.72, r * 0.66, r * 0.38, player.color, 1);
    b.setStrokeStyle(3, 0x090d18);
    const n = txt(scene, r * 0.72, r * 0.67, String(player.index + 1), {
      size: Math.round(size * 0.3), font: FONT.display, color: '#070C16',
    });
    c.add([b, n]);
  }
  if (dim) img.setTint(0x8a94ad);
  return c;
}

export function playerTag(scene, x, y, player, { width = 164, height = 40, active = true } = {}) {
  const c = scene.add.container(x, y);
  const g = scene.add.graphics();
  g.fillStyle(THEME.panel, 0.92).fillRoundedRect(0, 0, width, height, 12);
  g.lineStyle(1, active ? player.color : THEME.borderSoft, active ? .55 : .35).strokeRoundedRect(.5, .5, width - 1, height - 1, 12);
  g.fillStyle(player.color, active ? 1 : .35).fillRoundedRect(0, 8, 3, height - 16, 2);
  c.add(g);
  const avatar = avatarBadge(scene, 20, height / 2, player, 30, { number: false, dim: !active, ring: false });
  c.add(avatar);
  const name = txt(scene, 42, height / 2, player.name, {
    size: 13, font: FONT.body, color: active ? CSS.text : CSS.dim, origin: 0,
  });
  const score = txt(scene, width - 12, height / 2, formatNumber(player.contribution), {
    size: 12, font: FONT.mono, color: active ? player.css : CSS.dim, origin: 1,
  });
  c.add([name, score]);
  return { container: c, name, score, ring: g };
}

/* ------------------------------------------------------------------ *
 *  HUD
 * ------------------------------------------------------------------ */
export function progressBar(scene, x, y, w, h, { depth = 0, segments = 3, showTicks = true } = {}) {
  const c = scene.add.container(x, y).setDepth(depth);
  const track = scene.add.graphics();
  const fill = scene.add.graphics();
  const ticks = scene.add.graphics();
  c.add([track, fill, ticks]);
  const radius = h / 2;
  const api = {
    container: c, fill, track,
    setProgress(ratio, color = THEME.green) {
      const r = Phaser.Math.Clamp(ratio, 0, 1);
      track.clear();
      track.fillStyle(0x080e18, 1).fillRoundedRect(0, 0, w, h, radius);
      track.lineStyle(1, THEME.border, 0.9).strokeRoundedRect(.5, .5, w - 1, h - 1, radius);
      fill.clear();
      const innerW = Math.max(0, (w - 4) * r);
      if (innerW > 2) {
        fill.fillStyle(color, 1).fillRoundedRect(2, 2, innerW, h - 4, radius - 2);
      }
      ticks.clear();
      if (showTicks && segments > 1) {
        for (let i = 1; i < segments; i++) {
          const px = (w * i) / segments;
          ticks.lineStyle(2, 0x08111d, 0.9).lineBetween(px, 1, px, h - 1);
        }
      }
    },
  };
  api.setProgress(0);
  return api;
}

export function timerDisplay(scene, x, y, { w = 430, h = 124, depth = 20 } = {}) {
  const c = scene.add.container(x, y).setDepth(depth);
  const bezel = scene.add.image(0, 0, 'cut-lcd');
  if (bezel.texture?.key === 'cut-lcd') bezel.setDisplaySize(w, h);
  else bezel.setVisible(false);
  const screen = scene.add.graphics();
  const scan = scene.add.graphics();
  const label = txt(scene, 0, -h / 2 + 27, 'SISA WAKTU', {
    size: 10, font: FONT.body, color: '#9BE8B0', letterSpacing: 1.6,
  });
  const time = txt(scene, 0, 0, '00:42', {
    size: Math.round(h * 0.4), font: FONT.mono, color: '#B6FFC6', letterSpacing: -1,
  }).setShadow(0, 0, '#39FF7A', 14, false, true);
  const status = txt(scene, 0, h / 2 - 20, '3 MODUL', {
    size: 9, font: FONT.body, color: '#74B98A', letterSpacing: 1,
  });
  c.add([bezel, screen, scan, label, time, status]);

  const paintScreen = (urgent) => {
    const sw = w - 38, sh = h - 34;
    screen.clear();
    screen.fillStyle(urgent ? 0x2A0B0E : 0x0B2417, 1).fillRoundedRect(-sw / 2, -sh / 2 + 2, sw, sh, 6);
    screen.lineStyle(1, urgent ? 0x7A1A20 : 0x1E4A2F, 1).strokeRoundedRect(-sw / 2, -sh / 2 + 2, sw, sh, 6);
    scan.clear();
    for (let sy = -sh / 2 + 6; sy < sh / 2; sy += 4) {
      scan.lineStyle(1, 0x000000, 0.16).lineBetween(-sw / 2 + 4, sy, sw / 2 - 4, sy);
    }
  };
  paintScreen(false);

  return {
    container: c, time, label, status,
    setTime(seconds, urgent = false) {
      const s = Math.max(0, Math.ceil(seconds));
      const m = Math.floor(s / 60).toString().padStart(2, '0');
      const ss = (s % 60).toString().padStart(2, '0');
      time.setText(`${m}:${ss}`);
      time.setColor(urgent ? '#FF9AA0' : '#B6FFC6');
      time.setShadow(0, 0, urgent ? '#FF3038' : '#39FF7A', urgent ? 22 : 14, false, true);
      status.setColor(urgent ? '#E48A90' : '#74B98A');
      paintScreen(urgent);
    },
    setStatus(text) { status.setText(text); },
    pulse() {
      scene.tweens.add({ targets: time, scale: 1.1, duration: 100, yoyo: true, ease: 'Quad.Out' });
    },
  };
}

export function strikeRow(scene, x, y, { size = 30, max = 3, depth = 20 } = {}) {
  const c = scene.add.container(x, y).setDepth(depth);
  const pips = [];
  for (let i = 0; i < max; i++) {
    const icon = scene.add.image(i * (size + 8), 0, 'cut-x-off').setDisplaySize(size, size);
    c.add(icon);
    pips.push(icon);
  }
  return {
    container: c,
    set(strikes) {
      pips.forEach((p, i) => {
        const lost = i < strikes;
        p.setTexture(lost ? 'cut-x-red' : 'cut-x-off');
        p.setDisplaySize(size, size);
        p.setAlpha(lost ? 1 : .38);
      });
    },
    flash() { scene.tweens.add({ targets: c, x: x + 5, duration: 45, yoyo: true, repeat: 2, onComplete: () => { c.x = x; } }); },
    width: max * (size + 8),
  };
}

export function scorePlate(scene, x, y, { w = 260, h = 70, depth = 20 } = {}) {
  const c = scene.add.container(x, y).setDepth(depth);
  const g = scene.add.graphics();
  g.fillStyle(THEME.panel, .92).fillRoundedRect(0, 0, w, h, 14);
  g.lineStyle(1, THEME.border, .9).strokeRoundedRect(.5, .5, w - 1, h - 1, 14);
  const label = txt(scene, 16, 11, 'SKOR', { size: 10, font: FONT.body, color: CSS.muted, origin: 0, letterSpacing: 1.2 });
  const value = txt(scene, 16, h - 13, '0', { size: 27, font: FONT.heading, color: CSS.text, origin: 0 });
  value.setOrigin(0, 1);
  const delta = txt(scene, w - 14, 18, '', { size: 14, font: FONT.mono, color: CSS.green, origin: 1, alpha: 0 });
  c.add([g, label, value, delta]);
  return {
    container: c, value, label,
    setScore(n, animate = false) {
      value.setText(formatNumber(n));
      if (animate) scene.tweens.add({ targets: value, scale: 1.08, duration: 90, yoyo: true });
    },
    popDelta(text, positive = true) {
      delta.setText(text).setColor(positive ? CSS.green : CSS.red).setAlpha(1).setY(18);
      scene.tweens.add({ targets: delta, y: 4, alpha: 0, duration: 800, ease: 'Quad.Out' });
    },
  };
}

/* ------------------------------------------------------------------ *
 *  FX helpers
 * ------------------------------------------------------------------ */
export function sparkBurst(scene, x, y, color = 0xffc93c, count = 8, { scale = 0.35, speed = 160, depth = 90 } = {}) {
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const d = speed * (0.35 + Math.random() * 0.8);
    const s = scale * (0.55 + Math.random() * 0.85);
    const img = scene.add.image(x, y, 'fx-spark').setTint(color).setBlendMode(Phaser.BlendModes.ADD)
      .setScale(s).setDepth(depth).setRotation(Math.random() * 6);
    scene.tweens.add({
      targets: img, x: x + Math.cos(a) * d, y: y + Math.sin(a) * d, scale: 0, alpha: 0,
      duration: 260 + Math.random() * 420, ease: 'Cubic.Out', onComplete: () => img.destroy(),
    });
  }
}

export function touchRipple(scene, x, y, color = 0x4c9bff, { depth = 95, big = false } = {}) {
  const ring = scene.add.circle(x, y, big ? 26 : 16, 0xffffff, 0).setStrokeStyle(big ? 6 : 4, color, 0.9).setDepth(depth);
  const dot = scene.add.circle(x, y, big ? 8 : 5, color, 0.55).setDepth(depth);
  scene.tweens.add({ targets: ring, radius: big ? 92 : 56, alpha: 0, duration: 430, ease: 'Cubic.Out', onComplete: () => ring.destroy() });
  scene.tweens.add({ targets: dot, scale: 2.4, alpha: 0, duration: 280, ease: 'Cubic.Out', onComplete: () => dot.destroy() });
  sparkBurst(scene, x, y, color, big ? 10 : 5, { scale: 0.25, speed: 95, depth });
}

export function floatText(scene, x, y, text, color = CSS.green, { size = 24, up = 70, depth = 90, stroke = CSS.ink } = {}) {
  const t = txt(scene, x, y, text, { size, font: FONT.heading, color, stroke, strokeThickness: 5 }).setDepth(depth);
  scene.tweens.add({ targets: t, y: y - up, alpha: 0, duration: 950, ease: 'Cubic.Out', onComplete: () => t.destroy() });
  return t;
}

export function flashScreen(scene, color = 0xffffff, duration = 160, maxAlpha = 1) {
  const rect = scene.add.rectangle(960, 540, 1920, 1080, color, maxAlpha).setDepth(200).setScrollFactor(0);
  scene.tweens.add({ targets: rect, alpha: 0, duration, onComplete: () => rect.destroy() });
}

export function screenShake(scene, intensity = 0.006, duration = 260) {
  scene.cameras.main.shake(duration, intensity);
}

export function confettiBurst(scene, count = 80, { depth = 120, area = [0, 1920], top = -30, duration = 3500, minScale = 0.26, maxScale = 0.62 } = {}) {
  const textures = ['fx-confetti-1', 'fx-confetti-2', 'fx-confetti-3'];
  for (let i = 0; i < count; i++) {
    const x = Phaser.Math.Between(area[0], area[1]);
    const img = scene.add.image(x, top - Math.random() * 300, textures[i % textures.length])
      .setDepth(depth).setScale(minScale + Math.random() * (maxScale - minScale)).setRotation(Math.random() * 6);
    img.setTint([0xf2555f, 0xffc93c, 0x4c9bff, 0xb55ddc, 0x45d6a0][i % 5]);
    scene.tweens.add({
      targets: img,
      y: 1180 + Math.random() * 220,
      x: x + Phaser.Math.Between(-200, 200),
      rotation: img.rotation + (Math.random() > 0.5 ? 1 : -1) * (3 + Math.random() * 5),
      duration: duration + Math.random() * 2400,
      delay: Math.random() * 800,
      ease: 'Sine.In',
      onComplete: () => img.destroy(),
    });
  }
}

export function fireEmbers(scene, count = 30, depth = 5) {
  for (let i = 0; i < count; i++) {
    const img = scene.add.image(Phaser.Math.Between(0, 1920), Phaser.Math.Between(700, 1120), 'fx-spark')
      .setTint([0xffb45e, 0xf2555f, 0xffc93c][i % 3]).setScale(0.08 + Math.random() * 0.16)
      .setAlpha(0.2 + Math.random() * 0.5).setDepth(depth).setBlendMode(Phaser.BlendModes.ADD);
    scene.tweens.add({
      targets: img, y: img.y - Phaser.Math.Between(250, 700), x: img.x + Phaser.Math.Between(-60, 60),
      alpha: 0, duration: 3000 + Math.random() * 5000, repeat: -1, delay: Math.random() * 3000,
      onRepeat: () => { img.y = Phaser.Math.Between(700, 1120); img.alpha = 0.2 + Math.random() * 0.5; },
    });
  }
}

export function goToScene(scene, key, data = {}, { fade = 280 } = {}) {
  if (scene.__leaving) return;
  scene.__leaving = true;
  scene.input.enabled = false;
  scene.cameras.main.fadeOut(fade, 6, 9, 16);
  scene.time.delayedCall(fade + 30, () => scene.scene.start(key, data));
}

export function formatNumber(n) {
  return Math.round(n || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function formatTimeLeft(seconds) {
  const s = Math.max(0, seconds);
  const m = Math.floor(s / 60);
  const ss = Math.floor(s % 60);
  const tenths = Math.floor((s % 1) * 10);
  if (m > 0) return `${String(m).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
  return `${String(ss).padStart(2, '0')}.${tenths}`;
}

export function lerpColor(a, b, t) {
  const ca = Phaser.Display.Color.IntegerToColor(a);
  const cb = Phaser.Display.Color.IntegerToColor(b);
  const c = Phaser.Display.Color.Interpolate.ColorWithColor(ca, cb, 100, Math.round(t * 100));
  return Phaser.Display.Color.GetColor(c.r, c.g, c.b);
}
