import {
  Star,
  GitFork,
  Eye,
  CircleDot,
  ArrowLeft,
  ExternalLink,
  Globe,
  Sparkles,
} from "lucide-react";
import { MOCK_DETAIL } from "@/lib/mock-data";
import { LANGUAGE_COLORS } from "@/lib/language-colors";
import Image from "next/image";
import Link from "next/link";

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

function LanguageBar({
  languages,
}: {
  languages: Record<string, number>;
}) {
  const total = Object.values(languages).reduce((a, b) => a + b, 0);
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
      <div className="flex flex-wrap gap-4 text-xs text-gray-400">
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

function CommitChart({ data }: { data: number[] }) {
  const max = Math.max(...data);
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-medium uppercase tracking-wider text-gray-400">
        Commit Activity (past year)
      </h3>
      <div className="flex items-end gap-[2px] h-24 rounded-lg bg-white/5 p-3">
        {data.map((value, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm bg-emerald-500/70 transition-colors hover:bg-emerald-400"
            style={{
              height: `${(value / max) * 100}%`,
              minHeight: value > 0 ? "2px" : "0px",
            }}
            title={`Week ${i + 1}: ${value} commits`}
          />
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-gray-500">
        <span>1年前</span>
        <span>9ヶ月前</span>
        <span>6ヶ月前</span>
        <span>3ヶ月前</span>
        <span>現在</span>
      </div>
    </div>
  );
}

function ReadmeViewer({ content }: { content: string }) {
  const lines = content.split("\n");
  const rendered = lines.map((line, i) => {
    if (line.startsWith("# ")) {
      return (
        <h1 key={i} className="mt-8 mb-3 text-2xl font-bold text-gray-100 border-b border-white/10 pb-2">
          {line.slice(2)}
        </h1>
      );
    }
    if (line.startsWith("## ")) {
      return (
        <h2 key={i} className="mt-6 mb-2 text-lg font-semibold text-gray-200 border-b border-white/10 pb-1.5">
          {line.slice(3)}
        </h2>
      );
    }
    if (line.startsWith("### ")) {
      return (
        <h3 key={i} className="mt-5 mb-1.5 text-base font-medium text-gray-200">
          {line.slice(4)}
        </h3>
      );
    }
    if (line.startsWith("```")) {
      return null;
    }
    if (line.startsWith("- ")) {
      return (
        <li key={i} className="ml-5 list-disc text-sm leading-7 text-gray-400">
          {line.slice(2)}
        </li>
      );
    }
    if (line.startsWith("|")) {
      return (
        <p key={i} className="font-mono text-xs leading-6 text-gray-400">
          {line}
        </p>
      );
    }
    if (line.trim() === "") {
      return <div key={i} className="h-2" />;
    }
    return (
      <p key={i} className="text-sm leading-7 text-gray-400">
        {line}
      </p>
    );
  });

  return <div>{rendered}</div>;
}

export default function DetailPage() {
  const repo = MOCK_DETAIL;

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
            src={repo.owner.avatar_url}
            alt={repo.owner.login}
            width={44}
            height={44}
            className="rounded-full ring-2 ring-white/10"
          />
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-100">{repo.full_name}</h1>
            <p className="text-xs text-gray-500">Created {formatDate(repo.created_at)}</p>
          </div>
        </div>

        {/* AI Summary */}
        <div className="rounded-lg border border-violet-500/20 bg-gradient-to-r from-violet-500/10 to-cyan-500/10 p-4">
          <div className="mb-1.5 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-violet-400" />
            <span className="text-xs font-semibold text-violet-300">
              AI要約
            </span>
          </div>
          <p className="text-sm leading-relaxed text-gray-300">
            {repo.description}
          </p>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-sm font-medium text-amber-400">
            <Star className="h-3.5 w-3.5" />
            {formatCount(repo.stargazers_count)}
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-sm text-gray-400">
            <GitFork className="h-3.5 w-3.5" />
            {formatCount(repo.forks_count)}
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-sm text-gray-400">
            <Eye className="h-3.5 w-3.5" />
            {formatCount(repo.watchers_count)}
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-sm text-gray-400">
            <CircleDot className="h-3.5 w-3.5" />
            {formatCount(repo.open_issues_count)}
          </div>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
          {repo.language && (
            <span className="flex items-center gap-1.5">
              <span
                className="inline-block h-3 w-3 rounded-full ring-1 ring-white/10"
                style={{
                  backgroundColor:
                    LANGUAGE_COLORS[repo.language] || "#8b8b8b",
                }}
              />
              {repo.language}
            </span>
          )}
          {repo.license && (
            <span className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs text-gray-400">
              {repo.license.spdx_id}
            </span>
          )}
        </div>

        {/* Topics */}
        <div className="flex flex-wrap gap-1.5">
          {repo.topics.map((topic) => (
            <span
              key={topic}
              className="rounded-full bg-violet-500/10 px-2.5 py-0.5 text-xs font-medium text-violet-300"
            >
              {topic}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex gap-2">
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-300 transition-all hover:border-violet-500/30 hover:text-gray-100"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            GitHubで見る
          </a>
          {repo.homepage && (
            <a
              href={repo.homepage}
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

      {/* Language Bar */}
      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
        <LanguageBar languages={repo.languages} />
      </div>

      {/* Commit Activity */}
      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
        <CommitChart data={repo.commitActivity} />
      </div>

      {/* README */}
      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
        <div className="border-b border-white/10 bg-white/5 px-6 py-3">
          <h3 className="text-sm font-medium text-gray-300">README.md（AI日本語翻訳）</h3>
        </div>
        <div className="px-6 py-5">
          <ReadmeViewer content={repo.readme} />
        </div>
      </div>
    </div>
  );
}
