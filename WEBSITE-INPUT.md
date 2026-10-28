# Website input needed

What I need from you to finish and strengthen the text on biclever.com. Answer inline under each item (or just by ID, e.g. "A3: yes, EU only"). Items are grouped by page; the most important ones for launch are marked **[launch]**.

Sources used: the current site (`redesign` branch), `D:\dev\biclever` (tools) and `D:\dev\biclever-agent` (the agent). Where the sources already suggest an answer, it's written as "Sources say…" for you to confirm or correct.

---

## A. Facts the site already promises (placeholders to fill)

These are `[bracketed]` on the site now. Search the repo for `[` to find each one.

- **A1 [launch] Where the agent runs.** Today, on your own machine; later, a container per customer, and a cloud deployment is planned. What should the site say for a pilot customer starting now: your hosted service, the EU, a named country? Used on How it works (FAQ "Where does my data go?") and the security article.
- **A2 [launch] Which AI provider and on what data terms.** Sources say the agent runs on Claude through Anthropic's API, on a paid API account. Can the site name Anthropic? Should it state that API data isn't used for model training, and how long the provider keeps it? (Check the current Anthropic commercial terms before we quote them.)
- **A3 [launch] What customer data is stored, where and for how long.** The agent keeps a memory (notes about the system, a journal of tasks), email threads and work files. How long are they kept after a task, and after a customer leaves? Can a customer ask for deletion?
- **A4 [launch] Email provider.** The agent's mailbox is on Google Workspace. Should the security article say so (customers' IT will ask which mail system handles their requests)?
- **A5 [launch] Supported BusinessObjects versions.** Sources mention BI 4.2 and BI 4.3 (SP2 to SP4). Which can we promise? BI 2025 (the newest SAP release)?
- **A6 [launch] How the agent reaches the customer's system.** This is missing from the site entirely, and it's the first question an IT department will ask. Options I see in the sources: a VPN or network opening to your service, or the outbound-only gateway service installed on a customer server (in design). What do we offer pilots today? Is the gateway something to announce as "coming"?
- **A7 Pilot reply time.** "We reply within … working days" on `/pilot/`.
- **A8 Invoicing and purchase orders** for the Agent (Pricing FAQ). Invoice in EUR/NOK? Payment terms? PO accepted?
- **A9 Do unused credits expire?** Monthly, yearly, never? Do they roll over?
- **A10 Production access in a pilot.** Test environment only, or production allowed with read-only rights?
- **A11 [launch] Founder section.** A photo, years working with BusinessObjects, typical projects and customers, and a sentence on why you built the agent. Used on Home and About.
- **A12 Tool downloads.** The Home page says "built on tools [N] BusinessObjects professionals already use". A number (downloads, active licenses or companies) or a different claim?

## B. Claims to confirm (the site says it; is it true today?)

Please confirm or correct each. If something is "planned", I'll either remove it or label it "coming".

- **B1 Price.** €500 a month plus €1 per credit. The project notes say the pricing model was still open. Are these the numbers to publish?
- **B2 Task credit prices.** Explain a report 4 credits, fix issues and add KPIs 25, build from a template 42. Are these based on real runs? Can a task cost more than its listed price, and what happens then (does it ask first)?
- **B3 Pilot terms.** 5 places, 1 month, 200 credits, no automatic billing. Correct?
- **B4 "Replies often arrive within 5 to 20 minutes."** Still true? Tasks run one at a time per customer, so what should the site say about a queue?
- **B5 "Apply changes across reports"** ("Now do the same in the other regional reports"). Has the agent done this?
- **B6 "Check reports still run after an upgrade."** Is this an agent task today, or a WebiMaster feature? If it's WebiMaster, we can link to it instead.
- **B7 Charts.** The site says it builds reports with "queries, variables, tables, prompts, filters, formatting". It doesn't mention charts, and the toolbox has no chart tool yet. Should we say "charts coming" or stay silent?
- **B8 Universes.** The pilot form asks UNV/UNX. Today the agent edits Webi documents and reads universes; universe editing is being prototyped. Is it OK to say "reports today, universe changes coming"?
- **B9 Users.** "Adding or removing a user takes one email to us." Is there a limit on users per agent? Is the €500 per agent regardless of number of users?
- **B10 Demo video.** Is the YouTube demo current, and does it match the new name and flow?
- **B11 The demo email thread** (`/pages/biclever-agent-demo-transcript/`). Real run or edited? Is the customer data in it fictional/demo?

## C. Text I need you to describe

Short notes are enough. I'll turn them into site copy.

