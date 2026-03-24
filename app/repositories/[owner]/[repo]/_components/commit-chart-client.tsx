"use client";

import { useState, useEffect } from "react";
import { fetchCommitActivityAction } from "@/server/actions";

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

export function CommitChartClient({
  initialData,
  owner,
  repo,
}: {
  initialData: number[] | null;
  owner?: string;
  repo?: string;
}) {
  const [data, setData] = useState<number[] | null>(initialData);
  const [error, setError] = useState(false);

  // Client-side retry when server failed
  useEffect(() => {
    if (initialData !== null || !owner || !repo) return;

    let cancelled = false;

    async function retryFetch() {
      for (let i = 0; i < 3; i++) {
        const result = await fetchCommitActivityAction(owner!, repo!);
        if (cancelled) return;
        if (result.length > 0) {
          setData(result);
          return;
        }
        // Still empty (202), wait before retry
        await new Promise((r) => setTimeout(r, 1700));
      }
      if (!cancelled) setError(true);
    }

    retryFetch();
    return () => { cancelled = true; };
  }, [initialData, owner, repo]);

  if (error) {
    return (
      <p className="text-xs text-gray-500">
        コミットデータの取得に失敗しました
      </p>
    );
  }

  if (data === null) {
    return (
      <div className="space-y-3 animate-pulse">
        <div className="h-3 w-40 rounded bg-white/10" />
        <div className="h-24 w-full rounded-lg bg-white/10" />
      </div>
    );
  }

  if (data.length === 0) return null;

  return <Chart data={data} />;
}
