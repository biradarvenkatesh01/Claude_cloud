# Context: DataSphere Internship, Website Chatbot Work (Session of 12–14 Oct 2026)

> This file summarises a Claude Code session so another Claude chat or project can continue with full context.
> Treat it as background knowledge about the user, the project, the decisions made, and the files produced.

---

## 1. About the user

- **Name:** Venkatesh Biradar (email: biradarvenkatesh27@gmail.com)
- **Role:** Software Development Intern at **DataSphere** (DataSphere Edu Solutions Pvt. Ltd.; the Zoho organisation is named "datasphere llp"). DataSphere is an ed-tech / training company that sells data-related courses (domain: `datasphere.co.in`, learner portal: `training.datasphere.co.in` on TrainerCentral).
- Student at UVCE (University of Visvesvaraya College of Engineering), Bengaluru.
- **Communication style:** writes casually in **Hinglish** ("bhai", "acche se", "hata", "anta"), often by voice-to-text. Wants things explained simply ("in layman terms"), then wants polished output fast.
- **Preferences learned in this session:**
  - Likes **visual, interactive-looking documents** (tables, diagrams, mock chat windows) over walls of text.
  - Wants reports to **look like an intern made them**: first-person voice, honest, plain English.
  - Wants documents to match the **DataSphere house style** (see section 6) taken from the earlier plan PDFs.
  - **No emojis** in messages meant for the team or HR.
  - Prefers to be given the final deliverable directly ("send only the message as the reply").
  - Reports go to the **HR / project manager and team**, who are non-technical.

---

## 2. The project: DataSphere website rebuild

The user has written two earlier planning documents (2 Oct 2026):
- **"DataSphere – Website Rebuild Plan, Draft v1"** (for the project manager and team)
- **"DataSphere – How We Will Proceed"** (execution plan, prepared for DataSphere Edu Solutions)
- An earlier, separate doc is referenced: **"DataSphere – Website Analysis & Proposed Plan"** (audit of the current site and the proposed structure).

### Accounts and their roles
| Account | Today | In the new setup | Status |
|---|---|---|---|
| GoDaddy | Domain datasphere.co.in, DNS (email MX, training subdomain), hosting for the current WordPress site | Domain and DNS stay; only the website records change on launch day | Keep |
| Zoho CRM Plus | Gets leads from social media (Facebook/Instagram); not connected to the website (web forms go to Mailchimp and Slack); no chatbot set up; only 1 active user licence | Single place where every website lead lands. Lead sources: "Website", "Website – chatbot", "Website – course page" | Core |
| TrainerCentral | Learner portal, course purchase, enrolment | Unchanged; the website's Enrol buttons link to each course | Keep |
| WordPress | Current site (7 pages) | Content source, fallback until launch, then retired | Retire later |
| Elementor Pro | Layouts and enquiry/popup forms (old submissions stored; phone numbers wrongly saved in a "message" field) | Export old leads into Zoho, then retire | Retire later |

### The new site
- A **Next.js** website: Home, Courses, Blog (new), About, Contact, plus an **admin panel** for courses, batches, fees, blog posts, testimonials and SEO text.
- A lead handler sends every enquiry to **Zoho CRM** through a secure API connection, with an email alert to the counselling team.
- Hosting is still to be decided (Vercel is suggested; GoDaddy shared hosting suits WordPress, not Next.js).
- Zoho lead counts seen in CRM: FY2025 Q4: 140, FY2026 Q1: 5, Q2: 24, Q3: 340 (mostly social media).
- CRM Plus also includes Campaigns, Social, Marketing Automation, LandingPage, PageSense and Analytics.

### Order of work (from "How We Will Proceed")
0. Secure and back up → 1. Optional quick fixes on the current site → 2. Collect content and course data (one confirmed sheet of every course) → 3. Set up Zoho CRM (fields, sources, alerts, API) → 4. Build the website → 5. **Chatbot fit check** → 6. Test and review → 7. Launch → 8. After launch.

### The original chatbot plan
"How We Will Proceed", section 04: **try Zoho SalesIQ first (it comes with CRM Plus), after a fit check**:

| Requirement | It passes if |
|---|---|
| Correct course answers (25–30 real questions) | Mostly correct; never makes up a fee or date |
| Stays up to date | The team can update it without the intern |
| Captures leads | A complete lead appears in Zoho CRM with source "Website – chatbot" |
| Hands over to a person | Offers a call-back or number, not a dead end |
| Looks like our site | Fits the new design; doesn't cover buttons on mobile |
| Keeps the site fast | Acceptable load time on phones |
| Cost and limits | Fits the CRM Plus plan limits |

Fallbacks from the earlier proposal: **Option A** = another ready-made chatbot service; **Option B** = a custom bot built on our own course content (**RAG + an AI model**).

---

## 3. What happened in this session

