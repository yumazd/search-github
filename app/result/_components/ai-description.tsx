"use client";

import { useState, useEffect, useLayoutEffect } from "react";
import { Languages } from "lucide-react";
import { summarizeDescriptionsAction } from "@/server/actions";

// Persistent cache via sessionStorage
const CACHE_KEY = "ai-descriptions";

function getCache(): Record<string, string> {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function setCache(data: Record<string, string>) {
  try {
    const existing = getCache();
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ...existing, ...data }));
  } catch {
    // sessionStorage full or unavailable
  }
}

// Batch queue: collect requests, flush once
let batchQueue: {
  full_name: string;
  description: string | null;
  topics: string[];
  resolve: (summary: string) => void;
}[] = [];
let batchTimer: ReturnType<typeof setTimeout> | null = null;

function requestSummary(
  fullName: string,
  description: string | null,
  topics: string[],
): Promise<string> {
  // Return cached result
  const cache = getCache();
  if (cache[fullName]) return Promise.resolve(cache[fullName]);

  return new Promise((resolve) => {
    batchQueue.push({ full_name: fullName, description, topics, resolve });

    // Flush after a short delay to batch all cards
    if (!batchTimer) {
      batchTimer = setTimeout(async () => {
        const queue = [...batchQueue];
        batchQueue = [];
        batchTimer = null;

        // Filter out already cached items
        const cached = getCache();
        const uncached = queue.filter((q) => !cached[q.full_name]);

        let summaries: Record<string, string> = {};
        if (uncached.length > 0) {
          try {
            summaries = await Promise.race([
              summarizeDescriptionsAction(
                uncached.map((q) => ({
                  full_name: q.full_name,
                  description: q.description,
                  topics: q.topics,
                })),
              ),
              new Promise<Record<string, string>>((_, reject) =>
                setTimeout(() => reject(new Error("timeout")), 10000),
              ),
            ]);
            setCache(summaries);
          } catch {
            // Timeout or API error — resolve all with empty string to hide skeleton
          }
        }

        const all = { ...cached, ...summaries };
        queue.forEach((q) => {
          q.resolve(all[q.full_name] || "");
        });
      }, 100);
    }
  });
}

export function AiDescription({
  fullName,
  description,
  topics,
}: {
  fullName: string;
  description: string | null;
  topics: string[];
}) {
  const [summary, setSummary] = useState<string | null>(null);

  // Read cache before paint to avoid skeleton flash (runs client-only, no hydration mismatch)
  useLayoutEffect(() => {
    const cache = getCache();
    if (cache[fullName]) {
      setSummary(cache[fullName]);
    }
  }, [fullName]);

  useEffect(() => {
    if (summary) return;
    requestSummary(fullName, description, topics).then((result) => {
      setSummary(result);
    });
  }, [fullName, description, topics, summary]);

  if (summary === null) {
    return (
      <div className="flex items-center gap-1.5 animate-pulse">
        <Languages className="h-3 w-3 text-violet-400" aria-hidden="true" />
        <div className="h-3 w-3/4 rounded bg-white/10" />
      </div>
    );
  }

  if (!summary) return null;

  return (
    <div className="flex items-stretch bg-violet-500/30 rounded">
      <div className="px-2 py-1.5 bg-violet-500/50 rounded-s flex flex-nowrap shrink-0 items-center gap-2">
        <Languages
          className="mt-0.5 h-3 w-3 text-violet-40"
          aria-hidden="true"
        />
        <span className="text-sm">AI翻訳</span>
      </div>
      <p className="line-clamp-2 text-sm leading-relaxed text-white px-2 py-1">
        {summary}
      </p>
    </div>
  );
}
