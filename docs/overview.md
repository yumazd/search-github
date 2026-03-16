# 設計概要

## コンセプト

「検索」ではなく「探索・発見」。

ユーザーは正確な検索クエリを知らない。「こんなの探してる」とざっくり入力して、意図に近い候補を見やすく発見できるアプリケーション。

---

## フィルタ・並べ替え

### フィルタ

| フィルタ | 選択肢 | APIクエリ変換 | 選択肢の取得元 |
|---------|--------|--------------|---------------|
| 種類 | 全て / ライブラリ / テンプレート / サンプル / ボイラープレート | キーワード付加。「テンプレート」のみ `template:true` 併用可 | 固定値 |
| 言語 | 全て / TypeScript / JavaScript / Python / Go / Rust / Java / Ruby / Swift / PHP / C++ | `language:typescript` 等 | 固定値 |
| 最低Star数 | なし / 50+ / 100+ / 500+ | `stars:>=50` 等 | 固定値 |
| 更新時期 | いつでも / 1ヶ月以内 / 半年以内 / 1年以内 | `pushed:>YYYY-MM-DD`（現在日から算出） | 固定値 |
| ライセンス | 指定なし / MIT / Apache-2.0 / GPL-3.0 / BSD-2-Clause / BSD-3-Clause | `license:mit` 等 | API取得可能（`GET /licenses`）だが固定値でも十分 |
| リポジトリサイズ | 指定なし / 小（<1MB） / 中（1-10MB） / 大（10MB+） | `size:<1000` / `size:1000..10000` / `size:>10000` | 固定値 |

### 並べ替え

| 選択肢 | APIパラメータ |
|--------|-------------|
| Best match | `sort` 指定なし |
| Stars順 | `sort=stars&order=desc` |
| 更新日順 | `sort=updated&order=desc` |
| Fork数順 | `sort=forks&order=desc` |

### 暗黙的に常時適用（UIに出さない）

| 条件 | APIクエリ | 理由 |
|------|----------|------|
| アーカイブ除外 | `archived:false` | 放置リポジトリ除外 |
| フォーク除外 | `fork:false` | オリジナルのみ表示 |

### GitHub Search API のクエリ構造

全フィルタ条件は `q` パラメータの1つの文字列に結合される。`sort` と `order` のみ別パラメータ。

```
GET /search/repositories?q=react+form+library+language:typescript+stars:>=100+pushed:>2026-02-16+license:mit+archived:false+fork:false&sort=stars&order=desc
```

### 状態管理

全フィルタをURL searchParamsに保持：

```
/?q=react+form&type=library&lang=typescript&sort=stars&stars=100&pushed=1m&license=mit&size=small
```

---

## 一覧カード

### 表示項目

| 項目 | APIフィールド | 備考 |
|------|-------------|------|
| オーナーアイコン | `owner.avatar_url` | |
| オーナー名 | `owner.login` | |
| リポジトリ名 | `full_name` | |
| AI概要（日本語） | AI生成 | descriptionをAIで日本語要約 |
| 言語（色付きドット） | `language` | |
| Star数 | `stargazers_count` | |
| Fork数 | `forks_count` | |
| Watcher数 | `watchers_count` | |
| Issue数 | `open_issues_count` | |
| ライセンス | `license.spdx_id` | |
| 最終更新日 | `updated_at` | 相対表示（「3日前」等） |
| トピックタグ | `topics` | 最大5個 |

### レイアウト

```
┌──────────────────────────────────────────────────┐
│ [👤]  owner/repository-name              ⭐ 1.2k │
│                                                  │
│  Reactのフォームバリデーションを簡潔に書ける      │
│  ライブラリ。TypeScript完全対応...                │
│                                                  │
│  🟡 TypeScript   🍴 234   👁 89   ⚠ 12          │
│  MIT   Updated 3 days ago                        │
│                                                  │
│  [react] [forms] [validation] [typescript] [ui]  │
└──────────────────────────────────────────────────┘
```

### 仕様

- カード全体がリンク（詳細ページへ遷移）
- description は2行で打ち切り（ellipsis）
- トピックタグは最大5個表示

### AI概要生成

