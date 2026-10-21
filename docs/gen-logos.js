// Genera los SVG de las 3 propuestas de logo Tot Auto. Texto convertido a trazados con fontkit.
// Uso: descargar las fuentes variables (BodoniModa.ttf, Outfit.ttf, Jost.ttf) del repo google/fonts en ../fonts
// relativo a este archivo (o ajustar FONTS), `npm i fontkit@2` en una carpeta temporal, y:
//   node gen-logos.js <ruta/a/public/brand/propuestas>
const fk = require('fontkit');
const fs = require('fs');
const path = require('path');

const OUT = process.argv[2];
const FONTS = path.join(__dirname, '..', 'fonts');
const r = n => Math.round(n * 100) / 100;

const BG_GRAPHITE = '#1B1C1F';
const INK_ON_DARK = '#F4F2EE';
const INK_ON_LIGHT = '#141416';

// ---------- texto → trazados ----------
function run(font, text, size, tracking = 0, ox0 = 0, oy0 = 0) {
  const lay = font.layout(text);
  const s = size / font.unitsPerEm;
  let pen = ox0;
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  let d = '';
  lay.glyphs.forEach((g, i) => {
    const p = lay.positions[i];
    const ox = pen + p.xOffset * s, oy = oy0 - p.yOffset * s;
    const X = v => r(ox + v * s), Y = v => r(oy - v * s);
    for (const c of g.path.commands) {
      const a = c.args;
      switch (c.command) {
        case 'moveTo': d += `M${X(a[0])} ${Y(a[1])}`; break;
        case 'lineTo': d += `L${X(a[0])} ${Y(a[1])}`; break;
        case 'quadraticCurveTo': d += `Q${X(a[0])} ${Y(a[1])} ${X(a[2])} ${Y(a[3])}`; break;
        case 'bezierCurveTo': d += `C${X(a[0])} ${Y(a[1])} ${X(a[2])} ${Y(a[3])} ${X(a[4])} ${Y(a[5])}`; break;
        case 'closePath': d += 'Z'; break;
      }
    }
    const b = g.bbox;
    if (g.path.commands.length) {
      minX = Math.min(minX, ox + b.minX * s); maxX = Math.max(maxX, ox + b.maxX * s);
      minY = Math.min(minY, oy - b.maxY * s); maxY = Math.max(maxY, oy - b.minY * s);
    }
    pen += p.xAdvance * s + tracking * size;
  });
  return { d, width: pen - ox0 - tracking * size, minX, maxX, minY, maxY, end: pen - tracking * size };
}

function svg({ minX, minY, w, h, title, body, size }) {
  const wh = size ? ` width="${size.w}" height="${size.h}"` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${r(minX)} ${r(minY)} ${r(w)} ${r(h)}"${wh} role="img" aria-label="${title}">\n  <title>${title}</title>\n${body}\n</svg>\n`;
}
const P = (d, fill) => `  <path fill="${fill}" d="${d}"/>`;
const write = (dir, name, content) => { fs.mkdirSync(dir, { recursive: true }); fs.writeFileSync(path.join(dir, name), content); console.log('  ', path.join(dir, name), content.length, 'bytes'); };

