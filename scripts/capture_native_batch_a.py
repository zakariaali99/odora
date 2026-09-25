import os
import sys
import time
import subprocess
from PIL import Image, ImageDraw, ImageFont

PROJECT_DIR = '/Users/zakaria/projects/antigravity/odora'
TARGET_DIR = os.path.join(PROJECT_DIR, 'reviews/qa-app-2026-09-24/native_batch_a')
FLOWS_DIR = os.path.join(PROJECT_DIR, 'reviews/qa-app-2026-09-24/flows')
PREVIEW_FILE = os.path.join(PROJECT_DIR, 'app/src/previewTarget.ts')
SIMULATOR_UDID = 'E58744A3-BDDD-41A9-90B3-D2ACC9374EFB'

os.makedirs(TARGET_DIR, exist_ok=True)
os.makedirs(FLOWS_DIR, exist_ok=True)

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
        'stitch_path': os.path.join(PROJECT_DIR, 'design-reference/stitch/idea-02/odora_device_control/screen_rendered.png'),
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

def update_preview_target(screen_name, lang, scroll_to_end=False, sheet=False):
    screen_val = f"'{screen_name}'" if screen_name else "null"
    lang_val = f"'{lang}'" if lang else "null"
    scroll_val = "true" if scroll_to_end else "false"
    sheet_val = "true" if sheet else "false"
    ts = int(time.time() * 1000)
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
  scrollToEnd?: boolean;
  sheet?: boolean;
  timestamp?: number;
}}

export const previewConfig: PreviewConfig = {{
  screen: {screen_val},
  lang: {lang_val},
  scrollToEnd: {scroll_val},
  sheet: {sheet_val},
  timestamp: {ts},
}};
"""
    with open(PREVIEW_FILE, 'w') as f:
        f.write(content)
    subprocess.run([
        'xcrun', 'simctl', 'openurl', SIMULATOR_UDID,
        'com.odora.diffuser://expo-development-client/?url=http%3A%2F%2F127.0.0.1%3A8081'
    ], check=False)

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
    draw.text((30, 20), f"Odora Batch A — {screen_title} [{lang.upper()}] ({scroll_label.upper()})", fill=(255, 255, 255))
    draw.text((30, 52), f"Left: Native iOS Dev Build (iPhone 17 Pro)  |  Right: Stitch Reference Target", fill=(200, 215, 230))
    draw.text((30, 78), f"NATIVE APP [{lang.upper()}]", fill=(192, 203, 166))
    draw.text((target_w + 30, 78), "STITCH SPEC / CODE.HTML", fill=(192, 203, 166))

    composite.paste(native_scaled, (10, header_h + 15))
    composite.paste(stitch_scaled, (target_w + 20, header_h + 15))

    composite.save(output_path, quality=92)
    print(f"  -> Saved composite: {os.path.basename(output_path)}")

def main():
    print("=== Capturing Native Batch A Screens on iPhone 17 Pro Simulator ===\n")

    # Launch app
    subprocess.run(['xcrun', 'simctl', 'launch', SIMULATOR_UDID, 'com.odora.diffuser'], check=False)
    time.sleep(1.5)

    for screen in SCREENS:
        s_id = screen['id']
        s_name = screen['screen_name']
        s_title = screen['title']
        stitch_p = screen['stitch_path']

        for lang in ['ar', 'en']:
            for scroll in ['top', 'end']:
                print(f"Capturing {s_name} [{lang}] ({scroll})...")
                update_preview_target(s_name, lang, scroll_to_end=(scroll == 'end'), sheet=False)
                
                # Allow hot-reload & mount to settle
                time.sleep(2.5)

                raw_filename = f"{s_id}_{lang}_{scroll}_native.png"
                raw_path = os.path.join(TARGET_DIR, raw_filename)
                capture_sim_screenshot(raw_path)

                composite_filename = f"{s_id}_{lang}_{scroll}_comparison.png"
                composite_path = os.path.join(TARGET_DIR, composite_filename)
                create_side_by_side(raw_path, stitch_p, composite_path, s_title, lang, scroll)

    print("\n=== Capturing Native Flow Proofs ===")
    # 1. Pairing Flow Step 1: Discovery
    print("Capturing Flow 1: Step 1 - Pairing Discovery...")
    update_preview_target('DevicePairing', 'ar', scroll_to_end=False, sheet=False)
    time.sleep(2.5)
    capture_sim_screenshot(os.path.join(FLOWS_DIR, 'flow1_pair_step1_discovery.png'))

    # 2. Pairing Flow Step 2: Name & Room Input Sheet
    print("Capturing Flow 1: Step 2 - Name & Room Setup Sheet...")
    update_preview_target('DevicePairing', 'ar', scroll_to_end=False, sheet=True)
    time.sleep(2.5)
    capture_sim_screenshot(os.path.join(FLOWS_DIR, 'flow1_pair_step2_name_room_sheet.png'))

    # 3. Pairing Flow Step 3: Newly paired device opened in Device Control
    print("Capturing Flow 1: Step 3 - Device Control...")
    update_preview_target('DeviceControl', 'ar', scroll_to_end=False, sheet=False)
    time.sleep(2.5)
    capture_sim_screenshot(os.path.join(FLOWS_DIR, 'flow1_pair_step3_device_control.png'))

    # 4. Schedule Flow Step 4: Schedule with New Routine Sheet & Start/End Times
    print("Capturing Flow 1: Step 4 - New Routine with Start & End Times...")
    update_preview_target('Schedule', 'ar', scroll_to_end=False, sheet=True)
    time.sleep(2.5)
    capture_sim_screenshot(os.path.join(FLOWS_DIR, 'flow1_pair_step4_new_routine_sheet.png'))

    # 5. Schedule Flow Step 5: Schedule showing saved routine list & Libyan weekend rhythm
    print("Capturing Flow 1: Step 5 - Schedule List & Libyan Weekend...")
    update_preview_target('Schedule', 'ar', scroll_to_end=False, sheet=False)
    time.sleep(2.5)
    capture_sim_screenshot(os.path.join(FLOWS_DIR, 'flow1_pair_step5_schedule_list.png'))

    # 6. Flow 2: Bluetooth Disabled Diagnostic Screen matching Stitch idea-02
    print("Capturing Flow 2: Bluetooth Disabled Full Diagnostic Screen...")
    update_preview_target('ConnectionStates', 'ar', scroll_to_end=False, sheet=False)
    time.sleep(2.5)
    capture_sim_screenshot(os.path.join(FLOWS_DIR, 'flow2_bluetooth_disabled_diagnostic.png'))

    # Reset preview target to Home, Arabic
    update_preview_target('Home', 'ar', scroll_to_end=False, sheet=False)
    print("\nBatch A Native Capture Complete! All artifacts saved.")

if __name__ == '__main__':
    main()
