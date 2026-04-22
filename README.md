# GitHub リポジトリ検索アプリ

GitHub のリポジトリを検索・閲覧できる Web アプリケーション。

## 機能

- キーワード検索（日本語→AIで英語変換）・フィルタ・ソート
- 一覧カードにAI日本語概要を遅延表示・無限スクロール
- 詳細ページ（基本情報・AI要約・言語割合・コミットチャート・README翻訳）



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
| マニュアル                | 35       |

```bash
npm test              # ユニット + コンポーネントテスト
npm run test:e2e      # E2Eテスト
```

詳細は [docs/testing/](docs/testing/) を参照。

## AIツールの使用

Claude API（claude-haiku-4-5）を検索補助・概要生成・翻訳に使用しています。AIの役割は補助に限定し、検索・フィルタリング・表示のロジックはすべて自前で実装しています。

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
