# DataSphere Document Style Guide

> **Instructions for the AI reading this file**
> You will be given this style guide plus some content. Turn that content into a polished **A4 PDF report** that follows this guide exactly: same colours, fonts, layout, components and writing voice.
> Build the document as **one self-contained HTML file** using the template in Section 9, then export it to PDF (Section 10). If you cannot export a PDF yourself, return the finished HTML file and tell the user how to print it to PDF.
> Do not invent facts, numbers, prices or test results. If you use sample or example values, say so in a small note.

---

## 1. The look in one paragraph

Calm, editorial and paper-like. A **warm cream page** with **deep navy text** and a **forest-green accent**. Titles are set in an elegant **serif**, and the second line of the main title is in **green italics**. Small labels (section numbers, table headers, header and footer text) are set in an **uppercase monospace font with wide letter spacing**. Body text uses a clean **sans-serif**. Lines are thin and boxes have square corners. There are no gradients, no drop-shadow-heavy cards and no emojis. It should look like a thoughtful plan written by a careful intern: professional but human.

---

## 2. Colour palette

| Token | Hex | Used for |
|---|---|---|
| `--paper` | `#f5f2ea` | Page background (warm cream) |
| `--ink` | `#161b33` | Headings, strong text, dark boxes, main rules |
| `--body` | `#2b2f40` | Body text |
| `--muted` | `#6c6f78` | Labels, captions, header/footer, small notes |
| `--rule` | `#cfc8b6` | Thin divider lines, table row lines |
| `--green` | `#1e6b43` | Accent: italic title line, section numbers, labels, "good" status |
| `--green-soft` | `#dde6d5` | Light green fill for highlight boxes and "decision" cells |
| `--orange` | `#b4652a` | "Partly / later / caution" status |
| `--red` | `#a3402f` | "Fails / no / risk" status |
| `--red-soft` | `#f3e2da` | Light red fill for warning or drawback boxes |
| card white | `#fbf9f4` | Inner boxes on the cream page |
| widget white | `#fffdf8` | Chat-window body |

Rules:
- The page is always cream. Never use pure white for the page background.
- Use green for positive or "recommended" things, orange for partial or caution, and red for negative or failing. Navy is the neutral strong colour.
- Keep it to these colours only. Use a new colour only to imitate a third-party product in a mock-up (e.g. a blue Zoho widget), and say it is an illustration.

---

## 3. Fonts

All three are free Google Fonts.

| Role | Font | Weight/style | Where |
|---|---|---|---|
| Display / headings | **Newsreader** (serif) | 400 regular, 400 italic | Main title, section titles (h2), lead paragraph, text inside summary cards |
| Body | **Hanken Grotesk** (sans-serif) | 400, 500, 600 | Paragraphs, table cells, bullets, chat bubbles |
| Labels | **IBM Plex Mono** (monospace) | 400, 500 | Header/footer, kickers, section numbers, table headers, status tags, box labels |

```html
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&family=IBM+Plex+Mono:wght@400;500&family=Hanken+Grotesk:wght@400;500;600&display=swap" rel="stylesheet">
```

If Google Fonts can't load (offline rendering), download the `.woff2` files and reference them with `@font-face`. Fallbacks: `Georgia, serif`, `Arial, sans-serif` and `monospace`.

### Type scale

| Element | Font | Size | Line height | Notes |
|---|---|---|---|---|
| Main title (h1) | Newsreader | 31pt | 1.08 | Line 2 in `<em>`, coloured green |
| Lead paragraph | Newsreader | 13pt | 1.5 | Navy, under the title |
| Section title (h2) | Newsreader | 21pt | 1.15 | Navy |
| Sub-heading (h3) | Hanken Grotesk 600 | 10.4pt | | Navy |
| Body | Hanken Grotesk | 10.2pt | 1.55 | |
| Table cell | Hanken Grotesk | 9.4pt | 1.5 | First column bold (600), navy |
| Small note / caption | Hanken Grotesk | 8.2–8.6pt | 1.5 | Muted grey |
| Labels / kickers / table headers | IBM Plex Mono | 6.9–7.5pt | | UPPERCASE, letter-spacing .08–.1em |

