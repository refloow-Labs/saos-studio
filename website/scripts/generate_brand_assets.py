#!/usr/bin/env python3
"""Generate favicons and the social preview image from the brand logo.

The site previously shipped a single ``favicon.jpg`` that was a solid black
square — no mark in it at all — and had no Open Graph image, so every share
rendered as a bare link.

Sources ``public/logos/white-logo.png`` (the stacked "saos studio." lockup,
white on transparent) and composites it onto the brand ink background.

Outputs:
  public/favicon-16.png, favicon-32.png   — the "saos" wordmark, cropped
  public/apple-touch-icon.png (180)       — same, with iOS-safe padding
  public/icon-192.png, icon-512.png       — PWA manifest icons
  public/og-default.png (1200x630)        — full lockup, social preview

Run: python3 scripts/generate_brand_assets.py
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
LOGO = PUBLIC / "logos" / "white-logo.png"

INK = (10, 10, 10, 255)


def load_logo() -> Image.Image:
    im = Image.open(LOGO).convert("RGBA")
    bbox = im.getchannel("A").getbbox()
    if bbox is None:
        raise SystemExit(f"{LOGO} is fully transparent — nothing to crop.")
    return im.crop(bbox)


def wordmark(logo: Image.Image) -> Image.Image:
    """Crop the 'saos' word off the top of the stacked lockup.

    At favicon sizes the full two-line lockup is an illegible smudge, so the
    icon uses just the brand word. Finds the horizontal gutter between the two
    lines by looking for the widest run of fully transparent rows.
    """
    alpha = logo.getchannel("A")
    width, height = alpha.size
    row_has_ink = [
        any(alpha.getpixel((x, y)) > 8 for x in range(0, width, 4))
        for y in range(height)
    ]

    # Widest empty run that starts in the top two-thirds — the line gutter.
    best_start, best_len = None, 0
    run_start = None
    for y, inked in enumerate(row_has_ink):
        if not inked:
            if run_start is None:
                run_start = y
        else:
            if run_start is not None:
                run_len = y - run_start
                if run_start < height * 0.66 and run_len > best_len:
                    best_start, best_len = run_start, run_len
                run_start = None

    if best_start is None:
        # No gutter found; fall back to the whole lockup rather than guessing.
        return logo
    return logo.crop((0, 0, width, best_start))


def square(art: Image.Image, size: int, pad_ratio: float) -> Image.Image:
    """Fit `art` into a `size`x`size` ink tile with proportional padding."""
    canvas = Image.new("RGBA", (size, size), INK)
    inner = int(size * (1 - 2 * pad_ratio))
    scale = min(inner / art.width, inner / art.height)
    w, h = max(1, round(art.width * scale)), max(1, round(art.height * scale))
    resized = art.resize((w, h), Image.LANCZOS)
    canvas.alpha_composite(resized, ((size - w) // 2, (size - h) // 2))
    return canvas


def main() -> None:
    logo = load_logo()
    mark = wordmark(logo)
    print(f"  lockup {logo.size} -> wordmark crop {mark.size}")

    icons = [
        ("favicon-16.png", 16, 0.10),
        ("favicon-32.png", 32, 0.10),
        # iOS crops to a rounded rect, so the mark needs more breathing room.
        ("apple-touch-icon.png", 180, 0.16),
        ("icon-192.png", 192, 0.14),
        ("icon-512.png", 512, 0.14),
    ]
    for name, size, pad in icons:
        out = PUBLIC / name
        square(mark, size, pad).convert("RGB").save(out, "PNG", optimize=True)
        print(f"  {name}: {size}x{size} ({out.stat().st_size // 1024}KB)")

    # /favicon.ico is still requested by default by crawlers and older clients
    # that ignore the <link> tags, so serve a real one rather than 404ing.
    ico_path = PUBLIC / "favicon.ico"
    square(mark, 64, 0.10).convert("RGB").save(
        ico_path, "ICO", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)]
    )
    print(f"  favicon.ico: multi-size ({ico_path.stat().st_size // 1024}KB)")

    # Social preview — the full lockup, generously spaced.
    og = Image.new("RGBA", (1200, 630), INK)
    scale = min(560 / logo.width, 400 / logo.height)
    w, h = round(logo.width * scale), round(logo.height * scale)
    og.alpha_composite(logo.resize((w, h), Image.LANCZOS), ((1200 - w) // 2, (630 - h) // 2))
    og_path = PUBLIC / "og-default.png"
    og.convert("RGB").save(og_path, "PNG", optimize=True)
    print(f"  og-default.png: 1200x630 ({og_path.stat().st_size // 1024}KB)")


if __name__ == "__main__":
    main()
