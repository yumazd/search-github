import { test, expect } from "@playwright/test";

test.describe("検索・一覧", () => {
  // ── 正常系 ──

  test("キーワード入力→検索→結果カードが表示される", async ({ page }) => {
    await page.goto("/");
    await page.getByPlaceholder("React フォーム").fill("react");
    await page.getByRole("button", { name: "検索" }).click();

    await page.waitForURL(/\/result\?/);
    await expect(page.locator("a[href^='/repositories/']").first()).toBeVisible(
      {
        timeout: 15000,
      },
    );
  });

  test("フィルタ変更→検索→結果が切り替わる", async ({ page }) => {
    await page.goto("/");
    await page.getByPlaceholder("React フォーム").fill("python");
    await page.getByRole("button", { name: "500+" }).click();
    await page.getByRole("button", { name: "検索" }).click();

    await page.waitForURL(/\/result\?/);
    expect(page.url()).toContain("stars=500");
    await expect(page.locator("a[href^='/repositories/']").first()).toBeVisible(
      {
        timeout: 15000,
      },
    );
  });

  test("ソート変更→URLが更新され結果が再取得される", async ({ page }) => {
    await page.goto("/result?q=react");
    await expect(page.locator("a[href^='/repositories/']").first()).toBeVisible(
      {
        timeout: 15000,
      },
    );

    // ソートを変更
    await page.getByRole("combobox").click();
    await page.getByRole("option", { name: "更新日順" }).click();

    await page.waitForURL(/sort=updated/);
    expect(page.url()).toContain("sort=updated");
  });

  test("無限スクロール→追加カードが読み込まれる", async ({ page }) => {
    await page.goto("/result?q=javascript");
    await expect(page.locator("a[href^='/repositories/']").first()).toBeVisible(
      {
        timeout: 15000,
      },
    );

    const initialCount = await page
      .locator("a[href^='/repositories/']")
      .count();

    // 最下部までスクロール
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // 追加カードが読み込まれるまで待つ
    await expect(async () => {
      const newCount = await page.locator("a[href^='/repositories/']").count();
      expect(newCount).toBeGreaterThan(initialCount);
    }).toPass({ timeout: 15000 });
  });

  // ── 異常系 ──

  test("空入力で検索→バリデーションメッセージが表示される", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "検索" }).click();

    await expect(
      page.getByText("検索キーワードを入力してください"),
    ).toBeVisible();
  });

  test("結果0件のクエリ→空状態メッセージが表示される", async ({ page }) => {
    await page.goto("/result?q=xyznonexistent12345abcdef");

    await expect(
      page.getByText("該当するリポジトリが見つかりませんでした"),
    ).toBeVisible({ timeout: 15000 });
  });

  test("/result にクエリなしでアクセス→空状態が表示される", async ({
    page,
  }) => {
    await page.goto("/result");

    await expect(
      page.getByText("検索キーワードを入力してください"),
    ).toBeVisible();
  });
});

test.describe("詳細ページ", () => {
  // ── 正常系 ──

  test("カードクリック→詳細ページ遷移、リポジトリ情報が表示される", async ({
    page,
  }) => {
    await page.goto("/result?q=react");
    const firstCard = page.locator("a[href^='/repositories/']").first();
    await expect(firstCard).toBeVisible({ timeout: 15000 });

    const repoName = await firstCard
      .locator("span.font-semibold")
      .textContent();
    await firstCard.click();

    await page.waitForURL(/\/repositories\//);
    await expect(page.locator("h1")).toContainText(repoName!.split("/")[1]);
  });

  test("「検索結果に戻る」で一覧に戻れる", async ({ page }) => {
    await page.goto("/result?q=react");
    const firstCard = page.locator("a[href^='/repositories/']").first();
    await expect(firstCard).toBeVisible({ timeout: 15000 });
    await firstCard.click();

    await page.waitForURL(/\/repositories\//);
    await page.getByText("検索結果に戻る").click();

    await page.waitForURL(/\/result\?/);
    await expect(page.locator("a[href^='/repositories/']").first()).toBeVisible(
      {
        timeout: 15000,
      },
    );
  });

  // ── 異常系 ──

  test("存在しないリポジトリのURLに直接アクセス→404ページが表示される", async ({
    page,
  }) => {
    await page.goto("/repositories/nonexistent-user-xyz/nonexistent-repo-abc");

    await expect(page.getByText("リポジトリが見つかりません")).toBeVisible({
      timeout: 15000,
    });
  });
});
