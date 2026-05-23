---
name: create-branch
description: gitで新しくブランチを作成する（hotfixは除く）。Issueから命名規則に沿ったブランチを作成します。
argument-hint: <issue-url>
model: sonnet
---

# git branchの作成

- エラーが発生した際は作業を中断する
- git branchを新しく作成する
- ブランチの命名規則は`ブランチ種類と命名規則`に従う
- $ARGUMENTSのイシュー番号をブランチ名に含めるイシュー番号として使用する
- ベースブランチは`main`とする

## 実行内容

1. mainブランチの最新版を取得
2. `git switch main` でmainブランチをカレントブランチにセット
3. `git pull origin main` でmainブランチの最新版を取得
4. `git switch -c 作成するブランチ名 main` で新しくブランチを作成
5. `git switch 作成するブランチ名`で作成したブランチをカレントブランチにセット

## 📂 ブランチ種類と命名規則

| ブランチ種類 | 命名規則 | 用途 | 例 |
|-------------|---------|------|-----|
| **main** | `main` | 安定版 | `main` |
| **feature** | `feature/yyyy/MM/イシュー番号_機能名` | 新機能開発 | `feature/2024/01/123_user-authentication` |
| **fix** | `fix/yyyy/MM/イシュー番号_修正内容` | バグ修正 | `fix/2024/01/456_login-error` |

### 🎯 ブランチ運用ルール

#### 🔒 main ブランチ
- **本番環境**に対応
- **直接コミット禁止**
- **PRを通したマージのみ**

#### ⚡ feature ブランチ
- **main から分岐**
- **新機能開発専用**
- **命名**: `feature/yyyy/MM/イシュー番号_機能名`
- **完了後は削除**

#### 🔧 fix ブランチ
- **main から分岐**
- **バグ修正専用**
- **命名**: `fix/yyyy/MM/イシュー番号_修正内容`
- **完了後は削除**
