---
title: "Biclever Agent: security and IT review"
nav_title: Security and IT review
description: What Biclever Agent can and cannot access, where credentials live, and what is logged. Written for the IT and security people reviewing a pilot.
lead: What the agent can and cannot access, where credentials live, and what is logged. Written for the IT and security people reviewing a pilot.
date: 2026-10-27T00:00:00+10:00
updated: 2026-10-27
weight: 10
section: agent
---

## Architecture

Each customer gets a private workspace. A mail desk with fixed rules and no AI talks to your team. The agent works sealed off from the outside, and a gatekeeper holds the passwords to your BusinessObjects system.

![Biclever Agent works in your private workspace: a no-AI mail desk talks only to your team, the agent is sealed off, and a gatekeeper holds the passwords to your BusinessObjects system](/images/pages/biclever-agent-overview.svg)
{:.full .figure-plain}

## Credentials

- **The AI never sees your passwords.** Credentials are held by a separate gatekeeper component that logs in on the agent's behalf.
- **Each task gets its own fresh session.**

## Access and the service account

The agent uses a dedicated service account with exactly the rights you choose. We recommend starting on development or test environments.

| Environment | Recommended for the pilot |
| --- | --- |
| Development / Test | Yes: the folders and universes in scope |
| Production | [To agree with each customer] |

## Who can use the agent

You decide who may write to the agent. Mail from anyone else, or from a sender address that can't be verified, is ignored. Adding or removing a user later takes one email to us.

## Protecting original reports

By default, the agent works on a copy. If you explicitly request a change to the original, it makes a backup first.

## Data handling and hosting

Each customer has a dedicated agent with its own mailbox, memory and system access, running in an isolated workspace.

> [Where the agent runs, where data is stored, which AI model provider is used and under what data terms, and the retention period: to confirm.]

## Logging and traceability

Every system call is logged and every task is recorded in the agent's journal, so past work can be found, reviewed and repeated.

## Limits

AI can make mistakes. Important changes and results may require human review before they can be relied upon in production.

---

Questions from your IT team? Write to [dmytro@biclever.com](mailto:dmytro@biclever.com), or [apply for a pilot](/pilot/).
