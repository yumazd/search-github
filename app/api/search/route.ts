import { NextRequest, NextResponse } from "next/server";
import { executeSearch, RESULTS_PER_PAGE } from "@/server/search";
import type { SearchFilters } from "@/types/search";

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;

  const filters: SearchFilters = {
    q: sp.get("q") || "",
    sort: sp.get("sort") || "best",
    stars: sp.get("stars") || "any",
    pushed: sp.get("pushed") || "any",
  };
  const page = Number(sp.get("page") || "1");

  if (!filters.q) {
    return NextResponse.json(
      { error: "検索キーワードを入力してください" },
      { status: 400 },
    );
  }

  try {
    const result = await executeSearch(filters, page);
    return NextResponse.json({
      total_count: result.total_count,
      items: result.items,
      per_page: RESULTS_PER_PAGE,
    });
  } catch (error) {
    const rawMessage = error instanceof Error ? error.message : "";

    if (rawMessage.includes("403")) {
      return NextResponse.json(
        { error: "APIレート制限に達しました。しばらく待ってから再度お試しください。" },
        { status: 429 },
      );
    }
    if (rawMessage.includes("422")) {
      return NextResponse.json(
        { error: "検索条件を変えて再度お試しください。" },
        { status: 422 },
      );
    }

    console.error("[search] Unexpected error:", error);
    return NextResponse.json(
      { error: "検索中にエラーが発生しました" },
      { status: 500 },
    );
  }
}
