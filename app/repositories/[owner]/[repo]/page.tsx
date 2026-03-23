import {
  Star,
  GitFork,
  Eye,
  CircleDot,
  ArrowLeft,
  ExternalLink,
  Globe,
} from "lucide-react";
import { LANGUAGE_COLORS } from "@/lib/language-colors";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AiSummary } from "./_components/ai-summary";
import { CommitChart } from "./_components/commit-chart";
import { ReadmeViewer } from "./_components/readme-viewer";

function formatCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return String(count);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
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

const GITHUB_HEADERS: Record<string, string> = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  ...(process.env.GITHUB_TOKEN
    ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
    : {}),
};

async function fetchRepo(owner: string, repo: string) {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}`,
    { headers: GITHUB_HEADERS, next: { revalidate: 3600 } },
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub API error ${res.status}`);
  return res.json();
}

async function fetchLanguages(owner: string, repo: string) {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/languages`,
    { headers: GITHUB_HEADERS, next: { revalidate: 3600 } },
  );
  if (!res.ok) return {};
  return res.json();
}


export default async function DetailPage({
  params,
}: {
  params: Promise<{ owner: string; repo: string }>;
}) {
  const { owner, repo } = await params;

  const [repoData, languages] = await Promise.all([
    fetchRepo(owner, repo),
    fetchLanguages(owner, repo),
  ]);

  if (!repoData) notFound();

  return (
    <div className="space-y-8">
      {/* Back Link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-gray-100"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        検索結果に戻る
      </Link>

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

        {/* AI Summary (Client Component) */}
        <AiSummary
          fullName={repoData.full_name}
          description={repoData.description}
          topics={repoData.topics || []}
        />

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

        {/* Commit Activity (Client Component - handles 202 retry) */}
        <CommitChart owner={owner} repo={repo} />
      </div>

      {/* README (Client Component - AI translation) */}
      <ReadmeViewer owner={owner} repo={repo} />
    </div>
  );
}
