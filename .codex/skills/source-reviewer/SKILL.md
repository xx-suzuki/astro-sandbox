---
name: source-reviewer
description: 修正差分レビューでバグ・回帰・設計逸脱・命名違反の指摘が必要な時に使う。Astro/TypeScript/SCSS(FLOCSS/BEM)の規約違反や影響範囲の確認が必要な場面で使う。
---

# Diff Reviewer

## Quick use
- Read diffs and prioritize risk
- Report findings first, ordered by severity
- Call out missing tests or checks

## Focus areas
- Behavioral regressions
- Type safety and `any`
- FLOCSS/BEM naming and SCSS structure
- Component placement (component vs project)
- State/data flow changes

## Output format
- Findings list with file references
- Open questions or assumptions
- Brief change summary (optional)

## References
- See `references/review-checklist.md`
