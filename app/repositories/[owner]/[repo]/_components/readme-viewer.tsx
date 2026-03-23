"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-white/10 ${className}`} />;
}

export function ReadmeViewer({
  owner,
  repo,
}: {
  owner: string;
  repo: string;
}) {
  const [readme, setReadme] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAndTranslate() {
      try {
        // Fetch raw README from GitHub
        const res = await fetch(
          `/api/github-proxy?path=/repos/${owner}/${repo}/readme&accept=application/vnd.github.raw%2Bjson`,
        );
        if (!res.ok) {
          setReadme("");
          return;
        }
        const rawReadme = await res.text();

        // Translate with AI
        try {
          const translateRes = await fetch("/api/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "readme", readme: rawReadme }),
          });
          if (translateRes.ok) {
            const data = await translateRes.json();
            setReadme(data.translated);
          } else {
            setReadme(rawReadme);
          }
        } catch {
          setReadme(rawReadme);
        }
      } catch {
        setReadme("");
      }
    }
    fetchAndTranslate();
  }, [owner, repo]);

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
      <div className="border-b border-white/10 bg-white/5 px-6 py-3">
        <h3 className="text-sm font-medium text-gray-300">
          README.md（AI日本語翻訳）
        </h3>
      </div>
      <div className="px-6 py-5">
        {readme !== null ? (
          readme ? (
            <div className="prose prose-invert prose-sm max-w-none prose-headings:border-b prose-headings:border-white/10 prose-headings:pb-2 prose-a:text-violet-400 prose-code:text-emerald-300 prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
              >
                {readme}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="text-sm text-gray-500">READMEがありません</p>
          )
        ) : (
          <div className="space-y-3">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
            <Skeleton className="h-20 w-full rounded-lg" />
          </div>
        )}
      </div>
    </div>
  );
}
