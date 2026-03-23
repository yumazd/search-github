"use client";

import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SearchFilters } from "@/types/search";

const TYPE_OPTIONS = [
  { value: "all", label: "全て" },
  { value: "library", label: "ライブラリ" },
  { value: "template", label: "テンプレート" },
  { value: "example", label: "サンプル" },
  { value: "boilerplate", label: "ボイラープレート" },
];

const LANGUAGE_OPTIONS = [
  "TypeScript",
  "JavaScript",
  "Python",
  "Go",
  "Rust",
  "Java",
  "Ruby",
  "Swift",
  "PHP",
  "C++",
];

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

const SORT_OPTIONS = [
  { value: "best", label: "関連度順" },
  { value: "stars", label: "Star数順" },
  { value: "updated", label: "更新日順" },
  { value: "forks", label: "Fork数順" },
];

const SIZE_OPTIONS = [
  { value: "any", label: "指定なし" },
  { value: "small", label: "小（<1MB）" },
  { value: "medium", label: "中（1-10MB）" },
  { value: "large", label: "大（10MB+）" },
];

const LICENSE_OPTIONS = [
  { value: "any", label: "指定なし" },
  { value: "mit", label: "MIT" },
  { value: "apache-2.0", label: "Apache-2.0" },
  { value: "gpl-3.0", label: "GPL-3.0" },
  { value: "bsd-2-clause", label: "BSD-2-Clause" },
  { value: "bsd-3-clause", label: "BSD-3-Clause" },
];

const SUGGEST_TAGS = [
  "machine-learning",
  "react-component",
  "cli-tool",
  "api",
  "docker",
  "testing",
  "database",
  "authentication",
];

export { SORT_OPTIONS };

interface SearchCardProps {
  filters: SearchFilters;
  onFilterChange: (key: keyof SearchFilters, value: string) => void;
  onSearch: () => void;
  onSuggestClick: (tag: string) => void;
  loading?: boolean;
}

export function SearchCard({
  filters,
  onFilterChange,
  onSearch,
  onSuggestClick,
  loading = false,
}: SearchCardProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") onSearch();
  };

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="relative rounded-2xl p-[1px]">
        <div className="absolute inset-0 -z-10 rounded-2xl bg-linear-to-br from-violet-600/40 via-fuchsia-500/30 to-cyan-500/40 blur-xl" />
        <div className="relative rounded-2xl border border-white/30 bg-white/5 p-6 backdrop-blur-2xl space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-200" />
              <Input
                placeholder="React フォーム ライブラリ"
                value={filters.q}
                onChange={(e) => onFilterChange("q", e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-11 pl-10 text-base border-white/30 bg-white/5 text-gray-100 placeholder:text-gray-400"
              />
            </div>
            <Button
              className="h-11 px-6"
              onClick={onSearch}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "検索"
              )}
            </Button>
          </div>

          {/* Type Toggle */}
          <div className="space-y-2">
            <span className="text-xs font-medium uppercase tracking-wider text-gray-200">
              種類
            </span>
            <div className="flex flex-wrap gap-1.5">
              {TYPE_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  variant={
                    filters.type === option.value ? "default" : "ghost"
                  }
                  size="sm"
                  className="h-8 rounded-full text-xs"
                  onClick={() => onFilterChange("type", option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Selects Row */}
          <div className="flex justify-between flex-wrap">
            <div className="space-y-1.5">
              <span className="text-xs font-medium uppercase tracking-wider text-gray-200">
                言語
              </span>
              <Select
                value={filters.lang}
                onValueChange={(v) => v && onFilterChange("lang", v)}
              >
                <SelectTrigger className="h-9 border-white/30 bg-white/5">
                  <SelectValue placeholder="全て" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全て</SelectItem>
                  {LANGUAGE_OPTIONS.map((lang) => (
                    <SelectItem key={lang} value={lang.toLowerCase()}>
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-medium uppercase tracking-wider text-gray-200">
                並び替え
              </span>
              <Select
                value={filters.sort}
                onValueChange={(v) => v && onFilterChange("sort", v)}
              >
                <SelectTrigger className="h-9 border-white/30 bg-white/5">
                  <SelectValue placeholder="Best match" />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-medium uppercase tracking-wider text-gray-200">
                ライセンス
              </span>
              <Select
                value={filters.license}
                onValueChange={(v) => v && onFilterChange("license", v)}
              >
                <SelectTrigger className="h-9 border-white/30 bg-white/5">
                  <SelectValue placeholder="指定なし" />
                </SelectTrigger>
                <SelectContent>
                  {LICENSE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-medium uppercase tracking-wider text-gray-200">
                サイズ
              </span>
              <Select
                value={filters.size}
                onValueChange={(v) => v && onFilterChange("size", v)}
              >
                <SelectTrigger className="h-9 border-white/30 bg-white/5">
                  <SelectValue placeholder="指定なし" />
                </SelectTrigger>
                <SelectContent>
                  {SIZE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

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
                    variant={
                      filters.stars === option.value ? "default" : "ghost"
                    }
                    size="sm"
                    className="h-8 rounded-full text-xs"
                    onClick={() => onFilterChange("stars", option.value)}
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
                    onClick={() => onFilterChange("pushed", option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {SUGGEST_TAGS.map((tag) => (
          <Badge
            key={tag}
            variant="outline"
            className="cursor-pointer border-white/50 text-xs font-normal text-gray-200 transition-all hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-white hover:shadow-[0_0_15px_-3px_rgba(139,92,246,0.3)]"
            onClick={() => onSuggestClick(tag)}
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
}
