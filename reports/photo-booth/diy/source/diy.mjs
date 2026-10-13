// DIY colourful photo-booth concepts -> diy.html (one 1000x1250 scene each)
import fs from "fs";

const FLOOR = 1080;
const PINK = "#FF3E8A", ORANGE = "#FF8A00", YELLOW = "#FFD23F", GREEN = "#3BB273", TEAL = "#2EC4B6",
  BLUE = "#3A86FF", PURPLE = "#8338EC", RED = "#E63946", INK = "#1B1B1F", KRAFT = "#C99A63";
const RAINBOW = [RED, ORANGE, YELLOW, GREEN, TEAL, BLUE, PURPLE, PINK];

let seed = 5;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const r = (a, b) => a + (b - a) * rnd();
const rect = (x, y, w, h) => `M${x},${y}h${w}v${h}h${-w}Z`;
const rrect = (x, y, w, h, q) => `M${x + q},${y}H${x + w - q}Q${x + w},${y} ${x + w},${y + q}V${y + h - q}Q${x + w},${y + h} ${x + w - q},${y + h}H${x + q}Q${x},${y + h} ${x},${y + h - q}V${y + q}Q${x},${y} ${x + q},${y}Z`;
const circ = (cx, cy, rr) => `M${cx - rr},${cy}a${rr},${rr} 0 1,0 ${rr * 2},0a${rr},${rr} 0 1,0 ${-rr * 2},0Z`;
const shade = (hex, f) => { const n = parseInt(hex.slice(1), 16); const c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.max(0, Math.min(255, Math.round(f < 0 ? v * (1 + f) : v + (255 - v) * f)))); return "#" + c.map((v) => v.toString(16).padStart(2, "0")).join(""); };

function people(cx = 505, top = 545, spread = 58) {
  const fig = (x, y, rr, c) => `<g fill="${c}"><circle cx="${x}" cy="${y}" r="${rr}"/><path d="M${x - rr * 2.2},${y + rr * 6} Q${x - rr * 2.3},${y + rr * 1.55} ${x},${y + rr * 1.35} Q${x + rr * 2.3},${y + rr * 1.55} ${x + rr * 2.2},${y + rr * 6}Z"/></g>`;
  return fig(cx + spread, top - 6, 36, "#7b6a6c") + fig(cx - spread, top + 8, 39, "#55424a");
}
const behind = (clip, ppl = people()) => `<g clip-path="url(#${clip})"><rect width="1000" height="1250" fill="url(#hall)"/><rect x="390" y="300" width="230" height="260" fill="#fff" opacity=".35" filter="url(#blur8)"/>${ppl}</g>`;
const stand = (x1 = 300, x2 = 700, top = 1000) => [x1, x2].map((x) => `<rect x="${x - 6}" y="${top}" width="12" height="${FLOOR - top - 4}" fill="#2a2627"/><rect x="${x - 55}" y="${FLOOR - 8}" width="110" height="9" rx="3" fill="#2a2627"/>`).join("");
function dims(top) {
  const c = "#8d8273";
  return `<path d="M905,${top}V${FLOOR}M897,${top}h16M897,${FLOOR}h16" stroke="${c}" stroke-width="1.5"/>
  <text x="925" y="${(top + FLOOR) / 2}" fill="${c}" font-family="Inter" font-size="17" font-weight="600" transform="rotate(90 925 ${(top + FLOOR) / 2})" text-anchor="middle">≈ 8 ft / 2.4 m</text>
  <path d="M200,1125H800M200,1117v16M800,1117v16" stroke="#F3EEE6" stroke-width="1.5"/><text x="500" y="1153" fill="#F3EEE6" font-family="Inter" font-size="17" font-weight="600" text-anchor="middle">≈ 6 ft / 1.8 m</text>`;
}
const DEFS = `<defs>
  <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F3EFE7"/><stop offset="1" stop-color="#E2DACB"/></linearGradient>
  <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A39684"/><stop offset="1" stop-color="#7E7264"/></linearGradient>
  <linearGradient id="hall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E9E3D7"/><stop offset=".6" stop-color="#D3CABA"/><stop offset="1" stop-color="#BDB2A1"/></linearGradient>
  <radialGradient id="shadow"><stop offset="0" stop-color="#000" stop-opacity=".35"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
  <pattern id="tex" width="256" height="256" patternUnits="userSpaceOnUse"><image href="assets/tex.png" width="256" height="256"/></pattern>
  <pattern id="corr" width="9" height="9" patternUnits="userSpaceOnUse"><rect width="9" height="9" fill="none"/><rect width="9" height="3" fill="#000" opacity=".05"/></pattern>
  <pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="5.5" cy="5.5" r="4.3" fill="${ORANGE}" opacity=".55"/><circle cx="16.5" cy="16.5" r="4.3" fill="${ORANGE}" opacity=".55"/></pattern>
  <pattern id="dotsC" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="4" cy="4" r="3" fill="#fff" opacity=".35"/><circle cx="12" cy="12" r="3" fill="#fff" opacity=".35"/></pattern>
  <filter id="drop" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="14" stdDeviation="14" flood-color="#000" flood-opacity=".3"/></filter>
  <filter id="soft" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="4" stdDeviation="3.5" flood-color="#000" flood-opacity=".3"/></filter>
  <filter id="glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="blur8"><feGaussianBlur stdDeviation="18"/></filter>
  <filter id="rough"><feTurbulence type="fractalNoise" baseFrequency=".04" numOctaves="2" seed="4"/><feDisplacementMap in="SourceGraphic" scale="5"/></filter>
</defs>`;
const scene = (id, top, inner) => `<div class="scene" id="${id}"><svg viewBox="0 0 1000 1250" width="1000" height="1250" xmlns="http://www.w3.org/2000/svg">${DEFS}
  <rect width="1000" height="${FLOOR}" fill="url(#wall)"/><rect y="${FLOOR - 40}" width="1000" height="40" fill="#D6CDBD"/><rect y="${FLOOR}" width="1000" height="170" fill="url(#floor)"/>
  <ellipse cx="500" cy="${FLOOR + 4}" rx="380" ry="26" fill="url(#shadow)"/>${inner}${dims(top)}</svg></div>`;
