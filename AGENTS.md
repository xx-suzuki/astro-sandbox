# AGENTS.md

このリポジトリで作業するエージェント（Codex・Claude Code等）向けのグローバル方針です。プロジェクト配下すべてに適用します。

---

## Language Policy

- 常に日本語で応答してください。
- 回答はわかりやすく簡潔に、箇条書きと改行を使って整理すること。

---

## 1. 技術スタック / 前提

- 静的サイト用の開発環境。CMS へのアップロードや差分納品を想定し、**出力ファイル名をハッシュ化しない**構成を維持すること。
- フレームワーク: Astro 7（`output` は静的生成、`trailingSlash: 'always'`、`compressHTML: false`）
- ビルド: Vite 8 / Rolldown（`build:vite` は `BUILD_BY=vite` で JS バンドルを生成。`vite.config.ts` は `rolldownOptions` を使う）
- 言語: TypeScript 6 系（`astro/tsconfigs/strictest` 準拠）。TypeScript 7 は `astro check` が依存する programmatic API を未提供のため上げないこと。
- CSS: SCSS + FLOCSS + BEM（`destyle.css` ベース、PostCSS / autoprefixer / postcss-sort-media-queries）
- Node タスク: `scripts/node/**` の TypeScript を `tsx` で直接実行
- テスト: Vitest（`scripts` / `frontend` の 2 プロジェクト構成）
- 静的解析: ESLint（flat config）/ Stylelint / Prettier / markuplint / html-validate
- 雛形生成: Plop（`plopfile.ts`）
- Git フック: husky + lint-staged
- ランタイム: Node.js `^26` / pnpm `^11`（バージョンは `mise.toml` で固定）。`package.json` の `devEngines` で `onFail: "error"` 固定のため、**npm / yarn は使わない**。
- パッケージマネージャ設定は `pnpm-workspace.yaml`（`overrides` は npm 形式ではなく pnpm の `parent>child` 構文を使う）。

---

## 2. ディレクトリ方針

- `src/abstracts/` : 抽象クラス（`Module` 基底クラスなど）
- `src/assets/` : ビルドで加工する画像・SVG スプライト元データ（`svg-sprite/*.svg`）
- `src/components/component/` : 汎用 Astro コンポーネント（FLOCSS の `c-`）
- `src/components/projects/` : プロジェクト固有 Astro コンポーネント（FLOCSS の `p-`）
- `src/constants/` : 定数（`as const` のオブジェクト）
- `src/features/` : 機能単位のモジュール
- `src/foundation/` : サイト全体で動く基盤スクリプト（`main.ts` から import）
- `src/helper/` : 汎用ヘルパー。`src/helper/node/` はビルド時（Astro フロントマター等）で使うもの
- `src/layouts/` : ページ構造の Astro コンポーネント
- `src/pages/` : Astro のルーティング対象
- `src/styles/` : SCSS（`setting` / `tool` / `foundation` / `layout` / `object` の FLOCSS 構成）
- `src/types/` : 型定義
- `scripts/node/commands/` : npm scripts から実行するタスク本体
- `scripts/node/core/` : タスク共通基盤（`cli.ts` = CLI 起動、`context.ts` = モード解決、`watch.ts` = chokidar 監視）
- `scripts/node/helper/` : タスク用ヘルパー（`cli-args.ts` = 引数解析、`targets.ts` = 対象ファイル解決、`asset-cache.ts` = 生成物キャッシュ など）
- `scripts/node/__test__/` : `commands` / `core` / `helper` のディレクトリ構成をミラーしたテスト
- `static/` : そのままコピーする静的ファイル（`static/assets` → `.tmp/assets`、`static/root` → `.tmp`）
- `plop/` : Plop のテンプレート（`.hbs`）
- `.cache/` : 各種キャッシュの集約先（生成物。`clean` の対象外）。`images` = 画像生成とマニフェスト、`astro` / `vite-astro` / `vite` / `vitest` / `tsc` = 各ツール、`eslint` / `stylelint` / `prettier` = 静的解析
- `.tmp/` : Astro の `publicDir`（生成物。直接編集しない）
- `dist/` : ビルド出力（直接編集しない）
- `project.config.ts` : プロジェクト共通設定の単一の情報源
- `.agents/skills/` : このリポジトリのスキル

**パスエイリアス**（`tsconfig.json`）