---

## 4. Page layout

- **Size:** A4 portrait (210 × 297 mm), `@page { size: A4; margin: 0 }`.
- **Each page is a fixed `<section class="page">`**, 210 × 297 mm, with padding `13mm 16mm 0 16mm`. Content must fit within a page. Plan the content per page; never let text run into the footer.
- **Running header** (every page): two mono labels in the top corners, e.g. left `DATASPHERE · WEBSITE REBUILD`, right the document type (`EXECUTION PLAN`, `CHATBOT REVIEW`…). On pages after the first, put a 1px navy rule under the header.
- **Running footer** (every page): a thin `--rule` line, then mono labels: left `DATASPHERE — <DOCUMENT NAME>`, right `01 / 06` (page / total, zero-padded).
- **Sections** start with a 1px navy rule, then a green mono number (`01`, `02`… or `03 · Option 1`), then the serif h2 title.
- Generous white space. Only one idea per page section.

---

## 5. Page 1 (cover + start) structure

1. Running header.
2. **Kicker:** green mono uppercase, e.g. `CHATBOT REVIEW · ZOHO SALESIQ`.
3. **Title (h1), two lines:** a plain first line, then a green italic second line that gives the angle.
   e.g. `Zoho's chatbot options,` / *`and why they fall short for us.`*
4. **Lead paragraph** (serif, 13pt): 2–3 sentences on why this document exists and what it covers.
5. **Meta row** between two thin rules:
   `PREPARED FOR  DATASPHERE EDU SOLUTIONS   PREPARED BY  VENKATESH BIRADAR   DATE  12 OCT 2026`
   Labels in muted grey, values in navy.
6. **Three summary cards** in one bordered row (navy 1px border, divided by navy lines). Each has a green mono label (e.g. `THE SITE`, `THE LEADS`, `THE SAFETY NET`) and 1–2 sentences in serif.
7. Then the first numbered section (`01`).

---

## 6. Components (copy these)

### 6.1 Status tags
Small mono uppercase pills with a 1px outline in the status colour. Use them in tables to show status at a glance.
```html
<span class="tag fits">Fits</span>      <!-- green -->
<span class="tag part">Partly</span>    <!-- orange -->
<span class="tag no">Doesn't fit</span> <!-- red -->
<span class="tag fits">Keep</span>  <span class="tag part">Retire later</span>  <span class="tag new">Core</span>
```

### 6.2 Data table
- No vertical lines. The header row is mono uppercase muted text with a **navy line underneath**, and each row has a thin `--rule` line below it.
- The first column is bold navy (the "name" of the row).
- Typical columns: `REQUIREMENT | WHAT WE WILL TEST | IT PASSES IF…` or `ACCOUNT | WHAT IT CONTROLS TODAY | ROLE IN THE NEW SETUP | STATUS`.

### 6.3 Flow diagram (boxes with arrows)
A horizontal row of square boxes joined by `→`. Each box has a green mono label and 1–2 lines of text.
- Normal box: card-white fill, navy border.
- **Key box:** navy fill, white text (the main system, e.g. "New website" / "Bot brain").
- **Destination box:** green-soft fill with a green border (e.g. "Zoho CRM").

### 6.4 Steps strip
A 4-column bordered row: `STEP 1`, `STEP 2`, `STEP 3`, `DECISION`. The last cell has a green-soft fill.

### 6.5 Note boxes
- Green note (`.note`): green-soft fill, 3px green left border, for information or positive points.
- Red note (`.warn` / `.bottom`): red-soft fill, 3px red left border, for drawbacks or "why we can't use it".

### 6.6 End boxes
- **Next step:** navy filled box, white serif text, green mono label `NEXT STEP`.
- **Related documents:** navy-outlined box with the mono label `RELATED DOCUMENTS`.

### 6.7 Chat-window mock-up (for chatbot or UI topics)
- A rounded window (3mm radius) with a navy header bar (round green avatar "D", the bot name, and a mono subtitle), a light body, and an input bar ("Type your message… ➤").
- User bubbles sit on the right with a navy fill. Bot bubbles sit on the left with a beige fill (`#efece3`). Quick-reply buttons are green outlined pills.
- Result strips inside the chat: `✓ …` on green-soft (works) or `✗ …` on red-soft (fails).
- Show them **in pairs**: left labelled `● WHERE IT WORKS` (green border), right labelled `● WHERE IT FAILS` (red border), with a one-line caption under each.

### 6.8 Verdict strip
A row of criteria, each with a status tag underneath, between a navy top line and a rule bottom line. Use it under each option or item being judged.

---

## 7. Writing voice

- **First person, as the intern:** "I went through…", "My plan is…", "I'd suggest…". Use "we" for team decisions.
- **Plain, simple English.** Short sentences. Explain any technical term in a few words the first time ("RAG: the bot looks up our course info first, then the AI writes the answer").
- **Lead with the point.** Section titles say the conclusion ("Chatbot: Zoho SalesIQ first, after a fit check"), not just the topic.
- **Be honest and specific.** Say what was checked and what wasn't ("I haven't run the full test yet; the marks come from Zoho's documentation"). Mark sample values as samples.
- **Show, don't lecture:** prefer a table, flow diagram, steps strip or chat mock-up over long paragraphs. One or two short paragraphs per section, at most.
- **No emojis, no exclamation-heavy tone, no marketing words.**
- Dates are written as `12 Oct 2026`. Names: **Venkatesh Biradar** (prepared by) and **DataSphere Edu Solutions** (prepared for).

---

## 8. Full CSS (use as-is)

```css
:root{
  --paper:#f5f2ea; --ink:#161b33; --body:#2b2f40; --muted:#6c6f78; --rule:#cfc8b6;
  --green:#1e6b43; --green-soft:#dde6d5; --orange:#b4652a; --red:#a3402f; --red-soft:#f3e2da;
  --serif:"Newsreader",Georgia,serif; --sans:"Hanken Grotesk",Arial,sans-serif; --mono:"IBM Plex Mono",monospace;
}
@page{size:A4;margin:0}
*{box-sizing:border-box}
html,body{margin:0;background:var(--paper);color:var(--body);font-family:var(--sans);font-size:10.2pt;line-height:1.55;-webkit-print-color-adjust:exact;print-color-adjust:exact}

/* page frame */
.page{width:210mm;height:297mm;padding:13mm 16mm 0 16mm;position:relative;page-break-after:always;overflow:hidden;background:var(--paper)}
.page:last-child{page-break-after:auto}
.top{display:flex;justify-content:space-between;font-family:var(--mono);font-size:7.2pt;letter-spacing:.08em;color:var(--muted);text-transform:uppercase}
.top-rule{border-top:1px solid var(--ink);margin:6mm 0 0}
.foot{position:absolute;left:16mm;right:16mm;bottom:9mm;border-top:1px solid var(--rule);padding-top:2.5mm;display:flex;justify-content:space-between;font-family:var(--mono);font-size:7.2pt;letter-spacing:.08em;color:var(--muted);text-transform:uppercase}

/* type */
.kicker{font-family:var(--mono);font-size:7.5pt;letter-spacing:.1em;color:var(--green);text-transform:uppercase;margin:5mm 0 1mm}
h1{font-family:var(--serif);font-weight:400;font-size:31pt;line-height:1.08;color:var(--ink);margin:0 0 4mm;letter-spacing:-.01em}
h1 em{color:var(--green)}
.lead{font-family:var(--serif);font-size:13pt;line-height:1.5;color:var(--ink);margin:0 0 5mm}
.num{font-family:var(--mono);font-size:7.5pt;color:var(--green);margin:6mm 0 0;letter-spacing:.08em}
h2{font-family:var(--serif);font-weight:400;font-size:21pt;line-height:1.15;color:var(--ink);margin:.5mm 0 3mm}
h3{font-family:var(--sans);font-size:10.4pt;font-weight:600;color:var(--ink);margin:5mm 0 1.5mm}
p{margin:0 0 2.6mm}
ul{margin:0 0 2.5mm;padding-left:4.5mm} li{margin:0 0 1.2mm}
.small{font-size:8.2pt;color:var(--muted);line-height:1.5}
.sec-rule{border-top:1px solid var(--ink);margin-top:6mm}
.label{display:block;font-family:var(--mono);font-size:6.9pt;letter-spacing:.1em;color:var(--green);text-transform:uppercase;margin-bottom:1mm;line-height:1.3}

/* meta + cards */
.meta{border-top:1px solid var(--rule);border-bottom:1px solid var(--rule);padding:2.6mm 0;font-family:var(--mono);font-size:7.3pt;letter-spacing:.08em;color:var(--muted);text-transform:uppercase;display:flex;gap:9mm;margin-bottom:5mm}
.meta b{color:var(--ink);font-weight:500}
.cards{display:grid;grid-template-columns:repeat(3,1fr);border:1px solid var(--ink)}
.cards>div{padding:3mm 3.5mm;border-right:1px solid var(--ink);font-family:var(--serif);font-size:11pt;line-height:1.4;color:var(--ink)}
.cards>div:last-child{border-right:0}

/* tables */
table{width:100%;border-collapse:collapse;margin:1mm 0 3mm}
th{font-family:var(--mono);font-weight:400;font-size:6.9pt;letter-spacing:.09em;text-transform:uppercase;color:var(--muted);text-align:left;padding:0 3mm 2mm 0;border-bottom:1px solid var(--ink)}
td{vertical-align:top;padding:2.4mm 3mm 2.4mm 0;border-bottom:1px solid var(--rule);font-size:9.4pt;line-height:1.5}
td.k{font-weight:600;color:var(--ink)}

/* tags */
.tag{display:inline-block;font-family:var(--mono);font-size:6.6pt;letter-spacing:.09em;text-transform:uppercase;padding:.4mm 1.6mm;border:1px solid;white-space:nowrap;line-height:1.6}
.fits{color:var(--green);border-color:var(--green)}
.part{color:var(--orange);border-color:var(--orange)}
.no{color:var(--red);border-color:var(--red)}
.new{color:var(--green);background:var(--green-soft);border-color:var(--green-soft)}

/* notes */
.note{background:var(--green-soft);border-left:3px solid var(--green);padding:3mm 4mm;font-size:9.2pt;margin:3mm 0}
.warn,.bottom{background:var(--red-soft);border-left:3px solid var(--red);padding:3mm 4mm;font-size:9.2pt;margin:3mm 0;color:var(--ink)}

/* flow diagram */
.flow{display:flex;align-items:stretch;margin:3mm 0 4mm}
.flow .b{border:1px solid var(--ink);background:#fbf9f4;padding:2.4mm 2.8mm;font-size:8.6pt;line-height:1.4;flex:1;color:var(--ink)}
.flow .b.dark{background:var(--ink);color:#fff}
.flow .b.dark .label{color:#9fd0b0}
.flow .b.green{background:var(--green-soft);border-color:var(--green)}
.flow .arr{display:flex;align-items:center;justify-content:center;width:7mm;color:var(--muted);font-size:12pt;flex:none}

/* steps + end boxes */
.steps{display:grid;grid-template-columns:repeat(4,1fr);border:1px solid var(--ink);margin:3mm 0}
.steps>div{padding:3mm;border-right:1px solid var(--ink);font-size:8.8pt;line-height:1.45;color:var(--ink)}
.steps>div:last-child{border-right:0;background:var(--green-soft)}
.endrow{display:grid;grid-template-columns:1.25fr 1fr;gap:5mm;margin-top:4mm}
.next{background:var(--ink);color:#fff;padding:4mm 4.5mm;font-family:var(--serif);font-size:11.5pt;line-height:1.45}
.next .label{color:#9fd0b0}
.rel{border:1px solid var(--ink);padding:4mm 4.5mm;font-size:9pt;color:var(--ink)}

/* verdict strip */
.verdict{display:grid;grid-template-columns:repeat(5,1fr);border-top:1px solid var(--ink);border-bottom:1px solid var(--rule);margin-top:3mm}
.verdict>div{padding:2.2mm 2mm 2.4mm 0;font-size:8pt;color:var(--ink);font-weight:600;line-height:1.3}

/* chat mock-up */
.pair{display:grid;grid-template-columns:1fr 1fr;gap:6mm;margin:3mm 0}
.side-label{font-family:var(--mono);font-size:7.2pt;letter-spacing:.1em;text-transform:uppercase;margin-bottom:1.6mm}
.side-label.ok{color:var(--green)} .side-label.bad{color:var(--red)}
.widget{border:1px solid var(--ink);border-radius:3mm;overflow:hidden;background:#fffdf8}
.widget.okw{border-color:var(--green)} .widget.badw{border-color:var(--red)}
.whead{background:var(--ink);color:#fff;padding:2.4mm 3mm;display:flex;align-items:center;gap:2.2mm}
.av{width:6.5mm;height:6.5mm;border-radius:50%;background:var(--green);color:#fff;font-family:var(--serif);display:flex;align-items:center;justify-content:center}
.wt{font-size:8.6pt;font-weight:600}
.ws{font-family:var(--mono);font-size:6.2pt;letter-spacing:.06em;color:#b9c2d8;text-transform:uppercase}
.wbody{padding:3mm;display:flex;flex-direction:column;gap:1.8mm}
.m{max-width:84%;font-size:8.4pt;line-height:1.42;padding:1.6mm 2.6mm;border-radius:2.6mm}
.m.u{align-self:flex-end;background:var(--ink);color:#fff}
.m.b{align-self:flex-start;background:#efece3;color:var(--ink)}
.chips{display:flex;gap:1.2mm} .chips span{border:1px solid var(--green);color:var(--green);border-radius:3mm;padding:.2mm 2.2mm;font-size:7.6pt}
.res{font-family:var(--mono);font-size:6.8pt;padding:1.2mm 2mm;border-radius:1mm}
.res.ok{background:var(--green-soft);color:var(--green)} .res.bad{background:var(--red-soft);color:var(--red)}
.winput{border-top:1px solid var(--rule);padding:2mm 3mm;font-size:7.8pt;color:var(--muted);display:flex;justify-content:space-between}
.cap{font-size:8.6pt;margin-top:2mm}
```

---

## 9. HTML template (starting point)

```html
<!doctype html>
<html><head><meta charset="utf-8">
<title>DOCUMENT TITLE</title>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&family=IBM+Plex+Mono:wght@400;500&family=Hanken+Grotesk:wght@400;500;600&display=swap" rel="stylesheet">
<style>/* paste Section 8 CSS here */</style>
</head><body>

<!-- PAGE 1 -->
<section class="page">
  <div class="top"><span>DataSphere · Website Rebuild</span><span>Execution Plan</span></div>
  <div class="kicker">Execution plan · Website rebuild</div>
  <h1>How we will proceed,<br><em>now that we have access.</em></h1>
  <p class="lead">Two or three sentences on what this document is and why it exists.</p>
  <div class="meta"><span>Prepared for <b>DataSphere Edu Solutions</b></span><span>Prepared by <b>Venkatesh Biradar</b></span><span>Date <b>12 Oct 2026</b></span></div>
  <div class="cards">
    <div><span class="label">The site</span>One or two sentences.</div>
    <div><span class="label">The leads</span>One or two sentences.</div>
    <div><span class="label">The safety net</span>One or two sentences.</div>
  </div>

  <div class="sec-rule"></div>
  <div class="num">01</div>
  <h2>Section title that states the point</h2>
  <p>Short intro paragraph.</p>
  <table>
    <tr><th>Account</th><th>What it controls today</th><th>Role in the new setup</th><th>Status</th></tr>
    <tr><td class="k">Zoho CRM Plus</td><td>…</td><td>…</td><td><span class="tag new">Core</span></td></tr>
    <tr><td class="k">WordPress</td><td>…</td><td>…</td><td><span class="tag part">Retire later</span></td></tr>
  </table>
  <div class="foot"><span>DataSphere — How we will proceed</span><span>01 / 04</span></div>
</section>

<!-- PAGE 2 -->
<section class="page">
  <div class="top"><span>DataSphere · Website Rebuild</span><span>Execution Plan</span></div>
  <div class="top-rule"></div>
  <div class="num">02</div>
  <h2>How everything will connect</h2>
  <div class="flow">
    <div class="b"><span class="label">Student</span>Visits the site</div><div class="arr">→</div>
    <div class="b dark"><span class="label">New website</span>Courses, blog, enquiry form</div><div class="arr">→</div>
    <div class="b green"><span class="label">Zoho CRM</span>Lead saved</div>
  </div>
  <div class="steps">
    <div><span class="label">Step 1</span>…</div><div><span class="label">Step 2</span>…</div>
    <div><span class="label">Step 3</span>…</div><div><span class="label">Decision</span>…</div>
  </div>
  <div class="endrow">
    <div class="next"><span class="label">Next step</span>One clear sentence.</div>
    <div class="rel"><span class="label">Related documents</span>Doc names.</div>
  </div>
  <div class="foot"><span>DataSphere — How we will proceed</span><span>02 / 04</span></div>
</section>

</body></html>
```

Chat mock-up pair (for chatbot or product comparisons):
```html
<div class="pair">
  <div>
    <div class="side-label ok">● Where it works · collecting details</div>
    <div class="widget okw">
      <div class="whead"><div class="av">D</div><div><div class="wt">DataSphere Assistant</div><div class="ws">Bot type</div></div></div>
      <div class="wbody">
        <div class="m b">Hi! What are you looking for today?</div>
        <div class="chips"><span>Courses</span><span>Fees</span></div>
        <div class="m u">Talk to us</div>
        <div class="res ok">✓ Lead saved in Zoho CRM</div>
      </div>
      <div class="winput"><span>Type your message…</span><span>➤</span></div>
    </div>
    <div class="cap">One-line caption.</div>
  </div>
  <div><!-- same structure with side-label bad, widget badw, res bad --></div>
</div>
```

---

## 10. Exporting to PDF

- **Chrome/Chromium (best):** open the HTML, then Print → Destination "Save as PDF", Paper A4, Margins **None**, and tick **Background graphics**.
- **Command line:** `chrome --headless --no-pdf-header-footer --print-to-pdf=output.pdf file:///path/report.html`
- After exporting, check every page: nothing overlaps the footer, no headers wrap mid-word, tags stay on one line, and the fonts loaded (serif titles, mono labels).

---

## 11. Final checklist

- [ ] Cream background on every page, navy text, green accent only
- [ ] Newsreader titles; the h1 second line in green italics
- [ ] Mono uppercase labels for header, footer, kickers, section numbers and table headers
- [ ] Running header and footer with `NN / NN` page numbers on every page
- [ ] Page 1 has a kicker, two-line title, lead, meta row and three summary cards
- [ ] Sections are numbered `01`, `02`… with titles that state the point
- [ ] Tables have no vertical lines and a bold first column; status uses tags
- [ ] At least one visual per section (table, flow, steps, chat mock-up or verdict strip)
- [ ] First-person intern voice, plain English, no emojis
- [ ] Sample values are labelled as samples; nothing invented
- [ ] Content fits each A4 page; nothing runs into the footer
