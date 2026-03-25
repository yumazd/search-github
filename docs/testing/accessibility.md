# アクセシビリティチェック結果

実施日: 2026-03-25

## サマリ

| 深刻度 | 件数 | 対応済み |
|--------|------|---------|
| Critical | 1 | 1 |
| Warning | 21 | 17 |
| Info | 13 | 4 |

## Critical

| # | ファイル | 内容 | 対応 |
|---|---------|------|------|
| 1 | `components/search-card.tsx` | 検索入力に `<label>` も `aria-label` もない | ✅ `aria-label="検索キーワード"` を追加 |

## Warning

### アイコン・SVG

| # | ファイル | 内容 | 対応 |
|---|---------|------|------|
| 2 | `app/result/_components/repo-card.tsx` | Star, GitFork, Eye, CircleDot アイコンに `aria-hidden` がない | ✅ `aria-hidden="true"` を追加 |
| 3 | `app/repositories/[owner]/[repo]/page.tsx` | 詳細ページの統計アイコン同上 | ✅ `aria-hidden="true"` を追加 |
| 4 | `components/search-card.tsx` | 入力欄の Search アイコンに `aria-hidden` がない | ✅ `aria-hidden="true"` を追加 |
| 5 | `app/result/_components/ai-description.tsx` | Languages アイコンに `aria-hidden` がない | ✅ `aria-hidden="true"` を追加 |
| 6 | `app/repositories/[owner]/[repo]/_components/ai-summary.tsx` | Sparkles アイコンに `aria-hidden` がない | ✅ `aria-hidden="true"` を追加 |
| 7 | `app/repositories/[owner]/[repo]/_components/back-button.tsx` | ArrowLeft アイコンに `aria-hidden` がない | ✅ `aria-hidden="true"` を追加 |

### 言語カラードット

| # | ファイル | 内容 | 対応 |
|---|---------|------|------|
| 8 | `app/result/_components/repo-card.tsx` | 言語カラードット（span）に `aria-hidden` がない | ✅ `aria-hidden="true"` を追加 |
| 9 | `app/repositories/[owner]/[repo]/page.tsx` | 詳細ページの言語カラードット同上 | ✅ `aria-hidden="true"` を追加 |
| 10 | `app/repositories/[owner]/[repo]/page.tsx` | LanguageBar のカラーバーにARIA属性がない | ✅ `aria-hidden="true"` を追加 |

### 見出し階層

| # | ファイル | 内容 | 対応 |
|---|---------|------|------|
| 11 | `app/repositories/[owner]/[repo]/page.tsx` | セクション見出しが `h3` で `h2` をスキップしている | ✅ `h3` → `h2` に変更 |
| 12 | `app/repositories/[owner]/[repo]/_components/commit-chart-client.tsx` | コミットチャート見出しが `h3` | ✅ `h2` に変更 |
| 13 | `app/repositories/[owner]/[repo]/_components/readme-content.tsx` | README.md 見出しが `h3` | ✅ `h2` に変更 |

### ARIA属性

| # | ファイル | 内容 | 対応 |
|---|---------|------|------|
| 14 | `components/search-card.tsx` | エラーメッセージに `role="alert"` がない | ✅ `role="alert"` を追加 |
| 15 | `app/result/_components/load-more.tsx` | ローディング中の状態通知がない | ✅ `role="status"` と `aria-label="結果を読み込み中"` を追加 |
| 16 | `app/repositories/[owner]/[repo]/_components/commit-chart-client.tsx` | チャートに `role="img"` と説明がない | ✅ `role="img"` と `aria-label` を追加 |

### フォーム

| # | ファイル | 内容 | 対応 |
|---|---------|------|------|
| 17 | `components/search-card.tsx` | フィルタボタン群がフィールドセットで囲まれていない | ✅ `role="group"` と `aria-label` で関連を明示 |

### カラーコントラスト

| # | ファイル | 内容 | 対応 |
|---|---------|------|------|
| 18 | `components/search-card.tsx` | `text-gray-500` がダーク背景に対してコントラスト不足の可能性 | 未対応（要実機検証） |
| 19 | `components/search-card.tsx` | `placeholder:text-gray-400` のコントラスト不足の可能性 | 未対応（要実機検証） |
| 20 | `app/result/page.tsx` | エラーメッセージの `text-red-300` のコントラスト | 未対応（要実機検証） |

### その他

| # | ファイル | 内容 | 対応 |
|---|---------|------|------|
| 21 | `app/repositories/[owner]/[repo]/page.tsx` | アバター画像の alt がログイン名のみ | ✅ `alt={`${login} のアバター`}` に変更 |
| 22 | `app/repositories/[owner]/[repo]/_components/readme-content.tsx` | 翻訳切替ボタンに `aria-pressed` がない | 未対応 |

## Info

| # | ファイル | 内容 | 対応 |
|---|---------|------|------|
| 23 | `app/layout.tsx` | `<html lang="ja">` 設定済み | — OK |
| 24 | `components/ui/button.tsx` | `focus-visible:ring-3` によるフォーカスインジケーターあり | — OK |
| 25 | `components/ui/input.tsx` | `focus-visible:ring-3` あり | — OK |
| 26 | `app/layout.tsx` | スキップナビゲーションリンクがない | ✅ 追加済み |
| 27 | `components/header.tsx` | GitHub アイコンが装飾用だが `aria-hidden` がない | ✅ `aria-hidden="true"` を追加 |
| 28 | `app/repositories/[owner]/[repo]/page.tsx` | 外部リンクに「外部リンク」の通知がない | ✅ `aria-label` に「（外部サイト）」を追加 |
| 29 | `app/result/_components/repo-card.tsx` | カードリンクに `aria-label` があるとスクリーンリーダーに親切 | ✅ `aria-label` を追加 |
| 30 | `components/search-card.tsx` | Loader2 アイコンに `aria-hidden` がない | ✅ `aria-hidden="true"` を追加 |
| 31 | `app/repositories/[owner]/[repo]/page.tsx` | ExternalLink, Globe アイコンに `aria-hidden` がない | ✅ `aria-hidden="true"` を追加 |
| 32 | `app/repositories/[owner]/[repo]/_components/readme-content.tsx` | ネイティブ `<button>` 使用 | — OK |
| 33 | `components/ui/button.tsx` | ダーク背景でのフォーカスリング視認性 | 未対応（要実機検証） |
| 34 | `components/ui/input.tsx` | 同上 | 未対応（要実機検証） |
| 35 | `components/search-card.tsx` | フィルタセクションの `aria-labelledby` | ✅ `role="group"` + `aria-label` で対応済み（#17） |

## 追加対応

| # | ファイル | 内容 | 対応 |
|---|---------|------|------|
| 36 | `app/layout.tsx` | iOS Safari で input/select フォーカス時に自動ズームする | ✅ viewport に `maximumScale: 1` を追加 |
