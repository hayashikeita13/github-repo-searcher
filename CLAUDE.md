# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

GitHub Repositories の検索 App。トップでキーワード検索 → 結果一覧 → リポジトリ詳細ページの3画面構成。

## コマンド

- `npm run dev` — 開発サーバー起動（Next.js）
- `npm run build` — 本番ビルド
- `npm start` — 本番ビルドの起動
- `npm run check-types` — `tsc --noEmit` で型チェック
- `npm run lint` / `npm run lint-fix` — ESLint（`eslint` / `eslint --fix`）
- `npm run test` — Vitest を1回実行（`vitest run`）。ファイル単体は `npm run test path/to/file.test.ts`、ウォッチは `npm run test-watch`
- `npm run test-coverage` - Vitestでテストカバレッジを測定
- `npm run prepare` — Husky の初期化（`npm install` 時に自動実行）

## 主要依存

- **Next.js 16.2.6 + React 19.2.4** の App Router
- **Ant Design v6**（`antd` + `@ant-design/nextjs-registry`）。`layout.tsx` で `<AntdRegistry>` でラップ済み
- **SWR** でクライアントサイドのデータフェッチ／キャッシュ
- **zod** で外部入力（API 引数／レスポンス／URL パラメータ）のバリデーション
- **Sass**（`*.module.scss`）でスタイリング
- **Vitest + @testing-library/react** でテスト（環境は `jsdom`）
- **Husky** で Git フック

## アーキテクチャ / 構成

### ディレクトリ構成
- ルートエントリは `src/app/`。コードを書く前に `node_modules/next/dist/docs/` 配下の該当ガイドを必ず参照する（例: `01-app/01-getting-started/`、`01-app/02-guides/`、`01-app/03-api-reference/`）。
- App Router の特殊ファイルは `src/app/` 直下に揃っている：`layout.tsx` / `page.tsx` / `error.tsx` / `loading.tsx` / `globals.scss` / `favicon.ico`
- ルート：
  - `/` → `src/app/page.tsx` → `HomeTemplate`（検索フォーム＋結果一覧）
  - `/repositories/[owner]/[name]` → `src/app/repositories/[owner]/[name]/page.tsx` → `RepositoryDetailTemplate`（詳細）。`params` は zod で検証し、不正なら `notFound()`。`generateMetadata` で動的にメタを生成
- パスエイリアスは `@/* → ./src/*`（`tsconfig.json`）

### `src/frontend/` レイアウト
- `components/` — Atomic Design に従ったコンポーネント置き場
  - `atoms/`（必要に応じて） / `molecules/` / `organisms/` / `templates/`
  - 各コンポーネントは `<Name>/index.tsx`、テストは同階層に `index.test.tsx`、スタイルは `index.module.scss` を併置
  - 現状の主なコンポーネント：
    - templates: `HomeTemplate`, `RepositoryDetailTemplate`
    - organisms: `Header`, `SearchResults`, `RepositoryList`, `RepositoryDetail`
    - molecules: `SearchForm`, `RepositoryCard`, `RepositoryStat`, `PaginationBar`, `EmptyState`
- `contexts/` — React Context（例: `RepositoriesContext` で検索結果のキャッシュを保持し、詳細ページで再フェッチを避ける）
- `hooks/` — カスタムフック。**外部 API 呼び出しは原則ここで行う**（例: `useGithubRepositories` が SWR で `searchRepositories` を叩く）
- `api/github/` — GitHub API クライアントと型／zod スキーマ（`searchRepositories.ts` / `schemas.ts` / `types.ts`）

### スタイリング
- **Sass Modules**（`*.module.scss`）が標準
- **共通定義（カラー、ブレークポイント、mixin など）は `src/frontend/components/base.module.scss` に集約**し、各モジュールから `@use` で参照する。新規 SCSS ファイルを増やす前にここに置けないか検討する
- `@tailwindcss/postcss` が devDependencies に入っているが、PostCSS 設定とグローバル CSS が未配置で Tailwind は実質未適用。新規スタイルは Sass Modules で書く

### テスト
- Vitest（`vitest.config.ts`）：環境は `jsdom`、`@` エイリアスを `./src` に解決、`vitest.setup.ts` で `@testing-library/jest-dom` の matcher と `matchMedia` のポリフィル、`afterEach` の `cleanup()` を設定済み
- 各コンポーネント／フック／API クライアント直下に `*.test.ts(x)` をコロケーション

## CI / PR

- `.github/workflows/ci.yml` が PR 起点で `npm run lint` → `npm run check-types` → `npm test` を実行（Node 22, `npm ci`）。手元でこの3つが通る状態にしてから push する
- Husky の pre-commit フックがローカルで同等のチェックを走らせる（`.husky/` 参照）
- `.github/PULL_REQUEST_TEMPLATE.md` に沿って PR 本文を埋める

## コーディングルール
- **Atomic Design** に従ったコンポーネント分割（atoms / molecules / organisms / templates）
- **Next.js らしさを強く意識する**（`next-devtools-mcp` を活用）
  - レンダリング手法（SSR / SSG / ISR / CSR）を画面要件に応じて使い分ける。Server Component を常に優先し、`'use client'` は最低限・末端のコンポーネントに押し込める
  - `error.tsx`, `loading.tsx`, `not-found.tsx` などの App Router 規約ファイル名を使用し、適切に使い分ける
  - リンクは `next/link` の `<Link>`、画像は `next/image` の `<Image>` を常に使う（`<a>` / `<img>` 直書きは禁止。`next.config.ts` の `images.remotePatterns` に必要なホストを追加する）
  - キャッシュ制御は `fetch` のオプションで行う（用途に応じて `cache: 'no-store'` / `next: { revalidate }` を選ぶ）
  - `<head>` を直書きせず、Metadata API（`metadata` / `generateMetadata`）を使う
- **外部 API はカスタムフック経由で fetch**（`useXxx` フック内で API クライアントを呼ぶ）
- **外部入力のバリデーションは zod で**（API 引数／レスポンス／URL クエリ）
- **TDD アプローチ**：機能追加・修正時はテストコードも合わせて実装する
