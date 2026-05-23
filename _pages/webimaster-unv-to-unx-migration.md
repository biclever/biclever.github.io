---
title: "Webi Master — UNV to UNX migration"
date: 2026-05-23T00:00:00+10:00
weight: 21
wide: true
---

`.unv` universes are SAP's legacy universe format. They are deprecated and no longer receive new features; modern Web Intelligence builds on the `.unx` semantic-layer format. Sooner or later every BO estate has to move its reports off `.unv` and onto `.unx`.

Doing this by hand — opening every Webi document in Information Design Tool or the Web Intelligence client, switching its data source, remapping any objects whose paths shifted — does not scale. Even a modest estate can have hundreds of reports.

Webi Master's **Change Unv Data Source** tool does this in bulk. You convert your universes once in IDT, run the tool against every selected document, and it rebuilds the mapping (UNV universe → UNX universe in the same folder) and updates every query in a single click. Documents whose mapping is unambiguous flip cleanly; documents that need attention are flagged in the log so you can fix them by hand.

The tool is unforgiving about a few preconditions, though, so the process below matters. Skipping it is the difference between a clean one-click migration and a thicket of failed documents.

## How the tool decides what to do

The tool walks every selected document, looks at each data provider, and:

1. Skips anything that isn't a `.unv` data source (already on `.unx`? leave it alone).
2. Looks for a `.unx` universe with the same name in the same folder as the `.unv` data source. That pair becomes the source → target mapping.
3. Walks each query in the data provider and re-binds every object reference from the UNV object to the UNX object **by full path** (folder + name + kind).
4. If a custom-SQL query is found, the data provider is skipped — custom SQL is preserved and never silently rewritten.
5. If any object reference is ambiguous (multiple matches) or missing (no match at all), the whole document is marked failed and left untouched.

The mapping strategy is "same path, same name". It works when the IDT conversion keeps the folder structure intact (the next section).

## Suggested workflow

Follow these four steps in order. Each one sets up the conditions the next one depends on.

### 1. Convert universes in Information Design Tool

For every `.unv` universe in scope, use IDT's standard "Convert UNV" action to produce a `.unx` next to it. **Don't rename it** and **don't move it to a different folder**. The tool maps by `<folder>/<name>` — if `Sales/Customers.unv` becomes `Sales/Customers (new).unx` or moves to `Sales/UNX/Customers.unx`, the auto-mapping won't find it and you'll have to map manually.

Also: convert all of them before running Webi Master, not one at a time. Documents that use multiple universes need all of their universes to have a UNX twin available; otherwise the document fails the all-or-nothing check.

### 2. Test run

In Webi Master, select the documents you want to migrate and run **Change Unv Data Source** with the **Test mode** checkbox enabled (the default). Test mode goes through the entire mapping process but doesn't write anything back to the CMS — you get the full log of what *would* happen.

Two other checkboxes are available:

- **Ignore types**: when enabled, the tool re-binds an object even when its data type changed (e.g. Numeric → String). Use with care — accepting a type change can silently break filters and formulas downstream. Leave off unless you've audited which objects you're flipping.
- **Ignore qualification**: similar, for the object's qualification (Dimension / Measure / Attribute). Same caveat.

### 3. Review the log

The log shows per-document status. The cases to look at:

- **OK** — the document mapped cleanly. Nothing to do.
- **Custom SQL skipped** — one or more of the document's data providers contain hand-edited SQL. The tool didn't touch those. Decide whether to leave them as-is or rewrite the SQL by hand.
- **Object not found** / **Ambiguous object** — the path-based mapping couldn't resolve. Common causes: the UNX universe was renamed during IDT conversion, the object's path in the UNX is different (folder moved, object renamed), the object's qualification or data type changed and you don't have *Ignore types*/*qualification* on.
- **No UNX universe in folder** — the IDT conversion didn't produce a `.unx` next to the source `.unv`. Convert it (or move it).

For every failed document, fix the cause in IDT or the universe and re-run Test mode. Iterate until the log shows no failures you can't accept.

### 4. Apply the changes

Once Test mode is clean, **uncheck Test mode** and run the tool again. This time the document specifications are written back to the CMS — every successful mapping commits.

The tool processes documents one at a time in a single transaction each, so a failure mid-run doesn't corrupt anything. Documents that fail are left at their previous UNV state and can be retried after fixing the underlying cause.

## What happens to existing scheduled instances and saved data?

Nothing — the tool only updates the document's data-provider definition. Already-scheduled refreshes, saved data inside the documents, and historical instances are untouched. The next time a converted document refreshes, it pulls from the UNX universe.

## When this tool is not enough

A freshly converted UNX universe is a structural mirror of its UNV original — same folders, same object names, same kinds — just a different file extension. You don't need to change anything in the UNX for the tool to work.

The only case where auto-mapping breaks is when **the UNX has already been modified before the report migration ran**: objects renamed, folders restructured, kinds or types changed. The tool then can't resolve object references by path, and those documents fail.

The right sequence is **convert → migrate reports → refactor the universe**, in that order. If the UNX has already drifted from the UNV before reports were moved, you have two recovery options:

1. **Temporarily restore the UNX to look like the UNV** for the duration of the migration — run the tool, then re-apply your universe changes. Easier than fixing dozens of reports by hand.
2. **Run the tool against whichever documents still match.** Test mode tells you which ones map cleanly; the rest get manual attention.
