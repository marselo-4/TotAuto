#!/usr/bin/env python3
"""
Genera las propuestas de wordmark D, E y F de Tot Auto en Archivo (fuente variable) como SVG con el
texto convertido a trazados: sin <text>, sin stroke, sin transformaciones; solo <path> rellenos.

Uso:  python3 gen-wordmark.py <carpeta con Archivo[wdth,wght].ttf y Archivo-Italic[wdth,wght].ttf> <public/brand/propuestas>
Dependencias (en un entorno temporal, no en el repo): fonttools, brotli, uharfbuzz.
Las fuentes se descargan del repo google/fonts (ofl/archivo).
"""
import io
import sys
from pathlib import Path

import uharfbuzz as hb
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

FONT_DIR = Path(sys.argv[1])
OUT = Path(sys.argv[2])

INK_DARK = "#F4F2EE"   # tinta sobre grafito
INK_LIGHT = "#141416"  # tinta sobre blanco
ACCENT = "#C9A96E"     # champán
FAV_BG = "#1B1C1F"


def ntos(v: float) -> str:
    s = f"{v:.1f}"
    return s.rstrip("0").rstrip(".") if "." in s else s


class Face:
    """Instancia estática de Archivo a una anchura y peso dados, con shaping de HarfBuzz (kerning)."""

    def __init__(self, file: str, wdth: float, wght: float):
        self.font = instancer.instantiateVariableFont(TTFont(FONT_DIR / file), {"wdth": wdth, "wght": wght})
        buf = io.BytesIO()
        self.font.save(buf)
        self.hb = hb.Font(hb.Face(hb.Blob(buf.getvalue())))
        self.glyph_set = self.font.getGlyphSet()
        self.order = self.font.getGlyphOrder()
        self.cap = self.font["OS/2"].sCapHeight

    def shape(self, text: str, tracking: float = 0):
        b = hb.Buffer()
        b.add_str(text)
        b.guess_segment_properties()
        hb.shape(self.hb, b, {"kern": True, "liga": True})
        glyphs, x = [], 0.0
        for info, pos in zip(b.glyph_infos, b.glyph_positions):
            glyphs.append((self.order[info.codepoint], x + pos.x_offset, pos.y_offset))
            x += pos.x_advance + tracking
        return glyphs, x - tracking

    def paths(self, text: str, x0: float, tracking: float = 0):
        """Lista de (pathdata, bounds) de cada glifo, en coordenadas SVG (y hacia abajo), a partir de x0."""
        glyphs, width = self.shape(text, tracking)
        out = []
        for name, gx, gy in glyphs:
            g = self.glyph_set[name]
            t = (1, 0, 0, -1, x0 + gx, -gy)
            sp = SVGPathPen(self.glyph_set, ntos=ntos)
            g.draw(TransformPen(sp, t))
            bp = BoundsPen(self.glyph_set)
            g.draw(TransformPen(bp, t))
            d = sp.getCommands()
            if d:
                out.append((d, bp.bounds))
        return out, width


def poly(points):
    """Polígono en coordenadas y-arriba (unidades de fuente) → path SVG (y hacia abajo)."""
    d = "M" + "L".join(f"{ntos(x)} {ntos(-y)}" for x, y in points) + "Z"
    xs = [p[0] for p in points]
    ys = [-p[1] for p in points]
    return d, (min(xs), min(ys), max(xs), max(ys))


def union_bounds(items):
    bs = [b for _, _, b in items if b]
    return (min(b[0] for b in bs), min(b[1] for b in bs), max(b[2] for b in bs), max(b[3] for b in bs))


def svg(items, label, pad=24, fixed_box=None):
    """items: lista de (rol, pathdata, bounds). rol ∈ {ink, accent}. Devuelve función que colorea."""
    x0, y0, x1, y1 = fixed_box or union_bounds(items)
    if not fixed_box:
        x0, y0, x1, y1 = x0 - pad, y0 - pad, x1 + pad, y1 + pad
    w, h = x1 - x0, y1 - y0

    def render(ink, accent, extra=""):
        parts = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{ntos(x0)} {ntos(y0)} {ntos(w)} {ntos(h)}" role="img" aria-label="{label}">',
                 f"  <title>{label}</title>"]
        if extra:
            parts.append(extra)
        for role, d, _ in items:
            parts.append(f'  <path fill="{accent if role == "accent" else ink}" d="{d}"/>')
        parts.append("</svg>\n")
        return "\n".join(parts)

    return render, (w, h)


