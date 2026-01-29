---
name: conventional-commit-writer
description: 変更内容から英語の Conventional Commits メッセージを短く提案する必要がある時に使う。type/scope/bodyの選択が必要な場面で使う。
---

# Conventional Commit Writer

## 目的
- Git の差分内容に基づいて、英語の Conventional Commits を短く提案する
- 速度優先で最小限の取得と判断で進める

## Quick use
- まず `git status -sb` を取得する
- ステージ済み差分を優先し、未ステージなら作業ツリー差分を使う
- type と scope を差分から即決する
- subject は短く命令形で書く
- body は必要なときだけ追加する

## 手順（高速）
1. `git status -sb` で対象範囲を確認
2. `git diff --staged` を取得（何もなければ `git diff`）
3. 差分から type/scope を決めて 1〜3 案を出す
4. scope が曖昧なら、理由を 1 行だけ添える

## Output format
- 1 to 3 candidate messages
- Mention scope choice when ambiguous

## References
- See `references/commit-types.md`
- See `references/fast-flow.md`
