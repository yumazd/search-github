"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useInView } from "react-intersection-observer";
import { Star, GitFork, Eye, CircleDot, Loader2 } from "lucide-react";
import { LANGUAGE_COLORS } from "@/lib/language-colors";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { SearchFilters } from "@/types/search";
import { DEFAULT_FILTERS } from "@/types/search";
import { SearchCard, SORT_OPTIONS } from "@/app/components/search-card";

interface SearchRepo {
  id: number;
  full_name: string;
  name: string;
  owner: { login: string; avatar_url: string };
  description: string | null;
  aiDescription: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  license: { spdx_id: string } | null;
  topics: string[];
  updated_at: string;
}

function formatCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return String(count);
}

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "今日";
  if (diffDays === 1) return "昨日";
  if (diffDays < 30) return `${diffDays}日前`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}ヶ月前`;
  return `${Math.floor(diffDays / 365)}年前`;
}

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-white/30 bg-white/5 p-5 backdrop-blur-3xl animate-pulse">
      <div className="flex items-center gap-2.5">
        <div className="h-7 w-7 rounded-full bg-white/10" />
        <div className="h-4 w-48 rounded bg-white/10" />
      </div>
      <div className="mt-3 space-y-2">
        <div className="h-3 w-full rounded bg-white/10" />
        <div className="h-3 w-3/4 rounded bg-white/10" />
      </div>
      <div className="mt-3 flex gap-3">
        <div className="h-3 w-16 rounded bg-white/10" />
        <div className="h-3 w-12 rounded bg-white/10" />
        <div className="h-3 w-12 rounded bg-white/10" />
      </div>
    </div>
  );
}

function filtersToParams(filters: SearchFilters): URLSearchParams {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== DEFAULT_FILTERS[key as keyof SearchFilters]) {
      params.set(key, value);
    }
  });
  return params;
}

function paramsToFilters(searchParams: URLSearchParams): SearchFilters {
  return {
    q: searchParams.get("q") || DEFAULT_FILTERS.q,
    type: searchParams.get("type") || DEFAULT_FILTERS.type,
    lang: searchParams.get("lang") || DEFAULT_FILTERS.lang,
    sort: searchParams.get("sort") || DEFAULT_FILTERS.sort,
    stars: searchParams.get("stars") || DEFAULT_FILTERS.stars,
    pushed: searchParams.get("pushed") || DEFAULT_FILTERS.pushed,
    license: searchParams.get("license") || DEFAULT_FILTERS.license,
    size: searchParams.get("size") || DEFAULT_FILTERS.size,
  };
}

export default function ResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [filters, setFilters] = useState<SearchFilters>(() =>
    paramsToFilters(searchParams),
  );
  const [repos, setRepos] = useState<SearchRepo[]>([]);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchResults = useCallback(
    async (
      currentFilters: SearchFilters,
      pageNum: number,
      append: boolean,
    ) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setError(null);
      }

      try {
        const params = new URLSearchParams();
        Object.entries(currentFilters).forEach(([key, value]) => {
          if (value) params.set(key, value);
        });
        params.set("page", String(pageNum));

        const res = await fetch(`/api/search?${params.toString()}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "検索中にエラーが発生しました");
        }

        const newHasMore = data.items.length === 30 && pageNum * 30 < 1000;

        if (append) {
          setRepos((prev) => [...prev, ...data.items]);
        } else {
          setRepos(data.items);
          setTotalCount(data.total_count);
          setHasSearched(true);
        }
        setPage(pageNum);
        setHasMore(newHasMore);
      } catch (e) {
        setError(e instanceof Error ? e.message : "エラーが発生しました");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [],
  );

  // Auto-search on mount if q is present in URL
  useEffect(() => {
    const initialFilters = paramsToFilters(searchParams);
    setFilters(initialFilters);
    if (initialFilters.q.trim()) {
      fetchResults(initialFilters, 1, false);
    }
  }, [searchParams, fetchResults]);

  const handleSearch = () => {
    if (!filters.q.trim()) return;
    const params = filtersToParams(filters);
    router.replace(`/result?${params.toString()}`);
  };

  const handleSuggestClick = (tag: string) => {
    const newFilters = { ...filters, q: tag };
    setFilters(newFilters);
    const params = filtersToParams(newFilters);
    router.replace(`/result?${params.toString()}`);
  };

  const updateFilter = (key: keyof SearchFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Infinite scroll
  const { ref: loadMoreRef } = useInView({
    threshold: 0,
    onChange: (inView) => {
      if (inView && hasMore && !loadingMore && !loading && hasSearched) {
        fetchResults(filters, page + 1, true);
      }
    },
  });

  return (
    <div className="space-y-15">
      {/* Hero */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-display">
          リポジトリを探す
        </h1>
        <p className="text-sm text-gray-200">
          こんなのないかな？をGithubから検索。日本語キーワードもAIが英語に変換して検索してくれます。
        </p>
      </div>

      <div className="xl:grid xl:grid-cols-3 gap-20">
        <div className="xl:col-span-1 space-y-5 xl:sticky xl:top-20 xl:self-start">
          <SearchCard
            filters={filters}
            onFilterChange={updateFilter}
            onSearch={handleSearch}
            onSuggestClick={handleSuggestClick}
            loading={loading}
          />
        </div>

        {/* Results */}
        <div className="space-y-3 xl:col-span-2">
          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          {loading && (
            <>
              <div className="flex items-center justify-between">
                <div className="h-4 w-32 rounded bg-white/10 animate-pulse" />
              </div>
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </>
          )}

          {!loading && hasSearched && (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-200">
                  {totalCount !== null
                    ? `${totalCount.toLocaleString()}件のリポジトリ`
                    : ""}
                  {totalCount !== null && (
                    <span className="ml-2 text-gray-400">
                      —{" "}
                      {SORT_OPTIONS.find((o) => o.value === filters.sort)
                        ?.label ?? "Best match"}
                    </span>
                  )}
                </p>
              </div>

              {repos.length === 0 && !error && (
                <div className="rounded-xl border border-white/10 bg-white/5 p-10 text-center">
                  <p className="text-gray-400">
                    該当するリポジトリが見つかりませんでした
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    フィルタ条件を緩めて再度お試しください
                  </p>
                </div>
              )}

              {repos.map((repo) => (
                <Link
                  key={repo.id}
                  href={`/repositories/${repo.full_name}`}
                  className="group block rounded-xl border border-white/30 bg-white/5 p-5 backdrop-blur-3xl transition-all hover:border-violet-500/50 hover:shadow-[0_0_30px_5px_rgba(139,92,246,0.15)]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Image
                        src={repo.owner.avatar_url}
                        alt={repo.owner.login}
                        width={28}
                        height={28}
                        className="rounded-full ring-1 ring-border"
                      />
                      <span className="font-semibold text-gray-100 group-hover:text-violet-300 transition-colors">
                        {repo.full_name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-sm font-medium text-amber-400">
                      <Star className="h-3.5 w-3.5" />
                      <span>{formatCount(repo.stargazers_count)}</span>
                    </div>
                  </div>

                  <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-gray-200">
                    {repo.aiDescription || repo.description}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-200">
                    {repo.language && (
                      <span className="flex items-center gap-1.5">
                        <span
                          className="inline-block h-2.5 w-2.5 rounded-full ring-1 ring-black/10"
                          style={{
                            backgroundColor:
                              LANGUAGE_COLORS[repo.language] || "#8b8b8b",
                          }}
                        />
                        {repo.language}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <GitFork className="h-3 w-3" />
                      {formatCount(repo.forks_count)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {formatCount(repo.watchers_count)}
                    </span>
                    <span className="flex items-center gap-1">
                      <CircleDot className="h-3 w-3" />
                      {formatCount(repo.open_issues_count)}
                    </span>
                    {repo.license && (
                      <span className="rounded bg-white/30 px-1.5 py-0.5 font-mono text-[10px] text-gray-200">
                        {repo.license.spdx_id}
                      </span>
                    )}
                    <span className="ml-auto">
                      {formatRelativeDate(repo.updated_at)}に更新
                    </span>
                  </div>

                  {repo.topics && repo.topics.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {repo.topics.slice(0, 5).map((topic) => (
                        <span
                          key={topic}
                          className="rounded-full bg-violet-500/10 px-2.5 py-0.5 text-[11px] font-medium text-violet-300"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}

              {hasMore && repos.length > 0 && (
                <div ref={loadMoreRef} className="space-y-3 pt-2">
                  {loadingMore && (
                    <>
                      <div className="flex justify-center py-4">
                        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                      </div>
                      {Array.from({ length: 3 }).map((_, i) => (
                        <SkeletonCard key={`more-${i}`} />
                      ))}
                    </>
                  )}
                </div>
              )}

              {!hasMore && repos.length > 0 && (
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
