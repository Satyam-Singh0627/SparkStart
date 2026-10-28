import sys
from pathlib import Path
from PIL import Image, ImageDraw

def generate_sprout_icon(size: int, output_path: Path):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    pad = max(1, size // 16)
    # Circle background (emerald gradient approx)
    draw.ellipse([pad, pad, size - pad, size - pad], fill=(34, 197, 94, 255), outline=(21, 128, 61, 255), width=max(1, size // 32))

    # Sprout Stem and Leaf
    cx, cy = size // 2, size // 2
    # Stem
    stem_w = max(1, size // 16)
    draw.line([(cx, cy + size // 4), (cx, cy - size // 10)], fill=(255, 255, 255, 255), width=stem_w)

    # Left Leaf
    draw.ellipse([cx - size // 3, cy - size // 4, cx, cy], fill=(220, 252, 231, 255))
    # Right Leaf
    draw.ellipse([cx, cy - size // 3, cx + size // 3, cy - size // 12], fill=(220, 252, 231, 255))

    img.save(output_path, "PNG")
    print(f"Generated {output_path} ({size}x{size})")

if __name__ == "__main__":
    out_dir = Path("apps/extension/icons")
    out_dir.mkdir(parents=True, exist_ok=True)
    for s in [16, 48, 128]:
        generate_sprout_icon(s, out_dir / f"icon{s}.png")

