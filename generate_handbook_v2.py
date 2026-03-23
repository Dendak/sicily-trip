#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Sizilien-Handbuch 2026 – 60-Seiten A4 PDF Reisehandbuch
Generiert mit ReportLab
"""

import os
import sys
import tempfile
import shutil
from pathlib import Path
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, white, black, Color
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT, TA_JUSTIFY
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer,
    Table, TableStyle, Image as RLImage, PageBreak, KeepTogether,
    NextPageTemplate, Flowable
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from PIL import Image as PILImage

# ── Paths ──────────────────────────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent
PUBLIC = BASE_DIR / "public"
BILDER = BASE_DIR / "Bilder-Sizilien26"
OUTPUT_PDF = BASE_DIR / "Sizilien-Handbuch-2026-v2.pdf"

# ── Colors ─────────────────────────────────────────────────────────────
GOLD = HexColor("#B8860B")
DARK_BLUE = HexColor("#2C3E50")
CREAM = HexColor("#FDF5E6")
LIGHT_CREAM = HexColor("#FFFDF5")
LIGHT_GRAY = HexColor("#F0F0F0")
MEDIUM_GRAY = HexColor("#CCCCCC")
WHITE = white
BLACK = black

PAGE_W, PAGE_H = A4  # 595.27, 841.89 points
MARGIN_LR = 18 * mm
MARGIN_TB = 15 * mm
CONTENT_W = PAGE_W - 2 * MARGIN_LR
CONTENT_H = PAGE_H - 2 * MARGIN_TB


# ── Image helper ───────────────────────────────────────────────────────
def find_image(*candidates):
    """Try multiple paths, return first existing one or None."""
    for c in candidates:
        p = Path(c)
        if p.exists():
            return str(p)
    return None


TEMP_DIR = None  # Will be set at runtime

def ensure_temp_dir():
    global TEMP_DIR
    if TEMP_DIR is None:
        TEMP_DIR = Path(tempfile.mkdtemp(prefix="sicily_pdf_"))
    return TEMP_DIR

def cleanup_temp():
    global TEMP_DIR
    if TEMP_DIR and TEMP_DIR.exists():
        shutil.rmtree(TEMP_DIR, ignore_errors=True)
        TEMP_DIR = None

_img_cache = {}

def preprocess_image(path, max_pixels=1800):
    """Downscale and compress image to JPEG, return path to temp file. Cache results."""
    path = str(path)
    if path in _img_cache:
        return _img_cache[path]
    if not Path(path).exists():
        return path
    try:
        with PILImage.open(path) as im:
            # Convert to RGB if needed
            if im.mode in ('RGBA', 'P', 'LA'):
                bg = PILImage.new('RGB', im.size, (255, 255, 255))
                if im.mode == 'P':
                    im = im.convert('RGBA')
                bg.paste(im, mask=im.split()[-1] if 'A' in im.mode else None)
                im = bg
            elif im.mode != 'RGB':
                im = im.convert('RGB')
            # Downscale if too large
            w, h = im.size
            if max(w, h) > max_pixels:
                ratio = max_pixels / max(w, h)
                new_w = int(w * ratio)
                new_h = int(h * ratio)
                im = im.resize((new_w, new_h), PILImage.LANCZOS)
            # Save as compressed JPEG
            td = ensure_temp_dir()
            fname = Path(path).stem + "_opt.jpg"
            out = td / fname
            # Avoid name collisions
            counter = 0
            while out.exists():
                counter += 1
                out = td / f"{Path(path).stem}_opt{counter}.jpg"
            im.save(str(out), 'JPEG', quality=72, optimize=True)
            _img_cache[path] = str(out)
            return str(out)
    except Exception:
        _img_cache[path] = path
        return path


def invert_dark_image(path):
    """If image is mostly dark (white-on-black), invert it to black-on-white. Returns new path."""
    path = str(path)
    if not Path(path).exists():
        return path
    try:
        with PILImage.open(path) as im:
            im_rgb = im.convert('RGB')
            import random
            w, h = im_rgb.size
            samples = []
            for _ in range(2000):
                x = random.randint(0, w - 1)
                y = random.randint(0, h - 1)
                samples.append(im_rgb.getpixel((x, y)))
            avg_brightness = sum(sum(p) / 3 for p in samples) / len(samples)
            if avg_brightness < 80:  # Dark image - invert it
                from PIL import ImageOps
                inverted = ImageOps.invert(im_rgb)
                td = ensure_temp_dir()
                fname = Path(path).stem + "_inverted.jpg"
                out = td / fname
                counter = 0
                while out.exists():
                    counter += 1
                    out = td / f"{Path(path).stem}_inverted{counter}.jpg"
                inverted.save(str(out), 'JPEG', quality=90, optimize=True)
                return str(out)
    except Exception:
        pass
    return path


def get_image_size(path):
    """Return (width, height) in pixels, or None."""
    try:
        with PILImage.open(path) as im:
            return im.size
    except Exception:
        return None


def make_image(path, max_w=None, max_h=None):
    """Create an RLImage scaled proportionally. Returns None if file missing."""
    if path is None or not Path(path).exists():
        return None
    sz = get_image_size(path)
    if sz is None:
        return None
    w_px, h_px = sz
    if max_w is None:
        max_w = CONTENT_W
    if max_h is None:
        max_h = CONTENT_H - 20 * mm
    if w_px <= 0 or h_px <= 0:
        return None
    # Convert pixels to points at 72 dpi baseline, then scale to fit
    DPI = 72
    w_pt = w_px * 72.0 / DPI
    h_pt = h_px * 72.0 / DPI
    ratio = min(max_w / w_pt, max_h / h_pt, 1.0)
    rw = w_pt * ratio
    rh = h_pt * ratio
    try:
        return RLImage(path, width=rw, height=rh)
    except Exception:
        return None


def scaled_image(path, target_w):
    """Scale image to exact target_w, maintaining aspect ratio."""
    if path is None or not Path(path).exists():
        return None
    sz = get_image_size(path)
    if sz is None or sz[0] == 0:
        return None
    w_px, h_px = sz
    ratio = target_w / w_px
    rh = h_px * ratio
    # Cap height
    if rh > CONTENT_H - 30 * mm:
        rh = CONTENT_H - 30 * mm
        ratio = rh / h_px
        tw = w_px * ratio
    else:
        tw = target_w
    try:
        return RLImage(path, width=tw, height=rh)
    except Exception:
        return None


# ── Custom Flowables ───────────────────────────────────────────────────
class GoldBar(Flowable):
    """A full-width gold bar with white text."""
    def __init__(self, text, height=22, font_size=12):
        Flowable.__init__(self)
        self.text = text
        self.bar_height = height
        self.font_size = font_size
        self.width = CONTENT_W
        self.height = self.bar_height

    def draw(self):
        self.canv.setFillColor(GOLD)
        self.canv.roundRect(0, 0, self.width, self.bar_height, 3, fill=1, stroke=0)
        self.canv.setFillColor(WHITE)
        self.canv.setFont("Helvetica-Bold", self.font_size)
        self.canv.drawString(8, (self.bar_height - self.font_size) / 2 + 1, self.text)


class HLine(Flowable):
    """Horizontal line."""
    def __init__(self, width=None, color=GOLD, thickness=1):
        Flowable.__init__(self)
        self.line_width = width or CONTENT_W
        self.color = color
        self.thickness = thickness
        self.width = self.line_width
        self.height = self.thickness + 2

    def draw(self):
        self.canv.setStrokeColor(self.color)
        self.canv.setLineWidth(self.thickness)
        self.canv.line(0, 1, self.line_width, 1)


class ImageWithBorder(Flowable):
    """Image with thin gray border and optional caption."""
    def __init__(self, img_path, max_w=None, max_h=None, caption=None):
        Flowable.__init__(self)
        self.img_path = preprocess_image(img_path)
        self.max_w = max_w or CONTENT_W
        self.max_h = max_h or (200 * mm)
        self.caption = caption
        self._calc()

    def _calc(self):
        sz = get_image_size(self.img_path)
        if sz is None or sz[0] == 0:
            self.iw = 0
            self.ih = 0
            self.width = 0
            self.height = 0
            return
        w_px, h_px = sz
        aspect = h_px / w_px if w_px > 0 else 1.0
        # Scale to fill max_w, then cap height
        self.iw = self.max_w
        self.ih = self.iw * aspect
        if self.ih > self.max_h:
            self.ih = self.max_h
            self.iw = self.ih / aspect
        self.width = self.iw + 2
        cap_h = 12 if self.caption else 0
        self.height = self.ih + 2 + cap_h

    def draw(self):
        if self.iw <= 0:
            return
        # Border
        self.canv.setStrokeColor(MEDIUM_GRAY)
        self.canv.setLineWidth(0.5)
        cap_h = 12 if self.caption else 0
        self.canv.rect(0, cap_h, self.iw + 2, self.ih + 2, fill=0)
        # Image
        try:
            self.canv.drawImage(self.img_path, 1, cap_h + 1, self.iw, self.ih,
                                preserveAspectRatio=True, mask='auto')
        except Exception:
            pass
        # Caption
        if self.caption:
            self.canv.setFont("Helvetica-Oblique", 7.5)
            self.canv.setFillColor(HexColor("#555555"))
            self.canv.drawString(2, 1, self.caption[:80])


# ── Styles ─────────────────────────────────────────────────────────────
def create_styles():
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(
        'Title1', fontName='Helvetica-Bold', fontSize=18, leading=22,
        textColor=DARK_BLUE, spaceAfter=6, spaceBefore=4, alignment=TA_LEFT
    ))
    styles.add(ParagraphStyle(
        'Title2', fontName='Helvetica-Bold', fontSize=14, leading=17,
        textColor=DARK_BLUE, spaceAfter=4, spaceBefore=8, alignment=TA_LEFT
    ))
    styles.add(ParagraphStyle(
        'Title3', fontName='Helvetica-Bold', fontSize=11, leading=14,
        textColor=DARK_BLUE, spaceAfter=3, spaceBefore=6, alignment=TA_LEFT
    ))
    styles.add(ParagraphStyle(
        'BodyText9', fontName='Helvetica', fontSize=9.5, leading=12,
        textColor=BLACK, spaceAfter=3, spaceBefore=0, alignment=TA_JUSTIFY
    ))
    styles.add(ParagraphStyle(
        'BodySmall', fontName='Helvetica', fontSize=8.5, leading=11,
        textColor=BLACK, spaceAfter=2, spaceBefore=0, alignment=TA_JUSTIFY
    ))
    styles.add(ParagraphStyle(
        'Italic9', fontName='Helvetica-Oblique', fontSize=9, leading=11.5,
        textColor=HexColor("#333333"), spaceAfter=3, spaceBefore=0, alignment=TA_JUSTIFY
    ))
    styles.add(ParagraphStyle(
        'Caption', fontName='Helvetica-Oblique', fontSize=8, leading=10,
        textColor=HexColor("#555555"), spaceAfter=2, spaceBefore=1, alignment=TA_LEFT
    ))
    styles.add(ParagraphStyle(
        'TableCell', fontName='Helvetica', fontSize=8.5, leading=10.5,
        textColor=BLACK, spaceAfter=0, spaceBefore=0
    ))
    styles.add(ParagraphStyle(
        'TableHeader', fontName='Helvetica-Bold', fontSize=8.5, leading=10.5,
        textColor=WHITE, spaceAfter=0, spaceBefore=0
    ))
    styles.add(ParagraphStyle(
        'CenterText', fontName='Helvetica', fontSize=9.5, leading=12,
        textColor=BLACK, spaceAfter=3, spaceBefore=0, alignment=TA_CENTER
    ))
    styles.add(ParagraphStyle(
        'DayRoute', fontName='Helvetica', fontSize=9, leading=11.5,
        textColor=BLACK, spaceAfter=6, spaceBefore=0, alignment=TA_JUSTIFY,
        leftIndent=6
    ))
    styles.add(ParagraphStyle(
        'PersonEntry', fontName='Helvetica', fontSize=8.5, leading=11,
        textColor=BLACK, spaceAfter=1, spaceBefore=0
    ))
    styles.add(ParagraphStyle(
        'GlossarEntry', fontName='Helvetica', fontSize=8, leading=10,
        textColor=BLACK, spaceAfter=0, spaceBefore=0
    ))
    return styles


# ── Page number callback ───────────────────────────────────────────────
class HandbuchDocTemplate(BaseDocTemplate):
    def __init__(self, filename, **kwargs):
        BaseDocTemplate.__init__(self, filename, **kwargs)
        self.page_count_offset = 0  # cover is page 1

    def afterPage(self):
        pass


def page_footer(canvas_obj, doc):
    """Add page number (skip cover page)."""
    page_num = canvas_obj.getPageNumber()
    if page_num > 1:  # skip cover
        canvas_obj.saveState()
        canvas_obj.setFont("Helvetica", 8)
        canvas_obj.setFillColor(HexColor("#888888"))
        canvas_obj.drawCentredString(PAGE_W / 2, 10 * mm, str(page_num))
        canvas_obj.restoreState()


def page_footer_blank(canvas_obj, doc):
    """No page number."""
    pass


# ── Helper to create image+caption blocks ──────────────────────────────
MIN_SINGLE_IMAGE_W = 160 * mm  # 454pt - minimum width for a standalone image

def img_block(path, caption=None, max_w=None, max_h=None):
    """Return list of flowables for an image with border and caption, or empty list.
    Enforces minimum width for standalone images to avoid tiny images on empty pages."""
    if path is None or not Path(path).exists():
        return []
    mw = max_w or CONTENT_W
    # Enforce minimum width for standalone images
    if mw < MIN_SINGLE_IMAGE_W:
        mw = min(CONTENT_W, MIN_SINGLE_IMAGE_W)
    mh = max_h or (200 * mm)
    ib = ImageWithBorder(str(path), max_w=mw, max_h=mh, caption=caption)
    if ib.iw <= 0:
        return []
    return [ib, Spacer(1, 3)]


def img_pair(path1, cap1, path2, cap2, each_w=None):
    """Two images side by side in a table."""
    ew = each_w or (CONTENT_W / 2 - 5)
    items1 = img_block(path1, cap1, max_w=ew, max_h=120 * mm)
    items2 = img_block(path2, cap2, max_w=ew, max_h=120 * mm)
    if not items1 and not items2:
        return []
    c1 = items1 if items1 else [Spacer(1, 1)]
    c2 = items2 if items2 else [Spacer(1, 1)]
    t = Table([[c1, c2]], colWidths=[CONTENT_W / 2, CONTENT_W / 2])
    t.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 2),
        ('TOPPADDING', (0, 0), (-1, -1), 0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
    ]))
    return [t, Spacer(1, 4)]


def img_triple(paths_caps, each_w=None):
    """Three images side by side."""
    ew = each_w or (CONTENT_W / 3 - 6)
    cols = []
    for p, c in paths_caps:
        items = img_block(p, c, max_w=ew, max_h=120 * mm)
        cols.append(items if items else [Spacer(1, 1)])
    while len(cols) < 3:
        cols.append([Spacer(1, 1)])
    cw = CONTENT_W / 3
    t = Table([cols], colWidths=[cw, cw, cw])
    t.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 2),
        ('TOPPADDING', (0, 0), (-1, -1), 0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
    ]))
    return [t, Spacer(1, 4)]


# ── Table helpers ──────────────────────────────────────────────────────
def styled_table(data, col_widths=None, header=True):
    """Create a nicely styled table with header row and alternating cream rows."""
    t = Table(data, colWidths=col_widths, repeatRows=1 if header else 0)
    style_cmds = [
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 8.5),
        ('LEADING', (0, 0), (-1, -1), 11),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 4),
        ('RIGHTPADDING', (0, 0), (-1, -1), 4),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ('GRID', (0, 0), (-1, -1), 0.5, MEDIUM_GRAY),
    ]
    if header:
        style_cmds += [
            ('BACKGROUND', (0, 0), (-1, 0), DARK_BLUE),
            ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ]
        # Alternating rows
        for i in range(1, len(data)):
            if i % 2 == 0:
                style_cmds.append(('BACKGROUND', (0, i), (-1, i), CREAM))
    t.setStyle(TableStyle(style_cmds))
    return t


# ── COVER PAGE ─────────────────────────────────────────────────────────
class CoverPage(Flowable):
    def __init__(self, img_path):
        Flowable.__init__(self)
        self.img_path = preprocess_image(img_path) if img_path else None
        self.width = PAGE_W
        self.height = PAGE_H

    def draw(self):
        c = self.canv
        # Full bleed image
        if self.img_path and Path(self.img_path).exists():
            try:
                c.drawImage(self.img_path, 0, 0, PAGE_W, PAGE_H,
                            preserveAspectRatio=True, anchor='c', mask='auto')
            except Exception:
                pass
        # Dark overlay
        c.setFillColor(Color(0, 0, 0, alpha=0.45))
        c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
        # Gold accent lines
        c.setStrokeColor(GOLD)
        c.setLineWidth(2)
        c.line(PAGE_W * 0.2, PAGE_H * 0.72, PAGE_W * 0.8, PAGE_H * 0.72)
        c.line(PAGE_W * 0.2, PAGE_H * 0.42, PAGE_W * 0.8, PAGE_H * 0.42)
        # Text
        c.setFillColor(WHITE)
        c.setFont("Helvetica", 14)
        c.drawCentredString(PAGE_W / 2, PAGE_H * 0.68, "STUDIENREISE")
        c.setFont("Helvetica-Oblique", 13)
        c.drawCentredString(PAGE_W / 2, PAGE_H * 0.64, "zu den klassischen Stätten in")
        c.setFont("Helvetica-Bold", 52)
        c.drawCentredString(PAGE_W / 2, PAGE_H * 0.52, "SIZILIEN")
        c.setFont("Helvetica", 16)
        c.drawCentredString(PAGE_W / 2, PAGE_H * 0.45, "28. März – 4. April 2026")
        # Bottom
        c.setFont("Helvetica", 10)
        c.drawCentredString(PAGE_W / 2, PAGE_H * 0.08,
                            "PG Herz-Jesu-Missionare Liefering · Dr. Paul Dienstbier")
        # Small gold ornament
        c.setStrokeColor(GOLD)
        c.setLineWidth(0.5)
        cx = PAGE_W / 2
        c.line(cx - 30, PAGE_H * 0.06, cx + 30, PAGE_H * 0.06)


# ══════════════════════════════════════════════════════════════════════
# MAIN BUILD
# ══════════════════════════════════════════════════════════════════════
def build_handbook():
    S = create_styles()

    # ── Document setup ─────────────────────────────────────────────────
    frame_normal = Frame(MARGIN_LR, MARGIN_TB, CONTENT_W, CONTENT_H,
                         id='normal', topPadding=0, bottomPadding=0)
    frame_full = Frame(0, 0, PAGE_W, PAGE_H, id='full',
                       topPadding=0, bottomPadding=0,
                       leftPadding=0, rightPadding=0)

    doc = HandbuchDocTemplate(
        str(OUTPUT_PDF),
        pagesize=A4,
        leftMargin=MARGIN_LR, rightMargin=MARGIN_LR,
        topMargin=MARGIN_TB, bottomMargin=MARGIN_TB,
        title="Sizilien-Handbuch 2026",
        author="Dr. Paul Dienstbier",
    )

    cover_template = PageTemplate(id='cover', frames=[frame_full],
                                  onPage=page_footer_blank)
    normal_template = PageTemplate(id='normal', frames=[frame_normal],
                                   onPage=page_footer)
    blank_template = PageTemplate(id='blank', frames=[frame_normal],
                                  onPage=page_footer_blank)
    back_template = PageTemplate(id='back', frames=[frame_full],
                                 onPage=page_footer_blank)

    doc.addPageTemplates([cover_template, normal_template, blank_template, back_template])

    story = []

    # Helper shortcuts
    def sp(h=3):
        return Spacer(1, h)

    def title1(text):
        return Paragraph(text, S['Title1'])

    def title2(text):
        return Paragraph(text, S['Title2'])

    def title3(text):
        return Paragraph(text, S['Title3'])

    def body(text):
        return Paragraph(text, S['BodyText9'])

    def body_sm(text):
        return Paragraph(text, S['BodySmall'])

    def italic(text):
        return Paragraph(text, S['Italic9'])

    def center(text):
        return Paragraph(text, S['CenterText'])

    def pb():
        return PageBreak()

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # PAGE 1: COVER
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    cover_img = find_image(PUBLIC / "1-SA-Titel-Segesta.jpg")
    story.append(CoverPage(cover_img))
    story.append(NextPageTemplate('blank'))
    story.append(pb())

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # PAGE 2: BLANK (inside front cover)
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    story.append(sp(20))
    story.append(HLine(CONTENT_W * 0.4, GOLD, 0.5))
    story.append(sp(CONTENT_H - 40))
    story.append(NextPageTemplate('normal'))
    story.append(pb())

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # PAGE 3: EXKURSIONSÜBERSICHT
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    story.append(title1("Exkursion nach Sizilien · 28.3. – 4.4.2026"))
    story.append(sp(2))
    story.append(italic("Besichtigungsprogramm (archäologische Stätten, Ausgrabungen, Kirchen, Museen)"))
    story.append(sp(4))

    # Categories table
    cat_data = [
        ["Kategorie", "Stätten"],
        ["Antike Stadtanlagen", "Akrai, Solunto, Taormina, Tindari"],
        ["Griechische Tempelanlagen", "Agrigento, Segesta, Selinunte, Syrakus"],
        ["Museen", "Gela, Nationalmuseum Palermo"],
        ["Naturerlebnisse", "Ätna, Alcantara-Schlucht, Scala dei Turchi, Salzstraße"],
        ["Normannische Zentren", "Cefalù, Monreale, Palermo"],
        ["Römische Mosaiken", "Piazza Armerina"],
        ["Städte", "Catania, Noto, Palermo, Syrakus"],
        ["Theater", "Akrai, Segesta, Taormina"],
    ]
    story.append(styled_table(cat_data, col_widths=[55 * mm, CONTENT_W - 55 * mm]))
    story.append(sp(6))

    # Route table
    story.append(title3("Reiseroute"))
    route_data = [
        ["Tag", "Route", "km", "Übernachtung"],
        ["1 (Sa 28.3.)", "Flughafen–Segesta–Érice–Trapani–H", "145", "Marsala"],
        ["2 (So 29.3.)", "H–Cave di Cusa–Selinunte–Agrigento–H", "160", "Agrigento"],
        ["3 (Mo 30.3.)", "H–Gela–Piazza Armerina–Akrai–Noto–H", "330", "Siracusa"],
        ["4 (Di 31.3.)", "H–Siracusa–Castello Eurialo–Catania–H", "120", "Taormina"],
        ["5 (Mi 1.4.)", "H–Ätna–Alcantara-Schlucht–Taormina–H", "170", "Taormina"],
        ["6 (Do 2.4.)", "H–Milazzo–Äol. Inseln/Tindari–Cefalù–Solunto–H", "295", "Palermo"],
        ["7 (Fr 3.4.)", "H–Palermo–Monreale–Monte Pellegrino–H", "55", "Palermo"],
        ["8 (Sa 4.4.)", "H–Palermo–Flughafen", "40", "–"],
        ["GESAMT", "", "1.315", ""],
    ]
    rt = styled_table(route_data, col_widths=[28 * mm, 80 * mm, 16 * mm, CONTENT_W - 124 * mm])
    story.append(rt)
    story.append(sp(4))

    # Sicily map - full width
    map_path = find_image(PUBLIC / "detail-Sizilienkarte.jpg")
    if map_path:
        story.extend(img_block(map_path, "Übersichtskarte Sizilien", max_w=CONTENT_W, max_h=120 * mm))

    story.append(pb())

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # PAGE 4: TEILNEHMER & HOTELS
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    story.append(title1("Liste der Reiseteilnehmer"))
    story.append(sp(3))

    participants = [
        "Dr. Paul DIENSTBIER (Reiseleitung)", "AUER Rupert", "AUER-CRISENAZ Irene",
        "GASSER Katharina", "HASIWEDER Wolfgang", "HEIM Ute", "LANG Birgit",
        "ROTHSCHÖDL Burgi", "SCHARF Elfriede", "SCHILLER-DIENSTBIER Isabella",
        "SCHRAML Isa", "STEINBICHLER Eva-Maria", "STEINBICHLER Walter",
        "STEINHAUSER Traude", "STOCKINGER Bernd", "STOCKINGER Veronika"
    ]
    # 2-column layout
    half = (len(participants) + 1) // 2
    col1 = [f"{i+1}. {participants[i]}" for i in range(half)]
    col2 = [f"{i+1+half}. {participants[i+half]}" for i in range(len(participants) - half)]
    rows = []
    for i in range(max(len(col1), len(col2))):
        c1 = Paragraph(col1[i] if i < len(col1) else "", S['PersonEntry'])
        c2 = Paragraph(col2[i] if i < len(col2) else "", S['PersonEntry'])
        rows.append([c1, c2])
    pt = Table(rows, colWidths=[CONTENT_W / 2, CONTENT_W / 2])
    pt.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 4),
        ('TOPPADDING', (0, 0), (-1, -1), 1),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 1),
    ]))
    story.append(pt)
    story.append(sp(8))

    # Hotels
    story.append(title2("Hotels"))
    story.append(sp(2))
    hotel_data = [
        ["Datum", "Hotel", "Adresse", "Telefon"],
        ["28.–29.3.", "Hotel Carmine", "Piazza Carmine 16, 91025 Marsala (TP)", "+39 0923 711907"],
        ["29.–30.3.", "Oneira Rooms", "Via Dinoloco 2, 92100 Agrigento", "+39 320 834 3342"],
        ["30.–31.3.", "Hotel I Santi Coronati", "Via dei Santi Coronati 18, 96100 Ortigia/Siracusa", "+39 0931 090093"],
        ["31.3.–2.4.", "Hotel Ariston", "Via Bagnoli Croci 168, 98039 Taormina (ME)", "+39 0942 643131"],
        ["2.4.–4.4.", "Hotel Posta", "Via Antonio Gagini 77, 90133 Palermo", "+39 091 587338"],
    ]
    ht = styled_table(hotel_data, col_widths=[22 * mm, 38 * mm, 68 * mm, CONTENT_W - 128 * mm])
    story.append(ht)
    story.append(pb())

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # PAGE 5: REISEROUTE (text)
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    story.append(title1("Reiseroute"))
    story.append(sp(2))
    story.append(italic("Die hier angeführte Route gibt in Kursivschrift die jeweils geplanten "
                        "Besichtigungsstätten an. Abweichungen sind grundsätzlich möglich und "
                        "gegebenenfalls nötig."))
    story.append(sp(4))

    days_route = [
        ("1. Tag, Samstag, 28. März",
         "Salzburg – München – Flug mit der Lufthansa nach Palermo – "
         "<i>Segesta: dorischer Tempel und Teatro Greco</i> (55 km) – "
         "<i>Monte Érice: Altstadt</i> (45 km) – "
         "<i>Trapani: Altstadt</i> (15 km) – entlang der <i>Salzstraße</i> nach "
         "<i>Marsala: Altstadt, archäologisches Museum</i> (30 km) – "
         "Marsala [N/F im Hotel Carmine]"),
        ("2. Tag, Sonntag, 29. März",
         "Marsala – <i>Cave di Cusa: antiker Steinbruch</i> (40 km) – "
         "<i>Selinunte: griechischer Tempelbezirk, Akropolis</i> (15 km) – "
         "<i>Scala dei Turchi: Naturmonument</i> (85 km) – "
         "<i>Porto Empedocle: Mole</i> (5 km) – "
         "<i>Agrigento: Demetertempel, Zeusheiligtum, archäologisches Museum, Altstadt</i> (10 km) – "
         "Agrigento [N/F im Hotel Oneira Rooms]"),
        ("3. Tag, Montag, 30. März",
         "Agrigento – <i>Gela: archäologisches Museum</i> (80 km) – "
         "<i>Piazza Armerina: Villa Romana, spätrömische Mosaiken</i> (50 km) – "
         "<i>Akrai: Theater, Aphroditetempel</i> (110 km) – "
         "<i>Villa Romana del Tellaro</i> (40 km) – "
         "<i>Noto: Barockstadt</i> (10 km) – "
         "Siracusa [N/F im Hotel I Santi Coronati]"),
        ("4. Tag, Dienstag, 31. März",
         "Siracusa – <i>Syrakus: Altstadt mit Dom; Arethusa-Quelle, Halbinsel Ortigia, "
         "archäologischer Park, u.a. «Ohr des Dionysios», Grab des Archimedes, "
         "archäologisches Museum</i> – "
         "<i>Castello Eurialo: griechisches Kastell</i> (10 km) – "
         "<i>Catania: Dom, Elefantenbrunnen, Teatro Romano</i> (60 km) – "
         "Taormina [N/F im Hotel Ariston]"),
        ("5. Tag, Mittwoch, 1. April",
         "Taormina – <i>Ätna: Auffahrt bis in 1900 m Höhe und ev. Umrundung</i> (55 km) – "
         "<i>Alcantara-Schlucht</i> (85 km) – "
         "<i>Taormina: Teatro Greco und Altstadt</i> (30 km) – "
         "Taormina [N/F im Hotel Ariston]"),
        ("6. Tag, Donnerstag, 2. April",
         "Taormina – Messina – <i>Milazzo: ggf. Einschiffung auf eine der äolischen Inseln</i> (70 km) – "
         "[oder: <i>Tindari: Teatro Greco, Basilika, Casa Romana, Stadtmauern, "
         "Wallfahrtskirche</i> (40 km)] – "
         "<i>Cefalù: normannische Kathedrale San Salvatore</i> (110 km) – "
         "<i>Solunto: hellenistisch-römische Stadt</i> (55 km) – "
         "Palermo [N/F im Hotel Posta]"),
        ("7. Tag, Freitag, 3. April",
         "Palermo – <i>Palermo: Altstadt mit Normannenpalast und Hofkapelle, Normannendom, "
         "Kreuzkuppelkirche La Martorana, archäologisches Museum</i> – "
         "<i>Monreale: normannische Kathedrale mit Kreuzgang</i> (15 km) – "
         "<i>Monte Pellegrino: Wallfahrtsort, «das schönste Vorgebirge der Welt»</i> (25 km) – "
         "Palermo [N/F im Hotel Posta]"),
        ("8. Tag, Samstag, 4. April",
         "Palermo – <i>Palermo: Altstadtrundgang</i> – "
         "Flughafen Palermo (40 km) – München – Salzburg"),
    ]
    for day_title, day_text in days_route:
        story.append(Paragraph(f"<b>{day_title}</b>", S['BodyText9']))
        story.append(Paragraph(day_text, S['DayRoute']))
        story.append(sp(2))

    story.append(pb())

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # PAGE 6: REGION SIZILIEN
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    story.append(title1("Daten zur Region Sizilien"))
    story.append(sp(4))

    facts = [
        ("Fläche", "25.832 km² (= 8,5% Italiens, größte Insel des Mittelmeers)"),
        ("Einwohner", "4,84 Mio. (ISTAT 2024 – rückläufig seit 2001)"),
        ("Bevölkerungsdichte", "187 Einw./km² (unter dem ital. Durchschnitt von 198)"),
        ("Hauptstadt", "Palermo (ca. 630.000 Einwohner)"),
        ("9 Provinzen", "PA, AG, CL, CT, EN, ME, RG, SR, TP"),
        ("Höchster Punkt", "Ätna 3.357 m (aktivster Vulkan Europas)"),
        ("Küstenlänge", "1.484 km"),
        ("Entfernung zu Afrika", "140 km (Cap Bon, Tunesien)"),
        ("Sonnenstunden", "2.600/Jahr"),
        ("Ø Jahrestemperatur", "18,5°C"),
        ("BIP", "ca. 99 Mrd. € (2023)"),
        ("Arbeitslosigkeit", "15,8%"),
        ("UNESCO-Stätten", "7 (u.a. Agrigento, Syrakus, Ätna, Noto, Monreale)"),
        ("Tourismus", "15,2 Mio. Ankünfte 2023/24"),
    ]
    # Split into 2 columns
    half_f = (len(facts) + 1) // 2
    col1_facts = facts[:half_f]
    col2_facts = facts[half_f:]
    rows_f = []
    for i in range(max(len(col1_facts), len(col2_facts))):
        c1 = ""
        c2 = ""
        if i < len(col1_facts):
            c1 = f"<b>{col1_facts[i][0]}:</b> {col1_facts[i][1]}"
        if i < len(col2_facts):
            c2 = f"<b>{col2_facts[i][0]}:</b> {col2_facts[i][1]}"
        rows_f.append([Paragraph(c1, S['BodySmall']), Paragraph(c2, S['BodySmall'])])
    ft = Table(rows_f, colWidths=[CONTENT_W / 2, CONTENT_W / 2])
    ft.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 4),
        ('TOPPADDING', (0, 0), (-1, -1), 2),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
        ('LINEBELOW', (0, 0), (-1, -1), 0.3, MEDIUM_GRAY),
    ]))
    story.append(ft)
    story.append(sp(6))

    # Map - full width
    map2 = find_image(PUBLIC / "detail-Sizilienkarte.jpg")
    if map2:
        story.extend(img_block(map2, "Sizilien – Übersichtskarte", max_w=CONTENT_W, max_h=100 * mm))

    story.append(pb())

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # PAGE 7: FLORA & FAUNA
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    story.append(title1("Zur Flora und Fauna Siziliens"))
    story.append(sp(4))

    story.append(title2("Flora"))
    story.append(sp(2))
    flora = [
        ("<b>Feigenkaktus</b> (<i>Opuntia ficus-indica</i>) – Wahrzeichen der sizilianischen Landschaft, "
         "aus Mexiko eingeführt, Früchte (Fichi d'India) werden im Herbst geerntet."),
        ("<b>Blutorange</b> (<i>Citrus sinensis</i>) – Anbau v.a. in der Ebene von Catania, "
         "Sizilien produziert 60% der italienischen Orangenernte."),
        ("<b>Papyrus</b> (<i>Cyperus papyrus</i>) – Am Fluss Ciane bei Syrakus, "
         "einziges natürliches Vorkommen in Europa."),
        ("<b>Zwergpalme</b> (<i>Chamaerops humilis</i>) – Einzige in Europa heimische Palmenart, "
         "häufig in den Naturschutzgebieten."),
        ("<b>Pistazie</b> (<i>Pistacia vera</i>) – Berühmt aus Bronte am Ätna, "
         "das «grüne Gold» Siziliens."),
        ("<b>Kapernstrauch</b> (<i>Capparis spinosa</i>) – Auf den Äolischen Inseln "
         "und auf Pantelleria kultiviert."),
        ("<b>Johannisbrotbaum</b> (<i>Ceratonia siliqua</i>) – Häufig im Südosten, "
         "Früchte dienen als Viehfutter und Rohstoff."),
        ("<b>Mandelbaum</b> (<i>Prunus dulcis</i>) – Blüte im Februar, "
         "Mandelfest in Agrigento."),
        ("<b>Ätna-Birke</b> (<i>Betula aetnensis</i>) – Endemisch, "
         "wächst bis 2.000 m Höhe am Ätna."),
    ]
    for f in flora:
        story.append(Paragraph(f, S['BodySmall']))
        story.append(sp(1))

    story.append(sp(4))
    story.append(title2("Fauna"))
    story.append(sp(2))
    story.append(title3("Meer"))
    sea = ("Roter Thunfisch (Mattanza-Tradition), Schwertfisch (Fang in der Straße von Messina), "
           "Unechte Karettschildkröte (Nistplätze an den Südküsten), "
           "Pottwal (Beobachtung vor den Äolischen Inseln), "
           "Großer Tümmler (häufig in Küstennähe).")
    story.append(body(sea))
    story.append(sp(3))
    story.append(title3("Land und Vögel"))
    land = ("Eleonorenfalke (brütet auf den Felseninseln), "
            "Rosaflamingo (überwintert in den Salinen von Trapani), "
            "Sizilianische Mauereidechse (Podarcis waglerianus, endemisch), "
            "Stachelschwein (nachtaktiv im Hinterland), "
            "Weißstorch (Durchzügler im Frühjahr und Herbst).")
    story.append(body(land))

    story.append(pb())

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # PAGES 8-9: ZEITTAFEL
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    story.append(title1("Geschichte im Überblick – Zeittafel"))
    story.append(sp(4))

    timeline = [
        ("ca. 35.000 v. Chr.", "Erste menschliche Besiedlung Siziliens (Höhlen bei Palermo und im Südosten)"),
        ("ca. 8.000 v. Chr.", "Höhlenmalereien in der Addaura-Grotte am Monte Pellegrino bei Palermo"),
        ("ca. 1500 v. Chr.", "Drei Völker besiedeln Sizilien: Sikaner (Westen), Sikuler (Osten), Elymer (Nordwesten)"),
        ("ca. 750 v. Chr.", "Beginn der griechischen Kolonisation: Naxos (734), Syrakus (733), Megara Hyblaea (728), Gela (689), Selinunt (628), Akragas (580)"),
        ("480 v. Chr.", "Schlacht bei Himera – Gelon von Syrakus besiegt die Karthager"),
        ("415–413 v. Chr.", "Sizilienexpedition der Athener – katastrophale Niederlage vor Syrakus"),
        ("405–367 v. Chr.", "Dionysios I. – Tyrann von Syrakus, bedeutendste Macht im westlichen Mittelmeer"),
        ("310–289 v. Chr.", "Agathokles – König von Sizilien, Feldzug nach Nordafrika"),
        ("264–241 v. Chr.", "Erster Punischer Krieg – Sizilien wird erste römische Provinz"),
        ("212 v. Chr.", "Eroberung von Syrakus durch die Römer – Tod des Archimedes"),
        ("440 n. Chr.", "Vandalen plündern Sizilien"),
        ("535 n. Chr.", "Byzantinische Herrschaft unter Belisar"),
        ("827–1091", "Arabische Herrschaft – Blütezeit der Landwirtschaft, Einführung von Zitrusfrüchten und Bewässerungssystemen"),
        ("1061–1091", "Normannische Eroberung durch Roger I. – Beginn einer Epoche religiöser Toleranz"),
        ("1130–1154", "Roger II. – Gründung des Königreichs Sizilien, kulturelle Blüte in Palermo"),
        ("1194–1250", "Friedrich II. von Hohenstaufen – «Stupor Mundi», Vereinigung von Kaisertum und sizilianischem Königreich"),
        ("1282", "Sizilianische Vesper – Aufstand gegen die Anjou, Beginn der aragonesischen Herrschaft"),
        ("1442", "Aragonesische Herrschaft – Sizilien wird Teil der spanischen Krone"),
        ("1693", "Verheerendes Erdbeben im Val di Noto – Wiederaufbau im Barockstil (Noto, Ragusa, Modica)"),
        ("1860", "Garibaldi landet bei Marsala – Einigung Italiens (Risorgimento)"),
        ("1943", "Alliierte Landung in Sizilien (Operation Husky) – Beginn der Befreiung Italiens"),
        ("1946", "Sizilien wird Autonome Region mit eigenem Parlament"),
        ("1992", "Ermordung der Anti-Mafia-Richter Giovanni Falcone und Paolo Borsellino"),
    ]

    # 2-column timeline
    tl_data = [["Datum", "Ereignis"]]
    for date, event in timeline:
        tl_data.append([
            Paragraph(f"<b>{date}</b>", S['TableCell']),
            Paragraph(event, S['TableCell'])
        ])
    tl_table = styled_table(tl_data, col_widths=[38 * mm, CONTENT_W - 38 * mm])
    story.append(tl_table)

    story.append(pb())  # may spill to page 9 naturally

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # PAGES 10-11: PERSÖNLICHKEITEN
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    story.append(title1("Galerie bedeutender Persönlichkeiten"))
    story.append(sp(3))

    persons = [
        ("Charondas", "Ende 6. Jh. v. Chr.", "Gesetzgeber",
         "Gesetzgeber aus Katane (Catania). Schuf eine der ältesten kodifizierten Gesetzgebungen der griechischen Welt. Seine Gesetze galten in vielen Städten Süditaliens und Siziliens."),
        ("Gorgias", "485–380 v. Chr.", "Sophist",
         "Bedeutender Sophist und Rhetor aus Leontinoi. Gilt als Begründer der Kunstprosa. Sein Auftreten in Athen 427 v. Chr. erregte großes Aufsehen."),
        ("Empedokles", "495–435 v. Chr.", "Philosoph",
         "Naturphilosoph aus Akragas (Agrigento). Begründer der Vier-Elemente-Lehre (Erde, Wasser, Luft, Feuer). Der Legende nach soll er sich in den Ätna gestürzt haben."),
        ("Epicharmos", "550–460 v. Chr.", "Dramatiker",
         "Gilt als Erfinder der Komödie. Wirkte am Hof der Tyrannen von Syrakus. Seine Stücke waren Vorbilder für die attische Komödie."),
        ("Dionysios I.", "430–367 v. Chr.", "Tyrann",
         "Tyrann von Syrakus, der die Stadt zur mächtigsten des westlichen Mittelmeerraums machte. Führte Kriege gegen Karthago und kontrollierte weite Teile Siziliens."),
        ("Agathokles", "360–289 v. Chr.", "König",
         "König von Sizilien, der als einziger griechischer Herrscher Karthago in Afrika angriff. Stieg vom Töpfersohn zum Herrscher auf."),
        ("Archimedes", "287–212 v. Chr.", "Mathematiker/Physiker",
         "Größter Mathematiker und Physiker der Antike aus Syrakus. Entdecker des Archimedischen Prinzips, des Hebelgesetzes und Erfinder zahlreicher Kriegsmaschinen."),
        ("Hl. Agatha", "gest. 251 n. Chr.", "Märtyrerin",
         "Märtyrerin aus Catania, Schutzpatronin der Stadt. Soll den Ätna-Ausbruch von 252 abgewendet haben. Fest am 5. Februar."),
        ("Hl. Lucia", "283–304 n. Chr.", "Märtyrerin",
         "Märtyrerin aus Syrakus, Schutzpatronin der Stadt und Patronin des Lichts. Fest am 13. Dezember, Verehrung weltweit."),
        ("Roger II.", "1097–1154", "Normannenkönig",
         "Erster König von Sizilien, vereinte normannische, arabische und byzantinische Kultur. Schuf ein Musterreich religiöser Toleranz mit Palermo als Hauptstadt."),
        ("Santa Rosalia", "1130–1166", "Schutzpatronin",
         "Schutzpatronin von Palermo. Lebte als Eremitin am Monte Pellegrino. Soll 1624 die Stadt von der Pest befreit haben. Fest am 15. Juli."),
        ("Friedrich II. von Hohenstaufen", "1194–1250", "Kaiser",
         "«Stupor Mundi» – Staunen der Welt. Kaiser und König von Sizilien. Förderer der Wissenschaften, gründete die Universität Neapel. Sprach sechs Sprachen."),
        ("Friedrich II. von Aragon", "1272–1337", "König",
         "König von Trinakria (Sizilien). Festigte die Unabhängigkeit Siziliens von den Anjou nach der Sizilianischen Vesper."),
        ("Antonello da Messina", "1430–1479", "Maler",
         "Bedeutendster sizilianischer Maler der Renaissance. Brachte die flämische Ölmalerei nach Italien. Meisterwerk: «Vergine Annunziata» (Palermo)."),
        ("Giovanni Verga", "1840–1922", "Schriftsteller",
         "Begründer des literarischen Verismus aus Catania. Hauptwerk: «I Malavoglia» (Die Fischerfamilie). Schildert das harte Leben der einfachen Sizilianer."),
        ("Luigi Pirandello", "1867–1936", "Dramatiker",
         "Nobelpreis für Literatur 1934. Aus Agrigento. Revolutionierte das moderne Theater mit Werken wie «Sechs Personen suchen einen Autor»."),
        ("Salvatore Quasimodo", "1901–1968", "Dichter",
         "Nobelpreis für Literatur 1959. Aus Modica. Vertreter des Hermetismus. Bedeutende Übersetzungen griechischer und lateinischer Lyrik."),
        ("Giovanni Falcone", "1939–1992", "Richter",
         "Anti-Mafia-Richter aus Palermo. Führte den Maxi-Prozess gegen die Cosa Nostra (1986–87). Am 23. Mai 1992 bei einem Bombenanschlag ermordet."),
        ("Paolo Borsellino", "1940–1992", "Richter",
         "Anti-Mafia-Richter aus Palermo, enger Mitstreiter Falcones. Am 19. Juli 1992, 57 Tage nach Falcone, bei einem Attentat getötet."),
    ]

    for name, dates, cat, desc in persons:
        entry = f"<b>{name}</b> ({dates}) – <i>{cat}</i><br/>{desc}"
        story.append(Paragraph(entry, S['BodySmall']))
        story.append(sp(2))

    story.append(pb())

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # PAGE 12: TEMPELTYPEN
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    story.append(title1("Tempeltypen"))
    story.append(sp(4))

    tempel_img = find_image(PUBLIC / "architektur-bilder" / "tempel_schema_hauptbild.png")
    if tempel_img:
        # Invert if dark
        tempel_img = invert_dark_image(tempel_img)
        story.extend(img_block(tempel_img, "Grundformen griechischer Tempel", max_w=CONTENT_W, max_h=160 * mm))
    story.append(sp(4))

    temple_types = [
        ("<b>Antentempel (Templum in antis):</b> Einfachste Form. Zwei Seitenwände (Anten) ragen vor, "
         "dazwischen zwei Säulen. Häufig als Schatzhäuser verwendet."),
        ("<b>Prostylos:</b> Freistehende Säulenreihe vor der Cella (Hauptraum). "
         "Vier bis sechs Säulen bilden die Vorhalle."),
        ("<b>Amphiprostylos:</b> Säulenreihen an Vorder- und Rückseite des Tempels. "
         "Symmetrische Anlage."),
        ("<b>Peripteros:</b> Ringsum von Säulen umgeben. Der klassische griechische Tempel "
         "(z.B. Segesta, Concordia-Tempel in Agrigento). Häufigste Monumentalform."),
        ("<b>Dipteros:</b> Doppelter Säulenkranz. Besonders große Tempel "
         "(z.B. Olympieion in Syrakus). Sehr aufwendig und selten."),
    ]
    for tt in temple_types:
        story.append(Paragraph(tt, S['BodySmall']))
        story.append(sp(1))

    seite01 = find_image(PUBLIC / "architektur-bilder" / "seite_01.png")
    if seite01:
        seite01 = invert_dark_image(seite01)
        story.append(sp(3))
        story.extend(img_block(seite01, "Architektonische Details", max_w=CONTENT_W, max_h=120 * mm))

    story.append(pb())

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # PAGE 13: SÄULENORDNUNGEN
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    story.append(title1("Die drei Säulenordnungen"))
    story.append(sp(4))

    col_imgs = [
        (PUBLIC / "architektur-bilder" / "saeule_dorisch_schema.png", "Dorisch"),
        (PUBLIC / "architektur-bilder" / "saeule_jonisch_schema.png", "Ionisch"),
        (PUBLIC / "architektur-bilder" / "saeule_korinthisch_schema.png", "Korinthisch"),
    ]
    # Invert dark images for readability
    col_imgs_processed = [(invert_dark_image(str(p)), c) for p, c in col_imgs]
    story.extend(img_triple(col_imgs_processed, each_w=50 * mm))
    story.append(sp(4))

    col_desc = [
        ("<b>Dorische Ordnung</b> (ab ca. 600 v. Chr.): Keine Basis – Säule steht direkt auf dem "
         "Stylobat. 16–20 flache Kanneluren. Kapitell: schlichter Echinus und quadratischer Abakus. "
         "Gebälk: Triglyphen und Metopen im Fries. Massiv und streng. Vorherrschend in Sizilien."),
        ("<b>Ionische Ordnung</b> (ab ca. 570 v. Chr.): Säule auf profilierter Basis (Torus und Spira). "
         "24 tiefe Kanneluren. Kapitell mit seitlichen Voluten. Gebälk: drei Fascien im Architrav, "
         "durchlaufender Fries. Eleganter und schlanker als dorisch."),
        ("<b>Korinthische Ordnung</b> (ab ca. 420 v. Chr.): Wie ionisch aufgebaut, aber Kapitell mit "
         "umlaufenden Akanthusblättern in zwei bis drei Kränzen. Reichste und dekorativste Ordnung. "
         "In Sizilien v.a. in der römischen Periode verwendet."),
    ]
    for cd in col_desc:
        story.append(Paragraph(cd, S['BodySmall']))
        story.append(sp(3))

    story.append(pb())

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # PAGE 14: GEFÄSSFORMEN
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    story.append(title1("Antike Gefäßformen"))
    story.append(sp(4))

    s05 = find_image(PUBLIC / "architektur-bilder" / "seite_05.png")
    s06 = find_image(PUBLIC / "architektur-bilder" / "seite_06.png")
    if s05 and s06:
        story.extend(img_pair(s05, "Gefäßtypen (Übersicht)", s06, "Gefäßtypen (Details)"))
    elif s05:
        story.extend(img_block(s05, "Antike Gefäßformen", max_w=CONTENT_W, max_h=200 * mm))
    elif s06:
        story.extend(img_block(s06, "Antike Gefäßformen", max_w=CONTENT_W, max_h=200 * mm))

    story.append(sp(4))
    vessel_text = (
        "Die griechische Keramik ist eine der wichtigsten Quellen für unser Wissen über die antike "
        "Kultur. Die Gefäßformen waren funktional bestimmt: <b>Amphora</b> (Transport und Lagerung "
        "von Wein und Öl), <b>Krater</b> (Mischgefäß für Wein und Wasser beim Symposion), "
        "<b>Hydria</b> (Wasserkrug mit drei Henkeln), <b>Oinochoe</b> (Weinkanne zum Einschenken), "
        "<b>Kylix</b> (flache Trinkschale), <b>Lekythos</b> (Salbgefäß, häufig als Grabbeigabe), "
        "<b>Skyphos</b> (tieferer Trinkbecher mit zwei Henkeln), <b>Kantharos</b> (Trinkgefäß "
        "mit hochgezogenen Henkeln, Attribut des Dionysos)."
    )
    story.append(body(vessel_text))
    story.append(sp(3))
    vessel_text2 = (
        "Zwei Hauptstile der Vasenmalerei: Die <b>schwarzfigurige Technik</b> (ab ca. 700 v. Chr.) "
        "zeigt dunkle Figuren auf hellem Tongrund. Die <b>rotfigurige Technik</b> (ab ca. 530 v. Chr.) "
        "kehrt das Prinzip um – helle Figuren auf schwarz gefirnisstem Grund erlauben feinere "
        "anatomische Details. Sizilianische Werkstätten produzierten eigene Varianten, "
        "besonders bedeutend die Werkstätten von Gela und Syrakus."
    )
    story.append(body(vessel_text2))

    # Additional architecture images if space
    s02 = find_image(PUBLIC / "architektur-bilder" / "seite_02.png")
    if s02:
        s02 = invert_dark_image(s02)
        story.append(sp(4))
        story.extend(img_block(s02, "Architektonische Gliederung", max_w=CONTENT_W, max_h=110 * mm))

    story.append(pb())

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # PAGES 15-57: BESICHTIGUNGSSTÄTTEN
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    def day_header(day_num, day_text):
        return GoldBar(f"TAG {day_num}  ·  {day_text}", height=24, font_size=13)

    def site_header(name):
        return Paragraph(f"<b>{name}</b>", S['Title2'])

    def site_text(text):
        return Paragraph(text, S['BodyText9'])

    # ── DAY 1 (pages 15-18): Segesta, Érice, Trapani, Marsala ──────────
    story.append(day_header(1, "Samstag, 28. März – Segesta · Érice · Trapani · Marsala"))
    story.append(sp(6))

    story.append(site_header("Segesta"))
    story.append(site_text(
        "Segesta war die bedeutendste Stadt der Elymer, eines der drei vorgriechischen Völker "
        "Siziliens. Der <b>dorische Tempel</b> (um 430 v. Chr.) ist einer der am besten erhaltenen "
        "griechischen Tempel überhaupt – obwohl er nie fertiggestellt wurde: Die Säulen tragen keine "
        "Kanneluren, und eine Cella wurde nie errichtet. 36 Säulen umgeben den Tempel auf einem "
        "Hügel mit weitem Blick über das Tal. "
        "Das <b>Theater</b> (3. Jh. v. Chr.) mit 63 m Durchmesser bietet 4.000 Zuschauern Platz "
        "und einen spektakulären Blick über den Golf von Castellammare. "
        "Goethe besuchte Segesta 1787 auf seiner Italienischen Reise und beschrieb den Tempel begeistert."
    ))
    story.append(sp(3))

    seg_imgs = [
        (PUBLIC / "detail-Segesta-2.jpg", "Segesta – Dorischer Tempel"),
        (PUBLIC / "detail-Segesta-3.jpg", "Segesta – Nahansicht"),
    ]
    story.extend(img_pair(str(seg_imgs[0][0]), seg_imgs[0][1],
                          str(seg_imgs[1][0]), seg_imgs[1][1]))

    seg_imgs2 = [
        (PUBLIC / "detail-Segesta-4.jpg", "Segesta – Säulendetail"),
        (PUBLIC / "detail-Segesta-Goethe.jpg", "Goethes Beschreibung"),
    ]
    story.extend(img_pair(str(seg_imgs2[0][0]), seg_imgs2[0][1],
                          str(seg_imgs2[1][0]), seg_imgs2[1][1]))

    seg_theater = find_image(PUBLIC / "detail-Segesta-Theater-Rekonstruktion.jpg")
    if seg_theater:
        story.extend(img_block(seg_theater, "Segesta – Theaterrekonstruktion", max_w=130 * mm, max_h=90 * mm))

    story.append(sp(4))
    story.append(site_header("Monte Érice"))
    story.append(site_text(
        "Érice thront auf 751 m Höhe über Trapani. Die mittelalterliche Stadt mit ihren engen "
        "Gassen und über 60 Kirchen war in der Antike Sitz des berühmten <b>Venusheiligtums</b> "
        "(Aphrodite Erycina), das Phöniker, Griechen und Römer gleichermaßen verehrten. "
        "Die Normannenburg <b>Castello di Venere</b> steht auf den Fundamenten des antiken Tempels. "
        "Bei klarer Sicht reicht der Blick bis zu den Ägadischen Inseln und nach Tunesien."
    ))
    story.append(sp(2))
    erice_imgs = [
        (PUBLIC / "detail-Erice-1.jpg", "Érice – Altstadt"),
        (PUBLIC / "detail-Erice-2.jpg", "Érice – Panorama"),
    ]
    story.extend(img_pair(str(erice_imgs[0][0]), erice_imgs[0][1],
                          str(erice_imgs[1][0]), erice_imgs[1][1]))

    story.append(sp(4))
    story.append(site_header("Trapani"))
    story.append(site_text(
        "Die Hafenstadt Trapani an der Westspitze Siziliens war einst ein bedeutender "
        "Handelsplatz der Phöniker. Die <b>Altstadt</b> erstreckt sich auf einer sichelförmigen "
        "Landzunge. Sehenswert sind die barocke Kathedrale, der Corso Vittorio Emanuele und "
        "das historische <b>Postamt</b> im Jugendstil. Vor der Stadt liegen die berühmten "
        "<b>Salinen</b> mit ihren Windmühlen – seit der Antike wird hier Meersalz gewonnen."
    ))
    story.append(sp(2))
    trap_imgs = [
        (PUBLIC / "detail-Trapani-Postamt.jpg", "Trapani – Historisches Postamt"),
        (PUBLIC / "detail-Trapani-Stadtplan.jpg", "Trapani – Stadtplan"),
    ]
    story.extend(img_pair(str(trap_imgs[0][0]), trap_imgs[0][1],
                          str(trap_imgs[1][0]), trap_imgs[1][1]))

    story.append(sp(4))
    story.append(site_header("Marsala"))
    story.append(site_text(
        "Marsala (arab. Marsa Allah = Hafen Gottes) ist berühmt für seinen gleichnamigen "
        "Dessertwein, den der englische Kaufmann John Woodhouse 1773 «entdeckte». "
        "In der Altstadt: barocke Kathedrale (Madre Chiesa), archäologisches Museum mit dem "
        "«Schiff von Marsala» – einem punischen Kriegsschiff aus dem 3. Jh. v. Chr. "
        "Am 11. Mai 1860 landete Giuseppe Garibaldi mit seinen «Tausend» hier und begann "
        "die Einigung Italiens."
    ))
    story.append(sp(2))
    marsala_img = find_image(PUBLIC / "detail-Marsala-1.jpg")
    if marsala_img:
        story.extend(img_block(marsala_img, "Marsala – Altstadt", max_w=120 * mm, max_h=80 * mm))

    story.append(pb())

    # ── DAY 2 (pages 19-23): Cave di Cusa, Selinunte, Scala, Empedocle, Agrigento
    story.append(day_header(2, "Sonntag, 29. März – Cave di Cusa · Selinunte · Agrigento"))
    story.append(sp(6))

    story.append(site_header("Cave di Cusa"))
    story.append(site_text(
        "Die antiken Steinbrüche von Cave di Cusa liegen 13 km nordwestlich von Selinunt. "
        "Hier wurden die gewaltigen Säulentrommeln für die Tempel von Selinunt gebrochen. "
        "Als Selinunt 409 v. Chr. von den Karthagern zerstört wurde, blieb die Arbeit "
        "abrupt stehen – man sieht noch heute halbfertige Säulentrommeln in verschiedenen "
        "Stadien der Bearbeitung. Ein einzigartiges Zeugnis antiker Steinmetzkunst."
    ))
    story.append(sp(2))
    cdc = find_image(PUBLIC / "2-SO-Cave-di-Cusa.png")
    if cdc:
        story.extend(img_block(cdc, "Cave di Cusa – Antiker Steinbruch", max_w=130 * mm, max_h=85 * mm))

    story.append(sp(4))
    story.append(site_header("Selinunte"))
    story.append(site_text(
        "Selinunt (gr. Selinus, nach dem Eppich/Sellerie) wurde 628 v. Chr. als Kolonie von "
        "Megara Hyblaea gegründet und war die westlichste griechische Stadt Siziliens. "
        "Der <b>archäologische Park</b> ist der größte Europas und umfasst drei Bereiche: "
        "die <b>Osthügel-Tempel</b> (E, F, G), die <b>Akropolis</b> mit den Tempeln A–D "
        "und das <b>Heiligtum der Demeter Malophoros</b> westlich der Stadt. "
        "Der <b>Tempel E</b> (Hera-Tempel, um 460 v. Chr.) wurde teilweise wieder aufgerichtet "
        "und vermittelt einen Eindruck der einstigen Monumentalität. "
        "Tempel G war mit 113 × 54 m einer der größten griechischen Tempel überhaupt. "
        "409 v. Chr. wurde Selinunt von den Karthagern unter Hannibal Mago zerstört."
    ))
    story.append(sp(3))

    sel_imgs = [
        (PUBLIC / "detail-Selinunte-1.jpg", "Selinunte – Tempelanlage"),
        (PUBLIC / "detail-Selinunte-Karte.jpg", "Selinunte – Lageplan"),
    ]
    story.extend(img_pair(str(sel_imgs[0][0]), sel_imgs[0][1],
                          str(sel_imgs[1][0]), sel_imgs[1][1]))
    sel_imgs2 = [
        (PUBLIC / "detail-Selinunte-TempelE.jpg", "Tempel E (Hera)"),
        (PUBLIC / "detail-Selinunte-Rekonstruktion.jpg", "Rekonstruktion"),
    ]
    story.extend(img_pair(str(sel_imgs2[0][0]), sel_imgs2[0][1],
                          str(sel_imgs2[1][0]), sel_imgs2[1][1]))

    sel_imgs3 = [
        (PUBLIC / "detail-Selinunte-TempelRekonstruktion.jpg", "Tempelrekonstruktion"),
        (PUBLIC / "detail-Selinunte-Demeter.jpg", "Demeter-Heiligtum"),
    ]
    story.extend(img_pair(str(sel_imgs3[0][0]), sel_imgs3[0][1],
                          str(sel_imgs3[1][0]), sel_imgs3[1][1]))

    story.append(sp(4))
    story.append(site_header("Scala dei Turchi"))
    story.append(site_text(
        "Die «Treppe der Türken» ist eine spektakuläre Felsformation aus weißem Mergel "
        "(Kalkmergel) an der Küste bei Realmonte. Die terrassenförmig geschichteten Felsen "
        "leuchten bei Sonnenuntergang golden. Der Name erinnert an arabische Piraten, "
        "die hier anlandeten. Eines der meistfotografierten Naturmonumente Siziliens."
    ))
    sdt = find_image(PUBLIC / "2-SO-Scala-dei-Turchi.jpg")
    if sdt:
        story.extend(img_block(sdt, "Scala dei Turchi", max_w=120 * mm, max_h=80 * mm))

    story.append(sp(3))
    story.append(site_header("Porto Empedocle"))
    story.append(site_text(
        "Die Hafenstadt, benannt nach dem Philosophen Empedokles, ist Geburtsort des "
        "Schriftstellers Andrea Camilleri, Schöpfer des Commissario Montalbano. "
        "An der Mole steht eine Statue Montalbanos."
    ))
    pe = find_image(PUBLIC / "2-SO-Porto-Empedocle.jpg")
    if pe:
        story.extend(img_block(pe, "Porto Empedocle – Montalbano-Statue", max_w=100 * mm, max_h=70 * mm))

    story.append(sp(4))
    story.append(site_header("Agrigento"))
    story.append(site_text(
        "Das antike Akragas, 580 v. Chr. von Gela aus gegründet, war eine der reichsten "
        "Städte der griechischen Welt. Pindar nannte es «die schönste Stadt der Sterblichen». "
        "Das <b>Tal der Tempel</b> (Valle dei Templi, UNESCO-Welterbe) erstreckt sich auf einem "
        "Höhenzug südlich der modernen Stadt. Erhalten sind sieben Tempel: "
        "Der <b>Concordia-Tempel</b> (um 430 v. Chr.) ist einer der besterhaltenen dorischen "
        "Tempel der Welt – er überlebte, weil er im 6. Jh. in eine Kirche umgewandelt wurde. "
        "Der <b>Herakles-Tempel</b> (um 510 v. Chr.) ist der älteste. "
        "Das <b>Olympieion</b> (Zeus-Tempel) war mit 113 × 56 m der größte dorische Tempel "
        "überhaupt – statt Säulen trugen 7,5 m hohe Atlanten (Telamone) das Gebälk. "
        "Das <b>archäologische Museum</b> zeigt u.a. einen rekonstruierten Telamon und die "
        "berühmte Epheben-Statue."
    ))
    story.append(sp(3))

    agr_img1 = find_image(PUBLIC / "detail-Agrigento-1.jpg")
    agr_karte = find_image(PUBLIC / "detail-Agrigento-Karte.jpg")
    if agr_img1 and agr_karte:
        story.extend(img_pair(agr_img1, "Agrigento – Concordia-Tempel", agr_karte, "Agrigento – Lageplan"))
    elif agr_img1:
        story.extend(img_block(agr_img1, "Agrigento – Concordia-Tempel", max_w=140 * mm))

    agr_ekkl = find_image(PUBLIC / "detail-Agrigento-Ekklesiasterion.jpg")
    if agr_ekkl:
        story.extend(img_block(agr_ekkl, "Agrigento – Ekklesiasterion", max_w=120 * mm, max_h=80 * mm))

    story.append(pb())

    # ── DAY 3 (pages 24-28): Gela, Piazza Armerina, Akrai, Tellaro, Noto, Siracusa
    story.append(day_header(3, "Montag, 30. März – Gela · Piazza Armerina · Akrai · Noto"))
    story.append(sp(6))

    story.append(site_header("Gela"))
    story.append(site_text(
        "Gela wurde 689 v. Chr. von Rhodiern und Kretern gegründet und war eine der "
        "mächtigsten griechischen Kolonien. Von hier aus wurde Akragas (Agrigento) gegründet. "
        "Aischylos starb hier 456 v. Chr. (der Legende nach durch eine Schildkröte). "
        "Das <b>archäologische Museum</b> bewahrt herausragende Vasen und Terrakotten der "
        "Gela-Werkstätten sowie Münzen und Befestigungsreste."
    ))
    gela_img = find_image(PUBLIC / "3-MO-Gela.jpg")
    if gela_img:
        story.extend(img_block(gela_img, "Gela – Archäologisches Museum", max_w=120 * mm, max_h=80 * mm))

    story.append(sp(4))
    story.append(site_header("Piazza Armerina – Villa Romana del Casale"))
    story.append(site_text(
        "Die <b>Villa Romana del Casale</b> (UNESCO-Welterbe) ist eine spätantike Luxusvilla "
        "aus dem frühen 4. Jh. n. Chr., wahrscheinlich Jagdresidenz eines hohen römischen "
        "Würdenträgers. Berühmt sind die über <b>3.500 m² Bodenmosaiken</b> – die größte und "
        "besterhaltene Mosaiksammlung der römischen Welt. Highlights: der «Große Jagdkorridor» "
        "(65 m lang), die «Bikini-Mädchen» (Sportlerinnen in antiken Zweiteiler), "
        "Szenen aus dem Amphitheater, mythologische Darstellungen (Odysseus und Polyphem, "
        "Herakles' Arbeiten). Die Mosaiken stammen vermutlich von nordafrikanischen Werkstätten."
    ))
    story.append(sp(2))
    pa_img = find_image(PUBLIC / "3-MO-Piazza-Armerina.jpg")
    pa_plan = find_image(PUBLIC / "detail-PiazzaArmerina-Plan.jpg")
    if pa_img and pa_plan:
        story.extend(img_pair(pa_img, "Piazza Armerina – Mosaik", pa_plan, "Villa Romana – Grundriss"))
    elif pa_img:
        story.extend(img_block(pa_img, "Piazza Armerina – Mosaik", max_w=130 * mm))

    story.append(sp(4))
    story.append(site_header("Akrai (Palazzolo Acreide)"))
    story.append(site_text(
        "Akrai wurde 664 v. Chr. als Kolonie von Syrakus gegründet und diente als "
        "Vorposten im Landesinneren. Das gut erhaltene <b>griechische Theater</b> "
        "(3. Jh. v. Chr.) fasste 600 Zuschauer. Daneben: Bouleuterion (Ratsgebäude), "
        "Steinbrüche (Latomien) und die «Santoni» – zwölf in den Fels gehauene Reliefs "
        "der Göttin Kybele aus hellenistischer Zeit."
    ))
    ak_img = find_image(PUBLIC / "3-MO-Akrai.jpg")
    if ak_img:
        story.extend(img_block(ak_img, "Akrai – Griechisches Theater", max_w=120 * mm, max_h=80 * mm))

    story.append(sp(4))
    story.append(site_header("Villa Romana del Tellaro"))
    story.append(site_text(
        "Nahe Noto gelegene spätantike Villa (4. Jh. n. Chr.) mit bedeutenden "
        "Bodenmosaiken – darunter Jagdszenen und eine Darstellung des Loskaufs von Hektors "
        "Leichnam. Kleiner als Piazza Armerina, aber qualitativ ebenbürtig."
    ))
    tellaro = find_image(PUBLIC / "3-MO-Tellaro.jpg")
    if tellaro:
        story.extend(img_block(tellaro, "Villa Romana del Tellaro – Mosaik", max_w=110 * mm, max_h=75 * mm))

    story.append(sp(4))
    story.append(site_header("Noto"))
    story.append(site_text(
        "Noto ist die «Hauptstadt des sizilianischen Barock» (UNESCO-Welterbe). "
        "Nach dem Erdbeben von 1693 komplett neu aufgebaut, zeigt die Stadt ein "
        "einheitliches Barockensemble von bestechender Harmonie. "
        "Der <b>Corso Vittorio Emanuele</b> führt an den drei Hauptplätzen vorbei: "
        "Piazza Immacolata (S. Francesco), Piazza Municipio mit der <b>Kathedrale "
        "San Nicolò</b> (deren Kuppel 1996 einstürzte und 2007 wiedererrichtet wurde) "
        "und Piazza XVI Maggio. Der honigfarbene Kalkstein verleiht der Stadt bei "
        "Sonnenuntergang ein warmes Leuchten."
    ))
    noto_imgs = [
        (PUBLIC / "3-MO-Noto.jpg", "Noto – Barockkathedrale"),
        (PUBLIC / "detail-Noto-Stadtplan.jpg", "Noto – Stadtplan"),
    ]
    story.extend(img_pair(str(noto_imgs[0][0]), noto_imgs[0][1],
                          str(noto_imgs[1][0]), noto_imgs[1][1]))

    story.append(sp(3))
    sir_duomo = find_image(PUBLIC / "3-MO-Siracusa-Duomo.jpg")
    if sir_duomo:
        story.extend(img_block(sir_duomo, "Ankunft in Siracusa – Dom", max_w=120 * mm, max_h=80 * mm))

    story.append(pb())

    # ── DAY 4 (pages 29-35): Syrakus, Castello Eurialo, Catania ────────
    story.append(day_header(4, "Dienstag, 31. März – Syrakus · Castello Eurialo · Catania"))
    story.append(sp(6))

    story.append(site_header("Syrakus – Ortigia (Altstadt)"))
    story.append(site_text(
        "Syrakus, 733 v. Chr. von Korinth gegründet, war in der Antike eine der mächtigsten "
        "Städte der Welt und rivalisierte mit Athen und Karthago. Die Altstadt liegt auf der "
        "Insel <b>Ortigia</b>, die durch eine Brücke mit dem Festland verbunden ist. "
        "Der <b>Dom</b> (Duomo di Siracusa) ist weltweit einzigartig: Er wurde im 7. Jh. direkt "
        "in den antiken <b>Athena-Tempel</b> (5. Jh. v. Chr.) eingebaut – die dorischen Säulen "
        "sind in den Außenwänden noch sichtbar. Die barocke Fassade stammt von 1728. "
        "Die <b>Arethusa-Quelle</b> auf Ortigia ist eine Süßwasserquelle direkt am Meer, "
        "verbunden mit dem Mythos der Nymphe Arethusa, die von Artemis in eine Quelle verwandelt "
        "wurde, um dem Flussgott Alpheios zu entkommen."
    ))
    story.append(sp(2))

    syr_dom_imgs = [
        (PUBLIC / "detail-Syrakus-Dom-1.jpg", "Dom – Athena-Tempel-Säulen"),
        (PUBLIC / "detail-Syrakus-Dom-2.jpg", "Dom – Innenansicht"),
    ]
    story.extend(img_pair(str(syr_dom_imgs[0][0]), syr_dom_imgs[0][1],
                          str(syr_dom_imgs[1][0]), syr_dom_imgs[1][1]))

    syr_dom_imgs2 = [
        (PUBLIC / "detail-Syrakus-Dom-3.jpg", "Dom – Seitenansicht"),
        (PUBLIC / "detail-Syrakus-Dom-4.jpg", "Dom – Fassade"),
    ]
    story.extend(img_pair(str(syr_dom_imgs2[0][0]), syr_dom_imgs2[0][1],
                          str(syr_dom_imgs2[1][0]), syr_dom_imgs2[1][1]))

    syr_apollo = find_image(PUBLIC / "detail-Syrakus-Apollotempel.jpg")
    syr_apollo_gr = find_image(PUBLIC / "detail-Syrakus-Apollontempel-Grundriss.jpg")
    if syr_apollo and syr_apollo_gr:
        story.extend(img_pair(syr_apollo, "Apollon-Tempel",
                              syr_apollo_gr, "Apollon-Tempel – Grundriss"))

    syr_stadtplan = find_image(PUBLIC / "detail-Syrakus-Stadtplan.jpg")
    if syr_stadtplan:
        story.extend(img_block(syr_stadtplan, "Syrakus/Ortigia – Stadtplan", max_w=CONTENT_W, max_h=120 * mm))

    syr_arethusa = find_image(PUBLIC / "4-DI-Siracusa-Arethusa.jpg")
    if syr_arethusa:
        story.extend(img_block(syr_arethusa, "Arethusa-Quelle auf Ortigia", max_w=120 * mm, max_h=80 * mm))

    story.append(sp(4))
    story.append(site_header("Archäologischer Park (Neapolis)"))
    story.append(site_text(
        "Der <b>Parco Archeologico della Neapolis</b> vereint die wichtigsten Monumente "
        "des antiken Syrakus. Das <b>griechische Theater</b> (5. Jh. v. Chr., umgebaut im "
        "3. Jh.) ist eines der größten der griechischen Welt (138 m Durchmesser, "
        "15.000 Zuschauer). Hier wurden die Tragödien des Aischylos uraufgeführt. "
        "Das <b>«Ohr des Dionysios»</b> ist eine 23 m hohe, 65 m tiefe, ohrförmige Grotte "
        "in den Latomien (Steinbrüchen). Der Legende nach soll der Tyrann Dionysios I. "
        "von oben die Gespräche der Gefangenen belauscht haben. "
        "Die <b>Latomien</b> (Steinbrüche) dienten als Gefängnis für die 7.000 athenischen "
        "Kriegsgefangenen nach der gescheiterten Sizilienexpedition 413 v. Chr. "
        "Das <b>Römische Amphitheater</b> (3. Jh. n. Chr.) ist eines der größten Siziliens."
    ))
    story.append(sp(2))

    syr_ohr = find_image(PUBLIC / "detail-Syrakus-Ohr.jpg")
    syr_stein = find_image(PUBLIC / "detail-Syrakus-Steinbrueche.jpg")
    if syr_ohr and syr_stein:
        story.extend(img_pair(syr_ohr, "Ohr des Dionysios", syr_stein, "Latomien (Steinbrüche)"))

    syr_theater = find_image(PUBLIC / "detail-Syrakus-Theater-Skene.jpg")
    syr_park_karte = find_image(PUBLIC / "detail-Syrakus-Arch-Park-Karte.jpg")
    if syr_theater and syr_park_karte:
        story.extend(img_pair(syr_theater, "Griechisches Theater – Skene",
                              syr_park_karte, "Archäologischer Park – Karte"))

    syr_olymp = find_image(PUBLIC / "detail-Syrakus-Olympieion-Grundriss.jpg")
    if syr_olymp:
        story.extend(img_block(syr_olymp, "Olympieion – Grundriss", max_w=110 * mm, max_h=75 * mm))

    story.append(sp(4))
    story.append(site_header("Archimedes"))
    story.append(site_text(
        "Archimedes (287–212 v. Chr.) ist der berühmteste Sohn von Syrakus. "
        "Mathematiker, Physiker und Ingenieur – er entdeckte das nach ihm benannte "
        "<b>Archimedische Prinzip</b> (Auftrieb), formulierte das <b>Hebelgesetz</b> "
        "(«Gebt mir einen festen Punkt, und ich hebe die Welt aus den Angeln») und "
        "erfand die <b>Archimedische Schraube</b> zur Wasserförderung. "
        "Während der römischen Belagerung 214–212 v. Chr. konstruierte er geniale "
        "Verteidigungsmaschinen. Bei der Eroberung wurde er von einem römischen Soldaten "
        "getötet – seine letzten Worte: «Störe meine Kreise nicht!» (Noli turbare circulos meos)."
    ))
    story.append(sp(2))
    arch_imgs = [
        (PUBLIC / "detail-Syrakus-Archimedes.jpg", "Grab des Archimedes"),
        (PUBLIC / "4-DI-Archimedes.jpg", "Archimedes"),
    ]
    story.extend(img_pair(str(arch_imgs[0][0]), arch_imgs[0][1],
                          str(arch_imgs[1][0]), arch_imgs[1][1]))

    story.append(sp(4))
    story.append(site_header("Castello Eurialo"))
    story.append(site_text(
        "Das <b>Kastell Euryalos</b> (griech. «Breiter Nagel») liegt 7 km nordwestlich von "
        "Syrakus auf dem Epipolai-Plateau. Unter Dionysios I. (um 400 v. Chr.) als Teil der "
        "gewaltigen Stadtbefestigung (27 km Länge!) errichtet, gilt es als die "
        "am besten erhaltene griechische Festung. Fünf Gräben, unterirdische Gänge und "
        "mehrere Verteidigungstürme sind noch erkennbar."
    ))
    eurialo = find_image(PUBLIC / "detail-FortEuryalos-Plan.jpg")
    if eurialo:
        story.extend(img_block(eurialo, "Castello Eurialo – Festungsplan", max_w=130 * mm, max_h=85 * mm))

    story.append(sp(4))
    story.append(site_header("Catania"))
    story.append(site_text(
        "Catania, 729 v. Chr. als Katane gegründet, liegt am Fuß des Ätna und wurde "
        "mehrfach von Lava und Erdbeben zerstört – zuletzt 1669 (Lavastrom) und 1693 "
        "(Erdbeben). Der Wiederaufbau im Barock durch Giovanni Battista Vaccarini prägt "
        "das heutige Stadtbild. Wahrzeichen ist der <b>Elefantenbrunnen</b> (Fontana "
        "dell'Elefante, 1736) auf der Piazza del Duomo – ein Lava-Elefant trägt einen "
        "ägyptischen Obelisken. Der <b>Dom</b> (Sant'Agata) birgt das Grab des Komponisten "
        "Vincenzo Bellini. Das <b>Teatro Romano</b> (2. Jh. n. Chr.) und das angrenzende "
        "Odeon liegen malerisch inmitten der Altstadt."
    ))
    cat_imgs = [
        (PUBLIC / "detail-Catania-Elefant.jpg", "Catania – Elefantenbrunnen"),
        (PUBLIC / "detail-Catania-Stadtplan.jpg", "Catania – Stadtplan"),
    ]
    story.extend(img_pair(str(cat_imgs[0][0]), cat_imgs[0][1],
                          str(cat_imgs[1][0]), cat_imgs[1][1]))

    story.append(pb())

    # ── DAY 5 (pages 36-39): Ätna, Alcantara, Taormina ────────────────
    story.append(day_header(5, "Mittwoch, 1. April – Ätna · Alcantara-Schlucht · Taormina"))
    story.append(sp(6))

    story.append(site_header("Ätna (Etna)"))
    story.append(site_text(
        "Der <b>Ätna</b> (3.357 m, sizilianisch Mongibello, arab. Jabal = Berg) ist der "
        "höchste und aktivste Vulkan Europas (UNESCO-Welterbe seit 2013). "
        "Seine Aktivität ist seit 2.700 Jahren dokumentiert – der griechische Dichter Pindar "
        "beschrieb bereits 475 v. Chr. einen Ausbruch. In der Mythologie ist der Ätna die "
        "Werkstatt des Hephaistos (Vulcanus) und Gefängnis des Riesen Typhon. "
        "Die fruchtbaren Vulkanböden ermöglichen den Anbau von Wein, Pistazien und "
        "Kastanien. Die Auffahrt führt durch verschiedene Vegetationszonen: "
        "Zitrusplantagen, Eichen- und Kastanienwälder, Birkenzone, Lavawüste. "
        "Die Seilbahn bringt Besucher auf ca. 2.500 m, Geländebusse weiter bis ca. 2.900 m."
    ))
    story.append(sp(2))

    etna_imgs = [
        (PUBLIC / "5-MI-Etna-Krater.jpg", "Ätna – Gipfelkrater"),
        (PUBLIC / "5-MI-Etna2.jpg", "Ätna – Ansicht"),
    ]
    story.extend(img_pair(str(etna_imgs[0][0]), etna_imgs[0][1],
                          str(etna_imgs[1][0]), etna_imgs[1][1]))

    etna_detail = find_image(PUBLIC / "detail-Etna-1.jpg")
    if etna_detail:
        story.extend(img_block(etna_detail, "Ätna – Vulkanlandschaft", max_w=130 * mm, max_h=85 * mm))

    story.append(sp(4))
    story.append(site_header("Alcantara-Schlucht"))
    story.append(site_text(
        "Die <b>Gole dell'Alcantara</b> sind eine bis zu 50 m tiefe und nur 2–5 m breite "
        "Schlucht, die der Fluss Alcantara (arab. al-Qantarah = die Brücke) in einen "
        "prähistorischen Lavastrom gegraben hat. Die basaltischen Felswände zeigen "
        "spektakuläre <b>Orgelpfeifen-Formationen</b> (prismatische Basaltsäulen), "
        "entstanden durch langsame Abkühlung der Lava. Im Sommer kann man durch das "
        "(kalte!) Wasser waten. Ein Aufzug führt hinunter zum Flussbett."
    ))
    alc_imgs = [
        (PUBLIC / "detail-Alcantara.jpg", "Alcantara – Basaltsäulen"),
        (PUBLIC / "5-MI-Alcantara.jpg", "Alcantara-Schlucht"),
    ]
    story.extend(img_pair(str(alc_imgs[0][0]), alc_imgs[0][1],
                          str(alc_imgs[1][0]), alc_imgs[1][1]))

    story.append(sp(4))
    story.append(site_header("Taormina"))
    story.append(site_text(
        "Taormina (griech. Tauromenion), auf einer Terrasse in 204 m Höhe über dem Meer "
        "gelegen, ist seit dem 19. Jahrhundert einer der berühmtesten Orte Siziliens. "
        "Das <b>Teatro Greco</b> (3. Jh. v. Chr., im 2. Jh. n. Chr. von den Römern umgebaut) "
        "bietet einen der schönsten Ausblicke der Welt: durch die Bühnenöffnung sieht man "
        "den Ätna und die Bucht von Naxos. Der Durchmesser beträgt 109 m, es fasste "
        "5.400 Zuschauer. Goethe schwärmte: Am Theater auf einer der obersten Bänke "
        "sitzend überblickt man «die ganze Linie des Ätna, die Küste bis Catania und Syrakus». "
        "Der <b>Corso Umberto I.</b> durchzieht die Altstadt vom Porta Messina zum Porta Catania "
        "mit eleganten Palazzi, Kirchen und Geschäften."
    ))
    story.append(sp(2))

    tao_imgs = [
        (PUBLIC / "detail-Taormina-1.jpg", "Taormina – Teatro Greco"),
        (PUBLIC / "detail-Taormina-2.jpg", "Taormina – Panorama"),
    ]
    story.extend(img_pair(str(tao_imgs[0][0]), tao_imgs[0][1],
                          str(tao_imgs[1][0]), tao_imgs[1][1]))

    tao_plan = find_image(PUBLIC / "detail-Taormina-Stadtplan.jpg")
    if tao_plan:
        story.extend(img_block(tao_plan, "Taormina – Stadtplan", max_w=130 * mm, max_h=90 * mm))

    story.append(pb())

    # ── DAY 6 (pages 40-45): Messina, Milazzo, Äolische Inseln, Tindari, Cefalù, Solunto
    story.append(day_header(6, "Donnerstag, 2. April – Milazzo · Äolische Inseln · Tindari · Cefalù · Solunto"))
    story.append(sp(6))

    story.append(site_header("Messina"))
    story.append(site_text(
        "Messina (griech. Zankle, dann Messana) an der Meerenge kontrolliert seit der Antike "
        "die Passage zwischen Sizilien und dem Festland. Die Stadt wurde 1908 durch ein "
        "verheerendes Erdbeben (80.000 Tote) fast vollständig zerstört und im Jugendstil "
        "wieder aufgebaut. Sehenswert: der Dom mit der astronomischen Uhr (größte der Welt, "
        "Glockenspiel mittags) und die Kirche SS. Annunziata dei Catalani (12. Jh.)."
    ))
    mess = find_image(PUBLIC / "6-DO-Messina.jpg")
    if mess:
        story.extend(img_block(mess, "Messina – Hafen", max_w=120 * mm, max_h=75 * mm))

    story.append(sp(4))
    story.append(site_header("Milazzo und Äolische Inseln"))
    story.append(site_text(
        "<b>Milazzo</b> (griech. Mylae) liegt auf einer Halbinsel mit normannisch-staufischer "
        "Burg. Von hier fahren die Fähren zu den Äolischen Inseln (UNESCO-Welterbe), "
        "dem mythischen Aufenthaltsort des Windgottes Aiolos. "
        "Die sieben Inseln vulkanischen Ursprungs: <b>Lipari</b> (größte Insel, "
        "archäologisches Museum), <b>Vulcano</b> (aktiver Krater, Schwefelquellen), "
        "<b>Stromboli</b> (ständig aktiver Vulkan), Salina, Panarea, Filicudi, Alicudi."
    ))
    story.append(sp(2))

    mil_imgs = [
        (PUBLIC / "6-DO-Milazzo.jpg", "Milazzo – Hafenblick"),
        (PUBLIC / "6-DO-Lipari-Vulcano.jpg", "Lipari und Vulcano"),
    ]
    story.extend(img_pair(str(mil_imgs[0][0]), mil_imgs[0][1],
                          str(mil_imgs[1][0]), mil_imgs[1][1]))

    lip_karte = find_image(PUBLIC / "detail-Lipari-Karte.jpg")
    vul_karte = find_image(PUBLIC / "detail-Vulcano-Karte.jpg")
    if lip_karte and vul_karte:
        story.extend(img_pair(lip_karte, "Lipari – Karte", vul_karte, "Vulcano – Karte"))

    story.append(sp(4))
    story.append(site_header("Tindari"))
    story.append(site_text(
        "Tindari (griech. Tyndaris) wurde 396 v. Chr. von Dionysios I. von Syrakus für "
        "griechische Söldner aus dem Peloponnes gegründet. Auf dem Kap thront die moderne "
        "<b>Wallfahrtskirche</b> der Schwarzen Madonna (14. Jh., bedeutendster Marienwallfahrtsort "
        "Siziliens). Die archäologische Zone zeigt: <b>Teatro Greco</b> (3. Jh. v. Chr.), "
        "die <b>Basilika</b> (monumentales Stadttor), <b>Casa Romana</b> mit Peristylhof "
        "und Mosaiken sowie gut erhaltene hellenistisch-römische <b>Stadtmauern</b>. "
        "Unterhalb erstrecken sich die Lagunenseen von Marinello."
    ))
    story.append(sp(2))

    tin_imgs = [
        (PUBLIC / "detail-Tindari-1.jpg", "Tindari – Teatro Greco"),
        (PUBLIC / "detail-Tindari-2.jpg", "Tindari – Basilika"),
    ]
    story.extend(img_pair(str(tin_imgs[0][0]), tin_imgs[0][1],
                          str(tin_imgs[1][0]), tin_imgs[1][1]))

    tin3 = find_image(PUBLIC / "6-DO-Tindari.jpg")
    if tin3:
        story.extend(img_block(tin3, "Tindari – Wallfahrtskirche und Lagune", max_w=120 * mm, max_h=80 * mm))

    story.append(sp(4))
    story.append(site_header("Cefalù"))
    story.append(site_text(
        "Cefalù wird überragt von einem gewaltigen Felsen (griech. Kephaloidion = Kopf) "
        "und zählt zu den schönsten Küstenstädten Siziliens. Die <b>Kathedrale "
        "San Salvatore</b> (1131–1240), von Roger II. gestiftet, ist ein Hauptwerk der "
        "normannischen Architektur. In der Apsis: ein gewaltiges <b>Christus-Pantokrator-Mosaik</b> "
        "auf Goldgrund (1148) – zu den bedeutendsten byzantinischen Mosaiken Siziliens gehörend. "
        "Die Altstadt mit ihren mittelalterlichen Gassen, dem arabisch beeinflussten "
        "Waschhaus (Lavatoio) und dem kleinen Hafen ist malerisch."
    ))
    story.append(sp(2))

    cef_imgs = [
        (PUBLIC / "detail-Cefalu-Dom-1.jpg", "Cefalù – Kathedrale"),
        (PUBLIC / "detail-Cefalu-Dom-2.jpg", "Cefalù – Pantokrator-Mosaik"),
    ]
    story.extend(img_pair(str(cef_imgs[0][0]), cef_imgs[0][1],
                          str(cef_imgs[1][0]), cef_imgs[1][1]))

    cef_stadt = find_image(PUBLIC / "detail-Cefalu-Stadt.jpg")
    if cef_stadt:
        story.extend(img_block(cef_stadt, "Cefalù – Altstadt und Felsen", max_w=130 * mm, max_h=85 * mm))

    story.append(sp(4))
    story.append(site_header("Solunto"))
    story.append(site_text(
        "Solunto (Soluntum) auf dem Monte Catalfano bei Bagheria war eine der drei "
        "phönizischen Städte Siziliens. Die Ruinen der hellenistisch-römischen Stadt "
        "(3.–1. Jh. v. Chr.) zeigen ein regelmäßiges Straßenraster, Peristylhäuser "
        "mit Mosaikböden und Zisternen sowie ein kleines Theater. Beeindruckend ist die "
        "Lage mit Panoramablick über den Golf von Palermo."
    ))
    sol = find_image(PUBLIC / "6-DO-Solunto.jpg")
    if sol:
        story.extend(img_block(sol, "Solunto – Ausgrabungen", max_w=120 * mm, max_h=80 * mm))

    story.append(pb())

    # ── DAY 7 (pages 46-52): Palermo, La Martorana, Monreale, Monte Pellegrino
    story.append(day_header(7, "Freitag, 3. April – Palermo · Monreale · Monte Pellegrino"))
    story.append(sp(6))

    story.append(site_header("Palermo"))
    story.append(site_text(
        "Palermo (phöniz. Ziz = Blume, griech. Panormos = Allhafen), Hauptstadt Siziliens, "
        "blickt auf 2.700 Jahre Geschichte zurück. Unter den Arabern (831–1072) und "
        "Normannen (1072–1194) erlebte die Stadt ihre Blütezeit als kosmopolitische "
        "Metropole, in der Muslime, Christen und Juden friedlich zusammenlebten. "
        "Der <b>Normannenpalast</b> (Palazzo dei Normanni) ist der älteste Königspalast "
        "Europas. In seinem Inneren die <b>Cappella Palatina</b> (1132–43), Roger II. "
        "persönliche Hofkapelle – vollständig mit byzantinischen Goldgrundmosaiken und "
        "einer arabischen Stalaktitendecke (Muqarnas) geschmückt. "
        "Der <b>Normannendom</b> (1185) vereint normannische, arabische und gotische Elemente "
        "und birgt die Kaisergräber Friedrichs II. und Rogers II. "
        "Die <b>Kreuzkuppelkirche La Martorana</b> (1143) besitzt die ältesten "
        "byzantinischen Mosaiken Siziliens, darunter die Krönung Rogers II. durch Christus."
    ))
    story.append(sp(3))

    pal_karte = find_image(PUBLIC / "detail-Palermo-Karte.jpg")
    if pal_karte:
        story.extend(img_block(pal_karte, "Palermo – Stadtplan", max_w=CONTENT_W, max_h=120 * mm))

    pal_imgs = [
        (PUBLIC / "detail-Palermo-Pretoria.jpg", "Piazza Pretoria"),
        (PUBLIC / "detail-Palermo-Museum.jpg", "Archäologisches Museum"),
    ]
    story.extend(img_pair(str(pal_imgs[0][0]), pal_imgs[0][1],
                          str(pal_imgs[1][0]), pal_imgs[1][1]))

    pal_dom = find_image(PUBLIC / "detail-Palermo-Dom-Grundriss.jpg")
    if pal_dom:
        story.extend(img_block(pal_dom, "Palermo – Dom-Grundriss", max_w=120 * mm, max_h=80 * mm))

    story.append(sp(4))
    story.append(site_header("La Martorana"))
    story.append(site_text(
        "Die Kirche Santa Maria dell'Ammiraglio, genannt <b>La Martorana</b>, wurde 1143 "
        "vom Admiral Rogers II., Georg von Antiochien, gestiftet. Die byzantinischen "
        "<b>Goldgrundmosaiken</b> im Kuppelraum gehören zu den bedeutendsten Italiens: "
        "Christus Pantokrator in der Kuppel, Verkündigung, Geburt Christi, Tod Mariens. "
        "Historisch bedeutsam: das Mosaik «Roger II. wird von Christus gekrönt» – "
        "Ausdruck des göttlichen Herrschaftsanspruchs der Normannenkönige. "
        "Die Kirche diente 1282 als Versammlungsort während der Sizilianischen Vesper."
    ))
    story.append(sp(2))

    mart_imgs = [
        (PUBLIC / "detail-Palermo-Martorana.jpg", "La Martorana – Mosaiken"),
        (PUBLIC / "detail-Palermo-Martorana-Plan.jpg", "La Martorana – Grundriss"),
    ]
    story.extend(img_pair(str(mart_imgs[0][0]), mart_imgs[0][1],
                          str(mart_imgs[1][0]), mart_imgs[1][1]))

    mart_gesichter = find_image(PUBLIC / "7-FR-Gesichter-Martorana.jpg")
    if mart_gesichter:
        story.extend(img_block(mart_gesichter, "La Martorana – Mosaikdetails", max_w=130 * mm, max_h=85 * mm))

    story.append(sp(4))
    story.append(site_header("Monreale"))
    story.append(site_text(
        "Die <b>Kathedrale Santa Maria la Nuova</b> in Monreale (1174–89), von Wilhelm II. "
        "errichtet, ist das Hauptwerk normannischer Kunst in Sizilien. Der Innenraum ist "
        "über eine Fläche von <b>6.340 m²</b> vollständig mit byzantinischen Goldgrundmosaiken "
        "geschmückt – der größte zusammenhängende Mosaikzyklus der Welt. "
        "Der gewaltige <b>Christus Pantokrator</b> in der Apsis (Spannweite 13 m) dominiert "
        "den Raum. Die Mosaiken zeigen Szenen aus dem Alten und Neuen Testament in "
        "chronologischer Abfolge. "
        "Der <b>Kreuzgang</b> (1172–89) mit 228 Doppelsäulen ist ein Meisterwerk: "
        "Kein Kapitell gleicht dem anderen – romanische, arabische und byzantinische "
        "Motive verschmelzen. In einer Ecke: ein arabischer Brunnen."
    ))
    story.append(sp(3))

    mon_imgs = [
        (PUBLIC / "detail-Monreale-2.jpg", "Monreale – Kathedrale"),
        (PUBLIC / "detail-Monreale-3.jpg", "Monreale – Kreuzgang"),
    ]
    story.extend(img_pair(str(mon_imgs[0][0]), mon_imgs[0][1],
                          str(mon_imgs[1][0]), mon_imgs[1][1]))

    mon_mos_imgs = [
        (PUBLIC / "detail-Monreale-Mosaiken1.jpg", "Monreale – Christus Pantokrator"),
        (PUBLIC / "detail-Monreale-Mosaiken2.jpg", "Monreale – Mosaikzyklus"),
    ]
    story.extend(img_pair(str(mon_mos_imgs[0][0]), mon_mos_imgs[0][1],
                          str(mon_mos_imgs[1][0]), mon_mos_imgs[1][1]))

    story.append(sp(4))
    story.append(site_header("Monte Pellegrino"))
    story.append(site_text(
        "Der Monte Pellegrino (606 m) erhebt sich als markanter Felsklotz über Palermo. "
        "Goethe nannte ihn «das schönste Vorgebirge der Welt». Auf halber Höhe liegt die "
        "<b>Santuario di Santa Rosalia</b> – eine Grottenkirche in der Höhle, in der 1624 "
        "die Gebeine der Stadtheiligen gefunden wurden. Die Reliquien sollen Palermo von "
        "der Pest befreit haben. Vom Gipfel: Panorama über die gesamte Conca d'Oro "
        "(das «Goldene Becken» – die Ebene von Palermo) und die Küste."
    ))
    monte_img = find_image(PUBLIC / "7-FR-MontePellegrino.jpg")
    if monte_img:
        story.extend(img_block(monte_img, "Monte Pellegrino", max_w=130 * mm, max_h=85 * mm))

    story.append(pb())

    # ── DAY 8 (pages 53-54): Palermo Altstadt ──────────────────────────
    story.append(day_header(8, "Samstag, 4. April – Palermo · Abreise"))
    story.append(sp(6))

    story.append(site_header("Palermo – Altstadtrundgang"))
    story.append(site_text(
        "Am letzten Vormittag ein Rundgang durch die Altstadt Palermos. Die vier historischen "
        "Viertel (Mandamenti) treffen sich an den <b>Quattro Canti</b> (1611) – einem "
        "barocken Platzensemble am Kreuzungspunkt von Corso Vittorio Emanuele und Via Maqueda. "
        "Jede der vier konkaven Fassaden zeigt eine Jahreszeit, einen spanischen König und "
        "eine Schutzpatronin. Ganz in der Nähe: die <b>Piazza Pretoria</b> mit dem "
        "monumentalen Brunnen (1554, von Florentiner Bildhauern), im Volksmund "
        "«Piazza della Vergogna» (Platz der Schande) wegen seiner nackten Figuren. "
        "Ein Besuch der lebhaften Märkte <b>Ballarò</b>, <b>Vucciria</b> und <b>Capo</b> "
        "vermittelt orientalisches Flair. Am Nachmittag: Transfer zum Flughafen "
        "Falcone-Borsellino und Rückflug über München nach Salzburg."
    ))
    story.append(sp(3))

    pal_alt = find_image(PUBLIC / "8-SA-Palermo-Altstadt.jpg")
    if pal_alt:
        story.extend(img_block(pal_alt, "Palermo – Altstadtgasse", max_w=130 * mm, max_h=90 * mm))

    story.append(sp(6))
    story.append(HLine(CONTENT_W, GOLD, 1))
    story.append(sp(4))
    story.append(center("<b>Zusammenfassung der Reise</b>"))
    story.append(sp(2))
    story.append(body(
        "In 8 Tagen führt die Studienreise quer durch Sizilien – von den griechischen Tempeln "
        "im Westen über die römischen Mosaiken im Landesinneren und die Barockstädte im "
        "Südosten bis zu den normannischen Kathedralen im Norden. 1.315 Kilometer, "
        "7 UNESCO-Welterbestätten, 3.000 Jahre Geschichte – von der griechischen Kolonisation "
        "über die arabische Blütezeit und die normannische Pracht bis zum sizilianischen "
        "Barock. Dazu die Naturwunder: der majestätische Ätna, die spektakuläre "
        "Alcantara-Schlucht und die weißen Felsen der Scala dei Turchi."
    ))

    story.append(pb())

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # PAGES 55-62: EXTRA CONTENT (expanded to reach 60 pages)
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    # Page 55: Karte der antiken Stätten
    story.append(title1("Karte der antiken Stätten"))
    story.append(sp(4))
    antike = find_image(PUBLIC / "detail-Sizilien-Antike.jpg")
    if antike:
        story.extend(img_block(antike, "Sizilien – Antike Stätten", max_w=CONTENT_W, max_h=140 * mm))

    story.append(sp(4))
    s03 = find_image(PUBLIC / "architektur-bilder" / "seite_03.png")
    s04 = find_image(PUBLIC / "architektur-bilder" / "seite_04.png")
    if s03 and s04:
        story.extend(img_pair(s03, "Architektonische Details", s04, "Weitere Details"))
    elif s03:
        story.extend(img_block(s03, "Architektonische Details", max_w=140 * mm))

    story.append(pb())

    # Page 56: Theater & Kirchentypen
    story.append(title1("Antikes Theater und Kirchentypen"))
    story.append(sp(4))

    theater_rom = find_image(PUBLIC / "architektur-bilder" / "theater_roemisch_schema.png")
    theater_gr = find_image(PUBLIC / "architektur-bilder" / "theater_roemisch_grundriss.png")
    if theater_rom and theater_gr:
        story.extend(img_pair(theater_rom, "Antikes Theater – Schema",
                              theater_gr, "Theater – Grundriss"))
    elif theater_rom:
        story.extend(img_block(theater_rom, "Antikes Theater", max_w=140 * mm))

    story.append(sp(4))
    kirchen_schema = find_image(PUBLIC / "architektur-bilder" / "kirchentypen_schema.png")
    kirchen_gr = find_image(PUBLIC / "architektur-bilder" / "kirchentypen_grundriss.png")
    if kirchen_schema and kirchen_gr:
        story.extend(img_pair(kirchen_schema, "Kirchentypen – Schema",
                              kirchen_gr, "Kirchengrundrisse"))
    elif kirchen_schema:
        story.extend(img_block(kirchen_schema, "Kirchentypen", max_w=140 * mm))

    story.append(sp(4))
    story.append(body(
        "Das <b>griechische Theater</b> nutzte natürliche Hanglage: Die Cavea (Zuschauerraum) "
        "wurde in den Berghang geschnitten, die Orchestra (Tanzplatz des Chors) lag im Zentrum, "
        "die Skene (Bühnengebäude) bildete den Hintergrund. Die Akustik war herausragend – "
        "selbst Flüstern war in den obersten Reihen zu hören. Römer bauten freistehende Theater "
        "mit halbrundem Grundriss und aufgemauerter Cavea."
    ))
    story.append(sp(3))
    story.append(body(
        "<b>Sizilianische Theater:</b> Segesta (rein griechisch, spektakulärer Meerblick), "
        "Taormina (griechisch, römisch umgebaut, Ätna-Panorama), Syrakus (eines der größten "
        "der antiken Welt, 15.000 Plätze), Tindari (mit Blick auf die Äolischen Inseln), "
        "Akrai (intim, 600 Plätze). Die normannisch-arabische Architektur Siziliens vereint "
        "drei Traditionen: Grundriss und Mosaiken sind byzantinisch, die Stalaktitendecken "
        "(Muqarnas) arabisch, die Gesamtstruktur normannisch-romanisch."
    ))

    story.append(pb())

    # Page 57: Mythen und Legenden Siziliens
    story.append(title1("Mythen und Legenden Siziliens"))
    story.append(sp(4))

    story.append(title3("Persephone und der Raub durch Hades"))
    story.append(body(
        "Der berühmteste Mythos Siziliens: Hades, der Gott der Unterwelt, raubte Persephone "
        "(Proserpina), die Tochter der Erdgöttin Demeter, beim Blumenpflücken am See von "
        "Pergusa bei Enna. Demeter suchte verzweifelt ihre Tochter und ließ die Erde "
        "verdorren. Zeus vermittelte einen Kompromiss: Persephone verbringt ein Drittel "
        "des Jahres in der Unterwelt (Winter), zwei Drittel auf der Erde (Frühling und "
        "Sommer). Der Mythos erklärt den Wechsel der Jahreszeiten und die Fruchtbarkeit "
        "Siziliens – die Insel galt als Kornkammer Roms."
    ))
    persephone = find_image(PUBLIC / "text-Persephone.jpg")
    if persephone:
        story.extend(img_block(persephone, "Persephone-Mythos", max_w=130 * mm, max_h=85 * mm))

    story.append(sp(3))
    story.append(title3("Odysseus und die Kyklopen"))
    story.append(body(
        "Homer verlegte mehrere Abenteuer des Odysseus nach Sizilien: Am Ätna hauste "
        "der einäugige Riese Polyphem (Kyklop), dem Odysseus mit einer List entkam. "
        "Die Faraglioni-Felsen bei Aci Trezza gelten als die Steine, die der geblendete "
        "Polyphem dem fliehenden Schiff nachwarf. Skylla und Charybdis, die mythischen "
        "Meeresungeheuer, lauerten in der Meerenge von Messina. Die Äolischen Inseln "
        "waren der Palast des Windgottes Aiolos, der Odysseus einen Sack mit allen "
        "ungünstigen Winden schenkte."
    ))
    aiolos = find_image(PUBLIC / "text-Aiolos.jpg")
    if aiolos:
        story.extend(img_block(aiolos, "Aiolos – Gott der Winde", max_w=120 * mm, max_h=80 * mm))

    story.append(sp(3))
    story.append(title3("Empedokles und der Ätna"))
    story.append(body(
        "Empedokles von Akragas (495-435 v. Chr.), Philosoph und Begründer der "
        "Vier-Elemente-Lehre, soll sich der Legende nach in den Krater des Ätna gestürzt "
        "haben – entweder um seine Göttlichkeit zu beweisen oder aus wissenschaftlicher "
        "Neugier. Der Vulkan soll daraufhin eine seiner bronzenen Sandalen ausgespien haben. "
        "Friedrich Hölderlin widmete ihm sein unvollendetes Trauerspiel."
    ))
    empedokles = find_image(PUBLIC / "text-Empedokles.jpg")
    if empedokles:
        story.extend(img_block(empedokles, "Empedokles-Legende", max_w=120 * mm, max_h=80 * mm))

    story.append(sp(3))
    story.append(title3("Die Trinakria – Symbol Siziliens"))
    story.append(body(
        "Die Trinakria (Triskeles) – drei um ein Medusenhaupt angeordnete Beine – ist "
        "das uralte Symbol Siziliens. Der Name leitet sich vom griechischen Trinakria "
        "(Dreieck/Dreikap) ab und bezieht sich auf die drei Kaps der dreieckigen Insel: "
        "Capo Peloro (Nordosten), Capo Passero (Südosten) und Capo Lilibeo (Westen). "
        "Das Symbol findet sich bereits auf griechischen Münzen des 4. Jh. v. Chr. und "
        "ist heute die offizielle Flagge der Region Sizilien."
    ))
    trinacria = find_image(PUBLIC / "text-Trinacria.jpg")
    if trinacria:
        story.extend(img_block(trinacria, "Die Trinakria – Symbol Siziliens", max_w=100 * mm, max_h=70 * mm))

    story.append(pb())

    # Page 58: Texte und Anekdoten
    story.append(title1("Texte und Anekdoten"))
    story.append(sp(4))

    story.append(title3("Der Tod des Aischylos in Gela"))
    story.append(body(
        "Der große Tragödiendichter Aischylos verbrachte seine letzten Jahre in Gela. "
        "Der Legende nach wurde ihm prophezeit, er werde durch einen Schlag von oben sterben. "
        "Er mied fortan Gebäude und hielt sich im Freien auf. 456 v. Chr. ließ ein Adler "
        "eine Schildkröte auf seinen kahlen Kopf fallen, den er für einen Stein hielt, "
        "um den Panzer zu zerbrechen. So starb der größte Tragiker der Antike."
    ))
    aischylos = find_image(PUBLIC / "text-Aischylos.jpg")
    if aischylos:
        story.extend(img_block(aischylos, "Der Tod des Aischylos", max_w=120 * mm, max_h=80 * mm))

    story.append(sp(3))
    story.append(title3("Die Salinen von Trapani"))
    story.append(body(
        "Seit der Antike wird an der Westküste Siziliens zwischen Trapani und Marsala "
        "Meersalz gewonnen. Die Salzgewinnung erfolgt in flachen Becken, in denen "
        "das Meerwasser durch Sonne und Wind verdunstet. Die charakteristischen Windmühlen "
        "pumpten das Wasser von Becken zu Becken. Heute sind die Salinen ein Naturreservat "
        "und Rastplatz für Zugvögel, insbesondere Flamingos."
    ))
    salinen = find_image(PUBLIC / "text-Salinen.jpg")
    if salinen:
        story.extend(img_block(salinen, "Die Salinen von Trapani", max_w=120 * mm, max_h=80 * mm))

    story.append(sp(3))
    story.append(title3("Der Thunfischfang – Mattanza"))
    story.append(body(
        "Die Mattanza (vom spanischen matar = töten) war die traditionelle Methode des "
        "Thunfischfangs, die über Jahrhunderte in Favignana und anderen Orten Westsiziliens "
        "praktiziert wurde. Im Mai und Juni, wenn die Thunfische zum Laichen durch die "
        "Meerenge von Sizilien zogen, wurden sie mit einem System von Netzen (tonnara) "
        "in eine Todeskammer geleitet und dort von Fischern mit Harpunen erlegt. "
        "Die letzte Mattanza fand 2007 statt – ein Ende einer jahrtausendealten Tradition."
    ))
    thunfisch = find_image(PUBLIC / "text-Thunfisch.jpg")
    if thunfisch:
        story.extend(img_block(thunfisch, "Traditioneller Thunfischfang", max_w=120 * mm, max_h=80 * mm))

    story.append(sp(3))
    story.append(title3("Falcone und Borsellino – Kampf gegen die Mafia"))
    story.append(body(
        "Giovanni Falcone und Paolo Borsellino, beide in Palermo aufgewachsen, widmeten "
        "ihr Leben dem Kampf gegen die Cosa Nostra. Im Maxi-Prozess (1986-87) gelang es "
        "Falcone, 360 Mafiosi anzuklagen und 338 Verurteilungen zu erreichen. Am 23. Mai 1992 "
        "wurde Falcone durch eine Bombe auf der Autobahn bei Capaci getötet. 57 Tage später, "
        "am 19. Juli 1992, starb Borsellino bei einem Attentat in der Via d'Amelio in Palermo. "
        "Vor Falcones Wohnhaus steht heute der berühmte Falcone-Baum, an dem Besucher "
        "Gedenkbotschaften hinterlassen."
    ))
    falcone = find_image(PUBLIC / "text-Falcone.jpg")
    if falcone:
        story.extend(img_block(falcone, "Gedenken an Falcone", max_w=120 * mm, max_h=80 * mm))

    story.append(sp(3))
    story.append(title3("Papyrus am Fluss Ciane"))
    story.append(body(
        "Am Fluss Ciane bei Syrakus wächst der einzige natürliche Papyrusbestand Europas. "
        "Der Legende nach brachte Ptolemaios II. die Pflanze als Geschenk nach Syrakus. "
        "Wahrscheinlicher ist, dass arabische Händler sie im 9. Jahrhundert einführten. "
        "Die bis zu 5 m hohen Stauden bilden dichte Bestände entlang des Flusses, der "
        "seinen Namen von der Nymphe Kyane hat, die in eine Quelle verwandelt wurde, "
        "als sie versuchte, den Raub der Persephone zu verhindern."
    ))
    papyrus = find_image(PUBLIC / "text-Papyrus.jpg")
    if papyrus:
        story.extend(img_block(papyrus, "Papyrus am Fluss Ciane", max_w=120 * mm, max_h=80 * mm))

    story.append(pb())

    # Page 59: Mafia und Antimafia-Bewegung
    story.append(title1("Sizilien und die Mafia"))
    story.append(sp(4))

    story.append(body(
        "Die Cosa Nostra, landläufig als Mafia bezeichnet, entstand im 19. Jahrhundert "
        "in Westsizilien als System von Schutzgelderpressung und Patronage. Nach der "
        "Einigung Italiens 1860 füllte sie das Machtvakuum in einer Region, in der "
        "der Staat schwach war und die Großgrundbesitzer Schutz brauchten. "
        "Ihren Höhepunkt erreichte die Macht der Mafia in den 1970er und 80er Jahren, "
        "als der Heroinhandel enorme Profite einbrachte und Palermo von einem Krieg "
        "zwischen rivalisierenden Clans erschüttert wurde."
    ))
    story.append(sp(3))
    story.append(body(
        "Der Wendepunkt kam mit dem <b>Maxi-Prozess</b> (1986-87), den die Richter "
        "Giovanni Falcone und Paolo Borsellino gegen 475 Angeklagte führten. "
        "338 Verurteilungen, 19 lebenslange Haftstrafen. Die Mafia reagierte mit "
        "beispielloser Gewalt: Am 23. Mai 1992 wurde Falcone bei Capaci durch eine "
        "unter der Autobahn platzierte Bombe getötet. 57 Tage später, am 19. Juli 1992, "
        "starb Borsellino bei einem Attentat in Palermo. Die Morde lösten eine Welle "
        "der Empörung und eine Antimafia-Bewegung aus, die Sizilien nachhaltig veränderte."
    ))
    story.append(sp(3))

    mafia_fr = find_image(PUBLIC / "text-Mafia-Franziskus.jpg")
    mafia_sg = find_image(PUBLIC / "text-Mafia-Schutzgeld.jpg")
    if mafia_fr and mafia_sg:
        story.extend(img_pair(mafia_fr, "Papst Franziskus gegen die Mafia",
                              mafia_sg, "Addiopizzo-Bewegung"))
    elif mafia_fr:
        story.extend(img_block(mafia_fr, "Antimafia-Bewegung", max_w=120 * mm, max_h=80 * mm))

    story.append(sp(3))
    story.append(body(
        "Heute ist die Mafia in Sizilien zwar nicht verschwunden, aber deutlich geschwächt. "
        "Die <b>Addiopizzo-Bewegung</b> (gegründet 2004 in Palermo) ermutigt Geschäftsleute, "
        "Schutzgeld zu verweigern. Über 1.000 Betriebe und 13.000 Konsumenten unterstützen "
        "die Initiative. In den letzten Jahrzehnten wurden zahlreiche Bosse verhaftet, "
        "darunter 2006 Bernardo Provenzano nach 43 Jahren Flucht. Die Beschlagnahmung "
        "von Mafia-Vermögen und dessen Umwidmung für soziale Zwecke (Gesetz 109/1996) "
        "ist ein wichtiges Instrument der Antimafia-Arbeit."
    ))

    story.append(sp(3))
    story.append(title3("Die Schwarze Madonna von Tindari"))
    story.append(body(
        "In der Wallfahrtskirche von Tindari wird eine byzantinische Schwarze Madonna "
        "aus Zedernholz verehrt, die der Legende nach aus Konstantinopel stammt. "
        "Während des Bildersturms im 8. Jahrhundert wurde sie auf einem Schiff versteckt, "
        "das vor Tindari ankerte. Als die Bewohner die Statue an Land bringen wollten, "
        "ließ sich das Schiff nicht mehr bewegen – ein Zeichen, dass die Madonna hier "
        "bleiben wollte. Unter der Figur steht die Inschrift: Nigra sum sed formosa "
        "(Ich bin schwarz, aber schön – Hohelied 1,5)."
    ))
    madonna = find_image(PUBLIC / "text-Tindari-Madonna.jpg")
    if madonna:
        story.extend(img_block(madonna, "Die Schwarze Madonna von Tindari", max_w=110 * mm, max_h=75 * mm))

    story.append(sp(3))
    story.append(title3("Bimsstein auf Lipari"))
    story.append(body(
        "Die Insel Lipari war seit der Jungsteinzeit ein Zentrum des Obsidian-Handels – "
        "das schwarze Vulkanglas wurde als Werkzeug und Waffe im gesamten Mittelmeerraum "
        "geschätzt. Später wurde der Abbau von Bimsstein zur wichtigsten Einnahmequelle. "
        "Die weißen Bimssteinbrüche im Nordosten der Insel, die das Meer milchig weiß "
        "färbten, wurden 2007 aus Umweltschutzgründen geschlossen. Das archäologische "
        "Museum auf der Burg von Lipari besitzt eine der bedeutendsten Sammlungen "
        "griechischer Theatermasken aus Terrakotta."
    ))
    bimsstein = find_image(PUBLIC / "text-Lipari-Bimsstein.jpg")
    if bimsstein:
        story.extend(img_block(bimsstein, "Bimsstein auf Lipari", max_w=110 * mm, max_h=75 * mm))

    story.append(pb())

    # Sizilianische Spezialitäten
    story.append(title1("Sizilianische Spezialitäten"))
    story.append(sp(4))

    story.append(site_text(
        "Die sizilianische Küche ist ein Spiegel der Inselgeschichte – griechische, "
        "arabische, normannische, spanische und französische Einflüsse verbinden sich zu "
        "einer der reichsten Regionalküchen Italiens."
    ))
    story.append(sp(3))

    food_items = [
        ("<b>Arancini</b>: Frittierte Reisbällchen, gefüllt mit Ragù, Erbsen und Käse – "
         "das sizilianische Fast Food schlechthin. In Palermo spitz (arancina), in Catania rund."),
        ("<b>Cannoli</b>: Knusprige Teigröhren gefüllt mit süßer Ricotta-Creme, "
         "Pistazien und kandierten Früchten. Das berühmteste Dessert Siziliens."),
        ("<b>Pasta alla Norma</b>: Pasta mit Auberginen, Tomatensugo und gesalzenem "
         "Ricotta – benannt nach Bellinis Oper, Nationalgericht Catanias."),
        ("<b>Caponata</b>: Süßsaures Auberginengemüse mit Kapern, Oliven und Sellerie. "
         "Arabischer Einfluss (agrodolce)."),
        ("<b>Granita</b>: Halbgefrorenes aus Fruchtmark oder Mandelmilch, "
         "traditionell zum Frühstück mit Brioche. Spezialität von Messina und Catania."),
        ("<b>Cassata Siciliana</b>: Festliche Torte aus Ricotta, Marzipan und kandierten "
         "Früchten – arabischen Ursprungs."),
        ("<b>Couscous di pesce</b>: Fisch-Couscous, Spezialität von Trapani – "
         "direktes Erbe der arabischen Küche."),
        ("<b>Pasta con le sarde</b>: Pasta mit frischen Sardinen, wildem Fenchel, "
         "Pinienkernen und Rosinen – ein Klassiker Palermos."),
    ]
    for fi in food_items:
        story.append(Paragraph(fi, S['BodySmall']))
        story.append(sp(2))

    story.append(sp(3))
    # Food images
    arancini = find_image(PUBLIC / "arancini.jpg")
    cannoli = find_image(PUBLIC / "cannoli.jpg")
    if arancini and cannoli:
        story.extend(img_pair(arancini, "Arancini", cannoli, "Cannoli"))

    granita = find_image(PUBLIC / "granita.jpg")
    pasta = find_image(PUBLIC / "pasta.jpg")
    if granita and pasta:
        story.extend(img_pair(granita, "Granita con Brioche", pasta, "Pasta alla Norma"))

    story.append(sp(4))
    story.append(title3("Restaurantempfehlungen"))
    rest_data = [
        ["Stadt", "Restaurant", "Spezialität"],
        ["Marsala", "Trattoria Garibaldi", "Couscous di pesce, Marsala-Wein"],
        ["Agrigento", "Trattoria dei Templi", "Pasta con le sarde, Caponata"],
        ["Siracusa", "Taverna Sveva (Ortigia)", "Frischer Fisch, Pasta alla Norma"],
        ["Taormina", "Trattoria da Nino", "Arancini, Granita"],
        ["Cefalù", "Osteria del Duomo", "Pesce spada, Cannoli"],
        ["Palermo", "Antica Focacceria S. Francesco", "Panelle, Sfincione, Arancine"],
    ]
    story.append(styled_table(rest_data, col_widths=[28 * mm, 55 * mm, CONTENT_W - 83 * mm]))

    story.append(sp(6))
    story.append(title2("Sizilianische Weine"))
    story.append(sp(2))
    story.append(body(
        "Sizilien ist mit 98.000 Hektar Rebfläche die größte Weinregion Italiens und "
        "produziert mehr Wein als ganz Australien. Die wichtigsten Rebsorten und Weine:"
    ))
    story.append(sp(2))
    wein_items = [
        ("<b>Nero d'Avola</b>: Die bedeutendste rote Rebsorte Siziliens – vollmundig, "
         "dunkle Frucht, weiche Tannine. Benannt nach der Barockstadt Avola bei Noto."),
        ("<b>Marsala</b>: Likörwein (DOC seit 1969), trocken bis süß, bernsteinfarben. "
         "1773 vom Engländer John Woodhouse als sizilianische Antwort auf Sherry und Port popularisiert."),
        ("<b>Etna Rosso / Bianco</b>: Weine vom Ätna, DOC seit 1968. Angebaut auf "
         "vulkanischen Böden bis 1.000 m Höhe. Rebsorte Nerello Mascalese (rot), Carricante (weiß)."),
        ("<b>Passito di Pantelleria</b>: Süßer Dessertwein aus getrockneten Zibibbo-Trauben "
         "(Muskateller) von der Insel Pantelleria. UNESCO-Weltkulturerbe der Anbaumethode."),
        ("<b>Cerasuolo di Vittoria</b>: Einziges DOCG-Weinbaugebiet Siziliens (seit 2004). "
         "Blend aus Nero d'Avola und Frappato – fruchtig, eleganter Rotwein."),
        ("<b>Grillo / Catarratto / Inzolia</b>: Die drei wichtigsten weißen Rebsorten. "
         "Grillo ergibt frische, mineralische Weißweine, Catarratto ist die meistangebaute "
         "Weißweinsorte Italiens."),
    ]
    for wi in wein_items:
        story.append(Paragraph(wi, S['BodySmall']))
        story.append(sp(1))

    story.append(sp(3))
    story.append(title2("Praktische Tipps"))
    story.append(sp(2))
    tipps = [
        "<b>Trinkgeld:</b> In Restaurants ist ein Coperto (Gedeck, 1-3 Euro) üblich. "
        "Trinkgeld (mancia) ist nicht obligatorisch, 5-10% werden aber geschätzt.",
        "<b>Öffnungszeiten:</b> Archäologische Stätten: meist 9:00-19:00 (Sommer), "
        "Museen: oft Mo geschlossen. Kirchen: 8:00-12:00 und 16:00-19:00 (Mittagspause!).",
        "<b>Kleidung:</b> Für Kirchenbesichtigungen bedeckte Schultern und Knie erforderlich. "
        "Bequemes Schuhwerk für archäologische Stätten unbedingt empfohlen.",
        "<b>Sonnenschutz:</b> Sizilien hat 2.600 Sonnenstunden/Jahr. Sonnencreme (SPF 30+), "
        "Kopfbedeckung und ausreichend Wasser sind unverzichtbar.",
        "<b>Siesta:</b> Zwischen 13:00 und 16:00 sind viele Geschäfte geschlossen. "
        "Die beste Zeit für Besichtigungen ist morgens vor 11:00 oder ab 16:00.",
    ]
    for tip in tipps:
        story.append(Paragraph(tip, S['BodySmall']))
        story.append(sp(2))

    story.append(pb())

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # GLOSSAR
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    story.append(title1("Italienisches Glossar"))
    story.append(sp(4))

    def glossar_section(title_text, entries):
        items = [title3(title_text), sp(2)]
        gl_data = [["Italienisch", "Deutsch"]]
        for it, de in entries:
            gl_data.append([
                Paragraph(f"<b>{it}</b>", S['GlossarEntry']),
                Paragraph(de, S['GlossarEntry'])
            ])
        gt = styled_table(gl_data, col_widths=[CONTENT_W * 0.45, CONTENT_W * 0.55])
        items.append(gt)
        items.append(sp(4))
        return items

    story.extend(glossar_section("Begrüßung", [
        ("buongiorno", "Guten Tag"),
        ("buonasera", "Guten Abend"),
        ("ciao", "Hallo / Tschüss"),
        ("arrivederci", "Auf Wiedersehen"),
        ("grazie", "Danke"),
        ("per favore / prego", "Bitte / Bitte (Antwort)"),
        ("scusi", "Entschuldigung"),
    ]))

    story.extend(glossar_section("Restaurant", [
        ("acqua naturale / frizzante", "stilles / sprudelndes Wasser"),
        ("vino rosso / bianco", "Rotwein / Weißwein"),
        ("primo piatto", "Erster Gang (Pasta, Risotto)"),
        ("secondo piatto", "Zweiter Gang (Fleisch, Fisch)"),
        ("contorno", "Beilage"),
        ("dolce", "Nachspeise"),
        ("il conto, per favore", "Die Rechnung, bitte"),
        ("quanto costa?", "Wie viel kostet das?"),
    ]))

    story.extend(glossar_section("Sehenswürdigkeiten", [
        ("la chiesa", "die Kirche"),
        ("il duomo / la cattedrale", "der Dom / die Kathedrale"),
        ("il museo", "das Museum"),
        ("il teatro", "das Theater"),
        ("la piazza", "der Platz"),
        ("l'ingresso", "der Eingang"),
        ("chiuso / aperto", "geschlossen / geöffnet"),
    ]))

    story.extend(glossar_section("Unterwegs", [
        ("dov'è...?", "Wo ist...?"),
        ("a destra / a sinistra", "rechts / links"),
        ("diritto / sempre dritto", "geradeaus"),
        ("la stazione", "der Bahnhof"),
        ("l'aeroporto", "der Flughafen"),
        ("la spiaggia", "der Strand"),
        ("la fermata", "die Haltestelle"),
        ("il biglietto", "die Fahrkarte/das Ticket"),
    ]))

    story.extend(glossar_section("Notfälle", [
        ("aiuto!", "Hilfe!"),
        ("chiamate un'ambulanza", "Rufen Sie einen Krankenwagen"),
        ("polizia / carabinieri", "Polizei"),
        ("il pronto soccorso", "die Notaufnahme"),
        ("ho bisogno di un medico", "Ich brauche einen Arzt"),
        ("la farmacia", "die Apotheke"),
        ("l'ospedale", "das Krankenhaus"),
    ]))

    story.extend(glossar_section("Zahlen", [
        ("uno, due, tre", "eins, zwei, drei"),
        ("quattro, cinque, sei", "vier, fünf, sechs"),
        ("sette, otto, nove", "sieben, acht, neun"),
        ("dieci, venti, trenta", "zehn, zwanzig, dreißig"),
        ("cinquanta, cento", "fünfzig, hundert"),
        ("mille", "tausend"),
    ]))

    story.append(pb())

    # Wichtige Adressen und Informationen
    story.append(title1("Wichtige Informationen"))
    story.append(sp(4))

    story.append(title3("Notrufnummern"))
    notruf_data = [
        ["Dienst", "Nummer"],
        ["Europäischer Notruf", "112"],
        ["Polizei (Carabinieri)", "112"],
        ["Polizei (Polizia di Stato)", "113"],
        ["Feuerwehr (Vigili del Fuoco)", "115"],
        ["Rettungsdienst (Ambulanza)", "118"],
        ["Pannenhilfe ACI", "803 116"],
        ["Botschaft (Wien)", "+39 06 844 0141"],
    ]
    story.append(styled_table(notruf_data, col_widths=[CONTENT_W * 0.55, CONTENT_W * 0.45]))
    story.append(sp(6))

    story.append(title3("Flugdaten"))
    story.append(body(
        "<b>Hinflug (28. März 2026):</b> Salzburg - München (Bus/Bahn), "
        "Lufthansa München - Palermo."
    ))
    story.append(body(
        "<b>Rückflug (4. April 2026):</b> Lufthansa Palermo - München, "
        "München - Salzburg (Bus/Bahn)."
    ))
    story.append(sp(4))

    story.append(title3("Allgemeine Hinweise"))
    story.append(sp(2))
    hinweise = [
        "<b>Zeitzone:</b> MEZ (wie Österreich) – keine Zeitumstellung nötig.",
        "<b>Währung:</b> Euro (wie Österreich).",
        "<b>Strom:</b> 220V, italienische Steckdosen (Typ L) – Adapter empfohlen!",
        "<b>Trinkwasser:</b> Leitungswasser in Sizilien ist grundsätzlich trinkbar, "
        "in Hotels und Restaurants wird jedoch Mineralwasser (acqua minerale) serviert.",
        "<b>Kreditkarten:</b> Visa und Mastercard werden weitgehend akzeptiert, "
        "in kleinen Geschäften und auf Märkten Bargeld bereithalten.",
        "<b>Beste Besuchszeit:</b> Ende März/Anfang April ist ideal – angenehme "
        "Temperaturen (15-22°C), Mandelblüte, weniger Touristen als im Sommer.",
        "<b>Reiseversicherung:</b> EHIC (Europäische Krankenversicherungskarte) "
        "mitführen. Zusätzliche Reiseversicherung empfohlen.",
    ]
    for h in hinweise:
        story.append(Paragraph(h, S['BodySmall']))
        story.append(sp(2))

    story.append(sp(4))
    story.append(HLine(CONTENT_W, GOLD, 0.5))
    story.append(sp(4))
    story.append(center("<i>Wir wünschen allen Teilnehmern eine wunderbare Studienreise!</i>"))
    story.append(sp(2))
    story.append(center("Dr. Paul Dienstbier"))

    story.append(pb())

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # TEXTE ZU SIZILIEN – Full texts from the website
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    story.append(title1("Texte zu Sizilien"))
    story.append(sp(4))
    story.append(body(
        "Die folgenden Texte bieten eine Sammlung antiker und moderner Quellen, die auf der "
        "Studienreise an den jeweiligen Stätten gelesen und besprochen werden. Die Originaltexte "
        "werden mit deutscher Übersetzung und Erläuterungen dargeboten."
    ))
    story.append(sp(4))
    story.append(HLine(CONTENT_W, GOLD, 0.5))
    story.append(sp(6))

    # ── Mythologische Texte ──
    story.append(GoldBar("Mythologische Texte", height=22, font_size=11))
    story.append(sp(6))

    # Persephone – Der Raub bei Enna (Ovid)
    story.append(title3("Persephone – Der Raub bei Enna"))
    story.append(italic("Ovid (43 v. Chr.–17 n. Chr.), Metamorphosen V, 385–396"))
    story.append(sp(2))
    story.append(body(
        "<b>Lateinisch:</b> Haud procul Hennaeis lacus est a moenibus altae, "
        "nomine Pergus, aquae: non illo plura Caystros "
        "carmina cycnorum labentibus audit in undis. "
        "silva coronat aquas cingens latus omne suisque "
        "frondibus ut velo Phoebeos submovet ictus; "
        "frigora dant rami, Tyrios humus umida flores: "
        "perpetuum ver est. "
        "quo dum Proserpina luco "
        "ludit et aut violas aut candida lilia carpit, "
        "paene simul visa est dilectaque raptaque Diti: "
        "usque adeo est properatus amor."
    ))
    story.append(sp(2))
    story.append(body(
        "<b>Übersetzung:</b> Nicht weit von Hennas hohen Mauern liegt ein See namens Pergus; "
        "kein See hört mehr Schwäne auf seinen gleitenden Wellen. "
        "Wald umkrönt das Wasser und wehrt mit seinen Zweigen Phöbus' Strahlen ab; "
        "die Äste schenken Kühle, der feuchte Boden trägt tyrische Blumen: "
        "ewiger Frühling herrscht hier. In diesem Hain spielte Proserpina und pflückte "
        "Veilchen oder weiße Lilien – kaum war sie gesehen, da liebte und entführte sie "
        "Dis: so eilig war seine Liebe."
    ))
    story.append(sp(2))
    story.append(HLine(CONTENT_W, GOLD, 0.5))
    story.append(sp(4))

    # Polyphem – Der Zyklop und Odysseus
    story.append(title3("Polyphem – Der Zyklop und Odysseus"))
    story.append(italic("Homer (ca. 8. Jh. v. Chr.), Odyssee IX, 366–367"))
    story.append(sp(2))
    story.append(body(
        "«Niemand ist mein Name; Niemand nennen mich Mutter und Vater und alle anderen "
        "Gefährten.» – Mit diesem Trick entkommt Odysseus dem geblendeten Zyklopen Polyphem "
        "auf Sizilien. Die schwarzen Faraglioni-Felsen bei Aci Trezza (Catania) gelten als die "
        "Felsbrocken, die Polyphem nach dem fliehenden Schiff warf."
    ))
    story.append(sp(2))
    story.append(HLine(CONTENT_W, GOLD, 0.5))
    story.append(sp(4))

    # Skylla und Charybdis
    story.append(title3("Skylla und Charybdis – Die Meerenge von Messina"))
    story.append(italic("Homer (ca. 8. Jh. v. Chr.), Odyssee XII, 73"))
    story.append(sp(2))
    story.append(body(
        "Die Meerenge von Messina zwischen Sizilien und dem Festland galt in der Antike als Sitz "
        "der beiden Ungeheuer: Charybdis, die das Meer dreimal täglich verschlingt, und Skylla mit "
        "ihren sechs Köpfen."
    ))
    story.append(sp(2))
    story.append(HLine(CONTENT_W, GOLD, 0.5))
    story.append(sp(4))

    # Arethusa
    story.append(title3("Arethusa – Die Nymphe unter dem Meer"))
    story.append(italic("Ovid, Metamorphosen V, 487–490 & 572–576"))
    story.append(sp(2))
    story.append(body(
        "<b>Lateinisch:</b> pars ego nympharum, quae sunt in Achaide, una fui... "
        "ergo dum Stygio sub terris gurgite labor, "
        "visa tua est oculis illic Proserpina nostris: "
        "illa quidem tristis neque adhuc interrita vultu, "
        "sed regina tamen, sed opaci maxima mundi, "
        "sed tamen inferni pollens matrona tyranni."
    ))
    story.append(sp(2))
    story.append(body(
        "<b>Übersetzung:</b> Ich war eine unter den Nymphen Achaias... Während ich unter der "
        "Erde durch den stygischen Strudel mühsam zog, sah ich dort mit meinen Augen deine "
        "Proserpina: sie war zwar traurig und noch verängstigt im Gesicht, aber dennoch schon "
        "Königin – Herrin der dunklen Welt, mächtige Herrin des Unterwelt-Tyrannen. "
        "Die Quelle der Arethusa auf der Insel Ortygia in Syrakus existiert noch heute."
    ))
    story.append(sp(2))
    story.append(HLine(CONTENT_W, GOLD, 0.5))
    story.append(sp(4))

    # Daidalos und König Kokalos
    story.append(title3("Daidalos und König Kokalos"))
    story.append(italic("Diodoros Sikeliotes (ca. 90–30 v. Chr.), Bibliotheke historike IV, 77–79"))
    story.append(sp(2))
    story.append(body(
        "Daidalos, der kunstfertigste Handwerker seiner Zeit, lebte am Hof des König Minos auf "
        "Kreta. Als er dem Ungeheuer Minotauros durch den Bau des Labyrinths diente, geriet er in "
        "Ungnade: Minos sperrte ihn samt seinem Sohn Ikaros ein. Doch Daidalos fertigte sich und "
        "seinem Sohn Flügel aus Federn und Wachs. Ikaros flog zu hoch, das Wachs schmolz in der "
        "Sonne – er stürzte ins Meer, das seitdem «Ikarisches Meer» heißt."
    ))
    story.append(sp(2))
    story.append(body(
        "Daidalos selbst entkam nach Sizilien zum König Kokalos, wo er in dessen Dienst "
        "herrliche Werke schuf: eine uneinnehmbare Burg auf dem Felsplateau von Kamikos, "
        "einen Schwitzbad-Palast, einen Tempel der Aphrodite auf dem Gipfel von Érice – "
        "und goldene Waben als Weihgeschenk für die Göttin."
    ))
    story.append(sp(2))
    story.append(body(
        "Minos, der mächtigste Herr der Meere, rüstete eine gewaltige Flotte aus und segelte "
        "nach Sizilien, um Daidalos zurückzufordern. Kokalos empfing ihn scheinbar freundlich als "
        "Gast und versprach, den Flüchtling auszuliefern. Doch seine Töchter, die Daidalos "
        "liebgewonnen hatten, leiteten siedendes Wasser durch Röhren in das Bad des Königs. "
        "So fand Minos, Herr der Meere und Richter der Toten, auf sizilischem Boden seinen Tod "
        "– und Daidalos blieb für immer frei."
    ))
    story.append(sp(2))
    story.append(HLine(CONTENT_W, GOLD, 0.5))
    story.append(sp(4))

    # Hephaistos am Ätna
    story.append(title3("Hephaistos am Ätna – Die Schmiede der Götter"))
    story.append(italic("Vergil (70–19 v. Chr.), Aeneis VIII, 415–422"))
    story.append(sp(2))
    story.append(body(
        "<b>Lateinisch:</b> insula Sicanium iuxta latus Aeoliamque / "
        "erigitur Liparen fumantibus ardua saxis, / "
        "quam subter specus et Cyclopum exesa caminis / "
        "antra Aetnaea tonant..."
    ))
    story.append(sp(2))
    story.append(body(
        "<b>Übersetzung:</b> Die Insel Lipara erhebt sich nahe der sizilischen Küste, hoch "
        "aufragend mit rauchenden Felsen. Darunter donnern die Höhlen der Kyklopen, ausgehöhlt "
        "von den Schmiedeöfen des Ätna. Man hört das Hallen der Hammerschläge auf den Ambossen; "
        "der Stahl zischt in den Grotten, Feuer keucht aus den Öfen: Dies ist Vulcans Haus – "
        "das Land trägt seinen Namen."
    ))
    story.append(sp(2))
    story.append(HLine(CONTENT_W, GOLD, 0.5))
    story.append(sp(4))

    # Empedokles Fragment
    story.append(title3("Empedokles – Ich bin ein unsterblicher Gott"))
    story.append(italic("Empedokles (ca. 490–430 v. Chr.), Fragment B112 (nach Diels-Kranz)"))
    story.append(sp(2))
    story.append(body(
        "<b>Übersetzung:</b> Freunde, ihr die ihr am Ufer des gelben Akragas wohnt, "
        "auf der Höhe der Stadt, sorgsam um gute Werke, "
        "ehrwürdige Häfen für Fremde, unkundig des Bösen – "
        "seid gegrüßt! Ich aber wandle unter euch als unsterblicher Gott, kein Sterblicher mehr, "
        "von allen geehrt, wie es sich ziemt, "
        "bekränzt mit Bändern und blühenden Kränzen."
    ))
    story.append(sp(2))
    story.append(body(
        "<i>Dieses Fragment des Empedokles ist eines der kühnsten Selbstzeugnisse der Antike: "
        "Ein Mensch erklärt sich selbst zum Gott. Empedokles aus Akragas (Agrigento) war "
        "Philosoph, Arzt, Politiker und religiöser Wundertäter.</i>"
    ))
    story.append(sp(2))
    story.append(HLine(CONTENT_W, GOLD, 0.5))
    story.append(sp(4))

    # Theokrit
    story.append(title3("Theokrit – Der verliebte Kyklop"))
    story.append(italic("Theokrit (ca. 300–260 v. Chr.), Idyll XI, 19–34"))
    story.append(sp(2))
    story.append(body(
        "<b>Übersetzung:</b> O Galateia, warum weist du zurück, der dich liebt – "
        "du, weißer als Quark anzuschauen, zarter als ein Lamm, "
        "lebhafter als ein junges Rind, reifer als eine unreife Traube? "
        "Du kommst, wenn der süße Schlaf mich hält, "
        "und gehst sofort fort, wenn der süße Schlaf mich loslässt; "
        "du fliehst wie ein Schaf, das den grauen Wolf erblickt hat."
    ))
    story.append(sp(2))
    story.append(body(
        "<i>Theokrit aus Syrakus gilt als Begründer der Bukolik (Hirtendichtung). "
        "Das 11. Idyll ist eine komische Umkehrung des Polyphem-Mythos: Der gefürchtete "
        "Kyklop ist ein plumper Liebhaber.</i>"
    ))
    story.append(sp(2))
    story.append(HLine(CONTENT_W, GOLD, 0.5))
    story.append(sp(4))

    story.append(pb())

    # ── Historische Texte ──
    story.append(GoldBar("Historische Texte", height=22, font_size=11))
    story.append(sp(6))

    # Cicero über Sizilien
    story.append(title3("Cicero über Sizilien – Insel der Ceres und Persephone"))
    story.append(italic("Cicero (106–43 v. Chr.), In Verrem II, 4, 106–108"))
    story.append(sp(2))
    story.append(body(
        "<b>Lateinisch:</b> Vetus est haec opinio, iudices, quae constat ex antiquissimis "
        "Graecorum litteris atque monumentis, insulam Siciliam esse a Cerere et Libera "
        "inventam atque in ea primum fruges repertas esse..."
    ))
    story.append(sp(2))
    story.append(body(
        "<b>Übersetzung:</b> Es ist eine alte Überzeugung, ihr Richter, die durch die ältesten "
        "griechischen Schriften und Zeugnisse bestätigt wird: dass die Insel Sizilien von Ceres "
        "und Libera entdeckt worden sei und dass dort zuerst das Getreide gefunden wurde. "
        "Denn als Libera (Persephone) von Pluto geraubt wurde und Ceres sie suchend beklagte, "
        "da wurde zuerst auf dieser Insel ihre Spur entdeckt, hier wurde zuerst ihr Klagen "
        "gehört; von hier irrte die Mutter in alle Länder umher."
    ))
    story.append(sp(2))
    story.append(body(
        "<i>Cicero verbindet in diesem Abschnitt seiner Anklage gegen Verres die Würde Siziliens "
        "mit dem Mythos von Demeter und Persephone. Der See bei Enna ist der heutige Lago di "
        "Pergusa – in der Antike galt er als Eingang zur Unterwelt.</i>"
    ))
    story.append(sp(2))
    story.append(HLine(CONTENT_W, GOLD, 0.5))
    story.append(sp(4))

    # Cicero über Syrakus
    story.append(title3("Cicero über Syrakus"))
    story.append(italic("Cicero, In Verrem II, 4.117"))
    story.append(sp(2))
    story.append(body(
        "<b>Lateinisch:</b> Urbem Syracusas maximam esse Graecarum, pulcherrimam omnium "
        "saepe audistis."
    ))
    story.append(sp(2))
    story.append(body(
        "<b>Übersetzung:</b> Ihr habt oft gehört, dass Syrakus die größte aller griechischen "
        "Städte sei, die schönste von allen. So ist es, ihr Richter, wie man sagt."
    ))
    story.append(sp(2))
    story.append(HLine(CONTENT_W, GOLD, 0.5))
    story.append(sp(4))

    # Die Schlacht bei Himera
    story.append(title3("Die Schlacht bei Himera – Gelon besiegt die Karthager"))
    story.append(italic("Herodot (ca. 484–425 v. Chr.), Historien 7,165–167"))
    story.append(sp(2))
    story.append(body(
        "<b>Übersetzung:</b> Am selben Tag aber geschah es, dass Gelon und Theron in Sizilien "
        "über den Karthager Hamilkar siegten — und die Griechen über den Perser bei Salamis. "
        "Die Parallelität von Himera (480 v. Chr.) und Salamis war in der Antike ein vielzitierter "
        "Topos."
    ))
    story.append(sp(2))
    story.append(HLine(CONTENT_W, GOLD, 0.5))
    story.append(sp(4))

    # Thukydides – Die Athener in den Latomien
    story.append(title3("Thukydides – Die Athener in den Latomien"))
    story.append(italic("Thukydides (ca. 460–400 v. Chr.), Historien VII, 87"))
    story.append(sp(2))
    story.append(body(
        "<b>Übersetzung:</b> Die aber in den Steinbrüchen wurden in den ersten Zeiten aufs härteste "
        "behandelt. Denn da ihrer viele waren auf engem Raum, unter freiem Himmel und ohne Dach, "
        "trafen sie noch die Strahlen der Sonne und die Schwüle; die Nächte aber, die herbstlich "
        "und kalt einfielen, brachten durch den Wechsel Krankheiten; alles mussten sie an derselben "
        "Stelle verrichten aus Platzmangel, und die Toten lagen beieinander aufeinander – "
        "und die Gerüche waren unerträglich."
    ))
    story.append(sp(2))
    story.append(body(
        "<i>Im Jahr 413 v. Chr. scheiterte die größte Expedition, die Athen je ausgerüstet hatte: "
        "40.000 Soldaten, 200 Schiffe – vernichtet vor Syrakus. Die Überlebenden wurden in die "
        "Latomien (Steinbrüche) getrieben, die noch heute in Syrakus zu besichtigen sind.</i>"
    ))
    story.append(sp(2))
    story.append(HLine(CONTENT_W, GOLD, 0.5))
    story.append(sp(4))

    # Platon in Syrakus
    story.append(title3("Platon – Erfahrungen in Syrakus"))
    story.append(italic("Platon (428–348 v. Chr.), Epistula VII, 326b–327a"))
    story.append(sp(2))
    story.append(body(
        "<b>Übersetzung:</b> Als ich nach Syrakus kam, damals jung – was soll ich sagen? "
        "Als alter Mann schreibe ich dies jetzt –, da kam ich zu Dionysios. "
        "Das Leben der Stadt der Syrakusaner beunruhigte mich: "
        "das Leben eines syrakusanischen Glücks, voll italischer und syrakusanischer Tafeln."
    ))
    story.append(sp(2))
    story.append(body(
        "<i>Platon besuchte Syrakus dreimal: 388, 367 und 361 v. Chr. Bei seinem ersten Besuch "
        "ließ ihn Dionysios I. als Sklaven verkaufen. Beim zweiten Besuch sollte er den jungen "
        "Dionysios II. zum Philosophenkönig erziehen – das Experiment scheiterte grandios.</i>"
    ))
    story.append(sp(2))
    story.append(HLine(CONTENT_W, GOLD, 0.5))
    story.append(sp(4))

    # Pindar über Ätna
    story.append(title3("Pindar über Ätna und Sizilien"))
    story.append(italic("Pindar (ca. 522–443 v. Chr.), Pythische Ode 1, 13–28"))
    story.append(sp(2))
    story.append(body(
        "<b>Übersetzung:</b> Und in Aitna liegt er unten, die Säule des Himmels, die alles "
        "aufnimmt – der schneebedeckte Aitna, ganzjähriger Nährvater des beißenden Schnees. "
        "Aus seinen Tiefen schießen unzugängliche Quellen reinen Feuers. "
        "Bei Tage strömen die Flüsse glühenden Rauchs; "
        "doch in den Nächten schleppt die rote, rollende Flamme "
        "die Felsen mit Getöse hinab auf die tiefe Fläche des Meeres."
    ))
    story.append(sp(2))
    story.append(HLine(CONTENT_W, GOLD, 0.5))
    story.append(sp(4))

    # Strabon
    story.append(title3("Strabon – Geographische Beschreibung Siziliens"))
    story.append(italic("Strabon (ca. 64 v. Chr.–24 n. Chr.), Geographika VI, 2"))
    story.append(sp(2))
    story.append(body(
        "<b>Übersetzung:</b> Sizilien ist von dreieckiger Gestalt; daher wurde es früher "
        "Trinakria, dann Thrinakia genannt, schließlich erhielt es den Namen Sikelia. "
        "In der Nähe liegt der Ätna, der höchste Berg Siziliens, dessen Gipfel kahl ist und "
        "im Winter stets Schnee trägt. Syrakus aber ist die berühmteste Stadt und war immer "
        "der Führung am würdigsten."
    ))
    story.append(sp(2))
    story.append(HLine(CONTENT_W, GOLD, 0.5))
    story.append(sp(4))

    story.append(pb())

    # ── Zeitgenössische Texte ──
    story.append(GoldBar("Zeitgenössische Texte und Dichtung", height=22, font_size=11))
    story.append(sp(6))

    # Goethe über Monte Pellegrino
    story.append(title3("Goethe über Monte Pellegrino"))
    story.append(italic("Johann Wolfgang von Goethe, Italienische Reise (Palermo, 3. April 1787)"))
    story.append(sp(2))
    story.append(body(
        "Der Monte Pellegrino liegt gerade gegenüber meiner Wohnung, ein großes Vorgebirge am "
        "Meerbusen. Im ersten Augenblick war es mir wie ein Idol, das mich anschaut; immer sah "
        "ich ihn wie einen Freund an. Er hat eine gar sonderliche Gestalt und eine eigene "
        "Physiognomie: Kalksteinfels, fast senkrecht aus dem Meere tretend, kein Baum, kein "
        "Strauch daran zu sehen – und doch von einer großen, ehrwürdigen Gestalt."
    ))
    story.append(sp(2))
    story.append(body(
        "Was den Charakter dieser Gegend im allgemeinen betrifft, so kann ich sagen: Es ist "
        "alles hier in einem gewissen höheren Sinne schön. Nicht allein das Meer, die Küste, "
        "der Hafen – sondern auch die Stadt selbst ist ein Anblick."
    ))
    story.append(sp(2))
    story.append(HLine(CONTENT_W, GOLD, 0.5))
    story.append(sp(4))

    # Die Bürgschaft – Full text by Schiller
    story.append(title3("Die Bürgschaft"))
    story.append(italic("Friedrich Schiller (1759–1805), Die Bürgschaft (1798) – Ballade, spielt in Syrakus"))
    story.append(sp(3))

    buergschaft_strophes = [
        "Zu Dionys dem Tyrannen, schlich\nDamon den Dolch im Gewande,\nIhn schlugen die Häscher in Bande.\n«Was wolltest du mit dem Dolche, sprich!»\nEntgegnet ihm finster der Wüterich.\n«Die Stadt vom Tyrannen befreien!»\n«Das sollst du am Kreuze bereuen.»",
        "«Ich bin», spricht jener, «zu sterben bereit,\nUnd bitte nicht um mein Leben;\nDoch willst du Gnade mir geben,\nIch flehe dich um drei Tage Zeit,\nBis ich die Schwester dem Gatten gefreit:\nIch lasse den Freund dir als Bürgen –\nIhn magst du, entrinn ich, erwürgen.»",
        "Da lächelt der König mit arger List\nUnd spricht nach kurzem Bedenken:\n«Drei Tage will ich dir schenken.\nDoch wisse: wenn sie verstrichen, die Frist,\nEh du zurück mir gegeben bist,\nSo muß er statt deiner erblassen,\nDoch dir ist die Strafe erlassen.»",
        "Und er kommt zum Freunde: «Der König gebeut,\nDaß ich am Kreuz mit dem Leben\nBezahle das frevelnde Streben\nDoch will er mir gönnen drei Tage Zeit,\nBis ich die Schwester dem Gatten gefreit,\nSo bleib du dem König zum Pfande,\nBis ich komme, zu lösen die Bande.»",
        "Und schweigend umarmt ihn der treue Freund,\nUnd liefert sich aus dem Tyrannen,\nDer andere ziehet von dannen.\nUnd ehe das dritte Morgenrot scheint,\nHat er schnell mit dem Gatten die Schwester vereint,\nEilt heim mit sorgender Seele,\nDamit er die Frist nicht verfehle.",
        "Da gießt unendlicher Regen herab,\nVon den Bergen stürzen die Quellen,\nUnd die Bäche, die Ströme schwellen.\nUnd er kommt ans Ufer mit wanderndem Stab –\nDa reißet die Brücke der Strudel hinab,\nUnd donnernd sprengen die Wogen\nDes Gewölbes krachenden Bogen.",
        "Und trostlos irrt er an Ufers Rand,\nWie weit er auch spähet und blicket,\nUnd die Stimme, die rufende, schicket –\nDa stößet kein Nachen vom sichern Strand,\nDer ihn setze an das gewünschte Land,\nKein Schiffer lenket die Fähre,\nUnd der wilde Strom wird zum Meere.",
        "Da sinkt er ans Ufer und weint und fleht,\nDie Hände zum Zeus erhoben:\n«O hemme des Stromes Toben!\nEs eilen die Stunden, im Mittag steht\nDie Sonne und wenn sie niedergeht,\nUnd ich kann die Stadt nicht erreichen,\nSo muß der Freund mir erbleichen.»",
        "Doch wachsend erneut sich des Stromes Wut,\nUnd Welle auf Welle zerrinnet,\nUnd Stunde an Stunde entrinnet,\nDa treibt ihn die Angst, da faßt er sich Mut\nUnd wirft sich hinein in die brausende Flut,\nUnd teilt mit gewaltigen Armen\nDen Strom, und ein Gott hat Erbarmen.",
        "Und gewinnt das Ufer und eilet fort,\nUnd danket dem rettenden Gotte;\nDa stürzet die raubende Rotte\nHervor aus des Waldes nächtlichem Ort,\nDen Pfad ihm sperrend, und schnaubet Mord\nUnd hemmet des Wanderers Eile\nMit drohend geschwungener Keule.",
        "«Was wollt ihr?» ruft er vor Schrecken bleich\n«Ich habe nichts als mein Leben,\nDas muß ich dem Könige geben!»\nUnd entreißt die Keule dem nächsten gleich:\n«Um des Freundes willen erbarmet euch!»\nUnd drei, mit gewaltigen Streichen,\nErlegt er, die andern entweichen.",
        "Und die Sonne versendet glühenden Brand\nUnd von der unendlichen Mühe\nErmattet sinken die Kniee:\n«O hast du mich gnädig aus Räubershand,\nAus dem Strom mich gerettet ans heilige Land,\nUnd soll hier verschmachtend verderben,\nUnd der Freund mir, der liebende, sterben!»",
        "Und horch! da sprudelt es silberhell\nGanz nahe, wie rieselndes Rauschen,\nUnd stille hält er, zu lauschen;\nUnd sieh, aus dem Felsen, geschwätzig, schnell,\nSpringt murmelnd hervor ein lebendiger Quell,\nUnd freudig bückt er sich nieder,\nUnd erfrischet die brennenden Glieder.",
        "Und die Sonne blickt durch der Zweige Grün\nUnd malt auf den glänzenden Matten\nDer Bäume gigantische Schatten;\nUnd zwei Wanderer sieht er die Straße ziehn,\nWill eilenden Laufes vorüber fliehn,\nDa hört er die Worte sie sagen:\n«Jetzt wird er ans Kreuz geschlagen.»",
        "Und die Angst beflügelt den eilenden Fuß,\nIhn jagen der Sorge Qualen;\nDa schimmern in Abendrots Strahlen\nVon ferne die Zinnen von Syrakus,\nUnd entgegen kommt ihm Philostratus,\nDes Hauses redlicher Hüter,\nDer erkennet entsetzt den Gebieter:",
        "«Zurück! du rettest den Freund nicht mehr,\nSo rette das eigene Leben!\nDen Tod erleidet er eben.\nVon Stunde zu Stunde gewartet er\nMit hoffender Seele der Wiederkehr,\nIhm konnte den mutigen Glauben\nDer Hohn des Tyrannen nicht rauben.»",
        "«Und ist es zu spät, und kann ich ihm nicht\nEin Retter willkommen erscheinen,\nSo soll mich der Tod ihm vereinen.\nDes rühme der blutge Tyrann sich nicht,\nDaß der Freund dem Freunde gebrochen die Pflicht –\nEr schlachte der Opfer zweie\nUnd glaube an Liebe und Treue.»",
        "Und die Sonne geht unter, da steht er am Tor\nUnd sieht das Kreuz schon erhöhet,\nDas die Menge gaffend umstehet;\nAn dem Seile schon zieht man den Freund empor,\nDa zertrennt er gewaltig den dichten Chor:\n«Mich, Henker!» ruft er, «erwürget!\nDa bin ich, für den er gebürget!»",
        "Und Erstaunen ergreifet das Volk umher,\nIn den Armen liegen sich beide,\nUnd weinen für Schmerzen und Freude.\nDa sieht man kein Auge tränenleer,\nUnd zum Könige bringt man die Wundermär,\nDer fühlt ein menschliches Rühren,\nLäßt schnell vor den Thron sie führen.",
        "Und blicket sie lange verwundert an,\nDrauf spricht er: «Es ist euch gelungen,\nIhr habt das Herz mir bezwungen,\nUnd die Treue, sie ist doch kein leerer Wahn –\nSo nehmet auch mich zum Genossen an,\nIch sei, gewährt mir die Bitte,\nIn eurem Bunde der Dritte.»",
    ]
    for strophe in buergschaft_strophes:
        # Replace newlines with <br/> for paragraph formatting
        formatted = strophe.replace('\n', '<br/>')
        story.append(Paragraph(formatted, S['BodySmall']))
        story.append(sp(3))

    story.append(sp(2))
    story.append(body(
        "<i>Schillers Ballade spielt am Hof des Tyrannen Dionysios I. in Syrakus. "
        "Sie besingt die Freundschaft zwischen Damon und Pythias, die stärker ist als "
        "Furcht vor dem Tod – und selbst den Tyrannen zur Umkehr bewegt.</i>"
    ))
    story.append(sp(2))
    story.append(HLine(CONTENT_W, GOLD, 0.5))
    story.append(sp(4))

    # Pirandello
    story.append(title3("Pirandello: Così è (se vi pare) – Schlussszene"))
    story.append(italic("Luigi Pirandello (1867–1936), Così è (se vi pare) (1917), III. Akt"))
    story.append(sp(2))
    story.append(body(
        "<b>Original:</b><br/>"
        "IL PREFETTO: Siete la figlia della signora Frola?<br/>"
        "SIGNORA PONZA: E la seconda moglie del signor Ponza, sì.<br/>"
        "IL PREFETTO: No, no – per voi stessa, come siete voi?<br/>"
        "SIGNORA PONZA: (con voce ferma) Io sono… colei che mi si crede.<br/>"
        "LAUDISI: (ridendo) Ed ecco, signori, come parla la verità!"
    ))
    story.append(sp(2))
    story.append(body(
        "<b>Übersetzung:</b><br/>"
        "DER PRÄFEKT: Sind Sie die Tochter der Signora Frola?<br/>"
        "SIGNORA PONZA: Und die zweite Frau des Herrn Ponza, ja.<br/>"
        "DER PRÄFEKT: Nein, nein – für Sie selbst, wer sind Sie?<br/>"
        "SIGNORA PONZA: (mit fester Stimme) Ich bin… diejenige, für die man mich hält.<br/>"
        "LAUDISI: (lachend) Und so, meine Herrschaften, spricht die Wahrheit!"
    ))
    story.append(sp(2))
    story.append(HLine(CONTENT_W, GOLD, 0.5))
    story.append(sp(4))

    # Camilleri / Montalbano
    story.append(title3("Montalbano – Catarella al telefono"))
    story.append(italic("Andrea Camilleri (1925–2019), Montalbano-Reihe"))
    story.append(sp(2))
    story.append(body(
        "<b>Original:</b><br/>"
        "CATARELLA: Dottori! Dottori! C'è una pirsona che s'apprisenta con il nomi di... "
        "aspittassi... di Trantino, no, Tantino...<br/>"
        "MONTALBANO: Catarè, mandamelo.<br/>"
        "CATARELLA: Sissì, Dottori! Ma prima m'ha ditto che la facennia è d'urgentissima urgenza!<br/>"
        "MONTALBANO: E allura mannalo immediatamenti!<br/>"
        "CATARELLA: Sissì, Dottori, vossignoria è già accontintata!"
    ))
    story.append(sp(2))
    story.append(body(
        "<b>Übersetzung:</b><br/>"
        "CATARELLA: Herr Doktor! Herr Doktor! Da ist eine Person, die sich mit dem Namen... "
        "warten Sie... Trantino, nein, Tantino... vorstellt.<br/>"
        "MONTALBANO: Catarè, schick ihn rein.<br/>"
        "CATARELLA: Jawohl, Herr Doktor! Aber vorher hat er mir gesagt, die Sache sei "
        "von dringendster Dringlichkeit!<br/>"
        "MONTALBANO: Dann schick ihn sofort rein!<br/>"
        "CATARELLA: Jawohl, Herr Doktor, Euer Gnaden ist bereits zufriedengestellt!"
    ))
    story.append(sp(2))
    story.append(body(
        "<i>Catarella spricht immer «Dottori» statt «Dottore», verdreht Namen und mischt "
        "sizilianischen Dialekt mit gebrochenem Hochitalienisch.</i>"
    ))
    story.append(sp(2))
    story.append(HLine(CONTENT_W, GOLD, 0.5))
    story.append(sp(4))

    # Per questo mi chiamo Giovanni
    story.append(title3("Per questo mi chiamo Giovanni – Die Mafia"))
    story.append(italic("Luigi Garlando (*1969), Per questo mi chiamo Giovanni (Rizzoli, 2004)"))
    story.append(sp(2))
    story.append(body(
        "<b>Übersetzung (Auszug):</b> «Cosca. Aber das Wort wird kaum noch benutzt, heute "
        "bedeutet es: Gruppe von Mafiosi. Cosca oder auch Familie. Als Giovanni nach Palermo "
        "zurückkam, war die Stadt wie diese Artischocke: jedes Viertel eine Cosca von Mafiosi.»"
    ))
    story.append(sp(2))
    story.append(body(
        "«Sie fragen ihn, ob er bereit ist, der Cosa beizutreten. Er sagt ja. "
        "Dann bittet der Uomo d'onore die beiden Zeugen, dem neuen Mafioso mit einem "
        "Dorn der Bitteroranje in den Finger zu stechen und einen Blutstropfen auf ein "
        "heiliges Bildchen fallen zu lassen. Schließlich verbrennen sie die Figur; "
        "der neue Mafioso muss sie in der Hand halten, bis das Feuer erlischt, "
        "und dabei sprechen: ‚Möge mein Fleisch brennen wie dieses Heiligenbild, "
        "wenn ich meinem Schwur nicht treu bleibe.'»"
    ))
    story.append(sp(2))
    story.append(HLine(CONTENT_W, GOLD, 0.5))
    story.append(sp(4))

    # Vergil über Siziliens Küsten
    story.append(title3("Vergil über Siziliens Küsten"))
    story.append(italic("Vergil (70–19 v. Chr.), Aeneis III, 692–696"))
    story.append(sp(2))
    story.append(body(
        "<b>Lateinisch:</b> Hinc altas cautes proiectaque saxa Pachyni radimus, "
        "et fatis numquam concessa moveri apparet Camerina procul campique Geloi, "
        "immanisque Gela fluvii cognomine dicta."
    ))
    story.append(sp(2))
    story.append(body(
        "<b>Übersetzung:</b> Von hier streifen wir die hohen Klippen und vorspringenden Felsen "
        "von Pachynum, und aus der Ferne erscheint Camerina, die das Schicksal nie zu bewegen "
        "gestattete, und die Gefilde von Gela, und das gewaltige Gela, nach dem Fluss benannt."
    ))
    story.append(sp(2))
    story.append(HLine(CONTENT_W, GOLD, 0.5))
    story.append(sp(4))

    # Die Perser – Aischylos
    story.append(title3("Die Perser – Der Schlachtruf bei Salamis"))
    story.append(italic("Aischylos (ca. 525–456 v. Chr.), Die Perser (472 v. Chr.), V. 402–405"))
    story.append(sp(2))
    story.append(body(
        "<b>Übersetzung:</b> «Auf, Kinder Griechenlands! Befreit das Vaterland, "
        "befreit die Kinder, Frauen, der Götter Throne, "
        "die Gräber eurer Ahnen – jetzt gilt es alles!»"
    ))
    story.append(sp(2))
    story.append(body(
        "<i>«Die Perser» (472 v. Chr.) ist die älteste erhaltene griechische Tragödie und das "
        "einzige Stück, das ein zeitgenössisches Ereignis behandelt: die Seeschlacht bei "
        "Salamis (480 v. Chr.). Aischylos selbst hatte als Soldat teilgenommen.</i>"
    ))
    story.append(sp(2))
    story.append(HLine(CONTENT_W, GOLD, 0.5))
    story.append(sp(4))

    # Lukrez
    story.append(title3("Lukrez – Der Ätna und seine Feuer"))
    story.append(italic("Lukrez (ca. 97–55 v. Chr.), De Rerum Natura VI, 639–646"))
    story.append(sp(2))
    story.append(body(
        "<b>Übersetzung:</b> Wohlan, vernimm nun, was die Feuer des Ätna verursacht. "
        "Zunächst ist dieser Berg überhaupt schauenerregend – "
        "er erhebt sich ganz mit gewaltigem Gipfel in die Höhe, "
        "und es ist nicht leicht, ihm nahe zu treten. "
        "Vor allem treibt die mächtige Kraft und der Ansturm des Windes "
        "die großen Erschütterungen in den Höhlen der Erde."
    ))
    story.append(sp(2))
    story.append(body(
        "<i>Lukrez erklärt den Ätna nicht durch Götter, sondern durch Naturkräfte: "
        "Wind in unterirdischen Hohlräumen.</i>"
    ))

    story.append(pb())

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # PAGE 59: BLANK (inside back cover)
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    story.append(NextPageTemplate('blank'))
    story.append(sp(20))
    story.append(center("<i>Buon viaggio!</i>"))
    story.append(sp(10))
    story.append(HLine(CONTENT_W * 0.3, GOLD, 0.5))
    story.append(sp(CONTENT_H - 60))
    story.append(NextPageTemplate('back'))
    story.append(pb())

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # PAGE 60: BACK COVER
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    back_img = find_image(PUBLIC / "detail-Sizilienkarte.jpg",
                          PUBLIC / "detail-Sizilien-Antike.jpg")

    class BackCover(Flowable):
        def __init__(self, img_path):
            Flowable.__init__(self)
            self.img_path = preprocess_image(img_path) if img_path else None
            self.width = PAGE_W
            self.height = PAGE_H

        def draw(self):
            c = self.canv
            # Light background
            c.setFillColor(HexColor("#F5F0E8"))
            c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
            # Image
            if self.img_path and Path(self.img_path).exists():
                try:
                    sz = get_image_size(self.img_path)
                    if sz:
                        w_px, h_px = sz
                        margin = 25 * mm
                        avail_w = PAGE_W - 2 * margin
                        avail_h = PAGE_H - 2 * margin - 30 * mm
                        ratio = min(avail_w / w_px, avail_h / h_px)
                        iw = w_px * ratio
                        ih = h_px * ratio
                        x = (PAGE_W - iw) / 2
                        y = (PAGE_H - ih) / 2 + 10 * mm
                        c.drawImage(self.img_path, x, y, iw, ih,
                                    preserveAspectRatio=True, mask='auto')
                        # Border
                        c.setStrokeColor(GOLD)
                        c.setLineWidth(1)
                        c.rect(x - 2, y - 2, iw + 4, ih + 4, fill=0)
                except Exception:
                    pass
            # Title at bottom
            c.setFont("Helvetica-Bold", 11)
            c.setFillColor(DARK_BLUE)
            c.drawCentredString(PAGE_W / 2, 25 * mm,
                                "Studienreise Sizilien · 28. März – 4. April 2026")
            c.setFont("Helvetica", 9)
            c.drawCentredString(PAGE_W / 2, 18 * mm,
                                "PG Herz-Jesu-Missionare Liefering · Dr. Paul Dienstbier")
            # Gold line
            c.setStrokeColor(GOLD)
            c.setLineWidth(0.5)
            c.line(PAGE_W * 0.25, 14 * mm, PAGE_W * 0.75, 14 * mm)

    story.append(BackCover(back_img))

    # ── BUILD ──────────────────────────────────────────────────────────
    print(f"Building PDF: {OUTPUT_PDF}")
    doc.build(story)
    file_size = os.path.getsize(OUTPUT_PDF)
    print(f"PDF created: {OUTPUT_PDF}")
    print(f"File size: {file_size / 1024 / 1024:.1f} MB")

    # Count pages
    try:
        from reportlab.lib.utils import open_for_read
        import re
        with open(str(OUTPUT_PDF), 'rb') as f:
            content = f.read()
            # Count page objects
            pages = content.count(b'/Type /Page') - content.count(b'/Type /Pages')
            print(f"Page count: ~{pages}")
    except Exception:
        print("(Could not count pages)")


if __name__ == "__main__":
    try:
        build_handbook()
    finally:
        cleanup_temp()
