# Fast flow for commit message drafting

## Commands
- `git status -sb`
- `git diff --staged`
- `git diff`

## Rules
- Use staged diff if available; otherwise use working tree diff
- If diff is large, skim for file paths and change intent first
- Prefer a single scope when possible; if multiple, pick the most user-facing
