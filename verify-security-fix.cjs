(async () => {
const { chromium } = require('playwright');
const browser = await chromium.launch({ args: ['--host-resolver-rules=MAP gt-web-iota.vercel.app 76.76.21.21'] });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, ignoreHTTPSErrors: true });
const page = await ctx.newPage();
const BASE = 'https://gt-web-iota.vercel.app';
page.on('pageerror', err => console.log('pageerror:', err.message));

const testEmail = `qa-verify-${Date.now()}@example.com`;
const testName = 'QA VERIFICATION - safe to delete';

console.log('--- nav to /browse');
await page.goto(`${BASE}/browse`, { waitUntil: 'domcontentloaded', timeout: 45000 });
await page.waitForTimeout(1500);

const card = page.locator('button:has(h3)').first();
await card.waitFor({ timeout: 15000 });
await card.click();
await page.waitForTimeout(1200);

await page.getByRole('button', { name: /add to cart/i }).click();
await page.waitForTimeout(800);
await page.getByRole('button', { name: /check out/i }).click();
await page.waitForTimeout(1000);

console.log('--- toggling to Create Account');
await page.getByRole('button', { name: /create account/i }).click();
await page.waitForTimeout(500);

const modalForm = page.locator('.fixed form').first();
await modalForm.locator('input[placeholder="Full name"]').fill(testName);
await modalForm.locator('input[placeholder="Email address"]').fill(testEmail);
await modalForm.locator('input[placeholder="Password"]').fill('TestPass123!');

await page.screenshot({ path: 'C:/Users/Admin/AppData/Local/Temp/claude/c--Users-Admin--antigravity-GalaxaTech/69552bde-3507-429f-b069-5a798f7f8fb4/scratchpad/verify-pre-submit.png' });
console.log('submit button disabled?', await modalForm.locator('button[type="submit"]').isDisabled());
console.log('submit button text:', await modalForm.locator('button[type="submit"]').innerText());

console.log('--- submitting signup, waiting for /api/auth/signup response');
const [signupRes] = await Promise.all([
  page.waitForResponse(r => r.url().includes('/api/auth/signup'), { timeout: 20000 }),
  modalForm.locator('button[type="submit"]').click(),
]);
console.log('signup response:', signupRes.status(), await signupRes.text());

await page.waitForTimeout(1500);
await page.screenshot({ path: 'C:/Users/Admin/AppData/Local/Temp/claude/c--Users-Admin--antigravity-GalaxaTech/69552bde-3507-429f-b069-5a798f7f8fb4/scratchpad/verify-post-signup.png' });

console.log('--- filling payment step');
await page.locator('input[placeholder="Jane Doe"]').fill(testName);
await page.locator('input[placeholder="01XXXXXXXXX"]').first().fill('01712345678');
await page.locator('input[placeholder="01XXXXXXXXX"]').nth(1).fill('01712345678');
await page.locator('input[placeholder="9AK3D7F2Q1"]').fill('QATEST' + Date.now());

console.log('--- submitting order, waiting for /api/orders response');
const [orderRes] = await Promise.all([
  page.waitForResponse(r => r.url().includes('/api/orders') && r.request().method() === 'POST', { timeout: 20000 }),
  page.getByRole('button', { name: /complete order/i }).click(),
]);
console.log('order response:', orderRes.status(), await orderRes.text());

await page.waitForTimeout(1000);
await page.screenshot({ path: 'C:/Users/Admin/AppData/Local/Temp/claude/c--Users-Admin--antigravity-GalaxaTech/69552bde-3507-429f-b069-5a798f7f8fb4/scratchpad/verify-order-success.png' });

console.log('--- checking /api/orders/mine directly');
const [mineRes] = await Promise.all([
  page.waitForResponse(r => r.url().includes('/api/orders/mine'), { timeout: 15000 }).catch(() => null),
  page.goto(`${BASE}/hub/customer`, { waitUntil: 'domcontentloaded', timeout: 20000 }),
]);
if (mineRes) console.log('orders/mine response:', mineRes.status(), (await mineRes.text()).slice(0, 500));
await page.waitForTimeout(1500);
await page.screenshot({ path: 'C:/Users/Admin/AppData/Local/Temp/claude/c--Users-Admin--antigravity-GalaxaTech/69552bde-3507-429f-b069-5a798f7f8fb4/scratchpad/verify-hub-final.png' });

await browser.close();
console.log('--- test email used ---');
console.log(testEmail);
})().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
