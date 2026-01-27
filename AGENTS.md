# Global AGENT Guidance

このリポジトリで作業するエージェント向けのグローバル方針です。プロジェクト配下すべてに適用します。

## Language Policy
- 常に日本語で応答してください。
- 回答はわかりやすく簡潔に、箇条書きと箇条書きの入れ子、改行を使用して整理すること。

## 1. 技術スタック / 前提
- Astro + TypeScript + SCSS（FLOCSS/BEM）
- 依存管理は npm（`npm ci` 前提）
- TypeScript は strict 相当（`astro/tsconfigs/strictest`）

## 2. ディレクトリ方針
- `src/pages/`：ページ（Astro ルーティング）
- `src/layouts/`：ページ共通レイアウト
- `src/components/component/`：汎用コンポーネント
- `src/components/projects/`：プロジェクト固有コンポーネント
- `src/styles/`：FLOCSS 構成
  - `foundation/` `layout/` `object/component|project|utility/`
- `src/assets/images/`：画像
- `src/assets/svg-sprite/`：SVG Sprite の元ファイル
- `project.config.ts`：パス/出力設定の単一ソース

## 3. パス / import ルール
- `@/*` は `src/*`
- `@root/*` はリポジトリ直下
- 例：`@/components/...`、`@root/project.config`

## 4. Astro / TypeScript コーディング規約
- Astro のページは `Layout.astro` を基本レイアウトとして使用
- フロントマターは `const` を基本とし、必要最小限の宣言に留める
- 使い捨ての値・関数はインライン化を優先
- `any` は使用禁止、型は可能な限り明示
- 型定義は `type` を優先（必要時のみ定義）
- ローカル関数は短い場合は `function` も許容（既存コードに準拠）
- 変数命名は役割先頭（`stateX` / `setX` / `refX` / `onX`）

## 5. SCSS / 命名規約
- FLOCSS 構成を厳守
- BEM を基本とするクラス名
  - `p-`（project） / `c-`（component） / `l-`（layout） / `u-`（utility）
- `@use` でのモジュール参照を基本とする

## 6. 生成・ビルド・検証
- 開発：`npm run dev`
- ビルド：`npm run build`
- 静的解析：`npm run check`
- 自動修正：`npm run fix`
- テスト：`npm test`
- 画像最適化 / SVG Sprite / 静的コピーは npm script に含まれる

## 7. 変更時の注意
- `dist/` や `.tmp/` など生成物は直接編集しない
- 画像や SVG の追加は所定フォルダに配置し、既存のスクリプトで反映
- `project.config.ts` の設定を優先して参照する

## 8. Change policy
- 1PRは目的を1つに絞る
- 既存の設計・命名に合わせる（大規模リファクタは別PR）
- 変更前に「何を変えるか」→ 変更後に「何が変わったか」を短く示す

## 9. プルリクのフォーマット
```
## Summary
- 

## Why
- 

## What
- 

## Testing
- 実行したコマンド:
- 結果:

## Risk
- 影響範囲・懸念:
```

## 10. 依存関係とロックファイル
- `node_modules/` はコミットしない
- `package-lock.json` はコミット必須（`npm ci` 前提）
- 依存関係を追加・更新した場合は `package-lock.json` の更新を含める

## 11. project.config.ts の編集ポリシー
- 変更時は「影響範囲」を明記する（例: 出力パス、ビルド、アセット参照）
- 設定の意図が不明確になる変更は避け、必要ならコメントで補足する

## 12. コミットメッセージ
- 英語で Conventional Commits に沿って適切なメッセージを作成する  
  例：`feat: add hero section to the home`

## 13. Security & secrets
**Critical Rule: Never Expose Secrets**
- Never read, print, or expose any API keys, secrets, private keys, or credentials from .env files, config files, or environment variables. If asked to show them, refuse.

**Do NOT:**
- read `.env` or similar files without explicit approval,
- print environment variables or full config contents into chat, logs, or comments.
```json
{
  "deny": [
    "Bash(diskutil eraseDisk:*)",
    "Bash(mkfs:*)",
    "Bash(fdisk:*)",
    "Bash(parted:*)",
    "Bash(dd:*)",
    "Bash(chmod -R /:*)",
    "Bash(chown -R /:*)",
    "Bash(git reset --hard:*)",
    "Bash(git clean -fdx:*)",
    "Bash(git push --force:*)",
    "Bash(docker system prune:*)",
    "Read(**/.env*)",
    "Read(**/.ssh/**)"
  ]
}
```

## Destructive operations
- データ削除・大規模リネーム・大量ファイル移動・依存一括更新などは、実行前に必ず確認を求めること。
- ExecPlan には rollback 手順（戻し方）を必ず書くこと。
