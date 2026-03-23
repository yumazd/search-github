import { NextRequest, NextResponse } from "next/server";
import { searchRepositories } from "@/server/github";
import { translateSearchQuery, summarizeDescriptions } from "@/server/ai";
import { buildSearchQuery } from "@/domain/query-builder";
import type { SearchFilters } from "@/types/search";

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;

  const filters: SearchFilters = {
    q: sp.get("q") || "",
    type: sp.get("type") || "all",
    lang: sp.get("lang") || "all",
    sort: sp.get("sort") || "best",
    stars: sp.get("stars") || "any",
    pushed: sp.get("pushed") || "any",
    license: sp.get("license") || "any",
    size: sp.get("size") || "any",
  };
  const page = Number(sp.get("page") || "1");

  if (!filters.q) {
    return NextResponse.json(
      { error: "検索キーワードを入力してください" },
      { status: 400 },
    );
  }

  const aiEnabled = process.env.AI_ENABLED !== "false";

  try {
    // Step 1: Translate query to English (skip if AI disabled)
    const translatedQ = aiEnabled
      ? await translateSearchQuery(filters.q)
      : filters.q;

    // Step 2: Build GitHub search query
    const query = buildSearchQuery(filters, translatedQ);

    // Step 3: Search GitHub
    const result = await searchRepositories({
      ...query,
      page,
      per_page: 30,
    });

    // Step 4: Summarize descriptions with AI (skip if AI disabled)
    const summaries = aiEnabled
      ? await summarizeDescriptions(
          result.items.map((r) => ({
            full_name: r.full_name,
            description: r.description,
            topics: r.topics || [],
          })),
        )
      : {};

    // Merge summaries into items
    const items = result.items.map((r) => ({
      ...r,
      aiDescription: summaries[r.full_name] || r.description || "",
    }));

    return NextResponse.json({
      total_count: result.total_count,
      items,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "検索中にエラーが発生しました";

    if (message.includes("403")) {
      return NextResponse.json(
        { error: "APIレート制限に達しました。しばらく待ってから再度お試しください。" },
        { status: 429 },
      );
    }
    if (message.includes("422")) {
      return NextResponse.json(
        { error: "検索条件を変えて再度お試しください。" },
        { status: 422 },
      );
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
