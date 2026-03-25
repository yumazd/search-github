import { Star, GitFork, Eye, CircleDot } from "lucide-react";
import { LANGUAGE_COLORS } from "@/lib/language-colors";
import { formatCount, formatRelativeDate } from "@/lib/format";
import Image from "next/image";
import Link from "next/link";
import type { Repository } from "@/types/repository";
import { AiDescription } from "./ai-description";

export function RepoCard({ repo }: { repo: Repository }) {
  return (
    <Link
      href={`/repositories/${repo.full_name}`}
      scroll={true}
      aria-label={`リポジトリ: ${repo.full_name}`}
      className="group block rounded-xl border border-white/30 bg-white/5 p-5 space-y-3 backdrop-blur-3xl transition-all hover:border-violet-500/50 hover:shadow-[0_0_30px_5px_rgba(139,92,246,0.15)]"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <Image
            src={repo.owner.avatar_url}
            alt={repo.owner.login}
            width={28}
            height={28}
            className="shrink-0 rounded-full ring-1 ring-border"
          />
          <span className="truncate font-semibold text-gray-100 group-hover:text-violet-300 transition-colors">
            {repo.full_name}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-sm font-medium text-amber-400">
          <Star className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{formatCount(repo.stargazers_count)}</span>
        </div>
      </div>

      {repo.description && (
        <p className="line-clamp-2 text-sm leading-relaxed text-gray-200">
          {repo.description}
        </p>
      )}

      <AiDescription
        fullName={repo.full_name}
        description={repo.description}
        topics={repo.topics || []}
      />

      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-200">
        {repo.language && (
          <span className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="inline-block h-2.5 w-2.5 rounded-full ring-1 ring-black/10"
              style={{
                backgroundColor: LANGUAGE_COLORS[repo.language] || "#8b8b8b",
              }}
            />
            {repo.language}
          </span>
        )}
        <span className="flex items-center gap-1">
          <GitFork className="h-3 w-3" aria-hidden="true" />
          {formatCount(repo.forks_count)}
        </span>
        <span className="flex items-center gap-1">
          <Eye className="h-3 w-3" aria-hidden="true" />
          {formatCount(repo.watchers_count)}
        </span>
        <span className="flex items-center gap-1">
          <CircleDot className="h-3 w-3" aria-hidden="true" />
          {formatCount(repo.open_issues_count)}
        </span>
        {repo.license && (
          <span className="rounded bg-white/30 px-1.5 py-0.5 font-mono text-[10px] text-gray-200">
            {repo.license.spdx_id}
          </span>
        )}
        <span className="ml-auto">
          {formatRelativeDate(repo.updated_at)}更新
        </span>
      </div>

      {repo.topics && repo.topics.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
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
  );
}
