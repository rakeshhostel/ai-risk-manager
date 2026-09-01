const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'https://rakeshhostel.github.io/ai-risk-manager/';
const SCREENSHOT_DIR = path.join(__dirname, '..', 'screenshots');
const RECORDING_DIR = path.join(__dirname, '..', 'recording');

async function navigateTo(page, label) {
  try {
    const link = page.locator('a', { hasText: label }).first();
    if (await link.isVisible({ timeout: 3000 })) {
      await link.click();
    } else {
      console.log(`    ⚠️ Could not find visible link for "${label}", trying fallback locator...`);
      await page.click(`text=${label}`);
    }
  } catch (err) {
    console.log(`    ⚠️ Error navigating to "${label}": ${err.message}`);
  }
}

async function run() {
  console.log('🚀 Launching browser...');
  
  const browser = await chromium.launch({ headless: true });
  
  // --- PART 1: HIGH-QUALITY SCREENSHOTS ---
  console.log('\n📸 Taking screenshots...');
  const screenshotContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2, // Retina quality
  });
  const page = await screenshotContext.newPage();

  // Login first
  console.log('  → Accessing site...');
  await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);
  
  const loginInput = await page.$('input[type="email"]');
  if (loginInput) {
    console.log('  → Logging in...');
    await page.fill('input[type="email"]', 'admin@demo.com');
    await page.fill('input[type="password"]', 'demo123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
  }

  // Screenshot 1: Dashboard
  console.log('  → Dashboard...');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'dashboard.png'), fullPage: false });
  console.log('    ✅ dashboard.png');

  // Screenshot 2: Transactions
  console.log('  → Transactions...');
  await navigateTo(page, 'Transactions');
  await page.waitForTimeout(2500);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'transactions.png'), fullPage: false });
  console.log('    ✅ transactions.png');

  // Screenshot 3: Risk Analysis
  console.log('  → Risk Analysis...');
  await navigateTo(page, 'Risk Analysis');
  await page.waitForTimeout(2500);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'risk-analysis.png'), fullPage: false });
  console.log('    ✅ risk-analysis.png');

  // Screenshot 4: 3D Network
  console.log('  → 3D Network...');
  await navigateTo(page, '3D Network');
  await page.waitForTimeout(4000);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '3d-network.png'), fullPage: false });
  console.log('    ✅ 3d-network.png');

  // Screenshot 5: Alerts
  console.log('  → Alerts...');
  await navigateTo(page, 'Alerts');
  await page.waitForTimeout(2500);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'alerts.png'), fullPage: false });
  console.log('    ✅ alerts.png');

  // Screenshot 6: AI Investigator
  console.log('  → AI Investigator...');
  await navigateTo(page, 'AI Investigator');
  await page.waitForTimeout(2500);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'ai-investigator.png'), fullPage: false });
  console.log('    ✅ ai-investigator.png');

  // Screenshot 7: Analytics
  console.log('  → Analytics...');
  await navigateTo(page, 'Analytics');
  await page.waitForTimeout(2500);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'analytics.png'), fullPage: false });
  console.log('    ✅ analytics.png');

  // Screenshot 8: Rules Engine
  console.log('  → Rules...');
  await navigateTo(page, 'Rules');
  await page.waitForTimeout(2500);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'rules-engine.png'), fullPage: false });
  console.log('    ✅ rules-engine.png');

  // Screenshot 9: Settings
  console.log('  → Settings...');
  await navigateTo(page, 'Settings');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'settings.png'), fullPage: false });
  console.log('    ✅ settings.png');

  await screenshotContext.close();

  // --- PART 2: VIDEO RECORDING ---
  console.log('\n🎥 Recording demo video...');
  const videoContext = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: {
      dir: RECORDING_DIR,
      size: { width: 1280, height: 720 },
    },
  });
  const videoPage = await videoContext.newPage();

  // Access site & Login
  await videoPage.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
  await videoPage.waitForTimeout(2000);
  const videoLoginInput = await videoPage.$('input[type="email"]');
  if (videoLoginInput) {
    await videoPage.fill('input[type="email"]', 'admin@demo.com');
    await videoPage.waitForTimeout(500);
    await videoPage.fill('input[type="password"]', 'demo123');
    await videoPage.waitForTimeout(500);
    await videoPage.click('button[type="submit"]');
    await videoPage.waitForTimeout(3000);
  }

  // Walkthrough
  console.log('  → Recording Dashboard...');
  await videoPage.waitForTimeout(3000);

  console.log('  → Recording Transactions...');
  await navigateTo(videoPage, 'Transactions');
  await videoPage.waitForTimeout(3000);

  console.log('  → Recording Risk Analysis...');
  await navigateTo(videoPage, 'Risk Analysis');
  await videoPage.waitForTimeout(3000);

  console.log('  → Recording 3D Network...');
  await navigateTo(videoPage, '3D Network');
  await videoPage.waitForTimeout(5000);

  console.log('  → Recording Alerts...');
  await navigateTo(videoPage, 'Alerts');
  await videoPage.waitForTimeout(3000);

  console.log('  → Recording AI Investigator...');
  await navigateTo(videoPage, 'AI Investigator');
  await videoPage.waitForTimeout(2000);
  
  // Type a query in AI Investigator
  const queryInput = await videoPage.$('input[placeholder*="Query"], input[placeholder*="query"], input[type="text"]');
  if (queryInput) {
    await queryInput.click();
    await videoPage.keyboard.type('Summarize transactions for Priya Patel', { delay: 60 });
    await videoPage.waitForTimeout(1000);
    await videoPage.keyboard.press('Enter');
    await videoPage.waitForTimeout(4000);
  }

  console.log('  → Recording Analytics...');
  await navigateTo(videoPage, 'Analytics');
  await videoPage.waitForTimeout(3000);

  console.log('  → Recording Rules...');
  await navigateTo(videoPage, 'Rules');
  await videoPage.waitForTimeout(3000);

  console.log('  → Recording Settings + Dark Mode toggle...');
  await navigateTo(videoPage, 'Settings');
  await videoPage.waitForTimeout(2000);

  const darkModeBtn = await videoPage.$('button[title*="Light"], button[title*="Dark"]');
  if (darkModeBtn) {
    await darkModeBtn.click();
    await videoPage.waitForTimeout(2000);
    await darkModeBtn.click();
    await videoPage.waitForTimeout(2000);
  }

  console.log('  → Back to Dashboard...');
  await navigateTo(videoPage, 'Dashboard');
  await videoPage.waitForTimeout(3000);

  // Close context to finalize video
  const videoObj = videoPage.video();
  await videoContext.close();
  const rawVideoPath = await videoObj.path();
  
  const finalVideoPath = path.join(RECORDING_DIR, 'demo.webm');
  if (fs.existsSync(rawVideoPath)) {
    fs.copyFileSync(rawVideoPath, finalVideoPath);
    console.log(`\n✅ Video saved and copied to: ${finalVideoPath}`);
  }

  await browser.close();
  console.log('\n🎉 All done! Screenshots and video generated smoothly.');
}

run().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
