# 設計概要

## フィルタ・並べ替え

### フィルタ

| フィルタ   | 選択肢                                    | APIクエリ変換                          |
| ---------- | ----------------------------------------- | -------------------------------------- |
| 最低Star数 | なし / 50+ / 100+ / 500+                  | `stars:>=50` 等                        |
| 更新時期   | いつでも / 1ヶ月以内 / 半年以内 / 1年以内 | `pushed:>YYYY-MM-DD`（現在日から算出） |

### 並べ替え

| 選択肢     | APIパラメータ             |
| ---------- | ------------------------- |
| Best match | `sort` 指定なし           |
| Stars順    | `sort=stars&order=desc`   |
| 更新日順   | `sort=updated&order=desc` |
| Fork数順   | `sort=forks&order=desc`   |

### 暗黙的に常時適用（UIに出さない）

| 条件           | APIクエリ        | 理由               |
| -------------- | ---------------- | ------------------ |
| アーカイブ除外 | `archived:false` | 放置リポジトリ除外 |
| フォーク除外   | `fork:false`     | オリジナルのみ表示 |

### 検討したが見送ったフィルタ

以下のフィルタは設計・実装を検討したが、期間内の優先度を考慮し機能を絞った。コア体験（キーワード検索→結果一覧→詳細閲覧）の品質を優先するため。

| フィルタ         | 概要                                                    | 見送り理由                                                                             |
| ---------------- | ------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| 種類             | ライブラリ / テンプレート / サンプル / ボイラープレート | GitHub APIにカテゴリの概念がなく、キーワード付加による疑似フィルタになるため精度が低い |
| 言語             | TypeScript / Python / Go 等                             | `language:` クエリで実装可能だが、フィルタUIの複雑化に対して利用頻度が限定的           |
| ライセンス       | MIT / Apache-2.0 / GPL-3.0 等                           | `license:` クエリで実装可能だが、一般ユーザーがライセンスで絞り込む頻度は低い          |
| リポジトリサイズ | 小 / 中 / 大                                            | `size:` クエリで実装可能だが、サイズの基準がユーザーにとって直感的でない               |
| サジェストタグ   | 人気トピックのワンクリック検索                          | 検索体験の補助として有効だが、固定値のため鮮度が保てない。トレンドAPI連携が理想        |

### GitHub Search API のクエリ構造

全フィルタ条件は `q` パラメータの1つの文字列に結合される。`sort` と `order` のみ別パラメータ。

```
GET /search/repositories?q=react+form+stars:>=100+pushed:>2026-02-16+archived:false+fork:false&sort=stars&order=desc
```

### 状態管理

全フィルタをURL searchParamsに保持：

```
/result?q=react+form&sort=stars&stars=100&pushed=1m
```

---

## 一覧カード

### 表示項目

| 項目                 | APIフィールド       | 備考                        |
| -------------------- | ------------------- | --------------------------- |
| オーナーアイコン     | `owner.avatar_url`  |                             |
| オーナー名           | `owner.login`       |                             |
| リポジトリ名         | `full_name`         |                             |
| AI概要（日本語）     | AI生成              | descriptionをAIで日本語要約 |
| 言語（色付きドット） | `language`          |                             |
| Star数               | `stargazers_count`  |                             |
| Fork数               | `forks_count`       |                             |
| Watcher数            | `watchers_count`    |                             |
| Issue数              | `open_issues_count` |                             |
| ライセンス           | `license.spdx_id`   |                             |
| 最終更新日           | `updated_at`        | 相対表示（「3日前」等）     |
| トピックタグ         | `topics`            | 最大5個                     |

### 仕様

- カード全体がリンク（詳細ページへ遷移）
- description は2行で打ち切り（ellipsis）
- トピックタグは最大5個表示

### AI概要生成

- 全件AIに通す（言語判定しない）
- 英語 → 日本語に翻訳＋要約
- 日本語 → 要約（1〜2行に整形）
- descriptionなし → リポジトリ名とトピックから概要生成
- GitHub APIから10件取得後、まとめて1回のAI呼び出し

### 無限スクロール

