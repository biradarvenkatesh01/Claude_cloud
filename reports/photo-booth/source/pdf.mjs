// Builds the concept book PDF from the rendered images.
import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const C = [
  { n: "01", name: "Torn Through", tag: "Burst through a giant sheet of kagada.",
    idea: "The whole booth is one huge sheet of handmade paper, and the window looks like someone just punched through it. Kagada means paper in Kannada, so this is the event's name taken literally.",
    moment: "Push the torn flaps aside, put a fist through, or pull a friend in through the hole. People will act it out without being told.",
    build: ["Print the parchment texture on flex and paste it on 5 mm sunboard; cut the jagged opening freehand with a jigsaw.", "Cut the 5 curled flaps separately and fix them at an angle with hot glue and hidden L-brackets so they really stick out (3D).", "Rough up the outer edge by hand and scatter a few paper scraps at the base."],
    stats: [5, 4, 3, "₹₹"] },
  { n: "02", name: "Origami Sky", tag: "Fold. Fly. Innovate.",
    idea: "Matches the website: burgundy woven texture, a folded-paper frame around the window, and a flock of origami cranes flying out past the board's edges. It looks like the site come to life.",
    moment: "Cranes appear to fly out of the photo. Hold a crane prop and pose as if you are releasing it.",
    build: ["Frame: 4 sunboard trapezoids printed in 4 shades of parchment so they read as a raised, folded frame.", "Cranes: large printed sunboard cutouts, or real cranes folded from chart paper, mounted on thin acrylic or steel rods past the edges.", "Volunteers can fold extra cranes in the week before the event (a good team activity)."],
    stats: [5, 3, 3, "₹₹"] },
  { n: "03", name: "Proceedings Vol. 22", tag: "You are Figure 1.",
    idea: "The booth is the front page of a research paper: title, authors ('You, Your Best Friend, et al.'), abstract, and a red ACCEPTED stamp. The window is Fig. 1. It's an inside joke for a paper-presentation conference.",
    moment: "Every photo is instantly a meme: 'I got published at KAGADA'. Pair it with the Reviewer #2 and Peer Reviewed props.",
    build: ["Rectangular board, so it's the easiest to cut and print. Only the dog-ear corner is angled.", "The ACCEPTED stamp is a separate cutout fixed 5 cm in front of the board so it casts a shadow.", "Keep the body text at the sizes shown or larger so it stays readable in phone photos."],
    stats: [4, 5, 3, "₹"] },
  { n: "04", name: "The Kagada Times", tag: "Front-page news, starring you.",
    idea: "A vintage newspaper front page with the headline STUDENTS STEAL THE SHOW. The window is the lead photo, and side columns carry jokes such as 'Weather: 100% chance of ideas'.",
    moment: "A classic that works for every age group. Teachers, judges and guests will want one too.",
    build: ["Black on newsprint cream prints cleanly at any print shop.", "The EXTRA! EXTRA! starburst is a separate cutout breaking the top-left corner.", "Optional: a small chalk or whiteboard strip in a column for live 'breaking news' (winners, food sold out...)."],
    stats: [4, 5, 3, "₹"] },
  { n: "05", name: "ಕಾಗದ Commemorative Stamp", tag: "A ₹22 stamp for the 22nd edition.",
    idea: "A giant commemorative postage stamp with a perforated edge, ಕಾಗದ in Kannada script, a value of ₹22 for the 22nd edition, and a UVCE Bengaluru 560001 postmark.",
    moment: "Feels collectible and proudly local. The Kannada script makes it unmistakably Bengaluru.",
    build: ["Cut the scalloped perforations with a circle-cutter jig or a hole saw at 7.5 cm spacing (a CNC shop can do it in minutes).", "The postmark is a separate round cutout overlapping the corner, slightly roughened print for an ink look.", "Have a native speaker check the Kannada text before printing."],
    stats: [4, 3, 3, "₹₹"] },
  { n: "06", name: "Boarding Pass: Idea → Impact", tag: "Flight KGD 26 · Gate UVCE · Seat 1A.",
    idea: "A giant boarding pass from IDEA to IMPACT. Passenger: YOU. Class: INNOVATOR. Zone: FUTURE. Paper planes take off from the top corners on dashed flight paths.",
    moment: "'Next stop: everywhere'. Great for travel-style poses, and the planes work as handheld props.",
    build: ["Rounded corners and the two half-circle notches at the tear line make the outline instantly read as a ticket.", "Laminate the PASSENGER field so people can write their names with a dry-erase marker.", "Paper planes: sunboard cutouts on rods, or real A3 paper planes."],
    stats: [4, 4, 3, "₹₹"] },
  { n: "07", name: "Pop-Up UVCE", tag: "Step into the paper campus.",
    idea: "The most ambitious concept. An arched board (echoing UVCE's heritage arched windows) rises out of a giant open pop-up book on the floor. The origami UVCE building and trees from the website hero frame the window.",
    moment: "The biggest wow factor and the most shareable: it's the website's hero image, but you are standing in it.",
    build: ["Base: a low wooden platform with curved white sunboard 'pages' fanning out on both sides.", "The trees and building are separate cutout layers set 5–10 cm apart for real pop-up depth.", "The website's hero image is only 1024 px wide. Get the high-resolution original (or a vector redraw) before printing at this size."],
    stats: [5, 2, 3, "₹₹₹"] },
  { n: "08", name: "Maroonprint", tag: "Do not scale your dreams.",
    idea: "An engineering blueprint in burgundy: grid, gears, dimension lines ('Width: ∞ ideas', 'Height: legendary'), a part callout ('① Future engineer, qty 2+') and a title block signed off by Reviewer #2.",
    moment: "Speaks directly to engineers. The jokes reward people who stop and read, and it looks sharp on Instagram.",
    build: ["Only one ink colour on burgundy, so it's cheap and forgiving to print.", "The top scroll roller is a 4-inch PVC pipe wrapped in burgundy paper with end caps.", "Optional: a second roller at the bottom so it looks like an unrolled drawing."],
    stats: [4, 4, 3, "₹"] },
  { n: "09", name: "Find Your Orbit", tag: "Every track orbits KAGADA.",
    idea: "Based on the website's orbital tracks section. The booth itself is a giant gear with a circular window, and badges for Paper, Poster, Project, Ottige Kaliyona and Food For Cause orbit around it.",
    moment: "A circular portrait frame that people love. Participants can point to their own track's badge.",
    build: ["Gear and window are cut on a CNC or with a jigsaw and template; the orbit ring is a 2 cm sunboard strip held by small brackets.", "Run warm LED strip or rope light along the orbit ring so it glows in evening photos.", "The base plinth hides the stand legs and carries the 'find your orbit' title."],
    stats: [5, 2, 2, "₹₹₹"] },
  { n: "10", name: "Giant Polaroid", tag: "kagada ’26 ♥",
    idea: "A huge instant-photo print, tilted, taped to the wall with red washi tape, with a handwritten caption and doodles. It has the largest window of all the concepts.",
    moment: "Fits groups of 4–6, so it's perfect for whole teams, volunteer crews and the IEEE committee photo.",
    build: ["The simplest build: a white board with a large opening and a thick bottom border.", "Tape strips and the PAPER CERTIFIED sticker are separate cutouts that overhang the edges.", "Mount it slightly tilted on the stand; the tilt is what makes it read as a real polaroid."],
    stats: [3, 5, 5, "₹"] },
];

