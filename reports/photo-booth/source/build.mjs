// Generates booths.html: one 1000x1250 scene per photo-booth concept.
import fs from "fs";

const BUR = "#5A182B", DEEP = "#431220", DARK = "#2E0A15", PAR = "#D8D3C7", IVORY = "#ECE7DC",
  RED = "#C0262D", GOLD = "#C9A24A", INK = "#1E1A1B";
const FLOOR = 1080;

// ---------- helpers ----------
let seed = 7;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const r = (a, b) => a + (b - a) * rnd();
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

function jitterRect(x, y, w, h, amp, step) {
  const pts = [];
  const edge = (x1, y1, x2, y2) => {
    const len = Math.hypot(x2 - x1, y2 - y1), n = Math.max(2, Math.round(len / step));
    for (let i = 0; i < n; i++) {
      const t = i / n, nx = -(y2 - y1) / len, ny = (x2 - x1) / len, j = r(-amp, amp);
      pts.push([x1 + (x2 - x1) * t + nx * j, y1 + (y2 - y1) * t + ny * j]);
    }
  };
  edge(x, y, x + w, y); edge(x + w, y, x + w, y + h); edge(x + w, y + h, x, y + h); edge(x, y + h, x, y);
  return "M" + pts.map((p) => p[0].toFixed(1) + "," + p[1].toFixed(1)).join("L") + "Z";
}
function gearPath(cx, cy, ro, ri, teeth) {
  let d = "";
  for (let i = 0; i < teeth; i++) {
    const a = (i / teeth) * Math.PI * 2, s = (Math.PI * 2) / teeth;
    const pts = [[ri, a], [ri, a + s * 0.12], [ro, a + s * 0.25], [ro, a + s * 0.5], [ri, a + s * 0.63], [ri, a + s]];
    pts.forEach(([rad, ang], k) => {
      d += (i === 0 && k === 0 ? "M" : "L") + (cx + rad * Math.cos(ang)).toFixed(1) + "," + (cy + rad * Math.sin(ang)).toFixed(1);
    });
  }
  return d + "Z";
}
const circ = (cx, cy, rr) => `M${cx - rr},${cy}a${rr},${rr} 0 1,0 ${rr * 2},0a${rr},${rr} 0 1,0 ${-rr * 2},0Z`;
const rect = (x, y, w, h) => `M${x},${y}h${w}v${h}h${-w}Z`;
function wrap(text, n) {
  const out = []; let line = "";
  for (const w of text.split(" ")) { if ((line + " " + w).trim().length > n) { out.push(line.trim()); line = w; } else line += " " + w; }
  if (line.trim()) out.push(line.trim());
  return out;
}
function para(x, y, text, n, lh, attrs) {
  return wrap(text, n).map((l, i) => `<text x="${x}" y="${y + i * lh}" ${attrs}>${esc(l)}</text>`).join("");
}
const crane = (x, y, s, rot, c1, c2, c3) => `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})" filter="url(#soft)">
  <polygon points="0,0 -46,-34 -8,-6" fill="${c2}"/><polygon points="0,0 -8,-6 -10,10" fill="${c3}"/>
  <polygon points="0,0 40,-40 10,-4" fill="${c1}"/><polygon points="0,0 10,-4 14,8" fill="${c3}"/>
  <polygon points="-10,10 0,0 14,8 2,14" fill="${c1}"/><polygon points="14,8 34,-6 30,-2 18,10" fill="${c2}"/>
  <polygon points="34,-6 40,-4 30,-2" fill="${c3}"/><polygon points="-10,10 -30,2 -6,12" fill="${c2}"/></g>`;
const plane = (x, y, s, rot, c1, c2) => `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})" filter="url(#soft)">
  <polygon points="0,0 60,-18 14,6" fill="${c1}"/><polygon points="14,6 60,-18 18,18" fill="${c2}"/><polygon points="14,6 18,18 10,10" fill="${c2}" opacity=".7"/></g>`;

// people silhouettes seen through the hole
function people(cx = 505, top = 545, spread = 58) {
  const fig = (x, y, rr, c) => `<g fill="${c}"><circle cx="${x}" cy="${y}" r="${rr}"/>
    <path d="M${x - rr * 2.2},${y + rr * 6} Q${x - rr * 2.3},${y + rr * 1.55} ${x},${y + rr * 1.35} Q${x + rr * 2.3},${y + rr * 1.55} ${x + rr * 2.2},${y + rr * 6}Z"/></g>`;
  return fig(cx + spread, top - 6, 36, "#7b6a6c") + fig(cx - spread, top + 8, 39, "#55424a");
}
function behind(clip, ppl) {
  return `<g clip-path="url(#${clip})"><rect x="0" y="0" width="1000" height="1250" fill="url(#hall)"/>
    <rect x="390" y="300" width="230" height="260" fill="#fff" opacity=".35" filter="url(#blur8)"/>
    <rect x="0" y="900" width="1000" height="200" fill="#b8ad9c" opacity=".5"/>${ppl}</g>`;
}
function stand(x1 = 300, x2 = 700, top = 1000) {
  return [x1, x2].map((x) => `<rect x="${x - 6}" y="${top}" width="12" height="${FLOOR - top - 4}" fill="#2a2627"/>
    <rect x="${x - 55}" y="${FLOOR - 8}" width="110" height="9" rx="3" fill="#2a2627"/>`).join("");
}
function dims(top, left = 200, right = 800) {
  const c = "#8d8273";
  return `<g stroke="${c}" stroke-width="1.5" fill="none" opacity=".9">
    <path d="M905,${top}V${FLOOR}M897,${top}h16M897,${FLOOR}h16"/>
    </g><path d="M${left},1125H${right}M${left},1117v16M${right},1117v16" stroke="#F3EEE6" stroke-width="1.5"/>
    <text x="925" y="${(top + FLOOR) / 2}" fill="${c}" font-family="Inter" font-size="17" font-weight="600" transform="rotate(90 925 ${(top + FLOOR) / 2})" text-anchor="middle">≈ 8 ft / 2.4 m</text>
    <text x="${(left + right) / 2}" y="1153" fill="#F3EEE6" font-family="Inter" font-size="17" font-weight="600" text-anchor="middle">≈ 6 ft / 1.8 m</text>`;
}

