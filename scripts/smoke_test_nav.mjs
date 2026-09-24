import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const PROJECT_DIR = '/Users/zakaria/projects/antigravity/odora';
const QA_DIR = path.join(PROJECT_DIR, 'reviews/qa-app-2026-09-24/nav_smoke');
const PREVIEW_FILE = path.join(PROJECT_DIR, 'app/src/previewTarget.ts');

if (!fs.existsSync(QA_DIR)) {
  fs.mkdirSync(QA_DIR, { recursive: true });
}

// Reset previewConfig to null (full stack) with Arabic language
fs.writeFileSync(
  PREVIEW_FILE,
  `declare const __DEV__: boolean;

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

export const previewConfig: PreviewConfig = {
  screen: null,
  lang: 'ar',
};
`
);

async function runSmokeTest() {
  console.log('=== Batch A Interactive Navigation Smoke Test ===\n');

  // Connect to Chrome CDP on 9222
  let wsUrl = null;
  try {
    const listRes = await fetch('http://127.0.0.1:9222/json/list');
    const targets = await listRes.json();
    const page = targets.find(t => t.type === 'page');
    if (page) wsUrl = page.webSocketDebuggerUrl;
  } catch (e) {
    console.error('CDP connect error:', e);
  }

  if (!wsUrl) {
    throw new Error('Chrome CDP is not running on port 9222');
  }

  const ws = new WebSocket(wsUrl);
  let id = 1;
  const pending = new Map();
  ws.onmessage = e => {
    const d = JSON.parse(e.data);
    if (d.id && pending.has(d.id)) {
      pending.get(d.id)(d);
      pending.delete(d.id);
    }
  };
  await new Promise(r => ws.onopen = r);

  const send = (method, params = {}) =>
    new Promise(resolve => {
      const curId = id++;
      pending.set(curId, resolve);
      ws.send(JSON.stringify({ id: curId, method, params }));
    });

  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  });

  const evaluate = async (expr) => {
    const res = await send('Runtime.evaluate', {
      expression: expr,
      returnByValue: true,
    });
    return res.result?.result?.value;
  };

  const captureScreen = async (filename) => {
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(shot.result.data, 'base64');
    const outPath = path.join(QA_DIR, filename);
    fs.writeFileSync(outPath, buffer);
    console.log(`  📸 Screenshot saved: ${filename}`);
  };

  const clickTestId = async (testId) => {
    return await evaluate(`(() => {
      const el = document.querySelector('[data-testid="${testId}"]') ||
                 document.querySelector('[testid="${testId}"]');
      if (!el) return { success: false, reason: 'testID not found: ${testId}' };
      el.scrollIntoView({ behavior: 'instant', block: 'center' });
      const rect = el.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const opts = { bubbles: true, cancelable: true, view: window, clientX: x, clientY: y };
      el.dispatchEvent(new MouseEvent('mousedown', opts));
      el.dispatchEvent(new MouseEvent('mouseup', opts));
      el.dispatchEvent(new MouseEvent('click', opts));
      return { success: true, testId: '${testId}' };
    })()`);
  };

  const waitBodyContains = async (snippet, timeoutMs = 8000) => {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const body = await evaluate(`document.body.innerText || ''`);
      if (body && body.includes(snippet)) return true;
      await new Promise(r => setTimeout(r, 200));
    }
    return false;
  };

  const getBodyText = async () => evaluate(`document.body.innerText || ''`);

  const results = [];
  const logStep = (step, title, passed, detail = '') => {
    results.push({ step, title, passed, detail });
    const mark = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`[${mark}] Step ${step}: ${title} ${detail ? `(${detail})` : ''}`);
  };

  // ---------------------------------------------------------
  // STEP 1: Load Home Dashboard
  // ---------------------------------------------------------
  console.log('\n--- Step 1: Home Dashboard ---');
  await send('Page.navigate', { url: 'http://localhost:8081' });
  await waitBodyContains('الرئيسية', 6000);
  await new Promise(r => setTimeout(r, 1200));

  const homeText = await getBodyText();
  const hasHomeLoaded = homeText.includes('الرئيسية');
  const homeHasArabicLevel = homeText.includes('المستوى ٨') && homeText.includes('٨٠٪');
  const homeHasNoEnglish = !homeText.includes('Level 8');

  logStep('1', 'Home Screen rendered', hasHomeLoaded);
  logStep(
    '1.1',
    'Home: Arabic Level Fix ("المستوى ٨" and "٨٠٪" present, "Level 8" absent)',
    homeHasArabicLevel && homeHasNoEnglish,
    homeHasArabicLevel ? 'Found "المستوى ٨" & "٨٠٪"' : 'Missing "المستوى ٨"'
  );
  await captureScreen('01_home_screen.png');

  // ---------------------------------------------------------
  // STEP 2: Home Hero -> Device Control
  // ---------------------------------------------------------
  console.log('\n--- Step 2: Home Hero -> Device Control ---');
  const heroClick = await clickTestId('home-hero-card');
  console.log('  Hero clicked:', heroClick);
  await waitBodyContains('التحكم بالجهاز', 6000);
  await new Promise(r => setTimeout(r, 800));

  const dcText = await getBodyText();
  const dcLoaded = dcText.includes('التحكم بالجهاز');
  const dcHasArabicLevel = dcText.includes('المستوى ٨') && dcText.includes('٨٠٪');
  const dcHasNoEnglish = !dcText.includes('Level 8') && !dcText.includes('Level 6');

  logStep('2', 'Home hero card -> Device Control navigation', dcLoaded);
  logStep(
    '2.1',
    'Device Control: Arabic Level Fix ("المستوى ٨" and "٨٠٪" present, "Level 8" absent)',
    dcHasArabicLevel && dcHasNoEnglish,
    dcHasArabicLevel ? 'Found "المستوى ٨" & "٨٠٪"' : 'Missing "المستوى ٨"'
  );
  await captureScreen('02_device_control_screen.png');

  // ---------------------------------------------------------
  // STEP 3: "…" Button in Device Control -> Device Settings
  // ---------------------------------------------------------
  console.log('\n--- Step 3: Device Control "…" Button -> Device Settings ---');
  const moreClick = await clickTestId('device-settings-button');
  console.log('  "…" Button clicked:', moreClick);
  await waitBodyContains('إعدادات الجهاز', 6000);
  await new Promise(r => setTimeout(r, 800));

  const dsText = await getBodyText();
  const dsLoaded = dsText.includes('إعدادات الجهاز') && dsText.includes('موزع غرفة المعيشة');
  logStep('3', 'Device Control "…" button -> Device Settings navigation', dsLoaded);
  await captureScreen('03_device_settings_screen.png');

  // ---------------------------------------------------------
  // STEP 4: Forget Device Button -> Confirm Sheet
  // ---------------------------------------------------------
  console.log('\n--- Step 4: Forget Device Button -> Confirm Sheet ---');
  // Scroll down to the Forget Device card inside the scroll container
  await evaluate(`(() => {
    const scrollables = Array.from(document.querySelectorAll('*')).filter(el => {
      const s = window.getComputedStyle(el);
      return (s.overflowY === 'auto' || s.overflowY === 'scroll') && el.scrollHeight > el.clientHeight;
    });
    scrollables.forEach(el => el.scrollTop = el.scrollHeight);
  })()`);
  await new Promise(r => setTimeout(r, 600));

  const forgetClick = await clickTestId('forget-device-button');
  console.log('  Forget Device button clicked:', forgetClick);
  await waitBodyContains('إلغاء اقتران الجهاز؟', 5000);
  await new Promise(r => setTimeout(r, 600));

  const sheetText = await getBodyText();
  const sheetOpen = sheetText.includes('إلغاء اقتران الجهاز؟') && sheetText.includes('إلغاء الاقتران والحذف');
  logStep('4', 'Forget Device -> Confirm Sheet opens', sheetOpen);
  await captureScreen('04_forget_confirm_sheet.png');

  // ---------------------------------------------------------
  // STEP 5: Confirm Forget in Sheet -> Navigates to Devices
  // ---------------------------------------------------------
  console.log('\n--- Step 5: Confirm Forget -> Navigates to Devices ---');
  const confirmClick = await clickTestId('confirm-forget-button');
  console.log('  Confirm button clicked in sheet:', confirmClick);
  await waitBodyContains('الموزعات المتصلة', 6000);
  await new Promise(r => setTimeout(r, 800));

  const devicesText = await getBodyText();
  const devicesLoaded = devicesText.includes('الموزعات المتصلة');
  logStep('5', 'Confirm Sheet "إلغاء الاقتران والحذف" -> Navigates to Devices screen', devicesLoaded);
  await captureScreen('05_devices_after_forget.png');

  // ---------------------------------------------------------
  // STEP 6: "+ إقران جهاز" -> Device Pairing Screen
  // ---------------------------------------------------------
  console.log('\n--- Step 6: "+ إقران جهاز" -> Device Pairing Screen ---');
  const hasPairBtn = devicesText.includes('+ إقران جهاز') || devicesText.includes('إقران جهاز');
  logStep('6.1', 'Devices screen displays "+ إقران جهاز" button', hasPairBtn);

  const pairClick = await clickTestId('pair-device-button');
  console.log('  "+ إقران جهاز" clicked:', pairClick);
  await waitBodyContains('إقران موزع جديد', 5000);
  await new Promise(r => setTimeout(r, 800));

  const pairingText = await getBodyText();
  const pairingLoaded = pairingText.includes('إقران موزع جديد');
  logStep('6', '"+ إقران جهاز" -> Device Pairing Screen opens', pairingLoaded);
  await captureScreen('06_device_pairing_screen.png');

  // ---------------------------------------------------------
  // STEP 7: Pairing Back Button -> Back to Devices
  // ---------------------------------------------------------
  console.log('\n--- Step 7: Pairing Back Button -> Back to Devices ---');
  const pairBackClick = await clickTestId('appbar-back-button');
  console.log('  Back clicked:', pairBackClick);
  await waitBodyContains('الموزعات المتصلة', 5000);
  await new Promise(r => setTimeout(r, 800));

  const backDevicesText = await getBodyText();
  const backToDevices = backDevicesText.includes('الموزعات المتصلة');
  logStep('7', 'Device Pairing Back button -> Back to Devices screen', backToDevices);
  await captureScreen('07_back_to_devices.png');

  // ---------------------------------------------------------
  // STEP 8: Device Card -> Device Control
  // ---------------------------------------------------------
  console.log('\n--- Step 8: Device Card -> Device Control ---');
  const cardClick = await clickTestId('device-card-living-room');
  console.log('  Device card clicked:', cardClick);
  await waitBodyContains('التحكم بالجهاز', 5000);
  await new Promise(r => setTimeout(r, 800));

  const dcFromCard = await getBodyText();
  const dcFromCardLoaded = dcFromCard.includes('التحكم بالجهاز');
  logStep('8', 'Devices Screen: Device card -> Device Control navigation', dcFromCardLoaded);
  await captureScreen('08_device_card_to_control.png');

  // ---------------------------------------------------------
  // STEP 9: Schedule Row in Device Control -> Schedule Screen
  // ---------------------------------------------------------
  console.log('\n--- Step 9: Schedule Row -> Schedule Screen ---');
  const schedClick = await clickTestId('schedule-row-button');
  console.log('  Schedule row clicked:', schedClick);
  await waitBodyContains('جدولة الروتين', 5000);
  await new Promise(r => setTimeout(r, 800));

  const schedText = await getBodyText();
  const schedLoaded = schedText.includes('جدولة الروتين');
  const schedHasArabicLevels = schedText.includes('المستوى ٧') || schedText.includes('المستوى ٤') || schedText.includes('المستوى ٣');

  logStep('9', 'Device Control: Schedule row -> Schedule Screen navigation', schedLoaded);
  logStep(
    '9.1',
    'Schedule Screen: Localized Arabic levels present ("المستوى ٧ / ٤ / ٣")',
    schedHasArabicLevels,
    schedHasArabicLevels ? 'Found Arabic numerals in routines' : 'Missing Arabic numerals'
  );
  await captureScreen('09_schedule_screen.png');

  // ---------------------------------------------------------
  // STEP 10: Schedule Back -> Device Control
  // ---------------------------------------------------------
  console.log('\n--- Step 10: Schedule Back -> Device Control ---');
  await clickTestId('appbar-back-button');
  await waitBodyContains('التحكم بالجهاز', 5000);
  await new Promise(r => setTimeout(r, 600));

  const backToDcText = await getBodyText();
  const backToDcLoaded = backToDcText.includes('التحكم بالجهاز');
  logStep('10', 'Schedule Screen Back button -> Back to Device Control', backToDcLoaded);

  // ---------------------------------------------------------
  // STEP 11: Navigate to Home Tab and tap "إدارة (3)" -> Devices
  // ---------------------------------------------------------
  console.log('\n--- Step 11: Home "إدارة (3)" -> Devices ---');
  await send('Page.navigate', { url: 'http://localhost:8081' });
  await waitBodyContains('الرئيسية', 5000);
  await new Promise(r => setTimeout(r, 1000));

  const manageClick = await clickTestId('manage-devices-button');
  console.log('  "إدارة (3)" clicked:', manageClick);
  await waitBodyContains('الموزعات المتصلة', 5000);
  await new Promise(r => setTimeout(r, 800));

  const manageDevicesText = await getBodyText();
  const manageNavigated = manageDevicesText.includes('الموزعات المتصلة');
  logStep('11', 'Home "إدارة (3)" button -> Devices screen navigation', manageNavigated);
  await captureScreen('10_manage_to_devices.png');

  // ---------------------------------------------------------
  // SUMMARY REPORT
  // ---------------------------------------------------------
  console.log('\n======================================================');
  console.log('           NAVIGATION SMOKE TEST SUMMARY              ');
  console.log('======================================================');
  let allPass = true;
  for (const res of results) {
    if (!res.passed) allPass = false;
    const status = res.passed ? 'PASS' : 'FAIL';
    console.log(`[${status}] Step ${res.step}: ${res.title}`);
  }
  console.log('======================================================');
  console.log(`Final Outcome: ${allPass ? 'ALL TESTS PASSED ✅' : 'SOME TESTS FAILED ❌'}`);
  console.log(`Proofs Directory: ${QA_DIR}`);

  ws.close();
  return allPass;
}

runSmokeTest()
  .then(pass => {
    process.exit(pass ? 0 : 1);
  })
  .catch(err => {
    console.error('Fatal error during smoke test:', err);
    process.exit(1);
  });