| エイリアス | 対象 |
|---|---|
| `@/*` | `src/*` |
| `@scripts-node/*` | `scripts/node/*` |
| `@root/*` | リポジトリルート |

相対パスではなく上記エイリアスを使うこと（SCSS の `@use` は相対パスのままでよい）。

**生成物のため直接編集しないファイル**（`.gitignore` 済み）

- `src/styles/setting/variable/_breakpoint.scss`（Plop 生成）
- `src/styles/setting/variable/_path.scss`（Plop 生成）
- `src/styles/setting/variable/_svg.scss`（svg-sprite 生成）
- `src/types/svg-sprite.ts`（svg-sprite 生成）

値を変えたい場合は `project.config.ts` または `plop/styles/*.hbs`、`scripts/node/commands/svg-sprite.ts` を修正すること。

---

## 3. 実装ルール

- 既存コードの書き方・命名・責務分割に合わせること。
- 不要なモダン化や大規模な書式統一を勝手に行わないこと。
- 自明な説明コメントは避け、WHY が非自明な場合のみコメントを残すこと。

**プロジェクト固有ルール**

- パス・ブレークポイント・出力ディレクトリなどの設定値は `project.config.ts` に集約し、各所へハードコードしないこと。
- 出力ファイル名にハッシュを付けないこと（差分納品の前提が崩れる）。
- 画像の寸法は `src/helper/node/image.ts` の `getImageData()` でマニフェストから取得すること（`imageSize()` を各所で呼ばない）。マニフェストに無い画像はエラーになる。
- Astro コンポーネントは `interface Props` を定義し、`Astro.props` から分割代入して既定値を与えること。
- クラス付与は `class:list` を使い、`addClass` / `modifier` のような外部からの追加クラスを受け取れる形に揃えること。
- ブラウザ実行スクリプトは `src/main.ts` を起点にすること。
- 環境判定は `import.meta.env`（`DEV` / `PROD` / `MODE`）を直接使うこと。定数オブジェクト経由にすると Vite の定数置換がビルド時に効かず、開発専用の動的 import がチャンクとして出力に残る。
- DOM を扱うクラスは `src/abstracts/module.ts` の `Module` を継承すること。
- 状態クラスは `src/constants/state-classes.ts` の `StateClasses` を経由し、文字列リテラルを直書きしないこと。
- SCSS の数値は `func.cv-rem()` などの `tool/function` を使い、生の `rem` 計算を書かないこと。
- 新規 SCSS は FLOCSS の該当レイヤーに置き、同階層の `_index.scss` へ `@use` を追加すること。
- `src/layouts/Layout.astro` は ESLint の対象外（`eslint.config.ts` の `ignores`）。変更時は手動で確認すること。
- npm scripts のタスクを追加する場合は `scripts/node/commands/` に実装し、起動処理は `core/cli.ts` の `runCommandCli()` を使うこと（引数解析・モード適用・watch 分岐・例外処理を含む）。
- タスクは実処理を `runXxx()` として named export し、テストから直接呼べる形にすること。

---

## 4. コーディングスタイル / 命名規約

**フォーマッタ / リンタ**

- Prettier: シングルクォート、セミコロンあり、2 スペース、`printWidth: 100`（`.astro` のみ `200`）
- ESLint: flat config（`eslint.config.ts`）。`typescript-eslint` / `perfectionist` / `unicorn` / `eslint-plugin-astro` を使用
- Stylelint: `stylelint-config-recess-order` + `stylelint-config-recommended-scss`（プロパティ順は recess order）
- `perfectionist` により import 順・オブジェクトキー順は自然順ソートが強制される。手で並べ替えず `pnpm format` に任せること。
- ファイル名にスペースを含めないこと（pre-commit フックで弾かれる）。

**命名**

| 対象 | 規則 | 例 |
|---|---|---|
| Astro コンポーネント | PascalCase | `BtnBasic.astro` |
| TypeScript ファイル | kebab-case | `media-query-list.ts` |
| SCSS パーシャル | `_kebab-case.scss` | `_btn-basic.scss` |
| 関数・変数 | camelCase（アロー関数の named export） | `toUpperCamelCase` |
| 定数オブジェクト | PascalCase + `as const` | `StateClasses` / `Events` |
| 型・インターフェース | PascalCase | `Props` / `AppMode` |

