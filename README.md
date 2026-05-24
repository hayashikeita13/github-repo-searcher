# GitHub Repositories 検索 App

GitHub の公開リポジトリをキーワードで検索し、結果一覧と詳細を閲覧できる Web アプリケーションです。Next.js (App Router) と React で構築されています。

## 主な機能

- キーワードによる GitHub リポジトリ検索
- 検索結果の一覧表示とページネーション
- リポジトリの詳細情報（説明・スター数・言語・トピックなど）の閲覧

## 技術スタック

- **フレームワーク**: Next.js 16 (App Router) / React 19
- **UI**: Ant Design v6
- **データフェッチ**: SWR
- **バリデーション**: zod
- **スタイリング**: Sass Modules
- **テスト**: Vitest + @testing-library/react
- **言語**: TypeScript

## セットアップ

### 必要環境

- Node.js 22 以上
- npm

### インストール

```bash
npm install
```

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開くとアプリが表示されます。

## スクリプト

| コマンド | 説明 |
| --- | --- |
| `npm run dev` | 開発サーバーを起動 |
| `npm run build` | 本番ビルドを生成 |
| `npm start` | 本番ビルドを起動 |
| `npm run check-types` | TypeScript の型チェック (`tsc --noEmit`) |
| `npm run lint` | ESLint を実行 |
| `npm run lint-fix` | ESLint を自動修正付きで実行 |
| `npm run test` | Vitest を 1 回実行 |
| `npm run test-watch` | Vitestをwatchモードで実行 |
| `npm run test-coverage` | test coverageを測定 |

特定ファイルのみテストする場合は次のように実行します。

```bash
npm run test path/to/file.test.ts
```

## ディレクトリ構成

```
src/
├── app/                       # Next.js App Router のエントリ
│   ├── layout.tsx
│   ├── page.tsx               # トップ（検索ページ）
│   └── repositories/
│       └── [owner]/[name]/    # リポジトリ詳細ページ
└── frontend/
    ├── api/github/            # GitHub API クライアントと zod スキーマ
    ├── components/            # Atomic Design に基づくコンポーネント
    │   ├── atoms/
    │   ├── molecules/
    │   ├── organisms/
    │   └── templates/
    ├── contexts/              # React Context
    └── hooks/                 # カスタムフック（外部 API 呼び出しはここで実施）
```

パスエイリアスは `@/* → ./src/*` です。

## 開発時のルール

- **Atomic Design** に従ったコンポーネント分割（atoms / molecules / organisms / templates）
- **外部 API 呼び出し**はカスタムフック (`useXxx`) 経由で行う
- **外部入力（API 引数 / レスポンス / URL クエリ）のバリデーション**は zod で実施
- **SCSS の共通定義**（カラー・ブレークポイント・mixin など）は `src/frontend/components/base.module.scss` に集約し、各モジュールから `@use` で参照
- **画像は `next/image`、リンクは `next/link`** を使用（`<img>` / `<a>` の直書きは禁止）
- **`<head>` を直書きせず**、Metadata API（`metadata` / `generateMetadata`）を使用

## CI

PR 起点で `.github/workflows/ci.yml` が以下を実行します（Node 22）。

1. `npm run lint`
2. `npm run check-types`
3. `npm test`

push 前にローカルでこの 3 つが通ることを確認してください。Husky の pre-commit フックでも同等のチェックが走ります。
