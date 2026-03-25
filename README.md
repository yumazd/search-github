# GitHub リポジトリ検索アプリ

GitHub のリポジトリを検索・閲覧できる Web アプリケーション。

## 機能

- キーワード検索（日本語→AIで英語変換）・フィルタ・ソート
- 一覧カードにAI日本語概要を遅延表示・無限スクロール
- 詳細ページ（基本情報・AI要約・言語割合・コミットチャート・README翻訳）

## 工夫した点

### Server / Client Component の分離

データ取得はServer Component、ユーザー操作が必要な箇所だけClient Componentに分離しました。一覧ページは初回結果をServer Componentで取得・描画し、追加ページはClient Componentで非同期取得。詳細ページではAI要約・コミットチャート・READMEをそれぞれ独立したasync Server Componentに切り出し、Suspenseで取得できたものから順次表示しています。

### AIの活用と負荷への配慮

| 用途                   | タイミング       | 理由                                                               |
| ---------------------- | ---------------- | ------------------------------------------------------------------ |
| 検索キーワード英語変換 | 検索時に自動実行 | GitHub APIは英語検索のため変換が必要                               |
| 一覧のAI概要           | 表示後に遅延取得 | 生成に時間がかかるため、まず原文を表示しAI概要はバッチで非同期取得 |
| README翻訳             | ボタンで手動実行 | 長文でAPIコストが重いため、必要な時だけ実行                        |

AI障害時はすべてフォールバック（原文をそのまま表示）し、検索・閲覧は止まりません。

### その他

- URL searchParamsでフィルタ状態を管理（共有・ブラウザバック対応）
- 検索クエリ構築ロジックをdomain層に純関数として分離し、単体テストで担保
- fetchキャッシュで検索60秒・詳細1時間のrevalidateを設定

## 技術スタック

| 用途           | ライブラリ                                  |
| -------------- | ------------------------------------------- |
| フレームワーク | Next.js 16 (App Router) / TypeScript        |
| CSS / UI       | Tailwind CSS 4 / shadcn/ui                  |
| AI             | @anthropic-ai/sdk（Claude Haiku 4.5）       |
| テスト         | Vitest + React Testing Library + Playwright |

## テスト

| 層                        | テスト数 |
| ------------------------- | -------- |
| ユニット + コンポーネント | 46       |
| E2E                       | 10       |

```bash
npm test              # ユニット + コンポーネントテスト
npm run test:e2e      # E2Eテスト
```

詳細は [docs/testing/](docs/testing/) を参照。

## AIツールの使用

開発にClaude Code（Anthropic CLI）を使用しました。アプリ内ではClaude API（claude-haiku-4-5）を検索補助・概要生成・翻訳に使用しています。AIの役割は補助に限定し、検索・フィルタリング・表示のロジックはすべて自前で実装しています。

## セットアップ

```bash
npm install
npm run dev
```

### 環境変数

| 変数                | 用途                                                 |
| ------------------- | ---------------------------------------------------- |
| `GITHUB_TOKEN`      | GitHub Personal Access Token（レート制限緩和、推奨） |
| `ANTHROPIC_API_KEY` | Anthropic API Key（AI機能利用時）                    |
| `AI_ENABLED`        | `true` でAI機能を有効化                              |

Node.js 22以上が必要です。
