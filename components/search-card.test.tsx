import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchCard } from "@/components/search-card";

const mockPush = vi.fn();
const mockSearchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => mockSearchParams,
}));

describe("SearchCard", () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  // ── 正常系 ──

  it("フィルタ変更が入力に反映される", async () => {
    const user = userEvent.setup();
    render(<SearchCard />);

    const input = screen.getByPlaceholderText("React フォーム");
    await user.type(input, "vue");
    expect(input).toHaveValue("vue");
  });

  it("入力して検索ボタンで router.push が呼ばれる", async () => {
    const user = userEvent.setup();
    render(<SearchCard />);

    const input = screen.getByPlaceholderText("React フォーム");
    await user.type(input, "react");
    await user.click(screen.getByRole("button", { name: "検索" }));

    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining("q=react"));
  });

  // ── 異常系 ──

  it("空入力で検索ボタンを押すとバリデーションメッセージが表示される", async () => {
    const user = userEvent.setup();
    render(<SearchCard />);

    await user.click(screen.getByRole("button", { name: "検索" }));

    expect(
      screen.getByText("検索キーワードを入力してください"),
    ).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("同一条件エラー後に空検索すると、同一条件メッセージが消えて空入力メッセージのみ表示される", async () => {
    const user = userEvent.setup();
    // currentParams を filtersToParams の出力と一致させる
    mockSearchParams.set("q", "react");
    render(
      <SearchCard
        initialFilters={{
          q: "react",
          sort: "stars",
          stars: "any",
          pushed: "any",
        }}
      />,
    );

    // 同一条件で検索 → 同一条件メッセージ
    await user.click(screen.getByRole("button", { name: "検索" }));
    expect(
      screen.getByText(
        "検索条件が変更されていません。条件を変更して再度検索してください。",
      ),
    ).toBeInTheDocument();

    // 入力をクリアして空で検索
    const input = screen.getByPlaceholderText("React フォーム");
    await user.clear(input);
    await user.click(screen.getByRole("button", { name: "検索" }));

    // 空入力メッセージのみ表示、同一条件メッセージは消える
    expect(
      screen.getByText("検索キーワードを入力してください"),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(
        "検索条件が変更されていません。条件を変更して再度検索してください。",
      ),
    ).not.toBeInTheDocument();
  });

  it("入力を開始するとエラーメッセージが消える", async () => {
    const user = userEvent.setup();
    render(<SearchCard />);

    // まず空で検索してエラーを出す
    await user.click(screen.getByRole("button", { name: "検索" }));
    expect(
      screen.getByText("検索キーワードを入力してください"),
    ).toBeInTheDocument();

    // 入力を始めるとメッセージが消える
    const input = screen.getByPlaceholderText("React フォーム");
    await user.type(input, "r");
    expect(
      screen.queryByText("検索キーワードを入力してください"),
    ).not.toBeInTheDocument();
  });
});