const dots = (v) => Array.from({ length: 5 }, (_, i) => `<span class="dot ${i < v ? "on" : ""}"></span>`).join("");
const page = (inner, cls = "") => `<section class="page ${cls}">${inner}</section>`;

const cover = page(`
  <div class="cov-l"><div class="eyebrow">IEEE UVCE · KAGADA 2026 · 24 OCTOBER</div>
    <h1>Photo Booth<br>Concepts</h1>
    <p class="lede">Ten booth ideas for KAGADA day, plus a handheld prop kit. Each one is built around one idea: <b>kagada</b> means <i>paper</i>, so every booth plays with paper.</p>
    <div class="meta">Same size as the Geoshakthi booth (≈ 6 × 8 ft) · uses the KAGADA website's burgundy and parchment palette</div></div>
  <div class="cov-grid">${C.map((c, i) => `<div><img src="jpg/c${i + 1}.jpg"><span>${c.n}</span></div>`).join("")}</div>`, "cover");

const brief = page(`
  <div class="head"><span class="num">00</span><h2>Brief & how to read the renders</h2></div>
  <div class="two">
    <div><img class="ref" src="jpg/ref.jpg"><div class="cap">Reference: Geoshakthi booth at UVCE. A cutout board on a metal stand, with a window in the middle and parts that break out of the outline.</div></div>
    <div class="txt">
      <h3>What we kept from the reference</h3>
      <ul><li>Same footprint: about <b>6 ft wide × 8 ft tall</b> (1.8 × 2.4 m) on a two-leg metal stand. I estimated this from the photo, so measure the real booth before printing.</li>
      <li>A window of about <b>3.2 × 3.2 ft</b>, from about <b>2.9 ft to 6 ft</b> above the floor, so people standing and sitting both fit.</li>
      <li>Parts that break the outline (like the satellite's solar panels) make a booth feel 3D, so every concept has at least one.</li></ul>
      <h3>What's new</h3>
      <ul><li>One idea for everything: <b>ಕಾಗದ / kagada = paper</b>. Torn paper, origami, research papers, newspapers, stamps, tickets, blueprints, polaroids.</li>
      <li>Website colours: burgundy <span class="sw" style="background:#5A182B"></span> #5A182B, parchment <span class="sw" style="background:#D8D3C7"></span> #D8D3C7, KAGADA red <span class="sw" style="background:#C0262D"></span> and gold accents, and the Saman font from the KAGADA wordmark.</li></ul>
      <h3>Reading the renders</h3>
      <ul><li>The grey figures show where people stand behind the window.</li><li>The renders are concept mockups, not print files. Once you pick a concept, the final artwork should be made at full size as vector files.</li></ul>
    </div></div>`);

