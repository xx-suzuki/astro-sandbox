---
name: this-github-pr-creator
description: 現在ブランチと基幹ブランチの差分を検証し、本プロジェクトの Git 運用に沿って必要に応じてリモートへ push した上で適切なプルリクエストを作成する。`リモートにプッシュ後、プルリクの作成をお願いします` `プルリクの作成をお願いします` `現在の実装内容を解説し、適切なプルリクを作成してください` のような依頼で使う。PR は原則 `feature/*` から `main` へ、既定で Draft 状態で作成する。
---

# this-github-pr-creator

## 入力前提

- `gh` CLI が利用可能で認証済み
- 作業ブランチにコミット済み変更がある
- PR の基幹ブランチは原則 `main`
- PR は既定で Draft 状態で作成し、Open への切り替えは人間が行う

## 実行フロー

1. 変更とブランチ状況を把握する
   - `git status --short`
   - `git rev-parse --abbrev-ref HEAD`
   - `git fetch --all --prune`

2. 基幹ブランチとの差分を確認する
   - 差分ファイル: `git diff --name-only origin/<base>...HEAD`
   - 差分概要: `git diff --stat origin/<base>...HEAD`
   - コミット概要: `git log --oneline origin/<base>..HEAD`
   - 必要に応じて主要差分を読み、PR 本文に反映する

3. 既存 PR を確認する
   - `gh pr list --head <current-branch> --state open`
   - 既存 PR がある場合は新規作成せず、ユーザーが望む場合のみ既存 PR 更新へ切り替える
   - 既存 PR が Open で「作り直し」を求められた場合は、クローズして新規作成する前に `gh pr ready --undo <number>` で Draft に戻す選択肢を提示する（PR 番号とレビュー履歴が保てるため）

4. push が必要か判定して実行する
   - ユーザー指示が「push 後に PR 作成」の場合は必ず push する
   - 未 push コミットがある場合は push する
   - upstream 未設定の場合は `git push -u origin <current-branch>` を使う
   - upstream 設定済みの場合は `git push` を使う

5. PR タイトルと本文を作成する
   - タイトルは変更全体の主題を簡潔に記載する
   - 本文は「変更内容」「影響範囲」を簡潔に記載する
   - 常体で書き、敬体や冗長な前置きを使わない
   - 書く必要のない項目は見出しごと削除する。空欄や「特になし」だけの節を残さない
   - ファイル列挙より、変更の意図と影響を優先する
   - テスト結果やローカル実行パスなど秘匿情報は本文に書かない。`Testing` は原則削除し、書く場合も実行コマンドの要点に留める

6. PR を Draft で作成する
   - `gh pr create --draft --base <base> --head <current-branch> --title "<title>" --body "<body>"`
   - `--draft` は既定で必ず付ける。外すのはユーザーが Open 作成を明示指定した場合のみ
   - 改行を含む本文は `$'...\n...'` 形式を使い、`\n` リテラルを本文に残さない
   - `--draft` 付きの作成が失敗した場合は Open で作り直さず、失敗理由を説明してユーザーへ判断を仰ぐ（無料プランのプライベートリポジトリなど Draft 非対応の環境がある）
   - 作成後に URL を必ず返し、Open 化は人間が `gh pr ready <number>` を実行する旨を添える

## 判断ルール

- 基幹ブランチ指定がない場合は `main` を使う。`main` 以外が必要そうな場合はユーザーへ確認する
- PR は既定で Draft とする。既存 PR を作り直す場合も Draft で作成する
- Open 作成と見なすのは、次のような明示的な指定がある場合に限る
  - `draft ではなく`
  - `open で作成`
  - `draft を外して`
  - `すぐレビューに出せる状態で`
- `レビューお願いします` `そのまま作成して` のような表現は Open 指定と見なさない。判断が曖昧な場合は Draft に倒す
- スキル側では `gh pr ready` を実行しない。Open 化は人間の操作に委ねる
- 既存 PR がある場合は新規作成せず、必要に応じて `gh pr edit` または既存 PR の URL 返却へ切り替える
- 未コミット変更がある場合は関連/無関係を切り分け、PR 対象に含めるかユーザーへ確認する
- 変更説明はファイル列挙より「意図と影響」を優先する

## 出力フォーマット

- `base:` 使用した基幹ブランチ
- `head:` 使用した作業ブランチ
- `pushed:` push 実行有無
- `existing PR:` 既存 PR の有無
- `draft:` `yes` / `no`（`no` の場合はユーザーによる Open 指定である旨を併記する）
- `title:` PR タイトル
- `body summary:` 本文要約
- `url:` PR URL