const cardboard = (d) => `<path d="${d}" fill="url(#corr)" fill-rule="evenodd"/><path d="${d}" fill="url(#tex)" fill-rule="evenodd" opacity=".35" style="mix-blend-mode:multiply"/>`;
// hand-cut cardboard letters, each a different colour
const letters = (txt, cx, y, size, cols, font = "Luckiest Guy", spacing = 0.78) => {
  const chars = [...txt], w = size * spacing, x0 = cx - ((chars.length - 1) * w) / 2;
  return chars.map((ch, i) => ch === " " ? "" : `<g transform="rotate(${r(-6, 6).toFixed(1)} ${x0 + i * w} ${y})" filter="url(#soft)"><text x="${x0 + i * w}" y="${y}" text-anchor="middle" font-family="${font}" font-size="${size}" fill="${cols[i % cols.length]}" stroke="#fff" stroke-width="${size / 9}" paint-order="stroke" stroke-linejoin="round">${ch}</text></g>`).join("");
};
const crane = (x, y, s, rot, c) => `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})" filter="url(#soft)">
  <polygon points="0,0 -46,-34 -8,-6" fill="${shade(c, -.15)}"/><polygon points="0,0 -8,-6 -10,10" fill="${shade(c, -.35)}"/>
  <polygon points="0,0 40,-40 10,-4" fill="${c}"/><polygon points="0,0 10,-4 14,8" fill="${shade(c, -.35)}"/>
  <polygon points="-10,10 0,0 14,8 2,14" fill="${c}"/><polygon points="14,8 34,-6 30,-2 18,10" fill="${shade(c, -.15)}"/><polygon points="-10,10 -30,2 -6,12" fill="${shade(c, -.15)}"/></g>`;

const crane2 = (x, y, s, c) => `<g transform="translate(${x - 50 * s},${y - 45 * s}) scale(${s})" filter="url(#soft)">
  <polygon points="50,60 30,6 54,57" fill="${shade(c, -.28)}"/><polygon points="50,60 74,2 46,57" fill="${c}"/>
  <polygon points="40,63 6,38 10,34 46,58" fill="${shade(c, -.12)}"/><polygon points="6,38 0,46 10,36" fill="${shade(c, -.35)}"/>
  <polygon points="60,63 96,34 99,38 56,58" fill="${shade(c, -.12)}"/>
  <polygon points="34,63 50,54 66,63 50,74" fill="${shade(c, .18)}"/><polygon points="34,63 50,63 50,74" fill="${shade(c, -.2)}"/></g>`;
const S = [];
const BOARD = rect(200, 250, 600, 760), HOLE = rect(345, 460, 310, 330);