const DEFS = `
<defs>
  <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F3EFE7"/><stop offset="1" stop-color="#E2DACB"/></linearGradient>
  <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A39684"/><stop offset="1" stop-color="#7E7264"/></linearGradient>
  <linearGradient id="hall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E9E3D7"/><stop offset=".6" stop-color="#D3CABA"/><stop offset="1" stop-color="#BDB2A1"/></linearGradient>
  <radialGradient id="shadow"><stop offset="0" stop-color="#000" stop-opacity=".35"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
  <pattern id="tex" width="256" height="256" patternUnits="userSpaceOnUse"><image href="assets/tex.png" width="256" height="256"/></pattern>
  <pattern id="weave" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(55)">
    <rect width="7" height="7" fill="none"/><rect width="2" height="7" fill="#190308" opacity=".28"/><rect x="2.4" width="2.4" height="7" fill="#E14B69" opacity=".12"/></pattern>
  <pattern id="weave2" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)">
    <rect width="2" height="7" fill="#190308" opacity=".22"/><rect x="2.4" width="2.4" height="7" fill="#E14B69" opacity=".09"/></pattern>
  <pattern id="grid" width="15" height="15" patternUnits="userSpaceOnUse"><path d="M15,0H0V15" fill="none" stroke="${PAR}" stroke-width=".6" opacity=".18"/></pattern>
  <pattern id="gridBig" width="75" height="75" patternUnits="userSpaceOnUse"><path d="M75,0H0V75" fill="none" stroke="${PAR}" stroke-width="1.1" opacity=".25"/></pattern>
  <filter id="drop" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="14" stdDeviation="14" flood-color="#2a0a12" flood-opacity=".35"/></filter>
  <filter id="soft" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="5" stdDeviation="4" flood-color="#000" flood-opacity=".28"/></filter>
  <filter id="blur8"><feGaussianBlur stdDeviation="18"/></filter>
  <filter id="ink"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.5"/></filter>
  <filter id="tintPar"><feColorMatrix type="matrix" values="0 0 0 0 .847  0 0 0 0 .827  0 0 0 0 .78  0 0 0 1 0"/></filter>
  <filter id="tintBur"><feColorMatrix type="matrix" values="0 0 0 0 .353  0 0 0 0 .094  0 0 0 0 .169  0 0 0 1 0"/></filter>
  <filter id="tintInk"><feColorMatrix type="matrix" values="0 0 0 0 .12  0 0 0 0 .1  0 0 0 0 .1  0 0 0 1 0"/></filter>
</defs>`;

function scene(id, top, inner) {
  return `<div class="scene" id="${id}"><svg viewBox="0 0 1000 1250" width="1000" height="1250" xmlns="http://www.w3.org/2000/svg">${DEFS}
  <rect width="1000" height="${FLOOR}" fill="url(#wall)"/><rect y="${FLOOR - 40}" width="1000" height="40" fill="#D6CDBD"/>
  <rect y="${FLOOR}" width="1000" height="${1250 - FLOOR}" fill="url(#floor)"/>
  <ellipse cx="500" cy="${FLOOR + 4}" rx="380" ry="26" fill="url(#shadow)"/>
  ${inner}${dims(top)}</svg></div>`;
}
// standard textured fill for a shape
const texFill = (d, op = 0.4) => `<path d="${d}" fill="url(#tex)" fill-rule="evenodd" opacity="${op}" style="mix-blend-mode:multiply"/>`;
const weaveFill = (d) => `<path d="${d}" fill="url(#weave)" fill-rule="evenodd"/><path d="${d}" fill="url(#weave2)" fill-rule="evenodd"/>`;