- 全件AIに通す（言語判定しない）
- 英語 → 日本語に翻訳＋要約
- 日本語 → 要約（1〜2行に整形）
- descriptionなし → リポジトリ名とトピックから概要生成
- GitHub APIから30件取得後、まとめて1回のAI呼び出し
- 概要生成完了までスケルトン表示（差し替えはしない）

### 無限スクロール

- 30件ずつ取得（`per_page=30`）
- スクロール末尾手前で先読み発火
- 上限1000件（GitHub API制限）

### 検索ワードのAI英語変換

- ユーザー入力をClaude Haiku で英語の検索キーワードに変換してからGitHub APIに投げる
- 英語入力の場合もAIに通す（統一処理）
- 変換失敗時は元の入力でそのまま検索（フォールバック）

---

## 詳細ページ

### レイアウト

```
┌──────────────────────────────────────────────────┐
│ [← 検索結果に戻る]                               │
│                                                  │
│ [👤]  owner / repository-name                    │
│                                                  │
│ ┌─ AI要約 ────────────────────────────────────┐  │
│ │ Reactのフォームバリデーションを簡潔に書ける  │  │
│ │ ライブラリ。TypeScript完全対応。Zodや...     │  │
│ └─────────────────────────────────────────────┘  │
│                                                  │
│  ⭐ 1.2k  🍴 234  👁 89  ⚠ 12                   │
│  🟡 TypeScript   MIT   Created 2023-04-01        │
│                                                  │
│  [react] [forms] [validation] [typescript]       │
│  [hooks] [form-library] [zod]                    │
│                                                  │
│  [🔗 GitHubで見る]  [🌐 Demo Site]               │
├──────────────────────────────────────────────────┤
│  Languages                                       │
│  ██████████████████░░░░░░ TS 78%  JS 18%  CSS 4% │
├──────────────────────────────────────────────────┤
│  Commit Activity (past year)                     │
│  ▁▂▃▅▇█▇▅▃▂▁▁▂▃▅▇███▇▅▃▂▁▂▃▅▇█▇▅▃▂▁          │
│  Jan     Apr     Jul     Oct     Jan             │
├──────────────────────────────────────────────────┤
│                                                  │
│  README.md（AI日本語翻訳）                        │
│  ─────────────────────────────────────           │
│  # React Form Validator                          │
│  軽量なフォームバリデーションライブラリ...         │
│  ...                                             │
│  ```tsx                                          │
│  const { register } = useForm()  ← コードはそのまま│
│  ```                                             │
│                                                  │
└──────────────────────────────────────────────────┘
```

### 各セクションの仕様

| セクション | 取得元 | 備考 |
|-----------|--------|------|
| 基本情報 | `GET /repos/{owner}/{repo}` | 1リクエスト |
| AI要約 | description + トピックをAIに投げて生成 | |
| トピックタグ | 同上 | 全件表示（一覧は5個制限） |
| 外部リンク | `html_url`, `homepage` | homepageがなければボタン非表示 |
| 言語割合バー | `GET /repos/{owner}/{repo}/languages` | CSS自作 |
| コミット活動 | `GET /repos/{owner}/{repo}/stats/commit_activity` | shadcn Charts |
| README | `GET /repos/{owner}/{repo}/readme` | マークダウン→HTMLレンダリング + AI日本語翻訳。コードブロックは翻訳しない |

### 段階的ローディング

| 順序 | セクション | タイミング |
|------|-----------|-----------|
| ① | 基本情報・トピック・外部リンク | 〜1秒 |
| ② | AI要約・言語割合バー | 〜2秒 |
| ③ | コミット活動チャート | 〜3秒 |
| ④ | README（AI翻訳済み） | 〜3-5秒 |

各セクションが準備できるまでそこだけスケルトン、準備できたら表示。

---

## ページ構成・ルーティング

### ルート

| パス | 内容 |
|------|------|
| `/` | 検索トップ（検索フォーム + 一覧） |
| `/repositories/[owner]/[repo]` | リポジトリ詳細 |
| `/api/search` | GitHub検索Proxy（Token隠蔽） |
| `/api/translate` | AI翻訳・要約Proxy（API Key隠蔽） |

### ディレクトリ構成