// 1. PAPER FAN BURST
{
  seed = 3;
  const fan = (cx, cy, rr, c) => {
    const n = 28; let o = "";
    for (let i = 0; i < n; i++) { const a1 = (i / n) * 6.283, a2 = ((i + 1) / n) * 6.283;
      o += `<polygon points="${cx},${cy} ${cx + rr * Math.cos(a1)},${cy + rr * Math.sin(a1)} ${cx + rr * Math.cos(a2)},${cy + rr * Math.sin(a2)}" fill="${i % 2 ? c : shade(c, .28)}"/>`; }
    return `<g filter="url(#soft)">${o}<circle cx="${cx}" cy="${cy}" r="${rr * 0.22}" fill="${shade(c, -.25)}"/><circle cx="${cx}" cy="${cy}" r="${rr * 0.1}" fill="#fff" opacity=".8"/></g>`;
  };
  const F = [[220, 270, 95, PINK], [380, 300, 70, YELLOW], [520, 268, 60, TEAL], [660, 300, 82, ORANGE], [800, 260, 100, PURPLE], [610, 380, 48, GREEN],
    [215, 470, 70, BLUE], [290, 610, 58, RED], [205, 760, 88, YELLOW], [300, 880, 62, TEAL], [800, 460, 66, GREEN], [720, 600, 52, PINK], [805, 760, 90, BLUE], [700, 885, 64, ORANGE], [420, 395, 46, RED], [230, 980, 55, PURPLE], [790, 990, 58, RED]];
  S.push({ id: "d1", name: "Paper Fan Burst", tag: "Forty chart papers, folded into a firework.",
    idea: "The plain Geoshakthi board disappears under an explosion of accordion-folded paper fans (rosettes) in every colour, with big hand-cut cardboard letters on top. It looks like the window is bursting with confetti.",
    mat: ["Geoshakthi stand + board (or 2 big flattened boxes)", "40 to 50 coloured chart papers", "Glue gun, double-sided tape, stapler", "1 extra cardboard box for the letters"],
    steps: ["Fold each chart paper in 2 cm accordion pleats, fold in half, and glue the edges to make a circle. Staple the centre.", "Glue the biggest fans at the corners first, then fill the gaps with smaller ones. Let 4 or 5 stick out past the edges.", "Cut KAGADA 2026 letters from cardboard, paint each one a different colour, and glue them on."],
    cost: "₹600–900", time: "1 day, 6 people", top: 160,
    svg: scene("d1", 160, `<defs><clipPath id="k1"><path d="${BOARD}"/></clipPath></defs>${behind("k1")}${stand()}
      <g filter="url(#drop)"><path d="${BOARD + HOLE}" fill="${KRAFT}" fill-rule="evenodd"/></g>${cardboard(BOARD + HOLE)}
      ${F.map((f) => fan(...f)).join("")}<path d="${HOLE}" fill="none" stroke="#fff" stroke-width="10"/>
      ${letters("KAGADA", 500, 878, 86, [PINK, ORANGE, BLUE, GREEN, PURPLE, RED])}${letters("2026", 500, 965, 64, [TEAL, YELLOW, PINK, BLUE])}`) });
}
// 2. GAALIPATA KITE SKY
{
  seed = 9;
  const kite = (x, y, s, rot, c1, c2) => `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})" filter="url(#soft)">
    <polygon points="0,-60 40,0 0,0" fill="${c1}"/><polygon points="40,0 0,80 0,0" fill="${c2}"/><polygon points="0,80 -40,0 0,0" fill="${c1}"/><polygon points="-40,0 0,-60 0,0" fill="${c2}"/>
    <path d="M0,-60V80M-40,0H40" stroke="#fff" stroke-width="2" opacity=".7"/>
    <path d="M0,80 q12,30 -6,60 t4,60" fill="none" stroke="${INK}" stroke-width="1.5"/>
    ${[0, 1, 2].map((i) => `<polygon points="${-8 + (i % 2) * 4},${112 + i * 30} ${8 + (i % 2) * 4},${104 + i * 30} ${8 + (i % 2) * 4},${120 + i * 30}" fill="${i % 2 ? c1 : c2}"/>`).join("")}</g>`;
  const K = [[260, 300, 1.1, -15, RED, YELLOW], [430, 230, .8, 10, BLUE, PINK], [690, 280, 1.25, 18, GREEN, ORANGE], [860, 180, .9, 25, PURPLE, YELLOW], [140, 170, .75, -25, ORANGE, TEAL], [600, 150, .6, 5, PINK, BLUE], [750, 520, .7, 12, YELLOW, RED], [255, 560, .65, -10, TEAL, PURPLE]];
  const cloud = (x, y, s) => `<g transform="translate(${x},${y}) scale(${s})" fill="#fff"><circle cx="0" cy="0" r="30"/><circle cx="34" cy="-12" r="38"/><circle cx="72" cy="0" r="30"/><rect x="0" y="0" width="72" height="30"/></g>`;
  const sky = "M200,1010V250H800V1010Z";
  S.push({ id: "d2", name: "Gaalipata Kite Sky", tag: "Let your ideas fly.",
    idea: "A bright blue sky full of colourful kites (gaalipata, Karnataka's favourite) with paper tails, flying off the top of the board. Every kite string runs down to a giant spool held by the person in the photo.",
    mat: ["Board painted sky blue (2 litres of distemper, or blue chart paper)", "8 to 10 paper kites: ₹10–20 each at a kite shop, or homemade from tissue paper and sticks", "White chart paper for clouds", "Thread, ribbon offcuts for kite tails", "A cardboard tube for a spool prop"],
    steps: ["Paint the board sky blue, lighter at the bottom. Glue on white chart-paper clouds.", "Pin the kites around the window at different angles. Let 3 fly above the top edge, held on thin sticks taped behind.", "Run all the strings down to one spot near the window so a participant can hold the spool."],
    cost: "₹400–700", time: "1 day, 4 people", top: 110,
    svg: scene("d2", 110, `<defs><clipPath id="k2"><path d="${BOARD}"/></clipPath><linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2F9BFF"/><stop offset="1" stop-color="#BDEBFF"/></linearGradient></defs>
      ${behind("k2")}${stand()}<g filter="url(#drop)"><path d="${sky + HOLE}" fill="url(#skyG)" fill-rule="evenodd"/></g>
      ${cloud(230, 420, 1)}${cloud(680, 380, .8)}${cloud(220, 830, .7)}${cloud(690, 820, 1.1)}
      <path d="${HOLE}" fill="none" stroke="#fff" stroke-width="12"/>
      ${K.map((k) => `<path d="M${k[0]},${k[1] + 20} Q${(k[0] + 640) / 2},${(k[1] + 790) / 2 + 60} 640,785" fill="none" stroke="#fff" stroke-width="1.4" opacity=".8"/>`).join("")}
      ${K.map((k) => kite(...k)).join("")}
      <text x="500" y="872" text-anchor="middle" font-family="Pacifico" font-size="50" fill="${YELLOW}" stroke="${INK}" stroke-width="7" paint-order="stroke">let your ideas fly</text>
      ${letters("KAGADA 2026", 500, 960, 60, [RED, ORANGE, YELLOW, GREEN, BLUE, PURPLE, PINK], "Luckiest Guy", .66)}`) });
}
// 3. COMIC POW PANEL
{
  const star = (cx, cy, r1, r2, n, rot = 0) => Array.from({ length: n * 2 }, (_, i) => { const a = (i / (n * 2)) * 6.283 + rot, rr = i % 2 ? r2 : r1; return `${(cx + rr * Math.cos(a)).toFixed(1)},${(cy + rr * Math.sin(a)).toFixed(1)}`; }).join(" ");
  const panelB = rect(200, 250, 600, 760);
  S.push({ id: "d3", name: "Comic Book POW!", tag: "You're the hero of this issue.",
    idea: "The booth is a page from a comic book: yellow and cyan halftone dots, thick black panel borders, a giant KA-GA-DA! explosion and a speech bubble. The window is the main panel and the participant is the superhero.",
    mat: ["Cardboard or the existing board", "Yellow, cyan, magenta and black poster paint (or coloured chart paper)", "Bottle caps or a pencil eraser to stamp the dots", "Black insulation tape for the thick panel borders", "White chart paper for the speech bubbles"],
    steps: ["Paint the blocks in flat bright colours. Dip a bottle cap in a darker shade and stamp rows of dots for the halftone look.", "Mark the panel borders with black insulation tape. It's fast and gives perfectly straight lines.", "Cut the KA-GA-DA! starburst and speech bubbles from chart paper, outline them with a thick black marker, and glue them so they stick out past the board."],
    cost: "₹300–500", time: "1 day, 4 people", top: 150,
    svg: scene("d3", 150, `<defs><clipPath id="k3"><path d="${panelB}"/></clipPath></defs>${behind("k3")}${stand()}
      <g filter="url(#drop)"><path d="${panelB + HOLE}" fill="${INK}" fill-rule="evenodd"/></g>
      <rect x="212" y="262" width="576" height="170" fill="${TEAL}"/><rect x="212" y="262" width="576" height="170" fill="url(#dotsC)"/>
      <rect x="212" y="444" width="120" height="360" fill="${PINK}"/><rect x="212" y="444" width="120" height="360" fill="url(#dotsC)"/>
      <rect x="668" y="444" width="120" height="360" fill="${YELLOW}"/><rect x="668" y="444" width="120" height="360" fill="url(#dots)"/>
      <rect x="212" y="816" width="576" height="182" fill="${YELLOW}"/><rect x="212" y="816" width="576" height="182" fill="url(#dots)"/>
      <rect x="345" y="444" width="310" height="12" fill="${INK}"/><rect x="333" y="444" width="12" height="360" fill="${INK}"/>
      <rect x="230" y="276" width="250" height="40" fill="${YELLOW}" stroke="${INK}" stroke-width="4"/>
      <text x="355" y="304" text-anchor="middle" font-family="Bangers" font-size="26" letter-spacing="1.5" fill="${INK}">MEANWHILE, AT UVCE...</text>
      <g filter="url(#soft)"><polygon points="${star(640, 330, 150, 92, 14)}" fill="${YELLOW}" stroke="${INK}" stroke-width="5"/><polygon points="${star(640, 330, 108, 70, 14, .2)}" fill="${RED}"/></g>
      <text x="640" y="352" text-anchor="middle" font-family="Bangers" font-size="66" fill="#fff" stroke="${INK}" stroke-width="5" paint-order="stroke" transform="rotate(-8 640 330)">KA-GA-DA!</text>
      <g filter="url(#soft)"><ellipse cx="272" cy="520" rx="96" ry="58" fill="#fff" stroke="${INK}" stroke-width="4"/><polygon points="300,570 345,600 320,566" fill="#fff" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><rect x="296" y="560" width="26" height="9" fill="#fff"/></g>
      <text x="272" y="508" text-anchor="middle" font-family="Bangers" font-size="21" fill="${INK}">IS THAT A</text><text x="272" y="532" text-anchor="middle" font-family="Bangers" font-size="21" fill="${INK}">FUTURE IEEE</text><text x="272" y="556" text-anchor="middle" font-family="Bangers" font-size="21" fill="${INK}">FELLOW?!</text>
      <g filter="url(#soft)"><polygon points="${star(728, 690, 70, 44, 10)}" fill="${PINK}" stroke="${INK}" stroke-width="4"/></g>
      <text x="728" y="704" text-anchor="middle" font-family="Bangers" font-size="40" fill="#fff" stroke="${INK}" stroke-width="4" paint-order="stroke" transform="rotate(10 728 690)">POW!</text>
      <text x="500" y="920" text-anchor="middle" font-family="Bangers" font-size="92" letter-spacing="4" fill="${RED}" stroke="${INK}" stroke-width="7" paint-order="stroke">KAGADA 2026</text>
      <text x="500" y="972" text-anchor="middle" font-family="Bangers" font-size="28" letter-spacing="3" fill="${INK}">ISSUE #22 · 24 OCTOBER · IEEE UVCE</text>
      <g filter="url(#soft)"><polygon points="${star(225, 950, 58, 36, 9)}" fill="${BLUE}" stroke="${INK}" stroke-width="4"/></g>
      <text x="225" y="962" text-anchor="middle" font-family="Bangers" font-size="32" fill="#fff" stroke="${INK}" stroke-width="4" paint-order="stroke">ZAP!</text>`) });
}
// 4. DASARA TORAN GATE
{
  seed = 17;
  const gate = "M200,1010V420Q200,330 300,320Q360,240 500,215Q640,240 700,320Q800,330 800,420V1010Z";
  const holeA = "M345,790V540Q345,470 500,450Q655,470 655,540V790Z";
  const garland = (x1, y1, x2, y2, sag, n) => { let o = ""; for (let i = 0; i <= n; i++) { const t = i / n, x = x1 + (x2 - x1) * t, y = y1 + (y2 - y1) * t + Math.sin(t * Math.PI) * sag; o += `<circle cx="${x}" cy="${y}" r="10" fill="${i % 3 === 2 ? YELLOW : ORANGE}"/><circle cx="${x - 3}" cy="${y - 3}" r="4" fill="#fff" opacity=".25"/>`; } return `<g filter="url(#soft)">${o}</g>`; };
  const strand = (x, y1, y2) => { let o = ""; for (let y = y1; y <= y2; y += 17) o += `<circle cx="${x + Math.sin(y / 30) * 2}" cy="${y}" r="9.5" fill="${(y / 17) % 3 < 1 ? YELLOW : ORANGE}"/>`; return `<g filter="url(#soft)">${o}</g>`; };
  const leaf = (x, y, rot) => `<path transform="translate(${x},${y}) rotate(${rot})" d="M0,0 Q10,22 0,52 Q-10,22 0,0Z" fill="${GREEN}" stroke="#1f6e3f" stroke-width="1.5"/>`;
  const lantern = (x, y, c) => `<g filter="url(#soft)"><path d="M${x},${y - 80}V${y - 42}" stroke="${INK}" stroke-width="2"/><polygon points="${x},${y - 44} ${x + 40},${y} ${x},${y + 44} ${x - 40},${y}" fill="${c}"/><polygon points="${x},${y - 44} ${x + 18},${y} ${x},${y + 44} ${x - 18},${y}" fill="${shade(c, .35)}"/>
    ${[-12, 0, 12].map((d) => `<path d="M${x + d},${y + 44} v${30 + Math.abs(d)}" stroke="${YELLOW}" stroke-width="3"/>`).join("")}</g>`;
  const rangoli = () => { let o = ""; const cols = [PINK, YELLOW, GREEN, BLUE, ORANGE, PURPLE];
    for (let ring = 4; ring >= 1; ring--) for (let i = 0; i < 12; i++) { const a = (i / 12) * 6.283; o += `<ellipse cx="${500 + Math.cos(a) * ring * 30}" cy="${1150 + Math.sin(a) * ring * 9}" rx="${16 + ring * 4}" ry="${5 + ring}" fill="${cols[(ring + i) % 6]}" transform="rotate(${(a * 57.3).toFixed(0)} ${500 + Math.cos(a) * ring * 30} ${1150 + Math.sin(a) * ring * 9})"/>`; }
    return o + `<ellipse cx="500" cy="1150" rx="20" ry="7" fill="#fff"/>`; };
  S.push({ id: "d4", name: "Kagada Habba Gate", tag: "ಕಾಗದ ಹಬ್ಬ: a festival gate, Mysuru Dasara style.",
    idea: "A temple-style arch in hot pink and gold, draped with marigold garlands and a mango-leaf toran, with two paper star lanterns (akash kandil) and a colourful rangoli on the floor in front. KAGADA comes right after Dasara, so it feels like the festival is still on.",
    mat: ["Board cut into an arch shape (or cardboard arch taped onto the board)", "Pink paint or pink chart paper, gold glitter paper for borders", "10 to 15 marigold strings from KR Market (cheap the week after Dasara)", "Mango leaves on a string (toran)", "Coloured chart paper + sticks for 2 star lanterns", "Rangoli colours for the floor"],
    steps: ["Cut the arched top from cardboard and tape it to the board. Paint it pink and trim it with gold paper.", "Tie the toran across the top and hang marigold strings in loops around the window and down both sides.", "Make 2 star lanterns from chart paper and hang them from the top corners. Draw the rangoli in front on the morning of the event."],
    cost: "₹500–800", time: "1 day + 1 hour on the morning", top: 215,
    svg: scene("d4", 215, `<defs><clipPath id="k4"><path d="${gate}"/></clipPath><linearGradient id="pinkG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E5177A"/><stop offset="1" stop-color="#B0105C"/></linearGradient></defs>
      ${behind("k4", people(500, 560))}
      <g filter="url(#drop)"><path d="${gate + holeA}" fill="url(#pinkG)" fill-rule="evenodd"/></g>
      <path d="${gate}" fill="none" stroke="#F2C230" stroke-width="12"/><path d="${holeA}" fill="none" stroke="#F2C230" stroke-width="10"/>
      ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => `<circle cx="${230 + i * 60}" cy="985" r="10" fill="#F2C230"/>`).join("")}
      ${garland(215, 400, 785, 400, 70, 32)}${strand(225, 420, 990)}${strand(775, 420, 990)}${strand(350, 540, 760)}${strand(650, 540, 760)}
      ${Array.from({ length: 19 }, (_, i) => leaf(232 + i * 30, 360 - Math.sin((i / 18) * Math.PI) * 150 + 10, r(-8, 8))).join("")}
      ${lantern(300, 250, ORANGE)}${lantern(700, 250, TEAL)}
      <text x="500" y="858" text-anchor="middle" font-family="Baloo Tamma 2" font-weight="800" font-size="64" fill="#FFE27A" stroke="#7a0b3e" stroke-width="5" paint-order="stroke">ಕಾಗದ ಹಬ್ಬ</text>
      <text x="500" y="930" text-anchor="middle" font-family="Luckiest Guy" font-size="54" letter-spacing="3" fill="#fff" stroke="#7a0b3e" stroke-width="6" paint-order="stroke">KAGADA 2026</text>
      <text x="500" y="965" text-anchor="middle" font-family="Inter" font-weight="700" font-size="14" letter-spacing="3" fill="#FFE27A">IEEE UVCE · 24 OCTOBER</text>
      <rect x="440" y="1000" width="12" height="80" fill="#2a2627"/><rect x="548" y="1000" width="12" height="80" fill="#2a2627"/>${rangoli()}`) });
}
// 5. CREPE STREAMER PORTAL
{
  seed = 23;
  const board = rect(200, 250, 600, 760);
  const fringe = Array.from({ length: 31 }, (_, i) => { const x = 347 + i * 10, len = r(90, 160); return `<path d="M${x},458 q${r(-6, 6)},${len / 2} ${r(-8, 8)},${len}" stroke="${RAINBOW[i % 8]}" stroke-width="10" stroke-linecap="round" opacity=".95"/>`; }).join("");
  const balloon = (x, y, c, s = 1) => `<g filter="url(#soft)"><path d="M${x},${y + 46 * s} q-8,30 6,60" stroke="#666" stroke-width="1.3" fill="none"/><ellipse cx="${x}" cy="${y}" rx="${34 * s}" ry="${44 * s}" fill="${c}"/><ellipse cx="${x - 11 * s}" cy="${y - 16 * s}" rx="${8 * s}" ry="${13 * s}" fill="#fff" opacity=".45"/><polygon points="${x - 6},${y + 44 * s} ${x + 6},${y + 44 * s} ${x},${y + 36 * s}" fill="${c}"/></g>`;
  const confetti = Array.from({ length: 70 }, () => { const x = r(210, 790), y = r(260, 1000); if (x > 330 && x < 670 && y > 445 && y < 805) return ""; return `<rect x="${x}" y="${y}" width="${r(6, 12)}" height="${r(4, 7)}" fill="${RAINBOW[Math.floor(r(0, 8))]}" transform="rotate(${r(0, 180)} ${x} ${y})"/>`; }).join("");
  S.push({ id: "d5", name: "Crepe Streamer Portal", tag: "Walk through the rainbow.",
    idea: "A deep purple board sprinkled with paper confetti, with a rainbow curtain of crepe-paper streamers hanging over the top of the window. Participants push through the streamers like walking onto a stage. Balloon clusters at the corners finish it off.",
    mat: ["Board painted deep purple or navy (or black chart paper)", "15 to 20 crepe-paper rolls in rainbow colours (₹10–15 each)", "A hole punch and coloured paper scraps for confetti", "30 to 40 balloons", "Cardboard + glitter or coloured paper for the letters"],
    steps: ["Paint the board a dark colour so the rainbow pops. Glue punched paper confetti all over.", "Tape crepe streamers across the top edge of the window: 10–15 cm wide strips, each a different colour, hanging about halfway down.", "Tie balloon clusters at the 2 top corners and 1 bottom corner. Add cardboard letters wrapped in coloured paper."],
    cost: "₹350–600", time: "Half a day, 4 people", top: 200,
    svg: scene("d5", 200, `<defs><clipPath id="k5"><path d="${board}"/></clipPath><linearGradient id="purG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3A1C71"/><stop offset="1" stop-color="#1B1464"/></linearGradient></defs>
      ${behind("k5")}${stand()}<g filter="url(#drop)"><path d="${board + HOLE}" fill="url(#purG)" fill-rule="evenodd"/></g>${confetti}
      <path d="${HOLE}" fill="none" stroke="${YELLOW}" stroke-width="8"/><g filter="url(#soft)">${fringe}</g><rect x="340" y="452" width="320" height="14" fill="${YELLOW}"/>
      ${letters("KAGADA", 500, 380, 92, [YELLOW, PINK, TEAL, ORANGE, GREEN, BLUE])}
      <text x="500" y="872" text-anchor="middle" font-family="Pacifico" font-size="48" fill="#fff">step into the show</text>
      ${letters("2026", 500, 960, 66, [PINK, YELLOW, TEAL, ORANGE])}
      ${balloon(205, 275, PINK)}${balloon(250, 230, YELLOW, .85)}${balloon(165, 225, TEAL, .8)}${balloon(795, 275, ORANGE)}${balloon(845, 225, PURPLE, .85)}${balloon(752, 220, GREEN, .8)}
      ${balloon(790, 960, BLUE, .9)}${balloon(835, 915, RED, .75)}`) });
}
// 6. KAGADA TV
{
  const tv = rrect(195, 300, 610, 590, 50), screen = rrect(240, 400, 400, 360, 36), d = tv + screen;
  const bars = ["#C0C0C0", YELLOW, TEAL, GREEN, PINK, RED, BLUE];
  S.push({ id: "d6", name: "Kagada TV · Channel 22", tag: "You're live on the KAGADA channel.",
    idea: "A giant retro TV built from cardboard boxes: orange body, teal control panel, paper-plate knobs, stick antennas and a rainbow test-pattern strip. A red LIVE light makes every photo look like a broadcast.",
    mat: ["3 or 4 big cardboard boxes (from appliance shops, free)", "Orange and teal paint or chart paper", "2 paper plates + bottle caps for knobs and buttons", "2 broom sticks or bamboo for antennas, with foil balls on top", "Coloured chart paper strips for the test pattern"],
    steps: ["Tape the boxes into one big flat front. Cut the rounded screen window with a box cutter.", "Paint the body orange and the side panel teal. Stick on paper-plate knobs and bottle-cap buttons.", "Tape antennas behind the top, add the rainbow strip under the screen and a red LIVE circle in the corner."],
    cost: "₹250–450", time: "1 day, 4 people", top: 140,
    svg: scene("d6", 140, `<defs><clipPath id="k6"><path d="${screen}"/></clipPath></defs>${behind("k6", people(440, 545))}
      <path d="M430,300L330,150M570,300L680,140" stroke="#555" stroke-width="7" stroke-linecap="round"/><circle cx="330" cy="150" r="13" fill="#d8d8d8"/><circle cx="680" cy="140" r="13" fill="#d8d8d8"/>
      <rect x="260" y="885" width="22" height="190" fill="#5b3a24" transform="rotate(8 271 885)"/><rect x="718" y="885" width="22" height="190" fill="#5b3a24" transform="rotate(-8 729 885)"/>
      <g filter="url(#drop)"><path d="${d}" fill="${ORANGE}" fill-rule="evenodd"/></g>${cardboard(d)}
      <path d="${rrect(214, 374, 452, 412, 48)}M${240},${400}" fill="none" stroke="#3a2a22" stroke-width="22"/>
      <rect x="675" y="380" width="112" height="490" rx="18" fill="${TEAL}"/>
      ${[[731, 460, 38, YELLOW], [731, 570, 38, PINK]].map(([x, y, rr, c]) => `<g filter="url(#soft)"><circle cx="${x}" cy="${y}" r="${rr}" fill="#fff"/><circle cx="${x}" cy="${y}" r="${rr * .7}" fill="${c}"/><rect x="${x - 4}" y="${y - rr * .7}" width="8" height="${rr * .7}" fill="${INK}"/></g>`).join("")}
      ${[0, 1, 2].map((i) => `<circle cx="${703 + i * 28}" cy="660" r="10" fill="${[RED, GREEN, BLUE][i]}"/>`).join("")}
      ${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="700" y="${700 + i * 14}" width="62" height="6" rx="3" fill="#1b5f59"/>`).join("")}
      <text x="731" y="850" text-anchor="middle" font-family="Luckiest Guy" font-size="26" fill="#fff">CH 22</text>
      ${bars.map((c, i) => `<rect x="${240 + i * (400 / 7)}" y="785" width="${400 / 7 + .5}" height="30" fill="${c}"/>`).join("")}
      <text x="440" y="860" text-anchor="middle" font-family="Luckiest Guy" font-size="46" letter-spacing="2" fill="#fff" stroke="#8a3d00" stroke-width="5" paint-order="stroke">KAGADA TV</text>
      <g filter="url(#glow)"><circle cx="595" cy="438" r="11" fill="${RED}"/></g><text x="575" y="446" text-anchor="end" font-family="Inter" font-weight="800" font-size="22" fill="#fff" stroke="${INK}" stroke-width="3" paint-order="stroke">LIVE</text>
      <rect x="250" y="720" width="250" height="30" fill="${RED}"/><text x="262" y="742" font-family="Inter" font-weight="800" font-size="15" fill="#fff">BREAKING: GENIUS SPOTTED</text>
      <text x="500" y="345" text-anchor="middle" font-family="Inter" font-weight="800" font-size="18" letter-spacing="6" fill="#7a3600">IEEE UVCE · 24.10.2026</text>`) });
}
// 7. PAPER PLATE MANDALA
{
  const cx = 500, cy = 610, board = rect(200, 250, 600, 760), hole = circ(cx, cy, 160);
  const plate = (x, y, rr, c1, c2) => { let sc = ""; for (let i = 0; i < 20; i++) { const a = (i / 20) * 6.283; sc += `<circle cx="${x + Math.cos(a) * rr * .92}" cy="${y + Math.sin(a) * rr * .92}" r="${rr * .14}" fill="${c1}"/>`; }
    return `<g filter="url(#soft)">${sc}<circle cx="${x}" cy="${y}" r="${rr * .92}" fill="${c1}"/><circle cx="${x}" cy="${y}" r="${rr * .68}" fill="${c2}"/><circle cx="${x}" cy="${y}" r="${rr * .3}" fill="${c1}"/><circle cx="${x}" cy="${y}" r="${rr * .12}" fill="#fff"/></g>`; };
  const ring = (rad, n, rr, off, pal) => Array.from({ length: n }, (_, i) => { const a = (i / n) * 6.283 + off; return plate(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad, rr, pal[i % pal.length][0], pal[i % pal.length][1]); }).join("");
  S.push({ id: "d7", name: "Paper Plate Mandala", tag: "A rangoli you can stand inside.",
    idea: "Painted paper plates arranged in rings around a round window, like a giant rangoli or mandala, on a deep indigo board. From far away it glows like a flower, and up close every plate is a mini artwork.",
    mat: ["Board painted deep indigo or black", "50 to 60 paper plates in 2 sizes (₹1–2 each)", "Poster paints in 6 bright colours", "Glue gun", "A string and pencil to mark the circle"],
    steps: ["Mark a circle on the board with a string-and-pencil compass and cut the round window with a jigsaw or box cutter.", "Paint the plates in two-colour rings (outer rim one colour, centre another). This is a good job for 6 to 8 volunteers.", "Glue the plates in rings around the window: small ones on the inside, big ones on the outside, and a few breaking past the board edges."],
    cost: "₹250–400", time: "1 day, 6 people", top: 230,
    svg: scene("d7", 230, `<defs><clipPath id="k7"><path d="${circ(cx, cy, 165)}"/></clipPath></defs>${behind("k7", people(500, 560))}${stand()}
      <g filter="url(#drop)"><path d="${board + hole}" fill="#1C1F5E" fill-rule="evenodd"/></g>
      ${ring(320, 18, 40, 0, [[PINK, YELLOW], [TEAL, ORANGE], [YELLOW, PURPLE]])}
      ${ring(248, 14, 46, .22, [[ORANGE, TEAL], [PURPLE, YELLOW], [GREEN, PINK], [RED, YELLOW]])}
      ${ring(192, 20, 22, 0, [[YELLOW, RED], [PINK, BLUE]])}
      <circle cx="${cx}" cy="${cy}" r="164" fill="none" stroke="#fff" stroke-width="7"/>
      <rect x="200" y="935" width="600" height="75" fill="#1C1F5E"/>
      ${letters("KAGADA 2026", 500, 990, 58, [YELLOW, PINK, TEAL, ORANGE, GREEN, BLUE, PURPLE], "Luckiest Guy", .64)}`) });
}
// 8. RAINBOW CRANE CASCADE
{
  const board = rect(200, 250, 600, 760);
  const cols = [RED, ORANGE, YELLOW, GREEN, TEAL, BLUE, PURPLE, PINK];
  let strands = "";
  const xs = [228, 284, 716, 772];
  xs.forEach((x, i) => { strands += `<path d="M${x},262V${975 - (i % 2) * 30}" stroke="#bbb" stroke-width="1.2"/>`;
    for (let k = 0; k < 10 - (i % 2); k++) strands += crane2(x, 330 + k * 68, .56, cols[(i * 3 + k) % 8]); });
  [390, 455, 520, 585].forEach((x, i) => { strands += `<path d="M${x + 12},262V${330 + (i % 2) * 60}" stroke="#bbb" stroke-width="1.2"/>`;
    for (let k = 0; k < 1 + (i % 2); k++) strands += crane2(x + 12, 330 + k * 62, .5, cols[(i * 2 + k + 3) % 8]); });
  const lights = Array.from({ length: 24 }, (_, i) => { const x = 215 + i * 25, y = 268 + Math.sin(i / 2) * 6; return `<circle cx="${x}" cy="${y}" r="4.5" fill="#FFE9A8" filter="url(#glow)"/>`; }).join("");
  S.push({ id: "d8", name: "Rainbow Crane Cascade", tag: "A thousand folds, one photo.",
    idea: "Strings of origami cranes in rainbow order fall like a curtain on both sides of the window, with a string of fairy lights along the top. It's simple, very colourful, and 100% paper, which is exactly what kagada means.",
    mat: ["Board painted white or covered with white chart paper", "300 to 400 squares of coloured paper (cut from chart paper, or origami packs)", "Fishing line or thread, a needle", "1 string of fairy lights (borrow one from Diwali stock)", "A wooden rod or PVC pipe across the top"],
    steps: ["Hold a crane-folding session: 10 volunteers × 1 hour ≈ 300 cranes. Fold them in rainbow colours.", "Thread the cranes onto strings, about 5 cm apart, keeping each string in colour order.", "Hang the strings from the top rod on both sides of the window, add a short row above it, and tape the fairy lights along the top."],
    cost: "₹200–400", time: "1 day, 10 people folding", top: 240,
    svg: scene("d8", 240, `<defs><clipPath id="k8"><path d="${board}"/></clipPath></defs>${behind("k8")}${stand()}
      <g filter="url(#drop)"><path d="${board + HOLE}" fill="#FBF8F2" fill-rule="evenodd"/></g>
      <rect x="190" y="250" width="620" height="14" rx="7" fill="#7a5638"/>${lights}${strands}<path d="${HOLE}" fill="none" stroke="${INK}" stroke-width="5"/>
      <text x="500" y="868" text-anchor="middle" font-family="Pacifico" font-size="46" fill="${PURPLE}">fold your future</text>
      ${letters("KAGADA 2026", 500, 958, 62, cols, "Luckiest Guy", .64)}`) });
}

const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Bangers&family=Luckiest+Guy&family=Pacifico&family=Baloo+Tamma+2:wght@800&family=Inter:wght@400;600;700;800&display=block" rel="stylesheet">
<style>body{margin:0}.scene{width:1000px;height:1250px}svg{display:block}</style></head><body>${S.map((s) => s.svg).join("\n")}</body></html>`;
fs.writeFileSync("diy.html", html);
fs.writeFileSync("diy.json", JSON.stringify(S.map(({ svg, ...rest }) => rest), null, 1));
console.log("scenes", S.length);
