import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const htmlPath = join(__dirname, 'cv.html');
const outputPath = join(__dirname, '..', 'public', 'cv.pdf');

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
await page.pdf({
  path: outputPath,
  format: 'A4',
  printBackground: true,
  margin: { top: '0', bottom: '0', left: '0', right: '0' },
});
await browser.close();
console.log(`PDF written to ${outputPath}`);
