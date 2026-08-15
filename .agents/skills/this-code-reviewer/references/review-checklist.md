# レビュー観点チェックリスト

## 共通

- `project.config.ts` にある設定値（パス・ブレークポイント・出力先）をハードコードしていないか
- パスをエイリアス（`@/*` `@scripts-node/*` `@root/*`）で書いているか
- 生成物（`.tmp/` `dist/` `src/styles/setting/variable/_breakpoint.scss` `_path.scss` `_svg.scss` `src/types/svg-sprite.ts`）を直接編集していないか
- 出力ファイル名にハッシュを付ける変更になっていないか（差分納品の前提が崩れる）
- 自明な説明コメントを増やしていないか。WHY が非自明な箇所にコメントがあるか

## TypeScript

- `astro/tsconfigs/strictest` 前提で型を緩めていないか（不要な `any` / 非 null アサーション）
- 環境判定に `Env`（`src/constants/env.ts`）を使っているか。`import.meta.env` を各所へ散らしていないか
- 状態クラスを `StateClasses` 経由で扱っているか。文字列リテラルの直書きがないか
- DOM を扱うクラスが `src/abstracts/module.ts` の `Module` を継承しているか
- helper の配置が正しいか（ビルド時に使うものは `src/helper/node/`）
- 命名規則に沿っているか（関数・変数は camelCase、定数オブジェクトは PascalCase + `as const`）

## Astro

- `interface Props` を定義し、`Astro.props` から分割代入して既定値を与えているか
- クラス付与に `class:list` を使い、`addClass` / `modifier` を受け取れる形になっているか
- 汎用コンポーネントを `src/components/component/`、固有コンポーネントを `src/components/projects/` に置いているか
- markuplint / jsx-a11y に抵触するマークアップになっていないか（`pnpm mul` で確認）
- `src/layouts/Layout.astro` は ESLint 対象外のため、変更時は手動で確認したか

## SCSS

- FLOCSS のレイヤーとプレフィックス（なし / `l-` / `c-` / `p-` / `u-`）が一致しているか
- BEM（`block__element--modifier`）に沿い、要素セレクタのネストで組んでいないか
- 新規ファイルを同階層の `_index.scss` へ `@use` 追加しているか
- 数値を `func.cv-rem()` などの `tool/function` 経由で書いているか
- ファイル冒頭の `@use` の並びが既存ファイルと揃っているか

## scripts/node

- モード解決を `core/context.ts`、監視を `core/watch.ts`、引数解析を `helper/cli-args.ts` に寄せているか（個別実装の重複がないか）
- 実処理を `runXxx()` として named export し、テストから直接呼べる形になっているか
- watch 実行時の多重実行・例外時の `process.exitCode` の扱いが既存タスクと揃っているか
- 対応する `scripts/node/__test__/<layer>/<name>.test.ts` があるか

## テスト

- 配置が対象のディレクトリ構成をミラーしているか
- 外部ライブラリのみ `vi.mock` し、プロジェクト内コードを実実行しているか
- モック定義後に `await import(...)` で対象を読み込む既存パターンに沿っているか
- 分岐の多い helper に境界値・異常系があるか
