import { chromium } from "playwright";
import fs from "fs";
import path from "path";
const C = JSON.parse(fs.readFileSync("diy.json", "utf8"));
const COLS = ["#E63946", "#FF8A00", "#3A86FF", "#3BB273", "#FF3E8A", "#2EC4B6", "#8338EC", "#E5177A"];
const page = (inner, cls = "") => `<section class="page ${cls}">${inner}</section>`;
const cover = page(`<div class="cov-l"><div class="eyebrow">KAGADA 2026 · DIY PHOTO BOOTHS</div>
  <h1><span style="color:#FF3E8A">Make</span> <span style="color:#FFD23F">it</span> <span style="color:#2EC4B6">loud.</span></h1>
  <p class="lede">8 colourful photo booths you can build in <b>3 days</b> from cardboard, chart paper, crepe paper, paper plates, kites, marigolds and fairy lights. Most of them cost <b>under ₹500</b>.</p>
  <div class="meta">Each one fits the Geoshakthi stand and board (≈ 6 × 8 ft). Reuse it and just change the front.</div></div>
  <div class="cov-grid">${C.map((c, i) => `<div><img src="diyjpg/d${i + 1}.jpg"><span style="background:${COLS[i]}">${i + 1}</span></div>`).join("")}</div>`, "cover");
const concepts = C.map((c, i) => page(`<div class="img"><img src="diyjpg/d${i + 1}.jpg"></div>
  <div class="body" style="--acc:${COLS[i]}"><div class="num">${String(i + 1).padStart(2, "0")}</div><h2>${c.name}</h2><div class="tag">${c.tag}</div>
  <div class="chips"><span>💰 ${c.cost}</span><span>⏱ ${c.time}</span></div>
  <h3>The idea</h3><p>${c.idea}</p>
  <h3>You'll need</h3><ul>${c.mat.map((m) => `<li>${m}</li>`).join("")}</ul>
  <h3>How to build it</h3><ol>${c.steps.map((m) => `<li>${m}</li>`).join("")}</ol></div>`, "concept"));
const rows = C.map((c, i) => `<tr><td><b style="color:${COLS[i]}">${i + 1}</b></td><td>${c.name}</td><td>${c.cost}</td><td>${c.time}</td></tr>`).join("");
const last = page(`<div class="head"><h2>Pick one & go</h2></div><div class="two">
  <table><tr><th></th><th>Booth</th><th>Cost</th><th>Time</th></tr>${rows}</table>
  <div class="txt"><h3>Best for 3 days and no budget</h3><ol>
  <li><b>7 Paper Plate Mandala</b>: the cheapest showstopper. Plates cost ₹1–2 each and volunteers can paint them in parallel.</li>
  <li><b>6 Kagada TV</b>: the cardboard is free from any appliance shop, and everybody gets the joke.</li>
  <li><b>3 Comic Book POW!</b>: paint, bottle caps and black tape. Huge impact on Instagram.</li>
  <li><b>4 Kagada Habba Gate</b>: the most festive, and marigolds are cheap right after Dasara.</li></ol>
  <h3>Mix & match</h3><ul><li>Crepe streamers (5) or fairy lights (8) can go on top of <i>any</i> booth for ₹100 extra.</li><li>Make 5–6 prop sticks from leftover chart paper: speech bubbles, stars and a KA-GA-DA! starburst.</li></ul>
  <h3>3-day plan</h3><ul><li><b>Day 1:</b> pick the booth, collect boxes, buy paper and paint, assign teams.</li><li><b>Day 2:</b> build. Run painting, folding and cutting in parallel.</li><li><b>Day 3:</b> assemble on the spot, then take test photos with a phone. Face the booth toward the light and hang a plain cloth behind the window.</li></ul></div></div>`);
const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Luckiest+Guy&family=Pacifico&family=Inter:wght@400;600;700;800&family=Noto+Sans+Kannada:wght@600&family=Noto+Color+Emoji&display=block" rel="stylesheet">
<style>@page{size:297mm 210mm;margin:0}*{box-sizing:border-box}body{margin:0;font-family:Inter,"Noto Sans Kannada","Noto Color Emoji",sans-serif;color:#1d1b22}
.page{width:297mm;height:210mm;page-break-after:always;overflow:hidden;background:#FFFBF3;position:relative}
.cover{background:#1C1F5E;color:#fff;display:flex;padding:16mm;gap:12mm}.cov-l{width:40%;display:flex;flex-direction:column;justify-content:center}
.eyebrow{font-size:9pt;letter-spacing:3px;font-weight:700;color:#FFD23F}h1{font-family:"Luckiest Guy";font-weight:400;font-size:54pt;line-height:1;margin:5mm 0}
.lede{font-size:12pt;line-height:1.55}.meta{margin-top:8mm;font-size:9pt;opacity:.8;border-top:1px solid #ffffff44;padding-top:4mm}
.cov-grid{flex:1;display:grid;grid-template-columns:repeat(4,1fr);gap:3mm;align-content:center}.cov-grid div{position:relative}.cov-grid img{width:100%;display:block;border-radius:2mm}
.cov-grid span{position:absolute;left:2mm;top:2mm;width:6mm;height:6mm;border-radius:50%;color:#fff;font-weight:800;font-size:9pt;display:flex;align-items:center;justify-content:center}
.concept{display:flex}.img{width:150mm;flex:none;background:#EFE9DE}.img img{height:210mm;display:block;margin:0 auto}
.body{flex:1;padding:13mm 13mm 8mm 9mm}.num{font-family:"Luckiest Guy";font-size:24pt;color:var(--acc)}
h2{font-family:"Luckiest Guy";font-weight:400;font-size:25pt;margin:0;line-height:1.05;color:#1d1b22}.tag{font-family:Pacifico;font-size:12.5pt;color:var(--acc,#8338EC);margin-top:1.5mm}
.chips{margin-top:3mm;display:flex;gap:2mm}.chips span{background:var(--acc);color:#fff;font-weight:700;font-size:9pt;padding:1.2mm 3mm;border-radius:10mm}
h3{font-size:8.5pt;letter-spacing:2px;text-transform:uppercase;color:var(--acc,#E63946);margin:4.5mm 0 1.5mm}p,li{font-size:9.6pt;line-height:1.48;margin:0}ul,ol{margin:0;padding-left:5mm}li{margin-bottom:1mm}
.head{padding:12mm 14mm 3mm}.two{display:flex;gap:10mm;padding:0 14mm}table{border-collapse:collapse;font-size:10pt;width:45%;align-self:flex-start}
th{text-align:left;font-size:7.5pt;letter-spacing:1.5px;text-transform:uppercase;color:#888;padding:2mm}td{padding:2.6mm 2mm;border-top:1px solid #eadfcb}td:nth-child(3){white-space:nowrap}.txt{flex:1}</style></head><body>${cover}${concepts.join("")}${last}</body></html>`;
fs.writeFileSync("diybook.html", html);
const b = await chromium.launch(); const p = await b.newPage();
await p.goto("file://" + path.resolve("diybook.html"), { waitUntil: "networkidle" }); await p.evaluate(() => document.fonts.ready);
await p.pdf({ path: "KAGADA_2026_DIY_Photo_Booths.pdf", width: "297mm", height: "210mm", printBackground: true }); await b.close(); console.log("ok");
