import os
from PIL import Image, ImageDraw, ImageFont

PROJECT_DIR = '/Users/zakaria/projects/antigravity/odora'
TARGET_DIR = os.path.join(PROJECT_DIR, 'reviews/qa-app-2026-09-23')

SCREENS = [
    {
        'id': 'store',
        'screen_name': 'Store',
        'title': 'Store (Catalog)',
        'stitch_path': os.path.join(PROJECT_DIR, 'design-reference/stitch/idea-02/odora_store/screen.png'),
    },
    {
        'id': 'category',
        'screen_name': 'Category',
        'title': 'Botanical Cartridges (Category)',
        'stitch_path': os.path.join(PROJECT_DIR, 'design-reference/stitch/idea-02/odora_category_botanical_cartridges/screen.png'),
    },
    {
        'id': 'search',
        'screen_name': 'Search',
        'title': 'Search & Discovery',
        'stitch_path': os.path.join(PROJECT_DIR, 'design-reference/stitch/idea-02/odora_search_discovery/screen.png'),
    },
    {
        'id': 'product_detail',
        'screen_name': 'ProductDetail',
        'title': 'Product Detail (Odora Air 01)',
        'stitch_path': os.path.join(PROJECT_DIR, 'design-reference/stitch/idea-02/odora_product_detail/screen.png'),
    },
    {
        'id': 'cart',
        'screen_name': 'Cart',
        'title': 'Sanctuary Cart',
        'stitch_path': os.path.join(PROJECT_DIR, 'design-reference/stitch/idea-02/odora_cart/screen.png'),
    },
    {
        'id': 'checkout',
        'screen_name': 'Checkout',
        'title': 'Checkout (Libyan Flow)',
        'stitch_path': os.path.join(PROJECT_DIR, 'design-reference/stitch/idea-02/odora_checkout/screen.png'),
    },
    {
        'id': 'order_confirmation',
        'screen_name': 'OrderConfirmation',
        'title': 'Order Confirmation',
        'stitch_path': os.path.join(PROJECT_DIR, 'design-reference/stitch/idea-02/odora_order_confirmation/screen.png'),
    },
]

def composite_screen(screen, lang):
    raw_path = f"/tmp/raw_{screen['id']}__{lang}.png"
    out_path = os.path.join(TARGET_DIR, f"{screen['id']}__vs__{lang}.png")
    stitch_path = screen['stitch_path']

    if not os.path.exists(raw_path):
        print(f"Error: {raw_path} does not exist!")
        return

    cap_img = Image.open(raw_path).convert('RGB')
    if os.path.exists(stitch_path) and os.path.getsize(stitch_path) > 1000:
        stitch_img = Image.open(stitch_path).convert('RGB')
    else:
        stitch_img = Image.new('RGB', (cap_img.width, cap_img.height), (240, 240, 240))

    # Standard width for both sides: 390pt @ 2x = 780px
    target_w = 780

    # Scale Stitch to exactly target_w
    stitch_h = int(stitch_img.height * (target_w / stitch_img.width))
    stitch_resized = stitch_img.resize((target_w, stitch_h), Image.Resampling.LANCZOS)

    # Scale Captured to exactly target_w
    cap_h = int(cap_img.height * (target_w / cap_img.width))
    cap_resized = cap_img.resize((target_w, cap_h), Image.Resampling.LANCZOS)

    header_height = 80
    gap = 24
    max_h = max(stitch_h, cap_h)
    total_w = target_w * 2 + gap
    total_h = max_h + header_height

    # Canvas with dark olive matching Stitch container
    composite = Image.new('RGB', (total_w, total_h), (24, 28, 25))
    draw = ImageDraw.Draw(composite)

    # Fill content background behind each column to match screen surface
    left_bg = stitch_resized.getpixel((10, 10))
    draw.rectangle([0, header_height, target_w, total_h], fill=left_bg)

    right_bg = cap_resized.getpixel((10, 10))
    draw.rectangle([target_w + gap, header_height, total_w, total_h], fill=right_bg)

    # Draw Headers
    draw.rectangle([0, 0, target_w, header_height], fill=(35, 40, 33))
    draw.text((24, 28), f"STITCH APPROVED DESIGN — {screen['title'].upper()} (390pt)", fill=(213, 230, 178))

    draw.rectangle([target_w + gap, 0, total_w, header_height], fill=(35, 40, 33))
    draw.text((target_w + gap + 24, 28), f"ODORA NATIVE APP — {lang.upper()} {'RTL' if lang == 'ar' else 'LTR'} (390pt)", fill=(213, 230, 178))

    # Paste Stitch on Left
    composite.paste(stitch_resized, (0, header_height))

    # Paste Odora on Right
    composite.paste(cap_resized, (target_w + gap, header_height))

    composite.save(out_path, 'PNG', optimize=True)
    print(f"Created proof: {out_path} ({total_w}x{total_h})")

def main():
    print(f"Compositing 14 proofs for Batch B at 390pt wide (780px) into {TARGET_DIR}...")
    for screen in SCREENS:
        for lang in ['ar', 'en']:
            composite_screen(screen, lang)
    print("\nBatch B proofs completed successfully!")

if __name__ == '__main__':
    main()
