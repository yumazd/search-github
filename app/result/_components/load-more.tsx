"use client";

import { useState, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { Loader2 } from "lucide-react";
import { type Repository, RESULTS_PER_PAGE } from "@/server/search";
import type { SearchFilters } from "@/types/search";
import { RepoCard } from "./repo-card";

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

interface LoadMoreProps {
  filters: SearchFilters;
  initialHasMore: boolean;
}

export function LoadMore({ filters, initialHasMore }: LoadMoreProps) {
  const [moreRepos, setMoreRepos] = useState<Repository[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialHasMore);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const nextPage = page + 1;
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });
      params.set("page", String(nextPage));

      const res = await fetch(`/api/search?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) return;

      const newHasMore =
        data.items.length === RESULTS_PER_PAGE &&
        nextPage * RESULTS_PER_PAGE < 1000;
      setMoreRepos((prev) => [...prev, ...data.items]);
      setPage(nextPage);
      setHasMore(newHasMore);
    } catch {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [filters, page, loading, hasMore]);

  const { ref } = useInView({
    threshold: 0,
    onChange: (inView) => {
      if (inView) loadMore();
    },
  });

  return (
    <>
      {moreRepos.map((repo) => (
        <RepoCard key={repo.id} repo={repo} />
      ))}

      {hasMore && (
        <div ref={ref} className="space-y-3 pt-2">
          {loading && (
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

      {!hasMore && moreRepos.length > 0 && (
        <p className="py-4 text-center text-sm text-gray-500">
          すべての結果を表示しました
        </p>
      )}
    </>
  );
}