- 10件ずつ取得（`per_page=10`）
- スクロール末尾手前で先読み発火
- 上限1000件（GitHub API制限）

### 検索ワードのAI英語変換

- ユーザー入力に日本語（ひらがな・カタカナ・漢字）が含まれる場合のみ、Claude Haiku で英語キーワードに変換してからGitHub APIに投げる
- 英語入力はそのまま検索（AIを通さない）
- 変換失敗時は元の入力でそのまま検索（フォールバック）

---

## 詳細ページ

### 各セクションの仕様

| セクション   | 取得元                                            | 備考                                         |
| ------------ | ------------------------------------------------- | -------------------------------------------- |
| 基本情報     | `GET /repos/{owner}/{repo}`                       | Server Componentでサーバー取得               |
| AI要約       | description + トピックをAIに投げて生成            | Server Component（Suspenseでストリーミング） |
| トピックタグ | 同上                                              | 全件表示（一覧は5個制限）                    |
| 外部リンク   | `html_url`, `homepage`                            | homepageがなければボタン非表示               |
| 言語割合バー | `GET /repos/{owner}/{repo}/languages`             | Server Componentでサーバー取得               |
| コミット活動 | `GET /repos/{owner}/{repo}/stats/commit_activity` | Server Component + Client描画                |
| README       | `GET /repos/{owner}/{repo}/readme`                | Server Componentで取得、AI翻訳のみClient     |

### READMEレンダリングの工夫

- `react-markdown` + `remark-gfm`（GFMテーブル・チェックボックス等対応）
- `rehype-raw`：GitHub READMEに混在するHTMLタグ（`<p align="center">`、`<img>`、`<table>` 等）をそのままレンダリング
- `@tailwindcss/typography`（`prose`クラス）：見出し・リスト・コードブロック・テーブル等の整形に使用

### Server Component / Client Component 分離

詳細ページはServer Component中心の構成。データ取得はすべてサーバーサイドで行い、インタラクティブな部分のみClient Componentに分離。

```
Server Component（page.tsx）
  ├─ getRepository()       ← サーバー取得（revalidate: 3600）
  ├─ getLanguages()        ← 同上
  └─ render
      ├─ 基本情報・言語バー（即表示）
      ├─ <Suspense> → <AiSummary />       ← Server Component（AI処理）
      ├─ <Suspense> → <CommitChart />      ← Server取得 + Client描画
      └─ <Suspense> → <ReadmeViewer />     ← Server取得 + Client翻訳
```

### 段階的ローディング（Suspense Streaming）

Suspense境界で各セクションを包み、準備できたものから順にストリーミング表示。

| 順序 | セクション                               | レンダリング                                  |
| ---- | ---------------------------------------- | --------------------------------------------- |
| ①    | 基本情報・トピック・外部リンク・言語バー | Server Component（即表示）                    |
| ②    | AI要約                                   | Server Component（Suspense）                  |
| ③    | コミット活動                             | Server Component取得 → Client描画（Suspense） |
| ④    | README（AI翻訳）                         | Server Component取得 → Client翻訳（Suspense） |

---

## ページ構成・ルーティング

### ルート

| パス                           | 内容                                         | レンダリング                      |
| ------------------------------ | -------------------------------------------- | --------------------------------- |
| `/`                            | 検索トップ                                   | Static                            |
| `/result`                      | 検索結果一覧                                 | Dynamic（searchParamsで検索実行） |
| `/repositories/[owner]/[repo]` | リポジトリ詳細                               | Dynamic（revalidate: 3600）       |
| `/api/search`                  | 検索API（無限スクロール2ページ目以降用）     | API Route                         |

### App Router 規約ファイル

| ファイル        | 配置                                      |
| --------------- | ----------------------------------------- |
| `loading.tsx`   | `/result`, `/repositories/[owner]/[repo]` |
| `error.tsx`     | `/result`, `/repositories/[owner]/[repo]` |
| `not-found.tsx` | `/repositories/[owner]/[repo]`            |

---

## エラー / ローディング / 空状態

### ローディング