1. The user asked about implementing the "Zoho chatbot". Claude checked Notion Memory (empty), the Notion workspace (only Daily Tracker tasks such as "internship offer letter" and "cs internship report"), Google Drive (a shared folder "DataSphere – Week 1 Backup" from sde1.datasphere@gmail.com, which appeared empty) and Gmail (only LinkedIn Zoho job alerts). No earlier chatbot context was found.
2. **Learning phase:** Claude explained Zoho's chatbot landscape in simple terms:
   - **SalesIQ** = Zoho's website chat platform (chat bubble, live chat, visitor tracking, CRM sync). A bot inside it is a **Zobot**.
   - Zobot build platforms: Codeless Bot Builder, Answer Bot, SalesIQ Scripts (Deluge), Zia Skills, Webhooks, IBM Watson / Microsoft Azure.
   - **Answer Bot** = replies from knowledge-base FAQs/articles (simple RAG, Zia AI rewording). It also exists in Zoho Desk.
   - Zoho Desk (support tickets + Zia) and Zoho Cliq (internal team chat bots) are not for website visitors.
   - Explained **RAG** ("open-book exam": retrieve course info first, then the AI answers only from it).
3. **Decision reached:** Zoho's ready-made bots can't understand a student's free-text question or **recommend courses**. **Go with Option B: our own RAG chatbot, with leads pushed into Zoho CRM.** SalesIQ is skipped for the chat widget. (A hybrid using a SalesIQ webhook was discussed but not chosen.)
4. **Report built** to justify the decision to HR, through several iterations (section 4).
5. **WhatsApp message** drafted to send with the report (section 5).
6. **Style guide** created so any AI can reproduce the DataSphere document look (section 6).

---

## 4. The final report: "Zoho Website Chatbot Options"

**File:** `reports/Zoho_Chatbot_Options_Report.pdf` (6 pages, A4), built from HTML (source in `reports/source/`).

**Iteration history (what the user asked to change):**
- v1: a 13-page generic explainer (glossary, all Zoho products, build steps, costs). Too broad.
- v2: only "options, how they work, drawbacks". Then cut to website-only options (Desk and Cliq removed).
- v3: **Zia Skills, Webhooks and Watson/Azure removed** (only 3 options kept), restyled in the DataSphere house style, intern voice.
- v4: each option shown as **chat-window mock-ups** (a "where it works" chat next to a "where it fails" chat). The last page shows only the RAG + Zoho CRM alternative; no "next steps" or "related documents".
- v5 (final): added the **UI/design drawback**: the SalesIQ widget is a template, so we can't make it match the website.

