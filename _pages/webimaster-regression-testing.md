---
title: "Webi Master — Regression Testing"
date: 2026-05-23T00:00:00+10:00
weight: 20
wide: true
---

Verify that Web Intelligence documents still refresh — and still produce the same data — after a universe change, a connection swap, a query rewrite, or a server upgrade. Webi Master's **Regression Testing** tool drives a set of documents through a known prompt configuration and compares the produced data block-by-block (or report-by-report) against a captured baseline.

## Two workflows

The tool supports two distinct uses, depending on what you want to verify:

### "Does it still run?" — *Run with prompts* only

Use **Run with prompts** when you want to catch *technical* regressions without comparing data: missing universe objects after a rewrite, a broken connection, a database change that breaks the generated SQL, an upgrade that introduces a refresh-time error. Each document is refreshed with the configured prompts; the log shows OK or FAIL per document, with elapsed time and BIP's error message when refresh fails.

This is fast (no exports written), works against any database — even live, constantly-changing data — because you're not comparing numbers, only checking that the refresh completes.

### "Does it still produce the same numbers?" — *Capture baseline* → *Diff against baseline*

Use the capture/diff pair when you want to verify the *data* itself didn't change: cell-for-cell, the report should produce the same numbers before and after the change. Capture a baseline, make your change (universe rewrite, SDK upgrade, query refactor), then run Diff and inspect anything that flags `DIFF`.

This only makes sense when the **database is stable** — e.g. a frozen test instance, or a production DB during a maintenance window when nothing else is updating it. On a live DB the numbers will drift naturally between Capture and Diff, drowning the real regressions in noise. Typical use cases: a complex universe migration where you need to prove the new universe calculates the same values, or a connection-driver upgrade where you want to confirm rounding / type handling stays identical.

## What you set up

| Input | What it is |
|---|---|
| **Prompts file** | An Excel (`.xlsx`) or CSV (`.csv`) file mapping prompt names to the values you want answered for each run. Defaults to `prompts.xlsx` in the workspace. The same file drives every action below. |
| **Baseline folder** | Where the `.ok` baselines (and their `.current` re-runs) live, organized per document. Required for Capture and Diff. Defaults to `baseline` in the workspace. |
| **Per element** (checkbox, optional) | When unchecked (the default), a whole report is captured as one CSV — section-safe, works on any layout. When checked, each data-block element (VTable / HTable / XTable) is captured as a separate CSV — finer-grained diffs but breaks on reports with sections. |

## Workflow

The tool exposes four actions. They share the same Prompts file and Baseline folder; you typically run them in this order:

### 1. Export prompts

Writes one row per prompt (per selected document) to the prompts file. Columns:

```
Document | Prompt | Optional | Answer type | Constrained | Cardinality | Values
```

The `Values` column is intentionally formatted as text so dates like `2026-04-14` you type later aren't auto-converted by Excel into date serials.

### 2. Edit the prompts file

Fill in the `Values` column for each prompt that needs an answer:

- **Single value**: just type the value (`2026-04-14`, `EMEA`, `Yes`).
- **Multiple values**: separate with `;` (`EMEA;APAC;Americas`).
- **Wildcard document**: put the literal single character `*` in the `Document` column to make a prompt apply to every selected document (e.g. a common date range). Glob patterns are not supported — anything other than `*` containing `*` is rejected.
- **Optional prompts you want to skip**: leave the `Values` cell blank. The prompt is sent to BIP with an empty answer (filter not applied) instead of being omitted, which is what BIP requires even for optional prompts.

Per-document answers win over generic `*` answers when both exist for the same prompt name.

#### Date and Date-Time formats

Webi date prompts expect ISO format — type the value literally in the `Values` cell:

| Prompt type | Format | Example |
|---|---|---|
| `Date` | `YYYY-MM-DD` | `2026-04-14` |
| `DateTime` | ISO 8601 with timezone | `2026-04-14T14:57:28.000-07:00` |

Excel normally auto-converts a typed `2026-04-14` into a date serial number — which BIP rejects. The `Values` column in a freshly exported `prompts.xlsx` is formatted as text to prevent that, so what you type stays what you typed. If you're editing an older prompts file where the column isn't text, either re-export to get the text-formatted column, or switch to a `.csv` prompts file (CSV has no auto-formatting).

#### Resolution order at refresh time

For each prompt the document declares:

1. If the prompts file has a per-document row for this prompt, use those values.
2. Else if it has a generic `*` row for this prompt, use those values.
3. Else, for an optional prompt, send an empty answer (no filter applied).
4. Else, the run fails — BIP returns "Answer required" and the document is skipped.

### 3. Run with prompts

Refreshes each selected document with the matching prompt values. Per-document OK/FAIL with elapsed time goes to the log. No baseline is written. Use this to confirm the prompts file is complete before capturing a baseline.

### 4. Capture baseline

Refreshes every selected document and writes the result to disk:

- **Whole-report mode (default)**: one `.ok` file per report. Path: `<baseline>/<doc>/<report>.ok.csv`.
- **Per-element mode (`Per element` checked)**: one `.ok` file per data block. Path: `<baseline>/<doc>/<report>__<block name>__<elementId>.ok.csv`.

Existing `.ok` files are overwritten.

### 5. Diff against baseline

Refreshes each document, exports to a `.current` sibling of its `.ok`, and compares byte-for-byte. Per-file status appears in the log:

| Status | Meaning |
|---|---|
| `OK` | `.current` matches `.ok` exactly. |
| `DIFF` | Bytes differ. Both files stay on disk so you can compare them in your preferred text-diff tool. |
| `MISSING_BASELINE` | The report/block exists now but no `.ok` was captured. Run *Capture baseline* first. |
| `ERROR` | The refresh or export raised. The log includes BIP's error message when available. |

## Notes and caveats

- All output is **log-only** — there is no Excel result file. The artifacts you keep are the `.ok` and `.current` files in the baseline folder.
- The `Open` button next to the Prompts file field opens it in Excel for editing. The `Open` button next to the Baseline folder opens the folder in the file manager.
- The refresh uses webimaster's own BIP REST timeout (10 minutes) — long-running reports complete, but truly stuck refreshes are still capped.
- Per-element mode fails on reports with **sections** (the CSV export of an element isn't section-aware). Use whole-report mode for those.
- The `Values` column in `prompts.xlsx` is formatted as text only in **freshly exported** files. Re-run *Export prompts* on an old file to get the text-formatted column back.