def write_set(folder: Path, logo_items, mark_items, label):
    folder.mkdir(parents=True, exist_ok=True)
    render, (w, h) = svg(logo_items, label)
    (folder / "logo.svg").write_text(render(INK_DARK, ACCENT))
    (folder / "logo-on-white.svg").write_text(render(INK_LIGHT, ACCENT))
    (folder / "logo-mono-white.svg").write_text(render(INK_DARK, INK_DARK))
    (folder / "logo-mono-black.svg").write_text(render(INK_LIGHT, INK_LIGHT))
    mrender, (mw, mh) = svg(mark_items, f"{label} — símbolo", pad=40)
    (folder / "mark.svg").write_text(mrender(INK_DARK, ACCENT))
    (folder / "mark-mono-white.svg").write_text(mrender(INK_DARK, INK_DARK))
    (folder / "mark-mono-black.svg").write_text(mrender(INK_LIGHT, INK_LIGHT))
    # Favicon 64×64: fondo grafito redondeado + símbolo escalado a 40 px de lado mayor, centrado
    bx0, by0, bx1, by1 = union_bounds(mark_items)
    bw, bh = bx1 - bx0, by1 - by0
    s = 40 / max(bw, bh)
    tx, ty = 32 - (bx0 + bw / 2) * s, 32 - (by0 + bh / 2) * s
    fav_items = []
    for role, d, b in mark_items:
        fav_items.append((role, scale_path(d, s, tx, ty), (b[0] * s + tx, b[1] * s + ty, b[2] * s + tx, b[3] * s + ty)))
    frender, _ = svg(fav_items, label, fixed_box=(0, 0, 64, 64))
    bg = f'  <path fill="{FAV_BG}" d="M12 0H52A12 12 0 0 1 64 12V52A12 12 0 0 1 52 64H12A12 12 0 0 1 0 52V12A12 12 0 0 1 12 0Z"/>'
    (folder / "favicon.svg").write_text(frender("#FFFFFF", ACCENT, extra=bg))
    print(f"{folder.name}: logo viewBox {ntos(w)}×{ntos(h)} (ratio {w / h:.4f}), mark {ntos(mw)}×{ntos(mh)}")


def scale_path(d: str, s: float, tx: float, ty: float) -> str:
    """Escala y traslada un path SVG de comandos absolutos M/L/H/V/Q/C/Z (los que emite fontTools)."""
    import re
    out, cmd, i = [], "", 0
    for tok in re.findall(r"[MLHVQCZ]|-?\d*\.?\d+", d):
        if tok.isalpha():
            cmd, i = tok, 0
            out.append(tok)
        else:
            if cmd == "H":
                v = float(tok) * s + tx
            elif cmd == "V":
                v = float(tok) * s + ty
            else:
                v = float(tok) * s + (tx if i % 2 == 0 else ty)
            out.append((" " if i % 2 else "") + ntos(v))
            i += 1
    return "".join(out)


def glyph_items(role, paths):
    return [(role, d, b) for d, b in paths]


# ---------------------------------------------------------------- D · Expandida
def variant_d():
    face = Face("Archivo.ttf", wdth=125, wght=800)
    track = -14
    tot, w_tot = face.paths("TOT", 0, track)
    gap = 250                      # hueco entre palabras
    bar_w, slant = 78, 120         # barra champán inclinada (como una "/")
    bx = w_tot + (gap - bar_w - slant) / 2 + 10
    bar = poly([(bx, 0), (bx + bar_w, 0), (bx + bar_w + slant, face.cap), (bx + slant, face.cap)])
    auto, w_auto = face.paths("AUTO", w_tot + gap, track)
    logo = glyph_items("ink", tot) + [("accent",) + bar] + glyph_items("ink", auto)
    # símbolo: T + barra
    t, w_t = face.paths("T", 0, 0)
    mbx = w_t + 40
    mbar = poly([(mbx, 0), (mbx + bar_w, 0), (mbx + bar_w + slant, face.cap), (mbx + slant, face.cap)])
    mark = glyph_items("ink", t) + [("accent",) + mbar]
    return logo, mark


# ---------------------------------------------------------------- E · Itálica con línea de velocidad
def variant_e():
    face = Face("Archivo-Italic.ttf", wdth=118, wght=700)
    track = -10
    paths, w = face.paths("TOT AUTO", 0, track)
    x0 = min(b[0] for _, b in paths)
    x1 = max(b[2] for _, b in paths)
    # línea bajo la base: afilada a la izquierda, corte inclinado a la derecha (ángulo de la itálica)
    y_top, y_bot = -95, -165
    it = 0.19  # tan(≈11°)
    line = poly([(x0 + 40, (y_top + y_bot) / 2), (x1 - it * (-y_top) * 0 - 10, y_top), (x1 - 10 + it * (y_top - y_bot), y_bot)])
    logo = glyph_items("ink", paths) + [("accent",) + line]
    t, wt = face.paths("T", 0, 0)
    tx0 = min(b[0] for _, b in t)
    tx1 = max(b[2] for _, b in t)
    mline = poly([(tx0 + 10, (y_top + y_bot) / 2), (tx1 - 10, y_top), (tx1 - 10 + it * (y_top - y_bot), y_bot)])
    mark = glyph_items("ink", t) + [("accent",) + mline]
    return logo, mark


# ---------------------------------------------------------------- F · Técnica, espaciada, dos tonos
def variant_f():
    face = Face("Archivo.ttf", wdth=100, wght=600)
    track = 150
    tot, w_tot = face.paths("TOT", 0, track)
    gap = 2 * track + 90
    auto, w_auto = face.paths("AUTO", w_tot + gap, track)
    logo = glyph_items("ink", tot) + glyph_items("accent", auto)
    t, w_t = face.paths("T", 0, 0)
    a, _ = face.paths("A", w_t + 60, 0)
    mark = glyph_items("ink", t) + glyph_items("accent", a)
    return logo, mark


if __name__ == "__main__":
    for key, fn, label in (("d", variant_d, "Tot Auto"), ("e", variant_e, "Tot Auto"), ("f", variant_f, "Tot Auto")):
        logo, mark = fn()
        write_set(OUT / key, logo, mark, label)
