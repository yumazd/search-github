import { describe, it, expect, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { containsJapanese } from "@/server/search";

describe("containsJapanese", () => {
  it("ひらがなを含む場合 true", () => {
    expect(containsJapanese("あいう")).toBe(true);
  });

  it("カタカナを含む場合 true", () => {
    expect(containsJapanese("リアクト")).toBe(true);
  });

  it("漢字を含む場合 true", () => {
    expect(containsJapanese("状態管理")).toBe(true);
  });

  it("日英混在の場合 true", () => {
    expect(containsJapanese("react フォーム")).toBe(true);
  });

  it("英語のみの場合 false", () => {
    expect(containsJapanese("react form")).toBe(false);
  });

  it("空文字の場合 false", () => {
    expect(containsJapanese("")).toBe(false);
  });
});
