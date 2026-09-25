import os
import sys
import time
import subprocess
from PIL import Image, ImageDraw, ImageFont

PROJECT_DIR = '/Users/zakaria/projects/antigravity/odora'
TARGET_DIR = os.path.join(PROJECT_DIR, 'reviews/qa-app-2026-09-25')
PREVIEW_FILE = os.path.join(PROJECT_DIR, 'app/src/previewTarget.ts')
SIMULATOR_UDID = 'E58744A3-BDDD-41A9-90B3-D2ACC9374EFB'

os.makedirs(TARGET_DIR, exist_ok=True)

SCREENS = [
    {
        'id': 'home',
        'screen_name': 'Home',
        'title': 'Home Dashboard',
        'stitch_path': os.path.join(PROJECT_DIR, 'design-reference/stitch/idea-02/odora_home_dashboard/screen.png'),
        'has_end': True,
        'has_sheet': False,
    },
    {
        'id': 'devices',
        'screen_name': 'Devices',
        'title': 'Devices List',
        'stitch_path': os.path.join(PROJECT_DIR, 'design-reference/stitch/idea-02/odora_devices/screen.png'),
        'has_end': True,
        'has_sheet': False,
    },
    {
        'id': 'store',
        'screen_name': 'Store',
        'title': 'Store Tab',
        'stitch_path': os.path.join(PROJECT_DIR, 'design-reference/stitch/idea-02/odora_store/screen.png'),
        'has_end': False,
        'has_sheet': False,
    },
    {
        'id': 'account',
        'screen_name': 'Account',
        'title': 'Account Tab',
        'stitch_path': os.path.join(PROJECT_DIR, 'design-reference/stitch/idea-02/odora_account_dashboard/screen.png'),
        'has_end': False,
        'has_sheet': False,
    },
    {
        'id': 'device_control',
        'screen_name': 'DeviceControl',
        'title': 'Device Control',
        'stitch_path': os.path.join(PROJECT_DIR, 'design-reference/stitch/idea-02/odora_device_control/screen_rendered.png'),
        'has_end': True,
        'has_sheet': False,
    },
    {
        'id': 'device_pairing',
        'screen_name': 'DevicePairing',
        'title': 'Device Pairing',
        'stitch_path': os.path.join(PROJECT_DIR, 'design-reference/stitch/idea-02/odora_device_pairing/screen.png'),
        'has_end': True,
        'has_sheet': False,
    },
    {
        'id': 'schedule',
        'screen_name': 'Schedule',
        'title': 'Schedule & Routines',
        'stitch_path': os.path.join(PROJECT_DIR, 'design-reference/stitch/idea-02/odora_schedule_routines/screen.png'),
        'has_end': True,
        'has_sheet': True,
    },
    {
        'id': 'device_settings',
        'screen_name': 'DeviceSettings',
        'title': 'Device Settings',
        'stitch_path': os.path.join(PROJECT_DIR, 'design-reference/stitch/idea-02/odora_device_settings/screen.png'),
        'has_end': True,
        'has_sheet': False,
    },
    {
        'id': 'connection_states',
        'screen_name': 'ConnectionStates',
        'title': 'Connection States',
        'stitch_path': os.path.join(PROJECT_DIR, 'design-reference/stitch/idea-02/odora_connection_states/screen.png'),
        'has_end': True,
        'has_sheet': False,
    },
]

def update_preview_target(screen_name, lang, scroll_to_end=False, sheet=False):
    screen_val = f"'{screen_name}'" if screen_name else "null"
    lang_val = f"'{lang}'" if lang else "null"
    scroll_val = "true" if scroll_to_end else "false"
    sheet_val = "true" if sheet else "false"
    content = f"""export interface PreviewConfig {{
  screen:
    | 'Home'
    | 'Devices'
    | 'DeviceControl'
    | 'DevicePairing'
    | 'Schedule'
    | 'DeviceSettings'
    | 'ConnectionStates'
    | 'Store'
    | 'Account'
    | null;
  lang: 'ar' | 'en' | null;
  scrollToEnd?: boolean;
  sheet?: boolean;
}}

export const previewConfig: PreviewConfig = {{
  screen: {screen_val},
  lang: {lang_val},
  scrollToEnd: {scroll_val},
  sheet: {sheet_val},
}};
"""
    with open(PREVIEW_FILE, 'w') as f:
        f.write(content)
    subprocess.run(['xcrun', 'simctl', 'terminate', SIMULATOR_UDID, 'com.odora.diffuser'], check=False)
    time.sleep(0.3)
    subprocess.run(['xcrun', 'simctl', 'launch', SIMULATOR_UDID, 'com.odora.diffuser'], check=False)
    time.sleep(3.2)

def capture_sim_screenshot(output_path):
    cmd = [
        'xcrun', 'simctl', 'io', SIMULATOR_UDID,
        'screenshot', output_path
    ]
    subprocess.run(cmd, check=True)

