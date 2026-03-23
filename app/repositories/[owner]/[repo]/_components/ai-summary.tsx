"use client";

import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-white/10 ${className}`} />;
}

export function AiSummary({
  fullName,
  description,
  topics,
}: {
  fullName: string;
  description: string | null;
  topics: string[];
}) {
  const [summary, setSummary] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSummary() {
      try {
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "summary",
            fullName,
            description,
            topics,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setSummary(data.summary);
        } else {
          setSummary(description || "");
        }
      } catch {
        setSummary(description || "");
      }
    }
    fetchSummary();
  }, [fullName, description, topics]);

  return (
    <div className="rounded-lg border border-violet-500/20 bg-gradient-to-r from-violet-500/10 to-cyan-500/10 p-4">
      <div className="mb-1.5 flex items-center gap-1.5">
        <Sparkles className="h-3.5 w-3.5 text-violet-400" />
        <span className="text-xs font-semibold text-violet-300">AI要約</span>
      </div>
      {summary !== null ? (
        <p className="text-sm leading-relaxed text-gray-300">{summary}</p>
      ) : (
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      )}
    </div>
  );
}
