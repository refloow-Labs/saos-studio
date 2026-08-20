#!/usr/bin/env python3
"""Re-encode the portfolio images in public/work/.

Two jobs:

1. Portfolio thumbnails (``thumb.jpg``) — re-encoded as progressive JPEG and
   given a WebP sibling. ``Portfolio.tsx`` serves them through a <picture>, so
   the JPEG stays as the fallback and nothing breaks if a WebP is missing.

2. Every other image — the large hero shots used as CSS backgrounds inside the
   demo pages themselves. These are only re-encoded in place, never renamed and
   never given a WebP sibling, because the demo pages' inline CSS references
   them by filename and rewriting eight hand-built HTML files to add WebP
   sources is not worth the risk.

Idempotent: re-running on already-optimized files is a no-op in practice, since
they will already be under the size ceilings. Run with `npm run optimize-images`.
"""

from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
WORK = ROOT / "public" / "work"

THUMB_MAX_WIDTH = 1000
OTHER_MAX_WIDTH = 1600
JPEG_QUALITY = 82
WEBP_QUALITY = 80


def resized(im: Image.Image, max_width: int) -> Image.Image:
    if im.width <= max_width:
        return im
    height = round(im.height * max_width / im.width)
    return im.resize((max_width, height), Image.LANCZOS)


def kb(path: Path) -> int:
    return path.stat().st_size // 1024


def optimize(path: Path) -> None:
    is_thumb = path.stem == "thumb"
    max_width = THUMB_MAX_WIDTH if is_thumb else OTHER_MAX_WIDTH

    before = kb(path)
    with Image.open(path) as src:
        im = resized(src.convert("RGB"), max_width)
        size = im.size

        im.save(path, "JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True)

        if is_thumb:
            webp = path.with_suffix(".webp")
            im.save(webp, "WEBP", quality=WEBP_QUALITY, method=6)
            print(
                f"  {path.relative_to(ROOT)}: {before}KB -> {kb(path)}KB jpg "
                f"+ {kb(webp)}KB webp  ({size[0]}x{size[1]})"
            )
        else:
            print(
                f"  {path.relative_to(ROOT)}: {before}KB -> {kb(path)}KB  "
                f"({size[0]}x{size[1]})"
            )


def main() -> int:
    if not WORK.is_dir():
        print(f"No such directory: {WORK}", file=sys.stderr)
        return 1

    images = sorted(WORK.rglob("*.jpg")) + sorted(WORK.rglob("*.jpeg"))
    if not images:
        print("No images found.")
        return 0

    total_before = sum(p.stat().st_size for p in images)
    for path in images:
        optimize(path)
    total_after = sum(p.stat().st_size for p in images)

    print(
        f"\n✓ {len(images)} images: {total_before // 1024}KB -> "
        f"{total_after // 1024}KB JPEG (plus WebP siblings for thumbnails)"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