// anillo (sector anular) de ángulo a0→a1 en sentido horario (grados, 0 = derecha, y hacia abajo)
function annulus(cx, cy, R, t, a0, a1) {
  const rad = a => a * Math.PI / 180;
  const Ri = R - t;
  const pt = (rr, a) => [r(cx + rr * Math.cos(rad(a))), r(cy + rr * Math.sin(rad(a)))];
  const sweep = ((a1 - a0) % 360 + 360) % 360;
  const large = sweep > 180 ? 1 : 0;
  const [x0, y0] = pt(R, a0), [x1, y1] = pt(R, a1), [xi1, yi1] = pt(Ri, a1), [xi0, yi0] = pt(Ri, a0);
  return `M${x0} ${y0}A${R} ${R} 0 ${large} 1 ${x1} ${y1}L${xi1} ${yi1}A${Ri} ${Ri} 0 ${large} 0 ${xi0} ${yi0}Z`;
}
// aguja: cuña desde el centro hacia el ángulo a, con hub circular
function needle(cx, cy, a, len, baseW, hubR) {
  const rad = a * Math.PI / 180;
  const ux = Math.cos(rad), uy = Math.sin(rad), nx = -uy, ny = ux;
  const tip = [cx + ux * len, cy + uy * len];
  const b1 = [cx - ux * hubR * 0.4 + nx * baseW / 2, cy - uy * hubR * 0.4 + ny * baseW / 2];
  const b2 = [cx - ux * hubR * 0.4 - nx * baseW / 2, cy - uy * hubR * 0.4 - ny * baseW / 2];
  const tri = `M${r(b1[0])} ${r(b1[1])}L${r(tip[0])} ${r(tip[1])}L${r(b2[0])} ${r(b2[1])}Z`;
  const hub = `M${r(cx + hubR)} ${r(cy)}A${hubR} ${hubR} 0 1 0 ${r(cx - hubR)} ${r(cy)}A${hubR} ${hubR} 0 1 0 ${r(cx + hubR)} ${r(cy)}Z`;
  return tri + hub;
}
// barra diagonal gruesa de (x0,y0) a (x1,y1), recortada entre yTop y yBottom (cortes horizontales)
function diag(x0, y0, x1, y1, w, yTop, yBottom) {
  const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy);
  const nx = -dy / L * w / 2, ny = dx / L * w / 2;
  const xAt = (px, py, y) => px + (y - py) * dx / dy;
  const l = [x0 + nx, y0 + ny], rr = [x0 - nx, y0 - ny];
  const pts = [
    [xAt(l[0], l[1], yTop), yTop], [xAt(rr[0], rr[1], yTop), yTop],
    [xAt(rr[0], rr[1], yBottom), yBottom], [xAt(l[0], l[1], yBottom), yBottom],
  ];
  return 'M' + pts.map(p => `${r(p[0])} ${r(p[1])}`).join('L') + 'Z';
}
const rect = (x, y, w, h) => `M${r(x)} ${r(y)}H${r(x + w)}V${r(y + h)}H${r(x)}Z`;
const roundedRect = (x, y, w, h, rx) => `M${x + rx} ${y}H${x + w - rx}A${rx} ${rx} 0 0 1 ${x + w} ${y + rx}V${y + h - rx}A${rx} ${rx} 0 0 1 ${x + w - rx} ${y + h}H${x + rx}A${rx} ${rx} 0 0 1 ${x} ${y + h - rx}V${y + rx}A${rx} ${rx} 0 0 1 ${x + rx} ${y}Z`;
const lozenge = (cx, cy, s) => `M${r(cx)} ${r(cy - s)}L${r(cx + s * 0.72)} ${r(cy)}L${r(cx)} ${r(cy + s)}L${r(cx - s * 0.72)} ${r(cy)}Z`;

function emitSet(dir, build) {
  // build(ink, accent) → {minX,minY,w,h,body}
  const variants = [
    ['logo.svg', INK_ON_DARK, null, 'Tot Auto'],
    ['logo-on-white.svg', INK_ON_LIGHT, null, 'Tot Auto'],
    ['logo-mono-white.svg', '#FFFFFF', '#FFFFFF', 'Tot Auto'],
    ['logo-mono-black.svg', '#000000', '#000000', 'Tot Auto'],
  ];
  for (const [name, ink, accOverride, title] of variants) {
    const o = build.logo(ink, accOverride);
    write(dir, name, svg({ ...o, title }));
  }
  if (build.mark) {
    const m = build.mark(INK_ON_DARK, null);
    write(dir, 'mark.svg', svg({ ...m, title: 'Tot Auto — símbolo' }));
    const mw = build.mark('#FFFFFF', '#FFFFFF');
    write(dir, 'mark-mono-white.svg', svg({ ...mw, title: 'Tot Auto — símbolo' }));
    const mb = build.mark('#000000', '#000000');
    write(dir, 'mark-mono-black.svg', svg({ ...mb, title: 'Tot Auto — símbolo' }));
  }
  const f = build.favicon();
  write(dir, 'favicon.svg', svg({ minX: 0, minY: 0, w: 64, h: 64, title: 'Tot Auto', body: f, size: { w: 64, h: 64 } }));
}

