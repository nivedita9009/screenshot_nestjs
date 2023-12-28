// src/screenshot/screenshot.service.ts
import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Injectable()
export class ScreenshotService {
  async captureScreenshot(
    url: string,
    size: string,
    script: string,
  ): Promise<string> {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 180000 });

      // Set viewport size based on the selected option
      if (size === 'mobile') {
        await page.setViewport({ width: 375, height: 667 });
      } else if (size === 'tab') {
        await page.setViewport({ width: 768, height: 1024 });
      } else {
        // Default to desktop size
        await page.setViewport({ width: 1200, height: 800 });
      }

      const divAdsGoogleFrameElementSelector = 'div[id^="google_ads_iframe_"]';
      const elements = await page.$$(divAdsGoogleFrameElementSelector);

      let screenshot: string;

      for (const element of elements) {
        await page.evaluate((element) => {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest',
          });
        }, element);

        await page.evaluate(
          (elementDiv, scriptContent) => {
            elementDiv.innerHTML = scriptContent;
            const iframe = elementDiv.querySelector('iframe');

            if (iframe) {
              iframe.style.width = '1070px'; // Assign string values
              iframe.style.height = '450px'; // Assign string values
            }
          },
          element,
          script,
        );

        await page.waitForTimeout(2000);
        screenshot = await page.screenshot({ encoding: 'base64' });
      }

      return screenshot;
    } finally {
      await browser.close();
    }
  }
}