**CSS 設計（FLOCSS + BEM）**

| プレフィックス | レイヤー | 配置 |
|---|---|---|
| なし | Foundation | `src/styles/foundation/` |
| `l-` | Layout | `src/styles/layout/` |
| `c-` | Component（汎用） | `src/styles/object/component/` |
| `p-` | Project（固有） | `src/styles/object/project/` |
| `u-` | Utility | `src/styles/object/utility/` |
| `is-` | 状態 | `StateClasses` 経由で付与 |

- BEM は `block__element--modifier`。要素セレクタのネストではなく、クラス名を分けて記述すること（`.c-btn-basic__link` の形）。
- SCSS ファイル冒頭の `@use`（`setting` / `tool/function` / `tool/mixin`）は既存ファイルの記述順に合わせること。

---

## 5. 開発・ビルド・テスト コマンド

パッケージマネージャは pnpm 固定。

npm scripts は接頭辞で役割を分けている。

| 接頭辞 | 役割 |
|---|---|
| `dev` | ローカル起動 |
| `build` | 納品生成 |
| `watch` | 監視（初回生成なし） |
| `create` | 生成 |
| `check` | 検証 |
| `format` | 整形 |
| `test` | テスト |
| `report` | ビルド成果物に対するレポート出力 |

| コマンド | 内容 |
|---|---|
| `pnpm dev` | クリーン → 生成タスク → Astro dev + 各種 watch |
| `pnpm build` | 静的サイト生成（clean → plop → copy → svg → img → astro → vite → fonts → html 整形） |
| `pnpm preview` | ビルド結果のプレビュー |
| `pnpm check` | `check:*` を並列実行（`check:ts` / `check:astro` / `check:markup`） |
| `pnpm check:ts` | `tsc --noEmit` |
| `pnpm check:astro` | `astro check` |
| `pnpm check:markup` | markuplint（`src/**/*.astro`） |
| `pnpm format` | ESLint / Stylelint / Prettier の自動修正（`src` / 設定ファイル / `scripts/node`）を逐次実行 |
| `pnpm test` | Vitest 全プロジェクト + カバレッジ |
| `pnpm test:scripts` | `scripts/node/__test__/**` のみ実行 |
| `pnpm test:frontend` | `src/**/*.{test,spec}.{ts,tsx}` のみ実行 |
| `pnpm report:w3c` | HTML 検証用ビルド（astro → fonts → html 整形）後に W3C バリデーションを実行し `report-w3c.txt` を出力 |
| `pnpm create:icon` | Font Awesome アイコンから SVG データを生成 |
| `pnpm plop` | 雛形生成（`plop -- scss` / `comp` / `pro`） |

**`check:*` に追加してよいもの**

`pnpm check` は `run-p "check:*"` で全メンバーを自動実行し、さらに lint-staged 経由で**コミットの度に走る**。そのため `check:*` に置いてよいのは以下を満たすものに限る。

- 静的解析であること（ビルド成果物を前提にしない）
- ファイルを書き換えないこと（`dist/` `.tmp/` を含め副作用がない）

ビルドを伴う検証は `check:*` ではなく `report:*` に置くこと。`report:w3c` を `check:w3c` にすると、コミットの度にビルドが走り、`dist/` が納品できない状態に上書きされる。

**キャッシュの置き場所**

ツールのキャッシュは `.cache/` に集約している（`node_modules` を削除しても残り、CI では `actions/cache` の対象を 1 箇所にまとめられる）。

- Astro: `astro.config.ts` の `cacheDir`、内部 Vite は `vite.cacheDir`
- Vite（`build:vite`）/ Vitest: 各設定ファイルの `cacheDir`
- TypeScript: `tsconfig.json` の `incremental` と `tsBuildInfoFile`（`check:ts` の差分検査）
- ESLint / Stylelint / Prettier: `package.json` の `--cache-location`。**対象ファイル群ごとに別の場所を指定する**こと（共有すると互いのキャッシュを打ち消す）
- 例外: ルートの `.astro/` は生成型と dev サーバー情報の置き場で移動できない。pnpm ストアは複数プロジェクトで共有する前提のためグローバルのまま使う

**画像生成のキャッシュ**

`build:img` / `dev:img` は生成物を `.cache/images/` に保存し、元画像の内容ハッシュが変わらない限り再生成せずコピーで済ませる。

