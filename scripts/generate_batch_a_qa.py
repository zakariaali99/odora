import os
import sys
import time
import subprocess
from PIL import Image, ImageDraw, ImageFont

PROJECT_DIR = '/Users/zakaria/projects/antigravity/odora'
TARGET_DIR = os.path.join(PROJECT_DIR, 'reviews/qa-app-2026-09-23')
PREVIEW_FILE = os.path.join(PROJECT_DIR, 'app/src/previewTarget.ts')
TEMP_CAPTURE = '/tmp/qa_full_shot.png'

os.makedirs(TARGET_DIR, exist_ok=True)

SCREENS = [
    {
        'id': 'home',
        'screen_name': 'Home',
        'stitch_path': os.path.join(PROJECT_DIR, 'design-reference/stitch/idea-02/odora_home_dashboard/screen.png'),
    },
    {
        'id': 'devices',
        'screen_name': 'Devices',
        'stitch_path': os.path.join(PROJECT_DIR, 'design-reference/stitch/idea-02/odora_devices/screen.png'),
    },
    {
        'id': 'device_control',
        'screen_name': 'DeviceControl',
        'stitch_path': os.path.join(PROJECT_DIR, 'design-reference/stitch/idea-01/odora_device_control/screen.png'),
    },
    {
        'id': 'device_pairing',
        'screen_name': 'DevicePairing',
        'stitch_path': os.path.join(PROJECT_DIR, 'design-reference/stitch/idea-02/odora_device_pairing/screen.png'),
    },
    {
        'id': 'schedule',
        'screen_name': 'Schedule',
        'stitch_path': os.path.join(PROJECT_DIR, 'design-reference/stitch/idea-02/odora_schedule_routines/screen.png'),
    },
    {
        'id': 'device_settings',
        'screen_name': 'DeviceSettings',
        'stitch_path': os.path.join(PROJECT_DIR, 'design-reference/stitch/idea-02/odora_device_settings/screen.png'),
    },
    {
        'id': 'connection_states',
        'screen_name': 'ConnectionStates',
        'stitch_path': os.path.join(PROJECT_DIR, 'design-reference/stitch/idea-02/odora_connection_states/screen.png'),
    },
]

def update_preview_target(screen_name, lang):
    screen_val = f"'{screen_name}'" if screen_name else "null"
    lang_val = f"'{lang}'" if lang else "null"
    content = f"""export interface PreviewConfig {{
  screen:
    | 'Home'
    | 'Devices'
    | 'DeviceControl'
    | 'DevicePairing'
    | 'Schedule'
    | 'DeviceSettings'
    | 'ConnectionStates'
    | null;
  lang: 'ar' | 'en' | null;
}}

export const previewConfig: PreviewConfig = {{
  screen: {screen_val},
  lang: {lang_val},
}};
"""
    with open(PREVIEW_FILE, 'w') as f:
        f.write(content)

def capture_screen(height=1600):
    if os.path.exists(TEMP_CAPTURE):
        os.remove(TEMP_CAPTURE)
    cmd = [
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        '--headless=new',
        '--virtual-time-budget=6000',
        '--screenshot=' + TEMP_CAPTURE,
        f'--window-size=390,{height}',
        '--force-device-scale-factor=2',
        'http://localhost:8081'
    ]
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    return Image.open(TEMP_CAPTURE)

def create_side_by_side(stitch_img_path, captured_img, output_path, screen_title, lang):
    # Load stitch image
    if os.path.exists(stitch_img_path) and os.path.getsize(stitch_img_path) > 1000:
        stitch_img = Image.open(stitch_img_path).convert('RGB')
    else:
        stitch_img = Image.new('RGB', (captured_img.width, captured_img.height), color=(240, 240, 240))
        d = ImageDraw.Draw(stitch_img)
        d.text((50, 100), "Stitch Mockup Placeholder", fill=(100, 100, 100))

    # Standardize both sides to 390pt @ 2x = 780px wide
    target_w = 780

    # Scale stitch proportionally to 780px wide
    stitch_h = int(stitch_img.height * (target_w / stitch_img.width))
    stitch_resized = stitch_img.resize((target_w, stitch_h), Image.Resampling.LANCZOS)

    # Scale captured screenshot proportionally to 780px wide
    cap_h = int(captured_img.height * (target_w / captured_img.width))
    cap_resized = captured_img.resize((target_w, cap_h), Image.Resampling.LANCZOS)

    header_height = 80
    gap = 24
    max_h = max(stitch_h, cap_h)
    total_width = target_w * 2 + gap
    total_height = max_h + header_height

    # Create composite image with dark background matching brand
    composite = Image.new('RGB', (total_width, total_height), color=(24, 28, 25))
    draw = ImageDraw.Draw(composite)

    # Left Header: Stitch
    draw.rectangle([0, 0, target_w, header_height], fill=(35, 40, 33))
    draw.text((24, 28), f"STITCH APPROVED DESIGN — {screen_title.upper()} (390pt)", fill=(213, 230, 178))

    # Right Header: Native Odora App Build
    draw.rectangle([target_w + gap, 0, total_width, header_height], fill=(35, 40, 33))
    draw.text((target_w + gap + 24, 28), f"ODORA APP BUILD — {screen_title.upper()} ({lang.upper()}) (390pt)", fill=(213, 230, 178))

    # Paste images
    composite.paste(stitch_resized, (0, header_height))
    composite.paste(cap_resized, (target_w + gap, header_height))

    composite.save(output_path, quality=95)
    print(f"Generated: {output_path} ({total_width}x{total_height})")

def main():
    print("Starting Batch A Side-by-Side QA Generation (390pt full scroll height)...")

    for screen in SCREENS:
        screen_id = screen['id']
        screen_name = screen['screen_name']
        stitch_path = screen['stitch_path']

        for lang in ['ar', 'en']:
            out_filename = f"{screen_id}__vs__{lang}.png"
            out_path = os.path.join(TARGET_DIR, out_filename)

            print(f"Processing {screen_name} ({lang})...")
            update_preview_target(screen_name, lang)
            time.sleep(2.5) # Allow Metro Fast Refresh and animations to settle

            captured = capture_screen(height=1600)
            create_side_by_side(stitch_path, captured, out_path, screen_name, lang)

    # Reset preview target to normal navigation mode
    update_preview_target(None, None)
    print("QA Generation Completed! All 14 proofs regenerated at 390pt full height.")

if __name__ == '__main__':
    main()
