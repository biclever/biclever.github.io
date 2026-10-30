---
title: "Biclever Agent: security and IT review"
nav_title: Security and IT review
description: What Biclever Agent can and cannot access, where credentials live, and what is logged. Written for the IT and security people reviewing a pilot.
lead: What the agent can and cannot access, where credentials live, and what is logged. Written for the IT and security people reviewing a pilot.
date: 2026-10-27T00:00:00+10:00
updated: 2026-10-30
weight: 10
section: agent
---

## Architecture

Each customer gets a private workspace. A mail desk with fixed rules and no AI talks to your team. The agent works sealed off from the outside, and a gatekeeper holds the passwords to your BusinessObjects system.

![Biclever Agent works in your private workspace: a no-AI mail desk talks only to your team, the agent is sealed off, and a gatekeeper holds the passwords to your BusinessObjects system](/images/pages/biclever-agent-overview.svg)
{:.full .figure-plain}

## Credentials

- **The AI never sees your passwords.** With the Biclever Gateway, the credentials stay in your network. With a direct connection, they are held by a separate gatekeeper component that logs in on the agent's behalf.
- **Each task gets its own fresh session.**

## How the agent connects to your system

There are two ways, depending on how your BusinessObjects system is reachable.

- **Biclever Gateway** (recommended). A small service you install on a server in your own network. It holds the BusinessObjects credentials, works with Web Intelligence through the BusinessObjects REST API and with universes through the Semantic Layer SDK, and writes every request to an audit log. The gateway sets up an encrypted channel to the agent, so the credentials and the connection stay on your side.
- **Direct connection.** If your BusinessObjects system is reachable from the internet, the agent can connect to it directly with the service account.

Supported versions: BI 4.3 SP3 and later, including BI 2025.

## Access and the service account

The agent uses a dedicated service account with the rights you choose. Its access is restricted to one folder, so it can't change reports outside it.

| Environment | In a pilot |
| --- | --- |
| Test | Yes, restricted to one folder |
| Production | Yes, if you prefer, restricted to one folder |

Finance teams often want the agent on production, where their reports are. The folder restriction and working on copies apply either way.

## Who can use the agent

You decide who may write to the agent. Mail from anyone else, or from a sender address that can't be verified, is ignored. Adding or removing a user later takes one email to us.

## Protecting original reports

By default, the agent works on a copy. If you explicitly request a change to the original, it makes a backup first.

## Data handling and hosting

Each customer has a dedicated agent with its own mailbox, memory and system access, running in an isolated workspace.

- **Where it runs.** The agent runs on a dedicated server in Norway.
- **AI processing.** Requests are processed by Anthropic's Claude API, under Anthropic's commercial terms. Anthropic doesn't use API data to train its models.
- **Email.** The agent's mailbox is on Google Workspace, which doesn't use customer data to train models.
- **Retention.** Email threads and work files are deleted 90 days after the last message in a thread. The agent's memory (its notes about your system and its task journal) is kept while you're a customer and deleted within 30 days after the contract ends. You can ask us to delete everything at any time.
- **Self-hosted.** On request, the agent can run as a container in your own environment.

### Who handles data for us

| Provider | What for |
| --- | --- |
| Anthropic | AI processing (Claude API) |
| Google | Email (Google Workspace) |
| Stripe | Payments and invoices |
| Netlify | This website and its forms |

A data processing agreement (DPA) is available on request.

## Logging and traceability

Every system call is logged and every task is recorded in the agent's journal, so past work can be found, reviewed and repeated.

## Limits

AI can make mistakes. Important changes and results may require human review before they can be relied upon in production.

The agent handles everyday BusinessObjects work well, but some reports are very complex, and we can't guarantee it handles them efficiently. When it can't finish a task, it explains what's missing and keeps a note. With your permission, we review those notes to keep improving it.

---

Questions from your IT team? Write to [dmytro@biclever.com](mailto:dmytro@biclever.com), or [apply for a pilot](/pilot/).
