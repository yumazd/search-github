# テスト実行結果

実行日: 2026-03-25
Vitest v4.1.1 / Node v22.22.2

## サマリ

| 項目 | 結果 |
|------|------|
| テストファイル | 6 passed (6) |
| テストケース | 46 passed (46) |
| 実行時間 | 約 3s |

## テストファイル別の結果

### domain/query-builder.test.ts（10 tests）

| テスト | 結果 |
|--------|------|
| buildSearchQuery > キーワードのみの場合、qにキーワードとデフォルト修飾子が含まれる | ✅ |
| buildSearchQuery > translatedQ が渡された場合、元のqではなく翻訳済みキーワードが使われる | ✅ |
| buildSearchQuery > Starフィルタが指定された場合、stars:>=N が付与される | ✅ |
| buildSearchQuery > pushedフィルタが指定された場合、pushed:>YYYY-MM-DD が付与される | ✅ |
| buildSearchQuery > 複合条件が正しく結合される | ✅ |
| buildSearchQuery > ソートが best の場合、sort/order が付与されない | ✅ |
| buildSearchQuery > ソートが stars の場合、sort=stars, order=desc が付与される | ✅ |
| buildSearchQuery > 空文字キーワードの場合、フィルタ修飾子のみのクエリになる | ✅ |
| buildSearchQuery > 未定義の pushed 値の場合、pushed 条件が付与されない | ✅ |
| buildSearchQuery > stars が any の場合、stars 条件が付与されない | ✅ |

### lib/format.test.ts（11 tests）

| テスト | 結果 |
|--------|------|
| formatCount > 1000未満はそのまま文字列になる | ✅ |
| formatCount > 1000以上は k 表記になる | ✅ |
| formatCount > 0 はそのまま文字列になる | ✅ |
| formatCount > 負数はそのまま文字列になる | ✅ |
| formatRelativeDate > 今日の日付は「今日」になる | ✅ |
| formatRelativeDate > 昨日の日付は「昨日」になる | ✅ |
| formatRelativeDate > 数日前は「N日前」になる | ✅ |
| formatRelativeDate > 数ヶ月前は「Nヶ月前」になる | ✅ |
| formatRelativeDate > 1年以上前は「N年前」になる | ✅ |
| formatRelativeDate > 未来の日付は「今日」になる | ✅ |
| formatDate > 日本語ロケールの日付文字列を返す | ✅ |

### server/search.test.ts（6 tests）

| テスト | 結果 |
|--------|------|
| containsJapanese > ひらがなを含む場合 true | ✅ |
| containsJapanese > カタカナを含む場合 true | ✅ |
| containsJapanese > 漢字を含む場合 true | ✅ |
| containsJapanese > 日英混在の場合 true | ✅ |
| containsJapanese > 英語のみの場合 false | ✅ |
| containsJapanese > 空文字の場合 false | ✅ |

### app/result/_components/ai-description.test.tsx（3 tests）

| テスト | 結果 |
|--------|------|
| AiDescription > キャッシュがない場合はスケルトンが表示される | ✅ |
| AiDescription > sessionStorageにキャッシュがある場合は初回レンダリングから翻訳が表示される | ✅ |
| AiDescription > キャッシュに該当リポジトリがない場合はスケルトンが表示される | ✅ |

### app/result/_components/repo-card.test.tsx（11 tests）

| テスト | 結果 |
|--------|------|
| RepoCard > リポジトリ名が表示される | ✅ |
| RepoCard > Star数がフォーマットされて表示される | ✅ |
| RepoCard > description が表示される | ✅ |
| RepoCard > 言語が表示される | ✅ |
| RepoCard > ライセンスが表示される | ✅ |
| RepoCard > トピックが表示される | ✅ |
| RepoCard > リンク先が /repositories/{full_name} になっている | ✅ |
| RepoCard > description が null の場合、description 行が描画されない | ✅ |
| RepoCard > language が null の場合、言語表示が出ない | ✅ |
| RepoCard > license が null の場合、ライセンスバッジが出ない | ✅ |
| RepoCard > topics が空配列の場合、トピックセクションが出ない | ✅ |

### components/search-card.test.tsx（5 tests）

| テスト | 結果 |
|--------|------|
| SearchCard > フィルタ変更が入力に反映される | ✅ |
| SearchCard > 入力して検索ボタンで router.push が呼ばれる | ✅ |
| SearchCard > 空入力で検索ボタンを押すとバリデーションメッセージが表示される | ✅ |
| SearchCard > 同一条件エラー後に空検索すると、同一条件メッセージが消えて空入力メッセージのみ表示される | ✅ |
| SearchCard > 入力を開始するとエラーメッセージが消える | ✅ |
