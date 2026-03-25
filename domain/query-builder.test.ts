import { describe, it, expect } from "vitest";
import { buildSearchQuery } from "@/domain/query-builder";

describe("buildSearchQuery", () => {
  // ── 正常系 ──

  it("キーワードのみの場合、qにキーワードとデフォルト修飾子が含まれる", () => {
    const result = buildSearchQuery({
      q: "react",
      sort: "best",
      stars: "any",
      pushed: "any",
    });
    expect(result.q).toContain("react");
    expect(result.q).toContain("archived:false");
    expect(result.q).toContain("fork:false");
    expect(result.sort).toBeUndefined();
    expect(result.order).toBeUndefined();
  });

  it("translatedQ が渡された場合、元のqではなく翻訳済みキーワードが使われる", () => {
    const result = buildSearchQuery(
      { q: "状態管理", sort: "best", stars: "any", pushed: "any" },
      "state management",
    );
    expect(result.q).toContain("state management");
    expect(result.q).not.toContain("状態管理");
  });

  it("Starフィルタが指定された場合、stars:>=N が付与される", () => {
    const result = buildSearchQuery({
      q: "react",
      sort: "best",
      stars: "100",
      pushed: "any",
    });
    expect(result.q).toContain("stars:>=100");
  });

  it("pushedフィルタが指定された場合、pushed:>YYYY-MM-DD が付与される", () => {
    const result = buildSearchQuery({
      q: "react",
      sort: "best",
      stars: "any",
      pushed: "1m",
    });
    expect(result.q).toMatch(/pushed:>\d{4}-\d{2}-\d{2}/);
  });

  it("複合条件が正しく結合される", () => {
    const result = buildSearchQuery({
      q: "react",
      sort: "stars",
      stars: "500",
      pushed: "6m",
    });
    expect(result.q).toContain("react");
    expect(result.q).toContain("stars:>=500");
    expect(result.q).toMatch(/pushed:>\d{4}-\d{2}-\d{2}/);
    expect(result.q).toContain("archived:false");
    expect(result.q).toContain("fork:false");
    expect(result.sort).toBe("stars");
    expect(result.order).toBe("desc");
  });

  it("ソートが best の場合、sort/order が付与されない", () => {
    const result = buildSearchQuery({
      q: "react",
      sort: "best",
      stars: "any",
      pushed: "any",
    });
    expect(result.sort).toBeUndefined();
    expect(result.order).toBeUndefined();
  });

  it("ソートが stars の場合、sort=stars, order=desc が付与される", () => {
    const result = buildSearchQuery({
      q: "react",
      sort: "stars",
      stars: "any",
      pushed: "any",
    });
    expect(result.sort).toBe("stars");
    expect(result.order).toBe("desc");
  });

  // ── 異常系 ──

  it("空文字キーワードの場合、フィルタ修飾子のみのクエリになる", () => {
    const result = buildSearchQuery({
      q: "",
      sort: "best",
      stars: "100",
      pushed: "any",
    });
    expect(result.q).toContain("stars:>=100");
    expect(result.q).toContain("archived:false");
  });

  it("未定義の pushed 値の場合、pushed 条件が付与されない", () => {
    const result = buildSearchQuery({
      q: "react",
      sort: "best",
      stars: "any",
      pushed: "3y",
    });
    expect(result.q).not.toContain("pushed:");
  });

  it("stars が any の場合、stars 条件が付与されない", () => {
    const result = buildSearchQuery({
      q: "react",
      sort: "best",
      stars: "any",
      pushed: "any",
    });
    expect(result.q).not.toContain("stars:");
  });
});
