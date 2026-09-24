import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const PROJECT_DIR = '/Users/zakaria/projects/antigravity/odora';
const TARGET_DIR = path.join(PROJECT_DIR, 'reviews/qa-app-2026-09-23');
const PREVIEW_FILE = path.join(PROJECT_DIR, 'app/src/previewTarget.ts');

if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

const SCREENS = [
  { id: 'home', screen_name: 'Home', title: 'Home Dashboard' },
  { id: 'devices', screen_name: 'Devices', title: 'Devices List' },
  { id: 'device_control', screen_name: 'DeviceControl', title: 'Device Control' },
  { id: 'device_pairing', screen_name: 'DevicePairing', title: 'Device Pairing' },
  { id: 'schedule', screen_name: 'Schedule', title: 'Schedule & Routines' },
  { id: 'device_settings', screen_name: 'DeviceSettings', title: 'Device Settings' },
  { id: 'connection_states', screen_name: 'ConnectionStates', title: 'Connection States' },
];

function updatePreview(screen, lang) {
  const content = `declare const __DEV__: boolean;

export interface PreviewConfig {
  screen:
    | 'Home'
    | 'Devices'
    | 'DeviceControl'
    | 'DevicePairing'
    | 'Schedule'
    | 'DeviceSettings'
    | 'ConnectionStates'
    | 'Store'
    | 'Category'
    | 'Search'
    | 'ProductDetail'
    | 'Cart'
    | 'Checkout'
    | 'OrderConfirmation'
    | null;
  lang: 'ar' | 'en' | null;
}

export const previewConfig: PreviewConfig =
  typeof __DEV__ !== 'undefined' && __DEV__
    ? {
        screen: ${screen ? `'${screen}'` : 'null'},
        lang: ${lang ? `'${lang}'` : 'null'},
      }
    : {
        screen: null,
        lang: null,
      };
`;
  fs.writeFileSync(PREVIEW_FILE, content);
}

