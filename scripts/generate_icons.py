"""
later-you-said app icon generator.

Design: Pure typographic. Black canvas, oversized white "L." (Helvetica Bold).
The period is a square block — brutalist precision, MZ-style punchline.
"""

from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "assets"

BLACK = (10, 10, 10, 255)
WHITE = (250, 250, 250, 255)
F5 = (245, 245, 245, 255)
TRANSPARENT = (0, 0, 0, 0)

FONT_BOLD = "/System/Library/Fonts/Helvetica.ttc"
FONT_INDEX_BOLD = 1  # Bold face inside the .ttc


def load_font(size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(FONT_BOLD, size=size, index=FONT_INDEX_BOLD)


def measure(font: ImageFont.FreeTypeFont, text: str):
    """Return (width, height, x_offset, y_offset) using the actual ink bbox."""
    bbox = font.getbbox(text)
    return bbox[2] - bbox[0], bbox[3] - bbox[1], bbox[0], bbox[1]


def draw_logo(canvas: Image.Image, fg_color, *, scale: float = 1.0, dot_color=None):
    """
    Draw the 'L.' wordmark centered on the canvas.

    scale: fraction of canvas width the optical mark should occupy (0..1).
           Used so adaptive icons can shrink content into the 66% safe zone.
    """
    if dot_color is None:
        dot_color = fg_color

    W, H = canvas.size
    target_w = W * scale

    # Find the font size that makes "L" hit our target width.
    # We size based on the L glyph alone, then position the square dot manually.
    size = int(target_w)
    while size > 8:
        font = load_font(size)
        l_w, l_h, _, _ = measure(font, "L")
        if l_w <= target_w * 0.55:  # leave room for the dot
            break
        size -= 8

    font = load_font(size)
    l_w, l_h, l_ox, l_oy = measure(font, "L")

    # Square block period: ~22% of the L's height, sits on the baseline
    dot_size = int(l_h * 0.22)
    gap = int(l_h * 0.06)

    total_w = l_w + gap + dot_size
    start_x = (W - total_w) // 2
    # Vertically center based on cap height. Use the bbox top for accurate placement.
    # Nudge up ~4% of cap height: the L's mass sits in the lower-left, so a math-
    # center placement reads as bottom-heavy. This restores optical center.
    optical_lift = int(l_h * 0.04)
    start_y = (H - l_h) // 2 - optical_lift

    draw = ImageDraw.Draw(canvas)
    # Draw L. PIL anchors text at the bbox top-left of the rendered glyph;
    # adjust by the offset so we sit flush.
    draw.text((start_x - l_ox, start_y - l_oy), "L", font=font, fill=fg_color)

    dot_x = start_x + l_w + gap
    dot_y = start_y + l_h - dot_size  # align to baseline
    draw.rectangle(
        [dot_x, dot_y, dot_x + dot_size, dot_y + dot_size],
        fill=dot_color,
    )


def make_icon():
    """1024x1024 iOS-style icon. Full-bleed black with white L. mark."""
    canvas = Image.new("RGBA", (1024, 1024), BLACK)
    draw_logo(canvas, WHITE, scale=0.62)
    out = ASSETS / "icon.png"
    canvas.convert("RGB").save(out, "PNG", optimize=True)
    print(f"wrote {out}")


def make_adaptive():
    """
    1024x1024 Android adaptive icon foreground.
    The system masks it to circle/squircle; safe content area = inner 66%.
    Background color is set via app.json (#ffffff), so we keep the canvas
    transparent and draw the mark in black.
    """
    canvas = Image.new("RGBA", (1024, 1024), TRANSPARENT)
    # Safe zone for adaptive is ~66% of canvas (672px). Mark up to ~52% so it
    # reads bold after the system mask crops in but still sits inside the safe zone.
    draw_logo(canvas, BLACK, scale=0.52)
    out = ASSETS / "adaptive-icon.png"
    canvas.save(out, "PNG", optimize=True)
    print(f"wrote {out}")


def make_splash():
    """
    Splash icon used with resizeMode 'contain' on a white background.
    Match the adaptive icon visual: black L. on transparent canvas.
    """
    canvas = Image.new("RGBA", (1024, 1024), TRANSPARENT)
    draw_logo(canvas, BLACK, scale=0.50)
    out = ASSETS / "splash-icon.png"
    canvas.save(out, "PNG", optimize=True)
    print(f"wrote {out}")


def make_favicon():
    """48x48 web favicon. Render a larger version and downscale for crispness."""
    big = Image.new("RGBA", (256, 256), BLACK)
    draw_logo(big, WHITE, scale=0.62)
    small = big.resize((48, 48), Image.LANCZOS)
    out = ASSETS / "favicon.png"
    small.save(out, "PNG", optimize=True)
    print(f"wrote {out}")


if __name__ == "__main__":
    make_icon()
    make_adaptive()
    make_splash()
    make_favicon()
