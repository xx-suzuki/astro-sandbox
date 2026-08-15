# コミット書式リファレンス

## 基本形式

```
<type>(<scope>): <subject>
```

- `subject` は英語・小文字始まり・命令形。末尾にピリオドを付けない。
- `scope` は省略可。1 コミットが複数レイヤーにまたがる場合は主題となるレイヤーのみ書く。
- 破壊的変更がある場合は `<type>(<scope>)!: <subject>` とし、本文に影響範囲を書く。

## type 一覧

| type | 用途 |
|---|---|
| `feat` | 機能追加 |
| `fix` | 不具合修正 |
| `refactor` | 挙動を変えない内部構造の変更 |
| `perf` | パフォーマンス改善 |
| `style` | 見た目・整形のみの変更（ロジック変更なし） |
| `docs` | ドキュメント |
| `test` | テストのみの追加・修正 |
| `build` | ビルド・タスク処理の変更 |
| `chore` | 依存更新・設定・雑務 |
| `revert` | revert |

## scope 一覧

| scope | 対象 |
|---|---|
| `astro` | `src/pages` `src/layouts` `src/components` |
| `styles` | `src/styles` |
| `ts` | `src/abstracts` `src/constants` `src/foundation` `src/features` `src/helper` `src/main.ts` |
| `assets` | `src/assets` `static` |
| `scripts` | `scripts/node` |
| `plop` | `plopfile.ts` `plop/` |
| `config` | ルート設定ファイル（`astro.config.ts` `vite.config.ts` `eslint.config.ts` `project.config.ts` など） |
| `deps` | `package.json` `pnpm-lock.yaml` `pnpm-workspace.yaml` |
| `agents` | `AGENTS.md` `.agents/skills` |
| `readme` | `README.md` |

## 判断ルール

- 実装とそのテストは同一コミットにまとめ、scope は実装側（例: `scripts`）を書く。
- 依存追加・更新はロックファイルを同一コミットに含め、`chore(deps)` とする。
- `.agents/skills` の変更は `agents` scope として分離する。
- 生成物（`dist/` `.tmp/` `report-w3c.txt` `stats.html` `coverage/`）はコミット対象に含めない。

## 現行書式のコミット例

| ハッシュ | メッセージ |
|---|---|
| `7a91a4c` | `refactor(scripts): migrate npm node tasks from cli to scripts/node and add core/watch architecture` |
| `35f7fd5` | `feat(cli): restructure task runner with commander and chokidarx` |
| `90ad430` | `chore(deps): update project dependencies and lockfile` |
| `15c15b3` | `docs(readme): refine AGENTS text` |

`a91cfe8` 以前は `feature:` `modify:` `chore:` などの旧書式が混在する。新規コミットでは使わない。
