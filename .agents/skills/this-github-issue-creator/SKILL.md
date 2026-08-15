---
name: this-github-issue-creator
description: ざっくりした制作内容から、このプロジェクトの構成と実装状況を踏まえた GitHub issue 案を提案し、修正反映後に `gh issue create` で issue を作成して、対応する作業ブランチ名の提案、`main` からのブランチ作成、必要に応じた issue とブランチの紐づけまで行う。`issue作成して` `制作内容からissueを考えて` `issueに対応するブランチを作って` のような依頼で使う。
---

# this-github-issue-creator

## 入力前提

- ユーザーは実装したい内容をラフに伝える
- issue 作成とブランチ作成には `gh` CLI / `git` が利用可能であること
- ブランチ作成の基点は原則 `main`

## 実行フロー

1. プロジェクト文脈を確認する
   - `README.md` `AGENTS.md` と対象ページ・機能周辺を読み、構成と既存ルールを把握する
   - すでに実装済みの範囲と、今回 issue にすべき差分を切り分ける
   - issue 文面は、実装実態より過不足なく簡潔にする

2. issue 案をコードブロックで提案する
   - ユーザーのラフな要望をプロジェクト文脈に沿って整理する
   - 簡潔なタイトル案と本文案を出す
   - 本文は原則として以下の粒度に収める
     - `## 概要`
     - `## 対応内容`
   - ユーザーへ返す issue 本文は必ず Markdown のコードブロックで提示する

3. 修正指示を反映する
   - ユーザーから変更・加筆・削除・簡略化の指示があればその内容を反映する
   - 反映後の最終案を再度コードブロックで提示する
   - タイトルが未確定なら、issue 作成前に確定させる

4. issue を作成する
   - `gh issue create` を使う
   - 本文に改行を含む場合は `$'...\n...'` 形式を使い、`\n` リテラルを残さない
   - リポジトリは `git remote get-url origin` などから確認する
   - 作成後は issue 番号と URL を返す

5. 作業ブランチ名を提案する
   - issue 番号が確定したら、`feature/<issue-number>-<short-name>` を第一候補にする
   - ブランチ名に `#` を含めない（URL 上フラグメント扱いになり、gh CLI / API の Development 連携が壊れるため）
   - 既存ブランチ命名の前例があればそれに合わせる（前例に `#` が含まれる場合も新規ブランチでは使わない）
   - ブランチ名候補はコードブロックで提示し、最有力候補を 1 つ明示する

6. issue とブランチの紐づけ有無を確認する
   - ブランチ作成前に、以下のように選択肢を提示する
     - `紐づける（推奨）`: GitHub 上に linked branch として作成し、ローカルへ checkout する
     - `紐づけない`: ローカルブランチ作成のみ
   - ユーザーがすでに「紐づけて」と依頼している場合は確認を省略して実行する

7. 作業ブランチを作成する
   - 紐づける場合（リモート起点で作成してから checkout する。後から既存ブランチを紐づける手段が CLI にないため）
     - `gh issue develop <issue-number> --name '<branch-name>' --base main`
     - `git fetch origin` 後、`git switch '<branch-name>'`
     - `gh issue develop <issue-number> --list` で紐づき状態を確認する
     - `gh issue develop` がブランチ名のエラーで失敗する場合は、GraphQL の `createLinkedBranch`（`gh api graphql`、name と main の HEAD の oid を渡す）で代替する
   - 紐づけない場合（ローカルのみ）
     - `git switch main`
     - 必要に応じて `git pull --ff-only`
     - `git switch -c '<branch-name>'`
   - 未コミット変更や現在ブランチ状況により安全に `main` へ戻れない場合は、理由を説明して切り分ける
   - いずれの場合も、後続で PR を作成する際は本文に `Closes #<issue-number>` を含めると Development に PR が確実に紐づく

## 判断ルール

- issue 案は詳細にしすぎず、ユーザーが求めた粒度に合わせて簡潔にする
- 既存実装がある場合でも、ユーザー意図が「新規構築」なら未実装部分に焦点を当てる
- ブランチ名は原則英小文字のケバブケース相当の短い英語を使う（`#` などの URL 特殊文字は使わない）
- issue 番号がない場合は `feature/<short-name>` を提案する

## 出力フォーマット

- issue 提案時: タイトル案 + 本文案（コードブロック）
- issue 作成後: `issue: #<number>` / `url: <url>`
- ブランチ提案時: コードブロックで候補 + 推奨を 1 つ明記
- ブランチ作成後: `branch: <name>` / `base: main`
- 紐づけ後: `linked issue: #<number>` / `linked branch: <name>`

## サンプル

```md
## 概要
トップページを新規構築する。

## 対応内容
- トップページのレイアウトを実装する
- 必要な各セクションを実装する
- デザインに応じたスタイルを適用する
```