const concepts = C.map((c, i) => page(`
  <div class="img"><img src="jpg/c${i + 1}.jpg"></div>
  <div class="body">
    <div class="num">${c.n}</div><h2>${c.name}</h2><div class="tag">${c.tag}</div>
    <h3>The idea</h3><p>${c.idea}</p>
    <h3>The photo moment</h3><p>${c.moment}</p>
    <h3>Build notes</h3><ul>${c.build.map((b) => `<li>${b}</li>`).join("")}</ul>
    <div class="stats"><div><label>Wow factor</label>${dots(c.stats[0])}</div><div><label>Ease of build</label>${dots(c.stats[1])}</div><div><label>Group size</label>${dots(c.stats[2])}</div><div><label>Cost</label><b>${c.stats[3]}</b></div></div>
  </div>`, "concept"));

const props = page(`
  <div class="img"><img src="jpg/c11.jpg"></div>
  <div class="body"><div class="num">+</div><h2>KAGADA Prop Kit</h2><div class="tag">Works with any booth you choose.</div>
    <h3>The props</h3><ul>
    <li><b>Speech bubbles:</b> “Paper accepted!”, “Reviewer #2 who?”, “here for Food for Cause”, “ಕಾಗದ crew”.</li>
    <li><b>Signs:</b> PEER REVIEWED ✓, an ACCEPTED stamp paddle, and a Certificate of Being Awesome.</li>
    <li><b>Paper objects:</b> a giant origami crane and a paper plane on sticks.</li></ul>
    <h3>More ideas</h3><ul>
    <li>Track-specific bubbles: “My poster > your poster”, “It worked in the demo”, “Hardware is hard”.</li>
    <li>A paper-crown and paper-glasses station: participants fold their own from KAGADA-printed sheets.</li>
    <li>A QR code on the booth linking to kagada2026.live and the Instagram handle, plus the hashtag <b>#KAGADA2026</b>.</li></ul>
    <h3>Build</h3><ul><li>Print on 5 mm sunboard, cut to shape, and glue to 2 ft wooden dowels. Make 2 of each of the most popular ones.</li></ul>
  </div>`, "concept");

const rows = C.map((c) => `<tr><td><b>${c.n}</b></td><td>${c.name}</td><td>${dots(c.stats[0])}</td><td>${dots(c.stats[1])}</td><td>${dots(c.stats[2])}</td><td>${c.stats[3]}</td></tr>`).join("");
const compare = page(`
  <div class="head"><span class="num">✓</span><h2>Compare & recommendation</h2></div>
  <div class="two wide">
    <table><tr><th></th><th>Concept</th><th>Wow</th><th>Ease</th><th>Group</th><th>Cost</th></tr>${rows}</table>
    <div class="txt">
      <h3>My picks</h3>
      <ol><li><b>03 Proceedings Vol. 22</b>: the strongest idea for a paper-presentation conference, the funniest result, and a rectangular board that's the easiest to build in 10 days.</li>
      <li><b>01 Torn Through</b>: the most literal take on ‘kagada’, with real 3D flaps people can interact with. Very photogenic.</li>
      <li><b>09 Find Your Orbit</b> or <b>07 Pop-Up UVCE</b>: if you have budget for a showpiece. Both tie directly to the website.</li></ol>
      <p class="note">Budget option: <b>one main booth + the prop kit</b>. If there's room for two booths, pair a funny one (03 or 04) with a beautiful one (01, 02 or 07).</p>
      <h3>Tips for the day</h3>
      <ul><li><b>Lighting:</b> face the booth toward the light. A bright window <i>behind</i> the opening, as in the reference photo, leaves faces dark. Add a ring light or soft LED panel on a stand.</li>
      <li><b>Backdrop:</b> hang a plain burgundy or cream cloth 1–1.5 m behind the booth so photos look clean.</li>
      <li><b>Timeline (event on 24 Oct):</b> pick a concept by <b>16 Oct</b> → final artwork by <b>18 Oct</b> → print & cut by <b>21 Oct</b> → assemble & test photos by <b>23 Oct</b>.</li></ul>
    </div></div>`);

