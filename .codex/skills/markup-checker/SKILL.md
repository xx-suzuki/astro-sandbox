---
name: markup-checker
description: 最低限のアクセシビリティ（ラベル、フォーカス、aria、見出し構造、キーボード操作）のチェックが必要な時に使う。フォームや対話UIの修正時にも使う。
---

# A11y Checker Lite

## Quick use
- Run `npm run audit` to generate `./report-w3c.txt`
- Review `./dist/**/*.html` results in the report (line numbers are for generated HTML)
- Map issues back to Astro sources by searching for stable snippets/classes
- Fix Astro files first, then re-run `npm run audit` for confirmation

## Workflow (this project)
- Use dist HTML for validation (W3C + markuplint) because Astro parsing can raise false syntax errors
- Read `report-w3c.txt` and list issues per HTML file with line numbers
- For each issue, locate source Astro:
  - Open the dist HTML around the line and copy a short snippet
  - Use `rg -n "snippet"` in `src/` to find the Astro component/page
  - Prefer matching by class names, aria attributes, or text content
  - If snippet only appears in build output, trace from `src/pages` to referenced components
- Report findings with Astro file paths when found; otherwise include dist path with a note

## Output format
- Findings list with file references (Astro preferred)
- Fixes applied (what changed + where)
- Remaining issues (if any)
- If source not found: include dist file + line and explain how to locate

## Execution policy
- Do not stop after analysis; continue to apply fixes to Astro files
- If multiple valid fixes exist, choose the simplest one that preserves behavior
- Only ask for confirmation when the change is ambiguous or risky
- After fixes, re-run `npm run audit` and report the new results

## References
- See `references/rules.md`