**Final structure:**
1. **Page 1:** title "Zoho's chatbot options, *and why they fall short for us.*", meta (prepared for DataSphere Edu Solutions, by Venkatesh Biradar, 12 Oct 2026), 3 summary cards, 6 needs (Correct answers, Suggests courses, Easy to update, Saves leads, Hands over, Matches our design), a flow diagram of how Zoho adds a bot (Student → SalesIQ widget → bot brain → Zoho CRM), and a legend (FITS / PARTLY / DOESN'T FIT). A note says sample values are used and the marks come from Zoho docs plus the SalesIQ account, not a full test.
2. **Option 1: Zobot (no-code flow builder).** Works: button flow collects name and phone, and the lead is saved in CRM. Fails: "I'm in 3rd year ECE and know a bit of Python. Which course should I take for a data job?" gets "Sorry, I didn't understand. Please choose an option." Verdict: Correct answers ✗, Suggests ✗, Update ~, Leads ✓, Hands over ✓, Design ~.
3. **Option 2: Answer Bot.** Works: "Batch timings for Data Analytics?" gets the FAQ answer. Fails: "I know basic Python and want a job in 6 months, which course first?" gets "Here's an article that might help." Verdict: Answers ~, Suggests ✗, Update ~, Leads ~, Hands over ✓, Design ~.
4. **Option 3: Zobot + SalesIQ Scripts (Deluge).** Works: "What is the fee for Data Analytics?" matches the "fee" rule. Fails: "How much do I have to pay for the analytics program?" gets "Sorry, I didn't get that" (no keyword match). Verdict: Answers ~, Suggests ✗, Update ✗, Leads ✓, Hands over ✓, Design ~.
5. **"The chat window can't look like our website":** a Zoho-template widget mock (blue, "Driven by Zoho SalesIQ") next to our own widget in the DataSphere style with course cards and Enrol/Syllabus buttons. SalesIQ allows theme, colours, position, logo and greeting; the layout, bubbles and overall look stay Zoho's.
6. **"Our own RAG chatbot, with leads saved in Zoho":** the same ECE question handled well (follow-up question, then a Data Analytics recommendation, then details collected, then "Lead saved in Zoho CRM · source Website – chatbot"), plus a comparison table where our bot fits every need.

Sample values used in the chats (not real data): "Data Analytics", 16 weeks, weekend batches, ₹45,000, "Rahul 98XXXXXX10".

---

## 5. WhatsApp message sent with the report (final, no emojis)

```
*Update: Website Chatbot*

Hi all,

I went through the chatbot options Zoho offers for our website (through Zoho SalesIQ) and came across some drawbacks. I've put together a short report showing the drawbacks of each option with sample chats. Please go through the attached PDF.

*Proposed approach*
Based on this, the approach I'd suggest is a *custom RAG-based chatbot* built on our own course content. Leads from it would go directly into *Zoho CRM*, so the team's follow-up process stays the same.

*Plan for today and tomorrow*
Until I get the Google credentials, I'll be exploring:
• How to build the RAG chatbot and integrate it into our website
• How to send leads from the chatbot to Zoho CRM

Once I get the Google credentials, I'll start working on the website right away.

Thanks!
```

---

## 6. DataSphere document house style (summary)

The full spec is in **`reports/DataSphere_Document_Style_Guide.md`** (colours, fonts, CSS, HTML template, components, voice, PDF export, checklist).

- **Colours:** cream paper `#f5f2ea`, navy ink `#161b33`, body `#2b2f40`, muted `#6c6f78`, rule `#cfc8b6`, green accent `#1e6b43` (soft `#dde6d5`), orange `#b4652a`, red `#a3402f` (soft `#f3e2da`).
- **Fonts:** Newsreader (serif titles; the second title line is green italic), Hanken Grotesk (body), IBM Plex Mono (uppercase spaced labels, headers/footers, tags).
- **Layout:** A4; running header "DATASPHERE · WEBSITE REBUILD" plus the doc type; footer "DATASPHERE — NAME" with "01 / 06"; numbered sections (01, 02…); tables without vertical lines and with a bold first column; outlined status tags (KEEP / CORE / RETIRE LATER / FITS / PARTLY / DOESN'T FIT); flow diagrams; a 4-step strip ending in "Decision"; navy "Next step" box; "Related documents" box.
- **Voice:** first-person intern, plain English, honest about what was and wasn't tested, no emojis.
- **Built as:** HTML, then Chromium "print to PDF" (A4, no margins, background graphics on).

---

## 7. Proposed RAG chatbot architecture (Option B)

```
Website (Next.js) → chat widget (our own, styled like the site)
        │
        ▼
Backend (Python FastAPI, or Next.js API routes)
  ├─ Course data: one sheet/JSON of every course (name, level, duration, fee, mode,
  │  batches, prerequisites, topics, who it's for, next course, TrainerCentral link)
  ├─ Retrieval: with fewer than ~100 courses, put the whole catalog in the prompt;
  │  add a vector DB (Chroma/pgvector) only for long docs
  ├─ LLM (e.g. Claude) with rules: ask 1–2 questions first, recommend at most 3 courses,
  │  only from course data, never invent fees/dates, offer a counsellor call-back
  └─ save_lead tool → Zoho CRM Leads API (OAuth refresh token, .in data centre likely)
        fields: name, phone, email, course of interest, chat summary,
        Lead Source = "Website – chatbot"
```
- Course data comes from phase 2 of the plan ("one confirmed sheet of every course").
- Secrets (LLM API key, Zoho client ID/secret/refresh token) go in environment variables, never in code.
- Zoho CRM's API comes with CRM Plus; set up a Zoho API client (api-console.zoho.in).

---

## 8. Current status and next steps (as of 14 Oct 2026)

- The report and WhatsApp message are ready (the report is sent or about to be sent to HR/team).
- **Waiting on:** Google credentials (needed to start work on the website).
- **Today and tomorrow:** explore how to build the RAG chatbot into the website and how to send its leads to Zoho CRM.
- **Open items:**
  - Get the real course list (names, fees, batches, durations) to replace the sample values.
  - Confirm which lead fields the sales/counselling team wants.
  - Confirm the company name for the site ("datasphere llp" vs "Datasphere Edu Solutions Pvt. Ltd.").
  - Check whether live human handoff is needed in version 1.
  - Find out how social media leads currently reach Zoho, to avoid duplicate fields.
  - Hosting choice (Vercel suggested).

---

## 9. Files produced (GitHub repo `biradarvenkatesh01/Claude_cloud`, branch `claude/chat-session-lr6qbm`)

| File | What it is |
|---|---|
| `reports/Zoho_Chatbot_Options_Report.pdf` | The final 6-page report |
| `reports/source/zoho_chatbot_options.html` | HTML source of the report |
| `reports/source/build_v3.py` + `base.css` + `fonts/` | Generator script and assets used to build the HTML |
| `reports/DataSphere_Document_Style_Guide.md` | Style guide for making documents in the DataSphere look with any AI |
| `DataSphere_Chatbot_Session_Context.md` | This context file |