const S = [];
// ============ 1. TORN THROUGH ============
{
  seed = 11;
  const outer = jitterRect(200, 240, 600, 770, 3, 14);
  const hole = jitterRect(345, 450, 310, 330, 13, 10);
  const d = outer + hole;
  const flap = (pts, rot) => `<polygon points="${pts}" fill="url(#flapG)" filter="url(#soft)"/>`;
  S.push(scene("c1", 240, `
    <defs><clipPath id="k1"><rect x="200" y="240" width="600" height="770"/></clipPath>
      <linearGradient id="flapG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FBF8F1"/><stop offset="1" stop-color="#C9BFAC"/></linearGradient></defs>
    ${behind("k1", people())}${stand()}
    <g filter="url(#drop)"><path d="${d}" fill="${IVORY}" fill-rule="evenodd"/></g>${texFill(d, 0.55)}
    <path d="${hole}" fill="none" stroke="#fff" stroke-width="9" stroke-linejoin="round"/>
    <path d="${jitterRect(347, 452, 306, 326, 12, 7)}" fill="none" stroke="#CFC6B3" stroke-width="2"/>
    ${flap("350,452 452,446 392,392")}${flap("560,448 655,455 640,388")}${flap("657,600 656,690 722,650")}
    ${flap("420,782 530,780 470,850")}${flap("344,560 346,660 286,612")}
    <image href="assets/kagada-2026-header-maroon.png" x="285" y="250" width="430" height="185"/>
    <text x="500" y="895" text-anchor="middle" font-family="Saman" font-size="54" fill="${BUR}">tore through the ordinary</text>
    <text x="500" y="940" text-anchor="middle" font-family="Oswald" font-weight="600" font-size="26" letter-spacing="7" fill="${RED}">#KAGADA2026</text>
    <image href="assets/logo1s.png" x="470" y="950" width="58" height="58" filter="url(#tintBur)"/>
    <polygon points="160,1066 186,1060 192,1074 170,1078" fill="${IVORY}" filter="url(#soft)"/>
    <polygon points="760,1070 792,1062 786,1080" fill="${IVORY}" filter="url(#soft)"/>
    <polygon points="820,1090 846,1086 838,1100 818,1102" fill="#E8E2D4" filter="url(#soft)"/>`));
}
// ============ 2. ORIGAMI SKY ============
{
  seed = 21;
  const board = rect(200, 250, 600, 760), hole = rect(345, 470, 310, 320), d = board + hole;
  const F = [345, 470, 655, 790], o = 34;
  const cranes = [[250, 980, .7, -10, IVORY, PAR, "#b9ae9b"], [300, 860, .55, -20, RED, "#9e1e24", "#7d1219"],
  [690, 330, .9, -18, IVORY, PAR, "#b9ae9b"], [770, 230, .75, -25, RED, "#9e1e24", "#7d1219"], [860, 150, .6, -30, "#fff", "#e5e0d6", "#bdb5a6"],
  [640, 200, .5, -15, GOLD, "#a5822f", "#866824"], [880, 300, .45, -35, IVORY, PAR, "#b9ae9b"], [230, 330, .55, 10, GOLD, "#a5822f", "#866824"]];
  S.push(scene("c2", 150, `
    <defs><clipPath id="k2"><rect x="200" y="250" width="600" height="760"/></clipPath></defs>
    ${behind("k2", people())}${stand()}
    <g filter="url(#drop)"><path d="${d}" fill="${BUR}" fill-rule="evenodd"/></g>${weaveFill(d)}
    <path d="M200,250h600v760h-600Z" fill="none" stroke="${DEEP}" stroke-width="3"/>
    <g filter="url(#soft)">
      <polygon points="${F[0] - o},${F[1] - o} ${F[2] + o},${F[1] - o} ${F[2]},${F[1]} ${F[0]},${F[1]}" fill="${IVORY}"/>
      <polygon points="${F[2] + o},${F[1] - o} ${F[2] + o},${F[3] + o} ${F[2]},${F[3]} ${F[2]},${F[1]}" fill="#B7AE9E"/>
      <polygon points="${F[0] - o},${F[3] + o} ${F[2] + o},${F[3] + o} ${F[2]},${F[3]} ${F[0]},${F[3]}" fill="#9F9585"/>
      <polygon points="${F[0] - o},${F[1] - o} ${F[0]},${F[1]} ${F[0]},${F[3]} ${F[0] - o},${F[3] + o}" fill="${PAR}"/></g>
    <path d="M${F[0] - o},${F[1] - o}L${F[0]},${F[1]}M${F[2] + o},${F[1] - o}L${F[2]},${F[1]}M${F[2] + o},${F[3] + o}L${F[2]},${F[3]}M${F[0] - o},${F[3] + o}L${F[0]},${F[3]}" stroke="#8c8272" stroke-width="1"/>
    <path d="M250,975 C330,880 420,820 520,700 S700,380 870,150" fill="none" stroke="${PAR}" stroke-width="2" stroke-dasharray="3 9" opacity=".55"/>
    <text x="500" y="295" text-anchor="middle" font-family="Inter" font-size="15" font-weight="600" letter-spacing="6" fill="${PAR}">IEEE UVCE PRESENTS</text>
    <text x="500" y="398" text-anchor="middle" font-family="Saman" font-size="96" fill="${IVORY}">kagada 2026</text>
    <text x="500" y="885" text-anchor="middle" font-family="Playfair Display" font-style="italic" font-size="40" fill="${IVORY}">fold. fly. innovate.</text>
    <text x="500" y="918" text-anchor="middle" font-family="Inter" font-size="14" letter-spacing="2.5" fill="${PAR}">22ND NATIONAL LEVEL TECHNICAL STUDENT CONFERENCE</text>
    <image href="assets/logo1s.png" x="468" y="935" width="64" height="64" filter="url(#tintPar)"/>
    ${cranes.map((c) => crane(...c)).join("")}`));
}
// ============ 3. PROCEEDINGS VOL 22 ============
{
  const page = "M200,240H760L800,280V1020H200Z", hole = rect(345, 455, 310, 300), d = page + hole;
  const t = `font-family="Libre Baskerville" fill="${INK}"`;
  const abs = "This paper presents strong evidence that attending KAGADA 2026 raises curiosity by 200%, friendships by 300% and certificate count by exactly one. Participants (N = all of you) were exposed to paper, poster and project presentations, Ottige Kaliyona and Food for Cause. Results were statistically delicious.";
  const intro = "For twenty-two editions KAGADA has brought young engineers to UVCE to share ideas. We ask: what happens when you step inside the paper? The answer is Fig. 1.";
  const res = "Fun increased monotonically through the day (Fig. 2). Reviewer #2 remains unconvinced, but was seen smiling near the food stalls. We conclude that you should have registered earlier, and that the photo booth was, in fact, peer reviewed.";
  const more = "Future work includes KAGADA 2027, more coffee, and a longitudinal study of how many of these photos become profile pictures. The authors thank IEEE UVCE, the volunteers, and Sir M. Visvesvaraya for the excellent campus.";
  const bars = [14, 22, 30, 41, 55].map((h, i) => `<rect x="${688 + i * 18}" y="${975 - h}" width="12" height="${h}" fill="${BUR}"/>`).join("");
  S.push(scene("c3", 240, `
    <defs><clipPath id="k3"><rect x="200" y="240" width="600" height="780"/></clipPath></defs>
    ${behind("k3", people(505, 540))}${stand(300, 700, 1018)}
    <g filter="url(#drop)"><path d="${d}" fill="#FBF8F1" fill-rule="evenodd"/></g>${texFill(d, 0.25)}
    <path d="M760,240V280H800Z" fill="#DDD5C5"/><path d="M760,240L800,280" stroke="#c9c0ae"/>
    <text x="220" y="266" ${t} font-size="9.5" letter-spacing="1.5">PROCEEDINGS OF KAGADA 2026 · VOL. 22</text>
    <text x="745" y="266" ${t} font-size="9.5" text-anchor="end" letter-spacing="1">IEEE UVCE · BENGALURU</text>
    <path d="M220,274H780" stroke="${INK}" stroke-width=".8"/>
    <text x="500" y="318" text-anchor="middle" ${t} font-weight="700" font-size="25">On the Unreasonable Effectiveness</text>
    <text x="500" y="350" text-anchor="middle" ${t} font-weight="700" font-size="25">of Showing Up at KAGADA 2026</text>
    <text x="500" y="384" text-anchor="middle" ${t} font-style="italic" font-size="15">You¹, Your Best Friend², et al.</text>
    <text x="500" y="404" text-anchor="middle" ${t} font-size="9.5">¹Future Innovator  ²Moral Support  ·  University Visvesvaraya College of Engineering, Bengaluru</text>
    <text x="500" y="420" text-anchor="middle" ${t} font-size="9.5" fill="${RED}">24 October 2026</text>
    <rect x="345" y="455" width="310" height="300" fill="none" stroke="${INK}" stroke-width="2.5"/>
    <text x="500" y="777" text-anchor="middle" ${t} font-size="10.5"><tspan font-weight="700">Fig. 1.</tspan> Two promising researchers, photographed at peak innovation (n = you).</text>
    <text x="218" y="462" ${t} font-size="9" font-weight="700" font-style="italic">Abstract—</text>
    ${para(218, 476, abs, 25, 12.6, `${t} font-size="8.6" font-weight="700"`)}
    <text x="218" y="735" ${t} font-size="8.6" font-style="italic"><tspan font-weight="700">Index Terms</tspan>—paper,</text>
    <text x="218" y="748" ${t} font-size="8.6" font-style="italic">poster, project, food for cause.</text>
    <text x="672" y="548" ${t} font-size="9" font-weight="700">I. INTRODUCTION</text>
    ${para(672, 563, intro, 24, 12.6, `${t} font-size="8.6"`)}
    <text x="580" y="868" ${t} font-size="9" font-weight="700">APPENDIX A. METHOD</text>
    ${para(580, 884, "Stand inside the frame. Smile. Repeat with friends.", 24, 12.6, `${t} font-size="8.6"`)}
    <text x="218" y="812" ${t} font-size="9" font-weight="700">III. RESULTS</text>
    ${para(218, 828, res, 56, 12.6, `${t} font-size="8.6"`)}
    ${para(218, 908, more, 56, 12.6, `${t} font-size="8.6"`)}
    <text x="580" y="812" ${t} font-size="9" font-weight="700">IV. CONCLUSION</text>
    ${para(580, 828, "Paper, poster or project: the best result of the day is the people you meet.", 32, 12.6, `${t} font-size="8.6" font-style="italic"`)}
    ${bars}<path d="M682,976H782" stroke="${INK}"/>
    <text x="735" y="992" ${t} font-size="8.5" text-anchor="middle"><tspan font-weight="700">Fig. 2.</tspan> Fun over time.</text>
    <text x="500" y="1008" text-anchor="middle" ${t} font-size="9">— 24 —</text>
    <g transform="rotate(10 735 480)" filter="url(#ink)" opacity=".92">
      <rect x="650" y="440" width="185" height="82" rx="8" fill="none" stroke="${RED}" stroke-width="5"/>
      <rect x="659" y="449" width="167" height="64" rx="5" fill="none" stroke="${RED}" stroke-width="2"/>
      <text x="742" y="492" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="36" letter-spacing="3" fill="${RED}">ACCEPTED</text>
      <text x="742" y="507" text-anchor="middle" font-family="Inter" font-weight="700" font-size="9" letter-spacing="1.5" fill="${RED}">KAGADA 2026 · NO REVISIONS</text></g>`));
}
// ============ 4. THE KAGADA TIMES ============
{
  seed = 41;
  const page = rect(200, 240, 600, 780), hole = rect(345, 490, 310, 295), d = page + hole;
  const lines = (x, y, w, n, gap = 10) => Array.from({ length: n }, (_, i) => `<rect x="${x}" y="${y + i * gap}" width="${i % 7 === 6 ? w * 0.6 : w - r(0, 8)}" height="4" fill="#8f877b" opacity=".75"/>`).join("");
  const pf = `font-family="Playfair Display" fill="${INK}"`;
  const star = Array.from({ length: 24 }, (_, i) => { const a = (i / 24) * Math.PI * 2, rr = i % 2 ? 44 : 58; return `${192 + rr * Math.cos(a)},${246 + rr * Math.sin(a)}`; }).join(" ");
  S.push(scene("c4", 224, `
    <defs><clipPath id="k4"><rect x="200" y="240" width="600" height="780"/></clipPath></defs>
    ${behind("k4", people(505, 560))}${stand(300, 700, 1018)}
    <g filter="url(#drop)"><path d="${d}" fill="#EFE9DC" fill-rule="evenodd"/></g>${texFill(d, 0.45)}
    <path d="M200,640H345M655,640H800" stroke="#d8d0c0" stroke-width="2"/>
    <text x="500" y="332" text-anchor="middle" font-family="UnifrakturMaguntia" font-size="66" fill="${INK}">The Kagada Times</text>
    <path d="M215,348H785M215,352H785" stroke="${INK}" stroke-width="1.2"/>
    <text x="218" y="367" font-family="Inter" font-size="9.5" font-weight="600" fill="${INK}">BENGALURU · SATURDAY, OCTOBER 24, 2026</text>
    <text x="500" y="367" text-anchor="middle" font-family="Inter" font-size="9.5" font-weight="700" fill="${BUR}">EDITION XXII</text>
    <text x="782" y="367" text-anchor="end" font-family="Inter" font-size="9.5" font-weight="600" fill="${INK}">₹ 22</text>
    <path d="M215,375H785" stroke="${INK}" stroke-width="1.2"/>
    <text x="500" y="422" text-anchor="middle" ${pf} font-weight="900" font-size="41">STUDENTS STEAL THE SHOW</text>
    <text x="500" y="450" text-anchor="middle" ${pf} font-style="italic" font-size="15.5">Future innovators spotted at UVCE; sources confirm they are “kind of a big deal”</text>
    <path d="M215,466H785" stroke="${INK}" stroke-width=".8"/>
    <rect x="345" y="490" width="310" height="295" fill="none" stroke="${INK}" stroke-width="2"/>
    <text x="500" y="802" text-anchor="middle" ${pf} font-style="italic" font-size="11">PICTURED: The day's biggest breakthrough. (Photo: KAGADA Booth)</text>
    <rect x="215" y="485" width="115" height="70" fill="none" stroke="${INK}"/>
    <text x="272" y="503" text-anchor="middle" font-family="Inter" font-weight="700" font-size="9" fill="${INK}">WEATHER</text>
    <text x="272" y="526" text-anchor="middle" ${pf} font-weight="700" font-size="14">100% chance</text>
    <text x="272" y="544" text-anchor="middle" ${pf} font-weight="700" font-size="14">of ideas</text>
    ${lines(215, 572, 115, 21)}
    <text x="670" y="500" font-family="Inter" font-weight="700" font-size="9" fill="${BUR}">INSIDE TODAY</text>
    ${["Paper ........ p.2", "Poster ....... p.3", "Project ...... p.4", "Ottige Kaliyona p.5", "Food for Cause p.6"].map((s, i) => `<text x="670" y="${520 + i * 16}" ${pf} font-size="11">${s}</text>`).join("")}
    ${lines(670, 610, 115, 17)}
    ${[[215, "Kids light up UVCE"], [410, "Stalls sell out, for a cause"], [605, "Reviewer #2 impressed"]].map(([x, h]) => `<text x="${x}" y="835" ${pf} font-weight="700" font-size="13.5">${h}</text>${lines(x, 848, 178, 9)}`).join("")}
    <rect x="200" y="950" width="600" height="40" fill="${BUR}"/>
    <text x="500" y="977" text-anchor="middle" font-family="Oswald" font-weight="600" font-size="18" letter-spacing="3" fill="${IVORY}">BREAKING · KAGADA 2026 · IEEE UVCE · 24 OCT</text>
    <g filter="url(#soft)"><polygon points="${star}" fill="${RED}"/></g>
    <text x="192" y="242" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="19" fill="#fff" transform="rotate(-12 192 246)">EXTRA!</text>
    <text x="192" y="263" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="19" fill="#fff" transform="rotate(-12 192 246)">EXTRA!</text>`));
}
// ============ 5. POSTAGE STAMP ============
{
  const holes = [];
  for (let x = 215; x <= 785; x += 22.8) { holes.push(circ(x, 250, 9), circ(x, 1010, 9)); }
  for (let y = 272; y <= 990; y += 22.8) { holes.push(circ(205, y, 9), circ(795, y, 9)); }
  const hole = rect(345, 435, 310, 325);
  const ring = (rr) => circ(800, 300, rr);
  S.push(scene("c5", 210, `
    <defs><clipPath id="k5"><rect x="205" y="250" width="590" height="760"/></clipPath>
      <mask id="perf"><rect x="205" y="250" width="590" height="760" fill="#fff"/>${holes.map((h) => `<path d="${h}" fill="#000"/>`).join("")}<path d="${hole}" fill="#000"/></mask>
      <path id="pm" d="M800,300 m-62,0 a62,62 0 1,1 124,0 a62,62 0 1,1 -124,0"/></defs>
    ${behind("k5", people(505, 548))}${stand()}
    <g filter="url(#drop)"><rect x="205" y="250" width="590" height="760" fill="#FBF9F4" mask="url(#perf)"/></g>
    <path d="${rect(238, 283, 524, 694) + hole}" fill="${BUR}" fill-rule="evenodd"/>${weaveFill(rect(238, 283, 524, 694) + hole)}
    <rect x="335" y="425" width="330" height="345" fill="none" stroke="${PAR}" stroke-width="2"/>
    <text x="262" y="375" font-family="Noto Serif Kannada" font-weight="700" font-size="74" fill="${IVORY}">ಕಾಗದ</text>
    <text x="264" y="403" font-family="Inter" font-size="12" font-weight="600" letter-spacing="3" fill="${PAR}">IEEE UVCE · BENGALURU</text>
    <text x="738" y="380" text-anchor="end" font-family="Playfair Display" font-weight="900" font-size="66" fill="${GOLD}">₹22</text>
    <text x="500" y="838" text-anchor="middle" font-family="Oswald" font-weight="600" font-size="58" letter-spacing="10" fill="${IVORY}">KAGADA 2026</text>
    <text x="500" y="868" text-anchor="middle" font-family="Inter" font-size="13.5" letter-spacing="2" fill="${PAR}">22ND NATIONAL LEVEL TECHNICAL STUDENT CONFERENCE</text>
    <text x="500" y="922" text-anchor="middle" font-family="Smooch Sans" font-weight="800" font-size="40" letter-spacing="4" fill="${GOLD}">24 · 10 · 2026</text>
    <text x="500" y="953" text-anchor="middle" font-family="Inter" font-size="11" letter-spacing="2" fill="${PAR}" opacity=".8">ONE PAPER. ENDLESS IDEAS.</text>
    <g filter="url(#ink)" opacity=".85" fill="none" stroke="${INK}">
      <path d="${ring(82)}" stroke-width="4"/><path d="${ring(52)}" stroke-width="2.5"/>
      ${[0, 1, 2, 3, 4].map((i) => `<path d="M560,${266 + i * 17} q20,-9 40,0 t40,0 t40,0 t40,0 t40,0" stroke-width="4"/>`).join("")}</g>
    <g filter="url(#ink)" opacity=".85" fill="${INK}">
      <text font-family="Inter" font-weight="800" font-size="12.5" letter-spacing="2.4"><textPath href="#pm">UVCE · BENGALURU 560001 · KAGADA ·</textPath></text>
      <text x="800" y="296" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="17">24 OCT</text>
      <text x="800" y="316" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="17">2026</text></g>`));
}
// ============ 6. BOARDING PASS ============
{
  seed = 61;
  const body = `M225,250H775A15,15 0 0 1 790,265V845A18,18 0 0 0 790,881V995A15,15 0 0 1 775,1010H225A15,15 0 0 1 210,995V881A18,18 0 0 0 210,845V265A15,15 0 0 1 225,250Z`;
  const hole = rect(350, 455, 300, 300), d = body + hole;
  const barcode = Array.from({ length: 46 }, (_, i) => { const w = [2, 3, 5][Math.floor(r(0, 3))]; return `<rect x="${238 + i * 6.2}" y="905" width="${w}" height="70" fill="${INK}"/>`; }).join("");
  const field = (x, y, l, v, a = "start") => `<text x="${x}" y="${y}" text-anchor="${a}" font-family="Inter" font-size="10" font-weight="600" letter-spacing="2" fill="#8a7f72">${l}</text><text x="${x}" y="${y + 26}" text-anchor="${a}" font-family="Oswald" font-weight="600" font-size="24" fill="${BUR}">${v}</text>`;
  S.push(scene("c6", 120, `
    <defs><clipPath id="k6"><rect x="210" y="250" width="580" height="760"/></clipPath></defs>
    ${behind("k6", people(500, 545))}${stand()}
    <g filter="url(#drop)"><path d="${d}" fill="${IVORY}" fill-rule="evenodd"/></g>${texFill(d, 0.4)}
    <path d="M225,250H775A15,15 0 0 1 790,265V340H210V265A15,15 0 0 1 225,250Z" fill="${BUR}"/>${weaveFill("M225,250H775A15,15 0 0 1 790,265V340H210V265A15,15 0 0 1 225,250Z")}
    <text x="240" y="305" font-family="Oswald" font-weight="600" font-size="26" letter-spacing="5" fill="${IVORY}">KAGADA 2026</text>
    <text x="760" y="304" text-anchor="end" font-family="Inter" font-weight="700" font-size="14" letter-spacing="4" fill="${PAR}">BOARDING PASS</text>
    <text x="240" y="372" font-family="Inter" font-size="10" font-weight="600" letter-spacing="2" fill="#8a7f72">FROM</text>
    <text x="760" y="372" text-anchor="end" font-family="Inter" font-size="10" font-weight="600" letter-spacing="2" fill="#8a7f72">TO</text>
    <text x="238" y="425" font-family="Oswald" font-weight="700" font-size="54" fill="${BUR}">IDEA</text>
    <text x="762" y="425" text-anchor="end" font-family="Oswald" font-weight="700" font-size="54" fill="${BUR}">IMPACT</text>
    <path d="M400,405H600" stroke="${BUR}" stroke-width="2" stroke-dasharray="5 6"/>${plane(470, 410, .9, -8, RED, "#8e1a20")}
    <rect x="350" y="455" width="300" height="300" fill="none" stroke="${BUR}" stroke-width="3"/>
    ${field(232, 480, "PASSENGER", "YOU")}${field(232, 560, "FLIGHT", "KGD 26")}${field(232, 640, "CLASS", "INNOVATOR")}${field(232, 720, "SEAT", "1A")}
    ${field(768, 480, "GATE", "UVCE", "end")}${field(768, 560, "DATE", "24 OCT", "end")}${field(768, 640, "BOARDING", "09:00", "end")}${field(768, 720, "ZONE", "FUTURE", "end")}
    <text x="500" y="795" text-anchor="middle" font-family="Caveat" font-weight="700" font-size="34" fill="${RED}">next stop: everywhere</text>
    <path d="M228,863H772" stroke="#a89d8c" stroke-width="2" stroke-dasharray="7 7"/>
    ${barcode}
    <text x="760" y="945" text-anchor="end" font-family="Saman" font-size="56" fill="${BUR}">kagada</text>
    <text x="760" y="972" text-anchor="end" font-family="Inter" font-size="11" font-weight="600" letter-spacing="2.5" fill="#8a7f72">IEEE UVCE · BENGALURU</text>
    <path d="M640,470 C720,380 760,300 700,230 S560,200 620,140" fill="none" stroke="${BUR}" stroke-width="2" stroke-dasharray="4 8" opacity=".55"/>
    <path d="M760,300 C850,260 880,190 840,130" fill="none" stroke="${BUR}" stroke-width="2" stroke-dasharray="4 8" opacity=".55"/>
    ${plane(605, 130, 1.4, -40, "#fff", "#ddd6c8")}${plane(825, 118, 1.1, -70, RED, "#8e1a20")}${plane(160, 230, .9, -20, GOLD, "#9c7a2c")}`));
}
// ============ 7. POP-UP UVCE ============
{
  seed = 77;
  const leaves = () => { const g = ["#4f8a36", "#6fa443", "#3c7232", "#93bb52", "#5c9a3f"]; let o = "";
    for (const [a, b] of [[170, 500], [520, 830]]) for (let i = 0; i < 26; i++) { const x = r(a, b), y = r(684, 712), s = r(16, 34), t = r(0, 6.28);
      o += `<polygon points="${x},${y - s} ${x + s * Math.cos(t)},${y + s * .5} ${x - s * .8},${y + s * Math.sin(t) * .5 + 4}" fill="${g[i % 5]}" opacity=".97"/>`; }
    return `<g filter="url(#soft)">${o}</g>`; };
  const board = "M190,1010V380A310,140 0 0 1 810,380V1010Z";
  const hole = "M350,720V500A150,95 0 0 1 650,500V720Z", d = board + hole;
  S.push(scene("c7", 240, `
    <defs><clipPath id="k7"><rect x="190" y="240" width="620" height="770"/></clipPath>
      <linearGradient id="pg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e9e3d6"/><stop offset="1" stop-color="#fffdf8"/></linearGradient></defs>
    ${behind("k7", people(500, 545))}
    <g filter="url(#drop)"><path d="${d}" fill="rgb(231,215,187)" fill-rule="evenodd"/></g>${texFill(d, 0.5)}
    <path d="${hole}" fill="none" stroke="#fff" stroke-width="10"/><path d="${hole}" fill="none" stroke="${BUR}" stroke-width="3" transform="translate(0,0)"/>
    <image href="assets/heroKeyed.png" x="170" y="700" width="660" height="361" filter="url(#soft)"/>${leaves()}
    <image href="assets/kagada-2026-header-red.png" x="335" y="262" width="330" height="142"/>
    <polygon points="70,1072 500,1040 500,1092 40,1112" fill="${BUR}"/><polygon points="930,1072 500,1040 500,1092 960,1112" fill="${DEEP}"/>
    <polygon points="85,1062 500,1030 500,1080 60,1100" fill="url(#pg)"/><polygon points="915,1062 500,1030 500,1080 940,1100" fill="#f4efe4"/>
    <path d="M500,1030V1080" stroke="#bfb5a4" stroke-width="2"/>
    ${[0, 1, 2].map((i) => `<path d="M${110 + i * 120},${1060 - i * 9 + 6}L${470},${1040}" stroke="#d6cebf" stroke-width="1"/><path d="M${890 - i * 120},${1060 - i * 9 + 6}L530,1040" stroke="#d6cebf" stroke-width="1"/>`).join("")}
    <path d="M330,1012 Q500,995 670,1012 L655,1046 Q500,1030 345,1046Z" fill="${BUR}" filter="url(#soft)"/>
    <text x="500" y="1032" text-anchor="middle" font-family="Oswald" font-weight="600" font-size="15" letter-spacing="3" fill="${IVORY}">STEP INTO THE PAPER CAMPUS</text>`));
}
// ============ 8. MAROONPRINT ============
{
  const board = rect(205, 285, 590, 725), hole = rect(350, 470, 300, 310), d = board + hole;
  const P = PAR, se = `font-family="Special Elite" fill="${P}"`;
  const gearL = gearPath(262, 462, 44, 34, 12), gearS = gearPath(272, 532, 24, 17, 9), gearB = gearPath(735, 815, 40, 31, 11);
  S.push(scene("c8", 245, `
    <defs><clipPath id="k8"><rect x="205" y="285" width="590" height="725"/></clipPath>
      <linearGradient id="roll" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7a2a40"/><stop offset=".45" stop-color="${BUR}"/><stop offset="1" stop-color="${DARK}"/></linearGradient>
      <marker id="ar" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto-start-reverse"><path d="M0,1L9,5L0,9Z" fill="${P}"/></marker></defs>
    ${behind("k8", people(500, 548))}${stand()}
    <g filter="url(#drop)"><path d="${d}" fill="${DEEP}" fill-rule="evenodd"/></g>
    <path d="${d}" fill="url(#grid)" fill-rule="evenodd"/><path d="${d}" fill="url(#gridBig)" fill-rule="evenodd"/>
    <rect x="222" y="302" width="556" height="691" fill="none" stroke="${P}" stroke-width="1.5" opacity=".7"/>
    <rect x="185" y="250" width="630" height="48" rx="24" fill="url(#roll)" filter="url(#soft)"/>
    <ellipse cx="188" cy="274" rx="10" ry="24" fill="${DARK}"/><ellipse cx="812" cy="274" rx="10" ry="24" fill="#7a2a40"/>
    <g fill="none" stroke="${P}" stroke-width="1.6"><path d="${gearL}"/><circle cx="262" cy="462" r="12"/><path d="${gearS}"/><circle cx="272" cy="532" r="7"/><path d="${gearB}"/><circle cx="735" cy="815" r="11"/></g>
    <text x="500" y="365" text-anchor="middle" font-family="Oswald" font-weight="600" font-size="50" letter-spacing="9" fill="${IVORY}">KAGADA 2026</text>
    <text x="500" y="392" text-anchor="middle" ${se} font-size="13" letter-spacing="1.5">GENERAL ARRANGEMENT · DO NOT SCALE YOUR DREAMS</text>
    <rect x="350" y="470" width="300" height="310" fill="none" stroke="${P}" stroke-width="2.5"/>
    <path d="M500,450V800M330,625H670" stroke="${P}" stroke-width="1" stroke-dasharray="14 4 3 4" opacity=".6"/>
    <path d="M350,438H650" stroke="${P}" stroke-width="1.3" marker-start="url(#ar)" marker-end="url(#ar)"/><path d="M350,446V430M650,446V430" stroke="${P}"/>
    <text x="500" y="430" text-anchor="middle" ${se} font-size="13">WIDTH: ∞ IDEAS</text>
    <path d="M320,470V780" stroke="${P}" stroke-width="1.3" marker-start="url(#ar)" marker-end="url(#ar)"/>
    <text x="310" y="625" text-anchor="middle" ${se} font-size="13" transform="rotate(-90 310 625)">HEIGHT: LEGENDARY</text>
    <path d="M650,500L672,520H770" stroke="${P}" stroke-width="1.2" fill="none"/><circle cx="650" cy="500" r="3" fill="${P}"/>
    <text x="672" y="538" ${se} font-size="11">① FUTURE</text><text x="672" y="553" ${se} font-size="11">ENGINEER</text><text x="672" y="568" ${se} font-size="11">QTY: 2+</text>
    <path d="M660,700 A60,60 0 0 1 760,640" fill="none" stroke="${P}" stroke-dasharray="3 4"/><text x="690" y="740" ${se} font-size="11">R = PURE GENIUS</text>
    <text x="238" y="830" ${se} font-size="12" letter-spacing="1">BILL OF MATERIALS</text>
    ${["1 × PAPER PRESENTATION", "1 × POSTER PRESENTATION", "1 × PROJECT PRESENTATION", "1 × OTTIGE KALIYONA", "1 × FOOD FOR CAUSE", "∞ × CURIOSITY"].map((s, i) => `<text x="238" y="${852 + i * 20}" ${se} font-size="11.5">${s}</text>`).join("")}
    <g stroke="${P}" stroke-width="1.3" fill="none"><rect x="520" y="865" width="258" height="128"/>${[887, 908, 929, 950, 971].map((y) => `<path d="M520,${y}H778"/>`).join("")}<path d="M612,865V993"/></g>
    ${[["PROJECT", "KAGADA 2026"], ["DRAWN BY", "IEEE UVCE"], ["CHECKED", "REVIEWER #2"], ["DATE", "24.10.2026"], ["SCALE", "1 : 1"], ["SHEET", "22 OF 22"]].map(([a, b], i) => `<text x="527" y="${881 + i * 21}" ${se} font-size="10">${a}</text><text x="620" y="${881 + i * 21}" ${se} font-size="11">${b}</text>`).join("")}`));
}
// ============ 9. ORBIT OF TRACKS ============
{
  const cx = 500, cy = 600, gear = gearPath(cx, cy, 300, 268, 18), hole = circ(cx, cy, 168), d = gear + hole;
  const nodes = [["PAPER", -150], ["POSTER", -105], ["PROJECT", -60], ["OTTIGE KALIYONA", -5], ["FOOD FOR CAUSE", 185]];
  const icon = (n, x, y) => {
    const s = `stroke="${BUR}" stroke-width="3" fill="none" stroke-linejoin="round" stroke-linecap="round"`;
    return [`<path d="M${x - 11},${y - 15}h15l8,8v22h-23Z M${x - 5},${y - 2}h11M${x - 5},${y + 5}h11" ${s}/>`,
      `<rect x="${x - 14}" y="${y - 12}" width="28" height="22" rx="2" ${s}/><path d="M${x - 10},${y + 6}l7,-8 6,6 4,-4 5,6" ${s}/>`,
      `<rect x="${x - 10}" y="${y - 10}" width="20" height="20" rx="2" ${s}/><path d="M${x - 5},${y - 16}v6M${x + 5},${y - 16}v6M${x - 5},${y + 10}v6M${x + 5},${y + 10}v6M${x - 16},${y - 5}h6M${x - 16},${y + 5}h6M${x + 10},${y - 5}h6M${x + 10},${y + 5}h6" ${s}/>`,
      `<path d="M${x},${y - 16}l4,11 11,4 -11,4 -4,11 -4,-11 -11,-4 11,-4Z" ${s}/>`,
      `<path d="M${x},${y + 13} C${x - 22},${y} ${x - 14},${y - 18} ${x},${y - 7} C${x + 14},${y - 18} ${x + 22},${y} ${x},${y + 13}Z" ${s}/>`][n];
  };
  S.push(scene("c9", 230, `
    <defs><clipPath id="k9"><path d="${circ(cx, cy, 175)}"/></clipPath><path id="ring" d="M${cx},${cy} m-218,0 a218,218 0 1,1 436,0 a218,218 0 1,1 -436,0"/></defs>
    ${behind("k9", people(500, 560))}${stand(330, 670, 990)}
    <circle cx="${cx}" cy="${cy}" r="345" fill="none" stroke="${BUR}" stroke-width="5" opacity=".9"/>
    <circle cx="${cx}" cy="${cy}" r="345" fill="none" stroke="${PAR}" stroke-width="1.5" stroke-dasharray="2 8"/>
    <g filter="url(#drop)"><path d="${d}" fill="${BUR}" fill-rule="evenodd"/></g>${weaveFill(d)}
    <circle cx="${cx}" cy="${cy}" r="176" fill="none" stroke="${IVORY}" stroke-width="8"/><circle cx="${cx}" cy="${cy}" r="258" fill="none" stroke="${PAR}" stroke-width="1.5" opacity=".7"/>
    <text font-family="Oswald" font-weight="600" font-size="26" letter-spacing="4.5" fill="${IVORY}"><textPath href="#ring" startOffset="0">KAGADA 2026 · NATIONAL LEVEL TECHNICAL STUDENT CONFERENCE · IEEE UVCE ·</textPath></text>
    ${nodes.map(([n, a], i) => { const x = cx + 345 * Math.cos(a * Math.PI / 180), y = cy + 345 * Math.sin(a * Math.PI / 180); return `<g filter="url(#soft)"><circle cx="${x}" cy="${y}" r="40" fill="${IVORY}" stroke="${BUR}" stroke-width="4"/></g>${icon(i, x, y)}
      <rect x="${x - n.length * 4.6 - 8}" y="${y + 46}" width="${n.length * 9.2 + 16}" height="22" fill="${BUR}"/><text x="${x}" y="${y + 62}" text-anchor="middle" font-family="Oswald" font-weight="600" font-size="13" letter-spacing="1.5" fill="${IVORY}">${n}</text>`; }).join("")}
    <path d="M300,1010 L340,930 H660 L700,1010Z" fill="${DEEP}" filter="url(#drop)"/>${weaveFill("M300,1010 L340,930 H660 L700,1010Z")}
    <text x="500" y="972" text-anchor="middle" font-family="Saman" font-size="40" fill="${IVORY}">find your orbit</text>
    <text x="500" y="997" text-anchor="middle" font-family="Inter" font-size="11.5" font-weight="600" letter-spacing="3" fill="${PAR}">24 · 10 · 2026  ·  UVCE BENGALURU</text>`));
}
// ============ 10. POLAROID ============
{
  const frame = rect(215, 250, 570, 760), hole = rect(250, 285, 500, 480), d = frame + hole;
  const tape = (x, y, rot) => `<g transform="rotate(${rot} ${x} ${y})" opacity=".9" filter="url(#soft)"><rect x="${x - 70}" y="${y - 20}" width="140" height="40" fill="${RED}"/>
    ${[0, 1, 2, 3, 4, 5, 6].map((i) => `<rect x="${x - 66 + i * 20}" y="${y - 20}" width="8" height="40" fill="#fff" opacity=".25"/>`).join("")}</g>`;
  S.push(scene("c10", 225, `
    <defs><clipPath id="k10"><rect x="215" y="250" width="570" height="760"/></clipPath></defs>
    ${stand()}<g transform="rotate(-2.5 500 630)">
    ${behind("k10", people(500, 540, 85) + `<g fill="#6a585b"><circle cx="400" cy="600" r="30"/><path d="M335,780 Q335,640 400,635 Q465,640 465,780Z"/></g>`)}
    <g filter="url(#drop)"><path d="${d}" fill="#FCFBF7" fill-rule="evenodd"/></g>${texFill(d, 0.2)}
    <path d="M250,285h500v480h-500Z" fill="none" stroke="#e6e1d6" stroke-width="3"/>
    <text x="500" y="868" text-anchor="middle" font-family="Caveat" font-weight="700" font-size="74" fill="${BUR}">kagada '26 ♥</text>
    <text x="500" y="920" text-anchor="middle" font-family="Caveat" font-weight="600" font-size="34" fill="#6d5c60">best day ever · 24.10.2026 · IEEE UVCE</text>
    <path d="M640,965 q30,-30 70,-20" fill="none" stroke="${RED}" stroke-width="3" stroke-linecap="round"/><path d="M700,936 l12,8 -12,8" fill="none" stroke="${RED}" stroke-width="3" stroke-linecap="round"/>
    <text x="560" y="985" font-family="Caveat" font-weight="700" font-size="26" fill="${RED}">tag us!</text>
    ${["M270,960 l6,14 15,1 -11,10 4,15 -14,-8 -14,8 4,-15 -11,-10 15,-1Z", "M330,990 l3,7 8,1 -6,5 2,8 -7,-4 -7,4 2,-8 -6,-5 8,-1Z"].map((p) => `<path d="${p}" fill="none" stroke="${GOLD}" stroke-width="2.5" stroke-linejoin="round"/>`).join("")}
    ${tape(250, 262, -38)}${tape(752, 262, 36)}
    <g filter="url(#soft)"><circle cx="760" cy="790" r="48" fill="${BUR}"/></g>
    <text x="760" y="786" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="17" fill="${IVORY}" transform="rotate(14 760 790)">PAPER</text>
    <text x="760" y="806" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="17" fill="${IVORY}" transform="rotate(14 760 790)">CERTIFIED</text>
    </g>${crane(860, 240, .8, -20, IVORY, PAR, "#b9ae9b")}${crane(150, 420, .55, 15, RED, "#9e1e24", "#7d1219")}`));
}
// ============ 11. PROPS SHEET ============
{
  const stick = (x, y) => `<rect x="${x - 5}" y="${y}" width="10" height="190" rx="4" fill="#9a6b43"/><rect x="${x - 5}" y="${y}" width="4" height="190" fill="#b88457"/>`;
  const bubble = (x, y, w, h, txt, fill, col, font = "Caveat", fs = 36) => `${stick(x, y + h - 8)}<g filter="url(#soft)"><rect x="${x - w / 2}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}"/><polygon points="${x - 18},${y + h - 4} ${x + 6},${y + h - 4} ${x - 26},${y + h + 26}" fill="${fill}"/></g>
    <text x="${x}" y="${y + h / 2 + fs * 0.33}" text-anchor="middle" font-family="${font}" font-weight="700" font-size="${fs}" fill="${col}">${txt}</text>`;
  const sign = (x, y, w, h, l1, l2, fill, col) => `${stick(x, y + h - 10)}<g filter="url(#soft)"><rect x="${x - w / 2}" y="${y}" width="${w}" height="${h}" fill="${fill}"/></g>
    <text x="${x}" y="${y + h / 2 - 4}" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="30" fill="${col}">${l1}</text>
    <text x="${x}" y="${y + h / 2 + 24}" text-anchor="middle" font-family="Inter" font-weight="600" font-size="14" letter-spacing="1.5" fill="${col}">${l2}</text>`;
  S.push(`<div class="scene" id="c11"><svg viewBox="0 0 1000 1250" width="1000" height="1250">${DEFS}
    <rect width="1000" height="1250" fill="${BUR}"/>${weaveFill("M0,0H1000V1250H0Z")}
    <text x="500" y="95" text-anchor="middle" font-family="Saman" font-size="72" fill="${IVORY}">kagada prop kit</text>
    <text x="500" y="132" text-anchor="middle" font-family="Inter" font-size="15" font-weight="600" letter-spacing="4" fill="${PAR}">PRINT ON 5 MM SUNBOARD · MOUNT ON WOODEN DOWELS</text>
    ${bubble(250, 200, 300, 96, "Paper accepted!", IVORY, BUR)}
    ${bubble(720, 210, 330, 96, "Reviewer #2 who?", "#fff", RED)}
    ${sign(250, 480, 280, 120, "PEER REVIEWED", "KAGADA 2026 ✓", RED, "#fff")}
    ${bubble(720, 485, 360, 100, "here for Food for Cause", GOLD, DARK, "Caveat", 34)}
    ${stick(220, 860)}<g transform="translate(220,820) scale(2.4)">${crane(0, 0, 1, -10, IVORY, PAR, "#b9ae9b")}</g>
    ${stick(470, 880)}<g transform="translate(440,840) scale(1.8)">${plane(0, 0, 1, -18, "#fff", "#ddd6c8")}</g>
    ${bubble(760, 780, 280, 100, "ಕಾಗದ crew", IVORY, BUR, "Noto Serif Kannada", 38)}
    <g transform="rotate(-8 330 1130)" filter="url(#ink)"><rect x="200" y="1085" width="260" height="90" rx="10" fill="none" stroke="${IVORY}" stroke-width="5"/>
      <text x="330" y="1143" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="40" letter-spacing="3" fill="${IVORY}">ACCEPTED</text></g>
    <g filter="url(#soft)"><rect x="580" y="1050" width="320" height="150" fill="#FBF8F1" transform="rotate(4 740 1125)"/></g>
    <g transform="rotate(4 740 1125)"><text x="740" y="1098" text-anchor="middle" font-family="Libre Baskerville" font-weight="700" font-size="17" fill="${INK}">CERTIFICATE OF</text>
      <text x="740" y="1130" text-anchor="middle" font-family="Libre Baskerville" font-weight="700" font-size="23" fill="${BUR}">BEING AWESOME</text>
      <text x="740" y="1162" text-anchor="middle" font-family="Caveat" font-size="22" fill="${INK}">awarded at KAGADA 2026</text></g>
    </svg></div>`);
}

const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Inter:wght@400;600;700;800&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Noto+Serif+Kannada:wght@700&family=Oswald:wght@600;700&family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=Special+Elite&family=UnifrakturMaguntia&display=block" rel="stylesheet">
<style>
@font-face{font-family:Saman;src:url(assets/SAMAN___.woff2) format("woff2")}
@font-face{font-family:"Smooch Sans";src:url(assets/SmoochSans-VariableFont_wght.woff2) format("woff2");font-weight:100 900}
body{margin:0;background:#888}.scene{width:1000px;height:1250px;margin:0 0 20px}svg{display:block}
</style></head><body>${S.join("\n")}</body></html>`;
fs.writeFileSync("booths.html", html);
console.log("scenes:", S.length);
