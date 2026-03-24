"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { SearchFilters } from "@/types/search";
import { DEFAULT_FILTERS } from "@/types/search";

const STAR_OPTIONS = [
  { value: "any", label: "なし" },
  { value: "50", label: "50+" },
  { value: "100", label: "100+" },
  { value: "500", label: "500+" },
];

const PUSHED_OPTIONS = [
  { value: "any", label: "いつでも" },
  { value: "1m", label: "1ヶ月以内" },
  { value: "6m", label: "半年以内" },
  { value: "1y", label: "1年以内" },
];

function filtersToParams(filters: SearchFilters): URLSearchParams {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== DEFAULT_FILTERS[key as keyof SearchFilters]) {
      params.set(key, value);
    }
  });
  return params;
}

interface SearchCardProps {
  initialFilters?: SearchFilters;
  loading?: boolean;
}

export function SearchCard({
  initialFilters = DEFAULT_FILTERS,
  loading = false,
}: SearchCardProps) {
  const router = useRouter();
  const currentParams = useSearchParams();
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [searching, setSearching] = useState(false);
  const [sameQueryMessage, setSameQueryMessage] = useState(false);

  // Reset spinner when navigation completes
  useEffect(() => {
    setSearching(false);
  }, [currentParams]);

  const handleSearch = () => {
    if (!filters.q.trim()) return;
    setSameQueryMessage(false);

    const params = filtersToParams(filters);
    if (params.toString() === currentParams.toString()) {
      setSameQueryMessage(true);
      return;
    }

    setSearching(true);
    router.push(`/result?${params.toString()}`);
  };

  const isLoading = loading || searching;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) handleSearch();
  };

  const updateFilter = (key: keyof SearchFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="relative rounded-2xl">
      <div className="absolute inset-0 -z-10 rounded-2xl bg-linear-to-br from-violet-600/40 via-fuchsia-500/30 to-cyan-500/40 blur-xl" />
      <div className="relative rounded-2xl border border-white/30 bg-white/5 p-5 backdrop-blur-2xl space-y-4">
        {/* Search Input */}
        <div className="flex items-stretch gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-200" />
            <Input
              placeholder="React フォーム"
              value={filters.q}
              onChange={(e) => updateFilter("q", e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-11 pl-10 text-sm xl:text-base border-white/30 bg-white/5 text-gray-100 placeholder:text-gray-400"
            />
          </div>
          <Button
            className="h-11 px-6"
            onClick={handleSearch}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "検索"}
          </Button>
        </div>

        {sameQueryMessage && (
          <p className="text-xs text-red-500">
            検索条件が変更されていません。条件を変更して再度検索してください。
          </p>
        )}

        {/* Toggle Rows */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <span className="text-xs font-medium uppercase tracking-wider text-gray-200">
              最低Star数
            </span>
            <div className="flex flex-wrap gap-1.5">
              {STAR_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  variant={filters.stars === option.value ? "default" : "ghost"}
                  size="sm"
                  className="h-8 rounded-full text-xs"
                  onClick={() => updateFilter("stars", option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-medium uppercase tracking-wider text-gray-200">
              更新
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PUSHED_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  variant={
                    filters.pushed === option.value ? "default" : "ghost"
                  }
                  size="sm"
                  className="h-8 rounded-full text-xs"
                  onClick={() => updateFilter("pushed", option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
