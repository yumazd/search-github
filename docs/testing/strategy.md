# テスト方針

## テストの種類と範囲

| 種類 | 対象 | ツール |
|------|------|--------|
| 単体テスト | domain層・lib層・server層の純ロジック | Vitest |
| コンポーネントテスト | UIコンポーネントの描画・操作 | Vitest + React Testing Library |
| E2Eテスト | 検索→一覧→詳細の画面遷移 | Playwright |

---

## 単体テスト（domain / lib / server）

| ファイル | テスト内容 | テスト数 |
|---------|-----------|---------|
| `domain/query-builder.ts` | フィルタ値 → GitHub Search APIクエリ文字列の変換 | 10 |
| `lib/format.ts` | `formatCount`（数値→k表記）、`formatRelativeDate`（相対日付）、`formatDate`（日本語ロケール） | 11 |
| `server/search.ts` | `containsJapanese`（日本語判定：ひらがな・カタカナ・漢字・日英混在・英語のみ・空文字） | 6 |

---

## コンポーネントテスト

| コンポーネント | テストファイル | テスト内容 | テスト数 |
|--------------|--------------|-----------|---------|
| `components/search-card.tsx` | `components/search-card.test.tsx` | フィルタ入力の反映、検索時のrouter.push、空入力バリデーション、同一条件→空入力のエラー切替、エラー解除 | 5 |
| `app/result/_components/repo-card.tsx` | `app/result/_components/repo-card.test.tsx` | 各項目の表示（名前・Star・description・言語・ライセンス・トピック）、リンク先、null/空値の非表示 | 11 |
| `app/result/_components/ai-description.tsx` | `app/result/_components/ai-description.test.tsx` | キャッシュなし→スケルトン表示、キャッシュあり→初回レンダリングから翻訳表示、キャッシュミス→スケルトン表示 | 3 |

### テスト内でのスタブ対象

| スタブ | 理由 |
|-------|------|
| `next/navigation`（useRouter, useSearchParams） | SearchCardのルーティングをテスト |
| `next/image`, `next/link` | DOM上で素のHTML要素として検証 |
| `ai-description` コンポーネント | RepoCardテストでServer Actionへの依存を排除 |
| `server-only` | server/search.tsの純関数をテスト環境で読み込むため |
| `@/server/actions` | AiDescriptionテストでServer Actionへの依存を排除 |

---

## E2Eテスト（Playwright）

| シナリオ | 内容 |
|---------|------|
| 検索→一覧表示 | キーワード入力→検索→カードが表示される |
| フィルタ変更 | Star数・更新日を変更→結果が変わる |
| ソート変更 | ソート切替→URLが更新され結果が変わる |
| 無限スクロール | スクロール→追加カードが読み込まれる |
| 空入力バリデーション | 空で検索→エラーメッセージが表示される |
| 0件表示 | 結果なしのクエリ→空状態メッセージ |
| クエリなしアクセス | `/result` に直接アクセス→空状態表示 |
| 詳細遷移 | カードクリック→詳細ページにリポジトリ情報が表示される |
| 戻るボタン | 詳細→戻る→結果一覧に戻れる |
| 存在しないリポジトリ | 不正URL→404ページ表示 |

---

## テストカバレッジの現状

### 実装済み

| レイヤー | カバレッジ |
|---------|-----------|
| domain（query-builder） | ✅ フィルタ変換ロジックを網羅 |
| lib（format） | ✅ フォーマット関数を正常系・異常系で網羅 |
| server（search） | ✅ 日本語判定ロジックを網羅 |
| SearchCard | ✅ 入力・検索・バリデーション・エラー切替の基本フロー |
| RepoCard | ✅ 表示項目の正常系・null/空値の異常系 |
| AiDescription | ✅ sessionStorageキャッシュの即時反映 |
| E2E | ✅ 検索→一覧→詳細の主要フロー + エラー系 |

### 未実装

| 対象 | 内容 | 優先度 |
|------|------|--------|
| SortSelect | ソート切替のコンポーネントテスト | 中 |
| LoadMore | 無限スクロール・ページネーションのテスト | 中 |
| AiSummary | AI要約の表示・フォールバックのテスト | 低 |
| ReadmeViewer / ReadmeContent | README表示・翻訳のテスト | 低 |
| CommitChart | チャート描画のテスト | 低 |

---

## セットアップ

```bash
# 単体・コンポーネントテスト
npx vitest --run

# E2Eテスト
npx playwright test

# watchモード（開発中）
npx vitest
```

### 設定ファイル

| ファイル | 用途 |
|---------|------|
| `vitest.config.ts` | Vitest設定（jsdom環境、`@/` エイリアス） |
| `vitest.setup.ts` | jest-dom拡張 + テスト間のDOM cleanup |
| `playwright.config.ts` | Playwright設定 |

### 注意事項

- Node.js 22以上が必要（vitest の依存 rolldown が `node:util#styleText` を使用）
- `vitest.setup.ts` で `afterEach(cleanup)` を呼んでいる（testing-library の自動cleanup が `globals: true` 未設定のため動作しないため）
