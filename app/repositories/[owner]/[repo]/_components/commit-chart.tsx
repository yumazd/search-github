"use client";

import { useState, useEffect } from "react";

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-white/10 ${className}`} />;
}

export function CommitChart({
  owner,
  repo,
}: {
  owner: string;
  repo: string;
}) {
  const [data, setData] = useState<number[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchWithRetry(retries = 3) {
      for (let i = 0; i < retries; i++) {
        try {
          const res = await fetch(
            `/api/github-proxy?path=/repos/${owner}/${repo}/stats/commit_activity`,
          );
          if (res.status === 202) {
            // GitHub is computing stats, wait and retry
            await new Promise((r) => setTimeout(r, 2000));
            continue;
          }
          if (!res.ok) break;
          const json = await res.json();
          if (Array.isArray(json) && !cancelled) {
            setData(json.map((week: { total: number }) => week.total));
            return;
          }
        } catch {
          break;
        }
      }
      if (!cancelled) setData([]);
    }

    fetchWithRetry();
    return () => {
      cancelled = true;
    };
  }, [owner, repo]);

  if (data !== null && data.length === 0) return null;

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
      {data ? (
        <Chart data={data} />
      ) : (
        <div className="space-y-3">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
      )}
    </div>
  );
}

function Chart({ data }: { data: number[] }) {
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
              height: `${max > 0 ? (value / max) * 100 : 0}%`,
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