```
src/
  app/
    layout.tsx
    page.tsx
    loading.tsx
    error.tsx
    not-found.tsx
    api/
      search/route.ts
      translate/route.ts
    repositories/
      [owner]/
        [repo]/
          page.tsx
          loading.tsx
          error.tsx

  components/
    search-form.tsx
    repository-card.tsx
    repository-list.tsx
    repository-header.tsx
    ai-summary.tsx
    language-bar.tsx
    commit-chart.tsx
    readme-viewer.tsx
    skeleton.tsx

  domain/
    query-builder.ts
    search-params.ts

  server/
    github.ts
    ai.ts

  hooks/
    use-search.ts

  lib/
    date.ts
    format.ts

  types/
    repository.ts
    search.ts

  config/
    filters.ts
    github.ts
```

---

## エラー / ローディング / 空状態

### ローディング

| 画面 | 表示 |
|------|------|
| 検索トップ初回 | なし（フォームだけ即表示） |
| 検索実行中 | カードのスケルトン × 6枚程度 |
| 無限スクロール追加読み込み | リスト末尾にスピナー + スケルトン × 3枚程度 |
| 詳細ページ | セクションごとにスケルトン（段階的表示） |

### エラー

| エラー種別 | 原因 | 表示 |
|-----------|------|------|
| GitHub API 422 | 不正なクエリ | 「検索条件を変えて再度お試しください」 |
| GitHub API 403 | レート制限超過 | 「しばらく待ってから再度お試しください」+ リセット時刻表示 |
| GitHub API 5xx | GitHub障害 | 「GitHubに接続できません。時間をおいてお試しください」 |
| Claude API エラー | AI障害 | フォールバック: 元のdescription/READMEをそのまま表示 |
| ネットワークエラー | オフライン等 | 「ネットワーク接続を確認してください」 |
| 詳細ページ 404 | リポジトリ不在 | not-found.tsx |

### 空状態

| 状態 | 表示 |
|------|------|
| 初回アクセス（未検索） | フォームのみ + 人気トピックのサジェストタグ |
| 検索結果0件 | 「該当するリポジトリが見つかりませんでした」+ フィルタ緩和の提案 |
| 無限スクロール末尾 | 「すべての結果を表示しました」 |
| descriptionなし | AI概要で補う。失敗なら「概要なし」 |

---

## 技術スタック

### フレームワーク・言語

| 用途 | ライブラリ |
|------|-----------|
| フレームワーク | Next.js 16 (App Router) |
| 言語 | TypeScript |
| CSS | Tailwind CSS 4 |

### UI

| 用途 | ライブラリ |
|------|-----------|
| UIコンポーネント | shadcn/ui |
| チャート | shadcn Charts (Recharts) — コミット活動チャート用 |
| 言語割合バー | CSS自作 |

### コンテンツ

| 用途 | ライブラリ |
|------|-----------|
| マークダウンレンダリング | react-markdown |
| シンタックスハイライト | rehype-highlight |
| GFM対応 | remark-gfm |

### AI

| 用途 | ライブラリ |
|------|-----------|
| Claude API | @anthropic-ai/sdk |

### テスト

| 用途 | ライブラリ |
|------|-----------|
| テストランナー | Vitest |
| コンポーネントテスト | React Testing Library |
| E2Eテスト | Playwright |
| APIモック | MSW |

### ユーティリティ

| 用途 | ライブラリ |
|------|-----------|
| 日付処理 | date-fns |
| 無限スクロール | react-intersection-observer |
| バリデーション | Zod |

---

## パフォーマンス

### 画像の最適化

オーナーアイコン（`avatar_url`）は一覧・詳細の両方で表示される。Next.js の `next/image` を使用して最適化する。

| 対応 | 内容 |
|------|------|
| `next/image` 使用 | 自動的に WebP/AVIF 変換、リサイズ、lazy loading |
| `sizes` 指定 | 一覧カード: 40px、詳細ページ: 64px 程度。不要に大きい画像を取得しない |
| `remotePatterns` 設定 | `next.config.ts` に `avatars.githubusercontent.com` を許可 |
| `priority` | ファーストビューに入るカード（最初の数枚）のみ `priority={true}` で即読み込み |
