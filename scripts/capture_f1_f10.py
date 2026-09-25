import os
import sys
import time
import subprocess
from PIL import Image, ImageDraw

PROJECT_DIR = '/Users/zakaria/projects/antigravity/odora'
TARGET_DIR = os.path.join(PROJECT_DIR, 'reviews/qa-app-2026-09-25')
PREVIEW_FILE = os.path.join(PROJECT_DIR, 'app/src/previewTarget.ts')
SIMULATOR_UDID = 'E58744A3-BDDD-41A9-90B3-D2ACC9374EFB'

os.makedirs(TARGET_DIR, exist_ok=True)

ITEMS = [
    {
        'id': 'home_ar_top',
        'screen': 'Home',
        'lang': 'ar',
        'end': False,
        'sheet': False,
        'title': 'Home Dashboard',
        'scroll_label': 'top',
        'stitch': os.path.join(PROJECT_DIR, 'design-reference/stitch/idea-02/odora_home_dashboard/screen.png'),
    },
    {
        'id': 'home_ar_end',
        'screen': 'Home',
        'lang': 'ar',
        'end': True,
        'sheet': False,
        'title': 'Home Dashboard',
        'scroll_label': 'end',
        'stitch': os.path.join(PROJECT_DIR, 'design-reference/stitch/idea-02/odora_home_dashboard/screen.png'),
    },
    {
        'id': 'home_en_top',
        'screen': 'Home',
        'lang': 'en',
        'end': False,
        'sheet': False,
        'title': 'Home Dashboard',
        'scroll_label': 'top',
        'stitch': os.path.join(PROJECT_DIR, 'design-reference/stitch/idea-02/odora_home_dashboard/screen.png'),
    },
    {
        'id': 'home_en_end',
        'screen': 'Home',
        'lang': 'en',
        'end': True,
        'sheet': False,
        'title': 'Home Dashboard',
        'scroll_label': 'end',
        'stitch': os.path.join(PROJECT_DIR, 'design-reference/stitch/idea-02/odora_home_dashboard/screen.png'),
    },
    {
        'id': 'devices_ar_top',
        'screen': 'Devices',
        'lang': 'ar',
        'end': False,
        'sheet': False,
        'title': 'Devices List',
        'scroll_label': 'top',
        'stitch': os.path.join(PROJECT_DIR, 'design-reference/stitch/idea-02/odora_devices/screen.png'),
    },
    {
        'id': 'devices_en_top',
        'screen': 'Devices',
        'lang': 'en',
        'end': False,
        'sheet': False,
        'title': 'Devices List',
        'scroll_label': 'top',
        'stitch': os.path.join(PROJECT_DIR, 'design-reference/stitch/idea-02/odora_devices/screen.png'),
    },
    {
        'id': 'device_control_ar_end',
        'screen': 'DeviceControl',
        'lang': 'ar',
        'end': True,
        'sheet': False,
        'title': 'Device Control',
        'scroll_label': 'end',
        'stitch': os.path.join(PROJECT_DIR, 'design-reference/stitch/idea-02/odora_device_control/screen_rendered.png'),
    },
    {
        'id': 'device_control_en_end',
        'screen': 'DeviceControl',
        'lang': 'en',
        'end': True,
        'sheet': False,
        'title': 'Device Control',
        'scroll_label': 'end',
        'stitch': os.path.join(PROJECT_DIR, 'design-reference/stitch/idea-02/odora_device_control/screen_rendered.png'),
    },
    {
        'id': 'connection_states_ar_top',
        'screen': 'ConnectionStates',
        'lang': 'ar',
        'end': False,
        'sheet': False,
        'title': 'Connection States',
        'scroll_label': 'top',
        'stitch': os.path.join(PROJECT_DIR, 'design-reference/stitch/idea-02/odora_connection_states/screen.png'),
    },
    {
        'id': 'connection_states_ar_end',
        'screen': 'ConnectionStates',
        'lang': 'ar',
        'end': True,
        'sheet': False,
        'title': 'Connection States',
        'scroll_label': 'end',
        'stitch': os.path.join(PROJECT_DIR, 'design-reference/stitch/idea-02/odora_connection_states/screen.png'),
    },
    {
        'id': 'connection_states_en_top',
        'screen': 'ConnectionStates',
        'lang': 'en',
        'end': False,
        'sheet': False,
        'title': 'Connection States',
        'scroll_label': 'top',
        'stitch': os.path.join(PROJECT_DIR, 'design-reference/stitch/idea-02/odora_connection_states/screen.png'),
    },
    {
        'id': 'connection_states_en_end',
        'screen': 'ConnectionStates',
        'lang': 'en',
        'end': True,
        'sheet': False,
        'title': 'Connection States',
        'scroll_label': 'end',
        'stitch': os.path.join(PROJECT_DIR, 'design-reference/stitch/idea-02/odora_connection_states/screen.png'),
    },
    {
        'id': 'device_settings_ar_sheet',
        'screen': 'DeviceSettings',
        'lang': 'ar',
        'end': False,
        'sheet': True,
        'title': 'Device Settings (Forget Sheet)',
        'scroll_label': 'sheet',
        'stitch': os.path.join(PROJECT_DIR, 'design-reference/stitch/idea-02/odora_device_settings/screen.png'),
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
    time.sleep(0.5)
    subprocess.run(['xcrun', 'simctl', 'launch', SIMULATOR_UDID, 'com.odora.diffuser'], check=False)
    time.sleep(4.5)

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

    composite.paste(native_scaled, (10, header_h + 15))
    composite.paste(stitch_scaled, (target_w + 20, header_h + 15))

    composite.save(output_path, quality=92)
    print(f"Saved comparison: {output_path}")

def main():
    print(f"Starting F1-F10 targeted captures ({len(ITEMS)} items)...")
    for item in ITEMS:
        print(f"\nTargeting: {item['id']} ({item['screen']}, {item['lang']}, end={item['end']}, sheet={item['sheet']})...")
        update_preview_target(item['screen'], item['lang'], item['end'], item['sheet'])
        
        native_path = os.path.join(TARGET_DIR, f"{item['id']}_native.png")
        comp_path = os.path.join(TARGET_DIR, f"{item['id']}_comparison.png")
        
        capture_sim_screenshot(native_path)
        print(f"Captured: {native_path}")
        
        create_side_by_side(
            native_path,
            item['stitch'],
            comp_path,
            item['title'],
            item['lang'],
            item['scroll_label']
        )
    
    # Reset previewConfig to clean defaults
    print("\nResetting previewConfig to clean defaults...")
    clean_content = """export interface PreviewConfig {
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
        f.write(clean_content)
    subprocess.run(['xcrun', 'simctl', 'terminate', SIMULATOR_UDID, 'com.odora.diffuser'], check=False)
    time.sleep(0.4)
    subprocess.run(['xcrun', 'simctl', 'launch', SIMULATOR_UDID, 'com.odora.diffuser'], check=False)
    time.sleep(2)
    print("Done! Clean configuration restored.")

if __name__ == '__main__':
    main()
