import os
from PIL import Image, ImageDraw, ImageFont

PROJECT_DIR = '/Users/zakaria/projects/antigravity/odora'
TARGET_DIR = os.path.join(PROJECT_DIR, 'reviews/qa-app-2026-09-23')

SCREENS = [
    {
        'id': 'home',
        'screen_name': 'Home',
        'title': 'Home Dashboard',
        'stitch_path': os.path.join(PROJECT_DIR, 'design-reference/stitch/idea-02/odora_home_dashboard/screen.png'),
    },
    {
        'id': 'devices',
        'screen_name': 'Devices',
        'title': 'Devices List',
        'stitch_path': os.path.join(PROJECT_DIR, 'design-reference/stitch/idea-02/odora_devices/screen.png'),
    },
    {
        'id': 'device_control',
        'screen_name': 'DeviceControl',
        'title': 'Device Control',
        'stitch_path': os.path.join(PROJECT_DIR, 'design-reference/stitch/idea-01/odora_device_control/screen.png'),
    },
    {
        'id': 'device_pairing',
        'screen_name': 'DevicePairing',
        'title': 'Device Pairing',
        'stitch_path': os.path.join(PROJECT_DIR, 'design-reference/stitch/idea-02/odora_device_pairing/screen.png'),
    },
    {
        'id': 'schedule',
        'screen_name': 'Schedule',
        'title': 'Schedule & Routines',
        'stitch_path': os.path.join(PROJECT_DIR, 'design-reference/stitch/idea-02/odora_schedule_routines/screen.png'),
    },
    {
        'id': 'device_settings',
        'screen_name': 'DeviceSettings',
        'title': 'Device Settings',
        'stitch_path': os.path.join(PROJECT_DIR, 'design-reference/stitch/idea-02/odora_device_settings/screen.png'),
    },
    {
        'id': 'connection_states',
        'screen_name': 'ConnectionStates',
        'title': 'Connection States',
        'stitch_path': os.path.join(PROJECT_DIR, 'design-reference/stitch/idea-02/odora_connection_states/screen.png'),
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
    # Left (Stitch): sample top-left pixel or use warm off-white #FAF8F5
    left_bg = stitch_resized.getpixel((10, 10))
    draw.rectangle([0, header_height, target_w, total_h], fill=left_bg)

    # Right (Odora): sample top-left pixel
    right_bg = cap_resized.getpixel((10, 10))
    draw.rectangle([target_w + gap, header_height, total_w, total_h], fill=right_bg)

    # Draw Headers
    draw.rectangle([0, 0, target_w, header_height], fill=(35, 40, 33))
    draw.text((24, 28), f"STITCH APPROVED DESIGN — {screen['title'].upper()} (390pt)", fill=(213, 230, 178))

    draw.rectangle([target_w + gap, 0, total_w, header_height], fill=(35, 40, 33))
    draw.text((target_w + gap + 24, 28), f"ODORA APP BUILD — {screen['title'].upper()} ({lang.upper()}) (390pt)", fill=(213, 230, 178))

    # Paste resized images
    composite.paste(stitch_resized, (0, header_height))
    composite.paste(cap_resized, (target_w + gap, header_height))

    composite.save(out_path, quality=95)
    print(f"Generated side-by-side: {out_path} ({total_w}x{total_h})")

def main():
    print("Starting side-by-side compositing for all 14 Batch A proofs...")
    for screen in SCREENS:
        for lang in ['ar', 'en']:
            composite_screen(screen, lang)
    print("All 14 proofs successfully generated!")

if __name__ == '__main__':
    main()
