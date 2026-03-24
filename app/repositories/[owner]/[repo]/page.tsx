import { Suspense } from "react";
import type { Metadata } from "next";
import {
  Star,
  GitFork,
  Eye,
  CircleDot,
  ExternalLink,
  Globe,
} from "lucide-react";
import { LANGUAGE_COLORS } from "@/lib/language-colors";
import { MAX_WIDTH_TIGHT } from "@/lib/constants";
import { formatCount, formatDate } from "@/lib/format";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getRepository, getLanguages } from "@/server/github";
import { AiSummary } from "./_components/ai-summary";
import { CommitChart } from "./_components/commit-chart";
import { ReadmeViewer } from "./_components/readme-viewer";
import { BackButton } from "./_components/back-button";

export const revalidate = 3600;

type PageParams = { owner: string; repo: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { owner, repo } = await params;
  const fullName = `${owner}/${repo}`;

  try {
    const repoData = await getRepository(owner, repo);
    return {
      title: fullName,
      description:
        repoData.description || `${fullName} の詳細情報・README・コミット活動`,
      openGraph: {
        title: fullName,
        description:
          repoData.description || `${fullName} の詳細情報`,
        images: [repoData.owner.avatar_url],
      },
    };
  } catch {
    return {
      title: fullName,
    };
  }
}

function LanguageBar({ languages }: { languages: Record<string, number> }) {
  const total = Object.values(languages).reduce((a, b) => a + b, 0);
  if (total === 0) return null;
  const entries = Object.entries(languages).map(([lang, bytes]) => ({
    lang,
    bytes,
    percent: ((bytes / total) * 100).toFixed(1),
  }));

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-medium uppercase tracking-wider text-gray-400">
        Languages
      </h3>
      <div className="flex h-2 overflow-hidden rounded-full bg-white/10">
        {entries.map(({ lang, percent }) => (
          <div
            key={lang}
            className="h-full transition-all"
            style={{
              width: `${percent}%`,
              backgroundColor: LANGUAGE_COLORS[lang] || "#8b8b8b",
            }}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-2 text-xs text-gray-400">
        {entries.map(({ lang, percent }) => (
          <span key={lang} className="flex items-center gap-1.5">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full ring-1 ring-white/10"
              style={{
                backgroundColor: LANGUAGE_COLORS[lang] || "#8b8b8b",
              }}
            />
            <span className="font-medium text-gray-200">{lang}</span>
            {percent}%
          </span>
        ))}
      </div>
    </div>
  );
}

function SummarySkeleton() {
  return (
    <div className="rounded-lg border border-violet-500/20 bg-violet-500/5 p-4 animate-pulse">
      <div className="h-4 w-20 rounded bg-white/10 mb-2" />
      <div className="space-y-2">
        <div className="h-3 w-full rounded bg-white/10" />
        <div className="h-3 w-3/4 rounded bg-white/10" />
      </div>
    </div>
  );
}

function ReadmeSkeleton() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl animate-pulse">
      <div className="border-b border-white/10 px-5 py-3">
        <div className="h-4 w-48 rounded bg-white/10" />
      </div>
      <div className="p-5 space-y-3">
        <div className="h-4 w-full rounded bg-white/10" />
        <div className="h-4 w-5/6 rounded bg-white/10" />
        <div className="h-4 w-4/6 rounded bg-white/10" />
        <div className="h-4 w-full rounded bg-white/10" />
        <div className="h-4 w-3/4 rounded bg-white/10" />
      </div>
    </div>
  );
}

function CommitChartSkeleton() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 animate-pulse">
      <div className="h-4 w-32 rounded bg-white/10 mb-4" />
      <div className="h-24 rounded bg-white/10" />
    </div>
  );
}

export default async function DetailPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { owner, repo } = await params;

  let repoData;
  try {
    repoData = await getRepository(owner, repo);
  } catch {
    notFound();
  }
  if (!repoData) notFound();

  const languages = await getLanguages(owner, repo).catch(() => ({}));

  return (
    <div className={`mx-auto space-y-8 ${MAX_WIDTH_TIGHT}`}>
      {/* Back */}
      <BackButton />

      {/* Header Card */}
      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 space-y-5">
        {/* Name */}
        <div className="flex items-center gap-3">
          <Image
            src={repoData.owner.avatar_url}
            alt={repoData.owner.login}
            width={44}
            height={44}
            className="rounded-full ring-2 ring-white/10"
          />
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-100">
              {repoData.full_name}
            </h1>
            <p className="text-xs text-gray-500">
              Created {formatDate(repoData.created_at)}
            </p>
          </div>
        </div>

        {/* AI Summary (Client Component with Suspense) */}
        <Suspense fallback={<SummarySkeleton />}>
          <AiSummary
            fullName={repoData.full_name}
            description={repoData.description}
            topics={repoData.topics || []}
          />
        </Suspense>

        {/* Stats */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-sm font-medium text-amber-400">
            <Star className="h-3.5 w-3.5" />
            {formatCount(repoData.stargazers_count)}
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-sm text-gray-400">
            <GitFork className="h-3.5 w-3.5" />
            {formatCount(repoData.forks_count)}
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-sm text-gray-400">
            <Eye className="h-3.5 w-3.5" />
            {formatCount(repoData.watchers_count)}
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-sm text-gray-400">
            <CircleDot className="h-3.5 w-3.5" />
            {formatCount(repoData.open_issues_count)}
          </div>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
          {repoData.language && (
            <span className="flex items-center gap-1.5">
              <span
                className="inline-block h-3 w-3 rounded-full ring-1 ring-white/10"
                style={{
                  backgroundColor:
                    LANGUAGE_COLORS[repoData.language] || "#8b8b8b",
                }}
              />
              {repoData.language}
            </span>
          )}
          {repoData.license && (
            <span className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs text-gray-400">
              {repoData.license.spdx_id}
            </span>
          )}
        </div>

        {/* Topics */}
        {repoData.topics && repoData.topics.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {repoData.topics.map((topic: string) => (
              <span
                key={topic}
                className="rounded-full bg-violet-500/10 px-2.5 py-0.5 text-xs font-medium text-violet-300"
              >
                {topic}
              </span>
            ))}
          </div>
        )}

        {/* Links */}
        <div className="flex gap-2">
          <a
            href={repoData.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-300 transition-all hover:border-violet-500/30 hover:text-gray-100"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            GitHubで見る
          </a>
          {repoData.homepage && (
            <a
              href={repoData.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-300 transition-all hover:border-violet-500/30 hover:text-gray-100"
            >
              <Globe className="h-3.5 w-3.5" />
              Demo Site
            </a>
          )}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Language Bar */}
        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
          <LanguageBar languages={languages} />
        </div>

        {/* Commit Activity (Client Component with Suspense) */}
        <Suspense fallback={<CommitChartSkeleton />}>
          <CommitChart owner={owner} repo={repo} />
        </Suspense>
      </div>

      {/* README (Client Component with Suspense) */}
      <Suspense fallback={<ReadmeSkeleton />}>
        <ReadmeViewer owner={owner} repo={repo} />
      </Suspense>
    </div>
  );
}
