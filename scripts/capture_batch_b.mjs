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
  {
    id: 'store',
    screen_name: 'Store',
    title: 'Store (Catalog)',
    expected_ar: 'المتجر',
    expected_en: 'Store',
  },
  {
    id: 'category',
    screen_name: 'Category',
    title: 'Botanical Cartridges (Category)',
    expected_ar: 'الخراطيش النباتية',
    expected_en: 'Botanical Cartridges',
  },
  {
    id: 'search',
    screen_name: 'Search',
    title: 'Search & Discovery',
    expected_ar: 'البحث والاستكشاف',
    expected_en: 'Search & Discovery',
  },
  {
    id: 'product_detail',
    screen_name: 'ProductDetail',
    title: 'Product Detail (Odora Air 01)',
    expected_ar: 'تفاصيل المنتج',
    expected_en: 'Product Detail',
  },
  {
    id: 'cart',
    screen_name: 'Cart',
    title: 'Sanctuary Cart',
    expected_ar: 'سلة المشتريات',
    expected_en: 'Sanctuary Bag',
  },
  {
    id: 'checkout',
    screen_name: 'Checkout',
    title: 'Checkout',
    expected_ar: 'إتمام الطلب',
    expected_en: 'Checkout',
  },
  {
    id: 'order_confirmation',
    screen_name: 'OrderConfirmation',
    title: 'Order Confirmation',
    expected_ar: 'تأكيد الطلب',
    expected_en: 'Order Confirmation',
  },
];

function updatePreview(screen, lang) {
  const content = `export interface PreviewConfig {
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

export const previewConfig: PreviewConfig = {
  screen: ${screen ? `'${screen}'` : 'null'},
  lang: ${lang ? `'${lang}'` : 'null'},
};
`;
  fs.writeFileSync(PREVIEW_FILE, content);
}

async function runCapture() {
  console.log('Launching headless Chrome for Batch B full scroll capture...');
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--user-data-dir=/tmp/cdp_batch_b_profile',
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
      const expectedText = lang === 'ar' ? screen.expected_ar : screen.expected_en;

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

      console.log(`Setting device metrics override: 390 x ${maxScrollH}`);
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
  console.log('\nAll raw Batch B screenshots captured!');
}

runCapture().catch(e => {
  console.error(e);
  process.exit(1);
});