- **C1 A real example from the first users.** One or two requests the agent handled for someone other than you: the request, the result, the time saved. Even anonymous ("a Norwegian consultancy's finance team") makes the Home page much stronger than invented examples.
- **C2 Who is the buyer?** The BI team lead, the finance controller, or the IT manager? The persona pages ("For BI teams", "For finance") are on hold until this is clear.
- **C3 Maconomy.** Your deepest expertise is BusinessObjects on Deltek Maconomy, and the agent already knows the Maconomy BPM universes and data. The site doesn't mention Maconomy at all. How many of your target customers run Maconomy? Should there be a "Biclever Agent for Maconomy reporting" page?
- **C4 What the agent should not be used for.** A short "not a good fit" list builds trust (e.g. large bulk migrations better done with WebiMaster, or production changes without review).
- **C5 Languages.** Can users write to the agent in Norwegian, Swedish, Danish, German? If yes, that's worth stating for Nordic customers.
- **C6 Support and escalation.** If the agent gets stuck, does a human (you) step in? Within what time? This answers "what if the AI can't do it?".
- **C7 Your consulting.** Do you still take consulting work? Should the site offer "have it done by us" for larger jobs (the Tools page says "Rather have it done for you?")?

## D. Tools area

- **D1 PRO price.** €25 per user per month, billed yearly (€300). Still correct?
- **D2 30-day PRO trial license.** Offer it publicly ("Request a 30-day license") or only on request? (Open since the structural review.)
- **D3 Unpublished tools.** BO SQL Connector and KeyMetrika are hidden. Retire them for good, or bring them back?
- **D4 Tools not on the site.** The tools repo has **Maconomy MCP** (free, read/write Maconomy through its REST API), a knowledge-base MCP server and a read-only database query MCP server. Should any of them get a page? Maconomy MCP looks like the strongest candidate, and it ties in with C3.
- **D5 Biclever MCP.** Anything new since the page was written (supported clients, PRO features)?
- **D6 Docs.** Now that the Docs index is only in the footer, which product page should link to which article? I can add "Related docs" links on each tool page if you confirm the mapping.

## E. Legal and housekeeping

- **E1 [launch] Privacy policy.** The pilot and contact forms collect names and work emails, and the site uses Google Analytics. A privacy page is needed (GDPR). Do you have one, or should I draft a short one for you to review?
- **E2 [launch] Cookie consent.** Google Analytics in Norway/EU generally needs consent. Options: a consent banner, a cookieless analytics tool (e.g. Plausible, or Netlify Analytics), or no analytics. Which do you prefer?
- **E3 Terms for the Agent.** Is there a service agreement or terms of service to link from Pricing? A data processing agreement (DPA) to offer on request? Enterprise buyers will ask for a DPA.
- **E4 Email addresses.** The site uses `pilot@biclever.com` and `dmytro@biclever.com`. Do both exist and go to you?
- **E5 Security one-pager (PDF).** The security article could offer a downloadable PDF for IT reviews. Want one?

## F. Suggestions: things that would make the offer stronger

Not questions for the site text, but ideas from the sources that would improve the position. Tell me which ones you'd like mentioned (as available or "coming"), and which to leave out.

- **F1 Microsoft Teams (and Slack) as a channel.** The design notes already plan for it. Many BusinessObjects and Maconomy customers use Teams; "email or Teams" would remove the "email feels slow" objection. Even "Teams coming" on the site would help.
- **F2 Self-hosted option.** Run the agent in the customer's own cloud with their own AI account, so their data never leaves their side. It's noted in the plan for enterprise customers. Even a line saying "available for enterprise customers on request" answers the biggest security objection.
- **F3 Universe (UNX) editing.** It's being prototyped. "Change a universe and check which reports it affects" would be a strong, unique message, because nobody else does impact-aware universe edits.
- **F4 Report checks before upgrades and migrations.** Combine the agent with WebiMaster regression testing and Impact Analysis: "check every report after your BI 4.3 / BI 2025 upgrade". Upgrades are a recurring, budgeted project, which makes this an easy sale.
- **F5 A knowledge-only agent.** The notes describe a read-only agent that answers questions from documentation (e.g. "what does this Maconomy field mean?") without touching systems. It's a lower-risk first step for cautious customers.
- **F6 Monthly report on usage.** Show what the agent did, credits used, hours saved. It helps customers justify the cost internally.
- **F7 Customer proof.** Even one named reference customer or a short quote changes the Home page more than any other edit.
- **F8 Proactive changes awareness.** A note in the agent ideas: regularly extract report and universe definitions so the agent knows what changed recently. On the site: "knows your system, and keeps up with changes".