const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,700;1,400&family=Noto+Serif+Kannada:wght@700&display=block" rel="stylesheet">
<style>
@font-face{font-family:Saman;src:url(assets/SAMAN___.woff2) format("woff2")}
@page{size:297mm 210mm;margin:0}
*{box-sizing:border-box}body{margin:0;font-family:Inter,"Noto Serif Kannada",sans-serif;color:#2b1d21}
.page{width:297mm;height:210mm;page-break-after:always;position:relative;overflow:hidden;background:#F6F2EA}
.cover{background:#5A182B;color:#ECE7DC;display:flex;padding:16mm;gap:12mm}
.cov-l{width:42%;display:flex;flex-direction:column;justify-content:center}
.eyebrow{font-size:9pt;letter-spacing:3px;font-weight:600;color:#D8D3C7;opacity:.85}
h1{font-family:Saman;font-weight:400;font-size:62pt;line-height:.95;margin:6mm 0;color:#ECE7DC}
.lede{font-size:12pt;line-height:1.55}.meta{margin-top:8mm;font-size:9pt;color:#D8D3C7;border-top:1px solid rgba(216,211,199,.4);padding-top:4mm}
.cov-grid{flex:1;display:grid;grid-template-columns:repeat(5,1fr);gap:3mm;align-content:center}
.cov-grid div{position:relative}.cov-grid img{width:100%;display:block;border:1.5px solid rgba(236,231,220,.35)}
.cov-grid span{position:absolute;left:2mm;top:1.5mm;font-size:8pt;font-weight:700;color:#5A182B}
.head{display:flex;align-items:baseline;gap:5mm;padding:12mm 14mm 4mm}
.num{font-family:"Playfair Display";font-weight:700;font-size:30pt;color:#C0262D;line-height:1}
h2{font-family:Saman;font-weight:400;font-size:30pt;margin:0;color:#5A182B;line-height:1.05}
h3{font-size:8.5pt;letter-spacing:2px;text-transform:uppercase;color:#C0262D;margin:5mm 0 1.5mm}
p,li{font-size:10pt;line-height:1.5;margin:0}ul,ol{margin:0;padding-left:5mm}li{margin-bottom:1.2mm}
.two{display:flex;gap:10mm;padding:0 14mm}.two>div:first-child{width:36%}.two .txt{flex:1}
.wide>table{width:47%}.ref{width:100%;height:150mm;object-fit:cover;border-radius:2mm}.cap{font-size:8.5pt;color:#6d5c60;margin-top:2mm}
.sw{display:inline-block;width:3.2mm;height:3.2mm;border-radius:50%;vertical-align:-0.5mm;border:1px solid #0002}
.concept{display:flex}.concept .img{width:150mm;height:210mm;flex:none;background:#EDE7DC}.concept .img img{height:210mm;display:block;margin:0 auto}
.concept .body{flex:1;padding:13mm 13mm 10mm 9mm}.concept .num{font-size:22pt}
.tag{font-family:"Playfair Display";font-style:italic;font-size:13pt;color:#6d5c60;margin-top:1.5mm}
.stats{display:grid;grid-template-columns:1fr 1fr;gap:2.5mm 6mm;margin-top:6mm;padding-top:4mm;border-top:1px solid #d8cfc0}
.stats label{display:block;font-size:7.5pt;letter-spacing:1.5px;text-transform:uppercase;color:#8a7f72;margin-bottom:1mm}
.stats b{color:#5A182B;font-size:12pt}
.dot{display:inline-block;width:3.2mm;height:3.2mm;border-radius:50%;background:#e1d9cb;margin-right:1mm}.dot.on{background:#5A182B}
table{border-collapse:collapse;font-size:9.5pt;align-self:flex-start}th{text-align:left;font-size:7.5pt;letter-spacing:1.5px;text-transform:uppercase;color:#8a7f72;padding:2mm}
td{padding:2.2mm 2mm;border-top:1px solid #e1d9cb;white-space:nowrap}td .dot{width:2.6mm;height:2.6mm}
.note{background:#5A182B;color:#ECE7DC;padding:3mm 4mm;margin-top:4mm;font-size:9.5pt;border-radius:1mm}
</style></head><body>${cover}${brief}${concepts.join("")}${props}${compare}</body></html>`;

fs.writeFileSync("book.html", html);
const browser = await chromium.launch();
const pg = await browser.newPage();
await pg.goto("file://" + path.resolve("book.html"), { waitUntil: "networkidle" });
await pg.evaluate(() => document.fonts.ready);
await pg.pdf({ path: "KAGADA_2026_Photo_Booth_Concepts.pdf", width: "297mm", height: "210mm", printBackground: true });
await browser.close();
console.log("pdf done");
