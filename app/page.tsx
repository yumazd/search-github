import { Search, Star, GitFork, Eye, CircleDot } from "lucide-react";
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
import { MOCK_REPOSITORIES } from "@/lib/mock-data";
import { LANGUAGE_COLORS } from "@/lib/language-colors";
import Image from "next/image";
import Link from "next/link";

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
  { value: "best", label: "Best match" },
  { value: "stars", label: "Stars順" },
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

export default function SearchPage() {
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
          {/* Filters */}
          <div className="relative rounded-2xl p-[1px]">
            {/* Background glow */}
            <div className="absolute inset-0 -z-10 rounded-2xl bg-linear-to-br from-violet-600/40 via-fuchsia-500/30 to-cyan-500/40 blur-xl" />
            {/* Glass panel */}
            <div className="relative rounded-2xl border border-white/30 bg-white/5 p-6 backdrop-blur-2xl space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-200" />
                  <Input
                    placeholder="React フォーム ライブラリ"
                    className="h-11 pl-10 text-base border-white/30 bg-white/5 text-gray-100 placeholder:text-gray-400"
                  />
                </div>
                <Button className="h-11 px-6">検索</Button>
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
                      variant={option.value === "all" ? "default" : "ghost"}
                      size="sm"
                      className="h-8 rounded-full text-xs"
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
                  <Select>
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
                  <Select>
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
                  <Select>
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
                  <Select>
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
                        variant={option.value === "any" ? "default" : "ghost"}
                        size="sm"
                        className="h-8 rounded-full text-xs"
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
                        variant={option.value === "any" ? "default" : "ghost"}
                        size="sm"
                        className="h-8 rounded-full text-xs"
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
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="space-y-3 xl:col-span-2">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-200">10件のリポジトリ</p>
            <Select defaultValue="best">
              <SelectTrigger className="h-8 w-[160px] border-white/30 bg-white/5 text-sm">
                <SelectValue />
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
          {MOCK_REPOSITORIES.map((repo) => (
            <Link
              key={repo.id}
              href={`/repositories/${repo.full_name}`}
              className="group block rounded-xl border border-white/30 bg-white/5 p-5 backdrop-blur-3xl transition-all hover:border-violet-500/50 hover:shadow-[0_0_30px_5px_rgba(139,92,246,0.15)] "
            >
              {/* Row 1: Avatar + Name + Stars */}
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

              {/* Row 2: Description */}
              <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-gray-200">
                {repo.description}
              </p>

              {/* Row 3: Language, Fork, Watcher, Issues */}
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

              {/* Row 4: Topics */}
              {repo.topics.length > 0 && (
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
        </div>
      </div>
    </div>
  );
}