def create_side_by_side(native_img_path, stitch_img_path, output_path, screen_title, lang, scroll_label):
    native_img = Image.open(native_img_path).convert('RGB')
    if os.path.exists(stitch_img_path) and os.path.getsize(stitch_img_path) > 1000:
        stitch_img = Image.open(stitch_img_path).convert('RGB')
    else:
        stitch_img = Image.new('RGB', (native_img.width, native_img.height), color=(240, 240, 240))
        d = ImageDraw.Draw(stitch_img)
        d.text((50, 100), "Stitch Mockup", fill=(100, 100, 100))

    target_w = 600
    native_ratio = target_w / float(native_img.width)
    native_h = int(native_img.height * native_ratio)
    native_scaled = native_img.resize((target_w, native_h), Image.Resampling.LANCZOS)

    stitch_ratio = target_w / float(stitch_img.width)
    stitch_h = int(stitch_img.height * stitch_ratio)
    stitch_scaled = stitch_img.resize((target_w, stitch_h), Image.Resampling.LANCZOS)

    content_h = max(native_scaled.height, stitch_scaled.height)
    header_h = 100
    banner_w = target_w * 2 + 30
    banner_h = content_h + header_h + 30

    composite = Image.new('RGB', (banner_w, banner_h), color=(253, 249, 245))
    draw = ImageDraw.Draw(composite)

    draw.rectangle([(0, 0), (banner_w, header_h)], fill=(10, 37, 64))
    draw.text((30, 20), f"Odora Batch A Closeout — {screen_title} [{lang.upper()}] ({scroll_label.upper()})", fill=(255, 255, 255))
    draw.text((30, 52), f"Left: Native iOS Dev Build (iPhone 17 Pro)  |  Right: Stitch Reference Target", fill=(200, 215, 230))
    draw.text((30, 78), f"NATIVE APP [{lang.upper()}]", fill=(192, 203, 166))
    draw.text((target_w + 30, 78), "STITCH SPEC / CODE.HTML", fill=(192, 203, 166))

    composite.paste(native_scaled, (10, header_h + 15))
    composite.paste(stitch_scaled, (target_w + 20, header_h + 15))

    composite.save(output_path, quality=92)
    print(f"  -> Saved composite: {os.path.basename(output_path)}")

def main():
    print("=== Capturing Native Batch A Closeout Screens on iPhone 17 Pro Simulator ===\n")

    subprocess.run(['xcrun', 'simctl', 'launch', SIMULATOR_UDID, 'com.odora.diffuser'], check=False)
    time.sleep(1.5)

    for screen in SCREENS:
        s_id = screen['id']
        s_name = screen['screen_name']
        s_title = screen['title']
        stitch_p = screen['stitch_path']
        has_end = screen['has_end']
        has_sheet = screen['has_sheet']

        for lang in ['ar', 'en']:
            scroll_modes = ['top', 'end'] if has_end else ['top']
            for scroll in scroll_modes:
                print(f"Capturing {s_name} [{lang}] ({scroll})...")
                update_preview_target(s_name, lang, scroll_to_end=(scroll == 'end'), sheet=False)
                time.sleep(2.8)

                raw_filename = f"{s_id}_{lang}_{scroll}_native.png"
                raw_path = os.path.join(TARGET_DIR, raw_filename)
                capture_sim_screenshot(raw_path)

                composite_filename = f"{s_id}_{lang}_{scroll}_comparison.png"
                composite_path = os.path.join(TARGET_DIR, composite_filename)
                create_side_by_side(raw_path, stitch_p, composite_path, s_title, lang, scroll)

            if has_sheet:
                print(f"Capturing {s_name} Sheet [{lang}]...")
                update_preview_target(s_name, lang, scroll_to_end=False, sheet=True)
                time.sleep(2.8)

                sheet_raw = f"{s_id}_{lang}_sheet_native.png"
                sheet_raw_path = os.path.join(TARGET_DIR, sheet_raw)
                capture_sim_screenshot(sheet_raw_path)

                sheet_comp = f"{s_id}_{lang}_sheet_comparison.png"
                sheet_comp_path = os.path.join(TARGET_DIR, sheet_comp)
                create_side_by_side(sheet_raw_path, stitch_p, sheet_comp_path, f"{s_title} (New Routine Sheet)", lang, "sheet")

    # Reset preview target to neutral
    print("\nResetting previewConfig to screen: null, lang: null...")
    neutral_config = """export interface PreviewConfig {
  screen:
    | 'Home'
    | 'Devices'
    | 'DeviceControl'
    | 'DevicePairing'
    | 'Schedule'
    | 'DeviceSettings'
    | 'ConnectionStates'
    | 'Store'
    | 'Account'
    | null;
  lang: 'ar' | 'en' | null;
  scrollToEnd?: boolean;
  sheet?: boolean;
}

export const previewConfig: PreviewConfig = {
  screen: null,
  lang: null,
  scrollToEnd: false,
  sheet: false,
};
"""
    with open(PREVIEW_FILE, 'w') as f:
        f.write(neutral_config)
    subprocess.run([
        'xcrun', 'simctl', 'openurl', SIMULATOR_UDID,
        'com.odora.diffuser://expo-development-client/?url=http%3A%2F%2F127.0.0.1%3A8081'
    ], check=False)

    print("\nBatch A Closeout Native Capture Complete! All artifacts saved to reviews/qa-app-2026-09-25/")

if __name__ == '__main__':
    main()
