import { Suspense } from "react";
import type { Metadata } from "next";
import type { SearchFilters } from "@/types/search";
import { DEFAULT_FILTERS } from "@/types/search";
import { executeSearch } from "@/server/search";
import { RESULTS_PER_PAGE, MAX_WIDTH_WIDE } from "@/lib/constants";
import { SearchCard } from "@/components/search-card";
import { RepoCard } from "./_components/repo-card";
import { LoadMore } from "./_components/load-more";
import { SortSelect } from "./_components/sort-select";
import { Breadcrumb } from "@/components/breadcrumb";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : "";
  if (!q) {
    return { title: "検索結果" };
  }
  return {
    title: `「${q}」の検索結果`,
    description: `「${q}」に関連するGitHubリポジトリの検索結果`,
  };
}

function paramsToFilters(
  searchParams: Record<string, string | string[] | undefined>,
): SearchFilters {
  const get = (key: string) => {
    const v = searchParams[key];
    return typeof v === "string" ? v : undefined;
  };
  return {
    q: get("q") || DEFAULT_FILTERS.q,
    sort: get("sort") || DEFAULT_FILTERS.sort,
    stars: get("stars") || DEFAULT_FILTERS.stars,
    pushed: get("pushed") || DEFAULT_FILTERS.pushed,
  };
}

export default async function ResultPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const filters = paramsToFilters(params);

  // No query → show empty state
  if (!filters.q.trim()) {
    return (
      <div className={`mx-auto space-y-15 ${MAX_WIDTH_WIDE}`}>
        <Breadcrumb
          items={[{ label: "トップ", href: "/" }, { label: "検索結果" }]}
        />
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight font-display">
            リポジトリを探す
          </h1>
          <p className="text-sm text-gray-200">
            日本語キーワードもAIが英語に変換して検索してくれます。
          </p>
        </div>
        <div className="lg:grid lg:grid-cols-5 lg:gap-10 space-y-10">
          <div className="lg:col-span-2 space-y-5 lg:sticky lg:top-20 lg:self-start">
            <Suspense>
              <SearchCard initialFilters={filters} />
            </Suspense>
          </div>
          <div className="lg:col-span-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-10 text-center">
              <p className="text-gray-400">検索キーワードを入力してください</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fetch first page server-side
  let result;
  let error: string | null = null;
  try {
    result = await executeSearch(filters, 1);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg.includes("403")) {
      error =
        "APIレート制限に達しました。しばらく待ってから再度お試しください。";
    } else if (msg.includes("422")) {
      error = "検索条件を変えて再度お試しください。";
    } else {
      error = "検索中にエラーが発生しました";
    }
  }

  const items = result?.items ?? [];
  const totalCount = result?.total_count ?? 0;
  const translatedQ = result?.translatedQ;
  const hasMore =
    items.length === RESULTS_PER_PAGE && totalCount > RESULTS_PER_PAGE;

  return (
    <div className={`mx-auto space-y-15 ${MAX_WIDTH_WIDE}`}>
      <Breadcrumb
        items={[{ label: "トップ", href: "/" }, { label: "検索結果" }]}
      />
      <div className="lg:grid lg:grid-cols-5 lg:gap-10 space-y-10">
        <div className="lg:col-span-2 space-y-5 lg:sticky lg:top-20 lg:self-start">
          <Suspense>
            <SearchCard initialFilters={filters} />
          </Suspense>
        </div>

        <div className="space-y-3 lg:col-span-3">
          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          {!error && (
            <>
              <div className="flex items-center justify-between gap-5">
                <Suspense>
                  <SortSelect currentSort={filters.sort} />
                </Suspense>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-5">
                  <p className="text-sm text-gray-200">
                    {totalCount.toLocaleString()}件のリポジトリ
                  </p>
                  {translatedQ && (
                    <p className="text-xs text-gray-200">
                      検索ワード:{" "}
                      <span className="text-gray-300">{translatedQ}</span>
                    </p>
                  )}
                </div>
              </div>

              {items.length === 0 && (
                <div className="rounded-xl border border-white/10 bg-white/5 p-10 text-center">
                  <p className="text-gray-400">
                    該当するリポジトリが見つかりませんでした
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    フィルタ条件を緩めて再度お試しください
                  </p>
                </div>
              )}

              {items.map((repo) => (
                <RepoCard key={repo.id} repo={repo} />
              ))}

              {hasMore && (
                <LoadMore
                  key={JSON.stringify(filters)}
                  filters={filters}
                  initialHasMore={hasMore}
                />
              )}

              {!hasMore && items.length > 0 && (
                <p className="py-4 text-center text-sm text-gray-500">
                  すべての結果を表示しました
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
