# DataSphere Website Rebuild: Setup Context

Summary of a planning chat from 13–14 Oct 2026. Use it to pick up where this chat left off.

## Who and what

- **Me:** Venkatesh Biradar, intern at **DataSphere Edu Solutions** (an education / course-training company). GitHub username: `biradarvenkatesh01`.
- **Project:** rebuild the company website **from scratch**. The current site runs on **WordPress**. The new one will be a **Next.js** project.
- **Earlier work:** a report called *Zoho Chatbot Options* (12 Oct 2026). It covers the chatbots in Zoho SalesIQ, which comes with the company's Zoho CRM Plus plan: Zobot flow builder, Answer Bot, and Zobot + SalesIQ Scripts. Conclusion: Zoho is good at collecting student details into the CRM and handing over to a counsellor. It's weak at understanding questions, suggesting courses, and matching the new site's design. So a custom chatbot on the new site is likely.

## Accounts and who owns what

| Thing | Status |
|---|---|
| Domain | Bought on **GoDaddy** by the **CEO with their personal account**. I already have access to this GoDaddy account. |
| Company Google account | DataSphere has its **own separate organization Google account**, separate from the CEO's personal one. |
| Google Business Profile | HR added me as a **manager** of DataSphere's Business Profile. That only covers the Google Maps/Search listing. It does **not** give access to the Google account, Gmail, Drive or GitHub. |
| My team mail ID | I have one, but it will likely be deleted when I leave, so it shouldn't **own** any company account. |
| HR | Non-technical. Messages to HR should be simple and casual. |

## Decisions made

1. **The code must belong to the company, not me.** That's the standard practice: the company owns the repo, and interns get added and removed.
2. **Use the organization Google account**, not the CEO's personal account, for GitHub and any hosting account.
3. **GitHub setup:** two options were discussed, and both are fine:
   - **Simplest for HR (current plan):** HR signs up on GitHub with the org email, creates one **private** repo (e.g. `datasphere-website`), and adds me as a **collaborator** (Settings → Collaborators → Add people).
     - Limitation: as a collaborator I can push and merge, but I can't change repo settings. The owner must approve the hosting service's GitHub access once.
   - **Better long term:** a free GitHub **organization** with me added as a member. It can be upgraded later.
   - GitHub signup only needs an email and a verification code, not the Google password. HR can simply forward the code.
4. **GitHub Free is enough:** unlimited private repos and members. The paid Team plan (about $4/user/month) only adds things like branch protection on private repos and required reviews. Not needed now.
5. **Hosting: Netlify (free plan) is the current choice.**
   - **Vercel Hobby (free) is NOT allowed:** it's for non-commercial use only, and it can't deploy private repos owned by a GitHub org. Vercel would need **Pro (about $20/month per member)**, and I'd probably need a seat since I push the code.
   - **Netlify free** allows commercial sites and supports Next.js fully: App Router, SSR/ISR, API routes, Server Actions, middleware, `next/image`. It uses monthly credits, so watch usage after launch. Cloudflare Pages is another free option.
   - **GoDaddy hosting is not a good fit:** cPanel "Git Version Control" only copies repo files, it doesn't build or auto-deploy, and shared hosting can't really run Node. Next.js would have to be a static export, losing API routes and SSR. A GoDaddy VPS is too much to manage.
6. **GoDaddy stays only as the domain/DNS provider.**

## How everything connects

```
GitHub (code) ──app connection──► Netlify/Vercel (builds & hosts) ◄──DNS records── GoDaddy (domain)
```

- GoDaddy never connects to GitHub directly.
- **GitHub → host:** import the repo once, and the owner authorizes access once. After that, every push to `main` auto-deploys and branches get preview links. There's also a free `*.netlify.app` URL for testing.
- **GoDaddy → host:** add the domain in the host's dashboard, then in GoDaddy → My Products → Domain → **DNS** change the **A record (`@`)** and **CNAME (`www`)** to the values the host shows. HTTPS is set up automatically.

## Launch-day checklist (for later)

1. Test the new site fully on the free `*.netlify.app` URL.
2. Add the domain in Netlify.
3. **Take a screenshot of the current GoDaddy DNS records** as a backup.
4. Change **only** the A and CNAME records. **Don't touch MX/TXT records** (company email).
5. Wait a few minutes to a few hours. To roll back, restore the old records from the screenshot.
6. The WordPress site keeps running until the DNS switch, so nothing breaks during development.
7. Afterwards, check GoDaddy → My Products for a **Web Hosting / Managed WordPress** plan. The company can cancel it to save money, **but never cancel the domain**, and first check whether email is tied to that plan.
8. Optionally suggest to the CEO that they change the domain's contact email to the org account.

## Message sent / to send to HR

> Hi [Name],
>
> For the new website, I need a place to keep the code online. It's called GitHub (kind of like Google Drive, but for code). Could you help with this? It takes about 5 minutes:
>
> 1. Sign up on github.com using our company email ([org email])
> 2. Create a new **private** repository named `datasphere-website`
> 3. Go to Settings → Collaborators → Add people, and add me: **biradarvenkatesh01**
>
> This way the code stays in the company's account, even after my internship. If it's easier, I can guide you on a quick call while you do it.
>
> Thanks!

Also mention to HR at some point: the site will be hosted on Netlify (free), and the GoDaddy login is already sorted.

## Open items / next steps

- [ ] Send the GitHub message to HR and get added as a collaborator.
- [ ] Confirm the org Google email address to use.
- [ ] Set up the Next.js project in the repo.
- [ ] Plan the site structure: courses, fees, batches, contact/lead form → Zoho CRM, custom chatbot.
- [ ] Create a Netlify account with the org email (owner authorizes GitHub once).
- [ ] At launch, follow the DNS checklist above.
