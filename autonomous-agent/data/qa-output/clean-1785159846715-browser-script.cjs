const { chromium } = require('playwright');
const fs = require('fs');

const TARGET_URL = "http://127.0.0.1:54159/";
const REPORT_PATH = "C:\\Users\\kasde\\Documents\\RhooaLabsCode\\saos-studio\\autonomous-agent\\data\\qa-output\\clean-1785159846715-browser.json";
const MOBILE_SHOT = "C:\\Users\\kasde\\Documents\\RhooaLabsCode\\saos-studio\\autonomous-agent\\data\\qa-output\\clean-1785159846715-mobile.png";
const DESKTOP_SHOT = "C:\\Users\\kasde\\Documents\\RhooaLabsCode\\saos-studio\\autonomous-agent\\data\\qa-output\\clean-1785159846715-desktop.png";

const report = {
  pageErrors: [],
  consoleErrors: [],
  failedRequests: [],
  overflowAt375: false,
  error: null,
};

(async () => {
  let browser = null;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    page.on('pageerror', function (err) {
      report.pageErrors.push(String(err && err.message ? err.message : err));
    });
    page.on('console', function (msg) {
      if (msg.type() === 'error') {
        report.consoleErrors.push(msg.text());
      }
    });
    page.on('requestfailed', function (req) {
      const reqUrl = req.url();
      if (reqUrl.indexOf('favicon') !== -1) return;
      const failure = req.failure();
      report.failedRequests.push({ url: reqUrl, error: failure ? failure.errorText : 'unknown' });
    });

    await page.goto(TARGET_URL, { waitUntil: 'networkidle', timeout: 30000 });

    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(300);
    await page.screenshot({ path: MOBILE_SHOT });

    report.overflowAt375 = await page.evaluate(function () {
      var el = document.scrollingElement || document.documentElement;
      return el.scrollWidth > el.clientWidth;
    });

    await page.setViewportSize({ width: 1280, height: 720 });
    await page.waitForTimeout(200);
    await page.screenshot({ path: DESKTOP_SHOT });
  } catch (err) {
    report.error = String(err && err.message ? err.message : err);
  } finally {
    try {
      fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
    } catch (writeErr) {
      // nothing more we can do if the report itself can't be written
    }
    if (browser) {
      try { await browser.close(); } catch (closeErr) {}
    }
    process.exit(0);
  }
})();
