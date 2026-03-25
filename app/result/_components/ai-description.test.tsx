import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { AiDescription } from "./ai-description";

vi.mock("@/server/actions", () => ({
  summarizeDescriptionsAction: vi.fn(() => Promise.resolve({})),
}));

beforeEach(() => {
  sessionStorage.clear();
});

describe("AiDescription", () => {
  it("キャッシュがない場合はスケルトンが表示される", () => {
    render(
      <AiDescription
        fullName="facebook/react"
        description="A library"
        topics={["react"]}
      />,
    );
    expect(screen.queryByText("AI翻訳")).not.toBeInTheDocument();
  });

  it("sessionStorageにキャッシュがある場合は初回レンダリングから翻訳が表示される", () => {
    sessionStorage.setItem(
      "ai-descriptions",
      JSON.stringify({ "facebook/react": "UIライブラリ" }),
    );

    render(
      <AiDescription
        fullName="facebook/react"
        description="A library"
        topics={["react"]}
      />,
    );
    expect(screen.getByText("UIライブラリ")).toBeInTheDocument();
    expect(screen.getByText("AI翻訳")).toBeInTheDocument();
  });

  it("キャッシュに該当リポジトリがない場合はスケルトンが表示される", () => {
    sessionStorage.setItem(
      "ai-descriptions",
      JSON.stringify({ "other/repo": "別のリポジトリ" }),
    );

    render(
      <AiDescription
        fullName="facebook/react"
        description="A library"
        topics={["react"]}
      />,
    );
    expect(screen.queryByText("AI翻訳")).not.toBeInTheDocument();
  });
});