async function runCapture() {
  console.log('Launching headless Chrome for Batch A full scroll capture...');
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--user-data-dir=/tmp/cdp_batch_a_profile',
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank'
  ]);

  let connected = false;
  for (let i = 0; i < 30; i++) {
    try {
      const r = await fetch('http://127.0.0.1:9222/json/list');
      if (r.ok) { connected = true; break; }
    } catch(e) {}
    await new Promise(r => setTimeout(r, 200));
  }
  if (!connected) throw new Error('Could not connect to Chrome CDP');

  const targets = await (await fetch('http://127.0.0.1:9222/json/list')).json();
  const pageTarget = targets.find(t => t.type === 'page');

  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  let id = 1;
  const map = new Map();
  ws.onmessage = e => {
    const d = JSON.parse(e.data);
    if (d.id && map.has(d.id)) {
      map.get(d.id)(d);
      map.delete(d.id);
    }
  };
  await new Promise(r => ws.onopen = r);

  const send = (method, params = {}) => new Promise(res => {
    const curId = id++;
    map.set(curId, res);
    ws.send(JSON.stringify({ id: curId, method, params }));
  });

  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });

  for (const screen of SCREENS) {
    for (const lang of ['ar', 'en']) {
      console.log(`\n--- Capturing ${screen.screen_name} (${lang}) ---`);
      updatePreview(screen.screen_name, lang);

      // Give Metro bundler time to detect file change and recompile
      await new Promise(r => setTimeout(r, 1200));

      // Navigate / reload page to ensure state and language apply cleanly
      await send('Page.navigate', { url: 'http://localhost:8081' });

      // Wait until rendered and target screen is active
      let maxScrollH = 844;
      const expectedText = screen.screen_name === 'Home'
        ? (lang === 'ar' ? 'الرئيسية' : 'Home')
        : screen.screen_name === 'Devices'
        ? (lang === 'ar' ? 'الموزعات المتصلة' : 'Connected Diffusers')
        : screen.screen_name === 'DeviceControl'
        ? (lang === 'ar' ? 'التحكم بالجهاز' : 'Device Control')
        : screen.screen_name === 'DevicePairing'
        ? (lang === 'ar' ? 'إقران موزع جديد' : 'Pair Diffuser')
        : screen.screen_name === 'Schedule'
        ? (lang === 'ar' ? 'جدولة الروتين' : 'Schedule Routine')
        : screen.screen_name === 'DeviceSettings'
        ? (lang === 'ar' ? 'إعدادات الجهاز' : 'Device Settings')
        : (lang === 'ar' ? 'حالات الاتصال' : 'Connection States');

      for (let i = 0; i < 40; i++) {
        const check = await send('Runtime.evaluate', {
          expression: `(() => {
            const bodyText = document.body.innerText || '';
            const hasExpected = bodyText.includes(${JSON.stringify(expectedText)});
            let maxH = 0;
            document.querySelectorAll('*').forEach(el => {
              if (el.scrollHeight > maxH) maxH = el.scrollHeight;
            });
            return { maxH, hasExpected, len: bodyText.length };
          })()`,
          returnByValue: true
        });
        const val = check.result?.result?.value;
        if (val && val.hasExpected && val.maxH > 600) {
          maxScrollH = Math.max(val.maxH, 844);
          console.log(`Verified screen ${screen.screen_name} with text "${expectedText}", maxH: ${maxScrollH}`);
          break;
        }
        await new Promise(r => setTimeout(r, 250));
      }

      // Settle time for fonts, images, and animations
      await new Promise(r => setTimeout(r, 1200));

      // 1. First capture at phone viewport (390 x 844) scrolled to the very end to verify zero clipping
      await send('Emulation.setDeviceMetricsOverride', {
        width: 390,
        height: 844,
        deviceScaleFactor: 2,
        mobile: true
      });
      await send('Runtime.evaluate', {
        expression: `(() => {
          document.querySelectorAll('*').forEach(el => {
            if (el.scrollHeight > el.clientHeight) {
              el.scrollTop = el.scrollHeight;
            }
          });
          window.scrollTo(0, document.body.scrollHeight);
        })()`
      });
      await new Promise(r => setTimeout(r, 600));
      const scrolledShot = await send('Page.captureScreenshot', { format: 'png' });
      if (scrolledShot.result?.data) {
        const scrolledPath = path.join(TARGET_DIR, `scrolled_end_${screen.id}__${lang}.png`);
        fs.writeFileSync(scrolledPath, Buffer.from(scrolledShot.result.data, 'base64'));
        console.log(`Saved scrolled-to-end check: ${scrolledPath}`);
      }

      // 2. Now expand to full scroll height for side-by-side composite
      console.log(`Setting device metrics override for full height: 390 x ${maxScrollH}`);
      await send('Emulation.setDeviceMetricsOverride', {
        width: 390,
        height: maxScrollH,
        deviceScaleFactor: 2,
        mobile: true
      });

      // Expand all scrollable containers so full content renders without scrollbar truncation
      await send('Runtime.evaluate', {
        expression: `(() => {
          document.querySelectorAll('*').forEach(el => {
            if (el.scrollHeight > el.clientHeight && el.clientHeight < ${maxScrollH}) {
              el.style.overflow = 'visible';
              el.style.height = 'auto';
              el.style.maxHeight = 'none';
            }
          });
        })()`
      });

      await new Promise(r => setTimeout(r, 500));

      const shot = await send('Page.captureScreenshot', {
        format: 'png',
        captureBeyondViewport: true
      });

      if (shot.result?.data) {
        const rawPath = `/tmp/raw_${screen.id}__${lang}.png`;
        fs.writeFileSync(rawPath, Buffer.from(shot.result.data, 'base64'));
        console.log(`Saved raw capture: ${rawPath}`);
      } else {
        console.error(`Failed to capture ${screen.id}__${lang}`);
      }
    }
  }

  // Reset preview target
  updatePreview(null, null);

  ws.close();
  chrome.kill();
  console.log('\nAll raw screenshots captured!');
}

runCapture().catch(e => {
  console.error(e);
  process.exit(1);
});
