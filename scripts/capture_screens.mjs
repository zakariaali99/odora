import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const PROJECT_DIR = '/Users/zakaria/projects/antigravity/odora';
const PREVIEW_FILE = path.join(PROJECT_DIR, 'app/src/previewTarget.ts');

function updatePreview(screen, lang) {
  const content = `export interface PreviewConfig {
  screen: 'Home' | 'Devices' | 'DeviceControl' | 'DevicePairing' | 'Schedule' | 'DeviceSettings' | 'ConnectionStates' | null;
  lang: 'ar' | 'en' | null;
}
export const previewConfig: PreviewConfig = {
  screen: ${screen ? `'${screen}'` : 'null'},
  lang: ${lang ? `'${lang}'` : 'null'},
};
`;
  fs.writeFileSync(PREVIEW_FILE, content);
}

async function testCapture() {
  updatePreview('Home', 'ar');

  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--user-data-dir=/tmp/cdp_test_profile_mjs',
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank'
  ]);

  let connected = false;
  for (let i = 0; i < 20; i++) {
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

  console.log('Navigating to http://localhost:8081...');
  await send('Page.navigate', { url: 'http://localhost:8081' });

  // Wait until rendered
  let maxScrollH = 844;
  for (let i = 0; i < 40; i++) {
    const check = await send('Runtime.evaluate', {
      expression: `(() => {
        let maxH = 0;
        document.querySelectorAll('*').forEach(el => {
          if (el.scrollHeight > maxH) maxH = el.scrollHeight;
        });
        const len = document.body.innerText.length;
        return { maxH, len };
      })()`,
      returnByValue: true
    });
    const val = check.result?.result?.value;
    if (val && val.len > 50 && val.maxH > 600) {
      maxScrollH = Math.max(val.maxH, 844);
      console.log('Found rendered app with max scroll height:', maxScrollH, 'text len:', val.len);
      break;
    }
    await new Promise(r => setTimeout(r, 250));
  }

  // Extra settle for images
  await new Promise(r => setTimeout(r, 1500));

  // Expand viewport height so the entire page renders without scrollbar cutoff
  console.log('Overriding device metrics to height:', maxScrollH);
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: maxScrollH,
    deviceScaleFactor: 2,
    mobile: true
  });

  // Make all scrolling containers unconstrained in height for the capture
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
    fs.writeFileSync('/tmp/full_home_ar.png', Buffer.from(shot.result.data, 'base64'));
    console.log('Captured /tmp/full_home_ar.png successfully!');
  }

  ws.close();
  chrome.kill();
}

testCapture().catch(console.error);
