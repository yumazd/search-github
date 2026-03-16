# テスト方針

## テストの種類と範囲

| 種類 | 対象 | ツール |
|------|------|--------|
| 単体テスト | domain層の純ロジック | Vitest |
| コンポーネントテスト | UIコンポーネントの描画・操作 | Vitest + React Testing Library |
| APIモック | GitHub API / Claude APIのモック | MSW (Mock Service Worker) |
| E2Eテスト | 検索→一覧→詳細の画面遷移 | Playwright |

---

## 単体テスト（domain）

| ファイル | テスト内容 |
|---------|-----------|
| `query-builder.ts` | フィルタ値 → qクエリ文字列の変換が正しいか |
| `search-params.ts` | URLパラメータのパース・生成が正しいか |
| `lib/date.ts` | 相対日付変換（「3日前」等） |
| `lib/format.ts` | 数値フォーマット（1200 → 1.2k） |

---

## コンポーネントテスト

| コンポーネント | テスト内容 |
|--------------|-----------|
| `search-form` | フィルタ変更でsearchParamsが更新されるか |
| `repository-card` | 各項目が表示されるか、クリックで遷移するか |
| `repository-list` | 0件時の空状態表示 |
| `language-bar` | 割合が正しく表示されるか |
| `ai-summary` | ローディング中はスケルトン、表示後に内容が出るか |
| `readme-viewer` | マークダウンがHTMLにレンダリングされるか |

---

## 異常系テスト

| 異常 | テスト場所 | テスト内容 |
|------|-----------|-----------|
| GitHub API 422（不正クエリ） | コンポーネントテスト（`repository-list`） | エラーメッセージが表示されるか |
| GitHub API 403（レート制限） | コンポーネントテスト（`repository-list`） | レート制限メッセージ + リセット時刻が表示されるか |
| GitHub API 5xx | コンポーネントテスト（`repository-list`） | 接続エラーメッセージが表示されるか |
| Claude API エラー | コンポーネントテスト（`ai-summary`, `readme-viewer`） | フォールバック（元のdescription/README）が表示されるか |
| ネットワークエラー | E2E | オフライン時にエラー表示が出るか |
| リポジトリ404 | コンポーネントテスト（詳細ページ） | not-found表示が出るか |
| descriptionなし | コンポーネントテスト（`repository-card`） | 「概要なし」等が表示されるか |
| 検索結果0件 | コンポーネントテスト（`repository-list`） | 空状態メッセージが表示されるか |

---

## APIモック（MSW）

| モック対象 | 理由 |
|-----------|------|
| `GET /search/repositories` | レート制限を気にせずテスト |
| `GET /repos/{owner}/{repo}` | 固定データで安定したテスト |
| `GET /repos/{owner}/{repo}/languages` | 同上 |
| `GET /repos/{owner}/{repo}/readme` | 同上 |
| `GET /repos/{owner}/{repo}/stats/commit_activity` | 同上 |
| Claude API | AI要約・翻訳の応答を固定 |

---

## E2Eテスト（Playwright）

| シナリオ | 内容 |
|---------|------|
| 検索→一覧表示 | キーワード入力→検索→カードが表示される |
| フィルタ適用 | 言語・Star数等を変更→結果が変わる |
| 詳細遷移→戻る | カードクリック→詳細表示→戻る→一覧が維持されている |
| 0件表示 | 存在しないワードで検索→空状態が出る |
| エラー表示 | API障害時にエラーメッセージが出る |

---

## 優先度

| 優先度 | 対象 | 理由 |
|--------|------|------|
| 高 | domain 単体テスト | 純ロジック。壊れると全体に影響 |
| 高 | コンポーネントテスト | 課題要件でテスト必須 |
| 中 | E2Eテスト | あると評価上がるが工数かかる |
| 低 | server層のテスト | MSWでモックするので間接的にカバー |