| 画面                       | 表示                                        |
| -------------------------- | ------------------------------------------- |
| 検索トップ初回             | なし（フォームだけ即表示）                  |
| 検索実行中                 | loading.tsx によるスケルトン                |
| 無限スクロール追加読み込み | リスト末尾にスピナー + スケルトン × 3枚程度 |
| 詳細ページ                 | loading.tsx + Suspenseによる段階的表示      |

### エラー

| エラー種別        | 原因           | 表示                                                 |
| ----------------- | -------------- | ---------------------------------------------------- |
| GitHub API 422    | 不正なクエリ   | 「検索条件を変えて再度お試しください」               |
| GitHub API 403    | レート制限超過 | 「しばらく待ってから再度お試しください」             |
| GitHub API 5xx    | GitHub障害     | error.tsx（リトライボタン付き）                      |
| Claude API エラー | AI障害         | フォールバック: 元のdescription/READMEをそのまま表示 |
| 詳細ページ 404    | リポジトリ不在 | not-found.tsx                                        |

### 空状態

| 状態                   | 表示                                                             |
| ---------------------- | ---------------------------------------------------------------- |
| 初回アクセス（未検索） | フォームのみ                                                     |
| 検索結果0件            | 「該当するリポジトリが見つかりませんでした」+ フィルタ緩和の提案 |
| 無限スクロール末尾     | 「すべての結果を表示しました」                                   |
| descriptionなし        | AI概要で補う。失敗なら「説明がありません」                       |

---

## 技術スタック

### フレームワーク・言語

| 用途           | ライブラリ              |
| -------------- | ----------------------- |
| フレームワーク | Next.js 16 (App Router) |
| 言語           | TypeScript              |
| CSS            | Tailwind CSS 4          |

### UI

| 用途             | ライブラリ |
| ---------------- | ---------- |
| UIコンポーネント | shadcn/ui  |
| 言語割合バー     | CSS自作    |

### コンテンツ

| 用途                     | ライブラリ              |
| ------------------------ | ----------------------- |
| マークダウンレンダリング | react-markdown          |
| GFM対応                  | remark-gfm              |
| HTML許可                 | rehype-raw              |
| タイポグラフィ           | @tailwindcss/typography |

### AI

| 用途       | ライブラリ        |
| ---------- | ----------------- |
| Claude API | @anthropic-ai/sdk |

### ユーティリティ

| 用途           | ライブラリ                  |
| -------------- | --------------------------- |
| 無限スクロール | react-intersection-observer |
| バリデーション | Zod                         |

---

## パフォーマンス

### 画像の最適化

オーナーアイコン（`avatar_url`）は一覧・詳細の両方で表示される。Next.js の `next/image` を使用して最適化。

| 対応                  | 内容                                                       |
| --------------------- | ---------------------------------------------------------- |
| `next/image` 使用     | 自動的に WebP/AVIF 変換、リサイズ、lazy loading            |
| `remotePatterns` 設定 | `next.config.ts` に `avatars.githubusercontent.com` を許可 |

### fetchキャッシュ

| 対象                                       | revalidate      |
| ------------------------------------------ | --------------- |
| 検索結果                                   | 60秒            |
| リポジトリ詳細・言語・コミット活動・README | 3600秒（1時間） |

### メタデータ

| ページ           | 内容                                                               |
| ---------------- | ------------------------------------------------------------------ |
| ルートレイアウト | `metadataBase` 設定、`title.template` でサイト名自動付与           |
| 検索結果         | 検索キーワードを含む動的title/description                          |
| 詳細ページ       | リポジトリ名・description・OGP画像を `generateMetadata` で動的生成 |

---

## セキュリティ

| 対策                       | 内容                                                                         |
| -------------------------- | ---------------------------------------------------------------------------- |
| Server Actions / API Route | データ取得はすべてサーバーサイドで実行し、APIキーをクライアントに露出させない |
| エラーメッセージ秘匿       | サーバーエラーの詳細をクライアントに返さず、汎用メッセージを表示             |
| AI機能のデフォルト無効     | `AI_ENABLED=true` を明示的に設定しない限りAI機能は無効                       |
| 環境変数管理               | `.env.example` で必要な変数を明示、`.env.local` は `.gitignore` で除外       |