- 判定は内容ハッシュ（mtime は `actions/checkout` で毎回更新されるため CI で使えない）
- 生成オプション（`image-min.ts` の `options`）を変更すると `optionsHash` が変わり、全件作り直しになる
- `.cache/images/manifest.json` に幅・高さ・生成物一覧を記録し、Astro コンポーネントはここから寸法を読む
- 元画像を削除すると、次の全件実行で `.tmp` の生成物とキャッシュ実体も取り除かれる
- CI では `.cache/images` を `actions/cache` で復元する（`.github/workflows/build.yml`）

**`report:w3c` がフルビルドを使わない理由**

`build:copy` / `build:svg` / `build:img` / `build:vite` は画像・SVG・JS を生成するだけで HTML を書き換えないため省略している。一方 `build:fonts` は HTML 内のフォントパスを `/_astro/fonts/...` → `/assets/fonts/...` へ書き換えるため**必須**。これを省くと納品されない HTML を検証することになり、`dist/` にハッシュ付きの `_astro/` が残る。

**検証フロー**

変更後は原則この順で実行すること。

```bash
pnpm format && pnpm check && pnpm test:scripts
```

- マークアップ検証まで求められた場合は `pnpm report:w3c` を追加する（内部で検証用ビルドまで行うため、事前の `pnpm build` は不要）。
- コミット時は husky + lint-staged で `pnpm check` と ESLint / Stylelint / Prettier が自動実行される。

**テスト方針**

- フレームワークは Vitest。`globals: true` のため `describe` / `it` / `expect` は import 不要だが、既存テストに合わせて `vitest` から明示 import する。
- Node タスクのテストは `scripts/node/__test__/<layer>/<name>.test.ts` に置き、対象と同じディレクトリ構成をミラーする。
- import はエイリアス（`@scripts-node/*` / `@root/*`）で書く。
- 外部ライブラリ（`fs-extra` / `fast-glob` / `sharp` 等）は `vi.mock` でモックし、プロジェクト内のコードは実実行させる。
- モック定義後に `await import(...)` で対象を読み込む既存パターンに合わせる。
- フロントエンド側（`frontend` プロジェクト）はテスト未整備で、`setupFiles` に指定された `src/test/setup.ts` も未作成。`src` 配下のテストを追加する場合は先に同ファイルを用意すること。

---

## 6. Git 運用

- ブランチ: `main` から作業ごとに `feature/task-name` を作成（task-name は内容が分かる短い英語）。
- 1PR は目的を 1 つに絞ること。
- PR は Draft 状態で作成すること（`gh pr create` は `--draft` を付ける）。Open への切り替えは人間が `gh pr ready` で行う。
- 大規模リファクタは別タスクとして扱うこと。
- `vendor/` `node_modules/` など依存物やコア領域の直接編集は避けること。
- GitHub CLI で改行を含む本文を送るときは `$'...\n...'` 形式を必ず使用すること。
- issue に紐づく作業は `feature/<issue-number>-<short-name>`、issue がない場合は `feature/<short-name>`。
- 生成物（`dist/` `.tmp/` `stats.html` `report-w3c.txt` `coverage/` および `.gitignore` 済みの SCSS / 型定義）はコミットしないこと。

---

## 7. コミットメッセージ

- 書式は Conventional Commits（`<type>(<scope>): <subject>`）。subject は英語・小文字始まり・命令形で書く。
  - 例: `refactor(scripts): migrate npm node tasks from cli to scripts/node and add core/watch architecture`
  - 例: `chore(deps): update project dependencies and lockfile`
  - 例: `docs(readme): refine AGENTS text`
- `type` と `scope` の一覧は `.agents/skills/this-git-commit-writer/references/commit-types.md` を参照すること。
- `a91cfe8` 以前は `feature:` `modify:` `chore:` などの旧書式が混在するが、新規コミットでは使わない（直近の `3693c13`〜`7a91a4c` が現行書式）。
- コミット前に既存の git log を確認し、使われている書式に合わせること。
- 実装とテストを同一コミットに含める場合、scope は主題となる実装レイヤーのみ記載すること。
- コミット提案時は複数案を提示し、各案の主題・対象ファイルを明記すること。
- 根拠として示せる場合は具体的なコミットハッシュやファイルパスを提示すること。

---

## 8. プルリクエスト フォーマット