// =====================================================================
// A — Wordmark Bodoni Moda, champán
// =====================================================================
const ACC_A = '#C9A96E';
(function proposalA() {
  console.log('A');
  const font = fk.openSync(path.join(FONTS, 'BodoniModa.ttf')).getVariation({ wght: 600, opsz: 11 });
  const SIZE = 100, TRACK = 0.22, PAD = 24;
  const logo = (ink, accO) => {
    const acc = accO || ACC_A;
    const t = run(font, 'TOT AUTO', SIZE, TRACK);
    const cx = (t.minX + t.maxX) / 2;
    const ruleY = t.maxY + 20, ruleW = (t.maxX - t.minX) * 0.5, ruleT = 2, gap = 10, lz = 6;
    const rule = rect(cx - ruleW / 2, ruleY - ruleT / 2, ruleW / 2 - gap, ruleT) + rect(cx + gap, ruleY - ruleT / 2, ruleW / 2 - gap, ruleT) + lozenge(cx, ruleY, lz);
    const body = [P(t.d, ink), P(rule, acc)].join('\n');
    return { minX: t.minX - PAD, minY: t.minY - PAD, w: t.maxX - t.minX + 2 * PAD, h: ruleY + lz - t.minY + 2 * PAD, body };
  };
  const mark = (ink, accO) => {
    const acc = accO || ACC_A;
    const t = run(font, 'T', SIZE, 0);
    const cx = (t.minX + t.maxX) / 2, lzY = t.maxY + 16, lz = 6;
    const body = [P(t.d, ink), P(lozenge(cx, lzY, lz), acc)].join('\n');
    return { minX: t.minX - PAD, minY: t.minY - PAD, w: t.maxX - t.minX + 2 * PAD, h: lzY + lz - t.minY + 2 * PAD, body };
  };
  const favicon = () => {
    const t0 = run(font, 'T', 52, 0);
    const w = t0.maxX - t0.minX, h = t0.maxY - t0.minY;
    const ox = 32 - w / 2 - t0.minX, oy = 28 + h / 2 - t0.maxY; // ligeramente arriba del centro
    const t = run(font, 'T', 52, 0, ox, oy);
    return [P(roundedRect(0, 0, 64, 64, 12), BG_GRAPHITE), P(t.d, '#FFFFFF'), P(lozenge(32, t.maxY + 8, 3.6), ACC_A)].join('\n');
  };
  emitSet(path.join(OUT, 'a'), { logo, mark, favicon });
})();

