"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SearchFilters } from "@/types/search";
import { DEFAULT_FILTERS } from "@/types/search";
import { SearchCard } from "@/app/components/search-card";

function filtersToParams(filters: SearchFilters): URLSearchParams {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== DEFAULT_FILTERS[key as keyof SearchFilters]) {
      params.set(key, value);
    }
  });
  return params;
}

export default function HomePage() {
  const router = useRouter();
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);

  const handleSearch = () => {
    if (!filters.q.trim()) return;
    const params = filtersToParams(filters);
    router.push(`/result?${params.toString()}`);
  };

  const handleSuggestClick = (tag: string) => {
    const newFilters = { ...filters, q: tag };
    setFilters(newFilters);
    const params = filtersToParams(newFilters);
    router.push(`/result?${params.toString()}`);
  };

  const updateFilter = (key: keyof SearchFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

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

      <SearchCard
        filters={filters}
        onFilterChange={updateFilter}
        onSearch={handleSearch}
        onSuggestClick={handleSuggestClick}
      />
    </div>
  );
}