- 常体で簡潔に書き、書く必要のない項目は見出しごと削除すること（空欄や「特になし」だけの節を残さない）。

```md
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

---

## 9. 依存関係とロックファイル

- 依存を追加・更新した場合はロックファイル（`package-lock.json` / `pnpm-lock.yaml` / `composer.lock` 等）を更新に含めること。
- `node_modules/` `vendor/` 等はコミット対象にしないこと。
- 依存追加は影響範囲を明記し、無関係な一括更新を避けること。

---

## 10. ドキュメント / スキル作成ルール

- Markdown ファイルとコードコメントに絵文字は使用しないこと。
- テーブルではチェックマークの代わりに `Yes/No` を使用すること。
- 例は簡潔かつ焦点を絞ること。
- コード例のコメントは `// Bad:` と `// Good:` を使用すること。

---

## 11. スキル参照ポリシー

- スキルの探索・読み込みはこのリポジトリ配下の `./.agents/skills/**` のみを対象とすること。
- リポジトリ外のスキル領域（グローバル領域等）は参照しないこと。
- 必要なスキルが見つからない場合は、その旨を伝えて代替案で進めること。

## 12. スキルのカスタマイズ方針

ベーススキルをこのプロジェクト固有の内容に書き換える際は、以下の方針に従うこと。

**プロジェクト固有化の手順**
- `AGENTS.md`（このファイル）と `README.md`、既存コードの実装ルール・命名規則・コミット履歴を確認した上でスキルを更新する。
- ベーススキルに含まれる `<!-- TODO: ... -->` コメントをプロジェクト固有の内容に置き換える。
- プロジェクトで使わない手順・観点は削除してよい。

**references への分離ルール**

`SKILL.md` の内容が膨らんだ場合は、以下を目安に `references/` へ分離すること。

| 分離する目安 | 例 |
|---|---|
| ルール・チェックリストが 10 項目を超える | レビュー観点一覧、lint ルール一覧 |
| scope・type など選択肢の一覧が長い | コミット scope 一覧、ブランチ命名規則 |
| 複数スキルから参照される共通ルール | 検証コマンド一覧、命名規約 |
| SKILL.md が 100 行を超えて読みづらくなった | フロー本体に集中できるよう補足情報を分離 |

**分離後の参照方法**
```
.agents/skills/this-git-commit-writer/
├── SKILL.md                     ← 実行フロー・判断ルールを記載
└── references/
    └── commit-types.md          ← scope 一覧・書式ルールなど
```

`SKILL.md` 内では `references/commit-types.md を参照` のように明記する。

---

## 13. AI 支援運用

- このファイル（AGENTS.md）と README.md に記載されたルールは、特に再掲しなくても自動的に適用される前提とする。
- `CLAUDE.md` は `AGENTS.md` へのシンボリックリンクとして管理する。`AGENTS.md` を編集し、`CLAUDE.md` を個別に編集・置換しないこと。
- コマンド・ディレクトリ構造・テスト方針の仕様を変更した場合は README.md と AGENTS.md の記述を同期すること。
- 過去の運用や前例に倣うと述べる場合は、具体的な根拠（コミットハッシュ・ファイルパス等）を提示すること。根拠が示せない場合は推測である旨を明記してユーザーに確認を取ること。

---

## 14. Security & Secrets

**Critical Rule: Never Expose Secrets**

- API キー、秘密鍵、トークン、パスワード、認証情報を読まない・出力しない・埋め込まないこと。
- `.env` や類似ファイルは、明示的な承認なしに読まないこと。
- 環境変数や設定ファイル全文をチャット・ログ・コメントに出力しないこと。
- SSH 鍵・証明書・機微情報ファイルを安易に開かないこと。

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

---

## 15. Destructive Operations

- データ削除・DB 操作・大規模リネーム・大量ファイル移動・依存一括更新は実行前に必ず確認を求めること。
- ExecPlan を示す場合は rollback 手順を必ず含めること。
- 破壊的操作は対象環境を明記した上で承認を取ること。

---

## 16. コスト管理

- **追加料金が発生するような操作は行わないこと**
  - 有料 API の無断使用
  - 高コストなモデル（Fable5 等）への自動切り替え
  - 大量トークンを消費するバッチ処理の自動実行
  - 外部有料サービスへのリクエスト
- コストに影響する判断が必要な場合は、**必ず事前に確認を取ること**
