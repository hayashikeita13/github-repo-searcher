---
name: create-pr
description: 変更差分を分析してGitHub PRを自動作成。developブランチとの差分からPR説明文を自動生成します。
---

# プルリクエストの作成

GitHub プルリクエスト（PR）を作成します。

`main` ブランチとの差分を分析し、`.github/PULL_REQUEST_TEMPLATE.md` に基づいてPR説明文を自動生成して、PRを作成します。`--web` オプションは使用せず、CLI で直接PR作成を行います。

## コンテキスト

- 現在のブランチ: !`git branch --show-current`
- mainとの差分ファイル: !`git diff --name-only main...HEAD`
- コミット履歴: !`git log main..HEAD --oneline`
- 変更統計: !`git diff main...HEAD --stat`
- PRテンプレート: @.github/PULL_REQUEST_TEMPLATE.md
- リポジトリ情報: !`gh repo view --json name,owner,url`

## 実行内容

1. ベースブランチ（main）との差分確認
   - `git diff main...HEAD --name-only` で変更ファイル一覧取得
   - `git diff main...HEAD` で変更内容の詳細取得
   - `git log main..HEAD --oneline` でコミット履歴取得

2. ブランチ名から Issue 番号を抽出
   - `feature/123/xxx` → `#123`

3. `.github/PULL_REQUEST_TEMPLATE.md` に基づいたPR説明文の生成
   - Github issue セクションに Issue URL と `Closes #123` を自動挿入
   - 概要セクションに変更内容のサマリーを生成
   - 確認リストのチェック状態を確認

4. IssueのタイトルをPRのタイトルに設定

5. `gh pr create` でPR作成（--web なし、CLI で直接作成）

6. ラベルの自動付与（オプション）

7. レビュワーの指定（オプション）


## AI実行時の手順

### 1. 事前確認

```bash
git branch --show-current
git fetch origin main
```

### 2. 変更内容の取得

```bash
git diff main...HEAD --name-only
git log main..HEAD --oneline
git diff main...HEAD
```

### 3. Issue番号の抽出

ブランチ名から Issue 番号を自動抽出：
- `feature/123/add-login` → `#123`
- `fix/456/resolve-bug` → `#456`

Issue 番号が見つからない場合は、ユーザーに入力を求める。

### 4. PR本文の生成

`.github/PULL_REQUEST_TEMPLATE.md` を読み取り、以下の情報を元にPR本文を生成：

- **Github issue**: `https://github.com/sagri-tokyo/farmland-utilization/issues/{issue_number}` と `Closes #{issue_number}`
- **概要**: コミットメッセージと変更ファイルから自動生成
- **確認リスト**: `/review` の結果を元にチェック状態を設定

### 5. PRタイトルの生成

- コミットが1つの場合: そのコミットメッセージを使用
- 複数のコミットがある場合: ブランチ名とIssueタイトルから生成

### 6. PR作成

**必ず HEREDOC を使用して本文を渡すこと。** インライン文字列は改行が崩れるため使用禁止。

```bash
gh pr create \
  --title "{生成されたタイトル}" \
  --body "$(cat <<'EOF'
## Github issue
{issue_url}
Closes #{issue_number}

## 概要
{概要}

## 注意事項
{注意事項 or なし}

## レビュアーの動作確認
{動作確認手順 or なし}

## デザイン
{スクリーンショット or なし}

## 確認リスト
- [ ] テストが通っているか
- [ ] Lintが通っているか
EOF
)" \
  --base main
```

**禁止事項:**
- `## Summary` / `## Test plan` などテンプレート外のセクションを使わない
- `🤖 Generated with Claude Code` フッターを追加しない

成功したら、PR URLをユーザーに表示。

## ブランチ命名規則

```
<type>/<issue-number>/<short-description>

例:
feature/1021/setup-claude-code-settings
fix/1022/resolve-build-error
refactor/1023/improve-test-structure
```

## PR タイトル規則（Conventional Commits 形式）

```
<type>(<scope>): <subject>

例:
feat(backend): ユーザー認証機能の追加
fix(backend): データ取得エラーの修正
refactor(ui): 共通コンポーネントの整理
```
