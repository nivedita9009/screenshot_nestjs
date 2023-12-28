// import puppeteer from "puppeteer";

// export default async (req, res) => {
//   const { url, size, script } = req.query;

//   try {
//     const browser = await puppeteer.launch({ headless: true });
//     const page = await browser.newPage();

//     await page.goto(url, { waitUntil: "networkidle2", timeout: 180000 });

//     // Set viewport size based on the selected option
//     if (size === "mobile") {
//       await page.setViewport({ width: 375, height: 667 });
//     } else if (size === "tab") {
//       await page.setViewport({ width: 768, height: 1024 });
//     } else {
//       // Default to desktop size
//       await page.setViewport({ width: 1200, height: 800 });
//     }

//     const divAdsGoogleFrameElementSelector = 'div[id^="google_ads_iframe_"]';

//     const hasAdsFrame = await page
//       .waitForSelector(divAdsGoogleFrameElementSelector, { timeout: 5000 })
//       .then(() => true)
//       .catch(() => false);

//     if (hasAdsFrame) {
//       const frames = page.frames();
//       let screenshot;
//       const elements = await page.$$(divAdsGoogleFrameElementSelector);
//       for (const element of elements) {
//         await element.scrollIntoView({
//           behavior: "smooth",
//           block: "start",
//           inline: "nearest",
//         });
//         await page.evaluate((elementDiv, script) => {
//           // Replace the content with the provided script (iframe tag)
//           elementDiv.innerHTML = script;
//           const iframe = elementDiv.querySelector("iframe");
//           if (iframe) {
//             iframe.width = 1070; // Set your desired width
//             iframe.height = 250; // Set your desired height
//           }
//         }, element, script);
//         await page.waitForTimeout(2000);
//         screenshot = await page.screenshot({ encoding: "base64" });
//       }


//       browser.close();

//       res.status(200).json({ screenshot });
//     } else {
//       // If selector is not found, take a screenshot of the original webpage
//       const screenshot = await page.screenshot({ encoding: "base64" });
//       browser.close();
//       res.status(200).json({ screenshot });
//     }
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };
