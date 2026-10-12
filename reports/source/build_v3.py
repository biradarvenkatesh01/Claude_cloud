import os
R = os.path.dirname(os.path.abspath(__file__))
base_css = open(os.path.join(R, "base.css")).read().replace("<style>", "").replace("</style>", "")

css = base_css + """
.page{padding-top:12mm}
.intro{font-size:9.6pt}
.pair{display:grid;grid-template-columns:1fr 1fr;gap:6mm;margin:3mm 0 3mm}
.side-label{font-family:var(--mono);font-size:7.2pt;letter-spacing:.1em;text-transform:uppercase;margin-bottom:1.6mm;display:flex;align-items:center;gap:1.6mm}
.side-label.ok{color:var(--green)} .side-label.bad{color:var(--red)}
.dot{width:2.2mm;height:2.2mm;border-radius:50%;display:inline-block}
.ok .dot{background:var(--green)} .bad .dot{background:var(--red)}
.widget{border:1px solid var(--ink);border-radius:3mm;overflow:hidden;background:#fffdf8;box-shadow:0 1.2mm 0 rgba(22,27,51,.08)}
.widget.okw{border-color:var(--green)} .widget.badw{border-color:var(--red)}
.whead{background:var(--ink);color:#fff;padding:2.4mm 3mm;display:flex;align-items:center;gap:2.2mm}
.av{width:6.5mm;height:6.5mm;border-radius:50%;background:var(--green);color:#fff;font-family:var(--serif);font-size:10pt;display:flex;align-items:center;justify-content:center;flex:none}
.wt{font-size:8.6pt;font-weight:600;line-height:1.2}
.ws{font-family:var(--mono);font-size:6.2pt;letter-spacing:.06em;color:#b9c2d8;text-transform:uppercase}
.wbody{padding:3mm 3mm 2mm;min-height:72mm;display:flex;flex-direction:column;gap:1.8mm}
.m{max-width:84%;font-size:8.4pt;line-height:1.42;padding:1.6mm 2.6mm;border-radius:2.6mm}
.m.u{align-self:flex-end;background:var(--ink);color:#fff;border-bottom-right-radius:.6mm}
.m.b{align-self:flex-start;background:#efece3;color:var(--ink);border-bottom-left-radius:.6mm}
.chips{align-self:flex-start;display:flex;flex-wrap:wrap;gap:1.2mm}
.chips span{border:1px solid var(--green);color:var(--green);border-radius:3mm;padding:.2mm 2.2mm;font-size:7.6pt;background:#fff}
.chips.dim span{border-color:var(--rule);color:var(--muted)}
.res{font-family:var(--mono);font-size:6.8pt;letter-spacing:.05em;padding:1.2mm 2mm;border-radius:1mm;align-self:stretch;line-height:1.45}
.res.ok{background:var(--green-soft);color:var(--green)}
.res.bad{background:var(--red-soft);color:var(--red)}
.winput{border-top:1px solid var(--rule);padding:2mm 3mm;font-size:7.8pt;color:var(--muted);display:flex;justify-content:space-between}
.cap{font-size:8.6pt;line-height:1.45;margin-top:2mm;color:var(--body)}
.how{display:flex;align-items:stretch;margin:2mm 0 1mm}
.how .s{flex:1;border:1px solid var(--rule);background:#fbf9f4;padding:1.8mm 2.4mm;font-size:8.2pt;line-height:1.35;color:var(--ink)}
.how .a{width:6mm;display:flex;align-items:center;justify-content:center;color:var(--muted);flex:none}
.verdict{display:grid;grid-template-columns:repeat(5,1fr);border-top:1px solid var(--ink);border-bottom:1px solid var(--rule);margin-top:3mm}
.verdict>div{padding:2.2mm 2mm 2.4mm 0;font-size:8pt;color:var(--ink);font-weight:600;line-height:1.3}
.verdict .tag{margin-top:1.3mm}
.bottom{margin-top:3.5mm;background:var(--red-soft);border-left:3px solid var(--red);padding:3mm 4mm;font-size:9.3pt;color:var(--ink)}
.bottom.good{background:var(--green-soft);border-left-color:var(--green)}
.needs{display:grid;grid-template-columns:repeat(5,1fr);border:1px solid var(--ink);margin:2mm 0 2mm}
.needs>div{padding:2.6mm 2.6mm;border-right:1px solid var(--ink);font-size:8.4pt;line-height:1.38;color:var(--ink)}
.needs>div:last-child{border-right:0}
.needs b{display:block;font-size:8.8pt;margin-bottom:.8mm}
.wide .wbody{min-height:0}
"""

def widget(kind, sub, items, inp="Type your message…"):
    out = [f'<div class="widget {"okw" if kind=="ok" else "badw" if kind=="bad" else ""}">',
           f'<div class="whead"><div class="av">D</div><div><div class="wt">DataSphere Assistant</div><div class="ws">{sub}</div></div></div>',
           '<div class="wbody">']
    for t, v in items:
        if t == "u": out.append(f'<div class="m u">{v}</div>')
        elif t == "b": out.append(f'<div class="m b">{v}</div>')
        elif t == "chips": out.append('<div class="chips">' + "".join(f"<span>{c}</span>" for c in v) + "</div>")
        elif t == "dimchips": out.append('<div class="chips dim">' + "".join(f"<span>{c}</span>" for c in v) + "</div>")
        elif t == "ok": out.append(f'<div class="res ok">✓ {v}</div>')
        elif t == "bad": out.append(f'<div class="res bad">✗ {v}</div>')
    out.append(f'</div><div class="winput"><span>{inp}</span><span>➤</span></div></div>')
    return "".join(out)

def side(kind, label, w, cap):
    return f'<div><div class="side-label {kind}"><span class="dot"></span>{label}</div>{w}<div class="cap">{cap}</div></div>'

TAG = {"fits": '<span class="tag fits">Fits</span>', "part": '<span class="tag part">Partly</span>', "no": '<span class="tag no">Doesn\'t fit</span>'}
NEEDS = ["Correct answers", "Suggests courses", "Easy to update", "Saves leads", "Hands over"]
def verdict(marks):
    return '<div class="verdict">' + "".join(f"<div>{n}<br>{TAG[m]}</div>" for n, m in zip(NEEDS, marks)) + "</div>"

def page(n, total, body):
    return f'''<section class="page"><div class="top"><span>DataSphere · Website Rebuild</span><span>Chatbot Review</span></div>
{body}<div class="foot"><span>DataSphere — Zoho chatbot options</span><span>{n:02d} / {total:02d}</span></div></section>'''

def how(steps):
    h = '<div class="how">'
    for i, s in enumerate(steps):
        if i: h += '<div class="a">→</div>'
        h += f'<div class="s">{s}</div>'
    return h + "</div>"

T = 5
pages = []

# ---------- PAGE 1 ----------
pages.append(page(1, T, f'''
  <div class="kicker">Chatbot review · Zoho SalesIQ</div>
  <h1>Zoho's chatbot options,<br><em>and why they fall short for us.</em></h1>
  <p class="lead">Zoho SalesIQ comes with our CRM Plus plan, so I checked every way it lets us put a chatbot on the website. For each option, the pages ahead show a sample chat: one question it handles well, and one it can't.</p>
  <div class="meta"><span>Prepared for <b>DataSphere Edu Solutions</b></span><span>Prepared by <b>Venkatesh Biradar</b></span><span>Date <b>12 Oct 2026</b></span></div>
  <div class="cards">
    <div><span class="label">What Zoho offers</span>Three bot types in SalesIQ: a flow builder (Zobot), a FAQ bot (Answer Bot), and Zobot with SalesIQ Scripts.</div>
    <div><span class="label">What they're good at</span>Collecting a student's details and passing the chat to our team.</div>
    <div><span class="label">Where they fail</span>Understanding a student's question in their own words and suggesting the right course.</div>
  </div>

  <div class="sec-rule"></div>
  <div class="num">01</div>
  <h2>What a good chatbot must do for us</h2>
  <div class="needs">
    <div><b>Correct answers</b>Fees, duration, syllabus, batches, online or classroom.</div>
    <div><b>Suggests courses</b>Understands the student's goal and points to the right course.</div>
    <div><b>Easy to update</b>The team can change a fee or date without a developer.</div>
    <div><b>Saves leads</b>Name, phone and course reach Zoho CRM.</div>
    <div><b>Hands over</b>Offers a call-back when it can't help.</div>
  </div>

  <div class="sec-rule"></div>
  <div class="num">02</div>
  <h2>How Zoho adds a chatbot to the website</h2>
  <div class="flow">
    <div class="b"><span class="label">Student</span>Clicks the chat bubble on our site</div>
    <div class="arr">→</div>
    <div class="b"><span class="label">SalesIQ widget</span>Chat window, added with one script</div>
    <div class="arr">→</div>
    <div class="b dark"><span class="label">Bot brain · pick one</span>1. Zobot (flow)<br>2. Answer Bot<br>3. Zobot + Scripts</div>
    <div class="arr">→</div>
    <div class="b green"><span class="label">Zoho CRM Plus</span>Lead saved</div>
  </div>
  <p class="small">How to read the next pages: <span class="tag fits">Fits</span> works well · <span class="tag part">Partly</span> works with limits or manual effort · <span class="tag no">Doesn't fit</span> can't be relied on. Course names, fees and timings in the chats are sample values; the marks are based on Zoho's SalesIQ documentation and our SalesIQ account.</p>
'''))

# ---------- OPTION 1 ----------
w1ok = widget("ok", "Zobot · flow builder", [
    ("b", "Hi! What are you looking for today?"),
    ("chips", ["Courses", "Fees", "Talk to us"]),
    ("u", "Talk to us"),
    ("b", "Sure! What's your name?"),
    ("u", "Rahul"),
    ("b", "Thanks Rahul. Your phone number?"),
    ("u", "98XXXXXX10"),
    ("b", "Got it. Our counsellor will call you shortly."),
    ("ok", "Lead saved in Zoho CRM"),
])
w1bad = widget("bad", "Zobot · flow builder", [
    ("b", "Hi! What are you looking for today?"),
    ("chips", ["Courses", "Fees", "Talk to us"]),
    ("u", "I'm in 3rd year ECE and know a bit of Python. Which course should I take for a data job?"),
    ("b", "Sorry, I didn't understand that. Please choose an option below."),
    ("dimchips", ["Courses", "Fees", "Talk to us"]),
    ("bad", "Can't read typed questions. Only follows the buttons we drew."),
])
pages.append(page(2, T, f'''
  <div class="rule" style="border-top:1px solid var(--ink);margin-top:6mm"></div>
  <div class="num">03 · Option 1</div>
  <h2>Zobot: the no-code flow builder</h2>
  {how(["We draw the chat as a flowchart: buttons and questions", "The student clicks through the path we drew", "Answers are saved to Zoho CRM"])}
  <div class="pair">
    {side("ok", "Where it works · collecting details", w1ok, "Button-driven forms work well. The student's details go straight into Zoho CRM.")}
    {side("bad", "Where it fails · asking for advice", w1bad, "The moment a student types a real question, the bot can only repeat its menu.")}
  </div>
  {verdict(["no", "no", "part", "fits", "fits"])}
  <div class="bottom"><b>Why we can't use it:</b> it's a form with buttons, not a conversation. To "recommend" courses we'd have to draw a branch for every background, skill and goal, which nobody could maintain.</div>
'''))

# ---------- OPTION 2 ----------
w2ok = widget("ok", "Answer Bot · FAQs", [
    ("u", "What are the batch timings for Data Analytics?"),
    ("b", "Data Analytics runs weekend batches on Saturday and Sunday, 10 am to 1 pm. Weekday evening batches are also available."),
    ("ok", "Found the matching FAQ article"),
    ("u", "Is it online or classroom?"),
    ("b", "Both! You can join online or at our centre."),
    ("ok", "Direct question, one article has the answer"),
])
w2bad = widget("bad", "Answer Bot · FAQs", [
    ("u", "I know basic Python and want a job in 6 months. Which course should I start with?"),
    ("b", "Here's an article that might help:<br><u>Data Analytics – Course Overview</u>"),
    ("u", "But is that right for me?"),
    ("b", "Here's an article that might help:<br><u>Frequently Asked Questions</u>"),
    ("bad", "Returns the closest article. Doesn't ask about the student or compare courses."),
])
pages.append(page(3, T, f'''
  <div class="rule" style="border-top:1px solid var(--ink);margin-top:6mm"></div>
  <div class="num">04 · Option 2</div>
  <h2>Answer Bot: replies from our FAQs</h2>
  {how(["We add FAQs and articles to SalesIQ", "The bot finds the closest article", "Zoho's AI (Zia) rewords it as a reply"])}
  <div class="pair">
    {side("ok", "Where it works · simple facts", w2ok, "Direct questions with a ready answer in one article work fine.")}
    {side("bad", "Where it fails · personal advice", w2bad, "It answers from one article at a time. It can't understand the student and suggest a path.")}
  </div>
  {verdict(["part", "no", "part", "part", "fits"])}
  <div class="bottom"><b>Why we can't use it:</b> it's a search box over FAQs. All course info would have to be rewritten as articles and kept in sync by hand, and it still couldn't suggest courses or collect leads on its own.</div>
'''))

# ---------- OPTION 3 ----------
w3ok = widget("ok", "Zobot · SalesIQ Scripts", [
    ("u", "What is the fee for Data Analytics?"),
    ("b", "The Data Analytics course fee is ₹45,000. EMI options are available."),
    ("ok", "Matched our rule for the word “fee”"),
    ("u", "Can someone call me?"),
    ("b", "Sure! Please share your name and phone number."),
    ("ok", "Matched our rule for “call”, so lead capture starts"),
])
w3bad = widget("bad", "Zobot · SalesIQ Scripts", [
    ("u", "How much do I have to pay for the analytics program?"),
    ("b", "Sorry, I didn't get that."),
    ("bad", "Same question, different words: no “fee” keyword, so no rule matched"),
    ("u", "I'm a commerce student. Can I do data science?"),
    ("b", "Sorry, I didn't get that."),
    ("bad", "No rule written for this. Every question needs hand-written code."),
])
pages.append(page(4, T, f'''
  <div class="rule" style="border-top:1px solid var(--ink);margin-top:6mm"></div>
  <div class="num">05 · Option 3</div>
  <h2>Zobot with SalesIQ Scripts</h2>
  {how(["We write rules in Deluge, Zoho's own coding language", "Each message is checked against our rules", "The matching rule sends its reply"])}
  <div class="pair">
    {side("ok", "Where it works · exact keywords", w3ok, "Questions that contain the words we coded for get the right answer.")}
    {side("bad", "Where it fails · real student questions", w3bad, "Students don't use our keywords. Anything we didn't predict falls through.")}
  </div>
  {verdict(["part", "no", "no", "fits", "fits"])}
  <div class="bottom"><b>Why we can't use it:</b> it isn't AI, just hand-written if/else rules. Every new question or fee change needs someone who knows Deluge, so the team couldn't update it on their own.</div>
'''))

# ---------- ALTERNATIVE ----------
w4 = widget("ok", "Our bot · course content + AI", [
    ("u", "I'm in 3rd year ECE and know a bit of Python. Which course should I take for a data job?"),
    ("b", "Nice, Python is a great start! Are you aiming for data analyst roles, or more into machine learning?"),
    ("u", "Data analyst, I think."),
    ("b", "Then I'd suggest <b>Data Analytics</b> (16 weeks, weekend batches) first. It covers Excel, SQL, Power BI and Python for analysis, and fits around college. Want a counsellor to share fees and the next batch date?"),
    ("u", "Yes. Rahul, 98XXXXXX10"),
    ("b", "Done, Rahul! Our team will call you today."),
    ("ok", "Lead saved in Zoho CRM · source “Website – chatbot” · interest: Data Analytics"),
])
grid = """
  <table class="matrix">
    <tr><th style="width:24%">Need</th><th>Zobot (flow)</th><th>Answer Bot</th><th>Zobot + Scripts</th><th style="color:var(--green)">Our RAG bot</th></tr>
    <tr><td class="k">Correct answers</td><td>{no}</td><td>{part}</td><td>{part}</td><td>{fits}</td></tr>
    <tr><td class="k">Suggests courses</td><td>{no}</td><td>{no}</td><td>{no}</td><td>{fits}</td></tr>
    <tr><td class="k">Easy to update</td><td>{part}</td><td>{part}</td><td>{no}</td><td>{fits}</td></tr>
    <tr><td class="k">Saves leads</td><td>{fits}</td><td>{part}</td><td>{fits}</td><td>{fits}</td></tr>
    <tr><td class="k">Hands over</td><td>{fits}</td><td>{fits}</td><td>{fits}</td><td>{fits}</td></tr>
  </table>""".format(**TAG)
pages.append(page(5, T, f'''
  <div class="rule" style="border-top:1px solid var(--ink);margin-top:6mm"></div>
  <div class="num">06 · The better option</div>
  <h2>Our own RAG chatbot, with leads saved in Zoho</h2>
  <p class="intro">Instead of Zoho's bots, we build a chatbot on our own course content (RAG + an AI model). It reads our course details, talks to the student in plain language, suggests the right course, and saves every interested student in <b>Zoho CRM</b>, so the team's follow-up stays exactly the same.</p>
  {how(["<b>Student</b> asks in their own words", "<b>Our bot</b> looks up our course info (RAG)", "<b>AI</b> writes the answer and suggests courses", "<b>Zoho CRM</b> gets the lead automatically"])}
  <div class="pair" style="grid-template-columns:1.15fr .85fr;align-items:start">
    {side("ok", "The same question every Zoho option failed", w4, "")}
    <div style="padding-top:5mm">
      <div class="note" style="margin-top:0"><b>Correct answers:</b> only from our course info, so it never makes up a fee or date.</div>
      <div class="note"><b>Suggests courses:</b> asks a follow-up, then recommends.</div>
      <div class="note"><b>Easy to update:</b> the team edits one course sheet; the bot uses it.</div>
      <div class="note"><b>Saves leads:</b> name, phone and course go straight to Zoho CRM.</div>
      <div class="note"><b>Hands over:</b> offers a call-back whenever it can't help.</div>
    </div>
  </div>
  {grid}
'''))

html = f'''<!doctype html><html><head><meta charset="utf-8"><title>Zoho Chatbot Options</title>
<link rel="stylesheet" href="fonts/fonts.css"><style>{css}</style></head><body>{"".join(pages)}</body></html>'''
open(os.path.join(R, "report_v3.html"), "w").write(html)
print("ok")