// =====================================================================
// B — Outfit geométrica + "O" cuentarrevoluciones, rojo apagado
// =====================================================================
const ACC_B = '#B23A40';
(function proposalB() {
  console.log('B');
  const font = fk.openSync(path.join(FONTS, 'Outfit.ttf')).getVariation({ wght: 700 });
  const SIZE = 100, TRACK = 0.05, PAD = 24;
  // métricas de la O real para igualar tamaño y grosor
  const O = run(font, 'O', SIZE, 0);
  const oH = O.maxY - O.minY, R = oH / 2, T = 15.5; // grosor ≈ asta de la T en wght 700
  const gauge = (cx, cy, scale, ink, acc) => {
    const Rs = R * scale, Ts = T * scale;
    const ring = annulus(cx, cy, Rs, Ts, 135, 45);           // abierto abajo, 270°
    const nd = needle(cx, cy, -58, Rs - Ts - 3 * scale, 7.5 * scale, 5 * scale); // aguja hacia la zona roja
    return [P(ring, ink), P(nd, acc)].join('\n');
  };
  const logo = (ink, accO) => {
    const acc = accO || ACC_B;
    const t = run(font, 'TOT AUT', SIZE, TRACK);
    const lsbO = O.minX; // margen izquierdo de la O real
    const cx = t.end + TRACK * SIZE + lsbO + R, cy = (O.minY + O.maxY) / 2;
    const body = [P(t.d, ink), gauge(cx, cy, 1, ink, acc)].join('\n');
    const maxX = cx + R;
    return { minX: t.minX - PAD, minY: Math.min(t.minY, cy - R) - PAD, w: maxX - t.minX + 2 * PAD, h: Math.max(t.maxY, cy + R) - Math.min(t.minY, cy - R) + 2 * PAD, body };
  };
  const mark = (ink, accO) => {
    const acc = accO || ACC_B;
    const body = gauge(50, 50, 1.2, ink, acc);
    return { minX: 0, minY: 0, w: 100, h: 100, body };
  };
  const favicon = () => [P(roundedRect(0, 0, 64, 64, 12), BG_GRAPHITE), gauge(32, 32.5, 0.64, '#FFFFFF', ACC_B)].join('\n');
  emitSet(path.join(OUT, 'b'), { logo, mark, favicon });
})();

// =====================================================================
// C — Monograma TA + Jost, plata fría
// =====================================================================
const ACC_C = '#B5BEC8';
(function proposalC() {
  console.log('C');
  const font = fk.openSync(path.join(FONTS, 'Jost.ttf')).getVariation({ wght: 500 });
  const SIZE = 100, TRACK = 0.30, PAD = 24;
  // monograma en caja 100×100: barra (T), asta central, dos diagonales (A) que nacen bajo la barra
  const mono = (x, y, s, ink, acc) => {
    const S = v => v * s;
    const W = 14; // grosor
    const bar = rect(x, y, S(100), S(W));
    const stem = rect(x + S(50 - W / 2), y + S(W), S(W), S(100 - W));
    const dl = diag(x + S(50), y + S(W / 2), x + S(W / 2 + 0.5), y + S(100), S(W), y + S(W), y + S(100));
    const dr = diag(x + S(50), y + S(W / 2), x + S(100 - W / 2 - 0.5), y + S(100), S(W), y + S(W), y + S(100));
    return [P(stem + dl + dr, ink), P(bar, acc)].join('\n');
  };
  const logo = (ink, accO) => {
    const acc = accO || ACC_C;
    const probe = run(font, 'TOT AUTO', SIZE, TRACK);
    const capH = probe.maxY - probe.minY; // altura de versales
    const mSize = capH * 1.42, gapX = 44;
    const x0 = 0, yTop = probe.minY - (mSize - capH) / 2;
    const t = run(font, 'TOT AUTO', SIZE, TRACK, x0 + mSize + gapX - probe.minX, 0);
    const body = [mono(x0, yTop, mSize / 100, ink, acc), P(t.d, ink)].join('\n');
    return { minX: x0 - PAD, minY: yTop - PAD, w: t.maxX - x0 + 2 * PAD, h: mSize + 2 * PAD, body };
  };
  const mark = (ink, accO) => ({ minX: 0, minY: 0, w: 100, h: 100, body: mono(10, 10, 0.8, ink, accO || ACC_C) });
  const favicon = () => [P(roundedRect(0, 0, 64, 64, 12), BG_GRAPHITE), mono(14, 14, 0.36, '#FFFFFF', ACC_C)].join('\n');
  emitSet(path.join(OUT, 'c'), { logo, mark, favicon });
})();
