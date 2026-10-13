// Screenshots each scene in diy.html to out/<id>.png
import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const dir = path.resolve(".");
fs.mkdirSync("diyout", { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1000, height: 1250 }, deviceScaleFactor: 2 });
await page.goto("file://" + dir + "/diy.html", { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(800);
const only = process.argv.slice(2);
for (const el of await page.$$(".scene")) {
  const id = await el.getAttribute("id");
  if (only.length && !only.includes(id)) continue;
  await el.screenshot({ path: `diyout/${id}.png` });
  console.log("rendered", id);
}
await browser.close();
